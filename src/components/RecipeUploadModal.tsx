import React, { useState } from 'react';
import { X, Plus, Trash2, Upload, Sparkles, ChefHat, CheckCircle } from 'lucide-react';
import { Recipe, Ingredient, InstructionStep, Difficulty, MealType, IngredientCategory, UserProfile } from '../types';

import recipeFocaccia from '../assets/images/recipe_sourdough_focaccia_1792013894786.jpg';
import recipeRisotto from '../assets/images/recipe_mushroom_risotto_1792013895544.jpg';
import recipeSalmon from '../assets/images/recipe_salmon_bowl_1792013895432.jpg';
import recipeMatcha from '../assets/images/recipe_matcha_crepe_cake_1792013895976.jpg';

interface RecipeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecipeCreated: (recipe: Recipe) => void;
  currentUser: UserProfile;
}

const PRESET_IMAGES = [
  { label: 'Sourdough & Bread', url: recipeFocaccia },
  { label: 'Gourmet Risotto', url: recipeRisotto },
  { label: 'Crispy Salmon Bowl', url: recipeSalmon },
  { label: 'Matcha Pastry', url: recipeMatcha },
];

const AVAILABLE_TAGS = [
  'Artisanal', 'Baking', 'Dinner', 'Lunch', 'Breakfast', 'High-Protein',
  'Vegetarian', 'Gluten-Free', 'Quick 30-min', 'Italian', 'Japanese', 'Mediterranean'
];

