import fs from 'fs';
import path from 'path';

const toursJsonPath = path.join(process.cwd(), 'src/data/tours.json');
const tours = JSON.parse(fs.readFileSync(toursJsonPath, 'utf8'));

// Check if already exists
if (tours.some(t => t.slug === 'test-bilingual-golden-triangle-2026')) {
    console.log('Test tour already exists in tours.json');
    process.exit(0);
}

const newTour = {
    "id": tours.length + 1,
    "slug": "test-bilingual-golden-triangle-2026",
    "category": "Cultural",
    "title": "Golden Triangle & Taj Mahal Discovery Tour",
    "title_ja": "ゴールデントライアングルとタージ・マハル発見ツアー",
    "shortDescription": "Discover the magnificent Taj Mahal, the forts of Agra and Jaipur, and the timeless spirit of Delhi on this iconic 7-day tour.",
    "shortDescription_ja": "壮大なタージ・マハル、アグラとジャイプールの城塞、装置でデリーの永遠の精神を、この象徴的な7日間のツアーで発見してください。",
    "longDescription": "This is a test tour created to verify bilingual language switching functionality on the Kanmani Tours website. All content in this tour exists in both English and Japanese.\n\nThe Golden Triangle is India's most iconic travel circuit, connecting three extraordinary cities — Delhi, Agra, and Jaipur. Each city tells a different chapter of India's magnificent history, and together they offer an unforgettable introduction to the country's culture, architecture, and way of life.\n\nDelhi, the capital, blends ancient Mughal grandeur with modern Indian energy. Agra is home to the Taj Mahal, one of the seven wonders of the world. Jaipur, the Pink City, dazzles with its royal palaces and vibrant bazaars. Your Japanese-speaking guide will bring each destination to life with stories, context, and insider access that no guidebook can provide.",
    "longDescription_ja": "このツアーは、カンマニ・ツアーズのウェブサイトでバイリンガル言語切り替え機能を確認するために作成されたテストツアーです。このツアーのすべてのコンテンツは英語と日本語の両方で存在します。\n\nゴールデントライアングルはインド最も象徴的な旅行ルートで、3つの素晴らしい都市—デリー、アグラ、ジャイプール—を結んでいます。それぞれの都市はインドの壮大な歴史の異なる章を語り、合わせてインドの文化、建築、生活様式への忘れられない入門を提供します。\n\n首都デリーは、古代ムガール帝国の壮大さと現代インドのエネルギーが融合しています。アグラは世界七不思議の一つ、タージ・マハルの本拠地です。ピンクシティのジャイプールは、その王宮と活気あふれるバザールで目を見張ります。日本語を話すガイドが、ガイドブックでは得られないストーリー、背景、そして特別なアクセスで各目的地に命を吹き込みます。",
    "startDate": "2026-09-15",
    "endDate": "2026-09-21",
    "durationDays": 7,
    "location": "Delhi, Agra, Jaipur",
    "location_ja": "デリー、アグラ、ジャイプール",
    "priceRangeJPY": { "min": 280000, "max": 320000 },
    "seatsLeft": 10,
    "coverImage": null,
    "galleryImages": [],
    "features": [
        "Japanese-speaking guide throughout all 7 days",
        "Maximum 10 guests for an intimate experience",
        "All entry fees and permits included",
        "Luxury heritage hotels at each destination",
        "Private air-conditioned transport",
        "Dr. Kanmani personally oversees the itinerary"
    ],
    "features_ja": [
        "7日間を通じた日本語スピーキングガイド",
        "親密な体験のために最大10名のゲスト",
        "全入場料と許可証を含む",
        "各目的地の豪華なヘリテージホテル",
        "プライベートエアコン付き交通",
        "Dr.カンマニが個人的に旅程を監督"
    ],
    "itinerary": [
        { "dayNumber": 1, "title": "Arrival in Delhi", "title_ja": "デリー到着", "details": "Arrive at Indira Gandhi International Airport. Our Japanese-speaking team will greet you at the arrivals hall with a name board. Transfer to your heritage hotel in central Delhi. Evening welcome dinner featuring authentic North Indian cuisine. Tour briefing and introduction to your guide.", "details_ja": "インディラ・ガンジー国際空港に到着。日本語を話すチームが到着ホールでネームボードを持ってお迎えします。デリー中心部のヘリテージホテルへ送迎。本格的な北インド料理 of ウェルカムディナー。ツアーのブリーフィングとガイドとの顔合わせ。" },
        { "dayNumber": 2, "title": "Old and New Delhi", "title_ja": "オールドデリーとニューデリー", "details": "Morning cycle rickshaw ride through the narrow lanes of Old Delhi. Visit Jama Masjid, Chandni Chowk spice market, and the Red Fort. Street food tasting with your Japanese guide explaining every dish. Afternoon: India Gate, Humayun's Tomb, and Qutub Minar. Evening free for personal exploration.", "details_ja": "午前中はオールドデリーの細い路地をサイクルリキシャで巡ります。ジャマー・マスジド、チャンドニー・チョークのスパイス市場、レッド・フォートを訪問。日本語ガイドが各料理を説明しながらストリートフードを試食。午後はインド門、フマーユーン廟、クトゥブ・ミナールを訪問。夕方は自由時間。" },
        { "dayNumber": 3, "title": "Delhi to Agra — Afternoon at Agra Fort", "title_ja": "デリーからアグラへ—アグラ城での午後", "details": "Morning drive to Agra (approximately 3 hours by private vehicle). Lunch at a rooftop restaurant with a view of the Taj Mahal. Afternoon guided tour of Agra Fort, a UNESCO World Heritage Site. Evening stroll along the Yamuna River bank at sunset. Overnight in Agra.", "details_ja": "午前中にアグラへドライブ（プライベート車で約3時間）。タージ・マハルの眺望がある屋上レストランでランチ。午後はユネスコ世界遺産のアグラ城ガイドツアー。夕暮れ時にヤムナー川沿いを散策。アグラに宿泊。" },
        { "dayNumber": 4, "title": "Sunrise at the Taj Mahal", "title_ja": "タージ・マハルでの日の出", "details": "Wake up at 5:00am for the most magical experience of the tour. Private sunrise viewing of the Taj Mahal as the first light of dawn illuminates the white marble. Your guide will share the extraordinary love story of Emperor Shah Jahan and Mumtaz Mahal. Visit Fatehpur Sikri in the afternoon — a ghost city abandoned 400 years ago. Return to hotel for evening at leisure.", "details_ja": "ツアー最も魔法的な体験のために朝5時に起床。夜明けの最初の光が白大理石を照らす中、タージ・マハルでのプライベート日の出観覧。ガイドがシャー・ジャハーン皇帝とムムターズ・マハルの特別な愛の物語を語ります。午後は400年前に廃棄されたゴーストシティ、ファテープル・シークリーを訪問。ホテルに戻り夕方は自由時間。" },
        { "dayNumber": 5, "title": "Agra to Jaipur — The Pink City", "title_ja": "アグラからジャイプールへ—ピンクシティ", "details": "Scenic drive from Agra to Jaipur (approximately 4 hours) with a stop at Abhaneri stepwell — one of India's most stunning ancient structures. Check into a heritage haveli in the old city of Jaipur. Evening walking tour of the Pink City markets and bazaars. Traditional Rajasthani dinner with folk music performance.", "details_ja": "アグラからジャイプールへの景観ドライブ（約4時間）。インド最も素晴らしい古代建造物の一つ、アバネリの階段井戸に立ち寄ります。ジャイプール旧市街のヘリテージハヴェリにチェックイン。ピンクシティの市場とバザールのイブニングウォーキングツアー。民族音楽の演奏付きの伝統的なラジャスタンディナー。" },
        { "dayNumber": 6, "title": "Jaipur — Palaces, Elephants & Artisans", "title_ja": "ジャイプール—宮殿、ゾウ、職人", "details": "Morning visit to Amber Fort — a breathtaking hilltop palace complex. Ethical elephant sanctuary visit (no riding — interaction, feeding, and bathing observation only). City Palace and Jantar Mantar astronomical observatory. Afternoon block printing workshop with a local artisan family. Optional: gem and jewelry district shopping tour.", "details_ja": "午前中は息を呑む丘の上の宮殿複合施設、アンベール城を訪問。倫理的なゾウ保護区訪問（乗馬なし—触れ合い、餌やり、入浴観察のみ）。シティパレスとジャンタル・マンタル天文台。地元の職人家族によるブロックプリントワークショップ。オプション：宝石とジュエリー地区のショッピングツアー。" },
        { "dayNumber": 7, "title": "Departure", "title_ja": "出発", "details": "Final morning at leisure. Optional last-minute visit to local markets for souvenirs. Transfer to Jaipur Airport or Delhi Airport depending on your return flight. Farewell from your Kanmani Tours guide. Depart with memories of India's most iconic landmarks and the warmth of its people.", "details_ja": "最後の午前は自由時間。お土産のための地元市場への最後の訪問もオプションです。帰りの便によってジャイプール空港またはデリー空港へ送迎。カンマニ・ツアーズガイドとのお別れ。インド最も象徴的なランドマークとその人々の温かさの思い出とともに出発。" }
    ],
    "whatToExpect": [
        "A seamless blend of history, culture, and personal discovery",
        "Authentic Indian home-cooked meals arranged by Dr. Kanmani",
        "Sunrise and golden hour visits to avoid tourist crowds",
        "Local artisan workshops and handicraft demonstrations",
        "Stories and context that bring India's history to life"
    ],
    "whatToExpect_ja": [
        "歴史、文化、個人的な発見のシームレスな融合",
        "Dr.カンマニが手配した本格的なインド家庭料理",
        "観光客の混雑を避けた日の出とゴールデンアワー訪問",
        "地元の職人ワークショップと工芸品のデモンストレーション",
        "インドの歴史に命を吹き込むストーリーと背景"
    ],
    "inclusions": [
        "6 nights accommodation in luxury heritage hotels",
        "All breakfasts, lunches, and dinners as per itinerary",
        "Private air-conditioned vehicle throughout",
        "Japanese-speaking expert guide for all 7 days",
        "All monument entry fees (including Taj Mahal)",
        "Cycle rickshaw in Old Delhi",
        "Ethical elephant sanctuary experience",
        "Block printing artisan workshop",
        "Airport pickup and drop-off",
        "24/7 emergency support from Dr. Kanmani's team"
    ],
    "inclusions_ja": [
        "豪華ヘリテージホテルでの6泊",
        "旅程に記載の全朝食・昼食・夕食",
        "専用エアコン付き車両",
        "全7日間の日本語スピーキングエキスパートガイド",
        "全モニュメント入場料（タージ・マハル含む）",
        "オールドデリーのサイクルリキシャ",
        "倫理的なゾウ保護区体験",
        "ブロックプリント職人ワークショップ",
        "空港送迎",
        "Dr.カンマニのチームによる24時間緊急サポート"
    ],
    "exclusions": [
        "International flights to/from India",
        "Travel insurance (strongly recommended)",
        "Personal shopping and souvenirs",
        "Optional activities not listed in the itinerary",
        "Tips for guides and drivers (appreciated but optional)"
    ],
    "exclusions_ja": [
        "インドへの/からの国際線航空券",
        "旅行保険（強く推奨）",
        "個人的なショッピングとお土産",
        "旅程に記載されていないオプション活動",
        "ガイドやドライバーへのチップ（感謝されますがオプション）"
    ],
    "faq": [
        {
            "question": "Is this tour suitable for first-time visitors to India?",
            "question_ja": "このツアーはインド初訪問者に適していますか？",
            "answer": "Yes, absolutely. The Golden Triangle is the ideal introduction to India. All logistics are handled by our team, your Japanese-speaking guide is with you every step of the way, and the hotels are carefully selected for comfort and safety.",
            "answer_ja": "はい、もちろんです。ゴールデントライアングルはインドへの理想的な入門です。全ての物流は私たちのチームが担当し、日本語を話すガイドが一歩一歩あなたに寄り添い、ホテルは快適さと安全性を考慮して慎重に選ばれています。"
        },
        {
            "question": "What is the best time of year for this tour?",
            "question_ja": "このツアーに最適な時期はいつですか？",
            "answer": "September and October are excellent — the monsoon has passed, temperatures are pleasant (25–32°C), and the landscapes are lush and green. We avoid December–January as the northern Indian cold can be uncomfortable for some guests.",
            "answer_ja": "9月と10月は素晴らしい時期です—モンスーンが過ぎ、気温は心地よく（25〜32°C）、景色は豊かで緑豊かです。北インドの寒さが一部のゲストに不快な場合があるため、12月〜1月は避けています。"
        },
        {
            "question": "How physically demanding is this tour?",
            "question_ja": "このツアーはどのくらい体力を要しますか？",
            "answer": "This tour involves moderate walking — approximately 3 to 5 kilometres per day on uneven surfaces at heritage sites. There are no strenuous climbs. Comfortable walking shoes are essential. Please inform us of any mobility concerns before booking.",
            "answer_ja": "このツアーは中程度のウォーキングを含みます—ヘリテージサイトの不均一な表面を1日約3〜5キロメートル。激しい登山はありません。快適なウォーキングシューズが必須です。予約前に移動に関する懸念事項をお知らせください。"
        }
    ],
    "bookingLink": null
};

tours.push(newTour);
fs.writeFileSync(toursJsonPath, JSON.stringify(tours, null, 4), 'utf8');
console.log('Successfully appended test tour to tours.json');
