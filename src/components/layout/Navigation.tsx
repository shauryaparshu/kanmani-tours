'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { SHOW_SERVICES_NAV } from '@/lib/featureFlags';
import { FujiArt, NavBadge, TajArt } from './NavArt';
import { NavStoryFront } from './NavStory';
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
    const [toursOpen, setToursOpen] = useState(false);
    const toursRef = useRef<HTMLLIElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

    // Japan pages exist in English only, so Japanese is not offered there.
    const isJapanDestination = pathname === '/japan' || pathname.startsWith('/japan/');
    const locales = isJapanDestination ? (['en'] as const) : (['en', 'ja'] as const);

    const links = [
        { href: '/india/tours', label: t('indiaTours') },
        { href: '/japan/tours', label: t('japanTours') },
        { href: '/about', label: t('about') },
        { href: '/gallery', label: t('gallery') },
        { href: '/faq', label: t('faq') },
        ...(SHOW_SERVICES_NAV ? [{ href: '/services', label: t('services') }] : []),
    ];

    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
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

    // The Tours choice closes on Escape or on a press anywhere else.
    useEffect(() => {
        if (!toursOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setToursOpen(false);
        };
        const onPress = (e: PointerEvent) => {
            if (!toursRef.current?.contains(e.target as Node)) setToursOpen(false);
        };
        document.addEventListener('keydown', onKey);
        document.addEventListener('pointerdown', onPress);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('pointerdown', onPress);
        };
    }, [toursOpen]);

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

    // The tabs either side of the logo. Tours opens a choice, because the site has a
    // tours page for each country and none for both.
    const tab = (href: string, label: string) => (
        <li key={href} className={styles.tabItem}>
            <Link href={href} className={styles.tab} aria-current={(href === '/' ? pathname === '/' : isActive(href)) ? 'page' : undefined}>
                {label}
            </Link>
        </li>
    );
    const onTours = isActive('/india/tours') || isActive('/japan/tours');
    const toursTab = (
        <li
            key="tours"
            ref={toursRef}
            className={styles.tabItem}
            // Hover is for a mouse only: on a touch screen a tap would open it here
            // and then close it again through the button's click.
            onPointerEnter={(e) => { if (e.pointerType === 'mouse') setToursOpen(true); }}
            onPointerLeave={(e) => { if (e.pointerType === 'mouse') setToursOpen(false); }}
        >
            <button
                type="button"
                className={styles.tab}
                aria-expanded={toursOpen}
                aria-controls="nav-tours"
                data-current={onTours || undefined}
                onClick={() => setToursOpen((open) => !open)}
            >
                {t('tours')}
            </button>
            <div id="nav-tours" className={styles.toursMenu} hidden={!toursOpen}>
                {links.slice(0, 2).map((link) => (
                    <Link key={link.href} href={link.href} className={styles.toursLink} aria-current={isActive(link.href) ? 'page' : undefined} onClick={() => setToursOpen(false)}>
                        {link.label}
                    </Link>
                ))}
            </div>
        </li>
    );

    return (
        <>
            <a href="#main-content" className={styles.skip}>{t('skipToContent')}</a>

            <header className={styles.header} data-scrolled={scrolled || menuOpen}>
                {/* Phones and tablets: logo, Enquire and the menu button. */}
                <div className={styles.bar}>
                    <Link href="/" className={styles.logoLink} onClick={() => setMenuOpen(false)}>
                        <NavBadge id="nav-badge-bar" className={styles.barBadge} />
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

                {/* Desktop: one row, from the owner's design: the Taj, three tabs, the logo,
                    three tabs and Fuji. The story runs in lanes around the tabs, so nothing
                    crosses them. The drawings link to their country's tours. Once scrolled,
                    the drawings and story go and the tabs and a small logo stay. */}
                <nav className={styles.band} aria-label={t('mainNav')}>
                    <TajArt />
                    <FujiArt />
                    <NavStoryFront />

                    <Link href={links[0].href} className={`${styles.country} ${styles.india}`} title={links[0].label} aria-label={links[0].label} aria-current={isActive(links[0].href) ? 'page' : undefined} />
                    <Link href={links[1].href} className={`${styles.country} ${styles.japan}`} title={links[1].label} aria-label={links[1].label} aria-current={isActive(links[1].href) ? 'page' : undefined} />

                    <ul className={`${styles.tabs} ${styles.tabsLeft}`}>
                        {tab('/', t('home'))}
                        {toursTab}
                        {tab('/about', t('aboutUs'))}
                    </ul>

                    <div className={styles.main}>
                        <Link href="/" className={styles.shieldLink}>
                            <NavBadge id="nav-badge-band" />
                        </Link>
                    </div>

                    <ul className={`${styles.tabs} ${styles.tabsRight}`}>
                        {tab('/gallery', t('gallery'))}
                        {tab('/faq', t('faq'))}
                        {SHOW_SERVICES_NAV ? tab('/services', t('services')) : null}
                        {tab('/contact', t('contact'))}
                    </ul>

                    {languageSwitch(styles.langDesktop)}
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
