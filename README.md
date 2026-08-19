# FixCodeDB

FixCodeDB is a Next.js 16 appliance diagnostic platform built around crawlable error-code guides, symptom-first discovery, brand/appliance hubs, and model-aware replacement-part guidance.

## Current database

- 173 diagnostic guides
- 21 brands
- 12 appliance types
- 10 symptom-first landing pages
- 97 newly added guides include a direct manufacturer support reference

The content database lives at `src/data/codes.json`.

## Local development

```bash
npm ci
npm run dev
```

Production checks:

```bash
npm run audit:codes
npm run typecheck
npm run build
```

`npm run audit:codes` verifies required fields, duplicate canonical code routes, legacy root-cause boilerplate, placeholder part numbers, and the size difference between the full server dataset and the client search projection.

## Architecture notes

- `src/lib/codes.ts` is the typed server-side data layer.
- `toSearchableCodes()` creates the small, client-safe projection used by `CodeExplorer`; never pass the full `codes` records into a Client Component.
- `src/lib/slug.ts` centralizes canonical URL generation.
- `src/lib/symptoms.ts` defines symptom-first landing pages and their record matching rules.
- Dynamic brand, appliance, brand/appliance, symptom, and code routes are server-rendered and included in `src/app/sitemap.ts`.
- Search on the homepage can be shared with `/?q=...`.

## Content quality rules

1. Add only codes that can be tied to a manufacturer manual, manufacturer support article, or another authoritative primary source.
2. Do not reintroduce generic root-cause boilerplate across many pages.
3. Do not store `MODEL-SPECIFIC` as though it were an OEM part number. Leave `partNumber` absent until a real number is verified.
4. Use `replacementPartRecommended: false` for codes where a part purchase is not a sensible first action.
5. Keep `updatedAt` stable and change it only when the record is materially edited.
6. When available, add `sourceUrl` and `sourceLabel` so the guide can link to the official manufacturer reference.

## Monetization

AdSense verification and `public/ads.txt` are preserved. Existing eBay affiliate URLs keep campaign ID `5339190484` and custom ID `fixcodedb`. Affiliate links are shown only where a replacement component is a reasonable next step and use `rel="sponsored noopener noreferrer"`.

## Deployment

Do not commit or upload `node_modules/` or `.next/`. GitHub/Vercel should install dependencies and build from the source files and lockfile.
