import { defineQuery } from 'next-sanity'

export const TOURS_QUERY = defineQuery(`*[_type == "tour"] | order(startDate asc) {
  _id,
  title,
  titleJa,
  "slug": slug.current,
  category,
  shortDescription,
  shortDescriptionJa,
  longDescription,
  longDescriptionJa,
  startDate,
  endDate,
  location,
  locationJa,
  priceJPY,
  priceRangeJPY,
  seatsLeft,
  dateDisplay,
  dateDisplayJa,
  coverImage,
  galleryImages,
  features,
  highlightsJa,
  itinerary[] {
    ...,
    titleJa,
    detailsJa,
    image {
      asset-> {
        _id,
        url
      },
      hotspot,
      crop
    }
  },
  whatToExpect,
  whatToExpectJa,
  inclusions,
  inclusionsJa,
  exclusions,
  exclusionsJa,
  faq,
  bookingLink,
  bookingClosed
}`)

export const TOUR_BY_SLUG_QUERY = defineQuery(`*[_type == "tour" && slug.current == $slug][0] {
  _id,
  title,
  titleJa,
  "slug": slug.current,
  category,
  shortDescription,
  shortDescriptionJa,
  longDescription,
  longDescriptionJa,
  startDate,
  endDate,
  location,
  locationJa,
  priceJPY,
  priceRangeJPY,
  seatsLeft,
  dateDisplay,
  dateDisplayJa,
  coverImage,
  galleryImages,
  features,
  highlightsJa,
  itinerary[] {
    ...,
    titleJa,
    detailsJa,
    image {
      asset-> {
        _id,
        url
      },
      hotspot,
      crop
    }
  },
  whatToExpect,
  whatToExpectJa,
  inclusions,
  inclusionsJa,
  exclusions,
  exclusionsJa,
  faq,
  bookingLink,
  bookingClosed
}`)

export const FAQS_QUERY = defineQuery(`
  *[_type == "faq"] | order(category asc, orderRank asc) {
    _id,
    category,
    question,
    questionJa,
    answer,
    answerJa
  }
`)

export const CELEBRITIES_QUERY = defineQuery(`*[_type == "celebrity"] | order(orderRank asc) {
  _id,
  name,
  name_ja,
  photo,
  orderRank
}`)

export const CATEGORIES_QUERY = defineQuery(`*[_type == "tourCategory"] | order(orderRank asc) {
  _id,
  title,
  title_ja,
  key,
  color,
 }`)

export const GALLERY_QUERY = defineQuery(`
  *[_type == "tour" && defined(startDate) && dateTime(startDate + 'T00:00:00Z') < dateTime(now())] 
  | order(startDate desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    startDate,
    endDate,
    coverImage {
      asset-> {
        _id,
        url
      }
    },
    galleryImages[] {
      asset-> {
        _id,
        url
      }
    }
  }
`)

export const TESTIMONIALS_QUERY = defineQuery(`
  *[_type == "testimonial"] | order(orderRank asc) {
    _id,
    name,
    location,
    locationJa,
    text,
    textJa,
    tourName,
    tourNameJa
  }
`)
