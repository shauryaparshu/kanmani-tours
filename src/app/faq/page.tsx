'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import Footer from '@/components/FooterSection';
import faqData from '@/data/faq.json';

export default function FAQPage() {
    const [openId, setOpenId] = useState<number | null>(null);

    const toggle = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

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
                    <div className="accordion-list">
                        {faqData.map((faq) => (
                            <div
                                key={faq.id}
                                className={`accordion-item ${openId === faq.id ? 'active' : ''}`}
                            >
                                <button
                                    className="accordion-header"
                                    onClick={() => toggle(faq.id)}
                                    aria-expanded={openId === faq.id}
                                    aria-controls={`faq-content-${faq.id}`}
                                >
                                    <span className="faq-question">{faq.question}</span>
                                    <span className="faq-icon">
                                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </span>
                                </button>
                                <div
                                    id={`faq-content-${faq.id}`}
                                    className="accordion-content"
                                    role="region"
                                    aria-labelledby={`faq-header-${faq.id}`}
                                >
                                    <div className="accordion-body">
                                        <p>{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="faq-cta-footer mt-80 text-center animate-on-scroll">
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

                /* Accordion Styles - Enhanced */
                .accordion-list { display: flex; flex-direction: column; gap: 20px; margin-top: 50px; }
                .accordion-item { 
                    border: 2px solid #f1f5f9; 
                    border-radius: 20px; 
                    overflow: hidden; 
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
                    background: #fff;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
                }
                .accordion-item:hover { 
                    border-color: #e2e8f0; 
                    box-shadow: 0 8px 16px rgba(0,0,0,0.04);
                    transform: translateY(-2px);
                }
                .accordion-item.active { 
                    border-color: var(--primary); 
                    box-shadow: 0 12px 30px rgba(249, 115, 22, 0.08); 
                }

                .accordion-header { 
                    width: 100%; 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    padding: 28px 32px; 
                    background: #ffffff; 
                    border: none; 
                    cursor: pointer; 
                    text-align: left; 
                    transition: all 0.3s;
                }
                .accordion-item.active .accordion-header {
                    background: #fcfcfd;
                }
                .faq-question { font-size: 1.1rem; font-weight: 700; color: #1e293b; transition: color 0.3s; padding-right: 20px; }
                .accordion-item.active .faq-question { color: var(--primary); }
                
                .faq-icon { color: #94a3b8; transition: transform 0.3s ease; flex-shrink: 0; }
                .accordion-item.active .faq-icon { transform: rotate(180deg); color: var(--primary); }

                .accordion-content { 
                    max-height: 0; 
                    overflow: hidden; 
                    transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .accordion-item.active .accordion-content { max-height: 200px; } /* Increased for flexible expansion */
                
                .accordion-body { padding: 0 24px 24px; }
                .accordion-body p { color: #64748b; line-height: 1.7; font-size: 1rem; margin: 0; }

                /* FAQ CTA */
                .faq-cta-footer { background: #f8fafc; padding: 60px; border-radius: 32px; border: 1px solid #f1f5f9; }
                .faq-cta-footer h3 { font-size: 1.75rem; font-weight: 900; color: #1e293b; margin-bottom: 12px; }
                .faq-cta-footer p { color: #64748b; margin-bottom: 0; }

                .btn-primary-large { background: var(--primary); color: #fff; padding: 16px 32px; border-radius: 12px; font-weight: 800; transition: all 0.3s; text-decoration: none; }
                .btn-primary-large:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(249, 115, 22, 0.3); }

                @media (max-width: 768px) {
                    .faq-hero { padding-top: 40px; }
                    .accordion-header { padding: 20px; }
                    .faq-question { font-size: 1rem; }
                    .faq-cta-footer { padding: 40px 20px; border-radius: 20px; }
                }
            `}</style>
        </main>
    );
}
