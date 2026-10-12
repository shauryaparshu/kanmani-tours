import { MetadataRoute } from 'next';
import { getAllTours } from '@/lib/tours';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = 'https://kanmanitours.com';

    const tours = await getAllTours();

    const staticPaths = [
        '',
        '/about',
        '/about-kanmani',
        '/airport-transfer',
        '/contact',
        '/faq',
        '/gallery',
        '/services',
        '/services/moving',
        '/india/tours',
        '/japan/tours',
    ];

    const sitemapData: MetadataRoute.Sitemap = [];

    staticPaths.forEach((path) => {
        if (path === '/japan/tours') {
            sitemapData.push({
                url: `${siteUrl}/en${path}`,
                lastModified: new Date(),
                alternates: {
                    languages: {
                        en: `${siteUrl}/en${path}`,
                    },
                },
            });
        } else {
            // Add JA version
            sitemapData.push({
                url: `${siteUrl}/ja${path}`,
                lastModified: new Date(),
                alternates: {
                    languages: {
                        ja: `${siteUrl}/ja${path}`,
                        en: `${siteUrl}/en${path}`,
                    },
                },
            });
            // Add EN version
            sitemapData.push({
                url: `${siteUrl}/en${path}`,
                lastModified: new Date(),
                alternates: {
                    languages: {
                        ja: `${siteUrl}/ja${path}`,
                        en: `${siteUrl}/en${path}`,
                    },
                },
            });
        }
    });

    tours.forEach((tour) => {
        if (tour.destination === 'japan') {
            sitemapData.push({
                url: `${siteUrl}/en/japan/tours/${tour.slug}`,
                lastModified: new Date(),
                alternates: {
                    languages: {
                        en: `${siteUrl}/en/japan/tours/${tour.slug}`,
                    },
                },
            });
        } else {
            sitemapData.push({
                url: `${siteUrl}/ja/india/tours/${tour.slug}`,
                lastModified: new Date(),
                alternates: {
                    languages: {
                        ja: `${siteUrl}/ja/india/tours/${tour.slug}`,
                        en: `${siteUrl}/en/india/tours/${tour.slug}`,
                    },
                },
            });
            sitemapData.push({
                url: `${siteUrl}/en/india/tours/${tour.slug}`,
                lastModified: new Date(),
                alternates: {
                    languages: {
                        ja: `${siteUrl}/ja/india/tours/${tour.slug}`,
                        en: `${siteUrl}/en/india/tours/${tour.slug}`,
                    },
                },
            });
        }
    });

    return sitemapData;
}
