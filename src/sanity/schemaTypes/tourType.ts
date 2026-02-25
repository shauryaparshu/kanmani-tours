import { defineField, defineType } from 'sanity'

export const tourType = defineType({
    name: 'tour',
    title: 'Tour',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Culture Tours', value: 'Cultural' },
                    { title: 'Food Tours', value: 'Food' },
                    { title: 'Celebrity-Related Tours', value: 'Celebrity' },
                    { title: 'Short Tours (1–2 days)', value: 'Short' },
                    { title: 'Ayurveda Tours', value: 'Ayurveda' },
                    { title: 'Homestay with Indian Family', value: 'Homestay' },
                    { title: 'Education Tours', value: 'Education' },
                    { title: 'Industrial Tours', value: 'Industrial' },
                    { title: 'Village Tours', value: 'Village' },
                    { title: 'Cooking Classes', value: 'Cooking' },
                    { title: 'Temple Tours', value: 'Temple' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'shortDescription',
            title: 'Short Description',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'longDescription',
            title: 'Long Description',
            type: 'text',
            rows: 10,
        }),
        defineField({
            name: 'startDate',
            title: 'Start Date',
            type: 'date',
        }),
        defineField({
            name: 'endDate',
            title: 'End Date',
            type: 'date',
        }),
        defineField({
            name: 'isComingSoon',
            title: 'Is Coming Soon',
            type: 'boolean',
            description: 'Check this if the exact dates are not finalized and you want to show "Coming Soon"',
        }),
        defineField({
            name: 'dateDisplay',
            title: 'Date Display Text',
            type: 'string',
            description: 'E.g., "August – October". Overrides start/end date display if Is Coming Soon is true.',
        }),
        defineField({
            name: 'durationDays',
            title: 'Duration (Days)',
            type: 'number',
        }),
        defineField({
            name: 'location',
            title: 'Location',
            type: 'string',
        }),
        defineField({
            name: 'priceJPY',
            title: 'Price (JPY)',
            type: 'number',
        }),
        defineField({
            name: 'priceRangeJPY',
            title: 'Price Range (JPY) - Optional',
            type: 'object',
            fields: [
                { name: 'min', type: 'number', title: 'Min Price' },
                { name: 'max', type: 'number', title: 'Max Price' },
            ]
        }),
        defineField({
            name: 'seatsLeft',
            title: 'Seats Left',
            type: 'number',
        }),
        defineField({
            name: 'coverImage',
            title: 'Cover Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'galleryImages',
            title: 'Gallery Images',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
        }),
        defineField({
            name: 'features',
            title: 'Features',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'itinerary',
            title: 'Itinerary',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'dayNumber', type: 'number' },
                        { name: 'title', type: 'string' },
                        { name: 'details', type: 'text' },
                        { name: 'image', type: 'image' },
                    ],
                },
            ],
        }),
        defineField({
            name: 'whatToExpect',
            title: 'What To Expect',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'inclusions',
            title: 'Inclusions',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'exclusions',
            title: 'Exclusions',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'faq',
            title: 'Tour Specific FAQ',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'question', type: 'string' },
                        { name: 'answer', type: 'text' },
                    ],
                },
            ],
        }),
        defineField({
            name: 'bookingLink',
            title: 'Booking Link',
            type: 'url',
        }),
    ],
})
