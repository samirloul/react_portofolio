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

function emailLayout({
  lang = "en",
  title,
  intro,
  contentHtml,
}) {
  const L = normalizeLang(lang);
  const copy = getEmailCopy(L);
  const isRTL = L === "ar";

  return `
    <div style="margin:0;padding:0;background:#f4f7fb;">
      <div style="max-width:680px;margin:0 auto;padding:32px 16px;">
        <div
          style="
            background:#ffffff;
            border-radius:24px;
            overflow:hidden;
            box-shadow:0 10px 35px rgba(15,23,42,.08);
            font-family:Arial,Helvetica,sans-serif;
            color:#111827;
            direction:${isRTL ? "rtl" : "ltr"};
            text-align:${isRTL ? "right" : "left"};
          "
        >
          <div
            style="
              background:linear-gradient(135deg,#4f46e5,#7c3aed);
              padding:28px 24px;
              color:#fff;
            "
          >
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td style="vertical-align:middle;width:72px;">
                  <img
                    src="${PROFILE_IMAGE_URL}"
                    alt="Samir Loul"
                    width="56"
                    height="56"
                    style="display:block;width:56px;height:56px;border-radius:999px;object-fit:cover;border:3px solid rgba(255,255,255,.35);"
                  />
                </td>
                <td style="vertical-align:middle;">
                  <div style="font-size:12px;opacity:.9;margin-bottom:4px;">Samir Loul</div>
                  <div style="font-size:24px;font-weight:800;line-height:1.25;">${escapeHtml(title)}</div>
                </td>
              </tr>
            </table>
          </div>

          <div style="padding:28px 24px;">
            <p style="margin:0 0 18px;color:#4b5563;font-size:15px;line-height:1.8;">
              ${escapeHtml(intro)}
            </p>

            ${contentHtml}

            <div
              style="
                margin-top:28px;
                padding:18px;
                border-radius:18px;
                background:#f8fafc;
                border:1px solid #e5e7eb;
              "
            >
              <div style="font-size:14px;font-weight:700;margin-bottom:10px;color:#111827;">
                ${escapeHtml(copy.socialsTitle)}
              </div>
              ${renderSocialButtons()}
            </div>
          </div>

          <div
            style="
              padding:18px 24px;
              border-top:1px solid #e5e7eb;
              background:#fcfcfd;
              color:#6b7280;
              font-size:13px;
              line-height:1.7;
            "
          >
            ${escapeHtml(copy.footer)}<br>
            <strong style="color:#111827;">Samir Loul</strong><br>
            <a href="mailto:${TO_EMAIL}" style="color:#4f46e5;text-decoration:none;">${TO_EMAIL}</a>
          </div>
        </div>
      </div>
    </div>
  `;
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
  });
}

function autoReplyHTML({ name, lang }) {
  const copy = getEmailCopy(lang);

  const contentHtml = `
    <div
      style="
        padding:20px;
        border-radius:18px;
        background:linear-gradient(180deg,#f8fafc,#ffffff);
        border:1px solid #e5e7eb;
      "
    >
      <p style="margin:0 0 10px;font-size:16px;line-height:1.8;">
        ${escapeHtml(copy.greeting)} ${escapeHtml(name)} 👋
      </p>

      <p style="margin:0;color:#374151;font-size:15px;line-height:1.9;">
        ${escapeHtml(copy.confirmText)}
      </p>
    </div>
  `;

  return emailLayout({
    lang,
    title: copy.confirmTitle,
    intro: copy.confirmText,
    contentHtml,
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

function broadcastHtml({ subject, message, unsubscribeToken = "" }) {
  const unsubscribeUrl = `${APP_BASE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.65;color:#111827;max-width:680px;margin:0 auto;">
      <div style="padding:20px 0;">
        <h1 style="margin:0 0 12px;font-size:24px;">${escapeHtml(subject)}</h1>
        <div style="padding:16px;border:1px solid #e5e7eb;border-radius:12px;background:#f8fafc;white-space:pre-wrap;">${escapeHtml(message)}</div>
      </div>
      <p style="color:#6b7280;font-size:13px;">You are receiving this email because you subscribed on samirprofile.com.</p>
      <p style="color:#6b7280;font-size:13px;">No longer interested? <a href="${unsubscribeUrl}">Unsubscribe here</a>.</p>
    </div>
  `;
}
/** =========================
 * Routes
 * ========================= */
app.get("/", (req, res) => {
  return res.json({
    ok: true,
    service: "contact-api",
    message: "API is running",
    endpoints: ["/api/health", "/api/contact", "/api/newsletter", "/api/feedback"],
  });
});

app.get("/api/contact", (req, res) => {
  return res.json({
    ok: true,
    message: "API is working. Use POST to send messages.",
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
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111;">
          <h2 style="margin:0 0 10px;">${escapeHtml(newsletterSubject(L))}</h2>
          <p style="margin:0 0 8px;"><strong>Email:</strong> ${escapeHtml(cleanEmail)}</p>
          <p style="margin:0;"><strong>Time:</strong> ${new Date().toISOString()}</p>
        </div>
      `,
      text: `Newsletter subscription\n\nEmail: ${cleanEmail}\nTime: ${new Date().toISOString()}`,
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
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111;">
          <h2 style="margin:0 0 10px;">${escapeHtml(feedbackSubject(L))}</h2>
          <p style="margin:0 0 8px;"><strong>Rating:</strong> ${cleanRating}/5</p>
          <p style="margin:0 0 8px;"><strong>Message:</strong></p>
          <div style="padding:12px;border:1px solid #ddd;border-radius:10px;background:#f8f8f8;white-space:pre-wrap;">${escapeHtml(cleanMessage)}</div>
          <p style="margin:10px 0 0;"><strong>Time:</strong> ${new Date().toISOString()}</p>
        </div>
      `,
      text: `Portfolio feedback\n\nRating: ${cleanRating}/5\nMessage:\n${cleanMessage}\n\nTime: ${new Date().toISOString()}`,
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