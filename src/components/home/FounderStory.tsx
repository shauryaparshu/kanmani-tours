import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Develop from '@/components/ui/Develop';
import styles from './FounderStory.module.css';

export default function FounderStory() {
    const t = useTranslations('Home');

    return (
        <section className={styles.section} data-ds aria-labelledby="founder-story-title">
            <div className={styles.inner}>
                <div className={styles.photos}>
                    <Develop className={styles.portrait}>
                        <Image
                            src="/assets/img/about-kanmani/founder-hero.jpg"
                            alt={t('storyPortraitAlt')}
                            fill
                            sizes="(min-width: 1024px) 34vw, 70vw"
                            className={styles.image}
                        />
                    </Develop>
                    <Develop className={styles.landscape}>
                        <Image
                            src="/assets/img/about/about-3.jpg"
                            alt={t('storyPhotoAlt')}
                            fill
                            sizes="(min-width: 1024px) 26vw, 60vw"
                            className={styles.image}
                        />
                    </Develop>
                </div>

                <div className={styles.text}>
                    <h2 id="founder-story-title" className={styles.title}>{t('storyTitle')}</h2>
                    <p className={styles.body}>{t('storyP1')}</p>
                    <p className={styles.body}>{t('storyP2')}</p>

                    <figure className={styles.quote}>
                        <blockquote>
                            <p>{t('storyQuote')}</p>
                        </blockquote>
                        <figcaption>
                            <span className={styles.name}>{t('founderName')}</span>
                            <span className={styles.roles}>{t('founderRoles')}</span>
                        </figcaption>
                    </figure>

                    <Link href="/about" className={styles.link}>{t('aboutLink')}</Link>
                </div>
            </div>
        </section>
    );
}
