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
})

