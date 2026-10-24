'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import UnifiedLightbox from '@/components/ui/UnifiedLightbox';
import Develop from '@/components/ui/Develop';
import styles from './TourGallery.module.css';

export interface GalleryPhoto {
    url: string;
    lqip?: string;
}

interface TourGalleryProps {
    photos: GalleryPhoto[];
    title: string;
}

// The lead photo fills a 2 x 2 block, so 5 or 9 photos complete every row
// in both the 2-column and 4-column layouts. The rest open through "View all".
function mosaicCount(total: number): number {
    if (total >= 9) return 9;
    if (total >= 5) return 5;
    return total;
}

export default function TourGallery({ photos, title }: TourGalleryProps) {
    const t = useTranslations('TourDetail');
    const [open, setOpen] = useState<number | null>(null);

    const shown = photos.slice(0, mosaicCount(photos.length));
    const alt = (n: number) => t('photoAlt', { title, n });

    return (
        <>
            <ul className={styles.mosaic} data-count={shown.length}>
                {shown.map((photo, i) => (
                    <li key={photo.url} className={styles.tile}>
                        <button
                            type="button"
                            className={styles.button}
                            onClick={() => setOpen(i)}
                            aria-label={t('openPhoto', { n: i + 1, count: photos.length })}
                        >
                            <Develop className={styles.photo}>
                                <Image
                                    src={photo.url}
                                    alt={alt(i + 1)}
                                    fill
                                    sizes={i === 0 ? '(min-width: 900px) 50vw, 100vw' : '(min-width: 900px) 25vw, 50vw'}
                                    className={styles.image}
                                    placeholder={photo.lqip ? 'blur' : 'empty'}
                                    blurDataURL={photo.lqip}
                                />
                            </Develop>
                        </button>
                    </li>
                ))}
            </ul>

            {photos.length > shown.length ? (
                <div className={styles.more}>
                    <button type="button" className={styles.viewAll} onClick={() => setOpen(0)}>
                        {t('viewAllPhotos', { count: photos.length })}
                    </button>
                </div>
            ) : null}

            {open !== null ? (
                <UnifiedLightbox
                    images={photos.map((photo, i) => ({
                        id: `tour-photo-${i}`,
                        url: photo.url,
                        thumbnailUrl: photo.url,
                        lqip: photo.lqip,
                        caption: alt(i + 1),
                    }))}
                    initialIndex={open}
                    onClose={() => setOpen(null)}
                />
            ) : null}
        </>
    );
}
