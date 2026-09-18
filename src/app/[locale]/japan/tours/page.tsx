// ============================================================================
// WARNING: USES DEMO / PLACEHOLDER DATA (demoJapanTours)
// This page falls back to hardcoded placeholder data for Japan tours during review.
// - This data MUST NEVER be created in Sanity.
// - This fallback MUST be removed before this branch (feature/two-way-tours) merges to main.
// ============================================================================

import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getToursByDestination } from '@/lib/tours';
import { getAllCategories } from '@/lib/categories';
import { getAllCountries } from '@/lib/countries';
import Footer from '@/components/layout/FooterSection';
import ToursListClient from '@/components/ToursListClient';

import { demoJapanTours } from '@/lib/demoJapanTours';

export const metadata: Metadata = {
    alternates: {
        languages: {
            'en': 'https://kanmanitours.com/en/japan/tours',
            'x-default': 'https://kanmanitours.com/en/japan/tours',
        }
    },
    title: 'Japan Tours — Kanmani Tours',
    description:
        'Browse all upcoming and past Japan tours by Kanmani Tours. Educational group tours, school journeys, and cultural experiences across Japan.',
};

export default async function JapanToursPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // Japan tours must never render in Japanese under any circumstance
    if (locale === 'ja') {
        notFound();
    }

    const [rawTours, categories, countries] = await Promise.all([
        getToursByDestination('japan', locale),
        getAllCategories(locale),
        getAllCountries(locale)
    ]);

    const tours = (rawTours && rawTours.length > 0) ? rawTours : (demoJapanTours as any);

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
                                <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
                                <span style={{ opacity: 0.5 }}>/</span>
                                <span>Japan Tours</span>
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
                            }}>Japan Tours</h1>
                            
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
                                Discover curated journeys across Japan — from educational school trips to immersive cultural and group experiences.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Client-side filter + card grid */}
                <Suspense fallback={<div className="container" style={{ padding: '60px 20px' }}>Loading...</div>}>
                    <ToursListClient tours={tours} categories={categories} countries={countries} />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}
