# Final release verification note — 2026-08-19

The v3 compile blockers and alias/citation cleanup issues identified in the independent audit have been fixed. See `FINAL_RELEASE_NOTES.md` for the exact changes.

This sandbox could not complete `npm ci`, so the final authoritative gate remains:

```bash
rm -rf node_modules .next
npm ci
npm run audit:codes
npm run typecheck
npm run build
```

Do not deploy if the real TypeScript or Next.js production build fails. Local static validation in this package reports valid JSON, 0 route collisions, 0 TS/TSX syntax/transpile errors, and 0 unresolved project-local imports.

---

# FixCodeDB Upgrade Verification Notes

## Scope

This build starts from `FixCodeDB_official_upgrade.zip` and applies the content/performance corrections identified in the follow-up audit.

## Database

- 173 total diagnostic guides (previously 76)
- 21 brands
- 12 appliance types
- 10 symptom-first landing pages
- 109 guides with direct manufacturer support references
- 0 duplicate canonical code routes
- 0 records containing the legacy repeated root-cause sentence
- 0 records using `MODEL-SPECIFIC` as a displayed OEM part number

Major new coverage includes Samsung dryers, dishwashers and refrigerators; Whirlpool dishwashers and additional washer codes; GE range/oven codes; Haier combination washer/dryers; GE dehumidifiers; LG dryer, dishwasher and refrigerator codes.

## Client payload correction

`CodeExplorer` now receives `SearchableCode[]` from `toSearchableCodes()` rather than the full `CodeItem[]` records.

The current raw database is about 411 KB as minified JSON-equivalent content, while the client search projection is about 73 KB: roughly an 82% reduction even though the guide count increased from 76 to 173.

Private/non-search fields such as affiliate configuration, source URLs, update dates, safety text, diagnostic steps, and server-only content are not passed into the client explorer.

## Content cleanup

- Removed duplicated snake_case field copies from `codes.json`.
- Removed internal monetization-opportunity and SEO keyword arrays.
- Replaced the repeated root-cause boilerplate with fault-specific paragraphs.
- Removed `MODEL-SPECIFIC` placeholder values from `partNumber`.
- Guide UI now displays `Model number required` when an exact OEM number is not verified.
- Codes where buying a part is not a sensible first step use `replacementPartRecommended: false` and do not show an eBay button.
- FAQ no longer repeats the hero description verbatim.

## Search / URL behavior

- Homepage search accepts a shareable `?q=` parameter.
- WebSite structured data includes a SearchAction target for the homepage query URL.
- Search continues to match brand, appliance, code, description, symptoms, possible causes, and part name.

## Symptom-first SEO

Added `/symptom/[symptom]` routes with static params, metadata, canonicals, internal links, and sitemap entries for:

- washer-not-draining
- washer-not-filling
- washer-wont-spin
- dryer-not-heating
- dryer-taking-too-long
- dishwasher-not-draining
- dishwasher-leaking
- refrigerator-not-cooling
- refrigerator-ice-maker-not-working
- oven-not-heating

## Sources / trust

New manufacturer-backed records include `sourceUrl` and `sourceLabel`. Diagnostic pages render a Manufacturer Reference section and TechArticle JSON-LD can include the citation URL.

## Sitemap

`src/app/sitemap.ts` no longer uses `new Date()` on every build and no longer emits `changeFrequency` or `priority`. Each code uses its stored `updatedAt`; hub dates derive from their newest child record.

## Verification performed in this environment

- `node scripts/audit-codes.mjs` — PASS
- 173 records / 173 unique generated code routes
- 0 local import-resolution failures
- TypeScript transpile/syntax validation across all TS/TSX source files — PASS
- 0 route collisions

A full `npm ci` / `next build` could not be completed in the sandbox because the npm package tarballs are unavailable in the local offline cache. Run the normal clean install and production build in the coding bot / GitHub / Vercel environment.

## Required final commands

```bash
rm -rf node_modules .next
npm ci
npm run audit:codes
npm run typecheck
npm run build
```
