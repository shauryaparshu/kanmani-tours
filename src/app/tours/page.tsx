import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTours } from '@/lib/tours';
import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import Footer from '@/components/FooterSection';
import ToursListClient from '@/components/ToursListClient';

export const metadata: Metadata = {
    title: 'All Tours — Srikan Tours',
    description:
        'Browse all upcoming and past tours by Srikan Tours. Celebrity encounters, culinary journeys, and cultural heritage trips across India.',
};

export default async function ToursPage() {
    const rawTours = await getAllTours();

    // Derive unique categories sorted alphabetically
    const allCategories = [...new Set(rawTours.map(t => t.category))].sort();

    // The imagery is now handled within getAllTours (Sanity vs JSON fallback)
    const tours = rawTours;

    return (
        <>
            <TopBar />
            <Navigation />
            <main>
                {/* Hero */}
                <section className="tours-page-hero">
                    <div className="container">
                        <nav className="breadcrumbs" aria-label="Breadcrumb">
                            <Link href="/">Home</Link>
                            <span>/</span>
                            <span>Tours</span>
                        </nav>
                        <h1 className="tours-page-title">Explore Our Tours</h1>
                        <p className="tours-page-subtitle">
                            Curated journeys connecting Japanese fans with the heart of South Indian culture, cinema &amp; cuisine.
                        </p>
                    </div>
                </section>

                {/* Client-side filter + card grid */}
                <Suspense fallback={<div className="container" style={{ padding: '60px 20px' }}>Loading tours...</div>}>
                    <ToursListClient tours={tours} allCategories={allCategories} />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}
