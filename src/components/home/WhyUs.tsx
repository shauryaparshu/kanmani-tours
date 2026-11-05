import { useTranslations } from 'next-intl';
import styles from './WhyUs.module.css';

const ITEMS = [1, 2, 3, 4, 5, 6] as const;

export default function WhyUs() {
    const t = useTranslations('Home');

    return (
        <section className={styles.section} aria-labelledby="why-title">
            <div className={styles.inner}>
                <h2 id="why-title" className={styles.title}>{t('whyTitle')}</h2>
                <dl className={styles.list}>
                    {ITEMS.map((n) => (
                        <div key={n} className={styles.item}>
                            <dt className={styles.term}>{t(`why${n}Title`)}</dt>
                            <dd className={styles.text}>{t(`why${n}Body`)}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}
