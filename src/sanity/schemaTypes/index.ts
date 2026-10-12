import { type SchemaTypeDefinition } from 'sanity'

import { tourType } from './tourType'
import { faqType } from './faqType'
import { aboutType } from './aboutType'
import { celebrityType } from './celebrityType'
import { categoryType } from './categoryType'
import testimonialType from './testimonialType'
import { countryType } from './countryType'
import { tourDayType } from './tourDayType'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [
        tourType,
        tourDayType,
        faqType,
        aboutType,
        celebrityType,
        categoryType,
        testimonialType,
        countryType,
    ],
}
