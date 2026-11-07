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
 * 3. The Return Gift: a royal elephant walks to the lotus and raises its trunk,
 *    throwing Holi colours and gold sparkles across to Japan. They land a little
 *    left of Fuji, where a Nara deer appears and bows to India. As it rises, the
 *    trunk comes down at the same moment, and the loop ends. The cart comes again.
 *
 * All timing lives in NavStory.module.css; everything here is decoration.
 */

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

// The trunk is a chain of joints, so it curls as it lifts. Each joint turns from
// its pose hanging down to its pose raised, relative to the joint before it.
const TRUNK = [
    { down: -8, up: -70, width: 13 },
    { down: 6, up: -40, width: 11.5 },
    { down: 6, up: -40, width: 10 },
    { down: 2, up: -25, width: 8.5 },
    { down: -12, up: -10, width: 7 },
    { down: -24, up: 25, width: 5.5 },
];
const TRUNK_JOINT = 8.2;

function Trunk({ joint = 0 }: { joint?: number }) {
    const part = TRUNK[joint];
    if (!part) return null;
    const half = part.width / 2 - 0.6;
    return (
        <g className={styles.trunkJoint} style={{ '--down': `${part.down}deg`, '--up': `${part.up}deg` } as CSSProperties}>
            <path className={styles.trunkPart} style={{ strokeWidth: part.width }} d={`M0 0V${TRUNK_JOINT}`} />
            <path className={styles.trunkCrease} d={`M${-half} ${TRUNK_JOINT * 0.3}H${half}M${-half} ${TRUNK_JOINT * 0.7}H${half}`} />
            <g transform={`translate(0 ${TRUNK_JOINT})`}>
                <Trunk joint={joint + 1} />
            </g>
        </g>
    );
}

/** A pillar leg with toenails and a gold anklet. */
function ElephantLeg({ x, far = false, step }: { x: number; far?: boolean; step: string }) {
    return (
        <g transform={`translate(${x} -26)`}>
            <g className={step}>
                <path className={far ? styles.elephantFar : styles.elephantSkin} d="M-8 -3H8L8.6 22C8.6 25 7 26 5 26H-5C-7 26 -8.6 25 -8.6 22Z" />
                <path className={styles.elephantAnklet} d="M-8.6 15H8.6V18.4H-8.6Z" />
                {far ? null : <path className={styles.elephantNails} d="M-6 25.4C-6 23.6 -3 23.6 -3 25.4M-1.5 25.4C-1.5 23.6 1.5 23.6 1.5 25.4M3 25.4C3 23.6 6 23.6 6 25.4" />}
            </g>
        </g>
    );
}

