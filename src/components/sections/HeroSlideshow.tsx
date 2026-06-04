'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface HeroSlideshowProps {
    images: string[];
    interval?: number;
    altPrefix?: string;
    children?: React.ReactNode;
}

export default function HeroSlideshow({
    images,
    interval = 4000,
    altPrefix = 'Slide',
    children
}: HeroSlideshowProps) {
    const [current, setCurrent] = useState(0);
    const [hoveredThumb, setHoveredThumb] = useState<number | null>(null);

    const next = useCallback(
        () => setCurrent(p => (p + 1) % images.length),
        [images.length]
    );
    const prev = useCallback(
        () => setCurrent(p => (p - 1 + images.length) % images.length),
        [images.length]
    );

    useEffect(() => {
        if (images.length <= 1) return;
        const t = setInterval(next, interval);
        return () => clearInterval(t);
    }, [next, interval, images.length]);

    if (images.length === 0) {
        return (
            <div className="hero-banner" style={{ background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#aaa', fontSize: '0.9rem' }}>No images — add files to <code>public/assets/img/home/hero/</code> and run <code>npm run manifest:images</code></p>
            </div>
        );
    }

    return (
        <div className="hero-banner" style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
            <style dangerouslySetInnerHTML={{ __html: `
                .hero-banner {
                    height: 75vh !important;
                }
                .hero-thumbnails-container {
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    gap: 12px;
                    overflow-x: auto;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                    width: fit-content;
                    max-width: calc(100vw - 32px);
                    background: rgba(10, 8, 7, 0.72);
                    border: 1px solid rgba(201, 147, 58, 0.32);
                    border-radius: 18px;
                    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.38);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }
                .hero-thumbnails-container::-webkit-scrollbar {
                    display: none;
                }
                .hero-image-stage {
                    position: absolute;
                    inset: 0;
                }
                .hero-image-slide {
                    position: absolute;
                    inset: 0;
                    transition:
                        opacity 1.1s cubic-bezier(0.22, 1, 0.36, 1),
                        transform 1.7s cubic-bezier(0.16, 1, 0.3, 1),
                        filter 1.1s ease;
                    will-change: opacity, transform, filter;
                }
                .hero-image-slide.active {
                    opacity: 1;
                    transform: scale(1.02);
                    filter: saturate(1.05) contrast(1.02) brightness(1.02);
                    z-index: 2;
                }
                .hero-image-slide.inactive {
                    opacity: 0;
                    transform: scale(1.08);
                    filter: saturate(0.9) contrast(0.96) brightness(0.86);
                    z-index: 1;
                    pointer-events: none;
                }
                .hero-image-slide::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(180deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.12) 100%);
                    pointer-events: none;
                }
                .hero-overlay-shell {
                    width: 100%;
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 24px;
                    padding: 0 18px 10px;
                }
                .hero-thumbnails-panel,
                .hero-cta-panel {
                    position: relative;
                    z-index: 1;
                }
                .hero-cta-panel {
                    display: flex;
                    justify-content: flex-end;
                    align-items: flex-end;
                    padding-bottom: 0;
                }
                .hero-dots-container {
                    display: none;
                    gap: 8px;
                    margin-top: 8px;
                    justify-content: center;
                    z-index: 25;
                }
                @media (max-width: 1024px) {
                    .hero-banner {
                        height: 60vh !important;
                    }
                }
                @media (max-width: 768px) {
                    .hero-banner {
                        height: 50vh !important;
                    }
                    .hero-thumbnails-container {
                        display: none !important;
                    }
                    .hero-overlay-shell {
                        padding: 0 18px 8px;
                    }
                    .hero-dots-container {
                        display: flex !important;
                    }
                }
                @media (max-width: 900px) {
                    .hero-overlay-shell {
                        flex-direction: column;
                        align-items: stretch;
                        justify-content: flex-end;
                        gap: 12px;
                    }
                    .hero-thumbnails-panel {
                        align-self: flex-start;
                    }
                    .hero-cta-panel {
                        align-self: flex-end;
                        padding-bottom: 0;
                    }
                }
                @media (max-width: 640px) {
                    .hero-overlay-shell {
                        padding: 0 12px 4px;
                    }
                    .hero-cta-panel {
                        align-self: stretch;
                    }
                }
            `}} />

            {/* Main Image Container */}
            <div className="hero-image-stage">
                {images.map((src, i) => (
                    <div
                        key={src}
                        className={`hero-image-slide ${current === i ? 'active' : 'inactive'}`}
                        style={{
                            pointerEvents: current === i ? 'auto' : 'none'
                        }}
                    >
                        <Image
                            src={src}
                            alt={`${altPrefix} ${i + 1}`}
                            fill
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'top',
                            }}
                            priority={i === 0}
                            sizes="100vw"
                            unoptimized
                        />
                    </div>
                ))}
            </div>

            {/* Navigation arrows */}
            {images.length > 1 && (
                <>
                    <button className="hero-nav prev" onClick={prev} aria-label="Previous slide" style={{ zIndex: 10 }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <button className="hero-nav next" onClick={next} aria-label="Next slide" style={{ zIndex: 10 }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </>
            )}

            {/* Bottom Overlay Content */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 20,
                paddingBottom: '18px',
                background: 'linear-gradient(to top, rgba(5, 3, 2, 0.86) 0%, rgba(5, 3, 2, 0.38) 48%, transparent 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'flex-end',
                gap: '12px'
            }}>
                <div className="hero-overlay-shell">
                    <div className="hero-thumbnails-panel">
                        {/* Thumbnail strip */}
                        {images.length > 1 && (
                            <div className="hero-thumbnails-container">
                                {images.map((image, index) => (
                                    <div
                                        key={index}
                                        onMouseEnter={() => setHoveredThumb(index)}
                                        onMouseLeave={() => setHoveredThumb(null)}
                                        onClick={() => setCurrent(index)}
                                        style={{
                                            width: hoveredThumb === index ? '144px' : '112px',
                                            height: '78px',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            border: current === index
                                                ? '2.5px solid #FFE082'
                                                : '2px solid rgba(255,255,255,0.28)',
                                            backgroundColor: 'rgba(255,255,255,0.04)',
                                            borderRadius: '8px',
                                            transition: 'all 0.3s ease',
                                            flexShrink: 0,
                                            position: 'relative',
                                            boxShadow: current === index
                                                ? '0 0 0 1px rgba(255, 224, 130, 0.25), 0 6px 18px rgba(0, 0, 0, 0.28)'
                                                : '0 4px 12px rgba(0, 0, 0, 0.18)'
                                        }}
                                    >
                                        <img
                                            src={image}
                                            alt={`Slide ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                display: 'block',
                                                filter: current === index ? 'saturate(1.05) brightness(1.02)' : 'saturate(0.92) brightness(0.9)',
                                                pointerEvents: 'none'
                                            }}
                                        />
                                        {current === index && (
                                            <div style={{
                                                position: 'absolute',
                                                inset: 0,
                                                backgroundColor: 'rgba(201,147,58,0.22)'
                                            }} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Dot indicators (only visible on mobile) */}
                        {images.length > 1 && (
                            <div className="hero-dots-container">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrent(index)}
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: current === index ? '#C9933A' : 'rgba(255, 255, 255, 0.4)',
                                            border: 'none',
                                            padding: 0,
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s ease'
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="hero-cta-panel">
                        {/* Dynamic Children (e.g. Explore button) */}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
