import type { Metadata } from 'next';
import Footer from '@/components/layout/FooterSection';
import Link from 'next/link';
import ContactForm from '@/components/forms/ContactForm';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
    title: 'Contact Us — Kanmani Tours',
    description: "Let's plan your journey to India. Our Japanese-speaking team is ready to help you plan the perfect experience.",
};

export default async function ContactPage() {
    return (
        <>
            <main>
                {/* SECTION 1 — HERO (dark #1C1917) */}
                <div style={{
                    backgroundColor: '#1C1917',
                    padding: '80px 60px 72px',
                    borderBottom: '1px solid rgba(201,147,58,0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ maxWidth: '700px' }}>
                        <p style={{
                            fontFamily: "'Jost', Arial, sans-serif",
                            fontSize: '11px',
                            fontWeight: '500',
                            letterSpacing: '0.32em',
                            color: '#C9933A',
                            textTransform: 'uppercase',
                            marginBottom: '16px'
                        }}>GET IN TOUCH</p>
                        <h1 style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: 'clamp(36px, 5vw, 64px)',
                            fontWeight: '500',
                            color: '#F5F1EB',
                            letterSpacing: '0.05em',
                            lineHeight: '1.15',
                            marginBottom: '16px'
                        }}>
                            Let's Plan Your Journey to India
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
                            maxWidth: '520px'
                        }}>
                            Our Japanese-speaking team is ready to help you plan 
                            the perfect India experience. We respond to all 
                            enquiries within 24 hours.
                        </p>
                    </div>
                </div>

                {/* SECTION 2 — MAIN LAYOUT (two column) */}
                <div style={{
                    backgroundColor: '#FAFAF7',
                    padding: '72px 60px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 400px',
                    gap: '60px',
                    maxWidth: '1400px',
                    margin: '0 auto',
                    alignItems: 'start'
                }}>
                    {/* LEFT COLUMN — Contact Form */}
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        padding: '48px',
                        border: '1px solid #E8E4DC',
                    }}>
                        <h2 style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: '32px',
                            fontWeight: '500',
                            color: '#1C1917',
                            letterSpacing: '0.05em',
                            marginBottom: '8px'
                        }}>Send Us a Message</h2>
                        <div style={{
                            width: '48px', height: '1px',
                            backgroundColor: '#C9933A', marginBottom: '32px'
                        }}/>
                        <ContactForm />
                    </div>

                    {/* RIGHT COLUMN — Contact Info Sidebar */}
                    <div>
                        {/* CONTACT METHODS BLOCK */}
                        <div style={{ marginBottom: '40px' }}>
                            <h2 style={{
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                fontSize: '22px',
                                fontWeight: '500',
                                color: '#1C1917',
                                letterSpacing: '0.05em',
                                marginBottom: '8px'
                            }}>Contact Directly</h2>
                            <div style={{
                                width: '32px', height: '1px',
                                backgroundColor: '#C9933A', marginBottom: '24px'
                            }}/>

                            {/* Row 1 — Phone */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '16px',
                                padding: '16px 20px',
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E8E4DC',
                                marginBottom: '8px'
                            }}>
                                <div style={{ color: '#C9933A' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 18.92z"></path></svg>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em', color: '#C9933A', textTransform: 'uppercase' }}>Call Us</span>
                                    <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '15px', color: '#1C1917' }}>+81 (0)3-1234-5678</span>
                                </div>
                            </div>

                            {/* Row 2 — Email */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '16px',
                                padding: '16px 20px',
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E8E4DC',
                                marginBottom: '8px'
                            }}>
                                <div style={{ color: '#C9933A' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.12em', color: '#C9933A', textTransform: 'uppercase' }}>Email Us</span>
                                    <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '15px', color: '#1C1917' }}>hello@kanmanitours.com</span>
                                </div>
                            </div>


                        </div>



                        {/* OFFICES BLOCK */}
                        <div style={{ marginBottom: '40px' }}>
                            <h2 style={{
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                fontSize: '22px',
                                fontWeight: '500',
                                color: '#1C1917',
                                letterSpacing: '0.05em',
                                marginBottom: '8px'
                            }}>Our Offices</h2>
                            <div style={{
                                width: '32px', height: '1px',
                                backgroundColor: '#C9933A', marginBottom: '24px'
                            }}/>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ padding: '20px', backgroundColor: '#FFFFFF', border: '1px solid #E8E4DC', borderTop: '3px solid #C9933A' }}>
                                    <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.2em', color: '#C9933A', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Tokyo Office</span>
                                    <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '18px', fontWeight: '500', color: '#1C1917', marginBottom: '4px', margin: 0 }}>Tokyo, Japan</h3>
                                    <p style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '13px', color: '#6B6560', lineHeight: 1.5, margin: 0 }}>Chiyoda City, Tokyo</p>
                                    <p style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '12px', color: '#9A948F', marginTop: '8px', margin: 0 }}>Mon–Fri 9:00–18:00 JST</p>
                                </div>
                                <div style={{ padding: '20px', backgroundColor: '#FFFFFF', border: '1px solid #E8E4DC', borderTop: '3px solid #C9933A' }}>
                                    <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', fontWeight: '500', letterSpacing: '0.2em', color: '#C9933A', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Chennai Office</span>
                                    <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '18px', fontWeight: '500', color: '#1C1917', marginBottom: '4px', margin: 0 }}>Chennai, India</h3>
                                    <p style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '13px', color: '#6B6560', lineHeight: 1.5, margin: 0 }}>Anna Nagar, Chennai</p>
                                    <p style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '12px', color: '#9A948F', marginTop: '8px', margin: 0 }}>Mon–Sat 9:00–18:00 IST</p>
                                </div>
                            </div>
                        </div>

                        {/* FAQ LINK BLOCK */}
                        <div style={{
                            padding: '20px 24px',
                            backgroundColor: '#1C1917',
                            borderLeft: '3px solid #C9933A',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <p style={{
                                    fontFamily: "'Jost', Arial, sans-serif", fontSize: '13px',
                                    fontWeight: '500', color: '#F5F1EB',
                                    marginBottom: '4px', margin: 0
                                }}>Have a quick question?</p>
                                <p style={{
                                    fontFamily: "'Jost', Arial, sans-serif", fontSize: '12px',
                                    color: '#6B6560', margin: 0
                                }}>Find instant answers in our FAQ</p>
                            </div>
                            <Link href="/faq" style={{
                                fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px',
                                fontWeight: '600', letterSpacing: '0.18em',
                                color: '#1C1917', backgroundColor: '#C9933A',
                                padding: '10px 16px', textDecoration: 'none',
                                textTransform: 'uppercase', whiteSpace: 'nowrap'
                            }}>
                                VIEW FAQ
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

