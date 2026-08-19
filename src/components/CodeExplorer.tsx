'use client';

import React, { useState, useDeferredValue, useMemo, useRef } from 'react';
import Link from 'next/link';
import { buildCodeHref } from '@/lib/slug';

interface CodeItem {
    brand: string;
    appliance: string;
    code: string;
    title?: string;
    description?: string;
}

interface CodeExplorerProps {
    items: CodeItem[];
}

interface IndexedCodeItem {
    item: CodeItem;
    searchText: string;
}

const ALL = '__all__';
const INITIAL_RESULT_LIMIT = 24;
const RESULT_INCREMENT = 24;

function normalize(value: string): string {
    return value.trim().toLocaleLowerCase();
}

function formatAppliance(value: string): string {
    return value
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function uniqueSorted(values: string[]): string[] {
    return Array.from(new Set(values)).sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true })
    );
}

export default function CodeExplorer({ items }: CodeExplorerProps) {
    const [query, setQuery] = useState<string>('');
    const [brandFilter, setBrandFilter] = useState<string>(ALL);
    const [applianceFilter, setApplianceFilter] = useState<string>(ALL);
    const [visibleCount, setVisibleCount] = useState<number>(INITIAL_RESULT_LIMIT);

    const searchInputRef = useRef<HTMLInputElement>(null);
    const deferredQuery = useDeferredValue(query);

    const indexedItems = useMemo<IndexedCodeItem[]>(() => {
        return items.map((item) => ({
            item,
            searchText: normalize([item.brand, item.appliance, item.code, item.title ?? '', item.description ?? ''].join(' ')),
        }));
    }, [items]);

    const availableBrands = useMemo(() => uniqueSorted(items.map((i) => i.brand)), [items]);

    const availableAppliances = useMemo(() => {
        const filtered = brandFilter === ALL ? items : items.filter((i) => i.brand === brandFilter);
        return uniqueSorted(filtered.map((i) => i.appliance));
    }, [items, brandFilter]);

    const filteredItems = useMemo(() => {
        const q = normalize(deferredQuery);

        return indexedItems.filter(({ item, searchText }) => {
            if (brandFilter !== ALL && item.brand !== brandFilter) return false;
            if (applianceFilter !== ALL && item.appliance !== applianceFilter) return false;

            if (q) {
                const terms = q.split(/\s+/);
                for (const term of terms) {
                    if (!searchText.includes(term)) return false;
                }
            }

            return true;
        }).map(({ item }) => item);
    }, [indexedItems, deferredQuery, brandFilter, applianceFilter]);

    const visibleItems = filteredItems.slice(0, visibleCount);

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div>
                    <label htmlFor="search-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Search Error Code, Symptom, or Brand
                    </label>
                    <div className="relative">
                        <input
                            ref={searchInputRef}
                            id="search-input"
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setVisibleCount(INITIAL_RESULT_LIMIT);
                            }}
                            placeholder="e.g. Whirlpool F5E2, LG UE, refrigerator not cooling..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-11 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-sm"
                        />
                        <svg className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        {query && (
                            <button
                                onClick={() => {
                                    setQuery('');
                                    searchInputRef.current?.focus();
                                }}
                                className="absolute right-3 top-3 text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-600 px-2 py-1 rounded-md transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                        <label htmlFor="brand-filter" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Filter by Brand</label>
                        <select
                            id="brand-filter"
                            value={brandFilter}
                            onChange={(e) => {
                                setBrandFilter(e.target.value);
                                setApplianceFilter(ALL);
                                setVisibleCount(INITIAL_RESULT_LIMIT);
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        >
                            <option value={ALL}>All Brands ({availableBrands.length})</option>
                            {availableBrands.map((brand) => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="appliance-filter" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Filter by Appliance</label>
                        <select
                            id="appliance-filter"
                            value={applianceFilter}
                            onChange={(e) => {
                                setApplianceFilter(e.target.value);
                                setVisibleCount(INITIAL_RESULT_LIMIT);
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        >
                            <option value={ALL}>All Appliances</option>
                            {availableAppliances.map((app) => (
                                <option key={app} value={app}>{formatAppliance(app)}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between px-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Showing <span className="text-slate-900">{visibleItems.length}</span> of <span className="text-slate-900">{filteredItems.length}</span> matching guides
                </p>
                {(query || brandFilter !== ALL || applianceFilter !== ALL) && (
                    <button
                        onClick={() => {
                            setQuery('');
                            setBrandFilter(ALL);
                            setApplianceFilter(ALL);
                            setVisibleCount(INITIAL_RESULT_LIMIT);
                        }}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                        Reset all filters
                    </button>
                )}
            </div>

            {visibleItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {visibleItems.map((item, idx) => (
                        <Link
                            key={idx}
                            href={buildCodeHref(item)}
                            className="bg-white border border-slate-200 rounded-xl p-5 hover:border-emerald-500 hover:shadow-sm transition-all group flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="bg-slate-100 text-slate-800 font-bold text-xs px-2.5 py-1 rounded-md uppercase tracking-wide border border-slate-200 group-hover:bg-emerald-50 group-hover:text-emerald-800 group-hover:border-emerald-200 transition-colors">
                                        {item.brand}
                                    </span>
                                    <span className="text-xs font-medium text-slate-400 capitalize">
                                        {formatAppliance(item.appliance)}
                                    </span>
                                </div>
                                <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-emerald-600 transition-colors uppercase">
                                    Code {item.code}
                                </h3>
                                {item.title && <p className="text-xs text-slate-600 mt-1 line-clamp-1">{item.title}</p>}
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-emerald-600">
                                <span>View diagnostic steps & parts</span>
                                <span>&rarr;</span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No repair guides found</h3>
                    <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                        We couldn't find any error codes matching your search or filter combination. Try resetting your filters or typing a broader keyword.
                    </p>
                    <button
                        onClick={() => {
                            setQuery('');
                            setBrandFilter(ALL);
                            setApplianceFilter(ALL);
                        }}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors"
                    >
                        Clear Search & Filters
                    </button>
                </div>
            )}

            {visibleCount < filteredItems.length && (
                <div className="text-center pt-6">
                    <button
                        onClick={() => setVisibleCount((prev) => prev + RESULT_INCREMENT)}
                        className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-6 py-3 rounded-xl text-xs shadow-2xs transition-all hover:bg-slate-50"
                    >
                        Load More Guides ({filteredItems.length - visibleCount} remaining)
                    </button>
                </div>
            )}
        </div>
    );
}