/** The royal elephant, facing the lotus and Japan, with its feet on the ground at y = 0. Sits inside the Taj drawing. */
export function TajElephant() {
    return (
        <g className={styles.elephantPlace}>
            <g className={styles.elephant}>
                <ElephantLeg x={-23} far step={styles.legB} />
                <ElephantLeg x={26} far step={styles.legA} />

                <g transform="translate(-46 -50)">
                    <g className={styles.elephantTail}>
                        <path className={styles.elephantTailLine} d="M0 0C-4 6 -5.5 14 -4.5 23" />
                        <path className={styles.elephantFarFill} d="M-4.5 22C-7 25 -6.6 29 -4.4 31C-2.6 29 -2.2 25 -4.5 22Z" />
                    </g>
                </g>

                <path className={styles.elephantSkin} d="M-47 -30C-49 -48 -37 -64 -14 -66C2 -67 15 -65 24 -60L31 -32C26 -21 14 -18 -2 -18C-20 -18 -37 -18 -45 -24Z" />
                <ElephantLeg x={-33} step={styles.legA} />
                <ElephantLeg x={15} step={styles.legB} />

                {/* The royal cloth, in red and gold */}
                <path className={styles.elephantCloth} d="M-36 -62C-22 -67 0 -67 11 -63L13 -35C6 -28 -28 -28 -38 -35Z" />
                <path className={styles.elephantClothInner} d="M-32 -59C-20 -63 -2 -63 8 -60L9.6 -37C3 -32 -25 -32 -34 -37Z" />
                <circle className={styles.elephantGold} cx="-12" cy="-47" r="6.4" />
                <circle className={styles.elephantJewel} cx="-12" cy="-47" r="2.8" />
                <path className={styles.elephantFringe} d="M-37 -33.5C-27 -27.5 5 -27.5 12.6 -33.5" />

                {/* The howdah: a gold seat under a small dome */}
                <path className={styles.howdahCurtain} d="M-25 -72H1V-84H-25Z" />
                <path className={styles.howdahPost} d="M-25 -72V-85M1 -72V-85M-12 -72V-85" />
                <path className={styles.elephantGold} d="M-30 -65L-31 -72H7L6 -65Z" />
                <path className={styles.elephantGold} d="M-30 -85C-25 -97 -1 -97 6 -85Z" />
                <path className={styles.howdahPost} d="M-12 -94V-100" />

                {/* The head lifts a little with the trunk */}
                <g className={styles.elephantHead}>
                    <path className={styles.elephantTusk} d="M41 -38C45 -30 52 -27 59 -29C54 -32 49 -36 46 -41Z" />
                    <path className={styles.elephantSkin} d="M18 -66C28 -75 43 -73 48 -60C52 -50 50 -40 45 -36C38 -31 27 -34 21 -41C15 -48 13 -60 18 -66Z" />
                    <g transform="translate(45 -48)">
                        <Trunk />
                    </g>
                    <g transform="translate(23 -58)">
                        <g className={styles.elephantEar}>
                            <path className={styles.elephantEarFill} d="M0 -8C-10 -15 -23 -9 -24 3C-25 14 -16 24 -6 24C0 22 3 11 3 1Z" />
                            <path className={styles.elephantEarRim} d="M-2 -8C-11 -12 -21 -7 -21.6 3C-22 12 -15 21 -7 21.4" />
                        </g>
                    </g>
                    {/* The gold headpiece and jewel */}
                    <path className={styles.elephantGold} d="M29 -71C37 -72 43 -67 45.5 -60L39 -48L33 -56Z" />
                    <circle className={styles.elephantJewel} cx="39" cy="-61" r="2.2" />
                    <path className={styles.elephantEyeWhite} d="M34.6 -52.4C36 -54.4 39 -54.4 40.4 -52.4C39 -50.8 36 -50.8 34.6 -52.4Z" />
                    <circle className={styles.elephantEye} cx="37.6" cy="-52.5" r="1.3" />
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

// The colours the elephant throws. Each piece follows its own arc across, slightly
// after the one before, so they travel as a drifting cloud and land scattered.
const HOLI = ['--color-holi-pink', '--color-holi-marigold', '--color-holi-teal', '--color-holi-violet', '--color-gold'];
const SPARKS = Array.from({ length: 28 }, (_, i) => ({
    colour: HOLI[i % HOLI.length],
    delay: ((i * 7) % 28) * 0.06,
    size: 5 + ((i * 5) % 6),
    apex: ((i * 11) % 26) / 26,
    landX: ((i * 13) % 96) - 48,
    landY: (i * 3) % 18,
    star: i % 3 === 0,
}));
const HOLI_PUFFS = ['--color-holi-pink', '--color-holi-marigold', '--color-holi-teal', '--color-holi-violet'];

/** The Nara deer, facing India, with its feet at the bottom of the drawing. */
function NaraDeer() {
    return (
        <svg className={styles.deerShape} viewBox="0 -8 70 74" focusable="false">
            <path className={styles.deerFar} d="M26 42L28 52L27 63H31L32 52L33 43Z" />
            <path className={styles.deerFar} d="M41 43L44 51L42 63H46L49 51L50 41Z" />
            <path className={styles.deerHoof} d="M27 61.4H31V64H27ZM42 61.4H46V64H42Z" />

            <g className={styles.deerLean}>
                <path className={styles.deerTail} d="M59 31C63 30 64 33 62.6 36C61 36.4 59.6 34.6 59 31Z" />
                <path className={styles.deerCoat} d="M18 30C22 25 34 24 44 25C52 25 58 28 60 34C61 40 57 44 50 45C40 47 28 46 22 44C18 42 16 35 18 30Z" />
                <path className={styles.deerRump} d="M55.6 29C60 30 62 36 60 41.4C56.6 41 54.6 35 55.6 29Z" />
                <g className={styles.deerBow}>
                    <circle className={styles.deerCoat} cx="24" cy="34.4" r="7" />
                    <path className={styles.deerCoat} d="M17 37C15.5 27 13 18 12 11L21 8C22.5 14 24 23 26 29L24 38Z" />
                    <path className={styles.deerThroat} d="M17.6 31C16.4 26 14.4 21 13 15.4L15.4 15C16.4 20 18 25.6 19.6 30Z" />
                    <path className={styles.deerCoat} d="M19.6 7.4C22.6 3 26.4 2.4 29 3.6C27 7 23.6 9.4 20.4 10Z" />
                    <path className={styles.deerEarInner} d="M21.6 7.4C23.4 5.2 25.4 4.4 27 4.6C25.6 6.4 23.6 7.6 21.6 8.2Z" />
                    <path className={styles.deerCoat} d="M12 12C12 7.6 16 5 20 6C21.4 7 22 9 21 11C18 13.6 14 15.4 10 16.2C6 17 2 17 1 15C0 13 2 12 4 11C7 10 10 11 12 12Z" />
                    <path className={styles.deerNose} d="M0.8 14.6C1 12.8 2.4 12 3.8 11.6L4.2 14.4C3 15.6 1.8 15.6 0.8 14.6Z" />
                    <circle className={styles.deerEye} cx="13.2" cy="10" r="1.3" />
                    <path className={styles.deerAntler} d="M17 6C16.4 2 15 -1 12.6 -4.4M15.8 1.4L19.4 -2.6M14 -1.8L10 -2.2M18.6 6C19 3.4 20.6 0.4 23 -2.4M20.4 0.8L24.6 1" />
                </g>
                <path className={styles.deerSpots} d="M29 30.2H29.1M36 28.8H36.1M43 28.8H43.1M49.6 30.4H49.7M32.6 35.2H32.7M39.6 34H39.7M46 35.4H46.1M53 34.4H53.1" />
            </g>

            <path className={styles.deerCoat} d="M21 41L22 52L21 63H25L26 52L27.4 42Z" />
            <path className={styles.deerCoat} d="M47 42L50 50L48 63H52L55 50L56.6 39Z" />
            <path className={styles.deerHoof} d="M21 61.4H25V64H21ZM48 61.4H52V64H48Z" />
        </svg>
    );
}

/**
 * In front of the drawings, behind the links: the road and rail, the horse cart,
 * the long bullet train, the sakura branch, the petal, the Holi colours and the deer.
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

            {HOLI_PUFFS.map((colour, i) => (
                <div key={colour} className={styles.throwPuff} style={{ '--c': `var(${colour})`, '--delay': `${i * 0.28}s` } as CSSProperties} />
            ))}

            {SPARKS.map((spark, i) => (
                <div
                    key={i}
                    className={styles.spark}
                    style={{
                        '--c': `var(${spark.colour})`,
                        '--delay': `${spark.delay}s`,
                        '--apex': spark.apex,
                        '--land-x': `${spark.landX}px`,
                        '--land-y': `${spark.landY}px`,
                        '--size': `${spark.size}px`,
                    } as CSSProperties}
                >
                    <div className={`${styles.sparkFall} ${spark.star ? styles.sparkStar : ''}`} />
                </div>
            ))}

            {HOLI_PUFFS.map((colour, i) => (
                <div key={colour} className={styles.landPuff} style={{ '--c': `var(${colour})`, '--delay': `${i * 0.3}s`, '--shift': `${(i - 1.5) * 26}px` } as CSSProperties} />
            ))}

            <div className={styles.deer}>
                <NaraDeer />
            </div>
        </div>
    );
}
