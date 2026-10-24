'use client';

import { useCallback, useEffect, useRef, useState, type TouchEvent } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import styles from './UnifiedLightbox.module.css';

export interface LightboxImage {
    id: string;
    url: string;
    thumbnailUrl: string;
    lqip?: string;
    caption?: string;
    subCaption?: string;
    downloadUrl?: string;
    downloadName?: string;
}

interface UnifiedLightboxProps {
    images: LightboxImage[];
    initialIndex: number;
    onClose: () => void;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen photo viewer: a modal dialog on the ink ground with the caption
 * above, the photo centred, and the whole set as a strip below. Arrow keys and
 * swipes move between photos; Escape closes and returns focus to the opener.
 */
export default function UnifiedLightbox({ images, initialIndex, onClose }: UnifiedLightboxProps) {
    const t = useTranslations('Lightbox');
    const count = images.length;
    const [index, setIndex] = useState(() => Math.min(Math.max(initialIndex, 0), Math.max(count - 1, 0)));
    const dialogRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const stripRef = useRef<HTMLOListElement>(null);
    const touch = useRef<{ x: number; y: number } | null>(null);

    const goNext = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
    const goPrev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

    // Move focus in, lock the page behind, and give focus back on close.
    useEffect(() => {
        const opener = document.activeElement as HTMLElement | null;
        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();
        return () => {
            document.body.style.overflow = overflow;
            opener?.focus?.();
        };
    }, []);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            else if (e.key === 'ArrowLeft') goPrev();
            else if (e.key === 'ArrowRight') goNext();
            else if (e.key === 'Tab' && dialogRef.current) {
                // Keep Tab inside the dialog.
                const items = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
                const first = items[0];
                const last = items[items.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last?.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first?.focus();
                }
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [goPrev, goNext, onClose]);

    // Keep the current thumbnail in view, and fetch the neighbours ahead of time.
    useEffect(() => {
        const strip = stripRef.current;
        const active = strip?.children[index] as HTMLElement | undefined;
        if (strip && active) {
            strip.scrollTo({
                left: active.offsetLeft - strip.clientWidth / 2 + active.clientWidth / 2,
                behavior: 'smooth',
            });
        }
        if (count > 1) {
            for (const n of [index + 1, index - 1 + count]) {
                const img = new window.Image();
                img.src = images[n % count].url;
            }
        }
    }, [index, count, images]);

    if (count === 0) return null;

    const current = images[index];

    const onTouchStart = (e: TouchEvent) => {
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = (e: TouchEvent) => {
        if (!touch.current) return;
        const dx = e.changedTouches[0].clientX - touch.current.x;
        const dy = e.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            if (dx < 0) goNext();
            else goPrev();
        }
        touch.current = null;
    };

    return createPortal(
        <div
            ref={dialogRef}
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-label={t('dialogLabel')}
            data-ds
        >
            <div className={styles.bar}>
                <div className={styles.captions} aria-live="polite">
                    <p className={`${styles.counter} num`}>
                        <span aria-hidden="true">{String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
                        <span className="sr-only">{t('counter', { n: index + 1, count })}</span>
                    </p>
                    {current.caption ? <p className={styles.caption}>{current.caption}</p> : null}
                    {current.subCaption ? <p className={styles.subCaption}>{current.subCaption}</p> : null}
                </div>
                <div className={styles.actions}>
                    {current.downloadUrl ? (
                        <a
                            href={current.downloadUrl}
                            download={current.downloadName || true}
                            rel="noopener"
                            className={styles.download}
                            aria-label={t('downloadLabel')}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                                <path d="M12 3v12M7 10l5 5 5-5M4 20h16" />
                            </svg>
                            <span className={styles.downloadText}>{t('download')}</span>
                        </a>
                    ) : null}
                    <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label={t('close')}>
                        <span aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className={styles.stage} onClick={onClose}>
                {/* eslint-disable-next-line @next/next/no-img-element -- photos come from several hosts (Sanity, Drive) at their own sizes */}
                <img
                    key={current.id}
                    src={current.url}
                    alt={current.caption || ''}
                    className={styles.photo}
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                />
                {count > 1 ? (
                    <>
                        <button
                            type="button"
                            className={styles.prev}
                            onClick={(e) => { e.stopPropagation(); goPrev(); }}
                            aria-label={t('previous')}
                        >
                            <span aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            className={styles.next}
                            onClick={(e) => { e.stopPropagation(); goNext(); }}
                            aria-label={t('next')}
                        >
                            <span aria-hidden="true" />
                        </button>
                    </>
                ) : null}
            </div>

            {count > 1 ? (
                <ol ref={stripRef} className={styles.strip} aria-label={t('thumbnails')}>
                    {images.map((photo, i) => (
                        <li key={photo.id}>
                            <button
                                type="button"
                                className={styles.thumb}
                                aria-current={i === index || undefined}
                                aria-label={t('showPhoto', { n: i + 1 })}
                                onClick={() => setIndex(i)}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element -- see the main photo */}
                                <img src={photo.thumbnailUrl} alt="" loading="lazy" />
                            </button>
                        </li>
                    ))}
                </ol>
            ) : null}
        </div>,
        document.body,
    );
}
