'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Tour, TourFaq } from '@/lib/tours';
import { formatPriceJPY, formatPriceRange } from '@/lib/tours';
import { useBooking } from '@/context/BookingContext';
import { useTranslations } from 'next-intl';

interface TourDetailClientProps {
    tour: Tour;
    otherTours: Tour[];
}

function AccordionItem({ question, answer }: TourFaq) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`faq-item ${open ? 'open' : ''}`}>
            <button className="faq-question" onClick={() => setOpen(!open)}>
                {question}
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"
                    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', flexShrink: 0 }}>
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>
            {open && <p className="faq-answer">{answer}</p>}
        </div>
    );
}

function ItineraryItem({ day, last }: { day: Tour['itinerary'][0]; last: boolean }) {
    const [open, setOpen] = useState(false);
    const t = useTranslations('Home');
    return (
        <div className={`itin-item ${last ? 'last' : ''}`}>
            <div className="itin-marker">
                <div className="itin-circle">{day.dayNumber}</div>
                {!last && <div className="itin-line" />}
            </div>
            <div className="itin-content">
                <button className="itin-title-btn" onClick={() => setOpen(!open)}>
                    <span>{t('day')} {day.dayNumber}: {day.title}</span>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"
                        style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', flexShrink: 0 }}>
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>
                {open && <p className="itin-details">{day.details}</p>}
            </div>
        </div>
    );
}

function Gallery({ images, tourTitle }: { images: string[]; tourTitle: string }) {
    const [lightbox, setLightbox] = useState<string | null>(null);
    if (images.length === 0) return null;
    return (
        <>
            <div className="gallery-grid">
                {images.map((src, i) => (
                    <button key={i} className="gallery-cell" onClick={() => setLightbox(src)}>
                        <img
                            src={src}
                            alt={`${tourTitle} — image ${i + 1}`}
                            className="gallery-img"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                    `https://placehold.co/600x400/1c2331/ffffff?text=Photo+${i + 1}`;
                            }}
                        />
                    </button>
                ))}
            </div>
            {lightbox && (
                <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
                    <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
                    <img src={lightbox} alt="Gallery" className="lightbox-img" onClick={e => e.stopPropagation()} />
                </div>
            )}
        </>
    );
}

function getTranslationForDaysLeft(startDate: string, t: any): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const diff = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff > 0) return t('daysToGo', { count: diff });
    if (diff === 0) return t('startsToday');
    return t('inProgress');
}

