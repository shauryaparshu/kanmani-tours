import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import ArrowBox from '@/components/ui/ArrowBox';
import styles from './FaqList.module.css';

export interface FaqItem {
    _id: string;
    category?: string | null;
    question: string;
    questionJa?: string;
    answer: string;
    answerJa?: string;
}

// Topic order on the page. Questions without a known topic go under "general".
const TOPICS = ['booking', 'visa', 'experience', 'health', 'money', 'weather', 'celebrity', 'general'] as const;
type Topic = (typeof TOPICS)[number];

function topicOf(faq: FaqItem): Topic {
    return (TOPICS as readonly string[]).includes(faq.category ?? '') ? (faq.category as Topic) : 'general';
}

/** Answers are plain text: blank lines separate paragraphs, and "•" lines form a list. */
function Answer({ text }: { text: string }) {
    const blocks = text.trim().split(/\n\s*\n/);
    return (
        <div className={styles.answer}>
            {blocks.map((block, i) => {
                const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
                if (lines.length > 0 && lines.every((line) => /^[•\-*]\s?/.test(line))) {
                    return (
                        <ul key={i} className={styles.list}>
                            {lines.map((line, j) => <li key={j}>{line.replace(/^[•\-*]\s?/, '')}</li>)}
                        </ul>
                    );
                }
                return (
                    <p key={i}>
                        {lines.map((line, j) => (j === 0 ? line : [<br key={j} />, line]))}
                    </p>
                );
            })}
        </div>
    );
}

export default async function FaqList({ faqs }: { faqs: FaqItem[] }) {
    const [t, locale] = await Promise.all([getTranslations('FAQ'), getLocale()]);
    const ja = locale === 'ja';

    const groups = TOPICS
        .map((topic) => ({ topic, items: faqs.filter((faq) => topicOf(faq) === topic) }))
        .filter((group) => group.items.length > 0);

    return (
        <section className={styles.section}>
            <div className={styles.inner}>
                {groups.length === 0 ? (
                    <p className={styles.empty}>{t('empty')}</p>
                ) : (
                    <>
                        <div className={styles.side}>
                            <nav aria-labelledby="faq-index-title">
                                <h2 id="faq-index-title" className={styles.indexTitle}>{t('indexLabel')}</h2>
                                <ol className={styles.index}>
                                    {groups.map(({ topic, items }) => (
                                        <li key={topic}>
                                            <a href={`#faq-${topic}`}>
                                                <span>{t(`categories.${topic}`)}</span>
                                                <span className="num">{items.length}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </nav>

                            <div className={styles.help}>
                                <p className={styles.helpTitle}>{t('stillHaveQuestions')}</p>
                                <p className={styles.helpBody}>{t('contactPrompt')}</p>
                                <Link href="/contact" className={styles.helpLink}>
                                    {t('contactUs')}
                                    <ArrowBox />
                                </Link>
                            </div>
                        </div>

                        <div className={styles.groups}>
                            {groups.map(({ topic, items }) => (
                                <section key={topic} id={`faq-${topic}`} className={styles.group} aria-labelledby={`faq-${topic}-title`}>
                                    <div className={styles.groupHead}>
                                        <h2 id={`faq-${topic}-title`} className={styles.groupTitle}>{t(`categories.${topic}`)}</h2>
                                        <p className={`${styles.count} num`}>{t('questionCount', { count: items.length })}</p>
                                    </div>
                                    <div className={styles.items}>
                                        {items.map((faq) => (
                                            <details key={faq._id} className={styles.item}>
                                                <summary>{(ja && faq.questionJa) || faq.question}</summary>
                                                <Answer text={(ja && faq.answerJa) || faq.answer} />
                                            </details>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
