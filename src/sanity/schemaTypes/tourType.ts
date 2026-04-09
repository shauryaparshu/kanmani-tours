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
            title: 'Hero Description (shown on tour panel)',
            type: 'text',
            rows: 3,
            description: 'Write 1-2 sentences max. First sentence appears on the tour hero panel. Keep it under 150 characters for best display.',
        }),
        defineField({
            name: 'longDescription',
            title: 'About This Tour',
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
            title: 'Hero Photo (use wide landscape photos only)',
            type: 'image',
            options: {
                hotspot: true,
            },
            description: 'Use wide landscape photos minimum 1400px wide. Avoid close-up or portrait photos — they do not look good as full-screen hero backgrounds.',
        }),
        defineField({
            name: 'galleryImages',
            title: 'Gallery Images',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
        }),
        defineField({
            name: 'features',
            title: 'Tour Highlights',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Up to 6 highlights shown as numbered cards (01, 02, 03...) on the tour detail page',
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
            title: "What You'll Experience",
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'inclusions',
            title: 'Included',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'What is covered in the tour price',
        }),
        defineField({
            name: 'exclusions',
            title: 'Not Included',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'What guests need to arrange or pay for separately',
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
            title: 'External Booking URL (optional)',
            type: 'url',
            description: 'If provided, the Book Now button links here. If empty, the booking modal opens instead.',
        }),
        defineField({
            name: 'featured',
            title: 'Feature on Homepage',
            type: 'boolean',
            description: 'Turn on to feature this tour in the homepage upcoming section',
            initialValue: false,
        }),

    ],
})
