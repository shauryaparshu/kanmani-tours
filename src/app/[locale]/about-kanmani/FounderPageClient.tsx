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

interface FounderPageClientProps {
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
  { id: 'recent', label: 'Recent' }
];

export default function FounderPageClient({ locale, photos }: FounderPageClientProps) {
  const isJa = locale === 'ja';
  
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
    const displayPhotos = isExpanded ? eraPhotos : eraPhotos.slice(0, 8);

    return (
      <div key={eraId} style={{ marginBottom: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '32px', color: '#1C1917' }}>{eraLabel}</h3>
          <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '12px', color: '#9A948F', backgroundColor: '#E8E4DC', padding: '4px 12px', borderRadius: '12px' }}>
            {eraPhotos.length} photos
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
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
                    alt={isJa ? photo.captionJa || '' : photo.caption || ''}
                    lqip={photo.image?.asset?.metadata?.lqip}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {!isExpanded && eraPhotos.length > 8 && (
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button 
              onClick={() => toggleExpandEra(eraId)}
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
      </div>
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
            objectPosition: 'center top',
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
            fontSize: '12px',
            fontWeight: 400,
            letterSpacing: '0.28em',
            color: '#C9933A',
            textTransform: 'uppercase',
            marginBottom: '40px'
          }}>PHD SCHOLAR · INTERPRETER · HUMANITARIAN · FOUNDER</p>

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
              <div style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', letterSpacing: '0.2em', color: '#9A948F', textTransform: 'uppercase', marginTop: '4px' }}>Years in Japan</div>
            </div>

            <div style={{ width: '1px', height: '40px', backgroundColor: 'rgba(201,147,58,0.2)' }} />

            {/* Stat 2 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Jost', Arial, sans-serif", fontWeight: 300, fontSize: 'clamp(32px, 4vw, 48px)', color: '#F5F1EB', lineHeight: '1.2' }}>41</div>
              <div style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', letterSpacing: '0.2em', color: '#9A948F', textTransform: 'uppercase', marginTop: '4px' }}>Countries</div>
            </div>

            <div style={{ width: '1px', height: '40px', backgroundColor: 'rgba(201,147,58,0.2)' }} />

            {/* Stat 3 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Jost', Arial, sans-serif", fontWeight: 300, fontSize: 'clamp(32px, 4vw, 48px)', color: '#F5F1EB', lineHeight: '1.2' }}>4</div>
              <div style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', letterSpacing: '0.2em', color: '#9A948F', textTransform: 'uppercase', marginTop: '4px' }}>Languages</div>
            </div>

            <div style={{ width: '1px', height: '40px', backgroundColor: 'rgba(201,147,58,0.2)' }} />

            {/* Stat 4 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Jost', Arial, sans-serif", fontWeight: 300, fontSize: 'clamp(32px, 4vw, 48px)', color: '#F5F1EB', lineHeight: '1.2' }}>PhD</div>
              <div style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', letterSpacing: '0.2em', color: '#9A948F', textTransform: 'uppercase', marginTop: '4px' }}>Nagoya University</div>
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
          "I came to Japan carrying one suitcase and a curiosity about the world. Twenty-eight years later, I carry two countries in my heart."
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center', marginBottom: '120px' }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '42px', color: '#1C1917', marginBottom: '24px' }}>The Student Who Stayed</h2>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '20px', color: '#4A4540', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '24px' }}>Arriving in Japan in 1998 for postgraduate studies, Dr. Kanmani experienced a profound culture shock that quickly transformed into a deep, enduring love for the country and its people. The meticulous attention to detail, the unspoken understanding in omotenashi (hospitality), and the resilience of the Japanese spirit resonated with her own values.</p>
              <p>Choosing to pursue her PhD at Nagoya University rather than returning home, she immersed herself in academic life and cultural nuances. Over 28 years, she meticulously built a life between two worlds—bridging her Indian heritage with her chosen Japanese home, laying the foundation for a unique intercultural perspective.</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ aspectRatio: '4/3', backgroundColor: '#E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D4CFC9' }}>
              <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '12px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Student Life Era</span>
            </div>
            <div style={{ aspectRatio: '4/3', backgroundColor: '#E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D4CFC9' }}>
              <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '12px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>PhD Era</span>
            </div>
          </div>
        </div>

        {/* Section B */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center', marginBottom: '120px' }}>
          <div style={{ order: 2 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '42px', color: '#1C1917', marginBottom: '24px' }}>A Career Built on Trust</h2>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '20px', color: '#4A4540', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '24px' }}>Dr. Kanmani’s professional trajectory is a testament to her linguistic mastery and humanitarian commitment. Serving as a Programme Coordinator at the United Nations University (UNU) in Tokyo, she tackled complex global issues from climate resilience to human mobility. During the devastating 2004 Indian Ocean Tsunami, she operated as a Disaster Relief Coordinator for JICA and the Government of Sri Lanka, managing critical on-the-ground recovery efforts.</p>
              <p>For over two decades, she has been a trusted voice in high-stakes environments—working as an interpreter for the Refugee Assistance Headquarters in Tokyo on sensitive legal and child protection proceedings, leading VIP diplomatic delegations, and presenting research alongside the legendary Dr. M.S. Swaminathan at international conferences worldwide.</p>
            </div>
          </div>
          <div style={{ order: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ aspectRatio: '4/3', backgroundColor: '#E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D4CFC9' }}>
              <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '12px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Humanitarian Era</span>
            </div>
            <div style={{ aspectRatio: '4/3', backgroundColor: '#E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D4CFC9' }}>
              <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '12px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Conferences Era</span>
            </div>
          </div>
        </div>

        {/* Section C */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center', marginBottom: '120px' }}>
          <div style={{ order: 2 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '42px', color: '#1C1917', marginBottom: '24px' }}>Building the Bridge</h2>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '20px', color: '#4A4540', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '24px' }}>Founding Kanmani Tours was the natural culmination of her life's work. It was born from a desire to show Japanese tourists the authentic heart of India—moving beyond commercial stereotypes to facilitate genuine, transformative cultural exchanges based on mutual respect and shared humanity.</p>
              <p>Her philosophy is rooted in providing “not borrowed wisdom but lived proof.” As a motivational speaker and tour director, she ensures that every itinerary crafted by Kanmani Tours serves as a bridge, allowing travelers to experience the profound spiritual, historical, and daily realities of India through the lens of someone who intimately understands both cultures.</p>
            </div>
          </div>
          <div style={{ order: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ aspectRatio: '4/3', backgroundColor: '#E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D4CFC9' }}>
              <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '12px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tours Era</span>
            </div>
            <div style={{ aspectRatio: '4/3', backgroundColor: '#E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D4CFC9' }}>
              <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '12px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Celebrity Era</span>
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
              <div key={i} style={{ position: 'relative', marginBottom: '64px' }}>
                <div style={{ position: 'absolute', left: '-49px', top: '0', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#C9933A' }}></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
                  <div>
                    <h3 style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '32px', color: '#C9933A', fontWeight: '400', marginBottom: '8px' }}>{event.year}</h3>
                    <h4 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '24px', marginBottom: '12px', lineHeight: '1.4' }}>{event.title}</h4>
                    <p style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '15px', color: '#9A948F', lineHeight: '1.6' }}>{event.desc}</p>
                  </div>
                  <div>
                    <div style={{ aspectRatio: '16/9', backgroundColor: '#2C2420', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid #4A4540' }} onClick={() => setActiveEra(event.era)}>
                      <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '12px', color: '#C9933A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{event.era} Era</span>
                      <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '10px', color: '#9A948F', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Photos from this era available in gallery below</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHAPTER 4 — PHOTO GALLERY */}
      <section style={{ padding: '120px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '48px', textAlign: 'center', marginBottom: '64px', color: '#1C1917' }}>A Life in Pictures</h2>
        
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

      {/* CHAPTER 5 — CLOSING */}
      <section style={{ backgroundColor: '#1C1917', color: '#FFFFFF', padding: '120px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ width: '2px', height: '60px', backgroundColor: '#C9933A', margin: '0 auto 48px' }}></div>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(28px, 4vw, 42px)', fontStyle: 'italic', lineHeight: '1.5', color: '#E8E4DC', marginBottom: '64px' }}>
            "Every journey I have taken — across 41 countries, across disciplines, across cultures — has led me back to the same truth. Connection is everything."
          </p>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`/${locale}/tours`} style={{
              display: 'inline-block',
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: '14px',
              fontWeight: '500',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#1C1917',
              backgroundColor: '#C9933A',
              padding: '16px 48px',
              textDecoration: 'none',
              transition: 'background-color 0.3s ease'
            }}>
              Explore Tours
            </a>
            <a href={`/${locale}/contact`} style={{
              display: 'inline-block',
              fontFamily: "'Jost', Arial, sans-serif",
              fontSize: '14px',
              fontWeight: '500',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              backgroundColor: 'transparent',
              border: '1px solid #FFFFFF',
              padding: '16px 48px',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}>
              Contact Us
            </a>
          </div>
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
              <LazyImage 
                src={galleryImageUrl(lightboxPhoto.image)} 
                lqip={lightboxPhoto.image?.asset?.metadata?.lqip}
                alt="Fullscreen" 
                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
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
