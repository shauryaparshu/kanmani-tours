'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';

export default function Navigation() {
    const t = useTranslations('Navigation');
    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale();

    const [scrolled, setScrolled] = useState(false);
    const [snsOpen, setSnsOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 60);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const changeLanguage = (nextLocale: string) => {
        router.replace(pathname, { locale: nextLocale });
    };

    const navLinks = [
        { name: t('home'), href: '/' },
        { name: t('tours'), href: '/tours' },
        { name: 'Transfers', href: '/airport-transfer' },
        { name: t('gallery'), href: '/gallery' },
        { name: t('about'), href: '/about' },
        { name: t('faq'), href: '/faq' },
        { name: t('contact'), href: '/contact' },
    ];

    return (
        <nav style={{
            width: '100%',
            backgroundColor: scrolled ? 'rgba(28, 25, 23, 0.97)' : '#1C1917',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 40px',
            height: scrolled ? '64px' : '72px',
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            zIndex: 1000,
            borderBottom: scrolled 
                ? '1px solid rgba(201, 147, 58, 0.3)' 
                : '1px solid rgba(201, 147, 58, 0.15)',
            transition: 'all 0.4s ease'
        }}>
            {/* LEFT COLUMN — Logo */}
            <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="220" height="52" viewBox="0 0 200 52" aria-label="Kanmani Tours">
                        <g transform="translate(22, 29) scale(1.2)">
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
                            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "32px", fontWeight: "400", letterSpacing: "0.13em", fill: "#F5F1EB" }}>
                            Kanmani
                        </text>
                        <line x1="54" y1="37" x2="188" y2="37" stroke="#C9933A" strokeWidth="0.5" opacity="0.60" />
                        <text x="121" y="51" textAnchor="middle"
                            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "15px", fontWeight: "bold", letterSpacing: "0.3em", fill: "#C9933A" }}>
                            T O U R S
                        </text>
                    </svg>
                </Link>
            </div>

            {/* CENTER COLUMN — Navigation links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                {navLinks.map((link, index) => {
                    const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
                    return (
                        <div key={link.href} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            {link.name === 'Transfers' ? (
                                <div
                                  style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                                  onMouseEnter={() => setServicesOpen(true)}
                                  onMouseLeave={() => setServicesOpen(false)}
                                >
                                  <button style={{
                                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                                    fontSize: '19px',
                                    fontWeight: '500',
                                    letterSpacing: '0.08em',
                                    color: '#F5F1EB',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '0',
                                    transition: 'color 0.3s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#C9933A';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#F5F1EB';
                                  }}
                                  >
                                    Services
                                    <span style={{
                                      fontSize: '8px',
                                      color: '#C9933A',
                                      display: 'inline-block',
                                      transform: servicesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                      transition: 'transform 0.3s ease'
                                    }}>▼</span>
                                  </button>

                                  {servicesOpen && (
                                    <div style={{
                                      position: 'absolute',
                                      top: '100%',
                                      left: '50%',
                                      transform: 'translateX(-50%)',
                                      backgroundColor: '#1C1917',
                                      border: '1px solid rgba(201,147,58,0.2)',
                                      borderTop: '2px solid #C9933A',
                                      minWidth: '320px',
                                      zIndex: 1001,
                                      paddingTop: '8px',
                                      paddingBottom: '8px',
                                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                                    }}>
                                      {[
                                        {
                                          label: 'Airport Transfers',
                                          desc: 'Pickup & drop service',
                                          href: '/airport-transfer'
                                        },
                                        {
                                          label: 'Moving to India Support',
                                          desc: 'Relocation assistance',
                                          href: '/services/moving'
                                        },
                                        {
                                          label: 'All Services',
                                          desc: 'View everything we offer',
                                          href: '/services',
                                          highlight: true
                                        },
                                      ].map(({ label, desc, href, highlight }) => (
                                        <a
                                          key={label}
                                          href={href}
                                          style={{
                                            display: 'block',
                                            padding: '12px 20px',
                                            textDecoration: 'none',
                                            borderBottom: highlight
                                              ? 'none'
                                              : '1px solid rgba(201,147,58,0.08)',
                                            borderTop: highlight
                                              ? '1px solid rgba(201,147,58,0.15)'
                                              : 'none',
                                            transition: 'background-color 0.2s ease'
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor =
                                              'rgba(201,147,58,0.06)';
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                          }}
                                        >
                                          <div style={{
                                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                                            fontSize: '19px',
                                            fontWeight: highlight ? '600' : '500',
                                            color: highlight ? '#C9933A' : '#F5F1EB',
                                            letterSpacing: '0.06em',
                                            marginBottom: '4px'
                                          }}>
                                            {label}
                                          </div>
                                          <div style={{
                                            fontFamily: "'Jost', Arial, sans-serif",
                                            fontSize: '13px',
                                            color: '#9A948F',
                                            letterSpacing: '0.04em'
                                          }}>
                                            {desc}
                                          </div>
                                        </a>
                                      ))}
                                    </div>
                                  )}
                                </div>
                            ) : (
                                <Link
                                    href={link.href}
                                    style={{
                                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                                        fontSize: '19px',
                                        fontWeight: '500',
                                        letterSpacing: '0.08em',
                                        color: isActive ? '#C9933A' : '#F5F1EB',
                                        textDecoration: 'none',
                                        opacity: '1',
                                        transition: 'color 0.3s ease, opacity 0.3s ease',
                                        cursor: 'pointer',
                                        borderBottom: isActive ? '1px solid #C9933A' : 'none',
                                        paddingBottom: isActive ? '2px' : '0'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) e.currentTarget.style.color = '#C9933A';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) e.currentTarget.style.color = '#F5F1EB';
                                    }}
                                >
                                    {link.name}
                                </Link>
                            )}
                            {index < navLinks.length - 1 && (
                                <span style={{
                                    color: 'rgba(201, 147, 58, 0.6)',
                                    fontSize: '14px',
                                    userSelect: 'none',
                                    pointerEvents: 'none'
                                }}>
                                    |
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* RIGHT COLUMN — Contact info + language switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
                <a href="tel:+810312345678" style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '17px',
                    fontWeight: '600',
                    letterSpacing: '0.12em',
                    color: '#F5F1EB',
                    textDecoration: 'none',
                    fontVariantNumeric: 'lining-nums',
                    fontFeatureSettings: '"lnum" 1'
                }}>
                    +81 (0)3-1234-5678
                </a>
                <span style={{ color: 'rgba(201,147,58,0.6)', fontSize: '14px' }}>|</span>
                <a href="mailto:hello@kanmanitours.com" style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '17px',
                    fontWeight: '600',
                    letterSpacing: '0.08em',
                    color: '#F5F1EB',
                    textDecoration: 'none'
                }}>
                    hello@kanmanitours.com
                </a>
                <span style={{ color: 'rgba(201,147,58,0.3)', fontSize: '14px' }}>|</span>
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
                            fontSize: '15px',
                            cursor: 'pointer',
                            fontFamily: "'Cormorant Garamond', Georgia, serif"
                        }}
                    >
                        <option value="ja" style={{ backgroundColor: '#1C1917' }}>日本語</option>
                        <option value="en" style={{ backgroundColor: '#1C1917' }}>English</option>
                    </select>
                </div>

                <div
                    style={{ position: 'relative', marginLeft: '8px' }}
                    onMouseEnter={() => setSnsOpen(true)}
                    onMouseLeave={() => setSnsOpen(false)}
                >
                    <button style={{
                        fontFamily: "'Jost', Arial, sans-serif",
                        fontSize: '15px',
                        fontWeight: '500',
                        letterSpacing: '0.18em',
                        color: '#F5F1EB',
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(201,147,58,0.3)',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'border-color 0.3s ease'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#C9933A';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(201,147,58,0.3)';
                        }}
                    >
                        SNS
                        <span style={{
                            fontSize: '10px',
                            color: '#C9933A',
                            transition: 'transform 0.3s ease',
                            display: 'inline-block',
                            transform: snsOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}>▼</span>
                    </button>

                    {snsOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: '0',
                            backgroundColor: '#1C1917',
                            border: '1px solid rgba(201,147,58,0.2)',
                            borderTop: '2px solid #C9933A',
                            minWidth: '180px',
                            zIndex: 1001,
                            paddingTop: '8px',
                            paddingBottom: '8px'
                        }}>
                            {[
                                {
                                    label: 'Facebook',
                                    icon: (
                                        <svg viewBox="0 0 24 24" fill="#1877F2" width="16" height="16">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    ),
                                    href: 'https://facebook.com/kanmanitours'
                                },
                                {
                                    label: 'Instagram',
                                    icon: (
                                        <svg viewBox="0 0 24 24" fill="#E1306C" width="16" height="16">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                                        </svg>
                                    ),
                                    href: 'https://instagram.com/kanmanitours'
                                },
                                {
                                    label: 'X (Twitter)',
                                    icon: (
                                        <svg viewBox="0 0 24 24" fill="#FFFFFF" width="16" height="16">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    ),
                                    href: 'https://x.com/kanmanitours'
                                },
                                {
                                    label: 'LINE',
                                    icon: (
                                        <svg viewBox="0 0 24 24" fill="#06C755" width="16" height="16">
                                            <path d="M24 10.304c0-5.228-5.383-9.485-12-9.485S0 5.076 0 10.304c0 4.683 4.25 8.602 10.002 9.356.39.084.922.258 1.058.59.12.295.08.758.038 1.057l-.164 1.002c-.05.295-.24 1.155 1.04.63 1.282-.525 6.917-4.07 9.435-6.97C22.95 14.624 24 12.604 24 10.304zM7.345 13.1c-.244 0-.442-.198-.442-.442V8.044c0-.244.198-.442.442-.442.244 0 .442.198.442.442v4.172h2.244c.244 0 .442.198.442.442 0 .244-.198.442-.442.442H7.345zm4.072-.442V8.044c0-.244.198-.442.442-.442.244 0 .442.198.442.442v4.614c0 .244-.198.442-.442.442-.244 0-.442-.198-.442-.442zm5.792-3.14l-1.928 3.52c-.11.2-.32.32-.55.32-.23 0-.44-.12-.55-.32l-1.928-3.52v3.14c0 .244-.198.442-.442.442s-.442-.198-.442-.442V8.044c0-.244.198-.442.442-.442.23 0 .44.12.55.32l1.928 3.52 1.928-3.52c.11-.2.32-.32.55-.32.244 0 .442.198.442.442v4.614c0 .244-.198.442-.442.442s-.442-.198-.442-.442V9.518zm5.13 2.14h-1.996V11.2h1.996c.244 0 .442-.198.442-.442s-.198-.442-.442-.442h-1.996V9.284h1.996c.244 0 .442-.198.442-.442s-.198-.442-.442-.442h-2.438c-.244 0-.442.198-.442.442v4.614c0 .244.198.442.442.442h2.438c.244 0 .442-.198.442-.442s-.198-.442-.442-.442z" />
                                        </svg>
                                    ),
                                    href: 'https://line.me/kanmanitours'
                                },
                                {
                                    label: 'YouTube',
                                    icon: (
                                        <svg viewBox="0 0 24 24" fill="#FF0000" width="16" height="16">
                                            <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                        </svg>
                                    ),
                                    href: 'https://youtube.com/@kanmanitours'
                                },
                            ].map(({ label, icon, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 20px',
                                        fontFamily: "'Jost', Arial, sans-serif",
                                        fontSize: '15px',
                                        fontWeight: '400',
                                        color: '#D4CFC9',
                                        textDecoration: 'none',
                                        letterSpacing: '0.06em',
                                        transition: 'color 0.2s ease, backgroundColor 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#C9933A';
                                        e.currentTarget.style.backgroundColor = 'rgba(201,147,58,0.06)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = '#D4CFC9';
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px' }}>
                                        {icon}
                                    </span>
                                    {label}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
