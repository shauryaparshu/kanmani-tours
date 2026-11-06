import { TajLotus, TajPeacock } from './NavStory';
import story from './NavStory.module.css';
import styles from './Navigation.module.css';

// pathLength={1} on every stroke lets CSS draw the art in on page load.

/** A pointed Mughal arch, open at the bottom: left edge, width, spring line, apex and base. */
function arch(x: number, w: number, spring: number, apex: number, base: number) {
    const c = x + w / 2;
    const rise = spring - apex;
    return `M${x} ${base}V${spring}C${x} ${spring - rise * 0.6} ${c - w * 0.16} ${apex + rise * 0.25} ${c} ${apex}C${c + w * 0.16} ${apex + rise * 0.25} ${x + w} ${spring - rise * 0.6} ${x + w} ${spring}V${base}`;
}

/** A small onion dome with its pointed tip, sitting on a flat line. */
function onion(c: number, w: number, base: number, top: number) {
    const h = base - top;
    return `M${c - w * 0.32} ${base}C${c - w * 0.56} ${base - h * 0.3} ${c - w * 0.5} ${base - h * 0.6} ${c - w * 0.16} ${base - h * 0.8}C${c - w * 0.07} ${base - h * 0.88} ${c - w * 0.02} ${base - h * 0.94} ${c} ${top}C${c + w * 0.02} ${base - h * 0.94} ${c + w * 0.07} ${base - h * 0.88} ${c + w * 0.16} ${base - h * 0.8}C${c + w * 0.5} ${base - h * 0.6} ${c + w * 0.56} ${base - h * 0.3} ${c + w * 0.32} ${base}`;
}

/** A freestanding minaret: tapering shaft, three balconies and a small domed pavilion. */
function Minaret({ c, w, top }: { c: number; w: number; top: number }) {
    const base = 114;
    const shaftTop = top + (base - top) * 0.2;
    const inset = w * 0.12;
    const ring = (y: number) => `M${c - w * 0.72} ${y}H${c + w * 0.72}V${y + 2}H${c - w * 0.72}Z`;
    const balconies = [0.27, 0.53, 0.79].map((f) => base - (base - shaftTop) * f);
    return (
        <>
            <path pathLength={1} d={`M${c - w / 2} ${base}L${c - w / 2 + inset} ${shaftTop}H${c + w / 2 - inset}L${c + w / 2} ${base}`} />
            {balconies.map((y) => <path key={y} pathLength={1} d={ring(y)} />)}
            <path className={styles.fine} pathLength={1} d={`M${c} ${base}V${shaftTop}`} />
            {/* Pavilion on the top balcony */}
            <path pathLength={1} d={`${ring(shaftTop)}M${c - w * 0.42} ${shaftTop}V${shaftTop - 6}M${c + w * 0.42} ${shaftTop}V${shaftTop - 6}M${c - w * 0.66} ${shaftTop - 6}H${c + w * 0.66}`} />
            <path pathLength={1} d={onion(c, w * 1.05, shaftTop - 6, top + 2)} />
            <path pathLength={1} d={`M${c} ${top + 2}V${top - 2}`} />
        </>
    );
}

/** The solid marble under a minaret's outlines. */
function MinaretFill({ c, w, top }: { c: number; w: number; top: number }) {
    const base = 114;
    const shaftTop = top + (base - top) * 0.2;
    const inset = w * 0.12;
    return (
        <>
            <path d={`M${c - w / 2} ${base}L${c - w / 2 + inset} ${shaftTop}H${c + w / 2 - inset}L${c + w / 2} ${base}Z`} />
            <path d={`M${c - w * 0.42} ${shaftTop}V${shaftTop - 6}H${c + w * 0.42}V${shaftTop}Z`} />
            <path d={`${onion(c, w * 1.05, shaftTop - 6, top + 2)}Z`} />
        </>
    );
}

// The front minarets stand free at the plinth's corners; the rear pair shows
// slimmer and shorter between them and the building, as it does from the gate.
const FRONT_MINARET = { c: 69, w: 11, top: 26 };
const REAR_MINARET = { c: 91, w: 7, top: 36 };

/** A roof pavilion (chhatri) beside the great dome. */
function Chhatri() {
    return (
        <>
            <path pathLength={1} d="M112 66V58M132 66V58M122 66V58" />
            <path pathLength={1} d="M109.5 58H134.5V56H109.5Z" />
            <path pathLength={1} d={onion(122, 22, 56, 40)} />
            <path pathLength={1} d="M122 40V36" />
        </>
    );
}

/** A slim pinnacle (guldasta) on a corner of the facade. */
function Pinnacle({ x, base, top }: { x: number; base: number; top: number }) {
    return (
        <path pathLength={1} d={`M${x - 1.5} ${base}V${top + 4}C${x - 2.2} ${top + 2} ${x - 0.5} ${top + 1} ${x} ${top}C${x + 0.5} ${top + 1} ${x + 2.2} ${top + 2} ${x + 1.5} ${top + 4}V${base}`} />
    );
}

