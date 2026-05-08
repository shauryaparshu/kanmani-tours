import type { Metadata } from 'next';
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
            <main>
                {/* Hero */}
                <section className="gallery-page-hero" style={{
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
                                <Link href="/" style={{ color: '#F5F1EB', textDecoration: 'none', opacity: 0.7 }}>{t('breadcrumbHome')}</Link>
                                <span style={{ color: '#F5F1EB', opacity: 0.3 }}>/</span>
                                <span style={{ color: '#F5F1EB', opacity: 0.7 }}>{t('breadcrumbGallery')}</span>
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
                            }}>{t('title')}</h1>
                            <div style={{ width: '56px', height: '1px', backgroundColor: '#C9933A', marginBottom: '20px' }} />
                            <p className="gallery-page-subtitle" style={{
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '16px',
                                fontWeight: '300',
                                color: '#9A948F',
                                lineHeight: '1.7',
                                maxWidth: '600px',
                                margin: 0
                            }}>
                                {t('subtitle')}
                            </p>
                        </div>
                    </div>
                </section>

                <GalleryListClient />
            </main>
            <Footer />
        </>
    );
}
