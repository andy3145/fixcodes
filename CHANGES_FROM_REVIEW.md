# Changes applied from the code review

Everything below is already applied in this build. Run the verification
sequence at the bottom before deploying.

## 1. Client payload cut again: 75 KB → 64 KB

`SearchableCode` shipped `symptoms`, `possibleCauses`, and `partName` as
structured arrays. `CodeExplorer` never rendered any of them — it only joined
them into a match string. They are now pre-joined and lowercased on the server
into a single `haystack` field.

- `src/lib/codes.ts` — `SearchableCode` interface and `toSearchableCodes()`
- `src/components/CodeExplorer.tsx` — index builder reads `item.haystack`

Search behaviour is unchanged. Total reduction from the original build is now
375 KB → 64 KB (82.8%).

## 2. Removed 122 redundant `solutions` arrays

`solutions` and `diagnosticSteps` were byte-identical on 122 of 173 records.
The duplicate copies are deleted. `getDiagnosticSteps()` already falls back to
`solutions`, so the 51 records that legitimately differ still work.

Data file: 413 KB → 375 KB.

## 3. Symptom pages rewritten — the doorway-page risk is resolved

This was the biggest gap. Each of the 10 pages had roughly 60 words of unique
text wrapped around a link grid, and one shared "How to use this page"
paragraph repeated identically across all ten.

`SymptomTopic` now carries real content per topic:

- `intro` — what the fault actually means mechanically
- `freeChecks[]` — 4–5 checks with real detail (hose heights, breaker legs,
  temperature ranges, duct length limits)
- `noCodeGuidance` — what to do when the display shows nothing, which is how
  most people arrive at these pages
- `commonCauses[]` — ordered roughly by frequency across brands
- `stopAndCall` — where the DIY boundary sits for that specific symptom

**Unique prose per symptom page: 360–453 words** (was ~60).

The page component renders all of it, plus BreadcrumbList and TechArticle
schema, a jump-link sidebar, and the filtered code explorer beneath.

Files: `src/lib/symptoms.ts`, `src/app/symptom/[symptom]/page.tsx`

## 4. Audit script rewritten

The old script tested for one hardcoded boilerplate sentence — a check any
rewrite defeats by changing a single word. It reported `AUDIT PASSED` on a
dataset with 16 near-duplicate pairs and 151 thin records.

The new one checks:

- 5-gram Jaccard similarity on `rootCause` (flags pairs ≥ 0.40)
- unique prose word count per record (flags < 150)
- any field string repeating identically on > 20 records
- `solutions` / `diagnosticSteps` duplication
- `sourceUrl` present without `sourceLabel`, non-https sources
- citation concentration (records per distinct URL)
- all records sharing one `updatedAt`
- route collisions and required fields

`npm run audit:codes` reports; `npm run audit:strict` fails the build on
warnings — wire that into CI once the warning count is down.

## 5. Source verification script added

`npm run verify:sources` fetches every distinct `sourceUrl` with a browser
user-agent, reports which resolve, and lists the codes attributed to each.
`--strip` removes `sourceUrl`/`sourceLabel` from records whose URL fails.

**This needs network access — run it on your machine.** Neither sandbox that
touched this project could reach the internet, so no one has verified these
109 citations. They resolve to only 19 distinct URLs, and they are emitted into
structured data as `citation`.

A 200 response only proves the page exists. Open five by hand and confirm each
actually documents the codes attributed to it.

---

## Still outstanding — these need you, not a script

**Zero verified OEM part numbers.** The `partNumber` field is absent on all 173
records. "Model number required" is honest labelling, not a fix. This is still
the highest-value differentiator on the site and the main affiliate lever.
Source them manually, 20 codes at a time, highest-traffic first.

**151 records under 150 words.** See `NEAR_DUPLICATES.md` for the 16 worst
pairs with their overlapping phrases. Worst offender: `ge-dehumidifier-e01` and
`ge-dehumidifier-p1` at 0.81 — effectively the same paragraph with the code
swapped.

**`safetyNote` is identical on 76 records** (two variants covering all 173).
Same problem as the original boilerplate, in a different field.

**`updatedAt` is `2026-08-18` on every record.** Set it per record when you
actually edit that record.

**No images anywhere.** Zero Google Images traffic, and `max-image-preview:
large` is set with nothing to preview.

---

## Verification sequence

```bash
rm -rf node_modules .next
npm ci
npm run audit:codes
npm run verify:sources     # needs network
npm run typecheck
npm run build
```

`next build` is the one that matters — `generateStaticParams` errors on the
`/symptom` route surface only there. Nothing in this project has been compiled
yet by anyone.

---

# Round 2: fixes from the external review

## codesForSymptom no longer guesses at runtime

The reviewer was right, and measurement confirmed it was worse than estimated:
**17 of 122 symptom associations were false positives**, matched only because a
term appeared in passing inside `rootCause` or `diagnosticSteps`.

The worst case was `/symptom/refrigerator-ice-maker-not-working`, where 11 of
21 associated codes were noise — including an LG Control/Display Fault and a
Samsung Family Hub *software* error, pulled in because a diagnostic step
happened to mention water or ice.

Rather than tighten the substring matching, association is now resolved at
authoring time and stored explicitly:

- `src/data/symptom-rules.json` — matching rules, restricted to `title`,
  `description`, `symptoms`, `possibleCauses`, `partName`. `rootCause` and
  `diagnosticSteps` are deliberately excluded. Per-record `include` / `exclude`
  arrays override any automatic decision.
- `scripts/assign-symptoms.mjs` — resolves rules into a `symptomSlugs` array on
  each record. `--dry` previews without writing.
