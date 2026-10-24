import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getToursByDestination } from '@/lib/tours';
import { getAllCategories } from '@/lib/categories';
import { localizeCategories } from '@/components/tours/categoryLabels';
import { getAllCountries } from '@/lib/countries';
import Footer from '@/components/layout/FooterSection';
import PageHeader from '@/components/layout/PageHeader';
import TourList from '@/components/tours/TourList';
import { pageAlternates, pageOpenGraph } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const title = 'India Tours — Kanmani Tours';
    const description = 'Browse all upcoming and past India tours by Kanmani Tours. Celebrity-related experiences, culinary journeys, and cultural heritage trips across India.';
    return {
        alternates: pageAlternates(locale, '/india/tours'),
        title,
        description,
        openGraph: pageOpenGraph(title, description),
    };
}

export default async function IndiaToursPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const [tours, categories, countries, t, tDest] = await Promise.all([
        getToursByDestination('india', locale),
        getAllCategories(locale),
        getAllCountries(locale),
        getTranslations('Tours'),
        getTranslations('DestinationChoice'),
    ]);

    return (
        <>
            <main>
                <PageHeader
                    title={tDest('indiaTitle')}
                    lead={t('heroSubtitle')}
                    breadcrumbs={[{ href: '/', label: t('breadcrumbHome') }, { label: tDest('indiaTitle') }]}
                />
                <Suspense fallback={null}>
                    <TourList tours={tours} categories={localizeCategories(categories, locale, t)} countries={countries} />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}
