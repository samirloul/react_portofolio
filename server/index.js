import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { Resend } from "resend";
import helmet from "helmet";
import crypto from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

dotenv.config();

function getEmailCopy(lang) {
  const L = normalizeLang(lang);

  if (L === "nl") {
    return {
      greeting: "Hoi",
      confirmTitle: "Bedankt voor je bericht",
      confirmText:
        "Ik heb je bericht goed ontvangen. Meestal reageer ik binnen 24 uur.",
      adminTitle: "Nieuw bericht via je portfolio",
      adminIntro: "Je hebt een nieuw contactformulier ontvangen.",
      name: "Naam",
      email: "E-mail",
      subject: "Onderwerp",
      message: "Bericht",
      socialsTitle: "Volg mij online",
      footer: "Met vriendelijke groet",
    };
  }

  if (L === "ar") {
    return {
      greeting: "مرحبًا",
      confirmTitle: "شكرًا على رسالتك",
      confirmText: "لقد استلمت رسالتك بنجاح. عادةً أرد خلال 24 ساعة.",
      adminTitle: "رسالة جديدة عبر موقعك الشخصي",
      adminIntro: "لقد وصلك نموذج تواصل جديد.",
      name: "الاسم",
      email: "البريد الإلكتروني",
      subject: "الموضوع",
      message: "الرسالة",
      socialsTitle: "تابعني على المنصات",
      footer: "مع التحية",
    };
  }

  return {
    greeting: "Hi",
    confirmTitle: "Thanks for your message",
    confirmText: "I received your message successfully. I usually reply within 24 hours.",
    adminTitle: "New message via your portfolio",
    adminIntro: "You received a new contact form submission.",
    name: "Name",
    email: "Email",
    subject: "Subject",
    message: "Message",
    socialsTitle: "Follow me online",
    footer: "Best regards",
  };
}

function renderSocialButtons() {
  return SOCIALS.map(
    (item) => `
      <a
        href="${item.href}"
        style="
          display:inline-block;
          margin:6px 8px 0 0;
          padding:10px 14px;
          border-radius:999px;
          text-decoration:none;
          font-size:13px;
          font-weight:700;
          color:${item.label === "Snapchat" ? "#111" : "#fff"};
          background:${item.color};
        "
        target="_blank"
      >
        ${escapeHtml(item.label)}
      </a>
    `
  ).join("");
}

function noReplyFooterCopy(lang) {
  const L = normalizeLang(lang);
  if (L === "nl") return {
    noReply: "Dit is een automatisch verzonden e-mail. <strong>Reageer niet op dit bericht</strong> — dit e-mailadres ontvangt geen berichten.",
    contact: 'Wil je contact opnemen? Ga naar <a href="https://samirprofile.com/contact" style="color:#4f46e5;text-decoration:none;font-weight:600;">samirprofile.com/contact</a> en stuur je bericht via het contactformulier.',
    footer: "Met vriendelijke groet",
  };
  if (L === "ar") return {
    noReply: "هذا بريد إلكتروني تلقائي. <strong>لا تردّ على هذه الرسالة</strong> — هذا العنوان لا يستقبل الردود.",
    contact: 'هل تريد التواصل؟ زر <a href="https://samirprofile.com/contact" style="color:#4f46e5;text-decoration:none;font-weight:600;">samirprofile.com/contact</a> وأرسل رسالتك عبر نموذج الاتصال.',
    footer: "مع التحية",
  };
  return {
    noReply: "This is an automated email. <strong>Do not reply to this message</strong> — this address does not receive replies.",
    contact: 'Want to get in touch? Visit <a href="https://samirprofile.com/contact" style="color:#4f46e5;text-decoration:none;font-weight:600;">samirprofile.com/contact</a> and send your message via the contact form.',
    footer: "Best regards",
  };
}

