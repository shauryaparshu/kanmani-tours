import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schema } from './src/sanity/schemaTypes'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'

// Define the singleton types
const singletonTypes = new Set(['about'])

// Define the singleton actions
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
    basePath: '/studio',
    projectId,
    dataset,
    schema: {
        types: schema.types,
        // Filter out singleton types from the global “New document” menu
        templates: (templates) =>
            templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
    },
    document: {
        // For singleton types, filter out actions that are not explicitly allowed
        actions: (input, context) =>
            singletonTypes.has(context.schemaType)
                ? input.filter(({ action }) => action && singletonActions.has(action))
                : input,
    },
    plugins: [
        structureTool({
            structure: (S, context) =>
                S.list()
                    .title('Content')
                    .items([
                        // Singleton: About Page
                        S.listItem()
                            .title('About Page')
                            .id('about')
                            .child(
                                S.document()
                                    .schemaType('about')
                                    .documentId('about')
                            ),
                        S.divider(),
                        orderableDocumentListDeskItem({
                            type: 'faq',
                            title: 'FAQs',
                            S,
                            context,
                        }),
                        S.divider(),
                        orderableDocumentListDeskItem({
                            type: 'celebrity',
                            title: 'Celebrity Poll',
                            S,
                            context,
                        }),
                        S.divider(),
                        // Regular document types
                        ...S.documentTypeListItems().filter(
                            (listItem) => !singletonTypes.has(listItem.getId() || '') &&
                                !['faq', 'celebrity'].includes(listItem.getId() || '')
                        ),
                    ]),
        }),
        visionTool({ defaultApiVersion: apiVersion }),
    ],
})
