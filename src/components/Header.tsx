import React from 'react';
import { Bookmark, ShoppingBag, Plus, BookOpen, Users, CalendarDays, UtensilsCrossed } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentPath: string;
  onNavigate: (url: string) => void;
  user: UserProfile;
  savedCount: number;
  groceryCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  user,
  savedCount,
  groceryCount,
}) => {
  const isRecipesActive = currentPath === '/' || currentPath.startsWith('/recipes') || currentPath.startsWith('/recipe/');
  const isCommunityActive = currentPath.startsWith('/community') || currentPath.startsWith('/feed');
  const isPlannerActive = currentPath.startsWith('/planner');
  const isCookbookActive = currentPath.startsWith('/cookbook');

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    onNavigate(url);
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark with Home Link */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/recipes"
              onClick={(e) => handleLinkClick(e, '/recipes')}
              className="group text-left flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-9 h-9 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center shadow-sm group-hover:bg-amber-900 transition-colors">
                <UtensilsCrossed className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 group-hover:text-amber-950 transition-colors whitespace-nowrap">
                  Savoria
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-sans text-stone-500 font-normal tracking-wide">
                  Culinary Journal & Table
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: Navigation Links (Clean unboxed single-line typography with unique semantic URLs) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a
              href="/recipes"
              onClick={(e) => handleLinkClick(e, '/recipes')}
              className={`flex items-center gap-2 py-1.5 whitespace-nowrap shrink-0 transition-colors border-b-2 ${
                isRecipesActive
                  ? 'border-stone-900 text-stone-900 font-semibold'
                  : 'border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Recipes</span>
            </a>

            <a
              href="/community"
              onClick={(e) => handleLinkClick(e, '/community')}
              className={`flex items-center gap-2 py-1.5 whitespace-nowrap shrink-0 transition-colors border-b-2 ${
                isCommunityActive
                  ? 'border-stone-900 text-stone-900 font-semibold'
                  : 'border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Community Feed</span>
            </a>

            <a
              href="/planner"
              onClick={(e) => handleLinkClick(e, '/planner')}
              className={`flex items-center gap-2 py-1.5 whitespace-nowrap shrink-0 transition-colors border-b-2 ${
                isPlannerActive
                  ? 'border-stone-900 text-stone-900 font-semibold'
                  : 'border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Meal Planner</span>
            </a>

            <a
              href="/cookbook/saved"
              onClick={(e) => handleLinkClick(e, '/cookbook/saved')}
              className={`flex items-center gap-2 py-1.5 whitespace-nowrap shrink-0 transition-colors border-b-2 ${
                isCookbookActive
                  ? 'border-stone-900 text-stone-900 font-semibold'
                  : 'border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>My Cookbook</span>
              {savedCount > 0 && (
                <span className="text-xs text-stone-500 font-mono tabular-nums">({savedCount})</span>
              )}
            </a>
          </nav>

          {/* Zone 3: Primary Action & Quick Utilities */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Grocery Quick Button with Unique URL */}
            <a
              href="/grocery"
              onClick={(e) => handleLinkClick(e, '/grocery')}
              title="View Consolidated Grocery List"
              aria-label="View Consolidated Grocery List"
              className="relative p-2.5 text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors flex items-center"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="sr-only">View Consolidated Grocery List</span>
              {groceryCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-[10px] font-mono tabular-nums font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {groceryCount}
                </span>
              )}
            </a>

            {/* Primary Action Button to Upload with Unique URL */}
            <a
              href="/recipes/new"
              onClick={(e) => handleLinkClick(e, '/recipes/new')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-50 bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm transition-all hover:shadow active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Upload Recipe</span>
            </a>

            {/* Profile Avatar */}
            <a
              href="/cookbook/preferences"
              onClick={(e) => handleLinkClick(e, '/cookbook/preferences')}
              title={`Logged in as ${user.name} — View Dietary Preferences`}
              aria-label={`View Dietary Preferences for ${user.name}`}
              className="relative rounded-full focus:ring-2 focus:ring-amber-800 focus:outline-none flex items-center"
            >
              <img
                src={user.avatar}
                alt={`Profile portrait of home chef ${user.name}`}
                width="36"
                height="36"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-stone-300 shadow-xs"
              />
              <span className="sr-only">View dietary preferences and profile</span>
            </a>
          </div>
        </div>

        {/* Mobile secondary navigation bar with unique URLs */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-stone-200 text-xs font-medium text-stone-600">
          <a
            href="/recipes"
            onClick={(e) => handleLinkClick(e, '/recipes')}
            className={`flex flex-col items-center gap-1 ${isRecipesActive ? 'text-stone-950 font-semibold' : ''}`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Recipes</span>
          </a>
          <a
            href="/community"
            onClick={(e) => handleLinkClick(e, '/community')}
            className={`flex flex-col items-center gap-1 ${isCommunityActive ? 'text-stone-950 font-semibold' : ''}`}
          >
            <Users className="w-4 h-4" />
            <span>Feed</span>
          </a>
          <a
            href="/planner"
            onClick={(e) => handleLinkClick(e, '/planner')}
            className={`flex flex-col items-center gap-1 ${isPlannerActive ? 'text-stone-950 font-semibold' : ''}`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Planner</span>
          </a>
          <a
            href="/cookbook/saved"
            onClick={(e) => handleLinkClick(e, '/cookbook/saved')}
            className={`flex flex-col items-center gap-1 ${isCookbookActive ? 'text-stone-950 font-semibold' : ''}`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Cookbook</span>
          </a>
        </div>
      </div>
    </header>
  );
};
