import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const codes = JSON.parse(fs.readFileSync(path.join(root, 'src/data/codes.json'), 'utf8'));
const config = JSON.parse(fs.readFileSync(path.join(root, 'src/data/affiliate-config.json'), 'utf8'));
const ebay = config.ebay;

const required = {
  mkcid: ebay.mkcid,
  mkrid: ebay.mkrid,
  siteid: ebay.siteid,
  campid: ebay.campaignId,
  customid: ebay.customId,
  toolid: ebay.toolId,
  mkevt: ebay.mkevt,
};

const failures = [];
const warnings = [];
let directUrlCount = 0;
let fallbackEligibleCount = 0;
let suppressedCount = 0;

for (const item of codes) {
  if (item.aliasOf) continue;

  if (item.replacementPartRecommended === false) {
    suppressedCount += 1;
    continue;
  }

  const directUrl = item.affiliateLinks?.ebay?.url;
  if (!directUrl) {
    fallbackEligibleCount += 1;
    continue;
  }

  directUrlCount += 1;

  let url;
  try {
    url = new URL(directUrl);
  } catch {
    failures.push(`${item.id}: invalid eBay affiliate URL`);
    continue;
  }

  if (url.hostname !== 'www.ebay.com' && url.hostname !== 'ebay.com') {
    failures.push(`${item.id}: unexpected affiliate hostname ${url.hostname}`);
  }

  for (const [key, expected] of Object.entries(required)) {
    const actual = url.searchParams.get(key);
    if (actual !== expected) {
      failures.push(`${item.id}: ${key}=${actual ?? '(missing)'}; expected ${expected}`);
    }
  }
}

const source = fs.readFileSync(path.join(root, 'src/lib/codes.ts'), 'utf8');
if (!source.includes("affiliateConfig from '@/data/affiliate-config.json'")) {
  failures.push('src/lib/codes.ts does not import the centralized affiliate config');
}
if (!source.includes('affiliateConfig.ebay')) {
  failures.push('src/lib/codes.ts does not build fallback eBay links from the centralized config');
}

const allUrls = codes
  .map((item) => item.affiliateLinks?.ebay?.url)
  .filter(Boolean);
const campaignIds = new Set(allUrls.map((value) => new URL(value).searchParams.get('campid')));
const customIds = new Set(allUrls.map((value) => new URL(value).searchParams.get('customid')));

if (campaignIds.size > 1) {
  warnings.push(`multiple campaign IDs found in stored URLs: ${[...campaignIds].join(', ')}`);
}
if (customIds.size > 1) {
  warnings.push(`multiple custom IDs found in stored URLs: ${[...customIds].join(', ')}`);
}

console.log('FixCodeDB eBay affiliate audit');
console.log('--------------------------------');
console.log(`Campaign ID: ${ebay.campaignId}`);
console.log(`Custom ID:   ${ebay.customId}`);
console.log(`Tool ID:     ${ebay.toolId}`);
console.log(`Stored affiliate URLs checked: ${directUrlCount}`);
console.log(`Canonical guides using fallback generator: ${fallbackEligibleCount}`);
console.log(`Canonical guides intentionally suppressing part CTA: ${suppressedCount}`);

if (warnings.length) {
  console.log('\nWarnings:');
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (failures.length) {
  console.error('\nAFFILIATE AUDIT FAILED');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('\nAFFILIATE AUDIT PASSED');
