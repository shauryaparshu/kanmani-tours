import { type SchemaTypeDefinition } from 'sanity'

import { tourType } from './tourType'
import { faqType } from './faqType'
import { aboutType } from './aboutType'
import { celebrityType } from './celebrityType'
import { categoryType } from './categoryType'
import testimonialType from './testimonialType'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [tourType, faqType, aboutType, celebrityType, categoryType, testimonialType],
}
