import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { SignedIn, SignedOut, useUser } from '@clerk/react-router';
import trilioLogo from "@/lib/logo/trilio-logo.png";

export default function SalesSection() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const [ctaVisible, setCtaVisible] = useState(false);

  const features = [
    {
      title: "Analyze Successful Creators",
      description: "Study creators who started where you are and achieved your goals. Learn their strategies and growth patterns.",
      color: "bg-purple-100"
    },
    {
      title: "Write in Your Voice",
      description: "Generate authentic LinkedIn posts that sound like you, not a robot. Maintain your unique voice and style.",
      color: "bg-blue-100"
    },
    {
      title: "Schedule & Automate",
      description: "Plan and schedule your posts in advance. Stay consistent with automated posting at optimal times.",
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
            if (entry.target === ctaRef.current) {
              setCtaVisible(true);
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

      if (ctaRef.current) {
        observer.observe(ctaRef.current);
      }
    }, 100);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">How It Works</h2>
      
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
                <h3 className="text-2xl font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="mt-32">
        <div 
          ref={ctaRef}
          className={`rounded-2xl p-20 text-center space-y-8 transition-all duration-700 ${
            ctaVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-12'
          }`}
          style={{
            background: 'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), white'
          }}
        >
          <img src={trilioLogo} alt="Trilio" className={`w-12 h-12 mx-auto transition-all duration-700 delay-150 ${
            ctaVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`} />
          <p className={`text-lg text-gray-600 max-w-2xl mx-auto transition-all duration-700 delay-300 ${
            ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Still not convinced? Book a call to see how we've helped 500+ creators grow their LinkedIn presence.
          </p>
          <div className={`flex justify-center gap-4 transition-all duration-700 delay-500 ${
            ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <SignedOut>
              <button 
                onClick={() => navigate("/onboarding/1")}
                className="px-6 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium h-12 flex items-center"
              >
                Try for Free
              </button>
              <button className="px-6 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium h-12 flex items-center">
                Book a Call
              </button>
            </SignedOut>
            <SignedIn>
              <button 
                onClick={() => {
                  // Check if user has completed onboarding
                  const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${user?.id}`);
                  
                  if (hasCompletedOnboarding) {
                    navigate("/dashboard");
                  } else {
                    navigate("/onboarding/1");
                  }
                }}
                className="px-6 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium h-12 flex items-center"
              >
                Go to App
              </button>
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  );
}