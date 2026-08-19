import type { NextConfig } from 'next';
import codesData from './src/data/codes.json';

interface RedirectCode {
    id: string;
    brand: string;
    appliance: string;
    code: string;
    aliasOf?: string;
}

function slugify(value: string): string {
    return value
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function codeHref(item: RedirectCode): string {
    return `/code/${slugify(item.brand)}/${slugify(item.appliance)}/${slugify(item.code)}`;
}

const redirectCodes = codesData as RedirectCode[];

const nextConfig: NextConfig = {
    reactStrictMode: true,
    async redirects() {
        const byId = new Map(redirectCodes.map((item) => [item.id, item]));

        return redirectCodes
            .filter((item) => item.aliasOf)
            .flatMap((item) => {
                const target = item.aliasOf ? byId.get(item.aliasOf) : undefined;
                if (!target) return [];

                return [{
                    source: codeHref(item),
                    destination: codeHref(target),
                    permanent: true,
                }];
            });
    },
};

export default nextConfig;
