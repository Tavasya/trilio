import React, { useState, useMemo } from 'react';
import { X, Search, Plus, Check } from 'lucide-react';
import { Button } from '../ui/button';

// Predefined identities with categories
const predefinedIdentities = [
  // Entrepreneurs
  { id: 'founder', label: 'Founder', category: 'Entrepreneur' },
  { id: 'co-founder', label: 'Co-Founder', category: 'Entrepreneur' },
  { id: 'startup-ceo', label: 'Startup CEO', category: 'Entrepreneur' },
  { id: 'serial-entrepreneur', label: 'Serial Entrepreneur', category: 'Entrepreneur' },
  { id: 'solopreneur', label: 'Solopreneur', category: 'Entrepreneur' },
  { id: 'bootstrapper', label: 'Bootstrapper', category: 'Entrepreneur' },

  // Professionals
  { id: 'ceo', label: 'CEO', category: 'Professional' },
  { id: 'cto', label: 'CTO', category: 'Professional' },
  { id: 'cfo', label: 'CFO', category: 'Professional' },
  { id: 'product-manager', label: 'Product Manager', category: 'Professional' },
  { id: 'engineer', label: 'Software Engineer', category: 'Professional' },
  { id: 'designer', label: 'Designer', category: 'Professional' },
  { id: 'consultant', label: 'Consultant', category: 'Professional' },
  { id: 'freelancer', label: 'Freelancer', category: 'Professional' },
  { id: 'manager', label: 'Manager', category: 'Professional' },
  { id: 'director', label: 'Director', category: 'Professional' },

  // Educators
  { id: 'teacher', label: 'Teacher', category: 'Educator' },
  { id: 'professor', label: 'Professor', category: 'Educator' },
  { id: 'coach', label: 'Coach', category: 'Educator' },
  { id: 'mentor', label: 'Mentor', category: 'Educator' },
  { id: 'trainer', label: 'Trainer', category: 'Educator' },
  { id: 'instructor', label: 'Instructor', category: 'Educator' },
  { id: 'course-creator', label: 'Course Creator', category: 'Educator' },

  // Creators
  { id: 'content-creator', label: 'Content Creator', category: 'Creator' },
  { id: 'writer', label: 'Writer', category: 'Creator' },
  { id: 'author', label: 'Author', category: 'Creator' },
  { id: 'blogger', label: 'Blogger', category: 'Creator' },
  { id: 'youtuber', label: 'YouTuber', category: 'Creator' },
  { id: 'podcaster', label: 'Podcaster', category: 'Creator' },
  { id: 'influencer', label: 'Influencer', category: 'Creator' },
  { id: 'artist', label: 'Artist', category: 'Creator' },
  { id: 'musician', label: 'Musician', category: 'Creator' },

  // Leaders
  { id: 'thought-leader', label: 'Thought Leader', category: 'Leader' },
  { id: 'community-builder', label: 'Community Builder', category: 'Leader' },
  { id: 'activist', label: 'Activist', category: 'Leader' },
  { id: 'advocate', label: 'Advocate', category: 'Leader' },
  { id: 'board-member', label: 'Board Member', category: 'Leader' },
  { id: 'advisor', label: 'Advisor', category: 'Leader' },
  { id: 'investor', label: 'Investor', category: 'Leader' },
  { id: 'vc', label: 'Venture Capitalist', category: 'Leader' },

  // Additional
  { id: 'student', label: 'Student', category: 'Other' },
  { id: 'researcher', label: 'Researcher', category: 'Other' },
  { id: 'scientist', label: 'Scientist', category: 'Other' },
  { id: 'developer', label: 'Developer', category: 'Other' },
  { id: 'marketer', label: 'Marketer', category: 'Other' },
  { id: 'salesperson', label: 'Salesperson', category: 'Other' },
  { id: 'recruiter', label: 'Recruiter', category: 'Other' },
];

interface IdentityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedIdentities: string[]) => void;
  initialSelections?: string[];
}

export default function IdentityModal({
  isOpen,
  onClose,
  onSave,
  initialSelections = [],
}: IdentityModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIdentities, setSelectedIdentities] = useState<string[]>(initialSelections);
  const [customIdentity, setCustomIdentity] = useState('');
  const [customIdentities, setCustomIdentities] = useState<string[]>([]);

  // Filter identities based on search
  const filteredIdentities = useMemo(() => {
    if (!searchQuery) return predefinedIdentities;

    const query = searchQuery.toLowerCase();
    return predefinedIdentities.filter(
      identity =>
        identity.label.toLowerCase().includes(query) ||
        identity.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group identities by category
  const groupedIdentities = useMemo(() => {
    const groups: Record<string, typeof predefinedIdentities> = {};
    filteredIdentities.forEach(identity => {
      if (!groups[identity.category]) {
        groups[identity.category] = [];
      }
      groups[identity.category].push(identity);
    });
    return groups;
  }, [filteredIdentities]);

  const toggleIdentity = (identityId: string) => {
    setSelectedIdentities(prev =>
      prev.includes(identityId)
        ? prev.filter(id => id !== identityId)
        : [...prev, identityId]
    );
  };

  const handleAddCustom = () => {
    if (customIdentity.trim() && !customIdentities.includes(customIdentity.trim())) {
      const customId = `custom-${customIdentity.trim().toLowerCase().replace(/\s+/g, '-')}`;
      setCustomIdentities(prev => [...prev, customIdentity.trim()]);
      setSelectedIdentities(prev => [...prev, customId]);
      setCustomIdentity('');
    }
  };

  const handleSave = () => {
    onSave(selectedIdentities);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customIdentity.trim()) {
      e.preventDefault();
      handleAddCustom();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Select Your Identities</h2>
              <p className="text-sm text-gray-600 mt-1">
                Choose or create identities that represent your professional self
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search identities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Custom Identity Input */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Can't find your identity? Add your own:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., Data Scientist, Angel Investor..."
                value={customIdentity}
                onChange={(e) => setCustomIdentity(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button
                onClick={handleAddCustom}
                disabled={!customIdentity.trim()}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
          </div>

          {/* Custom Identities */}
          {customIdentities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Custom Identities</h3>
              <div className="flex flex-wrap gap-2">
                {customIdentities.map(identity => {
                  const customId = `custom-${identity.toLowerCase().replace(/\s+/g, '-')}`;
                  const isSelected = selectedIdentities.includes(customId);

                  return (
                    <button
                      key={customId}
                      onClick={() => toggleIdentity(customId)}
                      className={`px-4 py-2 rounded-full border-2 font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                        isSelected
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <span>{identity}</span>
                      {isSelected && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Predefined Identities by Category */}
          {Object.entries(groupedIdentities).map(([category, identities]) => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                {category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {identities.map(identity => {
                  const isSelected = selectedIdentities.includes(identity.id);

                  return (
                    <button
                      key={identity.id}
                      onClick={() => toggleIdentity(identity.id)}
                      className={`px-3 py-2 rounded-lg border-2 font-medium text-sm transition-all duration-200 text-left ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{identity.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-primary" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* No results */}
          {Object.keys(groupedIdentities).length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No identities found matching "{searchQuery}"</p>
              <p className="text-sm text-gray-400 mt-2">Try a different search or add a custom identity above</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedIdentities.length > 0 ? (
                <span>
                  {selectedIdentities.length} identit{selectedIdentities.length !== 1 ? 'ies' : 'y'} selected
                </span>
              ) : (
                <span>Select at least one identity</span>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={selectedIdentities.length === 0}
                className={selectedIdentities.length === 0 ? 'opacity-50' : ''}
              >
                Save Selection
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}