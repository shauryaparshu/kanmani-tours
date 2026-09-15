import { Metadata } from 'next';

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    const { slug } = await params;
    const siteUrl = 'https://kanmanitours.com';
    return {
        alternates: {
            languages: {
                'ja': `${siteUrl}/ja/gallery/${slug}`,
                'en': `${siteUrl}/en/gallery/${slug}`,
                'x-default': `${siteUrl}/ja/gallery/${slug}`,
            }
        }
    };
}

export default function GalleryDetailLayout({ children }: LayoutProps) {
    return <>{children}</>;
}
