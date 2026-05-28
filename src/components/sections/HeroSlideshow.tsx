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
                    padding: 12px 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    overflow-x: auto;
                    scrollbar-width: none;
                    width: 100%;
                    background-color: transparent;
                }
                .hero-dots-container {
                    display: none;
                    gap: 8px;
                    margin-bottom: 16px;
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
                    .hero-dots-container {
                        display: flex !important;
                    }
                }
            `}} />

            {/* Main Image Container */}
            <div style={{ position: 'absolute', inset: 0 }}>
                {images.map((src, i) => (
                    <div
                        key={src}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            display: current === i ? 'block' : 'none'
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
                paddingBottom: '24px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
            }}>
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
                                    width: hoveredThumb === index ? '120px' : '88px',
                                    height: '60px',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    border: current === index
                                        ? '2.5px solid #C9933A'
                                        : '2px solid rgba(255,255,255,0.2)',
                                    transition: 'all 0.3s ease',
                                    flexShrink: 0,
                                    position: 'relative'
                                }}
                            >
                                <img
                                    src={typeof image === 'string' ? image : (image as any).src || (image as any).url || image}
                                    alt={`Slide ${index + 1}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        display: 'block',
                                        pointerEvents: 'none'
                                    }}
                                />
                                {current === index && (
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        backgroundColor: 'rgba(201,147,58,0.25)'
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

                {/* Dynamic Children (e.g. Explore button) */}
                {children}
            </div>
        </div>
    );
}
