'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CodeItem {
    brand: string;
    appliance: string;
    code: string;
    title: string;
    description: string;
    part_name: string;
    part_number: string;
}

export default function SearchSection({ codes }: { codes: CodeItem[] }) {
    const [query, setQuery] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('all');

    const brands = ['all', ...Array.from(new Set(codes.map((c) => c.brand.toLowerCase())))];

    const filteredCodes = codes.filter((item) => {
        const matchesQuery =
            item.code.toLowerCase().includes(query.toLowerCase()) ||
            item.brand.toLowerCase().includes(query.toLowerCase()) ||
            item.appliance.toLowerCase().includes(query.toLowerCase()) ||
            item.title.toLowerCase().includes(query.toLowerCase());

        const matchesBrand =
            selectedBrand === 'all' || item.brand.toLowerCase() === selectedBrand.toLowerCase();

        return matchesQuery && matchesBrand;
    });

    return (
        <section className="w-full">
            {/* Search Input Box */}
            <div className="relative max-w-2xl mx-auto mb-6">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type an error code or brand (e.g., 4E, F21, Samsung)..."
                    className="w-full px-5 py-4 text-slate-900 bg-white border border-slate-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-all"
                />
                {query && (
                    <button
                        onClick={() => setQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm font-bold bg-slate-100 rounded-full px-2 py-0.5"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Brand Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                <span className="text-xs font-semibold text-slate-400 uppercase mr-1">Filter Brand:</span>
                {brands.map((brand) => (
                    <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${selectedBrand === brand
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                            }`}
                    >
                        {brand}
                    </button>
                ))}
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCodes.length > 0 ? (
                    filteredCodes.map((item) => (
                        <Link
                            key={`${item.brand}-${item.appliance}-${item.code}`}
                            href={`/code/${item.brand}/${item.appliance}/${item.code}`}
                            className="group bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                                        {item.brand} • {item.appliance}
                                    </span>
                                    <span className="text-xs font-mono font-bold text-blue-600 group-hover:underline">
                                        Code: {item.code.toUpperCase()}
                                    </span>
                                </div>
                                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-slate-600 mt-2 line-clamp-2">{item.description}</p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                <span>Part: <strong className="text-slate-700">{item.part_name}</strong></span>
                                <span className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                                    Diagnostic Guide →
                                </span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200">
                        <p className="text-slate-600 font-medium">No error codes found matching &quot;{query}&quot;.</p>
                        <p className="text-xs text-slate-400 mt-1">Try checking for typos or clear your search query.</p>
                    </div>
                )}
            </div>
        </section>
    );
}