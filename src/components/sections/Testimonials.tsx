'use client';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

const TESTIMONIALS_LIST = [
    {
        id: 1,
        name: "Ram Charan Fan Community",
        location: "Tokyo, Japan",
        text: "Dr. Kanmani has been a wonderful friend to me and to our Ram Charan fan community in Tokyo. Her strong personal connections with top film personalities are truly remarkable. Thanks to her personal contacts, she arranged our visit to Ram Charan's home in Hyderabad. He spent 1.5 hours with all 16 of us, spoke individually, and even gave us gifts. All credit goes to Dr. Kanmani — caring, trustworthy, and deeply committed to people.",
        tour: "Celebrity Home Visit — Ram Charan"
    },
    {
        id: 2,
        name: "S.J. Surya Fan Group",
        location: "Japan",
        text: "We are devoted S.J. Surya fans from Japan, and we asked Dr. Kanmani to help us meet him. She contacted director Karthik Subbaraj, who immediately reached out to S.J. Surya at her request. The very next day, we were welcomed into S.J. Surya's home — a dream we never thought possible. This unforgettable experience happened entirely because of Dr. Kanmani's care and influence. She understands exactly what we need, and her dedication and Japanese language skills make her truly exceptional.",
        tour: "Celebrity Home Visit — S.J. Surya"
    },
    {
        id: 3,
        name: "Karthik Subbaraj Admirers",
        location: "Japan",
        text: "We have always admired director Karthik Subbaraj and dreamed of meeting him. During our Chennai visit, he was shooting near Madurai, yet Dr. Kanmani secured an appointment instantly. She arranged transportation from Chennai, and we spent the entire day with him and his film crew — he even hosted us for lunch. With just a few calls, Kanmani makes the impossible happen. To us, she is Akka — quick, caring, and a true leader who turns dreams into reality.",
        tour: "Film Director Meet — Karthik Subbaraj"
    }
];

interface TestimonialCardProps {
    item: typeof TESTIMONIALS_LIST[0];
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
    customerImages: string[];
}

export default function Testimonials({ customerImages }: TestimonialsProps) {
    const t = useTranslations('Home');
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalItems = TESTIMONIALS_LIST.length;

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
                        {TESTIMONIALS_LIST.map((item, idx) => {
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
