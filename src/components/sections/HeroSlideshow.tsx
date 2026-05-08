'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface HeroSlideshowProps {
    images: string[];
    interval?: number;
    altPrefix?: string;
}

export default function HeroSlideshow({
    images,
    interval = 4000,
    altPrefix = 'Slide',
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
        <div className="hero-banner" style={{ position: 'relative', width: '100%', height: '100vh' }}>
            {images.map((src, i) => (
                <div
                    key={src}
                    style={{
                        position: 'relative',
                        width: '100vw',
                        maxWidth: '100%',
                        flexShrink: '0',
                        height: '100vh',
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
                            objectPosition: 'center',
                        }}
                        priority={i === 0}
                        sizes="100vw"
                        unoptimized
                    />
                </div>
            ))}

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

                    {/* Thumbnail strip */}
                    <div style={{
                        position: 'absolute',
                        bottom: '380px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: '12px',
                        zIndex: 20,
                        padding: '10px 16px',
                        backgroundColor: 'rgba(10,8,7,0.5)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(201,147,58,0.2)'
                    }}>
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
                </>
            )}
        </div>
    );
}
