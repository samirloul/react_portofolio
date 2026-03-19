const fs = require('fs');
const path = require('path');

// Fix Home.jsx
const homePath = path.join(__dirname, 'src/pages/Home.jsx');
let homeContent = fs.readFileSync(homePath, 'utf8');

homeContent = homeContent.replace(
  'My Journey in Numbers',
  '{t.stats.title}'
);

homeContent = homeContent.replace(
  'end={5} duration={2500} label="Projects Built" suffix="+"',
  'end={3} duration={2500} label={t.stats.items[0].label} suffix={t.stats.items[0].suffix}'
);

homeContent = homeContent.replace(
  'end={3} duration={2000} label="Years of Passion" suffix="+"',
  'end={3} duration={2000} label={t.stats.items[1].label} suffix={t.stats.items[1].suffix}'
);

homeContent = homeContent.replace(
  'end={8} duration={2500} label="Skills Mastered" suffix="+"',
  'end={8} duration={2500} label={t.stats.items[2].label} suffix={t.stats.items[2].suffix}'
);

homeContent = homeContent.replace(
  'end={100} duration={2000} label="Dedication %"',
  'end={100} duration={2000} label={t.stats.items[3].label} suffix={t.stats.items[3].suffix}'
);

fs.writeFileSync(homePath, homeContent, 'utf8');
console.log('✓ Home.jsx updated - now using t.stats translations');

// Fix i18n.js  
const i18nPath = path.join(__dirname, 'src/i18n.js');
let i18nContent = fs.readFileSync(i18nPath, 'utf8');

// English stats section
i18nContent = i18nContent.replace(
  '      primaryButton: "Learn More",\n      secondaryButton: "Get In Touch",\n    },\n    about: {',
  '      primaryButton: "Learn More",\n      secondaryButton: "Get In Touch",\n    },\n    stats: {\n      title: "My Journey in Numbers",\n      items: [\n        { label: "Projects Built", suffix: "+" },\n        { label: "Years of Passion", suffix: "+" },\n        { label: "Skills Mastered", suffix: "+" },\n        { label: "Dedication", suffix: "%" },\n      ],\n    },\n    about: {'
);

// Arabic stats section
i18nContent = i18nContent.replace(
  '      primaryButton: "المزيد عني",\n      secondaryButton: "تواصل معي",\n    },\n    about: {',
  '      primaryButton: "المزيد عني",\n      secondaryButton: "تواصل معي",\n    },\n    stats: {\n      title: "رحلتي في أرقام",\n      items: [\n        { label: "مشاريع منجزة", suffix: "+" },\n        { label: "سنوات الشغف", suffix: "+" },\n        { label: "مهارات مذاهلة", suffix: "+" },\n        { label: "الالتزام", suffix: "%" },\n      ],\n    },\n    about: {'
);

// Dutch stats section
i18nContent = i18nContent.replace(
  '      primaryButton: "Meer over mij",\n      secondaryButton: "Neem contact op",\n    },\n    about: {',
  '      primaryButton: "Meer over mij",\n      secondaryButton: "Neem contact op",\n    },\n    stats: {\n      title: "Mijn Reis in Getallen",\n      items: [\n        { label: "Projecten Gebouwd", suffix: "+" },\n        { label: "Jaren Passie", suffix: "+" },\n        { label: "Vaardigheden Beheerst", suffix: "+" },\n        { label: "Inzet", suffix: "%" },\n      ],\n    },\n    about: {'
);

fs.writeFileSync(i18nPath, i18nContent, 'utf8');
console.log('✓ i18n.js updated - added stats translations for EN/AR/NL');
console.log('✓ Counter fixed: 5 projects → 3 projects');
