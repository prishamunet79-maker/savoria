import React, { useState, useEffect, useMemo } from 'react';
import { 
  loadStoredRecipes, saveStoredRecipes,
  loadStoredSocialPosts, saveStoredSocialPosts,
  loadStoredMealPlan, saveStoredMealPlan,
  loadStoredUser, saveStoredUser,
  loadStoredGroceryList, saveStoredGroceryList,
  generateGroceryListFromPlan
} from './utils/storage';
import { useRouter } from './utils/router';
import { Recipe, SocialPost, MealPlanDay, UserProfile, GroceryItem, RecipeComment } from './types';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { RecipeCatalog } from './components/RecipeCatalog';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { RecipeUploadModal } from './components/RecipeUploadModal';
import { SocialFeed } from './components/SocialFeed';
import { MealPlanner } from './components/MealPlanner';
import { GroceryListModal } from './components/GroceryListModal';
import { MyCookbook } from './components/MyCookbook';
import { AddToMealPlanModal } from './components/AddToMealPlanModal';
import { ActiveStepTimer } from './components/ActiveStepTimer';
import { Footer } from './components/Footer';

export default function App() {
  const { route, navigate } = useRouter();

  // App state
  const [recipes, setRecipes] = useState<Recipe[]>(loadStoredRecipes);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(loadStoredSocialPosts);
  const [mealPlan, setMealPlan] = useState<MealPlanDay[]>(loadStoredMealPlan);
  const [currentUser, setCurrentUser] = useState<UserProfile>(loadStoredUser);
  const [groceryList, setGroceryList] = useState<GroceryItem[]>(loadStoredGroceryList);

  // Search query & filter state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Interactive Overlays
  const [activeRecipeForPlan, setActiveRecipeForPlan] = useState<Recipe | null>(null);

  // Kitchen Step Timer
  const [activeTimer, setActiveTimer] = useState<{ minutes: number; label: string } | null>(null);

  // Derive active tab from URL route
  const currentTab: 'recipes' | 'feed' | 'planner' | 'cookbook' = useMemo(() => {
    const path = route.pathname;
    if (path.startsWith('/community') || path.startsWith('/feed')) return 'feed';
    if (path.startsWith('/planner')) return 'planner';
    if (path.startsWith('/cookbook')) return 'cookbook';
    return 'recipes';
  }, [route.pathname]);

  // Derive active recipe from slug in URL: /recipe/:slug
  const activeRecipeForDetail = useMemo(() => {
    if (route.slug) {
      return recipes.find(r => r.slug === route.slug) || null;
    }
    return null;
  }, [route.slug, recipes]);

  // Derive upload modal state from URL: /recipes/new or /upload
  const isUploadOpen = route.pathname === '/recipes/new' || route.pathname === '/upload';

  // Derive grocery modal state from URL: /grocery or /grocery-list
  const isGroceryOpen = route.pathname === '/grocery' || route.pathname === '/grocery-list';

  // Derive category filter from URL: /recipes/category/:category
  const selectedCategory = useMemo(() => {
    if (route.category) {
      const catMap: Record<string, string> = {
        'baking': 'Baking',
        'dinner': 'Dinner',
        'lunch': 'Lunch',
        'quick-under-30m': 'Quick < 30m',
        'high-protein': 'High-Protein',
        'vegetarian': 'Vegetarian',
      };
      return catMap[route.category.toLowerCase()] || route.category;
    }
    return 'All Dishes';
  }, [route.category]);

  // Update document title dynamically based on unique URL
  useEffect(() => {
    if (activeRecipeForDetail) {
      document.title = `${activeRecipeForDetail.title} — Savoria`;
    } else if (isUploadOpen) {
      document.title = `Upload New Recipe — Savoria`;
    } else if (isGroceryOpen) {
      document.title = `Consolidated Grocery List — Savoria`;
    } else if (currentTab === 'feed') {
      const filterLabel = route.queryParamFilter ? ` (${route.queryParamFilter})` : '';
      document.title = `Community Feed${filterLabel} — Savoria`;
    } else if (currentTab === 'planner') {
      document.title = `Personalized Meal Planner — Savoria`;
    } else if (currentTab === 'cookbook') {
      const sub = route.subtab ? ` · ${route.subtab}` : '';
      document.title = `My Cookbook${sub} — Savoria`;
    } else if (selectedCategory && selectedCategory !== 'All Dishes') {
      document.title = `${selectedCategory} Recipes — Savoria`;
    } else {
      document.title = `Savoria — Food Journal & Culinary Community`;
    }
  }, [activeRecipeForDetail, isUploadOpen, isGroceryOpen, currentTab, route, selectedCategory]);

  // Storage sync
  useEffect(() => {
    saveStoredRecipes(recipes);
  }, [recipes]);

  useEffect(() => {
    saveStoredSocialPosts(socialPosts);
  }, [socialPosts]);

  useEffect(() => {
    saveStoredMealPlan(mealPlan);
  }, [mealPlan]);

  useEffect(() => {
    saveStoredUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveStoredGroceryList(groceryList);
  }, [groceryList]);

  // Toggle Save / Bookmark
  const handleToggleSave = (recipeId: string) => {
    setCurrentUser(prev => {
      const exists = prev.savedRecipeIds.includes(recipeId);
      const updatedSaved = exists
        ? prev.savedRecipeIds.filter(id => id !== recipeId)
        : [...prev.savedRecipeIds, recipeId];

      return {
        ...prev,
        savedRecipeIds: updatedSaved,
      };
    });

    setRecipes(prev => prev.map(r => {
      if (r.id !== recipeId) return r;
      const isSaved = currentUser.savedRecipeIds.includes(recipeId);
      return {
        ...r,
        likesCount: isSaved ? Math.max(0, r.likesCount - 1) : r.likesCount + 1,
      };
    }));
  };

  // Recipe creation handler
  const handleRecipeCreated = (newRecipe: Recipe) => {
    setRecipes(prev => [newRecipe, ...prev]);
    setCurrentUser(prev => ({
      ...prev,
      savedRecipeIds: [newRecipe.id, ...prev.savedRecipeIds],
    }));

    // Post to community
    const announcementPost: SocialPost = {
      id: `post-announce-${Date.now()}`,
      author: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        handle: currentUser.handle,
        isChef: false,
      },
      content: `Just published my new recipe: "${newRecipe.title}". Let me know if you make it or have any questions!`,
      image: newRecipe.coverImage,
      postType: 'dispatch',
      recipeAttached: {
        id: newRecipe.id,
        title: newRecipe.title,
        image: newRecipe.coverImage,
        cookTime: `${newRecipe.cookTimeMinutes} mins`,
      },
      timestamp: 'Just now',
      likes: 1,
      isLiked: true,
      comments: [],
    };
    setSocialPosts(prev => [announcementPost, ...prev]);

    // Navigate to the newly published recipe page with its unique URL
    navigate(`/recipe/${newRecipe.slug}`);
  };

  // Add Comment / Review to Recipe
  const handleAddCommentToRecipe = (recipeId: string, comment: RecipeComment) => {
    setRecipes(prev => prev.map(r => {
      if (r.id !== recipeId) return r;
      const updatedComments = [comment, ...r.comments];
      const newRating = comment.rating
        ? ((r.rating * r.reviewsCount) + comment.rating) / (r.reviewsCount + 1)
        : r.rating;

      return {
        ...r,
        rating: Math.round(newRating * 100) / 100,
        reviewsCount: r.reviewsCount + 1,
        comments: updatedComments,
      };
    }));
  };

  // Social feed interactions
  const handleAddPost = (post: SocialPost) => {
    setSocialPosts(prev => [post, ...prev]);
  };

  const handleLikePost = (postId: string) => {
    setSocialPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const isLiked = p.isLiked;
      return {
        ...p,
        isLiked: !isLiked,
        likes: isLiked ? p.likes - 1 : p.likes + 1,
      };
    }));
  };

  const handleAddCommentToPost = (postId: string, text: string, author: string) => {
    setSocialPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p,
        comments: [
          ...p.comments,
          {
            id: `sc-${Date.now()}`,
            author,
            avatar: currentUser.avatar,
            text,
            timestamp: 'Just now',
          },
        ],
      };
    }));
  };

  // Add recipe ingredients to grocery list
  const handleAddIngredientsToGrocery = (recipe: Recipe) => {
    const newItems: GroceryItem[] = recipe.ingredients.map((ing, idx) => ({
      id: `gro-rec-${Date.now()}-${idx}`,
      name: ing.name,
      amount: `${ing.amount} ${ing.unit}`,
      category: ing.category,
      checked: false,
      recipeSource: recipe.title,
    }));

    setGroceryList(prev => [...prev, ...newItems]);
  };

  // Grocery list actions
  const handleToggleGroceryItem = (id: string) => {
    setGroceryList(prev => prev.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleAddGroceryItem = (newItem: Omit<GroceryItem, 'id'>) => {
    setGroceryList(prev => [
      {
        ...newItem,
        id: `gro-custom-${Date.now()}`,
      },
      ...prev,
    ]);
  };

  const handleRemoveGroceryItem = (id: string) => {
    setGroceryList(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCheckedGrocery = () => {
    setGroceryList(prev => prev.filter(item => !item.checked));
  };

  const handleGenerateGroceryFromMealPlan = () => {
    const generated = generateGroceryListFromPlan(mealPlan);
    setGroceryList(generated);
  };

  // Add to Meal Plan confirmation
  const handleConfirmAddToMealPlan = (
    recipe: Recipe,
    dayIndex: number,
    slotName: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  ) => {
    setMealPlan(prev => prev.map((day, idx) => {
      if (idx !== dayIndex) return day;
      return {
        ...day,
        slots: {
          ...day.slots,
          [slotName]: recipe,
        },
      };
    }));
  };

  // Category change with URL sync
  const handleSelectCategory = (cat: string) => {
    if (cat === 'All Dishes') {
      navigate('/recipes');
    } else {
      const slug = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      navigate(`/recipes/category/${slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-200">
      
      {/* Top Bar Header with unique URLs */}
      <Header
        currentPath={route.pathname}
        onNavigate={(url) => {
          navigate(url);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={currentUser}
        savedCount={currentUser.savedRecipeIds.length}
        groceryCount={groceryList.filter(i => !i.checked).length}
      />

      {/* Main Content View */}
      <main className="flex-1">
        {currentTab === 'recipes' && (
          <>
            <HeroBanner
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              totalRecipeCount={recipes.length}
            />
            <RecipeCatalog
              recipes={recipes}
              savedRecipeIds={currentUser.savedRecipeIds}
              onToggleSave={handleToggleSave}
              onSelectRecipe={(r) => navigate(`/recipe/${r.slug}`)}
              onAddToMealPlan={(r) => setActiveRecipeForPlan(r)}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </>
        )}

        {currentTab === 'feed' && (
          <SocialFeed
            posts={socialPosts}
            recipes={recipes}
            onAddPost={handleAddPost}
            onLikePost={handleLikePost}
            onAddCommentToPost={handleAddCommentToPost}
            onSelectRecipe={(r) => navigate(`/recipe/${r.slug}`)}
            currentUser={currentUser}
            urlFilter={route.queryParamFilter}
            onNavigateFilter={(filter) => {
              if (filter === 'all') navigate('/community');
              else navigate(`/community?filter=${filter}`);
            }}
          />
        )}

        {currentTab === 'planner' && (
          <MealPlanner
            mealPlan={mealPlan}
            recipes={recipes}
            onUpdatePlan={setMealPlan}
            onSelectRecipe={(r) => navigate(`/recipe/${r.slug}`)}
            onOpenGrocery={() => navigate('/grocery')}
            onGenerateGroceryList={handleGenerateGroceryFromMealPlan}
          />
        )}

        {currentTab === 'cookbook' && (
          <MyCookbook
            user={currentUser}
            recipes={recipes}
            savedRecipeIds={currentUser.savedRecipeIds}
            onToggleSave={handleToggleSave}
            onSelectRecipe={(r) => navigate(`/recipe/${r.slug}`)}
            onAddToMealPlan={(r) => setActiveRecipeForPlan(r)}
            onOpenUpload={() => navigate('/recipes/new')}
            onUpdateUser={setCurrentUser}
            activeSubtab={route.subtab || 'saved'}
            onNavigateSubtab={(subtab) => navigate(`/cookbook/${subtab}`)}
          />
        )}
      </main>

      {/* Active Step Timer Bar (Floating bottom right) */}
      {activeTimer && (
        <ActiveStepTimer
          initialMinutes={activeTimer.minutes}
          label={activeTimer.label}
          onClose={() => setActiveTimer(null)}
        />
      )}

      {/* Unique Recipe Detail Page Modal (/recipe/:slug) */}
      {activeRecipeForDetail && (
        <RecipeDetailModal
          recipe={activeRecipeForDetail}
          onClose={() => navigate('/recipes')}
          isSaved={currentUser.savedRecipeIds.includes(activeRecipeForDetail.id)}
          onToggleSave={handleToggleSave}
          onAddToMealPlan={(r) => setActiveRecipeForPlan(r)}
          onAddIngredientsToGrocery={handleAddIngredientsToGrocery}
          onAddComment={handleAddCommentToRecipe}
          onStartTimer={(minutes, label) => setActiveTimer({ minutes, label })}
        />
      )}

      {/* Unique Recipe Upload Page Modal (/recipes/new) */}
      <RecipeUploadModal
        isOpen={isUploadOpen}
        onClose={() => navigate('/recipes')}
        onRecipeCreated={handleRecipeCreated}
        currentUser={currentUser}
      />

      {/* Add To Meal Plan Confirmation Sheet */}
      <AddToMealPlanModal
        recipe={activeRecipeForPlan}
        onClose={() => setActiveRecipeForPlan(null)}
        mealPlan={mealPlan}
        onConfirmAdd={handleConfirmAddToMealPlan}
      />

      {/* Unique Consolidated Grocery Page Drawer (/grocery) */}
      <GroceryListModal
        isOpen={isGroceryOpen}
        onClose={() => navigate(currentTab === 'planner' ? '/planner' : '/recipes')}
        items={groceryList}
        onToggleItem={handleToggleGroceryItem}
        onAddItem={handleAddGroceryItem}
        onRemoveItem={handleRemoveGroceryItem}
        onClearChecked={handleClearCheckedGrocery}
      />

      {/* Footer with unique semantic links */}
      <Footer
        onSelectTab={(tab) => {
          if (tab === 'recipes') navigate('/recipes');
          else if (tab === 'feed') navigate('/community');
          else if (tab === 'planner') navigate('/planner');
          else if (tab === 'cookbook') navigate('/cookbook/saved');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenUpload={() => navigate('/recipes/new')}
      />

    </div>
  );
}
