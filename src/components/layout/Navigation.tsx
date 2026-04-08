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
        <header className="header animate" style={{ backgroundColor: '#1C1917' }}>
            <div className="container header-container">
                <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="190" height="52" viewBox="0 0 200 52" aria-label="Kanmani Tours">
                        <g transform="translate(22,26)">
                            <path d="M0,-16 C2,-9 2,-4 0,0 C-2,-4 -2,-9 0,-16Z" fill="#C9933A" opacity="0.95"/>
                            <path d="M0,0 C-4,-7 -9,-8 -12,-6 C-8,-3 -4,-1 0,0Z" fill="#C9933A" opacity="0.80"/>
                            <path d="M0,0 C4,-7 9,-8 12,-6 C8,-3 4,-1 0,0Z" fill="#C9933A" opacity="0.80"/>
                            <path d="M0,0 C-5,-3 -13,-2 -16,2 C-11,4 -6,2 0,0Z" fill="#C9933A" opacity="0.50"/>
                            <path d="M0,0 C5,-3 13,-2 16,2 C11,4 6,2 0,0Z" fill="#C9933A" opacity="0.50"/>
                            <path d="M-9,4 Q0,9 9,4" stroke="#C9933A" stroke-width="0.7" fill="none" opacity="0.75"/>
                            <line x1="-14" y1="7" x2="14" y2="7" stroke="#C9933A" stroke-width="0.5" opacity="0.40"/>
                            <line x1="-10" y1="11" x2="10" y2="11" stroke="#C9933A" stroke-width="0.4" opacity="0.25"/>
                        </g>

                        <line x1="44" y1="8" x2="44" y2="44" stroke="#C9933A" stroke-width="0.5" opacity="0.35"/>

                        <text x="54" y="32"
                            style={{fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:"26px", fontWeight:"400", letterSpacing:"0.13em", fill:"#F5F1EB"}}>
                            Kanmani
                        </text>

                        <line x1="54" y1="37" x2="188" y2="37" stroke="#C9933A" stroke-width="0.5" opacity="0.60"/>

                        <text x="55" y="47"
                            style={{fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:"9px", fontWeight:"400", letterSpacing:"0.44em", fill:"#C9933A"}}>
                            T O U R S
                        </text>
                    </svg>
                </Link>
                <nav className="nav">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`nav-link ${isActive ? 'active' : ''}`}
                                style={{ color: isActive ? '#C9933A' : '#F5F1EB' }}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
                <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}>
                    <select
                        value={locale}
                        onChange={(e) => changeLanguage(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db', backgroundColor: '#fff', fontSize: '0.9rem', cursor: 'pointer' }}
                    >
                        <option value="ja">日本語</option>
                        <option value="en">English</option>
                    </select>
                </div>
            </div>
        </header>
    );
}
