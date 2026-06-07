import { defineField, defineType } from 'sanity'
import FounderPhotosInput from '../components/FounderPhotosInput'

export const aboutType = defineType({
    name: 'about',
    title: 'About Founder',
    type: 'document',
    fields: [
        defineField({
            name: 'founderPhotos',
            title: 'Founder Photos Gallery',
            description: 'Drop multiple images here to create founder photo entries quickly. You can still refine captions, eras, and metadata below.',
            type: 'array',
            options: {
                layout: 'grid',
            },
            components: {
                input: FounderPhotosInput,
            },
            of: [
                {
                    type: 'object',
                    name: 'founderPhoto',
                    title: 'Founder Photo',
                    fields: [
                        {
                            name: 'image',
                            title: 'Photo',
                            type: 'image',
                            options: {
                                hotspot: true,
                            },
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'caption',
                            title: 'Caption (English)',
                            type: 'string',
                            description: 'One line describing what is happening in this photo',
                        },
                        {
                            name: 'captionJa',
                            title: 'キャプション（日本語）/ Caption in Japanese',
                            type: 'string',
                        },
                        {
                            name: 'era',
                            title: 'Era / Album',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Celebrity', value: 'celebrity' },
                                    { title: 'News Media', value: 'news-media' },
                                    { title: 'Achievements', value: 'achievements' },
                                    { title: 'Student Life and PhD', value: 'student-phd' },
                                    { title: 'World Travel', value: 'world-travel' },
                                    { title: 'Tours', value: 'tours' },
                                    { title: 'Conferences', value: 'conferences' },
                                    { title: 'Humanitarian', value: 'humanitarian' },
                                    { title: 'PhD', value: 'phd' },
                                    { title: 'Student', value: 'student' },
                                    { title: 'Arts', value: 'arts' },
                                    { title: 'Others', value: 'others' },
                                ],
                            },
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: 'year',
                            title: 'Year (approximate)',
                            type: 'number',
                            description: 'Approximate year the photo was taken',
                        },
                        {
                            name: 'location',
                            title: 'Location',
                            type: 'string',
                            description: 'City or country where photo was taken',
                            hidden: ({ parent }) => parent?.era === 'world-travel',
                        },
                        {
                            name: 'country',
                            title: 'Country (for World Travel)',
                            type: 'reference',
                            to: [{ type: 'country' }],
                            hidden: ({ parent }) => parent?.era !== 'world-travel',
                            description: 'Select the country for World Travel album sub-albums',
                        },
                        {
                            name: 'featured',
                            title: 'Feature in Timeline',
                            type: 'boolean',
                            description: 'Turn on to show this photo as the representative photo in the timeline section',
                            initialValue: false,
                        },
                    ],
                    preview: {
                        select: {
                            title: 'caption',
                            subtitle: 'era',
                            media: 'image',
                        },
                    },
                }
            ]
        }),
    ],
})
