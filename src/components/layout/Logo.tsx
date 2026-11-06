import styles from './Logo.module.css';

interface LogoProps {
    /** `ink` for paper backgrounds, `paper` for ink bands and photos. */
    tone?: 'ink' | 'paper';
    className?: string;
}

// The Kanmani lotus mark and wordmark. Paths are unchanged from the original
// logo; only the colours now come from the design tokens.
export default function Logo({ tone = 'ink', className }: LogoProps) {
    return (
        <svg
            className={[styles.logo, styles[tone], className].filter(Boolean).join(' ')}
            viewBox="0 0 200 52"
            role="img"
            aria-label="Kanmani Tours"
        >
            <g className={styles.mark} transform="translate(22, 29) scale(1.2)">
                <path d="M0,-16 C2,-9 2,-4 0,0 C-2,-4 -2,-9 0,-16Z" opacity="0.95" />
                <path d="M0,0 C-4,-7 -9,-8 -12,-6 C-8,-3 -4,-1 0,0Z" opacity="0.8" />
                <path d="M0,0 C4,-7 9,-8 12,-6 C8,-3 4,-1 0,0Z" opacity="0.8" />
                <path d="M0,0 C-5,-3 -13,-2 -16,2 C-11,4 -6,2 0,0Z" opacity="0.5" />
                <path d="M0,0 C5,-3 13,-2 16,2 C11,4 6,2 0,0Z" opacity="0.5" />
                <path className={styles.stroke} d="M-9,4 Q0,9 9,4" strokeWidth="0.7" opacity="0.75" />
                <line className={styles.stroke} x1="-14" y1="7" x2="14" y2="7" strokeWidth="0.5" opacity="0.4" />
                <line className={styles.stroke} x1="-10" y1="11" x2="10" y2="11" strokeWidth="0.4" opacity="0.25" />
            </g>
            <line className={styles.rule} x1="44" y1="8" x2="44" y2="44" strokeWidth="0.5" />
            <text className={styles.word} x="54" y="32">Kanmani</text>
            <line className={styles.rule} x1="54" y1="37" x2="188" y2="37" strokeWidth="0.5" />
            <text className={styles.tours} x="121" y="51" textAnchor="middle">TOURS</text>
        </svg>
    );
}
