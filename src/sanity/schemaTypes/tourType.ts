import { defineField, defineType } from 'sanity'

export const tourType = defineType({
    name: 'tour',
    title: 'Tour',
    type: 'document',
    fields: [

        // ─── BASIC INFORMATION ───────────────────────────────────────
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'titleJa',
            title: 'タイトル（日本語）/ Title in Japanese',
            type: 'string',
            description: 'Japanese translation of the tour title',
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

        // ─── DESCRIPTIONS ────────────────────────────────────────────
        defineField({
            name: 'shortDescription',
            title: 'Hero Description (shown on tour panel)',
            type: 'text',
            rows: 3,
            description: 'Write 1-2 sentences max. First sentence appears on the tour hero panel. Keep it under 150 characters for best display.',
        }),
        defineField({
            name: 'shortDescriptionJa',
            title: '短い説明（日本語）/ Hero Description in Japanese',
            type: 'text',
            rows: 3,
            description: 'Japanese translation of the hero description',
        }),
        defineField({
            name: 'longDescription',
            title: 'About This Tour',
            type: 'text',
            rows: 10,
        }),
        defineField({
            name: 'longDescriptionJa',
            title: '詳細説明（日本語）/ About This Tour in Japanese',
            type: 'text',
            rows: 10,
            description: 'Japanese translation of the full tour description',
        }),

        // ─── DATES & AVAILABILITY ────────────────────────────────────
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
            name: 'dateDisplayJa',
            title: '日程表示（日本語）/ Date Display Text in Japanese',
            type: 'string',
            description: 'Japanese translation of the date display text',
        }),
        defineField({
            name: 'maxGroupSize',
            title: 'Maximum Group Size',
            type: 'number',
            description: 'Maximum number of participants',
            validation: (Rule: any) => Rule.min(1).max(50),
        }),
        defineField({
            name: 'availableSeats',
            title: 'Available Seats',
            type: 'number',
            description: 'Number of seats currently available',
            validation: (Rule: any) => Rule.min(0),
        }),
        defineField({
            name: 'seatsLeft',
            title: 'Seats Left',
            type: 'number',
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Upcoming', value: 'upcoming' },
                    { title: 'Ongoing', value: 'ongoing' },
                    { title: 'Completed', value: 'completed' },
                    { title: 'Cancelled', value: 'cancelled' },
                ],
            },
            initialValue: 'upcoming',
        }),
        defineField({
            name: 'duration',
            title: 'Duration (Days)',
            type: 'number',
            description: 'Total number of days for the tour',
            validation: (Rule: any) => Rule.min(1),
        }),

        // ─── LOCATION & PRICING ──────────────────────────────────────
        defineField({
            name: 'country',
            title: 'Country',
            type: 'reference',
            to: [{ type: 'country' }],
            description: 'Select the country for this tour',
        }),
        defineField({
            name: 'location',
            title: 'Location',
            type: 'string',
        }),
        defineField({
            name: 'locationJa',
            title: '場所（日本語）/ Location in Japanese',
            type: 'string',
            description: 'Japanese translation of location',
        }),



        // ─── MEDIA ───────────────────────────────────────────────────
        defineField({
            name: 'coverImage',
            title: 'Hero Photo (use wide landscape photos only)',
            type: 'image',
            options: { hotspot: true },
            description: 'Use wide landscape photos minimum 1400px wide. Avoid close-up or portrait photos — they do not look good as full-screen hero backgrounds.',
        }),
        defineField({
            name: 'galleryImages',
            title: 'Gallery Images',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
        }),

        // ─── TOUR HIGHLIGHTS (simple bullet list) ────────────────────
        defineField({
            name: 'highlights',
            title: 'Tour Highlights',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Key highlights shown as a bullet list on the tour page',
        }),
        defineField({
            name: 'highlightsJa',
            title: 'ハイライト（日本語）/ Tour Highlights in Japanese',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Japanese translation of tour highlights',
        }),

        // ─── NUMBERED FEATURE CARDS (01, 02, 03...) ──────────────────
        defineField({
            name: 'features',
            title: 'Tour Feature Cards',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Up to 6 features shown as numbered cards (01, 02, 03...) on the tour detail page',
        }),
        defineField({
            name: 'featuresJa',
            title: 'ツアーの特徴（日本語）/ Tour Feature Cards in Japanese',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Japanese translation of the numbered feature cards',
        }),

        // ─── WHAT TO EXPECT ──────────────────────────────────────────
        defineField({
            name: 'whatToExpect',
            title: "What You'll Experience",
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'whatToExpectJa',
            title: "体験できること（日本語）/ What You'll Experience in Japanese",
            type: 'array',
            of: [{ type: 'string' }],
            description: "Japanese translation of What You'll Experience",
        }),

        // ─── ITINERARY ───────────────────────────────────────────────
        defineField({
            name: 'itinerary',
            title: 'Itinerary',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'dayNumber',
                            title: 'Day Number',
                            type: 'number',
                        },
                        {
                            name: 'title',
                            title: 'Day Title (English)',
                            type: 'string',
                        },
                        {
                            name: 'titleJa',
                            title: 'タイトル（日本語）/ Day Title in Japanese',
                            type: 'string',
                        },
                        {
                            name: 'details',
                            title: 'Day Details (English)',
                            type: 'text',
                            rows: 4,
                        },
                        {
                            name: 'detailsJa',
                            title: '詳細（日本語）/ Day Details in Japanese',
                            type: 'text',
                            rows: 4,
                        },
                        {
                            name: 'image',
                            title: 'Day Image',
                            type: 'image',
                            options: { hotspot: true },
                        },
                    ],
                    preview: {
                        select: {
                            title: 'title',
                            titleJa: 'titleJa',
                            dayNumber: 'dayNumber',
                            media: 'image',
                        },
                        prepare(selection: any) {
                            const { title, titleJa, dayNumber, media } = selection
                            return {
                                title: titleJa
                                    ? `Day ${dayNumber}: ${title} / ${titleJa}`
                                    : `Day ${dayNumber}: ${title}`,
                                media: media,
                            }
                        },
                    },
                },
            ],
        }),

        // ─── INCLUSIONS & EXCLUSIONS ─────────────────────────────────
        defineField({
            name: 'inclusions',
            title: 'Included',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'What is covered in the tour price',
        }),
        defineField({
            name: 'inclusionsJa',
            title: '含まれるもの（日本語）/ Inclusions in Japanese',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Japanese translation of included items',
        }),
        defineField({
            name: 'exclusions',
            title: 'Not Included',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'What guests need to arrange or pay for separately',
        }),
        defineField({
            name: 'exclusionsJa',
            title: '含まれないもの（日本語）/ Exclusions in Japanese',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Japanese translation of excluded items',
        }),

        // ─── TOUR SPECIFIC FAQ ───────────────────────────────────────
        defineField({
            name: 'faq',
            title: 'Tour Specific FAQ',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'question',
                            title: 'Question (English)',
                            type: 'string',
                        },
                        {
                            name: 'questionJa',
                            title: '質問（日本語）/ Question in Japanese',
                            type: 'string',
                        },
                        {
                            name: 'answer',
                            title: 'Answer (English)',
                            type: 'text',
                            rows: 4,
                        },
                        {
                            name: 'answerJa',
                            title: '回答（日本語）/ Answer in Japanese',
                            type: 'text',
                            rows: 4,
                        },
                    ],
                    preview: {
                        select: {
                            title: 'question',
                            titleJa: 'questionJa',
                        },
                        prepare(selection: any) {
                            const { title, titleJa } = selection
                            return {
                                title: titleJa
                                    ? `${title} / ${titleJa}`
                                    : title,
                            }
                        },
                    },
                },
            ],
        }),

        // ─── EXTERNAL LINKS & SETTINGS ───────────────────────────────
        defineField({
            name: 'bookingClosed',
            title: 'Close Booking (Booking Close Toggle)',
            type: 'boolean',
            description: 'When toggled on, the Book Now button will be greyed out/disabled across the site.',
            initialValue: false,
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
