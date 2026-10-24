import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Develop from '@/components/ui/Develop';
import styles from './FounderIntro.module.css';

const FACTS = [
    ['factYears', 'factYearsValue'],
    ['factCountries', 'factCountriesValue'],
    ['factPhd', 'factPhdValue'],
    ['factLanguages', 'factLanguagesValue'],
] as const;

export default function FounderIntro() {
    const t = useTranslations('About');

    return (
        <header className={styles.intro} data-ds>
            <div className={styles.inner}>
                <Develop className={styles.portrait}>
                    <Image
                        src="/assets/img/about-kanmani/founder-hero.jpg"
                        alt={t('portraitAlt')}
                        fill
                        sizes="(min-width: 900px) 40vw, 100vw"
                        preload
                        className={styles.image}
                    />
                </Develop>

                <div className={styles.text}>
                    <h1 className={styles.name}>{t('name')}</h1>
                    <p className={styles.roles}>{t('roles')}</p>

                    <blockquote className={styles.quote}>
                        <p>{t('quote')}</p>
                    </blockquote>

                    <section aria-labelledby="founder-facts-title">
                        <h2 id="founder-facts-title" className={styles.factsTitle}>{t('factsTitle')}</h2>
                        <dl className={styles.facts}>
                            {FACTS.map(([label, value]) => (
                                <div key={label} className={styles.fact}>
                                    <dt>{t(label)}</dt>
                                    <dd className="num">{t(value)}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                </div>
            </div>
        </header>
    );
}
