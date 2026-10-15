export interface PageSeoConfig {
  url: string;
  title: string;
  metaDescription: string;
  mainKeyword: string;
  relatedKeywords: [string, string];
  ogType?: 'website' | 'article';
}

/**
 * Static SEO Registry for Core Pages following strict title & meta description guidelines:
 * - Titles: 30 to 60 characters, branded with "— Savoria", specific & descriptive
 * - Meta descriptions: 120 to 160 characters, clear summary, includes action CTA
 * - Every page includes 1 main keyword and 2 related keywords
 */
export const STATIC_PAGES_SEO: Record<string, PageSeoConfig> = {
  '/': {
    url: '/',
    title: 'Savoria — Artisanal Food Journal & Recipes',
    metaDescription: 'Discover artisanal food recipes, plan healthy weekly meals, and share kitchen creations with a community of food lovers. Start cooking today.',
    mainKeyword: 'artisanal food recipes',
    relatedKeywords: ['weekly meal planning', 'culinary community'],
    ogType: 'website',
  },
  '/recipes': {
    url: '/recipes',
    title: 'Artisanal Recipes & Cooking Journal — Savoria',
    metaDescription: 'Browse step-by-step artisanal recipes with dynamic serving scalers, nutrition macros, and chef tips. Explore kitchen-tested dishes now.',
    mainKeyword: 'step by step recipes',
    relatedKeywords: ['recipe serving scaler', 'chef cooking tips'],
    ogType: 'website',
  },
  '/recipes/category/baking': {
    url: '/recipes/category/baking',
    title: 'Artisan Baking & Sourdough Recipes — Savoria',
    metaDescription: 'Master sourdough breads, flaky pastry folds, and handcrafted buns with tested baking formulas and step timers. Bake your next masterpiece.',
    mainKeyword: 'artisan baking recipes',
    relatedKeywords: ['sourdough bread guide', 'homemade pastry dough'],
    ogType: 'website',
  },
  '/recipes/category/dinner': {
    url: '/recipes/category/dinner',
    title: 'Gourmet Dinner Recipes & Entrées — Savoria',
    metaDescription: 'Elevate weeknight suppers with restaurant-quality risottos, slow-braised ragus, and fresh pan-seared fish. Cook gourmet dinner tonight.',
    mainKeyword: 'gourmet dinner recipes',
    relatedKeywords: ['weeknight dinner ideas', 'restaurant quality meals'],
    ogType: 'website',
  },
  '/recipes/category/lunch': {
    url: '/recipes/category/lunch',
    title: 'Healthy Lunch Bowls & Midday Meals — Savoria',
    metaDescription: 'Energize your afternoons with high-protein grain bowls, vibrant salads, and balanced lunch recipes. Prepare wholesome lunches today.',
    mainKeyword: 'healthy lunch bowls',
    relatedKeywords: ['high protein lunch', 'grain bowl recipes'],
    ogType: 'website',
  },
  '/recipes/category/quick-under-30m': {
    url: '/recipes/category/quick-under-30m',
    title: 'Quick 30-Minute Dinner Recipes — Savoria',
    metaDescription: 'Delicious homemade meals ready in thirty minutes or less. Perfect for busy weeknights without sacrificing rich flavor. Get quick recipes.',
    mainKeyword: '30 minute dinner recipes',
    relatedKeywords: ['fast weeknight meals', 'easy quick cooking'],
    ogType: 'website',
  },
  '/recipes/category/high-protein': {
    url: '/recipes/category/high-protein',
    title: 'High-Protein Recipes & Macro Meals — Savoria',
    metaDescription: 'Fuel muscle recovery and healthy living with macro-balanced, high-protein culinary recipes packed with natural nutrition. Explore dishes.',
    mainKeyword: 'high protein recipes',
    relatedKeywords: ['macro balanced meals', 'nutritious dinner recipes'],
    ogType: 'website',
  },
  '/recipes/category/vegetarian': {
    url: '/recipes/category/vegetarian',
    title: 'Vegetarian & Plant-Forward Recipes — Savoria',
    metaDescription: 'Explore rich vegetarian cooking featuring seasonal produce, wild forest mushrooms, and Mediterranean aromatics. Cook delicious plants.',
    mainKeyword: 'vegetarian gourmet recipes',
    relatedKeywords: ['plant forward cooking', 'seasonal vegetable dishes'],
    ogType: 'website',
  },
  '/community': {
    url: '/community',
    title: 'Culinary Community & Food Dispatches — Savoria',
    metaDescription: 'Join our vibrant culinary forum to share kitchen remakes, ask expert culinary advice, and connect with fellow home cooks. Share your food.',
    mainKeyword: 'culinary food community',
    relatedKeywords: ['home cook forum', 'recipe remake photos'],
    ogType: 'website',
  },
  '/planner': {
    url: '/planner',
    title: 'Personalized Weekly Meal Planner — Savoria',
    metaDescription: 'Organize your weekly breakfast, lunch, and dinner calendar with automatic macro tracking and 1-click grocery list generation. Plan meals now.',
    mainKeyword: 'weekly meal planner',
    relatedKeywords: ['personalized diet plan', 'smart grocery schedule'],
    ogType: 'website',
  },
  '/grocery': {
    url: '/grocery',
    title: 'Consolidated Grocery Shopping List — Savoria',
    metaDescription: 'Generate an organized shopping checklist consolidated by store aisle from your planned weekly meals and recipes. Shop smarter with Savoria.',
    mainKeyword: 'grocery shopping list',
    relatedKeywords: ['recipe ingredient checklist', 'meal prep shopping'],
    ogType: 'website',
  },
  '/recipes/new': {
    url: '/recipes/new',
    title: 'Publish & Upload Your Recipe — Savoria',
    metaDescription: 'Share your signature culinary creations with ingredient scalers, step timers, and nutrition macros with the community. Publish a recipe.',
    mainKeyword: 'upload recipe online',
    relatedKeywords: ['publish food blog', 'share homemade recipes'],
    ogType: 'website',
  },
  '/cookbook': {
    url: '/cookbook',
    title: 'My Cookbook & Dietary Preferences — Savoria',
    metaDescription: 'Access your saved favorite recipes, manage your published dishes, and configure tailored dietary restrictions in one place. View your cookbook.',
    mainKeyword: 'personal digital cookbook',
    relatedKeywords: ['saved recipe bookmarks', 'dietary food preferences'],
    ogType: 'website',
  },
  '/cookbook/saved': {
    url: '/cookbook/saved',
    title: 'Saved Favorite Recipes Collection — Savoria',
    metaDescription: 'Quickly access your bookmarked artisanal recipes for effortless meal planning and kitchen inspiration. Browse saved favorites today.',
    mainKeyword: 'saved recipes collection',
    relatedKeywords: ['bookmarked meals', 'favorite cooking recipes'],
    ogType: 'website',
  },
  '/cookbook/created': {
    url: '/cookbook/created',
    title: 'My Published Culinary Creations — Savoria',
    metaDescription: 'Review and manage the recipes and blog entries you have authored and shared with the Savoria community. Manage your kitchen portfolio.',
    mainKeyword: 'published recipes portfolio',
    relatedKeywords: ['home chef recipes', 'my culinary blog posts'],
    ogType: 'website',
  },
  '/cookbook/preferences': {
    url: '/cookbook/preferences',
    title: 'Dietary Preferences & Meal Targets — Savoria',
    metaDescription: 'Personalize your dietary targets including Mediterranean, High-Protein, Vegetarian, or Sourdough baking styles. Customize meal goals.',
    mainKeyword: 'dietary meal preferences',
    relatedKeywords: ['personalized nutrition targets', 'dietary food profile'],
    ogType: 'website',
  },
};

