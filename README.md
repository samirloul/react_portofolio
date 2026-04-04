# 👨‍💻 Mohamed Samir Loul – Portfolio

🌍 **Software Development Student | Nederland**  
📅 Geboren: 17 januari 2006  
📧 Email: sameerloul2010@gmail.com  

---

## 🇳🇱 Nederlands

### Over Mij
Mijn naam is Samir Loul, ik kom uit Syrië en woon momenteel in Nederland. Ik ben student Software Development en werk hard om mijn droom te bereiken: **softwareontwikkelaar worden**.  
Ik ben gemotiveerd, leergierig en hou van het bouwen van websites en applicaties.

### Vaardigheden
- HTML5, CSS3, JavaScript  
- PHP, SQL, Laravel  
- React (lerend)  
- Git & GitHub  
- Responsief Webdesign  

### Projecten
- **Persoonlijke Portfolio Website** – HTML, CSS, JavaScript  
- **Syrië Website** – PHP, MySQL, HTML/CSS  
- **AlHaqq Portal** (Koran & Tools) – Laravel, API, MySQL  

---

## 🇬🇧 English

### About Me
My name is Samir Loul. I am originally from Syria and currently living in the Netherlands. I am a Software Development student working towards becoming a **professional software developer**.  
I am passionate, adaptable, and always eager to learn new technologies.

### Skills
- HTML5, CSS3, JavaScript  
- PHP, SQL, Laravel  
- React (learning)  
- Git & GitHub  
- Responsive Web Design  

### Projects
- **Personal Portfolio Website** – HTML, CSS, JavaScript  
- **Syria Website** – PHP, MySQL, HTML/CSS  
- **AlHaqq Portal** (Qur'an & Tools) – Laravel, API, MySQL  

---

## 🇸🇦 العربية

### عني
اسمي سمير لول، من سوريا وأعيش حالياً في هولندا. أدرس تطوير البرمجيات وأسعى لتحقيق حلمي بأن أصبح **مطور برمجيات محترف**.  
أنا شخص طموح، محب للتعلم، وأستمتع ببناء المواقع والتطبيقات.

### المهارات
- HTML5, CSS3, JavaScript  
- PHP, SQL, Laravel  
- React (قيد التعلم)  
- Git & GitHub  
- تصميم مواقع متجاوبة  

### المشاريع
- **موقع البورتفوليو الشخصي** – HTML, CSS, JavaScript  
- **موقع سوريا** – PHP, MySQL, HTML/CSS  
- **بوابة الحق (القرآن والأدوات)** – Laravel, API, MySQL  

---

## 🎓 Education
- **Software Development** – MBO Utrecht (2024 – 2027)  
- **ICT Support** – MBO Utrecht (2023 – 2024)  
- **Mobiliteit & Transport** – Globe College Utrecht (2021 – 2023)  
- **Ithaka (ISK)** – 2017 – 2019  

---

## 🤝 Contact
📧 Email: sameerloul2010@gmail.com  
📍 Location: Netherlands  

---

✨ *Thank you for visiting my portfolio!*

---

## Render Deployment (Frontend + API)

### 1) API service on Render
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm run start`
- Health Check Path: `/api/health`

Set these environment variables in Render API service:
- `RESEND_API_KEY`
- `TO_EMAIL`
- `FROM_EMAIL`
- `CORS_ORIGIN` = jouw frontend URL (bijv. `https://jouw-portfolio.onrender.com`)
- `RECAPTCHA_SECRET_KEY`

### 2) Frontend service on Render
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

Set these environment variables in Render frontend service:
- `VITE_API_BASE_URL` = jouw API URL (bijv. `https://jouw-api.onrender.com`)
- `VITE_RECAPTCHA_SITE_KEY`

## How To Test That It Really Works

### A. Health check
Open in browser:
- `https://jouw-api.onrender.com/api/health`

Expected:
- JSON with `ok: true`

### B. Newsletter test
1. Open live website.
2. Vul nieuwsbrief email in en verstuur.
3. Controleer of je een nieuwe mail ontvangt op `TO_EMAIL`.
4. Als het faalt, check Render logs van API service.

### C. Feedback test
1. Open live website.
2. Kies rating + schrijf tekst + verstuur.
3. Controleer of je een nieuwe feedback mail ontvangt op `TO_EMAIL`.
4. Als het faalt, check Render logs van API service.

### D. Contact form test
1. Vul contactformulier in + reCAPTCHA.
2. Verwacht 2 mails:
- 1 naar jou (admin mail)
- 1 bevestiging naar bezoeker

## Troubleshooting
- `CORS` error: zet `CORS_ORIGIN` exact gelijk aan je frontend URL.
- `Request failed (404)`: `VITE_API_BASE_URL` wijst naar verkeerde URL.
- `Resend error`: controleer of je domein/from-email geverifieerd is in Resend.
- `Captcha failed`: controleer site key + secret key en domeinbinding in Google reCAPTCHA.
