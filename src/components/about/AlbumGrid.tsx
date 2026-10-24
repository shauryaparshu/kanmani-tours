'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import UnifiedLightbox from '@/components/ui/UnifiedLightbox';
import Develop from '@/components/ui/Develop';
import styles from './AlbumGrid.module.css';

export interface AlbumPhoto {
    id: string;
    url: string;
    thumbnailUrl: string;
    lqip?: string;
    caption?: string;
    subCaption?: string;
}

export interface Album {
    id: 'celebrity' | 'world-travel' | 'achievements' | 'student-phd';
    photos: AlbumPhoto[];
    /** Index of the cover photo; the lightbox opens on it. */
    cover: number;
}

export default function AlbumGrid({ albums }: { albums: Album[] }) {
    const t = useTranslations('About');
    const [open, setOpen] = useState<Album | null>(null);

    return (
        <>
            <ul className={styles.grid} data-count={albums.length}>
                {albums.map((album, i) => {
                    const cover = album.photos[album.cover];
                    const label = t(`albums.${album.id}`);
                    const count = album.photos.length;
                    return (
                        <li key={album.id} className={styles.tile}>
                            <button
                                type="button"
                                className={styles.button}
                                onClick={() => setOpen(album)}
                                aria-label={t('openAlbum', { album: label, count })}
                            >
                                <Develop className={styles.photo}>
                                    <Image
                                        src={cover.url}
                                        alt=""
                                        fill
                                        sizes={i === 0 ? '(min-width: 900px) 50vw, 100vw' : '(min-width: 900px) 25vw, 50vw'}
                                        className={styles.image}
                                        placeholder={cover.lqip ? 'blur' : 'empty'}
                                        blurDataURL={cover.lqip}
                                    />
                                </Develop>
                                <span className={styles.caption} aria-hidden="true">
                                    <span className={styles.label}>{label}</span>
                                    <span className={`${styles.count} num`}>{t('albumCount', { count })}</span>
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>

            {open ? (
                <UnifiedLightbox images={open.photos} initialIndex={open.cover} onClose={() => setOpen(null)} />
            ) : null}
        </>
    );
}
