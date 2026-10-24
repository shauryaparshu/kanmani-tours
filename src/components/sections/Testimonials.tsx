'use client';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import type { Testimonial } from '@/lib/testimonials';

interface TestimonialCardProps {
    item: Testimonial;
    imageSrc: string;
    readMore: string;
    showLess: string;
}

function TestimonialCard({ item, imageSrc, readMore, showLess }: TestimonialCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const charLimit = 150;
    const isLongText = item.text.length > charLimit;

    const displayText = isExpanded ? item.text : item.text.slice(0, charLimit);

    return (
        <div className="testimonial-col">
            <div className="testimonial-wrapper">
                <div className="avatar-container">
                    <div className="avatar-bg-circle"></div>
                    <img
                        src={imageSrc}
                        alt={item.name}
                        className="testimonial-avatar-new"
                    />
                </div>
                <div className="testimonial-card-new">
                    <div className="testimonial-text-content">
                        <p className="testimonial-text-new">
                            {displayText}{!isExpanded && isLongText && "..."}
                        </p>
                        {isLongText && (
                            <button
                                className="read-more-btn-text"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsExpanded(!isExpanded);
                                }}
                            >
                                {isExpanded ? showLess : readMore}
                            </button>
                        )}
                    </div>

                    <div className="testimonial-footer-new">
                        <div className="author-main">
                            <span className="author-name-new">{item.name}</span>
                            <span className="author-role-new">{item.location}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface TestimonialsProps {
    testimonials: Testimonial[];
    customerImages: string[];
}

export default function Testimonials({ testimonials, customerImages }: TestimonialsProps) {
    const t = useTranslations('Home');
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalItems = testimonials.length;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % totalItems);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
    };

    return (
        <section id="testimonials" className="testimonials-section">
            <div className="testimonials-container">
                <div className="testimonials-header">
                    <div className="section-title-wrap" style={{ margin: '0 auto', textAlign: 'center' }}>
                        <h2 className="section-title">{t('happyClients')}</h2>
                        <p className="section-subtitle">{t('happyClientsSubtitle')}</p>
                    </div>
                </div>

                <div className="testimonials-window">
                    <button
                        type="button"
                        className="nav-btn-alt prev"
                        onClick={(e) => {
                            e.preventDefault();
                            prevSlide();
                        }}
                        aria-label="Previous testimonial"
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        className="nav-btn-alt next"
                        onClick={(e) => {
                            e.preventDefault();
                            nextSlide();
                        }}
                        aria-label="Next testimonial"
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>

                    <div
                        className="testimonials-carousel"
                        style={{
                            '--slide-index': currentIndex,
                        } as React.CSSProperties}
                    >
                        {testimonials.map((item, idx) => {
                            const imageSrc = customerImages[idx % customerImages.length] || '/assets/img/people/customers/001-yuki-tanaka.png';

                            return (
                                <TestimonialCard
                                    key={item.id}
                                    item={item}
                                    imageSrc={imageSrc}
                                    readMore={t('readMore')}
                                    showLess={t('showLess')}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
