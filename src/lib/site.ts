import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

// Production host. The apex domain 308-redirects here.
export const SITE_URL = 'https://www.kanmanitours.com';

/**
 * Absolute URL for a path in a locale. Matches localePrefix: 'as-needed':
 * the default locale (ja) has no prefix, English is under /en.
 */
export function localizedUrl(locale: string, path: string = ''): string {
    const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
    return `${SITE_URL}${prefix}${path}` || `${SITE_URL}/`;
}

/** Canonical + hreflang alternates for a page. */
export function pageAlternates(
    locale: string,
    path: string = '',
    { englishOnly = false }: { englishOnly?: boolean } = {}
): Metadata['alternates'] {
    if (englishOnly) {
        const en = localizedUrl('en', path);
        return { canonical: en, languages: { en, 'x-default': en } };
    }

    const ja = localizedUrl('ja', path);
    const en = localizedUrl('en', path);
    return {
        canonical: localizedUrl(locale, path),
        languages: { ja, en, 'x-default': ja },
    };
}

export const DEFAULT_OG_IMAGE = {
    url: '/assets/og-default.jpg',
    width: 1200,
    height: 630,
    alt: 'Japanese fans on a Kanmani Tours trip in India',
};

/**
 * Open Graph block for a page. A page's openGraph replaces the layout's rather
 * than merging with it, so the shared fields are restated here.
 */
export function pageOpenGraph(title: string, description: string): Metadata['openGraph'] {
    return {
        type: 'website',
        siteName: 'Kanmani Tours',
        title,
        description,
        images: [DEFAULT_OG_IMAGE],
    };
}
