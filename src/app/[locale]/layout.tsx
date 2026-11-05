import type { Metadata, Viewport } from "next";
import "../tokens.css";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navigation from '@/components/layout/Navigation';
import EnquireTab from '@/components/layout/EnquireTab';
import BackToTop from '@/components/layout/BackToTop';
import { Analytics } from '@vercel/analytics/next';
import { dmSans, greatVibes, newsreader, notoSansJp, shipporiMincho } from '../fonts';
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

// Both locales are prerendered; pages opt into 60-second revalidation where they read Sanity.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={[newsreader, dmSans, shipporiMincho, notoSansJp, greatVibes].map((f) => f.variable).join(' ')}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Navigation />
          <div id="main-content" tabIndex={-1} />
          {children}
          <EnquireTab />
          <BackToTop />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
