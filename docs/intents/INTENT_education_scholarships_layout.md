# INTENT: Education & Scholarships Combined Layout

## Core

Merge the `Education` and `Scholarships` sections into a single two-column layout within one section block, rendered adjacently in the Credentials grouping.

## Goal

Education and Scholarships are logically the same credential tier — both are academic, both are institutional validations. Rendering them as two separate full-width sections with separate `<h2>` headings doubles the visual weight for what amounts to four entries total (2 education, 2 scholarships). A two-column layout collapses them into one visual unit without losing hierarchy, which better fits the "restraint" aesthetic and keeps the Credentials grouping compact before Projects dominates the page.

## Scope

### Files and Functions Touched

- `/home/jay/Desktop/Coding Stuff/portfolio-site-v4/src/components/Education.jsx` (lines 1-40): Either merge content into a new combined component, or keep as a sub-component consumed by a wrapper.
- `/home/jay/Desktop/Coding Stuff/portfolio-site-v4/src/components/Scholarships.jsx` (lines 1-29): Same — either merge into a combined component or consumed as sub-component.
- `/home/jay/Desktop/Coding Stuff/portfolio-site-v4/src/App.jsx` (lines 22-24): The two `<Education />` and `<Scholarships />` imports and render calls would collapse into one `<Credentials />` or `<EducationScholarships />` call, or stay as two adjacent calls with a CSS wrapper.
- `/home/jay/Desktop/Coding Stuff/portfolio-site-v4/src/styles/global.css`: Add a two-column grid wrapper class. The existing `.scholarships-grid` (line 431) already uses `display: flex; flex-wrap: wrap` for horizontal layout — the pattern exists. New wrapper needed for the side-by-side section grouping.

### Entry Point

Whichever section renders first in App.jsx (currently Education is last, Scholarships is second-to-last). After reordering, both appear in the Credentials block.

### Exit / Interface Change

- Section IDs `id="education"` and `id="scholarships"` — if merged into one section, one ID may disappear. Only relevant if anchor links exist.
- No data changes in `content.js` — `educationData` and `scholarshipsData` stay as-is.

## Column Assignment

Left column: Education (2 entries, more text per entry due to bullet lists)
Right column: Scholarships (2 entries, shorter body text)

This is the natural split given content density. Scholarships is already close to a two-column layout internally (`.scholarships-grid` wraps horizontally).

## Dependencies

### Hard Dependencies (Must land first)

- None. This is a pure layout change. No logic, no data restructuring required.

### Soft Dependencies (Preferred order)

- INTENT_narrative_reordering: Reordering must place Education and Scholarships adjacent in App.jsx. If reordering hasn't landed, these two sections may not be adjacent and the combined layout has nowhere to live. But the component itself can be built independently.

### Independent

- Can run in parallel with: INTENT_projects_expansion (completely separate components and CSS)
- Can run in parallel with: INTENT_narrative_reordering (build the combined component, wire it in when reordering lands)
- No code conflicts with: Experience.jsx, Projects.jsx, all Diagram components

## Design Choices

### Non-Negotiable

- No new data — `educationData` and `scholarshipsData` in `content.js` are unchanged
- Two entries per side keeps it balanced; no content needs to be written

### Negotiable

- **Single section wrapper vs. two adjacent sections**: Option A — one `<section>` with a shared `<h2>` like "Education & Scholarships" and a two-column grid inside. Option B — two sections side by side via a CSS flex wrapper in App.jsx without changing the component internals. Option A is cleaner semantically. Option B requires zero changes to existing components.
- **Shared heading**: "Education & Scholarships" as one h2, or keep separate headings inside each column? Separate headings per column is more scannable; a shared heading reduces visual clutter.
- **Column width ratio**: 60/40 split (Education gets more width for bullet lists) or 50/50?
- **Mobile behavior**: Stacked (one column) below a breakpoint. What breakpoint? The existing `.page` wrapper uses `clamp(320px, 70vw, 1400px)` — a `768px` breakpoint for stacking is consistent with existing pattern.
- **USC logo duplication**: `Education.jsx` currently hard-codes the USC logo for both education entries (lines 11-28, identical branches). This is a pre-existing issue unrelated to the layout change, but visible once the component is touched.

## Open Questions

- Option A vs Option B — new combined component or CSS wrapper? Affects how many files change.
- Should Scholarships move out of its current position entirely, or does the two-column layout just visually group them while they stay as separate `<section>` elements?

## Implementation Surface Area

- **Lines of code estimated to change**: 10-20 in App.jsx (import + render changes), 30-50 new CSS in `global.css` for the two-column wrapper and responsive breakpoint, 0-40 in component files depending on Option A vs B
- **New files required**: Possibly one `CredentialsSection.jsx` if Option A — not required
- **Breaking changes to interfaces**: No data changes. Section ID changes only if sections merge.
- **Risk level**: Low. Pure layout and render structure. The data layer is untouched.

---

*Generated by intent-mapper. This is a context artifact, not an execution plan.*
