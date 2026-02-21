'use client';

/**
 * components/ImageGrid.tsx
 *
 * A responsive image grid for unordered galleries (events, tour galleries, etc.).
 *
 * Usage:
 *   <ImageGrid images={manifest.events['2026-fanmeet-chennai'].gallery} />
 */

import React, { useState } from 'react';
import Image from 'next/image';

interface ImageGridProps {
    images: string[];
    altPrefix?: string;
    /** Number of columns at desktop. Default: 3 */
    columns?: 2 | 3 | 4;
}

export default function ImageGrid({ images, altPrefix = 'Gallery image', columns = 3 }: ImageGridProps) {
    const [lightbox, setLightbox] = useState<string | null>(null);

    if (images.length === 0) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#aaa' }}>
                No images yet — drop files into the gallery folder and run <code>npm run manifest:images</code>.
            </div>
        );
    }

    const gap = 16;
    const colStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
        margin: '32px 0',
    };

    return (
        <>
            <div style={colStyle}>
                {images.map((src, i) => (
                    <div
                        key={src}
                        onClick={() => setLightbox(src)}
                        style={{
                            position: 'relative',
                            aspectRatio: '1 / 1',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            cursor: 'zoom-in',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.03)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; }}
                    >
                        <Image
                            src={src}
                            alt={`${altPrefix} ${i + 1}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, 33vw"
                            unoptimized
                        />
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div
                    onClick={() => setLightbox(null)}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.88)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 9999, cursor: 'zoom-out',
                    }}
                >
                    <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', width: '800px', height: '600px' }}>
                        <Image
                            src={lightbox}
                            alt="Lightbox view"
                            fill
                            style={{ objectFit: 'contain' }}
                            unoptimized
                        />
                    </div>
                </div>
            )}
        </>
    );
}
