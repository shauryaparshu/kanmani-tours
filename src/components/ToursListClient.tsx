'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Tour } from '@/lib/tours';
import { formatDateRange, formatPriceJPY } from '@/lib/tours';

// ─── Types ────────────────────────────────────────────────────────────────────
type StatusFilter = 'all' | 'upcoming' | 'past';

interface Filters {
    year: string;
    categories: string[];
    status: StatusFilter;
    search: string;
}

interface Props {
    tours: Tour[];
    allCategories: string[];
}

// ─── Category colors ──────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
    Celebrity: { bg: '#7c3aed', text: '#fff' },       // Purple + white text
    Food: { bg: '#16a34a', text: '#fff' },       // Green
    Cultural: { bg: '#2563eb', text: '#fff' },       // Blue
    Nature: { bg: '#22c55e', text: '#fff' },
    Heritage: { bg: '#eab308', text: '#fff' },
    Adventure: { bg: '#ef4444', text: '#fff' },
};
const catBg = (c: string) => CATEGORY_COLORS[c]?.bg ?? '#64748b';
const catText = (c: string) => CATEGORY_COLORS[c]?.text ?? '#fff';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isTourUpcoming(tour: Tour): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(tour.startDate);
    start.setHours(0, 0, 0, 0);
    return start > today;
}

