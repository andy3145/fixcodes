'use client';

import Link from 'next/link';
import { useState } from 'react';

interface FeedbackWidgetProps {
    brand: string;
    code: string;
}

type Feedback = 'yes' | 'no' | null;

export default function FeedbackWidget({ brand, code }: FeedbackWidgetProps) {
    const [feedback, setFeedback] = useState<Feedback>(null);

    return (
        <section className="surface-card p-6 text-center sm:p-7" aria-labelledby="feedback-title">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-700">Was this useful?</p>
            <h2 id="feedback-title" className="mt-2 text-xl font-black tracking-tight text-slate-950">
                Did these checks help with your {brand} {code} error?
            </h2>

            {feedback === null && (
                <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => setFeedback('yes')}
                        className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-emerald-700"
                    >
                        Yes, this helped
                    </button>
                    <button
                        type="button"
                        onClick={() => setFeedback('no')}
                        className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50"
                    >
                        No, I still need help
                    </button>
                </div>
            )}

            {feedback === 'yes' && (
                <div className="animate-fade-up mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
                    Glad it helped. Before ordering anything, verify the full appliance model number so the replacement part matches your exact unit.
                </div>
            )}

            {feedback === 'no' && (
                <div className="animate-fade-up mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5 text-left">
                    <p className="text-sm font-black text-slate-950">Try one of these next steps:</p>
                    <div className="mt-3 flex flex-col gap-2 text-sm font-bold">
                        <Link href="/#diagnostic-search" className="rounded-lg bg-white px-3 py-2 text-emerald-700 shadow-sm hover:text-emerald-800">Search another symptom or code →</Link>
                        <Link href="/model-number" className="rounded-lg bg-white px-3 py-2 text-slate-700 shadow-sm hover:text-emerald-800">Verify your exact model number →</Link>
                        <Link href="/safety" className="rounded-lg bg-white px-3 py-2 text-slate-700 shadow-sm hover:text-emerald-800">Review when to stop DIY troubleshooting →</Link>
                    </div>
                </div>
            )}
        </section>
    );
}
