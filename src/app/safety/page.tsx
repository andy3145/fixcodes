export default function SafetyPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-800">
            <main className="max-w-2xl mx-auto bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Safety Disclaimer</h1>
                
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r mb-6 text-red-700 font-medium">
                    Warning: Appliance repair involves high-voltage electricity, natural gas lines, and heavy rotating components. Always disconnect power and shut off gas supplies before servicing.
                </div>

                <p className="text-slate-700 mb-4">
                    FixCodeDB is designed as an informational database to help diagnose appliance error codes. Working with electrical components (such as control boards or heating elements) carries a risk of electric shock or fire.
                </p>

                <p className="text-slate-700 mb-4">
                    If you are uncomfortable using a multimeter, handling live circuits, or dealing with sealed refrigerant/gas systems, please hire a licensed professional. 
                </p>

                <p className="text-slate-500 text-sm mt-8">
                    FixCodeDB assumes no liability for injury, property damage, or incorrect diagnostics resulting from the use of this website.
                </p>
            </main>
        </div>
    );
}
