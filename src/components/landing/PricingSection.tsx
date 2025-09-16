import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { SignUpButton } from '@clerk/react-router';

const plans = [
  {
    name: "Starter",
    price: { monthly: 9, yearly: 6 },
    description: "Start producing high-quality content faster on LinkedIn",
    cta: "Try it free",
    postGeneration: "Limited 30 posts/month",
    features: [
      "Ideas generator",
      "Content generator",
      "Auto posting"
    ],
    footer: ["Cancel anytime", "Monthly payment"]
  },
  {
    name: "Creator",
    price: { monthly: 29, yearly: 20 },
    description: "Boost your LinkedIn content strategy from start to finish",
    cta: "Try it free",
    popular: true,
    postGeneration: "Unlimited posts",
    features: [
      "Everything in Starter, plus:",
      "Trend analysis",
      "Custom brand voice development",
      "Content creation on industry insights",
      "Engagement kit"
    ],
    footer: ["Cancel anytime", "Monthly payment"]
  },
  {
    name: "Business",
    price: { monthly: "Let's talk", yearly: "Let's talk" },
    description: "For businesses and agencies to amplify their content creation",
    cta: "Book a Call",
    postGeneration: "Unlimited posts",
    features: [
      "Everything in Creator, plus:",
      "Multi-account management",
      "Multi-channel integration",
      "Custom performance report"
    ],
    service: [
      "Dedicated support",
      "Customized onboarding"
    ]
  }
];

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === headerRef.current && entry.isIntersecting) {
            setHeaderVisible(true);
          } else if (entry.isIntersecting) {
            const index = cardRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1 && !visibleItems.includes(index)) {
              setTimeout(() => {
                setVisibleItems(prev => [...prev, index]);
              }, index * 150);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (headerRef.current) observer.observe(headerRef.current);

    setTimeout(() => {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }, 100);

    return () => observer.disconnect();
  }, []);

  return (
    <div id="pricing" className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className={`transition-all duration-700 ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 text-center">
          Choose Your LinkedIn Growth Plan
          </h2>

        </div>

        {/* Billing Toggle */}
        <div className={`flex items-center justify-center gap-3 mb-10 transition-all duration-700 delay-300 ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <span className={`text-base ${!isYearly ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isYearly ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-base ${isYearly ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
            Yearly
            <span className="ml-1 text-sm text-green-600 font-semibold">(30% off)</span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              ref={(el) => {cardRefs.current[index] = el}}
              className={`relative bg-white rounded-xl p-6 transition-all duration-700 ${
                visibleItems.includes(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              } ${
                plan.popular
                  ? 'border-2 border-primary shadow-lg'
                  : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-white text-sm font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  {typeof plan.price.monthly === 'number' ? (
                    <>
                      <span className="text-4xl font-bold text-gray-900">
                        ${isYearly ? plan.price.yearly : plan.price.monthly}
                      </span>
                      <span className="text-gray-500">/ month</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">{plan.price.monthly}</span>
                  )}
                </div>
                <p className="text-base text-gray-600 mb-4">{plan.description}</p>

                {plan.cta === "Book a Call" ? (
                  <a href="https://calendly.com/jessie-nativespeaking/meet-jessie?month=2025-09" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-gray-900 hover:bg-gray-800">
                      {plan.cta}
                    </Button>
                  </a>
                ) : (
                  <SignUpButton mode="modal">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      {plan.cta}
                    </Button>
                  </SignUpButton>
                )}
              </div>

              {/* Post Generation */}
              {plan.postGeneration && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Post generation:</p>
                  <p className="text-base text-gray-600">{plan.postGeneration}</p>
                </div>
              )}

              {/* Features */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Features:</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className={`text-base text-gray-600 ${
                      feature.includes('Everything in') || feature.includes('plus:') ? 'font-medium mb-2' : 'pl-4'
                    }`}>
                      {!feature.includes('Everything in') && !feature.includes('plus:') && '• '}
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Service (Business plan only) */}
              {plan.service && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Service:</p>
                  <ul className="space-y-2">
                    {plan.service.map((service, serviceIndex) => (
                      <li key={serviceIndex} className="text-base text-gray-600 pl-4">
                        • {service}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer */}
              {plan.footer && (
                <div className="pt-4 mt-auto border-t border-gray-100">
                  {plan.footer.map((item, index) => (
                    <p key={index} className="text-sm text-gray-500">{item}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}