// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { Resend } from "resend";

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

/** =========================
 *  Config
 *  ========================= */
const PORT = process.env.PORT || 8080;
const TO_EMAIL = process.env.TO_EMAIL || "sameerloul2010@gmail.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "Samir Loul <onboarding@resend.dev>";
const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || "*"; // later: zet je echte domein

app.use(
  cors({
    origin: ALLOWED_ORIGIN,
  })
);
app.use(express.json({ limit: "200kb" }));

// anti-spam (rate limit)
app.use(
  "/api/contact",
  rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/** =========================
 *  Helpers
 *  ========================= */
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// super basic email check
function isValidEmail(email = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function clampLen(s = "", max = 2000) {
  const str = String(s);
  return str.length > max ? str.slice(0, max) : str;
}

function normalizeLang(lang) {
  const l = String(lang || "").toLowerCase();
  if (l === "ar") return "ar";
  if (l === "nl") return "nl";
  return "en";
}

/** =========================
 *  Social links + SVG icons (werkt in email clients)
 *  ========================= */
const SOCIAL = [
  {
    key: "x",
    label: { en: "X", nl: "X", ar: "إكس" },
    href: "https://x.com/samirloul",
    svg: (color) => `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2H21.56l-7.29 8.337L22.8 22h-6.67l-5.22-6.81L4.95 22H1.63l7.8-8.92L1.2 2h6.84l4.72 6.23L18.244 2Zm-1.17 18h1.84L6.86 3.88H4.89L17.074 20Z"/>
      </svg>`,
  },
  {
    key: "instagram",
    label: { en: "Instagram", nl: "Instagram", ar: "إنستغرام" },
    href: "https://www.instagram.com/samirloul/",
    svg: (color) => `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 4.5A5.5 5.5 0 1 1 6.5 14 5.5 5.5 0 0 1 12 8.5Zm0 2A3.5 3.5 0 1 0 15.5 14 3.5 3.5 0 0 0 12 10.5ZM18 6.75a1.25 1.25 0 1 1-1.25 1.25A1.25 1.25 0 0 1 18 6.75Z"/>
      </svg>`,
  },
  {
    key: "tiktok",
    label: { en: "TikTok", nl: "TikTok", ar: "تيك توك" },
    href: "https://www.tiktok.com/@samirloul1",
    svg: (color) => `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.7 5.6a4.8 4.8 0 0 0 2.9 1V9a7.5 7.5 0 0 1-3-0.7v7.3a6.2 6.2 0 1 1-5.8-6.2v2.6a3.6 3.6 0 1 0 3.2 3.6V2h2.7c0.1 1.5 0.6 2.6 1 3.6Z"/>
      </svg>`,
  },
  {
    key: "threads",
    label: { en: "Threads", nl: "Threads", ar: "ثريدز" },
    href: "https://www.threads.net/@samirloul",
    svg: (color) => `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2c5 0 9 4 9 9 0 5.6-3.7 11-9 11S3 16.6 3 11c0-5 4-9 9-9Zm0 2C8.1 4 5 7.1 5 11c0 4.6 3.1 9 7 9s7-4.4 7-9c0-3.9-3.1-7-7-7Zm.2 4.3c2.4 0 4.2 1.3 4.7 3.3l-2 .6c-.3-1.1-1.2-1.8-2.7-1.8-1.8 0-3 .9-3 2.2 0 1.2.8 1.9 2.3 2.2l1.6.3c2.1.4 3.5 1.6 3.5 3.6 0 2.3-2 4-4.9 4-2.6 0-4.6-1.3-5.2-3.6l2.1-.5c.4 1.4 1.6 2.1 3.1 2.1 1.7 0 2.7-.8 2.7-1.9 0-1-.7-1.6-2.2-1.9l-1.7-.3c-2.2-.4-3.6-1.8-3.6-3.9 0-2.4 2.1-4.1 5-4.1Z"/>
      </svg>`,
  },
];

function socialButtonsHTML(lang, { pillBg = "#ffffff", border = "#e5e7eb", text = "#111827", icon = "#4f46e5" } = {}) {
  return SOCIAL.map((s) => {
    const label = s.label[lang] || s.label.en;
    const svg = s.svg(icon);
    return `
      <a href="${s.href}"
        style="display:inline-block;margin:6px 8px 0 0;padding:10px 12px;border-radius:999px;border:1px solid ${border};
               background:${pillBg};color:${text};text-decoration:none;font-family:Arial,sans-serif;font-size:13px;line-height:1;">
        <span style="display:inline-block;vertical-align:middle;margin-right:8px;">${svg}</span>
        <span style="display:inline-block;vertical-align:middle;">${escapeHtml(label)} ↗</span>
      </a>
    `;
  }).join("");
}

/** =========================
 *  i18n strings for emails
 *  ========================= */
const MAIL_TEXT = {
  en: {
    you_title: "New message from your portfolio",
    you_sub: "Someone sent you a message from your website contact form.",
    you_sender: "Sender",
    you_message: "Message",
    you_reply: "Reply",

    user_top: "Thanks for your message",
    user_hi: (name) => `Hi ${name}! ✅`,
    user_body:
      "I received your message and I usually reply within <b>24 hours</b>.",
    user_contact: "Contact",
    user_follow: "Follow me",
    user_auto: "This is an automatic confirmation email.",

    labels: { name: "Name", email: "Email", subject: "Subject" },
    footer: "Samir Loul • Portfolio",
  },
  nl: {
    you_title: "Nieuw bericht via je portfolio",
    you_sub: "Iemand heeft je een bericht gestuurd via je website contactformulier.",
    you_sender: "Afzender",
    you_message: "Bericht",
    you_reply: "Beantwoord",

    user_top: "Bedankt voor je bericht",
    user_hi: (name) => `Hoi ${name}! ✅`,
    user_body:
      "Ik heb je bericht ontvangen en reageer meestal binnen <b>24 uur</b>.",
    user_contact: "Contact",
    user_follow: "Volg mij",
    user_auto: "Dit is een automatische bevestiging.",

    labels: { name: "Naam", email: "E-mail", subject: "Onderwerp" },
    footer: "Samir Loul • Portfolio",
  },
  ar: {
    you_title: "رسالة جديدة من موقعك",
    you_sub: "قام شخص بإرسال رسالة عبر نموذج التواصل في موقعك.",
    you_sender: "المرسل",
    you_message: "الرسالة",
    you_reply: "الرد",

    user_top: "شكرًا لتواصلك",
    user_hi: (name) => `مرحبًا ${name}! ✅`,
    user_body:
      "تم استلام رسالتك وسأقوم بالرد عادة خلال <b>24 ساعة</b>.",
    user_contact: "معلومات التواصل",
    user_follow: "تابعني",
    user_auto: "هذه رسالة تأكيد تلقائية.",

    labels: { name: "الاسم", email: "البريد الإلكتروني", subject: "الموضوع" },
    footer: "سمير لول • Portfolio",
  },
};

/** =========================
 *  Templates
 *  ========================= */
function emailToYouTemplate({ name, email, subject, message, lang = "en" }) {
  const T = MAIL_TEXT[lang] || MAIL_TEXT.en;

  const safeSubject = escapeHtml(subject || "No subject");
  const safeMsg = escapeHtml(message || "").replaceAll("\n", "<br/>");

  const replySubject = encodeURIComponent(`Re: ${subject || "Your message"}`);
  const replyHref = `mailto:${escapeHtml(email)}?subject=${replySubject}`;

  return `
  <div style="margin:0;padding:0;background:#f5f7fb;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fb;padding:26px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="width:640px;max-width:640px;background:#ffffff;border-radius:18px;border:1px solid #e5e7eb;overflow:hidden;">
            
            <tr>
              <td style="padding:18px 20px;background:linear-gradient(135deg,#4f46e5,#a855f7);color:#fff;">
                <div style="font-family:Arial,sans-serif;font-size:14px;opacity:.92;">${escapeHtml(T.you_title)}</div>
                <div style="font-family:Arial,sans-serif;font-size:20px;font-weight:800;margin-top:4px;">
                  ${safeSubject}
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 20px;font-family:Arial,sans-serif;color:#111827;">
                <p style="margin:0 0 12px;color:#374151;line-height:1.6;">
                  ${T.you_sub}
                </p>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:10px 0 14px;">
                  <tr>
                    <td style="padding:12px;border:1px solid #e5e7eb;border-radius:14px;background:#f9fafb;">
                      <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;">${escapeHtml(
                        T.you_sender
                      )}</div>
                      <div style="margin-top:6px;font-size:14px;line-height:1.7;">
                        <b style="color:#111827;">${escapeHtml(
                          T.labels.name
                        )}:</b> ${escapeHtml(name)}<br/>
                        <b style="color:#111827;">${escapeHtml(
                          T.labels.email
                        )}:</b>
                        <a href="mailto:${escapeHtml(email)}" style="color:#4f46e5;text-decoration:none;">${escapeHtml(
                          email
                        )}</a><br/>
                        <b style="color:#111827;">${escapeHtml(
                          T.labels.subject
                        )}:</b> ${safeSubject}
                      </div>
                    </td>
                  </tr>
                </table>

                <div style="padding:14px;border:1px solid #e5e7eb;border-radius:14px;background:#ffffff;">
                  <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;">${escapeHtml(
                    T.you_message
                  )}</div>
                  <div style="margin-top:10px;font-size:14px;line-height:1.75;color:#111827;">
                    ${safeMsg || "<i style='color:#6b7280'>No message</i>"}
                  </div>
                </div>

                <div style="margin-top:16px;">
                  <a href="${replyHref}"
                     style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:10px 14px;border-radius:999px;font-weight:800;font-size:14px;">
                    ${escapeHtml(T.you_reply)} ↩
                  </a>
                </div>

                <p style="margin:16px 0 0;color:#9ca3af;font-size:12px;line-height:1.6;">
                  ${escapeHtml(T.footer)}
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>`;
}

function autoReplyTemplate({ name, lang = "en" }) {
  const L = normalizeLang(lang);
  const T = MAIL_TEXT[L] || MAIL_TEXT.en;

  const safeName = escapeHtml(name || "there");

  // AR: rtl + Cairo font (werkt als fallback; niet elke client laadt fonts)
  const isRTL = L === "ar";
  const dir = isRTL ? "rtl" : "ltr";
  const align = isRTL ? "right" : "left";
  const font = isRTL
    ? `'Cairo', Arial, sans-serif`
    : `Arial, sans-serif`;

  return `
  <div style="margin:0;padding:0;background:#f5f7fb;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fb;padding:26px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="width:640px;max-width:640px;background:#ffffff;border-radius:18px;border:1px solid #e5e7eb;overflow:hidden;" dir="${dir}">
            
            <tr>
              <td style="padding:18px 20px;background:linear-gradient(135deg,#4f46e5,#a855f7);color:#fff;text-align:${align};font-family:${font};">
                <div style="font-size:14px;opacity:.92;">${escapeHtml(T.user_top)}</div>
                <div style="font-size:20px;font-weight:900;margin-top:4px;">
                  ${T.user_hi(safeName)}
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 20px;color:#111827;text-align:${align};font-family:${font};">
                <p style="margin:0 0 12px;color:#374151;line-height:1.75;">
                  ${T.user_body}
                </p>

                <div style="padding:14px;border:1px solid #e5e7eb;border-radius:14px;background:#f9fafb;">
                  <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;">${escapeHtml(
                    T.user_contact
                  )}</div>
                  <div style="margin-top:8px;font-size:14px;line-height:1.75;">
                    Email:
                    <a href="mailto:${escapeHtml(TO_EMAIL)}" style="color:#4f46e5;text-decoration:none;">
                      ${escapeHtml(TO_EMAIL)}
                    </a><br/>
                    ${isRTL ? "الموقع" : "Location"}: ${isRTL ? "هولندا" : "Netherlands"}
                  </div>
                </div>

                <div style="margin-top:16px;">
                  <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;">
                    ${escapeHtml(T.user_follow)}
                  </div>

                  ${socialButtonsHTML(L, {
                    pillBg: "#ffffff",
                    border: "#e5e7eb",
                    text: "#111827",
                    icon: "#4f46e5",
                  })}
                </div>

                <p style="margin:16px 0 0;color:#9ca3af;font-size:12px;line-height:1.6;">
                  ${escapeHtml(T.user_auto)}
                </p>

                <p style="margin:10px 0 0;color:#9ca3af;font-size:12px;">
                  ${escapeHtml(T.footer)}
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>`;
}

/** =========================
 *  Routes
 *  ========================= */
app.get("/api/contact", (req, res) => {
  res.json({ ok: true, message: "API is working. Use POST to send messages." });
});

app.post("/api/contact", async (req, res) => {
  try {
    const {
      name,
      email,
      subject = "",
      message,
      website = "",
      lang = "en", // IMPORTANT: stuur dit vanuit React mee (en/nl/ar)
    } = req.body || {};

    // honeypot (anti-bot): als "website" ingevuld is => bot
    if (website) return res.status(200).json({ ok: true });

    const L = normalizeLang(lang);

    // basic validation
    const cleanName = clampLen(String(name || "").trim(), 80);
    const cleanEmail = clampLen(String(email || "").trim(), 120);
    const cleanSubject = clampLen(String(subject || "").trim(), 120);
    const cleanMessage = clampLen(String(message || "").trim(), 5000);

    if (!cleanName || !cleanEmail || !cleanMessage) {
      return res.status(400).json({ ok: false, error: "Missing fields" });
    }
    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ ok: false, error: "Invalid email" });
    }
    if (cleanMessage.length < 10) {
      return res
        .status(400)
        .json({ ok: false, error: "Message too short" });
    }

    // 1) mail naar jou (admin)
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: cleanEmail,
      subject: `Website contact: ${cleanSubject || "No subject"} — ${cleanName}`,
      html: emailToYouTemplate({
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

    // 2) auto reply naar gebruiker (zelfde taal als website)
    await resend.emails.send({
      from: FROM_EMAIL,
      to: cleanEmail,
      subject:
        L === "nl"
          ? "Bedankt! Ik heb je bericht ontvangen ✅"
          : L === "ar"
          ? "شكرًا! تم استلام رسالتك ✅"
          : "Thanks! I received your message ✅",
      html: autoReplyTemplate({ name: cleanName, lang: L }),
      text:
        L === "nl"
          ? `Hoi ${cleanName},

Bedankt voor je bericht! Ik reageer meestal binnen 24 uur.

Samir Loul
${TO_EMAIL}`
          : L === "ar"
          ? `مرحبًا ${cleanName}

شكرًا لرسالتك! عادةً أرد خلال 24 ساعة.

سمير لول
${TO_EMAIL}`
          : `Hi ${cleanName},

Thanks for your message! I usually reply within 24 hours.

Samir Loul
${TO_EMAIL}`,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

/** =========================
 *  Start
 *  ========================= */
app.listen(PORT, () => console.log("API running on", PORT));
