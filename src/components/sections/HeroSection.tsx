'use client';

import Link from 'next/link';
import HeroSlideshow from '@/components/sections/HeroSlideshow';

interface HeroSectionProps {
    heroImages: string[];
}

export default function HeroSection({ heroImages }: HeroSectionProps) {
    return (
        <section id="home" className="hero animate" style={{
            animationDelay: '0.2s',
            width: '100%',
            marginLeft: '0',
            marginRight: '0',
            padding: '0',
            paddingTop: '0',
            marginTop: '0',
            top: '0',
            overflow: 'hidden',
            maxWidth: 'none',
            borderRadius: '0'
        }}>
            <div className="hero-content" style={{ width: '100%', position: 'relative', overflowX: 'hidden', maxWidth: '100%', borderRadius: '0' }}>
                {/* Slideshow */}
                <HeroSlideshow images={heroImages} altPrefix="Kanmani Tours">
                    <style dangerouslySetInnerHTML={{ __html: `
                        .hero-content {
                            height: 75vh !important;
                        }
                        @media (min-width: 1281px) {
                            .hero {
                                margin-top: -76px !important;
                            }
                        }
                        .hero-cta-btn {
                            font-family: var(--font-jost), Arial, sans-serif;
                            font-size: 15px;
                            font-weight: 700;
                            letter-spacing: 0.22em;
                            color: #1C1917 !important;
                            background: linear-gradient(135deg, #FFE082 0%, #C9933A 50%, #A17124 100%);
                            border: 2px solid #FFFFFF;
                            border-radius: 4px;
                            padding: 16px 36px;
                            text-decoration: none;
                            text-transform: uppercase;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            gap: 12px;
                            cursor: pointer;
                            margin-top: 0;
                            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
                            box-shadow: 0 0 25px rgba(201, 147, 58, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.4);
                            white-space: nowrap;
                        }
                        .hero-cta-btn:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 0 35px rgba(255, 224, 130, 0.95), 0 6px 20px rgba(0,0,0,0.4);
                        }
                        .hero-cta-btn:active {
                            transform: translateY(0);
                        }
                        .hero-cta-btn .cta-icon {
                            width: 22px;
                            height: 22px;
                            flex-shrink: 0;
                        }
                        @media (max-width: 1024px) {
                            .hero {
                                margin-top: 0 !important;
                            }
                            .hero-content {
                                height: 60vh !important;
                            }
                            .hero-cta-btn {
                                padding: 16px 32px;
                            }
                        }
                        @media (max-width: 768px) {
                            .hero {
                                margin-top: 0 !important;
                            }
                            .hero-content {
                                height: 50vh !important;
                            }
                            .hero-cta-btn {
                                padding: 14px 28px;
                                letter-spacing: 0.18em;
                            }
                        }
                    `}} />
                    <Link href="/india/tours" className="hero-cta-btn">
                        <svg className="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M3 9h18M9 21V9" />
                        </svg>
                        EXPLORE TOURS
                    </Link>
                </HeroSlideshow>
            </div>
        </section>
    );
}
