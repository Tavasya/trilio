import { useEffect, useState, useRef } from "react";
import { Star } from "lucide-react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { SignUpButton } from '@clerk/react-router';

export default function Hero() {
  // Profile avatars for future use
  // const profiles = [
  //   "https://api.dicebear.com/7.x/avataaars/svg?seed=Profile1",
  //   "https://api.dicebear.com/7.x/avataaars/svg?seed=Profile2",
  //   "https://api.dicebear.com/7.x/avataaars/svg?seed=Profile3",
  //   "https://api.dicebear.com/7.x/avataaars/svg?seed=Profile4",
  //   "https://api.dicebear.com/7.x/avataaars/svg?seed=Profile5"
  // ];

  const screenshotRef = useRef<HTMLDivElement | null>(null);
  const [tiltAmount, setTiltAmount] = useState(5);

  useEffect(() => {
    const handleScroll = () => {
      if (screenshotRef.current) {
        const rect = screenshotRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate how much of the element is visible
        const visiblePercentage = Math.max(0, Math.min(1,
          (windowHeight - rect.top) / (windowHeight + rect.height)
        ));

        // Reduce tilt from 5 degrees to 0 as element becomes fully visible
        const newTilt = 5 * (1 - visiblePercentage);
        setTiltAmount(newTilt);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full px-6">
      <div className="space-y-5 max-w-5xl mx-auto text-center pt-48">
        {/* Social Proof - Simplified */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-base font-medium text-primary">
            Trusted by 20K LinkedIn Creators
          </span>
        </div>

        {/* Headline - Made even larger */}
        <h1 className="text-6xl md:text-7xl font-bold text-gray-900">
          Turn LinkedIn into Your{" "}
          <span className="relative inline-block">
            <span className="absolute inset-x-2 inset-y-0 bg-primary rounded-md -skew-x-2"></span>
            <span className="relative text-white px-3">Growth Engine</span>
          </span>
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-600">
          Create viral LinkedIn content in seconds with AI that learns your voice and industry
        </p>

        {/* Verified Badge - React Icons check */}
        <div className="flex items-center justify-center gap-2 text-[#0A66C2]">
          <IoIosCheckmarkCircle className="w-6 h-6" />
          <span className="text-base font-medium">
            Trilio is a{" "}
            <svg className="inline-block w-5 h-5 mx-1.5 -mt-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            partner
          </span>
        </div>

        {/* CTA Button */}
        <div className="pt-1">
          <SignUpButton mode="modal">
            <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
              Join for Free
            </button>
          </SignUpButton>
        </div>

        {/* Product Screenshot Placeholder - Bigger with tilt */}
        <div className="mt-6 perspective-1000">
          <div
            ref={screenshotRef}
            className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-[500px] w-full max-w-5xl mx-auto flex items-center justify-center border border-gray-300 transition-transform duration-700 ease-out"
            style={{
              transform: `rotateX(${tiltAmount}deg)`,
              transformStyle: 'preserve-3d'
            }}
          >
            <span className="text-gray-500 text-lg font-medium">Product Screenshot</span>
          </div>
        </div>
      </div>
    </div>
  );
}