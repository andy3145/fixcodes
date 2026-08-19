import Link from 'next/link';

export default function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="FixCodeDB home">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                        F
                    </span>
                    <span className="text-xl font-black tracking-[-0.035em] text-slate-950">
                        FixCode<span className="text-emerald-600">DB</span>
                    </span>
                </Link>

                <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
                    <Link href="/#diagnostic-search" className="nav-link">Search Codes</Link>
                    <Link href="/#browse-brands" className="nav-link">Brands</Link>
                    <Link href="/#browse-appliances" className="nav-link">Appliances</Link>
                    <Link href="/#common-problems" className="nav-link">Symptoms</Link>
                    <Link href="/model-number" className="nav-link">Find Model Number</Link>
                    <Link href="/about" className="nav-link">About</Link>
                </nav>

                <div className="flex items-center gap-2">
                    <Link
                        href="/#diagnostic-search"
                        className="hidden items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md sm:inline-flex"
                    >
                        Diagnose a problem
                        <span aria-hidden="true">→</span>
                    </Link>

                    <details className="relative md:hidden">
                        <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 [&::-webkit-details-marker]:hidden" aria-label="Open navigation menu">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                                <path d="M4 7h16M4 12h16M4 17h16" />
                            </svg>
                        </summary>
                        <div className="absolute right-0 top-12 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                            <MobileLink href="/#diagnostic-search" strong>Search error codes</MobileLink>
                            <MobileLink href="/#browse-brands">Browse brands</MobileLink>
                            <MobileLink href="/#browse-appliances">Browse appliances</MobileLink>
                            <MobileLink href="/#common-problems">Browse symptoms</MobileLink>
                            <MobileLink href="/model-number">Find model number</MobileLink>
                            <MobileLink href="/about">About FixCodeDB</MobileLink>
                            <div className="my-1 border-t border-slate-100" />
                            <MobileLink href="/safety">Safety</MobileLink>
                        </div>
                    </details>
                </div>
            </div>
        </header>
    );
}

function MobileLink({ href, children, strong = false }: { href: string; children: string; strong?: boolean }) {
    return (
        <Link
            href={href}
            className={`block rounded-xl px-3 py-2.5 text-sm transition-colors ${
                strong
                    ? 'bg-emerald-50 font-black text-emerald-800 hover:bg-emerald-100'
                    : 'font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-950'
            }`}
        >
            {children}
        </Link>
    );
}
