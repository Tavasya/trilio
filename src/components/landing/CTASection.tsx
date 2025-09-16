import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { SignedIn, SignedOut, SignUpButton } from '@clerk/react-router';
import trilioLogo from "@/lib/logo/trilio-logo.png";

export default function CTASection() {
  const navigate = useNavigate();
  // const { user } = useUser();
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCtaVisible(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
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
        <img src={trilioLogo} alt="Trilio" className={`h-12 w-auto mx-auto transition-all duration-700 delay-150 ${
          ctaVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`} />
        <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-2 transition-all duration-700 delay-300 ${
          ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          Ready to grow your LinkedIn brand?
        </h2>
        <p className={`text-xl md:text-2xl text-gray-600 transition-all duration-700 delay-400 ${
          ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          Try one week on us
        </p>
        <div className={`flex justify-center gap-4 transition-all duration-700 delay-500 ${
          ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <SignedOut>
            <SignUpButton mode="modal">
              <button
                className="px-6 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium h-12 flex items-center"
              >
                Try for Free
              </button>
            </SignUpButton>
            <a href="https://calendly.com/jessie-nativespeaking/meet-jessie?month=2025-09" target="_blank" rel="noopener noreferrer">
              <button className="px-6 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium h-12 flex items-center">
                Book a Call
              </button>
            </a>
          </SignedOut>
          <SignedIn>
            <button
              onClick={() => {
                // const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${user?.id}`);

                // if (hasCompletedOnboarding) {
                //   navigate("/dashboard");
                // } else {
                //   navigate("/onboarding/1");
                // }
                navigate("/dashboard");
              }}
              className="px-6 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium h-12 flex items-center"
            >
              Go to App
            </button>
          </SignedIn>
        </div>
      </div>
    </div>
  );
}