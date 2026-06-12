import { Topic } from "@prisma/client";

export interface CategoryResponse {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  topics?: Topic[];
}

export interface CategoryListResponse {
  categories: CategoryResponse[];
  count: number;
}
