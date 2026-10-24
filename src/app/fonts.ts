import { Cormorant_Garamond, DM_Sans, Jost, Newsreader, Noto_Sans_JP, Shippori_Mincho } from 'next/font/google';

// Self-hosted via next/font. Components use the role tokens in tokens.css
// (--font-display, --font-body), never these family variables directly.
// All four families are SIL Open Font License (checked in google/fonts METADATA).

// Display serif for Latin text. Variable, with optical sizing for large headings.
export const newsreader = Newsreader({
    subsets: ['latin'],
    style: ['normal', 'italic'],
    axes: ['opsz'],
    display: 'swap',
    variable: '--font-newsreader',
});

// Body sans for Latin text.
export const dmSans = DM_Sans({
    subsets: ['latin'],
    axes: ['opsz'],
    display: 'swap',
    variable: '--font-dm-sans',
});

// Japanese headings. Large file, so not preloaded.
export const shipporiMincho = Shippori_Mincho({
    subsets: ['latin'],
    weight: ['400', '500'],
    display: 'swap',
    variable: '--font-shippori',
    preload: false,
});

// Japanese body text. Large file, so not preloaded.
export const notoSansJp = Noto_Sans_JP({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-noto-jp',
    preload: false,
});

// Legacy faces used by sections not yet migrated to the tokens. Removed in the
// final reskin step, once nothing references --font-cormorant or --font-jost.
export const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    style: ['normal', 'italic'],
    display: 'swap',
    variable: '--font-cormorant',
});

export const jost = Jost({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-jost',
});
