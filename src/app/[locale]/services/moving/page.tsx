import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import FooterSection from '@/components/layout/FooterSection';
import PageHeader from '@/components/layout/PageHeader';
import styles from '@/components/services/ServicePage.module.css';
import { pageAlternates, pageOpenGraph } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Services' });
    const title = t('movingPage.metaTitle');
    const description = t('movingPage.lead');
    return {
        alternates: pageAlternates(locale, '/services/moving'),
        title,
        description,
        openGraph: pageOpenGraph(title, description),
    };
}

export default async function MovingToIndiaPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'Services' });

    return (
        <>
            <main>
                <PageHeader
                    title={t('movingPage.title')}
                    lead={t('movingPage.lead')}
                    breadcrumbs={[
                        { href: '/', label: t('breadcrumbHome') },
                        { href: '/services', label: t('breadcrumbServices') },
                        { label: t('movingPage.title') },
                    ]}
                />
                <section className={styles.section} aria-labelledby="moving-includes" data-ds>
                    <div className={styles.inner}>
                        <div className={styles.column}>
                            <h2 id="moving-includes" className={styles.heading}>{t('movingPage.includesTitle')}</h2>
                            <ul className={styles.bullets}>
                                {(t.raw('moving.items') as string[]).map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                            <Link href="/contact" className={styles.primary}>{t('movingPage.cta')}</Link>
                        </div>
                    </div>
                </section>
            </main>
            <FooterSection />
        </>
    );
}
