import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FeedbackWidget from '@/components/FeedbackWidget';
import {
    canonicalCodes,
    codes,
    codesForBrand,
    codesForBrandAppliance,
    findCode,
    getDiagnosticSteps,
    getEbayAffiliateUrl,
    getPartName,
    getPartNumber,
    getPartNumberStatus,
    getPossibleCauses,
    getRootCause,
    getSafetyNote,
} from '@/lib/codes';
import { brandApplianceHref, brandHref, codeHref, slugify } from '@/lib/slug';

interface PageProps {
    params: Promise<{ brand: string; appliance: string; code: string }>;
}

export function generateStaticParams() {
    // Alias routes are permanent redirects handled in next.config.ts — never prerender them.
    return canonicalCodes.map((item) => ({
        brand: slugify(item.brand),
        appliance: slugify(item.appliance),
        code: slugify(item.code),
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { brand, appliance, code } = await params;
    const item = findCode(brand, appliance, code);

    if (!item) {
        return { title: 'Error Code Not Found', robots: { index: false, follow: true } };
    }

    const canonical = codeHref(item.brand, item.appliance, item.code);
    const title = `${item.brand} ${item.appliance} ${item.code} Error Code: Causes & Fixes`;
    const description = `${item.description} Review likely causes, symptoms, diagnostic steps, safety guidance, and replacement part information.`;

    return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
            type: 'article',
            url: canonical,
            title,
            description,
            siteName: 'FixCodeDB',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

export default async function ErrorCodePage({ params }: PageProps) {
    const { brand, appliance, code } = await params;
    const item = findCode(brand, appliance, code);
    if (!item) notFound();

    const causes = getPossibleCauses(item);
    const steps = getDiagnosticSteps(item);
    const partName = getPartName(item);
    const partNumber = getPartNumber(item);
    const partNumberStatus = getPartNumberStatus(item);
    const safetyNote = getSafetyNote(item);
    const ebayAffiliateUrl = getEbayAffiliateUrl(item);

    const relatedSameAppliance = codesForBrandAppliance(item.brand, item.appliance)
        .filter((candidate) => candidate.id !== item.id)
        .slice(0, 4);

    const relatedSameBrand = codesForBrand(item.brand)
        .filter(
            (candidate) =>
                candidate.id !== item.id &&
                !relatedSameAppliance.some((related) => related.id === candidate.id),
        )
        .slice(0, Math.max(0, 4 - relatedSameAppliance.length));

    const related = [...relatedSameAppliance, ...relatedSameBrand];
    const canonicalUrl = `https://www.fixcodedb.com${codeHref(item.brand, item.appliance, item.code)}`;

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.fixcodedb.com/' },
            { '@type': 'ListItem', position: 2, name: item.brand, item: `https://www.fixcodedb.com${brandHref(item.brand)}` },
            { '@type': 'ListItem', position: 3, name: item.appliance, item: `https://www.fixcodedb.com${brandApplianceHref(item.brand, item.appliance)}` },
            { '@type': 'ListItem', position: 4, name: `${item.code} error code`, item: canonicalUrl },
        ],
    };

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: item.title,
        description: item.description,
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
        author: { '@type': 'Organization', name: 'FixCodeDB', url: 'https://www.fixcodedb.com/about' },
        publisher: { '@type': 'Organization', name: 'FixCodeDB', url: 'https://www.fixcodedb.com' },
        about: [item.brand, item.appliance, `${item.code} error code`],
        ...(item.updatedAt ? { dateModified: item.updatedAt } : {}),
        ...(item.sourceUrl ? { citation: item.sourceUrl } : {}),
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                        <Link href="/" className="hover:text-emerald-700">Home</Link>
                        <span aria-hidden="true">/</span>
                        <Link href={brandHref(item.brand)} className="hover:text-emerald-700">{item.brand}</Link>
                        <span aria-hidden="true">/</span>
                        <Link href={brandApplianceHref(item.brand, item.appliance)} className="hover:text-emerald-700">{item.appliance}</Link>
                        <span aria-hidden="true">/</span>
                        <span className="font-bold text-slate-900">{item.code}</span>
                    </nav>
                </div>
            </div>

            <main className="bg-slate-50">
                <section className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
                        <div className="max-w-4xl">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-emerald-800">{item.brand}</span>
                                <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">{item.appliance}</span>
                                <span className="rounded-lg border border-slate-200 bg-white px-3 py-1 font-mono text-xs font-black uppercase text-slate-800">Code {item.code}</span>
                            </div>
                            <h1 className="mt-5 text-balance text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-5xl">{item.title}</h1>
                            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">{item.description}</p>
                        </div>
                    </div>
                </section>

                <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
                    <article className="min-w-0 space-y-6">
                        <section id="overview" className="surface-card overflow-hidden">
                            <div className="border-b border-slate-100 p-6">
                                <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-700">Quick diagnosis</p>
                                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">What this code is telling you</h2>
                            </div>
                            <div className="grid sm:grid-cols-2">
                                <QuickFact
                                    label="Most likely trigger"
                                    value={causes[0] || getRootCause(item)}
                                />
                                <QuickFact
                                    label="Recommended replacement"
                                    value={partName}
                                />
                                <QuickFact
                                    label="Diagnostic path"
                                    value={`${steps.length} ordered ${steps.length === 1 ? 'check' : 'checks'}`}
                                />
                                <QuickFact
                                    label="Part fit"
                                    value={partNumber ? `OEM ${partNumber}` : 'Exact model number required'}
                                />
                            </div>
                        </section>

                        <section id="safety" className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
                            <div className="flex gap-4">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-lg" aria-hidden="true">⚠</span>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-800">Safety first</p>
                                    <h2 className="mt-1 text-lg font-black text-slate-950">Before opening the appliance</h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-700">{safetyNote}</p>
                                    <Link href="/safety" className="mt-3 inline-block text-xs font-black text-amber-900 underline decoration-amber-400 underline-offset-4">Read the full safety disclaimer</Link>
                                </div>
                            </div>
                        </section>

                        <section id="cause" className="surface-card p-6 sm:p-7">
                            <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-700">Root cause</p>
                            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Why the control reported this error</h2>
                            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{getRootCause(item)}</p>
                        </section>

                        {item.symptoms && item.symptoms.length > 0 && (
                            <section id="symptoms" className="surface-card p-6 sm:p-7">
                                <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-700">Symptoms</p>
                                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">What you may notice</h2>
                                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                                    {item.symptoms.map((symptom) => (
                                        <li key={symptom} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-700">
                                            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-700">✓</span>
                                            {symptom}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {causes.length > 0 && (
                            <section id="causes" className="surface-card p-6 sm:p-7">
                                <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-700">Possible causes</p>
                                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Check the most likely causes first</h2>
                                <ol className="mt-5 space-y-3">
                                    {causes.map((cause, index) => (
                                        <li key={cause} className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4">
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-xs font-black text-white">{index + 1}</span>
                                            <div>
                                                <p className="text-sm font-bold leading-6 text-slate-800">{cause}</p>
                                                {index === 0 && <p className="mt-1 text-xs font-bold text-emerald-700">Start here when it matches your symptoms.</p>}
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </section>
                        )}

                        <section id="diagnostics" className="surface-card p-6 sm:p-7">
                            <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-700">Diagnostic sequence</p>
                            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Work through these checks in order</h2>
                            <p className="mt-3 text-sm leading-6 text-slate-500">Stop when you find the fault. Do not perform a step that requires skills or live testing you are not qualified to do.</p>

                            <ol className="mt-6 space-y-4">
                                {steps.map((step, index) => (
                                    <li key={`${index}-${step}`} className="relative flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-sm font-black text-white shadow-sm">{index + 1}</span>
                                        <div className="pt-1">
                                            <p className="text-xs font-black uppercase tracking-wider text-slate-400">Check {index + 1}</p>
                                            <p className="mt-1 text-sm font-semibold leading-6 text-slate-700 sm:text-base">{step}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </section>

                        <section id="part" className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
                            <div className="border-b border-emerald-100 bg-emerald-50 p-6 sm:p-7">
                                <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-800">
                                    {item.replacementPartRecommended === false ? 'Recommended next step' : 'Replacement part reference'}
                                </p>
                                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                                    {item.replacementPartRecommended === false ? 'Troubleshoot before buying a part' : partName}
                                </h2>
                            </div>
                            <div className="p-6 sm:p-7">
                                {item.replacementPartRecommended === false ? (
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                                        <p className="text-sm font-black text-slate-950">This code does not point to a replacement part as the first action.</p>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">Follow the diagnostic sequence above first. Supply problems, maintenance conditions, settings, airflow restrictions, or temporary control states can often trigger this code without a failed component.</p>
                                        <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">If the code returns after the listed checks, use the complete model number and manufacturer documentation before ordering anything.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">{partNumber ? 'Verified OEM part number' : 'Exact OEM part number'}</p>
                                                {partNumber ? (
                                                    <p className="mt-2 font-mono text-sm font-black text-slate-950">{partNumber}</p>
                                                ) : (
                                                    <p className="mt-2 text-sm font-black text-slate-950">Model number required</p>
                                                )}
                                            </div>
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Fitment note</p>
                                                <p className="mt-2 text-sm font-semibold leading-5 text-slate-700">{partNumberStatus}</p>
                                            </div>
                                        </div>

                                        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
                                            <p className="text-sm font-black text-slate-950">Verify the appliance model before ordering.</p>
                                            <p className="mt-1 text-xs leading-5 text-slate-500">Manufacturers can use different parts under the same error code across model families and production revisions.</p>
                                            <Link href="/model-number" className="mt-3 inline-flex text-xs font-black text-emerald-700 hover:text-emerald-800">Where do I find my model number? →</Link>
                                        </div>

                                        <a
                                            href={ebayAffiliateUrl}
                                            target="_blank"
                                            rel="sponsored noopener noreferrer"
                                            className="mt-5 flex w-full items-center justify-center rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md sm:w-auto sm:inline-flex"
                                        >
                                            Search this replacement part on eBay →
                                        </a>
                                        <p className="mt-3 max-w-2xl text-[11px] leading-5 text-slate-400">
                                            {item.affiliateDisclosure || 'FixCodeDB may earn a commission from qualifying purchases made through affiliate links.'}
                                        </p>
                                    </>
                                )}
                            </div>
                        </section>

                        <section id="questions" className="surface-card p-6 sm:p-7">
                            <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-700">Common questions</p>
                            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Quick answers for this fault</h2>
                            <div className="mt-5 divide-y divide-slate-200 rounded-xl border border-slate-200">
                                <Question
                                    question={`What should I check first for ${item.code}?`}
                                    answer={causes[0] ? `Start with ${causes[0].toLowerCase()}. If that checks out, continue through the diagnostic sequence above rather than replacing a part based on the code alone.` : 'Start with the first diagnostic check above and work through the sequence in order.'}
                                />
                                <Question
                                    question={item.replacementPartRecommended === false ? `Do I need to buy a part for ${item.code}?` : `Does ${item.code} always mean ${partName} is bad?`}
                                    answer={item.replacementPartRecommended === false
                                        ? 'Usually not as the first step. This code is commonly tied to a setting, supply issue, maintenance condition, airflow restriction, or temporary operating state. Complete the diagnostic checks before considering parts.'
                                        : `No. An error code identifies the condition the control detected, not a guaranteed failed part. Confirm the likely causes and wiring first. ${partNumberStatus}`}
                                />
                                <Question
                                    question={`When should I stop troubleshooting ${item.code} myself?`}
                                    answer={`Stop if the next step requires live electrical testing, sealed-system work, gas or combustion service, or any procedure outside your training. ${safetyNote}`}
                                />
                            </div>
                        </section>

                        {item.sourceUrl && (
                            <section className="surface-card p-6 sm:p-7">
                                <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-700">Manufacturer reference</p>
                                <h2 className="mt-2 text-xl font-black tracking-tight text-slate-950">Verify against the official support source</h2>
                                <p className="mt-2 text-sm leading-6 text-slate-500">FixCodeDB summarizes the fault in plain language. For model-specific instructions, confirm the guidance with the manufacturer and your appliance manual.</p>
                                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-sm font-black text-emerald-700 hover:text-emerald-800">
                                    {item.sourceLabel || `${item.brand} official support`} →
                                </a>
                            </section>
                        )}

                        <FeedbackWidget brand={item.brand} code={item.code} />

                        {related.length > 0 && (
                            <section className="surface-card p-6 sm:p-7">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-700">Keep diagnosing</p>
                                        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Related {item.brand} guides</h2>
                                    </div>
                                    <Link href={brandApplianceHref(item.brand, item.appliance)} className="text-xs font-black text-emerald-700 hover:text-emerald-800">View {item.appliance} hub →</Link>
                                </div>
                                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                    {related.map((relatedItem) => (
                                        <Link
                                            key={relatedItem.id}
                                            href={codeHref(relatedItem.brand, relatedItem.appliance, relatedItem.code)}
                                            className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-emerald-200 hover:bg-emerald-50"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="font-mono text-xs font-black uppercase text-slate-950">Code {relatedItem.code}</span>
                                                <span className="text-xs font-bold text-slate-400">{relatedItem.appliance}</span>
                                            </div>
                                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500 group-hover:text-slate-700">{relatedItem.description}</p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        <div className="rounded-2xl bg-slate-950 p-6 text-white sm:p-8">
                            <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-400">Different problem?</p>
                            <h2 className="mt-2 text-2xl font-black tracking-tight">Search another code or symptom</h2>
                            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Go back to the main diagnostic search and try the code, symptom, appliance, component, or brand.</p>
                            <Link href="/#diagnostic-search" className="mt-5 inline-flex rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-slate-950 transition-colors hover:bg-emerald-400">Open diagnostic search →</Link>
                        </div>
                    </article>

                    <aside className="hidden lg:block">
                        <div className="sticky top-24 space-y-4">
                            <div className="surface-card p-5">
                                <p className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">On this guide</p>
                                <nav className="mt-4 flex flex-col gap-1 text-sm font-bold text-slate-600">
                                    <JumpLink href="#overview">Quick diagnosis</JumpLink>
                                    <JumpLink href="#cause">Root cause</JumpLink>
                                    {item.symptoms && item.symptoms.length > 0 && <JumpLink href="#symptoms">Symptoms</JumpLink>}
                                    {causes.length > 0 && <JumpLink href="#causes">Possible causes</JumpLink>}
                                    <JumpLink href="#diagnostics">Diagnostic checks</JumpLink>
                                    <JumpLink href="#part">Replacement part</JumpLink>
                                    <JumpLink href="#questions">Common questions</JumpLink>
                                </nav>
                            </div>

                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                                <p className="text-[11px] font-black uppercase tracking-[0.15em] text-emerald-800">Browse deeper</p>
                                <div className="mt-3 space-y-2">
                                    <Link href={brandApplianceHref(item.brand, item.appliance)} className="block text-sm font-black text-slate-950 hover:text-emerald-800">All {item.brand} {item.appliance} codes →</Link>
                                    <Link href={brandHref(item.brand)} className="block text-sm font-bold text-slate-700 hover:text-emerald-800">All {item.brand} guides →</Link>
                                    <Link href="/model-number" className="block text-sm font-bold text-slate-700 hover:text-emerald-800">Find model number →</Link>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </>
    );
}

function QuickFact({ label, value }: { label: string; value: string }) {
    return (
        <div className="border-b border-slate-100 p-5 last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
            <p className="mt-2 text-sm font-black leading-6 text-slate-800">{value}</p>
        </div>
    );
}

function Question({ question, answer }: { question: string; answer: string }) {
    return (
        <details className="group p-4 open:bg-slate-50">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-slate-900">
                {question}
                <span className="text-emerald-700 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p className="mt-3 pr-8 text-sm leading-6 text-slate-600">{answer}</p>
        </details>
    );
}

function JumpLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <a href={href} className="rounded-lg px-2 py-2 transition-colors hover:bg-slate-50 hover:text-emerald-700">{children}</a>
    );
}
