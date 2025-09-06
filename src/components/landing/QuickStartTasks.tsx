import React from "react";
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
  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto px-6">
      {tasks.map((task) => (
        <button
          key={task.id}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-normal transition-colors ${task.color}`}
        >
          {task.icon}
          <span>{task.label}</span>
        </button>
      ))}
    </div>
  );
}