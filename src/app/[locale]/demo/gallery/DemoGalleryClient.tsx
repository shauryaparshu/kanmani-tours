'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const PLACEHOLDER_IMAGES = [
    '/assets/img/about/about-1.jpg',
    '/assets/img/about/about-2.jpg',
    '/assets/img/about/about-3.jpg',
    '/assets/img/about/about-4.jpg',
    '/assets/img/about/founder.jpg',
    '/assets/img/about-kanmani/founder-hero.jpg',
    '/assets/img/about-kanmani/gallery-1.jpg',
    '/assets/img/about-kanmani/gallery-2.jpg',
    '/assets/img/about-kanmani/gallery-3.jpg',
    '/assets/img/about-kanmani/gallery-4.jpg',
    '/assets/img/about-kanmani/gallery-5.jpg',
    '/assets/img/about-kanmani/gallery-6.jpg',
    '/assets/img/about-kanmani/gallery-7.jpg',
    '/assets/img/about-kanmani/gallery-8.jpg',
    '/assets/img/about-kanmani/gallery-9.jpg',
    '/assets/img/events/2026-fanmeet-chennai/gallery/001-group.png',
    '/assets/img/home/hero/002-59707893.jpg',
    '/assets/img/about/about-1.jpg',
    '/assets/img/about/about-2.jpg',
    '/assets/img/about/about-3.jpg',
    '/assets/img/about/about-4.jpg',
    '/assets/img/about/founder.jpg',
    '/assets/img/about-kanmani/founder-hero.jpg',
    '/assets/img/about-kanmani/gallery-1.jpg',
];