export const RecipeUploadModal: React.FC<RecipeUploadModalProps> = ({
  isOpen,
  onClose,
  onRecipeCreated,
  currentUser,
}) => {
  if (!isOpen) return null;

  // Form states
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [story, setStory] = useState('');
  const [mealType, setMealType] = useState<MealType>('Dinner');
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate');
  const [cuisine, setCuisine] = useState('Italian');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(20);
  const [cookTimeMinutes, setCookTimeMinutes] = useState(25);
  const [servings, setServings] = useState(4);
  const [caloriesPerServing, setCaloriesPerServing] = useState(420);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Artisanal', 'Dinner']);
  const [coverImage, setCoverImage] = useState<string>(recipeFocaccia);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Dynamic Ingredients
  const [ingredients, setIngredients] = useState<Array<Omit<Ingredient, 'id'>>>([
    { name: 'Extra Virgin Olive Oil', amount: 30, unit: 'ml', category: 'Pantry', notes: 'First cold-pressed' },
    { name: 'Garlic cloves', amount: 3, unit: 'cloves', category: 'Produce', notes: 'Thinly sliced' },
    { name: 'Fresh Rosemary or Thyme', amount: 2, unit: 'sprigs', category: 'Produce' },
  ]);

  // Dynamic Instructions
  const [instructions, setInstructions] = useState<Array<Omit<InstructionStep, 'stepNumber'>>>([
    { title: 'Prep & Mise en Place', text: 'Gather all ingredients, measure precisely, and bring herbs to room temperature.' },
    { title: 'Simmer & Emulsify', text: 'Gently infuse aromatics over low heat until fragrant without burning.', timerMinutes: 5 },
  ]);

  // Chef Tips
  const [chefTips, setChefTips] = useState<string[]>([
    'Use room-temperature ingredients for optimal emulsification.',
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCoverImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddIngredient = () => {
    setIngredients(prev => [
      ...prev,
      { name: '', amount: 1, unit: 'g', category: 'Produce', notes: '' },
    ]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddInstruction = () => {
    setInstructions(prev => [
      ...prev,
      { title: '', text: '', timerMinutes: undefined },
    ]);
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTip = () => {
    setChefTips(prev => [...prev, '']);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || ingredients.length === 0 || instructions.length === 0) return;

    const newRecipe: Recipe = {
      id: `recipe-user-${Date.now()}`,
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      summary: summary.trim() || 'A delicious home-cooked recipe made with love and craft.',
      story: story.trim(),
      author: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        bio: currentUser.bio,
        badge: 'Home Cook & Artisan',
      },
      coverImage: customImageUrl.trim() || coverImage,
      prepTimeMinutes: Number(prepTimeMinutes) || 15,
      cookTimeMinutes: Number(cookTimeMinutes) || 20,
      servings: Number(servings) || 4,
      difficulty,
      mealType,
      cuisine: cuisine.trim() || 'Contemporary',
      caloriesPerServing: Number(caloriesPerServing) || 400,
      macros: {
        protein: 18,
        carbs: 45,
        fat: 14,
        fiber: 4,
      },
      tags: selectedTags,
      ingredients: ingredients
        .filter(i => i.name.trim().length > 0)
        .map((ing, idx) => ({
          id: `ing-${idx}-${Date.now()}`,
          name: ing.name.trim(),
          amount: Number(ing.amount) || 1,
          unit: ing.unit || 'unit',
          category: ing.category,
          notes: ing.notes?.trim(),
        })),
      instructions: instructions
        .filter(ins => ins.text.trim().length > 0)
        .map((ins, idx) => ({
          stepNumber: idx + 1,
          title: ins.title.trim() || `Step ${idx + 1}`,
          text: ins.text.trim(),
          timerMinutes: ins.timerMinutes ? Number(ins.timerMinutes) : undefined,
        })),
      chefTips: chefTips.filter(t => t.trim().length > 0),
      rating: 5.0,
      reviewsCount: 1,
      likesCount: 1,
      isUserCreated: true,
      createdAt: new Date().toISOString().split('T')[0],
      comments: [
        {
          id: `c-init-${Date.now()}`,
          author: currentUser.name,
          avatar: currentUser.avatar,
          date: 'Today',
          text: 'Excited to publish this recipe to the community! Let me know if you make it.',
          rating: 5,
          likes: 1,
        },
      ],
    };

    onRecipeCreated(newRecipe);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 max-h-[92vh] flex flex-col my-auto">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50/95 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-200 flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Upload New Recipe</h3>
              <p className="text-xs text-stone-500">Share your culinary discovery with the Savoria community.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 md:p-8 space-y-8">
          
          {/* Basic Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold border-b pb-1">
              01. Dish Fundamentals
            </h4>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Recipe Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Crispy Meyer Lemon Roast Chicken with Thyme Jus"
                className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Tagline / Short Summary *
                </label>
                <input
                  type="text"
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="One or two sentences describing flavor and texture."
                  className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Cuisine Origin
                </label>
                <input
                  type="text"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  placeholder="e.g. French, Japanese, Mediterranean, Nordic"
                  className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                The Story / Inspiration (Optional)
              </label>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                rows={2}
                placeholder="Where did this recipe come from? A family tradition, seasonal market bounty, or kitchen test?"
                className="w-full bg-white border border-stone-300 rounded-lg p-3 text-sm focus:outline-none focus:border-stone-900"
              />
            </div>
          </div>

          {/* Time, Yield & Metrics */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold border-b pb-1">
              02. Timing & Measurements
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Prep Time (min)</label>
                <input
                  type="number"
                  min="1"
                  value={prepTimeMinutes}
                  onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Cook Time (min)</label>
                <input
                  type="number"
                  min="0"
                  value={cookTimeMinutes}
                  onChange={(e) => setCookTimeMinutes(Number(e.target.value))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Servings Yield</label>
                <input
                  type="number"
                  min="1"
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Calories / Serving</label>
                <input
                  type="number"
                  min="50"
                  value={caloriesPerServing}
                  onChange={(e) => setCaloriesPerServing(Number(e.target.value))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-sm font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Meal Course</label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as MealType)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="Dinner">Dinner</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Baking">Baking & Breads</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="Easy">Easy (Weeknight simple)</option>
                  <option value="Intermediate">Intermediate (Culinary technique)</option>
                  <option value="Artisanal">Artisanal (Slow food masterclass)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cover Photo */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold border-b pb-1">
              03. Visual Presentation
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5">
                <div className="aspect-[4/3] rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shadow-xs">
                  <img
                    src={customImageUrl || coverImage}
                    alt="Recipe preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="md:col-span-7 space-y-3">
                <label className="block text-xs font-semibold text-stone-800">
                  Select Visual Preset or Upload Your Own:
                </label>

                {/* File Upload button */}
                <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-stone-300 rounded-xl hover:border-amber-600 bg-stone-50 cursor-pointer transition-colors text-xs font-medium text-stone-700">
                  <Upload className="w-4 h-4 text-stone-500" />
                  <span>Upload Photo from Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Presets */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setCoverImage(preset.url);
                        setCustomImageUrl('');
                      }}
                      className={`text-left p-2 rounded-lg border text-xs transition-colors flex items-center gap-2 ${
                        coverImage === preset.url && !customImageUrl
                          ? 'border-stone-900 bg-stone-100 font-semibold'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt=""
                        className="w-8 h-8 rounded object-cover"
                      />
                      <span className="truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>

                {/* Or Custom URL */}
                <input
                  type="url"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="Or enter direct image URL..."
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Ingredients Builder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-1">
              <h4 className="text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold">
                04. Ingredients Specification ({ingredients.length})
              </h4>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="flex items-center gap-1 text-xs font-medium text-amber-900 hover:text-amber-950 font-sans"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ingredient</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  <input
                    type="number"
                    step="any"
                    value={ing.amount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setIngredients(prev => prev.map((item, i) => i === idx ? { ...item, amount: val } : item));
                    }}
                    placeholder="Qty"
                    className="w-16 bg-white border border-stone-300 rounded px-2 py-1 text-xs font-mono"
                  />
                  
                  <input
                    type="text"
                    value={ing.unit}
                    onChange={(e) => {
                      const val = e.target.value;
                      setIngredients(prev => prev.map((item, i) => i === idx ? { ...item, unit: val } : item));
                    }}
                    placeholder="Unit (g, ml, tbsp)"
                    className="w-24 bg-white border border-stone-300 rounded px-2 py-1 text-xs"
                  />

                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setIngredients(prev => prev.map((item, i) => i === idx ? { ...item, name: val } : item));
                    }}
                    placeholder="Ingredient name (e.g. Carnaroli rice)"
                    className="flex-1 bg-white border border-stone-300 rounded px-2.5 py-1 text-xs"
                  />

                  <select
                    value={ing.category}
                    onChange={(e) => {
                      const val = e.target.value as IngredientCategory;
                      setIngredients(prev => prev.map((item, i) => i === idx ? { ...item, category: val } : item));
                    }}
                    className="bg-white border border-stone-300 rounded px-2 py-1 text-xs"
                  >
                    <option value="Produce">Produce</option>
                    <option value="Pantry">Pantry</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Protein">Protein</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Spices">Spices</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(idx)}
                    className="p-1 text-stone-400 hover:text-rose-600 rounded"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions Builder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-1">
              <h4 className="text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold">
                05. Step-by-Step Method ({instructions.length})
              </h4>
              <button
                type="button"
                onClick={handleAddInstruction}
                className="flex items-center gap-1 text-xs font-medium text-amber-900 hover:text-amber-950 font-sans"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-3">
              {instructions.map((step, idx) => (
                <div key={idx} className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs font-bold text-stone-700">
                      Step {idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={step.timerMinutes || ''}
                        onChange={(e) => {
                          const val = e.target.value ? Number(e.target.value) : undefined;
                          setInstructions(prev => prev.map((s, i) => i === idx ? { ...s, timerMinutes: val } : s));
                        }}
                        placeholder="Timer (min)"
                        className="w-24 bg-white border border-stone-300 rounded px-2 py-1 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveInstruction(idx)}
                        className="p-1 text-stone-400 hover:text-rose-600"
                        title="Remove step"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setInstructions(prev => prev.map((s, i) => i === idx ? { ...s, title: val } : s));
                    }}
                    placeholder="Step Title (e.g. Searing the Salmon)"
                    className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs font-medium"
                  />

                  <textarea
                    rows={2}
                    value={step.text}
                    onChange={(e) => {
                      const val = e.target.value;
                      setInstructions(prev => prev.map((s, i) => i === idx ? { ...s, text: val } : s));
                    }}
                    placeholder="Describe exact sensory cues: color change, aroma, heat adjustments..."
                    className="w-full bg-white border border-stone-300 rounded p-2 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold border-b pb-1">
              06. Dietary & Discovery Tags
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {AVAILABLE_TAGS.map(tag => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-stone-900 text-stone-50 font-semibold'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-stone-900 text-stone-50 text-xs font-semibold rounded-lg hover:bg-stone-800 shadow-sm transition-all"
            >
              Publish Recipe to Community
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
