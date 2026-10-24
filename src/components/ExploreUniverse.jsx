import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/explore-universe.css";

const content = {
  en: { eyebrow:"INTERACTIVE PORTFOLIO", title:"Choose your next destination.", intro:"Explore my work, discover how I build, or follow what I'm learning. Each path tells a different part of my story.", hint:"Select a destination", go:"Explore", progress:"Your journey", scroll:"Keep exploring", paths:[["Projects","See real applications and how they were built."],["Skills","Discover my toolkit and technical interests."],["Experience","Follow my journey as a software developer."],["Learning","See what I am exploring and improving."],["Services","Discover how we could collaborate."]] },
  nl: { eyebrow:"INTERACTIEF PORTFOLIO", title:"Kies je volgende bestemming.", intro:"Bekijk mijn projecten, ontdek hoe ik werk en volg wat ik leer. Elke route vertelt een ander deel van mijn verhaal.", hint:"Kies een bestemming", go:"Ontdekken", progress:"Jouw ontdekking", scroll:"Verder ontdekken", paths:[["Projecten","Bekijk echte applicaties en hoe ik ze bouw."],["Vaardigheden","Ontdek mijn tools en technische interesses."],["Ervaring","Volg mijn ontwikkeling als software developer."],["Wat ik leer","Bekijk wat ik onderzoek en verbeter."],["Diensten","Ontdek hoe we samen kunnen werken."]] },
  ar: { eyebrow:"ملف أعمال تفاعلي", title:"اختر وجهتك التالية.", intro:"استكشف مشاريعي وطريقة عملي وما أتعلمه. كل وجهة تحكي جزءًا من رحلتي.", hint:"اختر وجهتك", go:"استكشف", progress:"رحلتك", scroll:"تابع الاستكشاف", paths:[["المشاريع","شاهد تطبيقات حقيقية وكيف طورتها."],["المهارات","تعرّف على أدواتي واهتماماتي التقنية."],["الخبرات","تابع رحلتي كمطور برمجيات."],["التعلم","اكتشف ما أتعلمه وأطوره."],["الخدمات","اكتشف كيف يمكننا العمل معًا."]] }
};
const routes = ["/projects","/skills","/experience","/learning","/services"];
const glyphs = ["⌘","◇","↗","✧","◎"];

export default function ExploreUniverse({ lang = "en" }) {
  const c = content[lang] || content.en;
  const [active,setActive] = useState(0);
  const [visible,setVisible] = useState(false);
  const [pointer,setPointer] = useState({x:0,y:0});
  const root = useRef(null);
  useEffect(() => {
    if (!root.current || !("IntersectionObserver" in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) {setVisible(true);observer.disconnect();} },{threshold:.08});
    observer.observe(root.current);
    return () => observer.disconnect();
  },[]);
  const move = (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({x:(event.clientX-rect.left)/rect.width-.5,y:(event.clientY-rect.top)/rect.height-.5});
  };
  return <section ref={root} className={"explore-universe"+(visible?" explore-visible":"")} aria-labelledby="explore-title">
    <div className="explore-container">
      <div className="explore-heading"><div><p className="explore-eyebrow"><span className="explore-live-dot"/> {c.eyebrow}</p><h2 id="explore-title">{c.title}</h2></div><p>{c.intro}</p></div>
      <div className="explore-layout">
        <div className="explore-menu" aria-label={c.hint}>
          {routes.map((route,i)=><button key={route} type="button" className={"explore-option"+(active===i?" explore-active":"")} onClick={()=>setActive(i)} onFocus={()=>setActive(i)} aria-pressed={active===i}><span className="explore-option-number">0{i+1}</span><span className="explore-option-text">{c.paths[i][0]}<small>{c.paths[i][1]}</small></span><span className="explore-option-arrow" aria-hidden="true">↗</span></button>)}
        </div>
        <div className="explore-stage" onPointerMove={move} onPointerLeave={()=>setPointer({x:0,y:0})} style={{"--explore-x":pointer.x*10+"px","--explore-y":pointer.y*10+"px"}}>
          <div className="explore-stage-grid" aria-hidden="true"/>
          <div className="explore-orbit explore-orbit-one" aria-hidden="true"/><div className="explore-orbit explore-orbit-two" aria-hidden="true"/>
          <div className="explore-floating explore-float-a" aria-hidden="true">{"{ }"}</div><div className="explore-floating explore-float-b" aria-hidden="true">{"</>"}</div>
          <div className="explore-scene" key={active}>
            <span className="explore-scene-kicker">SAMIRPROFILE / {String(active+1).padStart(2,"0")}</span>
            <div className="explore-scene-icon" aria-hidden="true">{glyphs[active]}</div>
            <h3>{c.paths[active][0]}</h3>
            <p>{c.paths[active][1]}</p>
            <Link className="explore-visit" to={routes[active]}>{c.go}<span aria-hidden="true">↗</span></Link>
          </div>
          <div className="explore-stage-bottom"><span>{c.progress}</span><div className="explore-pagination">{routes.map((_,i)=><button aria-label={c.paths[i][0]} aria-pressed={active===i} title={c.paths[i][0]} key={i} onClick={()=>setActive(i)} className={active===i?"selected":""} type="button"/>)}</div><span>0{active+1} / 05</span></div>
        </div>
      </div>
    </div>
  </section>;
}