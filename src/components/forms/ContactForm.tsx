'use client';

import React, { useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import styles from './Form.module.css';

// Option values are what the API receives; only the visible labels are translated.
const SUBJECTS = [
    { value: 'Tour Enquiry', key: 'tourEnquiry' },
    { value: 'Custom Tour Request', key: 'customTour' },
    { value: 'Field Trip', key: 'fieldTrip' },
    { value: 'Celebrity Tour Enquiry', key: 'celebrityTour' },
    { value: 'Group Booking', key: 'groupBooking' },
    { value: 'Booking Amendment', key: 'bookingAmendment' },
    { value: 'General Question', key: 'generalQuestion' },
] as const;

export default function ContactForm() {
    const t = useTranslations('ContactForm');
    const uid = useId();
    const id = (name: string) => `${uid}-${name}`;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: 'Tour Enquiry',
        message: '',
        website: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateField = (name: string, value: string) => {
        let error = '';
        if (name === 'phone') {
            if (value && !isValidPhoneNumber(value)) error = t('errors.phoneInvalid');
        }
        if (name === 'name') {
            const sanitized = value.replace(/[<>]/g, '').trim();
            if (sanitized.length < 2) error = t('errors.nameShort');
            if (/[0-9]/.test(sanitized)) error = t('errors.nameDigits');
        }
        if (name === 'email') {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(value.trim())) error = t('errors.emailInvalid');
        }
        if (name === 'message') {
            if (value.trim().length < 10) error = t('errors.messageShort');
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
                setErrors({ submit: result.error || t('errors.submitFailed') });
            }
        } catch {
            setErrors({ submit: t('errors.connection') });
        } finally {
            setLoading(false);
        }
    };

    // Error text under a field, tied to it with aria-describedby.
    const fieldError = (name: string) =>
        errors[name] ? (
            <p id={id(`${name}-error`)} className={styles.error}>
                <AlertCircle aria-hidden="true" />
                {errors[name]}
            </p>
        ) : null;

    const invalidProps = (name: string) => ({
        'aria-invalid': errors[name] ? true : undefined,
        'aria-describedby': errors[name] ? id(`${name}-error`) : undefined,
    });

    const label = (name: string, text: string) => (
        <label htmlFor={id(name)} className={styles.label}>
            {text}
            <span className={styles.required} aria-hidden="true">*</span>
        </label>
    );

    if (submitted) {
        return (
            <div className={styles.success} role="status">
                <h2 className={styles.successTitle}>
                    <CheckCircle2 aria-hidden="true" />
                    {t('sentTitle')}
                </h2>
                <p className={styles.successBody}>
                    {t('sentBody', { name: formData.name.split(' ')[0] })}
                </p>
                <button type="button" className={styles.textButton} onClick={() => setSubmitted(false)}>
                    {t('sendAnother')}
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate className={styles.form}>
            <div className={styles.row}>
                <div className={styles.field}>
                    {label('name', t('name'))}
                    <input
                        id={id('name')}
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={styles.input}
                        required
                        {...invalidProps('name')}
                    />
                    {fieldError('name')}
                </div>
                <div className={styles.field}>
                    {label('email', t('email'))}
                    <input
                        id={id('email')}
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={styles.input}
                        required
                        {...invalidProps('email')}
                    />
                    {fieldError('email')}
                </div>
            </div>

            <div className={styles.field}>
                {label('phone', t('phone'))}
                <div className={styles.phone} data-invalid={errors.phone ? 'true' : undefined}>
                    <PhoneInput
                        id={id('phone')}
                        international
                        defaultCountry="JP"
                        value={formData.phone}
                        onChange={(val) => setFormData(prev => ({ ...prev, phone: val || '' }))}
                        limitMaxLength
                        {...invalidProps('phone')}
                    />
                </div>
                {fieldError('phone')}
            </div>

            <div className={styles.field}>
                {label('subject', t('subject'))}
                <div className={styles.select}>
                    <select
                        id={id('subject')}
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    >
                        {SUBJECTS.map((s) => (
                            <option key={s.value} value={s.value}>{t(`subjects.${s.key}`)}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.field}>
                {label('message', t('message'))}
                <textarea
                    id={id('message')}
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={styles.input}
                    required
                    {...invalidProps('message')}
                ></textarea>
                {fieldError('message')}
            </div>

            {/* Honeypot: hidden from people, filled in by bots */}
            <div aria-hidden="true" className={styles.honeypot}>
                <label>
                    Website
                    <input name="website" type="text" tabIndex={-1} autoComplete="off" value={formData.website} onChange={handleChange} />
                </label>
            </div>

            <div className={styles.actions}>
                {errors.submit && (
                    <p className={styles.alert} role="alert">
                        <AlertCircle aria-hidden="true" />
                        {errors.submit}
                    </p>
                )}
                <button type="submit" disabled={loading} className={styles.submit}>
                    {loading ? t('sending') : t('submit')}
                </button>
                <p className={styles.note}>{t('respondNote')}</p>
            </div>
        </form>
    );
}
