import { Cormorant_Garamond, Jost, Noto_Sans_JP } from 'next/font/google';

// Self-hosted via next/font. Components reference these through the CSS
// variables below, e.g. fontFamily: "var(--font-cormorant), Georgia, serif".

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

// Only used for a few Japanese UI labels; large file, so not preloaded.
export const notoSansJp = Noto_Sans_JP({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-noto-jp',
    preload: false,
});
