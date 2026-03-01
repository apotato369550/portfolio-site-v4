# Jay's Portfolio — Style Guide

This is the design system for Jay's portfolio site v4. It codifies the aesthetic of restraint, clarity, and the philosophy of low-abstraction that defines this site.

---

## Design Principles

The site operates on five core axioms:

**Restraint over decoration.** If something can be removed and the meaning survives, remove it. No unnecessary gradients, shadows, rounded corners, or animations that don't reduce friction.

**Low abstraction is the law.** Complexity hides intent. Clarity of purpose matters more than visual complexity. Every element earns its presence.

**Trust is currency.** Design should communicate competence and character, not credentials or labels. Let work and clarity speak.

**Typography is the design.** The site lives in its typeface, weight, spacing, and hierarchy. Visual polish comes from precision in these, not decoration.

**Simplicity compounds.** A simple system you understand deeply scales better than generic frameworks. Build what's needed; refuse what isn't.

---

## Typography

### Typeface

**Font Family:** `EB Garamond`, Georgia, `Times New Roman`, serif

**Rationale:** A classic serif that reads as educated, precise, and warm. Garamond pairs serif elegance with approachability — it's the typeface of Harvard CVs and thoughtful long-form writing. Not trendy. Permanent.

**Fallback Chain:** Georgia (web-safe serif) → Times New Roman (ubiquitous) → generic serif.

**Font Smoothing:** Antialiased on all platforms for consistent rendering.

### Size Scale

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| `h1` (name) | 64px | 400 | Header, anchor point of page. Scales down to 42px on tablet, 34px on phone. |
| `h2` (section) | 38px | 400 italic | Section headers. Scales down to 32px on tablet, 28px on phone. |
| Body text | 20px | 400 | Default paragraph, baseline for legibility. Scales to 18px on phone. |
| `.card-title` | 20px | 600 | Card headings (experience, education). |
| `.exp-title` | 21px | 600 | Experience entry titles (open layout). |
| `.project-title` | 26px | 600 | Project names in project grid. |
| `.profile-lead` | 20px | 400 | Lead paragraph (no weight change). |
| `.card-body` | 18px | 400 | Body text inside cards and experience entries. Scales to 17px on phone. |
| `.profile-secondary` | 18px | 400 | Secondary paragraph (lighter color, not size). |
| `.card-org`, `.exp-org` | 16px | 400 italic | Organization names. |
| `.entry-title`, `.affil-role` | 19px | 600 | Education entries, affiliation roles. |
| `.entry-sub`, `.affil-org` | 16px | 400 italic | Subtitles (degree, org context). |
| `.header-roles` | 13px | 400 uppercase | Roles/labels in header (uppercase with letter-spacing: 0.2em). |
| `.project-label` | 13px | 400 uppercase | Project category labels (uppercase with letter-spacing: 0.12em). |
| `.card-date`, `.exp-date` | 15px | 400 italic | Timestamps (italic, muted color). |
| `.tag` | 12px | 400 | Skill/tech tags. |
| `.tagline` | 19px | 400 italic | Subheading under name. |
| `.personal-note` | 16px | 400 italic | Inline asides (left-bordered). |
| Footer | 13px | 400 uppercase | Letter-spacing: 0.32em. Muted color. |

### Weight Usage

- **400 (Regular):** Default for all body text, headers, and most elements. This is the workhorse weight.
- **600 (Semibold):** Titles, emphasis, strong role names. Creates hierarchy without changing size.
- **Avoid:** 700+ (bold). Use 600 and size instead. No italic + bold combinations.

### Italic Usage

Italics signal secondary information or context:
- `.tagline` under name
- Organization names (`.card-org`, `.exp-org`, `.affil-org`)
- Dates (`.card-date`, `.exp-date`)
- Section headers (`h2` — required, not optional)
- Personal notes (asides)
- Never use italic for emphasis in body text

### Letter-Spacing

| Class/Element | Letter-Spacing | Purpose |
|---------------|-----------------|---------|
| `.header-roles` | 0.2em | Uppercase role labels (tight spacing) |
| `.project-label` | 0.12em | Project category labels |
| `h1` | 0.01em | Imperceptible — maintains elegance |
| `h2` | -0.01em | Negative spacing on section headers (tighter) |
| `.tagline` | 0.03em | Subtle openness |
| `[data-tip]` label (contact form) | 0.1em | Form labels |
| Footer | 0.32em | Maximum spacing — distinctly set apart |
| Default body | 0 (normal) | No spacing manipulation |

