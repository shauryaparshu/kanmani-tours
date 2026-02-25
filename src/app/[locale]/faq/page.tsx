import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import Footer from '@/components/FooterSection';
import FaqAccordion from '@/components/FaqAccordion';
import { getFAQs } from '@/lib/faq';
import './faq.css';

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
        </main>
    );
}
