'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import UnifiedLightbox from '@/components/ui/UnifiedLightbox';

export interface DriveFolderItem {
    id: string;
    name: string;
}

export interface DriveFileItem {
    id: string;
    name: string;
    kind: 'image' | 'video';
    thumb: string;
    large: string;
    download: string;
    width?: number;
    height?: number;
}

interface ApiResponse {
    current?: { id: string; name: string } | null;
    folders: DriveFolderItem[];
    files: DriveFileItem[];
    error?: string;
}

interface DriveGalleryProps {
    rootFolderId?: string;
}

export default function DriveGallery({ rootFolderId }: DriveGalleryProps) {
    const [folders, setFolders] = useState<DriveFolderItem[]>([]);
    const [files, setFiles] = useState<DriveFileItem[]>([]);
    const [currentFolder, setCurrentFolder] = useState<{ id: string; name: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Lightbox & Video modal states
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

    // Request counter to cancel / ignore responses from stale requests
    const requestIdRef = useRef(0);

    const fetchFolderData = useCallback(async (folderId: string | null, knownName?: string) => {
        const currentReq = ++requestIdRef.current;
        setLoading(true);
        setError(null);

        try {
            const query = folderId ? `?folder=${encodeURIComponent(folderId)}` : '';
            const res = await fetch(`/api/memories-drive${query}`);

            // Stale check
            if (currentReq !== requestIdRef.current) return;

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `Error ${res.status}: Failed to load contents`);
            }

            const data: ApiResponse = await res.json();
            if (currentReq !== requestIdRef.current) return;

            setFolders(data.folders || []);
            setFiles(data.files || []);

            if (folderId) {
                const resolvedName = data.current?.name || knownName || 'Folder';
                setCurrentFolder({ id: folderId, name: resolvedName });
            } else {
                setCurrentFolder(null);
            }
        } catch (err: unknown) {
            if (currentReq !== requestIdRef.current) return;
            const msg = err instanceof Error ? err.message : 'Unable to connect to Google Drive';
            setError(msg);
        } finally {
            if (currentReq === requestIdRef.current) {
                setLoading(false);
            }
        }
    }, []);

    const navigateTo = useCallback((folderId: string | null, folderName?: string, push = true) => {
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            if (folderId) {
                url.searchParams.set('folder', folderId);
            } else {
                url.searchParams.delete('folder');
            }

            if (push) {
                window.history.pushState({ folderId, folderName }, '', url.toString());
            } else {
                window.history.replaceState({ folderId, folderName }, '', url.toString());
            }
        }

        fetchFolderData(folderId, folderName);
    }, [fetchFolderData]);

    // Initial mount: inspect URL search params exactly once
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const initialFolder = params.get('folder');
        fetchFolderData(initialFolder);
    }, [fetchFolderData]);

    // Popstate listener to sync with browser/phone back button
    useEffect(() => {
        const handlePopState = (e: PopStateEvent) => {
            const params = new URLSearchParams(window.location.search);
            const folderId = params.get('folder');
            const stateName = e.state?.folderName;
            fetchFolderData(folderId, stateName);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [fetchFolderData]);

    // Escape listener for video modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (activeVideoId) setActiveVideoId(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeVideoId]);

    // Filter only images for UnifiedLightbox
    const imageFiles = files.filter((f) => f.kind === 'image');

    const handleBack = () => {
        if (typeof window !== 'undefined' && window.history.state?.folderId) {
            window.history.back();
        } else {
            navigateTo(null, undefined, false);
        }
    };

    const driveOpenUrl = currentFolder
        ? `https://drive.google.com/drive/folders/${currentFolder.id}`
        : rootFolderId
            ? `https://drive.google.com/drive/folders/${rootFolderId}`
            : 'https://drive.google.com';

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 60px' }}>
            {/* Navigation Bar / Breadcrumb */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '28px',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(201, 147, 58, 0.15)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {currentFolder && (
                        <button
                            id="gallery-back-button"
                            type="button"
                            onClick={handleBack}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                backgroundColor: '#23201D',
                                border: '1px solid rgba(201, 147, 58, 0.3)',
                                borderRadius: '4px',
                                color: '#C9933A',
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '11px',
                                fontWeight: '600',
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                            <span>Back</span>
                        </button>
                    )}

                    <nav aria-label="Breadcrumb" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontFamily: "'Jost', Arial, sans-serif",
                        fontSize: '13px',
                    }}>
                        <button
                            id="gallery-breadcrumb-root"
                            type="button"
                            onClick={() => navigateTo(null, undefined)}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                color: currentFolder ? '#C9933A' : '#F5F1EB',
                                cursor: currentFolder ? 'pointer' : 'default',
                                textDecoration: currentFolder ? 'underline' : 'none',
                                fontWeight: currentFolder ? '500' : '600',
                                fontSize: '13px',
                                fontFamily: "'Jost', Arial, sans-serif",
                            }}
                        >
                            All Folders
                        </button>
                        {currentFolder && (
                            <>
                                <span style={{ color: '#9A948F' }}>/</span>
                                <span id="gallery-breadcrumb-current" style={{ color: '#F5F1EB', fontWeight: '600' }}>
                                    {currentFolder.name}
                                </span>
                            </>
                        )}
                    </nav>
                </div>

                {/* In-folder "Download this day" Action */}
                {currentFolder && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <a
                            href={`https://drive.google.com/drive/folders/${currentFolder.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: '#C9933A',
                                color: '#1C1917',
                                padding: '10px 18px',
                                borderRadius: '4px',
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '11px',
                                fontWeight: '600',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 12px rgba(201, 147, 58, 0.2)',
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            <span>Download this day</span>
                        </a>
                        <span style={{
                            fontFamily: "'Jost', Arial, sans-serif",
                            fontSize: '11px',
                            color: '#9A948F',
                            fontStyle: 'italic',
                        }}>
                            Google will prepare a zip of the whole folder.
                        </span>
                    </div>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div style={{ padding: '80px 24px', textAlign: 'center' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        margin: '0 auto 16px',
                        border: '3px solid rgba(201, 147, 58, 0.2)',
                        borderTopColor: '#C9933A',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                    }} />
                    <p style={{
                        fontFamily: "'Jost', Arial, sans-serif",
                        fontSize: '14px',
                        color: '#9A948F',
                        letterSpacing: '0.05em',
                        margin: 0,
                    }}>
                        Loading memories...
                    </p>
                </div>
            )}

            {/* Error State */}
            {!loading && error && (
                <div style={{
                    padding: '48px 24px',
                    textAlign: 'center',
                    backgroundColor: '#23201D',
                    borderRadius: '8px',
                    border: '1px solid rgba(201, 147, 58, 0.25)',
                    maxWidth: '560px',
                    margin: '20px auto',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                }}>
                    <p style={{
                        fontFamily: "'Jost', Arial, sans-serif",
                        fontSize: '15px',
                        color: '#E07A5F',
                        lineHeight: '1.6',
                        marginBottom: '24px',
                    }}>
                        {error}
                    </p>
                    <a
                        href={driveOpenUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#C9933A',
                            color: '#1C1917',
                            padding: '12px 24px',
                            borderRadius: '4px',
                            fontFamily: "'Jost', Arial, sans-serif",
                            fontSize: '11px',
                            fontWeight: '600',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            textDecoration: 'none',
                        }}
                    >
                        <span>Open in Google Drive</span>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                    </a>
                </div>
            )}

            {/* Content Display */}
            {!loading && !error && (
                <div>
                    {/* Folders Section - ONE LEVEL ONLY: Only render folder tiles at root */}
                    {!currentFolder && folders.length > 0 && (
                        <div style={{ marginBottom: files.length > 0 ? '48px' : '20px' }}>
                            <div className="drive-folders-grid">
                                {folders.map((f) => (
                                    <button
                                        key={f.id}
                                        id={`folder-${f.name.toLowerCase().replace(/\s+/g, '-')}`}
                                        type="button"
                                        onClick={() => navigateTo(f.id, f.name)}
                                        className="drive-folder-card"
                                    >
                                        <div style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '6px',
                                            backgroundColor: 'rgba(201, 147, 58, 0.12)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            color: '#C9933A',
                                        }}>
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                            </svg>
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                                            <span style={{
                                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                                fontSize: '22px',
                                                fontWeight: '500',
                                                color: '#F5F1EB',
                                                display: 'block',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                lineHeight: '1.2',
                                            }}>
                                                {f.name}
                                            </span>
                                            <span style={{
                                                fontFamily: "'Jost', Arial, sans-serif",
                                                fontSize: '10px',
                                                letterSpacing: '0.15em',
                                                textTransform: 'uppercase',
                                                color: '#C9933A',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                marginTop: '6px',
                                                fontWeight: '600',
                                            }}>
                                                Open Day &rarr;
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Files Section (Photos & Videos) */}
                    {files.length > 0 && (
                        <div className="drive-gallery-grid">
                            {files.map((file, idx) => {
                                const isVideo = file.kind === 'video';

                                return (
                                    <div
                                        key={file.id}
                                        id={`media-tile-${idx}`}
                                        className="drive-media-tile"
                                        onClick={() => {
                                            if (isVideo) {
                                                setActiveVideoId(file.id);
                                            } else {
                                                const imgIndex = imageFiles.findIndex((img) => img.id === file.id);
                                                if (imgIndex !== -1) {
                                                    setLightboxIndex(imgIndex);
                                                }
                                            }
                                        }}
                                    >
                                        {/* Image / Video Thumbnail */}
                                        <img
                                            src={file.thumb}
                                            alt={file.name}
                                            loading="lazy"
                                            onError={(e) => {
                                                const fallback = `https://drive.google.com/thumbnail?id=${file.id}&sz=w480`;
                                                if (e.currentTarget.src !== fallback) {
                                                    e.currentTarget.src = fallback;
                                                }
                                            }}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                display: 'block',
                                                transition: 'transform 0.35s ease',
                                            }}
                                        />

                                        {/* Corner Download Button */}
                                        <a
                                            id={`download-button-${idx}`}
                                            href={file.download}
                                            download={file.name}
                                            rel="noopener"
                                            onClick={(e) => e.stopPropagation()}
                                            title={`Download ${file.name}`}
                                            style={{
                                                position: 'absolute',
                                                top: '8px',
                                                right: '8px',
                                                zIndex: 4,
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '4px',
                                                backgroundColor: 'rgba(28, 25, 23, 0.85)',
                                                border: '1px solid rgba(201, 147, 58, 0.4)',
                                                color: '#C9933A',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                textDecoration: 'none',
                                                transition: 'all 0.2s ease',
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                                            }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="7 10 12 15 17 10" />
                                                <line x1="12" y1="15" x2="12" y2="3" />
                                            </svg>
                                        </a>

                                        {/* Video Play Overlay */}
                                        {isVideo && (
                                            <div style={{
                                                position: 'absolute',
                                                inset: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'rgba(10, 8, 7, 0.35)',
                                                pointerEvents: 'none',
                                            }}>
                                                <div style={{
                                                    width: '46px',
                                                    height: '46px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'rgba(201, 147, 58, 0.9)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#1C1917',
                                                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.5)',
                                                }}>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                        <polygon points="6 4 20 12 6 20 6 4" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Empty State */}
                    {((!currentFolder && folders.length === 0 && files.length === 0) || (currentFolder && files.length === 0)) && (
                        <div style={{
                            padding: '64px 24px',
                            textAlign: 'center',
                            backgroundColor: '#23201D',
                            borderRadius: '8px',
                            border: '1px solid rgba(201, 147, 58, 0.2)',
                            maxWidth: '480px',
                            margin: '24px auto',
                        }}>
                            <p style={{
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '15px',
                                color: '#9A948F',
                                margin: 0,
                            }}>
                                No photos in this folder yet
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Video Preview Modal */}
            {activeVideoId && (
                <div
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setActiveVideoId(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(5, 3, 2, 0.94)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '960px',
                            aspectRatio: '16 / 9',
                            backgroundColor: '#000000',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            border: '1px solid rgba(201, 147, 58, 0.35)',
                            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setActiveVideoId(null)}
                            aria-label="Close video preview"
                            style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                zIndex: 10,
                                background: 'rgba(10, 8, 7, 0.85)',
                                border: '1px solid rgba(201, 147, 58, 0.5)',
                                color: '#F5F1EB',
                                fontSize: '18px',
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            ✕
                        </button>
                        <iframe
                            src={`https://drive.google.com/file/d/${activeVideoId}/preview`}
                            title="Google Drive Video Player"
                            allow="autoplay"
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Fullscreen Photo Lightbox */}
            {lightboxIndex !== null && imageFiles.length > 0 && (
                <UnifiedLightbox
                    images={imageFiles.map((img) => ({
                        id: img.id,
                        url: img.large,
                        thumbnailUrl: img.thumb,
                        caption: img.name,
                        subCaption: currentFolder ? currentFolder.name : undefined,
                    }))}
                    initialIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                />
            )}

            {/* Responsive Styling */}
            <style jsx global>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .drive-folders-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 16px;
                }

                .drive-folder-card {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 20px 18px;
                    background-color: #23201D;
                    border: 1px solid rgba(201, 147, 58, 0.25);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
                }

                .drive-folder-card:hover {
                    border-color: #C9933A;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(201, 147, 58, 0.18);
                }

                .drive-gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                }

                @media (min-width: 768px) {
                    .drive-gallery-grid {
                        grid-template-columns: repeat(3, 1fr);
                        gap: 16px;
                    }
                }

                @media (min-width: 1024px) {
                    .drive-gallery-grid {
                        grid-template-columns: repeat(4, 1fr);
                        gap: 18px;
                    }
                }

                .drive-media-tile {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 1 / 1;
                    overflow: hidden;
                    border-radius: 4px;
                    background-color: #0D0C0B;
                    cursor: pointer;
                    border: 1px solid rgba(201, 147, 58, 0.15);
                    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
                }

                .drive-media-tile:hover {
                    border-color: #C9933A;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
                }

                .drive-media-tile:hover img {
                    transform: scale(1.04);
                }
            `}</style>
        </div>
    );
}
