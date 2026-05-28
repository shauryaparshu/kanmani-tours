import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-02-24',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

async function reconcile() {
    const targetSlugs = [
        'celebrity-tour-december-2025',
        'jana-nayagan-vijay-june-2026',
        'ntr-fan-meet-november-2026',
        'peddi-movie-premiere-june-2026'
    ];

    console.log('Reading source files...');
    
    // 1. Get celebrity-tour-december-2025 from existing tours.json
    const toursJsonPath = path.join(process.cwd(), 'src/data/tours.json');
    const oldTours = JSON.parse(fs.readFileSync(toursJsonPath, 'utf8'));
    const decTour = oldTours.find(t => t.slug === 'celebrity-tour-december-2025');

    if (!decTour) {
        throw new Error('Could not find celebrity-tour-december-2025 in the old tours.json');
    }

    // 2. Define the other 3 tours using data structured like tours.json
    // We parse and transform them to match tours.json format perfectly.
    const newTours = [
        decTour,
        {
            "id": 2,
            "slug": "peddi-movie-premiere-june-2026",
            "category": "Celebrity",
            "title": "Peddi Movie Premiere & South India Cultural Tour",
            "shortDescription": "Experience the Peddi movie premiere, visit celebrity homes, explore ancient temples, and discover the cultural heart of South India over 10 unforgettable days.",
            "longDescription": "Join us for an exclusive journey combining cinema, culture, and coastal beauty. This tour offers a rare opportunity to attend the premiere screening of the highly anticipated Tamil film Peddi, visit the homes of South Indian cinema legends, and explore UNESCO World Heritage temples. From the vibrant streets of Chennai to the serene beaches of Mahabalipuram and the architectural marvels of Trichy, every day brings new discoveries. Our Japanese-speaking guides ensure seamless communication throughout your journey.",
            "startDate": "2026-06-02",
            "endDate": "2026-06-11",
            "durationDays": 10,
            "location": "Chennai, Mahabalipuram, Trichy",
            "priceJPY": 298000,
            "seatsLeft": 12,
            "coverImage": null,
            "galleryImages": [],
            "features": [
                "Attend the exclusive premiere of Peddi Tamil movie",
                "Visit celebrity homes of Rajinikanth, Dhanush, and Vijay",
                "Explore Mahabalipuram UNESCO World Heritage rock temples",
                "Experience traditional Chennai food tour and shopping",
                "Visit ancient temples in Trichy including Kabaleshwar Temple",
                "Enjoy beach time at Marina Beach and temple town exploration"
            ],
            "itinerary": [
                { "dayNumber": 1, "title": "Arrival in India", "details": "Arrive at Chennai International Airport. Our team will greet you at arrivals and transfer you to your luxury hotel. Evening welcome dinner and tour orientation with your Japanese-speaking guide. Rest and prepare for the exciting journey ahead." },
                { "dayNumber": 2, "title": "Free Day in Chennai", "details": "Relax and recover from your journey. Optional activities available: explore local markets, visit nearby temples, or simply enjoy your hotel's amenities. Evening briefing about the Peddi movie premiere tomorrow." },
                { "dayNumber": 3, "title": "Peddi Movie Premiere Event", "details": "The highlight begins! Attend the exclusive premiere screening of Peddi at LB Stadium. Reserved seating arranged for our group. Experience the excitement of a Tamil cinema premiere with fans, media, and special guests. Evening celebration dinner." },
                { "dayNumber": 4, "title": "Private Premier Show & Celebrity Homes", "details": "Morning private screening with the lead actor in attendance. Afternoon tour visiting the external grounds of celebrity homes including Rajinikanth, Dhanush, and Vijay's residences. Evening free for personal exploration." },
                { "dayNumber": 5, "title": "Chennai Food & Shopping Tour", "details": "Immerse yourself in Chennai's culinary scene. Visit traditional markets, sample authentic South Indian breakfast, explore shopping districts for silk sarees and handicrafts. Lunch at a heritage restaurant. Evening at leisure." },
                { "dayNumber": 6, "title": "Mahabalipuram UNESCO Heritage Sites", "details": "Journey to the coastal town of Mahabalipuram. Explore the UNESCO World Heritage rock-cut temples including Shore Temple and Pancha Rathas. Enjoy beach time at pristine Mahabalipuram beach. Overnight in beach resort." },
                { "dayNumber": 7, "title": "Temples & Cultural Experiences", "details": "Visit ancient temples in the region. Experience traditional cultural activities. Lunch at a local family home for authentic Tamil hospitality. Evening cultural performance showcasing classical South Indian dance and music." },
                { "dayNumber": 8, "title": "Trichy Temple Trail", "details": "Travel to Trichy. Visit the magnificent Kabaleshwar Temple, Perumallkoil, Varadaraja Temple, and the iconic Tripliken rock fort temple. Explore the spiritual heart of Tamil Nadu with expert guides explaining the rich history and architecture." },
                { "dayNumber": 9, "title": "Marina Beach & Temple Town", "details": "Return to Chennai. Visit Marina Beach, one of the longest urban beaches in the world. Final temple visits and last-minute shopping. Farewell dinner celebrating the incredible journey. Pack and prepare for departure." },
                { "dayNumber": 10, "title": "Departure", "details": "Breakfast at the hotel. Check-out and transfer to Chennai International Airport for your flight back to Japan. Depart with unforgettable memories and new friendships." }
            ],
            "whatToExpect": [
                "10 days of immersive celebrity and cultural experiences",
                "Private film screenings and premiere access",
                "Full Japanese-speaking escort for all 10 days"
            ],
            "inclusions": [
                "9 nights accommodation in luxury hotels",
                "All meals (breakfast, lunch, dinner) with vegetarian options",
                "Private air-conditioned transport throughout",
                "Peddi movie premiere tickets and reserved seating",
                "Celebrity homes external viewing tour with expert guide",
                "All temple entry fees and guided tours",
                "Airport pickup and drop-off",
                "Japanese-speaking tour guide throughout",
                "24/7 emergency support"
            ],
            "exclusions": [
                "International flights to/from India",
                "Travel insurance (strongly recommended)",
                "Personal shopping and souvenirs",
                "Tips for guides and drivers (optional but appreciated)",
                "Any meals not specified in itinerary"
            ],
            "faq": [],
            "bookingLink": null
        },
        {
            "id": 3,
            "slug": "jana-nayagan-vijay-june-2026",
            "category": "Celebrity",
            "title": "Jana Nayagan Event & Vijay Family Experience",
            "shortDescription": "An intimate celebrity tour featuring the Jana Nayagan public event, confirmed meeting with Vijay's parents, beach resort stays, and exclusive access to celebrity homes and temples.",
            "longDescription": "This exclusive tour offers unparalleled access to South Indian cinema culture. Centered around the highly anticipated Jana Nayagan public movie event, this journey includes a confirmed private meeting with superstar Vijay's parents at their home — a rare privilege arranged through Dr. Kanmani's personal connections. Stay at the luxurious Seabreeze Beach Resort, visit celebrity homes, explore ancient temples, and experience traditional Tamil culture including optional customized blouse tailoring. Limited to just 10 guests for a truly personal experience.",
            "startDate": "2026-06-18",
            "endDate": "2026-06-26",
            "durationDays": 9,
            "location": "Chennai, Beach Resorts, Celebrity Locations",
            "priceJPY": 345000,
            "seatsLeft": 10,
            "coverImage": null,
            "galleryImages": [],
            "features": [
                "Confirmed private meeting with Vijay's parents at their home",
                "Attend Jana Nayagan public movie event with premium seats",
                "3 nights at exclusive Seabreeze Beach Resort with beach activities",
                "Visit celebrity residences with insider access",
                "Traditional Tamil family homestay experience on June 19th",
                "Horse riding on the beach and water sports",
                "Ancient temple exploration with cultural expert guides"
            ],
            "itinerary": [
                { "dayNumber": 1, "title": "Arrival & Welcome", "details": "Land in Chennai. VIP airport reception and transfer to luxury hotel. Welcome dinner and tour briefing. Rest and acclimatize." },
                { "dayNumber": 2, "title": "Jana Nayagan Public Event", "details": "The main event! Attend the Jana Nayagan public movie screening with premium reserved seating. Experience the electrifying atmosphere of a Tamil cinema event with thousands of fans. Post-event celebration dinner." },
                { "dayNumber": 3, "title": "Meeting Vijay's Parents", "details": "A once-in-a-lifetime experience. Private arranged meeting at the home of superstar Vijay's parents. Spend quality time in conversation, hear stories about Vijay's journey, and enjoy traditional Tamil hospitality. This meeting is confirmed and exclusive to our group." },
                { "dayNumber": 4, "title": "Movie Screenings & Food Exploration", "details": "Private film screenings of recent Tamil cinema hits. Afternoon food tour exploring Chennai's culinary treasures. Evening shopping at traditional silk markets." },
                { "dayNumber": 5, "title": "Tamil Family Homestay Experience", "details": "Spend the day with a traditional Tamil family. Learn cooking, participate in daily rituals, experience authentic South Indian home life. This cultural immersion offers insights no hotel can provide." },
                { "dayNumber": 6, "title": "Beach Resort & Activities", "details": "Transfer to the stunning Seabreeze Beach Resort. Check into your oceanfront room. Afternoon horse riding on the beach, beach volleyball, and water sports. Sunset dinner by the ocean." },
                { "dayNumber": 7, "title": "Celebrity Homes & Temples", "details": "Morning visit to celebrity residences (external viewing tour). Afternoon temple exploration including historic sites and architectural marvels. Evening cultural performance at the resort." },
                { "dayNumber": 8, "title": "Beach Activities & Customization Workshop", "details": "Full day at leisure at Seabreeze Resort. Optional activities: traditional Rangula Ratnam blouse stitching workshop (view the process or opt for customized blouse making service). Beach time, resort amenities, and relaxation. Vijay's birthday celebration event in the evening (June 22nd special observance)." },
                { "dayNumber": 9, "title": "Departure", "details": "Final breakfast overlooking the ocean. Check-out and transfer to Chennai airport. Depart with memories, friendships, and stories to last a lifetime." }
            ],
            "whatToExpect": [
                "Confirmed private meeting with Vijay's parents at their home",
                "Attend Jana Nayagan public movie event with premium seats",
                "3 nights at Seabreeze Beach Resort",
                "Full Japanese language support"
            ],
            "inclusions": [
                "8 nights luxury accommodation (5-star hotels + Seabreeze Beach Resort)",
                "All meals throughout the tour with special dietary accommodations",
                "Jana Nayagan public event tickets with premium seating",
                "Confirmed private meeting with Vijay's parents at their residence",
                "Celebrity homes tour (Rajinikanth, Dhanush, Vijay)",
                "Beach resort activities: horse riding, beach volleyball, water sports",
                "Temple visits with expert guides and all entry fees",
                "Traditional Rangula Ratnam blouse stitching demonstration",
                "Private air-conditioned luxury transport",
                "Japanese-speaking guide throughout",
                "Airport transfers and 24/7 support"
            ],
            "exclusions": [
                "International flights",
                "Travel insurance",
                "Customized blouse making (available as optional paid activity ¥12,000)",
                "Personal expenses and shopping",
                "Tips (optional)"
            ],
            "faq": [],
            "bookingLink": null
        },
        {
            "id": 4,
            "slug": "ntr-fan-meet-november-2026",
            "category": "Celebrity",
            "title": "NTR Fan Meet & Telugu Cinema Experience",
            "shortDescription": "An exclusive 6-day celebrity tour centered around a confirmed NTR fan meet event, exploring the heart of Telugu cinema culture in Hyderabad and surrounding regions.",
            "longDescription": "Experience the magic of Telugu cinema with this exclusive tour built around a confirmed NTR (Jr. NTR) fan meet event. Hyderabad, the powerhouse of Telugu film industry, serves as our base as we explore film studios, visit iconic locations from blockbuster movies, and immerse ourselves in the vibrant culture of Andhra Pradesh and Telangana. This shorter intensive tour packs maximum celebrity access and cultural experiences into 6 action-packed days, all guided by our expert Japanese-speaking team with insider connections to the Telugu film industry.",
            "startDate": "2026-11-23",
            "endDate": "2026-11-28",
            "durationDays": 6,
            "location": "Hyderabad, Vijayawada, Telugu Film Locations",
            "priceJPY": 285000,
            "seatsLeft": 12,
            "coverImage": null,
            "galleryImages": [],
            "features": [
                "Confirmed NTR fan meet event with close interaction",
                "Behind-the-scenes tour of major Telugu film studios",
                "Visit iconic movie locations from recent blockbusters",
                "Explore Hyderabad's film district and production houses",
                "Golconda Fort sunset experience",
                "Traditional Andhra cuisine cooking class and feast"
            ],
            "itinerary": [
                { "dayNumber": 1, "title": "Arrival in Hyderabad", "details": "Arrive at Rajiv Gandhi International Airport, Hyderabad. VIP meet-and-greet and transfer to luxury hotel in the heart of the city. Evening welcome dinner featuring authentic Hyderabadi biryani and traditional Andhra delicacies. Tour orientation and NTR event briefing." },
                { "dayNumber": 2, "title": "NTR Fan Meet Event", "details": "The main highlight! Attend the exclusive NTR fan meet event with premium access arranged through our industry connections. Experience close interaction with Jr. NTR, photo opportunities, Q&A session, and an unforgettable celebration of Telugu cinema. Evening group celebration dinner." },
                { "dayNumber": 3, "title": "Film Studio & Production Tour", "details": "Full-day behind-the-scenes tour of a major Telugu film studio (Ramoji Film City or active production facility). Witness live shooting if schedules permit, explore elaborate sets, costume departments, and post-production facilities. Learn about the making of Telugu blockbusters from industry professionals. Lunch at the studio cafeteria." },
                { "dayNumber": 4, "title": "Iconic Movie Locations Tour", "details": "Visit famous filming locations from recent Telugu blockbusters. Recreate iconic scenes, take photos at recognizable spots, and hear insider stories about the productions. Afternoon visit to film district where production houses and celebrity offices are located. Evening cultural performance showcasing traditional Kuchipudi dance." },
                { "dayNumber": 5, "title": "Heritage & Culture Day", "details": "Morning visit to the magnificent Golconda Fort with its incredible acoustics and panoramic views. Afternoon explore the historic Charminar and surrounding bazaars for traditional shopping (pearls, bangles, textiles). Participate in an Andhra cooking class followed by a traditional feast. Sunset at Hussain Sagar Lake." },
                { "dayNumber": 6, "title": "Departure", "details": "Final breakfast at the hotel. Last-minute shopping at modern malls for Telugu cinema merchandise and souvenirs. Check-out and transfer to Hyderabad airport for your return flight to Japan. Depart with exclusive memories and insider stories from the world of Telugu cinema." }
            ],
            "whatToExpect": [
                "Confirmed NTR fan meet event with close interaction",
                "Behind-the-scenes tour of major Telugu film studios",
                "Full Japanese language support"
            ],
            "inclusions": [
                "5 nights luxury hotel accommodation in Hyderabad",
                "All meals (breakfast, lunch, dinner) with North and South Indian options",
                "Confirmed NTR fan meet event with premium access",
                "Film studio tour at Ramoji Film City or similar",
                "Private visits to iconic Telugu movie filming locations",
                "Golconda Fort and Charminar guided tours",
                "Traditional Andhra cultural performance evening",
                "Private air-conditioned luxury transport",
                "Japanese-speaking guide throughout",
                "Airport transfers and 24/7 support"
            ],
            "exclusions": [
                "International flights to/from India",
                "Travel insurance (highly recommended)",
                "Personal shopping and souvenirs",
                "Optional activities not listed in itinerary",
                "Tips for guides and drivers (optional)"
            ],
            "faq": [],
            "bookingLink": null
        }
    ];

    console.log('Writing clean src/data/tours.json...');
    fs.writeFileSync(toursJsonPath, JSON.stringify(newTours, null, 4), 'utf8');

    console.log('Connecting to Sanity to delete extra tours...');
    const allSanityTours = await client.fetch(`*[_type == "tour"]{ _id, "slug": slug.current }`);
    const toursToDelete = allSanityTours.filter(st => !targetSlugs.includes(st.slug));

    if (toursToDelete.length > 0) {
        console.log(`Deleting ${toursToDelete.length} extra tours from Sanity...`);
        const mutations = toursToDelete.map(t => ({ delete: { id: t._id } }));
        await client.mutate(mutations);
        toursToDelete.forEach(t => console.log(`Deleted: ${t.slug}`));
    } else {
        console.log('No extra tours to delete from Sanity.');
    }

    console.log('\nSuccess! Reconciled local tours.json and Sanity database.');
}

reconcile().catch(console.error);
