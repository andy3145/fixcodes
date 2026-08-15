import Metadata from 'next';
import codesData from '@/data/codes.json';
import SearchSection from '@/components/SearchSection';
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
}

const items: CodeItem[] = codesData as CodeItem[];

// 1. Full SEO Metadata for Search Engines
export const metadata = {
    title: 'FixCodeDB — Free Appliance Error Code & Diagnostic Directory',
    description:
        'Instant DIY error code lookup for Samsung, Whirlpool, Maytag, LG, Bosch, and GE washers, dryers, and dishwashers. Find root causes and OEM replacement parts.',
    keywords: [
        'appliance error codes',
        'washer error codes',
        'dryer error codes',
        'dishwasher error codes',
        'Samsung error codes',
        'Maytag error codes',
        'Whirlpool error codes',
        'appliance troubleshooting',
    ],
    openGraph: {
        title: 'FixCodeDB — Free Appliance Error Code Directory',
        description: 'Lookup appliance error codes, diagnostic checks, and OEM replacement parts instantly.',
        type: 'website',
    },
};

// 2. Structured Data (JSON-LD) for Google Rich Snippets
const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'WebSite',
            'name': 'FixCodeDB',
            'url': 'https://fixcodedb.com',
            'description': 'Free database for household appliance error codes and troubleshooting guides.',
        },
        {
            '@type': 'FAQPage',
            'mainEntity': [
                {
                    '@type': 'Question',
                    'name': 'How do I find my appliance error code on FixCodeDB?',
                    'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': 'Type your error code (e.g., F21, 4E, dE) or your appliance brand into the search bar at the top of FixCodeDB to view instant step-by-step diagnostic checks.',
                    },
                },
                {
                    '@type': 'Question',
                    'name': 'Are appliance error code replacement parts universal?',
                    'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': 'Replacement parts vary by exact model family. FixCodeDB provides the primary OEM replacement part numbers commonly associated with each error code.',
                    },
                },
            ],
        },
    ],
};

export default function HomePage() {
    return (
        <>
            {/* Inject Structured Data into <head> for Google */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-800">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 py-4 px-6 shadow-sm">
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                        <Link href="/" className="text-xl font-black text-slate-900 tracking-tight">
                            FixCode<span className="text-blue-600">DB</span>
                        </Link>
                        <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                            Open Appliance Database
                        </span>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-5xl mx-auto px-4 py-12 w-full">
                    {/* Hero Section */}
                    <section className="text-center max-w-3xl mx-auto mb-10">
                        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            Diagnose & Fix Any <br className="hidden sm:inline" />
                            <span className="text-blue-600">Appliance Error Code</span>
                        </h1>
                        <p className="text-base sm:text-lg text-slate-600 mt-4">
                            Free step-by-step diagnostic guides, root cause analysis, and OEM replacement part recommendations for major appliance brands.
                        </p>
                    </section>

                    {/* Interactive Live Search & Code Cards */}
                    <SearchSection codes={items} />

                    {/* SEO Content Section for Google Ranking */}
                    <section className="mt-20 border-t border-slate-200 pt-12">
                        <div className="max-w-3xl mx-auto space-y-8">
                            <h2 className="text-2xl font-extrabold text-slate-900 text-center">
                                Why Do Appliances Display Error Codes?
                            </h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Modern household washers, dryers, dishwashers, and refrigerators rely on electronic control boards monitored by sensors. When a sensor detects an operational failure—such as a drain timeout, water supply failure, or door lock obstruction—it halts the cycle and displays an alphanumeric code on the digital display panel.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                                <div className="bg-white p-5 rounded-xl border border-slate-200">
                                    <h3 className="font-bold text-slate-900 text-sm mb-1">1. Identify the Code</h3>
                                    <p className="text-xs text-slate-500">Note the exact code displayed on your appliance screen or blinking light sequence.</p>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-slate-200">
                                    <h3 className="font-bold text-slate-900 text-sm mb-1">2. Run Diagnostic Checks</h3>
                                    <p className="text-xs text-slate-500">Follow our step-by-step troubleshooting checklist before buying expensive parts.</p>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-slate-200">
                                    <h3 className="font-bold text-slate-900 text-sm mb-1">3. Source OEM Parts</h3>
                                    <p className="text-xs text-slate-500">Order the exact OEM replacement part number associated with your specific error condition.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-slate-200 py-8 px-4 mt-16 text-xs text-slate-500 text-center">
                    <div className="max-w-5xl mx-auto space-y-2">
                        <p className="font-bold text-slate-700">FixCodeDB — DIY Appliance Repair Database</p>
                        <p>© {new Date().getFullYear()} FixCodeDB. All product names, logos, and brands are property of their respective owners.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}