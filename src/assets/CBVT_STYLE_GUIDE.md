# CBVT Identity System

**Visual identity — v2 foundations**
Client: Cebu Best Value Trading Corp. · Location: Cebu City, Cebu, PH · Status: Draft for review

This document audits the current live prototype (v1) — the Khand / Carme / Alegreya Sans SC / IBM Plex Sans build with the navy-and-sky palette — and defines the systemized foundations for v2: a full color scale, a corrected type system, spacing and radius tokens, and component patterns, built for an HVAC and general-services trading company operating out of Cebu City.

v1's core idea — deep navy, cool blues, warm cream — is a sound starting point and is kept. What v2 fixes is that almost every size, radius, and color in v1 was a one-off value chosen in the moment rather than drawn from a scale. Every claim below is backed by a grep against `client/pages`, not a guess.

---

## 01 · Scope & content gaps

- **Three of seven service lines are on the site.** v1 only has copy for Repair, Installation, and Retail. Sales, General Cleaning, Airduct Installation, Exhaust Duct Installation, and Motor Rewinding (all kinds of motors) don't exist anywhere in the current build. v2's information architecture needs to be built for the full seven, not the three that happened to get coded.
- **The address in the Contact section may be stale.** v1 hardcodes "El Pueblo Dos, Pagutlan, Liloan, Cebu." You described the business as based in Cebu City — confirm which is current before it ships again.
- **Contact details are unverified.** `cbvt_1234@yahoo.com.ph` and `09185829931` are hardcoded in two places — carry them forward only if they're still the right channels.
- **Every image is a temporary placeholder.** Hero unit, service cards, brand logos, and the partnership photo all point at `cdn.builder.io/.../TEMP/…` assets — none of it is real. v2 needs actual jobsite photography or licensed stock before launch; direction is proposed in [§ Imagery](#06--imagery--icons).

---

## 02 · Color

### v1 audit

Eight named colors, defined once in `global.css` and otherwise applied by feel. Two of them are effectively duplicate "muted greys" with no defined relationship to each other: `cbvt-gray` (#676767, a true neutral) and `cbvt-muted` (#A39898, which carries a pink cast that doesn't relate to the navy family it sits next to). Nothing ties a color to a role — the same navy fills the nav pill, the primary hero button, and the footer, while the one true call-to-action button on the homepage (the contact form's submit) is filled with `cbvt-light-blue`, a low-contrast blue that reads as decoration, not "click me."

| Token | Hex | Note |
|---|---|---|
| cbvt-navy | `#0F2851` | Carried into v2 unchanged as Ink 900 — this is the brand mark color. |
| cbvt-blue | `#608BC1` | 4.1:1 on white — under AA for body text. Refined in v2. |
| cbvt-light-blue | `#7193BE` | Used as the only CTA fill on the homepage. Too close to cbvt-blue to read as a distinct action color. |
| cbvt-sky | `#CBDCEB` | Good tint. Kept as Mist 100. |
| cbvt-cream | `#F5EFEB` | Warm neutral, works well. Kept as Porcelain. |
| cbvt-light-cream | `#F7F7FA` | Defined, never used in any page. Dropped. |
| cbvt-gray | `#676767` | True neutral, no relation to navy. Replaced by a navy-tinted neutral. |
| cbvt-muted | `#A39898` | Unintentional pink cast next to cbvt-gray. Dropped. |

### v2 palette

The navy/blue/sky/cream identity stays — it already reads as "cool air," which is the right story for an aircon company. What's new is **Copper**: a single warm accent, reserved for the moment the site wants the visitor to act. It's not a random highlight color — copper tubing is the literal material CBVT installs and rewinds, so the accent is drawn from the business rather than a color wheel. Two colors now carry all interactive weight: **Ink** for structural/navigational actions, **Copper** for conversion ("Book Now," "Send Message," "Get a Quote").

| Token | Hex | Usage |
|---|---|---|
| Ink 900 | `#0F2851` | Headings, nav, primary text, secondary buttons. |
| Ink 700 | `#1B3A6B` | Hover state for Ink-filled buttons. |
| Steel 600 | `#2F5C8C` | 6.9:1 on white. Links, active nav state. |
| Steel 500 | `#4A78B4` | Icons, chart/illustration fills, secondary emphasis. |
| Mist 100 | `#DCE8F3` | Tinted section backgrounds, info panels. |
| Copper 600 | `#A85A1A` | 5.1:1 on white. Primary CTA fill. |
| Copper 400 | `#D98A3D` | Dark-mode CTA fill, hover tint, icon accent. |
| Porcelain | `#F6F1EA` | Warm alternate section background. |
| Neutral 600 | `#5B6B82` | Body copy secondary / muted text — navy-tinted, not pink-tinted. |

### Role map

| Role | Token | Notes |
|---|---|---|
| Page background | Mist 50 (`#F2F6FB`) | Default canvas. |
| Card / surface | White | Or Porcelain for a warmer alternating section. |
| Primary text | Ink 900 | Headings and body on light surfaces. |
| Muted text | Neutral 600 | Captions, helper text, metadata. |
| Primary action | Copper 600 | One per view. Book, send, buy, request. |
| Secondary action | Ink 900 | Login, navigation, view-only actions. |
| Border / divider | `#E1E7EE` | 1px, never a shadow standing in for a border. |

---

## 03 · Typography

### v1 audit

Four typefaces are loaded. Usage counts below are exact, counted across every `.tsx` page:

| Typeface | Uses | Weights loaded | Verdict for v2 |
|---|---|---|---|
| Khand | 27 | 400 / 600 / 700 | **Keep** — display |
| Carme | 148 | 400 only | **Retire** |
| Alegreya Sans SC | 99 | 400 / 700 | **Narrow** to labels |
| IBM Plex Sans | 3 | 300–700 | **Promote** — body & UI |

Carme is the most-used face on the site and it only has one weight — there is no bold Carme, so nothing set in it can ever get typographic emphasis without switching families entirely. Alegreya Sans SC is a small-caps display face being used for full sentences ("Book our Services Now!" at 22px) and for multi-line nav text — small-caps forms are built for short labels, not running copy, and it shows in how tight the letter spacing feels at length. IBM Plex Sans — the one face actually built for UI and body text, with a real weight range — is used in exactly one paragraph.

v2 keeps three faces instead of four, but the fix is really about **reassigning roles**: Khand stays for display, IBM Plex Sans becomes the workhorse for everything it was already best suited for, and Alegreya Sans SC is restricted to short uppercase labels where its small-caps form is an asset, not a liability.

21 distinct one-off font sizes were found in the codebase, e.g. `text-[99px]`, `text-[200px]`, `text-[46px]`, `text-[41px]`, `text-[21px]` (×29), `text-[19px]` (×8), `text-[10px]` (×6).

### v2 type scale

Ten steps, replacing the 21 one-off sizes above.

| Token | Size | Face / weight | Usage |
|---|---|---|---|
| display-2xl | 72px / 4.5rem | Khand 700 | Hero, once per page |
| display-xl | 48px / 3rem | Khand 700 | Section heading |
| display-lg | 36px / 2.25rem | Khand 600 | Subsection heading |
| display-md | 24px / 1.5rem | Khand 600 | Card / component title |
| body-lg | 18px / 1.125rem | Plex 400 | Lead paragraph |
| body-md | 16px / 1rem | Plex 400 | Default body |
| ui-md | 15px / 0.95rem | Plex 600 | Buttons, nav links |
| body-sm | 14px / 0.875rem | Plex 400 | Meta, captions, specs |
| label | 12px / 0.75rem | Plex 500, uppercase | Form / spec labels |
| eyebrow | 13px / 0.8rem | Alegreya SC 700, uppercase, wide tracking | Section eyebrow only |

---

## 04 · Spacing & radius

v1's corner radii: `15px, 21px, 22px, 25px, 30px, 50px, 57px, 58px` — eight distinct values, none reused consistently, each picked to look right on one specific element. v2 replaces all eight with four tokens:

| Token | Value |
|---|---|
| radius-sm | 8px |
| radius-md | 16px |
| radius-lg | 24px |
| radius-full | pill (9999px) |

### Spacing scale

An 8px-based scale for gaps, padding, and section rhythm.

| Token | Value |
|---|---|
| space-1 | 4px |
| space-2 | 8px |
| space-3 | 12px |
| space-4 | 16px |
| space-5 | 24px |
| space-6 | 32px |
| space-7 | 48px |
| space-8 | 64px |
| space-9 | 96px |

---

## 05 · Components

- **Buttons:** Primary (Copper 600 fill, pill), Secondary (Ink 900 fill, pill), Outline (Ink 900 border), Ghost (Steel 600 underlined text).
- **Service card:** icon tile (Ink 900 bg, Copper 400 glyph) → title (display-md, Khand 600) → one-line description (body-sm, Neutral 600) → secondary button. Sized to hold all seven service lines, not just the three v1 shipped with — e.g. Motor Rewinding, General Cleaning, Split-Type Installation.
- **Form field:** label (label token, Neutral 600) above input; 8px radius; Copper 500 focus border, no default browser outline.
- **Navigation:** pill-shaped bar, wordmark in Khand 700, links in ui-md, primary action (Login) as a small Ink-filled pill on the right.
- **Footer:** Ink 900 background, Neutral text, single row with copyright + location.

---

## 06 · Imagery & icons

Every photo in v1 is a temporary Builder.io asset — a generic aircon-unit stock shot and a generic handshake stock shot. None of it says "Cebu" or "CBVT." v2's photography should come from actual job sites: technicians mid-repair, real units being mounted, the shop or service vehicles if they exist. Consistent crop ratio (4:3 for cards, 16:9 for wide banners), natural light over studio light, and a light navy duotone overlay on hero imagery only — not on every photo — keeps the site coherent even with imagery shot on different days with different phones.

Suggested shot list:
- **Hero** — technician actively working on a unit, wide shot, room to place headline over the left third.
- **Service card** — close crop on hands / tools / copper line-set work.
- **Catalog** — clean product-only shots, neutral background, consistent angle.
- **About** — team or shopfront, Cebu City context visible.

**Icons:** simple line icons, 1.5px stroke, no fill — matches Khand's mechanical, drafting-table character better than the rounded filled icons that tend to default in off-the-shelf UI kits. Copper is the only color icons ever take on; everything else is Ink or Neutral 600.

---

## 07 · Site structure for v2

Restructured around all seven service lines instead of three.

| Page | Notes |
|---|---|
| **Home** | Hero, summary of all seven service lines, trusted brands, contact. |
| **Services** | Hub page grouping the seven lines into four families: Repair & Maintenance (Aircon & Chiller Repair); Installation (Split-Type, Airduct, Exhaust Duct); General Cleaning; Motor Rewinding (all types). |
| **Catalog** | Sales — retail units, existing product-grid pattern carries forward. |
| **About** | Story, mission/vision, why-choose-us — structure from v1 holds, content needs Cebu-specific detail. |
| **Contact** | Single request form covering all service types via a selector, not just aircon. |
| **Login / Admin** | Out of scope here — internal tooling, not a public-identity concern. |

---

## 08 · Before you build

- [ ] **Confirm the business address** — Cebu City vs. the Liloan address currently hardcoded in Contact.
- [ ] **Confirm the email and phone number** are still the right channels to publish.
- [ ] **Source real photography** — jobsite shots, technicians, actual units — or budget for licensed stock as a stand-in.
- [ ] **Check for existing offline branding** — vehicle signage, uniforms, tarpaulins. If a color scheme already exists in the physical world, v2 should match it rather than introduce a second one.
- [ ] **Decide whether admin/login/order-tracking is in scope for v2** or a separate phase — this guide covers the public-facing identity only.

---

*CBVT Identity System — draft v1.0 · built from an audit of the live `client/pages` prototype, August 2026.*
*Rendered version with live color swatches and type specimens: see the published artifact.*
