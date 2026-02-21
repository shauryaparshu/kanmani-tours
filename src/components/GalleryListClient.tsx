'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface GalleryMedia {
    type: 'image' | 'video';
    url: string;
}

interface GalleryTour {
    slug: string;
    title: string;
    shortDescription: string;
    category: string;
    startDate: string;
    endDate: string;
    year: number;
    coverImage: string;
    media: GalleryMedia[];
}

interface GalleryIndex {
    tours: GalleryTour[];
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
    Celebrity: { bg: '#7c3aed', text: '#fff' },
    Food: { bg: '#16a34a', text: '#fff' },
    Cultural: { bg: '#2563eb', text: '#fff' },
    Nature: { bg: '#22c55e', text: '#fff' },
    Heritage: { bg: '#eab308', text: '#fff' },
    Adventure: { bg: '#ef4444', text: '#fff' },
};

const catBg = (c: string) => CATEGORY_COLORS[c]?.bg ?? '#64748b';
const catText = (c: string) => CATEGORY_COLORS[c]?.text ?? '#fff';

export default function GalleryListClient() {
    const [indexData, setIndexData] = useState<GalleryIndex | null>(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        year: '',
        category: '',
    });

    useEffect(() => {
        fetch('/assets/gallery-index.json')
            .then(res => res.json())
            .then(data => {
                setIndexData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load gallery index:', err);
                setLoading(false);
            });
    }, []);

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const pastTours = useMemo(() => {
        if (!indexData) return [];
        return indexData.tours
            .filter(t => new Date(t.endDate) < today)
            .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
    }, [indexData, today]);

    const allCategories = useMemo(() => {
        return [...new Set(pastTours.map(t => t.category))].sort();
    }, [pastTours]);

    const availableYears = useMemo(() => {
        return [...new Set(pastTours.map(t => t.year))].sort((a, b) => b - a);
    }, [pastTours]);

    const filteredTours = useMemo(() => {
        return pastTours.filter(t => {
            const matchYear = !filters.year || t.year.toString() === filters.year;
            const matchCat = !filters.category || t.category === filters.category;
            return matchYear && matchCat;
        });
    }, [pastTours, filters]);

    if (loading) {
        return <div className="container py-100 text-center">Loading Gallery...</div>;
    }

    return (
        <div className="tlc-wrapper">
            {/* Filter Bar */}
            <div className="tlc-filter-bar">
                <div className="container tlc-filter-inner">
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div className="tlc-year-wrap">
                            <select
                                className="tlc-year-select"
                                value={filters.category}
                                onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
                            >
                                <option value="">All Categories</option>
                                {allCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="tlc-year-wrap">
                            <select
                                className="tlc-year-select"
                                value={filters.year}
                                onChange={e => setFilters(prev => ({ ...prev, year: e.target.value }))}
                            >
                                <option value="">All Years</option>
                                {availableYears.map(y => (
                                    <option key={y} value={y.toString()}>{y}</option>
                                ))}
                            </select>
                        </div>

                        {(filters.year || filters.category) && (
                            <button
                                className="tlc-clear-btn visible"
                                onClick={() => setFilters({ year: '', category: '' })}
                            >
                                ✕ Reset
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <section className="container tlc-results py-60">
                {filteredTours.length === 0 ? (
                    <div className="tlc-empty">
                        <div className="tlc-empty-icon">📸</div>
                        <h3>No galleries found matching your filters</h3>
                        <p>We're constantly adding new memories. Try a different category or year.</p>
                        <button className="tlc-btn-clear-empty" onClick={() => setFilters({ year: '', category: '' })}>
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="tlc-grid">
                        {filteredTours.map(tour => (
                            <article key={tour.slug} className="tlc-card">
                                <Link href={`/gallery/${tour.slug}`} className="tlc-card-img-link">
                                    <div className="tlc-img-wrap">
                                        <img
                                            src={tour.coverImage}
                                            alt={tour.title}
                                            className="tlc-img"
                                        />
                                        <span
                                            className="tlc-badge"
                                            style={{ background: catBg(tour.category), color: catText(tour.category) }}
                                        >
                                            {tour.category}
                                        </span>
                                    </div>
                                </Link>
                                <div className="tlc-body">
                                    <p className="tlc-dates">{new Date(tour.startDate).toLocaleDateString('en-JP', { month: 'long', year: 'numeric' })}</p>
                                    <h2 className="tlc-title">
                                        <Link href={`/gallery/${tour.slug}`}>{tour.title}</Link>
                                    </h2>
                                    <p className="tlc-desc">{tour.shortDescription}</p>
                                    <div className="tlc-footer">
                                        <Link href={`/gallery/${tour.slug}`} className="tlc-btn">
                                            View Media ({tour.media.length}) →
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <style jsx>{`
                .py-100 { padding: 100px 0; }
                .py-60 { padding: 60px 0; }
                .text-center { text-align: center; }
            `}</style>
        </div>
    );
}
