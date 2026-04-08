import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import BookingWrapper from "@/components/forms/BookingWrapper";
import { getAllTours } from "@/lib/tours";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Srikan Tours | Exclusive South India Fan Experiences",
  description: "Premium Japanese fan tours to South India. Exclusive celebrity-related experiences, studio access, cultural heritage, and culinary journeys — all with Japanese-speaking guides.",
  keywords: "Srikan Tours, India tours, South Indian cinema, Kollywood, Tollywood, travel, celebrity-related tours, cultural heritage",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string; }>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
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
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <BookingWrapper upcomingTours={upcomingTours}>
            {children}
          </BookingWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
