'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Tour, TourFaq } from '@/lib/tours';
import { formatPriceJPY, formatPriceRange } from '@/lib/tours';
import { useBooking } from '@/context/BookingContext';
import { useTranslations, useLocale } from 'next-intl';

interface TourDetailClientProps {
    tour: Tour;
    otherTours: Tour[];
}

function AccordionItem({ question, answer }: TourFaq) {
    const [open, setOpen] = useState(false);
    const [hovered, setHovered] = useState(false);
    return (
        <div 
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ 
            backgroundColor: '#ffffff',
            border: '1px solid',
            borderColor: hovered ? '#d49a36' : '#e0d8c8',
            borderRadius: '8px',
            boxShadow: hovered ? '0 6px 20px rgba(0,0,0,0.06)' : '0 4px 15px rgba(0,0,0,0.03)',
            marginBottom: '1.5rem',
            transition: 'all 0.3s ease',
            transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
            overflow: 'hidden'
          }}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    width: '100%',
                    padding: '1.5rem 2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '17px',
                    fontWeight: '500',
                    color: '#1C1917'
                }}
            >
                {question}
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#d49a36" strokeWidth="2.5"
                    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', flexShrink: 0 }}>
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>
            <div style={{ 
              maxHeight: open ? '1000px' : '0', 
              overflow: 'hidden', 
              transition: 'all 0.5s ease',
              padding: open ? '0 2rem 2rem 2rem' : '0 2rem'
            }}>
                <p style={{
                    margin: 0,
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '16px',
                    lineHeight: '1.7',
                    color: '#2C2420',
                    fontWeight: '400'
                }}>
                    {answer}
                </p>
            </div>
        </div>
    );
}

