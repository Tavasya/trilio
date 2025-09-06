import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignUpButton, useUser } from '@clerk/react-router';
import Hero from "@/components/landing/Hero";
import QuickStartTasks from "@/components/landing/QuickStartTasks";
import TestimonialCarousel from "@/components/landing/TestimonialCarousel";
import SalesSection from "@/components/landing/SalesSection";
import trilioLogo from "@/lib/logo/trilio-logo.png";

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [scrolledPastPurple, setScrolledPastPurple] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Purple div height is approximately viewport height
      const scrollThreshold = window.innerHeight - 100;
      setScrolledPastPurple(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolledPastPurple 
          ? 'px-8 pt-4' 
          : ''
      }`}>
        <div className={`transition-all duration-300 ${
          scrolledPastPurple 
            ? 'rounded-2xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 backdrop-blur-sm shadow-sm' 
            : ''
        }`}>
          <div className={`flex items-center justify-between transition-all duration-300 ${
            scrolledPastPurple ? 'px-8 py-3' : 'px-6 py-4'
          }`}>
            <img src={trilioLogo} alt="Trilio" className="w-10 h-10" />
            
            <div className="flex items-center gap-3">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    className={`px-4 py-2 transition-colors ${
                      scrolledPastPurple ? 'text-gray-700 hover:bg-gray-100/50' : 'text-gray-700 hover:bg-white/50'
                    }`}
                  >
                    Login
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    className="rounded-md bg-primary text-white hover:bg-primary/90 shadow-sm px-4 py-2"
                  >
                    Try for Free
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Button
                  onClick={() => {
                    // Check if user has completed onboarding
                    const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${user?.id}`);
                    
                    if (hasCompletedOnboarding) {
                      navigate("/dashboard");
                    } else {
                      navigate("/onboarding/1");
                    }
                  }}
                  className="rounded-md bg-primary text-white hover:bg-primary/90 shadow-sm px-4 py-2"
                >
                  Go to App
                </Button>
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Primary Rounded Container with Carousel - All in first viewport */}
      <div className="pt-1 px-1">
        <div className="bg-gradient-to-b from-primary/15 via-primary/10 to-primary/5 rounded-xl relative min-h-[calc(100vh-8px)] flex flex-col">
          {/* Hero and Quick Tasks - Centered in middle */}
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="space-y-6">
              <Hero />
              <QuickStartTasks />
            </div>
          </div>

          {/* Testimonial Carousel - Fixed at bottom */}
          <div className="pb-8">
            <TestimonialCarousel />
          </div>

          {/* Fade to white at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/50 to-transparent rounded-b-xl pointer-events-none" />
        </div>
      </div>

      {/* Sales Section on white background */}
      <div className="bg-white">
        <SalesSection />
      </div>

      {/* Footer */}
      <footer className="bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-900">Terms of Service</a>
            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900">Cookie Policy</a>
            <a href="https://www.linkedin.com/company/trilio-company" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">LinkedIn</a>
            <a href="#" className="hover:text-gray-900">Contact</a>
            <a href="#" className="hover:text-gray-900">Support</a>
          </div>
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 Trilio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}