function defaultSort(tours: Tour[]): Tour[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = tours
        .filter(t => {
            const start = new Date(t.startDate);
            start.setHours(0, 0, 0, 0);
            return start > today;
        })
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const past = tours
        .filter(t => {
            const start = new Date(t.startDate);
            start.setHours(0, 0, 0, 0);
            return start <= today;
        })
        .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
    return [...upcoming, ...past];
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function TourCard({ tour }: { tour: Tour }) {
    const upcoming = isTourUpcoming(tour);
    return (
        <article className="tlc-card">
            <Link href={`/tours/${tour.slug}`} className="tlc-card-img-link" tabIndex={-1} aria-hidden>
                <div className="tlc-img-wrap">
                    <img
                        src={tour.coverImage || `https://placehold.co/640x400/1c2331/ffffff?text=${encodeURIComponent(tour.title)}`}
                        alt={tour.title}
                        className="tlc-img"
                        onError={e => {
                            (e.currentTarget as HTMLImageElement).src =
                                `https://placehold.co/640x400/1c2331/ffffff?text=${encodeURIComponent(tour.title)}`;
                        }}
                    />
                    <span
                        className="tlc-badge"
                        style={{ background: catBg(tour.category), color: catText(tour.category) }}
                    >
                        {tour.category}
                    </span>
                    {!upcoming && <span className="tlc-past-pill">Past</span>}
                </div>
            </Link>
            <div className="tlc-body">
                <p className="tlc-dates">{formatDateRange(tour.startDate, tour.endDate)}</p>
                <h2 className="tlc-title">
                    <Link href={`/tours/${tour.slug}`}>{tour.title}</Link>
                </h2>
                <p className="tlc-location">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="var(--primary)">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    {tour.location}
                </p>
                <p className="tlc-desc">{tour.shortDescription}</p>
                <div className="tlc-footer">
                    <Link href={`/tours/${tour.slug}`} className="tlc-btn">
                        Learn More →
                    </Link>
                </div>
            </div>
        </article>
    );
}

// ─── Main client component ────────────────────────────────────────────────────
export default function ToursListClient({ tours, allCategories }: Props) {
    const [filters, setFilters] = useState<Filters>({
        year: '',
        categories: [],
        status: 'all',
        search: '',
    });

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const upcomingCount = useMemo(
        () => tours.filter(t => new Date(t.endDate) >= today).length,
        [tours, today]
    );
    const pastCount = tours.length - upcomingCount;

    // Derive unique years from tour data for the dropdown
    const availableYears = useMemo(() =>
        [...new Set(
            tours.flatMap(t => [
                new Date(t.startDate).getFullYear(),
                new Date(t.endDate).getFullYear(),
            ])
        )].sort(),
        [tours]
    );

    const filtered = useMemo(() => {
        let result = [...tours];

        // Search
        if (filters.search.trim()) {
            const q = filters.search.toLowerCase();
            result = result.filter(
                t =>
                    t.title.toLowerCase().includes(q) ||
                    t.shortDescription.toLowerCase().includes(q) ||
                    t.location.toLowerCase().includes(q)
            );
        }

        // Category
        if (filters.categories.length > 0) {
            result = result.filter(t => filters.categories.includes(t.category));
        }

        // Status
        if (filters.status === 'upcoming') {
            result = result.filter(t => {
                const start = new Date(t.startDate);
                start.setHours(0, 0, 0, 0);
                return start > today;
            });
        } else if (filters.status === 'past') {
            result = result.filter(t => {
                const start = new Date(t.startDate);
                start.setHours(0, 0, 0, 0);
                return start <= today;
            });
        }

        // Year
        if (filters.year) {
            const y = parseInt(filters.year);
            result = result.filter(
                t =>
                    new Date(t.startDate).getFullYear() === y ||
                    new Date(t.endDate).getFullYear() === y
            );
        }

        // Sort
        if (filters.status === 'upcoming') {
            result.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        } else if (filters.status === 'past') {
            result.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
        } else {
            result = defaultSort(result);
        }

        return result;
    }, [tours, filters, today]);

    const hasFilters = !!(
        filters.year ||
        filters.categories.length > 0 ||
        filters.status !== 'all' ||
        filters.search.trim()
    );

    const clearFilters = () =>
        setFilters({ year: '', categories: [], status: 'all', search: '' });

    const toggleCategory = (cat: string) => {
        setFilters(prev => ({
            ...prev,
            categories: prev.categories.includes(cat)
                ? prev.categories.filter(c => c !== cat)
                : [...prev.categories, cat],
        }));
    };

    return (
        <div className="tlc-wrapper">
            {/* ── Filter Bar ── */}
            <div className="tlc-filter-bar">
                <div className="container tlc-filter-inner">

                    {/* Search — fixed 220px */}
                    <div className="tlc-search-wrap">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" className="tlc-search-icon">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            className="tlc-search-input"
                            placeholder="Search tours…"
                            value={filters.search}
                            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                    </div>

                    {/* Status toggle */}
                    <div className="tlc-toggle">
                        {(['all', 'upcoming', 'past'] as StatusFilter[]).map(s => (
                            <button
                                key={s}
                                className={`tlc-toggle-btn ${filters.status === s ? 'active' : ''}`}
                                onClick={() => setFilters(prev => ({ ...prev, status: s }))}
                            >
                                {s === 'all'
                                    ? `All (${tours.length})`
                                    : s === 'upcoming'
                                        ? `Upcoming (${upcomingCount})`
                                        : `Past (${pastCount})`}
                            </button>
                        ))}
                    </div>

                    {/* Year dropdown + Clear button — grouped right next to each other */}
                    <div className="tlc-year-clear-group">
                        <div className="tlc-year-wrap">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="tlc-year-icon">
                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                <path d="M16 2v4M8 2v4M3 10h18" />
                            </svg>
                            <select
                                className="tlc-year-select"
                                value={filters.year}
                                onChange={e => setFilters(prev => ({ ...prev, year: e.target.value }))}
                            >
                                <option value="">All Years</option>
                                {availableYears.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                        {/* Clear — right beside the year dropdown */}
                        <button
                            className={`tlc-clear-btn ${hasFilters ? 'visible' : 'hidden'}`}
                            onClick={clearFilters}
                            aria-hidden={!hasFilters}
                            tabIndex={hasFilters ? 0 : -1}
                        >
                            ✕ Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Results ── */}
            <section className="container tlc-results">
                <div className="tlc-results-header">
                    <p className="tlc-result-count">
                        {filtered.length === 0 ? 'No tours found' : `${filtered.length} tour${filtered.length === 1 ? '' : 's'} found`}
                    </p>

                    {/* Category pills — below filter bar, right of count */}
                    <div className="tlc-cat-group">
                        {allCategories.map(cat => {
                            const isActive = filters.categories.includes(cat);
                            return (
                                <button
                                    key={cat}
                                    className={`tlc-cat-pill ${isActive ? 'active' : ''}`}
                                    style={isActive
                                        ? { background: catBg(cat), borderColor: catBg(cat), color: catText(cat) }
                                        : { borderColor: catBg(cat), color: catBg(cat) }}
                                    onClick={() => toggleCategory(cat)}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                        {filters.categories.length > 0 && (
                            <button
                                className="tlc-inline-clear"
                                onClick={() => setFilters(prev => ({ ...prev, categories: [] }))}
                            >
                                ✕ Clear
                            </button>
                        )}
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="tlc-empty">
                        <div className="tlc-empty-icon">🗺️</div>
                        <h3>No tours match your current filters</h3>
                        <p>Try broadening your search or clearing the filters below.</p>
                        <button className="tlc-btn-clear-empty" onClick={clearFilters}>Clear All Filters</button>
                    </div>
                ) : (
                    <div className="tlc-grid">
                        {filtered.map(tour => (
                            <TourCard key={tour.id} tour={tour} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
