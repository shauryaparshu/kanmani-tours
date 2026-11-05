'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Download, ExternalLink, Folder, Play } from 'lucide-react';
import UnifiedLightbox from '@/components/ui/UnifiedLightbox';
import ArrowBox from '@/components/ui/ArrowBox';
import styles from './Memories.module.css';

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
    const t = useTranslations('Memories');
    const [folders, setFolders] = useState<DriveFolderItem[]>([]);
    const [files, setFiles] = useState<DriveFileItem[]>([]);
    const [currentFolder, setCurrentFolder] = useState<{ id: string; name: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Lightbox state
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Request counter to cancel / ignore responses from stale requests
    const requestIdRef = useRef(0);

    const fetchFolderData = useCallback(async (folderId: string | null, knownName?: string) => {
        const currentReq = ++requestIdRef.current;
        setLightboxIndex(null);
        setLoading(true);
        setError(null);

        try {
            const query = folderId ? `?folder=${encodeURIComponent(folderId)}` : '';
            const res = await fetch(`/api/memories-drive${query}`);

            // Stale check
            if (currentReq !== requestIdRef.current) return;

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || t('errorStatus', { status: res.status }));
            }

            const data: ApiResponse = await res.json();
            if (currentReq !== requestIdRef.current) return;

            setFolders(data.folders || []);
            setFiles(data.files || []);

            if (folderId) {
                const resolvedName = data.current?.name || knownName || t('folderFallback');
                setCurrentFolder({ id: folderId, name: resolvedName });
            } else {
                setCurrentFolder(null);
            }
        } catch (err: unknown) {
            if (currentReq !== requestIdRef.current) return;
            const msg = err instanceof Error ? err.message : t('errorFallback');
            setError(msg);
        } finally {
            if (currentReq === requestIdRef.current) {
                setLoading(false);
            }
        }
    }, [t]);

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

    const showEmpty = (!currentFolder && folders.length === 0 && files.length === 0) || (currentFolder && files.length === 0);

    return (
        <div className={styles.body}>
            {/* Navigation bar / breadcrumb */}
            <div className={styles.toolbar}>
                <div className={styles.trail}>
                    {currentFolder && (
                        <button id="gallery-back-button" type="button" onClick={handleBack} className={styles.backButton}>
                            <ArrowBox direction="left" />
                            <span>{t('back')}</span>
                        </button>
                    )}

                    <nav aria-label={t('breadcrumb')} className={styles.crumbs}>
                        <button
                            id="gallery-breadcrumb-root"
                            type="button"
                            onClick={() => navigateTo(null, undefined)}
                            className={styles.crumbButton}
                            disabled={!currentFolder}
                            aria-current={currentFolder ? undefined : 'page'}
                        >
                            {t('allFolders')}
                        </button>
                        {currentFolder && (
                            <>
                                <span className={styles.crumbSep} aria-hidden="true">/</span>
                                <span id="gallery-breadcrumb-current" className={styles.crumbCurrent} aria-current="page">
                                    {currentFolder.name}
                                </span>
                            </>
                        )}
                    </nav>
                </div>

                {/* In-folder "Download this day" action */}
                {currentFolder && (
                    <div className={styles.dayAction}>
                        <a
                            href={`https://drive.google.com/drive/folders/${currentFolder.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.primary}
                        >
                            <Download aria-hidden="true" />
                            <span>{t('downloadDay')}</span>
                        </a>
                        <span className={styles.dayNote}>{t('downloadDayNote')}</span>
                    </div>
                )}
            </div>

            {/* Loading state */}
            {loading && (
                <div className={styles.state} role="status">
                    <div className={styles.spinner} aria-hidden="true" />
                    <p className={styles.stateText}>{t('loading')}</p>
                </div>
            )}

            {/* Error state */}
            {!loading && error && (
                <div className={styles.state} role="alert">
                    <p className={`${styles.stateText} ${styles.stateError}`}>{error}</p>
                    <a href={driveOpenUrl} target="_blank" rel="noopener noreferrer" className={styles.secondary}>
                        <span>{t('openDrive')}</span>
                        <ExternalLink aria-hidden="true" />
                    </a>
                </div>
            )}

            {/* Content */}
            {!loading && !error && (
                <>
                    {/* Folders: one level only, shown at the root */}
                    {!currentFolder && folders.length > 0 && (
                        <ul className={styles.folders}>
                            {folders.map((f) => (
                                <li key={f.id}>
                                    <button
                                        id={`folder-${f.name.toLowerCase().replace(/\s+/g, '-')}`}
                                        type="button"
                                        onClick={() => navigateTo(f.id, f.name)}
                                        className={styles.folder}
                                    >
                                        <Folder className={styles.folderIcon} aria-hidden="true" />
                                        <span className={styles.folderName}>{f.name}</span>
                                        <span className={styles.folderOpen}>
                                            <span className="sr-only">{t('openDay')}</span>
                                            <ArrowBox />
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Photos and videos */}
                    {files.length > 0 && (
                        <ul className={styles.grid}>
                            {files.map((file, idx) => {
                                const isVideo = file.kind === 'video';

                                return (
                                    <li key={file.id} id={`media-tile-${idx}`} className={styles.tile}>
                                        <button
                                            type="button"
                                            className={styles.tileButton}
                                            data-video={isVideo ? '' : undefined}
                                            aria-label={isVideo ? t('playVideo', { name: file.name }) : t('openPhoto', { name: file.name })}
                                            onClick={() => {
                                                if (isVideo) {
                                                    window.open(
                                                        `https://drive.google.com/file/d/${file.id}/view`,
                                                        '_blank',
                                                        'noopener,noreferrer'
                                                    );
                                                } else {
                                                    const imgIndex = imageFiles.findIndex((img) => img.id === file.id);
                                                    if (imgIndex !== -1) {
                                                        setLightboxIndex(imgIndex);
                                                    }
                                                }
                                            }}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element -- Drive thumbnails, with a fallback URL on error */}
                                            <img
                                                src={file.thumb}
                                                alt={file.name}
                                                loading="lazy"
                                                className={styles.tileImage}
                                                onError={(e) => {
                                                    const fallback = `https://drive.google.com/thumbnail?id=${file.id}&sz=w480`;
                                                    if (e.currentTarget.src !== fallback) {
                                                        e.currentTarget.src = fallback;
                                                    }
                                                }}
                                            />
                                        </button>

                                        {/* Video play overlay */}
                                        {isVideo && (
                                            <div className={styles.video} aria-hidden="true">
                                                <Play />
                                                <span className={styles.videoLabel}>{t('playsInDrive')}</span>
                                            </div>
                                        )}

                                        {/* Corner download button */}
                                        <a
                                            id={`download-button-${idx}`}
                                            href={file.download}
                                            download={file.name}
                                            target={isVideo ? '_blank' : undefined}
                                            rel={isVideo ? 'noopener noreferrer' : 'noopener'}
                                            title={t('download', { name: file.name })}
                                            aria-label={t('download', { name: file.name })}
                                            className={styles.download}
                                        >
                                            <Download aria-hidden="true" />
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {/* Empty state */}
                    {showEmpty && (
                        <div className={styles.state}>
                            <p className={styles.stateText}>{t('empty')}</p>
                        </div>
                    )}
                </>
            )}

            {/* Fullscreen photo lightbox */}
            {lightboxIndex !== null && imageFiles.length > 0 && (
                <UnifiedLightbox
                    images={imageFiles.map((img) => {
                        const folderCaption = currentFolder ? currentFolder.name : img.name;
                        const prevSubCaption = currentFolder ? currentFolder.name : undefined;
                        const subCaption = prevSubCaption === folderCaption ? undefined : prevSubCaption;

                        return {
                            id: img.id,
                            url: img.large,
                            thumbnailUrl: img.thumb,
                            caption: folderCaption,
                            subCaption,
                            downloadUrl: img.download,
                            downloadName: img.name,
                        };
                    })}
                    initialIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                />
            )}
        </div>
    );
}
