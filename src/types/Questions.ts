import { Category } from "@/hooks/useCategories";

export interface Question {
  id: number;
  text: string;
  category: Category;
}
