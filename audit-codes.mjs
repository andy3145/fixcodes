/**
 * FixCodeDB content audit.
 *
 * Checks structural integrity (routes, required fields) AND the content-quality
 * signals that actually matter for search: near-duplicate prose, thin records,
 * and boilerplate that has spread across the dataset.
 *
 * The previous version tested for one hardcoded boilerplate sentence, which any
 * rewrite defeats trivially. These checks are phrase-level instead.
 *
 *   node scripts/audit-codes.mjs            # fail on errors only
 *   node scripts/audit-codes.mjs --strict   # fail on warnings too
 */

import fs from 'node:fs';
import path from 'node:path';

const STRICT = process.argv.includes('--strict');
const root = process.cwd();
const codes = JSON.parse(fs.readFileSync(path.join(root, 'src/data/codes.json'), 'utf8'));
const canonicalCodes = codes.filter((item) => !item.aliasOf);

/* --------------------------------------------------------------- thresholds */

const DUPE_JACCARD = 0.4; // 5-gram overlap above this clusters in search
const SHINGLE_N = 5;
const MAX_FIELD_REPEATS = 20; // same string reused across more than N records

/* ------------------------------------------------------------------ helpers */

const slugify = (value) =>
    value
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const shingles = (text, n = SHINGLE_N) => {
    const words = (text || '').toLowerCase().split(/\s+/).filter(Boolean);
    const out = new Set();
    for (let i = 0; i + n <= words.length; i += 1) out.add(words.slice(i, i + n).join(' '));
    return out;
};

const jaccard = (a, b) => {
    if (!a.size || !b.size) return 0;
    let inter = 0;
    for (const item of a) if (b.has(item)) inter += 1;
    return inter / (a.size + b.size - inter);
};

const proseOf = (item) =>
    [
        item.description,
        item.rootCause,
        ...(item.symptoms ?? []),
        ...(item.possibleCauses ?? []),
        ...(item.diagnosticSteps ?? []),
    ]
        .filter(Boolean)
        .join(' ');

const errors = [];
const warnings = [];
const notes = [];

/* ----------------------------------------------------- structural integrity */

const routes = new Map();

for (const item of codes) {
    const id = item.id || '(missing id)';

    for (const field of ['id', 'brand', 'appliance', 'code', 'title', 'description', 'rootCause']) {
        if (!item[field]) errors.push(`${id}: missing required field "${field}"`);
    }

    const route = `/code/${slugify(item.brand || '')}/${slugify(item.appliance || '')}/${slugify(item.code || '')}`;
    if (routes.has(route)) {
        errors.push(`duplicate route ${route} — ${routes.get(route)} collides with ${id}`);
    }
    routes.set(route, id);

    if (
        item.solutions &&
        item.diagnosticSteps &&
        JSON.stringify(item.solutions) === JSON.stringify(item.diagnosticSteps)
    ) {
        warnings.push(`${id}: "solutions" duplicates "diagnosticSteps" — drop one`);
    }

    if (!Array.isArray(item.diagnosticSteps) || item.diagnosticSteps.length < 2) {
        warnings.push(`${id}: fewer than 2 diagnostic steps`);
    }

    if (item.sourceUrl && !/^https:\/\//.test(item.sourceUrl)) {
        errors.push(`${id}: sourceUrl is not https — ${item.sourceUrl}`);
    }

    if (item.sourceUrl && !item.sourceLabel) {
        warnings.push(`${id}: sourceUrl present without sourceLabel`);
    }
}

/* ---------------------------------------------------------------- coverage */

/**
 * Word count is not the standard — Google publishes no minimum and warns
 * against writing toward one. A three-line "service required" fault can be a
 * complete answer. What matters is whether the page answers the questions a
 * person arrives with, so this checks coverage rather than length.
 */
const COVERAGE = [
    ['what it means', (item) => Boolean(item.description)],
    ['what triggered it', (item) => Boolean(item.rootCause)],
    ['what to check first', (item) => (item.diagnosticSteps ?? []).length >= 2],
    ['what not to replace yet', (item) => (item.possibleCauses ?? []).length >= 2],
    ['observable symptoms', (item) => (item.symptoms ?? []).length >= 1],
    ['when to stop', (item) => Boolean(item.safetyNote)],
    ['supporting source', (item) => Boolean(item.sourceUrl)],
];

const incomplete = [];
for (const item of canonicalCodes) {
    const missing = COVERAGE.filter(([, test]) => !test(item)).map(([label]) => label);
    if (missing.length) incomplete.push({ id: item.id, missing });
}

for (const entry of incomplete) {
    warnings.push(`${entry.id}: missing ${entry.missing.join(', ')}`);
}

/* ------------------------------------------------ near-duplicate detection */

// Compare only canonical sibling pages for the same brand and appliance.
// Cross-brand overlap is expected for common mechanical faults and is not, by
// itself, evidence that two pages compete for the same search intent.

const indexed = canonicalCodes.map((item) => ({
    id: item.id,
    brand: item.brand,
    appliance: item.appliance,
    set: shingles(item.rootCause),
}));
const dupePairs = [];

for (let i = 0; i < indexed.length; i += 1) {
    for (let j = i + 1; j < indexed.length; j += 1) {
        if (indexed[i].brand !== indexed[j].brand || indexed[i].appliance !== indexed[j].appliance) continue;
        const score = jaccard(indexed[i].set, indexed[j].set);
        if (score >= DUPE_JACCARD) dupePairs.push({ score, a: indexed[i].id, b: indexed[j].id });
    }
}

dupePairs.sort((x, y) => y.score - x.score);
for (const pair of dupePairs) {
    warnings.push(
        `near-duplicate rootCause ${pair.score.toFixed(2)}: ${pair.a} ~ ${pair.b} — if the manufacturer documents these as the same condition, consolidate with aliasOf rather than rewording them apart`,
    );
}

