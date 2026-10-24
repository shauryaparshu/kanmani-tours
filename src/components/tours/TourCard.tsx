import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { Tour } from '@/lib/tours';
import Develop from '@/components/ui/Develop';
import { formatTourDates, isUpcoming } from './tourDates';
import styles from './TourCard.module.css';

interface TourCardProps {
    tour: Tour;
    /** `sizes` for the photo, matching how wide the card renders. */
    sizes: string;
    headingLevel?: 'h2' | 'h3';
    /** `feature`: a wide card in a grid, its photo matching the height of its tall neighbours. */
    variant?: 'default' | 'feature';
}

export default function TourCard({ tour, sizes, headingLevel: Heading = 'h3', variant = 'default' }: TourCardProps) {
    const t = useTranslations('TourCard');
    const locale = useLocale();

    const upcoming = isUpcoming(tour.startDate);
    const dates = upcoming && tour.isComingSoon && tour.dateDisplay
        ? tour.dateDisplay
        : formatTourDates(tour.startDate, tour.endDate, locale);
    const status = !upcoming
        ? t('past')
        : tour.seatsLeft > 0
            ? t('seatsLeft', { count: tour.seatsLeft })
            : t('upcoming');
    const href = tour.destination === 'japan' ? `/japan/tours/${tour.slug}` : `/india/tours/${tour.slug}`;

    return (
        <article className={styles.card} data-variant={variant}>
            <Link href={href} className={styles.link}>
                <Develop className={styles.photo}>
                    {tour.coverImage ? (
                        <Image
                            src={tour.coverImage}
                            alt=""
                            fill
                            sizes={sizes}
                            className={styles.image}
                            placeholder={tour.coverImageLqip ? 'blur' : 'empty'}
                            blurDataURL={tour.coverImageLqip || undefined}
                        />
                    ) : null}
                    {tour.location ? <span className={styles.place}>{tour.location}</span> : null}
                    <Heading className={styles.title}>{tour.title}</Heading>
                </Develop>
                <p className={styles.credits}>
                    <span className="num">{dates}</span>
                    <span className={styles.leader} aria-hidden="true" />
                    <span className={upcoming ? styles.statusUpcoming : styles.status}>{status}</span>
                </p>
            </Link>
        </article>
    );
}
