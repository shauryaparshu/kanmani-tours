import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { SHOW_JAPAN_DESTINATION } from '@/lib/featureFlags';
import Develop from '@/components/ui/Develop';
import ArrowBox from '@/components/ui/ArrowBox';
import styles from './Destinations.module.css';

// Landscape photos cropped into near-square tiles need more pixels than the
// tile's width, hence the generous `sizes` below.
export default function Destinations() {
    const t = useTranslations('DestinationChoice');
    const tHome = useTranslations('Home');
    const locale = useLocale();

    const tiles = [
        { key: 'india', href: '/india/tours', image: '/assets/img/home/hero/IMG_0616(1)(1).jpg', title: t('indiaTitle'), desc: t('indiaDesc'), cta: t('indiaCta') },
        ...(SHOW_JAPAN_DESTINATION
            ? [{ key: 'japan', href: '/japan/tours', image: '/assets/img/about/about-1.jpg', title: t('japanTitle'), desc: t('japanDesc'), cta: t('japanCta') }]
            : []),
    ];
    // Each audience sees the journey toward the other country first.
    if (locale === 'en') tiles.reverse();

    return (
        <section className={styles.section} aria-label={tHome('heroPaths')}>
            <div className={styles.grid} data-count={tiles.length}>
                {tiles.map((tile) => (
                    <Link key={tile.key} href={tile.href} className={styles.tile}>
                        <Develop className={styles.photo}>
                            <Image src={tile.image} alt="" fill sizes="(min-width: 768px) 76vw, 220vw" className={styles.image} />
                        </Develop>
                        <div className={styles.copy}>
                            <h2 className={styles.title}>{tile.title}</h2>
                            <p className={styles.desc}>{tile.desc}</p>
                            <span className={styles.cta}>
                                {tile.cta}
                                <ArrowBox />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
