import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import ArrowBox from '@/components/ui/ArrowBox';
import styles from './ToursComingSoon.module.css';

// Shown on a destination page that has no tours yet.
export default function ToursComingSoon() {
    const t = useTranslations('Tours');
    const tNav = useTranslations('Navigation');

    return (
        <section className={styles.section} data-ds aria-labelledby="coming-soon-title">
            <div className={styles.inner}>
                <h2 id="coming-soon-title" className={styles.title}>{t('comingSoonTitle')}</h2>
                <p className={styles.body}>{t('comingSoonBody')}</p>
                <Link href="/contact" className={styles.link}>
                    {tNav('enquire')}
                    <ArrowBox />
                </Link>
            </div>
        </section>
    );
}
