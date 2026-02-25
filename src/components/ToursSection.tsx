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
const catText = (cat: string) => 'white';

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
        <section id="tours" className="container animate" style={{ animationDelay: '0.4s' }}>
            <div className="section-header-flex">
                <div className="section-title-wrap">
                    <h2 className="section-title">{t('upcomingTours')}</h2>
                    <p className="section-subtitle">{t('upcomingToursSubtitle')}</p>
                </div>
                <Link href="/tours" className="btn-outline-primary">
                    {t('viewAllTours')}
                </Link>
            </div>

            <div className="itineraries-grid">
                {upcomingTours.map((tour) => {
                    const imagePath = cardImages[tour.id] ?? tour.coverImage;
                    const showComingSoon = tour.isComingSoon;

                    return (
                        <div key={tour.id} className="tour-card">
                            <Link href={`/tours/${tour.slug}`} className="tour-img-link">
                                <div className="tour-img-wrap">
                                    <img
                                        src={imagePath || `https://placehold.co/600x400?text=${encodeURIComponent(tour.title)}`}
                                        alt={tour.title}
                                        className="tour-img"
                                        onError={(e) => {
                                            const target = e.currentTarget as HTMLImageElement;
                                            target.src = `https://placehold.co/600x400?text=${encodeURIComponent(tour.title)}`;
                                        }}
                                    />
                                    <div
                                        className="tour-badge"
                                        style={{
                                            backgroundColor: catBg(tour.category),
                                            color: catText(tour.category),
                                            boxShadow: `0 4px 10px ${catBg(tour.category)}40`
                                        }}
                                    >
                                        {getCategoryLabel(tour.category)}
                                    </div>
                                    {showComingSoon && (
                                        <div className="tour-badge" style={{ right: '1rem', left: 'auto', backgroundColor: '#eab308', color: '#fff' }}>
                                            {t('comingSoon')}
                                        </div>
                                    )}
                                </div>
                            </Link>
                            <div className="tour-content">
                                <div className="tour-dates-row">
                                    <div className="tour-dates">
                                        {showComingSoon && tour.dateDisplay ? tour.dateDisplay : formatDateRange(tour.startDate, tour.endDate)}
                                    </div>
                                    {!showComingSoon && (
                                        <div className="tour-countdown">
                                            {getRemainingDays(tour.startDate)}
                                        </div>
                                    )}
                                </div>

                                <div className="tour-location">
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="var(--primary)">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                    {tour.location}
                                </div>

                                <h3 className="tour-title-new">
                                    <Link href={`/tours/${tour.slug}`}>
                                        {tour.title}
                                    </Link>
                                </h3>

                                <ul className="tour-features">
                                    {tour.features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>

                                <div className="tour-availability">
                                    <span className="availability-icon">🔥</span>
                                    <span className="availability-text">{t('seatsLeft', { count: tour.seatsLeft })}</span>
                                </div>

                                <Link href={`/tours/${tour.slug}`} className="btn-tour-details">
                                    {t('learnMore')}
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
