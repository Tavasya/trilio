import { useEffect, useState } from 'react';

interface Notification {
  id: number;
  company: string;
  recruiter: string;
  role?: string;
  message: string;
  time: string;
  initials: string;
  color: string;
}

// Generate times based on current time
const generateTime = (minutesAgo: number) => {
  const now = new Date();
  const messageTime = new Date(now.getTime() - minutesAgo * 60000);

  // Format as HH:MM AM/PM
  return messageTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const notifications: Notification[] = [
  {
    id: 1,
    company: "Google",
    recruiter: "Sarah Chen",
    role: "Technical Recruiter",
    message: "Hi! I came across your profile and I'm impressed with your projects. Are you open to opportunities?",
    time: generateTime(2),
    initials: "SC",
    color: "bg-blue-500"
  },
  {
    id: 2,
    company: "Microsoft",
    recruiter: "Michael Johnson",
    role: "Senior Recruiter",
    message: "Your LinkedIn profile caught my attention. We have exciting SDE opportunities...",
    time: generateTime(15),
    initials: "MJ",
    color: "bg-green-600"
  },
  {
    id: 3,
    company: "Amazon",
    recruiter: "Emily Rodriguez",
    role: "Sr. Technical Recruiter",
    message: "I'd love to discuss our New Grad SDE positions with you!",
    time: generateTime(60),
    initials: "ER",
    color: "bg-orange-500"
  },
  {
    id: 4,
    company: "Meta",
    recruiter: "David Kim",
    role: "Engineering Recruiter",
    message: "Your background in AI/ML is exactly what we're looking for...",
    time: generateTime(120),
    initials: "DK",
    color: "bg-purple-500"
  },
  {
    id: 5,
    company: "Apple",
    recruiter: "Jessica Liu",
    role: "Talent Acquisition",
    message: "Interested in shaping the future of technology? Let's connect!",
    time: generateTime(180),
    initials: "JL",
    color: "bg-gray-700"
  },
  {
    id: 6,
    company: "Netflix",
    recruiter: "Tom Williams",
    role: "Technical Recruiter",
    message: "Your full-stack skills align perfectly with our team's needs...",
    time: generateTime(300),
    initials: "TW",
    color: "bg-red-600"
  }
];

export default function RecruiterNotifications() {
  const [visibleNotifications, setVisibleNotifications] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < notifications.length) {
        setVisibleNotifications(prev => [...prev, currentIndex]);
        setCurrentIndex(prev => prev + 1);
      } else {
        // Reset and cycle
        setVisibleNotifications([]);
        setCurrentIndex(0);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="relative w-full h-[550px] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
      {/* LinkedIn-style header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <h3 className="text-base font-semibold text-gray-900">Messaging</h3>
      </div>

      {/* Messages container */}
      <div className="p-3 space-y-2 bg-gray-50">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg hover:shadow-md transition-all duration-300 transform ${
              visibleNotifications.includes(index)
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-0'
            }`}
            style={{
              transitionDelay: `${index * 50}ms`
            }}
          >
            <div className="p-3">
              <div className="flex items-start gap-3">
                {/* Profile picture with green dot */}
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 ${notification.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                    {notification.initials}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {notification.recruiter}
                      </p>
                      <p className="text-xs text-gray-500">
                        {notification.role} at {notification.company}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2 text-left">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Unread indicator */}
      <div className="absolute top-3 right-6 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
        {notifications.length} new
      </div>
    </div>
  );
}