import affiliateConfig from '@/data/affiliate-config.json';
import codesData from '@/data/codes.json';
import { slugify } from '@/lib/slug';

export interface AffiliateLink {
    enabled?: boolean;
    url?: string;
    query?: string;
    campaignId?: string;
    customId?: string;
    toolId?: string;
}

export interface CodeItem {
    id: string;
    brand: string;
    brandSlug?: string;
    appliance: string;
    applianceSlug?: string;
    code: string;
    title: string;
    description: string;
    symptoms?: string[];
    possibleCauses?: string[];
    partName?: string;
    rootCause?: string;
    diagnosticSteps?: string[];
    partNumber?: string;
    partNumberStatus?: string;
    safetyNote?: string;
    partSearchQuery?: string;
    affiliateDisclosure?: string;
    replacementPartRecommended?: boolean;
    sourceUrl?: string;
    sourceLabel?: string;
    updatedAt?: string;
    /** Resolved by scripts/assign-symptoms.mjs — do not hand-edit. */
    symptomSlugs?: string[];
    /** Other codes this record covers, surfaced in the title and on-page. */
    aliasCodes?: string[];
    /** This record duplicates another; its route permanently redirects to the canonical guide. */
    aliasOf?: string;
    affiliateLinks?: {
        ebay?: AffiliateLink;
    };
}

/**
 * Minimal client-safe projection used by the interactive search.
 *
 * `haystack` is the pre-lowercased, pre-joined match text (symptoms, possible
 * causes, part name). Flattening it on the server instead of shipping three
 * structured arrays keeps the payload materially smaller, since none of those
 * fields are ever rendered — they only feed substring matching.
 */
export interface SearchableCode {
    id: string;
    brand: string;
    appliance: string;
    code: string;
    aliasCodes: string[];
    description: string;
    haystack: string;
}

export const codes: CodeItem[] = codesData as CodeItem[];

/** Records that get their own indexable page — aliases redirect instead. */
export const canonicalCodes: CodeItem[] = codes.filter((item) => !item.aliasOf);

export function toSearchableCodes(items: CodeItem[]): SearchableCode[] {
    return items.map((item) => ({
        id: item.id,
        brand: item.brand,
        appliance: item.appliance,
        code: item.code,
        aliasCodes: item.aliasCodes ?? [],
        description: item.description,
        haystack: [
            ...(item.aliasCodes ?? []),
            ...(item.symptoms ?? []),
            ...(item.possibleCauses ?? []),
            item.partName ?? '',
        ]
            .join(' ')
            .toLowerCase(),
    }));
}

export function getRootCause(item: CodeItem): string {
    return item.rootCause || item.description;
}

export function getDiagnosticSteps(item: CodeItem): string[] {
    return item.diagnosticSteps ?? [];
}

export function getPossibleCauses(item: CodeItem): string[] {
    return item.possibleCauses || [];
}

export function getPartName(item: CodeItem): string {
    return item.partName || 'Model-specific component';
}

export function getPartNumber(item: CodeItem): string | undefined {
    return item.partNumber;
}

export function getPartNumberStatus(item: CodeItem): string {
    return (
        item.partNumberStatus ||
        'The exact OEM part number varies by model and production revision. Verify the complete model number before ordering.'
    );
}

export function getSafetyNote(item: CodeItem): string {
    return (
        item.safetyNote ||
        'Disconnect power before opening appliance panels or handling internal components.'
    );
}

export function getEbayAffiliateUrl(item: CodeItem): string {
    const directUrl = item.affiliateLinks?.ebay?.url;
    if (directUrl) return directUrl;

    const query =
        item.partSearchQuery ||
        `${item.brand} ${item.appliance} ${getPartName(item)} ${item.code} replacement part`;
    const ebay = affiliateConfig.ebay;
    const params = new URLSearchParams({
        _nkw: query,
        mkcid: ebay.mkcid,
        mkrid: ebay.mkrid,
        siteid: ebay.siteid,
        campid: ebay.campaignId,
        customid: ebay.customId,
        toolid: ebay.toolId,
        mkevt: ebay.mkevt,
    });

    return `https://www.ebay.com/sch/i.html?${params.toString()}`;
}

export function getBrands(): string[] {
    return Array.from(new Set(canonicalCodes.map((item) => item.brand))).sort((a, b) => a.localeCompare(b));
}

export function getAppliances(): string[] {
    return Array.from(new Set(canonicalCodes.map((item) => item.appliance))).sort((a, b) => a.localeCompare(b));
}

export function findCode(brand: string, appliance: string, code: string): CodeItem | undefined {
    return codes.find(
        (item) =>
            slugify(item.brand) === slugify(brand) &&
            slugify(item.appliance) === slugify(appliance) &&
            slugify(item.code) === slugify(code),
    );
}

export function findBrand(brand: string): string | undefined {
    return getBrands().find((name) => slugify(name) === slugify(brand));
}

export function findAppliance(appliance: string): string | undefined {
    return getAppliances().find((name) => slugify(name) === slugify(appliance));
}

export function codesForBrand(brand: string): CodeItem[] {
    return canonicalCodes.filter((item) => slugify(item.brand) === slugify(brand));
}

export function codesForAppliance(appliance: string): CodeItem[] {
    return canonicalCodes.filter((item) => slugify(item.appliance) === slugify(appliance));
}

export function codesForBrandAppliance(brand: string, appliance: string): CodeItem[] {
    return canonicalCodes.filter(
        (item) =>
            slugify(item.brand) === slugify(brand) &&
            slugify(item.appliance) === slugify(appliance),
    );
}
