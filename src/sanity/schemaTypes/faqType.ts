import { defineField, defineType } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

export const faqType = defineType({
    name: 'faq',
    title: 'FAQ',
    type: 'document',
    orderings: [orderRankOrdering],
    fields: [
        orderRankField({ type: 'faq' }),
        defineField({
            name: 'category',
            title: 'FAQ Category',
            type: 'string',
            validation: (Rule) => Rule.required(),
            options: {
                list: [
                    { title: 'Booking & Payment', value: 'booking' },
                    { title: 'Visa & Travel Documents', value: 'visa' },
                    { title: 'The Tour Experience', value: 'experience' },
                    { title: 'Safety & Health', value: 'health' },
                    { title: 'Money & Practical', value: 'money' },
                    { title: 'Weather & Timing', value: 'weather' },
                    { title: 'Celebrity & Special Tours', value: 'celebrity' },
                ],
            },
            description: 'Choose which category this FAQ belongs to. This controls which section it appears under on the website.',
        }),
        defineField({
            name: 'question',
            title: 'Question',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'answer',
            title: 'Answer',
            type: 'text',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'order',
            title: 'Order (Legacy)',
            type: 'number',
        }),
    ],
    preview: {
        select: {
            title: 'question',
            subtitle: 'answer',
        },
    },
})


