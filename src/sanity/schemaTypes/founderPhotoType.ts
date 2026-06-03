import { defineField, defineType } from 'sanity'

export const founderPhotoType = defineType({
  name: 'founderPhoto',
  title: 'Founder Photo',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption (English)',
      type: 'string',
      description: 'One line describing what is happening in this photo',
    }),
    defineField({
      name: 'captionJa',
      title: 'キャプション（日本語）/ Caption in Japanese',
      type: 'string',
    }),
    defineField({
      name: 'era',
      title: 'Era / Album',
      type: 'string',
      options: {
        list: [
          { title: 'Student Life', value: 'student' },
          { title: 'PhD & Academic', value: 'phd' },
          { title: 'Humanitarian', value: 'humanitarian' },
          { title: 'Tours', value: 'tours' },
          { title: 'Celebrity', value: 'celebrity' },
          { title: 'Conferences', value: 'conferences' },
          { title: 'Recent', value: 'recent' },
          { title: 'News & Media', value: 'news-media' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year (approximate)',
      type: 'number',
      description: 'Approximate year the photo was taken',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'City or country where photo was taken',
    }),
    defineField({
      name: 'featured',
      title: 'Feature in Timeline',
      type: 'boolean',
      description: 'Turn on to show this photo as the representative photo in the timeline section',
      initialValue: false,
    }),
    defineField({
      name: 'orderRank',
      title: 'Order within Era',
      type: 'number',
      description: 'Lower numbers appear first within the same era',
    }),
  ],
  preview: {
    select: {
      title: 'caption',
      subtitle: 'era',
      media: 'image',
    },
  },
})
