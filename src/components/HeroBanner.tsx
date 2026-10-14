import React from 'react';
import { Search, Clock, Sparkles } from 'lucide-react';
import { heroRusticTable } from '../data/initialData';

interface HeroBannerProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  totalRecipeCount: number;
}

const CATEGORIES = [
  'All Dishes',
  'Baking',
  'Dinner',
  'Lunch',
  'Quick < 30m',
  'High-Protein',
  'Vegetarian',
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  totalRecipeCount,
}) => {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-stone-100 border-b border-stone-800">
      {/* Background Photography with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroRusticTable}
          alt="Artisanal culinary feast with handmade pasta and olive oil"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105 filter contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/80 to-stone-900/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-3xl">
          
          {/* Subtle Editorial Kicker */}
          <div className="flex items-center gap-2 text-xs font-medium text-amber-200/90 mb-3 tracking-wide">
            <span>CULINARY DISPATCHES</span>
            <span aria-hidden="true">·</span>
            <span>COMMUNITY KITCHEN</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{totalRecipeCount} Artisanal Recipes</span>
          </div>

          {/* Headline with balanced wrap */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-stone-50 leading-[1.15] mb-6 [text-wrap:balance]">
            Slow Food, Kitchen Craft & Table Stories.
          </h1>

          <p className="text-stone-300 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl font-light">
            Share perfected family recipes, plan your seasonal week, scale ingredients effortlessly, and cook alongside passionate food lovers from around the world.
          </p>

          {/* Interactive Search Field */}
          <div className="bg-stone-800/90 backdrop-blur-md p-2 rounded-xl border border-stone-700/80 shadow-2xl max-w-2xl flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-stone-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search recipes, ingredients (e.g. sourdough, salmon, risotto)..."
                className="w-full bg-stone-900/80 text-stone-100 placeholder-stone-400 pl-11 pr-4 py-2.5 rounded-lg text-sm border border-stone-700 focus:outline-none focus:border-amber-400 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 text-xs text-stone-400 hover:text-stone-200"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center justify-end">
              <span className="text-xs text-stone-400 px-3 hidden sm:inline-block">
                Press to discover
              </span>
            </div>
          </div>

          {/* Interactive Segmented Filter Controls with Unique URLs */}
          <div className="flex flex-wrap items-center gap-1.5 mt-6 pt-2">
            <span className="text-xs text-stone-400 mr-2 font-medium">Quick Explore:</span>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              const catSlug = cat === 'All Dishes' ? '' : `/category/${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
              const catUrl = `/recipes${catSlug}`;

              return (
                <a
                  key={cat}
                  href={catUrl}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory(cat);
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-amber-100 text-stone-950 font-semibold shadow-xs'
                      : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700/80 hover:text-stone-100 border border-stone-700/50'
                  }`}
                >
                  {cat}
                </a>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
