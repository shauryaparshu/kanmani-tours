import type { ReactNode } from 'react';
import Filigree from '@/components/ui/Filigree';
import styles from './ArchFrame.module.css';

export const ARCH_CLIP_ID = 'home-hero-arch';

// Mughal ogee arch in a 0..1 box: straight jambs, swelling shoulders, pointed crown.
const ARCH_UNIT = 'M0,1 L0,0.36 C0,0.24 0.1,0.19 0.22,0.15 C0.34,0.11 0.45,0.07 0.5,0 C0.55,0.07 0.66,0.11 0.78,0.15 C0.9,0.19 1,0.24 1,0.36 L1,1 Z';
// The same arch in a 0..100 box, for the moulding drawn over the photo's edge.
const ARCH_100 = 'M0,100 L0,36 C0,24 10,19 22,15 C34,11 45,7 50,0 C55,7 66,11 78,15 C90,19 100,24 100,36 L100,100 Z';

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
 * The hero's photo frame: a rectangular panel with gold lattice in the
 * spandrels and a heavy, bevelled gold moulding around a Mughal arch.
 * `children` fill the arch opening; clip them with `url(#ARCH_CLIP_ID)`.
 */
export default function ArchFrame({ children }: { children: ReactNode }) {
    return (
        <div className={styles.root}>
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
                {children}
                <svg className={styles.moulding} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                    <defs>
                        <clipPath id={ARCH_CLIP_ID} clipPathUnits="objectBoundingBox">
                            <path d={ARCH_UNIT} />
                        </clipPath>
                        <linearGradient id="home-hero-gold" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor="#E9D39A" />
                            <stop offset="0.3" stopColor="#B8924F" />
                            <stop offset="0.55" stopColor="#F1DFA8" />
                            <stop offset="0.8" stopColor="#9C7735" />
                            <stop offset="1" stopColor="#D9BE7C" />
                        </linearGradient>
                    </defs>
                    <path className={styles.m1} d={ARCH_100} />
                    <path className={styles.m2} d={ARCH_100} />
                    <path className={styles.m3} d={ARCH_100} />
                    <path className={styles.m4} d={ARCH_100} />
                    <path className={styles.m5} d={ARCH_100} />
                </svg>
            </div>
        </div>
    );
}
