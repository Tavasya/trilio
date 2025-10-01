import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Copy, AlertCircle, CheckCircle } from 'lucide-react';
import trilioLogo from '@/lib/logo/trilio-logo.png';
import Footer from '@/components/Footer';

export default function LinkedInCharacterCounter() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  // LinkedIn limits
  const POST_LIMIT = 3000;
  const VISIBLE_LIMIT = 210; // Before "see more"
  const HEADLINE_LIMIT = 220;
  const ABOUT_LIMIT = 2600;
  const ARTICLE_LIMIT = 110000;

  const characterCount = text.length;
  const remainingPost = POST_LIMIT - characterCount;
  const isOverLimit = characterCount > POST_LIMIT;

  // SEO metadata
  useEffect(() => {
    document.title = 'Free LinkedIn Character Counter Tool | Check Post Length Instantly | Trilio';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Free LinkedIn character counter tool. Check LinkedIn post length, headline limits, and optimize your content. Perfect 3000 character limit checker with real-time updates.');
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getProgressColor = () => {
    if (isOverLimit) return 'bg-red-500';
    if (characterCount > VISIBLE_LIMIT) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressWidth = () => {
    return Math.min((characterCount / POST_LIMIT) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src={trilioLogo} alt="Trilio" className="h-8 w-auto" />
            </Link>
            <nav className="flex items-center gap-6">
              <Link to="/" className="text-gray-600 hover:text-primary text-sm font-medium">
                Home
              </Link>
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            LinkedIn Character Counter
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Check your LinkedIn post length instantly. Stay within the 3000 character limit and optimize for maximum visibility.
          </p>
        </div>
      </section>

      {/* Tool Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Character Counter */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your LinkedIn post content
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Start typing or paste your LinkedIn post here..."
              />
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getProgressColor()}`}
                  style={{ width: `${getProgressWidth()}%` }}
                />
              </div>
            </div>

            {/* Character Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${isOverLimit ? 'text-red-500' : 'text-gray-900'}`}>
                  {characterCount}
                </div>
                <div className="text-xs text-gray-600">Characters</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${remainingPost < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {remainingPost}
                </div>
                <div className="text-xs text-gray-600">Remaining</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {text.split(/\s+/).filter(word => word.length > 0).length}
                </div>
                <div className="text-xs text-gray-600">Words</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {text.split(/\n/).length}
                </div>
                <div className="text-xs text-gray-600">Lines</div>
              </div>
            </div>

            {/* Warnings and Tips */}
            {characterCount > VISIBLE_LIMIT && characterCount <= POST_LIMIT && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800">
                    Your post exceeds {VISIBLE_LIMIT} characters. LinkedIn will show "...see more" after the first {VISIBLE_LIMIT} characters.
                  </p>
                  <p className="text-sm text-yellow-800 mt-1">
                    <strong>Tip:</strong> Put your hook in the first 2 lines to maximize engagement!
                  </p>
                </div>
              </div>
            )}

            {isOverLimit && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">
                  Your post exceeds LinkedIn's {POST_LIMIT} character limit by {Math.abs(remainingPost)} characters.
                  Please shorten your content.
                </p>
              </div>
            )}

            {characterCount > 0 && characterCount <= VISIBLE_LIMIT && (
              <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">
                  Perfect! Your entire post will be visible without "see more". This maximizes engagement!
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                disabled={!text}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
              <button
                onClick={() => setText('')}
                disabled={!text}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear
              </button>
            </div>
          </div>

          {/* LinkedIn Limits Reference */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">LinkedIn Character Limits Quick Reference</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-700 font-medium">Post</span>
                  <span className="text-gray-900 font-semibold">{POST_LIMIT.toLocaleString()} characters</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-700 font-medium">Headline</span>
                  <span className="text-gray-900 font-semibold">{HEADLINE_LIMIT} characters</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-700 font-medium">About Section</span>
                  <span className="text-gray-900 font-semibold">{ABOUT_LIMIT.toLocaleString()} characters</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-700 font-medium">Article</span>
                  <span className="text-gray-900 font-semibold">{ARTICLE_LIMIT.toLocaleString()} characters</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-700 font-medium">Message</span>
                  <span className="text-gray-900 font-semibold">8,000 characters</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-700 font-medium">Comment</span>
                  <span className="text-gray-900 font-semibold">1,250 characters</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Pro Tips for LinkedIn Posts</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold">1.</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Hook in First 210 Characters</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Only the first 210 characters show before "see more". Make them count with a compelling hook!
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold">2.</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Use Line Breaks</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Short paragraphs (1-2 sentences) with line breaks improve readability and engagement.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold">3.</span>
                <div>
                  <h3 className="font-semibold text-gray-900">End with a Question</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Posts ending with questions get 50% more comments. Encourage discussion!
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold">4.</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Optimal Length: 1300-2000 Characters</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Data shows posts between 1300-2000 characters get the highest engagement rates.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-xl border-l-4 border-primary">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Want to Create Better LinkedIn Content?
            </h3>
            <p className="text-gray-700 mb-6">
              Stop counting characters manually. Trilio's AI helps you write perfectly optimized LinkedIn posts
              that stay within limits and maximize engagement.
            </p>
            <Link
              to="/dashboard"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
            >
              Try Trilio Free
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}