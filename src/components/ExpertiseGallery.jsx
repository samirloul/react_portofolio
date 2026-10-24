import { Link } from "react-router-dom";
import { SiReact,SiJavascript,SiPhp,SiLaravel,SiMysql,SiHtml5,SiCss3,SiGit,SiNodedotjs,SiPostgresql,SiVite } from "react-icons/si";
import { FiCode,FiDatabase,FiShield,FiArrowUpRight } from "react-icons/fi";
import "../styles/home-enhancements.css";
const icons={react:SiReact,javascript:SiJavascript,php:SiPhp,laravel:SiLaravel,mysql:SiMysql,html:SiHtml5,html5:SiHtml5,css:SiCss3,css3:SiCss3,git:SiGit,node:SiNodedotjs,postgresql:SiPostgresql,vite:SiVite,sql:FiDatabase,security:FiShield,api:FiCode};
const descriptions={
en:{react:"Interactive interfaces",javascript:"Dynamic web experiences",php:"Secure backend logic",laravel:"Full-stack applications",mysql:"Structured data storage",html:"Accessible page structure",css:"Responsive design",git:"Version control",sql:"Database queries",api:"Connecting systems"},
nl:{react:"Interactieve interfaces",javascript:"Dynamische websites",php:"Veilige backendlogica",laravel:"Complete webapplicaties",mysql:"Gegevens opslaan",html:"Toegankelijke structuur",css:"Responsive vormgeving",git:"Versiebeheer",sql:"Databasequery's",api:"Systemen koppelen"},
ar:{react:"واجهات تفاعلية",javascript:"تجارب ويب ديناميكية",php:"برمجة خلفية آمنة",laravel:"تطبيقات ويب متكاملة",mysql:"تخزين البيانات",html:"هيكل صفحات واضح",css:"تصميم متجاوب",git:"إدارة الإصدارات",sql:"استعلامات قواعد البيانات",api:"ربط الأنظمة"}};
const normal=(s)=>String(s).trim().toLowerCase().replace(/[^a-z0-9]/g,"");
function details(name,lang){const key=normal(name);const data=descriptions[lang]||descriptions.en;const match=Object.keys(icons).find(k=>key.includes(k));return {Icon:icons[match]||FiCode,description:data[match]||(lang==="nl"?"Onderdeel van mijn ontwikkelproces":lang==="ar"?"جزء من عملية التطوير":"Part of my development workflow")};}
export default function ExpertiseGallery({technologies=[],lang="en",title,description}){
const seen=new Set(); const names=technologies.filter(s=>{const key=normal(s);if(!key||seen.has(key))return false;seen.add(key);return true}).slice(0,12);
return <div className="eh-expertise"><p className="cin-lead">{description}</p><div className="eh-tech-grid">{names.map((name,i)=>{const {Icon,description:detail}=details(name,lang);return <article className="eh-tech" key={name} style={{"--eh-index":i}}><div className="eh-tech-top"><span className="eh-tech-logo"><Icon aria-hidden="true"/></span><span className="eh-tech-count">{String(i+1).padStart(2,"0")}</span></div><h3>{name}</h3><p>{detail}</p></article>})}</div><Link to="/skills" className="eh-more">{title} <FiArrowUpRight aria-hidden="true"/></Link></div>
}