import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getToursByDestination } from '@/lib/tours';
import { getAllCategories } from '@/lib/categories';
import { getAllCountries } from '@/lib/countries';
import Footer from '@/components/layout/FooterSection';
import PageHeader from '@/components/layout/PageHeader';
import TourList from '@/components/tours/TourList';
import ToursComingSoon from '@/components/tours/ToursComingSoon';
import { pageAlternates, pageOpenGraph } from '@/lib/site';

// Static with incremental regeneration: Sanity edits appear within 60 seconds.
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const title = 'Japan Tours — Kanmani Tours';
    const description = 'Browse all upcoming and past Japan tours by Kanmani Tours. Educational group tours, school journeys, and cultural experiences across Japan.';
    return {
        alternates: pageAlternates(locale, '/japan/tours', { englishOnly: true }),
        title,
        description,
        openGraph: pageOpenGraph(title, description),
    };
}

export default async function JapanToursPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    // Japan tours must never render in Japanese under any circumstance
    if (locale === 'ja') {
        notFound();
    }

    const [tours, categories, countries, t, tDest] = await Promise.all([
        getToursByDestination('japan', locale),
        getAllCategories(locale),
        getAllCountries(locale),
        getTranslations('Tours'),
        getTranslations('DestinationChoice'),
    ]);

    return (
        <>
            <main>
                <PageHeader
                    title={tDest('japanTitle')}
                    lead={t('japanLead')}
                    breadcrumbs={[{ href: '/', label: t('breadcrumbHome') }, { label: tDest('japanTitle') }]}
                />
                {tours.length === 0 ? (
                    <ToursComingSoon />
                ) : (
                    <Suspense fallback={null}>
                        <TourList tours={tours} categories={categories} countries={countries} />
                    </Suspense>
                )}
            </main>
            <Footer />
        </>
    );
}
