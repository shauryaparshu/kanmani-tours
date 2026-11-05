import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import FooterSection from '@/components/layout/FooterSection';
import PageHeader from '@/components/layout/PageHeader';
import ArrowBox from '@/components/ui/ArrowBox';
import styles from './not-found.module.css';

// Shown for notFound() inside any localised page (unknown tour, gallery, English-only pages in Japanese).
export default function NotFound() {
    const t = useTranslations('NotFound');
    const links = [
        { href: '/', label: t('home') },
        { href: '/india/tours', label: t('indiaTours') },
        { href: '/gallery', label: t('gallery') },
        { href: '/contact', label: t('contact') },
    ];

    return (
        <>
            <main>
                <PageHeader title={t('title')} lead={t('body')} />
                <nav className={styles.section} aria-label={t('title')}>
                    <div className={styles.inner}>
                        <ul className={styles.links}>
                            {links.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className={styles.link}>
                                        {link.label}
                                        <ArrowBox />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </main>
            <FooterSection />
        </>
    );
}
