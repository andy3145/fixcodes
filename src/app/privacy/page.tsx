import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'FixCodeDB privacy policy covering website usage, advertising, affiliate links, and third-party services.',
    alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
    return (
        <main className="bg-slate-50 py-12 sm:py-16">
            <article className="surface-card mx-auto max-w-3xl px-6 py-8 sm:px-9 sm:py-10">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Legal</p>
                <h1 className="mt-2 text-3xl font-black tracking-[-0.03em] text-slate-950">Privacy Policy</h1>
                <p className="mt-3 text-sm text-slate-500">Last updated: August 18, 2026</p>

                <div className="mt-8 space-y-7 text-sm leading-7 text-slate-600">
                    <PolicySection title="Overview">FixCodeDB provides appliance diagnostic and repair-reference content. This policy describes common data practices associated with operating the website and the third-party services that may be used for analytics, advertising, and affiliate links.</PolicySection>
                    <PolicySection title="Server and usage information">Like most websites, hosting and analytics services may process technical information such as IP address, browser type, device information, referring page, requested URLs, and timestamps for security, performance, and aggregate usage measurement.</PolicySection>
                    <PolicySection title="Advertising">FixCodeDB may display advertising provided by third-party advertising partners, including Google. Those providers may use cookies or similar technologies subject to their own policies and user-consent requirements.</PolicySection>
                    <PolicySection title="Affiliate links">Some replacement-part links are affiliate links. If you follow one and make a qualifying purchase, FixCodeDB may receive a commission. Affiliate relationships do not change the price shown to you by the third-party seller.</PolicySection>
                    <PolicySection title="Third-party websites">FixCodeDB links to external websites that have their own privacy and data practices. We do not control those third-party websites.</PolicySection>
                    <PolicySection title="Policy changes">This policy may be updated as the site or its services change. The revision date on this page will be updated when material changes are published.</PolicySection>
                </div>
            </article>
        </main>
    );
}

function PolicySection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section>
            <h2 className="text-lg font-black text-slate-950">{title}</h2>
            <p className="mt-2">{children}</p>
        </section>
    );
}
