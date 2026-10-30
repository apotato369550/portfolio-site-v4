// ── Experience ─────────────────────────────────────────────
export const experienceData = [
  {
    title: 'Software Engineer Intern',
    org: 'Evo Tech Software Solutions',
    date: 'Sept 2025 – April 2026',
    logo: 'evotech.jpeg',
    body: `Building backend systems and AI-powered services, with hands-on experience designing RESTful API endpoints and transactional data workflows. Applying AI technologies such as vector embeddings, Retrieval-Augmented Generation (RAG), and computer vision, while exploring software architecture principles including separation of concerns, asynchronous processing, fault tolerance, graceful degradation, and fail-fast design. Learning how to build reliable systems around rapidly evolving AI capabilities.
`,
    note: '',
  },
  {
    title: 'Web Developer, Designer, and Secretary',
    org: 'Cebu Best Value Trading (CBVT) - HVAC Division',
    date: 'Jan 2024 – present',
    logo: 'cbvt',
    body: `Developed the division’s landing page and supporting visual assets, including marketing graphics and business cards; handled administrative operations including documentation, quotations, and general secretarial duties
`,
    note: '',
  },
  {
    title: 'Chapter Lead',
    org: 'Google Developer Groups on Campus – USC (GDGoc-USC)',
    date: 'Jan 2026 – April 2026',
    logo: 'gdgoc.png',
    body: "Running USC's developer community. Technical workshops and getting CS students from theory to practice. Promoted from Data Science Officer in August 2025.",
    note: '',
  },
  {
    title: 'AI & Data Lead',
    org: 'DOST START',
    date: '2025 – April 2026',
    logo: 'dost_start.jpg',
    body: 'Leading the AI and data workstream for DOST START. An organization of science and technology scholars across the Philippines with a shared love of anything related to technology',
    note: '',
  },
];

// ── Projects ───────────────────────────────────────────────

export const featuredProject = {
  title: 'AI Analysis & Generation API',
  date: '2025 – 2026',
  label: 'Production',
  body: `Built a Python backend that brings together AI-powered analysis, image and video generation, and document search. Features 16 <span data-tip='Individual URLs that let applications interact with different parts of the backend'>API endpoints</span>, <span data-tip='AI that can understand and analyze images'>computer vision</span>, <span data-tip='A database that lets you search by meaning rather than exact keywords'>vector databases</span>, and <span data-tip='Retrieval-Augmented Generation: lets AI look up relevant information before answering'>RAG</span>. Also spent a good chunk of time making things faster, more reliable, and easier to maintain.`,
  tags: ['FastAPI', 'GPT-4 Vision', 'Qdrant', 'Sora 2', 'Python'],
};


export const projectsData = [
  { 
    title: 'arkad', 
    date: '2026', 
    label: 'Personal Tool · Finance Tracker', 
    body: "Arkad is a personal finance app for keeping track of your spending without making budgeting feel like a chore. You can add transactions manually or tell an AI agent what you spent in plain language, like “I spent \$12 on lunch,” and it adds it to your ledger. The app also gives you AI-written spending breakdowns, charts, savings suggestions, and a chat view for asking questions about your finances. It supports <span data-tip='Bring your own key. You provide your own OpenRouter API key instead of the app including one'>BYOK</span> AI access, with your data stored on-device and requests sent directly to OpenRouter. You can also save analyses and export your ledger as a formatted PDF.", 
    tags: ['Flutter', 'Dart', 'Mobile Development', 'AI', 'OpenRouter'], 
    note: '', 
  },
  { 
    title: 'enrollmate',
    href: 'https://enrollmate.dcism.org', 
    date: '2026', 
    label: 'Personal Tool · Course Scheduler', 
    body: "Enrollment gets messy fast when you have to compare a bunch of course sections by hand. Enrollmate lets you add courses manually or import them from a CSV, then uses a <span data-tip='An algorithm that tries different course combinations and backs up whenever it finds a conflict'>backtracking search</span> to find every schedule that fits your time and enrollment preferences. You can view the results on a weekly grid, save your favorite schedules, and print them later. Everything runs locally in the browser, so there are no accounts or backend. Your data stays in <span data-tip='Browser storage that lets websites save data on your device'>localStorage</span>. Used by hundreds of students at the University of San Carlos to plan their schedules during the enrollment season.", 
    tags: ['JavaScript', 'Vite'], 
    note: '', 
  }, 
  { 
    title: 'cbvt', 
    href: 'https://cbvt.vercel.app',
    date: '2026', 
    label: 'Client Website · HVAC Services', 
    body: "CBVT is a clean, responsive website for Cebu Best Value Trading Corporation, a Cebu-based <span data-tip='Heating, ventilation, and air conditioning: systems that control temperature and airflow in buildings'>HVAC</span> and motor rewinding company. It highlights their services, including aircon repair, installation, cleaning, ductwork, exhaust systems, and chilled water installation.", 
    tags: ['React', 'TypeScript', 'Tailwind CSS'], 
    note: '', 
  }
];

