import { useEffect, useRef, useState } from "react";

export default function SalesSection() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const features = [
    {
      title: "An Authentic Brand Voice",
      description: "Finally sound authentic online, not robotic, by aligning your content with your identity and goals.",
      color: "bg-purple-100"
    },
    {
      title: "Experiment & Evolve",
      description: "Post with clarity and intention, guided by insights on what works and how to hit your sweet spot.",
      color: "bg-blue-100"
    },
    {
      title: "Consistent Posting Made Effortless",
      description: "Skip the grind, automate the busywork so you can focus on creating and enjoying the process.",
      color: "bg-green-100"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = itemRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1 && !visibleItems.includes(index)) {
              setVisibleItems(prev => [...prev, index]);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Small delay to ensure refs are set
    setTimeout(() => {
      itemRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }, 100);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">How It Works</h2>
      
      <div className="space-y-24">
        {features.map((feature, index) => {
          const isEven = index % 2 === 0;
          const isVisible = visibleItems.includes(index);
          
          return (
            <div 
              key={index} 
              ref={(el) => {itemRefs.current[index] = el;}}
              className={`flex flex-col md:flex-row items-center gap-12 transition-all duration-700 ${
                isEven ? '' : 'md:flex-row-reverse'
              } ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
            >
              {/* Image Placeholder Side */}
              <div className={`flex-1 flex justify-center transition-all duration-700 delay-150 ${
                isVisible 
                  ? 'opacity-100 translate-x-0' 
                  : isEven 
                    ? 'opacity-0 -translate-x-12' 
                    : 'opacity-0 translate-x-12'
              }`}>
                <div className={`w-full max-w-xl h-72 rounded-2xl ${feature.color}`} />
              </div>
              
              {/* Content Side */}
              <div className={`flex-1 space-y-4 transition-all duration-700 delay-300 ${
                isVisible 
                  ? 'opacity-100 translate-x-0' 
                  : isEven 
                    ? 'opacity-0 translate-x-12' 
                    : 'opacity-0 -translate-x-12'
              }`}>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}