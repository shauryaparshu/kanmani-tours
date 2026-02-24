'use client';

import React, { useState } from 'react';
import { FAQ } from '@/lib/faq';

interface FaqAccordionProps {
    faqs: FAQ[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
    const [openId, setOpenId] = useState<string | number | null>(null);

    const toggle = (id: string | number) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="accordion-list">
            {faqs.map((faq) => (
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
                        style={{
                            maxHeight: openId === faq.id ? '500px' : '0',
                            overflow: 'hidden',
                            transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        <div className="accordion-body">
                            <p>{faq.answer}</p>
                        </div>
                    </div>
                </div>
            ))}

            <style jsx>{`
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

                .accordion-body { padding: 0 32px 28px; }
                .accordion-body p { color: #64748b; line-height: 1.7; font-size: 1rem; margin: 0; }

                @media (max-width: 768px) {
                    .accordion-header { padding: 20px; }
                    .faq-question { font-size: 1rem; }
                }
            `}</style>
        </div>
    );
}
