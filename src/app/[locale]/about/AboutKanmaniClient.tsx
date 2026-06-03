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

interface AboutKanmaniClientProps {
  locale: string;
  photos: FounderPhoto[];
}

const ERAS = [
  { id: 'all', label: 'All Photos' },
  { id: 'student', label: 'Student Life' },
  { id: 'phd', label: 'PhD & Academic' },
  { id: 'humanitarian', label: 'Humanitarian' },
  { id: 'tours', label: 'Tours' },
  { id: 'celebrity', label: 'Celebrity' },
  { id: 'conferences', label: 'Conferences' },
  { id: 'recent', label: 'Recent' },
  { id: 'news-media', label: 'News & Media' }
];

export default function AboutKanmaniClient({ locale, photos }: AboutKanmaniClientProps) {
  const isJa = locale === 'ja';
  
  // Layout state
  const [windowWidth, setWindowWidth] = useState(1200);
  const [activeSection, setActiveSection] = useState<'founder' | 'company'>('founder');

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handler = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
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

  const getEraPhoto = (eraId: string) => {
    const eraPhotos = photos.filter(p => p.era === eraId);
    const featured = eraPhotos.find(p => p.featured);
    return featured || eraPhotos[0];
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
    const displayPhotos = isExpanded ? eraPhotos : eraPhotos.slice(0, 8);

    return (
      <div key={eraId} style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '24px', color: '#1C1917' }}>{eraLabel}</h3>
          <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', color: '#9A948F', backgroundColor: '#E8E4DC', padding: '2px 8px', borderRadius: '10px' }}>
            {eraPhotos.length} photos
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          {displayPhotos.map((photo, index) => {
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
                      objectFit: 'contain',
                      transition: 'transform 0.5s ease'
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {!isExpanded && eraPhotos.length > 8 && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button 
              onClick={() => toggleExpandEra(eraId)}
              style={{
                fontFamily: "'Jost', Arial, sans-serif",
                fontSize: '12px',
                fontWeight: '500',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#1C1917',
                backgroundColor: 'transparent',
                border: '1px solid #1C1917',
                padding: '8px 24px',
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
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#FAFAF7', minHeight: '100vh', position: 'relative' }}>
      
      {/* DR. KANMANI 5-CHAPTER BIOGRAPHY */}
      <div id="about-founder">
        
        {/* CHAPTER 1 — HERO */}
        <div style={{
          backgroundColor: '#1C1917',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'stretch',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          {/* LEFT SIDE — Image panel */}
          <div style={{
            width: isMobile ? '100%' : '50%',
            height: 'auto',
            minHeight: isMobile ? '60vw' : '100vh',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#111010',
            flexShrink: 0
          }}>
            <img 
              src="/assets/img/about-kanmani/founder-hero.jpg" 
              alt="Dr. Kanmani"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center center',
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
              height: '45%',
              background: 'linear-gradient(to top, #1C1917 0%, rgba(28,25,23,0.7) 30%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 1
            }} />
          </div>

          {/* RIGHT SIDE — Details panel */}
          <div style={{
            width: isMobile ? '100%' : '50%',
            backgroundColor: '#1C1917',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: isMobile ? '32px 20px' : '80px 56px',
            borderLeft: isMobile ? 'none' : '1px solid rgba(201,147,58,0.15)',
            minHeight: isMobile ? 'auto' : '100vh',
            height: 'auto',
            overflow: 'visible'
          }}>
            {/* Gold Label */}
            <p style={{
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.32em',
              color: '#C9933A',
              textTransform: 'uppercase',
              marginBottom: '20px'
            }}>THE FOUNDER</p>

            {/* Name */}
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(40px, 5vw, 72px)',
              fontWeight: 400,
              color: '#F5F1EB',
              letterSpacing: '0.06em',
              marginBottom: '12px'
            }}>Dr. Kanmani</h1>

            {/* Title Row */}
            <p style={{
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '0.22em',
              color: '#C9933A',
              lineHeight: 1.8,
              marginBottom: '36px'
            }}>PhD SCHOLAR · INTERPRETER · HUMANITARIAN · FOUNDER</p>

            {/* Divider */}
            <div style={{
              width: '56px',
              height: '1px',
              backgroundColor: '#C9933A',
              marginBottom: '36px'
            }} />

            {/* Stats Grid */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0
            }}>
              {[
                { num: '28', label: 'Years in Japan' },
                { num: '41', label: 'Countries' },
                { num: '4', label: 'Languages' },
                { num: 'PhD', label: 'Nagoya University' }
              ].map((stat, idx) => (
                <div key={idx} style={{
                  padding: '24px 28px',
                  borderRight: '1px solid rgba(201,147,58,0.12)',
                  borderBottom: '1px solid rgba(201,147,58,0.12)',
                  minWidth: '160px',
                  flex: '1 1 calc(50% - 10px)',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '12px'
                }}>
                  <div style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontWeight: 300,
                    fontSize: 'clamp(28px, 3vw, 42px)',
                    color: '#F5F1EB',
                    lineHeight: '1.2'
                  }}>{stat.num}</div>
                  <div style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.12em',
                    color: '#E8E4DC',
                    textTransform: 'uppercase',
                    lineHeight: '1.2'
                  }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quote Block */}
            <div style={{
              marginTop: '36px',
              paddingTop: '36px',
              borderTop: '1px solid rgba(201,147,58,0.12)'
            }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(17px, 1.8vw, 22px)',
                fontStyle: 'italic',
                fontWeight: 400,
                color: '#D4CFC9',
                lineHeight: 1.8,
                marginBottom: '16px'
              }}>
                "I came to Japan carrying one suitcase and a curiosity about the world. Twenty-eight years later, I carry two countries in my heart."
              </p>
              <p style={{
                fontFamily: "'Jost', Arial, sans-serif",
                fontSize: '12px',
                color: '#6B6560',
                letterSpacing: '0.14em'
              }}>
                — Dr. Kanmani
              </p>
            </div>

            {/* Buttons */}
            <div style={{
              marginTop: '36px',
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
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(201,147,58,0.4)',
                  color: '#F5F1EB',
                  padding: '14px 32px',
                  fontFamily: "'Jost', Arial, sans-serif",
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                View Gallery
              </button>
            </div>
          </div>
        </div>

            {/* CHAPTER 2 — HER STORY */}
            <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
              
              {/* Section A */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '48px', alignItems: 'center', marginBottom: '80px' }}>
                <div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '36px', color: '#1C1917', marginBottom: '20px' }}>The Student Who Stayed</h2>
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '18px', color: '#4A4540', lineHeight: '1.8' }}>
                    <p style={{ marginBottom: '20px' }}>Arriving in Japan in 1998 for postgraduate studies, Dr. Kanmani experienced a profound culture shock that quickly transformed into a deep, enduring love for the country and its people. The meticulous attention to detail, the unspoken understanding in omotenashi (hospitality), and the resilience of the Japanese spirit resonated with her own values.</p>
                    <p>Choosing to pursue her PhD at Nagoya University rather than returning home, she immersed herself in academic life and cultural nuances. Over 28 years, she meticulously built a life between two worlds—bridging her Indian heritage with her chosen Japanese home, laying the foundation for a unique intercultural perspective.</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {(() => {
                    const photo = getEraPhoto('student');
                    const url = photo ? galleryImageUrl(photo.image) : null;
                    return (
                      <div style={{ aspectRatio: '1/1', backgroundColor: '#E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D4CFC9', position: 'relative', overflow: 'hidden' }}>
                        {url ? (
                          <LazyImage src={url} alt="Student Life" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                          <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Student Life Era</span>
                        )}
                      </div>
                    );
                  })()}
                  {(() => {
                    const photo = getEraPhoto('phd');
                    const url = photo ? galleryImageUrl(photo.image) : null;
                    return (
                      <div style={{ aspectRatio: '1/1', backgroundColor: '#E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D4CFC9', position: 'relative', overflow: 'hidden' }}>
                        {url ? (
                          <LazyImage src={url} alt="PhD" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                          <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>PhD Era</span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Section B */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '48px', alignItems: 'center', marginBottom: '80px' }}>
                <div style={{ order: isMobile ? 1 : 2 }}>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '36px', color: '#1C1917', marginBottom: '20px' }}>A Career Built on Trust</h2>
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '18px', color: '#4A4540', lineHeight: '1.8' }}>
                    <p style={{ marginBottom: '20px' }}>Dr. Kanmani’s professional trajectory is a testament to her linguistic mastery and humanitarian commitment. Serving as a Programme Coordinator at the United Nations University (UNU) in Tokyo, she tackled complex global issues from climate resilience to human mobility. During the devastating 2004 Indian Ocean Tsunami, she operated as a Disaster Relief Coordinator for JICA and the Government of Sri Lanka, managing critical on-the-ground recovery efforts.</p>
                    <p>For over two decades, she has been a trusted voice in high-stakes environments—working as an interpreter for the Refugee Assistance Headquarters in Tokyo on sensitive legal and child protection proceedings, leading VIP diplomatic delegations, and presenting research alongside the legendary Dr. M.S. Swaminathan at international conferences worldwide.</p>
                  </div>
                </div>
                <div style={{ order: isMobile ? 2 : 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {(() => {
                    const photo = getEraPhoto('humanitarian');
                    const url = photo ? galleryImageUrl(photo.image) : null;
                    return (
                      <div style={{ aspectRatio: '1/1', backgroundColor: '#E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D4CFC9', position: 'relative', overflow: 'hidden' }}>
                        {url ? (
                          <LazyImage src={url} alt="Humanitarian" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                          <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Humanitarian Era</span>
                        )}
                      </div>
                    );
                  })()}
                  {(() => {
                    const photo = getEraPhoto('conferences');
                    const url = photo ? galleryImageUrl(photo.image) : null;
                    return (
                      <div style={{ aspectRatio: '1/1', backgroundColor: '#E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D4CFC9', position: 'relative', overflow: 'hidden' }}>
                        {url ? (
                          <LazyImage src={url} alt="Conferences" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                          <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Conferences Era</span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Section C */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '48px', alignItems: 'center', marginBottom: '80px' }}>
                <div style={{ order: isMobile ? 1 : 2 }}>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '36px', color: '#1C1917', marginBottom: '20px' }}>Building the Bridge</h2>
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '18px', color: '#4A4540', lineHeight: '1.8' }}>
                    <p style={{ marginBottom: '20px' }}>Founding Kanmani Tours was the natural culmination of her life's work. It was born from a desire to show Japanese tourists the authentic heart of India—moving beyond commercial stereotypes to facilitate genuine, transformative cultural exchanges based on mutual respect and shared humanity.</p>
                    <p>Her philosophy is rooted in providing “not borrowed wisdom but lived proof.” As a motivational speaker and tour director, she ensures that every itinerary crafted by Kanmani Tours serves as a bridge, allowing travelers to experience the profound spiritual, historical, and daily realities of India through the lens of someone who intimately understands both cultures.</p>
                  </div>
                </div>
                <div style={{ order: isMobile ? 2 : 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {(() => {
                    const photo = getEraPhoto('tours');
                    const url = photo ? galleryImageUrl(photo.image) : null;
                    return (
                      <div style={{ aspectRatio: '1/1', backgroundColor: '#E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D4CFC9', position: 'relative', overflow: 'hidden' }}>
                        {url ? (
                          <LazyImage src={url} alt="Tours" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                          <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Tours Era</span>
                        )}
                      </div>
                    );
                  })()}
                  {(() => {
                    const photo = getEraPhoto('celebrity');
                    const url = photo ? galleryImageUrl(photo.image) : null;
                    return (
                      <div style={{ aspectRatio: '1/1', backgroundColor: '#E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D4CFC9', position: 'relative', overflow: 'hidden' }}>
                        {url ? (
                          <LazyImage src={url} alt="Celebrity" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                          <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Celebrity Era</span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>


            </section>

            {/* CHAPTER 3 — TIMELINE */}
            <section style={{ backgroundColor: '#1C1917', color: '#FFFFFF', padding: '80px 20px' }}>
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '42px', textAlign: 'center', marginBottom: '60px', letterSpacing: '0.05em' }}>Journey Through Time</h2>
                
                <div style={{ position: 'relative', borderLeft: '2px solid rgba(201,147,58,0.3)', paddingLeft: '32px', marginLeft: '16px' }}>
                  {[
                    { year: '1998', title: 'Arrived in Japan for postgraduate studies', desc: 'The beginning of a 28-year journey.', era: 'student' },
                    { year: '2001', title: 'Began PhD research at Nagoya University', desc: 'Immersing in academia and cross-cultural studies.', era: 'phd' },
                    { year: '2004', title: 'JICA Tsunami Relief Coordinator, Sri Lanka', desc: 'Managing critical on-the-ground disaster recovery.', era: 'humanitarian' },
                    { year: '2006', title: 'Completed PhD, Nagoya University', desc: 'Achieving the highest academic milestone in Japan.', era: 'phd' },
                    { year: '2008', title: 'Founded Kanmani Tours', desc: 'Creating the ultimate bridge between Japan and India.', era: 'tours' },
                    { year: '2012', title: 'First celebrity fan tour to South India', desc: 'Opening new avenues for cultural exchange.', era: 'celebrity' },
                    { year: '2015', title: 'International conference speaker alongside Dr. M.S. Swaminathan', desc: 'Discussing global agricultural and climate challenges.', era: 'conferences' },
                    { year: '2019', title: 'Expanded tours, 500+ Japanese guests served', desc: 'Growing the community of India-Japan travelers.', era: 'tours' },
                    { year: '2022', title: 'Post-pandemic revival of Japan-India travel', desc: 'Welcoming guests back to the heart of India.', era: 'recent' },
                    { year: '2026', title: 'Continuing the journey', desc: 'Looking ahead to the next chapter of connection.', era: 'recent' }
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
                                    <LazyImage src={url} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
                                        zIndex: 10,
                                        transition: 'all 0.3s ease',
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
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '42px', textAlign: 'center', marginBottom: '48px', color: '#1C1917' }}>A Life in Pictures</h2>
              
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

            {/* CHAPTER 5 — CLOSING */}
            <section style={{ backgroundColor: '#1C1917', color: '#FFFFFF', padding: '80px 20px', textAlign: 'center' }}>
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ width: '2px', height: '40px', backgroundColor: '#C9933A', margin: '0 auto 32px' }}></div>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(24px, 3.5vw, 36px)', fontStyle: 'italic', lineHeight: '1.5', color: '#E8E4DC', marginBottom: '48px' }}>
                  "Every journey I have taken — across 41 countries, across disciplines, across cultures — has led me back to the same truth. Connection is everything."
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a href={`/${locale}/tours`} style={{
                    display: 'inline-block',
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '13px',
                    fontWeight: '500',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#1C1917',
                    backgroundColor: '#C9933A',
                    padding: '12px 36px',
                    textDecoration: 'none',
                    transition: 'background-color 0.3s ease'
                  }}>
                    Explore Tours
                  </a>
                  <a href={`/${locale}/contact`} style={{
                    display: 'inline-block',
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '13px',
                    fontWeight: '500',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#FFFFFF',
                    backgroundColor: 'transparent',
                    border: '1px solid #FFFFFF',
                    padding: '12px 36px',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    Contact Us
                  </a>
                </div>
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
