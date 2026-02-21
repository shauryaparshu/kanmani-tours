'use client';

import React, { useState, useEffect } from 'react';
import { useBooking } from '@/context/BookingContext';

interface Tour {
    slug: string;
    title: string;
    startDate: string;
    seatsLeft: number;
    category: string;
}

interface BookingModalProps {
    upcomingTours: Tour[];
}

export default function BookingModal({ upcomingTours }: BookingModalProps) {
    const { isOpen, closeBooking, preselectedSlug } = useBooking();
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        tourSlug: '',
        name: '',
        email: '',
        phone: '',
        travellers: '1',
        message: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // When modal opens, sync the pre-selected tour
    useEffect(() => {
        if (isOpen) {
            setSubmitted(false);
            setErrors({});
            setFormData(prev => ({
                ...prev,
                tourSlug: preselectedSlug ?? (upcomingTours[0]?.slug ?? ''),
                name: '',
                email: '',
                phone: '',
                travellers: '1',
                message: '',
            }));
        }
    }, [isOpen, preselectedSlug, upcomingTours]);

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeBooking();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [closeBooking]);

    const validateField = (name: string, value: string) => {
        let error = '';
        if (name === 'tourSlug') {
            if (!value) error = 'Please select a tour.';
        }
        if (name === 'name') {
            const sanitized = value.replace(/[<>]/g, '').trim();
            if (sanitized.length < 2) error = 'Please enter your full name (min 2 characters).';
            if (/[0-9]/.test(sanitized)) error = 'Name should not contain numbers.';
        }
        if (name === 'email') {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(value.trim())) error = 'Please enter a valid email address.';
        }
        if (name === 'phone') {
            if (value && !/^\d+$/.test(value)) error = 'Phone number must only contain numbers.';
            if (value.length > 0 && (value.length < 10 || value.length > 11)) {
                error = 'Please enter a valid 10 or 11 digit phone number.';
            }
        }
        return error;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        let { name, value } = e.target;

        if (name === 'phone') {
            value = value.replace(/\D/g, '').slice(0, 11);
        }

        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const err = validateField(name, value);
        if (err) setErrors(prev => ({ ...prev, [name]: err }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        (['tourSlug', 'name', 'email', 'phone'] as const).forEach(key => {
            const err = validateField(key, formData[key]);
            if (err) newErrors[key] = err;
        });
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

        // Final sanitize
        const payload = {
            ...formData,
            name: formData.name.trim().replace(/[<>]/g, ''),
            email: formData.email.trim().toLowerCase(),
            phone: formData.phone.replace(/\D/g, ''),
            message: formData.message.trim().replace(/[<>]/g, ''),
        };
        console.log('Universal booking submission:', payload);
        setSubmitted(true);
    };

    if (!isOpen) return null;

    const selectedTour = upcomingTours.find(t => t.slug === formData.tourSlug);

    return (
        <div className="bm-backdrop" onClick={closeBooking}>
            <div className="bm-modal" onClick={e => e.stopPropagation()}>
                <button className="bm-close" onClick={closeBooking} aria-label="Close">✕</button>

                {submitted ? (
                    <div className="bm-success">
                        <div className="bm-success-icon">✓</div>
                        <h2>Enquiry Sent!</h2>
                        <p>Thank you! We'll get back to you within 24 hours about <strong>{selectedTour?.title ?? 'your selected tour'}</strong>.</p>
                        <button className="bm-btn-primary" onClick={closeBooking}>Close</button>
                    </div>
                ) : (
                    <>
                        <div className="bm-header">
                            <h2 className="bm-title">Book Your Tour</h2>
                            <p className="bm-subtitle">Fill in your details and we'll confirm your spot within 24 hours.</p>
                        </div>

                        <form className="bm-form" onSubmit={handleSubmit} noValidate>
                            {/* Tour Selection */}
                            <div className="bm-form-group">
                                <label className="bm-label">Select Tour</label>
                                <select
                                    name="tourSlug"
                                    className={`bm-input ${errors.tourSlug ? 'bm-input-error' : ''}`}
                                    value={formData.tourSlug}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                >
                                    <option value="">— Choose a tour —</option>
                                    {upcomingTours.map(t => (
                                        <option key={t.slug} value={t.slug}>
                                            {t.title} · {new Date(t.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {t.seatsLeft} seats left
                                        </option>
                                    ))}
                                </select>
                                {errors.tourSlug && <span className="bm-error">{errors.tourSlug}</span>}
                            </div>

                            {/* Name + Email */}
                            <div className="bm-row">
                                <div className="bm-form-group">
                                    <label className="bm-label">Full Name</label>
                                    <input
                                        name="name"
                                        type="text"
                                        className={`bm-input ${errors.name ? 'bm-input-error' : ''}`}
                                        placeholder="Your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                    />
                                    {errors.name && <span className="bm-error">{errors.name}</span>}
                                </div>
                                <div className="bm-form-group">
                                    <label className="bm-label">Email Address</label>
                                    <input
                                        name="email"
                                        type="email"
                                        className={`bm-input ${errors.email ? 'bm-input-error' : ''}`}
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                    />
                                    {errors.email && <span className="bm-error">{errors.email}</span>}
                                </div>
                            </div>

                            {/* Phone + Travellers */}
                            <div className="bm-row">
                                <div className="bm-form-group">
                                    <label className="bm-label">Phone (Japan)</label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        className={`bm-input ${errors.phone ? 'bm-input-error' : ''}`}
                                        placeholder="09012345678"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        maxLength={11}
                                    />
                                    {errors.phone && <span className="bm-error">{errors.phone}</span>}
                                </div>
                                <div className="bm-form-group">
                                    <label className="bm-label">Number of Travellers</label>
                                    <select
                                        name="travellers"
                                        className="bm-input"
                                        value={formData.travellers}
                                        onChange={handleChange}
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="bm-form-group">
                                <label className="bm-label">Message <span className="bm-optional">(Optional)</span></label>
                                <textarea
                                    name="message"
                                    className="bm-input"
                                    rows={3}
                                    placeholder="Special requests, dietary requirements, questions, etc."
                                    value={formData.message}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </div>

                            <div className="bm-actions">
                                <button type="submit" className="bm-btn-primary">Submit Enquiry</button>
                                <button type="button" className="bm-btn-ghost" onClick={closeBooking}>Cancel</button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
