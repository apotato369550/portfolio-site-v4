# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Intent

Portfolio site v4 for **John Andre Yap (Jay)** — AI engineer, CS student at USC Cebu, jack-of-all-trades. This is a greenfield build. No framework lock-in: plain HTML/CSS/JS, with React and Tailwind as the ceiling if complexity demands it. No database, no backend APIs beyond a contact form (email only).

Aesthetic: black and white, minimal, Harvard-CV-turned-website. Clean typography, subtle transitions. Not vaporwave (that was v3) — this is restraint. The site should feel like it was made by someone who could do anything but chose not to.

Audience splits by context:
- **Gen Z / peers** — nonchalant, chill, metahumor. Smart but doesn't perform it.
- **Family / relatives** — warm, generous, dependable.
- **Business contacts / extended family** — the golden child. Competent, trustworthy.

## Subject Data (Jay)

Primary reference files live in `references/`:
- `references/data/cv.txt` — full structured CV in YAML (canonical source of truth for content)
- `references/python_ai_ml__feb-2026.yaml` — AI engineer resume (most current, Feb 2026)
- `references/data/complete_resume.txt` — narrative resume
- `references/ESSENCE.md` — personality distillation from v3
- `references/data/cv2.txt` — alternate CV view

Key facts:
- Name: John Andre Saberon Yap, goes by Jay
- Location: Cebu City, Philippines
- GitHub: `apotato369550`
- Currently: AI Engineer Intern at Evo Tech, GDGoc-USC Lead, 2nd year CS at USC, Innovare Assistant Secretary, DOST SA USC Finance Officer, DOST START AI and Data Lead, DEVCON Lead Learner
- Scholarships: DOST-SEI Merit Scholar, DataCamp Scholar
- Active projects: timetabling-algorithms, jays-ai-agent-suite, ai-yeast, CBVT company site

## Architecture Direction

- **No frameworks by default.** Vanilla HTML/CSS/JS first. Only introduce React or Tailwind if the complexity genuinely warrants it.
- **Static only.** No database, no API calls except possibly a contact form via a mail service (e.g., Formspree, EmailJS).
- **GitHub scraping**: Pull README content from Jay's public repos (`apotato369550`) to populate project sections. Fetch at build time or use a lightweight client-side fetch — no server required.
- **Structure**: Single-page or minimal multi-page. Think long-scroll CV layout with smooth section transitions, not a SPA.
- **Typography-first**: The design is the typography. Body text, hierarchy, whitespace. No heavy graphics.

## Development

No build step exists yet. When one is introduced, document it here.

To serve locally during development:
```bash
# If plain HTML — just open index.html in browser, or:
python3 -m http.server 8080
# or
npx serve .
```

If a bundler or framework gets added, update this section with the actual commands.

## Constraints

- Black and white palette (accent color at most: one, subtle)
- Minimal JS — transitions and scroll behavior only; no SPA routing unless justified
- Contact form via third-party mail service only (no backend)
- GitHub READMEs should be fetched from `apotato369550`'s public repos and used as project descriptions
- No authentication, no sessions, no user data
