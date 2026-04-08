import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import TopBar from '@/components/layout/TopBar';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/FooterSection';
import FaqAccordion from '@/components/sections/FaqAccordion';
import { getFAQs } from '@/lib/faq';
import { getTranslations } from 'next-intl/server';
import './faq.css';

export const metadata: Metadata = {
    title: 'FAQ — Srikan Tours',
    description: 'Frequently asked questions about our tours to India.',
};

export default async function FAQPage() {
    const faqs = await getFAQs();
    const t = await getTranslations('FAQ');

    return (
        <main className="faq-page">
            <TopBar />
            <Navigation />

            <section className="faq-hero section-padding-small">
                <div className="container text-center">
                    <span className="section-badge">{t('badge')}</span>
                    <h1 className="section-title-large">{t('title')}</h1>
                    <p className="faq-subtitle">{t('subtitle')}</p>
                </div>
            </section>

            <section className="faq-accordion-section pb-100">
                <div className="container max-width-800">
                    <FaqAccordion faqs={faqs} />

                    <div className="faq-cta-footer mt-80 text-center">
                        <h3>{t('stillHaveQuestions')}</h3>
                        <p>{t('contactPrompt')}</p>
                        <Link href="/contact" className="btn-primary-large mt-20 inline-block">
                            {t('contactUs')}
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
