import React, { useState } from 'react';
import { 
  X, Heart, CalendarPlus, ShoppingBag, Clock, ChefHat, 
  Flame, CheckCircle2, Circle, Play, Star, MessageSquare, 
  Send, ThumbsUp, Scale, Sparkles, Check
} from 'lucide-react';
import { Recipe, RecipeComment } from '../types';
import { formatFraction, convertUnit } from '../utils/fraction';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (recipeId: string) => void;
  onAddToMealPlan: (recipe: Recipe) => void;
  onAddIngredientsToGrocery: (recipe: Recipe) => void;
  onAddComment: (recipeId: string, comment: RecipeComment) => void;
  onStartTimer: (minutes: number, label: string) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  isSaved,
  onToggleSave,
  onAddToMealPlan,
  onAddIngredientsToGrocery,
  onAddComment,
  onStartTimer,
}) => {
  if (!recipe) return null;

  const [currentServings, setCurrentServings] = useState<number>(recipe.servings);
  const [isMetric, setIsMetric] = useState<boolean>(true);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [groceryAddedToast, setGroceryAddedToast] = useState(false);

  // Comment state
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentRating, setNewCommentRating] = useState(5);
  const [commentAuthor, setCommentAuthor] = useState('');

  const scalingFactor = currentServings / recipe.servings;

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps(prev =>
      prev.includes(stepNumber) ? prev.filter(s => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const toggleIngredient = (id: string) => {
    setCheckedIngredients(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAddGrocery = () => {
    onAddIngredientsToGrocery(recipe);
    setGroceryAddedToast(true);
    setTimeout(() => setGroceryAddedToast(false), 2500);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: RecipeComment = {
      id: `rc-${Date.now()}`,
      author: commentAuthor.trim() || 'Guest Cook',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
      date: 'Just now',
      text: newCommentText.trim(),
      rating: newCommentRating,
      likes: 0,
    };

    onAddComment(recipe.id, newComment);
    setNewCommentText('');
    setCommentAuthor('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      {/* Container */}
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 max-h-[92vh] flex flex-col my-auto">
        
        {/* Sticky Top Header Controls */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
            <span className="text-amber-900 font-medium">/recipe/{recipe.slug}</span>
            <span aria-hidden="true">·</span>
            <span>{recipe.cuisine}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-stone-800">{recipe.difficulty}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const url = `${window.location.origin}/recipe/${recipe.slug}`;
                navigator.clipboard.writeText(url);
                setGroceryAddedToast(true);
                setTimeout(() => setGroceryAddedToast(false), 2000);
              }}
              title="Copy Unique Recipe URL"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors"
            >
              <span>Copy URL</span>
            </button>

            <button
              onClick={() => onToggleSave(recipe.id)}
              className="p-2 text-stone-700 hover:text-rose-600 hover:bg-stone-100 rounded-lg transition-colors"
              title="Save to favorites"
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              onClick={() => onAddToMealPlan(recipe)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors"
            >
              <CalendarPlus className="w-4 h-4 text-amber-700" />
              <span>Add to Plan</span>
            </button>

            <button
              onClick={handleAddGrocery}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
            >
              {groceryAddedToast ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span className="text-emerald-800 font-semibold">Done!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-amber-800" />
                  <span>Grocery List</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors ml-2"
              title="Close and return to archive"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-8">
          
          {/* Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-7 space-y-4">
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-tight">
                {recipe.title}
              </h2>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                {recipe.summary}
              </p>

              {/* Author badge */}
              <div className="flex items-center gap-3 pt-2">
                <img
                  src={recipe.author.avatar}
                  alt={recipe.author.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-stone-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-stone-900">{recipe.author.name}</span>
                    {recipe.author.badge && (
                      <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                        {recipe.author.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-stone-500">{recipe.author.bio}</span>
                </div>
              </div>

              {/* Story Excerpt */}
              {recipe.story && (
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-700 italic font-serif leading-relaxed">
                  "{recipe.story}"
                </div>
              )}
            </div>

            {/* Recipe Image Card */}
            <div className="md:col-span-5">
              <div className="rounded-xl overflow-hidden border border-stone-200 shadow-sm aspect-[4/3] bg-stone-100">
                <img
                  src={recipe.coverImage}
                  alt={recipe.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Key Quick Stats Strip */}
              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  <span className="block text-[11px] text-stone-500 font-sans">Prep Time</span>
                  <span className="text-sm font-bold font-mono text-stone-900 tabular-nums">
                    {recipe.prepTimeMinutes}m
                  </span>
                </div>
                <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  <span className="block text-[11px] text-stone-500 font-sans">Cook Time</span>
                  <span className="text-sm font-bold font-mono text-stone-900 tabular-nums">
                    {recipe.cookTimeMinutes}m
                  </span>
                </div>
                <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  <span className="block text-[11px] text-stone-500 font-sans">Per Serving</span>
                  <span className="text-sm font-bold font-mono text-stone-900 tabular-nums">
                    {recipe.caloriesPerServing} kcal
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Nutrition Strip */}
          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/70 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-700" />
              <span className="text-xs font-semibold uppercase text-amber-950 font-mono tracking-wider">
                Nutritional Breakdown (Per Serving)
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs font-mono text-stone-700">
              <div>
                <span className="text-stone-500 mr-1.5">Protein:</span>
                <span className="font-bold text-stone-900 tabular-nums">{recipe.macros.protein}g</span>
              </div>
              <div>
                <span className="text-stone-500 mr-1.5">Carbs:</span>
                <span className="font-bold text-stone-900 tabular-nums">{recipe.macros.carbs}g</span>
              </div>
              <div>
                <span className="text-stone-500 mr-1.5">Fat:</span>
                <span className="font-bold text-stone-900 tabular-nums">{recipe.macros.fat}g</span>
              </div>
              <div>
                <span className="text-stone-500 mr-1.5">Fiber:</span>
                <span className="font-bold text-stone-900 tabular-nums">{recipe.macros.fiber}g</span>
              </div>
            </div>
          </div>

          {/* Interactive Ingredients & Scaler */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
            
            {/* Ingredients Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Ingredients
                </h3>
                
                {/* Metric/Imperial Switch */}
                <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-md text-[11px] font-medium border border-stone-200">
                  <button
                    onClick={() => setIsMetric(true)}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      isMetric ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-500'
                    }`}
                  >
                    Metric (g/ml)
                  </button>
                  <button
                    onClick={() => setIsMetric(false)}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      !isMetric ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-500'
                    }`}
                  >
                    US (oz)
                  </button>
                </div>
              </div>

              {/* Dynamic Serving Scaler Control */}
              <div className="flex items-center justify-between bg-stone-50 p-3 rounded-lg border border-stone-200 text-xs">
                <span className="font-medium text-stone-700 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-stone-500" />
                  Yields / Servings:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentServings(prev => Math.max(1, prev - 1))}
                    className="w-7 h-7 flex items-center justify-center bg-white border border-stone-300 rounded hover:bg-stone-100 text-stone-800 font-bold active:scale-95"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-stone-900 text-sm w-8 text-center tabular-nums">
                    {currentServings}
                  </span>
                  <button
                    onClick={() => setCurrentServings(prev => prev + 1)}
                    className="w-7 h-7 flex items-center justify-center bg-white border border-stone-300 rounded hover:bg-stone-100 text-stone-800 font-bold active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Ingredients List with checklist */}
              <ul className="space-y-2 text-sm">
                {recipe.ingredients.map((ing) => {
                  const scaledRawAmount = ing.amount * scalingFactor;
                  const converted = convertUnit(scaledRawAmount, ing.unit, isMetric);
                  const isChecked = checkedIngredients.includes(ing.id);

                  return (
                    <li
                      key={ing.id}
                      onClick={() => toggleIngredient(ing.id)}
                      className={`flex items-start gap-3 p-2.5 rounded-lg border transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-stone-100 border-stone-200 text-stone-400 line-through'
                          : 'bg-white border-stone-200 text-stone-800 hover:border-stone-300'
                      }`}
                    >
                      <button className="mt-0.5 text-stone-400 hover:text-amber-800 shrink-0">
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-stone-400" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>
                      <div className="flex-1">
                        <span className="font-semibold font-mono tabular-nums text-stone-900 mr-1.5">
                          {formatFraction(converted.amount)} {converted.unit}
                        </span>
                        <span>{ing.name}</span>
                        {ing.notes && (
                          <span className="block text-xs text-stone-500 italic mt-0.5">
                            {ing.notes}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Pro Chef Tips */}
              {recipe.chefTips && recipe.chefTips.length > 0 && (
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 mt-6">
                  <div className="flex items-center gap-2 text-amber-900 font-serif font-bold text-sm mb-2">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>Chef’s Secret Notes</span>
                  </div>
                  <ul className="space-y-2 text-xs text-stone-700 leading-relaxed list-disc list-inside">
                    {recipe.chefTips.map((tip, idx) => (
                      <li key={idx} className="marker:text-amber-700">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Instructions Column with Step Timers */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Step-by-Step Method
                </h3>
                <span className="text-xs text-stone-500 font-mono tabular-nums">
                  {completedSteps.length} / {recipe.instructions.length} completed
                </span>
              </div>

              <div className="space-y-4">
                {recipe.instructions.map((step) => {
                  const isDone = completedSteps.includes(step.stepNumber);

                  return (
                    <div
                      key={step.stepNumber}
                      className={`p-4 rounded-xl border transition-all ${
                        isDone
                          ? 'bg-stone-50 border-stone-200 opacity-70'
                          : 'bg-white border-stone-200 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => toggleStep(step.stepNumber)}
                            className="text-stone-500 hover:text-stone-900 transition-colors"
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-stone-300" />
                            )}
                          </button>
                          <h4
                            className={`font-semibold text-sm ${
                              isDone ? 'line-through text-stone-500' : 'text-stone-900'
                            }`}
                          >
                            Step {step.stepNumber}. {step.title}
                          </h4>
                        </div>

                        {/* Interactive Countdown Timer Trigger */}
                        {step.timerMinutes && (
                          <button
                            onClick={() => onStartTimer(step.timerMinutes!, `Step ${step.stepNumber}: ${step.title}`)}
                            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-md transition-colors whitespace-nowrap"
                            title="Start step cooking timer"
                          >
                            <Play className="w-3 h-3 fill-amber-900" />
                            <span>{step.timerMinutes} min timer</span>
                          </button>
                        )}
                      </div>

                      <p
                        className={`text-sm leading-relaxed ml-7 ${
                          isDone ? 'text-stone-400' : 'text-stone-700'
                        }`}
                      >
                        {step.text}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Step Completion Status */}
              {completedSteps.length === recipe.instructions.length && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                  <p className="font-serif text-emerald-950 font-bold">Dish Completed!</p>
                  <p className="text-xs text-emerald-800">
                    Bon appétit! Share a photo or dispatch in the Community Feed.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Community Reviews & Comments */}
          <div className="pt-8 border-t border-stone-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-stone-700" />
                  <span>Cookbook Notes & Reviews</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Notes from cooks who tested and prepared this dish.
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 text-xs font-mono font-semibold text-amber-900">
                <Star className="w-4 h-4 fill-amber-400 text-amber-600" />
                <span className="tabular-nums">{recipe.rating.toFixed(2)}</span>
                <span className="text-stone-400">({recipe.comments.length} reviews)</span>
              </div>
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleSubmitComment} className="bg-stone-50 p-4 rounded-xl border border-stone-200 mb-6">
              <span className="block text-xs font-semibold text-stone-800 mb-2">Leave a Note or Variation:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  placeholder="Your Name (e.g. Chef Oliver)"
                  className="bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-stone-800"
                />

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-stone-600">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewCommentRating(star)}
                        className="text-stone-300 hover:text-amber-400 transition-colors"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= newCommentRating ? 'fill-amber-400 text-amber-500' : ''
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Share your substitutions, baking temperature tweaks, or feedback..."
                rows={3}
                className="w-full bg-white border border-stone-300 rounded-lg p-3 text-xs focus:outline-none focus:border-stone-800 mb-3"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white text-xs font-medium rounded-lg hover:bg-stone-800 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Review</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            {recipe.comments && recipe.comments.length > 0 ? (
              <div className="space-y-3">
                {recipe.comments.map((comment) => (
                  <div key={comment.id} className="p-4 bg-white rounded-xl border border-stone-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={comment.avatar}
                          alt={comment.author}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full object-cover border border-stone-200"
                        />
                        <span className="text-xs font-semibold text-stone-900">{comment.author}</span>
                        <span className="text-[11px] text-stone-400 font-mono">· {comment.date}</span>
                      </div>

                      {comment.rating && (
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: comment.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-500" />
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed pl-9">
                      {comment.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500 italic text-center py-4">
                Be the first home chef to cook and review this dish!
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
