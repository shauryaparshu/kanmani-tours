import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cnqy4tz5',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

const tours = [
  {
    _type: "tour",
    status: "upcoming",
    title: "Peddi Movie Premiere & South India Cultural Tour",
    slug: { _type: "slug", current: "peddi-movie-premiere-june-2026" },
    category: "Celebrity",
    startDate: "2026-06-02",
    endDate: "2026-06-11",
    duration: 10,
    durationDays: 10,
    location: "Chennai, Mahabalipuram, Trichy",
    price: 298000,
    priceJPY: 298000,
    currency: "JPY",
    maxGroupSize: 12,
    availableSeats: 12,
    seatsLeft: 12,
    featured: false,
    shortDescription: "Experience the Peddi movie premiere, visit celebrity homes, explore ancient temples, and discover the cultural heart of South India over 10 unforgettable days.",
    longDescription: "Join us for an exclusive journey combining cinema, culture, and coastal beauty. This tour offers a rare opportunity to attend the premiere screening of the highly anticipated Tamil film Peddi, visit the homes of South Indian cinema legends, and explore UNESCO World Heritage temples. From the vibrant streets of Chennai to the serene beaches of Mahabalipuram and the architectural marvels of Trichy, every day brings new discoveries. Our Japanese-speaking guides ensure seamless communication throughout your journey.",
    inclusions: [
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
    exclusions: [
      "International flights to/from India",
      "Travel insurance (strongly recommended)",
      "Personal shopping and souvenirs",
      "Tips for guides and drivers (optional but appreciated)",
      "Any meals not specified in itinerary"
    ],
    highlights: [
      "Attend the exclusive premiere of Peddi Tamil movie",
      "Visit celebrity homes of Rajinikanth, Dhanush, and Vijay",
      "Explore Mahabalipuram UNESCO World Heritage rock temples",
      "Experience traditional Chennai food tour and shopping",
      "Visit ancient temples in Trichy including Kabaleshwar Temple",
      "Enjoy beach time at Marina Beach and temple town exploration"
    ],
    features: [
      "Attend the exclusive premiere of Peddi Tamil movie",
      "Visit celebrity homes of Rajinikanth, Dhanush, and Vijay",
      "Explore Mahabalipuram UNESCO World Heritage rock temples",
      "Experience traditional Chennai food tour and shopping",
      "Visit ancient temples in Trichy including Kabaleshwar Temple",
      "Enjoy beach time at Marina Beach and temple town exploration"
    ],
    itinerary: [
      {
        _key: "day_1",
        dayNumber: 1,
        title: "Arrival in India",
        details: "Arrive at Chennai International Airport. Our team will greet you at arrivals and transfer you to your luxury hotel. Evening welcome dinner and tour orientation with your Japanese-speaking guide. Rest and prepare for the exciting journey ahead."
      },
      {
        _key: "day_2",
        dayNumber: 2,
        title: "Free Day in Chennai",
        details: "Relax and recover from your journey. Optional activities available: explore local markets, visit nearby temples, or simply enjoy your hotel's amenities. Evening briefing about the Peddi movie premiere tomorrow."
      },
      {
        _key: "day_3",
        dayNumber: 3,
        title: "Peddi Movie Premiere Event",
        details: "The highlight begins! Attend the exclusive premiere screening of Peddi at LB Stadium. Reserved seating arranged for our group. Experience the excitement of a Tamil cinema premiere with fans, media, and special guests. Evening celebration dinner."
      },
      {
        _key: "day_4",
        dayNumber: 4,
        title: "Private Premier Show & Celebrity Homes",
        details: "Morning private screening with the lead actor in attendance. Afternoon tour visiting the external grounds of celebrity homes including Rajinikanth, Dhanush, and Vijay's residences. Evening free for personal exploration."
      },
      {
        _key: "day_5",
        dayNumber: 5,
        title: "Chennai Food & Shopping Tour",
        details: "Immerse yourself in Chennai's culinary scene. Visit traditional markets, sample authentic South Indian breakfast, explore shopping districts for silk sarees and handicrafts. Lunch at a heritage restaurant. Evening at leisure."
      },
      {
        _key: "day_6",
        dayNumber: 6,
        title: "Mahabalipuram UNESCO Heritage Sites",
        details: "Journey to the coastal town of Mahabalipuram. Explore the UNESCO World Heritage rock-cut temples including Shore Temple and Pancha Rathas. Enjoy beach time at pristine Mahabalipuram beach. Overnight in beach resort."
      },
      {
        _key: "day_7",
        dayNumber: 7,
        title: "Temples & Cultural Experiences",
        details: "Visit ancient temples in the region. Experience traditional cultural activities. Lunch at a local family home for authentic Tamil hospitality. Evening cultural performance showcasing classical South Indian dance and music."
      },
      {
        _key: "day_8",
        dayNumber: 8,
        title: "Trichy Temple Trail",
        details: "Travel to Trichy. Visit the magnificent Kabaleshwar Temple, Perumallkoil, Varadaraja Temple, and the iconic Tripliken rock fort temple. Explore the spiritual heart of Tamil Nadu with expert guides explaining the rich history and architecture."
      },
      {
        _key: "day_9",
        dayNumber: 9,
        title: "Marina Beach & Temple Town",
        details: "Return to Chennai. Visit Marina Beach, one of the longest urban beaches in the world. Final temple visits and last-minute shopping. Farewell dinner celebrating the incredible journey. Pack and prepare for departure."
      },
      {
        _key: "day_10",
        dayNumber: 10,
        title: "Departure",
        details: "Breakfast at the hotel. Check-out and transfer to Chennai International Airport for your flight back to Japan. Depart with unforgettable memories and new friendships."
      }
    ]
  },
  {
    _type: "tour",
    status: "upcoming",
    title: "Jana Nayagan Event & Vijay Family Experience",
    slug: { _type: "slug", current: "jana-nayagan-vijay-june-2026" },
    category: "Celebrity",
    startDate: "2026-06-18",
    endDate: "2026-06-26",
    duration: 9,
    durationDays: 9,
    location: "Chennai, Beach Resorts, Celebrity Locations",
    price: 345000,
    priceJPY: 345000,
    currency: "JPY",
    maxGroupSize: 10,
    availableSeats: 10,
    seatsLeft: 10,
    featured: true,
    shortDescription: "An intimate celebrity tour featuring the Jana Nayagan public event, confirmed meeting with Vijay's parents, beach resort stays, and exclusive access to celebrity homes and temples.",
    longDescription: "This exclusive tour offers unparalleled access to South Indian cinema culture. Centered around the highly anticipated Jana Nayagan public movie event, this journey includes a confirmed private meeting with superstar Vijay's parents at their home — a rare privilege arranged through Dr. Kanmani's personal connections. Stay at the luxurious Seabreeze Beach Resort, visit celebrity homes, explore ancient temples, and experience traditional Tamil culture including optional customized blouse tailoring. Limited to just 10 guests for a truly personal experience.",
    inclusions: [
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
    exclusions: [
      "International flights",
      "Travel insurance",
      "Customized blouse making (available as optional paid activity ¥12,000)",
      "Personal expenses and shopping",
      "Tips (optional)"
    ],
    highlights: [
      "Confirmed private meeting with Vijay's parents at their home",
      "Attend Jana Nayagan public movie event with premium seats",
      "3 nights at exclusive Seabreeze Beach Resort with beach activities",
      "Visit celebrity residences with insider access",
      "Traditional Tamil family homestay experience on June 19th",
      "Horse riding on the beach and water sports",
      "Ancient temple exploration with cultural expert guides"
    ],
    features: [
      "Confirmed private meeting with Vijay's parents at their home",
      "Attend Jana Nayagan public movie event with premium seats",
      "3 nights at exclusive Seabreeze Beach Resort with beach activities",
      "Visit celebrity residences with insider access",
      "Traditional Tamil family homestay experience on June 19th",
      "Horse riding on the beach and water sports",
      "Ancient temple exploration with cultural expert guides"
    ],
    itinerary: [
      {
        _key: "day_1",
        dayNumber: 1,
        title: "Arrival & Welcome",
        details: "Land in Chennai. VIP airport reception and transfer to luxury hotel. Welcome dinner and tour briefing. Rest and acclimatize."
      },
      {
        _key: "day_2",
        dayNumber: 2,
        title: "Jana Nayagan Public Event",
        details: "The main event! Attend the Jana Nayagan public movie screening with premium reserved seating. Experience the electrifying atmosphere of a Tamil cinema event with thousands of fans. Post-event celebration dinner."
      },
      {
        _key: "day_3",
        dayNumber: 3,
        title: "Meeting Vijay's Parents",
        details: "A once-in-a-lifetime experience. Private arranged meeting at the home of superstar Vijay's parents. Spend quality time in conversation, hear stories about Vijay's journey, and enjoy traditional Tamil hospitality. This meeting is confirmed and exclusive to our group."
      },
      {
        _key: "day_4",
        dayNumber: 4,
        title: "Movie Screenings & Food Exploration",
        details: "Private film screenings of recent Tamil cinema hits. Afternoon food tour exploring Chennai's culinary treasures. Evening shopping at traditional silk markets."
      },
      {
        _key: "day_5",
        dayNumber: 5,
        title: "Tamil Family Homestay Experience",
        details: "Spend the day with a traditional Tamil family. Learn cooking, participate in daily rituals, experience authentic South Indian home life. This cultural immersion offers insights no hotel can provide."
      },
      {
        _key: "day_6",
        dayNumber: 6,
        title: "Beach Resort & Activities",
        details: "Transfer to the stunning Seabreeze Beach Resort. Check into your oceanfront room. Afternoon horse riding on the beach, beach volleyball, and water sports. Sunset dinner by the ocean."
      },
      {
        _key: "day_7",
        dayNumber: 7,
        title: "Celebrity Homes & Temples",
        details: "Morning visit to celebrity residences (external viewing tour). Afternoon temple exploration including historic sites and architectural marvels. Evening cultural performance at the resort."
      },
      {
        _key: "day_8",
        dayNumber: 8,
        title: "Beach Activities & Customization Workshop",
        details: "Full day at leisure at Seabreeze Resort. Optional activities: traditional Rangula Ratnam blouse stitching workshop (view the process or opt for customized blouse making service). Beach time, resort amenities, and relaxation. Vijay's birthday celebration event in the evening (June 22nd special observance)."
      },
      {
        _key: "day_9",
        dayNumber: 9,
        title: "Departure",
        details: "Final breakfast overlooking the ocean. Check-out and transfer to Chennai airport. Depart with memories, friendships, and stories to last a lifetime."
      }
    ]
  },
  {
    _type: "tour",
    status: "upcoming",
    title: "NTR Fan Meet & Telugu Cinema Experience",
    slug: { _type: "slug", current: "ntr-fan-meet-november-2026" },
    category: "Celebrity",
    startDate: "2026-11-23",
    endDate: "2026-11-28",
    duration: 6,
    durationDays: 6,
    location: "Hyderabad, Vijayawada, Telugu Film Locations",
    price: 285000,
    priceJPY: 285000,
    currency: "JPY",
    maxGroupSize: 12,
    availableSeats: 12,
    seatsLeft: 12,
    featured: true,
    shortDescription: "An exclusive 6-day celebrity tour centered around a confirmed NTR fan meet event, exploring the heart of Telugu cinema culture in Hyderabad and surrounding regions.",
    longDescription: "Experience the magic of Telugu cinema with this exclusive tour built around a confirmed NTR (Jr. NTR) fan meet event. Hyderabad, the powerhouse of Telugu film industry, serves as our base as we explore film studios, visit iconic locations from blockbuster movies, and immerse ourselves in the vibrant culture of Andhra Pradesh and Telangana. This shorter intensive tour packs maximum celebrity access and cultural experiences into 6 action-packed days, all guided by our expert Japanese-speaking team with insider connections to the Telugu film industry.",
    inclusions: [
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
    exclusions: [
      "International flights to/from India",
      "Travel insurance (highly recommended)",
      "Personal shopping and souvenirs",
      "Optional activities not listed in itinerary",
      "Tips for guides and drivers (optional)"
    ],
    highlights: [
      "Confirmed NTR fan meet event with close interaction",
      "Behind-the-scenes tour of major Telugu film studios",
      "Visit iconic movie locations from recent blockbusters",
      "Explore Hyderabad's film district and production houses",
      "Golconda Fort sunset experience",
      "Traditional Andhra cuisine cooking class and feast"
    ],
    features: [
      "Confirmed NTR fan meet event with close interaction",
      "Behind-the-scenes tour of major Telugu film studios",
      "Visit iconic movie locations from recent blockbusters",
      "Explore Hyderabad's film district and production houses",
      "Golconda Fort sunset experience",
      "Traditional Andhra cuisine cooking class and feast"
    ],
    itinerary: [
      {
        _key: "day_1",
        dayNumber: 1,
        title: "Arrival in Hyderabad",
        details: "Arrive at Rajiv Gandhi International Airport, Hyderabad. VIP meet-and-greet and transfer to luxury hotel in the heart of the city. Evening welcome dinner featuring authentic Hyderabadi biryani and traditional Andhra delicacies. Tour orientation and NTR event briefing."
      },
      {
        _key: "day_2",
        dayNumber: 2,
        title: "NTR Fan Meet Event",
        details: "The main highlight! Attend the exclusive NTR fan meet event with premium access arranged through our industry connections. Experience close interaction with Jr. NTR, photo opportunities, Q&A session, and an unforgettable celebration of Telugu cinema. Evening group celebration dinner."
      },
      {
        _key: "day_3",
        dayNumber: 3,
        title: "Film Studio & Production Tour",
        details: "Full-day behind-the-scenes tour of a major Telugu film studio (Ramoji Film City or active production facility). Witness live shooting if schedules permit, explore elaborate sets, costume departments, and post-production facilities. Learn about the making of Telugu blockbusters from industry professionals. Lunch at the studio cafeteria."
      },
      {
        _key: "day_4",
        dayNumber: 4,
        title: "Iconic Movie Locations Tour",
        details: "Visit famous filming locations from recent Telugu blockbusters. Recreate iconic scenes, take photos at recognizable spots, and hear insider stories about the productions. Afternoon visit to film district where production houses and celebrity offices are located. Evening cultural performance showcasing traditional Kuchipudi dance."
      },
      {
        _key: "day_5",
        dayNumber: 5,
        title: "Heritage & Culture Day",
        details: "Morning visit to the magnificent Golconda Fort with its incredible acoustics and panoramic views. Afternoon explore the historic Charminar and surrounding bazaars for traditional shopping (pearls, bangles, textiles). Participate in an Andhra cooking class followed by a traditional feast. Sunset at Hussain Sagar Lake."
      },
      {
        _key: "day_6",
        dayNumber: 6,
        title: "Departure",
        details: "Final breakfast at the hotel. Last-minute shopping at modern malls for Telugu cinema merchandise and souvenirs. Check-out and transfer to Hyderabad airport for your return flight to Japan. Depart with exclusive memories and insider stories from the world of Telugu cinema."
      }
    ]
  }
];

export async function run() {
  try {
    const titles = tours.map(t => t.title);
    console.log('Checking for existing tours with matching titles...');
    const existing = await client.fetch(`*[_type == "tour" && title in $titles]._id`, { titles });
    
    if (existing.length > 0) {
      console.log(`Deleting ${existing.length} existing tours...`);
      const deletions = existing.map((id) => ({ delete: { id } }));
      await client.mutate(deletions);
      console.log(`Deleted ${existing.length} existing tours with matching titles`);
    } else {
      console.log('No existing tours with matching titles found.');
    }

    console.log('Seeding new tours...');
    const transaction = client.transaction();
    tours.forEach((tour) => {
      // Generate a predictable ID based on the slug to prevent future duplicates
      const tourDoc = {
        _id: `tour-${tour.slug.current}`,
        ...tour
      };
      transaction.createOrReplace(tourDoc);
    });
    
    await transaction.commit();
    console.log('\nSuccess! Successfully seeded upcoming tours into Sanity:\n');
    tours.forEach((tour) => {
      console.log(`- ${tour.title}`);
    });
  } catch (error) {
    console.error('Error seeding tours:', error);
    throw error;
  }
}

// Call the run function at the end of the file
run().catch(console.error);
