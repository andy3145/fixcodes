import type { Metadata } from 'next';
import Link from 'next/link';
import CodeExplorer from '@/components/CodeExplorer';
import { canonicalCodes, codes, getAppliances, getBrands, toSearchableCodes } from '@/lib/codes';
import { applianceHref, brandHref, codeHref, symptomHref } from '@/lib/slug';
import { symptoms } from '@/lib/symptoms';

export const metadata: Metadata = {
    title: 'Appliance Error Code Diagnostics & Repair Guides',
    description:
        'Search appliance error codes instantly. Find likely causes, symptoms, diagnostic steps, safety guidance, model-fit notes, and replacement parts for major appliance brands.',
    alternates: { canonical: '/' },
};

function countByBrand(brand: string): number {
    return canonicalCodes.filter((item) => item.brand === brand).length;
}

function countByAppliance(appliance: string): number {
    return canonicalCodes.filter((item) => item.appliance === appliance).length;
}

interface HomeProps {
    searchParams: Promise<{ q?: string | string[] }>;
}

export default async function Home({ searchParams }: HomeProps) {
    const params = await searchParams;
    const initialQuery = typeof params.q === 'string' ? params.q : '';
    const brands = getBrands();
    const appliances = getAppliances();
    const popularGuides = canonicalCodes.slice(0, 6);

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'FixCodeDB',
        url: 'https://www.fixcodedb.com',
        description:
            'Appliance error code diagnostics, troubleshooting guidance, and replacement part references.',
        publisher: {
            '@type': 'Organization',
            name: 'FixCodeDB',
            url: 'https://www.fixcodedb.com',
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />

            <section className="relative overflow-hidden border-b border-slate-200 bg-white">
                <div aria-hidden="true" className="soft-grid absolute inset-0 opacity-70" />
                <div aria-hidden="true" className="absolute left-1/2 top-[-240px] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-emerald-100/65 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-3.5 py-1.5 text-xs font-extrabold text-emerald-800 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Appliance diagnostics, without the guesswork
                        </div>

                        <h1 className="mt-6 text-balance text-4xl font-black tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl">
                            Your search engine for
                            <span className="block text-emerald-600">appliance problems.</span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                            Decode an error, understand what triggered it, work through the safest checks first, and find the right repair path—all in one place.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-600 sm:text-sm">
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                                {codes.length.toLocaleString()} error codes covered
                            </span>
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                                {brands.length} brands
                            </span>
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                                {appliances.length} appliance types
                            </span>
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                                Model-aware part guidance
                            </span>
                        </div>
                    </div>

                    <div className="mx-auto mt-10 max-w-5xl">
                        <CodeExplorer items={toSearchableCodes(canonicalCodes)} compact initialQuery={initialQuery} syncQueryToUrl />
                    </div>
                </div>
            </section>

            <main>
                <section className="border-b border-slate-200 bg-slate-50 py-14 sm:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-4 md:grid-cols-3">
                            <FeatureCard
                                number="01"
                                title="Identify the fault"
                                text="Search the exact code, brand, appliance, symptom, or component to reach the most relevant guide quickly."
                            />
                            <FeatureCard
                                number="02"
                                title="Troubleshoot in order"
                                text="Start with likely causes and practical diagnostic checks before jumping straight to an expensive replacement part."
                            />
                            <FeatureCard
                                number="03"
                                title="Verify before buying"
                                text="Use the full model number when a part varies by model so you can reduce wrong-part purchases and wasted repair time."
                            />
                        </div>
                    </div>
                </section>

                <section id="common-problems" className="scroll-mt-24 bg-white py-16 sm:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <SectionHeading
                            eyebrow="Don't have an error code?"
                            title="Start with the symptom"
                            description="Most people know what the appliance is doing wrong before they know the code. These symptom hubs connect common problems to the most relevant diagnostic guides."
                        />
                        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                            {symptoms.map((symptom) => (
                                <Link
                                    key={symptom.slug}
                                    href={symptomHref(symptom.slug)}
                                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-md"
                                >
                                    <span className="text-xs font-black uppercase tracking-[0.12em] text-emerald-700">Troubleshoot</span>
                                    <h3 className="mt-2 font-black leading-6 text-slate-950 group-hover:text-emerald-800">{symptom.shortTitle}</h3>
                                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500">{symptom.description}</p>
                                    <p className="mt-4 text-xs font-black text-emerald-700">See likely codes →</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="browse-appliances" className="scroll-mt-24 border-t border-slate-200 bg-white py-16 sm:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <SectionHeading
                            eyebrow="Browse by appliance"
                            title="Start with what is broken"
                            description="Dedicated appliance hubs make it easy to scan codes across brands and move into the right diagnostic guide."
                        />

                        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {appliances.map((appliance) => (
                                <Link
                                    key={appliance}
                                    href={applianceHref(appliance)}
                                    className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/55 hover:shadow-md"
                                >
                                    <div>
                                        <p className="font-black text-slate-950 group-hover:text-emerald-800">{appliance}</p>
                                        <p className="mt-1 text-xs font-semibold text-slate-500">
                                            {countByAppliance(appliance)} {countByAppliance(appliance) === 1 ? 'guide' : 'guides'}
                                        </p>
                                    </div>
                                    <span className="text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-700" aria-hidden="true">→</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="browse-brands" className="scroll-mt-24 border-y border-slate-200 bg-slate-50 py-16 sm:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <SectionHeading
                            eyebrow="Browse by brand"
                            title="Go straight to your manufacturer"
                            description="Each brand hub groups its supported appliances and error codes into a crawlable, easy-to-navigate reference library."
                        />

                        <div className="mt-8 flex flex-wrap gap-2.5">
                            {brands.map((brand) => (
                                <Link
                                    key={brand}
                                    href={brandHref(brand)}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-800 hover:shadow-md"
                                >
                                    {brand}
                                    <span className="ml-2 text-xs font-semibold text-slate-400">{countByBrand(brand)}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-white py-16 sm:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-xl lg:grid-cols-[1.1fr_0.9fr]">
                            <div className="p-7 sm:p-10 lg:p-12">
                                <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-400">Before ordering a part</p>
                                <h2 className="mt-3 max-w-xl text-3xl font-black tracking-[-0.035em] text-white sm:text-4xl">
                                    The model number is the difference between “looks right” and “fits right.”
                                </h2>
                                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                                    Many appliance components change across production runs. Find the complete model number first, then use the exact fit information in the guide or seller listing.
                                </p>
                                <Link
                                    href="/model-number"
                                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-emerald-400"
                                >
                                    Find my model number <span aria-hidden="true">→</span>
                                </Link>
                            </div>
                            <div className="soft-grid flex min-h-64 items-center justify-center border-t border-slate-800 bg-slate-900 p-8 lg:border-l lg:border-t-0">
                                <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-950/80 p-5 shadow-2xl">
                                    <p className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Example appliance label</p>
                                    <div className="mt-4 space-y-3 font-mono text-sm">
                                        <LabelRow label="MODEL" value="WM4000HWA" />
                                        <LabelRow label="SERIAL" value="••••••••••" />
                                        <LabelRow label="TYPE" value="Washer" />
                                    </div>
                                    <div className="mt-5 rounded-xl border border-emerald-800 bg-emerald-950/50 p-3 text-xs leading-5 text-emerald-300">
                                        Use the complete model value, including letters and suffixes when shown.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-t border-slate-200 bg-slate-50 py-16 sm:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <SectionHeading
                            eyebrow="Popular starting points"
                            title="Jump into the diagnostic library"
                            description="Every guide links into related codes and category hubs so you can keep narrowing the problem without returning to search."
                        />
                        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {popularGuides.map((item) => (
                                <Link
                                    key={item.id}
                                    href={codeHref(item.brand, item.appliance, item.code)}
                                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-700">{item.brand}</span>
                                        <span className="text-xs font-bold text-slate-400">{item.appliance}</span>
                                    </div>
                                    <h3 className="mt-4 text-xl font-black text-slate-950 group-hover:text-emerald-700">Code {item.code}</h3>
                                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{item.description}</p>
                                    <p className="mt-4 text-xs font-black text-emerald-700">Open diagnostic guide →</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

function FeatureCard({ number, title, text }: { number: string; title: string; text: string }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-xs font-black tracking-widest text-emerald-700">{number}</span>
            <h2 className="mt-3 text-lg font-black tracking-tight text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
        </div>
    );
}

function SectionHeading({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string;
    title: string;
    description: string;
}) {
    return (
        <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">{eyebrow}</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] text-slate-950 sm:text-4xl">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">{description}</p>
        </div>
    );
}

function LabelRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-6 border-b border-slate-800 pb-2">
            <span className="text-slate-500">{label}</span>
            <span className="font-bold text-white">{value}</span>
        </div>
    );
}
