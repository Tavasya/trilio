import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface IdentitySectionProps {
  identities?: string[];
}

export default function IdentitySection({ identities = ['Draft outline'] }: IdentitySectionProps) {
  const [selectedIdentities, setSelectedIdentities] = useState<string[]>([]);

  const toggleIdentity = (identity: string) => {
    setSelectedIdentities(prev =>
      prev.includes(identity)
        ? prev.filter(i => i !== identity)
        : [...prev, identity]
    );
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Identity?</h2>
      <div className="relative">
        <div className="flex flex-wrap gap-2">
          {identities.map((identity) => (
            <button
              key={identity}
              onClick={() => toggleIdentity(identity)}
              className={`px-4 py-2 rounded-full border transition-colors ${
                selectedIdentities.includes(identity)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {identity}
            </button>
          ))}
        </div>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}