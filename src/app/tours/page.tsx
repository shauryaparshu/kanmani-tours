import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTours } from '@/lib/tours';
import { getLatestImage } from '@/lib/server-images';
import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import Footer from '@/components/FooterSection';
import ToursListClient from '@/components/ToursListClient';

export const metadata: Metadata = {
    title: 'All Tours — Srikan Tours',
    description:
        'Browse all upcoming and past tours by Srikan Tours. Celebrity encounters, culinary journeys, and cultural heritage trips across India.',
};

export default function ToursPage() {
    const rawTours = getAllTours();

    // Derive unique categories sorted alphabetically
    const allCategories = [...new Set(rawTours.map(t => t.category))].sort();

    // Resolve coverImage from filesystem — always picks up the latest uploaded image.
    // Priority: /cards/ folder latest file → JSON coverImage → galleryImages[0] → ''
    const tours = rawTours.map(tour => {
        const fsImage = getLatestImage(`/assets/img/tours/${tour.slug}/cards`);
        const resolved = fsImage || tour.coverImage || tour.galleryImages[0] || '';
        return { ...tour, coverImage: resolved };
    });

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
                <ToursListClient tours={tours} allCategories={allCategories} />
            </main>
            <Footer />
        </>
    );
}
