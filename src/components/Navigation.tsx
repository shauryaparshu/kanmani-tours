'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
    const pathname = usePathname();

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Tours', href: '/tours' },
        { name: 'Gallery', href: '/gallery' },
        { name: 'Airport Pickup & Drop', href: '/airport-transfer' },
        { name: 'About', href: '/about' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Contact', href: '/contact' },
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
            </div>
        </header>
    );
}
