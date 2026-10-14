import React, { useState } from 'react';
import { 
  Heart, MessageSquare, Send, Sparkles, ChefHat, 
  HelpCircle, Image as ImageIcon, Flame, CheckCircle, Share2
} from 'lucide-react';
import { SocialPost, Recipe, UserProfile } from '../types';

interface SocialFeedProps {
  posts: SocialPost[];
  recipes: Recipe[];
  onAddPost: (post: SocialPost) => void;
  onLikePost: (postId: string) => void;
  onAddCommentToPost: (postId: string, text: string, author: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  currentUser: UserProfile;
  urlFilter?: string;
  onNavigateFilter?: (filter: string) => void;
}

export const SocialFeed: React.FC<SocialFeedProps> = ({
  posts,
  recipes,
  onAddPost,
  onLikePost,
  onAddCommentToPost,
  onSelectRecipe,
  currentUser,
  urlFilter,
  onNavigateFilter,
}) => {
  const activeFilter: 'all' | 'remake' | 'tip' | 'question' = 
    urlFilter === 'remake' || urlFilter === 'tip' || urlFilter === 'question' ? urlFilter : 'all';
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<'dispatch' | 'remake' | 'tip' | 'question'>('dispatch');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  const filteredPosts = posts.filter(p => {
    if (activeFilter === 'all') return true;
    return p.postType === activeFilter;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const attachedRecipe = recipes.find(r => r.id === selectedRecipeId);

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      author: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        handle: currentUser.handle,
        isChef: false,
      },
      content: newPostContent.trim(),
      postType: newPostType,
      recipeAttached: attachedRecipe ? {
        id: attachedRecipe.id,
        title: attachedRecipe.title,
        image: attachedRecipe.coverImage,
        cookTime: `${attachedRecipe.cookTimeMinutes} mins`,
      } : undefined,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
      comments: [],
    };

    onAddPost(newPost);
    setNewPostContent('');
    setSelectedRecipeId('');
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    onAddCommentToPost(postId, text, currentUser.name);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Feed Section Title */}
      <div className="border-b border-stone-200 pb-5">
        <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">
          Community Kitchen & Dispatches
        </h2>
        <p className="text-stone-500 text-xs sm:text-sm mt-1">
          Real-time conversations, dough fermentation breakthroughs, substitution questions, and weekend feast remakes.
        </p>
      </div>

      {/* Create New Post Card */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-cover border border-stone-200 mt-1"
          />

          <div className="flex-1 space-y-3">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What are you cooking, baking, or experimenting with today?"
              rows={3}
              className="w-full bg-stone-50 rounded-lg p-3 text-sm border border-stone-200 focus:outline-none focus:border-stone-900 focus:bg-white transition-colors"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Post Type Selector */}
                <select
                  value={newPostType}
                  onChange={(e) => setNewPostType(e.target.value as any)}
                  className="bg-stone-100 border border-stone-200 rounded-md px-2.5 py-1 text-xs font-medium text-stone-800"
                >
                  <option value="dispatch">💬 General Dispatch</option>
                  <option value="remake">🍳 Recipe Remake</option>
                  <option value="tip">💡 Chef Tip</option>
                  <option value="question">❓ Ask the Community</option>
                </select>

