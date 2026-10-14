import React, { useState } from 'react';
import { 
  Bookmark, ChefHat, Sliders, Heart, Plus, 
  Sparkles, Check, User
} from 'lucide-react';
import { Recipe, UserProfile } from '../types';
import { RecipeCard } from './RecipeCard';

interface MyCookbookProps {
  user: UserProfile;
  recipes: Recipe[];
  savedRecipeIds: string[];
  onToggleSave: (recipeId: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onAddToMealPlan: (recipe: Recipe) => void;
  onOpenUpload: () => void;
  onUpdateUser: (user: UserProfile) => void;
  activeSubtab?: string;
  onNavigateSubtab?: (subtab: string) => void;
}

const ALL_DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'High-Protein',
  'Artisanal',
  'Mediterranean',
  'Low-Carb',
];

export const MyCookbook: React.FC<MyCookbookProps> = ({
  user,
  recipes,
  savedRecipeIds,
  onToggleSave,
  onSelectRecipe,
  onAddToMealPlan,
  onOpenUpload,
  onUpdateUser,
  activeSubtab = 'saved',
  onNavigateSubtab,
}) => {
  const activeSection = activeSubtab === 'my-recipes' || activeSubtab === 'preferences' ? activeSubtab : 'saved';
  const [savedSearch, setSavedSearch] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  const handleSubtabClick = (e: React.MouseEvent, tab: string) => {
    e.preventDefault();
    if (onNavigateSubtab) {
      onNavigateSubtab(tab);
    }
  };

  // Saved recipes list
  const savedRecipes = recipes.filter(r => savedRecipeIds.includes(r.id));
  const filteredSaved = savedRecipes.filter(r =>
    r.title.toLowerCase().includes(savedSearch.toLowerCase()) ||
    r.tags.some(t => t.toLowerCase().includes(savedSearch.toLowerCase()))
  );

  // My uploaded recipes
  const myUploadedRecipes = recipes.filter(r => r.isUserCreated || r.author.name === user.name);

  const toggleDietaryPref = (pref: string) => {
    const exists = user.dietaryPreferences.includes(pref);
    const updated = exists
      ? user.dietaryPreferences.filter(p => p !== pref)
      : [...user.dietaryPreferences, pref];

    onUpdateUser({
      ...user,
      dietaryPreferences: updated,
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full object-cover border-2 border-stone-200 shadow-xs"
          />
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">{user.name}</h2>
            <p className="text-xs text-stone-500 font-mono">{user.handle}</p>
            <p className="text-xs text-stone-600 mt-1 max-w-lg leading-relaxed">{user.bio}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 w-full md:w-auto justify-around md:justify-end">
          <a
            href="/cookbook/saved"
            onClick={(e) => handleSubtabClick(e, 'saved')}
            className="text-center px-4 hover:opacity-80 transition-opacity"
          >
            <span className="block font-serif text-xl font-bold text-stone-900 tabular-nums">
              {savedRecipes.length}
            </span>
            <span className="text-[11px] text-stone-500 uppercase tracking-wider font-mono">Saved</span>
          </a>

          <div className="h-8 w-px bg-stone-200" />

          <a
            href="/cookbook/my-recipes"
            onClick={(e) => handleSubtabClick(e, 'my-recipes')}
            className="text-center px-4 hover:opacity-80 transition-opacity"
          >
            <span className="block font-serif text-xl font-bold text-stone-900 tabular-nums">
              {myUploadedRecipes.length}
            </span>
            <span className="text-[11px] text-stone-500 uppercase tracking-wider font-mono">Published</span>
          </a>
        </div>
      </div>

      {/* Unique URLs Subtabs */}
      <div className="flex items-center gap-3 border-b border-stone-200 pb-2">
        <a
          href="/cookbook/saved"
          onClick={(e) => handleSubtabClick(e, 'saved')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeSection === 'saved'
              ? 'bg-stone-900 text-stone-50'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Favorites ({savedRecipes.length})</span>
        </a>

        <a
          href="/cookbook/my-recipes"
          onClick={(e) => handleSubtabClick(e, 'my-recipes')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeSection === 'my-recipes'
              ? 'bg-stone-900 text-stone-50'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <ChefHat className="w-4 h-4" />
          <span>My Uploaded Recipes ({myUploadedRecipes.length})</span>
        </a>

        <a
          href="/cookbook/preferences"
          onClick={(e) => handleSubtabClick(e, 'preferences')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeSection === 'preferences'
              ? 'bg-stone-900 text-stone-50'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Dietary Preferences</span>
        </a>
      </div>

      {/* SECTION 1: Saved Favorites */}
      {activeSection === 'saved' && (
        <div className="space-y-6">
          {savedRecipes.length > 0 && (
            <div className="max-w-xs">
              <input
                type="text"
                value={savedSearch}
                onChange={(e) => setSavedSearch(e.target.value)}
                placeholder="Search saved recipes..."
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
              />
            </div>
          )}

          {filteredSaved.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSaved.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isSaved={true}
                  onToggleSave={onToggleSave}
                  onSelectRecipe={onSelectRecipe}
                  onAddToMealPlan={onAddToMealPlan}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-3">
              <Bookmark className="w-8 h-8 text-stone-400 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-stone-900">No Saved Recipes Yet</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Click the heart icon on any recipe across the catalog to build your curated personal cookbook.
              </p>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: My Uploaded Recipes */}
      {activeSection === 'my-recipes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-stone-500">
              Original formulas, sourdough schedules, and family favorites you published.
            </p>
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-stone-900 text-stone-50 rounded-lg hover:bg-stone-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload New Recipe</span>
            </button>
          </div>

          {myUploadedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {myUploadedRecipes.map(recipe => (
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
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-4">
              <ChefHat className="w-8 h-8 text-stone-400 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-stone-900">No Recipes Uploaded Yet</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Publish your first recipe to the community archive. Add photos, dynamic ingredients, and cooking steps.
              </p>
              <button
                onClick={onOpenUpload}
                className="px-4 py-2 text-xs font-semibold bg-stone-900 text-stone-50 rounded-lg hover:bg-stone-800"
              >
                Upload First Recipe
              </button>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: Dietary Preferences */}
      {activeSection === 'preferences' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 max-w-2xl space-y-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">Personalized Dietary Profile</h3>
            <p className="text-xs text-stone-500 mt-1">
              Selecting your preferences helps personalize your weekly meal plan generator and highlights matching recipes.
            </p>
          </div>

          {saveToast && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-lg flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Preferences saved to your profile</span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ALL_DIETARY_OPTIONS.map(pref => {
              const isSelected = user.dietaryPreferences.includes(pref);
              return (
                <button
                  key={pref}
                  onClick={() => toggleDietaryPref(pref)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                      : 'border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-300'
                  }`}
                >
                  <span>{pref}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
