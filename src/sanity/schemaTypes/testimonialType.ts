import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name / お名前',
      type: 'string'
    }),
    defineField({
      name: 'location',
      title: 'Location / 場所',
      type: 'string'
    }),
    defineField({
      name: 'locationJa',
      title: '場所（日本語）/ Location in Japanese',
      type: 'string'
    }),
    defineField({
      name: 'text',
      title: 'Testimonial Text (English)',
      type: 'text',
      rows: 5
    }),
    defineField({
      name: 'textJa',
      title: '口コミ（日本語）/ Testimonial in Japanese',
      type: 'text',
      rows: 5
    }),
    defineField({
      name: 'tourName',
      title: 'Tour Name / ツアー名',
      type: 'string'
    }),
    defineField({
      name: 'tourNameJa',
      title: 'ツアー名（日本語）/ Tour Name in Japanese',
      type: 'string'
    }),
    defineField({
      name: 'orderRank',
      title: 'Order',
      type: 'number'
    })
  ],
  orderings: [
    {
      title: 'Order',
      name: 'orderRankAsc',
      by: [{ field: 'orderRank', direction: 'asc' }]
    }
  ]
});
