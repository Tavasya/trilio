import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const businessProblems = [
  "It feels cringe… what if people judge me?",
  "I want to post, but I don't even know how to begin",
  "I spend hours editing the post, and it still doesn't feel right",
  "No one engages. I have no clue what's working or what's not",
  "It's just so hard to stay consistent… how do people do it?"
];

const studentProblems = [
  "Recruiters don't even view my profile",
  "I apply to hundreds of jobs but get no responses",
  "My LinkedIn looks empty compared to other candidates",
  "I don't know what keywords recruiters are searching for",
  "Everyone says 'network' but I don't know how to start"
];

interface ProblemsSectionProps {
  mode?: 'business' | 'student';
}

export default function ProblemsSection({ mode = 'business' }: ProblemsSectionProps) {
  const problems = mode === 'business' ? businessProblems : studentProblems;
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

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
              }, index * 100);
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
      <div className="max-w-4xl mx-auto">
        <div ref={headerRef} className={`transition-all duration-700 ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
            {mode === 'business' ? 'Posting on LinkedIn is hard.' : 'Getting noticed by recruiters is hard.'}
          </h2>

          <p className="text-xl text-gray-600 text-center mb-8">
            {mode === 'business' ? 'Most founders and creators struggle with:' : 'Most students and job seekers struggle with:'}
          </p>
        </div>

        <div className="flex flex-col gap-6 mx-auto w-fit">
          {problems.map((problem, index) => {
            const rotations = ['-rotate-1', 'rotate-2', '-rotate-1.5', 'rotate-1', '-rotate-2'];
            return (
              <div
                key={index}
                ref={(el) => {itemRefs.current[index] = el}}
                className={`flex items-start gap-3 bg-gray-50 rounded-xl p-5 shadow-md transition-all duration-500 transform ${
                  visibleItems.includes(index)
                    ? `opacity-100 translate-x-0 ${rotations[index]}`
                    : 'opacity-0 -translate-x-12'
                }`}
              >
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-base text-gray-700 md:whitespace-nowrap">{problem}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}