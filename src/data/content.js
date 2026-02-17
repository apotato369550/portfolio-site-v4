// ── Experience ─────────────────────────────────────────────
export const experienceData = [
  {
    title: 'AI Engineer Intern',
    org: 'Evo Tech Software Solutions',
    date: 'Sept 2025 – present',
    body: `Building the AI system behind a platform that reads Amazon product listings and tells sellers exactly what to fix — images, titles, SEO, reviews, all of it. Five images get analyzed simultaneously by a <span data-tip='A vision AI that reads images and describes what it sees — the same way a human would look at a photo and write a description'>vision model</span>, results merged into one verdict via <span data-tip='Split a big task into parallel pieces (map), combine results (reduce). Like having 5 people each read a chapter simultaneously, then writing one summary together — instead of one person reading all 5 chapters in sequence.'>map-reduce</span>. Cuts evaluation from 4 minutes to 90 seconds. Also built <span data-tip='AI that searches your own documents before answering — so it stays grounded in your actual data, not just what it was trained on'>RAG pipelines</span> for document retrieval and a video generation service producing 15–60 second product ads. Real latency budgets. <span data-tip='When part of a system fails, it returns partial results instead of crashing entirely — you get 3 out of 5 analyses instead of an error'>Graceful degradation</span> throughout.`,
  },
  {
    title: 'Systems Developer & Secretary',
    org: 'Cebu Best Value Trading (CBVT)',
    date: 'Jan 2024 – present',
    body: `My grandfather runs a trading company. He wrote quotations by hand. I built software that reads those handwritten notes with <span data-tip='Optical Character Recognition — converts handwriting or printed images into editable digital text'>OCR</span> and outputs formatted digital documents, replacing a manual process. Also built the inventory and order tracking system for the kitchen operations side of the family business. This is what "real client" looks like — someone you eat dinner with.`,
  },
  {
    title: 'Chapter Lead',
    org: 'Google Developer Groups on Campus – USC (GDGoc-USC)',
    date: 'Jan 2026 – present',
    body: "Running USC's developer community. Technical workshops, study jams, getting CS students from theory to practice. Promoted from Data Science Officer in August 2025.",
  },
  {
    minor: true,
    body: '<em>Also:</em> Finance Officer, DOST SA USC &nbsp;&middot;&nbsp; Assistant Secretary, Innovare &nbsp;&middot;&nbsp; AI &amp; Data Lead, DOST START &nbsp;&middot;&nbsp; Lead Learner, DEVCON &nbsp;&middot;&nbsp; Freelance web development &amp; client tools (2020–present)',
  },
];

// ── Projects ───────────────────────────────────────────────
export const featuredProject = {
  title: 'Amazon Listing Analyzer API',
  date: '2025 – present',
  label: 'Production · Evo Tech',
  body: `16+ endpoints for AI-powered analysis of Amazon product listings. The interesting part is the architecture: five product images analyzed in parallel, each by its own <span data-tip='An AI model from OpenAI that reads and understands images — tells you what it sees, evaluates quality, identifies issues'>vision model call</span>, results <span data-tip='Combining multiple independent outputs into one unified result — like a judge reading five expert reports and writing one verdict'>synthesized</span> into one verdict. Also includes a <span data-tip='A database that stores meaning, not just text — lets you search by concept rather than exact keywords'>vector database</span> for semantic search over listing data, and a video generation pipeline producing product ads in 15, 30, 45, or 60 seconds.`,
  tags: ['FastAPI', 'GPT-4 Vision', 'Qdrant', 'Sora 2', 'Python', 'asyncio'],
};

