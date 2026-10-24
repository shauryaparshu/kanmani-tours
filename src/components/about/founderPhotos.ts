import { containThumbnailImageUrl, galleryImageUrl } from '@/sanity/lib/image';

export interface FounderPhoto {
    _id: string;
    caption?: string;
    captionJa?: string;
    era: string;
    year?: number;
    location?: string;
    country?: { _id: string; title: string; title_ja?: string; key: string };
    featured?: boolean;
    image: { asset?: { url?: string; metadata?: { lqip?: string } } };
}

/** Albums shown on the page, in order. Photos in any other era stay hidden. */
export const ALBUMS = ['celebrity', 'world-travel', 'achievements', 'student-phd'] as const;
export type AlbumId = (typeof ALBUMS)[number];

/** A photo's album, featured photos first, each image once. */
export function photosFor(photos: FounderPhoto[], era: string): FounderPhoto[] {
    const seen = new Set<string>();
    const inEra = photos.filter((p) => {
        const key = p.image?.asset?.url;
        if (p.era !== era || !key || seen.has(key)) return false;
        seen.add(key);
        return true;
    });
    return [...inEra.filter((p) => p.featured), ...inEra.filter((p) => !p.featured)];
}

/**
 * Keys that identify a picture: its file, and its pixel size from the URL
 * ("…-1182x782.jpg"). Matching on size catches the same scan uploaded twice;
 * a false match only moves a cover to the album's next photo.
 */
function pictureKeys(url: string): string[] {
    const file = url.split('?')[0];
    const size = file.match(/-(\d+x\d+)\.\w+$/)?.[1];
    return size ? [file, size] : [file];
}

/**
 * The index of each album's cover: the first photo not already on the page,
 * so the chapters and the covers never repeat a picture.
 */
export function pickCovers(albums: { photos: { url: string }[] }[], shownUrls: string[]): number[] {
    const shown = new Set(shownUrls.flatMap(pictureKeys));
    return albums.map(({ photos }) => {
        const index = Math.max(0, photos.findIndex((p) => !pictureKeys(p.url).some((k) => shown.has(k))));
        pictureKeys(photos[index].url).forEach((k) => shown.add(k));
        return index;
    });
}

export function photoUrl(photo: FounderPhoto): string {
    try {
        return galleryImageUrl(photo.image) || photo.image.asset?.url || '';
    } catch {
        return photo.image.asset?.url ?? '';
    }
}

export function thumbUrl(photo: FounderPhoto): string {
    try {
        return containThumbnailImageUrl(photo.image) || photoUrl(photo);
    } catch {
        return photoUrl(photo);
    }
}

export function caption(photo: FounderPhoto, locale: string): string {
    return (locale === 'ja' && photo.captionJa) || photo.caption || '';
}

/** "2019 · Tanzania": year and place for the lightbox. */
export function subCaption(photo: FounderPhoto, locale: string): string {
    const place = photo.era === 'world-travel' && photo.country
        ? (locale === 'ja' && photo.country.title_ja) || photo.country.title
        : photo.location;
    return [photo.year, place].filter(Boolean).join(' · ');
}
