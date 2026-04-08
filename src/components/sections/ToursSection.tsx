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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingTours = tours
        .filter(t => {
            const start = new Date(t.startDate);
            start.setHours(0, 0, 0, 0);
            return start > today;
        })
        .slice(0, 3);

    return (
        <section id="tours" className="animate" style={{ 
            animationDelay: '0.4s', 
            backgroundColor: '#FAFAF7', 
            padding: '96px 40px 64px 40px' 
        }}>
            <div className="section-header-flex">
                <div className="section-title-wrap">
                    <h2 style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 'clamp(36px, 4vw, 52px)',
                        fontWeight: '400',
                        color: '#1C1917',
                        letterSpacing: '0.06em',
                        marginBottom: '8px'
                    }}>{t('upcomingTours')}</h2>
                    <div style={{
                        width: '48px',
                        height: '1px',
                        backgroundColor: '#C9933A',
                        margin: '16px 0 12px 0'
                    }}/>
                    <p style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '17px',
                        fontWeight: '400',
                        color: '#4A4540',
                        letterSpacing: '0.04em',
                        fontStyle: 'italic'
                    }}>{t('upcomingToursSubtitle')}</p>
                </div>
                <Link 
                    href="/tours" 
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#C9933A';
                        e.currentTarget.style.color = '#1C1917';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#C9933A';
                    }}
                    style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '13px',
                        fontWeight: '500',
                        letterSpacing: '0.28em',
                        color: '#C9933A',
                        backgroundColor: 'transparent',
                        border: '1.5px solid #C9933A',
                        padding: '14px 36px',
                        textDecoration: 'none',
                        textTransform: 'uppercase',
                        display: 'inline-block',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {t('viewAllTours')}
                </Link>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '28px',
                marginTop: '48px'
            }}>
                {upcomingTours.map((tour) => {
                    const imagePath = cardImages[tour.id] ?? tour.coverImage;
                    const showComingSoon = tour.isComingSoon;

                    return (
                        <div 
                            key={tour._id} 
                            style={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E8E4DC',
                                borderRadius: '2px',
                                overflow: 'hidden',
                                transition: 'all 0.35s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#C9933A';
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 12px 40px rgba(201,147,58,0.12)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#E8E4DC';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <Link href={`/tours/${tour.slug}`} className="tour-img-link">
                                <div className="tour-img-wrap" style={{ 
                                    position: 'relative', 
                                    width: '100%', 
                                    minHeight: '220px', 
                                    backgroundColor: '#E8E4DC', 
                                    overflow: 'hidden' 
                                }}>
                                    <img
                                        src={imagePath || `https://placehold.co/600x400?text=${encodeURIComponent(tour.title)}`}
                                        alt={tour.title}
                                        className="tour-img"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => {
                                            const target = e.currentTarget as HTMLImageElement;
                                            target.src = `https://placehold.co/600x400?text=${encodeURIComponent(tour.title)}`;
                                        }}
                                    />
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '1rem',
                                            left: '1rem',
                                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                                            fontSize: '10px',
                                            fontWeight: '500',
                                            letterSpacing: '0.22em',
                                            color: '#C9933A',
                                            backgroundColor: 'rgba(201, 147, 58, 0.1)',
                                            border: '1px solid rgba(201, 147, 58, 0.3)',
                                            padding: '4px 12px',
                                            textTransform: 'uppercase',
                                            borderRadius: '0px',
                                            zIndex: 2
                                        }}
                                    >
                                        {getCategoryLabel(tour.category)}
                                    </div>
                                    {showComingSoon && (
                                        <div style={{ 
                                            position: 'absolute',
                                            top: '1rem',
                                            right: '1rem', 
                                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                                            fontSize: '10px',
                                            fontWeight: '500',
                                            letterSpacing: '0.22em',
                                            color: '#1C1917',
                                            backgroundColor: 'rgba(234, 179, 8, 0.2)',
                                            border: '1px solid rgba(234, 179, 8, 0.5)',
                                            padding: '4px 12px',
                                            textTransform: 'uppercase',
                                            borderRadius: '0px',
                                            zIndex: 2
                                        }}>
                                            {t('comingSoon')}
                                        </div>
                                    )}
                                </div>
                            </Link>
                            <div className="tour-content" style={{ padding: '24px' }}>
                                <div className="tour-dates-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <div style={{
                                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                                        fontSize: '13px',
                                        color: '#4A4540',
                                        letterSpacing: '0.06em'
                                    }}>
                                        {showComingSoon && tour.dateDisplay ? tour.dateDisplay : formatDateRange(tour.startDate, tour.endDate)}
                                    </div>
                                    {!showComingSoon && (
                                        <div style={{
                                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                                            fontSize: '11px',
                                            fontWeight: '500',
                                            letterSpacing: '0.15em',
                                            color: '#C9933A',
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            textTransform: 'uppercase'
                                        }}>
                                            {getRemainingDays(tour.startDate)}
                                        </div>
                                    )}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    marginBottom: '12px',
                                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                                    fontSize: '14px',
                                    color: '#4A4540'
                                }}>
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="#4A4540">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                    {tour.location}
                                </div>
                                <h3 style={{ marginBottom: '16px' }}>
                                    <Link href={`/tours/${tour.slug}`} style={{
                                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                                        fontSize: '24px',
                                        fontWeight: '500',
                                        color: '#1C1917',
                                        letterSpacing: '0.04em',
                                        lineHeight: '1.3',
                                        textDecoration: 'none'
                                    }}>
                                        {tour.title}
                                    </Link>
                                </h3>
                                <div style={{
                                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    letterSpacing: '0.15em',
                                    color: '#1C1917',
                                    backgroundColor: 'rgba(201, 147, 58, 0.12)',
                                    border: '1px solid rgba(201, 147, 58, 0.25)',
                                    padding: '8px 16px',
                                    textTransform: 'uppercase',
                                    borderRadius: '0px',
                                    display: 'inline-block',
                                    marginBottom: '20px'
                                }}>
                                    {t('seatsLeft', { count: tour.seatsLeft })}
                                </div>
                                <div>
                                    <Link href={`/tours/${tour.slug}`} style={{
                                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        letterSpacing: '0.2em',
                                        color: '#C9933A',
                                        textDecoration: 'none',
                                        textTransform: 'uppercase',
                                        borderBottom: '1px solid rgba(201,147,58,0.4)',
                                        paddingBottom: '2px',
                                        transition: 'border-color 0.3s ease'
                                    }}>
                                        {t('learnMore')} →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
