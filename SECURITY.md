## Security Assessment – Pravay

This document summarizes the current security posture of the Pravay Next.js app and provides a prioritized roadmap of security improvements. Assessment covers authentication and session handling, API routes (including Stripe webhook), data validation, XSS risks, headers/CSP, and secret management.

### Scope and Context
- Framework: Next.js (App Router) with middleware-based auth gating
- Auth: Supabase (SSR/browser clients), session via Supabase cookies
- Payments: Stripe Checkout + webhook
 - AI: OpenAI API used server-side for chat and plan generation

---

### High-Impact Fixes Implemented
- XSS mitigation for plan rendering: removed `dangerouslySetInnerHTML`; plans render as plain text in `src/app/dashboard/plan-viewer.tsx` and `src/app/passion/[id]/plan-modal.tsx`.
- CSRF protection for authenticated POST endpoints: middleware issues a `csrfToken` cookie; endpoints validate `x-csrf-token` header vs cookie in `/api/passion/chat`, `/api/passion/generate-plan`, and `/api/checkout/create-session`.
- Trusted return URLs for Stripe Checkout: use `APP_BASE_URL` for `success_url` and `cancel_url` in `/api/checkout/create-session`.
- Global security headers and a baseline CSP added in `next.config.ts`.

Note: Ensure `APP_BASE_URL` is set in the environment for all deployments.

---

### Current Posture (Findings)

1) Authentication & Authorization
- Middleware (`src/middleware.ts`) gates non-API routes for unauthenticated users; API routes perform server-side `supabase.auth.getUser()` checks.
- Page-level access controls consistently verify `user.id` against row ownership for `passion` and `user_profiles`.
- Logout implemented server-side.
 - CSRF tokens enforced on authenticated POST endpoints (cookie + `x-csrf-token`).

2) Secrets & Environment
- Stripe secret key and Supabase Service Role key are used only in server code. No client exposure found.
- Public Supabase URL and anon key are correctly used client-side.

3) Payments (Stripe)
 - Checkout session creation requires auth and uses trusted `APP_BASE_URL` for `success_url`/`cancel_url`.
 - Webhook: signature verification performed with multiple possible secrets; raw body handling is correct for Node runtime. Idempotency is handled at application level by checking for an existing `stripe_payment_intent_id`.
   - Improvement: enforce a DB unique constraint on `purchases.stripe_payment_intent_id` for hard idempotency.

4) Input Validation & Rate Limiting
- Minimal validation; bodies are parsed directly in API routes. No structured schema validation.
- No rate limiting on endpoints (login/signup, chat, plan generation, checkout), which can enable abuse/cost amplification.

5) Cross-Site Scripting (XSS)
 - Chat messages render via JSX text nodes (safe by default).
 - Plan rendering now uses plain text with `whitespace-pre-wrap`; no raw HTML is injected.

6) Security Headers / CSP / CORS
 - Global security headers and a baseline CSP are configured in `next.config.ts`.
 - No CORS configuration needed for first-party use; defaults are sufficient.

7) Password & Account Lifecycle
- Signup enforces only minimal password length (>= 6). Email verification flow depends on Supabase settings; app logic supports both verified and unverified sessions.
- No lockout or throttling behavior for auth endpoints.

8) Logging & Error Handling
- Errors are logged server-side. Some redirects include error messages in query strings; avoid exposing sensitive internals.

---

### Prioritized Security Improvements

#### High Impact (Implemented)
- XSS mitigation for plan rendering (plain text; no innerHTML).
- Trusted base URL for Stripe checkout via `APP_BASE_URL`.
- CSRF protection for authenticated POST endpoints (cookie + `x-csrf-token`).
- Security headers and CSP configured globally.

#### Medium Impact
- Schema validation for all inputs
  - Introduce zod/valibot schemas for request bodies and server actions; reject invalid types, lengths, and unexpected fields.
- Rate limiting & abuse prevention
  - Apply rate limits to login/signup and AI endpoints to control cost and prevent brute force.
- Hard idempotency for Stripe webhook
  - Enforce a unique constraint on `purchases.stripe_payment_intent_id` to prevent duplicate inserts under concurrency.
- Authentication hardening
  - Enforce stronger password policy and consider email verification as mandatory in Supabase settings.

#### Low Impact
- Error message hygiene
  - Avoid passing raw error strings via query parameters; map to user-friendly codes/messages.
- Improved monitoring & alerts
  - Add structured logging and alerts on webhook failures and repeated 401/429s.
- Dependency and supply-chain checks
  - Add automated dependency vulnerability scanning (e.g., GitHub Dependabot, `npm audit` in CI) and pin critical libraries.

---

### Concrete Next Steps (Suggested Implementations)

1) Validation & Rate limiting
- Wrap endpoint bodies with zod schemas; return 400 on invalid.
- Add per-IP/user rate limits (e.g., 5/min) on auth and AI endpoints; back with Redis or Upstash.

2) Webhook idempotency
- Create a unique index on `purchases(stripe_payment_intent_id)`; handle conflict upserts.

3) Auth settings
- In Supabase, require email verification and consider strengthening password requirements.

4) Error message hygiene
- Avoid passing raw error strings via query parameters; map to user-friendly codes/messages.

5) Monitoring & alerts
- Add structured logging and alerts on webhook failures and repeated 401/429s.

6) Dependency and supply-chain checks
- Add automated dependency vulnerability scanning (e.g., GitHub Dependabot, `npm audit` in CI) and pin critical libraries.

---

### Residual Risks
- AI output is rendered as plain text; no HTML executes. If future features require rendering markup, enforce strict sanitization and a tight allowlist.
- CSRF relies on cookie+header validation; consider rotating per-session tokens and using stricter `SameSite` if compatible with auth flows.

---

### Verification Checklist (post-implementation)
- No `dangerouslySetInnerHTML` without sanitization; manual tests confirm script injection is neutralized.
- Stripe returns only to configured `APP_BASE_URL` routes.
- CSRF tokens required and validated for all authenticated POST endpoints.
- Security headers present and CSP blocks inline/eval scripts.
- Rate limits enforced; invalid payloads rejected by schema validation.
- Unique constraint prevents duplicate purchase records on webhook retries.


