import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import FooterSection from '@/components/layout/FooterSection';
import PageHeader from '@/components/layout/PageHeader';
import ContactForm from '@/components/forms/ContactForm';
import ContactDetails from '@/components/contact/ContactDetails';
import ArrowBox from '@/components/ui/ArrowBox';
import styles from '@/components/contact/EnquiryPage.module.css';
import { pageAlternates, pageOpenGraph } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Contact' });
    const title = t('metaTitle');
    const description = t('metaDescription');
    return {
        alternates: pageAlternates(locale, '/contact'),
        title,
        description,
        openGraph: pageOpenGraph(title, description),
    };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Contact' });

    return (
        <>
            <main>
                <PageHeader
                    title={t('title')}
                    lead={t('lead')}
                    breadcrumbs={[{ href: '/', label: t('breadcrumbHome') }, { label: t('breadcrumbContact') }]}
                />
                <section className={styles.section} aria-labelledby="contact-form-title" data-ds>
                    <div className={styles.inner}>
                        <div className={styles.panel}>
                            <h2 id="contact-form-title" className={styles.panelTitle}>{t('formTitle')}</h2>
                            <ContactForm />
                        </div>

                        <aside className={`${styles.aside} ${styles.sticky}`}>
                            <div className={styles.block}>
                                <h2 className={styles.blockTitle}>{t('directTitle')}</h2>
                                <ContactDetails />
                            </div>
                            <div className={styles.help}>
                                <h2 className={styles.helpTitle}>{t('faqTitle')}</h2>
                                <p className={styles.body}>{t('faqBody')}</p>
                                <Link href="/faq" className={styles.helpLink}>
                                    {t('faqLink')}
                                    <ArrowBox />
                                </Link>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>
            <FooterSection plan={false} />
        </>
    );
}
