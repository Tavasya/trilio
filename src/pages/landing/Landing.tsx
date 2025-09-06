import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Hero from "@/components/landing/Hero";
import QuickStartTasks from "@/components/landing/QuickStartTasks";
import TestimonialCarousel from "@/components/landing/TestimonialCarousel";
import SalesSection from "@/components/landing/SalesSection";
import trilioLogo from "@/lib/logo/trilio-logo.png";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <img src={trilioLogo} alt="Trilio" className="w-8 h-8" />
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-gray-700 hover:bg-white/50 px-4 py-2"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/onboarding/1")}
              className="rounded-md bg-primary text-white hover:bg-primary/90 shadow-sm px-4 py-2"
            >
              Try for Free
            </Button>
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
            <a href="#" className="hover:text-gray-900">LinkedIn</a>
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