### Line-Height

| Usage | Value | Context |
|-------|-------|---------|
| Body text (default) | 1.7 | Airy, reads cleanly |
| `.profile-lead`, `.profile-secondary` | 1.8 | Generous, sets breathing room |
| `.card-body`, `.exp-body` | 1.8 / 1.9 | Readable; slightly higher than body |
| `.entry-list li` | 1.65 | Compact lists with bullet points |
| `.skill-desc` | 1.8 | Description text in skill groups |
| Tooltips (`[data-tip]::after`) | 1.55 | Compact (constrained width) |
| Chinese watermark | 1.05 | Decorative (tight) |
| Default lists | 1.6 | General list text |

---

## Color Palette

The site is **black and white with no accent color.** All color is semantic (state, hierarchy, or context), never decorative.

### Text Colors

| Name | Value | Usage | Context |
|------|-------|-------|---------|
| **Primary** | `#000` | Body text, `h1`, `h2`, section headers, emphasis | Primary text, contrast at maximum |
| **Secondary** | `#222` | Card bodies, experience bodies | Slight reduction, still high contrast |
| **Tertiary** | `#333` | Skill descriptions, entry list items | Readable gray |
| **Muted** | `#555` | Organization names, role subtitles | Subordinate info (`.card-org`, `.exp-org`) |
| **Light Muted** | `#666` | Tags, minor text | Very subordinate |
| **Lighter Muted** | `#777` | Tagline, secondary paragraph, skill tags | Even lighter |
| **Light Gray** | `#888` | Dates, diagram labels, tooltip text | De-emphasized but readable |
| **Lighter Gray** | `#999` | Header role labels, project labels, diagram notes | Distinctly secondary |
| **Very Light** | `#bbb` | Footer text, entry list bullets, tooltip border | Barely visible emphasis |
| **Barely Visible** | `#ccc` | Contact dots (separators), minor borders, tag borders | Near-invisible |

### Border Colors

| Name | Value | Usage |
|------|-------|-------|
| **Primary Border** | `#000` | Cards, inputs, header/footer lines, h2 underline |
| **Secondary Border** | `#ccc` | Card--minor (lighter cards), tag borders |
| **Light Border** | `#eee` | Experience entry separators, skill group underlines |
| **Decorative Border** | `#bbb` | Diagram boxes (dashed), tooltip borders |

### Background Colors

| Name | Value | Usage |
|------|-------|-------|
| **White (default)** | `#fff` | Page background, card fill, input background |
| **Off-white (hover)** | `#f9f9f9` | Card hover state, input focus |
| **Very Light Gray** | `#fafafa` | Input focus (slightly lighter than card hover) |
| **Error Background** | `#fff5f5` | Form field error state (light red tint) |

### Interactive/State Colors

| State | Value | Usage |
|-------|-------|-------|
| **Error/Alert** | `#c00` | Form validation errors, error text |
| **Tooltip bg** | `#111` | Dark tooltip background (near-black) |
| **Tooltip text** | `#fff` | White text on dark tooltip |

### Intentionally Absent

- No accent color (primary action color)
- No gradients
- No shadow colors
- No status indicators (success/warning/info colors)
- No hover color (use background shift instead: transparent → `#f9f9f9`)

---

## Spacing & Layout

### Page Container

```css
.page {
  width: clamp(320px, 70vw, 1400px);
  margin: 0 auto;
  padding: 80px clamp(24px, 4vw, 72px) 100px;
}
```

- **Clamp pattern:** Responsive without breakpoints. Min 320px, preferred 70vw, max 1400px.
- **Padding:** 80px top (breathing room after header), 24–72px horizontal (4vw), 100px bottom (generous footer space).
- **Phone adjustment:** Collapses to `width: 100%`, `padding: 48px 24px 72px` on devices under 768px.

### Section Spacing

| Spacing | Value | Usage |
|---------|-------|-------|
| Section margin-bottom | 96px | Default space between sections |
| Header padding-bottom | 52px | Space inside header (below name) |
| Header margin-bottom | 52px | Space after header before first section |
| Card margin-bottom | 16px | Space between cards in a section |
| Experience entry padding | 52px bottom, 52px top (next entry) | Open layout with top border separator |

