import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import BookingWrapper from "@/components/forms/BookingWrapper";
import { getAllTours } from "@/lib/tours";
import Navigation from '@/components/layout/Navigation';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: "Kanmani Tours | Exclusive Japan-India Journeys",
  description: "Premium Japanese fan tours to South India. Exclusive celebrity-related experiences, studio access, cultural heritage, and culinary journeys — all with Japanese-speaking guides.",
  keywords: "Kanmani Tours, India tours, South Indian cinema, Kollywood, Tollywood, travel, celebrity-related tours, cultural heritage",
  icons: {
    icon: '/assets/logo.svg',
  },
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
  // Filter only upcoming tours for the booking dropdown
  const allTours = await getAllTours();
  const upcomingTours = allTours.filter(t => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(t.startDate) >= today;
  });

  return (
    <html lang={locale} style={{ scrollbarWidth: 'thin', scrollbarColor: '#C9933A #1C1917' }}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <BookingWrapper upcomingTours={upcomingTours}>
            <Navigation />
            <div className="nav-desktop-spacer" aria-hidden="true" />
            {children}
          </BookingWrapper>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
