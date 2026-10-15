import React from 'react';
import { UtensilsCrossed, Heart } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: 'recipes' | 'feed' | 'planner' | 'cookbook') => void;
  onOpenUpload: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenUpload }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-stone-800 text-amber-200 flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-100">
                Savoria
              </span>
            </div>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              An artisanal culinary sanctuary honoring slow food, seasonal farmers markets, wild dough fermentation, and the quiet joy of gathering around a shared table.
            </p>
            <p className="text-xs text-stone-500 font-mono">
              Designed with care for home cooks, bakers, and chefs.
            </p>
          </div>

          {/* Navigation Links with Semantic Anchor Tags */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold">
              Archive & Tables
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/recipes"
                  onClick={(e) => { e.preventDefault(); onSelectTab('recipes'); }}
                  className="hover:text-amber-200 transition-colors"
                >
                  Artisanal Recipe Archive
                </a>
              </li>
              <li>
                <a
                  href="/community"
                  onClick={(e) => { e.preventDefault(); onSelectTab('feed'); }}
                  className="hover:text-amber-200 transition-colors"
                >
                  Community Dispatches & Q&A
                </a>
              </li>
              <li>
                <a
                  href="/planner"
                  onClick={(e) => { e.preventDefault(); onSelectTab('planner'); }}
                  className="hover:text-amber-200 transition-colors"
                >
                  Personalized Meal Planner
                </a>
              </li>
              <li>
                <a
                  href="/cookbook/saved"
                  onClick={(e) => { e.preventDefault(); onSelectTab('cookbook'); }}
                  className="hover:text-amber-200 transition-colors"
                >
                  My Curated Cookbook
                </a>
              </li>
              <li>
                <a
                  href="/grocery"
                  onClick={(e) => { e.preventDefault(); onSelectTab('planner'); }}
                  className="hover:text-amber-200 transition-colors"
                >
                  Consolidated Grocery List
                </a>
              </li>
            </ul>
          </div>

          {/* Action & Community */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold">
              Share Your Table
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Have an heirloom bread recipe, a secret pasta sauce, or a nourishing soup? Share your step-by-step techniques with the community.
            </p>
            <a
              href="/recipes/new"
              onClick={(e) => { e.preventDefault(); onOpenUpload(); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-200 text-xs font-medium rounded-lg border border-stone-700 transition-colors"
            >
              <span>Publish a Recipe</span>
            </a>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Savoria Culinary Journal. All recipes crafted with culinary rigor.</p>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Celebrated in home kitchens worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
