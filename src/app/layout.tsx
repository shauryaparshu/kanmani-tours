import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BookingWrapper from "@/components/BookingWrapper";
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Filter only upcoming tours for the booking dropdown
  const allTours = await getAllTours();
  const upcomingTours = allTours.filter(t => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(t.startDate) >= today;
  });

  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <BookingWrapper upcomingTours={upcomingTours}>
          {children}
        </BookingWrapper>
      </body>
    </html>
  );
}
