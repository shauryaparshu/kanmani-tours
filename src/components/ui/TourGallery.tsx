'use client';

/**
 * components/TourGallery.tsx
 *
 * Full-page tour media viewer:
 *   - Hero slideshow at the top
 *   - Optional ordered Itinerary strip (day by day)
 *   - Unordered photo gallery at the bottom
 *
 * Usage (on a tour detail page):
 *   const tourImages = manifest.tours['kollywood-star-encounter'];
 *   <TourGallery
 *     hero={tourImages.hero}
 *     itinerary={tourImages.itinerary}
 *     gallery={tourImages.gallery}
 *   />
 */

import React from 'react';
import Image from 'next/image';
import HeroSlideshow from '@/components/sections/HeroSlideshow';
import ImageGrid from './ImageGrid';

interface TourGalleryProps {
    hero: string[];
    itinerary: string[];

    gallery: string[];
    tourName?: string;
}

export default function TourGallery({ hero, itinerary, gallery, tourName = 'Tour' }: TourGalleryProps) {
    return (
        <div>
            {/* Hero slideshow */}
            {hero.length > 0 && (
                <div className="hero-banner" style={{ position: 'relative', height: '420px', borderRadius: '20px', overflow: 'hidden', marginBottom: '32px' }}>
                    <HeroSlideshow images={hero} altPrefix={tourName + ' slide'} />
                </div>
            )}

            {/* Itinerary strip — ordered day-by-day images */}
            {itinerary.length > 0 && (
                <section style={{ marginBottom: '48px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '16px' }}>Day by Day</h3>
                    <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                        {itinerary.map((src, i) => (
                            <div
                                key={src}
                                style={{ position: 'relative', flex: '0 0 260px', height: '180px', borderRadius: '12px', overflow: 'hidden' }}
                            >
                                <Image
                                    src={src}
                                    alt={`Day ${i + 1}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    unoptimized
                                />
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                    background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                                    color: '#fff', padding: '8px 12px', fontSize: '0.85rem', fontWeight: 600
                                }}>
                                    Day {i + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Unordered gallery grid */}
            {gallery.length > 0 && (
                <section>
                    <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '4px' }}>Photo Gallery</h3>
                    <ImageGrid images={gallery} altPrefix={tourName + ' gallery photo'} />
                </section>
            )}
        </div>
    );
}
