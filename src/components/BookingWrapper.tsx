'use client';

import { BookingProvider } from '@/context/BookingContext';
import BookingModal from '@/components/BookingModal';

interface Tour {
    slug: string;
    title: string;
    startDate: string;
    seatsLeft: number;
    category: string;
}

export default function BookingWrapper({
    children,
    upcomingTours,
}: {
    children: React.ReactNode;
    upcomingTours: Tour[];
}) {
    return (
        <BookingProvider>
            {children}
            <BookingModal upcomingTours={upcomingTours} />
        </BookingProvider>
    );
}
