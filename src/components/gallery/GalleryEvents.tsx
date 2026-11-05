'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import TourGallery, { type GalleryPhoto } from '@/components/tours/detail/TourGallery';
import ArrowBox from '@/components/ui/ArrowBox';
import styles from './GalleryEvents.module.css';

export interface GalleryEvent {
    id: string;
    title: string;
    href: string;
    category?: string;
    categoryLabel?: string;
    dates: string;
    photos: GalleryPhoto[];
}

export default function GalleryEvents({ events }: { events: GalleryEvent[] }) {
    const t = useTranslations('Gallery');
    const [category, setCategory] = useState('all');

    // One tab per category that has photos, in order of first appearance.
    const tabs = useMemo(() => {
        const seen = new Map<string, { label: string; count: number }>();
        for (const event of events) {
            if (!event.category) continue;
            const tab = seen.get(event.category) ?? { label: event.categoryLabel ?? event.category, count: 0 };
            tab.count += 1;
            seen.set(event.category, tab);
        }
        return [...seen].map(([key, tab]) => ({ key, ...tab }));
    }, [events]);

    const shown = category === 'all' ? events : events.filter((event) => event.category === category);

    return (
        <section className={styles.section}>
            <div className={styles.inner}>
                {tabs.length > 1 ? (
                    <div className={styles.tabs} role="group" aria-label={t('filterLabel')}>
                        {[{ key: 'all', label: t('all'), count: events.length }, ...tabs].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                className={styles.tab}
                                aria-pressed={category === tab.key}
                                onClick={() => setCategory(tab.key)}
                            >
                                {tab.label} <span className="num">{tab.count}</span>
                            </button>
                        ))}
                    </div>
                ) : null}

                {shown.length === 0 ? (
                    <p className={styles.empty}>{t('empty')}</p>
                ) : (
                    <ol className={styles.events}>
                        {shown.map((event) => (
                            <li key={event.id} className={styles.event}>
                                <div className={styles.head}>
                                    <div className={styles.titleBlock}>
                                        <p className={styles.meta}>
                                            <span className="num">{event.dates}</span>
                                            {event.categoryLabel ? <span>{event.categoryLabel}</span> : null}
                                            <span className="num">{t('photoCount', { count: event.photos.length })}</span>
                                        </p>
                                        <h2 className={styles.title}>{event.title}</h2>
                                    </div>
                                    <Link href={event.href} className={styles.tourLink}>
                                        {t('viewTour')}
                                        <ArrowBox />
                                    </Link>
                                </div>
                                <TourGallery photos={event.photos} title={event.title} />
                            </li>
                        ))}
                    </ol>
                )}
            </div>
        </section>
    );
}
