import type { Metadata } from 'next';
import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import Footer from '@/components/FooterSection';
import GalleryListClient from '@/components/GalleryListClient';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Tour Gallery — Srikan Tours',
    description: 'Relive the magic of our past tours. Explore photo galleries from celebrity encounters, cultural festivals, and culinary adventures across India.',
};

export default function GalleryPage() {
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
                            <span>Gallery</span>
                        </nav>
                        <h1 className="tours-page-title">Past Tour Highlights</h1>
                        <p className="tours-page-subtitle">
                            A visual journey through our previous adventures. See the real moments and connections that make our tours special.
                        </p>
                    </div>
                </section>

                <GalleryListClient />
            </main>
            <Footer />
        </>
    );
}
