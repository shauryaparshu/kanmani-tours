'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TOUR_GROUP } from '@/lib/tourGroup';

export default function MemoriesLoginForm() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password.trim()) {
            setError('Please enter a password.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/memories-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                // Successful auth - navigate to branded gallery page with cookie active
                window.location.href = `/en/${TOUR_GROUP.slug}`;
            } else {
                const data = await res.json().catch(() => ({}));
                setError(data.error || 'Incorrect password. Please try again.');
                setLoading(false);
            }
        } catch {
            setError('Unable to authenticate. Please check your connection and try again.');
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#1C1917',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '32px 16px',
            color: '#F5F1EB',
        }}>
            <div style={{
                width: '100%',
                maxWidth: '460px',
                backgroundColor: '#23201D',
                borderRadius: '8px',
                border: '1px solid rgba(201, 147, 58, 0.25)',
                padding: 'clamp(32px, 6vw, 48px) clamp(20px, 5vw, 40px)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
                textAlign: 'center',
            }}>
                {/* Brand / Eyebrow */}
                <span style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '11px',
                    fontWeight: '600',
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: '#C9933A',
                    display: 'block',
                    marginBottom: '16px',
                }}>
                    Private Gallery
                </span>

                {/* Heading */}
                <h1 style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 'clamp(26px, 3.5vw, 32px)',
                    fontWeight: '500',
                    color: '#F5F1EB',
                    margin: '0 0 10px',
                    lineHeight: '1.25',
                }}>
                    {TOUR_GROUP.schoolName}
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '13px',
                    fontWeight: '500',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#C9933A',
                    margin: '0 0 16px',
                }}>
                    {TOUR_GROUP.tourName} · {TOUR_GROUP.dateLabel}
                </p>

                {/* Accent rule */}
                <div style={{
                    width: '40px',
                    height: '1px',
                    backgroundColor: '#C9933A',
                    margin: '0 auto 20px',
                }} />

                {/* Helper text */}
                <p style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '14px',
                    fontWeight: '300',
                    color: '#9A948F',
                    lineHeight: '1.6',
                    margin: '0 0 32px',
                }}>
                    Enter the password shared with parents and the school team.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <label
                            htmlFor="memories-password"
                            style={{
                                display: 'block',
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '11px',
                                fontWeight: '500',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                color: '#C9933A',
                                marginBottom: '8px',
                            }}
                        >
                            Tour Password
                        </label>
                        <input
                            id="memories-password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (error) setError(null);
                            }}
                            placeholder="Enter password"
                            disabled={loading}
                            style={{
                                width: '100%',
                                boxSizing: 'border-box',
                                minHeight: '48px',
                                padding: '14px 16px',
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '16px',
                                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                border: '1px solid rgba(201, 147, 58, 0.3)',
                                borderRadius: '4px',
                                color: '#F5F1EB',
                                outline: 'none',
                                transition: 'border-color 0.2s ease',
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = '#C9933A';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(201, 147, 58, 0.3)';
                            }}
                        />
                    </div>

                    {/* Error display */}
                    {error && (
                        <div style={{
                            backgroundColor: 'rgba(239, 83, 80, 0.1)',
                            border: '1px solid rgba(239, 83, 80, 0.4)',
                            borderRadius: '4px',
                            padding: '12px 14px',
                            marginBottom: '20px',
                            color: '#FF8A80',
                            fontFamily: "'Jost', Arial, sans-serif",
                            fontSize: '14px',
                            lineHeight: '1.4',
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            minHeight: '48px',
                            backgroundColor: loading ? '#8A6D3B' : '#C9933A',
                            color: '#1C1917',
                            padding: '16px 24px',
                            border: 'none',
                            borderRadius: '4px',
                            fontFamily: "'Jost', Arial, sans-serif",
                            fontSize: '12px',
                            fontWeight: '600',
                            letterSpacing: '0.24em',
                            textTransform: 'uppercase',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(201, 147, 58, 0.3)',
                        }}
                    >
                        {loading ? 'Verifying...' : 'Unlock Gallery'}
                    </button>
                </form>

                {/* Back Link */}
                <div style={{ marginTop: '28px' }}>
                    <Link
                        href="/"
                        id="login-return-link"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '44px',
                            minWidth: '44px',
                            padding: '12px 18px',
                            fontFamily: "'Jost', Arial, sans-serif",
                            fontSize: '13px',
                            color: '#9A948F',
                            textDecoration: 'none',
                            letterSpacing: '0.08em',
                            transition: 'color 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#C9933A';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#9A948F';
                        }}
                    >
                        ← Return to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
