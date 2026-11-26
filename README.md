# Nikash Baboolal — personal website

Personal website of **Nikash Baboolal**, Process Engineer (Candidate Engineer, ECSA) based in
Richards Bay, South Africa. Live at **https://nikash.web.app** (mirror: https://nikashb1.web.app).

All copy comes from Nikash's CV. Do not add employers, figures, certifications or testimonials that
are not in the CV.

## Stack

| Area      | Tooling                                                                    |
| --------- | -------------------------------------------------------------------------- |
| Framework | [Next.js 16](https://nextjs.org) App Router, React 19, TypeScript (strict) |
| Output    | Static export (`output: "export"`) served by Firebase Hosting              |
| Styling   | Tailwind CSS v4 (CSS-first config in `app/globals.css`)                    |
| Motion    | `motion` (Framer Motion), `lenis` smooth scroll, `react-fast-marquee`      |
| Visuals   | `cobe` (WebGL globe), `@tabler/icons-react`, `lucide-react`                |
| Forms     | `zod` validation; the contact form opens a prefilled `mailto:` link        |
| Quality   | ESLint (`eslint-config-next`), Prettier with `prettier-plugin-tailwindcss` |

Requires **Node.js 22** (see `.nvmrc`).

## Scripts

```bash
npm ci              # install exact dependencies from package-lock.json
npm run dev         # local dev server on http://localhost:3000
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run build       # static export to out/
```

## Pages

| Route         | Content                                               |
| ------------- | ----------------------------------------------------- |
| `/`           | Hero, highlights, skills, credentials, call to action |
| `/about`      | Profile, education, certifications                    |
| `/experience` | Career timeline                                       |
| `/contact`    | Contact form (mailto) and direct contact details      |

## Editing content

Every piece of text (name, role, contact details, summary, stats, skills, experience, education,
certifications, places and navigation) lives in **`lib/content.ts`**. Edit it there and every page
picks up the change. Keep the display phone number (`phone`) and the dialable form (`tel`) in sync.

Photography is registered in `lib/media.ts` (files in `public/images/`, credits in
`public/images/CREDITS.md`). Only use images you are licensed to use and keep the credit.

## Deployment

The site is a fully static export: `npm run build` writes the site to `out/`, which Firebase
Hosting serves.

- **Firebase Hosting sites:** `nikash` → https://nikash.web.app and `nikashb1` → https://nikashb1.web.app
  (both configured as hosting targets in `firebase.json`).
- **Project:** set your Firebase project id in `.firebaserc` (`projects.default`).
- **Continuous deployment:** `.github/workflows/deploy.yml` builds and deploys to both sites on every
  push to `main`. It authenticates to Google Cloud with keyless **Workload Identity Federation**
  (GitHub OIDC), so no service-account key is stored in the repository or in GitHub secrets.

Manual deploy (with the Firebase CLI signed in):

```bash
npm run build
npx firebase-tools deploy --only hosting
```
