import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getToursByDestination } from '@/lib/tours';
import { getAllCategories } from '@/lib/categories';
import { getAllCountries } from '@/lib/countries';
import Footer from '@/components/layout/FooterSection';
import ToursListClient from '@/components/ToursListClient';

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

    const tours = rawTours || [];

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

                {/* Client-side filter + card grid or Coming Soon state */}
                {tours.length === 0 ? (
                    <section className="japan-tours-coming-soon" style={{
                        backgroundColor: '#FAFAF7',
                        padding: '96px 24px',
                        textAlign: 'center',
                        borderBottom: '1px solid #E8E4DC'
                    }}>
                        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <span style={{
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '11px',
                                fontWeight: '600',
                                letterSpacing: '0.24em',
                                textTransform: 'uppercase',
                                color: '#C9933A',
                                display: 'block',
                                marginBottom: '16px'
                            }}>
                                Coming Soon
                            </span>
                            <h2 style={{
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                fontSize: 'clamp(28px, 4vw, 40px)',
                                fontWeight: '500',
                                color: '#1c1918',
                                margin: '0 0 16px',
                                lineHeight: '1.2'
                            }}>
                                Curated Japan Journeys
                            </h2>
                            <div style={{
                                width: '48px',
                                height: '1px',
                                backgroundColor: '#C9933A',
                                margin: '0 auto 20px'
                            }} />
                            <p style={{
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '16px',
                                fontWeight: '300',
                                color: '#66615b',
                                lineHeight: '1.7',
                                margin: '0 0 32px'
                            }}>
                                Japan tours are launching soon. Check back shortly.
                            </p>
                            <Link
                                href="/"
                                style={{
                                    display: 'inline-block',
                                    fontFamily: "'Jost', Arial, sans-serif",
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    letterSpacing: '0.24em',
                                    textTransform: 'uppercase',
                                    color: '#1c1918',
                                    backgroundColor: '#C9933A',
                                    padding: '14px 32px',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Return to Home
                            </Link>
                        </div>
                    </section>
                ) : (
                    <Suspense fallback={<div className="container" style={{ padding: '60px 20px' }}>Loading...</div>}>
                        <ToursListClient tours={tours} categories={categories} countries={countries} />
                    </Suspense>
                )}
            </main>
            <Footer />
        </>
    );
}
