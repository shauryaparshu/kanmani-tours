"use client";

import { useState, useEffect, useCallback } from 'react';
import { galleryImageUrl, containThumbnailImageUrl } from '@/sanity/lib/image';
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

  const frontUrl = containThumbnailImageUrl(frontPhoto.image);
  const backUrl = backPhoto ? containThumbnailImageUrl(backPhoto.image) : '';

  return (
    <div 
      onClick={onClick}
      style={{
        aspectRatio: '1 / 1',
        backgroundColor: '#1C1917',
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
          backgroundColor: '#1C1917',
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
                objectFit: 'contain',
                objectPosition: 'center'
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
          backgroundColor: '#1C1917',
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
                objectFit: 'contain',
                objectPosition: 'center'
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
    setVisiblePhotos(eraPhotos.slice(0, 4));
  }, [eraPhotos]);

  useEffect(() => {
    if (isExpanded || eraPhotos.length <= 4) return;

    const interval = setInterval(() => {
      setVisiblePhotos(currentVisible => {
        const visibleIds = new Set(currentVisible.map(p => p._id));
        const pool = eraPhotos.filter(p => !visibleIds.has(p._id));

        if (pool.length === 0) return currentVisible;

        // Choose 4 photos including all pool (hidden) ones
        let selected: FounderPhoto[] = [...pool];
        if (selected.length >= 4) {
          const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
          selected = shuffledPool.slice(0, 4);
        } else {
          const remainingCount = 4 - selected.length;
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
    }, 4000);

    return () => clearInterval(interval);
  }, [isExpanded, eraPhotos]);

  const handlePhotoClick = (photo: FounderPhoto, displayIndex: number) => {
    const fullIndex = eraPhotos.findIndex(p => p._id === photo._id);
    openLightbox(photo, eraId, fullIndex >= 0 ? fullIndex : displayIndex);
  };

  return (
    <div style={{ marginBottom: '48px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '24px', color: '#1C1917' }}>{eraLabel}</h3>
        <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', color: '#9A948F', backgroundColor: '#E8E4DC', padding: '2px 8px', borderRadius: '10px' }}>
          {eraPhotos.length} photos
        </span>
      </div>

      {isExpanded ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          {eraPhotos.map((photo, index) => {
            const url = containThumbnailImageUrl(photo.image);
            return (
              <div 
                key={photo._id} 
                onClick={() => openLightbox(photo, eraId, index)}
                style={{
                  aspectRatio: '1 / 1',
                  backgroundColor: '#1C1917',
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
                      objectFit: 'contain',
                      objectPosition: 'center',
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
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
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

      {!isExpanded && eraPhotos.length > 4 && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button 
            onClick={onToggleExpand}
            style={{
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#d49a36',
              backgroundColor: 'transparent',
              border: '1px solid #d49a36',
              padding: '14px 32px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#d49a36';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#d49a36';
            }}
          >
            VIEW ALL {eraPhotos.length} PHOTOS
          </button>
        </div>
      )}

      {isExpanded && eraPhotos.length > 4 && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button 
            onClick={onToggleExpand}
            style={{
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#d49a36',
              backgroundColor: 'transparent',
              border: '1px solid #d49a36',
              padding: '14px 32px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#d49a36';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#d49a36';
            }}
          >
            SHOW LESS
          </button>
        </div>
      )}
    </div>
  );
}

interface AboutKanmaniClientProps {
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

export default function AboutKanmaniClient({ locale, photos }: AboutKanmaniClientProps) {
  const isJa = locale === 'ja';
  
  // Layout state
  const [windowWidth, setWindowWidth] = useState(1200);
  const [activeSection, setActiveSection] = useState<'founder' | 'company'>('founder');
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

  // ScrollSpy to sync active tab with section in view
  useEffect(() => {
    const handleScrollSpy = () => {
      const founderEl = document.getElementById('about-founder');
      const companyEl = document.getElementById('about-company');
      
      if (founderEl && companyEl) {
        const companyBound = companyEl.getBoundingClientRect();
        if (companyBound.top <= window.innerHeight / 2.2) {
          setActiveSection('company');
        } else {
          setActiveSection('founder');
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy);
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  // Gallery & Lightbox state
  const [activeEra, setActiveEra] = useState<string>('all');
  const [expandedEras, setExpandedEras] = useState<Set<string>>(new Set());
  const [lightboxPhoto, setLightboxPhoto] = useState<FounderPhoto | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [currentEraPhotos, setCurrentEraPhotos] = useState<FounderPhoto[]>([]);

  const getPhotosByEra = (eraId: string) => {
    if (eraId === 'all') return photos;
    return photos.filter(photo => photo.era === eraId);
  };

  const getEraPhoto = (eraId: string, skip: number = 0): FounderPhoto | null => {
    return null;
  };

  const handleEraClick = (eraId: string) => {
    setActiveEra(eraId);
    const gallerySection = document.getElementById('founder-gallery');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
        <div key={eraId} style={{ marginBottom: '48px' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '24px', color: '#1C1917', marginBottom: '16px' }}>{eraLabel}</h3>
          <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#FAFAF7', border: '1px dashed #D4CFC9' }}>
            <p style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '13px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
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
    <div style={{ backgroundColor: '#FAFAF7', minHeight: '100vh', position: 'relative' }}>
      
      {/* DR. KANMANI 5-CHAPTER BIOGRAPHY */}
      <div id="about-founder">
        
        {/* CHAPTER 1 — HERO */}
        <div style={{
          backgroundColor: '#1C1917',
          width: '100%'
        }}>
          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'stretch',
            flexDirection: isMobile ? 'column' : 'row',
            backgroundColor: '#1C1917'
          }}>
            <div style={{
              width: isMobile ? '100%' : '60%',
              backgroundColor: '#111010',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <div style={{
                width: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img 
                  src="/assets/img/about-kanmani/founder-hero.jpg" 
                  alt="Dr. Kanmani"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>

            <div style={{
              width: isMobile ? '100%' : '40%',
              backgroundColor: '#1C1917',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: isMobile ? '32px 16px 24px 16px' : '88px 40px 48px 40px',
              borderLeft: isMobile ? 'none' : '1px solid rgba(201,147,58,0.15)',
              minHeight: 'auto',
              height: 'auto',
              overflow: 'visible'
            }}>
              {/* Header Intro Group (Quote + Name) */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Block 1: Special Quote Block */}
                <div style={{
                  position: 'relative',
                  borderLeft: '4px solid #C9933A',
                  padding: '20px 24px',
                  backgroundColor: 'rgba(201, 147, 58, 0.04)',
                  marginBottom: '20px',
                  marginTop: 0,
                  borderRadius: '0 8px 8px 0',
                  boxShadow: 'inset 0 0 15px rgba(201, 147, 58, 0.05)',
                  backdropFilter: 'blur(5px)',
                  overflow: 'visible'
                }}>
                  <span style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '12px',
                    fontSize: '72px',
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: 'rgba(201, 147, 58, 0.12)',
                    lineHeight: 1,
                    pointerEvents: 'none',
                    userSelect: 'none'
                  }}>“</span>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 'clamp(15px, 1.25vw, 18px)',
                    fontStyle: 'italic',
                    color: '#F5F1EB',
                    lineHeight: 1.6,
                    margin: 0,
                    fontWeight: 400,
                    letterSpacing: '0.01em',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    "Born in India, shaped by 28 years in Japan, and inspired by both— I walk forward as a bridge between the two cultures that live within me."
                  </p>
                </div>

                {/* Block 2: Name & Title Block */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Gold Label */}
                  <p style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.32em',
                    color: '#C9933A',
                    textTransform: 'uppercase',
                    marginBottom: '6px'
                  }}>THE FOUNDER</p>

                  {/* Name */}
                  <h1 style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 'clamp(32px, 3.5vw, 48px)',
                    fontWeight: 400,
                    color: '#F5F1EB',
                    letterSpacing: '0.06em',
                    marginBottom: '4px'
                  }}>Dr. Kanmani</h1>

                  {/* Title Row */}
                  <p style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '11px',
                    fontWeight: 400,
                    letterSpacing: '0.12em',
                    color: '#C9933A',
                    lineHeight: 1.2,
                    marginBottom: '12px',
                    whiteSpace: 'nowrap'
                  }}>PhD SCHOLAR · ENTREPRENEUR · HUMANITARIAN</p>

                  {/* Divider */}
                  <div style={{
                    width: '56px',
                    height: '1px',
                    backgroundColor: '#C9933A',
                    marginBottom: 0
                  }} />
                </div>
              </div>

              {/* Block 3: Stats Grid */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0
              }}>
                {[
                  { num: '28', label: 'Years in Japan' },
                  { num: '41', label: 'Countries Travelled' },
                  { num: 'PhD', label: 'Nagoya Uni, Japan' },
                  { num: '4', label: 'Languages' }
                ].map((stat, idx) => (
                  <div key={idx} style={{
                    padding: '12px 16px',
                    borderRight: '1px solid rgba(201,147,58,0.12)',
                    borderBottom: '1px solid rgba(201,147,58,0.12)',
                    minWidth: '120px',
                    flex: '1 1 50%',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '8px'
                  }}>
                    <div style={{
                      fontFamily: "'Jost', Arial, sans-serif",
                      fontWeight: 300,
                      fontSize: 'clamp(20px, 2.2vw, 32px)',
                      color: '#F5F1EB',
                      lineHeight: '1.2',
                      flexShrink: 0
                    }}>{stat.num}</div>
                    <div style={{
                      fontFamily: "'Jost', Arial, sans-serif",
                      fontSize: '11px',
                      fontWeight: 500,
                      letterSpacing: '0.08em',
                      color: '#E8E4DC',
                      textTransform: 'uppercase',
                      lineHeight: '1.2',
                      whiteSpace: 'nowrap'
                    }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Block 4: Buttons */}
              <div style={{
                marginTop: isMobile ? '24px' : '0px',
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap'
              }}>
                <button 
                  onClick={() => {
                    const gallerySection = document.getElementById('founder-gallery');
                    if (gallerySection) {
                      gallerySection.scrollIntoView({ behavior: 'smooth' });
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
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                  VIEW GALLERY
                </button>
              </div>
            </div>
          </div>
        </div>

            {/* CHAPTER 2 — HER STORY */}
            <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
              
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
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '48px', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '36px', color: '#1C1917', marginBottom: '20px' }}>The Student Who Stayed</h2>
                    <div style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '16px', color: '#4A4540', lineHeight: '1.7' }}>
                      <p style={{ marginBottom: '20px', textAlign: 'justify' }}>I landed in Japan in 1998 — a young woman from Tamil Nadu with one suitcase, a scholarship, and a fire that refused to stay small.</p>
                      <p style={{ marginBottom: '20px', textAlign: 'justify' }}>My parents gave me one thing for this journey — a one-way ticket. Just one. Everything after that was mine to earn.</p>
                      <p style={{ marginBottom: '20px', textAlign: 'justify' }}>I didn't speak Japanese. I didn't know many people. The city was vast, the silence was loud, and the loneliness was real. But I didn't come this far to turn back.</p>
                      <p style={{ marginBottom: '20px', textAlign: 'justify' }}>I learned Japanese — not from textbooks, but from the streets, the people, and over <strong>40 part-time jobs</strong> that taught me more than any classroom ever could. I spoke before I was ready. I failed before I succeeded. And every single time I fell, I got up speaking better, standing taller, and believing harder.</p>
                      <p style={{ textAlign: 'justify' }}>Japan didn't hand me anything on a silver plate. I struggled for it. I fought for it. I earned it — <strong>word by word, year by year, trust by trust.</strong></p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', maxWidth: '400px', margin: '0 auto', width: '100%' }}>
                    {(() => {
                      const photo = getEraPhoto('student-phd', 0);
                      const url = photo ? containThumbnailImageUrl(photo.image) : null;
                      return (
                        <div style={{ aspectRatio: '1/1', backgroundColor: '#E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D4CFC9', position: 'relative', overflow: 'hidden' }}>
                          {url ? (
                            <LazyImage src={url} alt="Student Life" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                          ) : (
                            <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Student Life Era</span>
                          )}
                        </div>
                      );
                    })()}
                    {(() => {
                      const photo = getEraPhoto('student-phd', 1);
                      const url = photo ? containThumbnailImageUrl(photo.image) : null;
                      return (
                        <div style={{ aspectRatio: '1/1', backgroundColor: '#E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D4CFC9', position: 'relative', overflow: 'hidden' }}>
                          {url ? (
                            <LazyImage src={url} alt="PhD" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                          ) : (
                            <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>PhD Era</span>
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
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '48px', alignItems: 'center' }}>
                  <div style={{ order: isMobile ? 1 : 2 }}>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '36px', color: '#1C1917', marginBottom: '20px' }}>A Career Built on Trust</h2>
                    <div style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '16px', color: '#4A4540', lineHeight: '1.7' }}>
                      <p style={{ marginBottom: '20px', textAlign: 'justify' }}>I was accepted into <strong>Nagoya University — home to</strong> seven Nobel laureates — and pursued my PhD. I worked with the <strong>United Nations University</strong> in Tokyo on issues that shape the future of nations. When the <strong>2004 Tsunami</strong> struck, I wasn't watching from a distance — I was on the ground, coordinating disaster relief with <strong>JICA</strong>, translating not just languages, but life-or-death urgency. I interpreted for the <strong>Refugee Assistance Headquarters</strong> in Tokyo — proceedings where a single sentence could save a family.</p>
                      <p style={{ marginBottom: '20px', textAlign: 'justify' }}>I led <strong>India's first Women's Everest Base Camp Expedition</strong> from Tamil Nadu — sponsored by then Chief Minister <strong>Dr. J. Jayalalitha</strong>. I carried <strong>India's flag at the Asian Games</strong>. I presented research alongside <strong>Dr. M.S. Swaminathan</strong> — the father of India's Green Revolution — at international conferences across the world. I was a state-level volleyball player, a striker in Tamil Nadu.</p>
                      <p style={{ textAlign: 'justify' }}><strong>None of it was given. All of it was built — with bare hands and an unbreakable will.</strong></p>
                    </div>
                  </div>
                  <div style={{ order: isMobile ? 2 : 1, display: 'grid', gridTemplateColumns: '1fr', gap: '16px', maxWidth: '400px', margin: '0 auto', width: '100%' }}>
                    {(() => {
                      const photo = getEraPhoto('achievements', 0);
                      const url = photo ? containThumbnailImageUrl(photo.image) : null;
                      return (
                        <div style={{ aspectRatio: '1/1', backgroundColor: '#E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D4CFC9', position: 'relative', overflow: 'hidden' }}>
                          {url ? (
                            <LazyImage src={url} alt="Achievements" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                          ) : (
                            <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Achievements</span>
                          )}
                        </div>
                      );
                    })()}
                    {(() => {
                      const photo = getEraPhoto('news-media', 0);
                      const url = photo ? containThumbnailImageUrl(photo.image) : null;
                      return (
                        <div style={{ aspectRatio: '1/1', backgroundColor: '#E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D4CFC9', position: 'relative', overflow: 'hidden' }}>
                          {url ? (
                            <LazyImage src={url} alt="News Media" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                          ) : (
                            <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>News Media</span>
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
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '48px', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '36px', color: '#1C1917', marginBottom: '20px' }}>And Then There Was the World Beyond</h2>
                    <div style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '16px', color: '#4A4540', lineHeight: '1.7' }}>
                      <p style={{ marginBottom: '20px', textAlign: 'justify' }}>Since the year 2000, I have solo backpacked across <strong>forty-one countries</strong> — not as a tourist, but as a student of the world. I took <strong>30 low-cost flights in 30 days</strong> across Europe — before the EU was even formed. One night in Czech Republic, I was pulled off a train by border security in the middle of darkness and taken to a police station. A different woman might have stopped there. But when your will is made of steel — <strong>nothing scares your soul. Nothing can touch your core.</strong></p>
                      <p style={{ marginBottom: '20px', textAlign: 'justify' }}>Through it all, Japan showed me something I carry to this day — that true strength is silent, like an undercurrent in the ocean — <strong>invisible, yet unstoppable.</strong> That respect is earned through action, not words. That overwhelming kindness from strangers needs no common language. That discipline and grace can live together in everything you do.</p>
                      <p style={{ marginBottom: '20px', textAlign: 'justify' }}>And India — my India — reminded me of something equally powerful: <strong>that no matter how far you go, your roots are your greatest strength.</strong></p>
                      <p style={{ marginBottom: '20px', textAlign: 'justify' }}>Twenty-eight years in Japan. Four languages — Japanese, Tamil, Telugu, and English. Forty-one countries. Two cultures that live inside me. Countless experiences — some that broke me open, some that built me whole. <strong>One woman who refused to quit.</strong></p>
                      <p style={{ marginBottom: '20px', textAlign: 'justify' }}>Now, I'm building the bridge I once wished existed — between India and Japan — in language, culture, knowledge, and opportunity. So the next generation doesn't just dream across borders. <strong>They walk across them.</strong></p>
                      <p style={{ textAlign: 'justify' }}>Because if a girl from Tamil Nadu can land in Japan with nothing but a one-way ticket and turn 28 years of struggle into a life of purpose — <strong>so can you.</strong></p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', maxWidth: '400px', margin: '0 auto', width: '100%' }}>
                    {(() => {
                      const photo = getEraPhoto('world-travel', 0);
                      const url = photo ? containThumbnailImageUrl(photo.image) : null;
                      return (
                        <div style={{ aspectRatio: '1/1', backgroundColor: '#E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D4CFC9', position: 'relative', overflow: 'hidden' }}>
                          {url ? (
                            <LazyImage src={url} alt="World Travel" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                          ) : (
                            <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>World Travel</span>
                          )}
                        </div>
                      );
                    })()}
                    {(() => {
                      const photo = getEraPhoto('celebrity', 0);
                      const url = photo ? containThumbnailImageUrl(photo.image) : null;
                      return (
                        <div style={{ aspectRatio: '1/1', backgroundColor: '#E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D4CFC9', position: 'relative', overflow: 'hidden' }}>
                          {url ? (
                            <LazyImage src={url} alt="Celebrity" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                          ) : (
                            <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Celebrity Era</span>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

            </section>

            {/* CHAPTER 3 — TIMELINE */}
            <section style={{ backgroundColor: '#1C1917', color: '#FFFFFF', padding: '80px 20px' }}>
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '42px', textAlign: 'center', marginBottom: '60px', letterSpacing: '0.05em' }}>Journey Through Time</h2>
                
                <div style={{ position: 'relative', borderLeft: '2px solid rgba(201,147,58,0.3)', paddingLeft: '32px', marginLeft: '16px' }}>
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
                    <div key={i} style={{ position: 'relative', marginBottom: '48px' }}>
                      <div style={{ position: 'absolute', left: '-41px', top: '8px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#C9933A' }}></div>
                      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
                        <div>
                          <h3 style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '28px', color: '#C9933A', fontWeight: '400', marginBottom: '4px' }}>{event.year}</h3>
                          <h4 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '20px', marginBottom: '8px', lineHeight: '1.4' }}>{event.title}</h4>
                          <p style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '14px', color: '#9A948F', lineHeight: '1.6' }}>{event.desc}</p>
                        </div>
                        <div>
                          {(() => {
                            const photo = getEraPhoto(event.era);
                            const url = photo ? galleryImageUrl(photo.image) : null;
                            return (
                              <div style={{ aspectRatio: '16/9', backgroundColor: '#2C2420', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #4A4540', position: 'relative', overflow: 'hidden' }}>
                                {url ? (
                                  <>
                                    <LazyImage src={url} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                                    <button 
                                      onClick={() => handleEraClick(event.era)}
                                      style={{
                                        position: 'absolute',
                                        top: '12px',
                                        left: '12px',
                                        backgroundColor: 'rgba(28, 25, 23, 0.85)',
                                        fontFamily: "'Jost', Arial, sans-serif",
                                        fontSize: '15px',
                                        fontWeight: '700',
                                        letterSpacing: '0.22em',
                                        color: '#1C1917',
                                        background: 'linear-gradient(135deg, #FFE082 0%, #C9933A 50%, #A17124 100%)',
                                        border: '2px solid #FFFFFF',
                                        borderRadius: '4px',
                                        padding: '16px 36px',
                                        textTransform: 'uppercase',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        cursor: 'pointer',
                                        zIndex: 10,
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 0 25px rgba(201, 147, 58, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                                        whiteSpace: 'nowrap'
                                      }}
                                      onMouseOver={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #FFF8E1 0%, #E5A93C 50%, #B87F2A 100%)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 0 35px rgba(255, 224, 130, 0.95), 0 6px 20px rgba(0,0,0,0.4)';
                                      }}
                                      onMouseOut={(e) => {
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
                                      View Gallery
                                    </button>
                                  </>
                                ) : (
                                  <div style={{ padding: '16px', textAlign: 'center', cursor: 'pointer' }} onClick={() => handleEraClick(event.era)}>
                                    <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', color: '#C9933A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{event.era} Era</span>
                                    <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '9px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Photos available in gallery below</span>
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
            <section id="founder-gallery" style={{ padding: '80px 20px', maxWidth: '1400px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '42px', textAlign: 'center', marginBottom: '48px', color: '#1C1917' }}>Kanmani's Life in Pictures</h2>
              
              {/* Era Filters */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '48px' }}>
                {ERAS.map(era => (
                  <button
                    key={era.id}
                    onClick={() => setActiveEra(era.id)}
                    style={{
                      fontFamily: "'Jost', Arial, sans-serif",
                      fontSize: '12px',
                      fontWeight: '500',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '8px 18px',
                      borderRadius: '20px',
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



          </div>

          {/* OUR STORY / COMPANY SECTIONS */}
          <div id="about-company">
            
            {/* OUR STORY SECTION */}
            <div style={{
              backgroundColor: '#FAFAF7',
              padding: isMobile ? '48px 20px' : '80px 60px',
              borderTop: '1px solid rgba(201,147,58,0.15)'
            }}>
              <div style={{
                maxWidth: '1300px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr',
                gap: isMobile ? '40px' : '80px',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '11px',
                    fontWeight: '500',
                    letterSpacing: '0.28em',
                    color: '#C9933A',
                    textTransform: 'uppercase',
                    marginBottom: '16px'
                  }}>OUR STORY</p>
                  <h2 style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 'clamp(28px, 3vw, 42px)',
                    fontWeight: '500',
                    color: '#1C1917',
                    letterSpacing: '0.05em',
                    marginBottom: '8px'
                  }}>
                    Built on Two Decades of Trust
                  </h2>
                  <div style={{
                    width: '48px', height: '1px',
                    backgroundColor: '#C9933A', marginBottom: '24px'
                  }}/>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '18px',
                    color: '#2C2420',
                    lineHeight: '1.9',
                    marginBottom: '20px'
                  }}>
                    Kanmani Tours was born from a unique position — a deep 
                    understanding of both Japanese and Indian culture, built 
                    over more than two decades of living between two worlds.
                  </p>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '18px',
                    color: '#2C2420',
                    lineHeight: '1.9',
                    marginBottom: '20px'
                  }}>
                    We specialise exclusively in journeys for Japanese 
                    travellers visiting India. Every detail — from our 
                    Japanese-speaking guides to our carefully chosen 
                    accommodations — is designed with the Japanese traveller 
                    in mind.
                  </p>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '18px',
                    color: '#2C2420',
                    lineHeight: '1.9'
                  }}>
                    Our tours are small, personal, and meticulously crafted. 
                    We do not run large group buses. We create intimate 
                    experiences that leave lasting impressions.
                  </p>
                </div>

                {/* IMAGE PLACEHOLDER */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gridTemplateRows: '240px 240px',
                  gap: '8px'
                }}>
                  {['Dr. Kanmani with\nJapanese guests', 'South India\nTemple Visit', 'Cultural\nExchange'].map((label, i) => (
                    <div key={i} style={{
                      backgroundColor: '#E8E4DC',
                      border: '1px solid #D4CFC9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: '8px',
                      gridColumn: i === 0 ? 'span 2' : 'span 1',
                      gridRow: i === 0 ? 'span 1' : 'span 1',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        fontFamily: "'Jost', Arial, sans-serif",
                        fontSize: '10px',
                        letterSpacing: '0.2em',
                        color: '#9A948F',
                        textTransform: 'uppercase'
                      }}>Photo {i + 1}</div>
                      <div style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '14px',
                        color: '#6B6560',
                        textAlign: 'center',
                        whiteSpace: 'pre-line'
                      }}>{label}</div>

                      <img
                        src={`/assets/img/about/about-${i + 1}.jpg`}
                        alt={label.replace('\n', ' ')}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          zIndex: 3
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* VALUES SECTION */}
            <div style={{
              backgroundColor: '#FAFAF7',
              padding: isMobile ? '48px 20px' : '80px 60px',
              borderTop: '1px solid rgba(201,147,58,0.15)'
            }}>
              <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                <p style={{
                  fontFamily: "'Jost', Arial, sans-serif",
                  fontSize: '11px',
                  fontWeight: '500',
                  letterSpacing: '0.28em',
                  color: '#C9933A',
                  textTransform: 'uppercase',
                  marginBottom: '16px'
                }}>WHY CHOOSE US</p>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(28px, 3vw, 42px)',
                  fontWeight: '500',
                  color: '#1C1917',
                  letterSpacing: '0.05em',
                  marginBottom: '8px'
                }}>What Makes Us Different</h2>
                <div style={{
                  width: '48px', height: '1px',
                  backgroundColor: '#C9933A', marginBottom: '48px'
                }}/>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                  gap: isMobile ? '16px' : '2px'
                }}>
                  {[
                    {
                      number: '01',
                      title: 'Japanese First',
                      body: 'Every aspect of our service is designed specifically for Japanese travellers. Our guides speak fluent Japanese, our communications are in Japanese, and we understand Japanese expectations of quality and service.'
                    },
                    {
                      number: '02',
                      title: 'Small Groups Only',
                      body: 'We cap every tour at 12 guests maximum. This means personalised attention, flexibility in the schedule, and a more authentic experience. You travel as a guest, not a number.'
                    },
                    {
                      number: '03',
                      title: 'Real Connections',
                      body: 'We do not just show you India — we connect you with it. Private temple access, family home visits, cooking with local chefs, and meeting artists in their studios. Real India, not tourist India.'
                    },
                    {
                      number: '04',
                      title: 'End-to-End Care',
                      body: 'From the moment you land in India to the moment you depart, we handle everything. Transfers, accommodation, meals, activities, and 24/7 emergency support throughout your journey.'
                    },
                    {
                      number: '05',
                      title: 'Two Decades of Trust',
                      body: 'Kanmani Tours was not built overnight. Our reputation has been earned through more than 25 years of consistently delivering extraordinary experiences for Japanese travellers.'
                    },
                    {
                      number: '06',
                      title: 'Cultural Bridge',
                      body: 'Our founder\'s unique position — Indian born, Japan educated — means we truly understand both cultures. We bridge the gap in a way no other tour company can.'
                    },
                  ].map(({ number, title, body }) => (
                    <div key={number} style={{
                      backgroundColor: '#FFFFFF',
                      padding: '40px 36px',
                      border: '1px solid #E8E4DC',
                      borderLeft: '3px solid #C9933A'
                    }}>
                      <div style={{
                        fontFamily: "'Jost', Arial, sans-serif",
                        fontSize: '11px',
                        color: '#C9933A',
                        letterSpacing: '0.22em',
                        marginBottom: '16px'
                      }}>{number}</div>
                      <h3 style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '22px',
                        fontWeight: '500',
                        color: '#1C1917',
                        letterSpacing: '0.04em',
                        marginBottom: '12px'
                      }}>{title}</h3>
                      <p style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '16px',
                        color: '#4A4540',
                        lineHeight: '1.7'
                      }}>{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>


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
                  src={containThumbnailImageUrl(photo.image)}
                  lqip={photo.image?.asset?.metadata?.lqip}
                  alt="Thumbnail"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center'
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
