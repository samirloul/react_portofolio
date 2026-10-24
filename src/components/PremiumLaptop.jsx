import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/premium-laptop.css";

const snippets = [
  {n:"01",line:<><span className="pl-purple">const</span> <span className="pl-blue">developer</span> = {"{"}</>},
  {n:"02",line:<>  name: <span className="pl-green">"Samir Loul"</span>,</>},
  {n:"03",line:<>  role: <span className="pl-green">"Software Developer"</span>,</>},
  {n:"04",line:<>  passion: [</>},
  {n:"05",line:<>    <span className="pl-green">"Engineering"</span>, <span className="pl-green">"Design"</span>,</>},
  {n:"06",line:<>    <span className="pl-green">"Creative Experiences"</span></>},
  {n:"07",line:<>  ],</>},
  {n:"08",line:<>  available: <span className="pl-orange">true</span></>},
  {n:"09",line:<>{"}"};</>},
  {n:"10",line:<><span className="pl-purple">export default</span> developer;<span className="pl-caret">▋</span></>}
];
const titles={en:["Explore projects","Explore skills","Let's connect"],nl:["Bekijk projecten","Ontdek vaardigheden","Neem contact op"],ar:["استكشف المشاريع","اكتشف المهارات","تواصل معي"]};
export default function PremiumLaptop({ progress=0,lang="en" }) {
  const [reduce,setReduce]=useState(false);
  const [cursor,setCursor]=useState({x:0,y:0});
  const [tab,setTab]=useState("developer.js");
  useEffect(()=>{const mq=window.matchMedia("(prefers-reduced-motion: reduce)");const update=()=>setReduce(mq.matches);update();mq.addEventListener("change",update);return()=>mq.removeEventListener("change",update)},[]);
  const onMove=(e)=>{if(reduce||e.pointerType==="touch")return;const r=e.currentTarget.getBoundingClientRect();setCursor({x:(e.clientX-r.left)/r.width-.5,y:(e.clientY-r.top)/r.height-.5})};
  const spin=reduce?-8:-12+Math.min(1,progress)*14+cursor.x*8;
  return <div className="pl-wrap" onPointerMove={onMove} onPointerLeave={()=>setCursor({x:0,y:0})}>
    <div className="pl-glow" aria-hidden="true"/><div className="pl-grid" aria-hidden="true"/>
    <div className="pl-floating pl-float-react" aria-hidden="true"><span className="pl-symbol">⚛</span><span>React</span></div>
    <div className="pl-floating pl-float-api" aria-hidden="true"><span className="pl-status-dot"/> API Connected</div>
    <div className="pl-floating pl-float-git" aria-hidden="true"><span className="pl-commit-icon">⑂</span> main / clean</div>
    <div className="pl-machine" style={{"--pl-rx":(reduce?6:7-cursor.y*5)+"deg","--pl-ry":spin+"deg"}}>
      <div className="pl-lid">
        <div className="pl-monitor">
          <div className="pl-titlebar"><span className="pl-dots"><i/><i/><i/></span><span className="pl-app-name">SAMIR / STUDIO</span><span className="pl-window-actions">⌕　⋯</span></div>
          <div className="pl-app">
            <div className="pl-sidebar"><span className="pl-side-icon active">▤</span><span className="pl-side-icon">◇</span><span className="pl-side-icon">⑂</span><span className="pl-side-icon">⚙</span></div>
            <div className="pl-workspace">
              <div className="pl-tabs"><button className={tab==="developer.js"?"selected":""} onClick={()=>setTab("developer.js")} type="button">◇ developer.js</button><button className={tab==="portfolio.jsx"?"selected":""} onClick={()=>setTab("portfolio.jsx")} type="button">⚛ portfolio.jsx</button></div>
              <div className="pl-breadcrumb">src <span>›</span> {tab}</div>
              <div className="pl-code" key={tab}>
                {tab==="developer.js"?snippets.map((s,i)=><div className="pl-code-row" key={s.n} style={{"--line-delay":(i*.1)+"s"}}><span className="pl-line-number">{s.n}</span><code>{s.line}</code></div>):
                <><div className="pl-code-row"><span className="pl-line-number">01</span><code><span className="pl-purple">function</span> <span className="pl-blue">Portfolio</span>() {"{"}</code></div><div className="pl-code-row"><span className="pl-line-number">02</span><code>  <span className="pl-purple">return</span> (</code></div><div className="pl-code-row"><span className="pl-line-number">03</span><code>    <span className="pl-red">&lt;Experience</span> <span className="pl-blue">crafted</span>=<span className="pl-orange">{"{true}"}</span> /<span className="pl-red">&gt;</span></code></div><div className="pl-code-row"><span className="pl-line-number">04</span><code>  );</code></div><div className="pl-code-row"><span className="pl-line-number">05</span><code>{"}"}</code></div></>}
              </div>
              <div className="pl-terminal"><div className="pl-terminal-title"><span>⌁ TERMINAL</span><span>+</span></div><div><span className="pl-green">➜</span> portfolio npm run dev</div><div className="pl-muted">✓ ready in 248 ms</div><div><span className="pl-blue">➜</span> <span className="pl-green">Local:</span> samirprofile.com<span className="pl-caret">▋</span></div></div>
            </div>
          </div>
          <div className="pl-statusbar"><span>⑂ main</span><span>JavaScript　 UTF-8　 ✓</span></div>
        </div>
      </div>
      <div className="pl-bottom"><div className="pl-keyboard"/><div className="pl-touchpad"/></div>
    </div>
    <div className="pl-quick-nav">
      <span className="pl-nav-label">EXPLORE / 01—03</span>
      <div><Link to="/projects">{titles[lang]?.[0]||titles.en[0]} <span>↗</span></Link><Link to="/skills">{titles[lang]?.[1]||titles.en[1]} <span>↗</span></Link><Link to="/contact">{titles[lang]?.[2]||titles.en[2]} <span>↗</span></Link></div>
    </div>
  </div>;
}