import type { CSSProperties } from 'react';
import styles from './NavStory.module.css';

/**
 * "The Bridge": the nav band's looping story, always opening from India. Every
 * scene begins as the last one is ending, and nothing stops along the way.
 *
 * 1. The Journey: a horse cart runs in from the far left edge and passes behind
 *    the logo, where it becomes a very long bullet train that runs straight on
 *    and out at the far right edge, as the sun rises.
 * 2. The Gift: the train's wind stirs the sakura into blossom, and one petal
 *    drifts back to India and becomes a lotus.
 * 3. The Return Gift: a peacock walks to the lotus, bows and fans its feathers.
 *    One feather floats to Japan and becomes a bird, which flies across the
 *    setting sun and sits on the sakura. The loop ends there; the cart comes again.
 *
 * All timing lives in NavStory.module.css; everything here is decoration.
 */

const fan = (open: number, closed: number) => ({ '--a': `${open}deg`, '--c': `${closed}deg` }) as CSSProperties;
const angle = (a: number) => ({ '--a': `${a}deg` }) as CSSProperties;

const LOTUS_BACK = [-80, -60, -40, -20, 80, 60, 40, 20];
const LOTUS_FRONT = [-46, 46, -24, 24, 0];

/** The lotus the petal becomes, large and open on still water, left of the Taj. Sits inside the Taj drawing. */
export function TajLotus() {
    return (
        <g transform="translate(-10 122)">
            <g className={styles.water}>
                <ellipse className={styles.lotusPad} cx="0" cy="3" rx="31" ry="4" />
                <path className={styles.ripple} d="M-38 6H38M-26 9.5H26" />
            </g>
            {LOTUS_BACK.map((a) => (
                <g key={a} className={styles.lotusPetal} style={angle(a)}>
                    <path d="M0 0C-9 -8 -10 -24 0 -36C10 -24 9 -8 0 0Z" />
                </g>
            ))}
            {LOTUS_FRONT.map((a) => (
                <g key={a} className={`${styles.lotusPetal} ${styles.lotusInner}`} style={angle(a)}>
                    <path d="M0 0C-7 -6 -8 -18 0 -27C8 -18 7 -6 0 0Z" />
                </g>
            ))}
            <g className={styles.water}>
                <circle className={styles.lotusHeart} cx="0" cy="-3" r="3.4" />
            </g>
        </g>
    );
}

// The long train feathers and the shorter ones over them: where each one stands
// when the tail is fanned, and where it lies when the tail trails behind.
const TAIL_LONG = Array.from({ length: 15 }, (_, i) => ({ open: -102 + i * 10.5, closed: -112 + i * 1.6 }));
const TAIL_SHORT = Array.from({ length: 11 }, (_, i) => ({ open: -92 + i * 13, closed: -108 + i * 1.8 }));

/** One filled train feather with its gold eye, growing upward from the origin. */
function TailFeather({ short = false }: { short?: boolean }) {
    return (
        <g transform={short ? 'scale(0.7)' : undefined}>
            <path className={styles.featherVane} d="M0 0C-1.6 -12 -5 -32 -5.4 -46C-5.8 -55 5.8 -55 5.4 -46C5 -32 1.6 -12 0 0Z" />
            <path className={styles.featherShaft} d="M0 0V-42" />
            <ellipse className={styles.featherEye} cx="0" cy="-47" rx="4" ry="5" />
            <ellipse className={styles.featherIris} cx="0" cy="-47" rx="2.6" ry="3.4" />
            <circle className={styles.featherPupil} cx="0" cy="-47" r="1.4" />
        </g>
    );
}