function emailLayout({
  lang = "en",
  title,
  intro,
  contentHtml,
  showSocials = true,
  showNoReply = true,
}) {
  const L = normalizeLang(lang);
  const copy = getEmailCopy(L);
  const nrCopy = noReplyFooterCopy(L);
  const isRTL = L === "ar";

  return `<!DOCTYPE html>
<html lang="${L}" dir="${isRTL ? "rtl" : "ltr"}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${escapeHtml(title)}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
  @media only screen and (max-width:600px){
    .email-wrapper{padding:16px 8px !important;}
    .email-card{border-radius:16px !important;}
    .email-header{padding:22px 18px !important;}
    .email-body{padding:22px 18px !important;}
    .email-footer{padding:16px 18px !important;}
    .header-avatar{width:44px !important;height:44px !important;}
    .header-title{font-size:19px !important;}
    .social-btn{padding:8px 11px !important;font-size:12px !important;margin:4px 5px 0 0 !important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#f0f4fb;-webkit-text-size-adjust:100%;mso-line-height-rule:exactly;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f0f4fb;">
  <tr>
    <td class="email-wrapper" align="center" style="padding:32px 16px;">
      <table role="presentation" class="email-card" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(15,23,42,.10);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#111827;direction:${isRTL ? "rtl" : "ltr"};text-align:${isRTL ? "right" : "left"};">

        <!-- HEADER -->
        <tr>
          <td class="email-header" style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:28px 28px;color:#ffffff;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="vertical-align:middle;width:60px;padding-${isRTL ? "left" : "right"}:16px;">
                  <img class="header-avatar" src="${PROFILE_IMAGE_URL}" alt="Samir Loul" width="52" height="52"
                    style="display:block;width:52px;height:52px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,.4);" />
                </td>
                <td style="vertical-align:middle;">
                  <div style="font-size:12px;opacity:.85;margin-bottom:5px;letter-spacing:.5px;text-transform:uppercase;">Samir Loul</div>
                  <div class="header-title" style="font-size:22px;font-weight:800;line-height:1.3;color:#ffffff;">${escapeHtml(title)}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td class="email-body" style="padding:28px 28px;">
            <p style="margin:0 0 20px;color:#4b5563;font-size:15px;line-height:1.8;">
              ${escapeHtml(intro)}
            </p>
            ${contentHtml}
            ${showSocials ? `
            <div style="margin-top:28px;padding:18px 20px;border-radius:16px;background:#f8fafc;border:1px solid #e5e7eb;">
              <div style="font-size:13px;font-weight:700;margin-bottom:12px;color:#374151;text-transform:uppercase;letter-spacing:.4px;">${escapeHtml(copy.socialsTitle)}</div>
              ${renderSocialButtons()}
            </div>` : ""}
          </td>
        </tr>

        ${showNoReply ? `
        <!-- NO-REPLY NOTICE -->
        <tr>
          <td style="padding:0 28px 4px;">
            <div style="padding:14px 16px;background:#fef9ec;border:1px solid #fde68a;border-radius:12px;font-size:13px;color:#92400e;line-height:1.6;">
              ⚠️ ${nrCopy.noReply}<br>
              <span style="margin-top:4px;display:inline-block;">${nrCopy.contact}</span>
            </div>
          </td>
        </tr>` : ""}

        <!-- FOOTER -->
        <tr>
          <td class="email-footer" style="padding:20px 28px 24px;border-top:1px solid #f1f5f9;background:#fcfcfd;color:#6b7280;font-size:13px;line-height:1.7;">
            ${escapeHtml(nrCopy.footer)},<br>
            <strong style="color:#111827;font-size:14px;">Samir Loul</strong><br>
            <a href="https://samirprofile.com" style="color:#4f46e5;text-decoration:none;">samirprofile.com</a>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}
const app = express();
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});
const resend = new Resend(process.env.RESEND_API_KEY);

/** =========================
 * Config
 * ========================= */
const PORT = process.env.PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "data");
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "subscribers.json");
const FEEDBACK_FILE = path.join(DATA_DIR, "feedback.json");
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const DATABASE_URL = process.env.DATABASE_URL || "";
const APP_BASE_URL = (process.env.APP_BASE_URL || "https://samirprofile.com").replace(/\/+$/, "");
const PG_SSL = String(process.env.PG_SSL || "true").toLowerCase() !== "false";

let db = null;

const TO_EMAIL = process.env.TO_EMAIL || "sameerloul2010@gmail.com";
const FROM_EMAIL =
  process.env.FROM_EMAIL || "Samir Loul <no-reply@samirprofile.com>";
const RAW_ALLOWED_ORIGINS = process.env.CORS_ORIGIN || "*";
const ALLOWED_ORIGINS = RAW_ALLOWED_ORIGINS
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

console.log("ENV check:");
console.log("- RESEND_API_KEY set?", !!process.env.RESEND_API_KEY);
console.log("- RECAPTCHA_SECRET_KEY set?", !!RECAPTCHA_SECRET_KEY);
console.log("- TO_EMAIL:", TO_EMAIL);
console.log("- FROM_EMAIL:", FROM_EMAIL);
console.log("- CORS_ORIGIN(raw):", RAW_ALLOWED_ORIGINS);
console.log("- CORS_ORIGIN(parsed):", ALLOWED_ORIGINS);
console.log("- ADMIN_TOKEN set?", !!ADMIN_TOKEN);
console.log("- DATABASE_URL set?", !!DATABASE_URL);
console.log("- APP_BASE_URL:", APP_BASE_URL);

/** =========================
 * Middleware
 * ========================= */
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (ALLOWED_ORIGINS.includes("*")) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = String(origin).replace(/\/+$/, "");
      if (ALLOWED_ORIGINS.includes(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Admin-Token"],
  })
);
const PROFILE_IMAGE_URL = "https://samirprofile.com/samir.jpg";
const SOCIALS = [
  { label: "X", href: "https://x.com/samirloul", color: "#111111" },
  { label: "Instagram", href: "https://www.instagram.com/samirloul/", color: "#E1306C" },
  { label: "TikTok", href: "https://www.tiktok.com/@samirloul1", color: "#111111" },
  {
    label: "Snapchat",
    href: "https://www.snapchat.com/@samir631s?invite_id=IGIAfg18&locale=nl_NL&share_id=UlqVPeOXRemffu3e4daVWg&sid=a9060b8fe1be4d028dfc489f2633a308",
    color: "#FFFC00",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/people/Samir-Loul/pfbid0229Fmoew6U5a5a5CKW5ctUqiL3dXeo3RKj9rsM5kWhAodTzeHpE6tUUQrGBeyHUA2l/",
    color: "#1877F2",
  },
  { label: "Threads", href: "https://www.threads.com/@samirloul", color: "#000000" },
];
app.use(express.json({ limit: "200kb" }));

app.use(
  "/api/contact",
  rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      ok: false,
      error: "Too many requests. Please try again in a minute.",
    },
  })
);

app.use(
  "/api/project-request",
  rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      ok: false,
      error: "Too many requests. Please try again in a minute.",
    },
  })
);

app.use(
  "/api/newsletter",
  rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      ok: false,
      error: "Too many requests. Please try again in a minute.",
    },
  })
);

app.use(
  "/api/feedback",
  rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      ok: false,
      error: "Too many requests. Please try again in a minute.",
    },
  })
);

app.use(
  "/api/admin",
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      ok: false,
      error: "Too many requests. Please try again in a minute.",
    },
  })
);

/** =========================
 * Helpers
 * ========================= */
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(email = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function clampLen(value = "", max = 2000) {
  const str = String(value);
  return str.length > max ? str.slice(0, max) : str;
}

function normalizeLang(lang) {
  const l = String(lang || "").toLowerCase();
  if (l === "ar") return "ar";
  if (l === "nl") return "nl";
  return "en";
}

async function ensureDataFiles() {
  await mkdir(DATA_DIR, { recursive: true });

  const filesToInit = [
    { filePath: SUBSCRIBERS_FILE, initial: [] },
    { filePath: FEEDBACK_FILE, initial: [] },
  ];

  for (const file of filesToInit) {
    try {
      await readFile(file.filePath, "utf8");
    } catch {
      await writeFile(file.filePath, JSON.stringify(file.initial, null, 2), "utf8");
    }
  }
}

async function initDatabase() {
  if (!DATABASE_URL) return false;

  const { Pool } = pg;
  db = new Pool({
    connectionString: DATABASE_URL,
    ssl: PG_SSL ? { rejectUnauthorized: false } : false,
  });

  await db.query(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id BIGSERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      lang VARCHAR(8) NOT NULL DEFAULT 'en',
      unsubscribe_token TEXT NOT NULL UNIQUE,
      subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS feedback_items (
      id BIGSERIAL PRIMARY KEY,
      rating SMALLINT NOT NULL,
      message TEXT NOT NULL,
      lang VARCHAR(8) NOT NULL DEFAULT 'en',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  return true;
}

async function readJsonArray(filePath) {
  try {
    const raw = await readFile(filePath, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeJsonArray(filePath, data) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

function generateUnsubscribeToken() {
  return crypto.randomBytes(24).toString("hex");
}

function toSafeInt(value, fallback = 1) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.trunc(n);
}

function normalizeSearch(search) {
  return clampLen(String(search || "").trim(), 120);
}

async function addSubscriber(email, lang) {
  if (db) {
    const token = generateUnsubscribeToken();
    await db.query(
      `
        INSERT INTO subscribers (email, lang, unsubscribe_token, subscribed_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        ON CONFLICT (email)
        DO UPDATE SET lang = EXCLUDED.lang, updated_at = NOW()
      `,
      [email, lang, token]
    );

    const count = await db.query("SELECT COUNT(*)::int AS total FROM subscribers");
    return { total: count.rows?.[0]?.total || 0 };
  }

  const current = await readJsonArray(SUBSCRIBERS_FILE);
  const existing = current.find((item) => item.email === email);

  if (existing) {
    existing.lang = lang;
    existing.updatedAt = new Date().toISOString();
  } else {
    const unsubscribeToken = generateUnsubscribeToken();
    current.push({
      email,
      lang,
      unsubscribeToken,
      subscribedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  await writeJsonArray(SUBSCRIBERS_FILE, current);
  return { total: current.length };
}

async function addFeedback({ rating, message, lang }) {
  if (db) {
    await db.query(
      `
        INSERT INTO feedback_items (rating, message, lang, created_at)
        VALUES ($1, $2, $3, NOW())
      `,
      [rating, message, lang]
    );

    const count = await db.query("SELECT COUNT(*)::int AS total FROM feedback_items");
    return { total: count.rows?.[0]?.total || 0 };
  }

  const current = await readJsonArray(FEEDBACK_FILE);
  current.push({
    rating,
    message,
    lang,
    createdAt: new Date().toISOString(),
  });
  await writeJsonArray(FEEDBACK_FILE, current);
  return { total: current.length };
}

async function getSubscribers({ page = 1, pageSize = 20, search = "" } = {}) {
  const safePageSize = Math.min(Math.max(toSafeInt(pageSize, 20), 1), 100);
  const safePage = Math.max(toSafeInt(page, 1), 1);
  const safeSearch = normalizeSearch(search);
  const offset = (safePage - 1) * safePageSize;

  if (db) {
    const where = safeSearch ? "WHERE email ILIKE $1" : "";
    const params = safeSearch ? [`%${safeSearch}%`] : [];

    const countQ = await db.query(
      `SELECT COUNT(*)::int AS total FROM subscribers ${where}`,
      params
    );

    const listQ = await db.query(
      `
        SELECT email, lang, subscribed_at AS "subscribedAt", updated_at AS "updatedAt"
        FROM subscribers
        ${where}
        ORDER BY subscribed_at DESC
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `,
      [...params, safePageSize, offset]
    );

    return {
      items: listQ.rows,
      total: countQ.rows?.[0]?.total || 0,
      page: safePage,
      pageSize: safePageSize,
      search: safeSearch,
    };
  }

  const all = await readJsonArray(SUBSCRIBERS_FILE);
  const filtered = safeSearch
    ? all.filter((item) => String(item.email || "").toLowerCase().includes(safeSearch.toLowerCase()))
    : all;

  const sorted = [...filtered].reverse();
  const items = sorted.slice(offset, offset + safePageSize).map((item) => ({
    email: item.email,
    lang: item.lang,
    subscribedAt: item.subscribedAt || item.updatedAt,
    updatedAt: item.updatedAt,
  }));

  return {
    items,
    total: filtered.length,
    page: safePage,
    pageSize: safePageSize,
    search: safeSearch,
  };
}

async function getFeedback({ page = 1, pageSize = 20, search = "" } = {}) {
  const safePageSize = Math.min(Math.max(toSafeInt(pageSize, 20), 1), 100);
  const safePage = Math.max(toSafeInt(page, 1), 1);
  const safeSearch = normalizeSearch(search);
  const offset = (safePage - 1) * safePageSize;

  if (db) {
    const where = safeSearch ? "WHERE message ILIKE $1" : "";
    const params = safeSearch ? [`%${safeSearch}%`] : [];

    const countQ = await db.query(
      `SELECT COUNT(*)::int AS total FROM feedback_items ${where}`,
      params
    );

    const listQ = await db.query(
      `
        SELECT rating, message, lang, created_at AS "createdAt"
        FROM feedback_items
        ${where}
        ORDER BY created_at DESC
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `,
      [...params, safePageSize, offset]
    );

    return {
      items: listQ.rows,
      total: countQ.rows?.[0]?.total || 0,
      page: safePage,
      pageSize: safePageSize,
      search: safeSearch,
    };
  }

  const all = await readJsonArray(FEEDBACK_FILE);
  const filtered = safeSearch
    ? all.filter((item) => String(item.message || "").toLowerCase().includes(safeSearch.toLowerCase()))
    : all;
  const sorted = [...filtered].reverse();
  const items = sorted.slice(offset, offset + safePageSize);

  return {
    items,
    total: filtered.length,
    page: safePage,
    pageSize: safePageSize,
    search: safeSearch,
  };
}

async function getSubscriberCount() {
  if (db) {
    const result = await db.query("SELECT COUNT(*)::int AS total FROM subscribers");
    return result.rows?.[0]?.total || 0;
  }
  const all = await readJsonArray(SUBSCRIBERS_FILE);
  return all.length;
}

async function unsubscribeByToken(token) {
  const cleanToken = clampLen(String(token || "").trim(), 120);
  if (!cleanToken) return false;

  if (db) {
    const result = await db.query(
      "DELETE FROM subscribers WHERE unsubscribe_token = $1 RETURNING id",
      [cleanToken]
    );
    return (result.rowCount || 0) > 0;
  }

  const all = await readJsonArray(SUBSCRIBERS_FILE);
  const before = all.length;
  const next = all.filter((item) => String(item.unsubscribeToken || "") !== cleanToken);
  if (next.length === before) return false;
  await writeJsonArray(SUBSCRIBERS_FILE, next);
  return true;
}

async function getAllSubscriberEmailsWithTokens() {
  if (db) {
    const result = await db.query(
      `
        SELECT email, unsubscribe_token AS "unsubscribeToken"
        FROM subscribers
        ORDER BY subscribed_at DESC
      `
    );
    return result.rows || [];
  }

  const all = await readJsonArray(SUBSCRIBERS_FILE);
  return all
    .map((item) => ({
      email: String(item.email || "").trim().toLowerCase(),
      unsubscribeToken: item.unsubscribeToken || "",
    }))
    .filter((item) => item.email);
}

function getAdminToken(req) {
  const bearer = req.headers.authorization || "";
  const bearerToken = bearer.startsWith("Bearer ") ? bearer.slice(7).trim() : "";
  const headerToken = String(req.headers["x-admin-token"] || "").trim();
  return headerToken || bearerToken;
}

function requireAdmin(req, res, next) {
  if (!ADMIN_TOKEN) {
    return res.status(500).json({ ok: false, error: "Missing ADMIN_TOKEN on server" });
  }

  const token = getAdminToken(req);
  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  return next();
}

async function verifyRecaptcha(token, remoteip) {
  if (!RECAPTCHA_SECRET_KEY) {
    return { ok: false, error: "Missing RECAPTCHA_SECRET_KEY" };
  }

  if (!token) {
    return { ok: false, error: "Missing recaptcha token" };
  }

  const params = new URLSearchParams();
  params.append("secret", RECAPTCHA_SECRET_KEY);
  params.append("response", token);

  if (remoteip) {
    params.append("remoteip", remoteip);
  }

  const resp = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await resp.json();
  console.log("captcha result:", data);

  return {
    ok: !!data.success,
    data,
  };
}

/** =========================
 * Email templates
 * ========================= */
function adminEmailHTML({ name, email, subject, message, lang = "en" }) {
  const copy = getEmailCopy(lang);

  const contentHtml = `
    <div
      style="
        margin-top:8px;
        border:1px solid #e5e7eb;
        border-radius:18px;
        overflow:hidden;
      "
    >
      <div style="padding:16px 18px;border-bottom:1px solid #e5e7eb;background:#fafafa;">
        <strong>${escapeHtml(copy.adminIntro)}</strong>
      </div>

      <div style="padding:18px;">
        <p style="margin:0 0 12px;font-size:15px;line-height:1.7;">
          <strong>${escapeHtml(copy.name)}:</strong> ${escapeHtml(name)}
        </p>
        <p style="margin:0 0 12px;font-size:15px;line-height:1.7;">
          <strong>${escapeHtml(copy.email)}:</strong> ${escapeHtml(email)}
        </p>
        <p style="margin:0 0 12px;font-size:15px;line-height:1.7;">
          <strong>${escapeHtml(copy.subject)}:</strong> ${escapeHtml(subject || "-")}
        </p>

        <div
          style="
            margin-top:16px;
            padding:16px;
            border-radius:14px;
            background:#f8fafc;
            border:1px solid #e5e7eb;
          "
        >
          <div style="font-weight:700;margin-bottom:8px;">${escapeHtml(copy.message)}</div>
          <div style="color:#374151;font-size:15px;line-height:1.8;">
            ${escapeHtml(message).replaceAll("\n", "<br>")}
          </div>
        </div>
      </div>
    </div>
  `;

  return emailLayout({
    lang,
    title: copy.adminTitle,
    intro: copy.adminIntro,
    contentHtml,
    showNoReply: false,
  });
}

function autoReplyHTML({ name, lang }) {
  const copy = getEmailCopy(lang);
  const L = normalizeLang(lang);

  const checkItems = L === "nl"
    ? ["Je bericht is succesvol ontvangen ✅", "Ik reageer doorgaans binnen 24 uur 🕐", "Houd je inbox in de gaten 📬"]
    : L === "ar"
    ? ["تم استلام رسالتك بنجاح ✅", "أرد عادةً خلال 24 ساعة 🕐", "راقب صندوق الوارد لديك 📬"]
    : ["Your message was received successfully ✅", "I usually reply within 24 hours 🕐", "Keep an eye on your inbox 📬"];

  const contentHtml = `
    <div style="padding:20px;border-radius:16px;background:linear-gradient(160deg,#f0fdf4,#ffffff);border:1px solid #bbf7d0;">
      <p style="margin:0 0 16px;font-size:17px;font-weight:700;color:#111827;">
        ${escapeHtml(copy.greeting)} ${escapeHtml(name)} 👋
      </p>
      <p style="margin:0 0 18px;color:#374151;font-size:15px;line-height:1.9;">
        ${escapeHtml(copy.confirmText)}
      </p>
      <ul style="margin:0;padding:0;list-style:none;">
        ${checkItems.map(item => `<li style="padding:7px 0;font-size:14px;color:#374151;border-bottom:1px solid #e5e7eb;">${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>
  `;

  return emailLayout({
    lang,
    title: copy.confirmTitle,
    intro: copy.confirmText,
    contentHtml,
    showNoReply: true,
  });
}

function autoReplySubject(lang) {
  const L = normalizeLang(lang);

  if (L === "nl") return "Bedankt! Ik heb je bericht ontvangen ✅";
  if (L === "ar") return "شكرًا! تم استلام رسالتك ✅";
  return "Thanks! I received your message ✅";
}

function autoReplyText({ name, lang, toEmail }) {
  const L = normalizeLang(lang);

  if (L === "nl") {
    return `Hoi ${name},

Bedankt voor je bericht! Ik heb het goed ontvangen en reageer meestal binnen 24 uur.

Samir Loul
${toEmail}`;
  }

  if (L === "ar") {
    return `مرحبًا ${name}

شكرًا لرسالتك! لقد استلمتها وسأرد عادة خلال 24 ساعة.

سمير لول
${toEmail}`;
  }

  return `Hi ${name},

Thanks for your message! I received it successfully and usually reply within 24 hours.

Samir Loul
${toEmail}`;
}

function newsletterSubject(lang) {
  const L = normalizeLang(lang);
  if (L === "nl") return "Nieuwe nieuwsbrief-inschrijving";
  if (L === "ar") return "اشتراك جديد في النشرة البريدية";
  return "New newsletter subscription";
}

function feedbackSubject(lang) {
  const L = normalizeLang(lang);
  if (L === "nl") return "Nieuwe portfolio feedback";
  if (L === "ar") return "ملاحظات جديدة على الملف الشخصي";
  return "New portfolio feedback";
}

function projectRequestSubject(lang) {
  const L = normalizeLang(lang);
  if (L === "nl") return "Nieuwe website aanvraag";
  if (L === "ar") return "طلب موقع جديد";
  return "New website project request";
}

function projectRequestAdminHTML({ data, lang = "en" }) {
  const L = normalizeLang(lang);
  const labelsMap = {
    en: {
      intro: "You received a new website intake request.",
      sections: {
        business: "Business Profile",
        features: "Website Features",
        launch: "Launch, Budget, and Support",
      },
      name: "Name",
      email: "Email",
      businessName: "Business",
      businessStage: "Business stage",
      targetAudience: "Target audience",
      hasBranding: "Has branding",
      hasDomain: "Has domain",
      needBooking: "Needs booking",
      needShop: "Needs webshop/payment",
      needMultilang: "Needs multilingual",
      needBlog: "Needs blog/news",
      primaryGoal: "Main goal",
      styleDirection: "Style direction",
      contentReady: "Content ready",
      needCopywriting: "Needs copywriting",
      pagesCount: "Expected pages",
      needCms: "Needs CMS",
      referenceWebsite: "Reference websites",
      budgetRange: "Budget range",
      timeline: "Timeline",
      urgent: "Urgent",
      hasHosting: "Has hosting",
      needLegalPages: "Needs legal pages",
      needAnalytics: "Needs analytics",
      needIntegrations: "Needs integrations",
      integrationsDetails: "Integration details",
      maintenance: "Needs maintenance",
      seo: "Needs SEO",
      launchCampaign: "Needs launch campaign",
      notes: "Extra notes",
    },
    nl: {
      intro: "Je hebt een nieuwe website-intake ontvangen.",
      sections: {
        business: "Bedrijfsprofiel",
        features: "Website Functionaliteiten",
        launch: "Planning, Budget en Support",
      },
      name: "Naam",
      email: "E-mail",
      businessName: "Bedrijf",
      businessStage: "Bedrijfsfase",
      targetAudience: "Doelgroep",
      hasBranding: "Heeft branding",
      hasDomain: "Heeft domein",
      needBooking: "Wil afspraakmodule",
      needShop: "Wil webshop/betaling",
      needMultilang: "Wil meertaligheid",
      needBlog: "Wil blog/nieuws",
      primaryGoal: "Hoofddoel",
      styleDirection: "Voorkeursstijl",
      contentReady: "Content klaar",
      needCopywriting: "Hulp met teksten",
      pagesCount: "Aantal pagina's",
      needCms: "CMS gewenst",
      referenceWebsite: "Referentie websites",
      budgetRange: "Budget",
      timeline: "Planning",
      urgent: "Urgent",
      hasHosting: "Heeft hosting",
      needLegalPages: "Juridische pagina's",
      needAnalytics: "Analytics gewenst",
      needIntegrations: "Integraties gewenst",
      integrationsDetails: "Integratie details",
      maintenance: "Onderhoud gewenst",
      seo: "SEO gewenst",
      launchCampaign: "Launch campagne gewenst",
      notes: "Extra notities",
    },
    ar: {
      intro: "لديك طلب جديد عبر نموذج الموقع.",
      sections: {
        business: "ملف المشروع",
        features: "ميزات الموقع",
        launch: "الإطلاق والميزانية والدعم",
      },
      name: "الاسم",
      email: "البريد الإلكتروني",
      businessName: "اسم المشروع",
      businessStage: "مرحلة المشروع",
      targetAudience: "الفئة المستهدفة",
      hasBranding: "لديه هوية بصرية",
      hasDomain: "لديه نطاق",
      needBooking: "يحتاج نظام حجز",
      needShop: "يحتاج متجر/دفع",
      needMultilang: "يحتاج تعدد لغات",
      needBlog: "يحتاج مدونة/أخبار",
      primaryGoal: "الهدف الرئيسي",
      styleDirection: "نمط التصميم",
      contentReady: "المحتوى جاهز",
      needCopywriting: "يحتاج كتابة محتوى",
      pagesCount: "عدد الصفحات",
      needCms: "يحتاج CMS",
      referenceWebsite: "مواقع مرجعية",
      budgetRange: "الميزانية",
      timeline: "الجدول الزمني",
      urgent: "مستعجل",
      hasHosting: "لديه استضافة",
      needLegalPages: "يحتاج صفحات قانونية",
      needAnalytics: "يحتاج تحليلات",
      needIntegrations: "يحتاج تكاملات",
      integrationsDetails: "تفاصيل التكامل",
      maintenance: "يريد صيانة",
      seo: "يريد SEO",
      launchCampaign: "يريد دعم الإطلاق",
      notes: "ملاحظات إضافية",
    },
  };
  const labels = labelsMap[L] || labelsMap.en;

  const block = (title, rows) => `
    <div style="margin-top:14px;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
      <div style="padding:11px 14px;background:#f8fafc;border-bottom:1px solid #e5e7eb;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#334155;">
        ${escapeHtml(title)}
      </div>
      <div style="padding:12px 14px;">
        ${rows
          .map(
            ([k, v]) => `
              <div style="padding:7px 0;border-bottom:1px dashed #e5e7eb;">
                <div style="font-size:12px;color:#64748b;margin-bottom:2px;">${escapeHtml(k)}</div>
                <div style="font-size:14px;color:#0f172a;font-weight:600;line-height:1.6;">${escapeHtml(v || "-")}</div>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  `;

  const contentHtml = `
    <div style="border:1px solid #e5e7eb;border-radius:16px;padding:14px 14px 10px;background:#ffffff;">
      <p style="margin:0 0 8px;color:#475569;font-size:14px;line-height:1.7;">
        ${escapeHtml(labels.intro)}
      </p>

      ${block(labels.sections.business, [
        [labels.name, data.fullName],
        [labels.email, data.email],
        [labels.businessName, data.businessName],
        [labels.businessStage, data.businessStage],
        [labels.targetAudience, data.targetAudience],
        [labels.hasBranding, data.hasBranding],
        [labels.hasDomain, data.hasDomain],
      ])}

      ${block(labels.sections.features, [
        [labels.primaryGoal, data.primaryGoal],
        [labels.styleDirection, data.styleDirection],
        [labels.needBooking, data.needBooking],
        [labels.needShop, data.needShop],
        [labels.needMultilang, data.needMultilang],
        [labels.needBlog, data.needBlog],
        [labels.contentReady, data.contentReady],
        [labels.needCopywriting, data.needCopywriting],
        [labels.pagesCount, data.pagesCount],
        [labels.needCms, data.needCms],
        [labels.referenceWebsite, data.referenceWebsite || "-"],
      ])}

      ${block(labels.sections.launch, [
        [labels.budgetRange, data.budgetRange],
        [labels.timeline, data.timeline],
        [labels.urgent, data.urgent],
        [labels.hasHosting, data.hasHosting],
        [labels.needLegalPages, data.needLegalPages],
        [labels.needAnalytics, data.needAnalytics],
        [labels.needIntegrations, data.needIntegrations],
        [labels.integrationsDetails, data.integrationsDetails || "-"],
        [labels.maintenance, data.maintenance],
        [labels.seo, data.seo],
        [labels.launchCampaign, data.launchCampaign],
        [labels.notes, data.notes || "-"],
      ])}
    </div>
  `;

  return emailLayout({
    lang: L,
    title: projectRequestSubject(L),
    intro: labels.intro,
    contentHtml,
    showNoReply: false,
  });
}

function projectRequestAutoReplySubject(lang) {
  const L = normalizeLang(lang);
  if (L === "nl") return "Bedankt! Je website-aanvraag is ontvangen ✅";
  if (L === "ar") return "شكرًا! تم استلام طلب الموقع ✅";
  return "Thanks! Your website request was received ✅";
}

function projectRequestAutoReplyText({ name, lang, toEmail }) {
  const L = normalizeLang(lang);

  if (L === "nl") {
    return `Hoi ${name},

Bedankt voor je aanvraag. Ik heb je intake ontvangen en neem snel contact op met een passend voorstel.

Samir Loul
${toEmail}`;
  }

  if (L === "ar") {
    return `مرحبًا ${name}

شكرًا على طلبك. استلمت النموذج وسأتواصل معك قريبًا باقتراح مناسب.

سمير لول
${toEmail}`;
  }

  return `Hi ${name},

Thanks for your request. I received your intake and will contact you soon with a suitable proposal.

Samir Loul
${toEmail}`;
}

function broadcastHtml({ subject, message, unsubscribeToken = "" }) {
  const unsubscribeUrl = `${APP_BASE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;
  const messageHtml = escapeHtml(message).replaceAll("\n", "<br>");

  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${escapeHtml(subject)}</title>
<style>
  @media only screen and (max-width:600px){
    .bc-wrapper{padding:16px 8px !important;}
    .bc-card{border-radius:16px !important;}
    .bc-header{padding:22px 18px !important;}
    .bc-body{padding:22px 18px !important;}
    .bc-footer{padding:16px 18px !important;}
    .bc-avatar{width:44px !important;height:44px !important;}
    .bc-title{font-size:19px !important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#f0f4fb;-webkit-text-size-adjust:100%;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f0f4fb;">
  <tr>
    <td class="bc-wrapper" align="center" style="padding:32px 16px;">
      <table role="presentation" class="bc-card" width="100%" cellspacing="0" cellpadding="0" border="0"
        style="max-width:620px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(15,23,42,.10);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#111827;">

        <!-- HEADER -->
        <tr>
          <td class="bc-header" style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:28px 28px;color:#ffffff;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="vertical-align:middle;width:60px;padding-right:16px;">
                  <img class="bc-avatar" src="${PROFILE_IMAGE_URL}" alt="Samir Loul" width="52" height="52"
                    style="display:block;width:52px;height:52px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,.4);" />
                </td>
                <td style="vertical-align:middle;">
                  <div style="font-size:11px;opacity:.85;margin-bottom:5px;letter-spacing:.5px;text-transform:uppercase;">Samir Loul · Nieuwsbrief</div>
                  <div class="bc-title" style="font-size:22px;font-weight:800;line-height:1.3;color:#ffffff;">${escapeHtml(subject)}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td class="bc-body" style="padding:28px 28px;">
            <p style="margin:0 0 14px;color:#4b5563;font-size:15px;line-height:1.75;">
              Hi there, thanks for subscribing to updates from Samir Loul. Here is a new update from my portfolio:
            </p>
            <div style="padding:20px;border-radius:14px;background:#f8fafc;border:1px solid #e5e7eb;font-size:15px;line-height:1.9;color:#374151;">
              ${messageHtml}
            </div>

            <div style="margin-top:14px;padding:14px 16px;border-radius:12px;background:#eef2ff;border:1px solid #c7d2fe;color:#3730a3;font-size:14px;line-height:1.7;">
              Want to collaborate, ask a question, or start a project together? Visit
              <a href="https://samirprofile.com/contact" style="color:#312e81;text-decoration:none;font-weight:700;"> samirprofile.com/contact</a>
              and send me a message.
            </div>

            <div style="margin-top:24px;padding:18px 20px;border-radius:16px;background:#f8fafc;border:1px solid #e5e7eb;">
              <div style="font-size:13px;font-weight:700;margin-bottom:12px;color:#374151;text-transform:uppercase;letter-spacing:.4px;">Volg mij online</div>
              ${renderSocialButtons()}
            </div>
          </td>
        </tr>

        <!-- NO-REPLY NOTICE -->
        <tr>
          <td style="padding:0 28px 4px;">
            <div style="padding:14px 16px;background:#fef9ec;border:1px solid #fde68a;border-radius:12px;font-size:13px;color:#92400e;line-height:1.6;">
              ⚠️ Dit is een automatisch verzonden e-mail. <strong>Reageer niet op dit bericht</strong> — dit adres ontvangt geen berichten.<br>
              <span style="margin-top:4px;display:inline-block;">Wil je iets vragen of melden? Ga naar <a href="https://samirprofile.com/contact" style="color:#4f46e5;text-decoration:none;font-weight:600;">samirprofile.com/contact</a>.</span>
            </div>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td class="bc-footer" style="padding:20px 28px 24px;border-top:1px solid #f1f5f9;background:#fcfcfd;color:#6b7280;font-size:13px;line-height:1.7;">
            Je ontvangt deze e-mail omdat je je hebt ingeschreven op <a href="https://samirprofile.com" style="color:#4f46e5;text-decoration:none;">samirprofile.com</a>.<br>
            Niet meer geïnteresseerd? <a href="${unsubscribeUrl}" style="color:#ef4444;text-decoration:none;font-weight:600;">Uitschrijven</a> · 
            <a href="https://samirprofile.com" style="color:#4f46e5;text-decoration:none;">Bezoek de website</a>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}
/** =========================
 * Routes
 * ========================= */
app.get("/", (req, res) => {
  return res.json({
    ok: true,
    service: "contact-api",
    message: "API is running",
    endpoints: ["/api/health", "/api/contact", "/api/project-request", "/api/newsletter", "/api/feedback"],
  });
});

app.get("/api/contact", (req, res) => {
  return res.json({
    ok: true,
    message: "API is working. Use POST to send messages.",
  });
});

app.get("/api/project-request", (req, res) => {
  return res.json({
    ok: true,
    message: "API is working. Use POST to send project requests.",
  });
});

app.get("/api/health", (req, res) => {
  return res.json({
    ok: true,
    service: "contact-api",
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});
app.post("/api/contact", async (req, res) => {
  try {
    console.log("POST /api/contact body:", req.body);

    const {
      name,
      email,
      subject = "",
      message,
      website = "",
      lang = "en",
      recaptchaToken,
    } = req.body || {};

    if (website) {
      return res.status(200).json({ ok: true });
    }

    if (!recaptchaToken) {
      return res.status(400).json({
        ok: false,
        error: "Missing captcha token",
      });
    }

    const captcha = await verifyRecaptcha(recaptchaToken, req.ip);

    if (!captcha.ok) {
      return res.status(400).json({
        ok: false,
        error: captcha.error || "Captcha failed",
        details: captcha.data?.["error-codes"] || null,
        hostname: captcha.data?.hostname || null,
      });
    }

const cleanName = clampLen(String(name || "").trim(), 80);
const cleanEmail = clampLen(String(email || "").trim(), 254).toLowerCase();
const cleanSubject = clampLen(String(subject || "").trim(), 120);
const cleanMessage = clampLen(String(message || "").trim(), 5000);
const L = normalizeLang(lang);

    if (!cleanName) {
      return res.status(400).json({ ok: false, error: "Missing name" });
    }

    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      return res.status(400).json({ ok: false, error: "Invalid email" });
    }

    if (!cleanMessage || cleanMessage.length < 10) {
      return res.status(400).json({ ok: false, error: "Message too short" });
    }

    const adminResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: cleanEmail,
      subject: `Website contact: ${cleanSubject || "No subject"} — ${cleanName}`,
html: adminEmailHTML({
  name: cleanName,
  email: cleanEmail,
  subject: cleanSubject,
  message: cleanMessage,
  lang: L,
}),
      text: `New message via portfolio

Name: ${cleanName}
Email: ${cleanEmail}
Subject: ${cleanSubject || "-"}

Message:
${cleanMessage}
`,
    });

    console.log("Resend admin mail:", JSON.stringify(adminResult, null, 2));

    if (adminResult?.error) {
      return res.status(500).json({
        ok: false,
        error: "Resend error (admin)",
        details: adminResult.error,
      });
    }
const userResult = await resend.emails.send({
  from: FROM_EMAIL,
  to: cleanEmail,
  subject: autoReplySubject(L),
  html: autoReplyHTML({
    name: cleanName,
    lang: L,
  }),
  text: autoReplyText({
    name: cleanName,
    lang: L,
    toEmail: TO_EMAIL,
  }),
});

console.log("Resend user mail:", JSON.stringify(userResult, null, 2));

if (userResult?.error) {
  return res.json({
    ok: true,
    warning: "Bericht naar jou is verstuurd, maar bevestigingsmail naar afzender mislukte.",
    details: userResult.error,
  });
}
    return res.json({ ok: true });
  } catch (err) {
    console.error("SERVER ERROR:", err);

    return res.status(500).json({
      ok: false,
      error: "Server error",
      details: String(err?.message || err),
    });
  }
});

app.post("/api/project-request", async (req, res) => {
  try {
    const {
      fullName,
      email,
      businessName,
      businessStage,
      targetAudience,
      hasBranding,
      hasDomain,
      styleDirection,
      needBooking,
      needShop,
      needMultilang,
      needBlog,
      primaryGoal,
      contentReady,
      needCopywriting,
      pagesCount,
      needCms,
      referenceWebsite,
      budgetRange,
      timeline,
      urgent,
      hasHosting,
      needLegalPages,
      needAnalytics,
      needIntegrations,
      integrationsDetails,
      maintenance,
      seo,
      launchCampaign,
      notes = "",
      website = "",
      lang = "en",
      recaptchaToken,
    } = req.body || {};

    if (website) {
      return res.status(200).json({ ok: true });
    }

    if (!recaptchaToken) {
      return res.status(400).json({ ok: false, error: "Missing captcha token" });
    }

    const captcha = await verifyRecaptcha(recaptchaToken, req.ip);

    if (!captcha.ok) {
      return res.status(400).json({
        ok: false,
        error: captcha.error || "Captcha failed",
        details: captcha.data?.["error-codes"] || null,
      });
    }

    const clean = {
      fullName: clampLen(String(fullName || "").trim(), 80),
      email: clampLen(String(email || "").trim().toLowerCase(), 254),
      businessName: clampLen(String(businessName || "").trim(), 120),
      businessStage: clampLen(String(businessStage || "").trim(), 60),
      targetAudience: clampLen(String(targetAudience || "").trim(), 180),
      hasBranding: clampLen(String(hasBranding || "").trim(), 20),
      hasDomain: clampLen(String(hasDomain || "").trim(), 20),
      styleDirection: clampLen(String(styleDirection || "").trim(), 60),
      needBooking: clampLen(String(needBooking || "").trim(), 20),
      needShop: clampLen(String(needShop || "").trim(), 20),
      needMultilang: clampLen(String(needMultilang || "").trim(), 20),
      needBlog: clampLen(String(needBlog || "").trim(), 20),
      primaryGoal: clampLen(String(primaryGoal || "").trim(), 500),
      contentReady: clampLen(String(contentReady || "").trim(), 20),
      needCopywriting: clampLen(String(needCopywriting || "").trim(), 20),
      pagesCount: clampLen(String(pagesCount || "").trim(), 40),
      needCms: clampLen(String(needCms || "").trim(), 20),
      referenceWebsite: clampLen(String(referenceWebsite || "").trim(), 600),
      budgetRange: clampLen(String(budgetRange || "").trim(), 60),
      timeline: clampLen(String(timeline || "").trim(), 60),
      urgent: clampLen(String(urgent || "").trim(), 20),
      hasHosting: clampLen(String(hasHosting || "").trim(), 20),
      needLegalPages: clampLen(String(needLegalPages || "").trim(), 20),
      needAnalytics: clampLen(String(needAnalytics || "").trim(), 20),
      needIntegrations: clampLen(String(needIntegrations || "").trim(), 20),
      integrationsDetails: clampLen(String(integrationsDetails || "").trim(), 600),
      maintenance: clampLen(String(maintenance || "").trim(), 20),
      seo: clampLen(String(seo || "").trim(), 20),
      launchCampaign: clampLen(String(launchCampaign || "").trim(), 20),
      notes: clampLen(String(notes || "").trim(), 2000),
    };

    const L = normalizeLang(lang);

    if (
      !clean.fullName ||
      !clean.email ||
      !isValidEmail(clean.email) ||
      !clean.businessName ||
      !clean.businessStage ||
      !clean.targetAudience ||
      !clean.hasBranding ||
      !clean.hasDomain ||
      !clean.styleDirection ||
      !clean.needBooking ||
      !clean.needShop ||
      !clean.needMultilang ||
      !clean.needBlog ||
      !clean.primaryGoal ||
      !clean.contentReady ||
      !clean.needCopywriting ||
      !clean.pagesCount ||
      !clean.needCms ||
      !clean.budgetRange ||
      !clean.timeline ||
      !clean.urgent ||
      !clean.hasHosting ||
      !clean.needLegalPages ||
      !clean.needAnalytics ||
      !clean.needIntegrations ||
      !clean.maintenance ||
      !clean.seo ||
      !clean.launchCampaign
    ) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    if (clean.needIntegrations === "yes" && !clean.integrationsDetails) {
      return res.status(400).json({ ok: false, error: "Integration details are required" });
    }

    const adminResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: clean.email,
      subject: `${projectRequestSubject(L)} - ${clean.businessName} - ${clean.fullName}`,
      html: projectRequestAdminHTML({ data: clean, lang: L }),
      text: `New website project request

Name: ${clean.fullName}
Email: ${clean.email}
Business: ${clean.businessName}
Stage: ${clean.businessStage}
Target audience: ${clean.targetAudience}
Branding: ${clean.hasBranding}
Domain: ${clean.hasDomain}
Style: ${clean.styleDirection}
Booking: ${clean.needBooking}
Webshop: ${clean.needShop}
Multilang: ${clean.needMultilang}
Blog: ${clean.needBlog}
Goal: ${clean.primaryGoal}
Content ready: ${clean.contentReady}
Copywriting: ${clean.needCopywriting}
Pages: ${clean.pagesCount}
CMS: ${clean.needCms}
References: ${clean.referenceWebsite || "-"}
Budget: ${clean.budgetRange}
Timeline: ${clean.timeline}
Urgent: ${clean.urgent}
Hosting: ${clean.hasHosting}
Legal pages: ${clean.needLegalPages}
Analytics: ${clean.needAnalytics}
Integrations: ${clean.needIntegrations}
Integration details: ${clean.integrationsDetails || "-"}
Maintenance: ${clean.maintenance}
SEO: ${clean.seo}
Launch campaign: ${clean.launchCampaign}
Notes: ${clean.notes || "-"}`,
    });

    if (adminResult?.error) {
      return res.status(500).json({
        ok: false,
        error: "Resend error (admin)",
        details: adminResult.error,
      });
    }

    const userResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: clean.email,
      subject: projectRequestAutoReplySubject(L),
      text: projectRequestAutoReplyText({ name: clean.fullName, lang: L, toEmail: TO_EMAIL }),
    });

    if (userResult?.error) {
      return res.json({
        ok: true,
        warning: "Projectaanvraag is verstuurd, maar bevestigingsmail naar afzender mislukte.",
      });
    }

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: "Server error",
      details: String(err?.message || err),
    });
  }
});

