# INTENT: Projects Tab Widget Expansion

## Core

Replace the current flat `Projects` section with a tabbed widget that categorizes work across six tabs: Affiliations, Initiatives, Data Science/ML, AI, Internal Tooling, Research & Experiments.

## Goal

The current Projects section (`Projects.jsx`) renders a flat vertical list of 6 projects with alternating diagram layouts. It works, but it treats all work the same. The proposed widget exposes the breadth: community work, research, production AI, client builds, and experiments all live together under "Proof" but stay sortable by type. This is the structural centerpiece of the v2 redesign.

## Scope

### Files and Functions Touched

- `/home/jay/Desktop/Coding Stuff/portfolio-site-v4/src/components/Projects.jsx` (lines 1-55): Full rewrite. Current structure is a flat `.project-grid` map. Needs a tab bar + conditional panel rendering layered on top of or replacing the existing map.
- `/home/jay/Desktop/Coding Stuff/portfolio-site-v4/src/data/content.js` (lines 37-87): `featuredProject` and `projectsData` must be reorganized or extended. Each project needs a `category` field (or projects get split into per-tab arrays). Affiliations and Skills data may migrate here or get imported directly.
- `/home/jay/Desktop/Coding Stuff/portfolio-site-v4/src/components/Affiliations.jsx` (lines 1-34): If Affiliations tab absorbs this, either import the component into the tab panel or inline the data.
- `/home/jay/Desktop/Coding Stuff/portfolio-site-v4/src/styles/global.css`: New tab bar styles needed. No existing tab styles exist in the file. Must stay minimal — the current aesthetic uses no borders except black/grey, no color.

### Entry Point

`<section id="projects">` in `Projects.jsx`. Tab switching is client-side state (React `useState`). No routing.

### Exit / Interface Change

- `featuredProject` export from `content.js` may become redundant if projects are reorganized by category. Currently used only in `Projects.jsx` line 19.
- If Affiliations is absorbed, `Affiliations.jsx` stops being rendered in `App.jsx` — the standalone section disappears.
- Six diagram components (`MapReduceDiagram`, `AiYeastDiagram`, etc.) remain unchanged — they attach to specific project titles via the `diagrams` map in `Projects.jsx` lines 9-16.

## Tab Content Mapping

Based on current `content.js` and `Affiliations` data:

| Tab | Current data source | Notes |
|---|---|---|
| Affiliations | `affiliationsData` (content.js lines 129-165) | 5 entries: GDGoc, DEVCON, Innovare, DOST START, DOST SA USC |
| Initiatives | Subset of `experienceData`? Or new entries? | GDGoc Lead, DOST START AI Lead could live here vs. Experience |
| Data Science/ML | `projectsData` filtered | `timetabling-algorithms`, `ai-yeast` partly, `kitchen-management-system` partly |
| AI | `featuredProject` + subset of `projectsData` | Amazon Listing Analyzer, `jays-ai-agent-suite`, `ai-yeast` |
| Internal Tooling | `projectsData` filtered | `enrollmate`, `kitchen-management-system` |
| Research & Experiments | `projectsData` filtered | `timetabling-algorithms`, `ai-yeast`, `hungry-markov-model` (from readmes, not yet in content.js) |

**Overlap problem**: Several projects belong to multiple tabs (e.g., `ai-yeast` is both AI and Research). Decide: show in multiple tabs, or pick primary category.

## Dependencies

### Hard Dependencies (Must land first)

- None. This INTENT is self-contained — it rewrites `Projects.jsx` and restructures `content.js` project data without touching other components.

### Soft Dependencies (Preferred order)

- INTENT_narrative_reordering: Should know Affiliations fate before deciding whether to render `<Affiliations />` as a standalone section alongside the tab widget or instead of it.

### Independent

- Can run in parallel with: INTENT_education_scholarships_layout (completely different components and CSS)
- No code conflicts with: `Experience.jsx`, `Education.jsx`, `Scholarships.jsx`, all Diagram components

## Design Choices

### Non-Negotiable

- Tab switching must be client-side only (no routing, no URL params)
- Tabs must not introduce color — black/white/grey only, consistent with existing aesthetic
- Diagram components stay attached to their respective projects — don't break the `diagrams` map

### Negotiable

- **Tab bar style**: Underline active tab (like a CV rule), or use a pill/box style? Underline is lower visual weight and fits the aesthetic better.
- **Default tab**: Which tab is active on load? AI or "All" (if an All tab is added)?
- **"All" tab**: Add a catch-all first tab that shows everything flat (current behavior), or force the user into a category?
- **Multi-category projects**: Show in all matching tabs (duplicated entries) or enforce single category? Duplication is simpler to implement; category field is cleaner.
- **Skills section fate**: Currently a standalone section with 5 skill categories. Could become a tab here, or stay separate. If absorbed, `Skills.jsx` gets removed from `App.jsx`.
- **Initiatives tab definition**: Is this leadership/community roles (GDGoc, DOST START), or actual initiative projects (workshops, programs run)? Content distinction not clear from current data.

## Open Questions

- What's the exact content for the Initiatives tab? Nothing in `content.js` is labeled as an initiative. Is this a new content category that needs to be written?
- Do projects with diagrams get their diagrams shown inside the tab panel, or is the diagram layout stripped for the tabbed view?
- Should the tab widget have a visible count per tab (e.g., "AI (3)")?
- Are there projects in `references/readmes/` that should be surfaced in new tabs but aren't in `content.js` yet? (`hungry-markov-model`, `homelab-manager`, `my-mystnodes-ui` are visible in the readmes but absent from `projectsData`.)

## Implementation Surface Area

- **Lines of code estimated to change**: 50-80 in `Projects.jsx` (full structural rewrite), 20-40 in `content.js` (add category fields or restructure arrays), 30-50 new CSS in `global.css` for tab bar
- **New files required**: Possibly a `ProjectsTab.jsx` or `TabBar.jsx` sub-component to keep `Projects.jsx` readable — not required, captain decides
- **Breaking changes to interfaces**: `featuredProject` export may be deprecated; `affiliationsData` stays but its consumption point changes
- **Risk level**: Medium. Most complex structural change of the three intents. Diagram attachment logic (the `diagrams` map by project title) is fragile if project titles change during categorization.

---

*Generated by intent-mapper. This is a context artifact, not an execution plan.*
