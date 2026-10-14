import React, { useState, useMemo } from 'react';
import { Recipe } from '../types';
import { RecipeCard } from './RecipeCard';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface RecipeCatalogProps {
  recipes: Recipe[];
  savedRecipeIds: string[];
  onToggleSave: (recipeId: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onAddToMealPlan: (recipe: Recipe) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const RecipeCatalog: React.FC<RecipeCatalogProps> = ({
  recipes,
  savedRecipeIds,
  onToggleSave,
  onSelectRecipe,
  onAddToMealPlan,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const [sortBy, setSortBy] = useState<'rating' | 'popular' | 'time' | 'newest'>('rating');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    recipes.forEach(r => r.tags.forEach(t => set.add(t)));
    return ['All', ...Array.from(set)];
  }, [recipes]);

  // Filter & Sort
  const filteredRecipes = useMemo(() => {
    let result = [...recipes];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.author.name.toLowerCase().includes(q) ||
        r.ingredients.some(i => i.name.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'All Dishes') {
      if (selectedCategory === 'Quick < 30m') {
        result = result.filter(r => (r.prepTimeMinutes + r.cookTimeMinutes) <= 30);
      } else if (selectedCategory === 'High-Protein') {
        result = result.filter(r => r.macros.protein >= 20 || r.tags.includes('High-Protein'));
      } else if (selectedCategory === 'Vegetarian') {
        result = result.filter(r => r.tags.includes('Vegetarian'));
      } else {
        result = result.filter(r =>
          r.mealType.toLowerCase() === selectedCategory.toLowerCase() ||
          r.tags.some(t => t.toLowerCase() === selectedCategory.toLowerCase())
        );
      }
    }

    // Secondary Tag filter
    if (selectedTag !== 'All') {
      result = result.filter(r => r.tags.includes(selectedTag));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popular') return b.likesCount - a.likesCount;
      if (sortBy === 'time') return (a.prepTimeMinutes + a.cookTimeMinutes) - (b.prepTimeMinutes + b.cookTimeMinutes);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [recipes, searchQuery, selectedCategory, selectedTag, sortBy]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header and Filter Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Curated Table & Kitchen Archive
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Handcrafted recipes with tested measurements and technique guides.
          </p>
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-xs text-stone-500 font-mono tabular-nums">
            {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
          </span>
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500 ml-1.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-stone-800 text-xs font-medium focus:outline-none pr-2 cursor-pointer"
            >
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
              <option value="time">Fastest Cook</option>
              <option value="newest">Recently Added</option>
            </select>
          </div>
        </div>
      </div>

      {/* Secondary Tags Bar (Interactive buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
        <SlidersHorizontal className="w-4 h-4 text-stone-400 shrink-0 mr-1" />
        {allTags.slice(0, 8).map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors whitespace-nowrap shrink-0 ${
              selectedTag === tag
                ? 'bg-stone-900 text-stone-50'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grid of Recipe Cards */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isSaved={savedRecipeIds.includes(recipe.id)}
              onToggleSave={onToggleSave}
              onSelectRecipe={onSelectRecipe}
              onAddToMealPlan={onAddToMealPlan}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center my-8 max-w-lg mx-auto">
          <p className="font-serif text-lg text-stone-800 mb-2">No culinary creations found</p>
          <p className="text-xs text-stone-500 mb-6 leading-relaxed">
            We couldn’t find recipes matching your filter criteria. Try searching another ingredient or reset filters.
          </p>
          <button
            onClick={() => {
              onSearchChange('');
              onSelectCategory('All Dishes');
              setSelectedTag('All');
            }}
            className="px-4 py-2 text-xs font-medium bg-stone-900 text-stone-50 rounded-lg hover:bg-stone-800 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}

    </section>
  );
};
