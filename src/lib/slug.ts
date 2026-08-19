/** Convert display text into a stable, crawlable URL segment. */
export function slugify(value: string): string {
    return value
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/** Canonical detail-page path for a code record. */
export function codeHref(brand: string, appliance: string, code: string): string {
    return `/code/${slugify(brand)}/${slugify(appliance)}/${slugify(code)}`;
}

/** Hub page for a brand, e.g. /brand/lg. */
export function brandHref(brand: string): string {
    return `/brand/${slugify(brand)}`;
}

/** Hub page for an appliance type, e.g. /appliance/washer. */
export function applianceHref(appliance: string): string {
    return `/appliance/${slugify(appliance)}`;
}

/** Hub page for a brand + appliance, e.g. /brand/lg/washer. */
export function brandApplianceHref(brand: string, appliance: string): string {
    return `/brand/${slugify(brand)}/${slugify(appliance)}`;
}

/** Symptom landing page, e.g. /symptom/dishwasher-not-draining. */
export function symptomHref(symptom: string): string {
    return `/symptom/${slugify(symptom)}`;
}
