'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { AlertCircle } from 'lucide-react';
import { TOUR_GROUP } from '@/lib/tourGroup';
import ArrowBox from '@/components/ui/ArrowBox';
import formStyles from '@/components/forms/Form.module.css';
import styles from '../Memories.module.css';

export default function MemoriesLoginForm() {
    const t = useTranslations('Memories.login');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password.trim()) {
            setError(t('errEmpty'));
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
                setError(data.error || t('errWrong'));
                setLoading(false);
            }
        } catch {
            setError(t('errConnection'));
            setLoading(false);
        }
    };

    return (
        <main className={styles.login} data-ds>
            <div className={styles.card}>
                <p className={styles.meta}>
                    <span>{t('privateGallery')}</span>
                    <span>{TOUR_GROUP.tourName}</span>
                    <span className="num">{TOUR_GROUP.dateLabel}</span>
                </p>
                <h1 className={styles.cardTitle}>{TOUR_GROUP.schoolName}</h1>
                <p className={styles.lead}>{t('helper')}</p>

                <form onSubmit={handleSubmit} className={formStyles.form} noValidate>
                    <div className={formStyles.field}>
                        <label htmlFor="memories-password" className={formStyles.label}>
                            {t('passwordLabel')}
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
                            placeholder={t('passwordPlaceholder')}
                            disabled={loading}
                            className={formStyles.input}
                            aria-invalid={error ? true : undefined}
                            aria-describedby={error ? 'memories-password-error' : undefined}
                        />
                    </div>

                    {error && (
                        <p id="memories-password-error" className={formStyles.alert} role="alert">
                            <AlertCircle aria-hidden="true" />
                            {error}
                        </p>
                    )}

                    <button type="submit" disabled={loading} className={formStyles.submit}>
                        {loading ? t('verifying') : t('unlock')}
                    </button>
                </form>

                <Link href="/" id="login-return-link" className={styles.returnLink}>
                    <ArrowBox direction="left" />
                    {t('returnHome')}
                </Link>
            </div>
        </main>
    );
}
