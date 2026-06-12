export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Recipe {
  _id?: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookTime: string;
  servings: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  tips?: string[];
  savedAt?: string;
}

export interface GenerateRecipeRequest {
  ingredients: string[];
  preferences?: string;
}
