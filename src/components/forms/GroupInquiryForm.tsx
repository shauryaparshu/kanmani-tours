'use client';

import React, { useState } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function GroupInquiryForm() {
    const [formData, setFormData] = useState({
        contactName: '',
        institutionName: '',
        email: '',
        phone: '',
        groupType: 'School',
        groupSize: '',
        travelWindow: '',
        additionalDetails: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const validateField = (name: string, value: string) => {
        let error = '';
        if (name === 'contactName') {
            const sanitized = value.replace(/[<>]/g, '').trim();
            if (sanitized.length < 2) error = 'Please enter your full name (min 2 characters).';
            if (/[0-9]/.test(sanitized)) error = 'Name should not contain numbers.';
        }
        if (name === 'institutionName') {
            const sanitized = value.replace(/[<>]/g, '').trim();
            if (sanitized.length < 2) error = 'Please enter your institution name (min 2 characters).';
        }
        if (name === 'email') {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(value.trim())) error = 'Please enter a valid email address.';
        }
        if (name === 'phone') {
            if (!value) {
                error = 'Please enter a phone number.';
            } else if (!isValidPhoneNumber(value)) {
                error = 'Please enter a valid phone number.';
            }
        }
        if (name === 'groupSize') {
            const num = parseInt(value, 10);
            if (!value || isNaN(num) || num < 1) {
                error = 'Please enter an approximate group size.';
            }
        }
        if (name === 'travelWindow') {
            if (!value.trim()) {
                error = 'Please enter a preferred travel window (e.g. March 2027).';
            }
        }
        return error;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
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
        const requiredFields = ['contactName', 'institutionName', 'email', 'phone', 'groupSize', 'travelWindow'];
        const newErrors: Record<string, string> = {};

        requiredFields.forEach(field => {
            const error = validateField(field, formData[field as keyof typeof formData]);
            if (error) newErrors[field] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            const combinedMessage = [
                `Institution: ${formData.institutionName.trim()}`,
                `Group Type: ${formData.groupType}`,
                `Approximate Group Size: ${formData.groupSize}`,
                `Preferred Travel Window: ${formData.travelWindow.trim()}`,
                formData.additionalDetails.trim() ? `\nAdditional Details:\n${formData.additionalDetails.trim()}` : ''
            ].filter(Boolean).join('\n');

            const payload = {
                name: formData.contactName.trim().replace(/[<>]/g, ''),
                email: formData.email.trim(),
                phone: formData.phone,
                subject: 'Japan Group Tour Inquiry',
                message: combinedMessage
            };

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (result.success) {
                setSubmitted(true);
            } else {
                setErrors({ submit: 'Something went wrong. Please email us directly at kanmanitours@gmail.com.' });
            }
        } catch {
            setErrors({ submit: 'Connection error. Please email kanmanitours@gmail.com' });
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
        transition: 'all 0.3s ease',
        boxSizing: 'border-box' as const
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
                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '28px', fontWeight: '500', color: '#1C1917', marginBottom: '12px' }}>Inquiry Sent</h2>
                <p style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '16px', color: '#6B6560', lineHeight: '1.6', maxWidth: '460px', margin: '0 auto 24px' }}>
                    Thank you, {formData.contactName.split(' ')[0]}. We have received your group inquiry for {formData.institutionName} and our team will get in touch within 24 hours.
                </p>
                <button
                    onClick={() => {
                        setSubmitted(false);
                        setFormData({
                            contactName: '',
                            institutionName: '',
                            email: '',
                            phone: '',
                            groupType: 'School',
                            groupSize: '',
                            travelWindow: '',
                            additionalDetails: ''
                        });
                    }}
                    style={{
                        fontFamily: "'Jost', Arial, sans-serif", fontSize: '12px', fontWeight: '600', letterSpacing: '0.2em', color: '#C9933A',
                        background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase'
                    }}
                >
                    Send Another Inquiry
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            {/* Contact Name and Institution Name */}
            <div className="r-grid-2" style={{ gap: '20px', marginBottom: '24px' }}>
                <div>
                    <label style={labelStyle}>CONTACT NAME <span style={{ color: '#d49a36' }}>*</span></label>
                    <input
                        name="contactName"
                        type="text"
                        value={formData.contactName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('contactName')}
                        onBlur={handleBlur}
                        style={inputStyle('contactName')}
                        placeholder="e.g. Dr. Ramesh Kumar"
                        required
                    />
                    {errors.contactName && <span style={{ color: '#E53E3E', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.contactName}</span>}
                </div>
                <div>
                    <label style={labelStyle}>INSTITUTION NAME <span style={{ color: '#d49a36' }}>*</span></label>
                    <input
                        name="institutionName"
                        type="text"
                        value={formData.institutionName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('institutionName')}
                        onBlur={handleBlur}
                        style={inputStyle('institutionName')}
                        placeholder="e.g. Delhi Public School / IIT Madras"
                        required
                    />
                    {errors.institutionName && <span style={{ color: '#E53E3E', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.institutionName}</span>}
                </div>
            </div>

            {/* Email and Phone */}
            <div className="r-grid-2" style={{ gap: '20px', marginBottom: '24px' }}>
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
                        placeholder="coordinator@institution.edu"
                        required
                    />
                    {errors.email && <span style={{ color: '#E53E3E', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
                </div>
                <div>
                    <label style={labelStyle}>PHONE NUMBER <span style={{ color: '#d49a36' }}>*</span></label>
                    <div style={{ 
                        backgroundColor: focusedField === 'phone' ? '#FFFFFF' : '#FAFAF7',
                        border: '1px solid',
                        borderColor: focusedField === 'phone' ? '#C9933A' : '#E8E4DC',
                        transition: 'all 0.3s ease',
                        height: '52px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 16px',
                        boxSizing: 'border-box'
                    }}>
                        <PhoneInput
                            international
                            defaultCountry="IN"
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
            </div>

            {/* Group Type and Group Size */}
            <div className="r-grid-2" style={{ gap: '20px', marginBottom: '24px' }}>
                <div>
                    <label style={labelStyle}>GROUP TYPE <span style={{ color: '#d49a36' }}>*</span></label>
                    <select
                        name="groupType"
                        value={formData.groupType}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('groupType')}
                        onBlur={() => setFocusedField(null)}
                        style={inputStyle('groupType')}
                        required
                    >
                        <option value="School">School</option>
                        <option value="University">University</option>
                        <option value="Corporate">Corporate</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label style={labelStyle}>APPROXIMATE GROUP SIZE <span style={{ color: '#d49a36' }}>*</span></label>
                    <input
                        name="groupSize"
                        type="number"
                        min="1"
                        value={formData.groupSize}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('groupSize')}
                        onBlur={handleBlur}
                        style={inputStyle('groupSize')}
                        placeholder="e.g. 25"
                        required
                    />
                    {errors.groupSize && <span style={{ color: '#E53E3E', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.groupSize}</span>}
                </div>
            </div>

            {/* Preferred Travel Window */}
            <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>PREFERRED TRAVEL WINDOW <span style={{ color: '#d49a36' }}>*</span></label>
                <input
                    name="travelWindow"
                    type="text"
                    value={formData.travelWindow}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('travelWindow')}
                    onBlur={handleBlur}
                    style={inputStyle('travelWindow')}
                    placeholder="e.g. March 2027 / Autumn 2026"
                    required
                />
                {errors.travelWindow && <span style={{ color: '#E53E3E', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.travelWindow}</span>}
            </div>

            {/* Additional Details (optional) */}
            <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>ADDITIONAL DETAILS</label>
                    <span style={{ fontFamily: "'Jost', Arial, sans-serif", fontSize: '11px', color: '#9A948F', letterSpacing: '0.05em' }}>OPTIONAL</span>
                </div>
                <textarea
                    name="additionalDetails"
                    rows={4}
                    value={formData.additionalDetails}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('additionalDetails')}
                    onBlur={handleBlur}
                    style={{ ...inputStyle('additionalDetails'), minHeight: '120px', resize: 'vertical' }}
                    placeholder="Tell us about specific learning objectives, destinations of interest, or custom requirements..."
                ></textarea>
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
                {loading ? 'SENDING INQUIRY...' : 'SUBMIT GROUP INQUIRY'}
            </button>

            <p style={{
                fontFamily: "'Jost', Arial, sans-serif",
                fontSize: '12px',
                color: '#9A948F',
                textAlign: 'center',
                marginTop: '12px',
                letterSpacing: '0.04em'
            }}>
                Our institutional coordinator will respond within 24 hours
            </p>
        </form>
    );
}
