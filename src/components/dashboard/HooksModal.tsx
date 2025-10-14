import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Hook, HookCategory } from '../../types/hooks';
import { getAllHooks, getHookCategories } from '../../api/hooks';

interface HooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (hook: Hook) => void;
  currentlySelected?: { id: number; title: string; template?: string } | null;
}

export default function HooksModal({ isOpen, onClose, onApply, currentlySelected }: HooksModalProps) {
  const [categories, setCategories] = useState<HookCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedHook, setSelectedHook] = useState<Hook | null>(null);
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Load categories and all hooks when modal opens
  useEffect(() => {
    if (isOpen) {
      if (categories.length === 0 || hooks.length === 0) {
        loadInitialData();
      }
      // Find and select the currently applied hook
      if (currentlySelected && hooks.length > 0) {
        const matchingHook = hooks.find(h => h.title === currentlySelected.title);
        if (matchingHook) {
          setSelectedHook(matchingHook);
        }
      }
    }
  }, [isOpen, currentlySelected, hooks.length]);

  if (!isOpen) return null;

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedCategories, { hooks: fetchedHooks }] = await Promise.all([
        getHookCategories(),
        getAllHooks(),
      ]);
      setCategories(fetchedCategories);
      setHooks(fetchedHooks);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load hooks. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setLoading(true);
    setError(null);
    try {
      const { hooks: fetchedHooks } = await getAllHooks(categoryId || undefined);
      setHooks(fetchedHooks);
    } catch (error) {
      console.error('Failed to fetch hooks:', error);
      setError('Failed to filter hooks.');
    } finally {
      setLoading(false);
    }
  };

  const handleHookSelect = (hook: Hook) => {
    setSelectedHook(hook);
  };

  const handleApply = () => {
    if (selectedHook) {
      onApply(selectedHook);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedCategory(null);
    setSelectedHook(null);
    setSearchQuery('');
    onClose();
  };

  // Filter hooks based on search
  const filteredHooks = hooks.filter(hook =>
    hook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hook.template.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Choose a Hook
            </h2>
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Minimal Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => handleCategoryFilter(null)}
              className={`px-3 py-1 rounded-md text-sm whitespace-nowrap transition-colors ${
                selectedCategory === null
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.id)}
                className={`px-3 py-1 rounded-md text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">Loading hooks...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-sm mb-4">{error}</p>
              <button
                onClick={loadInitialData}
                className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-fr">
                {filteredHooks.map((hook) => (
                  <button
                    key={hook.id}
                    onClick={() => handleHookSelect(hook)}
                    className={`text-left p-4 border rounded-lg transition-all h-full flex flex-col items-start ${
                      selectedHook?.id === hook.id
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-sm text-gray-900 font-medium mb-1">
                      {hook.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {hook.template}
                    </p>
                  </button>
                ))}
              </div>

              {filteredHooks.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-sm">No hooks found{searchQuery && ` matching "${searchQuery}"`}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-200 bg-white rounded-b-2xl">
          <div className="flex items-center justify-between">
            <button
              onClick={handleClose}
              className="flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!selectedHook}
              className="px-5 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply Hook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
