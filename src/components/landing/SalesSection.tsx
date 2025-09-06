import { ArrowRight } from "lucide-react";
import trilioLogo from "@/lib/logo/trilio-logo.png";

export default function SalesSection() {
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">How It Works</h2>
      
      <div className="space-y-24">
        {features.map((feature, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <div key={index} className={`flex flex-col md:flex-row items-center gap-12 ${isEven ? '' : 'md:flex-row-reverse'}`}>
              {/* Image Placeholder Side */}
              <div className="flex-1 flex justify-center">
                <div className={`w-full max-w-md h-64 rounded-2xl ${feature.color}`} />
              </div>
              
              {/* Content Side */}
              <div className="flex-1 space-y-4">
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
        <div className="rounded-2xl p-20 text-center space-y-8" style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), white'
        }}>
          <img src={trilioLogo} alt="Trilio" className="w-12 h-12 mx-auto" />
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Still not convinced? Book a call to see how we've helped 500+ creators grow their LinkedIn presence.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium h-12 flex items-center">
              Try for Free
            </button>
            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium h-12 flex items-center">
              Book a Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}