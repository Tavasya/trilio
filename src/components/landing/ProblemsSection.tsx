import { X } from 'lucide-react';

const problems = [
  "It feels cringe… what if people judge me?",
  "I want to post, but I don't even know how to begin",
  "I spend so long editing captions and picking images, and somehow it still doesn't feel like me",
  "No one engages. I have no clue what's working or what's not",
  "It's just so hard to stay consistent… how do people do it?"
];

export default function ProblemsSection() {
  return (
    <div className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
          Posting on LinkedIn is hard.
        </h2>

        <p className="text-xl text-gray-600 text-center mb-8">
          Most founders and creators struggle with:
        </p>

        <div className="flex flex-col gap-3 max-w-2xl mx-auto">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="flex items-start gap-3 bg-gray-50 rounded-xl p-4"
            >
              <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-base text-gray-700">{problem}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}