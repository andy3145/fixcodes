# FixCodeDB final release pass — 2026-08-19

This file documents the fixes applied after the v3 independent audit.

## Release blockers fixed

- Fixed the unescaped apostrophe in `src/lib/symptoms.ts` that made TypeScript parsing fail.
- Fixed `src/app/sitemap.ts` so `canonicalCodes` is imported and used consistently.
- Made `next.config.ts` self-contained for alias redirects so config loading does not depend on application path aliases.

## Canonical / alias behavior

- All listing helpers now return canonical guides only.
- Homepage search receives canonical guides only.
- Symptom pages receive canonical guides only.
- Alias codes are projected into the search model, searchable, selectable in the error-code filter, and shown on the canonical result card.
- Canonical sitemap code URLs and brand/appliance pairs exclude alias records.
- The homepage reports `173 error codes covered` rather than claiming 173 separate indexable guides.
- Permanent-redirect comments no longer incorrectly call the redirect a 301.

Current data model:

- 173 code records covered
- 167 canonical indexable guides
- 6 alias records that permanently redirect to canonical guides
- 0 duplicate generated routes

## Consolidated equivalent GE faults

Manufacturer-documented equivalent fault classes were consolidated rather than cosmetically rewritten:

- GE Dehumidifier `E01 / P1`
- GE Range / Oven `F0 / F1 / F6 / F7` — keypanel fault
- GE Range / Oven `F3 / F4` — oven sensor fault
- GE Range / Oven `F8 / FF` — electronic control fault

Each alias still remains searchable and has a permanent redirect to the canonical guide.

## Search payload

`SearchableCode` now includes `aliasCodes` so aliases can be found without shipping duplicate guide objects. The browser still receives only a small search projection, not the full diagnostic records.

## Citation handling

- Previously quarantined citation URLs were removed from runtime `codes.json` and archived in `SOURCE_REVIEW.json`.
- `verify-sources.mjs` no longer considers a grouped source `OK` when it contains only some expected code tokens.
- Partial matches are now `MANUAL REVIEW`.
- `--quarantine` removes failed runtime citations and archives them in `SOURCE_REVIEW.json`; it no longer reintroduces a hidden `sourceNeedsReview` property into application data.

## Data cleanup

- Removed all 173 duplicated boilerplate `partNumberStatus` values from `codes.json`.
- The UI still provides an honest model-number-required fallback when no verified OEM number exists.
- Removed stale `tsconfig.tsbuildinfo` build output from the release package.
- Softened unsupported universal numeric/absolute statements on generic symptom pages.
- Content duplicate audit now compares canonical sibling pages for the same brand and appliance rather than treating cross-brand descriptions of the same mechanical fault as duplicate intent.

## Validation completed in this environment

- `npm run audit:codes` passes with content-roadmap warnings only.
- 173 records parse successfully.
- 0 duplicate routes.
- 0 same-brand/appliance canonical near-duplicate pairs above the configured threshold.
- 22 TS/TSX files pass TypeScript `transpileModule` syntax diagnostics with 0 errors.
- Local import-resolution scan reports 0 unresolved project-local imports.
- A stubbed strict TypeScript pass (used only because npm dependencies cannot be installed in this sandbox) reports no unresolved application identifiers after disabling false implicit-any results caused by the minimal JSX stubs.

## Final external build gate

This sandbox could not finish `npm ci`, so an authoritative Next.js production build still must be run in an environment with npm registry access:

```bash
rm -rf node_modules .next
npm ci
npm run audit:codes
npm run typecheck
npm run build
```

Do not deploy if `npm run typecheck` or `npm run build` fails.

The remaining audit warnings are content-roadmap items (missing manufacturer sources or observable symptom data on some records), not known compile or routing defects. Do not fill those fields with guessed information simply to make the strict audit green.
