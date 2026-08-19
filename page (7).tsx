import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Where to Find Your Appliance Model Number',
    description: 'Find common model-number label locations for washers, dryers, refrigerators, dishwashers, ovens, ranges, and HVAC equipment before ordering replacement parts.',
    alternates: { canonical: '/model-number' },
};

const locations = [
    { appliance: 'Washer', places: ['Inside the door or lid opening', 'Rear edge of the control panel', 'Back of the cabinet'] },
    { appliance: 'Dryer', places: ['Inside the door opening', 'Door frame or cabinet rim', 'Back of the cabinet'] },
    { appliance: 'Refrigerator', places: ['Inside the fresh-food compartment', 'Side wall near the upper shelves', 'Behind or near a lower crisper drawer'] },
    { appliance: 'Dishwasher', places: ['Along the inner door edge', 'Door jamb when the door is open', 'Side of the tub opening'] },
    { appliance: 'Oven / Range', places: ['Around the oven door frame', 'Behind the storage drawer', 'Under or behind the cooktop area on some models'] },
    { appliance: 'HVAC / Furnace', places: ['Equipment data plate on the cabinet', 'Inside the access panel area', 'Outdoor condenser data plate for split systems'] },
];

export default function ModelNumberPage() {
    return (
        <main>
            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Model-fit helper</p>
                    <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">Find your appliance model number</h1>
                    <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
                        The complete model number is the safest way to verify a replacement part. Look for the manufacturer data label—not a retailer receipt, Wi-Fi name, or marketing model family.
                    </p>
                </div>
            </section>

            <section className="bg-slate-50 py-12 sm:py-16">
                <div className="mx-auto max-w-5xl px-4 sm:px-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        {locations.map((entry) => (
                            <section key={entry.appliance} className="surface-card p-6">
                                <h2 className="text-xl font-black text-slate-950">{entry.appliance}</h2>
                                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400">Common label locations</p>
                                <ul className="mt-4 space-y-3">
                                    {entry.places.map((place) => (
                                        <li key={place} className="flex gap-3 text-sm leading-6 text-slate-600">
                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                                            {place}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        ))}
                    </div>

                    <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
                        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-800">What to copy</p>
                            <h2 className="mt-2 text-xl font-black text-slate-950">Use every letter, number, dash, and suffix shown in the model field.</h2>
                            <p className="mt-3 text-sm leading-6 text-slate-600">A small suffix can identify a different revision or regional version. When a FixCodeDB guide says “MODEL-SPECIFIC,” confirm compatibility using that complete value before purchase.</p>
                        </section>

                        <section className="rounded-2xl bg-slate-950 p-6 text-white">
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-400">Have it?</p>
                            <h2 className="mt-2 text-xl font-black">Return to the diagnostic database</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-300">Search the error code or symptom, then use your model number when verifying the recommended part.</p>
                            <Link href="/#diagnostic-search" className="mt-5 inline-flex rounded-xl bg-emerald-500 px-4 py-3 text-sm font-black text-slate-950 hover:bg-emerald-400">Search FixCodeDB →</Link>
                        </section>
                    </div>
                </div>
            </section>
        </main>
    );
}
