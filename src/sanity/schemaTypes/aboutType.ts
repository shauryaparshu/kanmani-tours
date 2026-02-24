import { defineField, defineType } from 'sanity'

export const aboutType = defineType({
    name: 'about',
    title: 'About Page',
    type: 'document',
    fields: [
        defineField({
            name: 'hero',
            title: 'Hero Section',
            type: 'object',
            fields: [
                { name: 'title', type: 'string' },
                { name: 'subtitle', type: 'text' },
                { name: 'image', type: 'image' },
                {
                    name: 'ctaPrimary',
                    type: 'object',
                    fields: [
                        { name: 'text', type: 'string' },
                        { name: 'link', type: 'string' },
                    ],
                },
                {
                    name: 'ctaSecondary',
                    type: 'object',
                    fields: [
                        { name: 'text', type: 'string' },
                        { name: 'link', type: 'string' },
                    ],
                },
            ],
        }),
        defineField({
            name: 'story',
            title: 'Our Story',
            type: 'object',
            fields: [
                { name: 'title', type: 'string' },
                { name: 'content', type: 'array', of: [{ type: 'text' }] },
                { name: 'image', type: 'image' },
            ],
        }),
        defineField({
            name: 'founders',
            title: 'Team Section',
            type: 'object',
            fields: [
                { name: 'title', type: 'string' },
                {
                    name: 'members',
                    type: 'array',
                    of: [
                        {
                            type: 'object',
                            fields: [
                                { name: 'name', type: 'string' },
                                { name: 'role', type: 'string' },
                                { name: 'bio', type: 'text' },
                                { name: 'photo', type: 'image' },
                                { name: 'quote', type: 'string' },
                            ],
                        },
                    ],
                },
            ],
        }),
        defineField({
            name: 'visionMission',
            title: 'Vision & Mission',
            type: 'object',
            fields: [
                {
                    name: 'mission',
                    type: 'object',
                    fields: [
                        { name: 'title', type: 'string' },
                        { name: 'text', type: 'text' },
                    ],
                },
                {
                    name: 'vision',
                    type: 'object',
                    fields: [
                        { name: 'title', type: 'string' },
                        { name: 'text', type: 'text' },
                    ],
                },
                { name: 'values', type: 'array', of: [{ type: 'string' }] },
            ],
        }),
    ],
})