/* ------------------------------------ boilerplate spreading across records */

// Safety disclaimers are intentionally standardized; repetition there is a feature, not thin-content evidence.
for (const field of ['rootCause', 'partNumberStatus', 'partName']) {
    const tally = new Map();
    for (const item of codes) {
        const value = item[field];
        if (typeof value !== 'string' || !value) continue;
        tally.set(value, (tally.get(value) ?? 0) + 1);
    }
    for (const [value, count] of tally) {
        if (count > MAX_FIELD_REPEATS) {
            warnings.push(`"${field}" is identical on ${count} records: "${value.slice(0, 70)}…"`);
        }
    }
}

/* -------------------------------------------------------------- updatedAt */

const dates = new Set(codes.map((item) => item.updatedAt).filter(Boolean));
if (dates.size === 1 && codes.length > 20) {
    notes.push(
        `all records share updatedAt ${[...dates][0]} — accurate if they were genuinely authored together, but only bump it on real edits from here, and drop lastmod entirely rather than let it drift`,
    );
}

/* ------------------------------------------------- symptom associations */

const rulesPath = path.join(root, 'src/data/symptom-rules.json');
if (fs.existsSync(rulesPath)) {
    const { rules } = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
    const knownSlugs = new Set(rules.map((rule) => rule.slug));
    const perSlug = new Map(rules.map((rule) => [rule.slug, 0]));

    for (const item of codes) {
        for (const slug of item.symptomSlugs ?? []) {
            if (!knownSlugs.has(slug)) {
                errors.push(`${item.id}: symptomSlugs references unknown slug "${slug}"`);
                continue;
            }
            perSlug.set(slug, perSlug.get(slug) + 1);
        }
    }

    for (const [slug, count] of perSlug) {
        if (count === 0) errors.push(`symptom page /symptom/${slug} has no associated codes`);
        else if (count < 4) warnings.push(`symptom page /symptom/${slug} has only ${count} codes — widen terms or add includes`);
    }
}

/* -------------------------------------------------------------- citations */

const aliased = codes.filter((item) => item.aliasOf);
if (aliased.length) {
    notes.push(`${aliased.length} record(s) consolidated via aliasOf — routes permanently redirect to the canonical guide and are excluded from the sitemap`);
}

const sourced = canonicalCodes.filter((item) => item.sourceUrl);
const distinctSources = new Set(sourced.map((item) => item.sourceUrl));
if (sourced.length > 0) {
    const ratio = sourced.length / distinctSources.size;
    if (ratio > 6) {
        warnings.push(
            `${sourced.length} records cite only ${distinctSources.size} distinct URLs (${ratio.toFixed(1)} per URL) — confirm each page documents the codes attributed to it`,
        );
    }
}

/* ---------------------------------------------------------------- payload */

const fullBytes = Buffer.byteLength(JSON.stringify(codes));
const projection = canonicalCodes.map((item) => ({
    id: item.id,
    brand: item.brand,
    appliance: item.appliance,
    code: item.code,
    aliasCodes: item.aliasCodes ?? [],
    description: item.description,
    haystack: [...(item.aliasCodes ?? []), ...(item.symptoms ?? []), ...(item.possibleCauses ?? []), item.partName ?? '']
        .join(' ')
        .toLowerCase(),
}));
const projectionBytes = Buffer.byteLength(JSON.stringify(projection));

/* ----------------------------------------------------------------- report */

const brands = new Set(codes.map((item) => item.brand));
const appliances = new Set(codes.map((item) => item.appliance));
const sortedWords = canonicalCodes
    .map((item) => proseOf(item).split(/\s+/).filter(Boolean).length)
    .sort((a, b) => a - b);
const medianWords = sortedWords[Math.floor(sortedWords.length / 2)];

console.log('FixCodeDB content audit');
console.log('───────────────────────────────────────────────');
console.log(`records                 ${codes.length}`);
console.log(`unique routes           ${routes.size}`);
console.log(`brands                  ${brands.size}`);
console.log(`appliance types         ${appliances.size}`);
console.log(`median prose words      ${medianWords}  (reference only — not a target)`);
console.log(`incomplete coverage     ${incomplete.length}`);
console.log(`near-duplicate pairs    ${dupePairs.length}`);
console.log(`records with sourceUrl  ${sourced.length} across ${distinctSources.size} URLs`);
console.log(`canonical / alias       ${codes.length - aliased.length} / ${aliased.length}`);
console.log(`full data               ${(fullBytes / 1024).toFixed(0)} KB`);
console.log(
    `client projection       ${(projectionBytes / 1024).toFixed(0)} KB (${(100 - (projectionBytes / fullBytes) * 100).toFixed(1)}% smaller)`,
);
console.log('');

if (notes.length) {
    console.log(`NOTES (${notes.length})`);
    for (const message of notes) console.log(`  - ${message}`);
    console.log('');
}

if (errors.length) {
    console.log(`ERRORS (${errors.length})`);
    for (const message of errors) console.log(`  x ${message}`);
    console.log('');
}

if (warnings.length) {
    console.log(`WARNINGS (${warnings.length})`);
    for (const message of warnings) console.log(`  ! ${message}`);
    console.log('');
}

if (errors.length > 0) {
    console.log('AUDIT FAILED');
    process.exit(1);
}

if (STRICT && warnings.length > 0) {
    console.log('AUDIT FAILED (strict mode — warnings treated as errors)');
    process.exit(1);
}

console.log(warnings.length ? 'AUDIT PASSED WITH WARNINGS' : 'AUDIT PASSED');
