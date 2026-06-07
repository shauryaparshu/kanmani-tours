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
}

interface UnifiedLightboxProps {
  images: LightboxImage[];
  initialIndex: number;
  onClose: () => void;
}

export default function UnifiedLightbox({ images, initialIndex, onClose }: UnifiedLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isHoveringLightbox, setIsHoveringLightbox] = useState(false);
  const currentImage = images[currentIndex];
  
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, onClose]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  if (!images || images.length === 0) return null;

  return (
    <div
      onClick={onClose}
      onMouseEnter={() => setIsHoveringLightbox(true)}
      onMouseLeave={() => setIsHoveringLightbox(false)}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 3, 2, 0.95)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
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
        {currentIndex + 1} / {images.length}
      </div>

      {images.length > 1 && (
        <>
          {/* Previous photo card */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
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
              zIndex: 10000,
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
                src={images[(currentIndex - 1 + images.length) % images.length].thumbnailUrl}
                lqip={images[(currentIndex - 1 + images.length) % images.length].lqip}
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

          {/* Next photo card */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
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
              zIndex: 10000,
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
                src={images[(currentIndex + 1) % images.length].thumbnailUrl}
                lqip={images[(currentIndex + 1) % images.length].lqip}
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

      {/* Main Content Area */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          width: '72vw',
          zIndex: 999 
        }}
      >
        <div
          key={currentIndex}
          style={{
            width: '100%',
            height: '60vh',
            animation: 'premiumLightboxFade 760ms cubic-bezier(0.16, 1, 0.3, 1) both',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.92)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.32), 0 0 24px rgba(255,255,255,0.16), 0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.02)'
          }}
        >
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
        <div style={{ marginTop: '20px', textAlign: 'center', maxWidth: '800px' }}>
          {currentImage.caption && (
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '20px', color: '#FFFFFF', marginBottom: '8px' }}>
              {currentImage.caption}
            </p>
          )}
          {currentImage.subCaption && (
            <p style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '14px', color: '#C9933A', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
              {currentImage.subCaption}
            </p>
          )}
        </div>
      </div>

      {/* Thumbnail strip at bottom */}
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
        zIndex: 1000,
        pointerEvents: 'auto'
      }}>
        {images.map((photo, i) => (
          <button
            key={photo.id}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(i);
            }}
            className="thumbnail-btn"
            style={{
              flexBasis: '48px', // Default width
              height: '56px',
              flexShrink: 0,
              position: 'relative',
              overflow: 'hidden',
              border: i === currentIndex
                ? '2px solid #C9933A'
                : '2px solid transparent',
              cursor: 'pointer',
              backgroundColor: '#000000',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease',
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
                objectFit: 'cover',
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
        .thumbnail-btn:hover {
          transform: scale(6);
          z-index: 100;
          box-shadow: 0 10px 30px rgba(0,0,0,0.8);
          border-width: 0.5px !important; /* Counteract 6x scale for border */
        }
      `}</style>
    </div>
  );
}
