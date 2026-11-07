import { TajElephant, TajLotus } from './NavStory';
import story from './NavStory.module.css';
import styles from './Navigation.module.css';

// pathLength={1} on every stroke lets CSS draw the art in on page load.

/*
 * The Taj Mahal, measured from a straight-on photograph and drawn at 0.52 units
 * per photo pixel, centred on x = 160. Its proportions are the building's own:
 * nearly twice as wide as tall, a broad rounded dome on a patterned collar, four
 * roof pavilions, a tall arched portal, two storeys of side arches, four minarets
 * and a long marble plinth.
 */

/** A pointed Mughal arch with full shoulders, open at the bottom. */
function arch(x: number, w: number, spring: number, apex: number, base: number) {
    const c = x + w / 2;
    const rise = spring - apex;
    return `M${x} ${base}V${spring}C${x} ${spring - rise * 0.55} ${c - w * 0.28} ${apex + rise * 0.22} ${c} ${apex}C${c + w * 0.28} ${apex + rise * 0.22} ${x + w} ${spring - rise * 0.55} ${x + w} ${spring}V${base}`;
}

/** A small rounded dome, used on the pavilions and minarets. */
function cupola(c: number, hw: number, base: number, top: number) {
    const h = base - top;
    return `M${c - hw * 0.9} ${base}C${c - hw * 1.12} ${base - h * 0.42} ${c - hw * 0.85} ${base - h * 0.86} ${c} ${top}C${c + hw * 0.85} ${base - h * 0.86} ${c + hw * 1.12} ${base - h * 0.42} ${c + hw * 0.9} ${base}`;
}

type MinaretShape = {
    c: number; // centre
    base: number; // where the shaft meets the plinth
    baseHw: number; // half width at the base
    topHw: number; // half width under the top balcony
    rings: number[]; // the two lower balconies
    top: number; // the top balcony
    pillars: number; // top of the open pavilion
    dome: number; // top of its dome
    tip: number; // top of its finial
    courses?: boolean; // the bands of stone on the larger pair
};

const FRONT_MINARET: MinaretShape = { c: 38, base: 112, baseHw: 7.6, topHw: 5.4, rings: [84.3, 55.7], top: 25, pillars: 15, dome: 6.5, tip: 2.4, courses: true };
const REAR_MINARET: MinaretShape = { c: 85, base: 112, baseHw: 4.7, topHw: 3.5, rings: [99.4, 82.2], top: 63, pillars: 56.5, dome: 52, tip: 49 };

function shaftHw(m: MinaretShape, y: number) {
    return m.topHw + ((m.baseHw - m.topHw) * (y - m.top)) / (m.base - m.top);
}

function ring(m: MinaretShape, y: number, grow: number) {
    const hw = shaftHw(m, y) + grow;
    return `M${m.c - hw} ${y}H${m.c + hw}V${y + grow}L${m.c + hw - grow} ${y + grow * 1.7}H${m.c - hw + grow}L${m.c - hw} ${y + grow}Z`;
}

function shaft(m: MinaretShape) {
    return `M${m.c - m.baseHw} ${m.base}L${m.c - m.topHw} ${m.top}H${m.c + m.topHw}L${m.c + m.baseHw} ${m.base}`;
}

function MinaretFill({ m }: { m: MinaretShape }) {
    const eave = m.topHw * 1.45;
    return (
        <>
            <path className={styles.tajColumn} d={`${shaft(m)}Z`} />
            <path d={`M${m.c - m.topHw * 1.1} ${m.top}V${m.pillars}H${m.c + m.topHw * 1.1}V${m.top}Z`} />
            <path d={`M${m.c - eave} ${m.pillars}H${m.c + eave}L${m.c + eave - 1} ${m.pillars - 1.4}H${m.c - eave + 1}Z`} />
            <path className={styles.tajColumn} d={`${cupola(m.c, m.topHw * 1.2, m.pillars - 1.4, m.dome)}Z`} />
        </>
    );
}