/** One side of the Taj, drawn on the left; mirrored for the right. Outlines only. */
function TajSide() {
    return (
        <>
            <Minaret {...FRONT_MINARET} />
            <Minaret {...REAR_MINARET} />
            <Chhatri />
            <Pinnacle x={102} base={66} top={54} />
            <Pinnacle x={136} base={54} top={41} />

            {/* The facade's side: bevelled corner bay, then the wall, each with two storeys of arches */}
            <path pathLength={1} d="M102 114V66H136" />
            <path className={styles.fine} pathLength={1} d="M112 114V66M102 90H136" />
            <path className={styles.dots} pathLength={1} d="M103 68.5H135" />
            <path pathLength={1} d={arch(104, 6, 78, 72, 88)} />
            <path pathLength={1} d={arch(104, 6, 101, 95, 114)} />
            <path pathLength={1} d={arch(116, 16, 79, 70, 88)} />
            <path pathLength={1} d={arch(116, 16, 102, 93, 114)} />
            <path className={styles.fine} pathLength={1} d={arch(119.5, 9, 104, 98, 114)} />
            <path className={styles.fine} pathLength={1} d={arch(119.5, 9, 81, 75, 88)} />
        </>
    );
}

/** The solid gold-tinted shapes under one side of the Taj's outlines. */
function TajSideFill() {
    return (
        <>
            <MinaretFill {...FRONT_MINARET} />
            <MinaretFill {...REAR_MINARET} />
            <path d="M112 66V58H132V66Z" />
            <path d="M109.5 58H134.5V56H109.5Z" />
            <path d={`${onion(122, 22, 56, 40)}Z`} />
        </>
    );
}

/** The recessed arches on one side, in deep gold. */
function TajSideDepth() {
    return (
        <>
            <path d="M102 66H112V114H102Z" className={styles.tajShade} />
            <path d={`${arch(104, 6, 78, 72, 88)}Z`} />
            <path d={`${arch(104, 6, 101, 95, 114)}Z`} />
            <path d={`${arch(116, 16, 79, 70, 88)}Z`} />
            <path d={`${arch(116, 16, 102, 93, 114)}Z`} />
        </>
    );
}

// The great onion dome: narrow at the neck, a full shoulder, then a long point.
const DOME = 'M146 40C137 35 133 29 133 22C133 12 146 8 154 3C157 1 159 -1 160 -4C161 -1 163 1 166 3C174 8 187 12 187 22C187 29 183 35 174 40Z';

// The blind arches along the marble plinth.
const PLINTH_ARCHES = Array.from({ length: 20 }, (_, i) => arch(62 + i * 10, 6, 122, 118.5, 125)).join('');

