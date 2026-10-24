import styles from './ArrowBox.module.css';

/**
 * The square arrow beside text links: the programme's version of a circle arrow.
 * A parent fills it on hover by setting `--arrow-fill` (e.g. to the accent).
 */
export default function ArrowBox({ direction = 'right' }: { direction?: 'left' | 'right' }) {
    return <span className={styles.arrow} data-direction={direction} aria-hidden="true" />;
}
