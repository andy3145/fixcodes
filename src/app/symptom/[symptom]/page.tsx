import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CodeExplorer from '@/components/CodeExplorer';
import { canonicalCodes, toSearchableCodes } from '@/lib/codes';
import { codesForSymptom, findSymptom, symptoms } from '@/lib/symptoms';
import { applianceHref, symptomHref } from '@/lib/slug';

const SITE_URL = 'https://www.fixcodedb.com';

interface PageProps {
    params: Promise<{ symptom: string }>;
}

export function generateStaticParams() {
    return symptoms.map((topic) => ({ symptom: topic.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { symptom } = await params;
    const topic = findSymptom(symptom);
    if (!topic) return { title: 'Symptom Guide Not Found', robots: { index: false, follow: true } };

    const count = codesForSymptom(topic, canonicalCodes).length;
    const description = `${topic.description} Includes ${topic.freeChecks.length} checks to try before buying a part, plus ${count} related error code guides.`;

    return {
        title: topic.title,
        description,
        alternates: { canonical: symptomHref(topic.slug) },
        openGraph: {
            type: 'article',
            title: topic.title,
            description,
            url: symptomHref(topic.slug),
            siteName: 'FixCodeDB',
        },
        twitter: { card: 'summary_large_image', title: topic.title, description },
    };
}

export default async function SymptomPage({ params }: PageProps) {
    const { symptom } = await params;
    const topic = findSymptom(symptom);
    if (!topic) notFound();

    const matches = codesForSymptom(topic, canonicalCodes);
    const canonicalUrl = `${SITE_URL}${symptomHref(topic.slug)}`;

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: topic.shortTitle, item: canonicalUrl },
        ],
    };

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: topic.title,
        description: topic.description,
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
        author: { '@type': 'Organization', name: 'FixCodeDB', url: `${SITE_URL}/about` },
        publisher: { '@type': 'Organization', name: 'FixCodeDB', url: SITE_URL },
        about: topic.appliance ? [topic.appliance, topic.shortTitle] : [topic.shortTitle],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

            <main>
                <section className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                            <Link href="/" className="hover:text-emerald-700">Home</Link>
                            <span aria-hidden="true">/</span>
                            <span className="font-bold text-slate-900">{topic.shortTitle}</span>
                        </nav>
                        <div className="mt-7 max-w-3xl">
                            <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Symptom-first troubleshooting</p>
                            <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">{topic.title}</h1>
                            <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">{topic.description}</p>
                            <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">{matches.length} related code guides</span>
                                {topic.appliance && (
                                    <Link href={applianceHref(topic.appliance)} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-800 hover:bg-emerald-100">
                                        All {topic.appliance} codes →
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
                    <article className="min-w-0 space-y-6">
                        <section id="what-it-means" className="surface-card p-6 sm:p-7">
                            <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-700">What this actually means</p>
                            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Understanding the fault</h2>
                            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{topic.intro}</p>
                        </section>

                        <section id="free-checks" className="surface-card overflow-hidden">
                            <div className="border-b border-slate-100 bg-emerald-50/60 p-6 sm:p-7">
                                <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-800">Try these first — they cost nothing</p>
                                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Free checks before you buy any part</h2>
                                <p className="mt-2 text-sm leading-6 text-slate-600">Work down the list in order and stop when the symptom clears.</p>
                            </div>
                            <ol className="divide-y divide-slate-100">
                                {topic.freeChecks.map((check, index) => (
                                    <li key={check.label} className="flex gap-4 p-5 sm:p-6">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-xs font-black text-white">{index + 1}</span>
                                        <div>
                                            <h3 className="text-sm font-black text-slate-950 sm:text-base">{check.label}</h3>
                                            <p className="mt-1.5 text-sm leading-6 text-slate-600">{check.detail}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </section>

                        <section id="no-code" className="surface-card p-6 sm:p-7">
                            <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-700">No code on the display?</p>
                            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">When your appliance shows nothing at all</h2>
                            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{topic.noCodeGuidance}</p>
                        </section>

                        <section id="causes" className="surface-card p-6 sm:p-7">
                            <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-700">Where to look</p>
                            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Common causes to check</h2>
                            <ol className="mt-5 space-y-2.5">
                                {topic.commonCauses.map((cause, index) => (
                                    <li key={cause} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-950 text-[10px] font-black text-white">{index + 1}</span>
                                        <span className="text-sm font-semibold leading-6 text-slate-700">{cause}</span>
                                    </li>
                                ))}
                            </ol>
                        </section>

                        <section id="stop" className="rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-7">
                            <div className="flex gap-4">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-lg" aria-hidden="true">⚠</span>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-800">Know where to stop</p>
                                    <h2 className="mt-1 text-lg font-black text-slate-950">When to call a professional</h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-700">{topic.stopAndCall}</p>
                                    <Link href="/safety" className="mt-3 inline-block text-xs font-black text-amber-900 underline decoration-amber-400 underline-offset-4">Read the full safety disclaimer</Link>
                                </div>
                            </div>
                        </section>

                        <section id="codes">
                            <div className="mb-5">
                                <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-700">Match your code</p>
                                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                                    {matches.length} related {topic.appliance ?? 'appliance'} error codes
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    If your appliance displayed a code, find it here for the diagnostic sequence specific to your brand. Codes vary by model, so confirm the full model number before ordering any part.
                                </p>
                            </div>
                            <CodeExplorer items={toSearchableCodes(matches)} initialAppliance={topic.appliance} />
                        </section>
                    </article>

                    <aside className="hidden lg:block">
                        <div className="sticky top-24 space-y-4">
                            <div className="surface-card p-5">
                                <p className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">On this page</p>
                                <nav className="mt-4 flex flex-col gap-1 text-sm font-bold text-slate-600">
                                    <a href="#what-it-means" className="rounded-lg px-2 py-2 hover:bg-slate-50 hover:text-emerald-700">What it means</a>
                                    <a href="#free-checks" className="rounded-lg px-2 py-2 hover:bg-slate-50 hover:text-emerald-700">Free checks</a>
                                    <a href="#no-code" className="rounded-lg px-2 py-2 hover:bg-slate-50 hover:text-emerald-700">No code shown</a>
                                    <a href="#causes" className="rounded-lg px-2 py-2 hover:bg-slate-50 hover:text-emerald-700">Common causes</a>
                                    <a href="#stop" className="rounded-lg px-2 py-2 hover:bg-slate-50 hover:text-emerald-700">When to stop</a>
                                    <a href="#codes" className="rounded-lg px-2 py-2 hover:bg-slate-50 hover:text-emerald-700">Related codes</a>
                                </nav>
                            </div>

                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                                <p className="text-[11px] font-black uppercase tracking-[0.15em] text-emerald-800">Other problems</p>
                                <div className="mt-3 space-y-2">
                                    {symptoms.filter((item) => item.slug !== topic.slug).slice(0, 6).map((item) => (
                                        <Link key={item.slug} href={symptomHref(item.slug)} className="block text-sm font-bold text-slate-700 hover:text-emerald-800">
                                            {item.shortTitle} →
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                <section className="border-t border-slate-200 bg-white py-12">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-black tracking-tight text-slate-950">Other common appliance problems</h2>
                        <div className="mt-5 flex flex-wrap gap-2">
                            {symptoms.filter((item) => item.slug !== topic.slug).map((item) => (
                                <Link key={item.slug} href={symptomHref(item.slug)} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800">
                                    {item.shortTitle}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
