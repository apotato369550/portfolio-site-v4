// ── Experience ─────────────────────────────────────────────
export const experienceData = [
  {
    title: 'AI Engineer Intern',
    org: 'Evo Tech Software Solutions',
    date: 'Sept 2025 – present',
    logo: 'evotech.jpeg',
    body: `Building the AI system behind a platform that analyzes and optimizes ecommerce data. Exploring and tinkering with stuff like <span data-tip='Retrieval-Augmented Generation: AI that searches your own documents before answering — so it stays grounded in real data, not just what it was trained on'>RAG</span>, <span data-tip='AI systems trained on massive amounts of text that can read, write, summarize, and reason about language'>large language models</span>, <span data-tip='AI that creates images or video from text descriptions or other inputs'>video and image generation models</span>, and architectural principles like <span data-tip='Split a task into parallel pieces (map), then combine all the results (reduce) — faster than doing everything one step at a time'>map-reduction</span>, <span data-tip='When something goes wrong, stop immediately and report the error — rather than continuing with bad or incomplete data'>fail-fast</span>, and <span data-tip='When part of a system fails, it returns partial results instead of crashing entirely — you get something useful instead of a blank error screen'>graceful degradation</span>. And, in doing so, learning a lot about the possibilities and limitations of AI - one line of Python code written at a time.`,
    note: '',
  },
  {
    title: 'Systems Developer & Secretary',
    org: 'Cebu Best Value Trading (CBVT)',
    date: 'Jan 2024 – present',
    logo: 'cbvt',
    body: `As the current standing secretary and developer of our company, I helped build some tools to automate some parts of the business process - quotation generation and record-keeping, resource management, and more - while integrating AI technologies like <span data-tip='Optical Character Recognition — converts handwriting or printed text in images into editable digital text'>OCR</span> to read my grandfather's handwriting.`,
    note: '',
  },
  {
    title: 'Chapter Lead',
    org: 'Google Developer Groups on Campus – USC (GDGoc-USC)',
    date: 'Jan 2026 – present',
    logo: 'gdgoc.png',
    body: "Running USC's developer community. Technical workshops, study jams, getting CS students from theory to practice. Promoted from Data Science Officer in August 2025. We fill in the knowledge gaps that coursework and academia can't normally fill. We prepare our members to be industry-aware and industry-ready",
    note: '',
  },
  {
    title: 'AI & Data Lead',
    org: 'DOST START',
    date: '2025 – present',
    logo: 'dost_start.jpg',
    body: 'Leading the AI and data workstream for DOST START. An organization of science and technology scholars across the Philippines with a shared love of anything related to technology',
    note: '',
  },
];

// ── Projects ───────────────────────────────────────────────
export const featuredProject = {
  title: 'Amazon Listing Analyzer API',
  date: '2025 – present',
  label: 'Production · Evo Tech',
  body: `More than a dozen <span data-tip='Individual URLs in an API — like doors into the system, each handling one specific function'>endpoints</span>, AI-powered insights and analysis, <span data-tip='AI that can see and interpret images and video the way a human would — identifying objects, reading text, judging quality'>computer vision</span>, application of software architectural principles, <span data-tip='Databases that store meaning rather than just text — lets you search by concept instead of exact keywords'>vector databases</span>, image, video, and <span data-tip='Retrieval-Augmented Generation: a pipeline where AI searches your documents before generating answers — grounding output in real data'>RAG</span> pipelines`,
  tags: ['FastAPI', 'GPT-4 Vision', 'Qdrant', 'Sora 2', 'Python', 'asyncio'],
};

