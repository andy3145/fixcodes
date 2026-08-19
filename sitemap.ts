import type { MetadataRoute } from 'next';
import {
    canonicalCodes,
    codesForAppliance,
    codesForBrand,
    codesForBrandAppliance,
    getAppliances,
    getBrands,
} from '@/lib/codes';
import { symptoms } from '@/lib/symptoms';
import {
    applianceHref,
    brandApplianceHref,
    brandHref,
    codeHref,
    symptomHref,
} from '@/lib/slug';

const BASE_URL = 'https://www.fixcodedb.com';
const SITE_UPDATED = '2026-08-18';

function latestUpdated(items: { updatedAt?: string }[]): string {
    return items
        .map((item) => item.updatedAt)
        .filter((value): value is string => Boolean(value))
        .sort()
        .at(-1) || SITE_UPDATED;
}

export default function sitemap(): MetadataRoute.Sitemap {
    const codeUrls: MetadataRoute.Sitemap = canonicalCodes.map((item) => ({
        url: `${BASE_URL}${codeHref(item.brand, item.appliance, item.code)}`,
        lastModified: item.updatedAt || SITE_UPDATED,
    }));

    const brandUrls: MetadataRoute.Sitemap = getBrands().map((brand) => ({
        url: `${BASE_URL}${brandHref(brand)}`,
        lastModified: latestUpdated(codesForBrand(brand)),
    }));

    const applianceUrls: MetadataRoute.Sitemap = getAppliances().map((appliance) => ({
        url: `${BASE_URL}${applianceHref(appliance)}`,
        lastModified: latestUpdated(codesForAppliance(appliance)),
    }));

    const brandAppliancePairs = Array.from(
        new Set(canonicalCodes.map((item) => `${item.brand}|||${item.appliance}`)),
    );

    const brandApplianceUrls: MetadataRoute.Sitemap = brandAppliancePairs.map((pair) => {
        const [brand, appliance] = pair.split('|||');
        return {
            url: `${BASE_URL}${brandApplianceHref(brand, appliance)}`,
            lastModified: latestUpdated(codesForBrandAppliance(brand, appliance)),
        };
    });

    const symptomUrls: MetadataRoute.Sitemap = symptoms.map((symptom) => ({
        url: `${BASE_URL}${symptomHref(symptom.slug)}`,
        lastModified: SITE_UPDATED,
    }));

    return [
        { url: BASE_URL, lastModified: SITE_UPDATED },
        { url: `${BASE_URL}/about`, lastModified: SITE_UPDATED },
        { url: `${BASE_URL}/model-number`, lastModified: SITE_UPDATED },
        { url: `${BASE_URL}/safety`, lastModified: SITE_UPDATED },
        { url: `${BASE_URL}/privacy`, lastModified: SITE_UPDATED },
        ...brandUrls,
        ...applianceUrls,
        ...brandApplianceUrls,
        ...symptomUrls,
        ...codeUrls,
    ];
}