                {/* Attach Recipe */}
                <select
                  value={selectedRecipeId}
                  onChange={(e) => setSelectedRecipeId(e.target.value)}
                  className="bg-stone-100 border border-stone-200 rounded-md px-2.5 py-1 text-xs text-stone-700 max-w-[200px] truncate"
                >
                  <option value="">Attach Recipe (Optional)</option>
                  {recipes.map(r => (
                    <option key={r.id} value={r.id}>{r.title}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim()}
                className="px-4 py-2 bg-stone-900 text-stone-50 text-xs font-semibold rounded-lg hover:bg-stone-800 disabled:opacity-40 transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Dispatch</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Filter Tabs with Unique URLs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Dispatches', path: '/community' },
          { id: 'remake', label: 'Recipe Remakes', path: '/community?filter=remake' },
          { id: 'tip', label: 'Chef Tips', path: '/community?filter=tip' },
          { id: 'question', label: 'Community Q&A', path: '/community?filter=question' },
        ].map((tab) => (
          <a
            key={tab.id}
            href={tab.path}
            onClick={(e) => {
              e.preventDefault();
              if (onNavigateFilter) {
                onNavigateFilter(tab.id);
              }
            }}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeFilter === tab.id
                ? 'bg-stone-900 text-stone-50 font-semibold'
                : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Posts Stream */}
      <div className="space-y-6">
        {filteredPosts.map((post) => {
          const isCommentsExpanded = expandedComments[post.id];

          return (
            <article
              key={post.id}
              className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-stone-200"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-stone-900">{post.author.name}</span>
                      {post.author.isChef && (
                        <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                          Chef
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                      <span>{post.author.handle}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600 capitalize">
                  {post.postType}
                </div>
              </div>

              {/* Content Prose */}
              <p className="text-stone-800 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {post.content}
              </p>

              {/* Photo if provided */}
              {post.image && (
                <div className="rounded-xl overflow-hidden border border-stone-200 max-h-96 bg-stone-100">
                  <img
                    src={post.image}
                    alt="Community remake photo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Attached Recipe Card snippet */}
              {post.recipeAttached && (
                <div
                  onClick={() => {
                    const match = recipes.find(r => r.id === post.recipeAttached?.id);
                    if (match) onSelectRecipe(match);
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200 hover:border-stone-300 cursor-pointer transition-colors"
                >
                  <img
                    src={post.recipeAttached.image}
                    alt=""
                    className="w-14 h-14 rounded-md object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wide">
                      Attached Recipe
                    </span>
                    <h5 className="font-serif text-sm font-bold text-stone-900 truncate">
                      {post.recipeAttached.title}
                    </h5>
                    <span className="text-xs text-stone-500 font-mono">
                      {post.recipeAttached.cookTime}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Strip: Like & Comments toggle */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => onLikePost(post.id)}
                    className="flex items-center gap-1.5 hover:text-rose-600 transition-colors font-mono tabular-nums"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        post.isLiked ? 'fill-rose-500 text-rose-500' : 'text-stone-500'
                      }`}
                    />
                    <span>{post.likes}</span>
                  </button>

                  <button
                    onClick={() =>
                      setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))
                    }
                    className="flex items-center gap-1.5 hover:text-stone-900 transition-colors font-mono tabular-nums"
                  >
                    <MessageSquare className="w-4 h-4 text-stone-500" />
                    <span>{post.comments.length} replies</span>
                  </button>
                </div>

                <div className="flex items-center gap-1 text-stone-400">
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Share</span>
                </div>
              </div>

              {/* Comments Accordion / Stream */}
              {(isCommentsExpanded || post.comments.length > 0) && (
                <div className="pt-3 border-t border-stone-100 space-y-3 bg-stone-50/70 p-3.5 rounded-lg">
                  {post.comments.map(c => (
                    <div key={c.id} className="flex items-start gap-2.5 text-xs">
                      <img
                        src={c.avatar}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                      />
                      <div className="flex-1 bg-white p-2.5 rounded-lg border border-stone-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-stone-900">{c.author}</span>
                          <span className="text-[10px] text-stone-400 font-mono">{c.timestamp}</span>
                        </div>
                        <p className="text-stone-700 leading-normal">{c.text}</p>
                      </div>
                    </div>
                  ))}

                  {/* Add Reply Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCommentSubmit(post.id);
                      }}
                      placeholder="Write a comment or tip..."
                      className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-stone-900"
                    />
                    <button
                      onClick={() => handleCommentSubmit(post.id)}
                      disabled={!commentInputs[post.id]?.trim()}
                      className="px-3 py-1.5 bg-stone-900 text-stone-50 text-xs font-medium rounded-lg hover:bg-stone-800 disabled:opacity-40 transition-colors"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}

            </article>
          );
        })}
      </div>

    </div>
  );
};
