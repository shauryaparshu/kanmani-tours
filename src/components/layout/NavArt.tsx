import { FujiCrane, TajLotus, TajPeacock } from './NavStory';
import story from './NavStory.module.css';
import styles from './Navigation.module.css';

// pathLength={1} on every stroke lets CSS draw the art in on page load.

/** One side of the Taj, drawn on the left; mirrored for the right. Outlines only. */
function TajSide() {
    return (
        <>
            {/* Minaret: tapering, three balconies, a domed pavilion on top */}
            <path pathLength={1} d="M38 128L42 44H54L58 128" />
            <path className={styles.fine} pathLength={1} d="M44 128L46 44M52 128L50 44" />
            <path pathLength={1} d="M35 101H61V104H35ZM37 73H59V76H37ZM39 44H57V47H39Z" />
            <path className={styles.dots} pathLength={1} d="M37 99H59M39 71H57M41 42H55" />
            <path pathLength={1} d="M42 44V36M54 44V36M40 36H56" />
            <path pathLength={1} d="M41 36C40 28 44 26 48 20C52 26 56 28 55 36" />
            <path className={styles.fine} pathLength={1} d="M48 20C46 26 45 31 45 36M48 20C50 26 51 31 51 36" />
            <path pathLength={1} d="M48 20V12" />
            <circle pathLength={1} cx="48" cy="11" r="1.4" />

            {/* Small domed pavilion on the roof */}
            <path pathLength={1} d="M97 70V60M115 70V60M95 60H117" />
            <path className={styles.fine} pathLength={1} d="M103 70V60M109 70V60" />
            <path pathLength={1} d="M97 60C95 52 101 49 106 42C111 49 117 52 115 60" />
            <path className={styles.fine} pathLength={1} d="M106 42C103 48 102 54 102 60M106 42C109 48 110 54 110 60" />
            <path pathLength={1} d="M106 42V35" />
            <circle pathLength={1} cx="106" cy="34" r="1.2" />

            {/* Corner bay: two slim niches */}
            <path pathLength={1} d="M98 70V116" />
            <path className={styles.fine} pathLength={1} d="M91 116V102C91 99 93 97 93 95C93 97 95 99 95 102V116M91 90V80C91 77 93 75 93 73C93 75 95 77 95 80V90" />

            {/* Side bay: an arch above an arch, each in a fine frame */}
            <path pathLength={1} d="M104 116V102C104 98 109 96 116 90C123 96 128 98 128 102V116" />
            <path className={styles.fine} pathLength={1} d="M101 116V88H131V116" />
            <path className={styles.fine} pathLength={1} d="M108 116V104C108 101 112 99 116 95C120 99 124 101 124 104V116" />
            <path pathLength={1} d="M104 86V78C104 75 109 74 116 69C123 74 128 75 128 78V86" />
            <path className={styles.fine} pathLength={1} d="M104 86H128" />
            <circle className={styles.rosette} pathLength={1} cx="103.5" cy="92" r="1.3" />
            <circle className={styles.rosette} pathLength={1} cx="128.5" cy="92" r="1.3" />
        </>
    );
}

/** The solid gold-tinted shapes under one side of the Taj's outlines. */
function TajSideFill() {
    return (
        <>
            <path d="M38 128L42 44H54L58 128Z" />
            <path d="M35 101H61V104H35ZM37 73H59V76H37ZM39 44H57V47H39Z" />
            <path d="M42 44V36H54V44Z" />
            <path d="M41 36C40 28 44 26 48 20C52 26 56 28 55 36Z" />
            <path d="M97 70V60H115V70Z" />
            <path d="M97 60C95 52 101 49 106 42C111 49 117 52 115 60Z" />
        </>
    );
}