function Minaret({ m }: { m: MinaretShape }) {
    const grow = m.courses ? 1.7 : 1.1;
    const eave = m.topHw * 1.45;
    const courses = m.courses
        ? Array.from({ length: 11 }, (_, i) => m.base - 2 - i * 7.6)
            .filter((y) => y > m.top + 2 && !m.rings.some((r) => Math.abs(y - r) < 3))
            .map((y) => `M${m.c - shaftHw(m, y)} ${y}H${m.c + shaftHw(m, y)}`)
            .join('')
        : '';
    const posts = [-0.72, 0, 0.72].map((f) => `M${m.c + m.topHw * 1.1 * f} ${m.top}V${m.pillars}`).join('');
    return (
        <>
            <path pathLength={1} d={shaft(m)} />
            {courses ? <path className={styles.fine} pathLength={1} d={courses} /> : null}
            {m.rings.map((y) => <path key={y} className={styles.tajLedge} pathLength={1} d={ring(m, y, grow)} />)}
            <path className={styles.tajLedge} pathLength={1} d={ring(m, m.top, grow)} />
            <path className={styles.fine} pathLength={1} d={posts} />
            <path className={styles.tajLedge} pathLength={1} d={`M${m.c - eave} ${m.pillars}H${m.c + eave}L${m.c + eave - 1} ${m.pillars - 1.4}H${m.c - eave + 1}Z`} />
            <path pathLength={1} d={cupola(m.c, m.topHw * 1.2, m.pillars - 1.4, m.dome)} />
            <path pathLength={1} d={`M${m.c} ${m.dome}V${m.tip}`} />
        </>
    );
}

/** A slim pinnacle (guldasta) on a corner of the facade. */
function Pinnacle({ x, base, top }: { x: number; base: number; top: number }) {
    return <path pathLength={1} d={`M${x - 1} ${base}V${top + 3}H${x + 1}V${base}M${x - 1.5} ${top + 3}C${x - 1.5} ${top + 1.5} ${x - 0.4} ${top + 1} ${x} ${top}C${x + 0.4} ${top + 1} ${x + 1.5} ${top + 1.5} ${x + 1.5} ${top + 3}Z`} />;
}

const SIDE_ARCHES = [
    arch(99, 9.4, 80, 71.8, 89.5),
    arch(99, 9.4, 101.5, 94, 112),
    arch(115.5, 13.5, 79, 69.8, 89.5),
    arch(115.5, 13.5, 102, 94, 112),
];

/** One side of the Taj, drawn on the left; mirrored for the right. Outlines only. */
function TajSide() {
    return (
        <>
            <Minaret m={REAR_MINARET} />
            <Minaret m={FRONT_MINARET} />

            {/* A roof pavilion: three open arches, a wide eave, a rounded dome */}
            <path pathLength={1} d="M115.7 61.4V53.4M132.3 61.4V53.4" />
            <path className={styles.fine} pathLength={1} d={`${arch(117, 4.4, 57, 54.4, 61.4)}${arch(121.8, 4.4, 57, 54.4, 61.4)}${arch(126.6, 4.4, 57, 54.4, 61.4)}`} />
            <path className={styles.tajLedge} pathLength={1} d="M114.2 53.4H133.8L132.6 51.6H115.4Z" />
            <path pathLength={1} d={cupola(124, 9.4, 51.6, 37.8)} />
            <path pathLength={1} d="M124 37.8V33.4" />

            <Pinnacle x={96.8} base={61.4} top={46} />
            <Pinnacle x={109.5} base={61.4} top={48} />
            <Pinnacle x={135.4} base={54} top={45} />

            {/* The facade's side: bevelled corner bay, then the wall, two storeys of arches each */}
            <path pathLength={1} d="M96.3 112V61.4H135.4" />
            <path className={styles.fine} pathLength={1} d="M109.5 112V61.4M96.3 91.6H135.4M112.2 112V65H132.7V112" />
            <path className={styles.dots} pathLength={1} d="M98 63.2H134" />
            {SIDE_ARCHES.map((d) => <path key={d} pathLength={1} d={d} />)}
            <path className={styles.fine} pathLength={1} d={`${arch(119, 6.5, 82, 77, 89.5)}${arch(119, 6.5, 104.5, 99, 112)}`} />
            <circle className={styles.rosette} pathLength={1} cx="114.2" cy="68" r="1" />
            <circle className={styles.rosette} pathLength={1} cx="130.7" cy="68" r="1" />
        </>
    );
}

