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
                    backgroundColor: '#1c1918',
                    padding: '80px 0 72px',
                    borderBottom: '1px solid rgba(201,147,58,0.2)',
                    width: '100%'
                }}>
                    <div style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 60px'
                    }}>
                        <div style={{ maxWidth: '1000px' }}>
                            <nav className="breadcrumbs" style={{ 
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '11px',
                                fontWeight: '500',
                                letterSpacing: '0.32em',
                                color: '#C9933A',
                                textTransform: 'uppercase',
                                marginBottom: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }} aria-label="Breadcrumb">
                                <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>{t('breadcrumbHome')}</Link>
                                <span style={{ opacity: 0.5 }}>/</span>
                                <span>{t('breadcrumbTours')}</span>
                            </nav>
                            <h1 className="tours-page-title" style={{
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                fontSize: 'clamp(36px, 5vw, 64px)',
                                fontWeight: '500',
                                color: '#F5F1EB',
                                letterSpacing: '0.05em',
                                lineHeight: '1.2',
                                margin: '0 0 16px',
                                whiteSpace: 'nowrap',
                                maxWidth: 'none'
                            }}>{t('heroTitle')}</h1>
                            
                            <div style={{ width: '56px', height: '1px', backgroundColor: '#C9933A', marginBottom: '20px' }} />
                            
                            <p className="tours-page-subtitle" style={{
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '16px',
                                fontWeight: '300',
                                color: '#9A948F',
                                lineHeight: '1.7',
                                maxWidth: '600px',
                                margin: 0
                            }}>
                                {t('heroSubtitle')}
                            </p>
                        </div>
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
