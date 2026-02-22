# Design: Contact Form System

**Problem**: Add a contact form to a static portfolio site that sends email to the owner and pushes an instant phone notification, with spam protection, no backend server, and no aesthetic compromise.

**Constraints** (hard first, soft second):

| Priority | Constraint |
|---|---|
| Hard | No backend server — static hosting only (Vite + gh-pages) |
| Hard | Email delivery within seconds |
| Hard | Phone notification within seconds (instant push, not SMS carrier delay) |
| Hard | Must not break black/white minimalist aesthetic |
| Hard | Vanilla JS / React only — no new heavyweight dependencies |
| Soft | Rate limiting preferred server-side; client-side is defense-in-depth only |
| Soft | CAPTCHA acceptable if invisible or minimal friction (site is demo'd live, QR scan audience) |
| Soft | Free tier preferred; paid acceptable if trivially cheap |

**Approach**: Formspree (email) + ntfy.sh (push notification), both triggered from the client in parallel. No backend glue required. Rate limiting handled by Formspree server-side; client-side adds submission throttle as a second layer.

---

## Components

- **ContactForm** (React component): Renders form, owns submission logic, drives both API calls, manages UI state
- **Formspree endpoint**: Receives form data, sends email to jay@[domain], applies spam filtering + rate limiting
- **ntfy.sh topic**: Receives a POST from the browser on submission success, delivers push to Jay's phone via the ntfy app
- **Client-side validation layer**: Inline JS validation before any network call — sanitizes inputs, prevents empty/malformed submissions
- **Client-side throttle**: localStorage timestamp check — blocks re-submission within a cooldown window before even reaching the network

---

## Data Flow

```
User fills form
  → Client validation (required fields, email format, length caps)
      → Fails: inline error shown, no network call
      → Passes:
          → Client throttle check (localStorage)
              → Throttled: "Please wait before resubmitting" message, stop
              → OK:
                  → POST to Formspree endpoint (form data as JSON)
                  → POST to ntfy.sh topic (notification payload) [parallel]
                      → Formspree success: email delivered to jay@[domain]
                      → ntfy success: push notification pops on Jay's phone
                          → Both succeed: show success state in form
                          → Formspree fails: show error, allow retry
                          → ntfy fails: silent — email is the primary channel
```

---

## Integration Points

- **Formspree**: `POST https://formspree.io/f/{FORM_ID}` — Content-Type `application/json`. Response `{ok: true}` on success. Rate limited server-side at ~50/month free tier. Honeypot field + ML spam filter included.
- **ntfy.sh**: `POST https://ntfy.sh/{TOPIC}` — plain text body or JSON with `title`, `message`, `priority` headers. Called directly from browser JS, no auth required for public topics. Rate limit: 60 burst, 1 req/5s replenish — far above any realistic contact form load.
- **ntfy mobile app**: Installed on Jay's phone, subscribed to `{TOPIC}`. Notification arrives as a native push within 1-2 seconds of POST.
- **Vite build**: No new build config required. Both integrations are HTTP calls, no SDK imports needed.

---

## Service Selection Rationale

### Email: Formspree

| Option | Verdict |
|---|---|
| Formspree | Retained. JSON POST, server-side spam/rate limiting, 50 submissions/month free. No backend needed. |
| EmailJS | Eliminated. Exposes API keys in client bundle. Spam protection weaker. |
| Web3Forms | Viable fallback. Simpler but fewer spam controls. |
| Netlify Forms | Eliminated. Requires Netlify hosting specifically. Site deploys to gh-pages. |

Formspree's free tier ML spam filter (Formshield) and built-in honeypot remove the need for client-side CAPTCHA friction. If 50/month proves insufficient, upgrade to $10/month Personal plan — not a decision to make now.

### Push Notification: ntfy.sh

The requirement says "SMS." True SMS via Twilio requires a backend (the API key cannot be exposed client-side). ntfy.sh achieves the same outcome — instant native notification on the phone — with a direct browser POST and zero backend.

| Option | Verdict |
|---|---|
| ntfy.sh | Retained. Direct browser POST, free, open source, native Android/iOS app, instant delivery. |
| Pushover | Viable but costs $5 one-time per platform. No functional advantage here. |
| Twilio SMS | Eliminated. Requires a backend to hold the API secret. Contradicts hard constraint. |
| Zapier/Make webhook | Eliminated. Adds a third service, latency hop, and free tier limits for what ntfy does natively. |

**ntfy topic security**: Public topics on ntfy.sh are obscure-by-URL, not authenticated. Anyone who knows the topic string can POST to it. Mitigation: use a long random topic name (e.g., `jay-portfolio-contact-a7f3k9x2`). This is acceptable for a personal portfolio — the risk is nuisance spam notifications, not data exposure. If this becomes a problem, ntfy.sh supports access tokens on paid tiers, or self-hosting.

---

## Security Hardening

### Input Validation (client-side)
- Required: `name`, `email`, `message`
- Email: regex format check before submission
- Length caps: name ≤ 100 chars, message ≤ 2000 chars — enforced on `input` event and on submit
- Strip leading/trailing whitespace before sending
- These are UX guards only — Formspree validates server-side independently

### XSS Prevention
- All user input rendered via React's default text rendering (no `dangerouslySetInnerHTML` in the form component)
- ntfy notification body uses only controlled fields (name + truncated message), not raw HTML
- Formspree handles email rendering server-side — no client XSS vector there

### CSRF
- Not applicable. The Formspree endpoint is a public API accepting cross-origin POSTs by design. The site has no session cookies, no state to forge.

### Honeypot Field
- Add a hidden `_gotcha` field per Formspree convention. Bots fill it; Formspree rejects those submissions silently.
- Rendered with `display: none` via inline style (not a CSS class — bots sometimes parse external CSS).

### Client-Side Throttle
- On successful submission: write `contactFormLastSent` timestamp to `localStorage`
- On form submit: if `Date.now() - lastSent < COOLDOWN_MS`, block and show message
- `COOLDOWN_MS` = 60000 (1 minute) — enough to deter accidental double-submits and casual abuse
- This does not stop a determined attacker. Formspree's server-side limits are the real backstop.

---

## Rate Limiting Strategy

```
Layer 1 (Formspree, server-side): 50 submissions/month free tier
  — Hard cap. Excess submissions dropped. Jay gets notified at 50/75/90%.
  — Adequate for a portfolio with QR code demo traffic.

Layer 2 (ntfy.sh, server-side): 60 burst, 1/5s replenish per IP
  — Practically unreachable for a contact form.

Layer 3 (client-side, localStorage): 1 submission per 60 seconds per browser session
  — Prevents double-submits and removes most accidental/casual spam
    before it consumes Formspree quota.
```

Client-side throttle costs almost nothing to implement and preserves monthly quota. It is not a security measure — it is quota hygiene.

---

## SMS / Push Notification: What Jay Sees

Notification on Jay's phone (via ntfy app):

```
Title:    "New contact from [name]"
Body:     "Email: [email] — [first 120 chars of message]..."
Priority: high (ntfy priority 4 — bypasses Do Not Disturb)
Tags:     "envelope" (renders envelope emoji in notification)
```

The ntfy app can be configured to play a distinct sound and show on lock screen. Setup is: install ntfy app → subscribe to topic string → done.

---

## Error Handling and User Feedback

| State | UI Behavior |
|---|---|
| Validation failure | Inline field error, red border, no network call |
| Throttle block | Banner: "You've already sent a message recently. Please wait a moment." |
| Submitting | Button disabled, text changes to "Sending..." (no spinner — keeps aesthetic) |
| Success | Form hides, replaced with one-line: "Message received. I'll be in touch." |
| Formspree error | Banner: "Something went wrong. Try again or email me directly at [address]." Button re-enables. |
| ntfy error | Silent. Email is the primary delivery channel. ntfy is best-effort. |

Success state is irreversible within the session (no "send another"). Refresh resets it. This prevents quota burn on accidental re-sends.

The error fallback exposes Jay's email address as a hardcoded safety net — appropriate for a portfolio, and already expected by visitors.

---

## Implementation Path

**Phase 1 — Wire up email (30 minutes):**
1. Create Formspree account, create a new form, copy `FORM_ID`
2. Build `Contact.jsx` component: name, email, message fields + honeypot
3. POST to Formspree on submit, handle success/error states
4. Add `Contact` to `App.jsx` above `Footer`
5. Test end-to-end: submit → verify email arrives

**Phase 2 — Wire up push notification (15 minutes):**
1. Choose a long random ntfy topic string
2. Install ntfy app on Jay's phone, subscribe to topic
3. Add parallel `fetch` to ntfy.sh inside the existing submit handler
4. Test: submit form → verify notification pops on phone

**Phase 3 — Harden (20 minutes):**
1. Add client-side throttle (localStorage check)
2. Add length validation and field caps
3. Add `_gotcha` honeypot field with inline `display:none`
4. Smoke test: verify throttle blocks second rapid submission

**Phase 4 — Style (time varies):**
- Match existing typography (EB Garamond, existing CSS classes)
- No new color — black text, white background, subtle border
- Mobile-first layout: single-column, full-width inputs, generous tap targets

---

## Open Questions

- **Domain for jay@[domain]**: What is the receiving email address? Formspree routes to whatever is configured at form creation. This is a setup step, not a design decision.
- **ntfy topic persistence**: The topic string should be treated like a password (obscure but not secret). Where will it be stored so it isn't lost? Recommend: `.env` file committed to a private repo or noted in a password manager.
- **Formspree quota monitoring**: At 50/month free, a viral demo session could exhaust the quota. Is that acceptable, or should the paid tier ($10/month) be pre-provisioned before the demo?

---

## Assumptions

- Jay has the ntfy app available for Android or iOS installation
- The portfolio will be accessed via HTTPS (gh-pages enforces this) — required for Formspree's CORS policy
- No analytics or submission logging is needed beyond the email itself
- The existing CSS pattern (class-based, no Tailwind) will be extended for the form — no new styling system introduced
- ntfy.sh public hosted service is acceptable; self-hosting is not in scope

---

*Design produced: 2026-02-22*
