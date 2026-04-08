import ImageGrid from '@/components/ui/ImageGrid';

interface PastMomentsProps {
    galleryImages: string[];
}

export default function PastMoments({ galleryImages }: PastMomentsProps) {
    return (
        <section className="container animate" style={{ animationDelay: '0.6s' }}>
            <div className="center-title">
                <h2 className="section-title">Past Tour Moments</h2>
            </div>
            <ImageGrid images={galleryImages} altPrefix="Past tour moment" columns={3} />
        </section>
    );
}
