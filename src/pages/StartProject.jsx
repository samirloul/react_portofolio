import { useMemo, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const API_ROOT = API_BASE_URL
  ? API_BASE_URL.endsWith("/api")
    ? API_BASE_URL
    : `${API_BASE_URL}/api`
  : "/api";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const steps = ["profile", "goals", "content", "budget", "final"];

const copyByLang = {
  en: {
    title: "Start Your Website Project",
    subtitle:
      "A short 5-step intake to understand your goals and create the right website for your business.",
    stepLabel: "Step",
    progressLabel: "Intake progress",
    yes: "Yes",
    no: "No",
    next: "Next step",
    prev: "Previous",
    send: "Send request",
    sending: "Sending...",
    success: "Request sent successfully. I will contact you soon.",
    error: "Something went wrong. Please try again.",
    captchaMissing:
      "reCAPTCHA site key is missing. Add VITE_RECAPTCHA_SITE_KEY and restart Vite.",
    captchaRequired: "Please complete reCAPTCHA first.",
    required: "Required",
    invalidEmail: "Invalid email",
    labels: {
      fullName: "Full name",
      email: "Email",
      businessName: "Business or project name",
      businessStage: "What stage are you in?",
      targetAudience: "Who is your main target audience?",
      hasBranding: "Do you already have a logo/branding?",
      hasDomain: "Do you already have a domain name?",
      primaryGoal: "Main business goal",
      styleDirection: "Preferred style direction",
      needBooking: "Do you need appointment booking?",
      needShop: "Do you need online payments or webshop?",
      needMultilang: "Do you need multiple languages?",
      needBlog: "Do you need blog/news section?",
      contentReady: "Do you already have texts/images ready?",
      needCopywriting: "Do you need help writing website texts?",
      pagesCount: "How many pages do you expect?",
      needCms: "Do you want to edit content yourself later?",
      referenceWebsite: "Reference websites you like",
      budgetRange: "Estimated budget range",
      timeline: "Preferred launch timeline",
      urgent: "Is this project urgent?",
      hasHosting: "Do you already have hosting?",
      needLegalPages: "Do you need legal pages (privacy/cookies)?",
      needAnalytics: "Do you want analytics setup?",
      needIntegrations: "Do you need integrations (WhatsApp/CRM/Calendar)?",
      integrationsDetails: "If yes, which integrations exactly?",
      maintenance: "Do you want monthly maintenance?",
      seo: "Do you want SEO setup from start?",
      launchCampaign: "Do you want support for launch campaign?",
      notes: "Extra details (optional)",
    },
    hints: {
      styleDirection:
        "Style direction means visual mood: modern, luxury, minimal, bold, playful, etc.",
      needCms:
        "CMS means a panel where you can edit texts, images, and pages without coding.",
      needLegalPages:
        "Legal pages are privacy policy, cookie policy, and terms pages required in many cases.",
      needAnalytics:
        "Analytics helps track visitors, traffic sources, and which pages perform best.",
      needIntegrations:
        "Integrations connect your website with external tools like WhatsApp, CRM, booking apps, or newsletter tools.",
      seo:
        "SEO setup includes technical optimization so your website can be found better in Google.",
      launchCampaign:
        "Launch campaign means support for a promo launch with socials/ads/lead capture setup.",
    },
    placeholders: {
      fullName: "Your name",
      email: "you@example.com",
      businessName: "Example: Elegancia Barbershop",
      targetAudience: "Example: local families, students, B2B companies...",
      primaryGoal: "Example: more bookings, trust, more leads...",
      referenceWebsite: "Paste one or more links (optional)",
      integrationsDetails: "Example: WhatsApp button + Calendly + Mailchimp",
      notes:
        "Anything else I should know about style, competitors, must-have features...",
    },
    options: {
      businessStage: ["Just idea", "Starting now", "Already active"],
      styleDirection: ["Modern clean", "Luxury premium", "Minimal", "Bold creative", "Not sure yet"],
      pagesCount: ["1-3 pages", "4-7 pages", "8+ pages"],
      budgetRange: ["Below EUR 750", "EUR 750 - 1500", "EUR 1500 - 3000", "EUR 3000+"],
      timeline: ["As soon as possible", "Within 1 month", "Within 2-3 months", "Flexible"],
    },
  },
  nl: {
    title: "Start Je Website Project",
    subtitle:
      "Een korte intake van 5 stappen zodat ik exact begrijp wat jij wilt voor je website.",
    stepLabel: "Stap",
    progressLabel: "Voortgang intake",
    yes: "Ja",
    no: "Nee",
    next: "Volgende stap",
    prev: "Vorige",
    send: "Verstuur aanvraag",
    sending: "Bezig met versturen...",
    success: "Aanvraag verstuurd. Ik neem snel contact met je op.",
    error: "Er ging iets mis. Probeer opnieuw.",
    captchaMissing:
      "reCAPTCHA site key ontbreekt. Voeg VITE_RECAPTCHA_SITE_KEY toe en herstart Vite.",
    captchaRequired: "Vink eerst reCAPTCHA aan.",
    required: "Verplicht",
    invalidEmail: "Ongeldig e-mailadres",
    labels: {
      fullName: "Volledige naam",
      email: "E-mail",
      businessName: "Bedrijfs- of projectnaam",
      businessStage: "In welke fase zit je?",
      targetAudience: "Wie is jouw belangrijkste doelgroep?",
      hasBranding: "Heb je al logo/branding?",
      hasDomain: "Heb je al een domeinnaam?",
      primaryGoal: "Belangrijkste doel",
      styleDirection: "Voorkeursstijl",
      needBooking: "Moet de website afspraken kunnen inplannen?",
      needShop: "Heb je online betalingen/webshop nodig?",
      needMultilang: "Wil je meerdere talen op de site?",
      needBlog: "Wil je blog/nieuws sectie?",
      contentReady: "Heb je teksten/foto's al klaar?",
      needCopywriting: "Heb je hulp nodig met website teksten?",
      pagesCount: "Hoeveel pagina's verwacht je?",
      needCms: "Wil je later zelf content kunnen aanpassen?",
      referenceWebsite: "Voorbeeldsites die je mooi vindt",
      budgetRange: "Geschat budget",
      timeline: "Gewenste oplevering",
      urgent: "Is dit project urgent?",
      hasHosting: "Heb je al hosting?",
      needLegalPages: "Heb je juridische pagina's nodig (privacy/cookies)?",
      needAnalytics: "Wil je analytics op de website?",
      needIntegrations: "Heb je integraties nodig (WhatsApp/CRM/Agenda)?",
      integrationsDetails: "Zo ja, welke integraties precies?",
      maintenance: "Wil je maandelijkse onderhoud?",
      seo: "Wil je SEO vanaf de start?",
      launchCampaign: "Wil je hulp bij een launch campagne?",
      notes: "Extra details (optioneel)",
    },
    hints: {
      styleDirection:
        "Stijl betekent visuele richting: modern, luxe, minimalistisch, speels, enz.",
      needCms:
        "CMS is een beheeromgeving waarmee je later zelf teksten en foto's kunt aanpassen.",
      needLegalPages:
        "Juridische pagina's zijn o.a. privacybeleid, cookiebeleid en voorwaarden.",
      needAnalytics:
        "Analytics laat zien hoeveel bezoekers je hebt en welke pagina's goed werken.",
      needIntegrations:
        "Integraties verbinden je website met externe tools zoals WhatsApp, CRM, agenda of nieuwsbrief.",
      seo:
        "SEO betekent technische en inhoudelijke optimalisatie voor betere vindbaarheid in Google.",
      launchCampaign:
        "Launch campagne is ondersteuning bij promotie zodra je site live gaat.",
    },
    placeholders: {
      fullName: "Je naam",
      email: "jij@voorbeeld.com",
      businessName: "Bijv: Elegancia Barbershop",
      targetAudience: "Bijv: lokale gezinnen, studenten, ondernemers...",
      primaryGoal: "Bijv: meer boekingen, meer vertrouwen, meer leads...",
      referenceWebsite: "Plak een of meerdere links (optioneel)",
      integrationsDetails: "Bijv: WhatsApp knop + Calendly + Mailchimp",
      notes: "Vertel extra wensen: stijl, concurrenten, must-have functies...",
    },
    options: {
      businessStage: ["Alleen idee", "Net gestart", "Al actief"],
      styleDirection: ["Modern strak", "Luxe premium", "Minimalistisch", "Creatief opvallend", "Nog niet zeker"],
      pagesCount: ["1-3 pagina's", "4-7 pagina's", "8+ pagina's"],
      budgetRange: ["Onder EUR 750", "EUR 750 - 1500", "EUR 1500 - 3000", "EUR 3000+"],
      timeline: ["Zo snel mogelijk", "Binnen 1 maand", "Binnen 2-3 maanden", "Flexibel"],
    },
  },
  ar: {
    title: "ابدأ مشروع موقعك",
    subtitle:
      "نموذج من 5 خطوات حتى أفهم احتياجاتك بدقة وأبني موقع مناسب لك.",
    stepLabel: "الخطوة",
    progressLabel: "تقدم النموذج",
    yes: "نعم",
    no: "لا",
    next: "الخطوة التالية",
    prev: "السابق",
    send: "إرسال الطلب",
    sending: "جارٍ الإرسال...",
    success: "تم إرسال الطلب بنجاح. سأتواصل معك قريبًا.",
    error: "حدث خطأ. حاول مرة أخرى.",
    captchaMissing:
      "مفتاح reCAPTCHA غير موجود. أضف VITE_RECAPTCHA_SITE_KEY ثم أعد تشغيل Vite.",
    captchaRequired: "يرجى إكمال reCAPTCHA أولاً.",
    required: "مطلوب",
    invalidEmail: "بريد إلكتروني غير صالح",
    labels: {
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      businessName: "اسم المشروع أو النشاط",
      businessStage: "في أي مرحلة أنت؟",
      targetAudience: "من هي الفئة المستهدفة الأساسية؟",
      hasBranding: "هل لديك شعار وهوية بصرية؟",
      hasDomain: "هل لديك اسم نطاق؟",
      primaryGoal: "الهدف الرئيسي من الموقع",
      styleDirection: "نمط التصميم المفضل",
      needBooking: "هل تحتاج نظام حجز مواعيد؟",
      needShop: "هل تحتاج متجر/دفع إلكتروني؟",
      needMultilang: "هل تريد الموقع بعدة لغات؟",
      needBlog: "هل تريد قسم مدونة/أخبار؟",
      contentReady: "هل لديك النصوص/الصور جاهزة؟",
      needCopywriting: "هل تحتاج مساعدة في كتابة المحتوى؟",
      pagesCount: "كم صفحة تتوقع؟",
      needCms: "هل تريد تعديل المحتوى بنفسك لاحقًا؟",
      referenceWebsite: "مواقع مرجعية تعجبك",
      budgetRange: "الميزانية المتوقعة",
      timeline: "وقت الإطلاق المفضل",
      urgent: "هل المشروع مستعجل؟",
      hasHosting: "هل لديك استضافة؟",
      needLegalPages: "هل تحتاج صفحات قانونية (خصوصية/كوكيز)؟",
      needAnalytics: "هل تريد إعداد تحليلات للموقع؟",
      needIntegrations: "هل تحتاج تكاملات (واتساب/CRM/تقويم)؟",
      integrationsDetails: "إذا نعم، ما التكاملات المطلوبة؟",
      maintenance: "هل تريد صيانة شهرية؟",
      seo: "هل تريد إعداد SEO من البداية؟",
      launchCampaign: "هل تريد دعم لحملة إطلاق الموقع؟",
      notes: "تفاصيل إضافية (اختياري)",
    },
    hints: {
      styleDirection:
        "نمط التصميم يعني الشكل العام مثل: حديث، فاخر، بسيط، أو إبداعي.",
      needCms:
        "CMS يعني لوحة تحكم تتيح لك تعديل النصوص والصور بدون برمجة.",
      needLegalPages:
        "الصفحات القانونية مثل سياسة الخصوصية وسياسة الكوكيز والشروط.",
      needAnalytics:
        "التحليلات تساعدك على معرفة عدد الزوار ومصادر الزيارات والصفحات الأفضل.",
      needIntegrations:
        "التكاملات تربط الموقع مع أدوات خارجية مثل واتساب وCRM والحجوزات.",
      seo:
        "SEO هو تحسين الموقع تقنيًا ومحتوًى لظهور أفضل في محركات البحث.",
      launchCampaign:
        "حملة الإطلاق تعني دعم تسويقي عند نشر الموقع لأول مرة.",
    },
    placeholders: {
      fullName: "اسمك",
      email: "you@example.com",
      businessName: "مثال: صالون Elegancia",
      targetAudience: "مثال: العائلات المحلية، الطلاب، الشركات...",
      primaryGoal: "مثال: زيادة الحجوزات أو جذب عملاء أكثر...",
      referenceWebsite: "أضف رابط أو أكثر (اختياري)",
      integrationsDetails: "مثال: زر واتساب + Calendly + Mailchimp",
      notes: "أضف أي تفاصيل مهمة عن التصميم أو الميزات المطلوبة...",
    },
    options: {
      businessStage: ["فكرة فقط", "بدأت الآن", "مشروع قائم"],
      styleDirection: ["حديث ونظيف", "فاخر", "بسيط", "إبداعي قوي", "غير متأكد بعد"],
      pagesCount: ["1-3 صفحات", "4-7 صفحات", "8+ صفحات"],
      budgetRange: ["أقل من 750 يورو", "750 - 1500 يورو", "1500 - 3000 يورو", "3000+ يورو"],
      timeline: ["في أسرع وقت", "خلال شهر", "خلال 2-3 أشهر", "مرن"],
    },
  },
};

const initialForm = {
  fullName: "",
  email: "",
  businessName: "",
  businessStage: "",
  targetAudience: "",
  hasBranding: "",
  hasDomain: "",
  primaryGoal: "",
  styleDirection: "",
  needBooking: "",
  needShop: "",
  needMultilang: "",
  needBlog: "",
  contentReady: "",
  needCopywriting: "",
  pagesCount: "",
  needCms: "",
  referenceWebsite: "",
  budgetRange: "",
  timeline: "",
  urgent: "",
  hasHosting: "",
  needLegalPages: "",
  needAnalytics: "",
  needIntegrations: "",
  integrationsDetails: "",
  maintenance: "",
  seo: "",
  launchCampaign: "",
  notes: "",
  website: "",
};

const progressQuestions = [
  "fullName",
  "email",
  "businessName",
  "businessStage",
  "targetAudience",
  "hasBranding",
  "hasDomain",
  "primaryGoal",
  "styleDirection",
  "needBooking",
  "needShop",
  "needMultilang",
  "needBlog",
  "contentReady",
  "needCopywriting",
  "pagesCount",
  "needCms",
  "budgetRange",
  "timeline",
  "urgent",
  "hasHosting",
  "needLegalPages",
  "needAnalytics",
  "needIntegrations",
  "maintenance",
  "seo",
  "launchCampaign",
];

const stepQuestions = {
  profile: [
    "fullName",
    "email",
    "businessName",
    "businessStage",
    "targetAudience",
    "hasBranding",
    "hasDomain",
  ],
  goals: [
    "primaryGoal",
    "styleDirection",
    "needBooking",
    "needShop",
    "needMultilang",
    "needBlog",
  ],
  content: ["contentReady", "needCopywriting", "pagesCount", "needCms", "referenceWebsite"],
  budget: ["budgetRange", "timeline", "urgent", "hasHosting", "needLegalPages"],
  final: [
    "needAnalytics",
    "needIntegrations",
    "integrationsDetails",
    "maintenance",
    "seo",
    "launchCampaign",
    "notes",
  ],
};

function safeJsonParse(text) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

function isQuestionAnswered(value) {
  return String(value || "").trim().length > 0;
}

function Hint({ text }) {
  if (!text) return null;

  return (
    <span className="project-hint" tabIndex={0} aria-label={text}>
      i
      <span className="project-hint-bubble">{text}</span>
    </span>
  );
}

function LabelWithHint({ htmlFor, text, hint }) {
  return (
    <div className="project-label-row">
      <label htmlFor={htmlFor}>{text}</label>
      <Hint text={hint} />
    </div>
  );
}

function YesNoField({ id, label, hint, value, yesText, noText, onChange }) {
  return (
    <div className="project-question">
      <div className="project-label-row">
        <p className="project-question-label">{label}</p>
        <Hint text={hint} />
      </div>
      <div className="project-toggle" role="radiogroup" aria-label={label}>
        <label>
          <input
            type="radio"
            name={id}
            checked={value === "yes"}
            onChange={() => onChange("yes")}
          />
          <span>{yesText}</span>
        </label>
        <label>
          <input
            type="radio"
            name={id}
            checked={value === "no"}
            onChange={() => onChange("no")}
          />
          <span>{noText}</span>
        </label>
      </div>
    </div>
  );
}

function SelectField({ id, label, hint, value, options, onChange }) {
  return (
    <div className="project-question">
      <LabelWithHint htmlFor={id} text={label} hint={hint} />
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">-</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextField({ id, label, hint, value, onChange, placeholder }) {
  return (
    <div className="project-question">
      <LabelWithHint htmlFor={id} text={label} hint={hint} />
      <input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function TextAreaField({ id, label, hint, value, rows, onChange, placeholder }) {
  return (
    <div className="project-question">
      <LabelWithHint htmlFor={id} text={label} hint={hint} />
      <textarea id={id} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

export default function StartProject({ lang = "en" }) {
  const recaptchaRef = useRef(null);
  const copy = copyByLang[lang] || copyByLang.en;
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [serverMsg, setServerMsg] = useState("");

  const progressPercent = useMemo(() => {
    const answered = progressQuestions.filter((key) => isQuestionAnswered(form[key])).length;
    return Math.round((answered / progressQuestions.length) * 100);
  }, [form]);

  const currentStepKey = steps[currentStep];
  const currentQuestions = stepQuestions[currentStepKey] || [];

  const stepProgress = useMemo(() => {
    const answered = currentQuestions.filter((key) => {
      if (key === "integrationsDetails" && form.needIntegrations !== "yes") {
        return true;
      }
      return isQuestionAnswered(form[key]);
    }).length;

    if (!currentQuestions.length) return 0;
    return Math.round((answered / currentQuestions.length) * 100);
  }, [currentQuestions, form]);

  const errors = useMemo(() => {
    const next = {};

    if (!form.fullName.trim()) next.fullName = copy.required;
    if (!form.email.trim()) {
      next.email = copy.required;
    } else if (!emailRegex.test(form.email.trim())) {
      next.email = copy.invalidEmail;
    }

    if (!form.businessName.trim()) next.businessName = copy.required;
    if (!form.businessStage) next.businessStage = copy.required;
    if (!form.targetAudience.trim()) next.targetAudience = copy.required;
    if (!form.hasBranding) next.hasBranding = copy.required;
    if (!form.hasDomain) next.hasDomain = copy.required;
    if (!form.primaryGoal.trim()) next.primaryGoal = copy.required;
    if (!form.styleDirection) next.styleDirection = copy.required;
    if (!form.needBooking) next.needBooking = copy.required;
    if (!form.needShop) next.needShop = copy.required;
    if (!form.needMultilang) next.needMultilang = copy.required;
    if (!form.needBlog) next.needBlog = copy.required;
    if (!form.contentReady) next.contentReady = copy.required;
    if (!form.needCopywriting) next.needCopywriting = copy.required;
    if (!form.pagesCount) next.pagesCount = copy.required;
    if (!form.needCms) next.needCms = copy.required;
    if (!form.budgetRange) next.budgetRange = copy.required;
    if (!form.timeline) next.timeline = copy.required;
    if (!form.urgent) next.urgent = copy.required;
    if (!form.hasHosting) next.hasHosting = copy.required;
    if (!form.needLegalPages) next.needLegalPages = copy.required;
    if (!form.needAnalytics) next.needAnalytics = copy.required;
    if (!form.needIntegrations) next.needIntegrations = copy.required;
    if (form.needIntegrations === "yes" && !form.integrationsDetails.trim()) {
      next.integrationsDetails = copy.required;
    }
    if (!form.maintenance) next.maintenance = copy.required;
    if (!form.seo) next.seo = copy.required;
    if (!form.launchCampaign) next.launchCampaign = copy.required;

    return next;
  }, [form, copy]);

  const canGoNext = currentQuestions.every((key) => {
    if (key === "integrationsDetails" && form.needIntegrations !== "yes") {
      return true;
    }
    return !errors[key];
  });

  const canSubmit = status !== "sending" && Object.keys(errors).length === 0;

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    if (status === "success" || status === "error") {
      setStatus("idle");
      setServerMsg("");
    }
  };

  const goNext = () => {
    if (!canGoNext) return;
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goPrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerMsg("");

    if (Object.keys(errors).length > 0) {
      return;
    }

    if (form.website) {
      setStatus("success");
      setForm(initialForm);
      setCurrentStep(0);
      return;
    }

    if (!SITE_KEY) {
      setStatus("error");
      setServerMsg(copy.captchaMissing);
      return;
    }

    const recaptchaToken = recaptchaRef.current?.getValue();

    if (!recaptchaToken) {
      setStatus("error");
      setServerMsg(copy.captchaRequired);
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch(`${API_ROOT}/project-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          lang,
          recaptchaToken,
        }),
      });

      const text = await response.text();
      const data = safeJsonParse(text);

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || `Request failed (${response.status})`);
      }

      recaptchaRef.current?.reset();
      setStatus("success");
      setForm(initialForm);
      setCurrentStep(0);
    } catch (error) {
      recaptchaRef.current?.reset();
      setStatus("error");
      setServerMsg(error?.message || copy.error);
    }
  };

  const renderQuestionProgress = (key) => {
    let answered = isQuestionAnswered(form[key]);

    if (key === "integrationsDetails" && form.needIntegrations !== "yes") {
      answered = true;
    }

    return (
      <div className="project-question-progress" aria-hidden="true">
        <div
          className="project-question-progress-bar"
          style={{ width: answered ? "100%" : "0%" }}
        />
      </div>
    );
  };

  const hint = (key) => copy.hints?.[key];

  const renderStep = () => {
    if (currentStepKey === "profile") {
      return (
        <>
          <TextField
            id="fullName"
            label={copy.labels.fullName}
            value={form.fullName}
            onChange={(value) => setField("fullName", value)}
            placeholder={copy.placeholders.fullName}
          />
          {renderQuestionProgress("fullName")}

          <div className="project-question">
            <LabelWithHint htmlFor="email" text={copy.labels.email} />
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder={copy.placeholders.email}
            />
          </div>
          {renderQuestionProgress("email")}

          <TextField
            id="businessName"
            label={copy.labels.businessName}
            value={form.businessName}
            onChange={(value) => setField("businessName", value)}
            placeholder={copy.placeholders.businessName}
          />
          {renderQuestionProgress("businessName")}

          <SelectField
            id="businessStage"
            label={copy.labels.businessStage}
            value={form.businessStage}
            options={copy.options.businessStage}
            onChange={(value) => setField("businessStage", value)}
          />
          {renderQuestionProgress("businessStage")}

          <TextField
            id="targetAudience"
            label={copy.labels.targetAudience}
            value={form.targetAudience}
            onChange={(value) => setField("targetAudience", value)}
            placeholder={copy.placeholders.targetAudience}
          />
          {renderQuestionProgress("targetAudience")}

          <YesNoField
            id="hasBranding"
            label={copy.labels.hasBranding}
            value={form.hasBranding}
            yesText={copy.yes}
            noText={copy.no}
            onChange={(value) => setField("hasBranding", value)}
          />
          {renderQuestionProgress("hasBranding")}

          <YesNoField
            id="hasDomain"
            label={copy.labels.hasDomain}
            value={form.hasDomain}
            yesText={copy.yes}
            noText={copy.no}
            onChange={(value) => setField("hasDomain", value)}
          />
          {renderQuestionProgress("hasDomain")}
        </>
      );
    }

    if (currentStepKey === "goals") {
      return (
        <>
          <TextAreaField
            id="primaryGoal"
            label={copy.labels.primaryGoal}
            value={form.primaryGoal}
            rows={3}
            onChange={(value) => setField("primaryGoal", value)}
            placeholder={copy.placeholders.primaryGoal}
          />
          {renderQuestionProgress("primaryGoal")}

          <SelectField
            id="styleDirection"
            label={copy.labels.styleDirection}
            hint={hint("styleDirection")}
            value={form.styleDirection}
            options={copy.options.styleDirection}
            onChange={(value) => setField("styleDirection", value)}
          />
          {renderQuestionProgress("styleDirection")}

          <YesNoField
            id="needBooking"
            label={copy.labels.needBooking}
            value={form.needBooking}
            yesText={copy.yes}
            noText={copy.no}
            onChange={(value) => setField("needBooking", value)}
          />
          {renderQuestionProgress("needBooking")}

          <YesNoField
            id="needShop"
            label={copy.labels.needShop}
            value={form.needShop}
            yesText={copy.yes}
            noText={copy.no}
            onChange={(value) => setField("needShop", value)}
          />
          {renderQuestionProgress("needShop")}

          <YesNoField
            id="needMultilang"
            label={copy.labels.needMultilang}
            value={form.needMultilang}
            yesText={copy.yes}
            noText={copy.no}
            onChange={(value) => setField("needMultilang", value)}
          />
          {renderQuestionProgress("needMultilang")}

          <YesNoField
            id="needBlog"
            label={copy.labels.needBlog}
            value={form.needBlog}
            yesText={copy.yes}
            noText={copy.no}
            onChange={(value) => setField("needBlog", value)}
          />
          {renderQuestionProgress("needBlog")}
        </>
      );
    }

    if (currentStepKey === "content") {
      return (
        <>
          <YesNoField
            id="contentReady"
            label={copy.labels.contentReady}
            value={form.contentReady}
            yesText={copy.yes}
            noText={copy.no}
            onChange={(value) => setField("contentReady", value)}
          />
          {renderQuestionProgress("contentReady")}

          <YesNoField
            id="needCopywriting"
            label={copy.labels.needCopywriting}
            value={form.needCopywriting}
            yesText={copy.yes}
            noText={copy.no}
            onChange={(value) => setField("needCopywriting", value)}
          />
          {renderQuestionProgress("needCopywriting")}

          <SelectField
            id="pagesCount"
            label={copy.labels.pagesCount}
            value={form.pagesCount}
            options={copy.options.pagesCount}
            onChange={(value) => setField("pagesCount", value)}
          />
          {renderQuestionProgress("pagesCount")}

          <YesNoField
            id="needCms"
            label={copy.labels.needCms}
            hint={hint("needCms")}
            value={form.needCms}
            yesText={copy.yes}
            noText={copy.no}
            onChange={(value) => setField("needCms", value)}
          />
          {renderQuestionProgress("needCms")}

          <TextField
            id="referenceWebsite"
            label={copy.labels.referenceWebsite}
            value={form.referenceWebsite}
            onChange={(value) => setField("referenceWebsite", value)}
            placeholder={copy.placeholders.referenceWebsite}
          />
          {renderQuestionProgress("referenceWebsite")}
        </>
      );
    }

    if (currentStepKey === "budget") {
      return (
        <>
          <SelectField
            id="budgetRange"
            label={copy.labels.budgetRange}
            value={form.budgetRange}
            options={copy.options.budgetRange}
            onChange={(value) => setField("budgetRange", value)}
          />
          {renderQuestionProgress("budgetRange")}

          <SelectField
            id="timeline"
            label={copy.labels.timeline}
            value={form.timeline}
            options={copy.options.timeline}
            onChange={(value) => setField("timeline", value)}
          />
          {renderQuestionProgress("timeline")}

          <YesNoField
            id="urgent"
            label={copy.labels.urgent}
            value={form.urgent}
            yesText={copy.yes}
            noText={copy.no}
            onChange={(value) => setField("urgent", value)}
          />
          {renderQuestionProgress("urgent")}

          <YesNoField
            id="hasHosting"
            label={copy.labels.hasHosting}
            value={form.hasHosting}
            yesText={copy.yes}
            noText={copy.no}
            onChange={(value) => setField("hasHosting", value)}
          />
          {renderQuestionProgress("hasHosting")}

          <YesNoField
            id="needLegalPages"
            label={copy.labels.needLegalPages}
            hint={hint("needLegalPages")}
            value={form.needLegalPages}
            yesText={copy.yes}
            noText={copy.no}
            onChange={(value) => setField("needLegalPages", value)}
          />
          {renderQuestionProgress("needLegalPages")}
        </>
      );
    }

    return (
      <>
        <YesNoField
          id="needAnalytics"
          label={copy.labels.needAnalytics}
          hint={hint("needAnalytics")}
          value={form.needAnalytics}
          yesText={copy.yes}
          noText={copy.no}
          onChange={(value) => setField("needAnalytics", value)}
        />
        {renderQuestionProgress("needAnalytics")}

        <YesNoField
          id="needIntegrations"
          label={copy.labels.needIntegrations}
          hint={hint("needIntegrations")}
          value={form.needIntegrations}
          yesText={copy.yes}
          noText={copy.no}
          onChange={(value) => setField("needIntegrations", value)}
        />
        {renderQuestionProgress("needIntegrations")}

        {form.needIntegrations === "yes" && (
          <>
            <TextField
              id="integrationsDetails"
              label={copy.labels.integrationsDetails}
              value={form.integrationsDetails}
              onChange={(value) => setField("integrationsDetails", value)}
              placeholder={copy.placeholders.integrationsDetails}
            />
            {renderQuestionProgress("integrationsDetails")}
          </>
        )}

        <YesNoField
          id="maintenance"
          label={copy.labels.maintenance}
          value={form.maintenance}
          yesText={copy.yes}
          noText={copy.no}
          onChange={(value) => setField("maintenance", value)}
        />
        {renderQuestionProgress("maintenance")}

        <YesNoField
          id="seo"
          label={copy.labels.seo}
          hint={hint("seo")}
          value={form.seo}
          yesText={copy.yes}
          noText={copy.no}
          onChange={(value) => setField("seo", value)}
        />
        {renderQuestionProgress("seo")}

        <YesNoField
          id="launchCampaign"
          label={copy.labels.launchCampaign}
          hint={hint("launchCampaign")}
          value={form.launchCampaign}
          yesText={copy.yes}
          noText={copy.no}
          onChange={(value) => setField("launchCampaign", value)}
        />
        {renderQuestionProgress("launchCampaign")}

        <TextAreaField
          id="notes"
          label={copy.labels.notes}
          value={form.notes}
          rows={4}
          onChange={(value) => setField("notes", value)}
          placeholder={copy.placeholders.notes}
        />
        {renderQuestionProgress("notes")}

        <div className="honeypot-field">
          <label htmlFor="project-website">Website</label>
          <input
            id="project-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => setField("website", e.target.value)}
          />
        </div>

        <div className="recaptcha-wrap">
          <ReCAPTCHA ref={recaptchaRef} sitekey={SITE_KEY || ""} hl={lang} />
        </div>
      </>
    );
  };

  return (
    <section className="project-intake-page">
      <header className="project-intake-header">
        <p className="project-kicker">Website Intake</p>
        <h1>{copy.title}</h1>
        <p>{copy.subtitle}</p>
      </header>

      <div className="project-intake-progress-wrap" aria-label={copy.progressLabel}>
        <div className="project-intake-progress-head">
          <span>{copy.progressLabel}</span>
          <strong>{progressPercent}%</strong>
        </div>
        <div className="project-intake-progress">
          <div style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <form className="project-intake-card" onSubmit={handleSubmit} noValidate>
        <div className="project-step-head">
          <p>
            {copy.stepLabel} {currentStep + 1}/5
          </p>
          <span>{stepProgress}%</span>
        </div>

        <div className="project-intake-progress thin">
          <div style={{ width: `${stepProgress}%` }} />
        </div>

        <div className="project-step-questions">{renderStep()}</div>

        <div className="project-step-actions">
          <button className="btn outline" type="button" onClick={goPrev} disabled={currentStep === 0}>
            {copy.prev}
          </button>

          {currentStep < steps.length - 1 ? (
            <button className="btn primary" type="button" onClick={goNext} disabled={!canGoNext}>
              {copy.next}
            </button>
          ) : (
            <button className="btn primary" type="submit" disabled={!canSubmit}>
              {status === "sending" ? copy.sending : copy.send}
            </button>
          )}
        </div>

        {(status === "success" || status === "error") && (
          <p className={`project-status ${status}`}>
            {status === "success" ? copy.success : serverMsg || copy.error}
          </p>
        )}
      </form>
    </section>
  );
}
