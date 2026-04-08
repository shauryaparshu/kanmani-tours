import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTours } from '@/lib/tours';
import { getAllCategories } from '@/lib/categories';
import TopBar from '@/components/layout/TopBar';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/FooterSection';
import ToursListClient from '@/components/ToursListClient';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
    title: 'All Tours — Srikan Tours',
    description:
        'Browse all upcoming and past tours by Srikan Tours. Celebrity-related experiences, culinary journeys, and cultural heritage trips across India.',
};

export default async function ToursPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const [rawTours, categories] = await Promise.all([
        getAllTours(locale),
        getAllCategories(locale)
    ]);

    const t = await getTranslations('Tours');

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
                    <ToursListClient tours={tours} categories={categories} />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}
