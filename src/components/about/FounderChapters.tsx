import type { ReactNode } from 'react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import Develop from '@/components/ui/Develop';
import styles from './FounderChapters.module.css';

export interface ChapterPhoto {
    url: string;
    lqip?: string;
    alt: string;
}

// Paragraph count per chapter, matching the About.chapters messages.
const CHAPTERS = [
    { id: 'c1', paragraphs: 5 },
    { id: 'c2', paragraphs: 3 },
    { id: 'c3', paragraphs: 6 },
] as const;

interface FounderChaptersProps {
    /** Up to two photos per chapter, in chapter order. */
    photos: ChapterPhoto[][];
}

export default async function FounderChapters({ photos }: FounderChaptersProps) {
    const t = await getTranslations('About');
    const strong = (chunks: ReactNode) => <strong>{chunks}</strong>;

    return (
        <section className={styles.story} aria-labelledby="founder-story-title">
            <div className={styles.container}>
                <h2 id="founder-story-title" className={styles.storyTitle}>{t('storyTitle')}</h2>

                <ol className={styles.chapters}>
                    {CHAPTERS.map(({ id, paragraphs }, index) => {
                        const pair = photos[index] ?? [];
                        return (
                            <li key={id} className={styles.chapter} data-has-photos={pair.length > 0 || undefined}>
                                <div className={styles.text}>
                                    <p className={`${styles.number} num`} aria-hidden="true">
                                        {String(index + 1).padStart(2, '0')}
                                    </p>
                                    <h3 className={styles.title}>{t(`chapters.${id}.title`)}</h3>
                                    {Array.from({ length: paragraphs }, (_, p) => (
                                        <p key={p} className={styles.body}>
                                            {t.rich(`chapters.${id}.p${p + 1}`, { strong })}
                                        </p>
                                    ))}
                                </div>

                                {pair.length > 0 ? (
                                    <div className={styles.photos} data-count={pair.length}>
                                        {pair.map((photo, i) => (
                                            <Develop key={photo.url} className={i === 0 ? styles.photoMain : styles.photoInset}>
                                                <Image
                                                    src={photo.url}
                                                    alt={photo.alt}
                                                    fill
                                                    sizes={i === 0 ? '(min-width: 900px) 34vw, 85vw' : '(min-width: 900px) 18vw, 45vw'}
                                                    className={styles.image}
                                                    placeholder={photo.lqip ? 'blur' : 'empty'}
                                                    blurDataURL={photo.lqip}
                                                />
                                            </Develop>
                                        ))}
                                    </div>
                                ) : null}
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}
