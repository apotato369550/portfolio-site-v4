# Standout Projects

The work that actually matters. Built with purpose, constraints, and real stakes.

---

## ai-yeast — LLM Memory System

**Problem:** LLMs are stateless. Every session starts from zero. ai-yeast gives them memory that persists, evolves, and decays — like biological memory does.

**Architecture:** Three-layer memory stack: episodic (recent events), semantic (distilled facts), core identity. Memories strengthen through use, decay over time. RAG layer for document retrieval. Reflection gates validate outputs before updating memory stores.

**Input → Process → Output:** User query + conversation history + memory stores → RAG retrieval + Mistral 7B reasoning + reflection gates → persistent identity response + updated memory stores.

**Tech:** Node.js, Mistral 7B via Ollama, RAG pipelines, JSON stores, SSH.

**Skills:** LLM architecture, memory system design, RAG implementation, extended thinking, constraint modeling.

**Why:** Research exploration into LLM continuity and self-consistency. Personal obsession with the question: can a model build a coherent self over time?

---

## jays-ai-agent-suite — Personal Agent Library

**Problem:** AI assistants without explicit scope boundaries make bad decisions autonomously. This is a library of specialized agents — each one scoped to a single job with hard limits.

**Architecture:** Each agent defined by: role, tools available, what to ignore, when to stop, how to report. Human decides next steps. Agents execute within stated boundaries only. No inter-agent communication.

**Input → Process → Output:** Human intent → explicit scope definition → agent execution within constraints → findings reported clean → human decides next action.

**Tech:** Markdown agent definitions, Claude API, Bash, YAML.

**Skills:** Agent design, prompt engineering, workflow orchestration, system architecture, human-in-the-loop design.

**Why:** Built while working with Claude Code. Encodes how Jay actually thinks about delegation: tools amplify capacity, but judgment stays human.

---

## timetabling-algorithms — University Scheduling Research

**Problem:** University course scheduling is a constraint satisfaction problem — rooms, professors, and time slots all have to fit together without conflict. This is active research into when custom solvers beat industrial tools and vice versa.

**Architecture:** Framework comparing two approaches on the same problem sets: custom backtracking with intelligent pruning vs. Google's OR-Tools CP-SAT solver. Tested on real USC course data and synthetic problem sets.

**Input → Process → Output:** Course sections + constraint definitions → backtracking OR CP-SAT solver → feasible schedule + execution stats + comparison metrics across both approaches.

**Tech:** Python 3.8+, Google OR-Tools, pytest, YAML, Rich TUI.

**Skills:** Constraint satisfaction algorithms, backtracking with pruning, algorithm benchmarking, comparative research methodology.

**Why:** Started from the real frustration of USC's scheduling problems. Became a genuine research framework for understanding where custom implementations beat general-purpose solvers.

---

## hamiltonian-cycles-heuristic — TSP Anchor Research

**Problem:** When solving the Traveling Salesman Problem greedily, does starting from a high-weight, high-variance vertex ("anchor") produce better tours? Research project testing whether vertex edge statistics predict tour quality.

**Architecture:** Generates Euclidean/metric/random graphs, computes vertex statistics (degree, edge weight variance), runs greedy tours from multiple starting vertices, correlates anchor quality with tour length.

**Input → Process → Output:** Graph + vertex stats → anchor heuristic from multiple starting vertices → tour quality results + statistical correlation analysis.

**Tech:** Python, NumPy, SciPy, pandas, scikit-learn, NetworkX, matplotlib, seaborn.

**Skills:** TSP heuristics, graph algorithms, statistical analysis, regression modeling, research design.

**Why:** Simplified from an over-engineered v1. The whole point was to answer one focused question cleanly, not build a framework.

---

## homelab-manager — Infrastructure Automation

**Problem:** Managing multiple homelab nodes (specs, monitoring, bandwidth tests) without constantly SSHing into each one manually and typing the same commands.

**Architecture:** Bash CLI that collects system specs, monitors real-time stats, and tests bandwidth across multiple nodes. SSH key-based remote execution. Interactive menu or direct CLI args.

