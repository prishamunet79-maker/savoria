import { Recipe, SocialPost, MealPlanDay, UserProfile, GroceryItem, IngredientCategory } from '../types';
import { INITIAL_RECIPES, INITIAL_SOCIAL_POSTS, INITIAL_MEAL_PLAN, DEFAULT_USER } from '../data/initialData';

const RECIPES_KEY = 'savoria_recipes_v2';
const SOCIAL_KEY = 'savoria_social_v2';
const MEAL_PLAN_KEY = 'savoria_meal_plan_v2';
const USER_KEY = 'savoria_user_v2';
const GROCERY_KEY = 'savoria_grocery_v2';

export function loadStoredRecipes(): Recipe[] {
  try {
    const data = localStorage.getItem(RECIPES_KEY);
    if (!data) return INITIAL_RECIPES;
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_RECIPES;
    
    // Merge: ensure all INITIAL_RECIPES are present, plus any recipes created by user
    const userCreated = parsed.filter((r: Recipe) => r.isUserCreated || !INITIAL_RECIPES.some(init => init.id === r.id));
    return [...INITIAL_RECIPES, ...userCreated];
  } catch {
    return INITIAL_RECIPES;
  }
}

export function saveStoredRecipes(recipes: Recipe[]) {
  try {
    localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
  } catch (e) {
    console.error('Failed to save recipes to storage', e);
  }
}

export function loadStoredSocialPosts(): SocialPost[] {
  try {
    const data = localStorage.getItem(SOCIAL_KEY);
    if (!data) return INITIAL_SOCIAL_POSTS;
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_SOCIAL_POSTS;
    
    const userPosts = parsed.filter((p: SocialPost) => !INITIAL_SOCIAL_POSTS.some(init => init.id === p.id));
    return [...INITIAL_SOCIAL_POSTS, ...userPosts];
  } catch {
    return INITIAL_SOCIAL_POSTS;
  }
}

export function saveStoredSocialPosts(posts: SocialPost[]) {
  try {
    localStorage.setItem(SOCIAL_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to save social posts to storage', e);
  }
}

export function loadStoredMealPlan(): MealPlanDay[] {
  try {
    const data = localStorage.getItem(MEAL_PLAN_KEY);
    if (!data) return INITIAL_MEAL_PLAN;
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length === 7 ? parsed : INITIAL_MEAL_PLAN;
  } catch {
    return INITIAL_MEAL_PLAN;
  }
}

export function saveStoredMealPlan(plan: MealPlanDay[]) {
  try {
    localStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(plan));
  } catch (e) {
    console.error('Failed to save meal plan to storage', e);
  }
}

export function loadStoredUser(): UserProfile {
  try {
    const data = localStorage.getItem(USER_KEY);
    if (!data) return DEFAULT_USER;
    const parsed = JSON.parse(data);
    return parsed?.name ? parsed : DEFAULT_USER;
  } catch {
    return DEFAULT_USER;
  }
}

export function saveStoredUser(user: UserProfile) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user to storage', e);
  }
}

export function loadStoredGroceryList(): GroceryItem[] {
  try {
    const data = localStorage.getItem(GROCERY_KEY);
    if (data) return JSON.parse(data);
    return generateGroceryListFromPlan(INITIAL_MEAL_PLAN);
  } catch {
    return generateGroceryListFromPlan(INITIAL_MEAL_PLAN);
  }
}

export function saveStoredGroceryList(items: GroceryItem[]) {
  try {
    localStorage.setItem(GROCERY_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save grocery items to storage', e);
  }
}

export function generateGroceryListFromPlan(plan: MealPlanDay[]): GroceryItem[] {
  const itemMap = new Map<string, { name: string; amount: string; category: IngredientCategory; sources: Set<string> }>();

  plan.forEach(day => {
    Object.values(day.slots).forEach(recipe => {
      if (!recipe) return;
      recipe.ingredients.forEach(ing => {
        const key = `${ing.name.toLowerCase().trim()}_${ing.unit}`;
        if (!itemMap.has(key)) {
          itemMap.set(key, {
            name: ing.name,
            amount: `${ing.amount} ${ing.unit}`,
            category: ing.category,
            sources: new Set([recipe.title]),
          });
        } else {
          const existing = itemMap.get(key)!;
          existing.sources.add(recipe.title);
          // Try numeric addition if matching unit
          const existingNum = parseFloat(existing.amount);
          if (!isNaN(existingNum)) {
            existing.amount = `${Math.round((existingNum + ing.amount) * 10) / 10} ${ing.unit}`;
          }
        }
      });
    });
  });

  const list: GroceryItem[] = [];
  itemMap.forEach((val, idx) => {
    list.push({
      id: `grocery-${idx}-${Math.random().toString(36).substring(2, 7)}`,
      name: val.name,
      amount: val.amount,
      category: val.category,
      checked: false,
      recipeSource: Array.from(val.sources).slice(0, 2).join(', '),
    });
  });

  return list;
}
