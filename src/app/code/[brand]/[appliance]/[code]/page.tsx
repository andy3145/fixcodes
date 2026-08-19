import codesData from '@/data/codes.json';
import Link from 'next/link';

interface CodeItem {
    brand: string;
    appliance: string;
    code: string;
    title: string;
    description: string;
    root_cause: string;
    diagnostic_steps: string[];
    part_name: string;
    part_number: string;
    ebay_affiliate_url?: string;
    affiliateDisclosure?: string;
}

const items: CodeItem[] = codesData as unknown as CodeItem[];

export async function generateStaticParams() {
    return items.map((item: CodeItem) => ({
        brand: item.brand,
        appliance: item.appliance,
        code: item.code,
    }));
}

// 1. Added generateMetadata to fix the SEO / generic title bug
export async function generateMetadata({
    params,
}: {
    params: Promise<{ brand: string; appliance: string; code: string }>;
}) {
    const { brand, appliance, code } = await params;

    const brandName = brand.charAt(0).toUpperCase() + brand.slice(1);
    const applianceName = appliance.replace('-', ' ');

    return {
        title: `${brandName} ${applianceName} ${code} Error Code: Meaning, Causes & Fixes`,
        description: `Is your ${brandName} ${applianceName} showing ${code}? Learn what this error code means, how to troubleshoot it step-by-step, and find the right replacement part.`,
        alternates: {
            canonical: `https://www.fixcodedb.com/code/${brand}/${appliance}/${code}`,
        },
    };
}

export default async function ErrorCodePage({
    params,
}: {
    params: Promise<{ brand: string; appliance: string; code: string }>;
}) {
    const { brand, appliance, code } = await params;

    const item = items.find(
        (c: CodeItem) =>
            c.brand.toLowerCase() === brand.toLowerCase() &&
            c.appliance.toLowerCase() === appliance.toLowerCase() &&
            c.code.toLowerCase() === code.toLowerCase()
    );

    if (!item) {
        return (
            <div className="min-h-screen bg-slate-50 p-12 text-center font-sans">
                <h1 className="text-2xl font-bold text-slate-800">Error Code Not Found</h1>
                <p className="text-slate-600 mt-2">
                    No data for <code className="bg-slate-200 px-2 py-0.5 rounded">{brand}/{appliance}/{code}</code>.
                </p>
                <Link href="/" className="text-blue-600 underline mt-4 inline-block">Return Home</Link>
            </div>
        );
    }

    const ebaySearchQuery = `${item.brand} ${item.appliance} ${item.part_name} ${item.code} replacement part`;
    const ebayAffiliateUrl =
        item.ebay_affiliate_url ||
        `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(ebaySearchQuery)}&mkcid=1&mkrid=711-53200-19255-0&siteid=0&campid=5339190484&customid=fixcodedb&toolid=10001&mkevt=1`;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-800">
            <main className="max-w-3xl mx-auto px-4 py-12 w-full">
                <nav className="text-sm text-slate-500 mb-6 capitalize">
                    <Link href="/" className="hover:underline">Home</Link> /
                    <span className="mx-1">{item.brand}</span> /
                    <span className="mx-1">{item.appliance}</span>
                </nav>

                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r mb-8 shadow-sm">
                    <span className="text-xs uppercase font-bold tracking-wider text-red-600">Appliance Diagnostic</span>
                    <h1 className="text-3xl font-extrabold text-slate-900 mt-1">{item.title}</h1>
                    <p className="text-lg text-slate-700 mt-2 font-medium">{item.description}</p>
                </div>

                <section className="mb-10 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold mb-3 text-slate-900">What Caused This Error?</h2>
                    <p className="bg-slate-50 p-4 rounded text-slate-700 border border-slate-200 mb-8">{item.root_cause}</p>

                    <h2 className="text-xl font-bold mb-3 text-slate-900">Step-by-Step Diagnostic Check</h2>
                    <ol className="list-decimal pl-5 space-y-3 text-slate-700">
                        {(item.diagnostic_steps || (item as any).diagnosticSteps || []).map((step: string, idx: number) => (
                            <li key={idx} className="pl-1">{step}</li>
                        ))}
                    </ol>
                </section>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                    <div>
                        <span className="text-xs uppercase font-bold tracking-wider text-blue-600">Most Likely Replacement Part</span>
                        <h3 className="text-lg font-bold text-slate-900">{item.part_name}</h3>
                        <p className="text-sm text-slate-600">OEM Part #: <code className="bg-white px-2 py-0.5 rounded border">{item.part_number}</code></p>
                    </div>
                    <a
                        href={ebayAffiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto text-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-lg transition-colors whitespace-nowrap shadow-sm"
                    >
                        Find Replacement Part on eBay →
                    </a>
                </div>

                <p className="text-[11px] leading-relaxed text-slate-500 -mt-4 mb-8">
                    {item.affiliateDisclosure || 'FixCodeDB may earn a commission from qualifying purchases made through affiliate links.'}
                </p>
            </main>

            <footer className="bg-slate-100 border-t border-slate-200 py-8 px-4 mt-12 text-xs text-slate-500 text-center">
                <p>© {new Date().getFullYear()} FixCodeDB. All rights reserved.</p>
            </footer>
        </div>
    );
}