**Input → Process → Output:** Node configuration (interactive menu or CLI args) → local/remote system interrogation via SSH → aggregated specs + bandwidth results + live monitoring display.

**Tech:** Bash, SSH, neofetch, speedtest-cli, tmux, lm-sensors.

**Skills:** Bash scripting, SSH key management, multi-node systems administration, interactive CLI design.

**Why:** Personal infrastructure. The frustration of repetitive manual work is the best motivation for automation.

---

## sysdawg — LLM-Powered SRE Copilot

**Problem:** Remote troubleshooting across homelab nodes is slow. sysdawg runs automatic system diagnostics and sends them to Mistral 7B for advisory analysis — without ever executing commands autonomously.

**Architecture:** Advisory-only by design. Collects diagnostics (memory, disk, processes), sends context to local Mistral 7B via Ollama, returns advisory text. No command execution capability — deliberately neutered.

**Input → Process → Output:** User query + automatic system diagnostics → Mistral 7B prompt → advisory troubleshooting response, no execution.

**Tech:** Bash, SSH, Mistral 7B, Ollama, .env configuration.

**Skills:** System diagnostics, LLM integration, read-only safety design, shell scripting, SRE practices.

**Why:** The "advisory-only" constraint was intentional. A homelab SRE copilot that could execute commands autonomously is a security problem. So it doesn't.

---

## image-detection-app — Real-Time ASL Hand Sign Detection

**Problem:** Recognize American Sign Language alphabet letters from a webcam feed in real time, at usable FPS, with per-hand confidence scores.

**Architecture:** MediaPipe Hands detects 21 landmark points per hand per frame. Rule-based geometric classifier maps landmark ratios to ASL letters. OpenCV handles frame capture and visualization.

**Input → Process → Output:** Webcam frames → MediaPipe hand landmark detection (21 points/hand) → geometric pose classification → ASL letter + confidence score + bounding box visualization.

**Tech:** Python 3.8+, MediaPipe Hands, OpenCV, TensorFlow, NumPy.

**Skills:** Computer vision, hand pose estimation, real-time inference optimization, gesture recognition, ML model integration.

**Why:** Practical exploration of MediaPipe and real-time vision. Also: ~80-87% accuracy for well-defined poses at 20-30 FPS on commodity hardware.

---

## kitchen-management-system — Family Business Operations Tool

**Problem:** A family food business was tracking raw materials, production output, and customer orders across paper and fragmented tools. Built a unified system to replace that.

**Architecture:** Django backend with PostgreSQL. Three modules: inventory (raw materials), production (output tracking), orders (customer management). Role-based access. Excel/PDF export for actual business workflows.

**Input → Process → Output:** User input (materials, orders, consumption) → Django processing + database validation → storage + Excel/PDF export for operations.

**Tech:** Python, Django, PostgreSQL, Tailwind CSS, Excel/PDF export.

**Skills:** Backend web development, relational database design, user roles and permissions, business workflow analysis, data export.

