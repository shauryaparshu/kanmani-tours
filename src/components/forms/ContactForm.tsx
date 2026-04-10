'use client';

import React, { useState } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: 'Tour Enquiry',
        message: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const validateField = (name: string, value: string) => {
        let error = '';
        if (name === 'phone') {
            if (value && !isValidPhoneNumber(value)) error = 'Please enter a valid phone number.';
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
        if (name === 'message') {
            if (value.trim().length < 10) error = 'Please enter at least 10 characters.';
        }
        return error;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        let { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFocusedField(null);
        const { name, value } = e.target;
        const error = validateField(name, value);
        if (error) setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key as keyof typeof formData]);
            if (error) newErrors[key] = error;
        });
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.success) {
                setSubmitted(true);
            } else {
                setErrors({ submit: 'Something went wrong. Please email us directly.' });
            }
        } catch {
            setErrors({ submit: 'Connection error. Please email hello@kanmanitours.com' });
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = (name: string) => ({
        fontFamily: "'Jost', Arial, sans-serif",
        fontSize: '15px',
        color: '#1C1917',
        backgroundColor: focusedField === name ? '#FFFFFF' : '#FAFAF7',
        border: '1px solid',
        borderColor: focusedField === name ? '#C9933A' : '#E8E4DC',
        padding: '14px 16px',
        width: '100%',
        outline: 'none',
        borderRadius: 0,
        transition: 'all 0.3s ease'
    });

    const labelStyle = {
        fontFamily: "'Jost', Arial, sans-serif",
        fontSize: '12px',
        fontWeight: '500',
        letterSpacing: '0.18em',
        color: '#1C1917',
        textTransform: 'uppercase' as const,
        marginBottom: '8px',
        display: 'block'
    };

    if (submitted) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{
                    width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(201,147,58,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#C9933A', fontSize: '32px'
                }}>✓</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '28px', fontWeight: '500', color: '#1C1917', marginBottom: '12px' }}>Message Sent</h2>
                <p style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '16px', color: '#6B6560', lineHeight: '1.6', maxWidth: '400px', margin: '0 auto 24px' }}>
                    Thank you, {formData.name.split(' ')[0]}. We have received your enquiry and will respond within 24 hours.
                </p>
                <button
                    onClick={() => setSubmitted(false)}
                    style={{
                        fontFamily: "'Jost', Arial, sans-serif", fontSize: '12px', fontWeight: '600', letterSpacing: '0.2em', color: '#C9933A',
                        background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase'
                    }}
                >
                    Send Another Message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            {/* Name and Email grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div>
                    <label style={labelStyle}>FULL NAME <span style={{ color: '#d49a36' }}>*</span></label>
                    <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={handleBlur}
                        style={inputStyle('name')}
                        required
                    />
                    {errors.name && <span style={{ color: '#E53E3E', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
                </div>
                <div>
                    <label style={labelStyle}>EMAIL ADDRESS <span style={{ color: '#d49a36' }}>*</span></label>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={handleBlur}
                        style={inputStyle('email')}
                        required
                    />
                    {errors.email && <span style={{ color: '#E53E3E', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
                </div>
            </div>

            {/* Phone */}
            <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>PHONE NUMBER <span style={{ color: '#d49a36' }}>*</span></label>
                <div style={{ 
                    backgroundColor: focusedField === 'phone' ? '#FFFFFF' : '#FAFAF7',
                    border: '1px solid',
                    borderColor: focusedField === 'phone' ? '#C9933A' : '#E8E4DC',
                    transition: 'all 0.3s ease',
                    height: '52px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 16px'
                }}>
                    <PhoneInput
                        international
                        defaultCountry="JP"
                        value={formData.phone}
                        onChange={(val) => setFormData(prev => ({ ...prev, phone: val || '' }))}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        className="custom-phone-input"
                        maxLength={15}
                    />
                </div>
                {errors.phone && <span style={{ color: '#E53E3E', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.phone}</span>}
            </div>

            {/* Subject */}
            <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>SUBJECT <span style={{ color: '#d49a36' }}>*</span></label>
                <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle('subject')}
                    required
                >
                    <option value="Tour Enquiry">Tour Enquiry</option>
                    <option value="Custom Tour Request">Custom Tour Request</option>
                    <option value="Field Trip">Field Trip</option>
                    <option value="Celebrity Tour Enquiry">Celebrity Tour Enquiry</option>
                    <option value="Group Booking">Group Booking</option>
                    <option value="Booking Amendment">Booking Amendment</option>
                    <option value="General Question">General Question</option>
                </select>
            </div>

            {/* Message */}
            <div style={{ marginBottom: '32px' }}>
                <label style={labelStyle}>MESSAGE <span style={{ color: '#d49a36' }}>*</span></label>
                <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={handleBlur}
                    style={{ ...inputStyle('message'), minHeight: '140px', resize: 'vertical' }}
                    required
                ></textarea>
                {errors.message && <span style={{ color: '#E53E3E', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.message}</span>}
            </div>

            {errors.submit && (
                <p style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '13px',
                    color: '#C0392B',
                    marginBottom: '12px',
                    textAlign: 'center'
                }}>{errors.submit}</p>
            )}

            <button
                type="submit"
                disabled={loading}
                style={{
                    fontFamily: "'Jost', Arial, sans-serif",
                    fontSize: '13px',
                    fontWeight: '600',
                    letterSpacing: '0.28em',
                    color: '#1C1917',
                    backgroundColor: loading ? '#9A8F85' : '#C9933A',
                    border: 'none',
                    padding: '18px',
                    width: '100%',
                    textTransform: 'uppercase',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginTop: '8px',
                    transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                    if (!loading) {
                        e.currentTarget.style.backgroundColor = '#1C1917';
                        e.currentTarget.style.color = '#C9933A';
                    }
                }}
                onMouseOut={(e) => {
                    if (!loading) {
                        e.currentTarget.style.backgroundColor = '#C9933A';
                        e.currentTarget.style.color = '#1C1917';
                    }
                }}
            >
                {loading ? 'SENDING...' : 'SEND MESSAGE'}
            </button>

            <p style={{
                fontFamily: "'Jost', Arial, sans-serif",
                fontSize: '12px',
                color: '#9A948F',
                textAlign: 'center',
                marginTop: '12px',
                letterSpacing: '0.04em'
            }}>
                We respond within 24 hours
            </p>
        </form>
    );
}