/** The solid gold under one side of the Taj's outlines. */
function TajSideFill() {
    return (
        <>
            <MinaretFill m={REAR_MINARET} />
            <MinaretFill m={FRONT_MINARET} />
            <path d="M115.7 61.4V53.4H132.3V61.4Z" />
            <path d="M114.2 53.4H133.8L132.6 51.6H115.4Z" />
            <path className={styles.tajColumn} d={`${cupola(124, 9.4, 51.6, 37.8)}Z`} />
            {/* The square block each front minaret stands on */}
            <path d="M26 112V110H46V112Z" />
        </>
    );
}

/** The recessed arches on one side, and the bevelled corner in shade. */
function TajSideDepth() {
    return (
        <>
            <path className={styles.tajShade} d="M96.3 61.4H109.5V112H96.3Z" />
            {SIDE_ARCHES.map((d) => <path key={d} d={`${d}Z`} />)}
        </>
    );
}

// The great dome: broad and rounded, barely narrower at its foot than at its widest.
const DOME = 'M135 34.4C132.3 30.6 131.4 26 131.4 21.6C131.4 10.6 145 3.8 160 2.4C175 3.8 188.6 10.6 188.6 21.6C188.6 26 187.7 30.6 185 34.4Z';
// Its fluted lotus cap, flaring out over the top of the dome.
const LOTUS_CAP = 'M149 6.4C152.4 5.8 155.6 3.4 157.8 -0.4H162.2C164.4 3.4 167.6 5.8 171 6.4C167.6 7.8 152.4 7.8 149 6.4Z';
// The blind arches along the plinth, between the minaret blocks.
const PLINTH_ARCHES = Array.from({ length: 22 }, (_, i) => arch(49 + i * 10.2, 7.6, 120, 116.8, 125.6)).join('');

