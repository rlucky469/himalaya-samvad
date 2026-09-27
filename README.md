# Himalaya Samvad — Website

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · next-intl (Hindi + English) · SSG for SEO.

## Quick start

```bash
npm install
cp .env.example .env.local      # Windows: copy .env.example .env.local
npm run dev                     # http://localhost:3000
```

Other scripts: `npm run build`, `npm start`, `npm run lint`, `npm run typecheck`, `npm run i18n:check`.

Requires Node 20.9+ (the magazine conversion script needs Node 22.13+).

## Where to change things

| What | Where |
|---|---|
| All text (Hindi / English) | `messages/hi.json`, `messages/en.json` — keep both files the same shape, then run `npm run i18n:check` |
| Every image path | `src/content/media.json` (one file for both languages) |
| Image files | `public/images/**` — replace a placeholder with a real photo **using the same file name** |
| Colours, fonts, radius, shadows | `src/styles/theme.css` (CSS variables / design tokens) |
| Phone, emails, social links, current issue | `src/config/site.ts` |
| URLs of pages | `src/config/routes.ts` |
| Backend endpoints | `src/config/api-endpoints.ts` + `NEXT_PUBLIC_API_BASE_URL` |

Placeholder content to replace before launch: team photos (`public/images/team/*`), article titles/authors/summaries (`articles.items` in the JSON), membership prices (`membership.plans.items[].price`), legal pages (review by the legal advisor — remove the draft notice in `src/components/sections/LegalPage.tsx`).

## Languages & SEO

- Hindi is the default at `/…`, English at `/en/…`. The header switch is a real link to the same page in the other language.
- Every page is statically generated with localized title/description, canonical URL, `hreflang` alternates, Open Graph, and JSON-LD (organization, website, breadcrumbs, issue, article, FAQ).
- `sitemap.xml`, `robots.txt` and the web manifest are generated from `src/app/sitemap.ts`, `robots.ts`, `manifest.ts`.
- Set `NEXT_PUBLIC_SITE_URL` to the live domain before deploying.

## Backend (Node.js) integration

All calls go through `src/services/api/client.ts`. While `NEXT_PUBLIC_API_MOCK=true`, a fake backend (`src/services/api/mock.ts`) answers every request and logs the exact payload in the browser console. Demo OTP: `123456`.

To connect the real backend: set `NEXT_PUBLIC_API_MOCK=false` and `NEXT_PUBLIC_API_BASE_URL`. Payload/response types are in `src/types/api.ts`; payload builders are in `src/services/*.service.ts`.

| Method & path | Body | Response |
|---|---|---|
| `POST /auth/register` | `RegisterPayload` — name, email, mobile `{countryCode:"+91", number}`, city, password, acceptedTerms, locale | `{ userId, email, mobile, verification }` (send both OTPs) |
| `POST /auth/otp/send` | `{ userId?, channel: "mobile"\|"email", target, purpose: "verify"\|"reset" }` | `{ sent, retryAfterSeconds }` |
| `POST /auth/otp/verify` | `{ userId, channel, target, otp }` | `{ verified, verification, session? }` (session once both verified) |
| `POST /auth/login` | `{ identifier, identifierType, password, rememberMe }` | `AuthSession { accessToken, expiresAt, user }` — unverified: 403 `{ code: "ACCOUNT_NOT_VERIFIED", errors: { userId } }` |
| `POST /auth/password/forgot` | `{ identifier, identifierType }` | `{ sent, maskedTarget }` |
| `POST /auth/password/reset` | `{ identifier, identifierType, otp, newPassword }` | `{ reset }` |
| `POST /auth/logout` · `GET /auth/me` | bearer token | `{}` · user (`me` is also used to unlock the magazine) |
| `POST /forms/contact` | multipart: name, email, mobile, subject, message, locale, attachment? | `{ id, receivedAt }` |
| `POST /forms/membership` | `MembershipPayload` | `{ id, receivedAt }` |
| `POST /forms/advertise` | `AdvertiseEnquiryPayload` | `{ id, receivedAt }` |
| `POST /newsletter/subscribe` | `{ email, locale }` | `{ id, receivedAt }` |

Errors: any non-2xx with `{ message?, code?, errors?: { field: "validationKey" } }` — field errors show under the matching input.

The session is kept in browser storage (`src/services/api/session-storage.ts`); if the backend moves to httpOnly cookies, only that file needs to change.

## Online magazine (no PDF download)

The PDF never reaches the browser. It is converted into page images stored outside `/public`:

```bash
# put the issue PDF in magazine-source/ (git-ignored), then:
npm run magazine:build -- --pdf magazine-source/my-issue.pdf --slug pratham-ank-october-2026 --preview 4
```

This writes `private/magazine/<slug>/` (pages, thumbnails, manifest). The reader (`/issues/<slug>/read`) asks `/api/magazine/<slug>/pages` for short-lived signed URLs: logged-out readers get the free preview pages, logged-in readers get all pages. Every full page is served with the reader's email burned in as a faint watermark; opening an image URL directly in a tab, reusing an expired URL or editing it returns 403. Right-click, drag, text selection, Ctrl+S / Ctrl+P and printing are blocked in the reader.

Set a long random `MAGAZINE_SIGNING_SECRET` in production. A demo PDF is included in `magazine-source/`.

Note: no website can stop screenshots or a phone camera — the per-reader watermark is what makes a leak traceable.

## Project structure

```
messages/            hi.json, en.json — all content
private/magazine/    protected page images (not public)
scripts/             i18n check, PDF → page images
src/app/[locale]/    (site) pages · (auth) login/register/verify/reset · (reader) flipbook
src/app/api/         signed magazine page API
src/components/      ui · layout · sections · cards · forms · auth · reader · icons · seo
src/config/          site, routes, env, api endpoints
src/content/         media.json — image registry
src/lib/             seo, structured data, content, media, validation, magazine (server)
src/services/        API client, mock backend, auth/forms/magazine services
src/styles/          theme.css (tokens), globals.css, fonts
```
