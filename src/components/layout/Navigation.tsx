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

/** Scroll-shaped end piece of a nav plaque (left end; `flip` for the right). */
function PlaqueEnd({ flip = false }: { flip?: boolean }) {
    return (
        <svg className={styles.plaqueEnd} data-flip={flip} viewBox="0 0 22 40" aria-hidden="true" focusable="false">
            <path d="M22 4.5H13C7.5 4.5 3 11 3 20s4.5 15.5 10 15.5h9" />
            <path d="M22 8.5h-7.5C11 8.5 8 13.5 8 20s3 11.5 6.5 11.5H22" />
            <path d="M3 20h-3" />
            <circle cx="14.5" cy="20" r="1.6" />
        </svg>
    );
}

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

    // A gold plaque: scroll-shaped ends either side of a row of links.
    const plaque = (items: typeof links) => (
        <div className={styles.plaque}>
            <PlaqueEnd />
            <ul className={styles.links}>
                {items.map((link) => (
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
            <PlaqueEnd flip />
        </div>
    );

    return (
        <>
            <a href="#main-content" className={styles.skip}>{t('skipToContent')}</a>

            <header className={styles.header} data-scrolled={scrolled || menuOpen}>
                {/* Phones and tablets: logo, Enquire and the menu button. */}
                <div className={styles.bar}>
                    <Link href="/" className={styles.logoLink} onClick={() => setMenuOpen(false)}>
                        <Logo variant="wordmark" className={styles.logo} />
                    </Link>

                    <div className={styles.actions}>
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

                {/* Desktop: two gold plaques of links either side of the logo cartouche. */}
                <nav className={styles.desk} aria-label={t('mainNav')}>
                    <div className={styles.deskStart}>
                        <span className={styles.rail} aria-hidden="true" />
                        {plaque(links.slice(0, 3))}
                    </div>

                    <Link href="/" className={styles.cartouche}>
                        <svg className={styles.cartoucheShape} viewBox="0 0 248 80" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                            <path className={styles.cartoucheFill} d="M14 1H234A13 13 0 0 0 247 14V66A13 13 0 0 0 234 79H14A13 13 0 0 0 1 66V14A13 13 0 0 0 14 1Z" />
                            <path className={styles.cartoucheLine} d="M17 6H231A11 11 0 0 0 242 17V63A11 11 0 0 0 231 74H17A11 11 0 0 0 6 63V17A11 11 0 0 0 17 6Z" />
                        </svg>
                        <Logo variant="wordmark" className={styles.cartoucheLogo} />
                    </Link>

                    <div className={styles.deskEnd}>
                        {plaque(links.slice(3))}
                        <span className={styles.rail} aria-hidden="true" />
                        {languageSwitch(styles.langDesktop)}
                        <Link href="/contact" className={styles.enquire}>{t('enquire')}</Link>
                    </div>
                </nav>
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
