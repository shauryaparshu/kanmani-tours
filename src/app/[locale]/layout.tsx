import type { Metadata, Viewport } from "next";
import "../tokens.css";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navigation from '@/components/layout/Navigation';
import { Analytics } from '@vercel/analytics/next';
import { cormorant, dmSans, jost, newsreader, notoSansJp, shipporiMincho } from '../fonts';
import { SITE_URL, pageOpenGraph } from '@/lib/site';

const SITE_TITLE = "Kanmani Tours | Exclusive Japan-India Journeys";
const SITE_DESCRIPTION = "Premium Japanese fan tours to South India. Exclusive celebrity-related experiences, studio access, cultural heritage, and culinary journeys — all with Japanese-speaking guides.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: pageOpenGraph(SITE_TITLE, SITE_DESCRIPTION),
  twitter: {
    card: 'summary_large_image',
  },
  keywords: "Kanmani Tours, India tours, South Indian cinema, Kollywood, Tollywood, travel, celebrity-related tours, cultural heritage",
  icons: {
    icon: '/assets/logo.svg',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string; }>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html lang={locale} className={[newsreader, dmSans, shipporiMincho, notoSansJp, cormorant, jost].map((f) => f.variable).join(' ')} style={{ scrollbarWidth: 'thin', scrollbarColor: '#C9933A #1C1917' }}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Navigation />
          <div className="nav-desktop-spacer" aria-hidden="true" />
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
