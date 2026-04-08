'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import TopBar from '@/components/layout/TopBar';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/FooterSection';

interface GalleryMedia {
    type: 'image' | 'video';
    url: string;
}

interface GalleryTour {
    slug: string;
    title: string;
    shortDescription: string;
    category: string;
    startDate: string;
    endDate: string;
    year: number;
    coverImage: string;
    media: GalleryMedia[];
}

export default function GalleryDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [tour, setTour] = useState<GalleryTour | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    useEffect(() => {
        fetch('/assets/gallery-index.json')
            .then(res => res.json())
            .then(data => {
                const found = data.tours.find((t: GalleryTour) => t.slug === slug);
                if (found && new Date(found.endDate) < new Date()) {
                    setTour(found);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading gallery details:', err);
                setLoading(false);
            });
    }, [slug]);

    const navigate = useCallback((direction: 'next' | 'prev') => {
        if (!tour || selectedIndex === null) return;

        let nextIndex;
        if (direction === 'next') {
            nextIndex = (selectedIndex + 1) % tour.media.length;
        } else {
            nextIndex = (selectedIndex - 1 + tour.media.length) % tour.media.length;
        }
        setSelectedIndex(nextIndex);
    }, [tour, selectedIndex]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return;
            if (e.key === 'ArrowRight') navigate('next');
            if (e.key === 'ArrowLeft') navigate('prev');
            if (e.key === 'Escape') setSelectedIndex(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, navigate]);

    if (loading) return <div className="loading-state">Loading Memories...</div>;

    if (!tour) {
        return (
            <div className="error-state">
                <h1>Gallery Not Found</h1>
                <p>This tour may not have taken place yet or has no gallery media available.</p>
                <Link href="/gallery" className="btn-primary">Back to Gallery</Link>
            </div>
        );
    }

    const selectedMedia = selectedIndex !== null ? tour.media[selectedIndex] : null;

    return (
        <div className="gallery-detail-page">
            <TopBar />
            <Navigation />

            <main>
                <section className="gallery-header section-padding-small">
                    <div className="container">
                        <nav className="breadcrumbs">
                            <Link href="/">Home</Link> <span>/</span>
                            <Link href="/gallery">Gallery</Link> <span>/</span>
                            <span>{tour.title}</span>
                        </nav>
                        <div className="header-flex">
                            <div>
                                <span className="cat-badge">{tour.category}</span>
                                <h1 className="detail-title">{tour.title}</h1>
                                <p className="detail-meta">
                                    {new Date(tour.startDate).toLocaleDateString('en-JP', { month: 'long', year: 'numeric' })} • {tour.media.length} Media Items
                                </p>
                            </div>
                            <Link href={`/tours/${tour.slug}`} className="btn-outline-small">
                                View Tour Details
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="gallery-grid-section section-padding-small">
                    <div className="container">
                        <div className="gallery-masonry">
                            {tour.media.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="gallery-item animate-up"
                                    style={{ animationDelay: `${idx * 0.05}s` }}
                                    onClick={() => setSelectedIndex(idx)}
                                >
                                    {item.type === 'video' ? (
                                        <video src={item.url} className="grid-img" muted playsInline />
                                    ) : (
                                        <img src={item.url} alt={`${tour.title} media ${idx + 1}`} className="grid-img" loading="lazy" />
                                    )}
                                    <div className="img-overlay">
                                        {item.type === 'video' ? (
                                            <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                                            </svg>
                                        )}
                                    </div>
                                    {item.type === 'video' && <span className="video-tag">VIDEO</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Lightbox Modal */}
            {selectedMedia && (
                <div className="lightbox-overlay" onClick={() => setSelectedIndex(null)}>
                    <button className="close-lightbox" onClick={() => setSelectedIndex(null)}>✕</button>

                    <div className="lightbox-container" onClick={e => e.stopPropagation()}>
                        <button className="nav-btn prev" onClick={() => navigate('prev')} aria-label="Previous">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6" /></svg>
                        </button>

                        <div className="lightbox-content">
                            {selectedMedia.type === 'video' ? (
                                <video src={selectedMedia.url} className="lightbox-img" controls autoPlay />
                            ) : (
                                <img src={selectedMedia.url} alt="Large view" className="lightbox-img" />
                            )}
                            <div className="lightbox-counter">
                                {(selectedIndex ?? 0) + 1} / {tour.media.length}
                            </div>
                        </div>

                        <button className="nav-btn next" onClick={() => navigate('next')} aria-label="Next">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6" /></svg>
                        </button>
                    </div>
                </div>
            )}

            <Footer />

            <style jsx>{`
        .loading-state, .error-state {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px;
        }
        .section-padding-small { padding: 60px 0; }
        .breadcrumbs { margin-bottom: 20px; color: #94a3b8; font-size: 0.9rem; }
        .breadcrumbs span { margin: 0 8px; }
        .header-flex { display: flex; justify-content: space-between; align-items: flex-end; gap: 30px; }
        .cat-badge { background: var(--primary); color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; display: inline-block; }
        .detail-title { font-size: 2.5rem; font-weight: 900; color: #1e293b; margin-bottom: 8px; }
        .detail-meta { color: #64748b; font-size: 1.1rem; }
        .btn-outline-small { border: 2px solid #e2e8f0; padding: 10px 24px; border-radius: 12px; font-weight: 700; transition: all 0.3s; }
        .btn-outline-small:hover { border-color: var(--primary); color: var(--primary); }

        .gallery-masonry {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .gallery-item {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          background: #f1f5f9;
          aspect-ratio: 4/3;
        }
        .grid-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .img-overlay {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.3s; color: #fff;
        }
        .gallery-item:hover .grid-img { transform: scale(1.08); }
        .gallery-item:hover .img-overlay { opacity: 1; }
        
        .video-tag {
          position: absolute; top: 12px; right: 12px;
          background: rgba(0,0,0,0.6); color: #fff;
          padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 900;
          letter-spacing: 1px;
        }

        .lightbox-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.95);
          z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }
        .lightbox-container {
          display: flex;
          align-items: center;
          gap: 20px;
          max-width: 95vw;
        }
        .lightbox-content { 
          position: relative; 
          max-width: 80vw; 
          max-height: 90vh; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
        }
        .lightbox-img { max-width: 100%; max-height: 85vh; object-fit: contain; border-radius: 8px; }
        .lightbox-counter { color: rgba(255,255,255,0.6); margin-top: 15px; font-size: 0.9rem; font-weight: 600; }
        
        .close-lightbox {
          position: absolute; top: 20px; right: 20px;
          background: rgba(255,255,255,0.1); border: none; color: #fff;
          width: 44px; height: 44px; border-radius: 50%;
          font-size: 20px; cursor: pointer; z-index: 10000;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .close-lightbox:hover { background: var(--primary); }

        .nav-btn {
          background: rgba(255,255,255,0.05); border: none; color: #fff;
          width: 50px; height: 50px; border-radius: 50%;
          cursor: pointer; z-index: 10000;
          display: flex; align-items: center; justify-content: center;
          transition: color 0.2s;
          flex-shrink: 0;
        }
        .nav-btn:hover { color: var(--primary); }
        .nav-btn svg { width: 32px; height: 32px; }

        @media (max-width: 768px) {
          .lightbox-container { gap: 10px; }
          .nav-btn { width: 40px; height: 40px; }
          .nav-btn svg { width: 24px; height: 24px; }
          .lightbox-content { max-width: 75vw; }
        }
      `}</style>
        </div>
    );
}
