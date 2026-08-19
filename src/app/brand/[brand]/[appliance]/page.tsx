import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CodeExplorer from '@/components/CodeExplorer';
import { codesForBrand, codesForBrandAppliance, findBrand, getBrands, toSearchableCodes } from '@/lib/codes';
import { brandApplianceHref, brandHref, slugify } from '@/lib/slug';

interface PageProps {
    params: Promise<{ brand: string; appliance: string }>;
}

export function generateStaticParams() {
    return getBrands().flatMap((brand) => {
        const appliances = Array.from(new Set(codesForBrand(brand).map((item) => item.appliance)));
        return appliances.map((appliance) => ({ brand: slugify(brand), appliance: slugify(appliance) }));
    });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { brand, appliance } = await params;
    const brandName = findBrand(brand);
    if (!brandName) return { title: 'Diagnostic Hub Not Found', robots: { index: false, follow: true } };

    const matchingAppliance = Array.from(new Set(codesForBrand(brandName).map((item) => item.appliance)))
        .find((name) => slugify(name) === slugify(appliance));
    if (!matchingAppliance) return { title: 'Diagnostic Hub Not Found', robots: { index: false, follow: true } };

    const items = codesForBrandAppliance(brandName, matchingAppliance);
    const title = `${brandName} ${matchingAppliance} Error Codes & Troubleshooting`;
    const description = `Browse ${items.length} ${brandName} ${matchingAppliance} error codes with meanings, symptoms, likely causes, diagnostic steps, and replacement part references.`;

    return {
        title,
        description,
        alternates: { canonical: brandApplianceHref(brandName, matchingAppliance) },
        openGraph: { title, description, url: brandApplianceHref(brandName, matchingAppliance), siteName: 'FixCodeDB', type: 'website' },
    };
}

export default async function BrandAppliancePage({ params }: PageProps) {
    const { brand, appliance } = await params;
    const brandName = findBrand(brand);
    if (!brandName) notFound();

    const applianceName = Array.from(new Set(codesForBrand(brandName).map((item) => item.appliance)))
        .find((name) => slugify(name) === slugify(appliance));
    if (!applianceName) notFound();

    const items = codesForBrandAppliance(brandName, applianceName);

    return (
        <main>
            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <nav className="text-xs font-bold text-slate-500" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-emerald-700">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href={brandHref(brandName)} className="hover:text-emerald-700">{brandName}</Link>
                        <span className="mx-2">/</span>
                        {applianceName}
                    </nav>
                    <p className="mt-7 text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Error code library</p>
                    <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">{brandName} {applianceName} error codes</h1>
                    <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                        Search {items.length} diagnostic {items.length === 1 ? 'guide' : 'guides'} for {brandName} {applianceName} faults. Each guide explains what the code means, what to check, and which part may be involved.
                    </p>
                </div>
            </section>

            <section className="bg-slate-50 py-12 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <CodeExplorer items={toSearchableCodes(items)} initialBrand={brandName} initialAppliance={applianceName} />
                </div>
            </section>
        </main>
    );
}
