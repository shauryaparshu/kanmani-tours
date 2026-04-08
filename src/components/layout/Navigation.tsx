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
        <header className="header animate">
            <div className="container header-container">
                <Link href="/" className="logo">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    Srikan Tours
                </Link>
                <nav className="nav">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`nav-link ${isActive ? 'active' : ''}`}
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
