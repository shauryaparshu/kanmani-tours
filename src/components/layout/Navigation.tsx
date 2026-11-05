'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { SHOW_SERVICES_NAV } from '@/lib/featureFlags';
import Logo from './Logo';
import styles from './Navigation.module.css';

const SOCIALS = [
    { label: 'Instagram', href: 'https://www.instagram.com/kanmani_tours' },
    { label: 'Facebook', href: 'https://facebook.com/kanmanitours' },
    { label: 'X', href: 'https://x.com/kanmanitours' },
    { label: 'LINE', href: 'https://line.me/kanmanitours' },
    { label: 'YouTube', href: 'https://youtube.com/@kanmanitours' },
];

export default function Navigation() {
    const t = useTranslations('Navigation');
    const tContact = useTranslations('TopBar');
    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale();

    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

    // Japan pages exist in English only, so Japanese is not offered there.
    const isJapanDestination = pathname === '/japan' || pathname.startsWith('/japan/');
    const locales = isJapanDestination ? (['en'] as const) : (['en', 'ja'] as const);

    const links = [
        { href: '/india/tours', label: t('toIndia') },
        { href: '/japan/tours', label: t('toJapan') },
        { href: '/about', label: t('about') },
        { href: '/gallery', label: t('gallery') },
        { href: '/faq', label: t('faq') },
        ...(SHOW_SERVICES_NAV ? [{ href: '/services', label: t('services') }] : []),
    ];

    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // While the menu is open: lock page scroll, move focus into the menu, close on Escape.
    useEffect(() => {
        if (!menuOpen) return;
        document.body.style.overflow = 'hidden';
        firstMenuLinkRef.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setMenuOpen(false);
                menuButtonRef.current?.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', onKey);
        };
    }, [menuOpen]);

    const switchLocale = (next: 'en' | 'ja') => {
        setMenuOpen(false);
        router.replace(pathname, { locale: next });
    };

    const languageSwitch = (className: string) => (
        <div className={className} role="group" aria-label={t('language')}>
            {locales.map((code, i) => (
                <Fragment key={code}>
                    {i > 0 ? <span className={styles.langDivider} aria-hidden="true" /> : null}
                    <button
                        type="button"
                        className={styles.langButton}
                        aria-pressed={locale === code}
                        lang={code}
                        onClick={() => switchLocale(code)}
                    >
                        {code === 'en' ? 'EN' : '日本語'}
                    </button>
                </Fragment>
            ))}
        </div>
    );

    return (
        <>
            <a href="#main-content" className={styles.skip}>{t('skipToContent')}</a>

            <header className={styles.header} data-scrolled={scrolled || menuOpen}>
                <div className={styles.bar}>
                    <Link href="/" className={styles.logoLink} onClick={() => setMenuOpen(false)}>
                        <Logo className={styles.logo} />
                    </Link>

                    <nav className={styles.primary} aria-label={t('mainNav')}>
                        <ul className={styles.links}>
                            {links.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={styles.link}
                                        aria-current={isActive(link.href) ? 'page' : undefined}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className={styles.actions}>
                        {languageSwitch(styles.langDesktop)}
                        <Link href="/contact" className={styles.enquire}>{t('enquire')}</Link>
                        <button
                            ref={menuButtonRef}
                            type="button"
                            className={styles.menuButton}
                            aria-expanded={menuOpen}
                            aria-controls="site-menu"
                            aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
                            onClick={() => setMenuOpen((open) => !open)}
                        >
                            <span className={styles.menuIcon} data-open={menuOpen} aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </header>

            <div className={styles.spacer} aria-hidden="true" />

            <nav id="site-menu" className={styles.menu} hidden={!menuOpen} aria-label={t('mainNav')}>
                <ul className={styles.menuLinks}>
                    {[{ href: '/', label: t('home') }, ...links, { href: '/contact', label: t('contact') }].map((link, i) => (
                        <li key={link.href}>
                            <Link
                                ref={i === 0 ? firstMenuLinkRef : undefined}
                                href={link.href}
                                className={styles.menuLink}
                                aria-current={(link.href === '/' ? pathname === '/' : isActive(link.href)) ? 'page' : undefined}
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {languageSwitch(styles.langMenu)}

                <div className={styles.menuContact}>
                    <a href="tel:+919597716664" className="num">{tContact('phone')}</a>
                    <a href="mailto:kanmanitours@gmail.com">{tContact('email')}</a>
                </div>

                <ul className={styles.menuSocials}>
                    {SOCIALS.map((s) => (
                        <li key={s.label}>
                            <a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
}