/** The peacock, full-bodied, facing the lotus. Sits inside the Taj drawing, furthest left. */
export function TajPeacock() {
    return (
        <g transform="translate(-74 128)">
            <g className={styles.peacock}>
                {/* The far leg, behind everything */}
                <g transform="translate(-5 -11)">
                    <g className={styles.legB}>
                        <path className={styles.peacockFarLeg} d="M0 0L-1 6L1 11M1 11H-3M1 11H5" />
                    </g>
                </g>

                <g transform="translate(-16 -21)">
                    {TAIL_LONG.map(({ open, closed }) => (
                        <g key={open} className={styles.feather} style={fan(open, closed)}>
                            <TailFeather />
                        </g>
                    ))}
                    {TAIL_SHORT.map(({ open, closed }) => (
                        <g key={open} className={styles.feather} style={fan(open, closed)}>
                            <TailFeather short />
                        </g>
                    ))}
                </g>

                {/* The near leg, jointed, with toes */}
                <g transform="translate(1 -11)">
                    <g className={styles.legA}>
                        <path className={styles.peacockLeg} d="M0 0L-1 6L1 11M1 11H-3M1 11H5.5" />
                    </g>
                </g>

                {/* A plump body with a bronze wing */}
                <path className={styles.peacockBody} d="M-25 -18C-23 -29 -8 -33 5 -30C14 -28 17 -21 13 -15C8 -8.5 -6 -7 -16 -9C-22 -10.5 -26 -14 -25 -18Z" />
                <path className={styles.peacockWing} d="M-22 -19C-17 -27 -5 -29 3 -25C5 -20 1 -14 -6 -12.5C-13 -11.5 -20 -14 -22 -19Z" />
                <path className={styles.peacockBars} d="M-16 -22.5L-12 -13.5M-10 -25L-6 -13M-4 -26.5L0 -15" />

                {/* The neck and head turn together, so the peacock can bow to the lotus. */}
                <g className={styles.peacockBow}>
                    <path className={styles.peacockNeck} d="M3 -30C8 -34 10 -41 9 -48C8.6 -52 9.6 -56 12.5 -57.5C15.6 -59 18.6 -56.6 17.6 -53.4C16.2 -49 17.5 -43 17 -36.5C16.5 -29 14.5 -22 10.5 -17C9.5 -23 7 -27.5 3 -30Z" />
                    <path className={styles.peacockCheek} d="M15.4 -57.4C17 -57.2 18.4 -56.2 18.2 -54.8C17.2 -55 16 -55.8 15.4 -57.4Z" />
                    <circle className={styles.peacockEye} cx="15.6" cy="-55.6" r="0.9" />
                    <path className={styles.peacockBeak} d="M18 -56.8L23.2 -54.4L17.8 -53.4Z" />
                    <path className={styles.peacockCrest} d="M13 -58.5L9.5 -66M14.2 -59L13 -67.5M15.4 -58.8L16.6 -67M16.4 -58L20 -65.4" />
                    <circle className={styles.crestTip} cx="9.5" cy="-66.4" r="1.2" />
                    <circle className={styles.crestTip} cx="13" cy="-68" r="1.2" />
                    <circle className={styles.crestTip} cx="16.6" cy="-67.5" r="1.2" />
                    <circle className={styles.crestTip} cx="20.2" cy="-65.8" r="1.2" />
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

/** One leg of the horse: an upper part from the body, a lower part from the knee. */
function HorseLeg({ x, y, far = false, late = false, rear = false }: { x: number; y: number; far?: boolean; late?: boolean; rear?: boolean }) {
    const phase = late ? styles.trotLate : '';
    const colour = far ? styles.horseFar : styles.horseCoat;
    return (
        <g transform={`translate(${x} ${y})`}>
            <g className={`${rear ? styles.hindUpper : styles.foreUpper} ${phase}`}>
                <path className={colour} d={rear ? 'M-3.4 -2L-1.8 9.5H1.6L3.2 -2Z' : 'M-2.6 -2L-1.5 9.5H1.5L2.6 -2Z'} />
                <g transform="translate(0 9)">
                    <g className={`${rear ? styles.hindLower : styles.foreLower} ${phase}`}>
                        <path className={colour} d="M-1.5 0L-1 7.6H1L1.5 0Z" />
                        <path className={styles.horseHoof} d="M-1.3 7.4H1.8L2.2 9.2H-1.3Z" />
                    </g>
                </g>
            </g>
        </g>
    );
}

const SPOKES = [0, 45, 90, 135];

/** The cart's big spoked wheel. */
function CartWheel() {
    return (
        <g transform="translate(29 26)">
            <g className={styles.wheel}>
                <circle className={styles.wheelRim} r="12.6" />
                <circle className={styles.wheelInner} r="10.4" />
                {SPOKES.map((a) => (
                    <path key={a} className={styles.wheelSpoke} transform={`rotate(${a})`} d="M-10.6 0H10.6" />
                ))}
                <circle className={styles.wheelHub} r="2.4" />
            </g>
        </g>
    );
}

/** The horse cart, facing right, with its feet on the ground at y = 39. */
function HorseCart() {
    return (
        <svg className={styles.cart} viewBox="0 -6 122 46" focusable="false">
            {/* The cart rocks gently over the road. */}
            <g className={styles.cartBody}>
                <path className={styles.cartShaft} d="M52 21L94 18" />
                <path className={styles.cartCanopyFill} d="M11 16V8C11 4.5 19 2 30 2C41 2 49 4.5 49 8V16Z" />
                <path className={styles.cartCanopy} d="M7 16V7C7 1.5 17 -1.5 30 -1.5C43 -1.5 53 1.5 53 7V16H49V8C49 4.5 41 2 30 2C19 2 11 4.5 11 8V16Z" />
                <path className={styles.cartTrim} d="M7 7C14 3 46 3 53 7" />
                <path className={styles.cartBox} d="M4 16H56L54 24H6Z" />
                <path className={styles.cartTrimLine} d="M6 19.5H54.5M16 16V24M29 16V24M42 16V24" />
            </g>
            <CartWheel />

            {/* The horse: far legs, tail, body, near legs, then the neck and head. */}
            <g className={styles.horseBob}>
                <HorseLeg x={101} y={22} far late />
                <HorseLeg x={74} y={22} far rear />

                <g transform="translate(69 14)">
                    <g className={styles.horseTail}>
                        <path className={styles.horseDark} d="M0 -1C-6 -1 -9 5 -8.6 15C-6 12 -3.5 8 0 4Z" />
                    </g>
                </g>

                <path className={styles.horseCoat} d="M69 15C71 10 80 9.5 88 10.5C92.5 11 96 10.5 99 9L105 13C108 17 107 22 103 24C97 26.5 85 26.5 78 25C72 24 67.5 19.5 69 15Z" />
                <path className={styles.horseHarness} d="M93 11C94 16 95 21 96 25M78 10C77.5 15 77.5 20 78 25" />

                <HorseLeg x={104} y={22} />
                <HorseLeg x={77} y={22} rear late />

                <g className={styles.horseHead}>
                    <path className={styles.horseCoat} d="M96.5 11.5C100 7 104 2.6 108 0.6L113 3.4C111.5 6.4 110.5 10 108.5 15C107 19 104.5 22 102 23C100 18 97.5 14.5 96.5 11.5Z" />
                    <path className={styles.horseCoat} d="M107.6 0.4C107.6 -2 109 -3 109.4 -5L111.2 -2.2C114.2 -1.2 118.2 3 120.8 6.6C121.8 8.6 119.8 10.2 117.8 9.4C115.2 8.4 112.6 7 110.6 6.6C108.6 5 107.4 2.6 107.6 0.4Z" />
                    <path className={styles.horseMane} d="M108 -0.6C103.6 2 99.4 6.6 96.4 11.6" />
                    <circle className={styles.horseEye} cx="112.6" cy="2.2" r="0.9" />
                    <path className={styles.horseHarnessFine} d="M111 -1.6L114.6 7.8M118 5.6L113 4.2" />
                    <path className={styles.horseHarnessFine} d="M113.4 5.4C105 12 80 8 54 7.6" />
                </g>
            </g>
        </svg>
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

/** The bird the feather becomes, facing right, with its feet at the bottom of the drawing. */
function Bird() {
    return (
        <svg className={styles.birdShape} viewBox="-15 -13 30 26" focusable="false">
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
 * In front of the drawings, behind the links: the road and rail, the horse cart,
 * the long bullet train, the sakura branch, the petal, the feather and the bird.
 * The links come later in the page, so all of this passes behind the logo and the
 * buttons. Things that float are nested: one layer carries them across, one lifts
 * and lowers them, one turns them, so no direction ever has to wait for another.
 */
export function NavStoryFront() {
    return (
        <div className={`${styles.layer} ${styles.storyRoot}`} aria-hidden="true">
            <div className={styles.road} />
            <div className={styles.rail} />

            <div className={styles.line}>
                <div className={styles.cartRun}>
                    <HorseCart />
                </div>
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
                        <Blossom delay={i * 0.25} />
                    </g>
                ))}
            </svg>

            <div className={styles.petal}>
                <div className={styles.petalDrift}>
                    <svg className={styles.petalSpin} viewBox="-6 -6 12 12" focusable="false">
                        <path d="M0 -5C4 -3 4 3 0 5C-4 3 -4 -3 0 -5Z" />
                    </svg>
                </div>
            </div>

            <div className={styles.looseFeather}>
                <div className={styles.featherDrift}>
                    <svg className={styles.featherRock} viewBox="-9 -56 18 60" focusable="false">
                        <path className={styles.looseVane} d="M0 -14C-3 -22 -8 -34 -7.5 -44C-7 -52 -3 -55 0 -55C3 -55 7 -52 7.5 -44C8 -34 3 -22 0 -14Z" />
                        <path className={styles.looseBarbs} d="M0 -18L-5 -27M0 -18L5 -27M0 -24L-6.5 -34M0 -24L6.5 -34M0 -30L-7 -41M0 -30L7 -41M0 -8L-3 -14M0 -8L3 -14M0 -2L-2 -6M0 -2L2 -6" />
                        <path className={styles.looseQuill} d="M1 3C0 -10 -0.6 -24 0 -40" />
                        <ellipse className={styles.featherEye} cx="0" cy="-45" rx="4.4" ry="5.6" />
                        <ellipse className={styles.featherIris} cx="0" cy="-45" rx="2.9" ry="3.8" />
                        <circle className={styles.featherPupil} cx="0" cy="-45" r="1.6" />
                    </svg>
                </div>
            </div>

            <div className={styles.bird}>
                <div className={styles.birdRise}>
                    <Bird />
                </div>
            </div>
        </div>
    );
}