### Component Padding

| Component | Padding | Purpose |
|-----------|---------|---------|
| `.card` | 28px 32px | Standard card, gives breathing room |
| `.card--minor` | 16px 28px | Lighter cards (footnotes, etc.) |
| `.personal-note` | 14px left (border + padding) | Aside with left border accent |
| `.contact-field input/textarea` | 10px 14px | Form inputs |
| Tooltip (`[data-tip]::after`) | 10px 14px | Tooltip inner padding |
| Diagram boxes (`.diag-node`) | 6px 8px | Compact diagram elements |

### Grid & Flex Gaps

| Component | Gap | Purpose |
|-----------|-----|---------|
| `.affiliations-grid` | 36px | Logo + body horizontal gap in affiliation entries |
| `.project-grid` | 48px | Space between projects (vertical flex-direction) |
| `.project-inner` | 40px | Horizontal gap between project text and diagram |
| `.scholarships-grid` | 56px | Space between scholarship entries |
| `.skills-grid` | 44px | Space between skill groups |
| `.contact` (header links) | 4px 10px | Flex gap (4px vertical, 10px horizontal) |
| `.tags` | 6px | Gap between skill tags |

---

## Component Patterns

### Header

**Structure:**
```html
<header>
  <div class="header-content">
    <h1>John Andre Yap</h1>
    <div class="header-roles">AI ENGINEER · CS STUDENT</div>
    <p class="tagline">Building systems that matter. Low abstraction.</p>
    <div class="contact">
      <a href="mailto:...">Email</a>
      <span class="dot">·</span>
      <a href="...">GitHub</a>
      ...
    </div>
  </div>
  <div class="chinese-watermark">...</div>
</header>
```