**Why:** Built for CBVT (grandfather's company). Real client. Real operations. The constraint wasn't technical — it was understanding how the business actually worked before writing a line of code.

---

## enrollmate — Intelligent Course Scheduler

**Problem:** University course registration involves manually checking for schedule conflicts across dozens of combinations. Enrollmate automates this with a constraint-solving backtracking algorithm.

**Architecture:** Next.js frontend with Supabase backend. Core is a backtracking constraint satisfaction engine that finds conflict-free schedule permutations from user-selected courses. PDF export for registration.

**Input → Process → Output:** Student course selections → conflict detection + backtracking search → valid schedule permutations ranked by preference → PDF export.

**Tech:** Next.js, React, TypeScript, Supabase, Tailwind CSS, jsPDF.

**Skills:** Full-stack development, constraint satisfaction algorithm implementation, real-time data sync, PDF generation.

**Why:** Personal tool. Inspired directly by the timetabling research. The academic problem and the practical frustration fed each other.

---

## enrollmate-browser-plugin — Course Data Automation

**Problem:** Manually entering course data into Enrollmate from the university registration portal is tedious. This browser extension scrapes it automatically.

**Architecture:** Content script reads DOM from university registration pages, parses course data, sends to background service worker, syncs to Enrollmate via authenticated API call.

**Input → Process → Output:** University course registration page HTML → content script DOM scraping → data parsing + validation → background API call → Enrollmate sync.

**Tech:** JavaScript, Chrome/Firefox Extension API, Manifest v3, DOM scraping.

**Skills:** Browser extension development, DOM parsing, API integration, authentication flow, cross-browser compatibility.

**Why:** Companion to Enrollmate. The manual import step was the biggest friction point. Removed it.

---

## finance-app-mvp — Filipino Personal Finance Platform

**Problem:** Filipino personal finance education is sparse. This MVP targets financial literacy through interactive quizzes, fund analysis, and AI-powered recommendations — built for the local context.

**Architecture:** Next.js + Supabase with mock data for MVP testing. Financial quiz engine, fund analysis with mock or AI backend, personalized recommendation dashboard. Dev-mode toggles for switching between mock and live data.

**Input → Process → Output:** User input (quiz responses, fund data) → mock or AI analysis engine → personalized recommendations + dashboard display.

**Tech:** Next.js, React, TypeScript, Tailwind CSS, Supabase.

**Skills:** Full-stack development, financial domain logic, mock-to-live data architecture, local market context.

**Why:** MVP for a fintech idea. Built with Filipino financial context in mind, not a Western template applied to a different market.

---

## dcism-starship — Real-Time Multiplayer Territory Game

**Problem:** Build a real-time multiplayer territory control game with vaporwave aesthetics, resource management, and server-authoritative state.

**Architecture:** Node.js/Express server with Socket.IO for real-time broadcast. HTML5 Canvas for rendering. Game engine processes all state server-side and broadcasts to all connected clients. Keyboard/mouse input → server → all clients rendered in sync.

**Input → Process → Output:** Player input (keyboard/mouse) → server-side game engine (territory, resources, collision) → Socket.IO broadcast → Canvas render on all clients simultaneously.

**Tech:** Node.js, Express, Socket.IO, HTML5 Canvas, JavaScript.

**Skills:** Real-time networking, server-authoritative game engine design, Canvas rendering, game balance, WebSocket state management.

**Why:** Personal creative project. Exploring real-time multiplayer mechanics is genuinely hard — networking latency, state synchronization, game feel. Built to understand it.

---

## im-2-project — CBVT Service Management Platform

**Problem:** CBVT (grandfather's HVAC company) handled service requests, quotations, technician assignments, and invoicing manually. Built a full web platform to digitize this.

**Architecture:** PHP REST API backend with JWT authentication. React frontend. MySQL database. Covers the full service lifecycle: client submits request → quotation generated → manager assigns worker → invoice issued.

**Input → Process → Output:** Client/worker/manager form input → PHP API processing + JWT auth → MySQL storage → React frontend displays status across all user roles.

**Tech:** PHP, SQL, React, HTML, CSS, JavaScript, JWT.

**Skills:** Full-stack web development, RESTful API design, database schema design, multi-role authentication, business process digitization.

**Why:** Course project (IM-2) that happened to align with real family business needs. Combined academic requirement with practical client work.

---

## my-mystnodes-ui — Mysterium Node Manager

**Problem:** Managing multiple Mysterium Network nodes across bare-metal and Docker instances meant running manual curl commands and parsing JSON by eye. Built a unified Bash CLI to handle it.

**Architecture:** Bash script with interactive menu. Each node configured with IP/port. CLI sends HTTP requests to TequilAPI, parses JSON with jq, outputs formatted status + logging. Handles both interactive and non-interactive invocation.

**Input → Process → Output:** User command (CLI/menu) → HTTP requests to TequilAPI on each node → JSON parsing + formatted output + log file.

**Tech:** Bash, curl, jq, HTTP/REST, TequilAPI.

**Skills:** Bash scripting, REST API consumption from shell, multi-node management, system administration, crypto node operations.

**Why:** Homelab project. Also: Mysterium is a decentralized VPN node network. Running nodes as a DeFi experiment. Needed tooling that didn't exist.

---

*Note: Evo Tech internship work (Amazon listing analyzer, video generation service, RAG pipelines) is documented separately — see `references/evotech/`.*
