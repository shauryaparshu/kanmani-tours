'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import LazyImage from './LazyImage';

export interface LightboxImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  lqip?: string;
  caption?: string;
  subCaption?: string;
  downloadUrl?: string;
  downloadName?: string;
}

interface UnifiedLightboxProps {
  images: LightboxImage[];
  initialIndex: number;
  onClose: () => void;
}

export default function UnifiedLightbox({ images, initialIndex, onClose }: UnifiedLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isHoveringLightbox, setIsHoveringLightbox] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const currentImage = images[currentIndex];
  
  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Touch swipe support for mobile navigation
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        goNext();
      } else {
        goPrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Close on Escape key and handle Arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goPrev, goNext, onClose]);

  // Track idle state (5 seconds)
  useEffect(() => {
    let idleTimeout: NodeJS.Timeout;
    
    const resetIdleTimer = () => {
      setIsIdle(false);
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        setIsIdle(true);
      }, 5000);
    };

    resetIdleTimer();

    const activityEvents = [
      'mousemove',
      'mousedown',
      'click',
      'keydown',
      'touchstart',
      'touchmove',
      'scroll',
      'wheel'
    ];

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetIdleTimer);
    });

    return () => {
      clearTimeout(idleTimeout);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };
  }, []);

  // Autoplay when idle
  useEffect(() => {
    if (!isIdle || images.length <= 1) return;

    const autoplayInterval = setInterval(() => {
      goNext();
    }, 4000);

    return () => {
      clearInterval(autoplayInterval);
    };
  }, [isIdle, goNext, images.length]);

  if (!images || images.length === 0) return null;

  return (
    <div
      onClick={onClose}
      onMouseEnter={() => setIsHoveringLightbox(true)}
      onMouseLeave={() => setIsHoveringLightbox(false)}
      className="unified-lightbox-wrapper"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 3, 2, 0.95)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        height: '100vh',
        maxHeight: '100dvh',
      }}
    >
      {/* Lightbox Header Row (ONE flex row in normal flow across the top) */}
      <div 
        className="lightbox-header-bar"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          paddingTop: 'max(12px, env(safe-area-inset-top, 12px))',
          paddingBottom: '12px',
          paddingLeft: 'max(12px, env(safe-area-inset-left, 12px))',
          paddingRight: 'max(12px, env(safe-area-inset-right, 12px))',
          zIndex: 10000,
          pointerEvents: 'auto',
          background: 'linear-gradient(to bottom, rgba(5, 3, 2, 0.88) 0%, rgba(5, 3, 2, 0.45) 75%, transparent 100%)',
        }}
      >
        {/* Left: Title block with ellipsis on one line each */}
        <div 
          className="lightbox-title-block"
          style={{
            flex: '1 1 auto',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            textAlign: 'left',
          }}
        >
          {currentImage.caption && (
            <h2 
              className="lightbox-title-left"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(17px, 1.8vw, 22px)',
                fontWeight: 700,
                color: '#FFB834',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: 1.25,
                letterSpacing: '0.02em',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)',
              }}
              title={currentImage.caption}
            >
              {currentImage.caption}
            </h2>
          )}
          {currentImage.subCaption && (
            <span 
              className="lightbox-location-sub"
              style={{
                fontFamily: "'Jost', Arial, sans-serif",
                fontSize: '12px',
                fontWeight: 500,
                color: '#FFF7E8',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: 1.3,
                letterSpacing: '0.04em',
                opacity: 0.9,
                textShadow: '0 2px 4px rgba(0,0,0,0.8)',
              }}
              title={currentImage.subCaption}
            >
              {currentImage.subCaption}
            </span>
          )}
        </div>

        {/* Right: Actions group (Download then Close) */}
        <div 
          className="lightbox-actions-group"
          style={{
            flexShrink: 0,
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          {currentImage.downloadUrl && (
            <a
              id="lightbox-download-button"
              href={currentImage.downloadUrl}
              download={currentImage.downloadName || true}
              rel="noopener"
              aria-label="Download photo"
              onClick={(e) => e.stopPropagation()}
              className="lightbox-download-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minWidth: '44px',
                minHeight: '44px',
                height: '44px',
                padding: '0 14px',
                backgroundColor: 'rgba(28, 25, 23, 0.85)',
                border: '1px solid rgba(201, 147, 58, 0.45)',
                borderRadius: '4px',
                color: '#C9933A',
                textDecoration: 'none',
                fontFamily: "'Jost', Arial, sans-serif",
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C9933A"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className="lightbox-download-label">Download</span>
            </a>
          )}

          {/* Close button - rightmost */}
          <button
            id="lightbox-close-button"
            type="button"
            onClick={onClose}
            className="lightbox-close-btn"
            aria-label="Close lightbox"
            style={{
              minWidth: '44px',
              minHeight: '44px',
              width: '44px',
              height: '44px',
              backgroundColor: 'rgba(28, 25, 23, 0.85)',
              border: '1px solid rgba(201, 147, 58, 0.4)',
              borderRadius: '4px',
              color: '#F5F1EB',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'border-color 0.3s ease, background-color 0.3s ease',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}
          >✕</button>
        </div>
      </div>

      {images.length > 1 && (
        <>
          {/* Previous photo card */}
          <button
            className="lightbox-nav-card prev-card"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
          >
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', overflow: 'hidden', backgroundColor: '#0A0807' }}>
              <LazyImage
                src={images[(currentIndex - 1 + images.length) % images.length].thumbnailUrl}
                lqip={images[(currentIndex - 1 + images.length) % images.length].lqip}
                alt="Previous photo preview"
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
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

          {/* Next photo card */}
          <button
            className="lightbox-nav-card next-card"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
          >
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', overflow: 'hidden', backgroundColor: '#0A0807' }}>
              <LazyImage
                src={images[(currentIndex + 1) % images.length].thumbnailUrl}
                lqip={images[(currentIndex + 1) % images.length].lqip}
                alt="Next photo preview"
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(5,3,2,0.55), transparent 60%)'
              }} />
            </div>
            <div className="nav-text" style={{
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

      {/* Main Content Area */}
      <div 
        className="lightbox-main-content"
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          width: '80vw',
          zIndex: 999 
        }}
      >
        {/* Image container below */}
        <div
          key={currentIndex}
          className="lightbox-image-box"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            position: 'relative',
            width: '100%',
            height: 'calc(100vh - 210px)',
            maxHeight: 'calc(100dvh - 210px)',
            animation: 'premiumLightboxFade 760ms cubic-bezier(0.16, 1, 0.3, 1) both',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.92)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.32), 0 0 24px rgba(255,255,255,0.16), 0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.02)'
          }}
        >
          {/* Page counter inside image box top right */}
          <div className="lightbox-counter" style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            fontFamily: "'Jost', Arial, sans-serif",
            fontSize: '24px',
            fontWeight: '700',
            letterSpacing: '0.12em',
            color: '#FFF7E8',
            background: 'rgba(10, 8, 7, 0.75)',
            border: '2px solid rgba(235,177,78,0.6)',
            padding: '10px 20px',
            borderRadius: '30px',
            zIndex: 10,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}>
            {currentIndex + 1} / {images.length}
          </div>
 
          <img
            src={currentImage.url}
            alt={currentImage.caption || 'Fullscreen'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        </div>
      </div>

      {/* Thumbnail strip at bottom */}
      <div 
        className="thumbnail-container"
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '6px',
          padding: '0px 12px 8px 12px',
          backgroundColor: 'transparent',
          maxWidth: '80vw',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          zIndex: 1000,
          pointerEvents: 'auto'
        }}
      >
        {images.map((photo, i) => (
          <button
            key={photo.id}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(i);
            }}
            className="thumbnail-btn"
            style={{
              flexBasis: '56px', // Square width base
              width: '56px',
              height: '56px',
              flexShrink: 0,
              position: 'relative',
              overflow: 'hidden',
              border: i === currentIndex
                ? '2px solid #C9933A'
                : '2px solid transparent',
              cursor: 'pointer',
              backgroundColor: '#000000',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), margin 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease',
              transformOrigin: 'bottom center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src={photo.thumbnailUrl}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                transition: 'transform 0.4s ease'
              }}
            />
          </button>
        ))}
      </div>

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
        .thumbnail-container {
          height: 80px;
          transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .thumbnail-container:hover {
          height: 380px;
        }
        .thumbnail-btn:hover {
          transform: scale(5);
          margin: 0 112px;
          z-index: 100;
          box-shadow: 0 10px 30px rgba(0,0,0,0.8);
          border-width: 0.5px !important; /* Counteract 5x scale for border */
        }
        .unified-lightbox-wrapper {
          height: 100vh;
          height: 100dvh;
          max-height: 100dvh;
        }
        .lightbox-title-left {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(16px, 1.8vw, 22px);
          font-weight: 700;
          color: #FFB834;
          margin: 0;
          text-align: left;
          letter-spacing: 0.03em;
          text-shadow: 0 2px 4px rgba(0,0,0,0.6);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 1.3;
        }
        .lightbox-nav-card {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: clamp(144px, 18vw, 255px);
          padding: 8px;
          border: 1px solid rgba(235,177,78,0.28);
          background: rgba(10,8,7,0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          cursor: pointer;
          zIndex: 10000;
          box-shadow: 0 18px 40px rgba(0,0,0,0.35);
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .lightbox-nav-card:hover {
          border-color: #EBB14E;
          transform: translateY(-50%) scale(1.03);
        }
        .prev-card { left: 48px; }
        .next-card { right: 48px; }

        .lightbox-download-btn:hover {
          border-color: #EBB14E !important;
          background: rgba(28, 24, 21, 0.95) !important;
          transform: translateY(-1px);
        }
        
        @media screen and (max-width: 1024px) {
          .lightbox-main-content {
            width: 92vw !important;
            margin-top: calc(max(12px, env(safe-area-inset-top, 12px)) + 52px) !important;
            margin-bottom: calc(max(12px, env(safe-area-inset-bottom, 12px)) + 76px) !important;
            max-height: calc(100vh - 160px) !important;
            max-height: calc(100dvh - 160px) !important;
          }
          .lightbox-image-box {
            height: calc(100vh - 160px) !important;
            height: calc(100dvh - 160px) !important;
            max-height: calc(100dvh - 160px) !important;
            border-radius: 8px !important;
          }
          .lightbox-counter {
            font-size: 13px !important;
            font-weight: 600 !important;
            padding: 4px 10px !important;
            top: 8px !important;
            right: 8px !important;
            border-width: 1px !important;
          }
          .lightbox-nav-card {
            width: 44px;
            height: 44px;
            padding: 0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(10,8,7,0.85);
          }
          .lightbox-nav-card > div {
            display: none;
          }
          .lightbox-nav-card::after {
            content: '';
            width: 12px;
            height: 12px;
            border-top: 2px solid #FFF7E8;
            border-right: 2px solid #FFF7E8;
            display: block;
          }
          .prev-card { left: 16px; }
          .prev-card::after { transform: rotate(-135deg); margin-left: 4px; }
          .next-card { right: 16px; }
          .next-card::after { transform: rotate(45deg); margin-right: 4px; }
          .thumbnail-container {
            bottom: max(8px, env(safe-area-inset-bottom, 8px)) !important;
            max-width: 95vw !important;
            height: 56px !important;
          }
          .thumbnail-btn {
            flex-basis: 44px !important;
            width: 44px !important;
            height: 44px !important;
          }
        }

        @media screen and (max-width: 640px) {
          .lightbox-download-label {
            display: none !important;
          }
          .lightbox-download-btn {
            width: 44px !important;
            min-width: 44px !important;
            height: 44px !important;
            min-height: 44px !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
