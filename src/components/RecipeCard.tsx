import React, { useState } from 'react';
import { Heart, Clock, ChefHat, CalendarPlus, Star } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  isSaved: boolean;
  onToggleSave: (recipeId: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onAddToMealPlan: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isSaved,
  onToggleSave,
  onSelectRecipe,
  onAddToMealPlan,
}) => {
  const [imageLoaded, setImageLoaded] = useState(true);

  const recipeUrl = `/recipe/${recipe.slug}`;

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelectRecipe(recipe);
  };

  return (
    <article className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      
      {/* Top Image Section with unique recipe URL */}
      <a
        href={recipeUrl}
        onClick={handleCardClick}
        className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 block cursor-pointer"
        aria-label={`View full recipe and culinary guide for ${recipe.title}`}
      >
        <span className="sr-only">View recipe: {recipe.title}</span>
        {imageLoaded ? (
          <img
            src={recipe.coverImage}
            alt={`Artisanal ${recipe.title} prepared in ${recipe.cuisine} style`}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImageLoaded(false)}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-200 text-stone-500 p-4 text-center">
            <ChefHat className="w-8 h-8 mb-2 opacity-50 text-stone-700" />
            <span className="text-xs font-serif">{recipe.title}</span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSave(recipe.id);
          }}
          title={isSaved ? 'Remove from Saved' : 'Save to My Cookbook'}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-stone-700 hover:text-rose-600 shadow-sm transition-transform active:scale-90 z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isSaved ? 'fill-rose-500 text-rose-500' : 'text-stone-700'
            }`}
          />
        </button>

        {/* Cuisine / Meal indicator */}
        <div className="absolute bottom-3 left-3 px-2 py-0.5 text-[11px] font-medium tracking-wide bg-stone-900/80 text-stone-100 backdrop-blur-sm rounded">
          {recipe.cuisine} · {recipe.mealType}
        </div>
      </a>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata with Typographic Separators */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes}m total</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{recipe.difficulty}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{recipe.caloriesPerServing} kcal</span>
          </div>

          {/* Title Link */}
          <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-2 leading-snug mb-2">
            <a href={recipeUrl} onClick={handleCardClick}>
              {recipe.title}
            </a>
          </h3>

          {/* Summary */}
          <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed mb-4">
            {recipe.summary}
          </p>
        </div>

        {/* Footer: Author & Quick Action */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={recipe.author.avatar}
              alt={`Portrait of chef ${recipe.author.name}`}
              width="24"
              height="24"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full object-cover border border-stone-200"
            />
            <span className="text-xs text-stone-700 font-medium truncate max-w-[110px]">
              {recipe.author.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-stone-700 font-mono">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span className="tabular-nums font-semibold">{recipe.rating.toFixed(2)}</span>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToMealPlan(recipe);
              }}
              title="Add to Weekly Meal Plan"
              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
            >
              <CalendarPlus className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </article>
  );
};
