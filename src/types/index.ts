export type Difficulty = 'Easy' | 'Intermediate' | 'Artisanal';
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Dessert' | 'Snack' | 'Baking';
export type IngredientCategory = 'Produce' | 'Pantry' | 'Dairy' | 'Protein' | 'Bakery' | 'Spices' | 'Other';

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: IngredientCategory;
  notes?: string;
}

export interface InstructionStep {
  stepNumber: number;
  title: string;
  text: string;
  timerMinutes?: number;
}

export interface RecipeComment {
  id: string;
  author: string;
  avatar: string;
  date: string;
  text: string;
  rating?: number;
  likes: number;
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  summary: string;
  story: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
    badge?: string;
  };
  coverImage: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  mealType: MealType;
  cuisine: string;
  caloriesPerServing: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  tags: string[];
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  chefTips: string[];
  rating: number;
  reviewsCount: number;
  likesCount: number;
  isUserCreated?: boolean;
  createdAt: string;
  comments: RecipeComment[];
}

export interface SocialComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface SocialPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    handle: string;
    isChef?: boolean;
  };
  content: string;
  image?: string;
  recipeAttached?: {
    id: string;
    title: string;
    image: string;
    cookTime: string;
  };
  postType: 'dispatch' | 'remake' | 'tip' | 'question';
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  comments: SocialComment[];
}

export interface MealPlanDay {
  dayName: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  dateLabel: string;
  slots: {
    breakfast?: Recipe | null;
    lunch?: Recipe | null;
    dinner?: Recipe | null;
    snack?: Recipe | null;
  };
}

export interface GroceryItem {
  id: string;
  name: string;
  amount: string;
  category: IngredientCategory;
  checked: boolean;
  recipeSource?: string;
}

export interface UserProfile {
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  dietaryPreferences: string[];
  savedRecipeIds: string[];
}
