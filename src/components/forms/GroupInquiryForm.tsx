'use client';

import React, { useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import styles from './Form.module.css';

// Option values go into the enquiry email; only the visible labels come from messages.
const GROUP_TYPES = [
    { value: 'School', key: 'school' },
    { value: 'University', key: 'university' },
    { value: 'Corporate', key: 'corporate' },
    { value: 'Other', key: 'other' },
] as const;

export default function GroupInquiryForm() {
    const t = useTranslations('GroupForm');
    const uid = useId();
    const id = (name: string) => `${uid}-${name}`;

    const [formData, setFormData] = useState({
        contactName: '',
        institutionName: '',
        email: '',
        phone: '',
        groupType: 'School',
        groupSize: '',
        travelWindow: '',
        additionalDetails: '',
        website: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateField = (name: string, value: string) => {
        let error = '';
        if (name === 'contactName') {
            const sanitized = value.replace(/[<>]/g, '').trim();
            if (sanitized.length < 2) error = t('errors.contactNameShort');
            if (/[0-9]/.test(sanitized)) error = t('errors.contactNameDigits');
        }
        if (name === 'institutionName') {
            const sanitized = value.replace(/[<>]/g, '').trim();
            if (sanitized.length < 2) error = t('errors.institutionShort');
        }
        if (name === 'email') {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(value.trim())) error = t('errors.emailInvalid');
        }
        if (name === 'phone') {
            if (!value) {
                error = t('errors.phoneMissing');
            } else if (!isValidPhoneNumber(value)) {
                error = t('errors.phoneInvalid');
            }
        }
        if (name === 'groupSize') {
            const num = parseInt(value, 10);
            if (!value || isNaN(num) || num < 1) {
                error = t('errors.groupSize');
            }
        }
        if (name === 'travelWindow') {
            if (!value.trim()) {
                error = t('errors.travelWindow');
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
                message: combinedMessage,
                website: formData.website
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
                setErrors({ submit: result.error || t('errors.submitFailed') });
            }
        } catch {
            setErrors({ submit: t('errors.connection') });
        } finally {
            setLoading(false);
        }
    };

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

    const textInput = (name: 'contactName' | 'institutionName' | 'email' | 'travelWindow', type: string, autoComplete?: string) => (
        <div className={styles.field}>
            {label(name, t(name))}
            <input
                id={id(name)}
                name={name}
                type={type}
                autoComplete={autoComplete}
                value={formData[name]}
                onChange={handleChange}
                onBlur={handleBlur}
                className={styles.input}
                placeholder={t(`${name}Placeholder`)}
                required
                {...invalidProps(name)}
            />
            {fieldError(name)}
        </div>
    );

    if (submitted) {
        return (
            <div className={styles.success} role="status">
                <h2 className={styles.successTitle}>
                    <CheckCircle2 aria-hidden="true" />
                    {t('sentTitle')}
                </h2>
                <p className={styles.successBody}>
                    {t('sentBody', { name: formData.contactName.split(' ')[0], institution: formData.institutionName })}
                </p>
                <button
                    type="button"
                    className={styles.textButton}
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
                            additionalDetails: '',
                            website: ''
                        });
                    }}
                >
                    {t('sendAnother')}
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate className={styles.form}>
            <div className={styles.row}>
                {textInput('contactName', 'text', 'name')}
                {textInput('institutionName', 'text', 'organization')}
            </div>

            <div className={styles.row}>
                {textInput('email', 'email', 'email')}
                <div className={styles.field}>
                    {label('phone', t('phone'))}
                    <div className={styles.phone} data-invalid={errors.phone ? 'true' : undefined}>
                        <PhoneInput
                            id={id('phone')}
                            international
                            defaultCountry="IN"
                            value={formData.phone}
                            onChange={(val) => setFormData(prev => ({ ...prev, phone: val || '' }))}
                            maxLength={15}
                            {...invalidProps('phone')}
                        />
                    </div>
                    {fieldError('phone')}
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    {label('groupType', t('groupType'))}
                    <div className={styles.select}>
                        <select
                            id={id('groupType')}
                            name="groupType"
                            value={formData.groupType}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        >
                            {GROUP_TYPES.map((g) => (
                                <option key={g.value} value={g.value}>{t(`groupTypes.${g.key}`)}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={styles.field}>
                    {label('groupSize', t('groupSize'))}
                    <input
                        id={id('groupSize')}
                        name="groupSize"
                        type="number"
                        min="1"
                        inputMode="numeric"
                        value={formData.groupSize}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={styles.input}
                        placeholder={t('groupSizePlaceholder')}
                        required
                        {...invalidProps('groupSize')}
                    />
                    {fieldError('groupSize')}
                </div>
            </div>

            {textInput('travelWindow', 'text')}

            <div className={styles.field}>
                <div className={styles.labelRow}>
                    <label htmlFor={id('additionalDetails')} className={styles.label}>{t('additionalDetails')}</label>
                    <span className={styles.optional}>{t('optional')}</span>
                </div>
                <textarea
                    id={id('additionalDetails')}
                    name="additionalDetails"
                    rows={4}
                    value={formData.additionalDetails}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={styles.input}
                    placeholder={t('additionalDetailsPlaceholder')}
                ></textarea>
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
