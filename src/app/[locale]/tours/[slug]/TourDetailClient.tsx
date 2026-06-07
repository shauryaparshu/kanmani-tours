'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@/i18n/routing';
import type { Tour, TourFaq } from '@/lib/tours';
import { useTranslations, useLocale } from 'next-intl';
import { cardImageUrl, galleryImageUrl } from '@/sanity/lib/image';
import LazyImage from '@/components/ui/LazyImage';

interface TourDetailClientProps {
    tour: Tour;
    otherTours: Tour[];
}

type DetailTab = 'overview' | 'itinerary' | 'included' | 'faq';

type CategoryTranslator = (key: string) => string;
type ImageWithAssetUrl = { asset?: { url?: string } };

const CATEGORY_TRANSLATION_KEYS: Record<string, string> = {
  Cultural: 'cultureTours',
  Food: 'foodTours',
  Celebrity: 'celebrityTours',
  Education: 'educationTours',
  Industrial: 'industrialTours',
  Ayurveda: 'ayurvedaTours',
  Village: 'villageTours',
  Cooking: 'cookingClasses',
  Homestay: 'homestay',
  Temple: 'templeTours',
  Short: 'shortTours',
};

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
  const [open, setOpen] = useState(true);
  const t = useTranslations('Home');

  const dayImageUrl = (() => {
    if (!day.image) return null;
    if (typeof day.image === 'string') return day.image;
    try {
      const url = cardImageUrl(day.image);
      return url || null;
    } catch {
      return (day.image as ImageWithAssetUrl)?.asset?.url || null;
    }
  })();

  const dayLqip = (() => {
    if (!day.image || typeof day.image === 'string') return undefined;
    return (day.image as any)?.asset?.metadata?.lqip;
  })();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '32px',
      position: 'relative',
      marginBottom: last ? '0' : '20px'
    }}>
      {/* LEFT — Timeline Graphic Column */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        flexShrink: 0,
        width: '36px',
        alignSelf: 'stretch' // Fix: Dynamically stretch this container to full content height
      }}>
        {/* Number Circle */}
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: '#D49A36',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Jost', Arial, sans-serif",
          fontSize: '13px',
          fontWeight: '600',
          zIndex: 3,
          marginTop: '24px'
        }}>
          {day.dayNumber}
        </div>

        {/* Persistent connector line */}
        {!last && (
          <div style={{
            position: 'absolute',
            top: '42px', 
            bottom: '-44px', // Fix: bridges the full 20px gap plus 24px next-margin for total overlap
            width: '2px',
            backgroundColor: '#D49A36',
            zIndex: 1
          }}/>
        )}
      </div>

      {/* RIGHT — Main Accordion Content Container */}
      <div style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        border: '1px solid #E8E4DC',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(28,25,23,0.02)',
        transition: 'background-color 0.3s ease'
      }}>
        {/* ACCORDION HEADER ROW */}
        <button
          onClick={() => setOpen(!open)}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '26px 32px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <span style={{
            fontFamily: "'Jost', Arial, sans-serif",
            fontSize: '22px',
            fontWeight: '500',
            color: '#1C1917',
            letterSpacing: '0.02em'
          }}>
            {t('day')} {day.dayNumber}: {day.title}
          </span>

          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="#D49A36"
            strokeWidth="2.5"
            style={{
              flexShrink: 0,
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {/* EXPANDED CONTENT Split Grid */}
        {open && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: dayImageUrl ? '1fr 1fr' : '1fr',
            borderTop: '1px solid rgba(232,228,220,0.6)',
            minHeight: '320px'
          }}>
            {/* LEFT HALF — Image */}
            {dayImageUrl && (
              <div style={{
                position: 'relative',
                overflow: 'hidden',
                minHeight: '320px'
              }}>
                <LazyImage
                  src={dayImageUrl}
                  alt={`${t('day')} ${day.dayNumber}: ${day.title}`}
                  lqip={dayLqip}
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
                    {t('day')} {day.dayNumber}
                  </span>
                </div>
              </div>
            )}

            {/* RIGHT HALF — Details Text */}
            <div style={{
              padding: '36px 40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              backgroundColor: '#FAFAF7'
            }}>
              <p style={{
                fontFamily: "'Jost', Arial, sans-serif",
                fontSize: '20px',
                fontWeight: '400',
                color: '#111111',
                lineHeight: '1.9',
                margin: '0'
              }}>
                {day.details}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Gallery({ images, tourTitle }: { 
  images: { url: string; lqip?: string }[]; 
  tourTitle: string 
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isHoveringLightbox, setIsHoveringLightbox] = useState(false);
  const lightboxTimerRef = useRef<number | null>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsHoveringLightbox(false);
  };
  const closeLightbox = () => {
    setLightboxIndex(null);
    setIsHoveringLightbox(false);
    if (lightboxTimerRef.current !== null) {
      window.clearTimeout(lightboxTimerRef.current);
      lightboxTimerRef.current = null;
    }
  };
  const goNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(prev => (prev === null ? prev : (prev + 1) % images.length));
  };
  const goPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(prev => (prev === null ? prev : (prev - 1 + images.length) % images.length));
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

  useEffect(() => {
    if (lightboxIndex === null || images.length <= 1 || isHoveringLightbox) {
      if (lightboxTimerRef.current !== null) {
        window.clearTimeout(lightboxTimerRef.current);
        lightboxTimerRef.current = null;
      }
      return;
    }

    lightboxTimerRef.current = window.setTimeout(() => {
      setLightboxIndex(prev => (prev === null ? prev : (prev + 1) % images.length));
    }, 5000);

    return () => {
      if (lightboxTimerRef.current !== null) {
        window.clearTimeout(lightboxTimerRef.current);
        lightboxTimerRef.current = null;
      }
    };
  }, [lightboxIndex, images.length, isHoveringLightbox]);

  if (images.length === 0) return null;

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '8px'
      }}>
        {images.map((imgData, i) => (
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
            <LazyImage
              src={imgData.url}
              lqip={imgData.lqip}
              alt={`${tourTitle} — photo ${i + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.4s ease'
              }}
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          onClick={closeLightbox}
          onMouseEnter={() => setIsHoveringLightbox(true)}
          onMouseLeave={() => setIsHoveringLightbox(false)}
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
            top: '18px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'Jost', Arial, sans-serif",
            fontSize: 'clamp(18px, 2vw, 26px)',
            fontWeight: '600',
            letterSpacing: '0.2em',
            color: '#FFF7E8',
            background: 'linear-gradient(180deg, rgba(33,25,19,0.9), rgba(10,8,7,0.76))',
            border: '1px solid rgba(201,147,58,0.3)',
            padding: '8px 16px',
            borderRadius: '999px',
            minWidth: '96px',
            textAlign: 'center',
            boxShadow: '0 14px 28px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.08)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}>
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Preload adjacent images */}
          {images.length > 1 && (
            <div style={{ display: 'none' }}>
              <img src={images[(lightboxIndex + 1) % images.length].url} alt="" />
              <img src={images[(lightboxIndex - 1 + images.length) % images.length].url} alt="" />
            </div>
          )}

          {/* Main image */}
          <div
            key={lightboxIndex}
            style={{
              marginTop: '44px',
              width: '72vw',
              height: '85vh',
              maxWidth: '72vw',
              maxHeight: '85vh',
              animation: 'premiumLightboxFade 760ms cubic-bezier(0.16, 1, 0.3, 1) both',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid rgba(255,255,255,0.92)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.32), 0 0 24px rgba(255,255,255,0.16), 0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.02)'
            }}
          >
            <img
              src={images[lightboxIndex].url}
              alt={`${tourTitle} — photo ${lightboxIndex + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>

          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '6px',
            padding: '0px 12px 8px 12px',
            backgroundColor: 'transparent',
            height: '130px',
            maxWidth: '80vw',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            pointerEvents: 'none'
          }}>
            {images.map((imgData, i) => (
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
                  position: 'relative',
                  overflow: 'hidden',
                  border: i === lightboxIndex
                    ? '2px solid #C9933A'
                    : '2px solid transparent',
                  cursor: 'pointer',
                  padding: 0,
                  backgroundColor: '#000000',
                  transition: 'all 0.2s ease',
                  zIndex: 1,
                  pointerEvents: 'auto',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-36px) scale(3)';
                  e.currentTarget.style.zIndex = '100';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.zIndex = '1';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
                }}
              >
                <img
                  src={imgData.url}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes premiumLightboxFade {
          0% {
            opacity: 0;
            transform: scale(1.08);
            filter: saturate(0.88) brightness(0.86);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            filter: saturate(1) brightness(1);
          }
        }
      `}</style>
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

function getCategoryLabel(category: string, tTours: CategoryTranslator): string {
    const key = CATEGORY_TRANSLATION_KEYS[category];
    return key ? tTours(key) : category;
}

function getLocaleTag(locale: string): string {
    return locale === 'ja' ? 'ja-JP' : 'en-US';
}

function formatMonthYear(date: string, locale: string): string {
    const formatted = new Intl.DateTimeFormat(getLocaleTag(locale), {
        month: 'long',
        year: 'numeric'
    }).format(new Date(date));

    return locale === 'ja' ? formatted : formatted.toUpperCase();
}

function formatDateRangeForLocale(startDate: string, endDate: string, locale: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const localeTag = getLocaleTag(locale);

    const formatOptions: Intl.DateTimeFormatOptions = locale === 'ja'
        ? { year: 'numeric', month: 'long', day: 'numeric' }
        : { month: 'short', day: 'numeric', year: 'numeric' };

    const startFormatted = new Intl.DateTimeFormat(localeTag, formatOptions).format(start);
    const endFormatted = new Intl.DateTimeFormat(localeTag, formatOptions).format(end);

    return `${startFormatted} - ${endFormatted}`;
}

function preserveCaseForLocale(value: string | undefined, locale: string): string {
    if (!value) return '';
    return locale === 'ja' ? value : value.toUpperCase();
}

export default function TourDetailClient({ tour, otherTours }: TourDetailClientProps) {
    const t = useTranslations('Home');
    const tButtons = useTranslations('Buttons');
    const tTours = useTranslations('Tours');
    const tNavigation = useTranslations('Navigation');
    const locale = useLocale();
    const [activeTab, setActiveTab] = useState<DetailTab>('overview');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(tour.startDate);
    start.setHours(0, 0, 0, 0);
    const isPast = start <= today;
    const showComingSoon = !isPast && tour.isComingSoon;

    // Always provide a non-empty src — empty string causes React to re-fetch the page
    const heroSrc = tour.coverImage ||
        `https://placehold.co/1400x600/1c2331/ffffff?text=${encodeURIComponent(tour.title)}`;
    const categoryLabel = getCategoryLabel(tour.category, tTours);
    const heroMonthYear = formatMonthYear(tour.startDate, locale);
    const formattedDateRange = formatDateRangeForLocale(tour.startDate, tour.endDate, locale);
    const displayDateRange = showComingSoon && tour.dateDisplay
        ? preserveCaseForLocale(tour.dateDisplay, locale)
        : formattedDateRange;
    const locationLabel = preserveCaseForLocale(tour.location, locale);
    const seatsLeftLabel = t('seatsLeftPill', { count: tour.seatsLeft });
    const tabs: { key: DetailTab; label: string }[] = [
        { key: 'overview', label: t('overviewTab') },
        { key: 'itinerary', label: t('itinerary') },
        { key: 'included', label: `${t('included')} / ${t('notIncluded')}` },
        { key: 'faq', label: tNavigation('faq') }
    ];

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
      <LazyImage
        src={heroSrc}
        alt={tour.title}
        lqip={tour.coverImageLqip}
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
        right: '0',
        width: '100%',
        zIndex: 10,
        backgroundColor: 'rgba(8,5,3,0.85)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(201,147,58,0.5)',
        padding: '20px 60px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        gap: '24px'
      }}>
        {/* LEFT/CENTER BLOCK: Centered text information */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '8px',
          flex: '1 1 auto',
          minWidth: 0
        }}>
          {/* LINE 1: Title and Category/Seats pill */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            flexWrap: 'wrap',
            gap: '24px'
          }}>
            <h1 style={{
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: 'clamp(22px, 2.5vw, 36px)',
              fontWeight: '500',
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              lineHeight: '1.2',
              margin: '0',
              textAlign: 'center'
            }}>{tour.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{
                fontFamily: "'Jost', Arial, sans-serif",
                fontSize: '11px',
                fontWeight: '500',
                letterSpacing: '0.28em',
                color: '#C9933A',
                textTransform: 'uppercase'
              }}>{categoryLabel}</span>
              {!isPast && (
                <span style={{
                  fontFamily: "'Jost', Arial, sans-serif",
                  fontSize: '10px',
                  fontWeight: '600',
                  letterSpacing: '0.18em',
                  color: '#1C1917',
                  backgroundColor: '#C9933A',
                  padding: '4px 14px',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap'
                }}>{seatsLeftLabel}</span>
              )}
            </div>
          </div>

          {/* LINE 2: Dates, Location, and Short Description */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            width: '100%',
            borderTop: '1px solid rgba(201,147,58,0.15)',
            paddingTop: '8px'
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
              {displayDateRange}
            </span>
            <span style={{
              display: 'inline-block', width: '4px', height: '4px',
              borderRadius: '50%', backgroundColor: 'rgba(201,147,58,0.45)',
              flexShrink: 0
            }}/>
            <span style={{
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: '14px', fontWeight: '400',
              color: '#C8C2BC', letterSpacing: '0.08em',
              textTransform: 'uppercase', whiteSpace: 'nowrap',
              lineHeight: '1.4'
            }}>
              {locationLabel}
            </span>
            {tour.shortDescription && (
              <>
                <span style={{
                  display: 'inline-block', width: '4px', height: '4px',
                  borderRadius: '50%', backgroundColor: 'rgba(201,147,58,0.45)',
                  flexShrink: 0
                }}/>
                <p style={{
                  fontFamily: "'Jost', Arial, sans-serif",
                  fontSize: '14px',
                  fontWeight: '300',
                  color: 'rgba(200,194,188,0.9)',
                  letterSpacing: '0.02em',
                  lineHeight: '1.4',
                  margin: '0',
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {tour.shortDescription}
                </p>
              </>
            )}
          </div>
        </div>

        {/* RIGHT BLOCK: Premium Shiny ALL PHOTOS Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: '0 0 auto'
        }}>
          <button
            onClick={() => {
              const dest = document.getElementById('gallery-section') || document.querySelector('.main-tour-details');
              if (dest) {
                const offset = (dest as HTMLElement).offsetTop - 100;
                window.scrollTo({ top: offset, behavior: 'smooth' });
              }
            }}
            style={{
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: '15px',
              fontWeight: '700',
              letterSpacing: '0.22em',
              color: '#1C1917',
              background: 'linear-gradient(135deg, #FFE082 0%, #C9933A 50%, #A17124 100%)',
              border: '2px solid #FFFFFF',
              borderRadius: '4px',
              padding: '16px 36px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 25px rgba(201, 147, 58, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #FFF8E1 0%, #E5A93C 50%, #B87F2A 100%)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 0 35px rgba(255, 224, 130, 0.95), 0 6px 20px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #FFE082 0%, #C9933A 50%, #A17124 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(201, 147, 58, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" 
                 fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '2px' }}>
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M3 9h18M9 21V9"/>
            </svg>
            ALL PHOTOS
          </button>
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
        fontSize: '15px', color: '#9A948F',
        letterSpacing: '0.08em',
        display: 'flex', gap: '8px', alignItems: 'center'
      }}>
        <Link href="/" style={{ color: '#9A948F', textDecoration: 'none' }}>{tTours('breadcrumbHome')}</Link>
        <span style={{ color: '#C9933A' }}>›</span>
        <Link href="/tours" style={{ color: '#9A948F', textDecoration: 'none' }}>{tTours('breadcrumbTours')}</Link>
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
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '17px', fontWeight: '600',
                    color: activeTab === tab.key ? '#1a1918' : '#9A948F',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '12px 0 16px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: activeTab === tab.key ? '2px solid #d49a36' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENTS */}
            {activeTab === 'overview' && (
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
                      images={(tour.galleryImages ?? [])
                        .map((img) => {
                          if (!img) return null;
                          let url = null;
                          if (typeof img === 'string') {
                            url = img;
                          } else {
                            try {
                              url = galleryImageUrl(img);
                            } catch {
                              url = (img as ImageWithAssetUrl)?.asset?.url ?? null;
                            }
                          }
                          if (!url) return null;
                          const lqip = typeof img !== 'string' ? (img as any)?.asset?.metadata?.lqip : undefined;
                          return { url, lqip };
                        })
                        .filter((item) => item !== null) as { url: string; lqip?: string }[]}
                      tourTitle={tour.title} 
                    />
                  </section>
                )}
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div style={{ 
                animation: 'fadeIn 0.5s ease',
                backgroundColor: '#FAFAF7',
                padding: '72px 60px'
              }}>

                
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

            {activeTab === 'included' && (
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
                      }}>{t('included')}</h3>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {(tour.inclusions ?? []).map((item, i) => (
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
                      }}>{t('notIncluded')}</h3>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {(tour.exclusions ?? []).map((item, i) => (
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

            {activeTab === 'faq' && (
              <div style={{ animation: 'fadeIn 0.5s ease' }}>
                {(tour.faq ?? []).length > 0 ? (
                  <div>
                    {(tour.faq ?? []).map((f, i) => (
                      <AccordionItem key={i} {...f} />
                    ))}
                  </div>
                ) : (
                  <p style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '16px', color: '#6B6560', lineHeight: '1.7' }}>
                    {t('noFaqAvailable')}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sticky Booking Widget (ONLY ON OVERVIEW) */}
          {activeTab === 'overview' && (
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
                  
                  <p style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '14px', color: '#faf9f6', margin: 0,
                    fontWeight: '400'
                  }}>
                    {displayDateRange}
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
                        {seatsLeftLabel}
                      </span>
                    </div>
                  )}
                </div>

                {/* RIGHT SIDE: Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                  }}>{getCategoryLabel(tOther.category, tTours)}</span>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '20px', fontWeight: '500',
                    color: '#1C1917', margin: '8px 0 10px',
                    lineHeight: '1.3'
                  }}>{tOther.title}</p>

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
