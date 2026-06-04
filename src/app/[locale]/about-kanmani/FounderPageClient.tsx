"use client";

import { useState, useEffect, useCallback } from 'react';
import { galleryImageUrl } from '@/sanity/lib/image';
import LazyImage from '@/components/ui/LazyImage';

interface FounderPhoto {
  _id: string;
  caption?: string;
  captionJa?: string;
  era: string;
  year?: number;
  location?: string;
  featured?: boolean;
  orderRank?: string;
  image: any;
}

// FlipImageCard manages the 3D flip animation of a single slot when its photo prop updates.
interface FlipImageCardProps {
  photo: FounderPhoto;
  onClick: () => void;
  isJa: boolean;
}

function FlipImageCard({ photo, onClick, isJa }: FlipImageCardProps) {
  const [frontPhoto, setFrontPhoto] = useState<FounderPhoto>(photo);
  const [backPhoto, setBackPhoto] = useState<FounderPhoto | null>(photo);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const currentVisiblePhoto = isFlipped ? backPhoto : frontPhoto;
    if (!currentVisiblePhoto || photo._id === currentVisiblePhoto._id) return;

    if (isFlipped) {
      setFrontPhoto(photo);
      setIsFlipped(false);
    } else {
      setBackPhoto(photo);
      setIsFlipped(true);
    }
  }, [photo, isFlipped, frontPhoto, backPhoto]);

  const frontUrl = galleryImageUrl(frontPhoto.image);
  const backUrl = backPhoto ? galleryImageUrl(backPhoto.image) : '';

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
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          backgroundColor: '#E8E4DC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {frontUrl && (
            <LazyImage 
              src={frontUrl} 
              lqip={frontPhoto.image?.asset?.metadata?.lqip}
              alt={isJa ? frontPhoto.captionJa || '' : frontPhoto.caption || ''} 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 80%'
              }}
            />
          )}
        </div>

        {/* Back Face */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          backgroundColor: '#E8E4DC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {backUrl && (
            <LazyImage 
              src={backUrl} 
              lqip={backPhoto?.image?.asset?.metadata?.lqip}
              alt={isJa ? backPhoto?.captionJa || '' : backPhoto?.caption || ''} 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 80%'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// EraGallery manages the visible photos, timers, and layout of a single era section.
interface EraGalleryProps {
  eraId: string;
  eraLabel: string;
  eraPhotos: FounderPhoto[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  openLightbox: (photo: FounderPhoto, eraId: string, index: number) => void;
  isJa: boolean;
}

function EraGallery({
  eraId,
  eraLabel,
  eraPhotos,
  isExpanded,
  onToggleExpand,
  openLightbox,
  isJa
}: EraGalleryProps) {
  const [visiblePhotos, setVisiblePhotos] = useState<FounderPhoto[]>([]);

  useEffect(() => {
    setVisiblePhotos(eraPhotos.slice(0, 5));
  }, [eraPhotos]);

  useEffect(() => {
    if (isExpanded || eraPhotos.length <= 5) return;

    const interval = setInterval(() => {
      setVisiblePhotos(currentVisible => {
        const visibleIds = new Set(currentVisible.map(p => p._id));
        const pool = eraPhotos.filter(p => !visibleIds.has(p._id));

        if (pool.length === 0) return currentVisible;

        // Choose 5 photos including all pool (hidden) ones
        let selected: FounderPhoto[] = [...pool];
        if (selected.length >= 5) {
          const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
          selected = shuffledPool.slice(0, 5);
        } else {
          const remainingCount = 5 - selected.length;
          const shuffledVisible = [...currentVisible].sort(() => Math.random() - 0.5);
          selected = [...selected, ...shuffledVisible.slice(0, remainingCount)];
        }

        // Shuffle up to 100 times to guarantee that no slot receives the same photo it currently has
        let nextVisible = selected;
        let attempts = 0;
        while (attempts < 100) {
          nextVisible = [...selected].sort(() => Math.random() - 0.5);
          const hasDuplicateSlot = nextVisible.some((p, idx) => p._id === currentVisible[idx]?._id);
          if (!hasDuplicateSlot) {
            break;
          }
          attempts++;
        }

        return nextVisible;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isExpanded, eraPhotos]);

  const handlePhotoClick = (photo: FounderPhoto, displayIndex: number) => {
    const fullIndex = eraPhotos.findIndex(p => p._id === photo._id);
    openLightbox(photo, eraId, fullIndex >= 0 ? fullIndex : displayIndex);
  };

  return (
    <div style={{ marginBottom: '64px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '24px' }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '32px', color: '#1C1917' }}>{eraLabel}</h3>
        <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '12px', color: '#9A948F', backgroundColor: '#E8E4DC', padding: '4px 12px', borderRadius: '12px' }}>
          {eraPhotos.length} photos
        </span>
      </div>

      {isExpanded ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {eraPhotos.map((photo, index) => {
            const url = galleryImageUrl(photo.image);
            return (
              <div 
                key={photo._id} 
                onClick={() => openLightbox(photo, eraId, index)}
                style={{
                  aspectRatio: '1 / 1',
                  backgroundColor: '#E8E4DC',
                  position: 'relative',
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
              >
                {url && (
                  <LazyImage 
                    src={url} 
                    lqip={photo.image?.asset?.metadata?.lqip}
                    alt={isJa ? photo.captionJa || '' : photo.caption || ''} 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center 80%',
                      transition: 'transform 0.5s ease'
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px',
          width: '100%'
        }}>
          {visiblePhotos.map((photo, index) => (
            <FlipImageCard 
              key={index} 
              photo={photo}
              onClick={() => handlePhotoClick(photo, index)}
              isJa={isJa}
            />
          ))}
        </div>
      )}

      {!isExpanded && eraPhotos.length > 5 && (
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button 
            onClick={onToggleExpand}
            style={{
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: '14px',
              fontWeight: '500',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#1C1917',
              backgroundColor: 'transparent',
              border: '1px solid #1C1917',
              padding: '12px 32px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#1C1917';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#1C1917';
            }}
          >
            View all {eraPhotos.length} photos
          </button>
        </div>
      )}

      {isExpanded && eraPhotos.length > 5 && (
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button 
            onClick={onToggleExpand}
            style={{
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: '14px',
              fontWeight: '500',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#1C1917',
              backgroundColor: 'transparent',
              border: '1px solid #1C1917',
              padding: '12px 32px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#1C1917';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#1C1917';
            }}
          >
            Show Less
          </button>
        </div>
      )}
    </div>
  );
}

interface FounderPageClientProps {
  locale: string;
  photos: FounderPhoto[];
}

const ERAS = [
  { id: 'all', label: 'All Photos' },
  { id: 'celebrity', label: 'Celebrity' },
  { id: 'news-media', label: 'News Media' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'student-phd', label: 'Student Life and PhD' },
  { id: 'world-travel', label: 'World Travel' },
  { id: 'arts', label: 'Arts' },
  { id: 'others', label: 'Others' }
];

export default function FounderPageClient({ locale, photos }: FounderPageClientProps) {
  const isJa = locale === 'ja';
  
  // Layout state
  const [windowWidth, setWindowWidth] = useState(1200);
  const [activeBioIndex, setActiveBioIndex] = useState<number>(-1);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handler = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['bio-section-0', 'bio-section-1', 'bio-section-2'];
      let currentActive = -1;
      let minDistance = Infinity;
      
      sections.forEach((id, idx) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const elementCenter = rect.top + rect.height / 2;
          const viewportCenter = window.innerHeight / 2;
          const distance = Math.abs(elementCenter - viewportCenter);
          
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          
          if (isVisible && distance < minDistance) {
            minDistance = distance;
            currentActive = idx;
          }
        }
      });
      
      setActiveBioIndex(currentActive);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  
  // State for gallery
  const [activeEra, setActiveEra] = useState<string>('all');
  const [expandedEras, setExpandedEras] = useState<Set<string>>(new Set());
  
  // State for lightbox
  const [lightboxPhoto, setLightboxPhoto] = useState<FounderPhoto | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [currentEraPhotos, setCurrentEraPhotos] = useState<FounderPhoto[]>([]);

  // Filter photos by era
  const getPhotosByEra = (eraId: string) => {
    if (eraId === 'all') return photos;
    return photos.filter(photo => photo.era === eraId);
  };

  const getEraPhoto = (eraId: string, skip: number = 0) => {
    const eraPhotos = photos.filter(p => p.era === eraId);
    if (eraPhotos.length === 0) return null;
    const featured = eraPhotos.filter(p => p.featured);
    if (featured.length > skip) return featured[skip];
    if (eraPhotos.length > skip) return eraPhotos[skip];
    return eraPhotos[0];
  };

  const handleEraClick = (eraId: string) => {
    setActiveEra(eraId);
    const gallerySection = document.getElementById('founder-gallery');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Lightbox navigation
  const openLightbox = (photo: FounderPhoto, eraId: string, index: number) => {
    setCurrentEraPhotos(getPhotosByEra(eraId));
    setLightboxPhoto(photo);
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxPhoto(null);
    document.body.style.overflow = 'auto';
  };

  const navigateLightbox = useCallback((direction: 'prev' | 'next') => {
    if (!lightboxPhoto) return;
    
    let newIndex = direction === 'prev' ? lightboxIndex - 1 : lightboxIndex + 1;
    if (newIndex < 0) newIndex = currentEraPhotos.length - 1;
    if (newIndex >= currentEraPhotos.length) newIndex = 0;
    
    setLightboxIndex(newIndex);
    setLightboxPhoto(currentEraPhotos[newIndex]);
  }, [lightboxPhoto, lightboxIndex, currentEraPhotos]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxPhoto) return;
      if (e.key === 'ArrowLeft') navigateLightbox('prev');
      if (e.key === 'ArrowRight') navigateLightbox('next');
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxPhoto, navigateLightbox]);

  const toggleExpandEra = (eraId: string) => {
    const newExpanded = new Set(expandedEras);
    if (newExpanded.has(eraId)) {
      newExpanded.delete(eraId);
    } else {
      newExpanded.add(eraId);
    }
    setExpandedEras(newExpanded);
  };

  const renderGalleryEra = (eraId: string, eraLabel: string) => {
    const eraPhotos = getPhotosByEra(eraId);
    if (eraPhotos.length === 0 && eraId !== 'all') {
      return (
        <div key={eraId} style={{ marginBottom: '64px' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '32px', color: '#1C1917', marginBottom: '16px' }}>{eraLabel}</h3>
          <div style={{ padding: '64px', textAlign: 'center', backgroundColor: '#FAFAF7', border: '1px dashed #D4CFC9' }}>
            <p style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '14px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Photos coming soon
            </p>
          </div>
        </div>
      );
    }

    if (eraPhotos.length === 0) return null;

    const isExpanded = expandedEras.has(eraId) || eraId === 'all';

    return (
      <EraGallery
        key={eraId}
        eraId={eraId}
        eraLabel={eraLabel}
        eraPhotos={eraPhotos}
        isExpanded={isExpanded}
        onToggleExpand={() => toggleExpandEra(eraId)}
        openLightbox={openLightbox}
        isJa={isJa}
      />
    );
  };

  return (
    <div style={{ backgroundColor: '#FAFAF7', minHeight: '100vh' }}>
      
      {/* CHAPTER 1 — HERO */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden',
        backgroundColor: '#1C1917'
      }}>
        {/* Full upper image */}
        <img 
          src="/assets/img/about-kanmani/founder-hero.jpg" 
          alt="Dr. Kanmani"
          style={{
            width: '100%',
            height: '85vh',
            objectFit: 'cover',
            objectPosition: 'center 15%',
            display: 'block'
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '70%',
          background: 'linear-gradient(to top, #1C1917 0%, rgba(28,25,23,0.85) 40%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1
        }} />

        {/* Text Content Area */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          padding: '0 60px 56px',
          textAlign: 'center'
        }}>
          <p style={{
            fontFamily: "'Jost', Arial, sans-serif",
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.32em',
            color: '#C9933A',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>THE FOUNDER</p>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(52px, 8vw, 96px)',
            fontWeight: 400,
            color: '#F5F1EB',
            letterSpacing: '0.06em',
            marginBottom: '16px'
          }}>Dr. Kanmani</h1>

          <p style={{
            fontFamily: "'Jost', Arial, sans-serif",
            fontSize: 'clamp(9px, 1.2vw, 12px)',
            fontWeight: 400,
            letterSpacing: '0.18em',
            color: '#C9933A',
            textTransform: 'uppercase',
            marginBottom: '40px',
            whiteSpace: 'nowrap'
          }}>PHD SCHOLAR · ENTREPRENEUR · HUMANITARIAN</p>

          <div style={{
            width: '80px',
            height: '1px',
            backgroundColor: '#C9933A',
            margin: '0 auto 40px'
          }} />

          {/* Stats Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '48px',
            flexWrap: 'wrap'
          }}>
            {/* Stat 1 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Jost', Arial, sans-serif", fontWeight: 300, fontSize: 'clamp(32px, 4vw, 48px)', color: '#F5F1EB', lineHeight: '1.2' }}>28</div>
              <div style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', letterSpacing: '0.2em', color: '#9A948F', textTransform: 'uppercase', marginTop: '4px', whiteSpace: 'nowrap' }}>Years in Japan</div>
            </div>

            <div style={{ width: '1px', height: '40px', backgroundColor: 'rgba(201,147,58,0.2)' }} />

            {/* Stat 2 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Jost', Arial, sans-serif", fontWeight: 300, fontSize: 'clamp(32px, 4vw, 48px)', color: '#F5F1EB', lineHeight: '1.2' }}>41</div>
              <div style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', letterSpacing: '0.2em', color: '#9A948F', textTransform: 'uppercase', marginTop: '4px', whiteSpace: 'nowrap' }}>Countries Travelled</div>
            </div>

            <div style={{ width: '1px', height: '40px', backgroundColor: 'rgba(201,147,58,0.2)' }} />

            {/* Stat 3 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Jost', Arial, sans-serif", fontWeight: 300, fontSize: 'clamp(32px, 4vw, 48px)', color: '#F5F1EB', lineHeight: '1.2' }}>PhD</div>
              <div style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', letterSpacing: '0.2em', color: '#9A948F', textTransform: 'uppercase', marginTop: '4px', whiteSpace: 'nowrap' }}>Nagoya Uni, Japan</div>
            </div>

            <div style={{ width: '1px', height: '40px', backgroundColor: 'rgba(201,147,58,0.2)' }} />

            {/* Stat 4 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Jost', Arial, sans-serif", fontWeight: 300, fontSize: 'clamp(32px, 4vw, 48px)', color: '#F5F1EB', lineHeight: '1.2' }}>4</div>
              <div style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', letterSpacing: '0.2em', color: '#9A948F', textTransform: 'uppercase', marginTop: '4px', whiteSpace: 'nowrap' }}>Languages</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Section (Below Hero) */}
      <div style={{
        backgroundColor: '#FAFAF7',
        padding: '80px 60px',
        textAlign: 'center'
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(22px, 3vw, 36px)',
          fontWeight: 400,
          fontStyle: 'italic',
          color: '#1C1917',
          lineHeight: 1.7,
          maxWidth: '800px',
          margin: '0 auto 24px'
        }}>
          "Born in India, shaped by 28 years in Japan, and inspired by both— I walk forward as a bridge between the two cultures that live within me."
        </p>
        <p style={{
          fontFamily: "'Jost', Arial, sans-serif",
          fontSize: '13px',
          fontWeight: 400,
          letterSpacing: '0.16em',
          color: '#9A948F'
        }}>
          — Dr. Kanmani, Founder of Kanmani Tours
        </p>
      </div>

      {/* CHAPTER 2 — HER STORY */}
      <section style={{ padding: '120px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Section A */}
        <div 
          id="bio-section-0"
          style={{
            padding: isMobile ? '24px 16px' : '40px 48px',
            borderRadius: '12px',
            backgroundColor: activeBioIndex === 0 ? '#F3EDE2' : 'transparent',
            borderLeft: `4px solid ${activeBioIndex === 0 ? '#C9933A' : 'transparent'}`,
            boxShadow: activeBioIndex === 0 ? '0 10px 30px rgba(0,0,0,0.04)' : 'none',
            transition: 'all 0.4s ease-in-out',
            marginBottom: '60px'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '42px', color: '#1C1917', marginBottom: '24px' }}>The Student Who Stayed</h2>
              <div style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '16px', color: '#4A4540', lineHeight: '1.7' }}>
                <p style={{ marginBottom: '24px', textAlign: 'justify' }}>I landed in Japan in 1998 — a young woman from Tamil Nadu with one suitcase, a scholarship, and a fire that refused to stay small.</p>
                <p style={{ marginBottom: '24px', textAlign: 'justify' }}>My parents gave me one thing for this journey — a one-way ticket. Just one. Everything after that was mine to earn.</p>
                <p style={{ marginBottom: '24px', textAlign: 'justify' }}>I didn't speak Japanese. I didn't know many people. The city was vast, the silence was loud, and the loneliness was real. But I didn't come this far to turn back.</p>
                <p style={{ marginBottom: '24px', textAlign: 'justify' }}>I learned Japanese — not from textbooks, but from the streets, the people, and over <strong>40 part-time jobs</strong> that taught me more than any classroom ever could. I spoke before I was ready. I failed before I succeeded. And every single time I fell, I got up speaking better, standing taller, and believing harder.</p>
                <p style={{ textAlign: 'justify' }}>Japan didn't hand me anything on a silver plate. I struggled for it. I fought for it. I earned it — <strong>word by word, year by year, trust by trust.</strong></p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', maxWidth: '400px', margin: '0 auto', width: '100%' }}>
                {(() => {
                  const photo = getEraPhoto('student-phd', 0);
                  const url = photo ? galleryImageUrl(photo.image) : null;
                  return (
                    <div style={{ aspectRatio: '1/1', backgroundColor: '#F0EBE1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E6DFD3', position: 'relative', overflow: 'hidden' }}>
                      {url ? (
                        <LazyImage src={url} alt="Student Life" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '12px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Student Life Era</span>
                      )}
                    </div>
                  );
                })()}
                {(() => {
                  const photo = getEraPhoto('student-phd', 1);
                  const url = photo ? galleryImageUrl(photo.image) : null;
                  return (
                    <div style={{ aspectRatio: '1/1', backgroundColor: '#F0EBE1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E6DFD3', position: 'relative', overflow: 'hidden' }}>
                      {url ? (
                        <LazyImage src={url} alt="PhD" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '12px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>PhD Era</span>
                      )}
                    </div>
                  );
                })()}
              </div>
          </div>
        </div>

        {/* Section B */}
        <div 
          id="bio-section-1"
          style={{
            padding: isMobile ? '24px 16px' : '40px 48px',
            borderRadius: '12px',
            backgroundColor: activeBioIndex === 1 ? '#F3EDE2' : 'transparent',
            borderLeft: `4px solid ${activeBioIndex === 1 ? '#C9933A' : 'transparent'}`,
            boxShadow: activeBioIndex === 1 ? '0 10px 30px rgba(0,0,0,0.04)' : 'none',
            transition: 'all 0.4s ease-in-out',
            marginBottom: '60px'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
            <div style={{ order: 2 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '42px', color: '#1C1917', marginBottom: '24px' }}>A Career Built on Trust</h2>
              <div style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '16px', color: '#4A4540', lineHeight: '1.7' }}>
                <p style={{ marginBottom: '24px', textAlign: 'justify' }}>I was accepted into <strong>Nagoya University — home to</strong> seven Nobel laureates — and pursued my PhD. I worked with the <strong>United Nations University</strong> in Tokyo on issues that shape the future of nations. When the <strong>2004 Tsunami</strong> struck, I wasn't watching from a distance — I was on the ground, coordinating disaster relief with <strong>JICA</strong>, translating not just languages, but life-or-death urgency. I interpreted for the <strong>Refugee Assistance Headquarters</strong> in Tokyo — proceedings where a single sentence could save a family.</p>
                <p style={{ marginBottom: '24px', textAlign: 'justify' }}>I led <strong>India's first Women's Everest Base Camp Expedition</strong> from Tamil Nadu — sponsored by then Chief Minister <strong>Dr. J. Jayalalitha</strong>. I carried <strong>India's flag at the Asian Games</strong>. I presented research alongside <strong>Dr. M.S. Swaminathan</strong> — the father of India's Green Revolution — at international conferences across the world. I was a state-level volleyball player, a striker in Tamil Nadu.</p>
                <p style={{ textAlign: 'justify' }}><strong>None of it was given. All of it was built — with bare hands and an unbreakable will.</strong></p>
              </div>
            </div>
            <div style={{ order: 1, display: 'grid', gridTemplateColumns: '1fr', gap: '16px', maxWidth: '400px', margin: '0 auto', width: '100%' }}>
                {(() => {
                  const photo = getEraPhoto('achievements', 0);
                  const url = photo ? galleryImageUrl(photo.image) : null;
                  return (
                    <div style={{ aspectRatio: '1/1', backgroundColor: '#F0EBE1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E6DFD3', position: 'relative', overflow: 'hidden' }}>
                      {url ? (
                        <LazyImage src={url} alt="Achievements" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '12px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Achievements</span>
                      )}
                    </div>
                  );
                })()}
                {(() => {
                  const photo = getEraPhoto('news-media', 0);
                  const url = photo ? galleryImageUrl(photo.image) : null;
                  return (
                    <div style={{ aspectRatio: '1/1', backgroundColor: '#F0EBE1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E6DFD3', position: 'relative', overflow: 'hidden' }}>
                      {url ? (
                        <LazyImage src={url} alt="News Media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '12px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>News Media</span>
                      )}
                    </div>
                  );
                })()}
              </div>
          </div>
        </div>

        {/* Section C */}
        <div 
          id="bio-section-2"
          style={{
            padding: isMobile ? '24px 16px' : '40px 48px',
            borderRadius: '12px',
            backgroundColor: activeBioIndex === 2 ? '#F3EDE2' : 'transparent',
            borderLeft: `4px solid ${activeBioIndex === 2 ? '#C9933A' : 'transparent'}`,
            boxShadow: activeBioIndex === 2 ? '0 10px 30px rgba(0,0,0,0.04)' : 'none',
            transition: 'all 0.4s ease-in-out',
            marginBottom: '60px'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '42px', color: '#1C1917', marginBottom: '24px' }}>And Then There Was the World Beyond</h2>
              <div style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '16px', color: '#4A4540', lineHeight: '1.7' }}>
                <p style={{ marginBottom: '24px', textAlign: 'justify' }}>Since the year 2000, I have solo backpacked across <strong>forty-one countries</strong> — not as a tourist, but as a student of the world. I took <strong>30 low-cost flights in 30 days</strong> across Europe — before the EU was even formed. One night in Czech Republic, I was pulled off a train by border security in the middle of darkness and taken to a police station. A different woman might have stopped there. But when your will is made of steel — <strong>nothing scares your soul. Nothing can touch your core.</strong></p>
                <p style={{ marginBottom: '24px', textAlign: 'justify' }}>Through it all, Japan showed me something I carry to this day — that true strength is silent, like an undercurrent in the ocean — <strong>invisible, yet unstoppable.</strong> That respect is earned through action, not words. That overwhelming kindness from strangers needs no common language. That discipline and grace can live together in everything you do.</p>
                <p style={{ marginBottom: '24px', textAlign: 'justify' }}>And India — my India — reminded me of something equally powerful: <strong>that no matter how far you go, your roots are your greatest strength.</strong></p>
                <p style={{ marginBottom: '24px', textAlign: 'justify' }}>Twenty-eight years in Japan. Four languages — Japanese, Tamil, Telugu, and English. Forty-one countries. Two cultures that live inside me. Countless experiences — some that broke me open, some that built me whole. <strong>One woman who refused to quit.</strong></p>
                <p style={{ marginBottom: '24px', textAlign: 'justify' }}>Now, I'm building the bridge I once wished existed — between India and Japan — in language, culture, knowledge, and opportunity. So the next generation doesn't just dream across borders. <strong>They walk across them.</strong></p>
                <p style={{ textAlign: 'justify' }}>Because if a girl from Tamil Nadu can land in Japan with nothing but a one-way ticket and turn 28 years of struggle into a life of purpose — <strong>so can you.</strong></p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', maxWidth: '400px', margin: '0 auto', width: '100%' }}>
                {(() => {
                  const photo = getEraPhoto('world-travel', 0);
                  const url = photo ? galleryImageUrl(photo.image) : null;
                  return (
                    <div style={{ aspectRatio: '1/1', backgroundColor: '#F0EBE1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E6DFD3', position: 'relative', overflow: 'hidden' }}>
                      {url ? (
                        <LazyImage src={url} alt="World Travel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '12px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>World Travel</span>
                      )}
                    </div>
                  );
                })()}
                {(() => {
                  const photo = getEraPhoto('celebrity', 0);
                  const url = photo ? galleryImageUrl(photo.image) : null;
                  return (
                    <div style={{ aspectRatio: '1/1', backgroundColor: '#F0EBE1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E6DFD3', position: 'relative', overflow: 'hidden' }}>
                      {url ? (
                        <LazyImage src={url} alt="Celebrity" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '12px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Celebrity Era</span>
                      )}
                    </div>
                  );
                })()}
              </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 3 — TIMELINE */}
      <section style={{ backgroundColor: '#1C1917', color: '#FFFFFF', padding: '120px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '48px', textAlign: 'center', marginBottom: '80px', letterSpacing: '0.05em' }}>Journey Through Time</h2>
          
          <div style={{ position: 'relative', borderLeft: '2px solid rgba(201,147,58,0.3)', paddingLeft: '40px', marginLeft: '20px' }}>
            {[
              { year: '1998', title: 'Arrived in Japan for postgraduate studies', desc: 'The beginning of a 28-year journey.', era: 'student-phd' },
              { year: '2001', title: 'Began PhD research at Nagoya University', desc: 'Immersing in academia and cross-cultural studies.', era: 'student-phd' },
              { year: '2004', title: 'JICA Tsunami Relief Coordinator, Sri Lanka', desc: 'Managing critical on-the-ground disaster recovery.', era: 'achievements' },
              { year: '2006', title: 'Completed PhD, Nagoya University', desc: 'Achieving the highest academic milestone in Japan.', era: 'student-phd' },
              { year: '2008', title: 'Founded Kanmani Tours', desc: 'Creating the ultimate bridge between Japan and India.', era: 'world-travel' },
              { year: '2012', title: 'First celebrity fan tour to South India', desc: 'Opening new avenues for cultural exchange.', era: 'celebrity' },
              { year: '2015', title: 'International conference speaker alongside Dr. M.S. Swaminathan', desc: 'Discussing global agricultural and climate challenges.', era: 'news-media' },
              { year: '2019', title: 'Expanded tours, 500+ Japanese guests served', desc: 'Growing the community of India-Japan travelers.', era: 'world-travel' },
              { year: '2022', title: 'Post-pandemic revival of Japan-India travel', desc: 'Welcoming guests back to the heart of India.', era: 'others' },
              { year: '2026', title: 'Continuing the journey', desc: 'Looking ahead to the next chapter of connection.', era: 'others' }
            ].map((event, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: '64px' }}>
                <div style={{ position: 'absolute', left: '-49px', top: '0', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#C9933A' }}></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
                  <div>
                    <h3 style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '32px', color: '#C9933A', fontWeight: '400', marginBottom: '8px' }}>{event.year}</h3>
                    <h4 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '24px', marginBottom: '12px', lineHeight: '1.4' }}>{event.title}</h4>
                    <p style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '15px', color: '#9A948F', lineHeight: '1.6' }}>{event.desc}</p>
                  </div>
                  <div>
                    {(() => {
                      const photo = getEraPhoto(event.era);
                      const url = photo ? galleryImageUrl(photo.image) : null;
                      return (
                        <div style={{ aspectRatio: '16/9', backgroundColor: '#2C2420', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #4A4540', position: 'relative', overflow: 'hidden' }}>
                          {url ? (
                            <>
                              <LazyImage src={url} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 80%' }} />
                              <button 
                                onClick={() => handleEraClick(event.era)}
                                style={{
                                  position: 'absolute',
                                  top: '12px',
                                  left: '12px',
                                  backgroundColor: 'rgba(28, 25, 23, 0.85)',
                                  border: '1px solid rgba(201, 147, 58, 0.4)',
                                  color: '#C9933A',
                                  fontFamily: "'Jost', Arial, sans-serif",
                                  fontSize: '10px',
                                  fontWeight: 500,
                                  letterSpacing: '0.08em',
                                  textTransform: 'uppercase',
                                  padding: '6px 12px',
                                  borderRadius: '20px',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                  zIndex: 10,
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.backgroundColor = '#C9933A';
                                  e.currentTarget.style.color = '#1C1917';
                                  e.currentTarget.style.borderColor = '#C9933A';
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(28, 25, 23, 0.85)';
                                  e.currentTarget.style.color = '#C9933A';
                                  e.currentTarget.style.borderColor = 'rgba(201, 147, 58, 0.4)';
                                }}
                              >
                                View Gallery
                              </button>
                            </>
                          ) : (
                            <div style={{ padding: '16px', textAlign: 'center', cursor: 'pointer' }} onClick={() => handleEraClick(event.era)}>
                              <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '12px', color: '#C9933A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{event.era} Era</span>
                              <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '10px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Photos from this era available in gallery below</span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHAPTER 4 — PHOTO GALLERY */}
      <section id="founder-gallery" style={{ padding: '120px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '48px', textAlign: 'center', marginBottom: '64px', color: '#1C1917' }}>Kanmani's Life in Pictures</h2>
        
        {/* Era Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginBottom: '80px' }}>
          {ERAS.map(era => (
            <button
              key={era.id}
              onClick={() => setActiveEra(era.id)}
              style={{
                fontFamily: "'Jost', Arial, sans-serif",
                fontSize: '13px',
                fontWeight: '500',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '10px 24px',
                borderRadius: '30px',
                border: '1px solid',
                borderColor: activeEra === era.id ? '#1C1917' : '#D4CFC9',
                backgroundColor: activeEra === era.id ? '#1C1917' : 'transparent',
                color: activeEra === era.id ? '#FFFFFF' : '#4A4540',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {era.label}
            </button>
          ))}
        </div>

        {/* Gallery Grids */}
        <div>
          {activeEra === 'all' 
            ? ERAS.filter(e => e.id !== 'all').map(era => renderGalleryEra(era.id, era.label))
            : renderGalleryEra(activeEra, ERAS.find(e => e.id === activeEra)?.label || '')
          }
        </div>
      </section>



      {/* LIGHTBOX OVERLAY */}
      {lightboxPhoto && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(28, 25, 23, 0.98)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '24px', color: '#FFFFFF', alignItems: 'center' }}>
            <div style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '12px', letterSpacing: '0.1em', color: '#9A948F', textTransform: 'uppercase' }}>
              {lightboxIndex + 1} of {currentEraPhotos.length} photos from {ERAS.find(e => e.id === lightboxPhoto.era)?.label}
            </div>
            <button 
              onClick={closeLightbox}
              style={{ background: 'none', border: 'none', color: '#FFFFFF', fontSize: '32px', cursor: 'pointer', padding: '0 16px' }}
            >×</button>
          </div>

          {/* Main Image Area */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '0 80px' }}>
            <button 
              onClick={() => navigateLightbox('prev')}
              style={{ position: 'absolute', left: '24px', background: 'none', border: 'none', color: '#FFFFFF', fontSize: '48px', cursor: 'pointer', padding: '16px', opacity: 0.7 }}
            >‹</button>
            
            <div style={{ maxWidth: '1400px', maxHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img 
                src={galleryImageUrl(lightboxPhoto.image)} 
                alt={isJa ? lightboxPhoto.captionJa || 'Fullscreen' : lightboxPhoto.caption || 'Fullscreen'} 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '70vh', 
                  objectFit: 'contain',
                  display: 'block' 
                }} 
              />
              <div style={{ marginTop: '24px', textAlign: 'center', maxWidth: '800px' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '20px', color: '#FFFFFF', marginBottom: '8px' }}>
                  {isJa ? lightboxPhoto.captionJa : lightboxPhoto.caption}
                </p>
                {(lightboxPhoto.year || lightboxPhoto.location) && (
                  <p style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '14px', color: '#C9933A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {[lightboxPhoto.year, lightboxPhoto.location].filter(Boolean).join(' • ')}
                  </p>
                )}
              </div>
            </div>

            <button 
              onClick={() => navigateLightbox('next')}
              style={{ position: 'absolute', right: '24px', background: 'none', border: 'none', color: '#FFFFFF', fontSize: '48px', cursor: 'pointer', padding: '16px', opacity: 0.7 }}
            >›</button>
          </div>

          <div style={{ height: '100px', padding: '16px 24px', display: 'flex', gap: '8px', overflowX: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {currentEraPhotos.map((photo, i) => (
              <div
                key={photo._id}
                onClick={() => { setLightboxIndex(i); setLightboxPhoto(photo); }}
                style={{
                  height: '100%',
                  aspectRatio: '1/1',
                  cursor: 'pointer',
                  opacity: i === lightboxIndex ? 1 : 0.4,
                  border: i === lightboxIndex ? '2px solid #C9933A' : 'none',
                  transition: 'opacity 0.3s ease',
                  flexShrink: 0,
                  overflow: 'hidden'
                }}
              >
                <LazyImage
                  src={galleryImageUrl(photo.image)}
                  lqip={photo.image?.asset?.metadata?.lqip}
                  alt="Thumbnail"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
