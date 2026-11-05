import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { client } from '@/sanity/lib/client';
import { FOUNDER_PHOTOS_QUERY } from '@/sanity/lib/queries';
import Footer from '@/components/layout/FooterSection';
import FounderIntro from '@/components/about/FounderIntro';
import FounderChapters, { type ChapterPhoto } from '@/components/about/FounderChapters';
import AlbumGrid, { type Album } from '@/components/about/AlbumGrid';
import {
    ALBUMS,
    caption,
    photosFor,
    pickCovers,
    photoUrl,
    subCaption,
    thumbUrl,
    type FounderPhoto,
} from '@/components/about/founderPhotos';
import { pageAlternates } from '@/lib/site';
import styles from './page.module.css';

// Static with incremental regeneration: Sanity edits appear within 60 seconds.
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'About' });
    return {
        title: t('metaTitle'),
        alternates: pageAlternates(locale, '/about'),
    };
}

// Each chapter is illustrated from the album of the same period of her life.
const CHAPTER_ALBUMS = ['student-phd', 'achievements', 'world-travel'] as const;

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'About' });
    const founderPhotos: FounderPhoto[] =
        (await client.fetch(FOUNDER_PHOTOS_QUERY, {}, { next: { revalidate: 60 } })) ?? [];

    const filled = ALBUMS.map((id) => ({
        id,
        photos: photosFor(founderPhotos, id)
            .map((photo) => ({
                id: photo._id,
                url: photoUrl(photo),
                thumbnailUrl: thumbUrl(photo),
                lqip: photo.image.asset?.metadata?.lqip,
                caption: caption(photo, locale) || t(`albums.${id}`),
                subCaption: subCaption(photo, locale) || undefined,
            }))
            .filter((photo) => photo.url),
    })).filter((album) => album.photos.length > 0);

    const chapterPhotos: ChapterPhoto[][] = CHAPTER_ALBUMS.map((id) =>
        (filled.find((album) => album.id === id)?.photos ?? []).slice(0, 2).map((photo) => ({
            url: photo.url,
            lqip: photo.lqip,
            alt: photo.caption ?? t(`albums.${id}`),
        })),
    );

    const covers = pickCovers(filled, chapterPhotos.flat().map((photo) => photo.url));
    const albums: Album[] = filled.map((album, i) => ({ ...album, cover: covers[i] }));

    return (
        <>
            <main className={styles.page} data-ds>
                <FounderIntro />
                <FounderChapters photos={chapterPhotos} />
                {albums.length > 0 ? (
                    <section className={styles.albums} aria-labelledby="founder-albums-title">
                        <div className={styles.container}>
                            <h2 id="founder-albums-title" className={styles.albumsTitle}>{t('albumsTitle')}</h2>
                            <AlbumGrid albums={albums} />
                        </div>
                    </section>
                ) : null}
            </main>
            <Footer />
        </>
    );
}
