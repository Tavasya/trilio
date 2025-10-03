import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignUpButton, useClerk } from '@clerk/react-router';
import Hero from "@/components/landing/Hero";
import ProblemsSection from "@/components/landing/ProblemsSection";
import LeverageSection from "@/components/landing/LeverageSection";
import FoundersTestimonials from "@/components/landing/FoundersTestimonials";
import SalesSection from "@/components/landing/SalesSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/Footer";
import trilioLogo from "@/lib/logo/trilio-logo.png";

export default function Landing() {
  const navigate = useNavigate();
  // const { user } = useUser();
  const { loaded } = useClerk();
  const [_scrolledPastPurple, setScrolledPastPurple] = useState(false);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [mode, setMode] = useState<'business' | 'student'>('business');

  useEffect(() => {
    const handleScroll = () => {
      // Purple div height is approximately viewport height
      const scrollThreshold = window.innerHeight - 100;
      setScrolledPastPurple(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => {
      setBackgroundLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="flex items-center justify-between px-3 sm:px-6 py-4">
          <div className="flex items-center gap-2 sm:gap-8">
            <img src={trilioLogo} alt="Trilio - AI LinkedIn Content Platform" className="h-7 sm:h-8 w-auto" />
            <nav className="hidden sm:flex items-center gap-6">
              <Button
                variant={mode === 'business' ? 'default' : 'ghost'}
                className={mode === 'business' ?
                  "px-3 py-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors" :
                  "px-3 py-2 text-gray-700 hover:bg-gray-100/50 transition-colors"
                }
                onClick={() => setMode('business')}
              >
                For businesses
              </Button>
              <Button
                variant={mode === 'student' ? 'default' : 'ghost'}
                className={mode === 'student' ?
                  "px-3 py-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors" :
                  "px-3 py-2 text-gray-700 hover:bg-gray-100/50 transition-colors"
                }
                onClick={() => setMode('student')}
              >
                For job seekers
              </Button>
            </nav>
            {/* Mobile toggle buttons */}
            <div className="flex sm:hidden gap-1">
              <Button
                variant={mode === 'business' ? 'default' : 'ghost'}
                className={mode === 'business' ?
                  "px-2 py-1 text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors" :
                  "px-2 py-1 text-xs text-gray-700 hover:bg-gray-100/50 transition-colors"
                }
                onClick={() => setMode('business')}
              >
                Business
              </Button>
              <Button
                variant={mode === 'student' ? 'default' : 'ghost'}
                className={mode === 'student' ?
                  "px-2 py-1 text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors" :
                  "px-2 py-1 text-xs text-gray-700 hover:bg-gray-100/50 transition-colors"
                }
                onClick={() => setMode('student')}
              >
                Students
              </Button>
            </div>
          </div>

          <div className={`flex items-center gap-2 sm:gap-3 ${!loaded ? 'invisible' : 'visible'}`}>
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="px-2 sm:px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100/50 transition-colors"
                >
                  Login
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  className="rounded-md bg-primary text-white hover:bg-primary/90 shadow-sm px-3 sm:px-4 py-2 text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Try for Free</span>
                  <span className="sm:hidden">Try Free</span>
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button
                onClick={() => {
                  // Check if user has completed onboarding
                  // const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${user?.id}`);

                  // if (hasCompletedOnboarding) {
                  //   navigate("/dashboard");
                  // } else {
                  //   navigate("/onboarding/1");
                  // }
                  navigate("/dashboard");
                }}
                className="rounded-md bg-primary text-white hover:bg-primary/90 shadow-sm px-3 sm:px-4 py-2 text-sm sm:text-base"
              >
                Go to App
              </Button>
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Primary Rounded Container with Carousel - All in first viewport */}
      <div className="pt-1 px-1">
        <div className="relative min-h-[calc(100vh-8px)] flex flex-col rounded-xl overflow-hidden">
          {/* Background with fade-in effect */}
          <div className={`absolute inset-0 rounded-xl transition-all duration-1000 ${
            backgroundLoaded ? 'opacity-100' : 'opacity-0'
          }`}>
            {/* Multiple gradient layers for vibrant effect */}
            <div className={`absolute inset-0 ${
              mode === 'student'
                ? 'bg-gradient-to-br from-blue-100 via-indigo-50 to-transparent'
                : 'bg-gradient-to-br from-purple-100 via-indigo-50 to-transparent'
            } rounded-xl`} />
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-pink-100 via-pink-50 to-transparent rounded-full blur-3xl opacity-70" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-rose-100 via-pink-50 to-transparent rounded-full blur-3xl opacity-60" />
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-l from-fuchsia-100 via-pink-50 to-transparent rounded-full blur-2xl opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white rounded-xl" />
          </div>

          {/* Hero - Centered in middle */}
          <div className="relative flex-1 flex flex-col items-center justify-center px-6 z-10">
            <Hero mode={mode} />
          </div>

          {/* Fade to white at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/60 to-transparent rounded-b-xl pointer-events-none z-20" />
        </div>
      </div>

      {/* Problems Section, Leverage Section, Sales Section, Testimonials, Pricing and FAQ on white background */}
      <div className="bg-white">
        <ProblemsSection mode={mode} />
        <LeverageSection mode={mode} />
        <SalesSection mode={mode} />
        <FoundersTestimonials mode={mode} />
        <PricingSection />
        <FAQSection mode={mode} />
        <CTASection mode={mode} />
      </div>

      <Footer />
    </div>
  );
}