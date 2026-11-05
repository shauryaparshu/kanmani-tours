import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
    ArrowRight, BriefcaseBusiness, Earth, GraduationCap, HandHeart, HeartHandshake, Mic, UsersRound, type LucideIcon,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import styles from './FounderStory.module.css';

const CARDS: { key: 'born' | 'trust' | 'intimate'; Icon: LucideIcon }[] = [
    { key: 'born', Icon: Earth },
    { key: 'trust', Icon: HandHeart },
    { key: 'intimate', Icon: UsersRound },
];

const ROLES: { key: 'phd' | 'entrepreneur' | 'speaker' | 'humanitarian'; Icon: LucideIcon }[] = [
    { key: 'phd', Icon: GraduationCap },
    { key: 'entrepreneur', Icon: BriefcaseBusiness },
    { key: 'speaker', Icon: Mic },
    { key: 'humanitarian', Icon: HeartHandshake },
];

/** Thin-line suspension bridge between the portrait and the cards. */
function Bridge() {
    const deck = 168;
    // Main cables sag from the tower top to each end of the deck.
    const cable = (t: number, side: -1 | 1) => {
        const x0 = 100, y0 = 18, x2 = 100 + side * 100, y2 = deck - 6, x1 = 100 + side * 34, y1 = deck - 4;
        return [
            (1 - t) ** 2 * x0 + 2 * (1 - t) * t * x1 + t ** 2 * x2,
            (1 - t) ** 2 * y0 + 2 * (1 - t) * t * y1 + t ** 2 * y2,
        ];
    };
    const hangers = [];
    for (const side of [-1, 1] as const) {
        for (let i = 1; i <= 6; i++) {
            const [x, y] = cable(i / 7, side);
            hangers.push(<line key={`${side}${i}`} x1={x} y1={y} x2={x} y2={deck} />);
        }
    }
    return (
        <svg className={styles.bridge} viewBox="0 0 200 320" aria-hidden="true" focusable="false">
            <line x1="100" y1="6" x2="100" y2="250" />
            <line x1="96" y1="18" x2="104" y2="18" />
            <path d={`M100,18 Q134,${deck - 4} 200,${deck - 6}`} />
            <path d={`M100,18 Q66,${deck - 4} 0,${deck - 6}`} />
            {hangers}
            <line x1="0" y1={deck} x2="200" y2={deck} />
            <line x1="0" y1={deck + 8} x2="200" y2={deck + 8} />
            <line x1="200" y1={deck + 14} x2="0" y2="318" />
            <line x1="200" y1={deck + 26} x2="60" y2="318" />
        </svg>
    );
}

export default function FounderStory() {
    const t = useTranslations('Home');

    return (
        <section className={styles.section} aria-labelledby="founder-story-title">
            <div className={styles.inner}>
                <div className={styles.media}>
                    <div className={styles.frame}>
                        <span className={`${styles.accent} ${styles.accentTop}`} aria-hidden="true" />
                        <span className={`${styles.accent} ${styles.accentBottom}`} aria-hidden="true" />
                        <div className={styles.portrait}>
                            <Image
                                src="/assets/img/about-kanmani/founder-hero.jpg"
                                alt={t('storyPortraitAlt')}
                                fill
                                sizes="(min-width: 1024px) 30vw, 85vw"
                                className={styles.image}
                            />
                        </div>
                    </div>
                    <Bridge />
                </div>

                <div className={styles.content}>
                    <p className={styles.eyebrow}>{t('storyEyebrow')}</p>
                    <h2 id="founder-story-title" className={styles.title}>{t('storyTitle')}</h2>

                    <ol className={styles.cards}>
                        {CARDS.map(({ key, Icon }, i) => (
                            <li key={key} className={styles.card}>
                                <span className={`${styles.numeral} num`} aria-hidden="true">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <span className={styles.medallion} aria-hidden="true">
                                    <Icon />
                                </span>
                                <h3 className={styles.cardTitle}>{t(`storyCards.${key}.title`)}</h3>
                                <span className={styles.cardRule} aria-hidden="true" />
                                <p className={styles.cardBody}>{t(`storyCards.${key}.body`)}</p>
                            </li>
                        ))}
                    </ol>

                    <figure className={styles.quote}>
                        <span className={styles.glyph} aria-hidden="true">&ldquo;</span>
                        <blockquote className={styles.quoteText}>
                            <p>{t('storyQuote')}</p>
                        </blockquote>
                        <figcaption className={styles.attribution}>
                            <span className={styles.attributionRule} aria-hidden="true" />
                            <span className={styles.attributionName}>{t('founderName')}</span>
                            <span className={styles.attributionRole}>{t('storyQuoteRole')}</span>
                        </figcaption>
                    </figure>

                    <ul className={styles.roles} aria-label={t('storyRolesLabel')}>
                        {ROLES.map(({ key, Icon }) => (
                            <li key={key} className={styles.role}>
                                <Icon aria-hidden="true" />
                                {t(`storyRoles.${key}`)}
                            </li>
                        ))}
                    </ul>

                    <Link href="/about" className={styles.cta}>
                        {t('storyCta')}
                        <ArrowRight aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
