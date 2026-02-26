import { defineField, defineType } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

export const celebrityType = defineType({
    name: 'celebrity',
    title: 'Celebrity Poll',
    type: 'document',
    orderings: [orderRankOrdering],
    fields: [
        orderRankField({ type: 'celebrity' }),
        defineField({
            name: 'name',
            title: 'Name (English/Default)',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'name_ja',
            title: 'Name (Japanese)',
            type: 'string',
        }),
        defineField({
            name: 'photo',
            title: 'Photo',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
    ],
})
