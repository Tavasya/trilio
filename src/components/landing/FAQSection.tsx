import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What is the different between ChatGPT and Trilio?",
    answer: "Use Trilio when you're serious about growing on LinkedIn. We've curated a database of 20,000+ LinkedIn posts and profiles to help you:\n\n• Create content that matches your brand voice, consistently\n• Stay on top of industry trends\n• Generate high-performing posts consistently\n• Save time with a streamlined LinkedIn workflow"
  },
  {
    question: "Who is Trilio best suited for?",
    answer: "Trilio is ideal for solopreneurs, content creators, founders, marketers, and anyone looking to grow their presence on LinkedIn without spending hours on content planning."
  },
  {
    question: "Can I customize the tone and voice of the AI-generated content?",
    answer: "Yes! Trilio allows you to curate and fine-tune your brand voice so that every post reflects your unique style and messaging."
  },
  {
    question: "How frequently should I post on LinkedIn to get results?",
    answer: "It varies, but since Trilio makes content creation easy, posting once a day is a great way to stay visible. If that's not possible, aim for at least three times a week as the minimum to maintain your presence."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLHeadingElement | null>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === headerRef.current && entry.isIntersecting) {
            setHeaderVisible(true);
          } else if (entry.isIntersecting) {
            const index = itemRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1 && !visibleItems.includes(index)) {
              setTimeout(() => {
                setVisibleItems(prev => [...prev, index]);
              }, index * 100);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (headerRef.current) observer.observe(headerRef.current);

    setTimeout(() => {
      itemRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }, 100);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 ref={headerRef} className={`text-4xl md:text-5xl font-bold text-gray-900 mb-10 text-center transition-all duration-700 ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              ref={(el) => {itemRefs.current[index] = el}}
              className={`bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-700 ${
                visibleItems.includes(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 text-base">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-4 pt-0">
                  <div className="text-base text-gray-600 leading-relaxed whitespace-pre-line">{faq.answer}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}