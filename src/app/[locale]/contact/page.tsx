import type { Metadata } from 'next';
import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import Footer from '@/components/FooterSection';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import SocialIcons from '@/components/SocialIcons';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
    title: 'Contact Us — Srikan Tours',
    description: 'Have questions about our fan tours? Get in touch with Srikan Tours today.',
};

export default async function ContactPage() {
    const t = await getTranslations('Contact');

    return (
        <>
            <TopBar />
            <Navigation />
            <main>
                {/* Hero */}
                <section className="contact-hero">
                    <div className="container">
                        <nav className="breadcrumbs breadcrumbs-light">
                            <Link href="/">{t('breadcrumbHome')}</Link>
                            <span>/</span>
                            <span>{t('breadcrumbContact')}</span>
                        </nav>
                        <h1 className="contact-pg-title">{t('title')}</h1>
                        <p className="contact-pg-subtitle">{t('subtitle')}</p>
                    </div>
                </section>

                <section className="container contact-pg-section">
                    <div className="contact-pg-grid">
                        {/* Form Side */}
                        <div className="contact-form-card">
                            <h2 className="contact-form-title">{t('sendMessage')}</h2>
                            <ContactForm />
                        </div>

                        {/* Info Side */}
                        <div className="contact-info-panel">
                            <div className="contact-info-block">
                                <h3>{t('contactDirectly')}</h3>
                                <p>{t('contactDirectlyDesc')}</p>
                                <div className="contact-info-links">
                                    <a href="tel:+810312345678" className="contact-info-item">
                                        <span className="contact-info-icon">📞</span>
                                        <div className="contact-info-text">
                                            <strong>{t('callUs')}</strong>
                                            <span>+81 (0)3-1234-5678</span>
                                        </div>
                                    </a>
                                    <a href="mailto:hello@srikantours.com" className="contact-info-item">
                                        <span className="contact-info-icon">📧</span>
                                        <div className="contact-info-text">
                                            <strong>{t('emailUs')}</strong>
                                            <span>hello@srikantours.com</span>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            <div className="contact-info-block">
                                <h3>{t('visitOffices')}</h3>
                                <div className="contact-office-grid">
                                    <div className="contact-office">
                                        <strong>{t('tokyoOffice')}</strong>
                                        <p>{t('tokyoAddress')}</p>
                                    </div>
                                    <div className="contact-office">
                                        <strong>{t('chennaiOffice')}</strong>
                                        <p>{t('chennaiAddress')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="contact-info-block">
                                <h3 className="section-title-small">{t('followJourney')}</h3>
                                <SocialIcons variant="card" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
