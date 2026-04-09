import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllTours, getTourBySlug } from '@/lib/tours';
import { getLatestImage } from '@/lib/server-images';
import Footer from '@/components/layout/FooterSection';
import TourDetailClient from './TourDetailClient';

interface PageProps {
    params: Promise<{ locale: string; slug: string }>;
}

// Generate all static slugs at build time
export async function generateStaticParams() {
    const tours = await getAllTours();
    const locales = ['en', 'ja'];

    const params: { locale: string; slug: string }[] = [];
    locales.forEach(locale => {
        tours.forEach(tour => {
            params.push({ locale, slug: tour.slug });
        });
    });

    return params;
}

// Dynamic SEO metadata per tour
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const tour = await getTourBySlug(slug);
    if (!tour) return { title: 'Tour Not Found — Srikan Tours' };

    const heroImage = tour.coverImage;

    return {
        title: `${tour.title} — Srikan Tours`,
        description: tour.shortDescription,
        openGraph: {
            title: tour.title,
            description: tour.shortDescription,
            images: heroImage ? [{ url: heroImage }] : [],
        },
    };
}

export default async function TourDetailPage({ params }: PageProps) {
    const { locale, slug } = await params;
    const tour = await getTourBySlug(slug, locale);
    
    console.log("HERO PANEL DATA CHECK:", JSON.stringify({
      title: tour?.title,
      category: tour?.category,
      startDate: tour?.startDate,
      endDate: tour?.endDate,
      dateDisplay: tour?.dateDisplay,
      isComingSoon: tour?.isComingSoon,
      shortDescription: tour?.shortDescription,
      location: tour?.location,
      seatsLeft: tour?.seatsLeft,
    }, null, 2))

    if (!tour) notFound();

    // Other upcoming tours (exclude current)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const allTours = await getAllTours(locale);
    const otherTours = allTours
        .filter(t => {
            const start = new Date(t.startDate);
            start.setHours(0, 0, 0, 0);
            return t.slug !== slug && start > today;
        })
        .slice(0, 3);

    return (
        <>
            <main style={{ paddingBottom: '80px' }}>
                <TourDetailClient tour={tour} otherTours={otherTours} />
            </main>
            <Footer />
        </>
    );
}