app.post("/api/newsletter", async (req, res) => {
  try {
    const { email, lang = "en", website = "" } = req.body || {};

    if (website) {
      return res.status(200).json({ ok: true });
    }

    const cleanEmail = clampLen(String(email || "").trim(), 254).toLowerCase();
    const L = normalizeLang(lang);

    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      return res.status(400).json({ ok: false, error: "Invalid email" });
    }

    const subscribers = await addSubscriber(cleanEmail, L);

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `${newsletterSubject(L)}: ${cleanEmail}`,
      replyTo: cleanEmail,
      html: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4fb;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f0f4fb;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:520px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(15,23,42,.09);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#111827;">
      <tr><td style="background:linear-gradient(135deg,#059669,#10b981);padding:22px 24px;color:#fff;">
        <div style="font-size:11px;opacity:.85;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">Portfolio · Nieuwsbrief</div>
        <div style="font-size:20px;font-weight:800;">📬 Nieuwe inschrijving!</div>
      </td></tr>
      <tr><td style="padding:24px;">
        <p style="margin:0 0 16px;font-size:15px;color:#374151;">Er is iemand ingeschreven op je nieuwsbrief:</p>
        <div style="padding:16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;margin-bottom:16px;">
          <p style="margin:0 0 8px;font-size:15px;"><strong>📧 E-mail:</strong> ${escapeHtml(cleanEmail)}</p>
          <p style="margin:0 0 8px;font-size:15px;"><strong>🌐 Taal:</strong> ${L.toUpperCase()}</p>
          <p style="margin:0;font-size:13px;color:#6b7280;"><strong>🕐 Tijdstip:</strong> ${new Date().toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" })}</p>
        </div>
        <p style="margin:0;font-size:13px;color:#6b7280;">Totaal abonnees: <strong>${subscribers.total}</strong></p>
      </td></tr>
      <tr><td style="padding:16px 24px 20px;border-top:1px solid #f1f5f9;background:#fcfcfd;font-size:13px;color:#9ca3af;">
        Beheer je abonnees via je <a href="https://samirprofile.com/admin" style="color:#4f46e5;text-decoration:none;">admin dashboard</a>.
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`,
      text: `Nieuwe nieuwsbrief-inschrijving\n\nE-mail: ${cleanEmail}\nTaal: ${L}\nTijdstip: ${new Date().toISOString()}\nTotaal abonnees: ${subscribers.total}`,
    });

    if (result?.error) {
      return res.status(500).json({ ok: false, error: "Resend error", details: result.error });
    }

    return res.json({ ok: true, totalSubscribers: subscribers.total });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Server error", details: String(err?.message || err) });
  }
});

app.get("/api/newsletter/unsubscribe", async (req, res) => {
  const token = String(req.query.token || "").trim();
  const removed = await unsubscribeByToken(token);

  if (!removed) {
    return res.status(404).send("This unsubscribe link is invalid or already used.");
  }

  return res.send("You have been unsubscribed successfully.");
});

app.post("/api/feedback", async (req, res) => {
  try {
    const { rating, message = "", lang = "en", website = "" } = req.body || {};

    if (website) {
      return res.status(200).json({ ok: true });
    }

    const cleanRating = Number(rating);
    const cleanMessage = clampLen(String(message || "").trim(), 2000);
    const L = normalizeLang(lang);

    if (!Number.isFinite(cleanRating) || cleanRating < 1 || cleanRating > 5) {
      return res.status(400).json({ ok: false, error: "Invalid rating" });
    }

    if (!cleanMessage || cleanMessage.length < 3) {
      return res.status(400).json({ ok: false, error: "Feedback message too short" });
    }

    const feedbackItems = await addFeedback({
      rating: cleanRating,
      message: cleanMessage,
      lang: L,
    });

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `${feedbackSubject(L)} (${cleanRating}/5)`,
      html: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4fb;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f0f4fb;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:520px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(15,23,42,.09);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#111827;">
      <tr><td style="background:linear-gradient(135deg,#f59e0b,#f97316);padding:22px 24px;color:#fff;">
        <div style="font-size:11px;opacity:.85;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">Portfolio · Feedback</div>
        <div style="font-size:20px;font-weight:800;">⭐ Nieuwe feedback ontvangen</div>
      </td></tr>
      <tr><td style="padding:24px;">
        <p style="margin:0 0 16px;font-size:15px;color:#374151;">Iemand heeft feedback achtergelaten op je portfolio:</p>
        <div style="padding:16px;background:#fffbeb;border:1px solid #fde68a;border-radius:12px;margin-bottom:16px;">
          <p style="margin:0 0 10px;font-size:18px;">${"⭐".repeat(cleanRating)}${"☆".repeat(5 - cleanRating)} <strong>${cleanRating}/5</strong></p>
          <p style="margin:0 0 8px;font-size:13px;color:#6b7280;"><strong>🌐 Taal:</strong> ${L.toUpperCase()} &nbsp;&nbsp; <strong>🕐 Tijdstip:</strong> ${new Date().toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" })}</p>
        </div>
        <div style="padding:16px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;font-size:15px;line-height:1.8;color:#374151;white-space:pre-wrap;">${escapeHtml(cleanMessage)}</div>
        <p style="margin:12px 0 0;font-size:13px;color:#6b7280;">Totaal feedback: <strong>${feedbackItems.total}</strong></p>
      </td></tr>
      <tr><td style="padding:16px 24px 20px;border-top:1px solid #f1f5f9;background:#fcfcfd;font-size:13px;color:#9ca3af;">
        Bekijk alle feedback via je <a href="https://samirprofile.com/admin" style="color:#4f46e5;text-decoration:none;">admin dashboard</a>.
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`,
      text: `Portfolio feedback\n\nRating: ${cleanRating}/5\nTaal: ${L}\nBericht:\n${cleanMessage}\n\nTijdstip: ${new Date().toISOString()}`,
    });

    if (result?.error) {
      return res.status(500).json({ ok: false, error: "Resend error", details: result.error });
    }

    return res.json({ ok: true, totalFeedback: feedbackItems.total });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Server error", details: String(err?.message || err) });
  }
});

