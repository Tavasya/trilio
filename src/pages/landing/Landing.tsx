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
import trilioLogo from "@/lib/logo/trilio-logo.png";

export default function Landing() {
  const navigate = useNavigate();
  // const { user } = useUser();
  const { loaded } = useClerk();
  const [_scrolledPastPurple, setScrolledPastPurple] = useState(false);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);

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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4">
          <img src={trilioLogo} alt="Trilio - AI LinkedIn Content Platform" className="h-8 w-auto" />

          <div className={`flex items-center gap-3 ${!loaded ? 'invisible' : 'visible'}`}>
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100/50 transition-colors"
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
                  // const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${user?.id}`);

                  // if (hasCompletedOnboarding) {
                  //   navigate("/dashboard");
                  // } else {
                  //   navigate("/onboarding/1");
                  // }
                  navigate("/dashboard");
                }}
                className="rounded-md bg-primary text-white hover:bg-primary/90 shadow-sm px-4 py-2"
              >
                Go to App
              </Button>
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Primary Rounded Container with Carousel - All in first viewport */}
      <div className="pt-1 px-1">
        <div className="relative min-h-[calc(100vh-8px)] flex flex-col rounded-xl">
          {/* Background with fade-in effect */}
          <div className={`absolute inset-0 bg-white rounded-xl transition-opacity duration-1000 ${
            backgroundLoaded ? 'opacity-100' : 'opacity-0'
          }`}>
          </div>
          
          {/* Hero - Centered in middle */}
          <div className="relative flex-1 flex flex-col items-center justify-center px-6 z-10">
            <Hero />
          </div>

          {/* Fade to white at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/50 to-transparent rounded-b-xl pointer-events-none" />
        </div>
      </div>

      {/* Problems Section, Leverage Section, Sales Section, Testimonials, Pricing and FAQ on white background */}
      <div className="bg-white">
        <ProblemsSection />
        <LeverageSection />
        <SalesSection />
        <FoundersTestimonials />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </div>

      {/* Footer with Primary Background */}
      <footer className="bg-primary px-6 pb-6 pt-12">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl p-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <img src={trilioLogo} alt="Trilio LinkedIn automation tool logo" className="h-8 w-auto mb-4" />
              <p className="text-sm text-gray-600 mb-4">
              Authentic AI content for LinkedIn that connects and  converts your audience into prospects
              </p>
              <div className="flex gap-4">
                <a href="https://www.linkedin.com/company/trilio-company" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://x.com/trytrilio" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-gray-600 hover:text-primary">Features</a></li>
                <li><a href="#pricing" className="text-sm text-gray-600 hover:text-primary">Pricing</a></li>
                <li><a href="#testimonials" className="text-sm text-gray-600 hover:text-primary">Testimonials</a></li>
                <li><a href="#faq" className="text-sm text-gray-600 hover:text-primary">FAQ</a></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 flex justify-center">
            <p className="text-sm text-gray-500">© 2024 Trilio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}