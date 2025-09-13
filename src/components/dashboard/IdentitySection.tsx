import { useState } from 'react';
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

export default function IdentitySection() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePreviewRoleClick = (roleId: string) => {
    // Toggle selection directly from preview
    setSelectedRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSaveIdentity = (roles: string[]) => {
    setSelectedRoles(roles);
    // TODO: Save to backend/localStorage
    console.log('Selected roles:', roles);
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

        {/* Clickable Role Preview Badges - Direct Selection */}
        <div className="flex flex-wrap gap-2">
          {previewRoles.map((role) => {
            const isSelected = selectedRoles.includes(role.id);
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

        {/* Show selected count if any */}
        {selectedRoles.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-gray-600">
              {selectedRoles.length} role{selectedRoles.length !== 1 ? 's' : ''} selected
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
        initialSelections={selectedRoles}
      />
    </>
  );
}