app.get("/api/admin/overview", requireAdmin, async (req, res) => {
  const subscribersData = await getSubscribers({ page: 1, pageSize: 20, search: "" });
  const feedbackData = await getFeedback({ page: 1, pageSize: 20, search: "" });

  return res.json({
    ok: true,
    counts: {
      subscribers: subscribersData.total,
      feedback: feedbackData.total,
    },
    recentSubscribers: subscribersData.items,
    recentFeedback: feedbackData.items,
  });
});

app.get("/api/admin/subscribers", requireAdmin, async (req, res) => {
  const page = req.query.page;
  const pageSize = req.query.pageSize;
  const search = req.query.search;
  const data = await getSubscribers({ page, pageSize, search });
  return res.json({ ok: true, ...data });
});

app.get("/api/admin/feedback", requireAdmin, async (req, res) => {
  const page = req.query.page;
  const pageSize = req.query.pageSize;
  const search = req.query.search;
  const data = await getFeedback({ page, pageSize, search });
  return res.json({ ok: true, ...data });
});

app.get("/api/admin/export/subscribers.csv", requireAdmin, async (req, res) => {
  const data = await getSubscribers({ page: 1, pageSize: 10000, search: "" });
  const lines = ["email,lang,subscribedAt,updatedAt"];

  for (const item of data.items) {
    lines.push(
      [item.email, item.lang, item.subscribedAt || "", item.updatedAt || ""]
        .map((value) => `"${String(value || "").replaceAll('"', '""')}"`)
        .join(",")
    );
  }

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=subscribers.csv");
  return res.send(lines.join("\n"));
});

