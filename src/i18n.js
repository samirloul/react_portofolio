export const LANGS = ["en", "ar", "nl"];

export const translations = {
  // ================= ENGLISH =================
  en: {
    dir: "ltr",
    nav: {
      name: "Samir Loul",
      home: "Home",
      about: "About",
      projects: "Projects",
      cv: "CV",
      contact: "Contact",
    },
    hero: {
      hello: "Hello, I'm",
      name: "Samir Loul",
      role: "Software Developer & Tech Enthusiast",
      text: "A passionate young developer from Syria, currently living in the Netherlands and pursuing my dreams in software development.",
      primaryButton: "Learn More",
      secondaryButton: "Get In Touch",
    },
    about: {
      title: "About Me",
      intro:
        "My name is Samir Loul, and I come from Syria. I currently live in the Netherlands, where I've been building my life and pursuing my dreams. My journey has been one of resilience, growth, and determination, and I'm always open to sharing my experiences and answering your questions.",
      educationTitle: "My Educational Journey",
      timeline: [
        {
          years: "2017 - 2019",
          title: "Ithaka (ISK)",
          text: "I began my educational journey in the Netherlands at Ithaka (ISK), where I studied from December 2017 to June 2019. It was a place where I learned to adapt to a new environment and built the foundation for my future.",
        },
        {
          years: "2021 - 2023",
          title: "Mobility & Transport - Globe College Utrecht",
          text: "I studied Mobility & Transport at Globe College Utrecht, where I gained practical knowledge about modern transport systems and solutions.",
        },
        {
          years: "2023 - 2024",
          title: "ICT Support - MBO Utrecht",
          text: "I shifted my focus to ICT Support at MBO Utrecht, diving into the world of technology and problem-solving.",
        },
        {
          years: "2024 - 2027",
          title: "Software Development - MBO Utrecht",
          text: "Currently, I'm studying Software Development at MBO Utrecht, where I'm pursuing my dream of becoming a software developer.",
        },
      ],
      moreTitle: "More About Me",
      moreParagraphs: [
        "Each step has been a learning experience filled with challenges and opportunities, and I'm proud of how far I've come. Beyond my studies, I'm a curious and passionate person who loves connecting with others, sharing knowledge, and learning from different perspectives.",
        "If you have questions about me, my journey, or my field of study, feel free to ask—I'd be happy to answer!",
      ],
      skillsTitle: "Skills & Interests",
      skills: [
        {
          title: "Programming",
          text: "Learning software development with passion for creating innovative solutions.",
        },
        { title: "Multilingual", text: "Fluent in Arabic, Dutch, and English." },
        { title: "Communication", text: "Love connecting with others and sharing knowledge." },
        { title: "Problem Solving", text: "Analytical thinking and creative solutions." },
      ],
      connectTitle: "Connect With Me",
      socials: ["Twitter", "Instagram", "TikTok", "Snapchat", "Facebook", "Threads"],
    },
    projects: {
      title: "My Projects",
      intro:
        "Explore my journey through code and creativity. Here you'll find a collection of projects that showcase my growing skills in software development.",
      cards: [
        {
          title: "About Me (Personal Website)",
          icon: "fas fa-user",
          text: "My personal website where I introduce who I am, what I’m learning, and the projects I’m building. Designed to be clean, responsive, and easy to explore.",
          tags: ["HTML", "CSS", "JavaScript"],
          links: [
            {
              label: "Open Website",
              href: "https://samir-website-beste.onrender.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGny2r3baAspddVF1tbZGwKB8Z6dyUO5Y9b2ib7bbYX9b-jCzCS2Ou5BcoIcUA_aem_zQ25t3w7ZRpR5XtoB9ZIuQ",
              icon: "fas fa-arrow-up-right-from-square",
            },            {
              label: "GitHub",
              href: "https://github.com/SamirLoul",
              icon: "fab fa-github",
            },          ],
        },
        {
          title: "Syria Website",
          icon: "fas fa-flag",
          text: "A website about Syria — its history, identity, and the Syrian revolution. It also highlights Damascus, one of the world’s oldest continuously inhabited capitals, and shares content about daily life, culture, and heritage.",
          tags: ["PHP", "MySQL", "HTML/CSS"],
          links: [
            {
              label: "Visit Syria Website",
              href: "https://syriawebsite.com",
              icon: "fas fa-arrow-up-right-from-square",
            },
          ],
        },
        {
          title: "AlHaqq Portal (Quran & Tools)",
          icon: "fas fa-mosque",
          text: "A platform with Quran content, prayer times, Qibla direction, and Ahadith in multiple languages — built to be clear, accessible, and useful for different users.",
          tags: ["PHP", "MySQL", "Laravel", "API"],
          links: [
            {
              label: "Open Portal",
              href: "https://alhaqqportal.com/index.php",
              icon: "fas fa-arrow-up-right-from-square",
            },
          ],
        },
        {
          title: "Future Project",
          icon: "fas fa-hourglass",
          text: "As I continue my studies in Software Development, more innovative projects will be added to this portfolio.",
          tags: ["TBD", "Planning"],
          links: [{ label: "Coming Soon", href: "#", icon: "fas fa-clock" }],
        },
      ],
      collaborationTitle: "Interested in Collaboration?",
      collaborationText:
        "I'm always open to discussing new projects and opportunities. Let's create something amazing together!",
      collaborationButton: "Get In Touch",
      techTitle: "Technologies I'm Learning",
      technologies: ["HTML5", "CSS3", "JavaScript", "React", "SQL", "Git", "PHP", "API"],
    },
    cv: {
      name: "Mohamed Samir Loul",
      subtitle: "Software Development Student",
      location: "Netherlands",
      bornLabel: "Born",
      bornValue: "January 17, 2006",
      downloadLabel: "Download PDF",
      contactTitle: "Contact Information",
      contactEmail: "sameerloul2010@gmail.com",
      languagesTitle: "Languages",
      languages: [
        { name: "Arabic", levelLabel: "Native (5/5)", percent: 100 },
        { name: "Dutch", levelLabel: "Advanced (4/5)", percent: 80 },
        { name: "English", levelLabel: "Intermediate (3/5)", percent: 60 },
      ],
      techTitle: "Technical Skills",
      techGroups: [
        { title: "Programming Languages", items: ["HTML5 & CSS3", "JavaScript", "PHP", "SQL"] },
        { title: "Tools & Technologies", items: ["Git & Version Control", "Responsive Web Design", "ICT Support"] },
      ],
      softTitle: "Soft Skills",
      softSkills: [
        "Problem Solving",
        "Communication",
        "Adaptability",
        "Team Collaboration",
        "Continuous Learning",
        "Cultural Awareness",
      ],
      summaryTitle: "Professional Summary",
      summaryText:
        "Motivated Software Development student with a diverse educational background and strong multilingual abilities. Originally from Syria and now based in the Netherlands, I bring a unique perspective shaped by resilience, adaptability, and a passion for technology. Currently pursuing my dream of becoming a software developer while building practical skills in programming and problem-solving.",
      educationTitle: "Education",
      education: [
        {
          years: "2024 - 2027",
          title: "Software Development",
          place: "MBO Utrecht",
          text: "Currently pursuing comprehensive software development education, focusing on programming fundamentals, web development, and modern software engineering practices.",
        },
        {
          years: "2023 - 2024",
          title: "ICT Support",
          place: "MBO Utrecht",
          text: "Gained practical knowledge in information technology support, troubleshooting, and technical problem-solving.",
        },
        {
          years: "2021 - 2023",
          title: "Mobility & Transport",
          place: "Globe College Utrecht",
          text: "Studied modern transport systems and solutions, developing analytical and systematic thinking skills.",
        },
        {
          years: "2017 - 2019",
          title: "Foundation Studies",
          place: "Ithaka (ISK)",
          text: "Initial educational foundation in the Netherlands, focusing on language development and cultural integration.",
        },
      ],
      qualitiesTitle: "Personal Qualities",
      qualities: [
        { title: "Cultural Adaptability", text: "Successfully integrated into Dutch society while maintaining cultural identity." },
        { title: "Continuous Learner", text: "Passionate about acquiring new skills and staying updated with technology trends." },
        { title: "Team Player", text: "Enjoys collaborating with others and sharing knowledge across diverse teams." },
        { title: "Goal-Oriented", text: "Determined to achieve career objectives in software development." },
      ],
    },

    contact: {
      title: "Get In Touch",
      intro:
        "I'd love to hear from you! Whether you have a question, want to collaborate, or just want to say hello, feel free to reach out.",
      formTitle: "Send me a message",
      hint: "Fill the form and I’ll reply as soon as possible.",

      fields: { name: "Full Name", email: "Email Address", subject: "Subject", message: "Message" },

      placeholders: {
        name: "Your name",
        email: "you@example.com",
        subject: "(optional)",
        message: "Write your message...",
      },

      sendButton: "Send Message",

      infoTitle: "Contact Information",
      emailLabel: "Email",
      locationLabel: "Location",
      locationValue: "Netherlands",
      responseLabel: "Response Time",
      responseValue: "Usually within 24 hours",

      followTitle: "Follow Me",
      socials: ["Twitter", "Instagram", "TikTok", "Snapchat", "Facebook", "Threads"],

      badges: { secure: "Secure form", reply: "Reply in 24h" },

      actions: { email: "Email", copyEmail: "Copy email", copied: "Copied!", cv: "CV" },

      ui: {
        tip: "Tip: add your goal + deadline (if any).",
        counter: "{count}/800",
        emailMe: "Email me",
        letsConnect: "Let’s connect",
        letsConnectSub: "Follow me for updates & new projects.",
      },

      validation: {
        required: "Required",
        invalidEmail: "Invalid email",
        messageTooShort: "Message is too short (min 10 chars)",
      },

      statusText: {
        sendingBtn: "Sending...",
        sendingToast: "Sending your message…",
        successToast: "Message sent! Check your inbox (and spam).",
        errorToast: "Something went wrong.",
        serverError: "Server error",
      },

      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          question: "What's the best way to reach you?",
          answer: "Email is the most reliable way to contact me. I check my emails regularly and respond within 24 hours.",
        },
        {
          question: "Are you available for projects?",
          answer: "As a student, I'm always interested in learning opportunities and collaborative projects that align with my studies.",
        },
        {
          question: "Do you offer mentoring?",
          answer: "I'm happy to share my experiences and journey with fellow students or anyone interested in software development.",
        },
      ],
    },
    skills: {
      title: "Technical Skills",
      frontend: {
        title: "Frontend",
        items: ["HTML5", "CSS3", "JavaScript", "React", "Responsive Design"],
      },
      backend: {
        title: "Backend",
        items: ["PHP", "SQL", "MySQL", "Laravel", "API Development"],
      },
      tools: {
        title: "Tools & DevOps",
        items: ["Git", "GitHub", "VS Code", "Vite", "npm/yarn"],
      },
      soft: {
        title: "Soft Skills",
        items: ["Problem Solving", "Communication", "Team Work", "Time Management", "Adaptability"],
      },
    },
    funFacts: {
      title: "Fun Facts About Me",
      facts: [
        { emoji: "🎮", text: "Gaming enthusiast who loves strategy games" },
        { emoji: "🌍", text: "Passionate about bridging cultures and languages" },
        { emoji: "💡", text: "Love solving puzzles and creative problems" },
        { emoji: "🎬", text: "Enjoy watching tech and educational content" },
        { emoji: "📚", text: "Continuous learner - currently exploring AI basics" },
        { emoji: "🤝", text: "Big believer in community and collaboration" },
      ],
    },
  },

  // ================= ARABIC =================
  ar: {
    dir: "rtl",
    nav: { name: "سمير لول", home: "الرئيسية", about: "عني", projects: "المشاريع", cv: "السيرة الذاتية", contact: "تواصل" },
    hero: {
      hello: "مرحباً، أنا",
      name: "سمير لول",
      role: "مطور برمجيات ومهتم بالتقنية",
      text: "مطور شاب شغوف من سوريا أعيش حالياً في هولندا وأسعى لتحقيق أحلامي في مجال تطوير البرمجيات.",
      primaryButton: "المزيد عني",
      secondaryButton: "تواصل معي",
    },
    about: {
      title: "نبذة عني",
      intro:
        "اسمي سمير لول وأنا من سوريا. أعيش حالياً في هولندا حيث أبني حياتي وأسعى لتحقيق أحلامي. كانت رحلتي رحلة صمود ونمو وتصميم، وأنا دائماً منفتح لمشاركة تجاربي والإجابة على أسئلتكم.",
      educationTitle: "رحلتي التعليمية",
      timeline: [
        {
          years: "2017 - 2019",
          title: "إثاكا (ISK)",
          text: "بدأت رحلتي التعليمية في هولندا في إثاكا (ISK)، حيث درست من ديسمبر 2017 إلى يونيو 2019. كان مكاناً تعلمت فيه التكيف مع بيئة جديدة وبنيت فيه الأساس لمستقبلي.",
        },
        { years: "2021 - 2023", title: "النقل والمواصلات - Globe College Utrecht", text: "درست النقل والمواصلات في Globe College Utrecht، حيث اكتسبت معرفة عملية حول أنظمة وحلول النقل الحديثة." },
        { years: "2023 - 2024", title: "دعم تكنولوجيا المعلومات - MBO Utrecht", text: "انتقلت بتركيزي إلى دعم تكنولوجيا المعلومات في MBO Utrecht، حيث غصت في عالم التكنولوجيا وحل المشكلات." },
        { years: "2024 - 2027", title: "تطوير البرمجيات - MBO Utrecht", text: "حالياً، أدرس تطوير البرمجيات في MBO Utrecht، حيث أسعى لتحقيق حلمي في أن أصبح مطور برمجيات." },
      ],
      moreTitle: "المزيد عني",
      moreParagraphs: [
        "كل خطوة كانت تجربة تعليمية مليئة بالتحديات والفرص، وأنا فخور بالمدى الذي وصلت إليه. بعيداً عن دراستي، أنا شخص فضولي وشغوف يحب التواصل مع الآخرين ومشاركة المعرفة والتعلم من وجهات نظر مختلفة.",
        "إذا كان لديك أسئلة عني، عن رحلتي، أو عن مجال دراستي، فلا تتردد في السؤال - سأكون سعيداً بالإجابة!",
      ],
      skillsTitle: "المهارات والاهتمامات",
      skills: [
        { title: "البرمجة", text: "تعلم تطوير البرمجيات بشغف لإنشاء حلول مبتكرة." },
        { title: "متعدد اللغات", text: "أتقن العربية والهولندية والإنجليزية." },
        { title: "التواصل", text: "أحب التواصل مع الآخرين ومشاركة المعرفة." },
        { title: "حل المشكلات", text: "تفكير تحليلي وحلول إبداعية." },
      ],
      connectTitle: "تواصل معي",
      socials: ["تويتر", "إنستغرام", "تيك توك", "سناب شات", "فيسبوك", "ثريدز"],
    },
    projects: {
      title: "مشاريعي",
      intro: "استكشف رحلتي من خلال الكود والإبداع. ستجد هنا مجموعة من المشاريع التي تعرض مهاراتي المتنامية في تطوير البرمجيات.",
      cards: [
        {
          title: "موقعي الشخصي (عني)",
          icon: "fas fa-user",
          text: "موقع شخصي أعرّف فيه بنفسي وبما أتعلمه وبالمشاريع التي أعمل عليها. تصميم نظيف ومتجاوب وسهل التصفح.",
          tags: ["HTML", "CSS", "JavaScript"],
          links: [
            { label: "فتح الموقع", href: "https://samir-website-beste.onrender.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGny2r3baAspddVF1tbZGwKB8Z6dyUO5Y9b2ib7bbYX9b-jCzCS2Ou5BcoIcUA_aem_zQ25t3w7ZRpR5XtoB9ZIuQ", icon: "fas fa-arrow-up-right-from-square" },
            { label: "GitHub", href: "https://github.com/SamirLoul", icon: "fab fa-github" }
          ],
        },
        {
          title: "موقع عن سوريا",
          icon: "fas fa-flag",
          text: "موقع عن سوريا - تاريخها وهويتها والثورة السورية. كما يسلط الضوء على دمشق، إحدى أقدم العواصم المأهولة باستمرار في العالم، ويشارك محتوى عن الحياة اليومية والثقافة والتراث.",
          tags: ["PHP", "MySQL", "HTML/CSS"],
          links: [{ label: "زيارة موقع سوريا", href: "https://syriawebsite.com", icon: "fas fa-arrow-up-right-from-square" }],
        },
        {
          title: "بوابة الحق (القرآن وأدوات)",
          icon: "fas fa-mosque",
          text: "منصة تحتوي على محتوى القرآن، أوقات الصلاة، اتجاه القبلة، والأحاديث بلغات متعددة - بنيت لتكون واضحة وسهلة الوصول ومفيدة لمختلف المستخدمين.",
          tags: ["PHP", "MySQL", "Laravel", "API"],
          links: [{ label: "فتح البوابة", href: "https://alhaqqportal.com/index.php", icon: "fas fa-arrow-up-right-from-square" }],
        },
        { title: "مشروع مستقبلي", icon: "fas fa-hourglass", text: "مع استمراري في دراسة تطوير البرمجيات، سيتم إضافة المزيد من المشاريع المبتكرة إلى هذا البورتفوليو.", tags: ["قيد التخطيط"], links: [{ label: "قريباً", href: "#", icon: "fas fa-clock" }] },
      ],
      collaborationTitle: "مهتم بالتعاون؟",
      collaborationText: "أنا دائماً منفتح لمناقشة مشاريع وفرص جديدة. لنبتكر شيئاً رائعاً معاً!",
      collaborationButton: "تواصل معي",
      techTitle: "التقنيات التي أتعلمها",
      technologies: ["HTML5", "CSS3", "JavaScript", "React", "SQL", "Git", "PHP", "API"],
    },
    cv: {
      name: "محمد سمير لول",
      subtitle: "طالب تطوير برمجيات",
      location: "هولندا",
      bornLabel: "تاريخ الميلاد",
      bornValue: "17 يناير 2006",
      downloadLabel: "تحميل PDF",
      contactTitle: "معلومات التواصل",
      contactEmail: "sameerloul2010@gmail.com",
      languagesTitle: "اللغات",
      languages: [
        { name: "العربية", levelLabel: "اللغة الأم (5/5)", percent: 100 },
        { name: "الهولندية", levelLabel: "متقدم (4/5)", percent: 80 },
        { name: "الإنجليزية", levelLabel: "متوسط (3/5)", percent: 60 },
      ],
      techTitle: "المهارات التقنية",
      techGroups: [
        { title: "لغات البرمجة", items: ["HTML5 & CSS3", "JavaScript", "PHP", "SQL"] },
        { title: "الأدوات والتقنيات", items: ["Git & Version Control", "تصميم الويب المتجاوب", "دعم تكنولوجيا المعلومات"] },
      ],
      softTitle: "المهارات الشخصية",
      softSkills: ["حل المشكلات", "التواصل", "القدرة على التكيف", "التعاون الجماعي", "التعلم المستمر", "الوعي الثقافي"],
      summaryTitle: "ملخص مهني",
      summaryText:
        "طالب تطوير برمجيات متحمس ذو خلفية تعليمية متنوعة وقدرات لغوية قوية. أصلي من سوريا وأقيم حالياً في هولندا، أحمل منظوراً فريداً شكلته المرونة والتكيف والشغف بالتكنولوجيا. أسعى حالياً لتحقيق حلمي في أن أصبح مطور برمجيات مع بناء مهارات عملية في البرمجة وحل المشكلات.",
      educationTitle: "التعليم",
      education: [
        { years: "2024 - 2027", title: "تطوير البرمجيات", place: "MBO Utrecht", text: "أتابع حالياً تعليماً شاملاً في تطوير البرمجيات، مع التركيز على أساسيات البرمجة، تطوير الويب، وممارسات هندسة البرمجيات الحديثة." },
        { years: "2023 - 2024", title: "دعم تكنولوجيا المعلومات", place: "MBO Utrecht", text: "اكتسبت معرفة عملية في دعم تكنولوجيا المعلومات، استكشاف الأخطاء وإصلاحها، وحل المشكلات التقنية." },
        { years: "2021 - 2023", title: "النقل والمواصلات", place: "Globe College Utrecht", text: "درست أنظمة وحلول النقل الحديثة، وطورت مهارات التفكير التحليلي والمنهجي." },
        { years: "2017 - 2019", title: "الدراسات التأسيسية", place: "Ithaka (ISK)", text: "الأساس التعليمي الأولي في هولندا، مع التركيز على تطوير اللغة والاندماج الثقافي." },
      ],
      qualitiesTitle: "الصفات الشخصية",
      qualities: [
        { title: "التكيف الثقافي", text: "اندمجت بنجاح في المجتمع الهولندي مع الحفاظ على الهوية الثقافية." },
        { title: "متعلم مستمر", text: "شغوف باكتساب مهارات جديدة ومواكبة اتجاهات التكنولوجيا." },
        { title: "لاعب فريق", text: "يستمتع بالتعاون مع الآخرين ومشاركة المعرفة عبر فرق متنوعة." },
        { title: "موجه نحو الأهداف", text: "مصمم على تحقيق الأهداف المهنية في تطوير البرمجيات." },
      ],
    },

    contact: {
      title: "تواصل معي",
      intro:
        "يسعدني التواصل معك! سواء كان لديك سؤال، ترغب في التعاون في مشروع، أو فقط تريد إلقاء التحية، لا تتردد في إرسال رسالة.",
      formTitle: "أرسل لي رسالة",
      hint: "املأ النموذج وسأرد عليك في أقرب وقت ممكن.",

      fields: { name: "الاسم الكامل", email: "البريد الإلكتروني", subject: "الموضوع", message: "الرسالة" },

      placeholders: { name: "اسمك", email: "you@example.com", subject: "(اختياري)", message: "...اكتب رسالتك" },

      sendButton: "إرسال الرسالة",

      infoTitle: "معلومات التواصل",
      emailLabel: "البريد الإلكتروني",
      locationLabel: "الموقع",
      locationValue: "هولندا",
      responseLabel: "وقت الرد",
      responseValue: "عادة خلال 24 ساعة",

      followTitle: "تابعني",
      socials: ["تويتر", "إنستغرام", "تيك توك", "سناب شات", "فيسبوك", "ثريدز"],

      badges: { secure: "نموذج آمن", reply: "رد خلال 24 ساعة" },

      actions: { email: "راسلني", copyEmail: "نسخ البريد", copied: "تم النسخ!", cv: "السيرة الذاتية" },

      ui: {
        tip: "نصيحة: أضف هدفك + الموعد النهائي (إن وجد).",
        counter: "{count}/800",
        emailMe: "راسلني عبر البريد",
        letsConnect: "لنتواصل",
        letsConnectSub: "تابعني للتحديثات والمشاريع الجديدة.",
      },

      validation: { required: "مطلوب", invalidEmail: "بريد إلكتروني غير صالح", messageTooShort: "الرسالة قصيرة جداً (الحد الأدنى 10 أحرف)" },

      statusText: {
        sendingBtn: "جارٍ الإرسال...",
        sendingToast: "جارٍ إرسال رسالتك…",
        successToast: "تم إرسال الرسالة! تحقق من البريد (والرسائل غير المرغوب فيها).",
        errorToast: "حدث خطأ ما.",
        serverError: "خطأ في الخادم",
      },

      faqTitle: "الأسئلة الشائعة",
      faqs: [
        { question: "ما هي أفضل طريقة للوصول إليك؟", answer: "البريد الإلكتروني هو الطريقة الأكثر موثوقية للتواصل معي. أتحقق من بريدي بانتظام وأرد خلال 24 ساعة." },
        { question: "هل أنت متاح للمشاريع؟", answer: "كطالب، أنا مهتم دائماً بفرص التعلم والمشاريع التعاونية التي تتماشى مع دراستي." },
        { question: "هل تقدم التوجيه (Mentoring)؟", answer: "يسعدني مشاركة تجاربي ورحلتي مع زملائي الطلاب أو أي شخص مهتم بتطوير البرمجيات." },
      ],
    },
    skills: {
      title: "المهارات التقنية",
      frontend: {
        title: "Frontend",
        items: ["HTML5", "CSS3", "JavaScript", "React", "تصميم متجاوب"],
      },
      backend: {
        title: "Backend",
        items: ["PHP", "SQL", "MySQL", "Laravel", "تطوير API"],
      },
      tools: {
        title: "الأدوات",
        items: ["Git", "GitHub", "VS Code", "Vite", "npm/yarn"],
      },
      soft: {
        title: "المهارات الشخصية",
        items: ["حل المشكلات", "التواصل", "العمل الجماعي", "إدارة الوقت", "القدرة على التكيف"],
      },
    },
    funFacts: {
      title: "حقائق ممتعة عني",
      facts: [
        { emoji: "🎮", text: "عشاق الألعاب الذي يحب ألعاب الإستراتيجية" },
        { emoji: "🌍", text: "شغوف بجسر الثقافات واللغات" },
        { emoji: "💡", text: "أحب حل الألغاز والمشاكل الإبداعية" },
        { emoji: "🎬", text: "أستمتع بمشاهدة محتوى تقني وتعليمي" },
        { emoji: "📚", text: "متعلم مستمر - استكشف أساسيات الذكاء الاصطناعي حالياً" },
        { emoji: "🤝", text: "مؤمن قوي بالمجتمع والتعاون" },
      ],
    },
  },

  // ================= DUTCH =================
  nl: {
    dir: "ltr",
    nav: { name: "Samir Loul", home: "Home", about: "Over mij", projects: "Projecten", cv: "CV", contact: "Contact" },
    hero: {
      hello: "Hallo, ik ben",
      name: "Samir Loul",
      role: "Software Developer & Tech Liefhebber",
      text: "Een gepassioneerde jonge ontwikkelaar uit Syrië, momenteel woonachtig in Nederland en bezig mijn dromen in softwareontwikkeling na te jagen.",
      primaryButton: "Meer over mij",
      secondaryButton: "Neem contact op",
    },
    about: {
      title: "Over Mij",
      intro:
        "Mijn naam is Samir Loul en ik kom uit Syrië. Ik woon momenteel in Nederland, waar ik mijn leven heb opgebouwd en mijn dromen najaag. Mijn reis is er een van veerkracht, groei en vastberadenheid, en ik sta altijd open om mijn ervaringen te delen en je vragen te beantwoorden.",
      educationTitle: "Mijn Educatieve Reis",
      timeline: [
        { years: "2017 - 2019", title: "Ithaka (ISK)", text: "Ik begon mijn educatieve reis in Nederland bij Ithaka (ISK), waar ik studeerde van december 2017 tot juni 2019. Het was een plek waar ik leerde me aan te passen aan een nieuwe omgeving en de basis legde voor mijn toekomst." },
        { years: "2021 - 2023", title: "Mobiliteit & Transport - Globe College Utrecht", text: "Ik studeerde Mobiliteit & Transport aan het Globe College Utrecht, waar ik praktische kennis opdeed over moderne transportsystemen en oplossingen." },
        { years: "2023 - 2024", title: "ICT Support - MBO Utrecht", text: "Ik verlegde mijn focus naar ICT Support aan het MBO Utrecht, waarbij ik in de wereld van technologie en probleemoplossing dook." },
        { years: "2024 - 2027", title: "Software Development - MBO Utrecht", text: "Momenteel studeer ik Software Development aan het MBO Utrecht, waar ik mijn droom om softwareontwikkelaar te worden nastreef." },
      ],
      moreTitle: "Meer Over Mij",
      moreParagraphs: [
        "Elke stap is een leerervaring geweest vol uitdagingen en kansen, en ik ben trots op hoe ver ik ben gekomen. Naast mijn studie ben ik een nieuwsgierig en gepassioneerd persoon die graag in contact komt met anderen, kennis deelt en leert van verschillende perspectieven.",
        "Als je vragen hebt over mij, mijn reis of mijn vakgebied, stel ze gerust—ik beantwoord ze graag!",
      ],
      skillsTitle: "Vaardigheden & Interesses",
      skills: [
        { title: "Programmeren", text: "Softwareontwikkeling leren met passie voor het creëren van innovatieve oplossingen." },
        { title: "Meertalig", text: "Vloeiend in Arabisch, Nederlands en Engels." },
        { title: "Communicatie", text: "Houdt van contact met anderen en het delen van kennis." },
        { title: "Probleemoplossing", text: "Analytisch denken en creatieve oplossingen." },
      ],
      connectTitle: "Connect Met Mij",
      socials: ["Twitter", "Instagram", "TikTok", "Snapchat", "Facebook", "Threads"],
    },
    projects: {
      title: "Mijn Projecten",
      intro:
        "Verken mijn reis door code en creativiteit. Hier vind je een verzameling projecten die mijn groeiende vaardigheden in softwareontwikkeling laten zien.",
      cards: [
        {
          title: "Over Mij (Persoonlijke Website)",
          icon: "fas fa-user",
          text: "Mijn persoonlijke website waar ik mezelf voorstel, wat ik leer en de projecten die ik bouw. Ontworpen om schoon, responsief en gemakkelijk te verkennen te zijn.",
          tags: ["HTML", "CSS", "JavaScript"],
          links: [
            {
              label: "Open Website",
              href: "https://samir-website-beste.onrender.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGny2r3baAspddVF1tbZGwKB8Z6dyUO5Y9b2ib7bbYX9b-jCzCS2Ou5BcoIcUA_aem_zQ25t3w7ZRpR5XtoB9ZIuQ",
              icon: "fas fa-arrow-up-right-from-square",
            },
            {
              label: "GitHub",
              href: "https://github.com/SamirLoul",
              icon: "fab fa-github",
            },
          ],
        },
        {
          title: "Syrië Website",
          icon: "fas fa-flag",
          text: "Een website over Syrië — de geschiedenis, identiteit en de Syrische revolutie. Het belicht ook Damascus, een van 's werelds oudste continu bewoonde hoofdsteden, en deelt inhoud over het dagelijks leven, cultuur en erfgoed.",
          tags: ["PHP", "MySQL", "HTML/CSS"],
          links: [{ label: "Bezoek Syrië Website", href: "https://syriawebsite.com", icon: "fas fa-arrow-up-right-from-square" }],
        },
        {
          title: "AlHaqq Portal (Koran & Tools)",
          icon: "fas fa-mosque",
          text: "Een platform met Koran-inhoud, gebedstijden, Qibla-richting en Ahadith in meerdere talen — gebouwd om duidelijk, toegankelijk en nuttig te zijn voor verschillende gebruikers.",
          tags: ["PHP", "MySQL", "Laravel", "API"],
          links: [{ label: "Open Portaal", href: "https://alhaqqportal.com/index.php", icon: "fas fa-arrow-up-right-from-square" }],
        },
        { title: "Toekomstig Project", icon: "fas fa-hourglass", text: "Terwijl ik mijn studie Software Development voortzet, zullen er meer innovatieve projecten aan dit portfolio worden toegevoegd.", tags: ["TBD", "Planning"], links: [{ label: "Binnenkort", href: "#", icon: "fas fa-clock" }] },
      ],
      collaborationTitle: "Interesse in Samenwerking?",
      collaborationText: "Ik sta altijd open voor het bespreken van nieuwe projecten en kansen. Laten we samen iets geweldigs maken!",
      collaborationButton: "Neem contact op",
      techTitle: "Technologieën die ik leer",
      technologies: ["HTML5", "CSS3", "JavaScript", "React", "SQL", "Git", "PHP", "API"],
    },
    cv: {
      name: "Mohamed Samir Loul",
      subtitle: "Software Development Student",
      location: "Nederland",
      bornLabel: "Geboren",
      bornValue: "17 januari 2006",
      downloadLabel: "Download PDF",
      contactTitle: "Contactinformatie",
      contactEmail: "sameerloul2010@gmail.com",
      languagesTitle: "Talen",
      languages: [
        { name: "Arabisch", levelLabel: "Moedertaal (5/5)", percent: 100 },
        { name: "Nederlands", levelLabel: "Geavanceerd (4/5)", percent: 80 },
        { name: "Engels", levelLabel: "Gemiddeld (3/5)", percent: 60 },
      ],
      techTitle: "Technische Vaardigheden",
      techGroups: [
        { title: "Programmeertalen", items: ["HTML5 & CSS3", "JavaScript", "PHP", "SQL"] },
        { title: "Tools & Technologieën", items: ["Git & Versiebeheer", "Responsief Webdesign", "ICT Support"] },
      ],
      softTitle: "Soft Skills",
      softSkills: ["Probleemoplossing", "Communicatie", "Aanpassingsvermogen", "Teamwork", "Continu Leren", "Cultureel Bewustzijn"],
      summaryTitle: "Professionele Samenvatting",
      summaryText:
        "Gemotiveerde Software Development student met een diverse educatieve achtergrond en sterke meertalige vaardigheden. Oorspronkelijk uit Syrië en nu gevestigd in Nederland, breng ik een uniek perspectief gevormd door veerkracht, aanpassingsvermogen en een passie voor technologie. Momenteel streef ik mijn droom na om softwareontwikkelaar te worden terwijl ik praktische vaardigheden opbouw in programmeren en probleemoplossing.",
      educationTitle: "Opleiding",
      education: [
        { years: "2024 - 2027", title: "Software Development", place: "MBO Utrecht", text: "Momenteel bezig met een uitgebreide opleiding softwareontwikkeling, met de focus op programmeerfundamentals, webontwikkeling en moderne software engineering praktijken." },
        { years: "2023 - 2024", title: "ICT Support", place: "MBO Utrecht", text: "Praktische kennis opgedaan in IT-ondersteuning, probleemoplossing en technische support." },
        { years: "2021 - 2023", title: "Mobiliteit & Transport", place: "Globe College Utrecht", text: "Moderne transportsystemen en oplossingen bestudeerd, waarbij analytisch en systematisch denken is ontwikkeld." },
        { years: "2017 - 2019", title: "Basisstudies", place: "Ithaka (ISK)", text: "Eerste educatieve basis in Nederland, gericht op taalontwikkeling en culturele integratie." },
      ],
      qualitiesTitle: "Persoonlijke Kwaliteiten",
      qualities: [
        { title: "Cultureel Aanpassingsvermogen", text: "Succesvol geïntegreerd in de Nederlandse samenleving met behoud van culturele identiteit." },
        { title: "Continu Leren", text: "Gepassioneerd over het verwerven van nieuwe vaardigheden en op de hoogte blijven van technologische trends." },
        { title: "Teamspeler", text: "Geniet van samenwerken met anderen en het delen van kennis in diverse teams." },
        { title: "Doelgericht", text: "Vastbesloten om carrièredoelen in softwareontwikkeling te bereiken." },
      ],
    },

    contact: {
      title: "Neem Contact Op",
      intro: "Ik hoor graag van je! Of je nu een vraag hebt, wilt samenwerken of gewoon gedag wilt zeggen, neem gerust contact op.",
      formTitle: "Stuur me een bericht",
      hint: "Vul het formulier in en ik reageer zo snel mogelijk.",

      fields: { name: "Volledige Naam", email: "E-mailadres", subject: "Onderwerp", message: "Bericht" },

      placeholders: { name: "Je naam", email: "jij@voorbeeld.com", subject: "(optioneel)", message: "Schrijf je bericht..." },

      sendButton: "Bericht Verzenden",

      infoTitle: "Contactinformatie",
      emailLabel: "E-mail",
      locationLabel: "Locatie",
      locationValue: "Nederland",
      responseLabel: "Reactietijd",
      responseValue: "Meestal binnen 24 uur",

      followTitle: "Volg Mij",
      socials: ["Twitter", "Instagram", "TikTok", "Snapchat", "Facebook", "Threads"],

      badges: { secure: "Veilig formulier", reply: "Reactie binnen 24u" },

      actions: { email: "E-mail", copyEmail: "Kopieer e-mail", copied: "Gekopieerd!", cv: "CV" },

      ui: {
        tip: "Tip: voeg je doel + deadline toe (indien van toepassing).",
        counter: "{count}/800",
        emailMe: "E-mail mij",
        letsConnect: "Laten we connecten",
        letsConnectSub: "Volg me voor updates & nieuwe projecten.",
      },

      validation: { required: "Verplicht", invalidEmail: "Ongeldig e-mailadres", messageTooShort: "Bericht is te kort (min 10 tekens)" },

      statusText: {
        sendingBtn: "Bezig met verzenden...",
        sendingToast: "Je bericht wordt verzonden…",
        successToast: "Bericht verzonden! Check je inbox (en spam).",
        errorToast: "Er ging iets mis.",
        serverError: "Serverfout",
      },

      faqTitle: "Veelgestelde Vragen",
      faqs: [
        { question: "Wat is de beste manier om je te bereiken?", answer: "E-mail is de meest betrouwbare manier om contact met mij op te nemen. Ik check mijn e-mails regelmatig en reageer binnen 24 uur." },
        { question: "Ben je beschikbaar voor projecten?", answer: "Als student ben ik altijd geïnteresseerd in leermogelijkheden en samenwerkingsprojecten die aansluiten bij mijn studie." },
        { question: "Bied je mentoring aan?", answer: "Ik deel graag mijn ervaringen en reis met medestudenten of iedereen die geïnteresseerd is in softwareontwikkeling." },
      ],
    },
    skills: {
      title: "Technische Vaardigheden",
      frontend: {
        title: "Frontend",
        items: ["HTML5", "CSS3", "JavaScript", "React", "Responsief Design"],
      },
      backend: {
        title: "Backend",
        items: ["PHP", "SQL", "MySQL", "Laravel", "API Ontwikkeling"],
      },
      tools: {
        title: "Tools & DevOps",
        items: ["Git", "GitHub", "VS Code", "Vite", "npm/yarn"],
      },
      soft: {
        title: "Soft Skills",
        items: ["Probleemoplossing", "Communicatie", "Teamwerk", "Tijd Management", "Aanpassingsvermogen"],
      },
    },
    funFacts: {
      title: "Leuke Weetjes Over Mij",
      facts: [
        { emoji: "🎮", text: "Gaming enthusiast die van strategiespellen houdt" },
        { emoji: "🌍", text: "Gepassioneerd over culturen en talen overbruggen" },
        { emoji: "💡", text: "Hou van puzzels en creatieve problemen oplossen" },
        { emoji: "🎬", text: "Geniet van tech en educatieve content kijken" },
        { emoji: "📚", text: "Continu leerling - verken momenteel AI-basics" },
        { emoji: "🤝", text: "Groot geloof in gemeenschap en samenwerking" },
      ],
    },
  },
};
