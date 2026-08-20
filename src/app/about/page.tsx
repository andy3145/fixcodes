import type { Metadata } from 'next';
import Link from 'next/link';
import { codes, getBrands } from '@/lib/codes';

export const metadata: Metadata = {
    title: 'About FixCodeDB',
    description: 'Learn how FixCodeDB organizes appliance error codes, troubleshooting information, safety guidance, and replacement part references.',
    alternates: { canonical: '/about' },
};

export default function AboutPage() {
    return (
        <main>
            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">About FixCodeDB</p>
                    <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">Appliance diagnostics should be easier to navigate.</h1>
                    <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                        FixCodeDB is an independent diagnostic reference built to organize error-code information into a clear path: understand the fault, check likely causes, troubleshoot safely, and verify the correct replacement part before buying.
                    </p>
                </div>
            </section>

            <section className="bg-slate-50 py-12 sm:py-16">
                <div className="mx-auto grid max-w-5xl gap-4 px-4 sm:px-6 md:grid-cols-3">
                    <Stat value={codes.length.toString()} label="Error codes covered" />
                    <Stat value={getBrands().length.toString()} label="Supported brands" />
                    <Stat value="Independent" label="Manufacturer affiliation" />
                </div>
            </section>

            <section className="bg-white py-14 sm:py-20">
                <div className="mx-auto grid max-w-5xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.8fr]">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-slate-950">How to use the database</h2>
                        <div className="mt-6 space-y-5">
                            <Principle title="Start with the exact code" text="Use the brand, appliance type, and displayed code whenever possible. If the code is unclear, search the symptom or component instead." />
                            <Principle title="Check simple causes before replacing parts" text="A code identifies what the control detected, but it does not always prove a specific component has failed. Work through the diagnostic sequence in order." />
                            <Principle title="Verify model fit" text="Part numbers can vary across models and production revisions. Use the full model number before ordering a replacement component." />
                            <Principle title="Know when to stop DIY work" text="High-voltage, gas, refrigerant, combustion, and other hazardous repairs should be handled by qualified professionals." />
                        </div>
                    </div>

                    <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                        <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-700">Important</p>
                        <h2 className="mt-2 text-xl font-black text-slate-950">Independent informational resource</h2>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                            FixCodeDB is not affiliated with, endorsed by, or operated by the appliance manufacturers referenced in the database. Error meanings and procedures can differ by exact model, market, and production revision.
                        </p>
                        <div className="mt-6 flex flex-col gap-2">
                            <Link href="/safety" className="rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-black text-white hover:bg-emerald-700">Read safety guidance</Link>
                            <Link href="/model-number" className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-black text-slate-700 hover:border-emerald-300 hover:text-emerald-800">Find your model number</Link>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}

function Stat({ value, label }: { value: string; label: string }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-2xl font-black tracking-tight text-slate-950">{value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
        </div>
    );
}

function Principle({ title, text }: { title: string; text: string }) {
    return (
        <div className="border-l-2 border-emerald-500 pl-4">
            <h3 className="font-black text-slate-950">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
        </div>
    );
}