- `src/lib/symptoms.ts` — `codesForSymptom()` is now a set membership test:
  `items.filter((item) => item.symptomSlugs?.includes(topic.slug) ?? false)`.
  The `terms` field is gone from `SymptomTopic` entirely.
- `scripts/audit-codes.mjs` — fails the build on unknown slugs or an empty
  symptom page; warns under 4 codes.

Result: 68 of 173 records associated, 14 legitimately on more than one page,
and every association is now reviewable in the data rather than emergent from
a regex at request time.

Workflow: `npm run symptoms:preview` → adjust rules → `npm run symptoms:assign`.

## On the doorway-page question

The reviewer recommended 350–400 words of unique prose per symptom page. The
current measurement is **354 / 395 / 447** (min / median / max), so that bar is
already met. The junk-match cleanup also improves the ratio directly, since
the link grid on each page is now materially shorter.

Remaining lever if it still reads thin: the `CodeExplorer` block renders
client-side below the prose. It is server-rendered on first paint, so it is
crawlable — but if you want to push the ratio further, cap the initial visible
count on symptom pages specifically.

---

# Round 3: fixes from the second external review

This reviewer actually fetched the manufacturer pages, which neither prior pass
could do. Seven changes applied.

## 1. TechArticle -> Article (their catch, and a fair one)

Both the code detail page and the symptom page emitted `TechArticle`. It is
valid Schema.org, but Google's Article documentation lists `Article`,
`NewsArticle` and `BlogPosting` as the supported types. Now:

```
'@type': 'Article'
mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl }
author: { '@type': 'Organization', name: 'FixCodeDB', url: '.../about' }
publisher: { '@type': 'Organization', ... }
dateModified: item.updatedAt
citation: item.sourceUrl   // only when present
```

## 2. Unsupported numbers removed from symptom prose

This was my error, not the generator's, and it is the most important item here.
I wrote confident universal figures from general knowledge rather than from any
model's specification. Removed or reframed:

- washer standpipe "roughly 30 to 39 inches on most machines"
- "most washers need roughly 20 PSI" and the one-gallon-in-30-seconds test
- dryer duct "around 25 feet, minus roughly 5 feet per 90-degree elbow"
- ice maker "roughly 0 to 5°F"
- oven drift "beyond roughly 25 to 35°F"
- drain timeout "eight to thirteen minutes depending on brand"
- dishwasher sump "an inch or so is normal"
- drum load "about half to two-thirds full"

Each now points at the model's own installation specification while keeping the
qualitative direction, which was the useful part. The heading "Most common
causes, roughly by frequency" claimed an evidence base that does not exist and
is now "Common causes to check".

Prose still measures 352 / 402 / 445 words (min / median / max).

## 3. Twelve LG citations quarantined

The flagged records all sat on LG `*-error-code-list--*` URLs — a coherent
pattern that matches the reviewer's finding of articles retired into the generic
Help Library. Their `sourceUrl` moved to `sourceNeedsReview`, which is never
rendered and never enters structured data. The record keeps the string so the
citation can be replaced rather than silently lost.

Sourced records: 109 -> 97, across 14 distinct URLs.

## 4. verify-sources.mjs rewritten

The old version treated any 200 as verified, so a retired article redirecting to
a support hub passed. It now records the final URL after redirects, flags
hub landings, and checks whether the expected brand and code tokens appear in
the body. Verdicts: `OK` / `REDIRECTED` / `MISSING` / `MANUAL REVIEW`.

403 and 429 are `MANUAL REVIEW`, never failures — manufacturer sites block bots
routinely and that is not evidence of a bad source. `--quarantine` moves only
`MISSING` and `REDIRECTED`; `MANUAL REVIEW` is deliberately untouched.

## 5. Word-count check replaced with a coverage check

The reviewer is right that 150 words is not a Google standard and that padding
a "service required" fault would make the site worse. The audit no longer counts
words. It checks whether each record answers: what it means, what triggered it,
what to check first, what not to replace yet, observable symptoms, when to stop,
and what source supports it.

This is immediately more useful. It surfaced that **84 records have an empty
`symptoms` array** and 68 have no source — actionable gaps that a word count
never would have found.

## 6. Consolidation instead of forced differentiation

Also correct. GE documents E01 and P1 as the same Pump Out condition on
different configurations, so rewording them apart to satisfy a Jaccard score
would be gaming a metric.

New `aliasOf` / `aliasCodes` fields. `ge-dehumidifier-p1` now aliases
`ge-dehumidifier-e01`, whose title covers both. Aliases are excluded from
`generateStaticParams` and the sitemap, and `next.config.ts` emits a permanent
redirect so link equity consolidates. The duplicate warning now suggests this
route explicitly.

The GE oven pairs (F3/F4, F1/F6) are candidates for the same treatment, but
that needs someone to confirm the manufacturer really treats them as one fault.

## 7. Dead `solutions` removed, SearchAction dropped

All 51 remaining `solutions` arrays were unreachable — `getDiagnosticSteps()`
always preferred `diagnosticSteps`, and no record had `solutions` without it.
Removed from the data, the interface, and the getter.

The sitelinks search box was retired in November 2024, so the `SearchAction`
markup was doing nothing. Removed. The `?q=` URL syncing stays — that is real UX.

## Where I think this reviewer overcorrected slightly

They are right that a structured-data manual action does not affect ordinary
web search ranking, and I overstated that. But the reason to fix false citations
was never the ranking risk — it is that a page claiming manufacturer backing it
does not have is the specific failure this site cannot afford, given it is
competing on trust against established repair sites.

## Still open

- 0 verified OEM part numbers across 173 records
- 84 records with no observable symptoms listed
- 68 records with no supporting source
- GE oven consolidation candidates unreviewed
- **No clean production build has run anywhere**