export default function DemoGalleryClient() {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const navigate = useCallback((direction: 'next' | 'prev') => {
        if (selectedIndex === null) return;
        if (direction === 'next') {
            setSelectedIndex((selectedIndex + 1) % PLACEHOLDER_IMAGES.length);
        } else {
            setSelectedIndex((selectedIndex - 1 + PLACEHOLDER_IMAGES.length) % PLACEHOLDER_IMAGES.length);
        }
    }, [selectedIndex]);

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

    const selectedMedia = selectedIndex !== null ? PLACEHOLDER_IMAGES[selectedIndex] : null;

    return (
        <div className="demo-gallery-page">
            <header className="gallery-header">
                <div className="header-content">
                    <span className="gallery-label">PRIVATE GALLERY</span>
                    <h1 className="gallery-title">Chennai Cultural Immersion - March 2026</h1>
                    <div className="gallery-meta">
                        <span>32 TRAVELLERS &bull; 4 DAYS &bull; 247 PHOTOS</span>
                    </div>
                    <div className="gallery-badge">Shared privately with your group</div>
                </div>
            </header>

            <section className="gallery-action-bar">
                <div className="action-bar-content">
                    <div className="action-buttons">
                        <button className="btn-gold">DOWNLOAD ALL PHOTOS</button>
                        <button className="btn-outline">SHARE WITH FAMILY</button>
                    </div>
                    <div className="action-expiry">Available until 30 June 2026</div>
                </div>
            </section>

            <main className="gallery-main">
                <div className="gallery-grid">
                    {PLACEHOLDER_IMAGES.map((url, idx) => (
                        <div
                            key={idx}
                            className="gallery-item"
                            onClick={() => setSelectedIndex(idx)}
                        >
                            <img src={url} alt={`Gallery image ${idx + 1}`} className="grid-img" loading="lazy" />
                            <div className="img-overlay">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="gallery-footer">
                <p className="footer-note">Photos captured by the Kanmani Tours team during your journey.</p>
                <div className="cta-card">
                    <h2>Planning your next trip? Explore upcoming tours</h2>
                    <Link href="/india/tours" className="cta-link">View Tours</Link>
                </div>
            </footer>

            {/* Lightbox Modal */}
            {selectedMedia && (
                <div className="lightbox-overlay" onClick={() => setSelectedIndex(null)}>
                    <button className="close-lightbox" onClick={() => setSelectedIndex(null)}>✕</button>

                    <div className="lightbox-container" onClick={e => e.stopPropagation()}>
                        <button className="nav-btn prev" onClick={() => navigate('prev')} aria-label="Previous">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6" /></svg>
                        </button>

                        <div className="lightbox-content">
                            <img src={selectedMedia} alt="Large view" className="lightbox-img" />
                            <div className="lightbox-counter">
                                {(selectedIndex ?? 0) + 1} / {PLACEHOLDER_IMAGES.length}
                            </div>
                        </div>

                        <button className="nav-btn next" onClick={() => navigate('next')} aria-label="Next">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6" /></svg>
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                .demo-gallery-page {
                    font-family: var(--font-jost), sans-serif;
                    background-color: #F5F1EB;
                    min-height: 100vh;
                }
                .gallery-header {
                    background-color: #1C1917;
                    color: #F5F1EB;
                    text-align: center;
                    padding: 80px 16px 60px;
                }
                .header-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .gallery-label {
                    color: #C9933A;
                    font-size: 0.9rem;
                    letter-spacing: 2px;
                    font-weight: 600;
                    margin-bottom: 16px;
                    text-transform: uppercase;
                }
                .gallery-title {
                    font-family: var(--font-cormorant), serif;
                    font-size: 3rem;
                    font-weight: 600;
                    margin-bottom: 24px;
                    line-height: 1.2;
                }
                .gallery-meta {
                    color: #C9933A;
                    font-size: 0.85rem;
                    letter-spacing: 1.5px;
                    font-weight: 600;
                    margin-bottom: 32px;
                }
                .gallery-badge {
                    background-color: rgba(245, 241, 235, 0.1);
                    color: #F5F1EB;
                    padding: 6px 16px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                }

                .gallery-action-bar {
                    background-color: #FFFFFF;
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                    padding: 20px 16px;
                }
                .action-bar-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                .action-buttons {
                    display: flex;
                    gap: 16px;
                }
                .btn-gold {
                    background-color: #C9933A;
                    color: #FFFFFF;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 4px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .btn-gold:hover {
                    background-color: #b58434;
                }
                .btn-outline {
                    background-color: transparent;
                    color: #1C1917;
                    border: 1px solid #1C1917;
                    padding: 12px 24px;
                    border-radius: 4px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-outline:hover {
                    background-color: #1C1917;
                    color: #F5F1EB;
                }
                .action-expiry {
                    color: #666;
                    font-size: 0.85rem;
                }

                .gallery-main {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 60px 16px;
                }
                .gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 16px;
                }
                .gallery-item {
                    position: relative;
                    border-radius: 12px;
                    overflow: hidden;
                    cursor: pointer;
                    background: #e2e8f0;
                    aspect-ratio: 1;
                }
                .grid-img { 
                    width: 100%; 
                    height: 100%; 
                    object-fit: cover; 
                    transition: transform 0.5s ease; 
                }
                .img-overlay {
                    position: absolute; 
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.3);
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    opacity: 0; 
                    transition: opacity 0.3s; 
                    color: #fff;
                }
                .gallery-item:hover .grid-img { transform: scale(1.08); }
                .gallery-item:hover .img-overlay { opacity: 1; }

                .gallery-footer {
                    padding: 60px 16px;
                    text-align: center;
                    background-color: #F5F1EB;
                }
                .footer-note {
                    color: #666;
                    margin-bottom: 40px;
                    font-size: 1.1rem;
                }
                .cta-card {
                    background: #FFFFFF;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 40px 20px;
                    border-radius: 16px;
                    border: 1px solid #EBB14E;
                    box-shadow: 0 10px 30px rgba(201, 147, 58, 0.1);
                }
                .cta-card h2 {
                    font-family: var(--font-cormorant), serif;
                    font-size: 2rem;
                    color: #1C1917;
                    margin-bottom: 24px;
                }
                .cta-link {
                    display: inline-block;
                    background: linear-gradient(135deg, #EBB14E 0%, #C9933A 100%);
                    color: #FFF;
                    text-decoration: none;
                    padding: 12px 32px;
                    border-radius: 4px;
                    font-weight: 600;
                    transition: transform 0.2s;
                }
                .cta-link:hover {
                    transform: translateY(-2px);
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
                .close-lightbox:hover { background: #C9933A; }

                .nav-btn {
                    background: rgba(255,255,255,0.05); border: none; color: #fff;
                    width: 50px; height: 50px; border-radius: 50%;
                    cursor: pointer; z-index: 10000;
                    display: flex; align-items: center; justify-content: center;
                    transition: color 0.2s;
                    flex-shrink: 0;
                }
                .nav-btn:hover { color: #C9933A; }
                .nav-btn svg { width: 32px; height: 32px; }

                @media (max-width: 768px) {
                    .gallery-title {
                        font-size: 2rem;
                    }
                    .action-bar-content {
                        flex-direction: column;
                        align-items: stretch;
                        text-align: center;
                    }
                    .action-buttons {
                        flex-direction: column;
                        width: 100%;
                    }
                    .btn-gold, .btn-outline {
                        width: 100%;
                    }
                    .gallery-grid {
                        grid-template-columns: repeat(3, 1fr);
                        gap: 8px;
                    }
                    .gallery-main {
                        padding: 30px 16px;
                    }
                    
                    .lightbox-container { gap: 10px; }
                    .nav-btn { width: 40px; height: 40px; }
                    .nav-btn svg { width: 24px; height: 24px; }
                    .lightbox-content { max-width: 75vw; }
                }
            `}</style>
        </div>
    );
}
