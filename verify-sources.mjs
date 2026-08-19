/**
 * Verify manufacturer citations.
 *
 * The first version of this script treated any HTTP 200 as verified. That was
 * wrong in both directions:
 *
 *   - A retired article that 301s into a generic support hub returns 200, so a
 *     dead citation passed. This is exactly how 12 stale LG "error code list"
 *     URLs slipped through.
 *   - Manufacturer sites routinely return 403 or 429 to automated requests.
 *     Those are not evidence the page is fake, so they must not be stripped.
 *
 * It now records the final URL after redirects, flags redirects that land on a
 * generic hub, and checks whether the expected brand and code tokens appear in
 * the response body. Anything it cannot decide is reported as MANUAL REVIEW
 * rather than being auto-failed.
 *
 *   node scripts/verify-sources.mjs                 # report
 *   node scripts/verify-sources.mjs --json out.json # machine-readable
 *   node scripts/verify-sources.mjs --quarantine    # move REDIRECTED/MISSING
 *                                                   # remove bad runtime sourceUrl and archive it
 *
 * Requires network access. MANUAL REVIEW entries are never quarantined.
 */

import fs from 'node:fs';
import path from 'node:path';

const QUARANTINE = process.argv.includes('--quarantine');
const jsonFlag = process.argv.indexOf('--json');
const jsonOut = jsonFlag > -1 ? process.argv[jsonFlag + 1] : null;

const dataPath = path.join(process.cwd(), 'src/data/codes.json');
const codes = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

/** Paths that indicate we landed on a generic hub rather than the article. */
const HUB_PATTERNS = [
    /\/support\/?$/i,
    /\/help-library\/?$/i,
    /\/support\/help-library\/?$/i,
    /\/support\/search/i,
    /\/home\/?$/i,
    /\/us\/?$/i,
];

const UA =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const byUrl = new Map();
for (const item of codes) {
    if (!item.sourceUrl) continue;
    if (!byUrl.has(item.sourceUrl)) byUrl.set(item.sourceUrl, []);
    byUrl.get(item.sourceUrl).push(item);
}

const results = [];

for (const [url, items] of byUrl) {
    const expectedBrand = items[0].brand.toLowerCase();
    const expectedCodes = [...new Set(items.map((i) => i.code.toLowerCase().replace(/\s+/g, '')))];

    const record = {
        url,
        finalUrl: null,
        status: null,
        records: items.map((i) => i.id),
        verdict: 'MANUAL REVIEW',
        notes: [],
    };

    try {
        const response = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': UA } });
        record.status = response.status;
        record.finalUrl = response.url;

        const redirected = new URL(response.url).pathname !== new URL(url).pathname;
        const landedOnHub = HUB_PATTERNS.some((re) => re.test(new URL(response.url).pathname));

        if (response.status === 403 || response.status === 429) {
            record.verdict = 'MANUAL REVIEW';
            record.notes.push('site blocked automated request — open it yourself, this is not evidence of a bad source');
        } else if (!response.ok) {
            record.verdict = 'MISSING';
            record.notes.push(`HTTP ${response.status}`);
        } else if (redirected && landedOnHub) {
            record.verdict = 'REDIRECTED';
            record.notes.push('article retired — redirects to a generic support hub, so it no longer documents these codes');
        } else {
            const body = (await response.text()).toLowerCase();
            const hasBrand = body.includes(expectedBrand);
            const found = expectedCodes.filter((code) => body.replace(/\s+/g, '').includes(code));

            if (!hasBrand) {
                record.verdict = 'MANUAL REVIEW';
                record.notes.push('brand name not found in body — page may be JS-rendered');
            } else if (found.length === 0) {
                record.verdict = 'MANUAL REVIEW';
                record.notes.push(`none of ${expectedCodes.length} expected codes found in body`);
            } else if (found.length < expectedCodes.length) {
                const missing = expectedCodes.filter((code) => !found.includes(code));
                record.verdict = 'MANUAL REVIEW';
                record.notes.push(`${found.length}/${expectedCodes.length} expected codes present`);
                record.notes.push(`missing code tokens: ${missing.join(', ')}`);
                if (redirected) record.notes.push('redirected; destination requires manual confirmation');
            } else {
                record.verdict = 'OK';
                record.notes.push(`${found.length}/${expectedCodes.length} expected codes present`);
                if (redirected) record.notes.push('redirected, but the destination still documents all expected codes');
            }
        }
    } catch (error) {
        record.verdict = 'MANUAL REVIEW';
        record.notes.push(`request failed: ${error.cause?.code ?? error.message}`);
    }

    results.push(record);
}

const order = { MISSING: 0, REDIRECTED: 1, 'MANUAL REVIEW': 2, OK: 3 };
results.sort((a, b) => order[a.verdict] - order[b.verdict]);

for (const r of results) {
    console.log(`${r.verdict.padEnd(14)} ${String(r.status ?? '---').padEnd(4)} ${r.records.length} records`);
    console.log(`  url    ${r.url}`);
    if (r.finalUrl && r.finalUrl !== r.url) console.log(`  final  ${r.finalUrl}`);
    for (const note of r.notes) console.log(`  note   ${note}`);
    console.log(`  codes  ${r.records.join(', ').slice(0, 130)}`);
    console.log('');
}

const tally = results.reduce((acc, r) => ({ ...acc, [r.verdict]: (acc[r.verdict] ?? 0) + 1 }), {});
console.log('───────────────────────────────────────────────');
console.log(Object.entries(tally).map(([k, v]) => `${k}: ${v}`).join('   '));

if (jsonOut) {
    fs.writeFileSync(jsonOut, `${JSON.stringify(results, null, 2)}\n`);
    console.log(`\nWrote ${jsonOut}`);
}

if (QUARANTINE) {
    const bad = new Set(results.filter((r) => r.verdict === 'MISSING' || r.verdict === 'REDIRECTED').map((r) => r.url));
    const reviewPath = path.join(process.cwd(), 'SOURCE_REVIEW.json');
    const archived = fs.existsSync(reviewPath) ? JSON.parse(fs.readFileSync(reviewPath, 'utf8')) : [];
    const seen = new Set(archived.map((entry) => `${entry.id}|||${entry.url}`));
    let moved = 0;
    for (const item of codes) {
        if (item.sourceUrl && bad.has(item.sourceUrl)) {
            const key = `${item.id}|||${item.sourceUrl}`;
            if (!seen.has(key)) {
                archived.push({
                    id: item.id,
                    url: item.sourceUrl,
                    reason: 'Quarantined by verify-sources because the source was missing or redirected to a generic support hub.',
                });
                seen.add(key);
            }
            delete item.sourceUrl;
            delete item.sourceLabel;
            moved += 1;
        }
    }
    fs.writeFileSync(dataPath, `${JSON.stringify(codes, null, 2)}\n`);
    fs.writeFileSync(reviewPath, `${JSON.stringify(archived, null, 2)}\n`);
    console.log(`\nQuarantined ${moved} records — removed bad runtime citations and archived them in SOURCE_REVIEW.json.`);
    console.log('MANUAL REVIEW entries were left untouched by design.');
}

console.log('\nOK means the page exists and contains every expected code token for the records grouped under that URL. It still does not mean the');
console.log('page agrees with your diagnosis. Spot-check a handful by hand.');
