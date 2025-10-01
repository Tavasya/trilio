import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Hash, Copy, RefreshCw, TrendingUp } from 'lucide-react';
import trilioLogo from '@/lib/logo/trilio-logo.png';
import Footer from '@/components/Footer';

export default function LinkedInHashtagGenerator() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [topic, setTopic] = useState('');
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // SEO metadata
  useEffect(() => {
    document.title = 'Free LinkedIn Hashtag Generator | Find Trending Hashtags | Trilio';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Generate powerful LinkedIn hashtags instantly. Find trending hashtags for your posts, boost visibility, and reach your target audience. Free hashtag generator tool.');
    }
  }, []);

  // Hashtag database (simulated)
  const hashtagDatabase = {
    marketing: ['#marketing', '#digitalmarketing', '#contentmarketing', '#marketingstrategy', '#marketingtips', '#socialmediamarketing', '#b2bmarketing', '#growthhacking', '#marketingdigital', '#brandmarketing'],
    technology: ['#technology', '#tech', '#innovation', '#ai', '#artificialintelligence', '#machinelearning', '#coding', '#programming', '#softwaredevelopment', '#techtrends'],
    business: ['#business', '#entrepreneur', '#startup', '#businessgrowth', '#leadership', '#businessstrategy', '#businessowner', '#smallbusiness', '#businessdevelopment', '#businesstips'],
    career: ['#career', '#careeradvice', '#jobsearch', '#careerdevelopment', '#careergoals', '#professionaldevelopment', '#careerchange', '#jobhunt', '#recruitment', '#hiring'],
    sales: ['#sales', '#salestips', '#b2bsales', '#salesstrategy', '#salestraining', '#salesforce', '#salesmanagement', '#salesteam', '#salesenablement', '#salesleadership'],
    productivity: ['#productivity', '#timemanagement', '#productivitytips', '#worklifebalance', '#efficiency', '#productivityhacks', '#getthingsdone', '#focus', '#organization', '#workflow'],
    design: ['#design', '#ux', '#ui', '#graphicdesign', '#webdesign', '#designthinking', '#userexperience', '#uxdesign', '#productdesign', '#creativedesign'],
    finance: ['#finance', '#investing', '#personalfinance', '#financialplanning', '#fintech', '#cryptocurrency', '#stockmarket', '#wealthmanagement', '#financialfreedom', '#money'],
  };

  const trendingHashtags = [
    { tag: '#LinkedInTips', reach: '2.3M' },
    { tag: '#PersonalBranding', reach: '1.8M' },
    { tag: '#ThoughtLeadership', reach: '1.5M' },
    { tag: '#WorkFromHome', reach: '1.2M' },
    { tag: '#FutureOfWork', reach: '980K' },
    { tag: '#MondayMotivation', reach: '850K' },
  ];

  const generateHashtags = () => {
    if (!topic.trim()) return;

    const topicLower = topic.toLowerCase();
    let hashtags: string[] = [];

    // Check each category for relevance
    Object.entries(hashtagDatabase).forEach(([category, tags]) => {
      if (topicLower.includes(category) || category.includes(topicLower)) {
        hashtags = [...hashtags, ...tags.slice(0, 5)];
      }
    });

    // Add generic hashtags if no specific match
    if (hashtags.length === 0) {
      hashtags = [
        '#linkedin',
        '#professionalnetwork',
        '#businessnetworking',
        '#linkedincommunity',
        '#linkedinpost'
      ];
    }

    // Add topic-based hashtag
    const topicHashtag = `#${topic.replace(/\s+/g, '').toLowerCase()}`;
    if (!hashtags.includes(topicHashtag)) {
      hashtags.unshift(topicHashtag);
    }

    // Limit to 15 hashtags
    setGeneratedHashtags(hashtags.slice(0, 15));
  };

  const toggleHashtag = (hashtag: string) => {
    if (selectedHashtags.includes(hashtag)) {
      setSelectedHashtags(selectedHashtags.filter(h => h !== hashtag));
    } else if (selectedHashtags.length < 5) {
      setSelectedHashtags([...selectedHashtags, hashtag]);
    }
  };

  const copyHashtags = () => {
    const hashtagString = selectedHashtags.join(' ');
    navigator.clipboard.writeText(hashtagString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            LinkedIn Hashtag Generator
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Generate relevant LinkedIn hashtags to increase your post visibility and reach the right audience.
          </p>
        </div>
      </section>

      {/* Tool Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Input Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's your post about?
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && generateHashtags()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., digital marketing, AI technology, leadership tips..."
              />
              <button
                onClick={generateHashtags}
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Generate
              </button>
            </div>
          </div>

          {/* Generated Hashtags */}
          {generatedHashtags.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Generated Hashtags (Select up to 5)
                </h2>
                <span className="text-sm text-gray-500">
                  {selectedHashtags.length}/5 selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {generatedHashtags.map((hashtag) => (
                  <button
                    key={hashtag}
                    onClick={() => toggleHashtag(hashtag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedHashtags.includes(hashtag)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {hashtag}
                  </button>
                ))}
              </div>

              {selectedHashtags.length > 0 && (
                <>
                  <div className="p-4 bg-gray-50 rounded-lg mb-4">
                    <p className="text-sm text-gray-600 mb-2">Selected hashtags:</p>
                    <p className="text-gray-900 font-medium">{selectedHashtags.join(' ')}</p>
                  </div>
                  <button
                    onClick={copyHashtags}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? 'Copied!' : 'Copy Hashtags'}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Trending Hashtags */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">Trending on LinkedIn</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {trendingHashtags.map((item) => (
                <div key={item.tag} className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-gray-900 font-medium">{item.tag}</span>
                  <span className="text-sm text-gray-500">{item.reach} posts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">LinkedIn Hashtag Best Practices</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Hash className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Use 3-5 Hashtags</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    LinkedIn recommends 3-5 hashtags per post for optimal reach. More than that can reduce visibility.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Hash className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Mix Popular and Niche</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Combine broad hashtags (high reach) with specific ones (targeted audience) for best results.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Hash className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Research Before Using</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Click on hashtags to see how many followers they have. Aim for hashtags with 10K+ followers.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Hash className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Place at the End</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Put hashtags at the end of your post or in the first comment for cleaner appearance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-xl border-l-4 border-primary">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Ready to Amplify Your LinkedIn Reach?
            </h3>
            <p className="text-gray-700 mb-6">
              Trilio's AI doesn't just generate hashtags – it creates complete, optimized LinkedIn posts
              that drive engagement and grow your network.
            </p>
            <Link
              to="/dashboard"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
            >
              Create Viral LinkedIn Content
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}