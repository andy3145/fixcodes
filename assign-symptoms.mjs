/**
 * Resolve symptom associations into explicit data.
 *
 * Previously `codesForSymptom()` guessed at runtime by substring-matching broad
 * terms against every text field on a record, including `rootCause` and
 * `diagnosticSteps`. A step that reads "check this is not a drain restriction"
 * pulled that code onto the "not draining" page. On the ice maker page, 11 of
 * 21 associations were noise of exactly that kind.
 *
 * This script writes a resolved `symptomSlugs` array onto each record so the
 * runtime does no matching at all. Rules live in src/data/symptom-rules.json
 * and only ever run here, at authoring time, where the output can be reviewed.
 *
 *   node scripts/assign-symptoms.mjs --dry    # preview, write nothing
 *   node scripts/assign-symptoms.mjs          # apply to codes.json
 */

import fs from 'node:fs';
import path from 'node:path';

const DRY = process.argv.includes('--dry');
const root = process.cwd();
const codesPath = path.join(root, 'src/data/codes.json');
const rulesPath = path.join(root, 'src/data/symptom-rules.json');

const codes = JSON.parse(fs.readFileSync(codesPath, 'utf8'));
const config = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));

const matchText = (item) =>
    config.matchFields
        .map((field) => {
            const value = item[field];
            if (Array.isArray(value)) return value.join(' ');
            return typeof value === 'string' ? value : '';
        })
        .join(' ')
        .toLowerCase();

const assignments = new Map(codes.map((item) => [item.id, new Set()]));
const report = [];

for (const rule of config.rules) {
    const matched = [];

    for (const item of codes) {
        if (rule.exclude?.includes(item.id)) continue;

        const forced = rule.include?.includes(item.id);
        if (!forced) {
            if (rule.appliance && item.appliance !== rule.appliance) continue;
            const haystack = matchText(item);
            if (!rule.terms.some((term) => haystack.includes(term.toLowerCase()))) continue;
        }

        assignments.get(item.id).add(rule.slug);
        matched.push(item);
    }

    report.push({ slug: rule.slug, matched });
}

console.log('Symptom association resolution');
console.log('───────────────────────────────────────────────');

for (const entry of report) {
    const flag = entry.matched.length < 4 ? '  <-- THIN, widen terms or add includes' : '';
    console.log(`${entry.slug.padEnd(36)} ${String(entry.matched.length).padStart(3)} codes${flag}`);
}

const assigned = [...assignments.values()].filter((set) => set.size > 0).length;
console.log('');
console.log(`${assigned} of ${codes.length} records are associated with at least one symptom page`);

const orphanBySlug = report.filter((entry) => entry.matched.length === 0).map((entry) => entry.slug);
if (orphanBySlug.length) {
    console.log(`EMPTY symptom pages: ${orphanBySlug.join(', ')}`);
}

if (DRY) {
    console.log('\nDry run — nothing written. Re-run without --dry to apply.');
    for (const entry of report) {
        console.log(`\n${entry.slug}:`);
        for (const item of entry.matched) {
            console.log(`  ${item.id}  (${item.brand} ${item.code}) ${item.title.slice(0, 62)}`);
        }
    }
    process.exit(0);
}

for (const item of codes) {
    const slugs = [...assignments.get(item.id)].sort();
    if (slugs.length) item.symptomSlugs = slugs;
    else delete item.symptomSlugs;
}

fs.writeFileSync(codesPath, `${JSON.stringify(codes, null, 2)}\n`);
console.log(`\nWrote symptomSlugs to ${codesPath}`);
console.log('Review the associations, then adjust include/exclude in symptom-rules.json and re-run.');
