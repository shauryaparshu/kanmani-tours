import { client } from '@/sanity/lib/client';
import { CATEGORIES_QUERY } from '@/sanity/lib/queries';

// ─── Tour Category Registry ───────────────────────────────────────────────────
// Central source of truth for all tour categories.

export interface CategoryDef {
    key: string;        // Internal key (matches tour.category)
    label: string;      // Display label
    color: string;      // Badge background color
    priority: boolean;  // Show in primary row (true) or "More" dropdown/section (false)
}

export const TOUR_CATEGORIES_FALLBACK: CategoryDef[] = [
    { key: 'Cultural', label: 'Culture Tours', color: '#2563eb', priority: true },
    { key: 'Food', label: 'Food Tours', color: '#16a34a', priority: true },
    { key: 'Celebrity', label: 'Celebrity-Related Tours', color: '#7c3aed', priority: true },
    { key: 'Short', label: 'Short Tours (1–2 days)', color: '#f59e0b', priority: true },
    { key: 'Ayurveda', label: 'Ayurveda Tours', color: '#14b8a6', priority: true },
    { key: 'Homestay', label: 'Homestay with Indian Family', color: '#e11d48', priority: true },
    { key: 'Education', label: 'Education Tours', color: '#6366f1', priority: false },
    { key: 'Industrial', label: 'Industrial Tours', color: '#475569', priority: false },
    { key: 'Village', label: 'Village Tours', color: '#84cc16', priority: false },
    { key: 'Cooking', label: 'Cooking Classes', color: '#ea580c', priority: false },
    { key: 'Temple', label: 'Temple Tours', color: '#b45309', priority: false },
];

export async function getAllCategories(locale: string = 'ja'): Promise<CategoryDef[]> {
    const isJa = locale === 'ja';
    try {
        const sanityCats = await client.fetch(CATEGORIES_QUERY, {}, { next: { revalidate: 60 } });
        if (sanityCats && sanityCats.length > 0) {
            return sanityCats.map((c: any) => ({
                key: c.key,
                label: (isJa && c.title_ja) ? c.title_ja : c.title,
                color: c.color || '#64748b',
                priority: c.priority || false
            }));
        }
    } catch (error) {
        console.error('Error fetching categories from Sanity:', error);
    }
    return TOUR_CATEGORIES_FALLBACK;
}

export function getCategoryColor(key: string, categories: CategoryDef[] = TOUR_CATEGORIES_FALLBACK): string {
    return categories.find(c => c.key === key)?.color ?? '#64748b';
}

export function getCategoryLabel(key: string, categories: CategoryDef[] = TOUR_CATEGORIES_FALLBACK): string {
    return categories.find(c => c.key === key)?.label ?? key;
}
