import React from 'react';
import Link from 'next/link';
import Footer from '@/components/layout/FooterSection';
import { getTranslations } from 'next-intl/server';
import './airport-transfer.css';

export default async function AirportTransferPage() {
    const t = await getTranslations('Airport');

    return (
        <>
            <main className="atp-wrapper">
                {/* HERO SECTION */}
                <section className="atp-hero" style={{
                    backgroundColor: '#1c1918',
                    padding: '80px 0 72px',
                    borderBottom: '1px solid rgba(201,147,58,0.2)',
                    width: '100%',
                    textAlign: 'left'
                }}>
                    <div className="container" style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 60px'
                    }}>
                        <div style={{ maxWidth: '1000px' }}>
                            <p style={{
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '11px',
                                fontWeight: '500',
                                letterSpacing: '0.32em',
                                color: '#C9933A',
                                textTransform: 'uppercase',
                                marginBottom: '16px'
                            }}>Arrival & Departure</p>
                            <h1 className="atp-title" style={{
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
                            <p className="atp-subtitle" style={{
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

                <div className="container atp-content">
                    <div className="atp-grid">
                        {/* DESCRIPTION */}
                        <div className="atp-text-section">
                            <h2>{t('peaceOfMind')}</h2>
                            <p className="atp-para">
                                {t('desc1')}
                            </p>
                            <p className="atp-para">
                                {t('desc2')}
                            </p>

                            <div className="atp-features">
                                <h3>{t('whyChoose')}</h3>
                                <ul className="atp-list">
                                    <li><strong>{t('feature1Title')}</strong> {t('feature1Desc')}</li>
                                    <li><strong>{t('feature2Title')}</strong> {t('feature2Desc')}</li>
                                    <li><strong>{t('feature3Title')}</strong> {t('feature3Desc')}</li>
                                    <li><strong>{t('feature4Title')}</strong> {t('feature4Desc')}</li>
                                </ul>
                            </div>
                        </div>

                        {/* HOW IT WORKS */}
                        <div className="atp-steps-section">
                            <h3>{t('howItWorks')}</h3>
                            <div className="atp-steps">
                                <div className="atp-step">
                                    <div className="atp-step-num">1</div>
                                    <div className="atp-step-content">
                                        <h4>{t('step1Title')}</h4>
                                        <p>{t('step1Desc')}</p>
                                    </div>
                                </div>
                                <div className="atp-step">
                                    <div className="atp-step-num">2</div>
                                    <div className="atp-step-content">
                                        <h4>{t('step2Title')}</h4>
                                        <p>{t('step2Desc')}</p>
                                    </div>
                                </div>
                                <div className="atp-step">
                                    <div className="atp-step-num">3</div>
                                    <div className="atp-step-content">
                                        <h4>{t('step3Title')}</h4>
                                        <p>{t('step3Desc')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="atp-pricing-note">
                                <p><strong>{t('pricingNote')}</strong> {t('pricingNoteDesc')}</p>
                            </div>

                            <div className="atp-cta-box">
                                <Link href="/contact" className="btn-primary atp-cta">
                                    {t('requestTransfer')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
