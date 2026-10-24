import type { ReactNode } from 'react';
import { Link } from '@/i18n/routing';
import styles from './PageHeader.module.css';

interface Crumb {
    href?: string;
    label: string;
}

interface PageHeaderProps {
    title: string;
    lead?: ReactNode;
    /** Trail above the title; the last item is the current page and is not linked. */
    breadcrumbs?: Crumb[];
    breadcrumbLabel?: string;
}

// The opening of every inner page: a quiet trail, one large title, one line of intro.
export default function PageHeader({ title, lead, breadcrumbs, breadcrumbLabel = 'Breadcrumb' }: PageHeaderProps) {
    return (
        <header className={styles.header} data-ds>
            <div className={styles.inner}>
                {breadcrumbs && breadcrumbs.length > 0 ? (
                    <nav aria-label={breadcrumbLabel}>
                        <ol className={styles.trail}>
                            {breadcrumbs.map((crumb, i) => (
                                <li key={`${crumb.label}-${i}`}>
                                    {crumb.href && i < breadcrumbs.length - 1 ? (
                                        <Link href={crumb.href}>{crumb.label}</Link>
                                    ) : (
                                        <span aria-current="page">{crumb.label}</span>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                ) : null}
                <h1 className={styles.title}>{title}</h1>
                {lead ? <p className={styles.lead}>{lead}</p> : null}
            </div>
        </header>
    );
}
