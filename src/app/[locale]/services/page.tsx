import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import FooterSection from '@/components/layout/FooterSection';
import PageHeader from '@/components/layout/PageHeader';
import ArrowBox from '@/components/ui/ArrowBox';
import styles from '@/components/services/ServicePage.module.css';
import { pageAlternates, pageOpenGraph } from '@/lib/site';

// Hidden from the nav while SHOW_SERVICES_NAV is false; the pages stay reachable by URL.
const SERVICES = [
    { id: 'transfers', number: '01', href: '/airport-transfer' },
    { id: 'moving', number: '02', href: '/services/moving' },
] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Services' });
    const title = t('metaTitle');
    const description = t('metaDescription');
    return {
        alternates: pageAlternates(locale, '/services'),
        title,
        description,
        openGraph: pageOpenGraph(title, description),
    };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Services' });

    return (
        <>
            <main>
                <PageHeader
                    title={t('title')}
                    lead={t('lead')}
                    breadcrumbs={[{ href: '/', label: t('breadcrumbHome') }, { label: t('breadcrumbServices') }]}
                />
                <section className={styles.section} data-ds>
                    <div className={styles.inner}>
                        <ol className={styles.services}>
                            {SERVICES.map((service) => (
                                <li key={service.id} id={service.id} className={styles.service}>
                                    <div className={styles.serviceHead}>
                                        <p className={`${styles.number} num`} aria-hidden="true">{service.number}</p>
                                        <h2 className={styles.heading}>{t(`${service.id}.title`)}</h2>
                                    </div>
                                    <div className={styles.serviceBody}>
                                        <p className={styles.body}>{t(`${service.id}.body`)}</p>
                                        <ul className={styles.bullets}>
                                            {(t.raw(`${service.id}.items`) as string[]).map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                        <Link href={service.href} className={styles.textLink}>
                                            {t('moreDetails')}
                                            <span className="sr-only">: {t(`${service.id}.title`)}</span>
                                            <ArrowBox />
                                        </Link>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>
            </main>
            <FooterSection />
        </>
    );
}
