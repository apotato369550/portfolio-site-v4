# ARCHITECTURE.md

Portfolio site v4 — static, typography-first, no server.

---

## Data Flow

```
GitHub API (apotato369550)
    └── scripts/scrape_readmes.py
            └── references/readmes/*.md       (raw, one per repo)
                    └── references/projects/*.md   (curated, grouped by theme)
                            └── index.html (project section)

references/data/cv.txt (YAML)
references/python_ai_ml__feb-2026.yaml
        └── index.html (experience, education, skills sections)

Third-party mail service (Formspree / EmailJS)
        └── index.html (contact form)
```

---

## Layer Breakdown

### 1. Data / Reference Layer (`references/`)
All content lives here. Nothing is hardcoded in HTML.

| Path | Role |
|---|---|
| `references/data/cv.txt` | Canonical CV — YAML. Source of truth for experience, education, skills. |
| `references/python_ai_ml__feb-2026.yaml` | Most current resume — AI engineer slant (Feb 2026). |
| `references/ESSENCE.md` | Personality distillation from v3. Tone reference, not content. |
| `references/readmes/*.md` | Raw scraped READMEs, one per public repo. Generated — do not edit manually. |
| `references/readmes/_index.json` | Index of all repos with name, description, readme_file path. |
| `references/projects/*.md` | Curated thematic groupings. These feed the project section. |

### 2. Scraping Pipeline (`scripts/`)
One-shot CLI. Produces the `references/readmes/` directory.

```
scrape_readmes.py
  → GitHub API (paginated, authenticated via .env GITHUB_TOKEN)
  → per-repo: fetch README metadata → download raw content
  → write references/readmes/<repo>.md
  → write references/readmes/_index.json
```

Re-run anytime repos are updated. Output is stable — safe to commit.

### 3. Presentation Layer (root)
Vanilla HTML/CSS/JS. No build step.

```
index.html          ← single page, long-scroll
css/
  └── style.css     ← typography system, layout, B&W palette
js/
  └── main.js       ← scroll behavior, transitions, README fetch (if client-side)
```

No bundler, no framework — unless complexity forces it (React/Tailwind as ceiling).

### 4. Project Section — Two Loading Strategies

**Option A — Build-time bake-in (preferred)**
Read `references/projects/*.md` and `_index.json` during local dev, paste rendered HTML into `index.html`. No runtime fetch needed.

**Option B — Client-side fetch**
`main.js` fetches `_index.json` at runtime, renders project cards from README content.
Use this if the project section needs to stay fresh without rebuilding.

### 5. Contact Form
No backend. Delegate to Formspree or EmailJS.
Form submits POST to their endpoint → they handle email delivery.

---

## Thematic Project Groups (`references/projects/`)

| File | Contains |
|---|---|
| `standout_projects.md` | The serious work — AI, systems, research, real tools |
| `web_dev_arc.md` | Learning progression — bootstrap → laravel → react → fullstack |
| `interesting_stuff.md` | Quirky, security-curious, Filipino-flavored, character-revealing |
| `novelty.md` | The "I was 15" era — games, first-X experiments, pure learning |

---

## Constraints (hard)

- Black and white. One accent color max, used sparingly.
- No database, no auth, no sessions, no backend.
- Contact form only — third-party mail service.
- GitHub READMEs fetched from `apotato369550`'s public repos only.
- Minimal JS — transitions and scroll. No SPA routing.

---

## What Doesn't Exist Yet

- `index.html` — not written
- `css/style.css` — not written
- `js/main.js` — not written
- Build decision (bake-in vs client-side fetch) — not finalized
