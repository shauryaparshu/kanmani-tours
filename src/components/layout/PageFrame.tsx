import styles from './PageFrame.module.css';

/** One filigree corner (top-left orientation); CSS turns it for the others. */
function Corner({ className }: { className: string }) {
    return (
        <svg className={`${styles.corner} ${className}`} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
            <path d="M2 66V14C2 7 7 2 14 2h52" />
            <path d="M8 66V18c0-5.5 4.5-10 10-10h48" />
            <path d="M14 30c0-9 7-16 16-16" />
            <path d="M14 30c6 0 9 3 9 8M30 14c0 6 3 9 8 9" />
            <circle cx="24" cy="24" r="2.4" />
            <path d="M8 40c4 2 4 6 0 8M40 8c2 4 6 4 8 0" />
        </svg>
    );
}

/**
 * Gold theme page furniture: a fixed double gold border down the sides and
 * along the bottom of the window, with filigree corners, meeting the nav band
 * at the top; and a faint paper grain over the page.
 * Decorative only, never catches clicks. Desktop only; phones get the grain.
 */
export default function PageFrame() {
    return (
        <>
            <div className={styles.grain} aria-hidden="true" />
            <div className={styles.frame} aria-hidden="true">
                <span className={`${styles.edge} ${styles.bottom}`} />
                <span className={`${styles.edge} ${styles.left}`} />
                <span className={`${styles.edge} ${styles.right}`} />
                <Corner className={styles.bl} />
                <Corner className={styles.br} />
            </div>
        </>
    );
}
