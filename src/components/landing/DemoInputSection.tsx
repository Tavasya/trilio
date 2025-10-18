import { Target, ArrowUp, AlignLeft } from 'lucide-react';

export default function DemoInputSection() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Textbox */}
      <div className="relative bg-white rounded-3xl shadow-lg border border-gray-200">
        <textarea
          value=""
          placeholder="e.g., AI in marketing, productivity tips, startup lessons..."
          className="w-full px-6 py-5 pb-16 bg-transparent border-0 rounded-3xl resize-none focus:ring-0 focus:outline-none text-base leading-relaxed placeholder:text-gray-400"
          rows={3}
          disabled
        />

        {/* Bottom Controls - Inside textarea */}
        <div className="absolute bottom-3 left-4 right-4">
          {/* Pills and Send Button Container */}
          <div className="flex items-center justify-between gap-3">
            {/* Left Side Pills - Horizontal layout */}
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium cursor-not-allowed border border-gray-200"
                disabled
              >
                <Target className="w-4 h-4" />
                <span>Hooks</span>
              </button>

              <button
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium cursor-not-allowed border border-gray-200"
                disabled
              >
                <AlignLeft className="w-4 h-4" />
                <span>Post Length</span>
              </button>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-sm font-medium border border-primary/20">
                <span>Medium</span>
              </div>
            </div>

            {/* Right Side - Send Button */}
            <button
              disabled
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors bg-gray-200 cursor-not-allowed"
            >
              <ArrowUp className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
