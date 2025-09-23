import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import IdentityModal from '../identity/IdentityModal';

// Main preview roles to show (5 main categories)
const previewRoles = [
  { id: 'entrepreneur', label: 'Entrepreneur' },
  { id: 'professional', label: 'Professional' },
  { id: 'educator', label: 'Educator' },
  { id: 'creator', label: 'Creator' },
  { id: 'leader', label: 'Leader' },
];

interface IdentitySectionProps {
  value?: string;
  onChange?: (selected: string) => void;
}

export default function IdentitySection({ value = '', onChange }: IdentitySectionProps) {
  const [selectedRole, setSelectedRole] = useState<string>(value);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    setSelectedRole(value);
  }, [value]);

  const handlePreviewRoleClick = (roleId: string) => {
    // Single selection - deselect if clicking the same role, otherwise select new role
    const newSelection = selectedRole === roleId ? '' : roleId;
    setSelectedRole(newSelection);
    onChange?.(newSelection);
  };

  const handleSaveIdentity = (roles: string[]) => {
    // For modal, we still receive array but only use first selection
    const firstRole = roles[0] || '';
    setSelectedRole(firstRole);
    onChange?.(firstRole);
  };

  return (
    <>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Define Your Identity
            </h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Clickable Role Preview Badges - Single Selection */}
        <div className="flex flex-wrap gap-2">
          {previewRoles.map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => handlePreviewRoleClick(role.id)}
                className={`px-3 py-1.5 rounded-full border-2 font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                  isSelected
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {role.label}
              </button>
            );
          })}
        </div>

        {/* Show selected role if any */}
        {selectedRole && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-gray-600">
              Selected: {previewRoles.find(r => r.id === selectedRole)?.label}
              <button
                onClick={() => setIsModalOpen(true)}
                className="ml-2 text-primary hover:text-primary/80 font-medium"
              >
                View all →
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Identity Modal */}
      <IdentityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveIdentity}
        initialSelections={selectedRole ? [selectedRole] : []}
      />
    </>
  );
}