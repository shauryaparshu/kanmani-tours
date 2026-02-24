import { defineQuery } from 'next-sanity'

export const TOURS_QUERY = defineQuery(`*[_type == "tour"] | order(startDate asc) {
  _id,
  title,
  "slug": slug.current,
  category,
  shortDescription,
  longDescription,
  startDate,
  endDate,
  durationDays,
  location,
  priceJPY,
  seatsLeft,
  coverImage,
  galleryImages,
  features,
  itinerary,
  whatToExpect,
  inclusions,
  exclusions,
  faq,
  bookingLink
}`)

export const TOUR_BY_SLUG_QUERY = defineQuery(`*[_type == "tour" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  category,
  shortDescription,
  longDescription,
  startDate,
  endDate,
  durationDays,
  location,
  priceJPY,
  seatsLeft,
  coverImage,
  galleryImages,
  features,
  itinerary,
  whatToExpect,
  inclusions,
  exclusions,
  faq,
  bookingLink
}`)

export const FAQS_QUERY = defineQuery(`*[_type == "faq"] | order(order asc) {
  _id,
  question,
  answer
}`)