/** The Taj Mahal in gold, seen straight on from the gate. The India side of the nav. */
export function TajArt() {
    return (
        <svg className={`${styles.art} ${styles.taj}`} viewBox="0 0 320 130" aria-hidden="true" focusable="false">
            <defs>
                <linearGradient id="nav-taj-gold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" style={{ stopColor: 'var(--color-gold-pale)' }} />
                    <stop offset="1" style={{ stopColor: 'var(--color-gold-light)' }} />
                </linearGradient>
                <linearGradient id="nav-taj-column" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" style={{ stopColor: 'var(--color-gold-light)' }} />
                    <stop offset="0.4" style={{ stopColor: 'var(--color-gold-pale)' }} />
                    <stop offset="1" style={{ stopColor: 'var(--color-gold)' }} />
                </linearGradient>
                <radialGradient id="nav-taj-dome" cx="0.38" cy="0.32" r="0.78">
                    <stop offset="0" style={{ stopColor: 'var(--color-surface-bright)' }} />
                    <stop offset="0.45" style={{ stopColor: 'var(--color-gold-light)' }} />
                    <stop offset="1" style={{ stopColor: 'var(--color-gold)' }} />
                </radialGradient>
                <linearGradient id="nav-taj-depth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" style={{ stopColor: 'var(--color-gold-deep)' }} />
                    <stop offset="1" style={{ stopColor: 'var(--color-gold)' }} />
                </linearGradient>
            </defs>

            <g className={story.storyRoot}>
                <TajElephant />
                <TajLotus />
            </g>

            <g className={`${story.storyRoot} ${story.tajDusk}`}>
                <g className={styles.tajFill}>
                    <TajSideFill />
                    <g transform="matrix(-1 0 0 1 320 0)"><TajSideFill /></g>
                    <path d="M136 54V44.8H184V54Z" />
                    <path d="M134.5 44.8V34.4H185.5V44.8Z" />
                    <path className={styles.tajDomeFill} d={DOME} />
                    <path d={LOTUS_CAP} />
                    <path d="M96.3 61.4H223.7V112H96.3Z" />
                    <path d="M135.4 54H184.6V112H135.4Z" />
                    <path d="M26 112H294V128H26Z" />
                </g>
                <g className={styles.tajDepth}>
                    <TajSideDepth />
                    <g transform="matrix(-1 0 0 1 320 0)"><TajSideDepth /></g>
                    <path d={`${arch(144.4, 31.2, 81.2, 64.6, 112)}Z`} />
                </g>

                <g className={styles.drawn}>
                    {/* The ground, and the long marble plinth with its row of blind arches */}
                    <path pathLength={1} d="M2 128H318" />
                    <path pathLength={1} d="M26 128V112H294V128" />
                    <path className={styles.fine} pathLength={1} d="M26 114.6H294M46 112V128M274 112V128" />
                    <path className={styles.fine} pathLength={1} d={PLINTH_ARCHES} />
                    <path className={styles.fine} pathLength={1} d={`${arch(31, 10, 120, 116.4, 126)}${arch(279, 10, 120, 116.4, 126)}`} />

                    <TajSide />
                    <g transform="matrix(-1 0 0 1 320 0)"><TajSide /></g>

                    {/* The drum, and the dome's patterned collar */}
                    <path pathLength={1} d="M136 54V44.8H184V54" />
                    <path pathLength={1} d="M134.5 44.8V34.4H185.5V44.8Z" />
                    <path className={styles.fine} pathLength={1} d="M134.5 37.6H185.5M134.5 41.6H185.5" />
                    <path className={styles.dots} pathLength={1} d="M136 39.6H184" />

                    {/* The great dome, its fluted lotus cap, and the finial of stacked gold balls and a crescent */}
                    <path pathLength={1} d={DOME} />
                    <path className={styles.tajLedge} pathLength={1} d={LOTUS_CAP} />
                    <path className={styles.fine} pathLength={1} d="M153 6.8L158.6 0M156.6 7.4L159.2 0M160 7.6V0M163.4 7.4L160.8 0M167 6.8L161.4 0" />
                    <path pathLength={1} d="M160 -0.4V-15" />
                    <circle className={styles.finialBall} pathLength={1} cx="160" cy="-2.4" r="1.2" />
                    <circle className={styles.finialBall} pathLength={1} cx="160" cy="-6" r="2" />
                    <circle className={styles.finialBall} pathLength={1} cx="160" cy="-9.8" r="1.2" />
                    <path pathLength={1} d="M157 -15.2C157.2 -11.8 162.8 -11.8 163 -15.2" />
                    <path pathLength={1} d="M160 -15V-17.6" />

                    {/* The great arched portal in its tall frame, with gold inlay around the arch */}
                    <path pathLength={1} d="M135.4 112V54H184.6V112" />
                    <path className={styles.fine} pathLength={1} d="M139.7 112V59.4H180.3V112" />
                    <path className={styles.dots} pathLength={1} d="M137.6 56.8H182.4M137.6 58V112M182.4 58V112" />
                    <path className={styles.fine} pathLength={1} d={arch(142.2, 35.6, 81.2, 61.6, 112)} />
                    <path pathLength={1} d={arch(144.4, 31.2, 81.2, 64.6, 112)} />
                    <circle className={styles.rosette} pathLength={1} cx="144.6" cy="65" r="1.7" />
                    <circle className={styles.rosette} pathLength={1} cx="175.4" cy="65" r="1.7" />
                    {/* Inside the arch: a window above, a balcony line, a doorway below */}
                    <path className={styles.tajInner} pathLength={1} d={`${arch(155.4, 9.2, 85, 79.6, 90.6)}M155.4 90.6H164.6M160 79.6V90.6M155.4 85.4H164.6`} />
                    <path className={styles.tajInner} pathLength={1} d="M147.6 94.2H172.4" />
                    <path className={styles.tajInner} pathLength={1} d={`${arch(154.4, 11.2, 102.6, 97.2, 112)}M160 97.2V112`} />
                </g>
            </g>
        </svg>
    );
}

