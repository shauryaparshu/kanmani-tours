'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { Tour } from '@/lib/tours';
import TourCard from '@/components/tours/TourCard';
import ArrowBox from '@/components/ui/ArrowBox';
import styles from './Journeys.module.css';

interface JourneysProps {
    tours: Tour[];
}

export default function Journeys({ tours }: JourneysProps) {
    const t = useTranslations('Home');
    const tButtons = useTranslations('Buttons');
    const trackRef = useRef<HTMLUListElement>(null);
    const [edges, setEdges] = useState({ start: true, end: false });

    const updateEdges = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        setEdges({
            start: el.scrollLeft <= 4,
            end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
        });
    }, []);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        const frame = requestAnimationFrame(updateEdges);
        el.addEventListener('scroll', updateEdges, { passive: true });
        window.addEventListener('resize', updateEdges);
        return () => {
            cancelAnimationFrame(frame);
            el.removeEventListener('scroll', updateEdges);
            window.removeEventListener('resize', updateEdges);
        };
    }, [updateEdges]);

    const scrollBy = (direction: 1 | -1) => {
        const el = trackRef.current;
        if (!el) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: reduce ? 'auto' : 'smooth' });
    };

    if (tours.length === 0) return null;

    return (
        <section className={styles.section} aria-labelledby="journeys-title">
            <div className={styles.head}>
                <div className={styles.headText}>
                    <h2 id="journeys-title" className={styles.title}>{t('journeysTitle')}</h2>
                    <p className={styles.lead}>{t('upcomingToursSubtitle')}</p>
                </div>
                <div className={styles.actions}>
                    <div className={styles.buttons}>
                        <button type="button" className={styles.scrollButton} onClick={() => scrollBy(-1)} disabled={edges.start} aria-label={t('previous')}>
                            <ArrowBox direction="left" />
                        </button>
                        <button type="button" className={styles.scrollButton} onClick={() => scrollBy(1)} disabled={edges.end} aria-label={t('next')}>
                            <ArrowBox />
                        </button>
                    </div>
                    <Link href="/india/tours" className={styles.all}>{tButtons('viewAllTours')}</Link>
                </div>
            </div>

            <ul ref={trackRef} className={styles.track} tabIndex={0} aria-labelledby="journeys-title">
                {tours.map((tour) => (
                    <li key={tour._id || tour.slug} className={styles.item}>
                        <TourCard tour={tour} sizes="(min-width: 1024px) 340px, 78vw" />
                    </li>
                ))}
            </ul>
        </section>
    );
}
