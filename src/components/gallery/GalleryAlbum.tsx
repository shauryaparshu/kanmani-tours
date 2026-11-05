import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import TourGallery, { type GalleryPhoto } from '@/components/tours/detail/TourGallery';
import ArrowBox from '@/components/ui/ArrowBox';
import styles from './GalleryAlbum.module.css';

interface GalleryAlbumProps {
    title: string;
    dates: string;
    tourHref: string;
    photos: GalleryPhoto[];
}

// One past tour's photographs: a credits line, the mosaic, and the way back to the tour.
export default function GalleryAlbum({ title, dates, tourHref, photos }: GalleryAlbumProps) {
    const t = useTranslations('Gallery');

    return (
        <section className={styles.section}>
            <div className={styles.inner}>
                <div className={styles.head}>
                    <p className={styles.meta}>
                        <span className="num">{dates}</span>
                        <span className="num">{t('photoCount', { count: photos.length })}</span>
                    </p>
                    <Link href={tourHref} className={styles.tourLink}>
                        {t('viewTour')}
                        <ArrowBox />
                    </Link>
                </div>
                {photos.length > 0 ? (
                    <TourGallery photos={photos} title={title} />
                ) : (
                    <p className={styles.empty}>{t('albumEmpty')}</p>
                )}
            </div>
        </section>
    );
}
