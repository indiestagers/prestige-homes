# Prestige Florida Homes Realty — Website

A high-end, motion-rich Next.js site for Luis Matos and the Prestige team.
Builds as a fully static site, ready to deploy to GitHub Pages.

## Stack

- Next.js 16 App Router (static export) + TypeScript + Turbopack
- Tailwind CSS v4 (CSS-first `@theme` tokens)
- Framer Motion (cinematic hero, parallax, scroll reveals, 3D-tilt cards, sticky journey)
- Cinzel + Josefin Sans (Google Fonts) — luxury real estate pairing
- Lucide icons + custom inline SVG (animated blueprint house, social glyphs)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Editing content

| What | File |
|------|------|
| Listings (add / remove / edit) | `src/data/listings.ts` |
| Team members + photos | `src/data/team.ts` |
| Hero copy + headline | `src/components/CinematicHero.tsx` |
| Hero video clips | `public/hero/01-home.mp4` … `04-toast.mp4` |
| Hero clip duration | `CLIP_SECONDS` constant in `CinematicHero.tsx` |
| About copy + stats | `src/components/About.tsx` |
| Contact info / address | `src/components/ContactSection.tsx` + `src/components/Footer.tsx` |

To use real photos instead of Unsplash placeholders, drop them into
`public/team/jane.jpg` (etc.) and reference like `image: "/team/jane.jpg"`.

## Contact form → Google Sheets

The form posts directly from the browser to a Google Apps Script Web App,
which appends a row to your Sheet. No server required (works on GitHub Pages).

### One-time setup

1. **Create a Google Sheet** with headers in row 1:
   `Timestamp | First Name | Last Name | Email | Phone | Interest | Message`

2. **Open Apps Script:** Sheet → Extensions → Apps Script. Paste:

   ```js
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     const data = JSON.parse(e.postData.contents);
     sheet.appendRow([
       data.timestamp,
       data.firstName,
       data.lastName,
       data.email,
       data.phone,
       data.interest,
       data.message,
     ]);
     return ContentService
       .createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. **Deploy:** Deploy → New deployment → Type: Web app
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy** → copy the **Web App URL**.

4. **Wire it in.**
   - **Local dev:** create `.env.local`:
     ```
     NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
     ```
   - **GitHub Pages:** add a repo secret named `GOOGLE_SHEETS_WEBHOOK_URL`
     (Settings → Secrets and variables → Actions → New repository secret).
     The workflow reads it at build time.

> Without the URL set, form submits succeed silently (logged to console)
> so the site still functions — useful while you're getting set up.

## Deploy to GitHub Pages

The repo includes `.github/workflows/deploy.yml`. **First-time setup:**

1. **Push to GitHub** (any repo name; the workflow reads the slug automatically).
2. **Enable Pages:** Settings → Pages → Source: **GitHub Actions**.
3. *(optional)* **Add the Sheets secret:** Settings → Secrets and variables →
   Actions → New repository secret →
   Name `GOOGLE_SHEETS_WEBHOOK_URL`, value = your Apps Script URL.
4. The workflow runs on every push to `main`. Site lives at
   `https://<username>.github.io/<repo>/`.

### Build locally to verify

```bash
NEXT_PUBLIC_BASE_PATH="" npm run build   # for root domain
# OR
NEXT_PUBLIC_BASE_PATH="/prestige-homes" npm run build   # match your repo slug
```

Output is in `./out/` — open `out/index.html` to preview the static build.

## Pages

- `/` — Home (cinematic video hero, marquee, about, 3D-tilt listings, sticky journey, team, contact)
- `/listings` — Filterable listings grid (status, price, beds, search)
