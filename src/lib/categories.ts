// ─── Tour Category Registry ───────────────────────────────────────────────────
// Central source of truth for all tour categories.

export interface CategoryDef {
    key: string;        // Internal key (matches tour.category)
    label: string;      // Display label
    color: string;      // Badge background color
    priority: boolean;  // Show in primary row (true) or "More" dropdown/section (false)
}

export const TOUR_CATEGORIES: CategoryDef[] = [
    { key: 'Cultural', label: 'Cultural Tours', color: '#2563eb', priority: true },
    { key: 'Food', label: 'Food Tours', color: '#16a34a', priority: true },
    { key: 'Celebrity', label: 'Celebrity Tours', color: '#7c3aed', priority: true },
    { key: 'Short', label: 'Short Tours (1–2 days)', color: '#f59e0b', priority: true },
    { key: 'Ayurveda', label: 'Ayurveda Tours', color: '#14b8a6', priority: true },
    { key: 'Homestay', label: 'Homestay with Indian Family', color: '#e11d48', priority: true },
    { key: 'Education', label: 'Education Tours', color: '#6366f1', priority: false },
    { key: 'Industrial', label: 'Industrial Tours', color: '#475569', priority: false },
    { key: 'Village', label: 'Village Tours', color: '#84cc16', priority: false },
    { key: 'Cooking', label: 'Cooking Classes', color: '#ea580c', priority: false },
    { key: 'Temple', label: 'Temple Tours', color: '#b45309', priority: false },
];

export const CATEGORY_MAP = Object.fromEntries(
    TOUR_CATEGORIES.map(c => [c.key, c])
);

export function getCategoryColor(key: string): string {
    return CATEGORY_MAP[key]?.color ?? '#64748b';
}

export function getCategoryLabel(key: string): string {
    return CATEGORY_MAP[key]?.label ?? key;
}
