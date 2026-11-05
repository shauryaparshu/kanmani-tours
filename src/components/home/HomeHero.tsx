'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useReducedMotion } from '@/components/ui/useReducedMotion';
import Botanicals from './Botanicals';
import styles from './HomeHero.module.css';

const INTERVAL_MS = 6000;

interface HeroSlide {
    src: string;
    /** width / height of the photo file */
    ratio: number;
}

interface HomeHeroProps {
    slides: HeroSlide[];
}

export default function HomeHero({ slides }: HomeHeroProps) {
    const t = useTranslations('Home');
    const tDest = useTranslations('DestinationChoice');
    const reduceMotion = useReducedMotion();

    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const count = slides.length;
    const playing = count > 1 && !paused && !reduceMotion;

    useEffect(() => {
        if (!playing) return;
        const timer = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
        return () => clearInterval(timer);
    }, [playing, count]);

    // Only the previous, current and next photos are mounted, so the page
    // loads one photo up front and the next one quietly in the background.
    const mounted = count === 0 ? [] : [...new Set([(index - 1 + count) % count, index, (index + 1) % count])];
    const progress = count > 1 ? index / (count - 1) : 0;

    return (
        <section className={styles.hero} aria-labelledby="home-hero-title">
            <div className={styles.inner}>
                <div className={styles.copy}>
                    <p className={styles.eyebrow}>{t('heroEyebrow')}</p>
                    <h1 id="home-hero-title" className={styles.title}>
                        <span>{t('heroTitleA')}</span> <span>{t('heroTitleB')}</span>
                    </h1>
                    <p className={styles.intro}>{t('heroIntro')}</p>

                    <div className={styles.actions}>
                        <Link href="/india/tours" className={styles.primary}>
                            {tDest('indiaCta')}
                            <ArrowRight aria-hidden="true" />
                        </Link>
                        <Link href="/japan/tours" className={styles.secondary}>
                            {tDest('japanCta')}
                            <ArrowRight aria-hidden="true" />
                        </Link>
                    </div>
                </div>

                {/* Each photo keeps its own shape inside a gold arch drawn around it,
                    so the whole picture is always visible. The line art moves with it. */}
                <div className={styles.visual}>
                    <div className={styles.stage}>
                        {mounted.map((i) => (
                            <div key={slides[i].src} className={styles.slide} data-active={i === index}>
                                <div className={styles.frame} style={{ '--ratio': slides[i].ratio } as CSSProperties}>
                                    <Image
                                        src={slides[i].src}
                                        alt={i === index ? t('heroAlt') : ''}
                                        fill
                                        sizes="(min-width: 1024px) 52vw, 100vw"
                                        preload={i === 0}
                                        className={styles.image}
                                    />
                                    <Botanicals />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {count > 1 ? (
                    <div className={styles.controls}>
                        <span className={`${styles.counter} num`} aria-live="off">
                            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                        </span>
                        <span className={styles.track} aria-hidden="true">
                            <span className={styles.marker} style={{ left: `${progress * 100}%` }} />
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
