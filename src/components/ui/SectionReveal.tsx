'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import styles from './SectionReveal.module.css';

/**
 * Homepage section transition. A section below the fold waits behind a small
 * gold seal that pulses like a loader. When it scrolls into view the seal
 * draws out into a gold rule and the section rises into place.
 *
 * Server render and no-JavaScript visitors get the plain, visible section.
 * Sections already on screen when the page hydrates are never hidden.
 * Only opacity and transform change, so nothing shifts the layout.
 */
export default function SectionReveal({ children }: { children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || !('IntersectionObserver' in window)) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        // Already in or above the viewport (reload mid-page, back button): leave it alone.
        if (el.getBoundingClientRect().top < window.innerHeight) return;

        el.dataset.reveal = 'waiting';
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.dataset.reveal = 'shown';
                    observer.disconnect();
                }
            },
            { rootMargin: '0px 0px -12% 0px' },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={styles.reveal} data-reveal="static">
            <span className={styles.loader} aria-hidden="true">
                <span className={styles.rule} />
                <span className={styles.seal} />
                <span className={styles.rule} />
            </span>
            <div className={styles.content}>{children}</div>
        </div>
    );
}
