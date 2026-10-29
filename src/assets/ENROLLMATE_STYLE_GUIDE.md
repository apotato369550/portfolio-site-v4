# Enrollmate Style Guide

## Design direction and rationale

Enrollmate uses a **brutalist interface with a bright blue / purple / pink identity**: square geometry, heavy ink outlines, hard offset shadows, flat fills, and monospace typography. It should feel like a practical scheduling workbench, not a soft, decorative dashboard.

The rules below describe the existing implementation. The rationale explains how those choices support the product rather than claiming measured usability results.

- **Make structure explicit.** Outlined panels, table rules, and boxed controls separate catalog entry, constraints, and schedule results without relying on subtle elevation.
- **Keep data central.** A consistent monospace face suits course codes, section numbers, enrollment counts, and times. A weekly grid makes schedule relationships visible directly.
- **Use color deliberately.** Saturated brand colors identify actions and hierarchy; lighter fills support selected rows and dense schedule blocks. Enrollment status has a separate semantic palette.
- **Give controls physical feedback.** A short movement and a changing hard shadow communicate hovering and pressing without elaborate animation.
- **Keep the tool approachable and lightweight.** The dotted canvas and small orbital logo add personality while the shared visual language carries across Catalog, Generate, and Saved Schedules.

## Source of truth

- [`src/style.css`](src/style.css): shared tokens, components, responsive behavior, and print rules.
- [`src/grid.js`](src/grid.js): schedule-event color palette and assignment.
- [`index.html`](index.html), [`generate.html`](generate.html), [`saved.html`](saved.html): font loading and page structure.

Use existing CSS variables and component classes before introducing another visual variant. This guide does not introduce a new theme or change the application.

## Colors

### Foundation

| Token | Value | Role |
|---|---|---|
| `--ink` | `#14152b` | Near-black indigo for outlines, shadows, and primary text |
| `--bg` | `#f2f1ea` | Warm off-white page canvas |
| `--panel-bg` | `#ffffff` | White panels and working surfaces |
| `--border`, `--text` | `var(--ink)` | Shared outline and text aliases |
| `--text-muted` | `#55566f` | Hints, labels, secondary information |

The outlines read as black, but use the ink token rather than literal `#000`. The body has ink-colored dots at 14% opacity, with a 1.5px radius on a 22px repeating grid. Keep that texture outside solid working surfaces.

### Brand trio

| Family | Base | Dark / ink | Tint |
|---|---|---|---|
| Blue | `--blue: #3b5fe0` | `--blue-ink: #1f3aa8` | `--blue-tint: #e3ebff` |
| Purple | `--purple: #7c3aed` | `--purple-ink: #5b21b6` | `--purple-tint: #ece3ff` |
| Pink | `--pink: #ec4899` | `--pink-ink: #be185d` | `--pink-tint: #ffe3f1` |

- **Blue:** primary buttons, course-group headers, schedule day headers, and modal headers. Blue tint marks the active saved schedule.
- **Purple:** panel-heading markers, checkbox accents, secondary actions, row hover fills, and import summaries.
- **Pink:** tutorial entry point, form focus outlines, text selection, and logo orbit.
- `--accent` aliases blue; `--accent-hover` aliases blue ink. Existing primary-button hover feedback changes position and shadow rather than using that hover-color token.
- Not every defined tint or dark variant is currently used. Reuse the family where appropriate; do not treat every token as a required component state.

Use flat saturated fills for brand surfaces. The header's blue/purple/pink stripe is implemented with a hard-stop `linear-gradient`: three discrete bands, **not a blended gradient**. This existing stripe is not a precedent for gradient cards or buttons.

### Semantic status

| Meaning | Background token / value | Text token / value |
|---|---|---|
| OK | `--ok-bg: #cdf7dc` | `--ok-text: #0b7a3d` |
| Full | `--full-bg: #ffd0da` | `--full-text: #ad0f34` |
| At-risk | `--at-risk-bg: #ffe9a8` | `--at-risk-text: #785400` |
| Error / destructive action | `--danger-bg: #ffd0da` | `--danger: #ad0f34` |

Status badges combine their fill and text pair with a 2px ink outline and an explicit status label. Error and note messages instead use ink text with a semantic-colored border. Keep brand pink distinct from danger red; course colors do not indicate enrollment status.

### Schedule-event palette

Schedule blocks use lighter fills so course labels and times remain visually prominent. These values live in `COURSE_COLOR_PALETTE`, not in the CSS brand tokens.

| Course color | Background | Left border | Text |
|---|---|---|---|
| Blue | `#dbe6fd` | `#4f7df0` | `#1f3d8f` |
| Purple | `#ecdffd` | `#9b6bf2` | `#5a2fae` |
| Pink | `#ffe0f0` | `#f472b6` | `#a3286e` |
| Teal | `#d7f5f0` | `#14b8a6` | `#0d6b60` |
| Gold | `#fff3d0` | `#d99a1b` | `#7a5606` |
| Coral | `#ffe1d6` | `#f0653f` | `#9c3517` |
| Green | `#dcf7e8` | `#22b573` | `#146b41` |
| Indigo | `#e2e2fb` | `#6459d1` | `#362f8f` |

Assignment follows each distinct course code's first appearance **within a render**, cycling after eight colors. It is deterministic for the same ordering, not a permanent course-to-color mapping across reordered schedules. Never randomize it. JavaScript sets only the background, text color, and `borderLeftColor`; preserve the CSS ink outline on the other edges.

