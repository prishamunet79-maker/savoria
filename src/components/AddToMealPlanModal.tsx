import React, { useState } from 'react';
import { X, Calendar, Check } from 'lucide-react';
import { Recipe, MealPlanDay } from '../types';

interface AddToMealPlanModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  mealPlan: MealPlanDay[];
  onConfirmAdd: (recipe: Recipe, dayIndex: number, slotName: 'breakfast' | 'lunch' | 'dinner' | 'snack') => void;
}

export const AddToMealPlanModal: React.FC<AddToMealPlanModalProps> = ({
  recipe,
  onClose,
  mealPlan,
  onConfirmAdd,
}) => {
  if (!recipe) return null;

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('dinner');

  const handleConfirm = () => {
    onConfirmAdd(recipe, selectedDayIndex, selectedSlot);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-stone-200 shadow-2xl space-y-5">
        
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-800" />
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Schedule into Meal Plan
            </h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Recipe Miniature */}
        <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
          <img
            src={recipe.coverImage}
            alt=""
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-serif text-sm font-bold text-stone-900 truncate">
              {recipe.title}
            </h4>
            <span className="text-xs text-stone-500 font-mono">
              {recipe.cookTimeMinutes} mins · {recipe.caloriesPerServing} kcal
            </span>
          </div>
        </div>

        {/* Day Selector */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2">
            Select Day of Week:
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
            {mealPlan.map((day, idx) => (
              <button
                key={day.dayName}
                type="button"
                onClick={() => setSelectedDayIndex(idx)}
                className={`py-2 px-1 text-center rounded-lg border text-xs font-mono transition-colors ${
                  selectedDayIndex === idx
                    ? 'border-stone-900 bg-stone-900 text-stone-50 font-bold'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <span className="block text-[10px] uppercase">{day.dayName.slice(0, 3)}</span>
                <span className="text-[11px] opacity-80">{day.dateLabel.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Meal Slot Selector */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2">
            Select Meal Slot:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'breakfast', label: 'Breakfast' },
              { id: 'lunch', label: 'Lunch' },
              { id: 'dinner', label: 'Dinner' },
              { id: 'snack', label: 'Snack / Bake' },
            ].map(slot => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedSlot(slot.id as any)}
                className={`p-2.5 rounded-lg border text-xs font-medium transition-colors text-left flex items-center justify-between ${
                  selectedSlot === slot.id
                    ? 'border-stone-900 bg-stone-50 text-stone-950 font-semibold ring-1 ring-stone-900'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <span>{slot.label}</span>
                {selectedSlot === slot.id && <Check className="w-3.5 h-3.5 text-stone-900" />}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2.5 bg-stone-900 text-stone-50 text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
          >
            Add to {mealPlan[selectedDayIndex].dayName}
          </button>
        </div>

      </div>
    </div>
  );
};
