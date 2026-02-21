'use client';

import React, { useState } from 'react';

const TESTIMONIALS_LIST = [
    {
        id: 1,
        name: "Tanaka Yuki",
        location: "Tokyo, Japan",
        text: "スター・インディア・ツアーのおかげで、長年の夢だったスターとの対面が叶いました！細やかな配慮と安全面へのこだわりが素晴らしく、女性一人での参加でしたが、最初から最後まで安心して楽しむことができました。現地のスタッフの方々も非常にプロフェッショナルで、言葉の壁を感じさせないおもてなしに感動しました。"
    },
    {
        id: 2,
        name: "Sato Hiroshi",
        location: "Osaka, Japan",
        text: "プランが非常に練られていて、個人では絶対に行けないような映画スタジオの裏側や、スター御用達のレストランなど、貴重な体験の連続でした。映画ファンなら絶対に参加すべきツアーです。次回は家族を連れて参加したいと考えています。"
    },
    {
        id: 3,
        name: "Kaneko Sato",
        location: "Nagoya, Japan",
        text: "インドへの旅行は初めてでしたが、事前のカウンセリングから帰国まで、日本人スタッフのサポートが手厚く、不安は一切ありませんでした。特にファンミーティングの演出は最高で、憧れの俳優さんと直接お話しできた時間は一生の宝物です！"
    },
    {
        id: 4,
        name: "Ono Miyuki",
        location: "Yokohama, Japan",
        text: "期待以上の体験でした。宿泊施設から移動手段、そして肝心のスターとの交流セッションまで、すべてが洗練されていました。特に南インドの文化に触れる機会も多く、映画だけでなくインドという国のファンになりました。プロ意識の高さに脱帽です。"
    },
    {
        id: 5,
        name: "Suzuki Haruka",
        location: "Saitama, Japan",
        text: "憧れのスターと間近で会えるなんて信じられませんでした。一生の思い出をありがとうございました。次回のツアーも必ず参加します！現地のガイドさんも日本語が完璧で、非常に心強かったです。食事も日本人の口に合うものを選んでいただき、大満足の旅でした。"
    },
    {
        id: 6,
        name: "Suzuki Aiko",
        location: "Fukuoka, Japan",
        text: "セキュリティがしっかりしていて、全く不安を感じませんでした。インドの魅力を再発見できる素晴らしい企画です。自分だけの特別な時間を過ごすことができ、リフレッシュできました。"
    },
    {
        id: 7,
        name: "Yamamoto Kenji",
        location: "Kyoto, Japan",
        text: "映画の裏側を知ることができ、映画への愛がさらに深まりました。ガイドの方の知識も豊富で、とても勉強になりました。歴史的な建造物と現代の映画産業が融合した不思議な体験を、ぜひ多くの人に味わってほしいです。"
    },
    {
        id: 8,
        name: "Matsuoka Rin",
        location: "Chiba, Japan",
        text: "心から感動しました。言葉が通じなくても、スタッフさんの熱意とプロフェッショナルな対応で、最高の時間を過ごせました。また近いうちに必ず戻ってきます！"
    },
    {
        id: 9,
        name: "Nakamura Mei",
        location: "Hiroshima, Japan",
        text: "夢のような1週間でした。スターとの対面はもちろん、映画のロケ地巡りや贅沢なホテルでの滞在など、すべてが一流でした。スタッフの皆さんのホスピタリティに心から感謝しています。"
    },
    {
        id: 10,
        name: "Kobayashi Kaito",
        location: "Sapporo, Japan",
        text: "インド映画のエネルギーを肌で感じることができました。最高のツアーをありがとうございました。友人や同僚にも自信を持っておすすめしたいと思います。一生忘れない経験を本当にありがとう！"
    }
];

interface TestimonialCardProps {
    item: typeof TESTIMONIALS_LIST[0];
    imageSrc: string;
}

function TestimonialCard({ item, imageSrc }: TestimonialCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const charLimit = 150;
    const isLongText = item.text.length > charLimit;

    const displayText = isExpanded ? item.text : item.text.slice(0, charLimit);

    return (
        <div className="testimonial-col">
            <div className="testimonial-wrapper">
                <div className="avatar-container">
                    <div className="avatar-bg-circle"></div>
                    <img
                        src={imageSrc}
                        alt={item.name}
                        className="testimonial-avatar-new"
                    />
                </div>
                <div className="testimonial-card-new">
                    <div className="testimonial-text-content">
                        <p className="testimonial-text-new">
                            {displayText}{!isExpanded && isLongText && "..."}
                        </p>
                        {isLongText && (
                            <button
                                className="read-more-btn-text"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsExpanded(!isExpanded);
                                }}
                            >
                                {isExpanded ? "show less" : "read more"}
                            </button>
                        )}
                    </div>

                    <div className="testimonial-footer-new">
                        <div className="author-main">
                            <span className="author-name-new">{item.name}</span>
                            <span className="author-role-new">{item.location}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface TestimonialsProps {
    customerImages: string[];
}

export default function Testimonials({ customerImages }: TestimonialsProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalItems = TESTIMONIALS_LIST.length;

    // Move to next slide
    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % totalItems);
    };

    // Move to previous slide
    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
    };

    return (
        <section id="testimonials" className="testimonials-section">
            <div className="testimonials-container">
                <div className="testimonials-header">
                    <div className="section-title-wrap" style={{ margin: '0 auto', textAlign: 'center' }}>
                        <h2 className="section-title">Happy Clients</h2>
                        <p className="section-subtitle">What our global community says about their journey</p>
                    </div>
                </div>

                <div className="testimonials-window">
                    <button
                        type="button"
                        className="nav-btn-alt prev"
                        onClick={(e) => {
                            e.preventDefault();
                            prevSlide();
                        }}
                        aria-label="Previous testimonial"
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        className="nav-btn-alt next"
                        onClick={(e) => {
                            e.preventDefault();
                            nextSlide();
                        }}
                        aria-label="Next testimonial"
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>

                    <div
                        className="testimonials-carousel"
                        style={{
                            '--slide-index': currentIndex,
                        } as React.CSSProperties}
                    >
                        {TESTIMONIALS_LIST.map((item, idx) => {
                            const imageSrc = customerImages[idx % customerImages.length] || '/assets/img/people/customers/001-yuki-tanaka.png';

                            return (
                                <TestimonialCard
                                    key={item.id}
                                    item={item}
                                    imageSrc={imageSrc}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
