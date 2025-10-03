import { useEffect, useState, useRef } from "react";
import { Star, ShieldCheck } from "lucide-react";
import { SignUpButton } from '@clerk/react-router';
import productScreenshot from '@/lib/product/3.png';

interface HeroProps {
  mode?: 'business' | 'student';
}

export default function Hero({ mode = 'business' }: HeroProps) {
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
            {mode === 'business' ? 'Trusted by 200+ LinkedIn Creators' : '500+ Students Landed Jobs Through LinkedIn'}
          </span>
        </div>

        {/* Headline - Made even larger */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
          {mode === 'business' ?
            'The AI LinkedIn Assistant,' :
            <>Get Recruiters to <span className="bg-primary text-white px-2 rounded-md">Message</span> You,</>
          }
        </h1>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mt-2">
          {mode === 'business' ?
            <>Turn Content into <span className="text-primary">Prospects</span></> :
            <>Turn Keywords into <span className="text-primary">Job Offers</span></>
          }
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-600 mt-8">
          {mode === 'business' ?
            'Create viral LinkedIn content in seconds with AI that learns your voice and industry' :
            'Optimize your LinkedIn with AI to attract recruiters - it\'s about keywords, not view counts'}
        </p>

        {/* Verified Badge - Shield check */}
        <div className="flex items-center justify-center gap-2 text-[#0A66C2]">
          <ShieldCheck className="w-6 h-6" />
          <span className="text-base font-medium">
            Trilio is a verified LinkedIn partner
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

        {/* Product Screenshot - Bigger with tilt */}
        <div className="mt-10 perspective-1000">
          <div
            ref={screenshotRef}
            className="rounded-xl w-full max-w-7xl mx-auto overflow-hidden border border-gray-300 shadow-2xl transition-transform duration-700 ease-out"
            style={{
              transform: `rotateX(${tiltAmount}deg)`,
              transformStyle: 'preserve-3d',
              transformOrigin: 'center bottom'
            }}
          >
            <img
              src={productScreenshot}
              alt="Trilio AI LinkedIn content creation dashboard showing post editor and scheduling features"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}