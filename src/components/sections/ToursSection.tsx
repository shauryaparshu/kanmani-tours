'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { formatDateRange, type Tour } from '@/lib/tours';
import { getCategoryColor, getCategoryLabel } from '@/lib/categories';

interface ToursSectionProps {
    tours: Tour[];
    cardImages?: Record<number | string, string | null>;
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

export default function ToursSection({ tours, cardImages = {} }: ToursSectionProps) {
    const t = useTranslations('Home');

    if (!tours || tours.length === 0) return null;

    return (
        <section id="tours" style={{ backgroundColor: '#FAFAF7', overflow: 'hidden' }}>
            <style dangerouslySetInnerHTML={{ __html: `
                .upcoming-tours-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2rem;
                    margin-top: 3rem;
                }
                .tour-card-link {
                    text-decoration: none;
                    color: inherit;
                    display: block;
                }
                .tour-card-image-wrap {
                    aspect-ratio: 4 / 3;
                    overflow: hidden;
                    position: relative;
                    background-color: #1a1918;
                }
                .tour-card-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
                }
                .tour-card-link:hover .tour-card-img {
                    transform: scale(1.03);
                }
                .tour-card-cta {
                    display: inline-block;
                    margin-top: auto;
                    color: #d49a36;
                    font-family: 'Jost', Arial, sans-serif;
                    font-size: 13px;
                    font-weight: 600;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    transition: transform 0.3s ease;
                }
                .tour-card-link:hover .tour-card-cta {
                    transform: translateX(4px);
                }
                @media (max-width: 992px) {
                    .upcoming-tours-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (max-width: 640px) {
                    .upcoming-tours-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}} />
            
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '5rem 2rem'
            }}>
                {/* Section Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginBottom: '3rem',
                    borderBottom: '1px solid #E8E4DC',
                    paddingBottom: '2rem'
                }}>
                    <div style={{ textAlign: 'left' }}>
                        <h2 style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: 'clamp(32px, 4vw, 44px)',
                            fontWeight: '500',
                            color: '#1a1918',
                            letterSpacing: '0.04em',
                            margin: 0
                        }}>
                            Upcoming Tours
                        </h2>
                        <p style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: '17px',
                            fontWeight: '400',
                            color: '#4a4a4a',
                            letterSpacing: '0.04em',
                            fontStyle: 'italic',
                            marginTop: '8px',
                            margin: 0
                        }}>
                            Specially curated journeys through the heart of India
                        </p>
                    </div>
                    
                    <Link href="/tours" style={{
                        fontFamily: "'Jost', Arial, sans-serif",
                        fontSize: '12px',
                        fontWeight: '600',
                        letterSpacing: '0.22em',
                        color: '#d49a36',
                        backgroundColor: 'transparent',
                        border: '1px solid #d49a36',
                        padding: '14px 32px',
                        textDecoration: 'none',
                        textTransform: 'uppercase',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#d49a36';
                        e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#d49a36';
                    }}>
                        VIEW ALL TOURS
                    </Link>
                </div>

                {/* Tour Grid */}
                <div className="upcoming-tours-grid">
                    {tours.map((tour) => {
                        const imagePath = (tour as any).hero_image || (tour as any).featured_image || (tour as any).thumbnail_image || (tour as any).banner_image || tour.coverImage;
                        return (
                            <Link key={tour._id || tour.id} href={`/tours/${tour.slug}`} className="tour-card-link">
                                <article style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <div className="tour-card-image-wrap">
                                        {imagePath ? (
                                            <img 
                                                src={imagePath}
                                                alt={tour.title}
                                                className="tour-card-img"
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
                                            backgroundColor: '#1a1918',
                                            color: '#FFFFFF',
                                            fontFamily: "'Jost', Arial, sans-serif",
                                            fontSize: '10px',
                                            fontWeight: '600',
                                            letterSpacing: '0.2em',
                                            padding: '8px 16px',
                                            textTransform: 'uppercase',
                                            zIndex: 2
                                        }}>
                                            {getCategoryLabel(tour.category)}
                                        </span>
                                    </div>
                                    
                                    <div style={{ padding: '1.5rem 0', textAlign: 'left', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{
                                            fontFamily: "'Jost', Arial, sans-serif",
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            color: '#4a4a4a',
                                            letterSpacing: '0.08em',
                                            marginBottom: '10px'
                                        }}>
                                            {formatDateRange(tour.startDate, tour.endDate)} | {tour.location?.toUpperCase()}
                                        </div>
                                        
                                        <h3 style={{
                                            fontFamily: "'Jost', Arial, sans-serif",
                                            fontSize: '1.4rem',
                                            fontWeight: '600',
                                            color: '#1a1918',
                                            letterSpacing: '0.04em',
                                            lineHeight: '1.3',
                                            marginBottom: '1rem',
                                            marginTop: 0,
                                            fontVariantNumeric: 'lining-nums'
                                        }}>
                                            {tour.title}
                                        </h3>
                                        
                                        <div className="tour-card-cta">
                                            LEARN MORE &rarr;
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
