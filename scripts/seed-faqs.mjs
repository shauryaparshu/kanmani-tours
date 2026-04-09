import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '31klefy7',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const faqs = [

  // ── BOOKING & PAYMENT ──────────────────────────────────
  {
    _type: 'faq',
    category: 'booking',
    question: 'How do I book a tour?',
    answer: 'You can book directly through our website by clicking the "Book Now" button on any tour page, or by contacting us via our contact form. Our team will confirm your booking within 24 hours and guide you through the next steps.',
    orderRank: 'booking_01',
  },
  {
    _type: 'faq',
    category: 'booking',
    question: 'Is a deposit required to secure my spot?',
    answer: 'Yes, a deposit of 30% of the total tour price is required to confirm your booking. The remaining balance is due 30 days before the tour departure date. For bookings made within 30 days of departure, full payment is required at the time of booking.',
    orderRank: 'booking_02',
  },
  {
    _type: 'faq',
    category: 'booking',
    question: 'Can I pay in Japanese Yen?',
    answer: 'Yes, all our prices are listed in Japanese Yen (JPY) and payment can be made in Yen via bank transfer. We also accept major credit cards including Visa, Mastercard, and JCB. Credit card payments may include a small processing fee.',
    orderRank: 'booking_03',
  },
  {
    _type: 'faq',
    category: 'booking',
    question: 'What is the cancellation policy?',
    answer: 'Cancellations made 60 or more days before departure receive a full refund minus a ¥10,000 administrative fee. Cancellations 30–59 days before departure forfeit the 30% deposit. Cancellations within 30 days of departure are non-refundable. We strongly recommend purchasing travel insurance with cancellation cover.',
    orderRank: 'booking_04',
  },
  {
    _type: 'faq',
    category: 'booking',
    question: 'Can I book for a group?',
    answer: 'Absolutely. We welcome group bookings and can accommodate groups of up to 12 people per tour. For larger groups or private group tours, please contact us directly and we will create a customised itinerary and pricing for you.',
    orderRank: 'booking_05',
  },
  {
    _type: 'faq',
    category: 'booking',
    question: 'Can I customise a tour itinerary?',
    answer: 'Yes. While our published tours have fixed itineraries designed for the best experience, we offer private custom tours where the itinerary, duration, accommodation level, and activities are tailored entirely to your preferences. Contact us to discuss your ideal India journey.',
    orderRank: 'booking_06',
  },

  // ── VISA & TRAVEL DOCUMENTS ────────────────────────────
  {
    _type: 'faq',
    category: 'visa',
    question: 'Do Japanese citizens need a visa to visit India?',
    answer: 'Yes, Japanese passport holders require a visa to enter India. The good news is that India offers an e-Visa (electronic visa) that can be applied for entirely online before your trip. There is no need to visit an embassy or consulate in person.',
    orderRank: 'visa_01',
  },
  {
    _type: 'faq',
    category: 'visa',
    question: 'How do I apply for an Indian e-Visa?',
    answer: 'You can apply at the official Indian government e-Visa portal at indianvisaonline.gov.in. You will need a valid Japanese passport, a digital passport photo, and a credit card for the application fee. The tourist e-Visa costs approximately USD 25 and is valid for multiple entries over 5 years.',
    orderRank: 'visa_02',
  },
  {
    _type: 'faq',
    category: 'visa',
    question: 'How far in advance should I apply for a visa?',
    answer: 'We recommend applying at least 2 weeks before your departure date, although the e-Visa is typically processed within 3–5 business days. Apply as early as possible to avoid any last-minute stress. Your visa approval will be sent to your email as a PDF — print it and carry it with you.',
    orderRank: 'visa_03',
  },
  {
    _type: 'faq',
    category: 'visa',
    question: 'What documents do I need to carry during the trip?',
    answer: 'You should carry your original passport, a printed copy of your e-Visa approval, your travel insurance documents, your flight tickets, and a copy of your hotel bookings. We recommend keeping digital copies of all documents stored securely in your email or cloud storage as a backup.',
    orderRank: 'visa_04',
  },
  {
    _type: 'faq',
    category: 'visa',
    question: 'Do children need a separate visa?',
    answer: 'Yes, every traveller including infants and children requires their own individual visa to enter India. Each child must have their own valid passport. Please apply for each family member separately through the e-Visa portal.',
    orderRank: 'visa_05',
  },

  // ── THE TOUR EXPERIENCE ────────────────────────────────
  {
    _type: 'faq',
    category: 'experience',
    question: 'Will there be a Japanese-speaking guide throughout the tour?',
    answer: 'Yes. A dedicated Japanese-speaking guide accompanies every Kanmani Tours group for the entire duration of the trip — from your arrival at the airport to your departure. We believe a guide who speaks your language fluently makes all the difference to your experience and peace of mind.',
    orderRank: 'experience_01',
  },
  {
    _type: 'faq',
    category: 'experience',
    question: 'How many people are in each tour group?',
    answer: 'Our tours are intentionally kept small, with a maximum of 8–12 guests per group. This boutique approach ensures personalised attention, flexibility in scheduling, and a more authentic and intimate experience compared to large bus tours.',
    orderRank: 'experience_02',
  },
  {
    _type: 'faq',
    category: 'experience',
    question: 'Is this tour suitable for first-time visitors to India?',
    answer: 'Absolutely — in fact, our tours are specifically designed with first-time visitors in mind. Everything from airport transfers to accommodation, meals, and guided experiences is handled by our team. You simply arrive and enjoy. Our Japanese-speaking guide will help you navigate every aspect of Indian culture comfortably.',
    orderRank: 'experience_03',
  },
  {
    _type: 'faq',
    category: 'experience',
    question: 'What is the physical difficulty level of the tours?',
    answer: 'Most of our tours involve moderate walking — typically 3–6 kilometres per day across temple sites, markets, and cultural venues. The pace is relaxed and no special fitness is required. For guests with mobility concerns, please contact us in advance and we will make appropriate arrangements.',
    orderRank: 'experience_04',
  },
  {
    _type: 'faq',
    category: 'experience',
    question: 'What happens if I miss my connecting flight to India?',
    answer: 'Please contact us immediately if you experience any travel disruptions. We will do our best to accommodate you and connect you with the group as soon as possible. We strongly recommend purchasing comprehensive travel insurance that covers flight delays and missed connections.',
    orderRank: 'experience_05',
  },
  {
    _type: 'faq',
    category: 'experience',
    question: 'What is included in the tour price?',
    answer: 'Each tour listing clearly states what is included. In general, our tours include all internal ground transportation, accommodation at quality hotels, specified meals, entry fees to all attractions, and the services of a Japanese-speaking guide. International flights to and from India are not included unless specifically stated.',
    orderRank: 'experience_06',
  },

  // ── SAFETY & HEALTH ────────────────────────────────────
  {
    _type: 'faq',
    category: 'health',
    question: 'Is India safe for Japanese tourists?',
    answer: 'India is welcoming and safe for tourists when common-sense precautions are followed. Our tours visit well-established destinations and our guides are experienced in keeping guests safe and comfortable. We avoid areas of concern and our small group format means you always have support around you.',
    orderRank: 'health_01',
  },
  {
    _type: 'faq',
    category: 'health',
    question: 'What vaccinations are recommended before visiting India?',
    answer: 'We recommend consulting your doctor or a travel clinic at least 4–6 weeks before departure. Commonly recommended vaccinations for India include Hepatitis A, Typhoid, and Tetanus. Depending on your itinerary, your doctor may also suggest Hepatitis B or Japanese Encephalitis. Malaria prevention may be relevant for some regions.',
    orderRank: 'health_02',
  },
  {
    _type: 'faq',
    category: 'health',
    question: 'Can I drink the water in India?',
    answer: 'Please do not drink tap water anywhere in India. Only drink sealed bottled mineral water, which is widely available and inexpensive. We provide bottled water throughout all tour activities. At restaurants, avoid ice in drinks unless you are confident it was made from purified water.',
    orderRank: 'health_03',
  },
  {
    _type: 'faq',
    category: 'health',
    question: 'What should I do if I feel unwell during the tour?',
    answer: 'Inform your guide immediately. We have relationships with reputable clinics and hospitals in all cities we visit, and your guide can arrange medical assistance quickly. This is another reason why travel insurance with medical cover is essential — please ensure your policy includes emergency medical evacuation.',
    orderRank: 'health_04',
  },
  {
    _type: 'faq',
    category: 'health',
    question: 'Are there food options for dietary restrictions?',
    answer: 'Yes. Indian cuisine is remarkably diverse and accommodating. Vegetarian options are plentiful throughout the country. If you have specific dietary needs — vegetarian, vegan, gluten-free, halal, or allergies — please inform us at the time of booking and we will ensure suitable meals are arranged throughout your tour.',
    orderRank: 'health_05',
  },
  {
    _type: 'faq',
    category: 'health',
    question: 'What should I pack for the trip?',
    answer: 'Essentials include lightweight breathable clothing, a hat and sunglasses for sun protection, comfortable walking shoes, antibacterial hand gel, insect repellent, any personal prescription medications, and a small day bag. For temple visits, modest clothing that covers shoulders and knees is required — a light shawl or scarf is useful. A universal power adapter is also recommended as India uses Type D and C sockets.',
    orderRank: 'health_06',
  },

  // ── MONEY & PRACTICAL ──────────────────────────────────
  {
    _type: 'faq',
    category: 'money',
    question: 'Should I carry cash or use cards in India?',
    answer: 'A combination of both is ideal. Major hotels, restaurants, and shops in tourist areas accept credit cards, but local markets, small shops, auto-rickshaws, and tips require cash. We recommend carrying Indian Rupees for daily expenses. Most international ATM cards work in Indian ATMs, though your bank may charge a foreign transaction fee.',
    orderRank: 'money_01',
  },
  {
    _type: 'faq',
    category: 'money',
    question: 'Where can I exchange Japanese Yen to Indian Rupees?',
    answer: 'The most convenient place is at the international airport on arrival — exchange booths are open 24 hours. You can also exchange at authorised money changers in cities, or withdraw Rupees directly from ATMs. Avoid exchanging money with unofficial street vendors. Note that Indian Rupees cannot be taken out of India, so exchange only what you need.',
    orderRank: 'money_02',
  },
  {
    _type: 'faq',
    category: 'money',
    question: 'Are tips expected in India?',
    answer: 'Tipping is customary and appreciated in India, though not mandatory. As a general guide: Japanese-speaking guides ¥1,500–2,000 equivalent per day, drivers ¥500–800 equivalent per day, hotel porters ¥100–200 equivalent per bag, and restaurant staff 10% of the bill if service charge is not included. Your guide will advise you on appropriate tipping throughout the tour.',
    orderRank: 'money_03',
  },
  {
    _type: 'faq',
    category: 'money',
    question: 'Will my Japanese mobile phone work in India?',
    answer: 'Most modern smartphones work in India, but roaming charges from Japanese carriers can be very expensive. We recommend either activating an international roaming plan with your carrier before departure, or purchasing an India e-SIM online in advance. Free Wi-Fi is available at most hotels, so you will rarely be without connectivity.',
    orderRank: 'money_04',
  },
  {
    _type: 'faq',
    category: 'money',
    question: 'Is travel insurance required?',
    answer: 'Travel insurance is not mandatory but is very strongly recommended. A good policy should cover medical emergencies and evacuation, trip cancellation and interruption, lost or delayed baggage, and flight delays. Please ensure your policy covers the full duration of your trip including travel days.',
    orderRank: 'money_05',
  },

  // ── WEATHER & TIMING ───────────────────────────────────
  {
    _type: 'faq',
    category: 'weather',
    question: 'What is the best time of year to visit India?',
    answer: 'The most comfortable time to visit most parts of India is October through March, when temperatures are cooler and rainfall is minimal. South India including Tamil Nadu, Kerala, and Hyderabad is particularly pleasant from November to February. We schedule our tours to coincide with the best weather conditions for each destination.',
    orderRank: 'weather_01',
  },
  {
    _type: 'faq',
    category: 'weather',
    question: 'What is the weather like in South India where your tours go?',
    answer: 'South India has a tropical climate. From November to February temperatures range from 22–32°C — warm but comfortable. March to May is hotter, reaching 35°C or above. June to September is the monsoon season with heavy rainfall, particularly in Kerala and coastal areas. Our tours are timed to avoid the peak monsoon period.',
    orderRank: 'weather_02',
  },
  {
    _type: 'faq',
    category: 'weather',
    question: 'What should I wear when visiting temples in India?',
    answer: 'Modest dress is required at all temples and religious sites in India. Shoulders and knees must be covered for both men and women. Shoes must be removed before entering most temples, so sandals that are easy to slip on and off are practical. Many sites provide head coverings — your guide will advise you before each visit.',
    orderRank: 'weather_03',
  },
  {
    _type: 'faq',
    category: 'weather',
    question: 'Will the heat affect the tour schedule?',
    answer: 'Our tour schedules are designed with the climate in mind. Activities that involve outdoor walking or sightseeing are typically arranged for the cooler morning hours. Afternoons during hotter periods may include indoor cultural experiences, cooking classes, or relaxation time. Staying hydrated and wearing sun protection is important.',
    orderRank: 'weather_04',
  },

  // ── CELEBRITY & SPECIAL TOURS ──────────────────────────
  {
    _type: 'faq',
    category: 'celebrity',
    question: 'How are celebrity meetings arranged?',
    answer: 'We work directly with talent management agencies, film production houses, and celebrity representatives in India to arrange exclusive meet-and-greet sessions. These are formal, professionally managed interactions — not chance encounters. Details of the celebrity and the format of the meeting are confirmed and communicated to guests before the tour departs.',
    orderRank: 'celebrity_01',
  },
  {
    _type: 'faq',
    category: 'celebrity',
    question: 'Is there a guarantee I will meet the celebrity?',
    answer: 'We do everything possible to ensure confirmed celebrity interactions proceed as planned. However, as with any live event involving public figures, unforeseen circumstances such as filming schedules or personal emergencies can occasionally lead to changes. In such cases, we work immediately to arrange an alternative meeting or provide appropriate compensation.',
    orderRank: 'celebrity_02',
  },
  {
    _type: 'faq',
    category: 'celebrity',
    question: 'Can I take photos with the celebrity?',
    answer: 'Yes, photographs are typically permitted and encouraged during meet-and-greet sessions. Video recording may be restricted depending on the celebrity\'s management guidelines. Your guide will brief you on photography rules before each session. We also arrange for a professional group photograph as a lasting memento of the experience.',
    orderRank: 'celebrity_03',
  },
  {
    _type: 'faq',
    category: 'celebrity',
    question: 'What happens if a celebrity cancels at the last minute?',
    answer: 'In the rare event that a confirmed celebrity is unable to attend, we will make every effort to arrange an alternative celebrity of equivalent prominence, reschedule the meeting if the tour duration allows, or provide a meaningful partial refund for that specific element of the tour. We have contingency arrangements in place for all our celebrity experiences.',
    orderRank: 'celebrity_04',
  },
  {
    _type: 'faq',
    category: 'celebrity',
    question: 'Are the celebrity tours suitable for guests who are not film fans?',
    answer: 'Yes. Our celebrity tours are rich cultural experiences in their own right. Even without any prior knowledge of Indian cinema, guests enjoy the behind-the-scenes access to film studios, the energy of Tamil Nadu\'s entertainment industry, and the cultural insights that come with it. Many first-time visitors become fans of Indian cinema after experiencing it firsthand.',
    orderRank: 'celebrity_05',
  },
  {
    _type: 'faq',
    category: 'celebrity',
    question: 'Which celebrities have guests met on previous tours?',
    answer: 'Past tours have featured interactions with prominent figures from Tamil, Telugu, and Malayalam cinema. Specific celebrities vary by tour and season. The confirmed celebrity for each upcoming tour is listed on the tour details page. We do not disclose names in advance for tours that are still being finalised, but all confirmed celebrities are announced no later than 30 days before departure.',
    orderRank: 'celebrity_06',
  },
]

async function seedFaqs() {
  console.log('Deleting existing FAQs...')
  const existing = await client.fetch(`*[_type == "faq"]._id`)
  if (existing.length > 0) {
    const deletions = existing.map((id) => ({ delete: { id } }))
    await client.mutate(deletions)
    console.log(`Deleted ${existing.length} existing FAQs`)
  }

  console.log('Seeding new FAQs...')
  const transaction = client.transaction()
  faqs.forEach((faq) => transaction.create(faq))
  await transaction.commit()
  console.log(`Successfully seeded ${faqs.length} FAQs across 7 categories`)
}

seedFaqs().catch(console.error)
