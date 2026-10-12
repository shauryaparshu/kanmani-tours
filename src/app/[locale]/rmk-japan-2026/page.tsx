import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import FooterSection from '@/components/layout/FooterSection';
import { TOUR_GROUP } from '@/lib/tourGroup';
import DriveGallery from './DriveGallery';

export const metadata: Metadata = {
    title: `Japan Tour ${TOUR_GROUP.dateLabel} | ${TOUR_GROUP.schoolName}`,
    description: `Private guest photo gallery archive for ${TOUR_GROUP.schoolName}.`,
    robots: {
        index: false,
        follow: false,
    },
};

export default async function MemoriesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // Memories gallery is English-only
    if (locale !== 'en') {
        notFound();
    }

    // Password-gated auth check via httpOnly cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('memories_access')?.value;
    const expectedToken = process.env.MEMORIES_SESSION_TOKEN;

    if (!expectedToken || !token || token !== expectedToken) {
        redirect(`/en/${TOUR_GROUP.slug}/login`);
    }

    const driveFolderId = process.env.MEMORIES_DRIVE_FOLDER_ID?.trim();
    const googleApiKey = process.env.GOOGLE_DRIVE_API_KEY?.trim();

    return (
        <>
            <main style={{ backgroundColor: '#1C1917', minHeight: '100vh', color: '#F5F1EB' }}>
                {driveFolderId ? (
                    <div>
                        {/* Header Section */}
                        <section style={{
                            padding: '48px 24px 28px',
                            maxWidth: '1400px',
                            margin: '0 auto',
                            borderBottom: '1px solid rgba(201, 147, 58, 0.2)',
                            marginBottom: '24px',
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                flexWrap: 'wrap',
                                gap: '20px',
                            }}>
                                <div style={{ maxWidth: '820px' }}>
                                    <span style={{
                                        fontFamily: "'Jost', Arial, sans-serif",
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        letterSpacing: '0.28em',
                                        textTransform: 'uppercase',
                                        color: '#C9933A',
                                        display: 'block',
                                        marginBottom: '12px',
                                    }}>
                                        {TOUR_GROUP.schoolName}
                                    </span>
                                    <h1 style={{
                                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                                        fontSize: 'clamp(32px, 4.5vw, 48px)',
                                        fontWeight: '500',
                                        color: '#F5F1EB',
                                        margin: '0 0 10px',
                                        lineHeight: '1.2',
                                    }}>
                                        Japan Tour Memories
                                    </h1>
                                    <p style={{
                                        fontFamily: "'Jost', Arial, sans-serif",
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        letterSpacing: '0.12em',
                                        textTransform: 'uppercase',
                                        color: '#C9933A',
                                        margin: '0 0 14px',
                                    }}>
                                        {TOUR_GROUP.tourName} · {TOUR_GROUP.dateLabel}
                                    </p>
                                    <div style={{
                                        width: '48px',
                                        height: '1px',
                                        backgroundColor: '#C9933A',
                                        marginBottom: '16px',
                                    }} />
                                    <p style={{
                                        fontFamily: "'Jost', Arial, sans-serif",
                                        fontSize: '15px',
                                        fontWeight: '300',
                                        color: '#9A948F',
                                        lineHeight: '1.6',
                                        margin: 0,
                                    }}>
                                        Tap any photo to open it, and use the download icon in the viewer to save it. To save a whole day, open that day&apos;s folder in Google Drive and choose Download.
                                    </p>
                                </div>

                                <div style={{ paddingTop: '8px' }}>
                                    <a
                                        href={`https://drive.google.com/drive/folders/${driveFolderId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            backgroundColor: '#C9933A',
                                            color: '#1C1917',
                                            padding: '12px 24px',
                                            borderRadius: '4px',
                                            fontFamily: "'Jost', Arial, sans-serif",
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            letterSpacing: '0.2em',
                                            textTransform: 'uppercase',
                                            textDecoration: 'none',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 4px 15px rgba(201, 147, 58, 0.25)',
                                        }}
                                    >
                                        <span>Open in Google Drive</span>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                            <polyline points="15 3 21 3 21 9" />
                                            <line x1="10" y1="14" x2="21" y2="3" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </section>

                        {/* Gallery Section: In-page DriveGallery when API key is present, otherwise fallback iframe */}
                        {googleApiKey ? (
                            <DriveGallery rootFolderId={driveFolderId} />
                        ) : (
                            <section style={{
                                width: '100%',
                                maxWidth: '1400px',
                                margin: '0 auto',
                                padding: '0 24px 60px',
                            }}>
                                <iframe
                                    src={`https://drive.google.com/embeddedfolderview?id=${driveFolderId}#grid`}
                                    title="Tour Memories Google Drive Gallery"
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                    style={{
                                        width: '100%',
                                        height: 'calc(100vh - 220px)',
                                        minHeight: '600px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        backgroundColor: '#FFFFFF',
                                        display: 'block',
                                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                                    }}
                                />
                            </section>
                        )}

                        {/* Property & Rights Notice */}
                        <div style={{
                            maxWidth: '1400px',
                            margin: '0 auto',
                            padding: '16px 24px 48px',
                            borderTop: '1px solid rgba(201, 147, 58, 0.15)',
                            textAlign: 'center',
                        }}>
                            <p style={{
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '12px',
                                color: '#9A948F',
                                lineHeight: '1.6',
                                margin: 0,
                            }}>
                                Photos and videos are the property of kanmanitours.com (Infirise Private Limited), shared only with parents and the school team of {TOUR_GROUP.schoolName}.
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Empty / Preparation State (no iframe rendered) */
                    <section style={{
                        padding: '100px 24px',
                        maxWidth: '1200px',
                        margin: '0 auto',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            maxWidth: '600px',
                            margin: '0 auto',
                            backgroundColor: '#23201D',
                            borderRadius: '8px',
                            border: '1px solid rgba(201, 147, 58, 0.25)',
                            padding: '64px 36px',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
                        }}>
                            <span style={{
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '11px',
                                fontWeight: '600',
                                letterSpacing: '0.28em',
                                textTransform: 'uppercase',
                                color: '#C9933A',
                                display: 'block',
                                marginBottom: '16px',
                            }}>
                                {TOUR_GROUP.schoolName}
                            </span>
                            <h1 style={{
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                fontSize: 'clamp(32px, 5vw, 42px)',
                                fontWeight: '500',
                                color: '#F5F1EB',
                                margin: '0 0 10px',
                                lineHeight: '1.2',
                            }}>
                                Japan Tour Memories
                            </h1>
                            <p style={{
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '13px',
                                fontWeight: '500',
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: '#C9933A',
                                margin: '0 0 16px',
                            }}>
                                {TOUR_GROUP.tourName} · {TOUR_GROUP.dateLabel}
                            </p>
                            <div style={{
                                width: '40px',
                                height: '1px',
                                backgroundColor: '#C9933A',
                                margin: '0 auto 24px',
                            }} />
                            <p style={{
                                fontFamily: "'Jost', Arial, sans-serif",
                                fontSize: '16px',
                                fontWeight: '300',
                                color: '#9A948F',
                                lineHeight: '1.7',
                                margin: 0,
                            }}>
                                The gallery is being prepared. Please check back soon.
                            </p>
                        </div>
                    </section>
                )}
            </main>
            <FooterSection />
        </>
    );
}
