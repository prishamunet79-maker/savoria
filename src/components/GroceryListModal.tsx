import React, { useState } from 'react';
import { 
  X, Check, Plus, Trash2, Copy, ShoppingBag, 
  CheckCircle2, Circle 
} from 'lucide-react';
import { GroceryItem, IngredientCategory } from '../types';

interface GroceryListModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: GroceryItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (item: Omit<GroceryItem, 'id'>) => void;
  onRemoveItem: (id: string) => void;
  onClearChecked: () => void;
}

const CATEGORIES: IngredientCategory[] = [
  'Produce',
  'Protein',
  'Dairy',
  'Pantry',
  'Bakery',
  'Spices',
  'Other',
];

export const GroceryListModal: React.FC<GroceryListModalProps> = ({
  isOpen,
  onClose,
  items,
  onToggleItem,
  onAddItem,
  onRemoveItem,
  onClearChecked,
}) => {
  if (!isOpen) return null;

  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('1');
  const [newItemCategory, setNewItemCategory] = useState<IngredientCategory>('Produce');
  const [copiedToast, setCopiedToast] = useState(false);

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddItem({
      name: newItemName.trim(),
      amount: newItemAmount.trim(),
      category: newItemCategory,
      checked: false,
    });

    setNewItemName('');
    setNewItemAmount('1');
  };

  const handleCopyToClipboard = () => {
    let text = `🛒 SAVORIA SHOPPING LIST\n\n`;

    CATEGORIES.forEach(cat => {
      const catItems = items.filter(i => i.category === cat);
      if (catItems.length > 0) {
        text += `[${cat.toUpperCase()}]\n`;
        catItems.forEach(i => {
          text += `${i.checked ? '[x]' : '[ ]'} ${i.amount ? i.amount + ' ' : ''}${i.name}\n`;
        });
        text += `\n`;
      }
    });

    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  const completedCount = items.filter(i => i.checked).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 max-h-[90vh] flex flex-col my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50/95 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-900 text-amber-200 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Consolidated Grocery List
              </h3>
              <p className="text-xs text-stone-500 font-mono tabular-nums">
                {completedCount} of {items.length} items checked
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
              title="Copy list as text"
            >
              {copiedToast ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy List</span>
                </>
              )}
            </button>

            {completedCount > 0 && (
              <button
                onClick={onClearChecked}
                className="px-3 py-1.5 text-xs text-stone-500 hover:text-rose-600 transition-colors"
              >
                Clear Checked
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          
          {/* Quick Add Form */}
          <form onSubmit={handleAddCustom} className="flex flex-wrap sm:flex-nowrap gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
            <input
              type="text"
              value={newItemAmount}
              onChange={(e) => setNewItemAmount(e.target.value)}
              placeholder="Qty"
              className="w-16 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-mono"
            />
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Add pantry staple (e.g. Maldon salt, lemons)..."
              className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs"
            />
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value as any)}
              className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!newItemName.trim()}
              className="px-3.5 py-1.5 bg-stone-900 text-stone-50 rounded-lg text-xs font-semibold hover:bg-stone-800 disabled:opacity-40 transition-colors shrink-0"
            >
              Add Item
            </button>
          </form>

          {/* Categorized List */}
          {items.length > 0 ? (
            <div className="space-y-6">
              {CATEGORIES.map(category => {
                const catItems = items.filter(i => i.category === category);
                if (catItems.length === 0) return null;

                return (
                  <div key={category} className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold border-b border-stone-100 pb-1">
                      {category} ({catItems.length})
                    </h4>

                    <div className="space-y-1.5">
                      {catItems.map(item => (
                        <div
                          key={item.id}
                          onClick={() => onToggleItem(item.id)}
                          className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors cursor-pointer ${
                            item.checked
                              ? 'bg-stone-50 border-stone-200 text-stone-400 line-through'
                              : 'bg-white border-stone-200 text-stone-800 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <button className="text-stone-400 hover:text-stone-700 shrink-0">
                              {item.checked ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                            </button>
                            <div className="truncate">
                              <span className="font-semibold font-mono tabular-nums mr-2">
                                {item.amount}
                              </span>
                              <span className="text-xs sm:text-sm">{item.name}</span>
                              {item.recipeSource && (
                                <span className="hidden sm:inline-block ml-2 text-[10px] text-stone-400 font-mono">
                                  ({item.recipeSource})
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveItem(item.id);
                            }}
                            className="p-1 text-stone-300 hover:text-rose-600 rounded ml-2"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-stone-400 space-y-2">
              <ShoppingBag className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-sm font-medium">Your grocery list is empty</p>
              <p className="text-xs">Add ingredients from any recipe or from your Weekly Meal Planner.</p>
            </div>
          )}

          {/* AEO Grocery Q&A Section */}
          <div className="pt-6 border-t border-stone-200 space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-900 font-semibold">
                Shopping Efficiency & AEO Guide
              </span>
              <h2 className="font-serif text-base font-bold text-stone-900 mt-0.5">
                How does automated grocery consolidation eliminate duplicate shopping?
              </h2>
              <p className="text-stone-600 text-xs leading-relaxed mt-1">
                When you add ingredients from multiple dishes or your weekly meal planner, Savoria groups items by department (Produce, Pantry, Dairy, Protein, Bakery, Spices) so you can navigate aisles sequentially without backtracking.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-sm font-bold text-stone-900">
                Can you export or copy your organized grocery checklist?
              </h2>
              <p className="text-stone-600 text-xs leading-relaxed mt-1">
                Clicking 'Copy List' copies your formatted checklist with checkbox notations directly to your clipboard for quick sharing in text messages, notes apps, or supermarket trips.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
