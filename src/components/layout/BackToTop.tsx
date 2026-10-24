'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './SiteChrome.module.css';

export default function BackToTop() {
    const t = useTranslations('Navigation');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > window.innerHeight * 2);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollUp = () => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    };

    return (
        <button
            type="button"
            className={styles.backToTop}
            data-ds
            data-visible={visible}
            aria-label={t('backToTop')}
            tabIndex={visible ? 0 : -1}
            onClick={scrollUp}
        >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M6 14l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
        </button>
    );
}
