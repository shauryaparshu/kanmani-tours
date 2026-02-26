import { defineField, defineType } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

export const categoryType = defineType({
    name: 'tourCategory',
    title: 'Tour Category',
    type: 'document',
    orderings: [orderRankOrdering],
    fields: [
        orderRankField({ type: 'tourCategory' }),
        defineField({
            name: 'title',
            title: 'Title (English)',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'title_ja',
            title: 'Title (Japanese)',
            type: 'string',
        }),
        defineField({
            name: 'key',
            title: 'Value/Key',
            type: 'string',
            description: 'Internal key used for matching (e.g., Cultural, Food)',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'color',
            title: 'Badge Color',
            type: 'string',
            description: 'Hex color code for the badge (e.g., #2563eb)',
        }),
        defineField({
            name: 'priority',
            title: 'Is Priority?',
            type: 'boolean',
            description: 'Whether to show this category in the primary row/priority list',
            initialValue: false,
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'key',
        },
    },
})
