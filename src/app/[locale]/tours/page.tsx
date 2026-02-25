import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTours } from '@/lib/tours';
import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import Footer from '@/components/FooterSection';
import ToursListClient from '@/components/ToursListClient';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
    title: 'All Tours — Srikan Tours',
    description:
        'Browse all upcoming and past tours by Srikan Tours. Celebrity-related experiences, culinary journeys, and cultural heritage trips across India.',
};

export default async function ToursPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const rawTours = await getAllTours(locale);
    const t = await getTranslations('Tours');

    // Derive unique categories sorted alphabetically
    const allCategories = [...new Set(rawTours.map(t => t.category))].sort();
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
                            <Link href="/">{t('breadcrumbHome')}</Link>
                            <span>/</span>
                            <span>{t('breadcrumbTours')}</span>
                        </nav>
                        <h1 className="tours-page-title">{t('heroTitle')}</h1>
                        <p className="tours-page-subtitle">
                            {t('heroSubtitle')}
                        </p>
                    </div>
                </section>

                {/* Client-side filter + card grid */}
                <Suspense fallback={<div className="container" style={{ padding: '60px 20px' }}>{t('loading')}</div>}>
                    <ToursListClient tours={tours} allCategories={allCategories} />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}
