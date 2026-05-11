'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Tour, TourFaq } from '@/lib/tours';
import { formatPriceJPY, formatPriceRange } from '@/lib/tours';
import { useBooking } from '@/context/BookingContext';
import { useTranslations, useLocale } from 'next-intl';
import { urlForImage } from '@/sanity/lib/image';

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

function ItineraryItem({ 
  day, 
  last 
}: { 
  day: Tour['itinerary'][0]; 
  last: boolean 
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('Home');

  const dayImageUrl = (() => {
    if (!day.image) return null;
    if (typeof day.image === 'string') return day.image;
    try {
      const url = urlForImage(day.image)?.url();
      return url || null;
    } catch {
      return (day.image as any)?.asset?.url || null;
    }
  })();

  return (
    <div style={{
      marginBottom: '2px',
      border: '1px solid #E8E4DC',
      backgroundColor: open 
        ? 'rgba(201,147,58,0.06)' 
        : '#FFFFFF',
      transition: 'background-color 0.3s ease'
    }}>
      {/* HEADER ROW */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '20px 24px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: open ? '#C9933A' : 'transparent',
          border: `2px solid #C9933A`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.3s ease'
        }}>
          <span style={{
            fontFamily: "'Jost', Arial, sans-serif",
            fontSize: '13px',
            fontWeight: '600',
            color: open ? '#1C1917' : '#C9933A',
            transition: 'color 0.3s ease'
          }}>
            {day.dayNumber}
          </span>
        </div>

        <span style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '20px',
          fontWeight: '500',
          color: '#1C1917',
          letterSpacing: '0.03em',
          flex: 1,
          textAlign: 'left'
        }}>
          {t('day')} {day.dayNumber}: {day.title}
        </span>

        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="#C9933A"
          strokeWidth="2"
          style={{
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* EXPANDED CONTENT */}
      {open && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: dayImageUrl ? '1fr 1fr' : '1fr',
          borderTop: '1px solid rgba(201,147,58,0.15)',
          minHeight: '320px'
        }}>
          {/* LEFT — Image */}
          {dayImageUrl && (
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              minHeight: '320px'
            }}>
              <img
                src={dayImageUrl}
                alt={`Day ${day.dayNumber}: ${day.title}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                background: 'linear-gradient(to top, rgba(10,8,7,0.8) 0%, transparent 60%)',
                padding: '24px 20px 16px'
              }}>
                <span style={{
                  fontFamily: "'Jost', Arial, sans-serif",
                  fontSize: '10px',
                  fontWeight: '500',
                  letterSpacing: '0.22em',
                  color: '#C9933A',
                  textTransform: 'uppercase'
                }}>
                  Day {day.dayNumber}
                </span>
              </div>
            </div>
          )}

          {/* RIGHT — Text */}
          <div style={{
            padding: '36px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#FAFAF7'
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '19px',
              fontWeight: '400',
              color: '#2C2420',
              lineHeight: '1.9',
              margin: '0'
            }}>
              {day.details}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Gallery({ images, tourTitle }: { 
  images: string[]; 
  tourTitle: string 
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const goNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % images.length);
  };
  const goPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      (lightboxIndex - 1 + images.length) % images.length
    );
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex]);

  if (images.length === 0) return null;

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '8px'
      }}>
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => openLightbox(i)}
            style={{
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              overflow: 'hidden',
              height: '180px',
              position: 'relative',
              backgroundColor: '#1C1917'
            }}
          >
            <img
              src={src}
              alt={`${tourTitle} — photo ${i + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.4s ease'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
              }}
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5,3,2,0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'none',
              border: '1px solid rgba(201,147,58,0.4)',
              color: '#F5F1EB',
              fontSize: '20px',
              width: '44px',
              height: '44px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000,
              transition: 'border-color 0.3s ease'
            }}
          >✕</button>

          {/* Image counter */}
          <div style={{
            position: 'absolute',
            top: '28px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'Jost', Arial, sans-serif",
            fontSize: '12px',
            fontWeight: '400',
            letterSpacing: '0.18em',
            color: '#9A948F'
          }}>
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Left arrow */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              style={{
                position: 'absolute',
                left: '24px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(28,25,23,0.8)',
                border: '1px solid rgba(201,147,58,0.3)',
                color: '#F5F1EB',
                fontSize: '20px',
                width: '52px',
                height: '52px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                transition: 'border-color 0.3s ease, background 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#C9933A';
                e.currentTarget.style.background = 'rgba(201,147,58,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201,147,58,0.3)';
                e.currentTarget.style.background = 'rgba(28,25,23,0.8)';
              }}
            >←</button>
          )}

          {/* Main image */}
          <img
            src={images[lightboxIndex]}
            alt={`${tourTitle} — photo ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '88vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              display: 'block',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)'
            }}
          />

          {/* Right arrow */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              style={{
                position: 'absolute',
                right: '24px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(28,25,23,0.8)',
                border: '1px solid rgba(201,147,58,0.3)',
                color: '#F5F1EB',
                fontSize: '20px',
                width: '52px',
                height: '52px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                transition: 'border-color 0.3s ease, background 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#C9933A';
                e.currentTarget.style.background = 'rgba(201,147,58,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201,147,58,0.3)';
                e.currentTarget.style.background = 'rgba(28,25,23,0.8)';
              }}
            >→</button>
          )}

          {/* Thumbnail strip at bottom */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '6px',
            padding: '8px 12px',
            backgroundColor: 'rgba(10,8,7,0.7)',
            backdropFilter: 'blur(8px)',
            maxWidth: '80vw',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}>
            {images.map((src, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(i);
                }}
                style={{
                  width: '48px',
                  height: '36px',
                  flexShrink: 0,
                  overflow: 'hidden',
                  border: i === lightboxIndex
                    ? '2px solid #C9933A'
                    : '2px solid transparent',
                  cursor: 'pointer',
                  padding: 0,
                  background: 'none',
                  transition: 'border-color 0.2s ease'
                }}
              >
                <img
                  src={src}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </button>
            ))}
          </div>
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
          objectPosition: 'top',
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
            {new Date(tour.startDate).toLocaleString('en', 
              { month: 'long' }).toUpperCase()}{' '}
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
      {(tour.galleryImages ?? []).length > 0 && (
        <div style={{
          position: 'absolute',
          top: '80px',
          right: '32px',
          zIndex: 50
        }}>
          <button
            onClick={() => {
              const gallerySection = document.getElementById('gallery-section');
              if (gallerySection) {
                const offset = gallerySection.offsetTop - 100;
                window.scrollTo({ top: offset, behavior: 'smooth' });
              }
            }}
            style={{
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: '16px',
              fontWeight: '600',
              letterSpacing: '0.22em',
              color: '#1C1917',
              backgroundColor: '#C9933A',
              border: '2px solid #C9933A',
              padding: '18px 36px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1C1917';
              e.currentTarget.style.color = '#C9933A';
              e.currentTarget.style.borderColor = '#C9933A';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#C9933A';
              e.currentTarget.style.color = '#1C1917';
              e.currentTarget.style.borderColor = '#C9933A';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" 
                 fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M3 9h18M9 21V9"/>
            </svg>
            ALL PHOTOS
          </button>
        </div>
      )}
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
                  <section id="gallery-section" style={{ marginTop: '64px' }}>
                    <h2 style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 'clamp(28px, 3vw, 36px)',
                      fontWeight: '500', color: '#1a1918',
                      marginBottom: '32px'
                    }}>{t('photoGallery')}</h2>
                    <Gallery 
                      images={(tour.galleryImages ?? []).map((img: any) => {
                        if (!img) return null;
                        if (typeof img === 'string') return img;
                        try {
                          return urlForImage(img)?.url() ?? null;
                        } catch {
                          return img?.asset?.url ?? null;
                        }
                      }).filter((url): url is string => Boolean(url))}
                      tourTitle={tour.title} 
                    />
                  </section>
                )}
              </div>
            )}

            {activeTab === 'Itinerary' && (
              <div style={{ 
                animation: 'fadeIn 0.5s ease',
                backgroundColor: '#FAFAF7',
                padding: '72px 60px'
              }}>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(30px, 3.2vw, 46px)',
                  fontWeight: '500',
                  color: '#1C1917',
                  marginBottom: '8px'
                }}>{t('itinerary')}</h2>
                <p style={{
                  fontFamily: "'Jost', Arial, sans-serif",
                  fontStyle: 'italic',
                  fontSize: '16px',
                  color: '#6B6560',
                  marginBottom: '40px'
                }}>Experience the journey, day by day.</p>
                
                <div style={{ position: 'relative' }}>
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
                key={tOther._id || tOther.slug}
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