export default function TourDetailClient({ tour, otherTours }: TourDetailClientProps) {
    const { openBooking } = useBooking();
    const t = useTranslations('Home');
    const tButtons = useTranslations('Buttons');
    const tNav = useTranslations('Tours');

    const handleBook = () => openBooking(tour.slug);

    const daysLeftStr = getTranslationForDaysLeft(tour.startDate, t);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(tour.startDate);
    start.setHours(0, 0, 0, 0);
    const isPast = start <= today;
    const showComingSoon = !isPast && tour.isComingSoon;

    // Always provide a non-empty src — empty string causes React to re-fetch the page
    const heroSrc = tour.coverImage ||
        `https://placehold.co/1400x600/1c2331/ffffff?text=${encodeURIComponent(tour.title)}`;

    return (
        <>
            {/* BREADCRUMB — above the hero, clean bar */}
            <div className="td-breadcrumb-bar">
                <div className="container">
                    <nav className="breadcrumbs" aria-label="Breadcrumb">
                        <Link href="/">{tNav('breadcrumbHome')}</Link><span>/</span>
                        <Link href="/tours">{tNav('breadcrumbTours')}</Link><span>/</span>
                        <span>{tour.title}</span>
                    </nav>
                </div>
            </div>

            {/* HERO */}
            <div className="container td-hero-wrapper">
                <section className="td-hero">
                    <img
                        src={heroSrc}
                        alt={tour.title}
                        className="td-hero-bg"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                                `https://placehold.co/1400x600/1c2331/ffffff?text=${encodeURIComponent(tour.title)}`;
                        }}
                    />
                </section>
                <div className="td-hero-content-below">
                    <div className="td-header-row">
                        <h1 className="td-hero-title-dark">{tour.title}</h1>
                        <div className="td-hero-actions">
                            <button
                                className="td-btn-primary"
                                onClick={handleBook}
                                disabled={isPast}
                                style={isPast ? { backgroundColor: '#9ca3af', cursor: 'not-allowed', transform: 'none' } : {}}
                            >
                                {isPast ? t('bookingClosed') : tButtons('bookNow')}
                            </button>
                            <Link href="/contact" className="td-btn-secondary-dark">{tButtons('contactUs')}</Link>
                        </div>
                    </div>
                    <div className="td-hero-meta-light">
                        {showComingSoon && (
                            <span style={{ backgroundColor: '#eab308', color: '#fff', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold', marginRight: '1rem' }}>{t('comingSoon')}</span>
                        )}
                        <span>📅 {showComingSoon && tour.dateDisplay ? tour.dateDisplay : `${new Date(tour.startDate).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', year: 'numeric' })} — ${new Date(tour.endDate).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', year: 'numeric' })}`}</span>
                    </div>
                </div>
            </div>

            {/* QUICK INFO STRIP */}
            <div className="td-info-strip">
                <div className="container td-info-grid">
                    <div className="td-info-chip">
                        <span className="chip-icon">🗓️</span>
                        <div><div className="chip-label">{t('duration')}</div><div className="chip-value">{t('days', { count: tour.durationDays })}</div></div>
                    </div>
                    <div className="td-info-chip">
                        <span className="chip-icon">📍</span>
                        <div><div className="chip-label">{t('location')}</div><div className="chip-value">{tour.location}</div></div>
                    </div>
                    {!showComingSoon && (
                        <div className="td-info-chip">
                            <span className="chip-icon">⏳</span>
                            <div><div className="chip-label">{isPast ? t('status') : t('daysLeft')}</div><div className="chip-value td-seats">{isPast ? t('completed') : daysLeftStr}</div></div>
                        </div>
                    )}
                    {!isPast && (
                        <div className="td-info-chip">
                            <span className="chip-icon">🪑</span>
                            <div><div className="chip-label">{t('seatsAvailable')}</div><div className="chip-value td-seats">{tour.seatsLeft} left</div></div>
                        </div>
                    )}
                </div>
            </div>

            <div className="container td-body">
                {/* DESCRIPTION */}
                <section className="td-section">
                    <h2 className="td-section-title">{t('aboutTour')}</h2>
                    {tour.longDescription?.split('\n\n').map((para, i) => (
                        <p key={i} className="td-paragraph">{para}</p>
                    ))}
                    {(tour.whatToExpect ?? []).length > 0 && (
                        <div className="td-expect-box">
                            <h3 className="td-subsection-title">{t('whatToExpect')}</h3>
                            <ul className="td-bullet-list">
                                {(tour.whatToExpect ?? []).map((item, i) => (
                                    <li key={i}><span className="bullet-check">✓</span>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>

                {/* TOUR FEATURES / HIGHLIGHTS */}
                {(tour.features ?? []).length > 0 && (
                    <section className="td-section">
                        <h2 className="td-section-title">{t('highlights')}</h2>
                        <ul className="td-features-list">
                            {(tour.features ?? []).map((feature, i) => (
                                <li key={i} className="td-feature-item">
                                    <span className="td-feature-icon">⭐</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* ITINERARY */}
                <section className="td-section">
                    <h2 className="td-section-title">{t('itinerary')}</h2>
                    <p className="td-section-sub">{t('itineraryDesc')}</p>
                    <div className="itin-timeline">
                        {(tour.itinerary ?? []).map((day, i) => (
                            <ItineraryItem key={day.dayNumber} day={day} last={i === (tour.itinerary ?? []).length - 1} />
                        ))}
                    </div>
                </section>

                {/* INCLUSIONS / EXCLUSIONS */}
                <section className="td-section">
                    <h2 className="td-section-title">{t('whatToExpect')}</h2>
                    <div className="td-inc-exc-grid">
                        <div className="td-inc-box">
                            <h3 className="td-subsection-title td-inc-title">✅ {t('included')}</h3>
                            <ul className="td-bullet-list">
                                {(tour.inclusions ?? []).map((item, i) => (
                                    <li key={i}><span className="bullet-check">✓</span>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="td-exc-box">
                            <h3 className="td-subsection-title td-exc-title">❌ {t('notIncluded')}</h3>
                            <ul className="td-bullet-list">
                                {(tour.exclusions ?? []).map((item, i) => (
                                    <li key={i}><span className="bullet-cross">✕</span>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* GALLERY */}
                {(tour.galleryImages ?? []).length > 0 && (
                    <section className="td-section">
                        <h2 className="td-section-title">{t('photoGallery')}</h2>
                        <Gallery images={tour.galleryImages ?? []} tourTitle={tour.title} />
                    </section>
                )}

                {/* FAQ */}
                {(tour.faq ?? []).length > 0 && (
                    <section className="td-section">
                        <h2 className="td-section-title">Frequently Asked Questions</h2>
                        <div className="faq-list">
                            {(tour.faq ?? []).map((f, i) => <AccordionItem key={i} {...f} />)}
                        </div>
                    </section>
                )}

                {/* BOOKING CTA */}
                <section className="td-section td-booking-cta" id="booking-section">
                    <div className="td-price-card">
                        <div className="td-price-card-left">
                            <div className="td-price-card-label">{t('pricePerPerson')}</div>
                            <div className="td-price-card-amount">
                                {tour.priceRangeJPY ? formatPriceRange(tour.priceRangeJPY) : formatPriceJPY(tour.priceJPY)}
                            </div>
                            <div className="td-price-card-note">{t('priceIncludes')}</div>
                        </div>
                        <div className="td-price-card-right">
                            {!isPast && <p className="td-seats-warn">🔥 {t('seatsLeftPill', { count: tour.seatsLeft })}</p>}
                            <button
                                className="td-btn-primary td-book-big"
                                onClick={handleBook}
                                disabled={isPast}
                                style={isPast ? { backgroundColor: '#9ca3af', cursor: 'not-allowed', transform: 'none' } : {}}
                            >
                                {isPast ? t('bookingClosed') : tButtons('bookNow')}
                            </button>
                        </div>
                    </div>
                </section>

                {/* OTHER TOURS */}
                {otherTours.length > 0 && (
                    <section className="td-section">
                        <h2 className="td-section-title">{t('otherUpcomingTours')}</h2>
                        <div className="td-other-grid">
                            {otherTours.map(tOther => (
                                <Link href={`/tours/${tOther.slug}`} key={tOther.id} className="td-other-card">
                                    <img
                                        src={tOther.coverImage}
                                        alt={tOther.title}
                                        className="td-other-img"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src =
                                                `https://placehold.co/400x220/1c2331/ffffff?text=${encodeURIComponent(tOther.title)}`;
                                        }}
                                    />
                                    <div className="td-other-body">
                                        <span className="td-other-category">{tOther.category}</span>
                                        <p className="td-other-title">{tOther.title}</p>
                                        <p className="td-other-price">{t('from')} {formatPriceJPY(tOther.priceJPY)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* STICKY MOBILE BOOK NOW */}
            <div className="td-sticky-mobile">
                <div className="td-sticky-price">
                    {tour.priceRangeJPY ? formatPriceRange(tour.priceRangeJPY) : formatPriceJPY(tour.priceJPY)}
                    <small> {t('perPerson')}</small>
                </div>
                <button
                    className="td-btn-primary"
                    onClick={handleBook}
                    disabled={isPast}
                    style={isPast ? { backgroundColor: '#9ca3af', cursor: 'not-allowed' } : {}}
                >
                    {isPast ? t('completed') : tButtons('bookNow')}
                </button>
            </div>
        </>
    );
}
