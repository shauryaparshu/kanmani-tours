import type { Metadata } from 'next';
import TopBar from '@/components/layout/TopBar';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/FooterSection';
import GalleryListClient from '@/components/ui/GalleryListClient';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
    title: 'Tour Gallery — Srikan Tours',
    description: 'Relive the magic of our past tours. Explore photo galleries from celebrity encounters, cultural festivals, and culinary adventures across India.',
};

export default async function GalleryPage() {
    const t = await getTranslations('Gallery');

    return (
        <>
            <TopBar />
            <Navigation />
            <main>
                {/* Hero */}
                <section className="tours-page-hero">
                    <div className="container">
                        <nav className="breadcrumbs" aria-label="Breadcrumb">
                            <Link href="/">{t('breadcrumbHome')}</Link>
                            <span>/</span>
                            <span>{t('breadcrumbGallery')}</span>
                        </nav>
                        <h1 className="tours-page-title">{t('title')}</h1>
                        <p className="tours-page-subtitle">
                            {t('subtitle')}
                        </p>
                    </div>
                </section>

                <GalleryListClient />
            </main>
            <Footer />
        </>
    );
}
