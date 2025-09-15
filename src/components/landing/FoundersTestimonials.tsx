import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Michael Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    rating: 5,
    experience: "I have been trying out ChatGPT, Gemini, Claude, Copy.ai and many others for a very long time. I tried many different prompts to generate content that does not sound like machine. None of these were as successful as Trilio, it is amazing!!!"
  },
  {
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    rating: 5,
    experience: "Using Trilio to create my content library and it has been great! Looking forward to my engaging stats"
  },
  {
    name: "Ana Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    rating: 5,
    experience: "English isn't my first language, so writing was always hard. Trilio helped me break through that mental block, and the support team was super helpful along the way"
  },
  {
    name: "David Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    rating: 5,
    experience: "Trilio boosted my engagement 287% in the first week. It's true that people just need to start posting ... intentionally"
  },
  {
    name: "Rachel Thompson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel",
    rating: 5,
    experience: "I love how I can experiment and find the brand voice that really fits me. Suddenly, sharing content feels natural, I actually enjoy the process now. Trilio makes it so convenient. Highly recommend."
  },
  {
    name: "Robert Garcia",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    rating: 5,
    experience: "I spent over $5000 for ghostwriter and other applications before Trilio and I wish I'd found it sooner. It's been such a great return on investment!"
  },
  {
    name: "Li Wei",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Li",
    rating: 5,
    experience: "I'm not good expressing myself in English. Trilio walked me through the process seamlessly and I now like to write in English more than Chinese!!"
  },
  {
    name: "Alex Kumar",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    rating: 5,
    experience: "As an engineer, I struggled with LinkedIn content. Trilio helped me translate my technical knowledge into engaging posts that actually get traction. My network grew by 3x in just 2 months!"
  },
  {
    name: "Emma Davis",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    rating: 5,
    experience: "From 0 to 10K followers in 3 months! Trilio's AI understands my industry perfectly and helps me share insights that resonate with my audience. Best investment for personal branding."
  }
];

export default function FoundersTestimonials() {
  return (
    <div className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-10 text-center">
          2,000+ founders have used Trilio
        </h2>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow break-inside-avoid"
            >
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full bg-gray-100"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-base">
                    {testimonial.name}
                  </h3>
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-base text-gray-600 leading-relaxed">
                {testimonial.experience}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}