import codesData from '@/data/codes.json';
import { MetadataRoute } from 'next';

interface CodeItem {
    brand: string;
    appliance: string;
    code: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.fixcodedb.com';
    const items = codesData as unknown as CodeItem[];

    const codeUrls = items.map((item) => ({
        url: `${baseUrl}/code/${item.brand.toLowerCase()}/${item.appliance.toLowerCase()}/${item.code.toLowerCase()}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/safety`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        ...codeUrls,
    ];
}
