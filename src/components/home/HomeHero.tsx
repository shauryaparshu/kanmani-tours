'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReducedMotion } from '@/components/ui/useReducedMotion';
import Filigree from '@/components/ui/Filigree';
import OrnateLink from '@/components/ui/OrnateLink';
import ArchFrame, { ARCH_CLIP_ID } from './ArchFrame';
import styles from './HomeHero.module.css';

const INTERVAL_MS = 6000;

interface HomeHeroProps {
    images: string[];
}

/** Lozenge-shaped slide button that sits on the gold rule under the hero. */
function Lozenge({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
    return (
        <button type="button" className={styles.lozenge} onClick={onClick} aria-label={label}>
            <svg className={styles.lozengeShape} viewBox="0 0 64 32" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                <path className={styles.lozengeFill} d="M12 1H52L63 16L52 31H12L1 16Z" />
                <path className={styles.lozengeLine} d="M14 5H50L58.5 16L50 27H14L5.5 16Z" />
            </svg>
            {children}
        </button>
    );
}

export default function HomeHero({ images }: HomeHeroProps) {
    const t = useTranslations('Home');
    const tDest = useTranslations('DestinationChoice');
    const reduceMotion = useReducedMotion();

    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    // Bumped on every manual step so the autoplay timer restarts from zero.
    const [step, setStep] = useState(0);
    const count = images.length;
    const playing = count > 1 && !paused && !reduceMotion;

    useEffect(() => {
        if (!playing) return;
        const timer = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
        return () => clearInterval(timer);
    }, [playing, count, step]);

    const go = (delta: number) => {
        setIndex((i) => (i + delta + count) % count);
        setStep((s) => s + 1);
    };

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

                    <div className={styles.panel}>
                        <Filigree />
                        <p className={styles.intro}>{t('heroIntro')}</p>
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

                    <div className={styles.actions}>
                        <OrnateLink href="/india/tours" tone="gold">{tDest('indiaCta')}</OrnateLink>
                        <OrnateLink href="/japan/tours" tone="red">{tDest('japanCta')}</OrnateLink>
                    </div>
                </div>

                {/* One fixed Mughal arch; only the photo inside changes. Photos fill it
                    from their top edge, so heads stay in and trimming comes off the bottom. */}
                <div className={styles.visual}>
                    <div className={styles.archPanel}>
                        <ArchFrame>
                            <div className={styles.photos} style={{ clipPath: `url(#${ARCH_CLIP_ID})` }}>
                                {mounted.map((i) => (
                                    <div key={images[i]} className={styles.slide} data-active={i === index}>
                                        <Image
                                            src={images[i]}
                                            alt={i === index ? t('heroAlt') : ''}
                                            fill
                                            sizes="(min-width: 1024px) 44vw, 86vw"
                                            preload={i === 0}
                                            className={styles.image}
                                        />
                                    </div>
                                ))}
                            </div>
                        </ArchFrame>
                    </div>
                </div>

                {count > 1 ? (
                    <div className={styles.pager}>
                        <Lozenge label={t('prevSlide')} onClick={() => go(-1)}>
                            <ChevronLeft aria-hidden="true" />
                        </Lozenge>
                        <Lozenge label={t('nextSlide')} onClick={() => go(1)}>
                            <ChevronRight aria-hidden="true" />
                        </Lozenge>
                    </div>
                ) : null}
            </div>
        </section>
    );
}
