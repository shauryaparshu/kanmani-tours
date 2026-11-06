import type { CSSProperties } from 'react';
import styles from './NavStory.module.css';

/**
 * "One Day, Two Countries": the nav band's looping story. One thing moves at a
 * time. The sun rises over Fuji, birds cross, a bullet train passes, a sakura
 * branch blossoms and lets one petal go. The petal drifts behind the logo to
 * India and becomes a lotus, a peacock walks in and fans its feathers, the Taj
 * glows at dusk, and a bird flies back to Japan as the sun sets.
 * All timing lives in NavStory.module.css; everything here is decoration.
 */

const angle = (a: number) => ({ '--a': `${a}deg` }) as CSSProperties;

/** A gull in flight, wings beating. */
function Bird({ x = 0, y = 0 }: { x?: number; y?: number }) {
    return (
        <g transform={`translate(${x} ${y})`}>
            <path className={styles.bird} d="M-10 0Q-5 -7 0 0Q5 -7 10 0" />
        </g>
    );
}

/** Birds in a V, flying left across Fuji. Sits inside the Fuji drawing. */
export function FujiBirds() {
    return (
        <g className={styles.flock}>
            <Bird />
            <Bird x={14} y={-8} />
            <Bird x={14} y={8} />
            <Bird x={28} y={-16} />
            <Bird x={28} y={16} />
        </g>
    );
}

const LOTUS_PETALS = [-64, -40, 40, 64, -18, 18, 0];

/** The lotus the petal becomes, on still water. Sits inside the Taj drawing, right of it. */
export function TajLotus() {
    return (
        <g transform="translate(336 123)">
            <g className={styles.water}>
                <path d="M-24 5H24M-15 9H15" />
            </g>
            {LOTUS_PETALS.map((a) => (
                <g key={a} className={styles.lotusPetal} style={angle(a)}>
                    <path d="M0 0C-6 -6 -6 -14 0 -21C6 -14 6 -6 0 0Z" />
                </g>
            ))}
        </g>
    );
}

const FEATHERS = [-98, -82, -66, -50, -34, -18, -2, 14, 30];

/** The peacock, facing the Taj. Sits inside the Taj drawing, left of it. */
export function TajPeacock() {
    return (
        <g transform="translate(-42 128)">
            <g className={styles.peacock}>
                <path className={styles.peacockGround} d="M-56 0H46" />
                <g transform="translate(-12 -14)">
                    {FEATHERS.map((a) => (
                        <g key={a} className={styles.feather} style={angle(a)}>
                            <path className={styles.featherShaft} d="M0 0V-41" />
                            <path className={styles.featherBarbs} d="M0 -22L-3 -27M0 -22L3 -27M0 -30L-3.5 -35M0 -30L3.5 -35" />
                            <ellipse className={styles.featherEye} cx="0" cy="-45" rx="3.4" ry="4.6" />
                            <circle className={styles.featherPupil} cx="0" cy="-45" r="1.3" />
                        </g>
                    ))}
                </g>
                <path className={styles.peacockLine} d="M-4 -9L-5 0H-1M2 -9L3 0H7" />
                <path className={styles.peacockBody} d="M-16 -16C-13 -27 4 -29 9 -21C14 -14 6 -8 -4 -8C-11 -8 -17 -11 -16 -16Z" />
                <path className={styles.peacockNeck} d="M6 -22C11 -28 11 -36 13 -42" />
                <circle className={styles.peacockHead} cx="14" cy="-44" r="3.2" />
                <path className={styles.peacockLine} d="M17 -44L21.5 -43M14 -47L12 -53M14 -47L15 -54M14 -47L18 -52" />
            </g>
        </g>
    );
}

const BLOSSOMS: [number, number][] = [[76, 4], [46, 41], [20, 15], [10, 29], [103, 22], [58, 11]];

/** One sakura flower: five petals around a gold centre. */
function Blossom({ delay }: { delay: number }) {
    return (
        <g className={styles.blossom} style={{ animationDelay: `${delay}s` }}>
            {[0, 72, 144, 216, 288].map((r) => (
                <path key={r} className={styles.blossomPetal} transform={`rotate(${r})`} d="M0 0C-3.5 -2 -3.5 -6 -1 -7.5L0 -6.5L1 -7.5C3.5 -6 3.5 -2 0 0Z" />
            ))}
            <circle className={styles.blossomHeart} r="1.2" />
        </g>
    );
}

/**
 * The parts of the story that travel across the band: the train and its rail,
 * the sakura branch, the petal and the bird flying home. Rendered before the
 * links, so all of it passes behind the logo and the buttons.
 */
export function NavStory() {
    return (
        <div className={`${styles.layer} ${styles.storyRoot}`} aria-hidden="true">
            <div className={styles.track}>
                <svg className={styles.train} viewBox="0 0 240 22" focusable="false">
                    <path className={styles.trainBody} d="M2 20C10 10 28 4 54 3H238V20Z" />
                    <path className={styles.trainLine} d="M18 14H238" />
                    <path className={styles.trainLine} d="M36 6L30 11H42L46 6Z" />
                    <path className={styles.trainWindows} d="M58 8.5H236" />
                    <path className={styles.trainLine} d="M92 3V20M164 3V20" />
                </svg>
            </div>

            <svg className={styles.sakura} viewBox="0 0 140 48" focusable="false">
                <path className={styles.branch} d="M140 8C112 10 92 14 70 22C52 28 36 30 14 28M96 14C92 7 86 4 78 4M70 22C66 32 58 38 48 40M44 28C38 20 30 17 22 16M112 11C110 16 107 19 104 21M78 18C72 15 66 12 60 11" />
                {BLOSSOMS.map(([x, y], i) => (
                    <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
                        <Blossom delay={i * 0.35} />
                    </g>
                ))}
            </svg>

            <svg className={styles.petal} viewBox="-6 -6 12 12" focusable="false">
                <path d="M0 -5C4 -3 4 3 0 5C-4 3 -4 -3 0 -5Z" />
            </svg>

            <svg className={styles.homeBird} viewBox="-10 -6 20 12" focusable="false">
                <path className={styles.bird} d="M-10 0Q-5 -7 0 0Q5 -7 10 0" />
            </svg>
        </div>
    );
}
