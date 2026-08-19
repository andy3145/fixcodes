import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CodeExplorer from '@/components/CodeExplorer';
import { codesForAppliance, findAppliance, getAppliances, toSearchableCodes } from '@/lib/codes';
import { applianceHref, brandApplianceHref, slugify } from '@/lib/slug';

interface PageProps {
    params: Promise<{ appliance: string }>;
}

export function generateStaticParams() {
    return getAppliances().map((appliance) => ({ appliance: slugify(appliance) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { appliance } = await params;
    const applianceName = findAppliance(appliance);
    if (!applianceName) return { title: 'Appliance Not Found', robots: { index: false, follow: true } };

    const items = codesForAppliance(applianceName);
    const title = `${applianceName} Error Codes: Meanings, Causes & Fixes`;
    const description = `Search ${items.length} ${applianceName} error code guides across major brands. Find meanings, symptoms, likely causes, diagnostic steps, and replacement part references.`;

    return {
        title,
        description,
        alternates: { canonical: applianceHref(applianceName) },
        openGraph: { title, description, url: applianceHref(applianceName), siteName: 'FixCodeDB', type: 'website' },
    };
}

export default async function AppliancePage({ params }: PageProps) {
    const { appliance } = await params;
    const applianceName = findAppliance(appliance);
    if (!applianceName) notFound();

    const items = codesForAppliance(applianceName);
    const brands = Array.from(new Set(items.map((item) => item.brand))).sort((a, b) => a.localeCompare(b));

    return (
        <main>
            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <nav className="text-xs font-bold text-slate-500" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-emerald-700">Home</Link> <span className="mx-2">/</span> {applianceName}
                    </nav>
                    <p className="mt-7 text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Appliance diagnostic hub</p>
                    <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">{applianceName} error codes</h1>
                    <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                        Search {items.length} {applianceName} diagnostic guides across {brands.length} {brands.length === 1 ? 'brand' : 'brands'}, or choose a manufacturer to narrow the database.
                    </p>
                </div>
            </section>

            <section className="border-b border-slate-200 bg-slate-50 py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Brands with {applianceName} guides</h2>
                    <div className="mt-4 flex flex-wrap gap-2.5">
                        {brands.map((brand) => {
                            const count = items.filter((item) => item.brand === brand).length;
                            return (
                                <Link
                                    key={brand}
                                    href={brandApplianceHref(brand, applianceName)}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-800"
                                >
                                    {brand} <span className="ml-1 text-xs text-slate-400">{count}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-white py-12 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <CodeExplorer items={toSearchableCodes(items)} initialAppliance={applianceName} />
                </div>
            </section>
        </main>
    );
}
