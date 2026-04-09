'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Tour } from '@/lib/tours';
import { formatDateRange, formatPriceJPY } from '@/lib/tours';
import { getCategoryColor, getCategoryLabel } from '@/lib/categories';
import { useTranslations } from 'next-intl';

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
    categories: any[];
}

const catBg = (c: string, cats: any[]) => getCategoryColor(c, cats);
const catText = (c: string) => '#fff';

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
function TourCard({ tour, tLabels, categories }: { tour: Tour; tLabels: any, categories: any[] }) {
    const upcoming = isTourUpcoming(tour);
    const showComingSoon = upcoming && tour.isComingSoon;
    const [hovered, setHovered] = useState(false);

    return (
        <Link href={`/tours/${tour.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <article 
            style={{
                backgroundColor: 'transparent',
                borderRadius: '0',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
                <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', position: 'relative', backgroundColor: '#1a1918' }}>
                    {tour.coverImage ? (
                        <img
                            src={tour.coverImage}
                            alt={tour.title}
                            style={{
                                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                                transition: 'transform 0.5s ease',
                                transform: hovered ? 'scale(1.03)' : 'scale(1)'
                            }}
                        />
                    ) : (
                        <div style={{
                            width: '100%', height: '100%',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            backgroundImage: 'radial-gradient(circle at center, rgba(212,154,54,0.15) 0%, transparent 60%)'
                        }}>
                            <span style={{
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                fontSize: '18px', letterSpacing: '0.2em', color: 'rgba(212,154,54,0.4)',
                                textTransform: 'uppercase'
                            }}>
                                Srikan Tours
                            </span>
                        </div>
                    )}
                    
                    {/* Badge Wrapper */}
                    <div style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        zIndex: 3
                    }}>
                        {!upcoming && (
                            <span style={{ 
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '10px',
                                fontWeight: '600',
                                letterSpacing: '0.15em',
                                color: '#FFFFFF',
                                backgroundColor: '#1a1918',
                                padding: '6px 14px',
                                textTransform: 'uppercase'
                            }}>
                                {tLabels('past')}
                            </span>
                        )}
                        <span
                            style={{ 
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '10px',
                                fontWeight: '600',
                                letterSpacing: '0.22em',
                                color: '#1a1918',
                                backgroundColor: '#d49a36',
                                padding: '6px 14px',
                                textTransform: 'uppercase'
                            }}
                        >
                            {getCategoryLabel(tour.category, categories)}
                        </span>
                    </div>
                </div>
            <div style={{ padding: '1.5rem 0', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#4a4a4a',
                    letterSpacing: '0.08em',
                    marginBottom: '8px'
                }}>
                    {showComingSoon && tour.dateDisplay ? tour.dateDisplay : formatDateRange(tour.startDate, tour.endDate)}
                </p>
                <h2 style={{ marginBottom: '8px' }}>
                    <span style={{
                        fontFamily: "'Jost', Arial, sans-serif",
                        fontSize: '20px',
                        fontWeight: '600',
                        color: hovered ? '#d49a36' : '#1C1917',
                        letterSpacing: '0.5px',
                        lineHeight: '1.3',
                        transition: 'color 0.3s ease',
                        fontVariantNumeric: 'lining-nums'
                    }}>
                        {tour.title}
                    </span>
                </h2>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '12px',
                    color: '#4a4a4a',
                    letterSpacing: '0.06em',
                    marginBottom: '12px'
                }}>
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="#4a4a4a">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    {tour.location?.toUpperCase()}
                </div>
                
                {showComingSoon && (
                    <div style={{
                        fontFamily: "'Jost', Arial, sans-serif",
                        fontSize: '11px',
                        fontWeight: '500',
                        letterSpacing: '0.15em',
                        color: '#C9933A',
                        textTransform: 'uppercase',
                        marginBottom: '12px'
                    }}>
                        {tLabels('comingSoon')}
                    </div>
                )}

                <p style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '16px',
                    color: '#4A4540',
                    lineHeight: '1.6',
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: '3',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {tour.shortDescription}
                </p>

                {upcoming && tour.seatsLeft > 0 && tour.seatsLeft <= 5 && (
                    <div style={{
                        fontFamily: "'Jost', Arial, sans-serif",
                        fontSize: '11px',
                        fontWeight: '600',
                        letterSpacing: '0.15em',
                        color: '#1C1917',
                        backgroundColor: 'rgba(201, 147, 58, 0.12)',
                        border: '1px solid rgba(201, 147, 58, 0.3)',
                        padding: '6px 14px',
                        textTransform: 'uppercase',
                        borderRadius: '0',
                        display: 'inline-block',
                        marginBottom: '16px',
                        alignSelf: 'flex-start'
                    }}>
                        ONLY {tour.seatsLeft} SEATS LEFT
                    </div>
                )}

                <div style={{ marginTop: 'auto' }}>
                    <span style={{
                        fontFamily: "'Jost', Arial, sans-serif",
                        fontSize: '13px',
                        fontWeight: '600',
                        letterSpacing: '0.2em',
                        color: '#d49a36',
                        textTransform: 'uppercase',
                        paddingBottom: '2px',
                        display: 'inline-block'
                    }}>
                        {upcoming ? tLabels('learnMore') : 'TOUR DETAILS'} →
                    </span>
                </div>
            </div>
        </article>
        </Link>
    );
}

// ─── Main client component ────────────────────────────────────────────────────
export default function ToursListClient({ tours, categories }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations('Tours');
    const tLabels = useTranslations('Buttons');

    const [filters, setFilters] = useState<Filters>({
        year: '',
        categories: [],
        status: 'all',
        search: '',
    });

    // Sync from URL on load
    useEffect(() => {
        const cat = searchParams?.get('category');
        if (cat) {
            setFilters(prev => ({ ...prev, categories: [cat] }));
        }
    }, [searchParams]);

    const updateUrl = (cats: string[]) => {
        const params = new URLSearchParams(searchParams?.toString() || '');
        if (cats.length > 0) {
            params.set('category', cats[0]); // Simple single-category URL sync for now as per shared patterns
        } else {
            params.delete('category');
        }
        router.push(`?${params.toString()}`, { scroll: false });
    };

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

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cat = e.target.value;
        const nextCats = cat ? [cat] : [];
        setFilters(prev => ({
            ...prev,
            categories: nextCats,
        }));
        updateUrl(nextCats);
    };

    return (
        <div style={{ backgroundColor: '#FAFAF7', width: '100%', minHeight: '100vh', paddingBottom: '80px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
            {/* ── Filter Bar ── */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #e0d8c8',
                paddingBottom: '1rem',
                paddingTop: '1.5rem',
                marginBottom: '2rem'
            }}>
                {/* Left Side: Category & Search */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {/* Category Select */}
                    <select
                        className="tlc-category-select"
                        style={{
                            fontFamily: "'Jost', Arial, sans-serif",
                            fontSize: '13px',
                            fontWeight: '400',
                            letterSpacing: '0.08em',
                            color: '#1C1917',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E8E4DC',
                            padding: '10px 16px',
                            outline: 'none',
                            cursor: 'pointer',
                            minWidth: '220px'
                        }}
                        value={filters.categories[0] || ''}
                        onChange={handleCategoryChange}
                        onFocus={(e) => e.target.style.borderColor = '#C9933A'}
                        onBlur={(e) => e.target.style.borderColor = '#E8E4DC'}
                    >
                        <option value="">{t('allCategories')}</option>
                        {categories.map(cat => (
                            <option key={cat.key} value={cat.key}>
                                {cat.label}
                            </option>
                        ))}
                    </select>

                    {/* Search Input */}
                    <div style={{ position: 'relative', width: '280px' }}>
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={filters.search}
                            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            style={{
                                width: '100%',
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '13px',
                                color: '#1C1917',
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E8E4DC',
                                padding: '10px 16px',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#C9933A'}
                            onBlur={(e) => e.target.style.borderColor = '#E8E4DC'}
                        />
                    </div>
                </div>

                {/* Center: Status Toggles */}
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {(['all', 'upcoming', 'past'] as StatusFilter[]).map(s => {
                        const isActive = filters.status === s;
                        return (
                            <button
                                key={s}
                                onClick={() => setFilters(prev => ({ ...prev, status: s }))}
                                style={{
                                    fontFamily: "'Jost', Arial, sans-serif",
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    color: isActive ? '#d49a36' : '#6B6560',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    borderBottom: isActive ? '2px solid #d49a36' : '2px solid transparent',
                                    padding: '4px 0',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {s === 'all'
                                    ? t('all')
                                    : s === 'upcoming'
                                        ? t('upcoming')
                                        : t('past')}
                            </button>
                        );
                    })}
                </div>

                {/* Right Side: Year, Clear, and Count */}
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <select
                        style={{
                            fontFamily: "'Jost', Arial, sans-serif",
                            fontSize: '13px',
                            color: '#1C1917',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E8E4DC',
                            padding: '10px 16px',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                        value={filters.year}
                        onChange={e => setFilters(prev => ({ ...prev, year: e.target.value }))}
                        onFocus={(e) => e.target.style.borderColor = '#C9933A'}
                        onBlur={(e) => e.target.style.borderColor = '#E8E4DC'}
                    >
                        <option value="">All Years</option>
                        {availableYears.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                    
                    <button
                        onClick={clearFilters}
                        style={{
                            visibility: hasFilters ? 'visible' : 'hidden',
                            fontFamily: "'Jost', Arial, sans-serif",
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#9A948F',
                            backgroundColor: 'transparent',
                            border: 'none',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            letterSpacing: '0.1em'
                        }}
                    >
                        {tLabels('clear')}
                    </button>

                    <span style={{
                        fontFamily: "'Jost', Arial, sans-serif",
                        fontSize: '13px',
                        fontWeight: '400',
                        letterSpacing: '0.12em',
                        color: '#9A948F',
                        textTransform: 'uppercase',
                        marginLeft: '0.5rem',
                        borderLeft: '1px solid #e0d8c8',
                        paddingLeft: '1.5rem'
                    }}>
                        {filtered.length === 0 ? '0 Tours' : `${filtered.length} Tour${filtered.length === 1 ? '' : 's'} Found`}
                    </span>
                </div>
            </div>

            {/* ── Results ── */}
            <section style={{ padding: '0' }}>

                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '100px 0', color: '#9A948F' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: '500' }}>{tLabels('noTours')}</h3>
                        <button 
                            onClick={clearFilters}
                            style={{
                                marginTop: '20px',
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '12px',
                                fontWeight: '500',
                                letterSpacing: '0.15em',
                                color: '#C9933A',
                                backgroundColor: 'transparent',
                                border: '1px solid #C9933A',
                                padding: '10px 24px',
                                cursor: 'pointer',
                                textTransform: 'uppercase'
                            }}
                        >
                            {tLabels('clearAll')}
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '2.5rem'
                    }}>
                        {filtered.map(tour => (
                            <TourCard key={tour.id} tour={tour} tLabels={tLabels} categories={categories} />
                        ))}
                    </div>
                )}
            </section>
            </div>
        </div>
    );
}
