import type { CategoryDef } from '@/lib/categories';

// Tour category keys and their translated labels in the Tours messages.
const MESSAGE_KEYS: Record<string, string> = {
    Cultural: 'cultureTours',
    Food: 'foodTours',
    Celebrity: 'celebrityTours',
    Short: 'shortTours',
    Ayurveda: 'ayurvedaTours',
    Homestay: 'homestay',
    Education: 'educationTours',
    Industrial: 'industrialTours',
    Village: 'villageTours',
    Cooking: 'cookingClasses',
    Temple: 'templeTours',
};

const JAPANESE = /[぀-ヿ㐀-鿿]/;

/**
 * On the Japanese site, a category that has no Japanese title in Sanity falls
 * back to the translated label in messages. A Japanese title set in Sanity wins.
 */
export function localizeCategories(
    categories: CategoryDef[],
    locale: string,
    translate: (key: string) => string,
): CategoryDef[] {
    if (locale !== 'ja') return categories;
    return categories.map((c) =>
        !JAPANESE.test(c.label) && MESSAGE_KEYS[c.key] ? { ...c, label: translate(MESSAGE_KEYS[c.key]) } : c,
    );
}