/**
 * Generate SEO config for individual Recipe & Blog detail pages (/recipe/:slug)
 * Ensures:
 * - Titles: 30-60 chars, specific with recipe name and brand suffix
 * - Meta descriptions: 120-160 chars, includes cook time, cuisine, and call to action
 * - Main keyword & 2 related keywords derived from cuisine, tags, and dish type
 */
export function getRecipeSeoConfig(recipe: {
  slug: string;
  title: string;
  cuisine: string;
  mealType: string;
  cookTimeMinutes: number;
  prepTimeMinutes: number;
  summary: string;
  tags: string[];
}): PageSeoConfig {
  const cleanTitle = recipe.title.length > 40
    ? recipe.title.substring(0, 38).trim() + '…'
    : recipe.title;

  const title = `${cleanTitle} Recipe — Savoria`.substring(0, 60);

  // Build 120-160 char meta description with CTA
  let desc = `Cook ${recipe.title}. An authentic ${recipe.cuisine} ${recipe.mealType.toLowerCase()} ready in ${recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins with step-by-step guidance. Make it today!`;
  if (desc.length > 160) {
    desc = desc.substring(0, 157).trim() + '...';
  } else if (desc.length < 120) {
    desc = `Cook ${recipe.title}. Learn how to make this authentic ${recipe.cuisine} ${recipe.mealType.toLowerCase()} with clear step-by-step instructions and timing. Make it today!`;
    if (desc.length > 160) desc = desc.substring(0, 157) + '...';
  }

  const mainKeyword = `${recipe.cuisine.toLowerCase()} ${recipe.mealType.toLowerCase()} recipe`;
  const relatedKeywords: [string, string] = [
    recipe.tags[0] ? `${recipe.tags[0].toLowerCase()} cooking guide` : 'homemade culinary recipe',
    recipe.tags[1] ? `easy ${recipe.tags[1].toLowerCase()} dish` : 'tested kitchen recipe',
  ];

  return {
    url: `/recipe/${recipe.slug}`,
    title,
    metaDescription: desc,
    mainKeyword,
    relatedKeywords,
    ogType: 'article',
  };
}

/**
 * Helper to dynamically update HTML <head> metadata (title, meta description, OG tags, Twitter tags)
 * keeping the document strictly synchronized with the current route.
 */
export function updateDocumentSeo(config: PageSeoConfig): void {
  // Update document title
  document.title = config.title;

  // Update or create meta description
  let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = config.metaDescription;

  // OpenGraph title & description
  let ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = config.title;

  let ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
  if (ogDesc) ogDesc.content = config.metaDescription;

  let ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.content = window.location.origin + config.url;

  // Twitter title & description
  let twTitle = document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]');
  if (twTitle) twTitle.content = config.title;

  let twDesc = document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]');
  if (twDesc) twDesc.content = config.metaDescription;

  // Canonical link tag
  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = window.location.origin + config.url;
}
