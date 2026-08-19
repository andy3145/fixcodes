import codesData from '@/data/codes.json';

export default async function sitemap() {
    const baseUrl = 'https://www.fixcodedb.com';

    // Automatically generate a URL for every single error code in your database
    const codeUrls = codesData.map((item: any) => ({
        url: `${baseUrl}/code/${item.brand.toLowerCase()}/${item.appliance.toLowerCase()}/${item.code.toLowerCase()}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
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