export const projectsData = [
  {
    title: 'ai-yeast',
    date: '2025 – present',
    label: 'Research · LLM Memory System',
    body: `AI models forget everything when a conversation ends. ai-yeast gives them memory that persists, evolves, and decays — like biological memory. Three layers: recent events, distilled facts, core identity. Memories strengthen through use and fade over time. Running on <span data-tip='A 7-billion-parameter open-source language model that runs locally on your own hardware — no internet, no API fees, no data leaving the machine'>Mistral 7B</span> via Ollama.`,
    tags: ['Mistral 7B', 'RAG', 'Node.js', 'Ollama'],
  },
  {
    title: 'timetabling-algorithms',
    date: '2025 – present',
    label: 'Research · University Scheduling',
    body: `University scheduling is a <span data-tip='Finding a valid solution within strict rules — like fitting professors, rooms, and time slots together with no conflicts'>constraint satisfaction problem</span>. This is a research framework comparing a custom <span data-tip='Try a solution; if it fails, back up and try the next option. Repeat until valid.'>backtracking solver</span> against Google's industrial-grade OR-Tools CP-SAT on real USC course data. When does building your own solver beat using someone else's?`,
    tags: ['Python', 'OR-Tools', 'Algorithms', 'Research'],
  },
  {
    title: 'jays-ai-agent-suite',
    date: '2025 – present',
    label: 'Personal · Agent Design',
    body: "A library of specialized AI agents, each scoped to a single job with hard limits. The design principle: agents execute within defined boundaries; humans decide what happens next. No agent talks to another. Built while working with Claude Code — encodes how I actually think about delegation.",
    tags: ['Claude API', 'Bash', 'Agent Design'],
  },
  {
    title: 'enrollmate',
    date: '2024 – present',
    label: 'Personal Tool · Course Scheduler',
    body: `Enrollment means checking schedule conflicts across dozens of combinations — by hand. Enrollmate runs a <span data-tip='An algorithm that systematically tries possibilities, backing up when it hits a dead end, until it finds every valid option'>backtracking search</span> over your courses and returns every conflict-free schedule. Companion browser extension scrapes course data directly from the university portal — no manual entry.`,
    tags: ['Next.js', 'Supabase', 'TypeScript', 'Chrome Extension'],
  },
  {
    title: 'kitchen-management-system',
    date: '2024',
    label: 'Client · Family Business',
    body: "A family food business tracked raw materials, production, and orders on paper. Built a unified system to replace that: inventory, production output, customer orders, role-based access, Excel/PDF export. The constraint wasn't technical — it was understanding how the business actually worked before writing a line of code.",
    tags: ['Django', 'PostgreSQL', 'Python', 'Tailwind'],
  },
];

// ── Skills ─────────────────────────────────────────────────
export const skillsData = [
  { label: 'AI/ML & Data',             skills: 'Python, RAG pipelines, LangChain, TensorFlow, Scikit-learn, Pandas, NumPy, NLP' },
  { label: 'Backend & APIs',           skills: 'FastAPI, Flask, Node.js, Express, RESTful design, SQL, MongoDB, Firebase' },
  { label: 'Systems & Infrastructure', skills: 'Linux, Bash, homelabbing, Docker, Git, systems administration' },
  { label: 'Generative AI',            skills: 'LLM orchestration, Sora 2 video generation, image pipelines, prompt engineering' },
  { label: 'Other',                    skills: 'Java, C, JavaScript, React, PHP, Laravel, HTML/CSS, DeFi/Web3' },
];

// ── Education ──────────────────────────────────────────────
export const educationData = [
  {
    institution: 'University of San Carlos',
    degree: 'BS in Computer Science',
    date: 'Sept 2023 – June 2027 \u00a0·\u00a0 Cebu City',
    items: [
      "Dean's Lister — 2nd Semester, A.Y. 2024–2025",
      'DOST-SEI Merit Scholar (Jan 2024) \u00a0·\u00a0 DataCamp Scholar (Jan 2025)',
      'Second Place, USC SHS-STEM 4th Research Congress (May 2023)',
    ],
  },
  {
    institution: 'University of San Carlos – North Campus',
    degree: 'Senior High School — STEM strand',
    date: '2021 – 2023',
    items: [
      'Graduated with High Honors',
      'Carolinian Academic Distinction (CAD) — all Grade 11 & 12 semesters',
    ],
  },
];
