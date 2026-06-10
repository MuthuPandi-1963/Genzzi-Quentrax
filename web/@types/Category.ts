// =============================================================================
// MODEL: Category
// =============================================================================

import type { Topic } from './Topic';

export interface Category {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // ── Relations ─────────────────────────────────────────────────────────────
  topics?: Topic[];
}

export interface CategoryCreateInput {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
}

export interface CategoryUpdateInput {
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
  deletedAt?: Date | null;
}