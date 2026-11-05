'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { Tour } from '@/lib/tours';
import type { CategoryDef } from '@/lib/categories';
import type { Country } from '@/lib/countries';
import TourCard from './TourCard';
import { isUpcoming } from './tourDates';
import styles from './TourList.module.css';

type Status = 'all' | 'upcoming' | 'past';

interface TourListProps {
    tours: Tour[];
    categories: CategoryDef[];
    countries: Country[];
}

const startTime = (tour: Tour) => new Date(tour.startDate).getTime();
const startYear = (tour: Tour) => tour.startDate ? Number(tour.startDate.slice(0, 4)) : null;

/** Upcoming tours soonest first, then past tours newest first. */
function sortTours(tours: Tour[]): Tour[] {
    const upcoming = tours.filter((t) => isUpcoming(t.startDate)).sort((a, b) => startTime(a) - startTime(b));
    const past = tours.filter((t) => !isUpcoming(t.startDate)).sort((a, b) => startTime(b) - startTime(a));
    return [...upcoming, ...past];
}

const CARD_SIZES = '(min-width: 1200px) 25vw, (min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw';
const FEATURE_SIZES = '(min-width: 1200px) 50vw, (min-width: 900px) 66vw, 100vw';

export default function TourList({ tours, categories, countries }: TourListProps) {
    const t = useTranslations('Tours');
    const router = useRouter();
    const pathname = usePathname();

    const [status, setStatus] = useState<Status>('all');
    const [selected, setSelected] = useState<string[]>([]);
    const [year, setYear] = useState('');
    const [country, setCountry] = useState('');
    const [search, setSearch] = useState('');

    // Filters start from the URL so a filtered list can be shared as a link. The page is
    // prerendered, so the URL is read after hydration: reading it during render
    // (useSearchParams) would leave the list out of the static HTML and shift the page.
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const s = params.get('status');
        /* eslint-disable react-hooks/set-state-in-effect -- one-time sync from the URL after hydration */
        if (s === 'upcoming' || s === 'past') setStatus(s);
        const categoryParam = params.get('category');
        if (categoryParam) setSelected(categoryParam.split(',').filter(Boolean));
        const yearParam = params.get('year');
        if (yearParam) setYear(yearParam);
        const countryParam = params.get('country');
        if (countryParam) setCountry(countryParam);
        /* eslint-enable react-hooks/set-state-in-effect */
    }, []);

    const syncUrl = (next: { status?: Status; selected?: string[]; year?: string; country?: string }) => {
        const params = new URLSearchParams(window.location.search);
        const entries: [string, string][] = [
            ['status', (next.status ?? status) === 'all' ? '' : (next.status ?? status)],
            ['category', (next.selected ?? selected).join(',')],
            ['year', next.year ?? year],
            ['country', next.country ?? country],
        ];
        for (const [key, value] of entries) {
            if (value) params.set(key, value);
            else params.delete(key);
        }
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    };

    // Only offer filters that can narrow the list.
    const usedCategories = useMemo(() => {
        const inUse = new Set(tours.map((tour) => tour.category));
        const seen = new Set<string>();
        return categories.filter((c) => inUse.has(c.key) && !seen.has(c.key) && seen.add(c.key));
    }, [tours, categories]);

    const usedCountries = useMemo(() => {
        const inUse = new Set(tours.map((tour) => tour.country?.key).filter(Boolean));
        return countries.filter((c) => inUse.has(c.key));
    }, [tours, countries]);

    const years = useMemo(
        () => [...new Set(tours.map(startYear).filter((y): y is number => y !== null))].sort((a, b) => b - a),
        [tours],
    );

    const counts = useMemo(() => {
        const upcoming = tours.filter((tour) => isUpcoming(tour.startDate)).length;
        return { all: tours.length, upcoming, past: tours.length - upcoming };
    }, [tours]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return sortTours(tours.filter((tour) => {
            if (status === 'upcoming' && !isUpcoming(tour.startDate)) return false;
            if (status === 'past' && isUpcoming(tour.startDate)) return false;
            if (selected.length > 0 && !selected.includes(tour.category)) return false;
            if (year && String(startYear(tour)) !== year) return false;
            if (country && tour.country?.key !== country) return false;
            if (q && ![tour.title, tour.shortDescription, tour.location].some((field) => field?.toLowerCase().includes(q))) return false;
            return true;
        }));
    }, [tours, status, selected, year, country, search]);

    const hasFilters = status !== 'all' || selected.length > 0 || year !== '' || country !== '' || search.trim() !== '';

    const chooseStatus = (next: Status) => { setStatus(next); syncUrl({ status: next }); };
    const toggleCategory = (key: string) => {
        const next = selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key];
        setSelected(next);
        syncUrl({ selected: next });
    };
    const clearAll = () => {
        setStatus('all');
        setSelected([]);
        setYear('');
        setCountry('');
        setSearch('');
        router.replace(pathname, { scroll: false });
    };

    // A wide first card only when there are enough cards to fill the row beside it.
    const featureFirst = filtered.length >= 3;

    return (
        <section className={styles.section} aria-label={t('filtersLabel')}>
            <div className={styles.inner}>
                <div className={styles.filters}>
                    <div className={styles.statusRow} role="group" aria-label={t('statusLabel')}>
                        {(['all', 'upcoming', 'past'] as const).map((s) => (
                            <button
                                key={s}
                                type="button"
                                className={styles.statusButton}
                                aria-pressed={status === s}
                                onClick={() => chooseStatus(s)}
                            >
                                {t(s)} <span className="num">{counts[s]}</span>
                            </button>
                        ))}
                    </div>

                    <div className={styles.controls}>
                        {usedCategories.length > 1 ? (
                            <div className={styles.chips} role="group" aria-label={t('typeLabel')}>
                                {usedCategories.map((c) => (
                                    <button
                                        key={c.key}
                                        type="button"
                                        className={styles.chip}
                                        aria-pressed={selected.includes(c.key)}
                                        onClick={() => toggleCategory(c.key)}
                                    >
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                        ) : null}

                        <div className={styles.fields}>
                            {years.length > 1 ? (
                                <label className={styles.field}>
                                    <span className={styles.fieldLabel}>{t('yearLabel')}</span>
                                    <select
                                        id="tour-filter-year"
                                        className={styles.select}
                                        value={year}
                                        onChange={(e) => { setYear(e.target.value); syncUrl({ year: e.target.value }); }}
                                    >
                                        <option value="">{t('allYears')}</option>
                                        {years.map((y) => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </label>
                            ) : null}

                            {usedCountries.length > 1 ? (
                                <label className={styles.field}>
                                    <span className={styles.fieldLabel}>{t('countryLabel')}</span>
                                    <select
                                        id="tour-filter-country"
                                        className={styles.select}
                                        value={country}
                                        onChange={(e) => { setCountry(e.target.value); syncUrl({ country: e.target.value }); }}
                                    >
                                        <option value="">{t('allCountries')}</option>
                                        {usedCountries.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                                    </select>
                                </label>
                            ) : null}

                            <label className={`${styles.field} ${styles.searchField}`}>
                                <span className={styles.fieldLabel}>{t('searchLabel')}</span>
                                <input
                                    id="tour-filter-search"
                                    type="search"
                                    className={styles.input}
                                    placeholder={t('searchPlaceholder')}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div className={styles.summary}>
                    <p className={styles.count} aria-live="polite">{t('resultCount', { count: filtered.length })}</p>
                    {hasFilters ? (
                        <button type="button" className={styles.clear} onClick={clearAll}>{t('clearFilters')}</button>
                    ) : null}
                </div>

                {filtered.length > 0 ? (
                    <ul className={styles.grid}>
                        {filtered.map((tour, i) => {
                            const feature = featureFirst && i === 0;
                            return (
                                <li key={tour._id || tour.slug} className={feature ? styles.featureItem : undefined}>
                                    <TourCard
                                        tour={tour}
                                        headingLevel="h2"
                                        variant={feature ? 'feature' : 'default'}
                                        sizes={feature ? FEATURE_SIZES : CARD_SIZES}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className={styles.empty}>
                        <p>{t('noMatch')}</p>
                        <button type="button" className={styles.clear} onClick={clearAll}>{t('clearFilters')}</button>
                    </div>
                )}
            </div>
        </section>
    );
}
