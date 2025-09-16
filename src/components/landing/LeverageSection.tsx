import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const leveragePoints = [
  {
    title: "Content compounds: Old posts keep working for you.",
    description: "80% of all B2B social leads driven by LinkedIn, the #1 platform for B2B growth."
  },
  {
    title: "Visibility brings inbound, for sales, hiring, and fundraising.",
    description: "82% of buyers trust companies whose founders are active online."
  },
  {
    title: "People trust people, not logos",
    description: "Personal posts get 8 times more engagement than company posts."
  },
  {
    title: "Your personal brand lifts your entire business.",
    description: "49% of a company's reputation is directly tied to its CEO"
  }
];

export default function LeverageSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === headerRef.current && entry.isIntersecting) {
            setHeaderVisible(true);
          } else if (entry.isIntersecting) {
            const index = itemRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1 && !visibleItems.includes(index)) {
              setTimeout(() => {
                setVisibleItems(prev => [...prev, index]);
              }, index * 150);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (headerRef.current) observer.observe(headerRef.current);

    setTimeout(() => {
      itemRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }, 100);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className={`transition-all duration-700 ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
            Posting isn't just for likes, it's leverage.
          </h2>

          <p className="text-xl text-gray-600 text-center mb-12">
            Here's why founders can't afford to stay invisible:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {leveragePoints.map((point, index) => (
            <div
              key={index}
              ref={(el) => {itemRefs.current[index] = el}}
              className={`bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-700 hover:shadow-lg self-start ${
                visibleItems.includes(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
            >
              <button
                onClick={() => toggleExpand(index)}
                className="w-full p-6 text-left group h-[120px] flex items-center"
              >
                <div className="flex items-start justify-between w-full">
                  <h3 className="font-semibold text-gray-900 text-lg flex-1 pr-3 leading-snug">
                    {point.title}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 mt-1 ${
                      expandedIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              <div className={`overflow-hidden transition-all duration-200 ${
                expandedIndex === index ? 'max-h-40' : 'max-h-0'
              }`}>
                <div className="px-6 pb-6 pt-4 border-t border-gray-100">
                  <p className="text-base text-gray-600 leading-relaxed">
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