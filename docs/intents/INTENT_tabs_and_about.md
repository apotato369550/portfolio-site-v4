# INTENT: Tabs, About Section, Projects/Initiatives Split

## Core

Replace the current single-page layout with a three-tab site (Home, Projects, Initiatives), swap the Projects section on the Home tab for a personal "How I Work" section, and distribute content across the new tabs according to a clear Projects vs. Initiatives distinction.

## Goal

The current page conflates different types of Jay's output (technical work, community involvement, personal philosophy) into a single scroll. Separating them into tabs gives each type of content room to breathe and lets visitors self-select based on why they're there. The Home tab becomes a personal, authored landing — who Jay is and how he thinks — rather than a compressed resume dump. Technical work lives in Projects. Community and institutional involvement lives in Initiatives.

## Success Criteria

- The site has exactly three navigable tabs: Home, Projects, Initiatives
- Navigating between tabs does not reload the page (or if it does, the experience feels seamless)
- The Home tab no longer contains a Projects section; that section is replaced by a "How I Work" / "About Me" section
- The "How I Work" section reads as authored prose, not bullet points — it communicates Jay's working style, approach, and philosophy in a personal voice
- Projects tab contains only technical/build work (repos, things constructed, technical experiments)
- Initiatives tab contains only community, institutional, and outreach-oriented involvement (org roles, programs, scholarships as affiliations)
- The content distinction is unambiguous: a visitor looking for Jay's code finds it in Projects; a visitor looking for his community footprint finds it in Initiatives
- Visual and typographic style is consistent across all three tabs (same black/white palette, same type hierarchy)

## Constraints

- Black and white palette — no new accent colors introduced for tab navigation
- Vanilla HTML/CSS/JS only — no React, no framework, no build step introduced by this change
- No backend — tab switching is client-side only (CSS show/hide or anchor-based navigation)
- No database or CMS — content is static and authored directly
- Contact form (if present) stays where it is; this intent does not touch it
- GitHub repo fetching (if used for project descriptions) stays client-side fetch only

## The "How I Work" Section

**What it communicates (not what it says verbatim):**

- Jay's actual working style: intuition-first, structure-second, tinkering before formalizing
- His relationship to tools and AI: uses them as amplifiers, not replacements for judgment
- How he thinks about problems: constraint-based, bespoke over cookie-cutter, builds to understand
- Tone: personal, direct, a little dry — not a manifesto, not a mission statement, not a LinkedIn summary
- Format: flowing prose or very short, spaced paragraphs — not a bulleted list, not headers-within-the-section
- Length: long enough to feel authored, short enough to read in one sitting without scrolling fatigue

**What it is NOT:**

- A list of skills
- A rehash of the bio/intro already on the page
- Corporate-speak ("I am passionate about leveraging...")
- A tech stack brag

## Projects vs. Initiatives: Decision Boundary

**A thing is a Project if:**
- It produced a concrete artifact (repo, codebase, deployed site, tool, dataset, model)
- The primary output is something built or made
- It is described primarily by what it does technically
- Examples: timetabling-algorithms, jays-ai-agent-suite, ai-yeast, CBVT company site, any GitHub repo

**A thing is an Initiative if:**
- The primary output is involvement, leadership, coordination, or community impact
- It is described primarily by role, relationship, or program membership
- It would appear on a CV under "Leadership," "Activities," or "Affiliations" rather than "Projects"
- Examples: GDGoc-USC Lead, DOST SA USC Finance Officer, DOST START AI and Data Lead, Innovare Assistant Secretary, DEVCON Lead Learner, DOST-SEI Merit Scholar (as affiliation, not credential), DataCamp Scholar (as affiliation)

**Edge cases to resolve:**
- If an initiative produced a technical artifact (e.g., a project built *for* GDGoc), the artifact goes in Projects, the role goes in Initiatives
- Scholarships appear in Initiatives as affiliations/programs, not in Projects
- Evo Tech AI Engineer Intern role: likely Initiatives (institutional involvement), unless specific repos or outputs are surfaced — in which case those outputs go in Projects

## Ambiguities and Trade-offs

- **Tab switching implementation**: CSS show/hide (zero reload, pure client-side) vs. separate HTML files (cleaner URLs, browser back-button works, harder to share state). Both are valid given the vanilla constraint. This is an implementation decision, not resolved here.
- **Home tab content after the swap**: What remains on Home besides the new "How I Work" section? The existing bio/intro, contact section, and other non-Projects content presumably stay — but the exact section order after the swap is not specified by this intent.
- **Projects tab content shape**: Is it a card grid, a list, an expandable list with GitHub README content pulled in? The content *type* is clear (technical artifacts); the *layout* is not specified here.
- **Initiatives tab content shape**: Same question — role cards, a timeline, a flat list? Not specified here.
- **"How I Work" copy**: This intent defines tone and content type, not the actual prose. Jay (or a writing agent) authors the actual copy separately.
- **Internship at Evo Tech**: Sits at the boundary — institutional role (Initiatives) but also likely produced technical work (Projects). May need to appear in both or be split by artifact vs. role.

## Dependencies

### Hard Dependencies

None. This intent is self-contained and does not depend on any other pending intent being resolved first.

### Soft Dependencies

None identified.

### Independent

- Can proceed in parallel with any styling or typography work
- Can proceed independently of contact form changes

---

*Generated by intent-mapper. This is a linguistic constraint artifact, not an execution plan or architectural map.*
