import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTours } from '@/lib/tours';
import { getAllCategories } from '@/lib/categories';
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
            <main>
                {/* Hero */}
                <section className="tours-page-hero" style={{
                    backgroundColor: '#1a1918',
                    width: '100%'
                }}>
                    <div style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '3rem 2rem 1rem'
                    }}>
                        <nav className="breadcrumbs" style={{ 
                            fontFamily: "'Jost', Arial, sans-serif",
                            fontSize: '12px',
                            letterSpacing: '0.1em',
                            marginBottom: '16px',
                            display: 'flex',
                            gap: '8px',
                            color: '#9A948F',
                            textTransform: 'uppercase'
                        }} aria-label="Breadcrumb">
                            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>{t('breadcrumbHome')}</Link>
                            <span>/</span>
                            <span style={{ color: '#d49a36' }}>{t('breadcrumbTours')}</span>
                        </nav>
                        <h1 className="tours-page-title" style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: 'clamp(36px, 5vw, 64px)',
                            fontWeight: '500',
                            color: '#F5F1EB',
                            letterSpacing: '0.06em',
                            marginBottom: '8px',
                            lineHeight: '1.1',
                            textAlign: 'left'
                        }}>{t('heroTitle')}</h1>
                        
                        <div style={{ width: '40px', height: '1px', backgroundColor: '#d49a36', margin: '8px 0' }} />
                        
                        <p className="tours-page-subtitle" style={{
                            fontFamily: "'Jost', Arial, sans-serif",
                            fontSize: '16px',
                            fontWeight: '300',
                            color: '#9A948F',
                            letterSpacing: '0.04em',
                            lineHeight: '1.7',
                            maxWidth: '560px',
                            textAlign: 'left',
                            margin: 0
                        }}>
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
