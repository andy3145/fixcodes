import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CodeExplorer from '@/components/CodeExplorer';
import { codesForBrand, findBrand, getBrands, toSearchableCodes } from '@/lib/codes';
import { brandApplianceHref, brandHref, slugify } from '@/lib/slug';

interface PageProps {
    params: Promise<{ brand: string }>;
}

export function generateStaticParams() {
    return getBrands().map((brand) => ({ brand: slugify(brand) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { brand } = await params;
    const brandName = findBrand(brand);
    if (!brandName) return { title: 'Brand Not Found', robots: { index: false, follow: true } };

    const itemCount = codesForBrand(brandName).length;
    const title = `${brandName} Appliance Error Codes & Repair Guides`;
    const description = `Browse ${itemCount} ${brandName} appliance error code guides with meanings, likely causes, symptoms, diagnostic steps, safety guidance, and replacement part references.`;

    return {
        title,
        description,
        alternates: { canonical: brandHref(brandName) },
        openGraph: { title, description, url: brandHref(brandName), siteName: 'FixCodeDB', type: 'website' },
    };
}

export default async function BrandPage({ params }: PageProps) {
    const { brand } = await params;
    const brandName = findBrand(brand);
    if (!brandName) notFound();

    const items = codesForBrand(brandName);
    const appliances = Array.from(new Set(items.map((item) => item.appliance))).sort((a, b) => a.localeCompare(b));

    return (
        <main>
            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <nav className="text-xs font-bold text-slate-500" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-emerald-700">Home</Link> <span className="mx-2">/</span> {brandName}
                    </nav>
                    <p className="mt-7 text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Brand diagnostic hub</p>
                    <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">{brandName} appliance error codes</h1>
                    <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                        Search {items.length} {brandName} diagnostic guides across {appliances.length} {appliances.length === 1 ? 'appliance type' : 'appliance types'}. Start with the appliance category or search the code or symptom directly.
                    </p>
                </div>
            </section>

            <section className="border-b border-slate-200 bg-slate-50 py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">{brandName} appliance categories</h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {appliances.map((appliance) => {
                            const count = items.filter((item) => item.appliance === appliance).length;
                            return (
                                <Link
                                    key={appliance}
                                    href={brandApplianceHref(brandName, appliance)}
                                    className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                                >
                                    <div>
                                        <p className="font-black text-slate-950 group-hover:text-emerald-800">{brandName} {appliance}</p>
                                        <p className="mt-1 text-xs font-semibold text-slate-500">{count} {count === 1 ? 'guide' : 'guides'}</p>
                                    </div>
                                    <span className="text-slate-400 group-hover:text-emerald-700">→</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-white py-12 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <CodeExplorer items={toSearchableCodes(items)} initialBrand={brandName} />
                </div>
            </section>
        </main>
    );
}
