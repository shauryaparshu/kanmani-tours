import { defineField, defineType } from 'sanity'

export const countryType = defineType({
    name: 'country',
    title: 'Country',
    type: 'document',
    fields: [
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
            description: 'Internal key used for matching (e.g., india, japan, sri-lanka)',
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'key',
        },
    },
})
