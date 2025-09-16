import React, { useState, useEffect } from "react";
import { TrendingUp, FileText, Users, Briefcase, Target, Hash, MessageSquare, BarChart } from "lucide-react";

interface Task {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const tasks: Task[] = [
  {
    id: "viral-post",
    label: "Write viral post",
    icon: <TrendingUp className="w-4 h-4" />,
    color: "bg-white text-gray-900 hover:bg-gray-50 shadow-sm"
  },
  {
    id: "profile-optimization",
    label: "Optimize profile",
    icon: <FileText className="w-4 h-4" />,
    color: "bg-white text-gray-900 hover:bg-gray-50 shadow-sm"
  },
  {
    id: "grow-network",
    label: "Grow network",
    icon: <Users className="w-4 h-4" />,
    color: "bg-white text-gray-900 hover:bg-gray-50 shadow-sm"
  },
  {
    id: "job-post",
    label: "Job announcement",
    icon: <Briefcase className="w-4 h-4" />,
    color: "bg-white text-gray-900 hover:bg-gray-50 shadow-sm"
  },
  {
    id: "thought-leadership",
    label: "Thought leadership",
    icon: <Target className="w-4 h-4" />,
    color: "bg-white text-gray-900 hover:bg-gray-50 shadow-sm"
  },
  {
    id: "trending-topics",
    label: "Trending topics",
    icon: <Hash className="w-4 h-4" />,
    color: "bg-white text-gray-900 hover:bg-gray-50 shadow-sm"
  },
  {
    id: "engage-comments",
    label: "Engage comments",
    icon: <MessageSquare className="w-4 h-4" />,
    color: "bg-white text-gray-900 hover:bg-gray-50 shadow-sm"
  },
  {
    id: "analytics",
    label: "Content analytics",
    icon: <BarChart className="w-4 h-4" />,
    color: "bg-white text-gray-900 hover:bg-gray-50 shadow-sm"
  }
];

export default function QuickStartTasks() {
  const [visibleTasks, setVisibleTasks] = useState<number>(0);

  useEffect(() => {
    // Start animation after a short delay to let the page load
    const initialDelay = setTimeout(() => {
      tasks.forEach((_, index) => {
        setTimeout(() => {
          setVisibleTasks(index + 1);
        }, index * 60); // 60ms delay between each task
      });
    }, 300); // Initial 300ms delay

    return () => clearTimeout(initialDelay);
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto px-6">
      {tasks.map((task, index) => (
        <button
          key={task.id}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-normal transition-all duration-300 ${task.color} ${
            index < visibleTasks
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          }`}
          style={{
            transitionDelay: `${index * 30}ms`
          }}
        >
          {task.icon}
          <span>{task.label}</span>
        </button>
      ))}
    </div>
  );
}