export const projectsData = [
  {
    title: 'ai-yeast',
    date: '2025 – present',
    label: 'Research · LLM Memory System',
    body: `AI models forget everything when a conversation ends. ai-yeast gives them memory that persists, evolves, and decays. Three layers: recent events, distilled facts, core identity. Memories strengthen through use and fade over time. Running on <span data-tip='A 7-billion-parameter open-source language model that runs locally on your own hardware, ensuring data privacy. No internet, no API fees, no data leaving the machine'>Mistral 7B</span> via <span data-tip='Software that lets you run AI models locally on your own machine — no cloud, no internet required, no data sent anywhere'>Ollama</span>. Just a model with persistent memory that knows your ins and outs when it comes to working with it.`,
    tags: ['Mistral 7B', 'RAG', 'Node.js', 'Ollama'],
    note: '',
  },
  {
    title: 'timetabling-algorithms',
    date: '2025 – present',
    label: 'Research · University Scheduling',
    body: `University scheduling is a <span data-tip='Finding a valid solution within strict rules — like fitting professors, rooms, and time slots together with no conflicts'>constraint satisfaction problem</span>. This is a research framework comparing a custom <span data-tip='Try a solution; if it fails, back up and try the next option. Repeat until valid.'>backtracking solver</span> against Google's industrial-grade <span data-tip="Google's industrial-strength optimization engine — built to solve massive constraint problems far faster than a handwritten algorithm could">OR-Tools CP-SAT</span> on real USC course data. When does building your own solver beat using someone else's?`,
    tags: ['Python', 'OR-Tools', 'Algorithms', 'Research'],
    note: '',
  },
  {
    title: 'jays-ai-agent-suite',
    date: '2025 – present',
    label: 'Personal · Agent Design',
    body: `A library of specialized <span data-tip='Software programs that can make decisions and take actions on their own to complete a task — like an intern that executes what you ask, within the limits you set'>AI agents</span>, each scoped to a single job with hard limits. The design principle: agents execute within defined boundaries; humans decide what happens next. No agent talks to another. Built while working with <span data-tip="Anthropic's AI coding assistant — the same tool used to build this site">Claude Code</span>. Contains my philosophy and approach to <span data-tip='Coordinating multiple AI agents to work on complex tasks together — while keeping humans in control of every decision'>AI agent orchestration</span>. Encodes how I actually think about delegation.`,
    tags: ['Claude API', 'Bash', 'Agent Design'],
    note: '',
  },
  {
    title: 'enrollmate',
    date: '2024 – present',
    label: 'Personal Tool · Course Scheduler',
    body: `Enrollment means checking schedule conflicts across dozens of combinations by hand. Enrollmate runs a <span data-tip='An algorithm that systematically tries possibilities, backing up when it hits a dead end, until it finds every valid option'>backtracking search</span> over your courses and returns every conflict-free schedule. Companion <span data-tip='A small add-on installed in your web browser that adds new features or modifies the websites you visit'>browser extension</span> <span data-tip='Automatically reads and extracts data from a website — like copying information by hand, but instantly and at scale'>scrapes</span> course data directly from the university portal — no manual entry.`,
    tags: ['Next.js', 'Supabase', 'TypeScript', 'Chrome Extension'],
    note: '',
  },
  {
    title: 'kitchen-management-system',
    date: '2024',
    label: 'Client · Family Business',
    body: `A family food business tracked raw materials, production, and orders on paper. Built a unified system to replace that: inventory, production output, customer orders, <span data-tip='Different users get different permissions based on their role — a manager sees everything, a staff member sees only what they need'>role-based access</span>, Excel/PDF export. Understanding business processes was a real challenge and was the key factor in building something actually usable.`,
    tags: ['Django', 'PostgreSQL', 'Python', 'Tailwind'],
    note: '',
  },
];

