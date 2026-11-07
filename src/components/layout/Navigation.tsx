'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { SHOW_SERVICES_NAV } from '@/lib/featureFlags';
import { FujiArt, NavBadge, NavRowDefs, PlaqueShape, TajArt, Tassel, Vine } from './NavArt';
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

    // The six plaques from the owner's design. Tours opens a choice, because the
    // site has a tours page for each country and none for both.
    const rowLinks = [
        { href: '/', label: t('home') },
        { href: '/about', label: t('aboutUs') },
        { href: '/gallery', label: t('gallery') },
        { href: '/faq', label: t('faq') },
        ...(SHOW_SERVICES_NAV ? [{ href: '/services', label: t('services') }] : []),
        { href: '/contact', label: t('contact') },
    ];
    const onTours = isActive('/india/tours') || isActive('/japan/tours');
    const toursPlaque = (
        <li
            key="tours"
            ref={toursRef}
            className={styles.plaqueItem}
            onMouseEnter={() => setToursOpen(true)}
            onMouseLeave={() => setToursOpen(false)}
        >
            <button
                type="button"
                className={styles.plaque}
                aria-expanded={toursOpen}
                aria-controls="nav-tours"
                data-current={onTours || undefined}
                onClick={() => setToursOpen((open) => !open)}
            >
                <PlaqueShape position="middle" />
                <span className={styles.plaqueLabel}>{t('tours')}</span>
            </button>
            <Tassel className={styles.tassel} />
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

                {/* Desktop, first row: only the story and the logo. Each side of the
                    band is a link to that country's tours, with no words. */}
                <div className={styles.band}>
                    <TajArt />
                    <FujiArt />
                    <NavStoryFront />

                    <Link href={links[0].href} className={`${styles.country} ${styles.india}`} title={links[0].label} aria-label={links[0].label} aria-current={isActive(links[0].href) ? 'page' : undefined} />
                    <Link href={links[1].href} className={`${styles.country} ${styles.japan}`} title={links[1].label} aria-label={links[1].label} aria-current={isActive(links[1].href) ? 'page' : undefined} />

                    <div className={styles.main}>
                        <Link href="/" className={styles.shieldLink}>
                            <NavBadge id="nav-badge-band" />
                        </Link>
                    </div>
                </div>

                {/* Desktop, second row: the gold plaques between two vines. Once
                    scrolled, this row is all that stays, with a small logo beside it. */}
                <nav className={styles.row} aria-label={t('mainNav')}>
                    <NavRowDefs />
                    <Vine className={styles.vineTop} />
                    <Vine className={styles.vineBottom} />

                    <Link href="/" className={styles.rowLogo}>
                        <NavBadge id="nav-badge-row" />
                    </Link>

                    <ul className={styles.plaques}>
                        {rowLinks.map((link, i) => {
                            const position = i === 0 ? 'start' : i === rowLinks.length - 1 ? 'end' : 'middle';
                            return (
                                <li key={link.href} className={styles.plaqueItem}>
                                    <Link href={link.href} className={styles.plaque} aria-current={(link.href === '/' ? pathname === '/' : isActive(link.href)) ? 'page' : undefined}>
                                        <PlaqueShape position={position} />
                                        <span className={styles.plaqueLabel}>{link.label}</span>
                                    </Link>
                                    {i < rowLinks.length - 1 ? <Tassel className={styles.tassel} /> : null}
                                </li>
                            );
                        }).flatMap((item, i) => (i === 1 ? [toursPlaque, item] : [item]))}
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