// ── Skills ─────────────────────────────────────────────────
export const skillsData = [
  {
    id: 'ai',
    visual: 'logos',
    title: 'AI Engineering',
    body: `Building AI-powered applications and backend systems using large language models, computer vision, and generative AI. Hands-on experience with <span data-tip='Retrieval-Augmented Generation: lets AI retrieve relevant information before answering'>RAG</span>, vector databases, image and video generation, and designing reliable, scalable AI pipelines.`,
    tags: [
      'Python',
      'FastAPI',
      'LLMs',
      'RAG',
      'Qdrant',
      'Computer Vision',
      'Generative AI',
    ],
  },

  {
    id: 'ml',
    visual: 'certificates',
    title: 'Machine Learning & Data Science',
    body: `Exploring data, training models, and figuring out what works through hands-on projects and experiments. Completed DataCamp projects covering data analysis, preprocessing, and machine learning, alongside the Associate Data Scientist in Python and Machine Learning Scientist in Python career certifications. Experience with classification, predictive modeling, and evaluating model performance.`,
    tags: [
      'Python',
      'Pandas',
      'NumPy',
      'Scikit-learn',
      'TensorFlow',
      'DataCamp',
      'Machine Learning',
    ],
  },
  {
    id: 'backend',
    visual: 'logos',
    title: 'Backend Development & API Design',
    body: `I enjoy building the stuff that happens behind the scenes. Mostly working with Python and <span data-tip='A modern Python framework for building fast, asynchronous APIs'>FastAPI</span>, designing <span data-tip='APIs that use standard HTTP methods like GET, POST, PUT, and DELETE to communicate between applications'>RESTful APIs</span>, working with databases, and connecting different services together. I've built backends with asynchronous processing, <span data-tip='Controlling how many requests a client can make within a given period'>rate limiting</span>, caching, retries, and error handling. I like figuring out how to make things faster, more reliable, and easier to maintain as they grow.`,
    tags: [
      'Python',
      'FastAPI',
      'RESTful APIs',
      'SQL',
      'Supabase',
      'API Design',
    ],
    icons: [],
    note: '',
  },
  {
    id: 'cloud',
    visual: 'aws',
    title: 'Cloud Computing & AWS',
    body: `Getting hands-on with cloud infrastructure through personal projects and AWS training. Experience setting up and managing <span data-tip='Amazon Elastic Compute Cloud: virtual servers hosted on AWS'>EC2 instances</span>, configuring <span data-tip='Static public IP addresses that can be assigned to AWS resources'>Elastic IPs</span>, deploying websites and backend services, and managing cloud resources and costs. Completed AWS Cloud Practitioner Essentials and associate-level learning coursework, with a growing interest in cloud architecture and infrastructure.`,
    tags: [
      'AWS',
      'EC2',
      'Elastic IPs',
      'Linux',
      'Cloud Hosting',
      'Server Management',
    ],
  },
  {
    id: 'linux',
    visual: 'logos',
    title: 'Linux, Systems & Homelabbing',
    body: `I love tinkering with computers, especially when it means getting my hands dirty below the software layer. Running my own <span data-tip='A personal collection of computers, servers, and networking equipment used for experimenting, learning, and self-hosting'>homelab</span>, managing Linux machines, <span data-tip='Running applications and services on your own hardware instead of relying on third-party hosting'>self-hosting</span> services, writing <span data-tip='Shell scripts used to automate tasks and manage Linux systems'>Bash</span> scripts, and playing around with <span data-tip='Packaging applications and their dependencies into portable, isolated environments'>Docker containers</span>. From repurposing old hardware into Minecraft servers to crimping UTP cables while listening to Lady Gaga, I just really enjoy figuring out how things work (and occasionally breaking them in the process).`,
    tags: [
      'Linux',
      'Bash',
      'Homelabbing',
      'Docker',
      'Self-Hosting',
      'Networking',
      'Systems Administration',
    ],
    icons: [],
    note: '',
  },
];

