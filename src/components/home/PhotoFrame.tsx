import type { ReactNode } from 'react';
import Filigree from '@/components/ui/Filigree';
import styles from './PhotoFrame.module.css';

/** Leafy gold scroll that spills out from the side of the panel (left side; CSS mirrors it). */
function SideScroll({ side }: { side: 'start' | 'end' }) {
    return (
        <svg className={styles.scroll} data-side={side} viewBox="0 0 48 180" aria-hidden="true" focusable="false">
            <path d="M46 20C30 26 20 40 22 58c2 14 14 18 18 10s-4-14-10-10" />
            <path d="M46 160c-16-6-26-20-24-38 2-14 14-18 18-10s-4 14-10 10" />
            <path d="M46 90c-14 0-26-8-30-20M46 90c-14 0-26 8-30 20" />
            <path d="M16 70c-8-2-13 4-12 10M16 110c-8 2-13-4-12-10" />
            <path d="M30 90c-6-4-14-4-20 0 6 4 14 4 20 0Z" />
            <circle cx="40" cy="90" r="2.5" />
            <circle cx="8" cy="40" r="1.6" />
            <circle cx="8" cy="140" r="1.6" />
        </svg>
    );
}

/**
 * The hero's photo frame: a lattice panel with a Mughal crest on top and a
 * bevelled gold moulding around a plain rectangular opening. The crest and
 * moulding sit entirely outside the opening, so they never cover the photo.
 */
export default function PhotoFrame({ children }: { children: ReactNode }) {
    return (
        <div className={styles.root}>
            <svg className={styles.crest} viewBox="0 0 200 60" aria-hidden="true" focusable="false">
                <path className={styles.crestFill} d="M0 60C30 60 45 48 65 38 82 30 94 18 100 0c6 18 18 30 35 38 20 10 35 22 65 22Z" />
                <path className={styles.crestLine} d="M22 60c22-2 36-11 50-18 13-7 23-15 28-27 5 12 15 20 28 27 14 7 28 16 50 18" />
                <circle className={styles.crestBud} cx="100" cy="39" r="4" />
                <path className={styles.crestLine} d="M86 52c4-6 9-8 14-8s10 2 14 8" />
            </svg>

            <svg className={styles.lattice} aria-hidden="true" focusable="false">
                <defs>
                    <pattern id="home-hero-lattice" width="18" height="18" patternUnits="userSpaceOnUse">
                        <path d="M9 0L18 9L9 18L0 9Z" />
                        <path d="M9 4.5L13.5 9L9 13.5L4.5 9Z" />
                        <circle cx="9" cy="9" r="1.2" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#home-hero-lattice)" />
            </svg>
            <Filigree />
            <SideScroll side="start" />
            <SideScroll side="end" />

            <div className={styles.opening}>
                <svg className={styles.moulding} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                    <defs>
                        <linearGradient id="home-hero-gold" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor="#E9D39A" />
                            <stop offset="0.3" stopColor="#B8924F" />
                            <stop offset="0.55" stopColor="#F1DFA8" />
                            <stop offset="0.8" stopColor="#9C7735" />
                            <stop offset="1" stopColor="#D9BE7C" />
                        </linearGradient>
                    </defs>
                    <rect className={styles.m1} width="100" height="100" />
                    <rect className={styles.m2} width="100" height="100" />
                    <rect className={styles.m3} width="100" height="100" />
                    <rect className={styles.m4} width="100" height="100" />
                    <rect className={styles.m5} width="100" height="100" />
                </svg>
                {children}
            </div>
        </div>
    );
}
