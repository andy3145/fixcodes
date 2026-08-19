import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="flex min-h-[65vh] items-center justify-center bg-slate-50 px-4 py-16 text-center">
            <div className="max-w-lg">
                <p className="font-mono text-sm font-black text-emerald-700">ERROR 404</p>
                <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-950">That diagnostic page is not in the database.</h1>
                <p className="mt-4 text-sm leading-7 text-slate-600">The link may be outdated or the code may be listed under a different appliance name. Try searching the code or symptom from the main database.</p>
                <Link href="/#diagnostic-search" className="mt-7 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-emerald-700">Search FixCodeDB →</Link>
            </div>
        </main>
    );
}
