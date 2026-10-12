'use client';

import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import LazyImage from '@/components/ui/LazyImage';
import UnifiedLightbox from '@/components/ui/UnifiedLightbox';

export interface MemoriesPhoto {
    id: string;
    url: string;
    thumbnailUrl: string;
    lqip?: string;
    caption?: string;
    featured?: boolean;
}

export interface TourDayData {
    id: string;
    title: string;
    date: string;
    photos: MemoriesPhoto[];
}

interface Props {
    days: TourDayData[];
}

function getDaySlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'tour-day';
}

function getPhotoFilename(dayTitle: string, index: number): string {
    const slug = getDaySlug(dayTitle);
    const num = String(index + 1).padStart(2, '0');
    return `${slug}-photo-${num}.jpg`;
}

function getSanityDownloadUrl(url: string, filename: string): string {
    if (!url) return '';
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}dl=${encodeURIComponent(filename)}`;
}

export default function MemoriesGalleryClient({ days }: Props) {
    const [activeDayId, setActiveDayId] = useState<string | null>(null);
    const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
    const [downloadingDayId, setDownloadingDayId] = useState<string | null>(null);
    const [downloadProgress, setDownloadProgress] = useState<{ current: number; total: number } | null>(null);

    const activeDay = days.find((d) => d.id === activeDayId);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            });
        } catch {
            return dateStr;
        }
    };

    const handleDownloadSingle = async (e: React.MouseEvent, photoUrl: string, filename: string) => {
        e.stopPropagation();
        e.preventDefault();

        try {
            // Using direct fetch -> blob -> saveAs guarantees a local file download across all browsers
            const downloadUrl = getSanityDownloadUrl(photoUrl, filename);
            const res = await fetch(downloadUrl);
            if (res.ok) {
                const blob = await res.blob();
                saveAs(blob, filename);
            } else {
                // Fallback direct anchor click
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        } catch {
            // Fallback direct link
            const downloadUrl = getSanityDownloadUrl(photoUrl, filename);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    const handleDownloadAll = async (day: TourDayData) => {
        if (day.photos.length === 0 || downloadingDayId) return;

        setDownloadingDayId(day.id);
        setDownloadProgress({ current: 0, total: day.photos.length });

        try {
            const zip = new JSZip();

            for (let i = 0; i < day.photos.length; i++) {
                const photo = day.photos[i];
                const filename = getPhotoFilename(day.title, i);
                setDownloadProgress({ current: i + 1, total: day.photos.length });

                const res = await fetch(photo.url);
                if (!res.ok) {
                    throw new Error(`Failed to download ${filename}`);
                }
                const blob = await res.blob();
                zip.file(filename, blob);
            }

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const zipFilename = `${getDaySlug(day.title)}-photos.zip`;
            saveAs(zipBlob, zipFilename);
        } catch (err) {
            console.error('Failed to bundle photos into zip:', err);
            alert('An error occurred while creating the zip bundle. Please try downloading photos individually.');
        } finally {
            setDownloadingDayId(null);
            setDownloadProgress(null);
        }
    };

    const totalPhotos = days.reduce((sum, d) => sum + d.photos.length, 0);

    return (
        <div style={{ backgroundColor: '#FAFAF7', minHeight: '100vh', width: '100%' }}>
            {/* Header Hero Section */}
            <section style={{
                backgroundColor: '#1C1917',
                padding: '72px 40px',
                borderBottom: '1px solid rgba(201, 147, 58, 0.2)',
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{
                        fontFamily: "'Jost', Arial, sans-serif",
                        fontSize: '11px',
                        color: '#C9933A',
                        textTransform: 'uppercase',
                        letterSpacing: '0.24em',
                        marginBottom: '16px',
                        fontWeight: '600',
                    }}>
                        PRIVATE ACCESS • TOUR ARCHIVE
                    </div>
                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 'clamp(32px, 5vw, 56px)',
                        fontWeight: '500',
                        color: '#F5F1EB',
                        margin: '0 0 20px',
                        lineHeight: '1.2',
                    }}>
                        Tour Memories
                    </h1>
                    <div style={{
                        width: '56px',
                        height: '1px',
                        backgroundColor: '#C9933A',
                        marginBottom: '20px',
                    }} />
                    <p style={{
                        fontFamily: "'Jost', Arial, sans-serif",
                        fontWeight: '300',
                        fontSize: '16px',
                        color: '#9A948F',
                        maxWidth: '640px',
                        lineHeight: '1.7',
                        margin: 0,
                    }}>
                        A curated day-by-day photo archive of your journey with Kanmani Tours. Download individual high-resolution photos or package an entire day into a single zip.
                    </p>
                    {totalPhotos > 0 && (
                        <div style={{
                            marginTop: '24px',
                            fontFamily: "'Jost', Arial, sans-serif",
                            fontSize: '12px',
                            color: '#C9933A',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                        }}>
                            {days.length} {days.length === 1 ? 'Day' : 'Days'} • {totalPhotos} Photographs
                        </div>
                    )}
                </div>
            </section>

            {/* Days Content Section */}
            <section style={{
                padding: '60px 40px 100px',
                maxWidth: '1200px',
                margin: '0 auto',
            }}>
                {days.length === 0 ? (
                    <div style={{
                        padding: '100px 24px',
                        textAlign: 'center',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '4px',
                        border: '1px solid #E8E4DC',
                    }}>
                        <span style={{
                            fontFamily: "'Jost', Arial, sans-serif",
                            fontSize: '11px',
                            fontWeight: '600',
                            letterSpacing: '0.22em',
                            color: '#C9933A',
                            textTransform: 'uppercase',
                            display: 'block',
                            marginBottom: '12px',
                        }}>
                            JOURNEY IN PROGRESS
                        </span>
                        <h2 style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: '32px',
                            fontWeight: '500',
                            color: '#1C1917',
                            margin: '0 0 16px',
                        }}>
                            No tour day photographs recorded yet
                        </h2>
                        <div style={{
                            width: '40px',
                            height: '1px',
                            backgroundColor: '#C9933A',
                            margin: '0 auto 20px',
                        }} />
                        <p style={{
                            fontFamily: "'Jost', Arial, sans-serif",
                            fontSize: '15px',
                            color: '#66615B',
                            maxWidth: '480px',
                            margin: '0 auto',
                            lineHeight: '1.6',
                        }}>
                            Photographs are being curated and will appear here day by day as the journey unfolds. Please check back shortly.
                        </p>
                    </div>
                ) : (
                    days.map((day, dayIndex) => {
                        const isDownloadingThisDay = downloadingDayId === day.id;

                        return (
                            <div
                                key={day.id}
                                style={{
                                    marginBottom: dayIndex < days.length - 1 ? '72px' : '0',
                                    paddingBottom: dayIndex < days.length - 1 ? '72px' : '0',
                                    borderBottom: dayIndex < days.length - 1 ? '1px solid #E8E4DC' : 'none',
                                }}
                            >
                                {/* Day Header Row with Title, Date, Badges, and "Download All Photos" button */}
                                <div style={{
                                    borderLeft: '3px solid #C9933A',
                                    paddingLeft: '20px',
                                    marginBottom: '28px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    flexWrap: 'wrap',
                                    gap: '16px',
                                }}>
                                    <div>
                                        <h2 style={{
                                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                                            fontSize: '32px',
                                            fontWeight: '500',
                                            color: '#1C1917',
                                            margin: '0 0 8px',
                                            lineHeight: '1.2',
                                        }}>
                                            {day.title}
                                        </h2>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '16px',
                                            flexWrap: 'wrap',
                                        }}>
                                            {day.date && (
                                                <span style={{
                                                    fontFamily: "'Jost', Arial, sans-serif",
                                                    fontSize: '13px',
                                                    color: '#9A948F',
                                                    fontWeight: '500',
                                                }}>
                                                    {formatDate(day.date)}
                                                </span>
                                            )}
                                            <span style={{
                                                fontFamily: "'Jost', Arial, sans-serif",
                                                fontSize: '11px',
                                                color: '#C9933A',
                                                border: '1px solid rgba(201, 147, 58, 0.4)',
                                                backgroundColor: 'rgba(201, 147, 58, 0.05)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.12em',
                                                padding: '3px 10px',
                                                borderRadius: '2px',
                                                fontWeight: '600',
                                            }}>
                                                {day.photos.length} {day.photos.length === 1 ? 'Photo' : 'Photos'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* "Download all photos" button */}
                                    {day.photos.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => handleDownloadAll(day)}
                                            disabled={!!downloadingDayId}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '10px 20px',
                                                borderRadius: '3px',
                                                backgroundColor: isDownloadingThisDay ? 'rgba(201, 147, 58, 0.15)' : 'transparent',
                                                border: '1px solid #C9933A',
                                                color: isDownloadingThisDay ? '#C9933A' : '#1C1917',
                                                fontFamily: "'Jost', Arial, sans-serif",
                                                fontSize: '11px',
                                                fontWeight: '600',
                                                letterSpacing: '0.15em',
                                                textTransform: 'uppercase',
                                                cursor: downloadingDayId ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.25s ease',
                                                marginTop: '4px',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!downloadingDayId) {
                                                    e.currentTarget.style.backgroundColor = '#C9933A';
                                                    e.currentTarget.style.color = '#1C1917';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!downloadingDayId) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.color = '#1C1917';
                                                }
                                            }}
                                        >
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="7 10 12 15 17 10" />
                                                <line x1="12" y1="15" x2="12" y2="3" />
                                            </svg>
                                            <span>
                                                {isDownloadingThisDay
                                                    ? (downloadProgress
                                                        ? `Packaging ${downloadProgress.current}/${downloadProgress.total}...`
                                                        : 'Preparing Zip...')
                                                    : 'Download All Photos'}
                                            </span>
                                        </button>
                                    )}
                                </div>

                                {/* Photo Grid */}
                                {day.photos.length === 0 ? (
                                    <p style={{
                                        fontFamily: "'Jost', Arial, sans-serif",
                                        fontSize: '14px',
                                        color: '#9A948F',
                                        fontStyle: 'italic',
                                    }}>
                                        No photos added for this day yet.
                                    </p>
                                ) : (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                                        gap: '16px',
                                    }}>
                                        {day.photos.map((photo, photoIndex) => {
                                            const filename = getPhotoFilename(day.title, photoIndex);

                                            return (
                                                <div
                                                    key={photo.id}
                                                    onClick={() => {
                                                        setActiveDayId(day.id);
                                                        setActivePhotoIndex(photoIndex);
                                                    }}
                                                    style={{
                                                        aspectRatio: '4 / 3',
                                                        backgroundColor: '#E8E4DC',
                                                        position: 'relative',
                                                        cursor: 'pointer',
                                                        overflow: 'hidden',
                                                        borderRadius: '2px',
                                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                                        e.currentTarget.style.boxShadow = '0 10px 24px rgba(0, 0, 0, 0.12)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06)';
                                                    }}
                                                >
                                                    <LazyImage
                                                        src={photo.thumbnailUrl}
                                                        lqip={photo.lqip}
                                                        alt={photo.caption || `${day.title} photograph ${photoIndex + 1}`}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                            display: 'block',
                                                        }}
                                                    />

                                                    {/* Corner Download Button */}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleDownloadSingle(e, photo.url, filename)}
                                                        title={`Download ${filename}`}
                                                        aria-label={`Download ${filename}`}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '10px',
                                                            right: '10px',
                                                            zIndex: 10,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: '34px',
                                                            height: '34px',
                                                            borderRadius: '4px',
                                                            backgroundColor: 'rgba(28, 25, 23, 0.85)',
                                                            border: '1px solid rgba(201, 147, 58, 0.4)',
                                                            color: '#C9933A',
                                                            backdropFilter: 'blur(4px)',
                                                            transition: 'all 0.2s ease',
                                                            cursor: 'pointer',
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = '#C9933A';
                                                            e.currentTarget.style.color = '#1C1917';
                                                            e.currentTarget.style.borderColor = '#C9933A';
                                                            e.currentTarget.style.transform = 'scale(1.08)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'rgba(28, 25, 23, 0.85)';
                                                            e.currentTarget.style.color = '#C9933A';
                                                            e.currentTarget.style.borderColor = 'rgba(201, 147, 58, 0.4)';
                                                            e.currentTarget.style.transform = 'scale(1)';
                                                        }}
                                                    >
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                            <polyline points="7 10 12 15 17 10" />
                                                            <line x1="12" y1="15" x2="12" y2="3" />
                                                        </svg>
                                                    </button>

                                                    {/* Hover overlay hint */}
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        backgroundColor: 'rgba(28, 25, 23, 0.4)',
                                                        opacity: 0,
                                                        transition: 'opacity 0.25s ease',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'flex-end',
                                                        padding: '16px',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.opacity = '1';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.opacity = '0';
                                                    }}
                                                    >
                                                        {photo.caption && (
                                                            <span style={{
                                                                fontFamily: "'Jost', Arial, sans-serif",
                                                                fontSize: '12px',
                                                                color: '#F5F1EB',
                                                                fontWeight: '400',
                                                                lineHeight: '1.4',
                                                                marginBottom: '4px',
                                                            }}>
                                                                {photo.caption}
                                                            </span>
                                                        )}
                                                        <span style={{
                                                            fontFamily: "'Jost', Arial, sans-serif",
                                                            fontSize: '10px',
                                                            color: '#C9933A',
                                                            letterSpacing: '0.15em',
                                                            textTransform: 'uppercase',
                                                            fontWeight: '600',
                                                        }}>
                                                            Click to View Full Size
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </section>

            {/* Unified Lightbox modal scoped to the clicked day */}
            {activeDay && (
                <UnifiedLightbox
                    images={activeDay.photos.map((p, i) => ({
                        id: p.id || `${activeDay.id}-${i}`,
                        url: p.url,
                        thumbnailUrl: p.thumbnailUrl || p.url,
                        lqip: p.lqip,
                        caption: p.caption || activeDay.title,
                        subCaption: activeDay.date ? formatDate(activeDay.date) : undefined,
                    }))}
                    initialIndex={activePhotoIndex}
                    onClose={() => setActiveDayId(null)}
                />
            )}
        </div>
    );
}
