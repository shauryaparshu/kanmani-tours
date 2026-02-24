'use client';

import React from 'react';
import Link from 'next/link';
import './airport-transfer.css';

export default function AirportTransferPage() {
    return (
        <main className="atp-wrapper">
            {/* HERO SECTION */}
            <section className="atp-hero">
                <div className="container">
                    <h1 className="atp-title">Airport Pickup & Drop in India</h1>
                    <p className="atp-subtitle">
                        Seamless, reliable, and comfortable airport transfers with Japanese-speaking support. Your journey begins the moment you land.
                    </p>
                </div>
            </section>

            <div className="container atp-content">
                <div className="atp-grid">
                    {/* DESCRIPTION */}
                    <div className="atp-text-section">
                        <h2>Travel with Peace of Mind</h2>
                        <p className="atp-para">
                            Navigating Indian airports and finding reliable transport can be overwhelming. Srikan Tours provides a premium, pre-booked airport transfer service designed specifically for international travellers who value safety, punctuality, and comfort.
                        </p>
                        <p className="atp-para">
                            Whether you're arriving at Chennai, Delhi, Mumbai, or Hyderabad, our professional drivers will be waiting for you at the arrivals gate with a clear name board, ready to assist with your luggage and whisk you away to your destination.
                        </p>

                        <div className="atp-features">
                            <h3>Why Choose Our Transfers?</h3>
                            <ul className="atp-list">
                                <li><strong>Japanese-Speaking Support:</strong> 24/7 phone assistance if you need help communicating on arrival.</li>
                                <li><strong>Wait Protection:</strong> We track your flight in real-time. If your plane is late, we'll still be there.</li>
                                <li><strong>Fixed Pricing:</strong> No hidden fees, no haggling. The price you see is what you pay.</li>
                                <li><strong>Premium Vehicles:</strong> Clean, air-conditioned cars with experienced, vetted drivers.</li>
                            </ul>
                        </div>
                    </div>

                    {/* HOW IT WORKS */}
                    <div className="atp-steps-section">
                        <h3>How It Works</h3>
                        <div className="atp-steps">
                            <div className="atp-step">
                                <div className="atp-step-num">1</div>
                                <div className="atp-step-content">
                                    <h4>Request a Quote</h4>
                                    <p>Tell us your arrival city, date, and preferred vehicle type.</p>
                                </div>
                            </div>
                            <div className="atp-step">
                                <div className="atp-step-num">2</div>
                                <div className="atp-step-content">
                                    <h4>Receive Confirmation</h4>
                                    <p>We'll send you a fixed-price voucher and driver details 24 hours before you land.</p>
                                </div>
                            </div>
                            <div className="atp-step">
                                <div className="atp-step-num">3</div>
                                <div className="atp-step-content">
                                    <h4>Meet Your Driver</h4>
                                    <p>Walk out of the arrivals hall and look for your name. Your ride is waiting!</p>
                                </div>
                            </div>
                        </div>

                        <div className="atp-pricing-note">
                            <p><strong>Pricing Note:</strong> Rates vary by city and distance (e.g., Chennai City vs. Outstation). Contact us for a personalized quote.</p>
                        </div>

                        <div className="atp-cta-box">
                            <Link href="/contact" className="btn-primary atp-cta">
                                Request Transfer →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