/** The Taj Mahal in gold: fine facade, ribbed dome, minarets. The India side of the nav. */
export function TajArt() {
    return (
        <svg className={`${styles.art} ${styles.taj}`} viewBox="0 0 320 130" aria-hidden="true" focusable="false">
            <defs>
                <linearGradient id="nav-taj-gold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" style={{ stopColor: 'var(--color-surface-bright)' }} />
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
                {/* Solid shapes, which also hide the steam engine at the start. */}
                <g className={styles.tajFill}>
                    <TajSideFill />
                    <g transform="matrix(-1 0 0 1 320 0)"><TajSideFill /></g>
                    <path d="M126 52C114 38 122 22 148 12C154 9.5 158 7 160 4C162 7 166 9.5 172 12C198 22 206 38 194 52Z" />
                    <path d="M128 52H192V62H128Z" />
                    <path d="M88 70H232V116H88Z" />
                    <path d="M134 62H186V116H134Z" />
                    <path d="M68 116H252V128H68Z" />
                </g>
                <g className={styles.tajDepth}>
                    <path d="M146 116V92C146 84 154 80 160 72C166 80 174 84 174 92V116Z" />
                    <path d="M104 116V102C104 98 109 96 116 90C123 96 128 98 128 102V116Z" />
                    <path d="M192 116V102C192 98 197 96 204 90C211 96 216 98 216 102V116Z" />
                    <path d="M104 86V78C104 75 109 74 116 69C123 74 128 75 128 78V86Z" />
                    <path d="M192 86V78C192 75 197 74 204 69C211 74 216 75 216 78V86Z" />
                </g>

                <g className={styles.drawn}>
                    {/* Ground and marble platform */}
                    <path pathLength={1} d="M4 128H316" />
                    <path pathLength={1} d="M68 128V116H252V128" />
                    <path className={styles.fine} pathLength={1} d="M68 119H252" />
                    <path className={styles.dots} pathLength={1} d="M72 124H248" />

                    <TajSide />
                    <g transform="matrix(-1 0 0 1 320 0)"><TajSide /></g>

                    {/* Main hall with a jewelled parapet */}
                    <path pathLength={1} d="M88 116V70H232V116" />
                    <path className={styles.dots} pathLength={1} d="M91 73H133M187 73H229" />

                    {/* Great dome: drum, ribs, lotus cap and crescent finial */}
                    <path pathLength={1} d="M128 62V52H192V62" />
                    <path className={styles.dots} pathLength={1} d="M131 57H189" />
                    <path pathLength={1} d="M126 52C114 38 122 22 148 12C154 9.5 158 7 160 4C162 7 166 9.5 172 12C198 22 206 38 194 52" />
                    <path className={styles.fine} pathLength={1} d="M160 4C148 16 138 32 140 52M160 4C172 16 182 32 180 52M160 4C155 18 152 34 152 52M160 4C165 18 168 34 168 52M160 4V52" />
                    <path className={styles.fine} pathLength={1} d="M124 44C146 48 174 48 196 44" />
                    <path pathLength={1} d="M150 11C153 15 157 16 160 16C163 16 167 15 170 11" />
                    <path pathLength={1} d="M160 4V-7" />
                    <circle pathLength={1} cx="160" cy="-1" r="1.8" />
                    <path pathLength={1} d="M156.5 -11C157.5 -7.5 162.5 -7.5 163.5 -11" />

                    {/* Great gate: double frame, inscribed band, rosettes and pointed arch */}
                    <path pathLength={1} d="M134 116V62H186V116" />
                    <path className={styles.fine} pathLength={1} d="M138 116V66H182V116" />
                    <path className={styles.dots} pathLength={1} d="M136 64H184M136 66V116M184 66V116" />
                    <path pathLength={1} d="M146 116V92C146 84 154 80 160 72C166 80 174 84 174 92V116" />
                    <path className={styles.fine} pathLength={1} d="M142 116V92C142 82 152 77 160 68C168 77 178 82 178 92V116" />
                    <path className={styles.fine} pathLength={1} d="M151 116V94C151 88 156 85 160 80C164 85 169 88 169 94V116M160 80V116" />
                    <circle className={styles.rosette} pathLength={1} cx="144" cy="72" r="2" />
                    <circle className={styles.rosette} pathLength={1} cx="176" cy="72" r="2" />
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

            <g className={story.storyRoot}>
                <FujiCrane />
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
