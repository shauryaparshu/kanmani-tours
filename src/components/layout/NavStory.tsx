import type { CSSProperties } from 'react';
import styles from './NavStory.module.css';

/**
 * "The Bridge": the nav band's looping story, always opening from India.
 *
 * 1. The Journey: a steam engine comes in from the far left edge and goes behind
 *    the logo; a long bullet train comes out and runs to the far right edge as the
 *    sun rises.
 * 2. The Gift: the train's wind stirs the sakura into blossom, and one petal
 *    drifts back to India and becomes a lotus.
 * 3. The Return Gift: a peacock bows to the lotus and fans its feathers. One
 *    feather floats to Japan and becomes a bird, which flies across the setting
 *    sun and settles on the sakura. The loop ends there; the engine comes again.
 *
 * All timing lives in NavStory.module.css; everything here is decoration.
 */

const angle = (a: number) => ({ '--a': `${a}deg` }) as CSSProperties;

const LOTUS_PETALS = [-64, -40, 40, 64, -18, 18, 0];

/** The lotus the petal becomes, on still water, left of the Taj. Sits inside the Taj drawing. */
export function TajLotus() {
    return (
        <g transform="translate(22 123)">
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

/** The peacock, facing the lotus. Sits inside the Taj drawing, furthest left. */
export function TajPeacock() {
    return (
        <g transform="translate(-26 128)">
            <g className={styles.peacock}>
                <path className={styles.peacockGround} d="M-62 0H24" />
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
                {/* Neck and head turn together, so the peacock can bow to the lotus. */}
                <g className={styles.peacockBow}>
                    <path className={styles.peacockNeck} d="M6 -22C11 -28 11 -36 13 -42" />
                    <circle className={styles.peacockHead} cx="14" cy="-44" r="3.2" />
                    <path className={styles.peacockLine} d="M17 -44L21.5 -43M14 -47L12 -53M14 -47L15 -54M14 -47L18 -52" />
                </g>
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

/** One spoked wheel of the steam engine. */
function Wheel({ x, r }: { x: number; r: number }) {
    return (
        <g transform={`translate(${x} ${27 - r})`}>
            <g className={styles.wheel}>
                <circle className={styles.wheelRim} r={r} />
                <path className={styles.engineFine} d={`M${-r} 0H${r}M0 ${-r}V${r}`} />
            </g>
        </g>
    );
}

/** One end of the bullet train, drawn as its nose facing right; `.trainTail` mirrors it. */
function TrainEnd({ className }: { className: string }) {
    return (
        <svg className={className} viewBox="0 0 70 24" preserveAspectRatio="none" focusable="false">
            <path className={styles.trainFace} d="M0 1H26C48 2 63 12 69 23H0Z" />
            <path className={styles.trainStripe} d="M0 15H57L63 19H0Z" />
            <path className={styles.trainGlass} d="M27 5C36 6 43 9 48 13H27Z" />
        </svg>
    );
}

/**
 * The bird the feather becomes, facing right, with its feet at the bottom of the
 * drawing so it can stand on the branch. It flies with open wings and folds them
 * when it lands.
 */
function Bird() {
    return (
        <svg className={styles.bird} viewBox="-15 -13 30 26" focusable="false">
            <circle className={styles.birdBurst} cx="0" cy="0" r="9" />
            <g className={styles.birdFlying}>
                <path className={`${styles.birdWingFar} ${styles.birdFlap}`} d="M4 -2C4 -7 1 -11 -3 -12C-3 -8 -1 -3 1 -1Z" />
            </g>
            <path className={styles.birdBody} d="M-7 3L-15 0.5L-14 5L-6 6Z" />
            <circle className={styles.birdTailEye} cx="-13" cy="3" r="1.4" />
            <g className={styles.birdPerched}>
                <path className={styles.birdLegs} d="M-1 6.5V12M-3 12H1.5M3 6V12M1 12H5.5" />
            </g>
            <path className={styles.birdBody} d="M-8 3C-5 -2 0 -4 4 -4C4.5 -7 7.5 -8.5 10 -7C11.5 -6 12 -4.5 11.5 -3C10.5 2 6 7 0 7C-4 7 -7 5 -8 3Z" />
            <path className={styles.birdBeak} d="M11.3 -5L15 -3L11.3 -1.5Z" />
            <circle className={styles.birdEye} cx="8.5" cy="-4.8" r="1" />
            <g className={styles.birdPerched}>
                <path className={styles.birdWing} d="M-6 2C-3 -1 3 -1 5 1C3 5 -2 6 -7 4Z" />
            </g>
            <g className={styles.birdFlying}>
                <path className={`${styles.birdWing} ${styles.birdFlap}`} d="M2 -1C0 -7 -5 -11 -11 -12C-9 -6 -6 -1 -2 2Z" />
            </g>
        </svg>
    );
}

/**
 * In front of the drawings, behind the links: the rail, the steam engine, the long
 * bullet train, the sakura branch, the petal, the feather and the bird. The links
 * come later in the page, so all of this passes behind the logo and the buttons.
 */
export function NavStoryFront() {
    return (
        <div className={`${styles.layer} ${styles.storyRoot}`} aria-hidden="true">
            <div className={styles.rail} />
            <div className={styles.line}>
                <svg className={styles.engine} viewBox="0 0 78 28" focusable="false">
                    <g className={styles.smoke}>
                        <circle className={styles.puff} cx="58" cy="2" r="3.5" />
                        <circle className={styles.puff} cx="52" cy="-2" r="4.5" />
                        <circle className={styles.puff} cx="45" cy="-6" r="5.5" />
                    </g>
                    <path className={styles.engineBody} d="M6 7H22V20H6Z" />
                    <path className={styles.engineRoof} d="M3 7H25L22 3H6Z" />
                    <path className={styles.engineWindow} d="M10 9H18V14H10Z" />
                    <path className={styles.engineBody} d="M22 10H66C69 10 70 12 70 15C70 18 69 20 66 20H22Z" />
                    <path className={styles.engineFine} d="M34 10V20M46 10V20" />
                    <path className={styles.engineBody} d="M55 10V4H61V10Z" />
                    <path className={styles.engineRoof} d="M53 4H63L61 1H55Z" />
                    <path className={styles.engineBody} d="M38 10C38 7 44 7 44 10Z" />
                    <path className={styles.engineFine} d="M70 20L77 27H66" />
                    <Wheel x={14} r={6} />
                    <Wheel x={32} r={6} />
                    <Wheel x={50} r={6} />
                    <Wheel x={63} r={3.5} />
                </svg>
            </div>

            <div className={styles.track}>
                <div className={styles.bullet}>
                    <TrainEnd className={styles.trainTail} />
                    <svg className={styles.trainCars} preserveAspectRatio="none" focusable="false">
                        <defs>
                            <pattern id="nav-train-car" width="84" height="24" patternUnits="userSpaceOnUse">
                                <path className={styles.trainWindows} d="M8 8H76" />
                                <path className={styles.trainDoor} d="M0 3V23M84 3V23" />
                                <path className={styles.trainStripe} d="M0 15H84V19H0Z" />
                            </pattern>
                        </defs>
                        <rect className={styles.trainFace} width="100%" height="23" y="1" />
                        <rect fill="url(#nav-train-car)" width="100%" height="24" />
                    </svg>
                    <TrainEnd className={styles.trainNose} />
                </div>
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

            <svg className={styles.looseFeather} viewBox="-6 -24 12 48" focusable="false">
                <path className={styles.featherShaft} d="M0 22V-14" />
                <path className={styles.featherBarbs} d="M0 6L-4 0M0 6L4 0M0 -3L-4 -9M0 -3L4 -9M0 14L-3 9M0 14L3 9" />
                <ellipse className={styles.featherEye} cx="0" cy="-17" rx="4" ry="5.5" />
                <circle className={styles.featherPupil} cx="0" cy="-17" r="1.6" />
            </svg>

            <Bird />
        </div>
    );
}
