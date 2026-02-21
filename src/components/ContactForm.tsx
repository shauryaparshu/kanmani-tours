'use client';

import React, { useState } from 'react';

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

    const validateField = (name: string, value: string) => {
        let error = '';
        if (name === 'phone') {
            if (value && !/^\d+$/.test(value)) error = 'Phone number must only contain numbers.';
            if (value.length > 0 && (value.length < 10 || value.length > 11)) {
                error = 'Please enter a valid 10 or 11 digit phone number.';
            }
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

        // Strict Numeric check for Phone
        if (name === 'phone') {
            value = value.replace(/\D/g, '').slice(0, 11);
        }

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
        const { name, value } = e.target;
        const error = validateField(name, value);
        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
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

        // Final Sanitize
        const finalSubmission = {
            ...formData,
            name: formData.name.trim().replace(/[<>]/g, ''),
            email: formData.email.trim().toLowerCase(),
            phone: formData.phone.replace(/[<>]/g, '').trim(),
            message: formData.message.trim().replace(/[<>]/g, '')
        };

        console.log('Sanitized Contact Submission:', finalSubmission);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="contact-form-success animate">
                <div className="success-icon-large">✓</div>
                <h2 className="success-title">Message Sent Successfully!</h2>
                <p className="success-message">
                    Thank you for reaching out, <strong>{formData.name.split(' ')[0]}</strong>! We have received your message and our team will get back to you within 24 hours.
                </p>
                <button
                    className="btn-outline-primary"
                    onClick={() => setSubmitted(false)}
                    style={{ marginTop: '20px' }}
                >
                    Send Another Message
                </button>
            </div>
        );
    }

    return (
        <form className="modern-contact-form" onSubmit={handleSubmit} noValidate>
            <div className="contact-form-row">
                <div className="contact-form-group">
                    <label>Your Name</label>
                    <input
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        className={errors.name ? 'input-error' : ''}
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
                <div className="contact-form-group">
                    <label>Email Address</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="example@domain.com"
                        className={errors.email ? 'input-error' : ''}
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
            </div>
            <div className="contact-form-group">
                <label>Phone Number (Optional)</label>
                <input
                    name="phone"
                    type="tel"
                    placeholder="09012345678"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={11}
                    className={errors.phone ? 'input-error' : ''}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
            <div className="contact-form-group">
                <label>Subject</label>
                <select name="subject" value={formData.subject} onChange={handleChange}>
                    <option value="Tour Enquiry">Tour Enquiry</option>
                    <option value="Celebrity Meeting Request">Celebrity Meeting Request</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div className="contact-form-group">
                <label>Message</label>
                <textarea
                    name="message"
                    rows={5}
                    placeholder="Tell us more about what you're looking for..."
                    className={errors.message ? 'input-error' : ''}
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                ></textarea>
                {errors.message && <span className="error-text">{errors.message}</span>}
            </div>
            <button type="submit" className="contact-submit-btn">Send Message</button>
        </form>
    );
}
