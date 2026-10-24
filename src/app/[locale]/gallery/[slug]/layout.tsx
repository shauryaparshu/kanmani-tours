import { Metadata } from 'next';
import { pageAlternates } from '@/lib/site';

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    const { locale, slug } = await params;
    return {
        alternates: pageAlternates(locale, `/gallery/${slug}`),
    };
}

export default function GalleryDetailLayout({ children }: LayoutProps) {
    return <>{children}</>;
}