/** A stylised gold cloud with curled ends, at the foot of Fuji. */
function FujiCloud({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
    return (
        <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
            <path className={styles.cloudFill} d="M-30 4C-30 0 -24 -2 -20 0C-18 -6 -8 -8 -3 -3C2 -8 12 -7 14 -1C20 -3 28 -1 30 4Z" />
            <path pathLength={1} d="M-30 4C-30 0 -24 -2 -20 0C-18 -6 -8 -8 -3 -3C2 -8 12 -7 14 -1C20 -3 28 -1 30 4H-30" />
            <path className={styles.fine} pathLength={1} d="M-20 0C-18 3 -13 3 -13 -1C-13 -3 -16 -3 -16 -1M14 -1C13 2 8 2 8 -2C8 -4 11 -4 11 -2" />
        </g>
    );
}

/** Mount Fuji in gold, with its red sun: the Japan side of the nav. */
export function FujiArt() {
    return (
        <svg className={`${styles.art} ${styles.fuji}`} viewBox="0 0 320 130" aria-hidden="true" focusable="false">
            <defs>
                <linearGradient id="nav-fuji-gold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" style={{ stopColor: 'var(--color-gold)' }} />
                    <stop offset="0.55" style={{ stopColor: 'var(--color-gold-light)' }} />
                    <stop offset="1" style={{ stopColor: 'var(--band-right)' }} />
                </linearGradient>
            </defs>

            <g className={`${story.storyRoot} ${story.sunPath}`}>
                <circle className={styles.sunRing} cx="160" cy="34" r="26" />
                <circle className={styles.sun} cx="160" cy="34" r="22" />
            </g>

            {/* The filled mountain hides the sun as it sets. */}
            <path className={styles.mountainFill} d="M4 128C60 118 104 92 132 52C137 45 142 40 148 40H172C178 40 183 45 188 52C216 92 260 118 316 128Z" />
            <path className={styles.mountainGold} d="M4 128C60 118 104 92 132 52C137 45 142 40 148 40H172C178 40 183 45 188 52C216 92 260 118 316 128Z" />
            <path className={styles.snowFill} d="M132 52C137 45 142 40 148 40H172C178 40 183 45 188 52L200 69C194 75 190 66 184 72C178 80 174 66 168 74C162 84 158 68 152 74C146 80 142 66 136 72C130 76 126 73 120 69Z" />

            <g className={styles.drawn}>
                <path pathLength={1} d="M4 128C60 118 104 92 132 52C137 45 142 40 148 40H172C178 40 183 45 188 52C216 92 260 118 316 128" />
                <path pathLength={1} d="M120 69C126 73 130 76 136 72C142 66 146 80 152 74C158 68 162 84 168 74C174 66 178 80 184 72C190 66 194 75 200 69" />
                {/* Crater, and gold ridges fanning down the slopes */}
                <path className={styles.fine} pathLength={1} d="M148 43C152 46 156 44 160 46C164 44 168 46 172 43" />
                <path className={styles.fine} pathLength={1} d="M136 78C124 96 104 110 80 120M146 82C138 98 124 112 108 122M154 84C150 98 142 112 134 124M160 86V124M166 84C170 98 178 112 186 124M174 82C182 98 196 112 212 122M184 78C196 96 216 110 240 120" />
                <path className={styles.dots} pathLength={1} d="M150 60C156 62 164 62 170 60" />
                <FujiCloud x={66} y={112} />
                <FujiCloud x={254} y={112} flip />
            </g>
        </svg>
    );
}

/** The shield's outline, drawn in a 200 x 130 box. */
const SHIELD = 'M100 2C108 12 122 14 136 12C146 11 154 16 158 24C168 24 176 30 178 40C190 44 198 54 198 65C198 76 190 86 178 90C176 100 168 106 158 106C154 114 146 119 136 118C122 116 108 118 100 128C92 118 78 116 64 118C54 119 46 114 42 106C32 106 24 100 22 90C10 86 2 76 2 65C2 54 10 44 22 40C24 30 32 24 42 24C46 16 54 11 64 12C78 14 92 12 100 2Z';

/** One side of the shield's scrollwork, mirrored for the other. */
function Scrollwork({ mirror = false }: { mirror?: boolean }) {
    return (
        <g transform={mirror ? 'matrix(-1 0 0 1 200 0)' : undefined}>
            <path d="M100 13C92 20 80 22 68 21C60 20 54 23 52 30" />
            <path d="M96 24C86 28 76 28 68 27C64 27 62 30 64 33C66 35 69 34 69 31" />
            <path d="M52 30C46 30 42 33 40 38M40 38C44 37 47 39 47 42" />
            <path d="M100 117C92 110 80 108 68 109C60 110 54 107 52 100" />
            <path d="M96 106C86 102 76 102 68 103C64 103 62 100 64 97C66 95 69 96 69 99" />
            <path d="M52 100C46 100 42 97 40 92M40 92C44 93 47 91 47 88" />
            <path d="M22 65C18 62 14 62 10 65C14 68 18 68 22 65Z" />
        </g>
    );
}

/**
 * The logo as a gold shield. `id` keeps its gradient ids unique, because the
 * nav renders one for the phone bar and one for the desktop band.
 */
export function NavBadge({ id, className }: { id: string; className?: string }) {
    const gold = `${id}-gold`;
    const face = `${id}-face`;
    const shine = `${id}-shine`;
    const clip = `${id}-clip`;
    return (
        <svg className={[styles.badge, className].filter(Boolean).join(' ')} viewBox="0 0 200 130" role="img" aria-label="Kanmani Tours">
            <defs>
                <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#8C6A2C" />
                    <stop offset="0.3" stopColor="#E9D39A" />
                    <stop offset="0.5" stopColor="#B8924F" />
                    <stop offset="0.72" stopColor="#F1DFA8" />
                    <stop offset="1" stopColor="#7A5A22" />
                </linearGradient>
                <radialGradient id={face} cx="0.5" cy="0.45" r="0.65">
                    <stop offset="0" stopColor="#F4E5B8" />
                    <stop offset="0.65" stopColor="#E0C587" />
                    <stop offset="1" stopColor="#C4A35F" />
                </radialGradient>
                <linearGradient id={shine} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#FFF8E0" stopOpacity="0" />
                    <stop offset="0.5" stopColor="#FFF8E0" stopOpacity="0.85" />
                    <stop offset="1" stopColor="#FFF8E0" stopOpacity="0" />
                </linearGradient>
                <clipPath id={clip}><path d={SHIELD} /></clipPath>
            </defs>

            <path d={SHIELD} fill={`url(#${gold})`} stroke="#5E4416" strokeWidth="1.5" />
            <path d={SHIELD} fill={`url(#${face})`} stroke="#7A5A22" strokeWidth="1.2" transform="translate(100 65) scale(0.93) translate(-100 -65)" />
            <path d={SHIELD} fill="none" stroke="#7A5A22" strokeWidth="0.8" transform="translate(100 65) scale(0.87) translate(-100 -65)" />

            <g className={styles.scrollwork}>
                <Scrollwork />
                <Scrollwork mirror />
            </g>

            <text className={styles.badgeWord} x="100" y="70" textAnchor="middle">Kanmani</text>
            <text className={styles.badgeTours} x="102" y="86" textAnchor="middle">TOURS</text>

            <g clipPath={`url(#${clip})`}>
                <rect className={styles.badgeShine} x="-70" y="-10" width="70" height="150" fill={`url(#${shine})`} />
            </g>
        </svg>
    );
}
