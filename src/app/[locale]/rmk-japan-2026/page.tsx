import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ExternalLink } from 'lucide-react';
import FooterSection from '@/components/layout/FooterSection';
import { TOUR_GROUP } from '@/lib/tourGroup';
import DriveGallery from './DriveGallery';
import styles from './Memories.module.css';
import { MEMORIES_COOKIE, hasMemoriesAccess } from '@/lib/server/memoriesAuth';

// The private RMK gallery and its login are always rendered per request.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: `Japan Tour ${TOUR_GROUP.dateLabel} | ${TOUR_GROUP.schoolName}`,
    description: `Private guest photo gallery archive for ${TOUR_GROUP.schoolName}.`,
    robots: {
        index: false,
        follow: false,
    },
};

export default async function MemoriesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // Memories gallery is English-only
    if (locale !== 'en') {
        notFound();
    }

    // Password-gated auth check via httpOnly cookie
    const cookieStore = await cookies();
    if (!hasMemoriesAccess(cookieStore.get(MEMORIES_COOKIE)?.value)) {
        redirect(`/en/${TOUR_GROUP.slug}/login`);
    }

    const driveFolderId = process.env.MEMORIES_DRIVE_FOLDER_ID?.trim();
    const googleApiKey = process.env.GOOGLE_DRIVE_API_KEY?.trim();

    const t = await getTranslations({ locale, namespace: 'Memories' });

    const header = (
        <header className={styles.header}>
            <div className={`${styles.inner} ${styles.headerInner}`}>
                <p className={styles.meta}>
                    <span>{TOUR_GROUP.schoolName}</span>
                    <span>{TOUR_GROUP.tourName}</span>
                    <span className="num">{TOUR_GROUP.dateLabel}</span>
                </p>
                <h1 className={styles.title}>{t('title')}</h1>
                {driveFolderId ? (
                    <>
                        <p className={styles.lead}>{t('instructions')}</p>
                        <a
                            href={`https://drive.google.com/drive/folders/${driveFolderId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.secondary} ${styles.headerAction}`}
                        >
                            <span>{t('openDrive')}</span>
                            <ExternalLink aria-hidden="true" />
                        </a>
                    </>
                ) : (
                    /* Empty / preparation state (no gallery rendered) */
                    <p className={styles.lead}>{t('preparing')}</p>
                )}
            </div>
        </header>
    );

    return (
        <>
            <main className={styles.page}>
                {header}
                {driveFolderId ? (
                    <div className={styles.inner}>
                        {/* In-page DriveGallery when the API key is present, otherwise the Drive embed */}
                        {googleApiKey ? (
                            <DriveGallery rootFolderId={driveFolderId} />
                        ) : (
                            <div className={styles.body}>
                                <iframe
                                    src={`https://drive.google.com/embeddedfolderview?id=${driveFolderId}#grid`}
                                    title={t('iframeTitle')}
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                    className={styles.iframe}
                                />
                            </div>
                        )}

                        {/* Property and rights notice */}
                        <p className={styles.rights}>{t('rights', { school: TOUR_GROUP.schoolName })}</p>
                    </div>
                ) : null}
            </main>
            <FooterSection />
        </>
    );
}
