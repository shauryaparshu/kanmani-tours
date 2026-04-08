'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';

export default function Navigation() {
    const t = useTranslations('Navigation');
    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale();

    const changeLanguage = (nextLocale: string) => {
        router.replace(pathname, { locale: nextLocale });
    };

    const navLinks = [
        { name: t('home'), href: '/' },
        { name: t('tours'), href: '/tours' },
        { name: t('gallery'), href: '/gallery' },
        { name: t('airport'), href: '/airport-transfer' },
        { name: t('about'), href: '/about' },
        { name: t('faq'), href: '/faq' },
        { name: t('contact'), href: '/contact' },
    ];

    return (
        <nav style={{
            width: '100%',
            backgroundColor: '#1C1917',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 40px',
            height: '72px',
            position: 'sticky',
            top: '0',
            zIndex: 1000,
            borderBottom: '1px solid rgba(201, 147, 58, 0.15)'
        }}>
            {/* LEFT COLUMN — Logo */}
            <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="190" height="52" viewBox="0 0 200 52" aria-label="Kanmani Tours">
                        <g transform="translate(22,26)">
                            <path d="M0,-16 C2,-9 2,-4 0,0 C-2,-4 -2,-9 0,-16Z" fill="#C9933A" opacity="0.95" />
                            <path d="M0,0 C-4,-7 -9,-8 -12,-6 C-8,-3 -4,-1 0,0Z" fill="#C9933A" opacity="0.80" />
                            <path d="M0,0 C4,-7 9,-8 12,-6 C8,-3 4,-1 0,0Z" fill="#C9933A" opacity="0.80" />
                            <path d="M0,0 C-5,-3 -13,-2 -16,2 C-11,4 -6,2 0,0Z" fill="#C9933A" opacity="0.50" />
                            <path d="M0,0 C5,-3 13,-2 16,2 C11,4 6,2 0,0Z" fill="#C9933A" opacity="0.50" />
                            <path d="M-9,4 Q0,9 9,4" stroke="#C9933A" strokeWidth="0.7" fill="none" opacity="0.75" />
                            <line x1="-14" y1="7" x2="14" y2="7" stroke="#C9933A" strokeWidth="0.5" opacity="0.40" />
                            <line x1="-10" y1="11" x2="10" y2="11" stroke="#C9933A" strokeWidth="0.4" opacity="0.25" />
                        </g>
                        <line x1="44" y1="8" x2="44" y2="44" stroke="#C9933A" strokeWidth="0.5" opacity="0.35" />
                        <text x="54" y="32"
                            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "26px", fontWeight: "400", letterSpacing: "0.13em", fill: "#F5F1EB" }}>
                            Kanmani
                        </text>
                        <line x1="54" y1="37" x2="188" y2="37" stroke="#C9933A" strokeWidth="0.5" opacity="0.60" />
                        <text x="55" y="47"
                            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "9px", fontWeight: "400", letterSpacing: "0.44em", fill: "#C9933A" }}>
                            T O U R S
                        </text>
                    </svg>
                </Link>
            </div>

            {/* CENTER COLUMN — Navigation links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
                {navLinks.map((link) => {
                    const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                fontSize: '18px',
                                fontWeight: '600',
                                letterSpacing: '0.08em',
                                color: isActive ? '#C9933A' : '#F5F1EB',
                                textDecoration: 'none',
                                opacity: isActive ? '1' : '1',
                                borderBottom: isActive ? '1px solid #C9933A' : 'none',
                                paddingBottom: isActive ? '2px' : '0'
                            }}
                        >
                            {link.name}
                        </Link>
                    );
                })}
            </div>

            {/* RIGHT COLUMN — Contact info + language switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
                <a href="tel:+810312345678" style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '14px',
                    fontWeight: '600',
                    letterSpacing: '0.12em',
                    color: '#F5F1EB',
                    textDecoration: 'none',
                    fontVariantNumeric: 'lining-nums',
                    fontFeatureSettings: '"lnum" 1'
                }}>
                    +81 (0)3-1234-5678
                </a>
                <span style={{ color: 'rgba(201,147,58,0.6)', fontSize: '12px' }}>|</span>
                <a href="mailto:hello@kanmanitours.com" style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '14px',
                    fontWeight: '600',
                    letterSpacing: '0.08em',
                    color: '#F5F1EB',
                    textDecoration: 'none'
                }}>
                    hello@kanmanitours.com
                </a>
                <span style={{ color: 'rgba(201,147,58,0.3)', fontSize: '12px' }}>|</span>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <select
                        value={locale}
                        onChange={(e) => changeLanguage(e.target.value)}
                        style={{
                            padding: '4px 8px',
                            borderRadius: '0',
                            border: '1px solid rgba(201,147,58,0.3)',
                            backgroundColor: 'transparent',
                            color: '#D4CFC9',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            fontFamily: "'Cormorant Garamond', Georgia, serif"
                        }}
                    >
                        <option value="ja" style={{ backgroundColor: '#1C1917' }}>日本語</option>
                        <option value="en" style={{ backgroundColor: '#1C1917' }}>English</option>
                    </select>
                </div>
            </div>
        </nav>
    );
}
