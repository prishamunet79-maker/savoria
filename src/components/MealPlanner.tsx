import React, { useState } from 'react';
import { 
  Calendar, ShoppingBag, Sparkles, Plus, Trash2, 
  RotateCcw, Utensils, Check, ArrowRight
} from 'lucide-react';
import { MealPlanDay, Recipe, MealType } from '../types';

interface MealPlannerProps {
  mealPlan: MealPlanDay[];
  recipes: Recipe[];
  onUpdatePlan: (updatedPlan: MealPlanDay[]) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onOpenGrocery: () => void;
  onGenerateGroceryList: () => void;
}

export const MealPlanner: React.FC<MealPlannerProps> = ({
  mealPlan,
  recipes,
  onUpdatePlan,
  onSelectRecipe,
  onOpenGrocery,
  onGenerateGroceryList,
}) => {
  // Modal for picking a recipe into a slot
  const [activeSlotTarget, setActiveSlotTarget] = useState<{
    dayIndex: number;
    slotName: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  } | null>(null);

  const [generatorGoal, setGeneratorGoal] = useState<'balanced' | 'protein' | 'quick' | 'artisanal'>('balanced');
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const MEAL_SLOTS: Array<{ key: 'breakfast' | 'lunch' | 'dinner' | 'snack'; label: string }> = [
    { key: 'breakfast', label: 'Breakfast' },
    { key: 'lunch', label: 'Lunch' },
    { key: 'dinner', label: 'Dinner' },
    { key: 'snack', label: 'Snack / Bake' },
  ];

  const handleRemoveRecipeFromSlot = (dayIdx: number, slot: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    const updated = mealPlan.map((day, idx) => {
      if (idx !== dayIdx) return day;
      return {
        ...day,
        slots: {
          ...day.slots,
          [slot]: null,
        },
      };
    });
    onUpdatePlan(updated);
  };

  const handleAssignRecipeToSlot = (recipe: Recipe) => {
    if (!activeSlotTarget) return;
    const { dayIndex, slotName } = activeSlotTarget;

    const updated = mealPlan.map((day, idx) => {
      if (idx !== dayIndex) return day;
      return {
        ...day,
        slots: {
          ...day.slots,
          [slotName]: recipe,
        },
      };
    });

    onUpdatePlan(updated);
    setActiveSlotTarget(null);
  };

  // Smart Personalized Generator
  const handleRunGenerator = () => {
    let pool = [...recipes];
    if (generatorGoal === 'protein') {
      pool.sort((a, b) => b.macros.protein - a.macros.protein);
    } else if (generatorGoal === 'quick') {
      pool.sort((a, b) => (a.prepTimeMinutes + a.cookTimeMinutes) - (b.prepTimeMinutes + b.cookTimeMinutes));
    } else if (generatorGoal === 'artisanal') {
      pool.sort((a, b) => (b.difficulty === 'Artisanal' ? 1 : 0) - (a.difficulty === 'Artisanal' ? 1 : 0));
    }

    const updated = mealPlan.map((day, dayIndex) => {
      // Pick recipes
      const lunchPick = pool[(dayIndex * 2) % pool.length];
      const dinnerPick = pool[(dayIndex * 2 + 1) % pool.length];
      const snackPick = (dayIndex === 5 || dayIndex === 6) ? pool[3 % pool.length] : null;

      return {
        ...day,
        slots: {
          breakfast: dayIndex % 2 === 0 ? pool[0] : null,
          lunch: lunchPick,
          dinner: dinnerPick,
          snack: snackPick,
        },
      };
    });

    onUpdatePlan(updated);
    setShowGeneratorModal(false);
    setSuccessToast('Personalized weekly meal plan tailored successfully!');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleClearPlan = () => {
    const cleared = mealPlan.map(day => ({
      ...day,
      slots: { breakfast: null, lunch: null, dinner: null, snack: null },
    }));
    onUpdatePlan(cleared);
  };

  const handleSyncGrocery = () => {
    onGenerateGroceryList();
    onOpenGrocery();
  };

  // Calculate weekly total planned meals
  const totalPlannedMeals = mealPlan.reduce((acc, day) => {
    return acc + Object.values(day.slots).filter(Boolean).length;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Strip */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-900 tracking-wider font-semibold mb-1">
            <Calendar className="w-4 h-4" />
            <span>Personalized Kitchen Schedule</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">
            Weekly Meal Planner
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Plan breakfast, lunch, and dinner, auto-calculate nutrition, and generate a single consolidated shopping list.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowGeneratorModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300 rounded-lg shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-800" />
            <span>Tailor Weekly Plan</span>
          </button>

          <button
            onClick={handleSyncGrocery}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-stone-900 text-stone-50 hover:bg-stone-800 rounded-lg shadow-xs transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
            <span>Consolidate Grocery List ({totalPlannedMeals} meals)</span>
          </button>

          <button
            onClick={handleClearPlan}
            title="Reset Week"
            className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Success notification */}
      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium rounded-lg flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Weekly Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {mealPlan.map((day, dayIndex) => {
          // Daily totals
          const plannedSlots = Object.values(day.slots).filter(Boolean) as Recipe[];
          const dailyCalories = plannedSlots.reduce((sum, r) => sum + r.caloriesPerServing, 0);
          const dailyProtein = plannedSlots.reduce((sum, r) => sum + r.macros.protein, 0);

          return (
            <div
              key={day.dayName}
              className="bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between overflow-hidden"
            >
              {/* Day Header */}
              <div className="bg-stone-100/80 px-3.5 py-2.5 border-b border-stone-200 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-xs text-stone-900">{day.dayName}</h4>
                  <span className="text-[10px] text-stone-500 font-mono">{day.dateLabel}</span>
                </div>
                {dailyCalories > 0 && (
                  <div className="text-[10px] font-mono text-stone-600 tabular-nums text-right">
                    <span>{dailyCalories} kcal</span>
                  </div>
                )}
              </div>

              {/* Slots */}
              <div className="p-2.5 space-y-2.5 flex-1">
                {MEAL_SLOTS.map(({ key, label }) => {
                  const recipe = day.slots[key];

                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 uppercase tracking-wide">
                        <span>{label}</span>
                      </div>

                      {recipe ? (
                        <div
                          onClick={() => onSelectRecipe(recipe)}
                          className="group relative bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg p-2 cursor-pointer transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            <img
                              src={recipe.coverImage}
                              alt=""
                              className="w-10 h-10 rounded object-cover shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-serif text-xs font-bold text-stone-900 group-hover:text-amber-900 leading-snug line-clamp-1">
                                {recipe.title}
                              </p>
                              <div className="text-[10px] text-stone-500 font-mono tabular-nums flex items-center gap-1.5 mt-0.5">
                                <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes}m</span>
                                <span aria-hidden="true">·</span>
                                <span>{recipe.caloriesPerServing} kcal</span>
                              </div>
                            </div>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveRecipeFromSlot(dayIndex, key);
                            }}
                            className="absolute top-1 right-1 p-1 text-stone-300 hover:text-rose-600 rounded"
                            title="Remove from slot"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveSlotTarget({ dayIndex, slotName: key })}
                          className="w-full py-2 border border-dashed border-stone-200 hover:border-amber-700/60 rounded-lg text-stone-400 hover:text-stone-800 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Day Nutrition Footnote */}
              <div className="px-3 py-2 bg-stone-50/80 border-t border-stone-200 text-[10px] font-mono text-stone-500 flex justify-between">
                <span>Total Protein:</span>
                <span className="font-bold text-stone-800 tabular-nums">{dailyProtein}g</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Pick Recipe for slot */}
      {activeSlotTarget && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 border border-stone-200 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Assign Dish to {mealPlan[activeSlotTarget.dayIndex].dayName} ({activeSlotTarget.slotName})
                </h3>
                <p className="text-xs text-stone-500">Pick from culinary collection or uploaded recipes.</p>
              </div>
              <button
                onClick={() => setActiveSlotTarget(null)}
                className="text-stone-400 hover:text-stone-800"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {recipes.map(r => (
                <div
                  key={r.id}
                  onClick={() => handleAssignRecipeToSlot(r)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:border-stone-900 hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  <img
                    src={r.coverImage}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-serif text-sm font-bold text-stone-900 truncate">
                      {r.title}
                    </h5>
                    <div className="text-xs text-stone-500 font-mono tabular-nums flex items-center gap-2 mt-0.5">
                      <span>{r.difficulty}</span>
                      <span>·</span>
                      <span>{r.prepTimeMinutes + r.cookTimeMinutes} mins</span>
                      <span>·</span>
                      <span>{r.caloriesPerServing} kcal</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Personalized Plan Generator */}
      {showGeneratorModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-stone-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Tailor Personalized Plan
                </h3>
              </div>
              <button
                onClick={() => setShowGeneratorModal(false)}
                className="text-stone-400 hover:text-stone-800"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Choose your culinary goal for the upcoming week. Savoria will curate a harmonious 7-day breakfast, lunch, and dinner routine:
            </p>

            <div className="space-y-2">
              {[
                { id: 'balanced', title: 'Balanced Mediterranean', desc: 'Olive oil, wild greens, healthy grains & fresh pasta.' },
                { id: 'protein', title: 'High-Protein Vitality', desc: 'Seared salmon, rich legumes, and nutrient-dense proteins.' },
                { id: 'quick', title: 'Fast Weeknights (< 30 mins)', desc: 'Quick skillet meals and rapid comfort food.' },
                { id: 'artisanal', title: 'Artisanal Slow Food', desc: 'Long cold-ferment focaccias and technique-driven risottos.' },
              ].map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setGeneratorGoal(opt.id as any)}
                  className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                    generatorGoal === opt.id
                      ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <p className="text-xs font-bold text-stone-900">{opt.title}</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">{opt.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t">
              <button
                onClick={() => setShowGeneratorModal(false)}
                className="px-4 py-2 text-xs font-medium text-stone-600"
              >
                Cancel
              </button>
              <button
                onClick={handleRunGenerator}
                className="px-5 py-2 bg-stone-900 text-stone-50 text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
              >
                Populate Weekly Schedule
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
