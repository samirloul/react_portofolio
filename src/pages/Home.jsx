import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Counter from "../components/Counter";
import FunFacts from "./FunFacts";
import VisitorStats from "../components/VisitorStats";
import NewsletterSignup from "../components/NewsletterSignup";
import FeedbackForm from "../components/FeedbackForm";
import BlogPreview from "../components/BlogPreview";
import ExploreUniverse from "../components/ExploreUniverse.jsx";
import "../styles/cinematic.css";
import "../styles/cinematic-refined.css";

const copy = {
  en: { eyebrow:"DEVELOPER / CREATOR", headline:"Building Digital Experiences.", second:"One Line of Code at a Time.", projects:"Explore my projects", about:"Discover my story", together:"Let's work together", work:"Selected work", expertise:"My expertise", journey:"The journey", contact:"Let's Build Something Remarkable.", contactSub:"Have an idea? Let's turn it into reality.", next:"Discover more", scene:"Interactive developer workstation" },
  nl: { eyebrow:"DEVELOPER / MAKER", headline:"Digitale ervaringen bouwen.", second:"Regel voor regel code.", projects:"Bekijk mijn projecten", about:"Ontdek mijn verhaal", together:"Laten we samenwerken", work:"Geselecteerd werk", expertise:"Mijn expertise", journey:"Mijn ontwikkeling", contact:"Laten we iets bijzonders bouwen.", contactSub:"Heb je een idee? Laten we het samen realiseren.", next:"Ontdek meer", scene:"Interactief digitaal werkstation" },
  ar: { eyebrow:"مطور برمجيات / صانع", headline:"أصنع تجارب رقمية مميزة.", second:"سطر برمجي تلو الآخر.", projects:"استكشف مشاريعي", about:"تعرف على قصتي", together:"لنعمل معًا", work:"أعمال مختارة", expertise:"خبراتي التقنية", journey:"رحلتي", contact:"لنصنع شيئًا استثنائيًا.", contactSub:"لديك فكرة؟ لنحوّلها إلى واقع.", next:"اكتشف المزيد", scene:"مساحة عمل رقمية تفاعلية" }
};
const clamp = (v) => Math.max(0, Math.min(1, v));
function useStoryProgress(ref) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const calculate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const length = Math.max(1, rect.height - innerHeight);
        setProgress(clamp(-rect.top / length));
      });
    };
    calculate();
    addEventListener("scroll", calculate, { passive: true });
    addEventListener("resize", calculate);
    return () => { removeEventListener("scroll", calculate); removeEventListener("resize", calculate); cancelAnimationFrame(frame); };
  }, [ref]);
  return progress;
}
function DeveloperWorkstation({ progress, label }) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(media.matches);
    change(); media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  const rotation = reduced ? 0 : -15 + progress * 24;
  const screen = progress < .39 ? "code" : progress < .72 ? "projects" : "connect";
  return <div className="cin-device-stage" aria-hidden="true" title={label}>
    <div className="cin-device" style={{ "--cin-rotation": rotation+"deg", "--cin-rise": (reduced ? 0 : progress * -24)+"px" }}>
      <div className="cin-screen-shell">
        <div className="cin-screen">
          <div className="cin-screen-top"><span className="cin-lights"><i/><i/><i/></span><span>samir / developer</span><span>●</span></div>
          {screen === "code" ? <div className="cin-editor"><div className="cin-line"><b>const</b> developer = {"{"}</div><div className="cin-line ind">name: <em>"Samir Loul"</em>,</div><div className="cin-line ind">role: <em>"Software Developer"</em>,</div><div className="cin-line ind">stack: [<em>"React"</em>, <em>"PHP"</em>,</div><div className="cin-line ind two"><em>"Laravel"</em>, <em>"MySQL"</em>]</div><div className="cin-line">{"}"};</div><div className="cin-line"><b>build</b>(<em>"the future"</em>);<span className="cin-cursor">▍</span></div></div>
          : screen === "projects" ? <div className="cin-mini-preview"><div className="cin-mini-label">SELECTED WORK / 2026</div><div className="cin-mini-title">Creative systems.<br/>Real solutions.</div><div className="cin-mini-panels"><span/><span/><span/></div></div>
          : <div className="cin-mini-preview cin-contact-preview"><div className="cin-mini-label">CONNECTION ESTABLISHED</div><div className="cin-mini-title">Let's create<br/>something great.</div><div className="cin-mini-connect">samirprofile.com ↗</div></div>}
        </div>
      </div>
      <div className="cin-base"><div className="cin-keyboard"/><div className="cin-trackpad"/></div>
    </div>
    <span className="cin-orb cin-orb-a"/><span className="cin-orb cin-orb-b"/>
  </div>;
}
function Section({ index, eyebrow, title, children, className="" }) {
  return <section className={`cin-section ${className}`}><div className="cin-section-inner"><p className="cin-kicker"><span>{String(index).padStart(2,"0")}</span> / {eyebrow}</p><h2 className="cin-section-title">{title}</h2>{children}</div></section>;
}
export default function Home({ t, lang="en" }) {
  const c = copy[lang] || copy.en;
  const storyRef = useRef(null);
  useEffect(() => {
    const nodes = storyRef.current?.querySelectorAll(".cin-section, .cin-work-card, .cin-tech-tile");
    if (!nodes || !("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("cin-seen"); observer.unobserve(entry.target); } }), {threshold: .1});
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  const progress = useStoryProgress(storyRef);
  const cards = (t?.projects?.cards || []).filter(p => p?.title).slice(0, 3);
  const categories = ["backend","frontend","security","tools"].flatMap(k => t?.skills?.[k]?.items || []).filter(v => typeof v === "string").slice(0, 12);
  const experience = (t?.experience?.items || []).slice(0, 3);
  const fallback = {en:["Projects Built","Years of Passion","Skills Mastered","Dedication"],nl:["Projecten gebouwd","Jaren passie","Vaardigheden","Toewijding"],ar:["مشاريع","سنوات الشغف","المهارات","الالتزام"]};
  const stats = t?.stats?.items || (fallback[lang]||fallback.en).map(label=>({label,suffix:"+"}));
  return <div className="cin-home" ref={storyRef}>
    <div className="cin-noise" aria-hidden="true"/>
    <div className="cin-device-wrap"><DeveloperWorkstation progress={progress} label={c.scene}/></div>
    <section className="cin-hero">
      <div className="cin-hero-content"><p className="cin-kicker">01 / {c.eyebrow}</p><p className="cin-intro-wordmark">SAMIR LOUL <span>— SOFTWARE DEVELOPER</span></p><h1>{c.headline}<span>{c.second}</span></h1><p className="cin-hero-description">{t?.hero?.text}</p><div className="cin-actions"><Link className="cin-btn cin-btn-primary" to="/projects">{c.projects}<span aria-hidden="true">↗</span></Link><Link className="cin-btn" to="/about">{c.about}</Link><Link className="cin-btn cin-btn-minimal" to="/contact">{c.together}</Link></div></div><span className="cin-scroll-prompt" aria-hidden="true">SCROLL TO EXPLORE ↓</span>
    </section>
    <Section index={2} eyebrow={t?.nav?.about} title={t?.about?.title || c.about} className="cin-about">
      <div className="cin-about-grid"><div><p className="cin-lead">{t?.about?.intro}</p><Link className="cin-text-link" to="/about">{c.next} ↗</Link></div><figure className="cin-portrait"><img src="/fotos/MIJZELF/WhatsApp%20Image%202026-09-16%20at%2001.27.24%20(4).jpeg" loading="lazy" alt="Samir Loul"/><figcaption>MOHAMED SAMIR LOUL</figcaption></figure></div>
    </Section>
    <Section index={3} eyebrow={t?.nav?.skills} title={c.expertise} className="cin-skills"><p className="cin-lead">{t?.skills?.visualText}</p><div className="cin-tech-grid">{categories.map((tech,i)=><div className="cin-tech-tile" key={i}><span className="cin-tech-number">{String(i+1).padStart(2,"0")}</span><strong>{tech}</strong><span>↗</span></div>)}</div><Link className="cin-text-link" to="/skills">{c.next} ↗</Link></Section>
    <Section index={4} eyebrow={t?.nav?.projects} title={c.work} className="cin-work"><p className="cin-lead">{t?.projects?.intro}</p><div className="cin-work-grid">{cards.map((p,i)=><article className="cin-work-card" key={p.slug || p.title}><div className="cin-work-visual"><div className="cin-preview-ui" aria-hidden="true"><div className="cin-preview-top"><i/><i/><i/></div><div className="cin-preview-layout"><aside/><div><b/><strong>{p.title}</strong><span/><span/><em/></div></div></div><span>{String(i+1).padStart(2,"0")}</span><strong>{p.title}</strong><div className="cin-work-visual-lines" aria-hidden="true"><i/><i/><i/></div></div><div className="cin-work-body"><span>{p.status || "PROJECT"}</span><h3>{p.title}</h3><p>{p.text}</p><div className="cin-tags">{(p.tags || []).slice(0,4).map(tag=><span key={tag}>{tag}</span>)}</div>{p.slug && <Link className="cin-text-link" to={`/projects/${p.slug}`}>{t?.projects?.viewProject || "View project"} ↗</Link>}</div></article>)}</div><Link className="cin-btn" to="/projects">{c.projects} ↗</Link></Section>
    <ExploreUniverse lang={lang}/>
    <Section index={5} eyebrow={t?.nav?.experience} title={c.journey} className="cin-journey"><div className="cin-timeline">{experience.map((item,i)=><article key={i}><span>{item.period}</span><div><h3>{item.title}</h3><strong>{item.company}</strong><p>{item.description}</p></div></article>)}</div><Link className="cin-text-link" to="/experience">{c.next} ↗</Link></Section>
    <section className="cin-finale"><p className="cin-kicker">06 / CONTACT</p><h2>{c.contact}</h2><p>{c.contactSub}</p><div className="cin-actions"><Link className="cin-btn cin-btn-primary" to="/contact">{t?.nav?.contact} ↗</Link><Link className="cin-btn" to="/start-project">{t?.nav?.startProject} ↗</Link></div></section>
    <div className="cin-home-extras container"><section className="stats-section"><h2 className="section-title">{t?.stats?.title}</h2><div className="stats-grid">{[3,3,8,100].map((n,i)=><Counter key={i} end={n} duration={1800} label={stats[i]?.label} suffix={stats[i]?.suffix}/>)}</div></section><FunFacts t={t}/><VisitorStats t={t}/><BlogPreview t={t}/><NewsletterSignup t={t} lang={lang}/><FeedbackForm t={t} lang={lang}/></div>
  </div>;
}