// ── Skills ─────────────────────────────────────────────────
export const skillsData = [
  {
    label: 'AI, Machine Learning & Data Science',
    description: `From building production pipelines that actually ship, <span data-tip='Retrieval-Augmented Generation: AI that searches your own documents before answering — grounded in real data, not just training'>RAG</span> systems, <span data-tip='Sequences of AI steps where image-reading models pass their results to other models for further processing'>vision model chains</span>, <span data-tip='Making large language models return data in a consistent, machine-readable format like JSON — predictable and parseable'>structured output from LLMs</span>. To training <span data-tip='Computing systems loosely inspired by the human brain — learn to recognize patterns by processing large amounts of data'>neural networks</span> and machine learning models on real-world datasets. And performing statistical analysis on data that matters. Less theory and speculation, more practice and application.`,
    skills: 'Python, RAG pipelines, LangChain, TensorFlow, Scikit-learn, Pandas, NumPy, NLP',
    icons: ['devicon-python-plain colored', 'devicon-tensorflow-original colored', 'devicon-pandas-original colored', 'devicon-numpy-original colored'],
    note: '',
  },
  {
    label: 'Backend & APIs',
    description: `Designing <span data-tip='Application Programming Interfaces: standardized ways for software systems to talk to each other — like a menu that tells you what you can order from the kitchen'>APIs</span> that other systems depend on: <span data-tip='Handling multiple tasks at the same time without waiting for each to finish before starting the next — like a waiter taking orders from multiple tables simultaneously'>async</span>, well-scoped, and documented by the shape of their endpoints. Working with stuff like <span data-tip='A widely-used relational database that stores data in structured rows and columns — like a very powerful spreadsheet'>SQL</span> and <span data-tip='Databases that store data in flexible formats instead of traditional rows and columns — better for unstructured or rapidly changing data'>NoSQL</span> among other things.`,
    skills: 'FastAPI, Flask, Node.js, Express, RESTful design, SQL, MongoDB, Firebase',
    icons: ['devicon-fastapi-plain colored', 'devicon-flask-original', 'devicon-nodejs-plain colored', 'devicon-express-original', 'devicon-mongodb-plain colored', 'devicon-firebase-plain colored'],
    note: '',
  },
  {
    label: 'Systems, Infrastructure, and Decentralized finance',
    description: `Running my own <span data-tip='A personal setup of servers and networking equipment at home for learning, experimenting, and self-hosting'>homelab</span>. Managing Linux boxes, writing <span data-tip='Small scripts that automate repetitive tasks in a Linux/Mac terminal — the duct tape of software infrastructure'>Bash</span> glue, <span data-tip='Packaging software and all its dependencies into a self-contained unit that runs the same way on any machine'>containerizing</span> services. Comfortable below the framework layer. Loving crimping <span data-tip='Ethernet cables — the physical wires that connect devices in a local network'>UTP cables</span> to some Lady Gaga and tinkering with <span data-tip='Computers running specialized software to earn cryptocurrency by solving complex math problems around the clock'>crypto miners</span> whenever I get bored. I went down the cryptocurrency rabbithole and came out with knowledge of Linux.`,
    skills: 'Linux, Bash, homelabbing, Docker, Git, systems administration',
    icons: ['devicon-linux-plain', 'devicon-bash-plain', 'devicon-docker-plain colored', 'devicon-git-plain colored'],
    note: '',
  },
  {
    label: 'Generative AI and Agent Orchestration',
    description: `<span data-tip='Coordinating multiple AI agents and models to work together on complex tasks — while keeping humans in control of every decision'>Orchestrating</span> agents and models that produce something: text, images, video, and code. The interesting part is what happens after generation: evaluating and reviewing model output, and making tweaks to input and <span data-tip='The instructions you give an AI agent that define its role, constraints, and how it should behave'>agent prompts</span> to make things just a bit better.`,
    skills: 'AI Agent orchestration, Sora 2 video generation, image pipelines, prompt engineering',
    icons: ['devicon-python-plain colored', 'devicon-jupyter-plain colored'],
    note: '',
  },
  {
    label: 'Other',
    description: `Things I reach for when the job calls for them. Some learned early (Java, C), some picked up for a specific project, all used in something real at least once. A little variety never hurt anyone. Includes <span data-tip='Decentralized Finance and Web3: financial systems and applications built on blockchain technology — no banks, no middlemen, code enforces the rules'>DeFi/Web3</span> from the crypto rabbit hole days.`,
    skills: 'Java, C, JavaScript, React, PHP, Laravel, HTML/CSS, DeFi/Web3',
    icons: ['devicon-java-plain colored', 'devicon-c-plain', 'devicon-javascript-plain colored', 'devicon-react-original colored', 'devicon-php-plain colored', 'devicon-laravel-plain colored', 'devicon-html5-plain colored', 'devicon-css3-plain colored'],
    note: '',
  },
];

// ── Affiliations ───────────────────────────────────────────
export const affiliationsData = [
  {
    org: 'Google Developer Groups on Campus – USC',
    role: 'Chapter Lead',
    date: 'Jan 2026 – present',
    logo: 'gdgoc.png',
    note: '',
  },
  {
    org: 'DEVCON Cebu',
    role: 'Lead Learner',
    date: '2025 – present',
    logo: 'devcon.png',
    note: '',
  },
  {
    org: 'Innovare',
    role: 'Assistant Secretary',
    date: '2025 – present',
    logo: 'innovare.png',
    note: '',
  },
  {
    org: 'DOST START',
    role: 'AI & Data Lead',
    date: '2025 – present',
    logo: 'dost_start.jpg',
    note: '',
  },
  {
    org: 'DOST SA USC',
    role: 'Finance Officer',
    date: '2024 – present',
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
    body: 'Awarded on merit by the national government science agency. Covers partial tuition for the BS Computer Science program at the University of San Carlos.',
    note: '',
  },
  {
    name: 'DataCamp Scholar',
    org: 'DataCamp',
    date: 'Jan 2025 – present',
    logo: 'datacamp.jpg',
    body: 'Competitive scholarship granting full access to the DataCamp professional track: data science, machine learning, and engineering courses.',
    note: '',
  },
];

// ── Education ──────────────────────────────────────────────
export const educationData = [
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
  },
];
