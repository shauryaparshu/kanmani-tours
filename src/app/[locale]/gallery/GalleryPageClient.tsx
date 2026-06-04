'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import LazyImage from '@/components/ui/LazyImage';

interface TourGalleryData {
  id: string;
  title: string;
  slug: string;
  category: string;
  startDate: string;
  images: { url: string; lqip?: string }[];
}

interface Props {
  tours: TourGalleryData[];
}

const CATEGORIES = [
  { label: 'All Events', value: 'all' },
  { label: 'Celebrity Tours', value: 'Celebrity' },
  { label: 'Culture Tours', value: 'Cultural' },
  { label: 'Food Tours', value: 'Food' },
  { label: 'Short Tours', value: 'Short' },
  { label: 'Village Tours', value: 'Village' }
];

// ─── Flip Image Card ──────────────────────────────────────────────────────────
interface FlipGalleryCardProps {
  imgData: { url: string; lqip?: string };
  alt: string;
  onClick: () => void;
}

function FlipGalleryCard({ imgData, alt, onClick }: FlipGalleryCardProps) {
  const [frontImg, setFrontImg] = useState<{ url: string; lqip?: string }>(imgData);
  const [backImg, setBackImg] = useState<{ url: string; lqip?: string } | null>(imgData);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const currentVisible = isFlipped ? backImg : frontImg;
    if (!currentVisible || imgData.url === currentVisible.url) return;

    const timer = window.setTimeout(() => {
      if (isFlipped) {
        setFrontImg(imgData);
        setIsFlipped(false);
      } else {
        setBackImg(imgData);
        setIsFlipped(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [imgData, isFlipped, frontImg, backImg]);

  return (
    <div
      onClick={onClick}
      style={{
        aspectRatio: '1 / 1',
        backgroundColor: '#E8E4DC',
        position: 'relative',
        cursor: 'pointer',
        perspective: '1000px',
        overflow: 'visible'
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front Face */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          backgroundColor: '#E8E4DC',
          overflow: 'hidden'
        }}>
          <LazyImage
            src={frontImg.url}
            lqip={frontImg.lqip}
            alt={alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'transform 0.4s ease',
              display: 'block'
            }}
          />
        </div>

        {/* Back Face */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          backgroundColor: '#E8E4DC',
          overflow: 'hidden'
        }}>
          {backImg && (
            <LazyImage
              src={backImg.url}
              lqip={backImg.lqip}
              alt={alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Flip Grid for a Tour's Images ───────────────────────────────────────────
interface FlipGridProps {
  images: { url: string; lqip?: string }[];
  tourTitle: string;
  onImageClick: (index: number) => void;
  isExpanded: boolean;
}

function FlipGrid({ images, tourTitle, onImageClick, isExpanded }: FlipGridProps) {
  const [visibleImages, setVisibleImages] = useState<{ url: string; lqip?: string }[]>([]);

  useEffect(() => {
    setVisibleImages(images.slice(0, 4));
  }, [images]);

  useEffect(() => {
    if (isExpanded || images.length <= 4) return;

    const interval = setInterval(() => {
      setVisibleImages(currentVisible => {
        const visibleUrls = new Set(currentVisible.map(img => img.url));
        const pool = images.filter(img => !visibleUrls.has(img.url));

        if (pool.length === 0) return currentVisible;

        let selected: { url: string; lqip?: string }[] = [...pool];
        if (selected.length >= 4) {
          const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
          selected = shuffledPool.slice(0, 4);
        } else {
          const remainingCount = 4 - selected.length;
          const shuffledVisible = [...currentVisible].sort(() => Math.random() - 0.5);
          selected = [...selected, ...shuffledVisible.slice(0, remainingCount)];
        }

        // Shuffle until no slot has the same image as before (up to 100 attempts)
        let nextVisible = selected;
        let attempts = 0;
        while (attempts < 100) {
          nextVisible = [...selected].sort(() => Math.random() - 0.5);
          const hasDuplicate = nextVisible.some((img, idx) => img.url === currentVisible[idx]?.url);
          if (!hasDuplicate) break;
          attempts++;
        }

        return nextVisible;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isExpanded, images]);

  if (isExpanded) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '4px'
      }}>
        {images.map((imgData, i) => (
          <div
            key={i}
            onClick={() => onImageClick(i)}
            style={{
              aspectRatio: '1 / 1',
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative',
              backgroundColor: '#E8E4DC'
            }}
          >
            <LazyImage
              src={imgData.url}
              lqip={imgData.lqip}
              alt={`${tourTitle} photo ${i + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                transition: 'transform 0.4s ease',
                display: 'block'
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '4px'
    }}>
      {visibleImages.map((imgData, i) => {
        const originalIndex = images.findIndex(img => img.url === imgData.url);
        return (
          <FlipGalleryCard
            key={i}
            imgData={imgData}
            alt={`${tourTitle} photo ${i + 1}`}
            onClick={() => onImageClick(originalIndex >= 0 ? originalIndex : i)}
          />
        );
      })}
    </div>
  );
}

// ─── Main Gallery Page Client ─────────────────────────────────────────────────
export default function GalleryPageClient({ tours }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxTour, setLightboxTour] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [expandedTours, setExpandedTours] = useState<Set<string>>(new Set());
  const [isHoveringLightbox, setIsHoveringLightbox] = useState(false);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);
  const lightboxTimerRef = useRef<number | null>(null);

  const activeTourObj = tours.find(t => t.id === lightboxTour);
  const closeLightbox = () => {
    setLightboxTour(null);
    setIsHoveringLightbox(false);
    if (lightboxTimerRef.current !== null) {
      window.clearTimeout(lightboxTimerRef.current);
      lightboxTimerRef.current = null;
    }
  };

  const handleNextImage = () => {
    if (activeTourObj) {
      setLightboxIndex((prev) => (prev + 1) % activeTourObj.images.length);
    }
  };

  const handlePrevImage = () => {
    if (activeTourObj) {
      setLightboxIndex((prev) => (prev - 1 + activeTourObj.images.length) % activeTourObj.images.length);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxTour || !activeTourObj) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxTour(null);
        setIsHoveringLightbox(false);
        if (lightboxTimerRef.current !== null) {
          window.clearTimeout(lightboxTimerRef.current);
          lightboxTimerRef.current = null;
        }
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % activeTourObj.images.length);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + activeTourObj.images.length) % activeTourObj.images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxTour, activeTourObj, isHoveringLightbox]);

  useEffect(() => {
    // Auto-scroll active thumbnail into view
    if (thumbnailStripRef.current && activeTourObj) {
      const activeThumb = thumbnailStripRef.current.children[lightboxIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [lightboxIndex, activeTourObj]);

  useEffect(() => {
    if (!lightboxTour || !activeTourObj || activeTourObj.images.length <= 1 || isHoveringLightbox) {
      if (lightboxTimerRef.current !== null) {
        window.clearTimeout(lightboxTimerRef.current);
        lightboxTimerRef.current = null;
      }
      return;
    }

    lightboxTimerRef.current = window.setTimeout(() => {
      setLightboxIndex((prev) => (prev + 1) % activeTourObj.images.length);
    }, 5000);

    return () => {
      if (lightboxTimerRef.current !== null) {
        window.clearTimeout(lightboxTimerRef.current);
        lightboxTimerRef.current = null;
      }
    };
  }, [lightboxTour, activeTourObj, lightboxIndex, isHoveringLightbox]);

  const toggleExpand = (id: string) => {
    setExpandedTours(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredTours = activeCategory === 'all' 
    ? tours 
    : tours.filter(t => t.category === activeCategory);

  const formatHeaderDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
  };

  return (
    <div style={{ backgroundColor: '#FAFAF7', minHeight: '100vh', width: '100%' }}>
      {/* SECTION 1 — DARK HERO HEADER */}
      <section style={{
        backgroundColor: '#1C1917',
        padding: '72px 60px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            fontFamily: "'Jost', Arial, sans-serif",
            fontSize: '11px',
            color: '#C9933A',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            marginBottom: '16px'
          }}>
            OUR MOMENTS
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: '500',
            color: '#F5F1EB',
            margin: '0 0 24px 0',
            lineHeight: '1.2'
          }}>
            A Journey in Photographs
          </h1>
          <div style={{
            width: '56px',
            height: '1px',
            backgroundColor: '#C9933A',
            marginBottom: '24px'
          }} />
          <p style={{
            fontFamily: "'Jost', Arial, sans-serif",
            fontWeight: '300',
            fontSize: '16px',
            color: '#9A948F',
            maxWidth: '600px',
            lineHeight: '1.7',
            margin: '0'
          }}>
            Every photograph tells the story of a connection made, a dream fulfilled, and a memory that lasts a lifetime.
          </p>
        </div>
      </section>

      {/* SECTION 2 — FILTER BAR */}
      <section style={{
        backgroundColor: '#FAFAF7',
        padding: '24px 60px',
        borderBottom: '1px solid #E8E4DC'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '12px',
                    fontWeight: '400',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    padding: '10px 24px',
                    backgroundColor: isActive ? 'rgba(201,147,58,0.06)' : 'transparent',
                    border: isActive ? '1px solid #C9933A' : '1px solid #E8E4DC',
                    color: isActive ? '#C9933A' : '#1C1917',
                    cursor: 'pointer',
                    margin: '0',
                    transition: 'all 0.25s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
          <div style={{
            fontFamily: "'Jost', Arial, sans-serif",
            fontSize: '12px',
            color: '#9A948F',
            whiteSpace: 'nowrap'
          }}>
            Showing {filteredTours.length} events
          </div>
        </div>
      </section>

      {/* SECTION 3 — EVENTS GALLERY LIST */}
      <section style={{
        backgroundColor: '#FAFAF7',
        padding: '48px 60px 80px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {filteredTours.length === 0 ? (
            <div style={{
              padding: '80px 0',
              textAlign: 'center',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '22px',
              fontStyle: 'italic',
              color: '#9A948F'
            }}>
              No photos available for this category yet.
            </div>
          ) : (
            filteredTours.map((tour, index) => {
              const isExpanded = expandedTours.has(tour.id);
              const hasMore = tour.images.length > 4;

              return (
                <div key={tour.id}>
                  {/* A — EVENT HEADER ROW */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}>
                    <div>
                      <h2 style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '28px',
                        fontWeight: '500',
                        color: '#1C1917',
                        margin: '0 0 12px 0'
                      }}>
                        {tour.title}
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{
                          fontFamily: "'Jost', Arial, sans-serif",
                          fontSize: '12px',
                          color: '#9A948F'
                        }}>
                          {formatHeaderDate(tour.startDate)}
                        </span>
                        <span style={{
                          fontFamily: "'Jost', Arial, sans-serif",
                          fontSize: '10px',
                          color: '#C9933A',
                          border: '1px solid #C9933A',
                          backgroundColor: 'rgba(201,147,58,0.06)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.2em',
                          padding: '4px 10px'
                        }}>
                          {tour.category || 'Event'}
                        </span>
                      </div>
                    </div>

                    {hasMore && (
                      <button
                        onClick={() => toggleExpand(tour.id)}
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
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M3 9h18M9 21V9" />
                        </svg>
                        {isExpanded ? 'COLLAPSE PHOTOS' : `VIEW ALL PHOTOS (${tour.images.length})`}
                      </button>
                    )}
                  </div>

                  {/* B — FLIP PHOTO GRID */}
                  <FlipGrid
                    images={tour.images}
                    tourTitle={tour.title}
                    onImageClick={(i) => {
                      setLightboxTour(tour.id);
                      setLightboxIndex(i);
                    }}
                    isExpanded={isExpanded}
                  />

                  {/* C — DIVIDER */}
                  {index < filteredTours.length - 1 && (
                    <div style={{
                      width: '100%',
                      height: '1px',
                      backgroundColor: '#E8E4DC',
                      margin: '48px 0'
                    }} />
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* SECTION 4 — LIGHTBOX */}
      {lightboxTour && activeTourObj && (
        <div
          onMouseEnter={() => setIsHoveringLightbox(true)}
          onMouseLeave={() => setIsHoveringLightbox(false)}
          style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(5,3,2,0.96)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Top Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px 32px',
            position: 'absolute',
            top: 0, left: 0, right: 0,
            zIndex: 10
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '18px',
              color: '#F5F1EB'
            }}>
              {activeTourObj.title}
            </div>
            <div style={{
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: 'clamp(18px, 2vw, 26px)',
              color: '#FFF7E8',
              letterSpacing: '0.2em',
              background: 'linear-gradient(180deg, rgba(33,25,19,0.9), rgba(10,8,7,0.76))',
              border: '1px solid rgba(201,147,58,0.3)',
              padding: '8px 16px',
              borderRadius: '999px',
              fontWeight: '600',
              minWidth: '96px',
              textAlign: 'center',
              boxShadow: '0 14px 28px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.08)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}>
              {lightboxIndex + 1} / {activeTourObj.images.length}
            </div>
            <button
              onClick={closeLightbox}
              style={{
                width: '44px',
                height: '44px',
                border: '1px solid rgba(201,147,58,0.3)',
                backgroundColor: 'transparent',
                color: '#F5F1EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '20px',
                padding: 0
              }}
            >
              ✕
            </button>
          </div>

            {/* Center Image */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '110px clamp(120px, 14vw, 240px) 80px'
            }}>
              <div
                key={lightboxIndex}
                style={{
                  width: '72vw',
                  height: '80vh',
                  maxWidth: '72vw',
                  maxHeight: '80vh',
                  animation: 'premiumLightboxFade 760ms cubic-bezier(0.16, 1, 0.3, 1) both',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '2px solid rgba(255,255,255,0.92)',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.32), 0 0 24px rgba(255,255,255,0.16), 0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.02)'
                }}
              >
                <LazyImage
                  src={activeTourObj.images[lightboxIndex].url}
                  lqip={activeTourObj.images[lightboxIndex].lqip}
                  alt="Lightbox"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </div>
            </div>

            {activeTourObj.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  style={{
                    position: 'absolute',
                    left: '96px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 'clamp(96px, 12vw, 170px)',
                    padding: '8px',
                    border: '1px solid rgba(201,147,58,0.28)',
                    background: 'rgba(10,8,7,0.7)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    cursor: 'pointer',
                    zIndex: 10,
                    boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
                    transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#C9933A';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(201,147,58,0.28)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', overflow: 'hidden' }}>
                    <LazyImage
                      src={activeTourObj.images[(lightboxIndex - 1 + activeTourObj.images.length) % activeTourObj.images.length].url}
                      lqip={activeTourObj.images[(lightboxIndex - 1 + activeTourObj.images.length) % activeTourObj.images.length].lqip}
                      alt="Previous photo preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(5,3,2,0.55), transparent 60%)'
                    }} />
                  </div>
                  <div style={{
                    marginTop: '8px',
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '11px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#FFF7E8'
                  }}>
                    Prev
                  </div>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  style={{
                    position: 'absolute',
                    right: '96px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 'clamp(96px, 12vw, 170px)',
                    padding: '8px',
                    border: '1px solid rgba(201,147,58,0.28)',
                    background: 'rgba(10,8,7,0.7)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    cursor: 'pointer',
                    zIndex: 10,
                    boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
                    transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#C9933A';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(201,147,58,0.28)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', overflow: 'hidden' }}>
                    <LazyImage
                      src={activeTourObj.images[(lightboxIndex + 1) % activeTourObj.images.length].url}
                      lqip={activeTourObj.images[(lightboxIndex + 1) % activeTourObj.images.length].lqip}
                      alt="Next photo preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(5,3,2,0.55), transparent 60%)'
                    }} />
                  </div>
                  <div style={{
                    marginTop: '8px',
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '11px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#FFF7E8'
                  }}>
                    Next
                  </div>
                </button>
              </>
            )}

          {/* Left Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevImage();
            }}
            style={{
              position: 'absolute',
              left: '24px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '52px',
              height: '52px',
              backgroundColor: 'rgba(28,25,23,0.8)',
              border: '1px solid rgba(201,147,58,0.3)',
              color: '#F5F1EB',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              transition: 'border-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#C9933A'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(201,147,58,0.3)'}
          >
            ←
          </button>

          {/* Right Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextImage();
            }}
            style={{
              position: 'absolute',
              right: '24px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '52px',
              height: '52px',
              backgroundColor: 'rgba(28,25,23,0.8)',
              border: '1px solid rgba(201,147,58,0.3)',
              color: '#F5F1EB',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              transition: 'border-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#C9933A'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(201,147,58,0.3)'}
          >
            →
          </button>

          {/* Bottom Thumbnail Strip */}
          <div 
            ref={thumbnailStripRef}
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'row',
              gap: '6px',
              backgroundColor: 'rgba(10,8,7,0.7)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              padding: '8px 12px',
              maxWidth: '80vw',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              zIndex: 10
            }}
          >
            {activeTourObj.images.map((thumbData, idx) => (
              <div
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(idx);
                }}
                style={{
                  width: '48px',
                  height: '36px',
                  cursor: 'pointer',
                  border: lightboxIndex === idx ? '2px solid #C9933A' : '2px solid transparent',
                  flexShrink: 0,
                  overflow: 'hidden'
                }}
              >
                <LazyImage
                  src={thumbData.url}
                  lqip={thumbData.lqip}
                  alt={`Thumbnail ${idx + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </div>
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

      {/* SECTION 5 — BOTTOM CTA */}
      <section style={{
        backgroundColor: '#1C1917',
        padding: '72px 60px',
        textAlign: 'center',
        borderTop: '1px solid rgba(201,147,58,0.2)'
      }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '42px',
          fontStyle: 'italic',
          fontWeight: '400',
          color: '#F5F1EB',
          marginBottom: '32px'
        }}>
          Ready to be part of the story?
        </h2>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          <Link href="/tours" style={{ textDecoration: 'none' }}>
            <button style={{
              backgroundColor: '#C9933A',
              color: '#1C1917',
              padding: '18px 48px',
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}>
              Explore Tours
            </button>
          </Link>
          <Link href="/contact" style={{ textDecoration: 'none' }}>
            <button style={{
              backgroundColor: 'transparent',
              color: '#F5F1EB',
              padding: '18px 48px',
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              border: '1px solid #C9933A',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(201,147,58,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Contact Us
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
