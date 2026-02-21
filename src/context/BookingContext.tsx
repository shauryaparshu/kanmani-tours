'use client';

import React, { createContext, useContext, useState } from 'react';

interface BookingContextType {
    openBooking: (tourSlug?: string) => void;
    closeBooking: () => void;
    isOpen: boolean;
    preselectedSlug: string | null;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function useBooking() {
    const ctx = useContext(BookingContext);
    if (!ctx) throw new Error('useBooking must be used inside BookingProvider');
    return ctx;
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [preselectedSlug, setPreselectedSlug] = useState<string | null>(null);

    const openBooking = (tourSlug?: string) => {
        setPreselectedSlug(tourSlug ?? null);
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeBooking = () => {
        setIsOpen(false);
        setPreselectedSlug(null);
        document.body.style.overflow = '';
    };

    return (
        <BookingContext.Provider value={{ openBooking, closeBooking, isOpen, preselectedSlug }}>
            {children}
        </BookingContext.Provider>
    );
}
