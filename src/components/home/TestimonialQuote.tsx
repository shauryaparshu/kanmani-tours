'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Testimonial } from '@/lib/testimonials';
import ArrowBox from '@/components/ui/ArrowBox';
import styles from './TestimonialQuote.module.css';

interface TestimonialQuoteProps {
    testimonials: Testimonial[];
}

export default function TestimonialQuote({ testimonials }: TestimonialQuoteProps) {
    const t = useTranslations('Home');
    const [index, setIndex] = useState(0);
    const count = testimonials.length;
    if (count === 0) return null;

    const item = testimonials[index];
    const go = (step: 1 | -1) => setIndex((i) => (i + step + count) % count);

    return (
        <section className={styles.section} aria-labelledby="testimonials-title">
            <div className={styles.inner}>
                <h2 id="testimonials-title" className={styles.title}>{t('happyClients')}</h2>
                <p className={styles.lead}>{t('happyClientsSubtitle')}</p>

                <figure className={styles.quote} aria-live="polite">
                    <blockquote className={styles.text}>
                        <p>{item.text}</p>
                    </blockquote>
                    <figcaption className={styles.caption}>
                        <span className={styles.name}>{item.name}</span>
                        {item.tour ? <span className={styles.tour}>{item.tour}</span> : null}
                    </figcaption>
                </figure>

                {count > 1 ? (
                    <div className={styles.controls}>
                        <button type="button" className={styles.button} onClick={() => go(-1)} aria-label={t('previous')}>
                            <ArrowBox direction="left" />
                        </button>
                        <span className={`${styles.counter} num`} aria-hidden="true">{index + 1} / {count}</span>
                        <span className="sr-only">{t('testimonialCount', { current: index + 1, total: count })}</span>
                        <button type="button" className={styles.button} onClick={() => go(1)} aria-label={t('next')}>
                            <ArrowBox />
                        </button>
                    </div>
                ) : null}
            </div>
        </section>
    );
}
