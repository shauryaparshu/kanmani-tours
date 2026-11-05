'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useReducedMotion } from '@/components/ui/useReducedMotion';
import ArrowBox from '@/components/ui/ArrowBox';
import styles from './HomeHero.module.css';

const INTERVAL_MS = 6000;

interface HomeHeroProps {
    images: string[];
}

export default function HomeHero({ images }: HomeHeroProps) {
    const t = useTranslations('Home');
    const tDest = useTranslations('DestinationChoice');
    const reduceMotion = useReducedMotion();

    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const count = images.length;
    const playing = count > 1 && !paused && !reduceMotion;

    useEffect(() => {
        if (!playing) return;
        const timer = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
        return () => clearInterval(timer);
    }, [playing, count]);

    // Only the previous, current and next photos are mounted, so the page
    // loads one photo up front and the next one quietly in the background.
    const mounted = count === 0 ? [] : [...new Set([(index - 1 + count) % count, index, (index + 1) % count])];

    return (
        <section className={styles.hero} aria-labelledby="home-hero-title">
            <div className={styles.stage}>
                {mounted.map((i) => (
                    <div key={images[i]} className={styles.slide} data-active={i === index}>
                        <Image
                            src={images[i]}
                            alt={i === index ? t('heroAlt') : ''}
                            fill
                            sizes="100vw"
                            preload={i === 0}
                            className={styles.image}
                        />
                    </div>
                ))}
            </div>

            <div className={styles.content}>
                <div className={styles.copy}>
                    <h1 id="home-hero-title" className={styles.title}>{tDest('heading')}</h1>
                    <p className={styles.line}>{t('heroLine')}</p>
                </div>

                <nav className={styles.paths} aria-label={t('heroPaths')}>
                    <Link href="/india/tours" className={styles.path}>
                        <span>{tDest('indiaTitle')}</span>
                        <ArrowBox />
                    </Link>
                    <Link href="/japan/tours" className={styles.path}>
                        <span>{tDest('japanTitle')}</span>
                        <ArrowBox />
                    </Link>
                </nav>

                {count > 1 ? (
                    <div className={styles.controls}>
                        <span className={`${styles.counter} num`} aria-live="off">
                            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                        </span>
                        {!reduceMotion ? (
                            <button
                                type="button"
                                className={styles.pause}
                                onClick={() => setPaused((p) => !p)}
                                aria-label={paused ? t('playSlides') : t('pauseSlides')}
                            >
                                <span className={paused ? styles.iconPlay : styles.iconPause} aria-hidden="true" />
                            </button>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </section>
    );
}