/** The Taj Mahal in white marble and gold, seen from the gate. The India side of the nav. */
export function TajArt() {
    return (
        <svg className={`${styles.art} ${styles.taj}`} viewBox="0 0 320 130" aria-hidden="true" focusable="false">
            <defs>
                <linearGradient id="nav-taj-gold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" style={{ stopColor: 'var(--color-surface-bright)' }} />
                    <stop offset="0.75" style={{ stopColor: 'var(--color-surface-bright)' }} />
                    <stop offset="1" style={{ stopColor: 'var(--color-gold-light)' }} />
                </linearGradient>
                <linearGradient id="nav-taj-depth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" style={{ stopColor: 'var(--color-gold)' }} />
                    <stop offset="1" style={{ stopColor: 'var(--color-gold-deep)' }} />
                </linearGradient>
            </defs>

            <g className={story.storyRoot}>
                <TajPeacock />
                <TajLotus />
            </g>

            <g className={`${story.storyRoot} ${story.tajDusk}`}>
                <g className={styles.tajFill}>
                    <TajSideFill />
                    <g transform="matrix(-1 0 0 1 320 0)"><TajSideFill /></g>
                    <path d={DOME} />
                    <path d="M141 54V40H179V54Z" />
                    <path d="M102 66H218V114H102Z" />
                    <path d="M136 54H184V114H136Z" />
                    <path d="M56 114H264V124H56Z" />
                    <path d="M48 124H272V128H48Z" />
                </g>
                <g className={styles.tajDepth}>
                    <TajSideDepth />
                    <g transform="matrix(-1 0 0 1 320 0)"><TajSideDepth /></g>
                    <path d={`${arch(146, 28, 87, 66, 114)}Z`} />
                </g>

                <g className={styles.drawn}>
                    {/* Ground and the wide marble plinth with its blind arches */}
                    <path pathLength={1} d="M4 128H316" />
                    <path pathLength={1} d="M48 128V124H272V128" />
                    <path pathLength={1} d="M56 124V114H264V124" />
                    <path className={styles.fine} pathLength={1} d={PLINTH_ARCHES} />
                    <path className={styles.dots} pathLength={1} d="M58 116.5H262" />

                    <TajSide />
                    <g transform="matrix(-1 0 0 1 320 0)"><TajSide /></g>

                    {/* Drum, with a band of gold beading and lotus petals at the dome's foot */}
                    <path pathLength={1} d="M141 54V40H179V54" />
                    <path className={styles.dots} pathLength={1} d="M143 47H177" />
                    <path className={styles.fine} pathLength={1} d="M146 40C148 36 150 36 152 40C154 36 156 36 158 40C160 36 162 36 164 40C166 36 168 36 170 40C172 36 173 36 174 40" />

                    {/* The great dome, with its lotus crown and gold crescent finial */}
                    <path pathLength={1} d={DOME} />
                    <path className={styles.fine} pathLength={1} d="M150 5.5C152 8 154 8 155.5 6C157 8.5 158.5 8.5 160 6.5C161.5 8.5 163 8.5 164.5 6C166 8 168 8 170 5.5" />
                    <path pathLength={1} d="M160 -4V-11" />
                    <circle className={styles.rosette} pathLength={1} cx="160" cy="-6" r="1.5" />
                    <circle className={styles.rosette} pathLength={1} cx="160" cy="-9" r="1.1" />
                    <path pathLength={1} d="M157 -15C157.5 -11.5 162.5 -11.5 163 -15" />

                    {/* The great arched portal in its tall frame, with inlaid gold around the arch */}
                    <path pathLength={1} d="M136 114V54H184V114" />
                    <path className={styles.dots} pathLength={1} d="M138 56.5H182M138.5 58V114M181.5 58V114" />
                    <path className={styles.fine} pathLength={1} d="M141 114V59.5H179V114" />
                    <path className={styles.fine} pathLength={1} d={arch(143, 34, 87, 62, 114)} />
                    <path pathLength={1} d={arch(146, 28, 87, 66, 114)} />
                    <path className={styles.fine} pathLength={1} d={`${arch(152, 16, 98, 86, 114)}M160 86V114`} />
                    <path className={styles.fine} pathLength={1} d="M150 84C154 80 166 80 170 84" />
                    <circle className={styles.rosette} pathLength={1} cx="146" cy="65" r="1.8" />
                    <circle className={styles.rosette} pathLength={1} cx="174" cy="65" r="1.8" />
                </g>
            </g>
        </svg>
    );
}

/** A small Taj for the slim band, where the full drawing is hidden. */
export function MiniTaj({ className }: { className: string }) {
    return (
        <svg className={className} viewBox="0 0 64 44" aria-hidden="true" focusable="false">
            <path className={styles.miniSolid} d="M32 1C33 5 40 7 41 13C41.5 16 39 18 37 19H27C25 18 22.5 16 23 13C24 7 31 5 32 1Z" />
            <path className={styles.miniSolid} d="M15 39V24H22V19H42V24H49V39Z" />
            <path className={styles.miniSolid} d="M4 39L5 13H8L9 39ZM55 39L56 13H59L60 39Z" />
            <path className={styles.miniLine} d="M32 1C33 5 40 7 41 13C41.5 16 39 18 37 19H27C25 18 22.5 16 23 13C24 7 31 5 32 1ZM15 39V24H22V19H42V24H49V39M4 39L5 13H8L9 39M55 39L56 13H59L60 39M1 39H63V43H1Z" />
            <path className={styles.miniDepth} d="M27 39V31C27 29 30 28 32 25C34 28 37 29 37 31V39Z" />
            <path className={styles.miniLine} d="M4.5 11C4.5 9 6.5 8 6.5 6C6.5 8 8.5 9 8.5 11ZM55.5 11C55.5 9 57.5 8 57.5 6C57.5 8 59.5 9 59.5 11Z" />
        </svg>
    );
}

/** A small Fuji for the slim band, where the full drawing is hidden. */
export function MiniFuji({ className }: { className: string }) {
    return (
        <svg className={className} viewBox="0 0 64 44" aria-hidden="true" focusable="false">
            <circle className={styles.miniSun} cx="48" cy="12" r="8" />
            <path className={styles.miniSolid} d="M1 43C12 38 19 27 25 12C26 10 27 9 28 9H36C37 9 38 10 39 12C45 27 52 38 63 43Z" />
            <path className={styles.miniLine} d="M1 43C12 38 19 27 25 12C26 10 27 9 28 9H36C37 9 38 10 39 12C45 27 52 38 63 43" />
            <path className={styles.miniLine} d="M21 21C24 24 26 20 28 23C30 26 32 21 34 24C36 26 38 21 43 21" />
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
