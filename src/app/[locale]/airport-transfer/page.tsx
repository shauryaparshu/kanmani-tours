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
                <section className="atp-hero">
                    <div className="container">
                        <h1 className="atp-title">{t('title')}</h1>
                        <p className="atp-subtitle">
                            {t('subtitle')}
                        </p>
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
