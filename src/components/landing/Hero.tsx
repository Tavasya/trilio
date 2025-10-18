import { Star, ShieldCheck } from "lucide-react";
import { SignUpButton } from '@clerk/react-router';
import RecruiterNotifications from '@/components/landing/RecruiterNotifications';
import DemoInputSection from '@/components/landing/DemoInputSection';

interface HeroProps {
  mode?: 'business' | 'student';
}

export default function Hero({ mode = 'business' }: HeroProps) {


  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full px-6">
      <div className="space-y-5 max-w-5xl mx-auto text-center pt-48">
        {/* Social Proof - Simplified */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-6">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-sm sm:text-base font-medium text-primary text-center">
            {mode === 'business' ? 'Trusted by 200+ LinkedIn Creators' : '500+ Students Landed Jobs Through LinkedIn'}
          </span>
        </div>

        {/* Headline - Made even larger */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900">
          {mode === 'business' ?
            'The AI LinkedIn Assistant,' :
            <>Get Recruiters to <span className="bg-primary text-white px-2 rounded-md">Message</span> You,</>
          }
        </h1>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mt-2">
          {mode === 'business' ?
            <>Turn Content into <span className="text-primary">Prospects</span></> :
            <>Turn Keywords into <span className="text-primary">Job Offers</span></>
          }
        </h1>

        {/* Description */}
        <p className="text-base md:text-lg lg:text-xl text-gray-600 mt-8">
          {mode === 'business' ?
            'Create authentic LinkedIn posts in minutes with AI that learns your voice and industry.' :
            'Optimize your LinkedIn with AI to attract recruiters - it\'s about keywords, not view counts'}
        </p>

        {/* Verified Badge - Shield check */}
        <div className="flex items-center justify-center gap-2 text-[#0A66C2]">
          <ShieldCheck className="w-6 h-6" />
          <span className="text-base font-medium">
            Trilio is a verified LinkedIn partner
          </span>
        </div>

        {/* Demo Input Section */}
        <div className="pt-8">
          <DemoInputSection />
        </div>

        {/* RecruiterNotifications for students only */}
        {mode === 'student' && (
          <div className="mt-10 w-full max-w-2xl mx-auto pb-20">
            <RecruiterNotifications />
          </div>
        )}

        {/* Extra padding for business mode */}
        {mode === 'business' && (
          <div className="pb-20" />
        )}
      </div>
    </div>
  );
}