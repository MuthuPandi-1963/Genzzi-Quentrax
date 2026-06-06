// Auto-generated from Prisma model: Category

import { Topic } from './Topic';

export interface Category {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  topics: Topic[];
}

export interface CategoryCreateInput {
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
  topics?: Topic[];
}