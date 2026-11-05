import styles from './Filigree.module.css';

/** One gold filigree corner, drawn for the top-left; `at` turns it into place. */
function Corner({ at }: { at: 'tl' | 'tr' | 'bl' | 'br' }) {
    return (
        <svg className={`${styles.corner} ${styles[at]}`} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <path d="M1 31V10C1 5 5 1 10 1h21" />
            <path d="M5 31V12.5C5 8.4 8.4 5 12.5 5H31" />
            <path d="M10 22c0-6.6 5.4-12 12-12" />
            <path d="M10 22c3.5 0 5.5 2 5.5 5.5M22 10c0 3.5 2 5.5 5.5 5.5" />
            <circle cx="14" cy="14" r="1.8" />
        </svg>
    );
}

/**
 * Four filigree corners and a fine inner gold line for any framed panel.
 * Place inside a positioned element; it draws over the edges, never the content.
 */
export default function Filigree() {
    return (
        <span className={styles.root} aria-hidden="true">
            <span className={styles.inner} />
            <Corner at="tl" />
            <Corner at="tr" />
            <Corner at="bl" />
            <Corner at="br" />
        </span>
    );
}
