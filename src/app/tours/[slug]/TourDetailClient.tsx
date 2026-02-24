'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Tour, TourFaq } from '@/lib/tours';
import { formatDateRange, formatPriceJPY, formatPriceRange } from '@/lib/tours';
import { useBooking } from '@/context/BookingContext';

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
    return (
        <div className={`itin-item ${last ? 'last' : ''}`}>
            <div className="itin-marker">
                <div className="itin-circle">{day.dayNumber}</div>
                {!last && <div className="itin-line" />}
            </div>
            <div className="itin-content">
                <button className="itin-title-btn" onClick={() => setOpen(!open)}>
                    <span>Day {day.dayNumber}: {day.title}</span>
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

function getDaysLeft(startDate: string): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const diff = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff > 0) return `${diff} days`;
    if (diff === 0) return 'Starts today!';
    return 'In progress';
}

export default function TourDetailClient({ tour, otherTours }: TourDetailClientProps) {
    const { openBooking } = useBooking();

    const handleBook = () => openBooking(tour.slug);

    const daysLeft = getDaysLeft(tour.startDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(tour.startDate);
    start.setHours(0, 0, 0, 0);
    const isPast = start <= today;

    // Always provide a non-empty src — empty string causes React to re-fetch the page
    const heroSrc = tour.coverImage ||
        `https://placehold.co/1400x600/1c2331/ffffff?text=${encodeURIComponent(tour.title)}`;

    return (
        <>
            {/* BREADCRUMB — above the hero, clean bar */}
            <div className="td-breadcrumb-bar">
                <div className="container">
                    <nav className="breadcrumbs" aria-label="Breadcrumb">
                        <Link href="/">Home</Link><span>/</span>
                        <Link href="/tours">Tours</Link><span>/</span>
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
                                {isPast ? 'Booking Closed' : 'Book Now'}
                            </button>
                            <Link href="/contact" className="td-btn-secondary-dark">Contact Us</Link>
                        </div>
                    </div>
                    <div className="td-hero-meta-light">
                        <span>📅 {new Date(tour.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} — {new Date(tour.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </div>
            </div>

            {/* QUICK INFO STRIP */}
            <div className="td-info-strip">
                <div className="container td-info-grid">
                    <div className="td-info-chip">
                        <span className="chip-icon">🗓️</span>
                        <div><div className="chip-label">Duration</div><div className="chip-value">{tour.durationDays} Days</div></div>
                    </div>
                    <div className="td-info-chip">
                        <span className="chip-icon">📍</span>
                        <div><div className="chip-label">Location</div><div className="chip-value">{tour.location}</div></div>
                    </div>
                    <div className="td-info-chip">
                        <span className="chip-icon">⏳</span>
                        <div><div className="chip-label">{isPast ? 'Status' : 'Days Left'}</div><div className="chip-value td-seats">{isPast ? 'Completed' : daysLeft}</div></div>
                    </div>
                    {!isPast && (
                        <div className="td-info-chip">
                            <span className="chip-icon">🪑</span>
                            <div><div className="chip-label">Seats Available</div><div className="chip-value td-seats">{tour.seatsLeft} left</div></div>
                        </div>
                    )}
                </div>
            </div>

            <div className="container td-body">
                {/* DESCRIPTION */}
                <section className="td-section">
                    <h2 className="td-section-title">About This Tour</h2>
                    {tour.longDescription?.split('\n\n').map((para, i) => (
                        <p key={i} className="td-paragraph">{para}</p>
                    ))}
                    {(tour.whatToExpect ?? []).length > 0 && (
                        <div className="td-expect-box">
                            <h3 className="td-subsection-title">What you'll experience</h3>
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
                        <h2 className="td-section-title">Tour Highlights</h2>
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
                    <h2 className="td-section-title">Day-by-Day Itinerary</h2>
                    <p className="td-section-sub">Click each day to expand the details.</p>
                    <div className="itin-timeline">
                        {(tour.itinerary ?? []).map((day, i) => (
                            <ItineraryItem key={day.dayNumber} day={day} last={i === (tour.itinerary ?? []).length - 1} />
                        ))}
                    </div>
                </section>

                {/* INCLUSIONS / EXCLUSIONS */}
                <section className="td-section">
                    <h2 className="td-section-title">What's Included</h2>
                    <div className="td-inc-exc-grid">
                        <div className="td-inc-box">
                            <h3 className="td-subsection-title td-inc-title">✅ Included</h3>
                            <ul className="td-bullet-list">
                                {(tour.inclusions ?? []).map((item, i) => (
                                    <li key={i}><span className="bullet-check">✓</span>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="td-exc-box">
                            <h3 className="td-subsection-title td-exc-title">❌ Not Included</h3>
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
                        <h2 className="td-section-title">Photo Gallery</h2>
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
                            <div className="td-price-card-label">Price per person</div>
                            <div className="td-price-card-amount">
                                {tour.priceRangeJPY ? formatPriceRange(tour.priceRangeJPY) : formatPriceJPY(tour.priceJPY)}
                            </div>
                            <div className="td-price-card-note">Includes accommodation, meals, guide &amp; all activity fees listed above.</div>
                        </div>
                        <div className="td-price-card-right">
                            {!isPast && <p className="td-seats-warn">🔥 Only {tour.seatsLeft} seats remaining!</p>}
                            <button
                                className="td-btn-primary td-book-big"
                                onClick={handleBook}
                                disabled={isPast}
                                style={isPast ? { backgroundColor: '#9ca3af', cursor: 'not-allowed', transform: 'none' } : {}}
                            >
                                {isPast ? 'Booking Closed' : 'Book Now'}
                            </button>
                        </div>
                    </div>
                </section>

                {/* OTHER TOURS */}
                {otherTours.length > 0 && (
                    <section className="td-section">
                        <h2 className="td-section-title">Other Upcoming Tours</h2>
                        <div className="td-other-grid">
                            {otherTours.map(t => (
                                <Link href={`/tours/${t.slug}`} key={t.id} className="td-other-card">
                                    <img
                                        src={t.coverImage}
                                        alt={t.title}
                                        className="td-other-img"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src =
                                                `https://placehold.co/400x220/1c2331/ffffff?text=${encodeURIComponent(t.title)}`;
                                        }}
                                    />
                                    <div className="td-other-body">
                                        <span className="td-other-category">{t.category}</span>
                                        <p className="td-other-title">{t.title}</p>
                                        <p className="td-other-price">From {formatPriceJPY(t.priceJPY)}</p>
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
                    <small> /person</small>
                </div>
                <button
                    className="td-btn-primary"
                    onClick={handleBook}
                    disabled={isPast}
                    style={isPast ? { backgroundColor: '#9ca3af', cursor: 'not-allowed' } : {}}
                >
                    {isPast ? 'Closed' : 'Book Now'}
                </button>
            </div>
        </>
    );
}
