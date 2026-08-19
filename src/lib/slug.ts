/**
 * URL helpers.
 *
 * The previous `.toLowerCase()` approach produced broken paths for any value
 * containing a space or slash, e.g.:
 *
 *   "Oven / Range" -> /code/ge/oven / range/f30   (extra path segment!)
 *   "3 Flashes"    -> /code/trane/furnace/3 flashes
 *
 * `slugify` normalises those into safe, stable, crawlable segments.
 */
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

/** Hub page for a brand, e.g. /brand/lg */
export function brandHref(brand: string): string {
    return `/brand/${slugify(brand)}`;
}

/** Hub page for a brand + appliance, e.g. /brand/lg/washer */
export function brandApplianceHref(brand: string, appliance: string): string {
    return `/brand/${slugify(brand)}/${slugify(appliance)}`;
}