function ItineraryItem({ day, last }: { day: Tour['itinerary'][0]; last: boolean }) {
    const [open, setOpen] = useState(false);
    const [hovered, setHovered] = useState(false);
    return (
        <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '32px',
            position: 'relative',
            marginBottom: last ? '0' : '1.5rem'
        }}>
            <div style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 2,
            }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#d49a36',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '13px',
                    fontWeight: '600',
                    flexShrink: 0,
                    boxShadow: 'none',
                    marginTop: '1.5rem' // Align with card header center
                }}>{day.dayNumber}</div>
            </div>
            
            <div 
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                flex: 1,
                backgroundColor: '#FFFFFF',
                border: '1px solid',
                borderColor: hovered ? '#d49a36' : '#e0d8c8',
                borderRadius: '8px',
                boxShadow: hovered ? '0 6px 20px rgba(0,0,0,0.06)' : '0 4px 15px rgba(0,0,0,0.03)',
                transition: 'all 0.3s ease',
                transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                overflow: 'hidden'
            }}>
                <button 
                  onClick={() => setOpen(!open)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: '1.5rem 2rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                }}>
                    <span style={{
                        fontFamily: "'Jost', Arial, sans-serif",
                        fontSize: '18px',
                        fontWeight: '500',
                        color: '#1C1917',
                        letterSpacing: '0.02em'
                    }}>Day {day.dayNumber}: {day.title}</span>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#d49a36" strokeWidth="2.5"
                        style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', flexShrink: 0 }}>
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>
                <div style={{ 
                  maxHeight: open ? '1000px' : '0', 
                  overflow: 'hidden', 
                  transition: 'all 0.5s ease',
                  padding: open ? '0 2rem 2rem 2rem' : '0 2rem'
                }}>
                    <p style={{
                        margin: 0,
                        fontFamily: "'Jost', Arial, sans-serif",
                        fontSize: '16px',
                        lineHeight: '1.7',
                        color: '#2C2420',
                        fontWeight: '400'
                    }}>{day.details}</p>
                </div>
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

function HighlightCard({ index, text }: { index: number; text: string }) {
  const [hovered, setHovered] = React.useState(false);
  const num = String(index + 1).padStart(2, '0');
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '1.5rem',
        backgroundColor: '#FFFFFF',
        border: '1px solid #eaeaea',
        borderColor: hovered ? '#d49a36' : '#eaeaea',
        borderRadius: '4px',
        cursor: 'default',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 8px 24px rgba(26,25,24,0.06)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}
    >
      <span style={{
        fontFamily: "'Jost', Arial, sans-serif",
        fontSize: '12px', fontWeight: '600', color: '#d49a36',
        letterSpacing: '0.1em'
      }}>{num}</span>
      <p style={{
        fontFamily: "'Jost', Arial, sans-serif",
        fontSize: '16px', color: '#1a1918', margin: 0,
        lineHeight: '1.5',
        fontWeight: '400'
      }}>{text}</p>
    </div>
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
    const locale = useLocale();
    const [activeTab, setActiveTab] = useState('Overview');

    const handleBook = () => openBooking(tour.slug);

    const daysLeftStr = getTranslationForDaysLeft(tour.startDate, t);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(tour.startDate);
    start.setHours(0, 0, 0, 0);
    const isPast = start <= today;
    const showComingSoon = !isPast && tour.isComingSoon;

    const dateOptions: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };

    // Always provide a non-empty src — empty string causes React to re-fetch the page
    const heroSrc = tour.coverImage ||
        `https://placehold.co/1400x600/1c2331/ffffff?text=${encodeURIComponent(tour.title)}`;

    return (
  <>

    {/* ══ HERO — keep existing hero panel exactly as is ══ */}
    <div style={{
      position: 'relative',
      width: '100%',
      height: '75vh',
      minHeight: '500px',
      overflow: 'hidden'
    }}>
      <img
        src={heroSrc}
        alt={tour.title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block'
        }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src =
            `https://placehold.co/1400x600/1c2331/ffffff?text=${encodeURIComponent(tour.title)}`;
        }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(3,2,1,0.6) 0%, rgba(3,2,1,0.15) 50%, rgba(3,2,1,0.0) 100%)'
      }}/>
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        zIndex: 10,
        backgroundColor: 'rgba(8,5,3,0.85)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(201,147,58,0.5)',
        borderLeft: '3px solid #C9933A',
        padding: '0 60px',
        display: 'inline-block',
        maxWidth: '850px',
        minWidth: '480px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '18px',
          paddingBottom: '10px',
          borderBottom: '1px solid rgba(201,147,58,0.15)'
        }}>
          <span style={{
            fontFamily: "'Jost', Arial, sans-serif",
            fontSize: '12px',
            fontWeight: '500',
            letterSpacing: '0.28em',
            color: '#C9933A',
            textTransform: 'uppercase'
          }}>{tour.category}</span>
          <span style={{
            fontFamily: "'Jost', Arial, sans-serif",
            fontSize: '11px',
            fontWeight: '400',
            letterSpacing: '0.22em',
            color: '#9A948F',
            textTransform: 'uppercase'
          }}>
            {new Date(tour.startDate).toLocaleString('en', { month: 'long' }).toUpperCase()}{' '}
            {new Date(tour.startDate).getFullYear()}
          </span>
        </div>
        <div style={{ padding: '16px 0 8px 0' }}>
          <h1 style={{
            fontFamily: "'Jost', Arial, sans-serif",
            fontSize: 'clamp(34px, 4.5vw, 58px)',
            fontWeight: '500',
            color: '#FFFFFF',
            letterSpacing: '0.04em',
            lineHeight: '1.2',
            margin: '0 0 10px 0'
          }}>{tour.title}</h1>
          {tour.shortDescription && (
            <p style={{
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: 'clamp(15px, 1.4vw, 18px)',
              fontWeight: '300',
              color: 'rgba(200,194,188,0.9)',
              letterSpacing: '0.02em',
              lineHeight: '1.7',
              margin: '0',
              maxWidth: '640px',
              display: 'block'
            }}>
              {(() => {
                const text = tour.shortDescription || '';
                if (text.length <= 140) return text;
                const sentenceEnd = text.search(/[.!?]/);
                if (sentenceEnd > 40 && sentenceEnd < 180) {
                  return text.substring(0, sentenceEnd + 1);
                }
                const truncated = text.substring(0, 140);
                const lastSpace = truncated.lastIndexOf(' ');
                return truncated.substring(0, lastSpace) + '…';
              })()}
            </p>
          )}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          paddingTop: '10px',
          paddingBottom: '18px',
          borderTop: '1px solid rgba(201,147,58,0.15)',
          gap: '0'
        }}>
          <span style={{
            fontFamily: "'Jost', Arial, sans-serif",
            fontSize: '14px',
            fontWeight: '400',
            color: '#C8C2BC',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap'
          }}>
            {showComingSoon && tour.dateDisplay
              ? tour.dateDisplay.toUpperCase()
              : `${new Date(tour.startDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })} — ${new Date(tour.endDate).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}`
            }
          </span>
          <span style={{
            display: 'inline-block', width: '4px', height: '4px',
            borderRadius: '50%', backgroundColor: 'rgba(201,147,58,0.45)',
            margin: '0 16px', flexShrink: 0
          }}/>
          <span style={{
            fontFamily: "'Jost', Arial, sans-serif",
            fontSize: '14px', fontWeight: '400',
            color: '#C8C2BC', letterSpacing: '0.08em',
            textTransform: 'uppercase', whiteSpace: 'normal',
            lineHeight: '1.4'
          }}>
            {tour.location?.toUpperCase()}
          </span>
          <span style={{
            display: 'inline-block', width: '4px', height: '4px',
            borderRadius: '50%', backgroundColor: 'rgba(201,147,58,0.45)',
            margin: '0 16px', flexShrink: 0
          }}/>
          {!isPast && (
            <span style={{
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: '10px', fontWeight: '600',
              letterSpacing: '0.18em', color: '#1C1917',
              backgroundColor: '#C9933A',
              padding: '4px 14px', textTransform: 'uppercase',
              whiteSpace: 'nowrap', flexShrink: 0
            }}>
              {tour.seatsLeft} SEATS LEFT
            </span>
          )}
        </div>
      </div>
    </div>

    {/* ══ BREADCRUMB ══ */}
    <div style={{
      backgroundColor: '#F0EDE6',
      padding: '12px 60px',
      borderBottom: '1px solid #E8E4DC'
    }}>
      <nav style={{
        fontFamily: "'Jost', Arial, sans-serif",
        fontSize: '12px', color: '#9A948F',
        letterSpacing: '0.08em',
        display: 'flex', gap: '8px', alignItems: 'center'
      }}>
        <Link href="/" style={{ color: '#9A948F', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#C9933A' }}>›</span>
        <Link href="/tours" style={{ color: '#9A948F', textDecoration: 'none' }}>Tours</Link>
        <span style={{ color: '#C9933A' }}>›</span>
        <span style={{ color: '#1C1917' }}>{tour.title}</span>
      </nav>
    </div>

    {/* ══ TWO-COLUMN MASTER CONTAINER ══ */}
    <div style={{ backgroundColor: '#faf9f6' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <section className="main-tour-details">
          
          {/* LEFT COLUMN: Content Area (Tabbed Interface) */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(28,25,23,0.03)',
            padding: '2rem'
          }}>
            {/* TAB BAR */}
            <div style={{
              display: 'flex', gap: '32px',
              borderBottom: '1px solid #E8E4DC',
              marginBottom: '48px',
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }}>
              {['Overview', 'Itinerary', 'Included/Not Included', 'FAQ'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '14px', fontWeight: '600',
                    color: activeTab === tab ? '#1a1918' : '#9A948F',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '12px 0 16px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: activeTab === tab ? '2px solid #d49a36' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB CONTENTS */}
            {activeTab === 'Overview' && (
              <div style={{ animation: 'fadeIn 0.5s ease' }}>
                {/* HIGHLIGHTS */}
                {(tour.features ?? []).length > 0 && (
                  <>
                    <h2 style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 'clamp(28px, 3vw, 36px)',
                      fontWeight: '500', color: '#1a1918',
                      marginBottom: '24px'
                    }}>{t('highlights')}</h2>
                    <p style={{
                      fontFamily: "'Jost', Arial, sans-serif",
                      fontSize: '16px', lineHeight: '1.7',
                      color: '#1a1918', marginBottom: '32px',
                      fontWeight: '400'
                    }}>{tour.shortDescription}</p>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '24px',
                      marginBottom: '64px'
                    }}>
                      {(tour.features ?? []).map((feature, i) => (
                        <HighlightCard key={i} index={i} text={feature} />
                      ))}
                    </div>
                  </>
                )}

                {/* ABOUT THIS TOUR */}
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(28px, 3vw, 36px)',
                  fontWeight: '500', color: '#1a1918',
                  marginBottom: '24px'
                }}>{t('aboutTour')}</h2>
                {tour.longDescription?.split('\n\n').map((para, i) => (
                  <p key={i} style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '16px', lineHeight: '1.7',
                    color: '#1a1918', marginBottom: '20px',
                    fontWeight: '400'
                  }}>{para}</p>
                ))}

                <hr style={{ border: 'none', borderTop: '1px solid #eaeaea', margin: '3rem 0' }} />

                {/* WHAT TO EXPECT */}
                {(tour.whatToExpect ?? []).length > 0 && (
                  <>
                    <h3 style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: '24px', fontWeight: '500',
                      color: '#1a1918', letterSpacing: '0.05em',
                      marginTop: '40px', marginBottom: '20px'
                    }}>{t('whatToExpect')}</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {(tour.whatToExpect ?? []).map((item, i) => (
                        <li key={i} style={{
                          display: 'flex', alignItems: 'flex-start',
                          gap: '14px', marginBottom: '14px',
                          fontFamily: "'Jost', Arial, sans-serif",
                          fontSize: '16px', color: '#1a1918', lineHeight: '1.7',
                          fontWeight: '400'
                        }}>
                          <span style={{ color: '#d49a36', fontSize: '16px', flexShrink: 0, marginTop: '3px' }}>✦</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {/* GALLERY */}
                {(tour.galleryImages ?? []).length > 0 && (
                  <div style={{ marginTop: '64px' }}>
                    <h2 style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 'clamp(28px, 3vw, 36px)',
                      fontWeight: '500', color: '#1a1918',
                      marginBottom: '32px'
                    }}>{t('photoGallery')}</h2>
                    <Gallery images={tour.galleryImages ?? []} tourTitle={tour.title} />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Itinerary' && (
              <div style={{ animation: 'fadeIn 0.5s ease' }}>
                <div style={{ position: 'relative', marginTop: '16px' }}>
                  <div style={{
                    position: 'absolute', top: '16px', bottom: '16px', left: '15px',
                    width: '2px', backgroundColor: '#d49a36', zIndex: 1
                  }} />
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    {(tour.itinerary ?? []).map((day, i) => (
                      <ItineraryItem
                        key={day.dayNumber}
                        day={day}
                        last={i === (tour.itinerary ?? []).length - 1}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Included/Not Included' && (
              <div style={{ animation: 'fadeIn 0.5s ease' }}>
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem'
                  }}>
                    {/* INCLUDED COLUMN */}
                    <div>
                      <h3 style={{
                        fontFamily: "'Jost', Arial, sans-serif", fontSize: '14px', fontWeight: '600',
                        color: '#1a1918', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px',
                        paddingBottom: '12px', borderBottom: '2px solid #d49a36'
                      }}>INCLUDED</h3>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {[
                          "Return airport transfers",
                          "6 nights accommodation (4-star hotel)",
                          "All breakfasts and all listed dining experiences",
                          "Japanese-speaking food guide",
                          "Workshop materials and recipe cards in Japanese",
                          "Air-conditioned local transport"
                        ].map((item, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '16px', fontFamily: "'Jost', Arial, sans-serif", fontSize: '16px', color: '#1a1918', lineHeight: '1.7' }}>
                            <span style={{ color: '#d49a36', fontSize: '18px', flexShrink: 0 }}>✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* NOT INCLUDED COLUMN */}
                    <div>
                      <h3 style={{
                        fontFamily: "'Jost', Arial, sans-serif", fontSize: '14px', fontWeight: '600',
                        color: '#1a1918', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px',
                        paddingBottom: '12px', borderBottom: '2px solid #d49a36'
                      }}>NOT INCLUDED</h3>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {[
                          "International Flights",
                          "Travel Insurance",
                          "Personal beverage orders outside program",
                          "Any food not listed in the daily program"
                        ].map((item, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '16px', fontFamily: "'Jost', Arial, sans-serif", fontSize: '16px', color: '#6B6560', lineHeight: '1.7' }}>
                            <span style={{ color: '#9A948F', fontSize: '18px', flexShrink: 0 }}>×</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
              </div>
            )}

            {activeTab === 'FAQ' && (
              <div style={{ animation: 'fadeIn 0.5s ease' }}>
                {(tour.faq ?? []).length > 0 ? (
                  <div>
                    {(tour.faq ?? []).map((f, i) => (
                      <AccordionItem key={i} {...f} />
                    ))}
                  </div>
                ) : (
                  <p style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '16px', color: '#6B6560', lineHeight: '1.7' }}>
                    No FAQs available for this tour.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sticky Booking Widget (ONLY ON OVERVIEW) */}
          {activeTab === 'Overview' && (
            <div className="tour-sticky-widget" style={{ marginTop: '4rem' }}>
              <div style={{
                backgroundColor: '#1a1918',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                padding: '2rem',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '2rem'
              }}>
                {/* LEFT SIDE: Info Box */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{
                    fontFamily: "'Jost', Inter, Lato, sans-serif",
                    fontSize: 'clamp(28px, 3vw, 36px)',
                    fontWeight: '400', color: '#d49a36',
                    lineHeight: '1'
                  }}>
                    {tour.priceRangeJPY ? formatPriceRange(tour.priceRangeJPY) : formatPriceJPY(tour.priceJPY)}
                    <span style={{
                      fontFamily: "'Jost', Arial, sans-serif",
                      fontSize: '13px', color: '#cccccc', marginLeft: '6px',
                      fontWeight: '400', letterSpacing: '0.05em'
                    }}>per person</span>
                  </div>
                  
                  <p style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '14px', color: '#faf9f6', margin: 0,
                    fontWeight: '400'
                  }}>
                    {new Date(tour.startDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })} – {new Date(tour.endDate).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>

                  {!isPast && tour.seatsLeft > 0 && (
                    <div style={{
                      display: 'inline-block',
                      backgroundColor: 'rgba(212, 154, 54, 0.15)',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      alignSelf: 'flex-start'
                    }}>
                      <span style={{
                        fontFamily: "'Jost', Arial, sans-serif",
                        fontSize: '11px', fontWeight: '600',
                        color: '#d49a36', letterSpacing: '0.08em',
                        textTransform: 'uppercase'
                      }}>
                        {tour.seatsLeft} Seats Left
                      </span>
                    </div>
                  )}
                </div>

                {/* RIGHT SIDE: Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={handleBook}
                    disabled={isPast}
                    style={{
                      fontFamily: "'Jost', Arial, sans-serif",
                      fontSize: '12px', fontWeight: '600',
                      letterSpacing: '0.15em', color: '#1a1918',
                      backgroundColor: isPast ? '#9A948F' : '#d49a36',
                      border: 'none', padding: '14px 24px',
                      textTransform: 'uppercase',
                      cursor: isPast ? 'not-allowed' : 'pointer',
                      transition: 'opacity 0.3s ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isPast ? t('bookingClosed') : tButtons('bookNow')}
                  </button>
                  <Link
                    href="/contact"
                    style={{
                      fontFamily: "'Jost', Arial, sans-serif",
                      fontSize: '11px', fontWeight: '600',
                      letterSpacing: '0.15em', color: '#d49a36',
                      backgroundColor: 'transparent',
                      border: '1px solid #d49a36',
                      padding: '13px 24px',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      display: 'block', textAlign: 'center',
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {tButtons('contactUs')}
                  </Link>
                </div>
              </div>
            </div>
          )}

        </section>
      </div>
    </div>

    {/* ══ SECTION 8 — OTHER TOURS ivory ══ */}
    {otherTours.length > 0 && (
      <div style={{
        backgroundColor: '#FAFAF7',
        padding: '72px 60px'
      }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(28px, 3vw, 42px)',
            fontWeight: '500', color: '#1C1917',
            letterSpacing: '0.06em', marginBottom: '8px'
          }}>{t('otherUpcomingTours')}</h2>
          <div style={{
            width: '48px', height: '1px',
            backgroundColor: '#C9933A', marginBottom: '36px'
          }}/>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '28px'
          }}>
            {otherTours.map(tOther => (
              <Link
                href={`/tours/${tOther.slug}`}
                key={tOther.id}
                style={{
                  display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E8E4DC',
                  overflow: 'hidden',
                  transition: 'border-color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#C9933A';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#E8E4DC';
                }}
              >
                <img
                  src={tOther.coverImage ||
                    `https://placehold.co/400x220/1c2331/ffffff?text=${encodeURIComponent(tOther.title)}`}
                  alt={tOther.title}
                  style={{
                    width: '100%', height: 'auto', aspectRatio: '16/9',
                    objectFit: 'cover', display: 'block'
                  }}
                />
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <span style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '11px', fontWeight: '500',
                    letterSpacing: '0.22em', color: '#C9933A',
                    textTransform: 'uppercase'
                  }}>{tOther.category}</span>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '20px', fontWeight: '500',
                    color: '#1C1917', margin: '8px 0 10px',
                    lineHeight: '1.3'
                  }}>{tOther.title}</p>
                  <p style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '15px', color: '#C9933A',
                    fontWeight: '400', marginTop: 'auto'
                  }}>
                    {t('from')} {formatPriceJPY(tOther.priceJPY)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    )}

  </>
);
}
