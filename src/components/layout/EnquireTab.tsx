'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import styles from './SiteChrome.module.css';

// The site's single main action, always reachable on desktop.
// On phones the Enquire button in the top bar plays this role.
export default function EnquireTab() {
    const t = useTranslations('Navigation');
    const pathname = usePathname();

    if (pathname === '/contact') return null;

    return (
        <aside aria-label={t('enquire')}>
            <Link href="/contact" className={styles.enquireTab}>
                <span>{t('enquire')}</span>
            </Link>
        </aside>
    );
}