app.get("/api/admin/export/feedback.csv", requireAdmin, async (req, res) => {
  const data = await getFeedback({ page: 1, pageSize: 10000, search: "" });
  const lines = ["rating,lang,message,createdAt"];

  for (const item of data.items) {
    lines.push(
      [item.rating, item.lang, item.message, item.createdAt || ""]
        .map((value) => `"${String(value || "").replaceAll('"', '""')}"`)
        .join(",")
    );
  }

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=feedback.csv");
  return res.send(lines.join("\n"));
});

app.post("/api/admin/broadcast", requireAdmin, async (req, res) => {
  try {
    const { subject = "", message = "", previewOnly = false } = req.body || {};
    const cleanSubject = clampLen(String(subject || "").trim(), 120);
    const cleanMessage = clampLen(String(message || "").trim(), 5000);

    if (!cleanSubject) {
      return res.status(400).json({ ok: false, error: "Missing subject" });
    }

    if (!cleanMessage || cleanMessage.length < 3) {
      return res.status(400).json({ ok: false, error: "Message too short" });
    }

    const subscribers = await getAllSubscriberEmailsWithTokens();
    const recipients = subscribers
      .map((item) => ({
        email: String(item.email || "").trim().toLowerCase(),
        unsubscribeToken: String(item.unsubscribeToken || ""),
      }))
      .filter((item) => item.email);

    if (!recipients.length) {
      return res.status(400).json({ ok: false, error: "No subscribers found" });
    }

    if (previewOnly) {
      return res.json({ ok: true, preview: true, totalRecipients: recipients.length });
    }

    let sent = 0;
    const failures = [];

    for (const recipient of recipients) {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: recipient.email,
        subject: cleanSubject,
        html: broadcastHtml({
          subject: cleanSubject,
          message: cleanMessage,
          unsubscribeToken: recipient.unsubscribeToken,
        }),
        text: cleanMessage,
      });

      if (result?.error) {
        failures.push({ email: recipient.email, error: result.error });
      } else {
        sent += 1;
      }
    }

    return res.json({
      ok: true,
      totalRecipients: recipients.length,
      sent,
      failed: failures.length,
      failures,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Server error", details: String(err?.message || err) });
  }
});

/** =========================
 * Start
 * ========================= */
async function startServer() {
  try {
    await ensureDataFiles();

    if (DATABASE_URL) {
      await initDatabase();
      console.log("Database mode: PostgreSQL");
    } else {
      console.log("Database mode: JSON file fallback");
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log("API running on", PORT);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();