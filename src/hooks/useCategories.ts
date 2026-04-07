import { Category } from "@/types";

/**
 * Placeholder hook for fetching categories.
 * Integration with Sanity client will be added in Phase 2.
 */
export function useCategories() {
  // Placeholder logic
  const categories: Category[] = [];
  const isLoading = false;
  const error = null;

  return { categories, isLoading, error };
}
