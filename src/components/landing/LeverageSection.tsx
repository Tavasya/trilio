import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const leveragePoints = [
  {
    title: "Content Compounds",
    subtitle: "Old posts keep working for you",
    stat: "8x",
    statLabel: "more engagement",
    description: "Personal posts get 8 times more engagement than company posts. Your content continues generating leads long after posting."
  },
  {
    title: "Trust Through Visibility",
    subtitle: "People trust people, not logos",
    stat: "82%",
    statLabel: "buyer trust",
    description: "82% of buyers trust companies whose founders are active online. Your face builds more credibility than any corporate brand."
  },
  {
    title: "Inbound Opportunities",
    subtitle: "Visibility drives growth",
    stat: "80%",
    statLabel: "B2B leads",
    description: "80% of all B2B social leads come from LinkedIn. Being visible brings inbound for sales, hiring, and fundraising."
  },
  {
    title: "CEO Brand Impact",
    subtitle: "Your brand lifts everything",
    stat: "49%",
    statLabel: "reputation tied to CEO",
    description: "Nearly half of a company's reputation is directly tied to its CEO. Your personal brand elevates your entire business."
  }
];

export default function LeverageSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="py-24 px-6">
      <div className="max-w-6xl mx-auto" style={{ minHeight: '400px' }}>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 text-center">
          Posting isn't just for likes, it's leverage.
        </h2>

        <p className="text-xl text-gray-600 text-center mb-10">
          Here's why founders can't afford to stay invisible:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start" style={{ paddingBottom: '120px' }}>
          {leveragePoints.map((point, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md self-start"
            >
              <button
                onClick={() => toggleExpand(index)}
                className="w-full p-4 text-left group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-3xl font-bold text-primary">
                    {point.stat}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      expandedIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                <div className="text-sm text-gray-500 uppercase tracking-wide mb-3">
                  {point.statLabel}
                </div>

                <h3 className="font-semibold text-gray-900 text-base mb-1">
                  {point.title}
                </h3>

                <p className="text-sm text-gray-600">
                  {point.subtitle}
                </p>
              </button>

              <div className={`overflow-hidden transition-all duration-200 ${
                expandedIndex === index ? 'max-h-32' : 'max-h-0'
              }`}>
                <div className="px-4 pb-4 pt-0">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}