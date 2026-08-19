'use client';

import { useState } from 'react';

interface FeedbackWidgetProps {
    brand: string;
    code: string;
}

export default function FeedbackWidget({ brand, code }: FeedbackWidgetProps) {
    const [feedback, setFeedback] = useState<null | 'yes' | 'no'>(null);

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 my-8 shadow-sm text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
                Did this fix your {brand} {code} error?
            </h3>
            
            {!feedback ? (
                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={() => setFeedback('yes')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                    >
                        Yes, it fixed it!
                    </button>
                    <button
                        onClick={() => setFeedback('no')}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                        No, still broken
                    </button>
                </div>
            ) : feedback === 'yes' ? (
                <p className="text-emerald-600 font-semibold mt-3 animate-fade-in">
                    Awesome! Glad we could help get your appliance running. 🎉
                </p>
            ) : (
                <div className="mt-3 text-slate-700 animate-fade-in">
                    <p className="font-semibold text-red-600 mb-1">Sorry to hear that.</p>
                    <p className="text-sm text-slate-600">
                        If the steps didn't resolve it, the part may be completely failed, or there could be a secondary underlying issue. Consider double-checking the wiring harness or consulting a professional.
                    </p>
                </div>
            )}
        </div>
    );
}
