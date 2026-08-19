'use client';

import Link from 'next/link';
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import type { SearchableCode } from '@/lib/codes';
import { codeHref } from '@/lib/slug';

interface CodeExplorerProps {
    items: SearchableCode[];
    initialBrand?: string;
    initialAppliance?: string;
    compact?: boolean;
    initialQuery?: string;
    syncQueryToUrl?: boolean;
}

interface IndexedCodeItem {
    item: SearchableCode;
    searchText: string;
}

const ALL = '__all__';
const INITIAL_RESULT_LIMIT = 18;
const RESULT_INCREMENT = 18;

function normalize(value: string): string {
    return value.trim().toLocaleLowerCase();
}

function uniqueSorted(values: string[]): string[] {
    return Array.from(new Set(values)).sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true }),
    );
}

export default function CodeExplorer({
    items,
    initialBrand,
    initialAppliance,
    compact = false,
    initialQuery = '',
    syncQueryToUrl = false,
}: CodeExplorerProps) {
    const [query, setQuery] = useState(initialQuery);
    const [brandFilter, setBrandFilter] = useState(initialBrand || ALL);
    const [applianceFilter, setApplianceFilter] = useState(initialAppliance || ALL);
    const [codeFilter, setCodeFilter] = useState(ALL);
    const [visibleCount, setVisibleCount] = useState(INITIAL_RESULT_LIMIT);
    const deferredQuery = useDeferredValue(query);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const indexedItems = useMemo<IndexedCodeItem[]>(
        () =>
            items.map((item) => ({
                item,
                searchText: normalize(
                    [
                        item.brand,
                        item.appliance,
                        item.code,
                        ...item.aliasCodes,
                        item.description,
                        item.haystack,
                    ].join(' '),
                ),
            })),
        [items],
    );

    const availableBrands = useMemo(() => uniqueSorted(items.map((item) => item.brand)), [items]);

    const availableAppliances = useMemo(() => {
        const relevantItems =
            brandFilter === ALL ? items : items.filter((item) => item.brand === brandFilter);
        return uniqueSorted(relevantItems.map((item) => item.appliance));
    }, [brandFilter, items]);

    const availableCodes = useMemo(() => {
        const relevantItems = items.filter((item) => {
            const brandMatch = brandFilter === ALL || item.brand === brandFilter;
            const applianceMatch = applianceFilter === ALL || item.appliance === applianceFilter;
            return brandMatch && applianceMatch;
        });
        return uniqueSorted(
            relevantItems.flatMap((item) => [item.code, ...item.aliasCodes]),
        );
    }, [applianceFilter, brandFilter, items]);

    const filteredItems = useMemo(() => {
        const terms = normalize(deferredQuery).split(/\s+/).filter(Boolean);

        return indexedItems
            .filter(({ item, searchText }) => {
                const matchesBrand = brandFilter === ALL || item.brand === brandFilter;
                const matchesAppliance = applianceFilter === ALL || item.appliance === applianceFilter;
                const matchesCode =
                    codeFilter === ALL ||
                    item.code === codeFilter ||
                    item.aliasCodes.includes(codeFilter);
                const matchesSearch = terms.every((term) => searchText.includes(term));
                return matchesBrand && matchesAppliance && matchesCode && matchesSearch;
            })
            .map(({ item }) => item);
    }, [applianceFilter, brandFilter, codeFilter, deferredQuery, indexedItems]);

    useEffect(() => {
        setVisibleCount(INITIAL_RESULT_LIMIT);
    }, [query, brandFilter, applianceFilter, codeFilter]);


    useEffect(() => {
        if (!syncQueryToUrl) return;

        const url = new URL(window.location.href);
        const normalizedQuery = query.trim();
        if (normalizedQuery) url.searchParams.set('q', normalizedQuery);
        else url.searchParams.delete('q');
        window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    }, [query, syncQueryToUrl]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent): void => {
            const target = event.target;
            const typing =
                target instanceof HTMLInputElement ||
                target instanceof HTMLTextAreaElement ||
                target instanceof HTMLSelectElement ||
                (target instanceof HTMLElement && target.isContentEditable);

            if (event.key === '/' && !typing) {
                event.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const clearFilters = (): void => {
        setQuery('');
        setBrandFilter(initialBrand || ALL);
        setApplianceFilter(initialAppliance || ALL);
        setCodeFilter(ALL);
        searchInputRef.current?.focus();
    };

    const hasFilters =
        query.trim().length > 0 ||
        brandFilter !== (initialBrand || ALL) ||
        applianceFilter !== (initialAppliance || ALL) ||
        codeFilter !== ALL;

    const visibleItems = filteredItems.slice(0, visibleCount);

    return (
        <section id="diagnostic-search" aria-labelledby="diagnostic-search-heading" className="scroll-mt-24">
            {!compact && (
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Diagnostic search</p>
                        <h2 id="diagnostic-search-heading" className="mt-1 text-2xl font-black tracking-[-0.025em] text-slate-950 sm:text-3xl">
                            Find the exact guide you need
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            Search by brand, appliance, error code, symptom, likely cause, or replacement part.
                        </p>
                    </div>
                    <p aria-live="polite" className="text-sm font-semibold text-slate-500">
                        <span className="text-slate-950">{filteredItems.length.toLocaleString()}</span>{' '}
                        {filteredItems.length === 1 ? 'guide' : 'guides'} found
                    </p>
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
                <div className="border-b border-slate-100 p-3 sm:p-4">
                    <div className="group relative">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-3.5-3.5" />
                        </svg>
                        <input
                            ref={searchInputRef}
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Try “LG UE”, “Samsung washer not draining”, “E15”, or “flame sensor”..."
                            autoComplete="off"
                            spellCheck={false}
                            aria-label="Search appliance error codes and symptoms"
                            className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-16 text-sm font-semibold text-slate-950 outline-none transition-all placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 sm:text-base"
                        />
                        {!query && (
                            <span className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-400 shadow-sm sm:block">
                                /
                            </span>
                        )}
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        <label className="relative">
                            <span className="sr-only">Filter by brand</span>
                            <select
                                value={brandFilter}
                                onChange={(event) => {
                                    setBrandFilter(event.target.value);
                                    setApplianceFilter(ALL);
                                    setCodeFilter(ALL);
                                }}
                                className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm font-bold text-slate-700 outline-none transition-all hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                            >
                                {!initialBrand && <option value={ALL}>All brands ({availableBrands.length})</option>}
                                {availableBrands.map((brand) => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                            <SelectChevron />
                        </label>

                        <label className="relative">
                            <span className="sr-only">Filter by appliance</span>
                            <select
                                value={applianceFilter}
                                onChange={(event) => {
                                    setApplianceFilter(event.target.value);
                                    setCodeFilter(ALL);
                                }}
                                className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm font-bold text-slate-700 outline-none transition-all hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                            >
                                {!initialAppliance && <option value={ALL}>All appliance types</option>}
                                {availableAppliances.map((appliance) => (
                                    <option key={appliance} value={appliance}>{appliance}</option>
                                ))}
                            </select>
                            <SelectChevron />
                        </label>

                        <label className="relative">
                            <span className="sr-only">Filter by error code</span>
                            <select
                                value={codeFilter}
                                onChange={(event) => setCodeFilter(event.target.value)}
                                className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm font-bold uppercase text-slate-700 outline-none transition-all hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                            >
                                <option value={ALL}>All error codes</option>
                                {availableCodes.map((code) => (
                                    <option key={code} value={code}>{code}</option>
                                ))}
                            </select>
                            <SelectChevron />
                        </label>
                    </div>

                    {hasFilters && (
                        <div className="mt-3 flex justify-end">
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-xs font-bold text-slate-500 transition-colors hover:text-emerald-700"
                            >
                                Clear search & filters
                            </button>
                        </div>
                    )}
                </div>

                {visibleItems.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {visibleItems.map((item) => (
                            <Link
                                key={item.id}
                                href={codeHref(item.brand, item.appliance, item.code)}
                                className="group flex items-start justify-between gap-4 p-4 transition-colors hover:bg-emerald-50/45 sm:p-5"
                            >
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-slate-700 transition-colors group-hover:border-emerald-200 group-hover:bg-emerald-100 group-hover:text-emerald-800">
                                            {item.brand}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400">{item.appliance}</span>
                                    </div>
                                    <h3 className="mt-2 text-base font-black tracking-tight text-slate-950 transition-colors group-hover:text-emerald-700 sm:text-lg">
                                        Code <span className="uppercase">{[item.code, ...item.aliasCodes].join(' / ')}</span>
                                    </h3>
                                    <p className="mt-1 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-500">{item.description}</p>
                                </div>
                                <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-all group-hover:translate-x-0.5 group-hover:border-emerald-200 group-hover:text-emerald-700" aria-hidden="true">
                                    →
                                </span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">⌕</div>
                        <h3 className="mt-4 text-lg font-black text-slate-950">No matching repair guides</h3>
                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Try the code by itself, remove a filter, or search by a broader symptom such as “not draining” or “not heating”.
                        </p>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-5 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-emerald-700"
                        >
                            Reset search
                        </button>
                    </div>
                )}
            </div>

            {visibleCount < filteredItems.length && (
                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={() => setVisibleCount((count) => count + RESULT_INCREMENT)}
                        className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md"
                    >
                        Show more guides
                    </button>
                </div>
            )}
        </section>
    );
}

function SelectChevron() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}
