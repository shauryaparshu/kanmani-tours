import { type SchemaTypeDefinition } from 'sanity'

import { tourType } from './tourType'
import { faqType } from './faqType'
import { aboutType } from './aboutType'
import { celebrityType } from './celebrityType'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [tourType, faqType, aboutType, celebrityType],
}
