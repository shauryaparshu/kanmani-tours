import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ClipboardList, Flower2, UserRoundCheck, UsersRound } from 'lucide-react';
import styles from './TrustBand.module.css';

const EXPERIENCE = [
    { key: 'experienceGuiding', Icon: UserRoundCheck },
    { key: 'experienceImmersion', Icon: Flower2 },
    { key: 'experienceGroups', Icon: UsersRound },
    { key: 'experienceItineraries', Icon: ClipboardList },
] as const;

// The band under the hero: Dr. Kanmani's portrait, the story in brief,
// and what every tour includes.
export default function TrustBand() {
    const t = useTranslations('Home');

    return (
        <section className={styles.band} aria-labelledby="trust-title">
            <div className={styles.inner}>
                <figure className={styles.founder}>
                    <div className={styles.frame}>
                        <div className={styles.portrait}>
                            <Image
                                src="/assets/img/about/founder.jpg"
                                alt={t('storyPortraitAlt')}
                                fill
                                sizes="(min-width: 1024px) 200px, 180px"
                                className={styles.image}
                            />
                        </div>
                    </div>
                    <figcaption className={styles.caption}>
                        <span className={styles.name}>{t('founderName')}</span>
                        <span className={styles.role}>{t('founderRole')}</span>
                    </figcaption>
                </figure>

                <div className={styles.story}>
                    <h2 id="trust-title" className={styles.title}>{t('storyTitle')}</h2>
                    <p className={styles.body}>{t('storyP1')}</p>
                </div>

                <div className={styles.experience}>
                    <h3 className={styles.experienceTitle}>{t('experienceTitle')}</h3>
                    <ul className={styles.list}>
                        {EXPERIENCE.map(({ key, Icon }) => (
                            <li key={key} className={styles.item}>
                                <Icon aria-hidden="true" className={styles.icon} />
                                {t(key)}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
