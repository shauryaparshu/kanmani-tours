'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { formatDateRange, type Tour } from '@/lib/tours';
import { getCategoryColor, getCategoryLabel } from '@/lib/categories';
import LazyImage from '@/components/ui/LazyImage';

interface ToursSectionProps {
    tours: Tour[];
    cardImages?: Record<number | string, string | null>;
    locale?: string;
}

function getRemainingDays(startDate: string): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 0) return `${diffDays} days to go`;
    if (diffDays === 0) return 'Starts today!';
    return 'In progress';
}

const catBg = (cat: string) => getCategoryColor(cat);

export default function ToursSection({ tours, cardImages = {}, locale: propLocale }: ToursSectionProps) {
    const defaultLocale = useLocale();
    const locale = propLocale || defaultLocale;
    const t = useTranslations('Home');

    if (!tours || tours.length === 0) return null;

    return (
        <section id="tours" style={{ backgroundColor: '#F7F2EA', overflow: 'hidden', position: 'relative' }}>
            <style dangerouslySetInnerHTML={{ __html: `
                .tours-section-bg {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background:
                        radial-gradient(circle at 12% 8%, rgba(201, 147, 58, 0.12), transparent 28%),
                        radial-gradient(circle at 88% 18%, rgba(28, 25, 23, 0.08), transparent 26%),
                        linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(248,242,234,0.96) 45%, rgba(244,238,229,1) 100%);
                }
                .upcoming-tours-container {
                    max-width: 1260px;
                    margin: 0 auto;
                    padding: 72px 60px 96px;
                    position: relative;
                    z-index: 1;
                }
                .upcoming-tours-shell {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 28px;
                    position: relative;
                }
                .upcoming-tours-shell::before {
                    content: '';
                    position: absolute;
                    left: -18px;
                    top: 12px;
                    bottom: 22px;
                    width: 1px;
                    background: linear-gradient(180deg, transparent, rgba(201,147,58,0.55), transparent);
                    opacity: 0.9;
                }
                .upcoming-tours-heading {
                    font-family: 'Cormorant Garamond', Georgia, serif;
                    font-size: clamp(42px, 5vw, 64px);
                    font-weight: 500;
                    color: #1a1918;
                    letter-spacing: 0.02em;
                    margin: 0;
                }
                .upcoming-tours-heading span {
                    color: #C9933A;
                }
                .upcoming-tours-subtitle {
                    font-family: 'Cormorant Garamond', Georgia, serif;
                    font-size: 18px;
                    font-weight: 400;
                    color: #4A3E34;
                    letter-spacing: 0.045em;
                    font-style: italic;
                    margin: 10px 0 0;
                    max-width: 560px;
                }
                .upcoming-tours-copy {
                    min-width: 0;
                }
                .tours-divider-rail {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    margin: 28px 0 40px;
                }
                .tours-divider-rail span {
                    height: 1px;
                    flex: 1;
                    background: linear-gradient(90deg, transparent, rgba(201,147,58,0.75), transparent);
                }
                .tours-divider-rail i {
                    width: 9px;
                    height: 9px;
                    border-radius: 50%;
                    display: block;
                    background: radial-gradient(circle, #FFE082 0%, #C9933A 58%, #8A5B18 100%);
                    box-shadow: 0 0 18px rgba(201,147,58,0.95);
                    flex-shrink: 0;
                }
                .upcoming-tours-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.75rem;
                    position: relative;
                }
                .upcoming-tours-action {
                    flex-shrink: 0;
                    margin-bottom: 8px;
                }
                .tour-card-link {
                    text-decoration: none;
                    color: inherit;
                    display: block;
                    width: 100%;
                    padding: 1px;
                    border-radius: 24px;
                    background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(201,147,58,0.28));
                    box-shadow: 0 18px 45px rgba(28, 25, 23, 0.08);
                    transition: transform 0.35s ease, box-shadow 0.35s ease;
                }
                .tour-card-link:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 24px 55px rgba(28, 25, 23, 0.14);
                }
                .tour-card-frame {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(247,240,231,0.98));
                    border-radius: 23px;
                    overflow: hidden;
                    border: 1px solid rgba(74, 69, 64, 0.10);
                    position: relative;
                }
                .tour-card-frame::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    border-radius: 23px;
                    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.65);
                }
                .tour-card-frame::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #8A5B18 0%, #FFE082 45%, #C9933A 100%);
                }
                .tour-card-image-wrap {
                    aspect-ratio: 4 / 3;
                    overflow: hidden;
                    position: relative;
                    background:
                        linear-gradient(180deg, rgba(26,25,24,0.04), rgba(26,25,24,0.14)),
                        #1a1918;
                }
                .tour-card-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1), filter 0.6s ease;
                    filter: saturate(0.98) contrast(1.02);
                }
                .tour-card-link:hover .tour-card-img {
                    transform: scale(1.05);
                    filter: saturate(1.05) contrast(1.06);
                }
                .tour-card-body {
                    padding: 1.35rem 1.35rem 1.45rem;
                    text-align: left;
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    background: linear-gradient(180deg, rgba(255,255,255,0.5), rgba(247,240,231,0.88));
                }
                .tour-card-separator {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin: 0.2rem 0 1rem;
                }
                .tour-card-separator span {
                    height: 1px;
                    flex: 1;
                    background: linear-gradient(90deg, rgba(201,147,58,0.05), rgba(201,147,58,0.45), rgba(201,147,58,0.05));
                }
                .tour-card-separator i {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    display: block;
                    background: #C9933A;
                    box-shadow: 0 0 10px rgba(201,147,58,0.6);
                }
                .tour-card-meta {
                    font-family: 'Jost', Arial, sans-serif;
                    font-size: 12px;
                    font-weight: 500;
                    color: #4a4a4a;
                    letter-spacing: 0.08em;
                    margin-bottom: 10px;
                }
                .tour-card-title {
                    font-family: 'Jost', Arial, sans-serif;
                    font-size: 1.35rem;
                    font-weight: 650;
                    color: #1a1918;
                    letter-spacing: 0.03em;
                    line-height: 1.28;
                    margin: 0 0 1rem;
                    font-variant-numeric: lining-nums;
                }
                .tour-card-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: auto;
                    padding-top: 10px;
                    border-top: 1px solid rgba(201,147,58,0.18);
                }
                .tour-card-cta {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    color: #d49a36;
                    font-family: 'Jost', Arial, sans-serif;
                    font-size: 13px;
                    font-weight: 700;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                    transition: transform 0.3s ease;
                }
                .tour-card-link:hover .tour-card-cta {
                    transform: translateX(4px);
                }
                .tour-card-cta i {
                    width: 18px;
                    height: 18px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 999px;
                    border: 1px solid rgba(201,147,58,0.35);
                    background: rgba(201,147,58,0.08);
                    color: #8A5B18;
                    font-style: normal;
                    line-height: 1;
                }
                @media (max-width: 1024px) {
                    .upcoming-tours-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (max-width: 768px) {
                    .upcoming-tours-container {
                        padding: 40px 20px 72px;
                    }
                    .upcoming-tours-shell {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 16px;
                    }
                    .upcoming-tours-heading {
                        font-size: 28px;
                    }
                    .tours-divider-rail {
                        margin: 22px 0 28px;
                    }
                    .upcoming-tours-grid {
                        grid-template-columns: 1fr;
                    }
                    .upcoming-tours-action {
                        margin-bottom: 0;
                    }
                }
            `}} />
            
            <div className="tours-section-bg" aria-hidden="true" />
            <div className="upcoming-tours-container">
                {/* Section Header */}
                <div className="upcoming-tours-shell">
                    <div className="upcoming-tours-copy" style={{ textAlign: 'left' }}>
                        <h2 className="upcoming-tours-heading">
                            Upcoming <span>Tours</span>
                        </h2>
                        <p className="upcoming-tours-subtitle">
                            Specially curated journeys through the heart of India
                        </p>
                    </div>
                    <div className="upcoming-tours-action">
                        <Link href="/tours" style={{
                            fontFamily: "'Jost', Arial, sans-serif",
                            fontSize: '14px',
                            fontWeight: '700',
                            letterSpacing: '0.22em',
                            color: '#1C1917',
                            background: 'linear-gradient(135deg, #FFE082 0%, #C9933A 50%, #A17124 100%)',
                            border: '2px solid #FFFFFF',
                            borderRadius: '4px',
                            padding: '16px 36px',
                            textDecoration: 'none',
                            textTransform: 'uppercase',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 0 25px rgba(201, 147, 58, 0.55), inset 0 1px 0 rgba(255,255,255,0.4)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #FFF8E1 0%, #E5A93C 50%, #B87F2A 100%)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 0 35px rgba(255, 224, 130, 0.95), 0 6px 20px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #FFE082 0%, #C9933A 50%, #A17124 100%)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 0 25px rgba(201, 147, 58, 0.55), inset 0 1px 0 rgba(255,255,255,0.4)';
                        }}>
                            <i aria-hidden="true" style={{
                                width: '18px',
                                height: '18px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '999px',
                                border: '1px solid rgba(28,25,23,0.25)',
                                background: 'rgba(28,25,23,0.08)',
                                fontStyle: 'normal',
                                lineHeight: 1
                            }}>↗</i>
                            VIEW ALL TOURS
                        </Link>
                    </div>
                </div>

                <div className="tours-divider-rail" aria-hidden="true">
                    <span />
                    <i />
                    <span />
                </div>

                {/* Tour Grid */}
                <div className="upcoming-tours-grid">
                    {tours.map((tour) => {
                        const tourImage = tour as Tour & {
                            hero_image?: string;
                            featured_image?: string;
                            thumbnail_image?: string;
                            banner_image?: string;
                        };
                        const imagePath = tourImage.hero_image || tourImage.featured_image || tourImage.thumbnail_image || tourImage.banner_image || tour.coverImage;
                        return (
                            <Link key={tour._id || tour.id} href={`/tours/${tour.slug}`} className="tour-card-link">
                                <article className="tour-card-frame">
                                    <div className="tour-card-image-wrap">
                                        {imagePath ? (
                                            <LazyImage 
                                                src={imagePath}
                                                alt={tour.title}
                                                className="tour-card-img"
                                                lqip={tour.coverImageLqip}
                                            />
                                        ) : (
                                            <div style={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: '#1a1918',
                                                backgroundImage: 'radial-gradient(circle at center, rgba(212,154,54,0.15) 0%, transparent 70%)'
                                            }}>
                                                <span style={{
                                                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                                                    fontSize: '16px',
                                                    letterSpacing: '0.2em',
                                                    color: 'rgba(212,154,54,0.4)',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    Srikan Tours
                                                </span>
                                            </div>
                                        )}
                                        <span style={{
                                            position: 'absolute',
                                            top: '0',
                                            left: '0',
                                            background: 'rgba(28,25,23,0.92)',
                                            color: '#FFF3D8',
                                            fontFamily: "'Jost', Arial, sans-serif",
                                            fontSize: '10px',
                                            fontWeight: '700',
                                            letterSpacing: '0.24em',
                                            padding: '9px 16px',
                                            textTransform: 'uppercase',
                                            zIndex: 2,
                                            borderRight: '1px solid rgba(201,147,58,0.55)',
                                            borderBottom: '1px solid rgba(201,147,58,0.55)',
                                            boxShadow: '0 8px 18px rgba(0,0,0,0.12)'
                                        }}>
                                            {getCategoryLabel(tour.category)}
                                        </span>
                                    </div>
                                    
                                    <div className="tour-card-body">
                                        <div className="tour-card-meta">
                                            {formatDateRange(tour.startDate, tour.endDate, locale)} | {tour.location?.toUpperCase()}
                                        </div>

                                        <div className="tour-card-separator" aria-hidden="true">
                                            <span />
                                            <i />
                                            <span />
                                        </div>

                                        <h3 className="tour-card-title">
                                            {tour.title}
                                        </h3>
                                        
                                        <div className="tour-card-footer">
                                            <div className="tour-card-cta">
                                                <i aria-hidden="true">↗</i>
                                                LEARN MORE
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
