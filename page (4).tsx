import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Appliance Repair Safety Disclaimer',
    description: 'Important electrical, gas, refrigerant, combustion, and mechanical safety guidance for using FixCodeDB appliance troubleshooting information.',
    alternates: { canonical: '/safety' },
};

export default function SafetyPage() {
    return (
        <main className="bg-slate-50 py-12 sm:py-16">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
                <div className="surface-card overflow-hidden">
                    <div className="border-b border-slate-200 bg-white p-7 sm:p-9">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Safety disclaimer</p>
                        <h1 className="mt-2 text-3xl font-black tracking-[-0.03em] text-slate-950 sm:text-4xl">Know when to stop troubleshooting.</h1>
                        <p className="mt-4 text-sm leading-7 text-slate-600">FixCodeDB is an informational diagnostic reference. Appliance repair can expose you to hazardous electrical energy, gas, refrigerant, combustion products, hot surfaces, sharp edges, water, and moving components.</p>
                    </div>

                    <div className="space-y-6 p-7 sm:p-9">
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                            <h2 className="font-black text-red-900">Disconnect energy sources before service.</h2>
                            <p className="mt-2 text-sm leading-6 text-red-800">Turn off and unplug electrical appliances before opening panels whenever the procedure permits. Shut off gas and water supplies when relevant. Never bypass safety switches or protective devices.</p>
                        </div>

                        <SafetySection title="Live electrical testing" text="Do not perform live-voltage measurements unless you are trained, equipped, and qualified to do so. Stored energy can remain in capacitors after power is removed." />
                        <SafetySection title="Gas, combustion, and venting" text="Gas leaks, ignition systems, burners, pressure switches, flue systems, and combustion problems can create fire or carbon-monoxide hazards. Use a qualified technician when the repair moves beyond basic visual checks." />
                        <SafetySection title="Refrigerant and sealed systems" text="Do not open or alter sealed refrigerant circuits unless you hold the qualifications required for that work in your jurisdiction." />
                        <SafetySection title="Heavy and moving equipment" text="Washers, dryers, refrigerators, and HVAC equipment can be heavy or unstable. Use proper lifting practices and do not work beneath unsupported equipment." />
                        <SafetySection title="Information limitations" text="Error-code meanings and service procedures can vary by exact model and production revision. Verify instructions against the manufacturer documentation for your unit whenever available." />

                        <p className="border-t border-slate-200 pt-6 text-xs leading-6 text-slate-500">FixCodeDB assumes no liability for injury, property damage, equipment damage, or incorrect diagnosis resulting from use of the website. If you are uncertain about a repair, stop and contact a qualified professional.</p>

                        <Link href="/#diagnostic-search" className="inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-emerald-700">Return to diagnostics →</Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

function SafetySection({ title, text }: { title: string; text: string }) {
    return (
        <section>
            <h2 className="text-lg font-black text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
        </section>
    );
}
