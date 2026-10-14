import { useEffect, useState, useCallback } from 'react';

export interface RouteState {
  pathname: string;
  search: string;
  slug?: string;
  category?: string;
  subtab?: string;
  queryParamFilter?: string;
}

export function parseCurrentLocation(): RouteState {
  // Support both pathname (HTML5) and hash fallback if host environment prefixes hash
  let rawPath = window.location.pathname || '/';
  
  // If Vite or preview has base path or hash path
  if (window.location.hash && window.location.hash.startsWith('#/')) {
    rawPath = window.location.hash.substring(1);
  }

  const search = window.location.search || '';
  const searchParams = new URLSearchParams(search);

  // Normalize path
  const normalized = rawPath.replace(/\/+$/, '') || '/';

  // Match /recipe/:slug
  const recipeMatch = normalized.match(/^\/recipe\/([a-zA-Z0-9-]+)$/);
  if (recipeMatch) {
    return {
      pathname: normalized,
      search,
      slug: recipeMatch[1],
    };
  }

  // Match /recipes/category/:category
  const categoryMatch = normalized.match(/^\/recipes\/category\/([a-zA-Z0-9-]+)$/);
  if (categoryMatch) {
    return {
      pathname: normalized,
      search,
      category: decodeURIComponent(categoryMatch[1]),
    };
  }

  // Match /cookbook/:subtab
  const cookbookMatch = normalized.match(/^\/cookbook\/([a-zA-Z0-9-]+)$/);
  if (cookbookMatch) {
    return {
      pathname: normalized,
      search,
      subtab: cookbookMatch[1],
    };
  }

  return {
    pathname: normalized,
    search,
    queryParamFilter: searchParams.get('filter') || undefined,
  };
}

export function navigateTo(url: string, replace = false) {
  if (replace) {
    window.history.replaceState({}, '', url);
  } else {
    window.history.pushState({}, '', url);
  }
  // Dispatch custom popstate event so all listeners immediately update
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function useRouter() {
  const [route, setRoute] = useState<RouteState>(parseCurrentLocation);

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(parseCurrentLocation());
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigate = useCallback((url: string, replace = false) => {
    navigateTo(url, replace);
  }, []);

  return { route, navigate };
}
