import type { Metadata } from 'next';
import Link from 'next/link';
import codesData from '@/data/codes.json';
import CodeExplorer from '@/components/CodeExplorer';

export const metadata: Metadata = {
    title: 'FixCodeDB | Appliance Error Code Diagnostics & Repair Guides',
    description: 'Search appliance error codes to find likely causes, step-by-step diagnostics, repair guidance, and compatible OEM replacement parts.',
    metadataBase: new URL('https://www.fixcodedb.com'),
    openGraph: {
        title: 'FixCodeDB | Appliance Error Code Diagnostics',
        description: 'Search appliance error codes to find likely causes, step-by-step diagnostics, repair guidance, and compatible OEM replacement parts.',
        url: 'https://www.fixcodedb.com',
        siteName: 'FixCodeDB',
        type: 'website',
    },
};

interface CodeItem {
    brand: string;
    appliance: string;
    code: string;
    title?: string;
    description?: string;
}

export default function Home() {
    const items = codesData as unknown as CodeItem[];
    const brandCount = new Set(items.map((i) => i.brand)).size;
    const applianceCount = new Set(items.map((i) => i.appliance)).size;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-slate-900 selection:text-white">
            <div>
                {/* Header */}
                <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                        <Link href="/" className="font-extrabold tracking-tight text-xl text-slate-900">
                            FixCode<span className="text-emerald-600">DB</span>
                        </Link>
                        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
                            <Link href="/safety" className="hover:text-slate-900 transition-colors">Safety</Link>
                            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
                        </nav>
                    </div>
                </header>

                {/* Hero */}
                <section className="bg-white border-b border-slate-200 relative overflow-hidden">
                    <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 text-center sm:px-6 sm:pb-20 sm:pt-20">
                        <div className="mx-auto max-w-3xl">
                            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-2xs">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                                </span>
                                Appliance Diagnostic Database
                            </span>

                            <h1 className="text-balance text-4xl font-black tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
                                Decode the problem.{' '}
                                <span className="block text-emerald-600">Fix it with confidence.</span>
                            </h1>

                            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                                Search appliance error codes to find likely causes, step-by-step diagnostics, repair guidance, and compatible OEM replacement parts.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-500">
                                <span><strong className="font-bold text-slate-900">{items.length.toLocaleString()}</strong> repair guides</span>
                                <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
                                <span><strong className="font-bold text-slate-900">{brandCount}</strong> brands</span>
                                <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
                                <span><strong className="font-bold text-slate-900">{applianceCount}</strong> appliance categories</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Interactive Search Component */}
                <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
                    <CodeExplorer items={items} />
                </main>
            </div>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-4 py-8 text-xs text-slate-500 sm:flex-row sm:px-6">
                    <div>
                        <p className="font-semibold text-slate-700">FixCode<span className="text-emerald-600">DB</span></p>
                        <p className="mt-1">&copy; {new Date().getFullYear()} FixCodeDB. All rights reserved.</p>
                    </div>
                    <div className="flex gap-6 font-medium">
                        <Link href="/safety" className="transition-colors hover:text-slate-950">Safety Disclaimer</Link>
                        <Link href="/privacy" className="transition-colors hover:text-slate-950">Privacy Policy</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
