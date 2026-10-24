import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { Tour } from '@/lib/tours';
import { cardImageUrl, galleryImageUrl } from '@/sanity/lib/image';
import ArrowBox from '@/components/ui/ArrowBox';
import TourCard from '../TourCard';
import { formatTourDates, isUpcoming } from '../tourDates';
import TourGallery, { type GalleryPhoto } from './TourGallery';
import styles from './TourDetail.module.css';

interface TourDetailProps {
    tour: Tour;
    moreTours: Tour[];
}

type SanityImage = { asset?: { url?: string; metadata?: { lqip?: string } } };

function toPhotos(images: unknown[]): GalleryPhoto[] {
    return images.flatMap((img) => {
        if (!img) return [];
        if (typeof img === 'string') return [{ url: img }];
        const image = img as SanityImage;
        let url = '';
        try {
            url = galleryImageUrl(image);
        } catch {
            url = image.asset?.url ?? '';
        }
        return url ? [{ url, lqip: image.asset?.metadata?.lqip }] : [];
    });
}

function dayImageUrl(image: unknown): string | null {
    if (!image) return null;
    if (typeof image === 'string') return image;
    try {
        return cardImageUrl(image) || null;
    } catch {
        return (image as SanityImage).asset?.url ?? null;
    }
}

export default function TourDetail({ tour, moreTours }: TourDetailProps) {
    const t = useTranslations('TourDetail');
    const tHome = useTranslations('Home');
    const tTours = useTranslations('Tours');
    const tDest = useTranslations('DestinationChoice');
    const tNav = useTranslations('Navigation');
    const locale = useLocale();

    const upcoming = isUpcoming(tour.startDate);
    const isJapan = tour.destination === 'japan';
    const dates = upcoming && tour.isComingSoon && tour.dateDisplay
        ? tour.dateDisplay
        : formatTourDates(tour.startDate, tour.endDate, locale);

    // The credits block: what a visitor checks before anything else.
    const credits: [string, string][] = [
        [t('datesLabel'), dates],
        ...(tour.durationDays > 0 ? [[t('durationLabel'), t('durationValue', { count: tour.durationDays })] as [string, string]] : []),
        ...(tour.location ? [[t('citiesLabel'), tour.location] as [string, string]] : []),
        !upcoming
            ? [t('statusLabel'), t('statusPast')]
            : tour.bookingClosed
                ? [t('statusLabel'), t('bookingClosed')]
                : [t('seatsLabel'), t('seatsValue', { count: tour.seatsLeft })],
        [t('bookingLabel'), tour.bookingType === 'group' ? t('bookingGroup') : t('bookingPrivate')],
        ...(!isJapan ? [[t('guideLabel'), t('guideJapanese')] as [string, string]] : []),
    ];

    const canBookOnline = upcoming && !tour.bookingClosed && Boolean(tour.bookingLink);
    const photos = toPhotos(tour.galleryImages ?? []);
    const paragraphs = (tour.longDescription ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    const features = tour.features ?? [];
    const experience = tour.whatToExpect ?? [];
    const itinerary = tour.itinerary ?? [];
    const inclusions = tour.inclusions ?? [];
    const exclusions = tour.exclusions ?? [];
    const faq = (tour.faq ?? []).filter((f) => f.question && f.answer);

    return (
        <article className={styles.page} data-ds>
            {/* ── Hero ── */}
            <header className={styles.hero}>
                {tour.coverImage ? (
                    <Image
                        src={tour.coverImage}
                        alt=""
                        fill
                        sizes="100vw"
                        preload
                        className={styles.heroImage}
                        placeholder={tour.coverImageLqip ? 'blur' : 'empty'}
                        blurDataURL={tour.coverImageLqip || undefined}
                    />
                ) : null}
                <div className={styles.heroContent}>
                    <h1 className={styles.title}>{tour.title}</h1>
                    {tour.shortDescription ? <p className={styles.lead}>{tour.shortDescription}</p> : null}
                </div>
            </header>

            {/* ── Breadcrumb, highlights and credits: the programme's centre spread ── */}
            <div className={styles.container}>
                <nav aria-label={tNav('breadcrumb')}>
                    <ol className={styles.trail}>
                        <li><Link href="/">{tTours('breadcrumbHome')}</Link></li>
                        <li><Link href={isJapan ? '/japan/tours' : '/india/tours'}>{isJapan ? tDest('japanTitle') : tDest('indiaTitle')}</Link></li>
                        <li><span aria-current="page">{tour.title}</span></li>
                    </ol>
                </nav>

                <section className={styles.spread} aria-labelledby="tour-credits-title">
                    <div className={styles.highlights}>
                        <h2 className={styles.panelTitle}>{tHome('highlights')}</h2>
                        {features.length > 0 ? (
                            <ul className={styles.bullets}>
                                {features.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        ) : (
                            <p className={styles.body}>{tour.shortDescription}</p>
                        )}
                    </div>

                    <div className={styles.credits}>
                        <h2 id="tour-credits-title" className={styles.panelTitle}>{t('creditsTitle')}</h2>
                        <dl className={styles.creditList}>
                            {credits.map(([label, value]) => (
                                <div key={label} className={styles.creditRow}>
                                    <dt>{label}</dt>
                                    <dd className="num">{value}</dd>
                                </div>
                            ))}
                        </dl>
                        <div className={styles.actions}>
                            {canBookOnline && tour.bookingLink ? (
                                <a href={tour.bookingLink} className={styles.primary} target="_blank" rel="noopener noreferrer">
                                    {t('bookTour')}
                                </a>
                            ) : null}
                            <Link href="/contact" className={canBookOnline ? styles.secondary : styles.primary}>
                                {tNav('enquire')}
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── About and what you'll experience ── */}
                {paragraphs.length > 0 || experience.length > 0 ? (
                    <section className={styles.about} aria-labelledby="tour-about-title">
                        <div className={styles.aboutText}>
                            <h2 id="tour-about-title" className={styles.sectionTitle}>{tHome('aboutTour')}</h2>
                            {paragraphs.map((p, i) => <p key={i} className={styles.body}>{p}</p>)}
                        </div>
                        {experience.length > 0 ? (
                            <div className={styles.experience}>
                                <h3 className={styles.panelTitle}>{tHome('whatToExpect')}</h3>
                                <ul className={styles.ruledList}>
                                    {experience.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        ) : null}
                    </section>
                ) : null}

                {/* ── Day by day ── */}
                {itinerary.length > 0 ? (
                    <section className={styles.section} aria-labelledby="tour-itinerary-title">
                        <h2 id="tour-itinerary-title" className={styles.sectionTitle}>{tHome('itinerary')}</h2>
                        <ol className={styles.days}>
                            {itinerary.map((day, i) => {
                                const image = dayImageUrl(day.image);
                                const n = day.dayNumber || i + 1;
                                return (
                                    <li key={i} className={styles.day}>
                                        <p className={`${styles.dayNumber} num`}>{t('dayLabel', { n })}</p>
                                        <div className={styles.dayBody}>
                                            {day.title ? <h3 className={styles.dayTitle}>{day.title}</h3> : null}
                                            {day.details ? <p className={styles.body}>{day.details}</p> : null}
                                        </div>
                                        {image ? (
                                            <div className={styles.dayImage}>
                                                <Image src={image} alt="" fill sizes="(min-width: 1024px) 240px, 100vw" className={styles.cover} />
                                            </div>
                                        ) : null}
                                    </li>
                                );
                            })}
                        </ol>
                    </section>
                ) : null}

                {/* ── Included / not included ── */}
                {inclusions.length > 0 || exclusions.length > 0 ? (
                    <section className={styles.included} aria-label={`${tHome('included')} / ${tHome('notIncluded')}`}>
                        {inclusions.length > 0 ? (
                            <div>
                                <h2 className={styles.panelTitle}>{tHome('included')}</h2>
                                <ul className={`${styles.ruledList} ${styles.yes}`}>
                                    {inclusions.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        ) : null}
                        {exclusions.length > 0 ? (
                            <div>
                                <h2 className={styles.panelTitle}>{tHome('notIncluded')}</h2>
                                <ul className={`${styles.ruledList} ${styles.no}`}>
                                    {exclusions.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        ) : null}
                    </section>
                ) : null}
            </div>

            {/* ── Gallery ── */}
            {photos.length > 0 ? (
                <section className={styles.gallery} aria-labelledby="tour-gallery-title">
                    <div className={styles.container}>
                        <h2 id="tour-gallery-title" className={styles.sectionTitle}>{tHome('photoGallery')}</h2>
                    </div>
                    <TourGallery photos={photos} title={tour.title} />
                </section>
            ) : null}

            {/* ── Questions ── */}
            {faq.length > 0 ? (
                <div className={styles.container}>
                    <section className={styles.section} aria-labelledby="tour-faq-title">
                        <h2 id="tour-faq-title" className={styles.sectionTitle}>{t('faqTitle')}</h2>
                        <div className={styles.faq}>
                            {faq.map((item, i) => (
                                <details key={i} className={styles.question}>
                                    <summary>{item.question}</summary>
                                    <p className={styles.body}>{item.answer}</p>
                                </details>
                            ))}
                        </div>
                    </section>
                </div>
            ) : null}

            {/* ── More journeys ── */}
            {moreTours.length > 0 ? (
                <section className={styles.more} aria-labelledby="tour-more-title">
                    <div className={styles.container}>
                        <div className={styles.moreHead}>
                            <h2 id="tour-more-title" className={styles.sectionTitle}>{t('moreJourneys')}</h2>
                            <Link href={isJapan ? '/japan/tours' : '/india/tours'} className={styles.textLink}>
                                {tHome('viewAllTours')}
                                <ArrowBox />
                            </Link>
                        </div>
                        <ul className={styles.moreGrid}>
                            {moreTours.map((other) => (
                                <li key={other._id || other.slug}>
                                    <TourCard tour={other} sizes="(min-width: 1200px) 25vw, (min-width: 600px) 50vw, 100vw" />
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            ) : null}
        </article>
    );
}
