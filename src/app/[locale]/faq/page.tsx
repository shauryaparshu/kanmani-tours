import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { client } from '@/sanity/lib/client';
import { FAQS_QUERY } from '@/sanity/lib/queries';
import FooterSection from '@/components/layout/FooterSection';
import PageHeader from '@/components/layout/PageHeader';
import FaqList, { type FaqItem } from '@/components/faq/FaqList';
import { pageAlternates, pageOpenGraph } from '@/lib/site';

// Static with incremental regeneration: Sanity edits appear within 60 seconds.
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'FAQ' });
    const title = t('metaTitle');
    const description = t('metaDescription');
    return {
        alternates: pageAlternates(locale, '/faq'),
        title,
        description,
        openGraph: pageOpenGraph(title, description),
    };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const [faqs, t] = await Promise.all([
        client.fetch<FaqItem[]>(FAQS_QUERY, {}, { next: { revalidate: 60 } }),
        getTranslations({ locale, namespace: 'FAQ' }),
    ]);

    return (
        <>
            <main>
                <PageHeader
                    title={t('title')}
                    lead={t('subtitle')}
                    breadcrumbs={[{ href: '/', label: t('home') }, { label: t('title') }]}
                />
                <FaqList faqs={faqs ?? []} />
            </main>
            <FooterSection />
        </>
    );
}
