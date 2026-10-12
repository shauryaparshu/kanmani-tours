import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/layout/FooterSection';
import GroupInquiryForm from '@/components/forms/GroupInquiryForm';

export const metadata: Metadata = {
    alternates: {
        languages: {
            'en': 'https://kanmanitours.com/en/japan/groups',
            'x-default': 'https://kanmanitours.com/en/japan/groups',
        }
    },
    title: 'Japan Group & Institutional Inquiries — Kanmani Tours',
    description: 'Custom educational, university, and corporate group cultural exchange visits to Japan from India. Guided cultural experiences, full logistics, and chaperone coordination.',
};

export default async function JapanGroupsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // Japan groups page must never render in Japanese
    if (locale === 'ja') {
        notFound();
    }

    return (
        <>
            <main style={{ overflowX: 'hidden' }}>
                {/* SECTION 1 — HERO */}
                <div className="contact-hero-section" style={{
                    backgroundColor: '#1C1917',
                    padding: '80px 0 72px',
                    borderBottom: '1px solid rgba(201,147,58,0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div className="contact-hero-inner" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 60px' }}>
                        <div style={{ maxWidth: '1000px' }}>
                            <p style={{
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '11px',
                                fontWeight: '500',
                                letterSpacing: '0.32em',
                                color: '#C9933A',
                                textTransform: 'uppercase',
                                marginBottom: '16px'
                            }}>INSTITUTIONAL DELEGATIONS & STUDY VISITS</p>

                            <h1 className="contact-hero-title" style={{
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                fontSize: 'clamp(36px, 5vw, 64px)',
                                fontWeight: '500',
                                color: '#F5F1EB',
                                letterSpacing: '0.05em',
                                lineHeight: '1.15',
                                margin: '0 0 16px',
                                whiteSpace: 'nowrap',
                                maxWidth: 'none'
                            }}>
                                Group Cultural Exchange Visits to Japan
                            </h1>

                            <div style={{
                                width: '56px', height: '1px',
                                backgroundColor: '#C9933A', marginBottom: '20px'
                            }}/>

                            <p style={{
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '16px',
                                fontWeight: '300',
                                color: '#9A948F',
                                lineHeight: '1.7',
                                maxWidth: '640px',
                                margin: 0
                            }}>
                                Bespoke educational and cultural exchange journeys to Japan for Indian schools, universities, and corporate delegations — planned and hosted with 28 years of local expertise.
                            </p>
                        </div>
                    </div>
                </div>

                {/* SECTION 2 — MAIN CONTENT & FORM */}
                <div className="contact-main-grid" style={{
                    backgroundColor: '#FAFAF7',
                    padding: '72px 60px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 400px',
                    gap: '60px',
                    maxWidth: '1400px',
                    margin: '0 auto',
                    alignItems: 'start'
                }}>
                    {/* LEFT COLUMN — Overview + Form */}
                    <div className="contact-form-card" style={{
                        backgroundColor: '#FFFFFF',
                        padding: '48px',
                        border: '1px solid #E8E4DC',
                    }}>
                        {/* High-level program highlights above the form */}
                        <div style={{ marginBottom: '40px' }}>
                            <h2 className="contact-form-title" style={{
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                fontSize: '32px',
                                fontWeight: '500',
                                color: '#1C1917',
                                letterSpacing: '0.05em',
                                marginBottom: '12px'
                            }}>
                                Custom Institutional Programs
                            </h2>

                            <div style={{
                                width: '48px', height: '1px',
                                backgroundColor: '#C9933A', marginBottom: '24px'
                            }}/>

                            <p style={{
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '15px',
                                color: '#6B6560',
                                lineHeight: '1.7',
                                marginBottom: '24px'
                            }}>
                                We partner directly with academic institutions and corporate organizations to deliver tailored group study tours across Japan. Each program is custom-crafted to align with your institution's curriculum, learning objectives, and travel schedules:
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                                    <div style={{
                                        width: '24px', height: '24px', borderRadius: '50%',
                                        backgroundColor: 'rgba(201,147,58,0.12)', color: '#C9933A',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0, marginTop: '2px', fontSize: '13px', fontWeight: 'bold'
                                    }}>✓</div>
                                    <div>
                                        <strong style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '15px', color: '#1C1917', fontWeight: '600' }}>
                                            Guided Cultural Experiences:
                                        </strong>
                                        <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '15px', color: '#6B6560' }}>
                                            {' '}Curated cultural workshops, historical explorations, and academic or institutional interactions across Japan.
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                                    <div style={{
                                        width: '24px', height: '24px', borderRadius: '50%',
                                        backgroundColor: 'rgba(201,147,58,0.12)', color: '#C9933A',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0, marginTop: '2px', fontSize: '13px', fontWeight: 'bold'
                                    }}>✓</div>
                                    <div>
                                        <strong style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '15px', color: '#1C1917', fontWeight: '600' }}>
                                            End-to-End Group Logistics:
                                        </strong>
                                        <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '15px', color: '#6B6560' }}>
                                            {' '}Complete ground transport, Shinkansen group reservations, vetted student-friendly accommodations, and dietary-aligned dining.
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                                    <div style={{
                                        width: '24px', height: '24px', borderRadius: '50%',
                                        backgroundColor: 'rgba(201,147,58,0.12)', color: '#C9933A',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0, marginTop: '2px', fontSize: '13px', fontWeight: 'bold'
                                    }}>✓</div>
                                    <div>
                                        <strong style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '15px', color: '#1C1917', fontWeight: '600' }}>
                                            Safety & Chaperone Coordination:
                                        </strong>
                                        <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '15px', color: '#6B6560' }}>
                                            {' '}Dedicated 24/7 bilingual on-ground coordination, chaperone guidance, emergency management, and institutional protocol compliance.
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                padding: '16px 20px',
                                backgroundColor: '#FAFAF7',
                                borderLeft: '3px solid #C9933A',
                                marginBottom: '12px'
                            }}>
                                <p style={{
                                    fontFamily: "'Jost', Arial, sans-serif",
                                    fontSize: '14px',
                                    color: '#4A3E34',
                                    margin: 0,
                                    lineHeight: 1.6
                                }}>
                                    Submit your group's requirements below. Our institutional coordinator will follow up directly to discuss timelines, group size feasibility, and custom program outlines.
                                </p>
                            </div>
                        </div>

                        {/* Inquiry Form */}
                        <GroupInquiryForm />
                    </div>

                    {/* RIGHT COLUMN — Institutional Support Info */}
                    <div>
                        {/* WHO THIS IS FOR */}
                        <div style={{ marginBottom: '40px' }}>
                            <h2 style={{
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                fontSize: '22px',
                                fontWeight: '500',
                                color: '#1C1917',
                                letterSpacing: '0.05em',
                                marginBottom: '8px'
                            }}>Cohort Types</h2>
                            <div style={{
                                width: '32px', height: '1px',
                                backgroundColor: '#C9933A', marginBottom: '24px'
                            }}/>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{
                                    padding: '16px 20px',
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #E8E4DC'
                                }}>
                                    <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em', color: '#C9933A', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>K-12 & High Schools</span>
                                    <p style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '14px', color: '#1C1917', margin: 0, lineHeight: 1.5 }}>Cultural discovery, STEAM workshops, and sister-school interactions.</p>
                                </div>

                                <div style={{
                                    padding: '16px 20px',
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #E8E4DC'
                                }}>
                                    <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em', color: '#C9933A', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Colleges & Universities</span>
                                    <p style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '14px', color: '#1C1917', margin: 0, lineHeight: 1.5 }}>Industry immersion, academic exchanges, and research delegation visits.</p>
                                </div>

                                <div style={{
                                    padding: '16px 20px',
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #E8E4DC'
                                }}>
                                    <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em', color: '#C9933A', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Corporate & Leadership</span>
                                    <p style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '14px', color: '#1C1917', margin: 0, lineHeight: 1.5 }}>Executive benchmarking, business delegations, and professional workshops.</p>
                                </div>
                            </div>
                        </div>

                        {/* DIRECT CONTACT */}
                        <div style={{ marginBottom: '40px' }}>
                            <h2 style={{
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                fontSize: '22px',
                                fontWeight: '500',
                                color: '#1C1917',
                                letterSpacing: '0.05em',
                                marginBottom: '8px'
                            }}>Direct Inquiry</h2>
                            <div style={{
                                width: '32px', height: '1px',
                                backgroundColor: '#C9933A', marginBottom: '24px'
                            }}/>

                            <div style={{
                                padding: '20px',
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E8E4DC'
                            }}>
                                <p style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '13px', color: '#6B6560', margin: '0 0 12px', lineHeight: 1.6 }}>
                                    Prefer direct coordination? Reach our institutional team directly:
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <a href="mailto:kanmanitours@gmail.com" style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '14px', color: '#1C1917', textDecoration: 'none', fontWeight: '500' }}>
                                        ✉ kanmanitours@gmail.com
                                    </a>
                                    <a href="tel:+919597716664" style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '14px', color: '#1C1917', textDecoration: 'none', fontWeight: '500' }}>
                                        ✆ +91 95977-16664
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* FOUNDER'S BRIDGE CALLOUT */}
                        <div style={{
                            padding: '24px',
                            backgroundColor: '#1C1917',
                            borderLeft: '3px solid #C9933A'
                        }}>
                            <p style={{
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '11px',
                                fontWeight: '500',
                                letterSpacing: '0.2em',
                                color: '#C9933A',
                                textTransform: 'uppercase',
                                margin: '0 0 8px'
                            }}>LOCAL LEADERSHIP</p>
                            <p style={{
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                fontSize: '17px',
                                fontStyle: 'italic',
                                color: '#F5F1EB',
                                lineHeight: 1.6,
                                margin: '0 0 12px'
                            }}>
                                "With 28 years residing and operating in Japan, our mission is to provide Indian students and teams with an authentic, safe, and inspiring educational journey."
                            </p>
                            <p style={{
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '12px',
                                color: '#9A948F',
                                margin: 0
                            }}>
                                — Dr. Kanmani, Founder
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
