import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import FooterSection from '@/components/layout/FooterSection';
import PageHeader from '@/components/layout/PageHeader';
import GroupInquiryForm from '@/components/forms/GroupInquiryForm';
import ContactDetails from '@/components/contact/ContactDetails';
import styles from '@/components/contact/EnquiryPage.module.css';
import { pageAlternates, pageOpenGraph } from '@/lib/site';

const HIGHLIGHTS = ['cultural', 'logistics', 'safety'] as const;
const COHORTS = ['schools', 'universities', 'corporate'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale: 'en', namespace: 'Groups' });
    const title = t('metaTitle');
    const description = t('metaDescription');
    return {
        alternates: pageAlternates(locale, '/japan/groups', { englishOnly: true }),
        title,
        description,
        openGraph: pageOpenGraph(title, description),
    };
}

// Unlinked on purpose: the owner shares this page with schools directly.
export default async function JapanGroupsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    // Japan groups page must never render in Japanese
    if (locale === 'ja') {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'Groups' });

    return (
        <>
            <main>
                <PageHeader
                    title={t('title')}
                    lead={t('lead')}
                    breadcrumbs={[{ href: '/', label: t('breadcrumbHome') }, { label: t('breadcrumbGroups') }]}
                />
                <section className={styles.section} aria-labelledby="groups-programme-title">
                    <div className={styles.inner}>
                        <div className={styles.panel}>
                            <div className={styles.intro}>
                                <h2 id="groups-programme-title" className={styles.panelTitle}>{t('programTitle')}</h2>
                                <p className={styles.body}>{t('programIntro')}</p>
                                <ul className={styles.bullets}>
                                    {HIGHLIGHTS.map((key) => (
                                        <li key={key}>
                                            <strong>{t(`highlights.${key}Title`)}</strong> {t(`highlights.${key}Body`)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <h2 className={styles.blockTitle}>{t('formTitle')}</h2>
                            <p className={styles.body}>{t('formNote')}</p>
                            <GroupInquiryForm />
                        </div>

                        <aside className={styles.aside}>
                            <div className={styles.block}>
                                <h2 className={styles.blockTitle}>{t('cohortsTitle')}</h2>
                                <dl className={styles.cohorts}>
                                    {COHORTS.map((key) => (
                                        <div key={key} className={styles.cohort}>
                                            <dt>{t(`cohorts.${key}Title`)}</dt>
                                            <dd>{t(`cohorts.${key}Body`)}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                            <div className={styles.block}>
                                <h2 className={styles.blockTitle}>{t('directTitle')}</h2>
                                <p className={styles.body}>{t('directBody')}</p>
                                <ContactDetails office={false} />
                            </div>
                            <figure className={`${styles.quote} surface-ink`}>
                                <blockquote>“{t('quote')}”</blockquote>
                                <figcaption>{t('quoteBy')}</figcaption>
                            </figure>
                        </aside>
                    </div>
                </section>
            </main>
            <FooterSection plan={false} />
        </>
    );
}
