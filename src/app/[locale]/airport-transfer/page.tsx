import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import FooterSection from '@/components/layout/FooterSection';
import PageHeader from '@/components/layout/PageHeader';
import styles from '@/components/services/ServicePage.module.css';
import { pageAlternates, pageOpenGraph } from '@/lib/site';

const FEATURES = [1, 2, 3, 4] as const;
const STEPS = [1, 2, 3] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const [t, tServices] = await Promise.all([
        getTranslations({ locale, namespace: 'Airport' }),
        getTranslations({ locale, namespace: 'Services' }),
    ]);
    const title = tServices('airportMetaTitle');
    const description = t('subtitle');
    return {
        alternates: pageAlternates(locale, '/airport-transfer'),
        title,
        description,
        openGraph: pageOpenGraph(title, description),
    };
}

export default async function AirportTransferPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const [t, tServices] = await Promise.all([
        getTranslations({ locale, namespace: 'Airport' }),
        getTranslations({ locale, namespace: 'Services' }),
    ]);

    return (
        <>
            <main>
                <PageHeader
                    title={t('title')}
                    lead={t('subtitle')}
                    breadcrumbs={[
                        { href: '/', label: tServices('breadcrumbHome') },
                        { href: '/services', label: tServices('breadcrumbServices') },
                        { label: tServices('transfers.title') },
                    ]}
                />
                <section className={styles.section} aria-labelledby="airport-story" data-ds>
                    <div className={styles.inner}>
                        <div className={styles.split}>
                            <div className={styles.column}>
                                <h2 id="airport-story" className={styles.heading}>{t('peaceOfMind')}</h2>
                                <p className={styles.body}>{t('desc1')}</p>
                                <p className={styles.body}>{t('desc2')}</p>
                                <h3 className={styles.subheading}>{t('whyChoose')}</h3>
                                <ul className={styles.bullets}>
                                    {FEATURES.map((n) => (
                                        <li key={n}>
                                            <strong>{t(`feature${n}Title`)}</strong> {t(`feature${n}Desc`)}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.panel}>
                                <h2 className={styles.subheading}>{t('howItWorks')}</h2>
                                <ol className={styles.steps}>
                                    {STEPS.map((n) => (
                                        <li key={n} className={styles.step}>
                                            <span className={`${styles.stepNumber} num`} aria-hidden="true">{n}</span>
                                            <div>
                                                <h3 className={styles.stepTitle}>{t(`step${n}Title`)}</h3>
                                                <p className={styles.stepBody}>{t(`step${n}Desc`)}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                                <p className={styles.note}>
                                    <strong>{t('pricingNote')}</strong> {t('pricingNoteDesc')}
                                </p>
                                <Link href="/contact" className={styles.primary}>{t('requestTransfer')}</Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <FooterSection />
        </>
    );
}
