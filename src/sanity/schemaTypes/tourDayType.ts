import { defineArrayMember, defineField, defineType } from 'sanity'

export const tourDayType = defineType({
    name: 'tourDay',
    title: 'Tour Day',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'e.g. Day 3, Kyoto',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'date',
            title: 'Date',
            type: 'date',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'photos',
            title: 'Photos',
            type: 'array',
            of: [
                defineArrayMember({
                    name: 'tourDayPhoto',
                    title: 'Photo',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'image',
                            title: 'Image',
                            type: 'image',
                            options: { hotspot: true },
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'caption',
                            title: 'Caption',
                            type: 'string',
                            description: 'Optional caption describing this photograph',
                        }),
                        defineField({
                            name: 'featured',
                            title: 'Featured (Public Highlights)',
                            type: 'boolean',
                            initialValue: false,
                            description: 'Feature this photo in the public highlights gallery',
                        }),
                    ],
                    preview: {
                        select: {
                            media: 'image',
                            title: 'caption',
                            featured: 'featured',
                        },
                        prepare({ media, title, featured }) {
                            return {
                                title: title || 'Untitled Photo',
                                subtitle: featured ? '★ Featured in Highlights' : '',
                                media,
                            }
                        },
                    },
                }),
            ],
            options: {
                layout: 'grid',
            },
        }),
    ],
    orderings: [
        {
            title: 'Date, Ascending',
            name: 'dateAsc',
            by: [{ field: 'date', direction: 'asc' }],
        },
        {
            title: 'Date, Descending',
            name: 'dateDesc',
            by: [{ field: 'date', direction: 'desc' }],
        },
    ],
    preview: {
        select: {
            title: 'title',
            date: 'date',
            photos: 'photos',
        },
        prepare({ title, date, photos }) {
            const count = Array.isArray(photos) ? photos.length : 0;
            return {
                title: title || 'Untitled Tour Day',
                subtitle: `${date || 'No Date'} • ${count} photo${count === 1 ? '' : 's'}`,
            };
        },
    },
})
