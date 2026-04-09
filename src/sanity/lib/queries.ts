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
  location,
  priceJPY,
  priceRangeJPY,
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
  location,
  priceJPY,
  priceRangeJPY,
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

export const FAQS_QUERY = defineQuery(`
  *[_type == "faq"] | order(category asc, orderRank asc) {
    _id,
    category,
    question,
    answer
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
  priority
}`)
