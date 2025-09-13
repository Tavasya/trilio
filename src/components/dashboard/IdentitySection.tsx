import { useState } from 'react';
import { ChevronRight, User, Briefcase, GraduationCap, Heart, Rocket, Target } from 'lucide-react';

interface IdentitySectionProps {
  identities?: string[];
}

const defaultIdentities = [
  { id: '1', name: 'Entrepreneur' },
  { id: '2', name: 'Professional' },
  { id: '3', name: 'Educator' },
  { id: '4', name: 'Creator' },
  { id: '5', name: 'Leader' },
];

export default function IdentitySection() {
  const [selectedIdentities, setSelectedIdentities] = useState<string[]>([]);

  const toggleIdentity = (identityId: string) => {
    setSelectedIdentities(prev =>
      prev.includes(identityId)
        ? prev.filter(i => i !== identityId)
        : [...prev, identityId]
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Define Your Identity
          </h2>
          <p className="text-sm text-gray-500 mt-1">Choose the roles that best describe you</p>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {defaultIdentities.map((identity) => {
          const isSelected = selectedIdentities.includes(identity.id);
          return (
            <button
              key={identity.id}
              onClick={() => toggleIdentity(identity.id)}
              className={`px-4 py-2 rounded-full border-2 font-medium text-sm transition-all duration-200 ${
                isSelected
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {identity.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}