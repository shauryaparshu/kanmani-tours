import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Logo from './Logo';
import styles from './FooterSection.module.css';

const SOCIALS = [
    { label: 'Instagram', href: 'https://www.instagram.com/kanmani_tours' },
    { label: 'Facebook', href: 'https://facebook.com/kanmanitours' },
    { label: 'X', href: 'https://x.com/kanmanitours' },
    { label: 'LINE', href: 'https://line.me/kanmanitours' },
    { label: 'YouTube', href: 'https://youtube.com/@kanmanitours' },
];

// Works as a server component, and as a client component when a client page imports it.
// `plan={false}` drops the "Plan your journey" call to action on pages that are already the enquiry form.
export default function FooterSection({ plan = true }: { plan?: boolean }) {
    const t = useTranslations('Footer');
    const tContact = useTranslations('TopBar');

    return (
        <footer className={`${styles.footer} surface-ink`} data-ds>
            <div className={styles.inner}>
                {plan ? (
                    <div className={styles.plan}>
                        <p className={styles.planTitle}>{t('planTitle')}</p>
                        <p className={styles.planBody}>{t('planBody')}</p>
                        <Link href="/contact" className={styles.planLink}>{t('enquire')}</Link>
                    </div>
                ) : null}

                <div className={styles.columns}>
                    <div className={styles.brand}>
                        <Link href="/" className={styles.logoLink}>
                            <Logo tone="paper" className={styles.logo} />
                        </Link>
                        <p className={styles.note}>{t('respondsJapanese')}</p>
                    </div>

                    <nav className={styles.column} aria-labelledby="footer-tours">
                        <h2 id="footer-tours" className={styles.heading}>{t('tours')}</h2>
                        <ul>
                            <li><Link href="/india/tours">{t('indiaTours')}</Link></li>
                            <li><Link href="/japan/tours">{t('japanTours')}</Link></li>
                            <li><Link href="/gallery">{t('gallery')}</Link></li>
                        </ul>
                    </nav>

                    <nav className={styles.column} aria-labelledby="footer-company">
                        <h2 id="footer-company" className={styles.heading}>{t('company')}</h2>
                        <ul>
                            <li><Link href="/about">{t('about')}</Link></li>
                            <li><Link href="/faq">{t('faq')}</Link></li>
                            <li><Link href="/contact">{t('contact')}</Link></li>
                        </ul>
                    </nav>

                    <div className={`${styles.column} ${styles.office}`}>
                        <h2 className={styles.heading}>{t('office')}</h2>
                        <address className={styles.address}>
                            <span>{t('officeArea')}</span>
                            <span className="num">{t('hours')}</span>
                            <a href="tel:+919597716664" className="num">{tContact('phone')}</a>
                            <a href="mailto:kanmanitours@gmail.com">{tContact('email')}</a>
                        </address>
                    </div>

                    <div className={styles.column}>
                        <h2 className={styles.heading}>{t('follow')}</h2>
                        <ul>
                            {SOCIALS.map((s) => (
                                <li key={s.label}>
                                    <a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <p className={styles.legal}>
                    <span className="num">© {new Date().getFullYear()}</span> Kanmani Tours · Infirise Private Limited
                </p>
            </div>
        </footer>
    );
}