// ── Affiliations ───────────────────────────────────────────
export const affiliationsData = [
  {
    org: 'Google Developer Groups on Campus – USC',
    role: 'Chapter Lead',
    date: 'Jan 2026 – April 2026',
    logo: 'gdgoc.png',
    note: '',
  },
  {
    org: 'DEVCON Cebu',
    role: 'Lead Learner',
    date: '2025 – April 2026',
    logo: 'devcon.png',
    note: '',
  },
  {
    org: 'Innovare',
    role: 'Assistant Secretary',
    date: '2025 – April 2026',
    logo: 'innovare.png',
    note: '',
  },
  {
    org: 'DOST START',
    role: 'AI & Data Lead',
    date: '2025 – April 2026',
    logo: 'dost_start.jpg',
    note: '',
  },
  {
    org: 'DOST SA USC',
    role: 'Finance Officer',
    date: '2024 – April 2026',
    logo: 'dsu.jpg',
    note: '',
  },
];

// ── Scholarships ───────────────────────────────────────────
export const scholarshipsData = [
  {
    name: 'DOST-SEI Merit Scholar',
    org: 'Department of Science and Technology',
    date: 'Jan 2024 – present',
    logo: 'dost_sei.png',
    recognition: '',
    body: 'Awarded on merit by the Department of Science and Technology, recognizing academic achievement through its scholarship program.',
    detailsTitle: 'Academic support',
    details: ['Tuition support and allowance.', 'BS Computer Science, University of San Carlos.'],
    note: '',
  },
  {
    name: 'DataCamp Scholar',
    org: 'DataCamp',
    date: 'Jan 2025 – present',
    logo: 'datacamp.jpg',
    recognition: '',
    body: 'Selected for a scholarship providing full access to DataCamp’s professional learning tracks.',
    detailsTitle: 'Learning opportunities',
    details: ['Data science, machine learning, and engineering coursework.', 'Hands-on projects in data analysis, preprocessing, and machine learning.'],
    note: '',
  },
];

// ── Education ──────────────────────────────────────────────
export const educationData = [
  {
    institution: 'Philippine National IT Standards (PhilNITS)',
    degree: 'Fundamental Information Technology Engineer (FE) Examination Passer',
    date: '2026',
    items: [
      'Passed the PhilNITS Fundamental Information Technology Engineer (FE) Examination',
      'Part of the Japan-aligned Information Technology Engineers Examination (ITEE) framework',
    ],
  },
  {
    institution: 'University of San Carlos',
    degree: 'BS in Computer Science',
    date: 'Sept 2023 – June 2027 \u00a0·\u00a0 Cebu City',
    items: [
      "Dean's Lister — 2nd Semester, A.Y. 2024–2025",
    ],
  },
  {
    institution: 'University of San Carlos – North Campus',
    degree: 'Senior High School — STEM strand',
    date: '2021 – 2023',
    items: [
      'Graduated with High Honors',
      'Carolinian Academic Distinction (CAD) — all Grade 11 & 12 semesters',
      'Second Place, USC SHS-STEM 4th Research Congress (May 2023)',
    ],
  }
];

export const skillCertificates = [
  { title: 'Associate Data Scientist in Python', href: 'https://www.datacamp.com/completed/statement-of-accomplishment/track/b881bd77a6a2b9187a80fb25832b0e7f75ee2f37?utm_medium=organic_social&utm_campaign=sharewidget&utm_content=soa' },
  { title: 'Associate Data Analyst in SQL', href: 'https://www.datacamp.com/completed/statement-of-accomplishment/track/3a28589d16420a81b5ee53f7ad8edb0ec1e1df2a?utm_medium=organic_social&utm_campaign=sharewidget&utm_content=soa' },
  { title: 'Machine Learning Scientist in Python', href: 'https://www.datacamp.com/completed/statement-of-accomplishment/track/94a3b9dfb0b9b1372ce59d5a126739eab2b781f4?utm_medium=organic_social&utm_campaign=sharewidget&utm_content=soa' },
];