**Key Rules:**
- `h1` is centered, 64px, 0.01em letter-spacing.
- `.header-roles` is uppercase (0.2em letter-spacing), muted color (#999), 13px.
- `.tagline` is italic, 19px, 0.03em spacing, color #777.
- Contact links are flex-wrapped with dot separators (#ccc).
- Header has 52px border-bottom (1.5px solid #000) and 52px margin-bottom.
- Chinese watermark is positioned absolute, right-aligned, opacity 0.055, pointer-events: none.

**When to Use:** Once, at the top of the page.

**What NOT to Do:**
- Do not change the name styling or size
- Do not add an accent color to contact links
- Do not remove the border-bottom (it separates header from content)
- Do not stack roles/links vertically (keep flex horizontal)

---

### Section Heading

**Structure:**
```html
<h2>Experience</h2>
```

**CSS:**
- `font-size: 38px` / `font-weight: 400` / `font-style: italic`
- `letter-spacing: -0.01em` (negative, tighter)
- `border-bottom: 1px solid #000` / `padding-bottom: 8px`
- `margin-bottom: 40px`
- Scales to 32px (tablet) and 28px (phone)

**When to Use:** Once per major section (Experience, Education, Projects, etc.).

**What NOT to Do:**
- Do not remove the underline (structural hierarchy signal)
- Do not use non-italic h2 (italic is required)
- Do not change font size dramatically on mobile (use scale rules above)

---

### Card

**Structure:**
```html
<div class="card">
  <div class="card-header">
    <div>
      <span class="card-title">Title</span>
      <span class="card-org">Organization</span>
    </div>
    <span class="card-date">Date</span>
  </div>
  <p class="card-body">Description goes here.</p>
</div>
```

**CSS:**
- `border: 1px solid #000` / `padding: 28px 32px`
- `transition: background-color 0.15s ease`
- `:hover { background-color: #f9f9f9 }`
- Margin-bottom: 16px between cards
- `.card-title`: 20px 600 weight
- `.card-org`: 16px italic #555
- `.card-date`: 15px italic #888 (flex-shrink: 0, no-wrap)
- `.card-body`: 18px #222 (1.8 line-height)

**Card--Minor Variant:**
- `border-color: #ccc` (lighter)
- `padding: 16px 28px` (compact)
- `.card--minor p`: 15px #666 (smaller, lighter)

**When to Use:** Education entries, certifications, minor organizational cards.

**What NOT to Do:**
- Do not add border-radius
- Do not add shadows
- Do not change the hover background to a different color (only #f9f9f9)
- Do not remove the date from the header (temporal context matters)

---

### Experience Entry (Open Layout)

**Structure:**
```html
<div class="exp-entry">
  <div class="exp-header">
    <div class="exp-title-block">
      <img class="exp-logo" src="..." alt="" />
      <div>
        <span class="exp-title">Role Title</span>
        <span class="exp-org">Organization</span>
      </div>
    </div>
    <span class="exp-date">Date Range</span>
  </div>
  <p class="exp-body">Description of role and accomplishments.</p>
</div>
<!-- Next experience entry has border-top: 1px solid #eee; padding-top: 52px -->
```

**CSS:**
- No card border (border: none, background: none)
- Padding: 52px bottom, 0 sides; top entry has no padding-top
- Between entries: `border-top: 1px solid #eee` and `padding-top: 52px`
- `.exp-header`: flex, space-between, gap 20px
- `.exp-title-block`: flex with logo (40px square) and text
- `.exp-title`: 21px 600
- `.exp-org`: 16px italic #555
- `.exp-date`: 15px italic #888
- `.exp-body`: 18px #222 (1.9 line-height)
- `.exp-logo`: 40px × 40px, object-fit contain
- `.exp-logo-initials`: 40px square box, 1.5px border, 10px uppercase text (if no image)

**When to Use:** Primary employment, internships, major roles. Preferred over cards for open, readable layout.

**What NOT to Do:**
- Do not add card borders
- Do not change the separator border (#eee, not #000)
- Do not collapse the whitespace; 52px padding is intentional breathing room

---

### Project Entry

**Structure:**
```html
<div class="project-card">
  <span class="project-label">FEATURED</span>
  <span class="project-title">Project Name</span>
  <div class="project-inner">
    <div class="project-inner-body">
      <p>Description of the project...</p>
      <div class="tags">
        <span class="tag">react</span>
        <span class="tag">python</span>
      </div>
    </div>
    <div class="diagram">
      <!-- diagram content if applicable -->
    </div>
  </div>
</div>
```

**CSS:**
- `.project-label`: 13px uppercase #999, letter-spacing 0.12em
- `.project-title`: 26px 600
- `.project-grid`: flex column, gap 48px
- `.project-inner`: flex row, gap 40px, align-items flex-start
- `.project-inner--reverse`: flex-direction row-reverse (alternating left/right)
- `.project-inner-body`: flex: 1
- `.tags`: flex wrap, gap 6px
- `.tag`: 12px #666, border 1px #ccc, padding 2px 9px, letter-spacing 0.04em
- `.diagram`: 260px width, flex-shrink 0, border 1px dashed #bbb, padding 18px 14px (collapses to 100% on mobile)

**When to Use:** Feature projects with descriptions, tech stacks, and optional diagrams.

**What NOT to Do:**
- Do not remove the project label
- Do not add shadows or decorations to the diagram
- Do not change tag styling (simple bordered boxes)
- Do not add card-like borders to project entries (they're open layout)

---

### Affiliation Entry

**Structure:**
```html
<div class="affil-entry">
  <img class="affil-logo" src="..." alt="" />
  <div class="affil-body">
    <span class="affil-role">Role Title</span>
    <span class="affil-org">Organization</span>
  </div>
</div>
```

**Grid:** `.affiliations-grid`: flex wrap, gap 36px, `flex: 1 1 calc(50% - 18px)`, min-width 280px (two-column on desktop, collapses on mobile).

**CSS:**
- `.affil-entry`: flex, gap 24px, align-items flex-start
- `.affil-logo`: 52px × 52px, object-fit contain, flex-shrink 0
- `.affil-role`: 18px 600
- `.affil-org`: 15px italic #555

**When to Use:** Leadership roles, memberships, organizational affiliations (GDG, DOST, etc.).

**What NOT to Do:**
- Do not change logo size (52px is consistent)
- Do not remove the organization name (context matters)
- Do not change two-column layout (mobile collapses automatically)

---

### Tag

**Structure:**
```html
<span class="tag">python</span>
```

**CSS:**
- `font-size: 12px`
- `border: 1px solid #ccc`
- `padding: 2px 9px`
- `letter-spacing: 0.04em`
- `color: #666`
- Wrapped in `.tags` (flex wrap, gap 6px)

**When to Use:** Tech stacks, skills, project keywords. Not interactive.

**What NOT to Do:**
- Do not add background color
- Do not use sharp/rounded border-radius
- Do not change the border color to #000

---

### Tooltip

**Structure:**
```html
<span data-tip="Full definition or explanation here">Term</span>
```

**CSS:**
```css
[data-tip] {
  border-bottom: 1px dashed #aaa;
  cursor: help;
  position: relative;
}

[data-tip]::after {
  content: attr(data-tip);
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: #111;
  color: #fff;
  font-size: 14px;
  line-height: 1.55;
  padding: 10px 14px;
  width: 290px;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 999;
}

[data-tip]:hover::after { opacity: 1; }
```

**Positioning Variants:**
- Default: centered above (uses `left: 50%; transform: translateX(-50%)`)
- `.tip-left::after`: left-aligned, no transform
- `.tip-right::after`: right-aligned, no transform
- Use `.tip-left` or `.tip-right` if tooltip would clip at page edges

**When to Use:** Technical jargon, unfamiliar terms, acronyms that need brief definitions.

**What NOT to Do:**
- Do not include long explanations (max ~50 words)
- Do not use as the only explanation (hover-only is fragile)
- Do not use color inside the tooltip (black bg, white text only)

---

### Personal Note (Aside)

**Structure:**
```html
<aside class="personal-note">
  A brief personal reflection or aside about the context above.
</aside>
```

**CSS:**
- `font-size: 16px`
- `font-style: italic`
- `color: #888`
- `border-left: 2px solid #eee`
- `padding-left: 14px`
- `margin-top: 14px`
- `line-height: 1.75`

**When to Use:** Brief personal asides, caveats, or reflections that don't belong in main body.

**What NOT to Do:**
- Do not use for long paragraphs (max 2–3 sentences)
- Do not change the left border color (light #eee is intentional)
- Do not remove italics (signals subordinate context)

---

## Interaction & Motion

### Fade-In on Scroll

**CSS:**
```css
.fade-in {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Usage:** Applied to sections as they enter the viewport. Uses IntersectionObserver in JavaScript.

**Philosophy:** Fade + subtle upward translate reduces jarring appearance of content. 10px translate is barely perceptible but smooths the transition.

### Hover States

| Element | Transition | Behavior |
|---------|------------|----------|
| `.card` | background-color 0.15s ease | Transparent → #f9f9f9 |
| `.contact a` | border-color 0.2s | Transparent → #000 (bottom border reveals) |
| `.contact-submit` | background-color, color 0.15s | White bg + black text ↔ black bg + white text (invert) |

**Philosophy:** No color shifts, no shadow changes. Only state-relevant properties change. The 0.15s timing is fast enough to feel responsive but slow enough to be perceivable.

### Tab Switching

If tabs exist (e.g., skill categories), fade between tabs using `opacity 0.22s ease`.

### Form Interactions

- **Focus:** Input/textarea background shifts from white to #fafafa, outline: none
- **Error:** Border-color #c00, background #fff5f5 (light red tint)
- **Submit hover:** Inverted colors (black bg, white text)
- **Disabled:** Opacity 0.6, cursor not-allowed

---

## Voice & Tone

The text on the site is calibrated to read as all three audiences simultaneously:

### Gen Z / Peers
Dry humor, self-aware, unpretentious. Smart but doesn't perform it. Chill.

### Family / Relatives
Warm, generous, dependable. The kind person who knows how to get things done.

### Business Contacts / Extended Family
Competent, trustworthy, precise. The person you call when it matters.

### Copy Rules

**No corporate speak.** Avoid:
- "I am passionate about leveraging..."
- "Synergize cross-functional..."
- "Driving impactful outcomes..."

Instead: Use first-person, direct language. "I build." "I study." "I lead." "I work on."

**No bulleted skills lists in prose.** Skills live in tags or structured lists, not in paragraphs.

**Technical terms get tooltips, not footnotes.** If jargon appears, add `data-tip` for context.

**First person is fine.** Avoid third-person self-description ("Jay is...").

**Dense over padded.** Don't repeat what structure already says. If a date is in `.card-date`, don't repeat it in the body.

**Authored prose over formatted lists.** A paragraph reads better than a bulleted list. Use lists only when parallel structure matters (e.g., education entries).

---

## Anti-Patterns: What NOT to Do

**Never introduce new patterns without a clear reason.** This system is complete. Additions fragment it.

### Visual Anti-Patterns
- No gradients
- No shadows
- No rounded corners (keep everything sharp/orthogonal)
- No icons in body text (use words)
- No hero images or background images
- No modals or overlays
- No new accent colors (this is black and white)

### Animation Anti-Patterns
- No animations beyond fade + subtle translate
- No spinning, pulsing, or floating effects
- No page transitions (smooth scroll is enough)
- No bounce or elastic easing

### Component Anti-Patterns
- No framework-specific UI kits (no MUI, no Chakra, no Ant Design)
- No carousels (static layout is better)
- No breadcrumbs
- No dropdown menus (keep navigation flat)
- No pagination (let the page scroll)

### Typography Anti-Patterns
- No justified text (left-aligned only)
- No centered body text blocks (center only headers and metadata)
- Do not mix sans-serif and serif (serif throughout)
- No text-shadow or text-outline

### Layout Anti-Patterns
- Do not deviate from the clamp() page width pattern
- Do not add new spacing values (use the established scale)
- Do not change gap sizes between components without reason
- Do not use container queries (media queries are sufficient)

### Copy Anti-Patterns
- No emoji (text-only)
- No ALL CAPS body text (uppercase reserved for labels/roles)
- No sarcasm that doesn't land (dry humor only)
- No self-deprecation that undermines credibility

---

## Responsive Design

### Breakpoints

| Breakpoint | Width | Trigger |
|-----------|-------|---------|
| Desktop | 1024px+ | Default styles |
| Tablet | 768px–1024px | Simplify layouts, reduce logo sizes |
| Large Phone | 480px–768px | Single-column, reduced padding |
| Small Phone | <480px | Minimal padding, smaller fonts |

### Responsive Behavior

**Page container:**
- Desktop (>1024px): `width: clamp(320px, 70vw, 1400px)`, padding 80px top
- Tablet (768–1024px): `width: clamp(320px, 88vw, 1400px)`
- Phone (<768px): `width: 100%`, padding 48px 24px 72px

**Fonts:**
- `h1`: 64px → 52px (tablet) → 42px (phone) → 34px (small phone)
- `h2`: 38px → 32px (tablet) → 28px (phone) → 24px (small phone)
- Body: 20px → 18px (phone)

**Diagrams & Complex Layouts:**
- `.diagram`: 260px (desktop) → 100% (tablet/phone)
- `.project-inner`: flex row (desktop) → column (phone)
- `.affiliations-grid`: 2-column (desktop) → 1-column (phone)
- `.edu-scholar-row`: 2-column (desktop) → 1-column (phone)

**Chinese watermark:** Visible on desktop/tablet, `display: none` on phone (<480px).

**Tooltip width:** 290px (desktop) → 220px (phone).

---

## Design System Maintenance

### When Adding a Component

1. Does it use colors from the palette? Yes? Good.
2. Does it use spacing from the scale? Yes? Good.
3. Does it use typography sizes from the scale? Yes? Good.
4. Is it necessary, or does it duplicate an existing pattern? If duplicate, use the existing pattern.
5. Does it work at all breakpoints? If no, document the breakpoint where it changes.
6. Does it have a hover/focus state (if interactive)? Document it here.

### When Modifying CSS

- Do not add new colors without documenting them in the Color Palette section.
- Do not add new spacing values without updating the Spacing & Layout section.
- Do not add new font sizes without updating the Typography section.
- Do not add animations without documenting them in Interaction & Motion.

### Git Discipline

- Changes to colors, spacing, or typography scales warrant a commit message mentioning "design system update."
- New component patterns should be documented in this file before they're used widely.
- Small tweaks (e.g., adjusting margin by 2px) do not require style guide updates unless they're part of a larger refactor.

---

## Reference: CSS Class Directory

### Header
- `.page` — page container (clamp width, padding)
- `header` — page header with border-bottom
- `.header-content` — header inner content
- `.chinese-watermark` — optional Chinese characters (decorative, low opacity)
- `h1` — name
- `.header-roles` — role labels (uppercase)
- `.tagline` — subheading
- `.contact` — contact links (flex)
- `.contact .dot` — separator between links

### Sections & Structure
- `section` — wrapper (margin-bottom: 96px)
- `h2` — section heading (italic, border-bottom)
- `.profile-section` — profile wrapper
- `.profile-lead` — primary paragraph
- `.profile-secondary` — secondary paragraph

### Cards
- `.card` — bordered container
- `.card--minor` — lighter variant
- `.card-header` — flex wrapper (title + date)
- `.card-title` — heading inside card
- `.card-org` — organization (italic)
- `.card-date` — timestamp
- `.card-body` — description

### Experience
- `.exp-entry` — open layout entry (no border)
- `.exp-header` — title + date flex
- `.exp-title-block` — title + org + logo
- `.exp-logo` — logo image (40px)
- `.exp-logo-initials` — text-based logo fallback
- `.exp-title` — role name
- `.exp-org` — organization (italic)
- `.exp-date` — timestamp
- `.exp-body` — description

### Projects
- `.project-grid` — flex column wrapper
- `.project-card` — single project
- `.project-inner` — flex row (text + diagram)
- `.project-inner--reverse` — reversed flex direction
- `.project-inner-body` — text content
- `.project-title` — project name
- `.project-label` — category label (FEATURED, OPEN SOURCE, etc.)
- `.tags` — tag wrapper (flex)
- `.tag` — individual tag

### Diagrams
- `.diagram` — container (bordered, dashed)
- `.diag-section-label` — label (uppercase)
- `.diag-map-row` — flex row of nodes
- `.diag-node` — individual box
- `.diag-node--wide` — prominent node
- `.diag-arrow` — arrow between sections
- `.diag-reduce-row` — reduce phase row
- `.diag-result` — final output
- `.diag-note` — explanatory text

### Affiliations & Scholarships
- `.affiliations-grid` — 2-column flex
- `.affil-entry` — logo + text
- `.affil-logo` — 52px logo
- `.affil-body` — text content
- `.affil-role` — role name
- `.affil-org` — organization
- `.scholarships-grid` — flex wrapper
- `.scholarship-entry` — logo + text
- `.scholarship-logo` — 52px logo
- `.scholarship-body` — text content

### Education
- `.education-entry-top` — logo + text flex
- `.edu-logo` — 44px logo
- `.edu-scholar-row` — 2-column wrapper (education + scholarships)
- `.entry` — education entry
- `.entry-top` — flex header (title + date)
- `.entry-title` — degree/school name
- `.entry-sub` — subtitle
- `.entry-list` — unordered list (custom bullets)
- `.entry-list li::before` — custom bullet (◦)

### Skills
- `.skills-grid` — flex column
- `.skill-group` — category wrapper
- `.skill-group h3` — category name
- `.skill-desc` — description
- `.skill-icons` — icon container (flex)
- `.skill-tags` — skill text list

### Utilities
- `.personal-note` — left-bordered aside
- `[data-tip]` — tooltip trigger (dashed underline)
- `[data-tip]::after` — tooltip popup
- `.tip-left` — left-aligned tooltip variant
- `.tip-right` — right-aligned tooltip variant
- `.tip-open` — manually triggered tooltip

### Forms
- `.contact-form` — form wrapper
- `.contact-field` — input wrapper
- `.contact-field label` — field label
- `.contact-field input`, `.contact-field textarea` — input elements
- `.contact-field.error` — error state
- `.contact-error-text` — error message
- `.contact-submit` — button
- `.contact-status` — form status message
- `.contact-status--error` — error status

### Animation
- `.fade-in` — fade + translate animation
- `.fade-in.visible` — active state

### Footer
- `footer` — page footer

---

## Resources

**Color Values:** All hex codes are exact from `src/styles/global.css`. Do not guess or approximate.

**Font:** EB Garamond from Google Fonts or system fallbacks (Georgia, Times New Roman, serif).

**Grid/Flex:** All spacing values use explicit px or viewport-relative units (vw, clamp). No magical number tweaking.

**Mobile-First?** No. Desktop-first system. Tablet and phone are reductions/simplifications of the desktop design.

---

**Last Updated:** March 2026
**Author:** Design System for Jay's Portfolio v4
**Version:** 1.0
