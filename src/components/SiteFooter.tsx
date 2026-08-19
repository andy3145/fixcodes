import Link from 'next/link';

export default function SiteFooter() {
    return (
        <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
                <div>
                    <Link href="/" className="inline-flex items-center gap-2 text-lg font-black tracking-tight text-white">
                        FixCode<span className="text-emerald-400">DB</span>
                    </Link>
                    <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
                        A fast, practical appliance diagnostic database built to help homeowners understand error codes, troubleshoot safely, and identify the right next step.
                    </p>
                </div>

                <div>
                    <p className="footer-heading">Explore</p>
                    <div className="footer-links">
                        <Link href="/#diagnostic-search">Search error codes</Link>
                        <Link href="/#browse-brands">Browse brands</Link>
                        <Link href="/#browse-appliances">Browse appliances</Link>
                        <Link href="/model-number">Find model number</Link>
                    </div>
                </div>

                <div>
                    <p className="footer-heading">FixCodeDB</p>
                    <div className="footer-links">
                        <Link href="/about">About</Link>
                        <Link href="/safety">Safety disclaimer</Link>
                        <Link href="/privacy">Privacy policy</Link>
                    </div>
                </div>

                <div>
                    <p className="footer-heading">Before repairing</p>
                    <p className="text-sm leading-6 text-slate-400">
                        Disconnect power before opening panels. Gas, refrigerant, and live high-voltage work should be handled by qualified professionals.
                    </p>
                </div>
            </div>

            <div className="border-t border-slate-800">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <p>© {new Date().getFullYear()} FixCodeDB. All rights reserved.</p>
                    <p>Independent diagnostic reference. Not affiliated with appliance manufacturers.</p>
                </div>
            </div>
        </footer>
    );
}
