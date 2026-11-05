import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import styles from './OrnateLink.module.css';

interface OrnateLinkProps {
    href: string;
    children: ReactNode;
    /** `gold`: metallic gold. `red`: vermilion lacquer. Both carry cream text. */
    tone?: 'gold' | 'red';
    className?: string;
}

/** Gold theme call to action: a lacquered plate with fine gold inner and outer frames. */
export default function OrnateLink({ href, children, tone = 'gold', className }: OrnateLinkProps) {
    return (
        <Link href={href} className={[styles.link, className].filter(Boolean).join(' ')} data-tone={tone}>
            <span className={styles.notch} data-side="start" aria-hidden="true" />
            <span className={styles.label}>{children}</span>
            <ArrowRight aria-hidden="true" />
            <span className={styles.notch} data-side="end" aria-hidden="true" />
        </Link>
    );
}
