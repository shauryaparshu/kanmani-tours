import type { Metadata } from 'next';
import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import Footer from '@/components/FooterSection';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Contact Us — Srikan Tours',
    description: 'Have questions about our fan tours? Get in touch with Srikan Tours today. We are here to help you plan your perfect South Indian cinematic journey.',
};

import ContactForm from '@/components/ContactForm';
import SocialIcons from '@/components/SocialIcons';

export default function ContactPage() {
    return (
        <>
            <TopBar />
            <Navigation />
            <main>
                {/* Hero */}
                <section className="contact-hero">
                    <div className="container">
                        <nav className="breadcrumbs breadcrumbs-light">
                            <Link href="/">Home</Link>
                            <span>/</span>
                            <span>Contact Us</span>
                        </nav>
                        <h1 className="contact-pg-title">Let&apos;s Start Your Journey</h1>
                        <p className="contact-pg-subtitle">Expert help is just a message away. Reach out to our teams in Tokyo or Chennai.</p>
                    </div>
                </section>

                <section className="container contact-pg-section">
                    <div className="contact-pg-grid">
                        {/* Form Side */}
                        <div className="contact-form-card">
                            <h2 className="contact-form-title">Send us a Message</h2>
                            <ContactForm />
                        </div>

                        {/* Info Side */}
                        <div className="contact-info-panel">
                            <div className="contact-info-block">
                                <h3>Contact Directly</h3>
                                <p>Get in touch with us via phone or email for immediate assistance.</p>
                                <div className="contact-info-links">
                                    <a href="tel:+810312345678" className="contact-info-item">
                                        <span className="contact-info-icon">📞</span>
                                        <div className="contact-info-text">
                                            <strong>Call Us</strong>
                                            <span>+81 (0)3-1234-5678</span>
                                        </div>
                                    </a>
                                    <a href="mailto:hello@srikantours.com" className="contact-info-item">
                                        <span className="contact-info-icon">📧</span>
                                        <div className="contact-info-text">
                                            <strong>Email Us</strong>
                                            <span>hello@srikantours.com</span>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            <div className="contact-info-block">
                                <h3>Visit Our Offices</h3>
                                <div className="contact-office-grid">
                                    <div className="contact-office">
                                        <strong>Tokyo Office</strong>
                                        <p>Chiyoda City, Tokyo, Japan</p>
                                    </div>
                                    <div className="contact-office">
                                        <strong>Chennai Office</strong>
                                        <p>Anna Nagar, Chennai, India</p>
                                    </div>
                                </div>
                            </div>

                            <div className="contact-info-block">
                                <h3 className="section-title-small">Follow Our Journey</h3>
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
