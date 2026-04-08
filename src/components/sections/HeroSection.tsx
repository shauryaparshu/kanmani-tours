'use client';

import { useState, useEffect, useRef } from 'react';
import HeroSlideshow from '@/components/sections/HeroSlideshow';
import { useTranslations } from 'next-intl';

import { Celebrity } from '@/lib/celebrities';

interface HeroSectionProps {
    heroImages: string[];
    pollImages?: string[];
    initialCelebrities?: Celebrity[];
}

/**
 * The actors list. For image matching, `keywords` lists substrings
 * checked against each filename in the poll folder (case-insensitive).
 * The first keyword that matches any file wins.
 */
const ACTORS = [
    { id: 'vijay_thalapathi', keywords: ['vijay-thalapathy', 'thalapathy'] },
    { id: 'sethupathi', keywords: ['sethupathi', 'vijay-sethupathi'] },
    { id: 'ram', keywords: ['ram-charan', 'ramcharan'] },
    { id: 'ntr', keywords: ['ntr', 'jr-ntr'] },
    { id: 'allu', keywords: ['allu-arjun', 'allu'] },
    { id: 'suryah', keywords: ['suryah', 'suriya', 'sj-suriya'] },
];

export default function HeroSection({ heroImages, pollImages, initialCelebrities }: HeroSectionProps) {
    const t = useTranslations('Home');

    // No default selection (initialize as null)
    const [selectedActor, setSelectedActor] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const voteCardRef = useRef<HTMLDivElement>(null);

    // Form & Selection state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [selectionError, setSelectionError] = useState(false);

    // Handle clicking outside the poll to cancel selection
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (voteCardRef.current && !voteCardRef.current.contains(event.target as Node)) {
                // Keep selected actor even if click outside, or reset if desired
                // For now, let's keep it selected so user can click VOTE button
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    /**
     * Scans pollImages for a file containing any of the keywords.
     * Extracts only the filename from the full path before comparing.
     * Falls back to a coloured letter-avatar if nothing found.
     */
    const findAvatar = (keywords: string[]): string => {
        for (const kw of keywords) {
            const match = pollImages?.find(imgPath => {
                const filename = imgPath.split('/').pop()!.toLowerCase();
                return filename.includes(kw.toLowerCase());
            });
            if (match) return match;
        }
        // Fallback: letter avatar from ui-avatars
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(keywords[0])}&background=f97316&color=fff&size=64`;
    };

    const handleVoteClick = () => {
        if (!selectedActor) {
            setSelectionError(true);
            // Auto-hide error after 3 seconds
            setTimeout(() => setSelectionError(false), 3000);
            return;
        }
        setSelectionError(false);
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate submission
        setIsSubmitted(true);

        // Close modal after 2 seconds
        setTimeout(() => {
            setIsModalOpen(false);
            setIsSubmitted(false);
            setSelectedActor(null);
            setFormData({ name: '', email: '', phone: '' });
        }, 2000);
    };

    return (
        <section id="home" className="hero animate" style={{
            animationDelay: '0.2s',
            width: '100vw',
            marginLeft: '0',
            marginRight: '0',
            padding: '0',
            paddingTop: '72px',
            marginTop: '0',
            top: '0',
            overflow: 'hidden',
            maxWidth: 'none',
            borderRadius: '0'
        }}>
            <div className="hero-content" style={{ width: '100%', height: '100vh', position: 'relative', overflowX: 'hidden', maxWidth: '100vw', borderRadius: '0' }}>
                {/* Slideshow */}
                <HeroSlideshow images={heroImages} altPrefix="Srikan Tours" />

                {/* Vote card with ref for click-outside detection */}
                {pollImages && pollImages.length > 0 && (
                    <div className="vote-card" ref={voteCardRef}>
                        <div className="vote-header">
                            <h4 className="vote-title">
                                ⭐ {t('fanVoteTitle')}
                            </h4>
                            <h3 className="vote-question">{t('fanVoteQuestion')}</h3>
                        </div>

                        <div className="vote-list">
                            {(initialCelebrities && initialCelebrities.length > 0 ? initialCelebrities.map(c => ({
                                id: c.id,
                                name: c.name,
                                photo: c.photo || findAvatar([c.name])
                            })) : ACTORS.map(a => ({
                                id: a.id,
                                name: t(`actors.${a.id}`),
                                photo: findAvatar(a.keywords)
                            }))).map(actor => {
                                const actorName = actor.name;
                                return (
                                    <div
                                        key={actor.id}
                                        className={`vote-item ${selectedActor === actorName ? 'active' : ''}`}
                                        onClick={() => setSelectedActor(actorName)}
                                    >
                                        <div className="vote-info">
                                            <img
                                                src={actor.photo}
                                                alt={actor.name}
                                                width={48}
                                                height={48}
                                                className="vote-avatar"
                                                style={{ objectFit: 'cover', borderRadius: '50%', flexShrink: 0 }}
                                            />
                                            <span className="vote-name">{actorName}</span>
                                        </div>
                                        <div className="custom-radio"></div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="vote-footer">
                            {selectionError && (
                                <div className="selection-error">
                                    {t('pleaseChoose')}
                                </div>
                            )}
                            <button
                                className="btn-vote"
                                onClick={handleVoteClick}
                            >
                                {t('voteButton')}
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Text Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: '0',
                    background: 'linear-gradient(to top, rgba(10,8,7,0.88) 0%, rgba(10,8,7,0.35) 55%, rgba(10,8,7,0.05) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingBottom: '90px',
                    zIndex: 10,
                    textAlign: 'center'
                }}>

                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 'clamp(52px, 7vw, 96px)',
                        fontWeight: '500',
                        color: '#F5F1EB',
                        letterSpacing: '0.06em',
                        textAlign: 'center',
                        lineHeight: '1.15',
                        marginBottom: '36px',
                        whiteSpace: 'nowrap',
                        textShadow: '0 2px 12px rgba(0,0,0,0.4)'
                    }}>
                        Discover the Soul of India
                    </h1>
                    <a href="/tours" style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '13px',
                        fontWeight: '600',
                        letterSpacing: '0.3em',
                        color: '#1C1917',
                        backgroundColor: '#C9933A',
                        padding: '18px 52px',
                        textDecoration: 'none',
                        textTransform: 'uppercase',
                        display: 'inline-block',
                        cursor: 'pointer',
                        marginTop: '8px',
                        border: 'none',
                        WebkitTextFillColor: '#1C1917',
                        textShadow: 'none',
                        opacity: '1'
                    }}>
                        Explore Tours
                    </a>
                </div>
            </div>

            {/* Vote Modal */}
            {pollImages && pollImages.length > 0 && (
                <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`}>
                    <div className="modal-content">
                        {!isSubmitted ? (
                            <>
                                <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
                                <h2 className="modal-title">{t('finalizeVote')}</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label className="form-label">{t('fullName')}</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder={t('enterName')}
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">{t('emailAddress')}</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            placeholder={t('enterEmail')}
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">{t('phoneNumber')}</label>
                                        <div className="phone-input-wrap">
                                            <div className="phone-prefix">
                                                <div className="japan-flag"></div>
                                                <span>+81</span>
                                            </div>
                                            <input
                                                type="tel"
                                                className="form-input form-input-phone"
                                                placeholder="000000000"
                                                required
                                                pattern="[0-9]{9,11}"
                                                title="Please enter a valid 9-11 digit Japanese phone number"
                                                maxLength={11}
                                                value={formData.phone}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, ''); // Digits only
                                                    setFormData({ ...formData, phone: val });
                                                }}
                                            />
                                        </div>
                                        <small style={{ display: 'block', marginTop: '4px', color: '#94a3b8', fontSize: '0.7rem' }}>
                                            Enter 9-11 digits (e.g. 9012345678)
                                        </small>
                                    </div>
                                    <button type="submit" className="btn-vote" style={{ marginTop: '10px' }}>
                                        {t('submitVote')}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="submit-success">
                                <div className="success-icon">✓</div>
                                <h2 className="modal-title" style={{ marginBottom: '8px' }}>{t('voteSubmitted')}</h2>
                                <p style={{ color: '#64748b' }}>{t('thankYouVote')} <strong>{selectedActor}</strong>.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
