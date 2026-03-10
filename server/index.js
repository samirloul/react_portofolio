import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { Resend } from "resend";

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

const TO_EMAIL = process.env.TO_EMAIL || "sameerloul2010@gmail.com";
const FROM_EMAIL =
  process.env.FROM_EMAIL || "Samir Loul <no-reply@samirprofile.com>";
    const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || "*";
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

console.log("ENV check:");
console.log("- RESEND_API_KEY set?", !!process.env.RESEND_API_KEY);
console.log("- RECAPTCHA_SECRET_KEY set?", !!RECAPTCHA_SECRET_KEY);
console.log("- TO_EMAIL:", TO_EMAIL);
console.log("- FROM_EMAIL:", FROM_EMAIL);
console.log("- CORS_ORIGIN:", ALLOWED_ORIGIN);

/** =========================
 * Middleware
 * ========================= */
app.use(
  cors({
    origin: ALLOWED_ORIGIN === "*" ? true : ALLOWED_ORIGIN,
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
/** =========================
 * Routes
 * ========================= */
app.get("/api/contact", (req, res) => {
  return res.json({
    ok: true,
    message: "API is working. Use POST to send messages.",
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

/** =========================
 * Start
 * ========================= */
app.listen(PORT, () => {
  console.log("API running on", PORT);
});