## Typography

**Space Mono everywhere**, including buttons, inputs, navigation, headings, tables, and tutorial content.

```css
--font: 'Space Mono', 'SFMono-Regular', Menlo, Consolas, monospace;
```

All three pages request Space Mono weights **400 and 700** from Google Fonts with `display=swap`. The fallback stack keeps the interface monospace if the web font is unavailable. Some table and badge rules request `800`; no separate 800 font weight is loaded.

| Role | Existing size | Treatment |
|---|---|---|
| Page title | `1.9rem` | 700, uppercase, `-0.01em` tracking |
| Panel heading | `1.05rem` | 700, uppercase, `0.02em` tracking |
| Course-group heading | `0.98rem` | 700, uppercase |
| Subtitle | `0.88rem` | Muted, sentence case |
| Table body / metadata | `0.85rem` | Compact data presentation |
| Navigation / secondary buttons | `0.78rem` | 700, uppercase, `0.02em` tracking |
| Form labels / table headings | `0.72rem` | Bold, uppercase, `0.03em` tracking |
| Status badges | `0.68rem` | Bold, uppercase, `0.02em` tracking |
| Event code / time | `0.74rem` / `0.64rem` | Bold code; smaller supporting time |

Use uppercase for short structural labels and actions, not entire explanatory paragraphs. Keep helper copy direct and sentence case. Tutorial paragraphs use `line-height: 1.5`; do not assume that is a global body rule.

## Brutalist construction rules

### Geometry and outlines

- `--radius: 0px`: panels, buttons, fields, badges, and events stay square.
- Major containers and controls use **3px solid ink** borders.
- Table dividers, badges, compact delete controls, and event outlines use **2px** borders.
- Schedule events have a **6px colored left edge** while retaining the ink frame elsewhere.
- Panel headings have a 3px bottom rule and a purple square marker with a 2px ink outline.
- The logo is a framed white square containing a blue circle and pink orbital ellipse. Curves in the logo do not imply rounded UI containers.

### Hard shadows

| Token | Value | Typical use |
|---|---|---|
| `--shadow-sm` | `3px 3px 0 var(--ink)` | Navigation, secondary actions, logo |
| `--shadow` | `4px 4px 0 var(--ink)` | Primary actions, course groups |
| `--shadow-lg` | `6px 6px 0 var(--ink)` | Panels, modal, elevated hover states |

Event blocks use a smaller `2px 2px 0 var(--ink)` shadow. All shadows are sharp, opaque, and offset down/right: no blur, glow, or soft elevation.

### Interaction

- Transitions are typically **0.1s ease**, limited to position, shadow, and relevant colors.
- Primary-button hover lifts by `translate(-2px, -2px)` and expands the shadow to 6px. Pressing moves to `translate(2px, 2px)` with a 1px shadow.
- Secondary actions lift by 1px on hover; navigation and the tutorial trigger lift by 2px. Their pressed states reset position and remove the shadow.
- Form focus uses a **3px pink outline with a 2px offset**. Preserve visible keyboard focus when extending controls; this custom rule currently targets form inputs, not every interactive element.
- Disabled secondary buttons use reduced opacity and suppress lift. Disabled danger buttons use muted text and no shadow. Do not make disabled controls appear actionable.
- Destructive controls turn danger-red with white text on hover. Tables, course choices, and saved rows use purple-tinted hover fills.

## Layout and components

- **Page frame:** centered, `max-width: 1100px`; padding `2.5rem 1.5rem 4rem`.
- **Panels:** white, 3px outline, 6px shadow, `1.6rem 1.75rem` padding, `1.75rem` bottom spacing.
- **Form grids:** four columns with `1rem 1.25rem` gaps; reduce to two columns at `900px` and one at `560px`.
- **Tables:** collapsed borders, clear uppercase headers, left-aligned catalog data. Catalog cells remain unwrapped; at `560px` and below, the section table scrolls horizontally.
- **Weekly grid:** equal-width day columns, a `5.5rem` time column, and 30-minute rows. Monday–Friday are always present; weekend columns appear when used. Blocks retain course code, section, and time text rather than relying on color alone.
- **Modal:** white, square, 3px outlined, hard-shadowed; at most `32rem` wide and `85vh` tall, with internal scrolling. The overlay is ink at 65% opacity. A blue header and numbered blue/purple/pink steps carry the shared identity into the tutorial.
- **Print:** remove the dotted background and hide content outside the schedule grid. Event colors request exact print reproduction; empty grid-slot borders become `#ccc` to reduce visual weight. Browser print settings can still affect output.

Spacing is component-specific, not a formal universal spacing scale. Match the nearest existing component instead of inventing a new system.

## Extending the design

**Keep:** square frames, ink outlines, solid brand fills, hard shadows, Space Mono, compact labeled data, and restrained press/lift feedback. Keep status text visible alongside semantic color, and retain course labels when palette colors repeat.

**Avoid:** rounded cards or pill badges, blurred shadows, glass effects, blended gradients, unrelated typefaces, random event colors, and decorative motion. Light status fills and schedule-event fills are intentional exceptions to the saturated brand surfaces—not a replacement pastel theme.

The visual priority is **readable scheduling data first, explicit controls second, personality through the shared brutalist language**. These rules describe visual intent, not a completed accessibility audit; check contrast, keyboard behavior, and small-screen readability when adding or changing components.
