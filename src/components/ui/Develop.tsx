'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import styles from './Develop.module.css';

interface DevelopProps {
    children: ReactNode;
    className?: string;
}

/**
 * The site's one motion idea: a photo "develops" from slightly muted to full
 * colour as it enters the screen. It is visible from the start, so nothing
 * waits on scrolling to be seen, and reduced motion makes the change instant.
 */
export default function Develop({ children, className }: DevelopProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.dataset.developed = 'true';
                    observer.disconnect();
                }
            },
            { rootMargin: '0px 0px -12% 0px' },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={[styles.develop, className].filter(Boolean).join(' ')}>
            {children}
        </div>
    );
}
