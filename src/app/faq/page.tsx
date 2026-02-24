import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import Footer from '@/components/FooterSection';
import FaqAccordion from '@/components/FaqAccordion';
import { getFAQs } from '@/lib/faq';

export const metadata: Metadata = {
    title: 'FAQ — Srikan Tours',
    description: 'Frequently asked questions about our tours to India.',
};

export default async function FAQPage() {
    const faqs = await getFAQs();

    return (
        <main className="faq-page">
            <TopBar />
            <Navigation />

            <section className="faq-hero section-padding-small">
                <div className="container text-center">
                    <span className="section-badge">Support Center</span>
                    <h1 className="section-title-large">Frequently Asked Questions</h1>
                    <p className="faq-subtitle">Everything you need to know about traveling to India with us.</p>
                </div>
            </section>

            <section className="faq-accordion-section pb-100">
                <div className="container max-width-800">
                    <FaqAccordion faqs={faqs} />

                    <div className="faq-cta-footer mt-80 text-center">
                        <h3>Still have questions?</h3>
                        <p>If you can't find what you're looking for, our team is here to help.</p>
                        <Link href="/contact" className="btn-primary-large mt-20 inline-block">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />

            <style jsx>{`
                .faq-page { background: #fff; min-height: 100vh; }
                .section-padding-small { padding: 80px 0 40px; }
                .pb-100 { padding-bottom: 100px; }
                .container { width: 90%; max-width: 1200px; margin: 0 auto; }
                .max-width-800 { max-width: 800px; }
                .text-center { text-align: center; }
                .mt-80 { margin-top: 80px; }
                .mt-20 { margin-top: 20px; }
                .inline-block { display: inline-block; }

                .section-badge { color: var(--primary); font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.85rem; display: block; margin-bottom: 12px; }
                .section-title-large { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900; color: #1e293b; margin-bottom: 16px; line-height: 1.2; }
                .faq-subtitle { font-size: 1.15rem; color: #64748b; max-width: 600px; margin: 0 auto; }

                /* FAQ CTA */
                .faq-cta-footer { background: #f8fafc; padding: 60px; border-radius: 32px; border: 1px solid #f1f5f9; }
                .faq-cta-footer h3 { font-size: 1.75rem; font-weight: 900; color: #1e293b; margin-bottom: 12px; }
                .faq-cta-footer p { color: #64748b; margin-bottom: 0; }

                .btn-primary-large { background: var(--primary); color: #fff; padding: 16px 32px; border-radius: 12px; font-weight: 800; transition: all 0.3s; text-decoration: none; }
                .btn-primary-large:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(249, 115, 22, 0.3); }

                @media (max-width: 768px) {
                    .faq-hero { padding-top: 40px; }
                    .faq-cta-footer { padding: 40px 20px; border-radius: 20px; }
                }
            `}</style>
        </main>
    );
}
