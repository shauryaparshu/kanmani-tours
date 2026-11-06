import styles from './Navigation.module.css';

// pathLength={1} on every stroke lets CSS draw the art in on page load.

/** Gold line drawing of the Taj Mahal: the India side of the nav. */
export function TajArt() {
    return (
        <svg className={`${styles.art} ${styles.taj}`} viewBox="0 0 320 130" aria-hidden="true" focusable="false">
            {/* Ground */}
            <path pathLength={1} d="M4 128H316" />
            {/* Left minaret */}
            <path pathLength={1} d="M38 128L41 44H55L58 128" />
            <path pathLength={1} d="M36 100H60M37 72H59M38 44H58" />
            <path pathLength={1} d="M40 44C40 34 44 30 48 24C52 30 56 34 56 44" />
            <path pathLength={1} d="M48 24V16" />
            {/* Right minaret */}
            <path pathLength={1} d="M262 128L265 44H279L282 128" />
            <path pathLength={1} d="M260 100H284M261 72H283M262 44H282" />
            <path pathLength={1} d="M264 44C264 34 268 30 272 24C276 30 280 34 280 44" />
            <path pathLength={1} d="M272 24V16" />
            {/* Plinth and main hall */}
            <path pathLength={1} d="M84 128V76H236V128" />
            <path pathLength={1} d="M84 84H236" />
            {/* Great dome and finial */}
            <path pathLength={1} d="M126 76C114 58 124 42 160 20C196 42 206 58 194 76" />
            <path pathLength={1} d="M160 20V6" />
            <circle pathLength={1} cx="160" cy="10" r="2" />
            {/* Small domes either side */}
            <path pathLength={1} d="M92 76C90 68 94 64 102 58C110 64 114 68 112 76" />
            <path pathLength={1} d="M102 58V50" />
            <path pathLength={1} d="M208 76C206 68 210 64 218 58C226 64 230 68 228 76" />
            <path pathLength={1} d="M218 58V50" />
            {/* Great arch */}
            <path pathLength={1} d="M138 128V100C138 94 148 90 160 84C172 90 182 94 182 100V128" />
            <path pathLength={1} d="M146 128V104C146 99 153 96 160 92C167 96 174 99 174 104V128" />
            {/* Side arches */}
            <path pathLength={1} d="M96 128V108C96 104 102 101 108 97C114 101 120 104 120 108V128" />
            <path pathLength={1} d="M200 128V108C200 104 206 101 212 97C218 101 224 104 224 108V128" />
        </svg>
    );
}

/** Gold line drawing of Mount Fuji with a red sun: the Japan side of the nav. */
export function FujiArt() {
    return (
        <svg className={`${styles.art} ${styles.fuji}`} viewBox="0 0 320 130" aria-hidden="true" focusable="false">
            <circle className={styles.sun} cx="160" cy="34" r="22" />
            {/* The mountain is filled with the band's colour so the sun sets behind it. */}
            <path className={styles.mountainFill} d="M4 128C60 118 104 92 132 52C137 45 142 40 148 40H172C178 40 183 45 188 52C216 92 260 118 316 128Z" />
            <path pathLength={1} d="M4 128C60 118 104 92 132 52C137 45 142 40 148 40H172C178 40 183 45 188 52C216 92 260 118 316 128" />
            {/* Snow line */}
            <path pathLength={1} d="M120 68C126 72 130 66 136 72C142 78 146 66 152 74C158 82 162 68 168 74C174 80 178 68 184 72C190 76 194 68 200 68" />
            {/* Contours */}
            <path pathLength={1} d="M146 84C138 98 120 112 96 122" />
            <path pathLength={1} d="M160 88V118" />
            <path pathLength={1} d="M174 84C182 98 200 112 224 122" />
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
