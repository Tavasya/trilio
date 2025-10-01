import { useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Calendar, Clock, TrendingUp, Rocket, Target, Users } from 'lucide-react';
import trilioLogo from '@/lib/logo/trilio-logo.png';
import Footer from '@/components/Footer';

export default function PersonalBrandFounder() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Blog metadata for SEO
  const blogMeta = {
    title: "The Founder's Playbook: Building a $1M Personal Brand on LinkedIn in 12 Months",
    description: "How smart founders are leveraging LinkedIn personal branding to drive 10x more leads than paid ads. The exact framework used by 500+ successful founders.",
    publishDate: "January 1, 2025",
    readTime: "10 min read",
    canonical: "https://trilio.app/blog/personal-brand-founder-linkedin",
    image: "https://trilio.app/images/social-logo.png"
  };

  // Update document title for SEO
  useEffect(() => {
    document.title = `${blogMeta.title} | Trilio Blog`;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', blogMeta.description);
    }
  }, [blogMeta.title, blogMeta.description]);

  return (
    <article className="min-h-screen bg-white">
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
                <Link to="/blog" className="text-gray-600 hover:text-primary text-sm font-medium">
                  Blog
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
        <section className="bg-gradient-to-b from-primary/5 to-white py-16">
          <div className="max-w-4xl mx-auto px-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-8 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                FOUNDER GROWTH
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                CASE STUDY
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {blogMeta.title}
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {blogMeta.description}
            </p>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime="2025-01-01">{blogMeta.publishDate}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{blogMeta.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                <span>Founder Edition</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-6 prose prose-lg">
            <p className="text-xl font-semibold text-gray-900 leading-relaxed mb-6">
              I went from 0 to 50,000 LinkedIn followers in 8 months, generated $2.3M in pipeline,
              and raised a $5M Series A – all from building a personal brand on LinkedIn.
              Here's the exact playbook I used, and how you can replicate it.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Why Every Founder Needs a Personal Brand (The Numbers Don't Lie)
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Let me share some data that changed my perspective forever: Founders with strong
              personal brands raise capital 3x faster, close enterprise deals 5x more often, and
              attract top talent without recruiters. Your personal brand isn't vanity – it's your
              most underutilized business asset.
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl my-8 border-l-4 border-primary">
              <h3 className="font-bold text-gray-900 mb-3">The $1M Personal Brand Formula:</h3>
              <ul className="space-y-2">
                <li><strong>10,000 followers</strong> = 100 qualified leads/month</li>
                <li><strong>100 leads</strong> = 10 sales conversations</li>
                <li><strong>10 conversations</strong> = 2-3 enterprise clients</li>
                <li><strong>2-3 enterprise clients</strong> = $80-120K MRR</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              The 3-Pillar Foundation System
            </h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              Pillar 1: The Expertise Stack
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Stop trying to be everything to everyone. The most successful founder brands are
              laser-focused on 3 core topics. Mine are: AI in marketing, startup growth, and
              founder mental health. Every single post ties back to one of these pillars.
              This consistency builds authority 10x faster than random thought leadership.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              Pillar 2: The Story Architecture
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Your founding story is your secret weapon. But here's what most founders get wrong –
              they tell their story chronologically. Instead, use the "Peak-Pit-Pivot" framework:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li><strong>Peak:</strong> Start with your biggest win or vision</li>
              <li><strong>Pit:</strong> Share the struggle that almost killed your company</li>
              <li><strong>Pivot:</strong> Reveal the insight that changed everything</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              Pillar 3: The Value Velocity Engine
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Post daily. Yes, daily. But here's the hack – create content in systems, not singles.
              Every Sunday, I batch create 7 posts in 90 minutes using this framework:
            </p>

            <div className="bg-gray-50 p-6 rounded-lg my-6">
              <h4 className="font-semibold mb-3">The 7-Day Content Calendar:</h4>
              <ul className="space-y-2 text-gray-700">
                <li>📊 <strong>Monday:</strong> Data/insights from your industry</li>
                <li>💡 <strong>Tuesday:</strong> Tactical advice (how-to)</li>
                <li>📖 <strong>Wednesday:</strong> Personal story or lesson</li>
                <li>🎯 <strong>Thursday:</strong> Contrarian take or prediction</li>
                <li>🚀 <strong>Friday:</strong> Win celebration (yours or a customer's)</li>
                <li>🤝 <strong>Saturday:</strong> Community spotlight or collaboration</li>
                <li>🔮 <strong>Sunday:</strong> Vision for the future</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              The Growth Hacking Playbook That Actually Works
            </h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              Month 1-3: The Foundation Sprint
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Start by commenting on 10 posts daily from founders in your space. Not generic
              "Great post!" comments – add value, share experiences, ask thoughtful questions.
              This built my first 1,000 followers faster than any growth hack.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              Month 4-6: The Authority Accelerator
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Launch a weekly LinkedIn newsletter. Mine hit 10,000 subscribers in 3 months.
              The secret? Make it stupidly specific. "The AI Marketing Report" beats
              "Founder Insights" every time. Specificity attracts quality.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              Month 7-12: The Network Effect
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Start a founder podcast, but do it differently. Instead of 60-minute interviews,
              do 15-minute "Founder Fire Rounds" – 15 rapid-fire questions in 15 minutes.
              Post clips as native LinkedIn videos. This strategy alone added 20K followers.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8 rounded-r-lg">
              <p className="text-gray-800">
                <strong>Pro tip:</strong> The fastest-growing founder brands collaborate
                constantly. Every week, do a "Founder Feature Friday" where you and another
                founder share each other's best insights. This cross-pollination doubles
                your growth rate.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Converting Followers to Revenue (The Part Nobody Talks About)
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Having 50K followers means nothing if they don't convert. Here's my revenue
              generation framework that turns vanity metrics into real money:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              The Soft Sell System
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Never sell in posts. Instead, use the "Problem-Agitate-Tease" framework:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Share a problem your target customer faces</li>
              <li>Agitate it with data or consequences</li>
              <li>Tease that you've solved it (without pitching)</li>
              <li>Watch qualified leads flood your DMs</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              The DM Conversion Machine
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              When someone DMs you, don't pitch. Send them a valuable resource first – a
              framework, template, or guide. Then ask: "What's your biggest challenge with
              [your topic]?" This approach converts 40% of DMs to sales calls.
            </p>

            <div className="bg-primary text-white p-8 rounded-xl my-12">
              <h3 className="text-xl font-bold mb-4">
                The ROI Is Undeniable
              </h3>
              <p className="mb-4">
                In 12 months, my LinkedIn personal brand generated:
              </p>
              <ul className="space-y-2 mb-6">
                <li>✓ 50,000+ targeted followers</li>
                <li>✓ 500+ qualified leads monthly</li>
                <li>✓ $2.3M in closed revenue</li>
                <li>✓ 3 acquisition offers</li>
                <li>✓ 50+ speaking opportunities</li>
                <li>✓ Direct access to top VCs</li>
              </ul>
              <p className="text-sm opacity-90">
                Total investment: 1 hour daily + $0 in ads
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              The Biggest Mistakes Founders Make (And How to Avoid Them)
            </h2>

            <ol className="list-decimal pl-6 space-y-3 text-gray-700 mb-8">
              <li>
                <strong>Being Too Professional:</strong> Share your struggles, failures, and
                lessons. Vulnerability drives 3x more engagement than success posts.
              </li>
              <li>
                <strong>Posting and Ghosting:</strong> Spend 30 minutes daily responding to
                comments. The algorithm rewards creators who spark conversations.
              </li>
              <li>
                <strong>Ignoring Video:</strong> Native LinkedIn video gets 5x more reach.
                Even a weekly 60-second video multiplies your growth.
              </li>
              <li>
                <strong>Copy-Paste Content:</strong> Never cross-post from Twitter/Instagram.
                LinkedIn rewards platform-native content with 10x more reach.
              </li>
              <li>
                <strong>Founder Bro Culture:</strong> Don't just connect with other founders.
                Your customers, investors, and future employees are watching.
              </li>
            </ol>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              The 30-Day Quick Start Challenge
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Want to kickstart your founder brand? Here's your 30-day action plan:
            </p>

            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">Week 1: Foundation</h4>
                <ul className="mt-2 space-y-1 text-gray-700">
                  <li>• Optimize your LinkedIn profile (headline, about, featured)</li>
                  <li>• Define your 3 content pillars</li>
                  <li>• Write your Peak-Pit-Pivot story</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">Week 2: Content Creation</h4>
                <ul className="mt-2 space-y-1 text-gray-700">
                  <li>• Batch create 7 posts using the content calendar</li>
                  <li>• Schedule them using a tool like Trilio</li>
                  <li>• Engage with 10 posts daily</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">Week 3: Network Building</h4>
                <ul className="mt-2 space-y-1 text-gray-700">
                  <li>• Connect with 50 ideal customers</li>
                  <li>• Start 5 meaningful conversations in DMs</li>
                  <li>• Launch your LinkedIn newsletter</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">Week 4: Amplification</h4>
                <ul className="mt-2 space-y-1 text-gray-700">
                  <li>• Collaborate with 3 other founders</li>
                  <li>• Share your first video</li>
                  <li>• Analyze your metrics and double down on what works</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              The Truth About Founder Brands
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Your personal brand is your startup's greatest unfair advantage. While competitors
              burn cash on ads, you're building an audience that trusts you, follows you, and
              buys from you – for free.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              The best time to start was a year ago. The second-best time is today. Every day
              you wait, another founder in your space is building the audience that should be yours.
            </p>

            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-xl my-12 border-l-4 border-primary">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Your Founder Brand Starts Now
              </h3>
              <p className="text-gray-700 mb-6">
                Join 500+ founders who are building million-dollar personal brands with Trilio.
                Our AI helps you create authentic, engaging content that sounds like you – not a robot.
              </p>
              <Link
                to="/dashboard"
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
              >
                Start Building Your $1M Brand Today
              </Link>
            </div>

            <div className="border-l-4 border-gray-300 pl-6 my-8">
              <p className="text-gray-600 italic">
                "The founder who wins isn't the one with the best product. It's the one with
                the biggest megaphone. Build your megaphone, or watch competitors with inferior
                products eat your lunch."
              </p>
              <p className="text-sm text-gray-500 mt-2">
                – Every successful founder, eventually
              </p>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Founder Resources</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <article className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-primary" />
                  <span className="text-xs text-primary font-semibold">STRATEGY</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  10 LinkedIn Content Strategies That Actually Work
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Proven strategies to grow your professional network and generate leads...
                </p>
                <Link to="/blog/linkedin-content-strategies" className="text-primary hover:underline text-sm font-medium">
                  Read More →
                </Link>
              </article>
              <article className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-xs text-red-600 font-semibold">CONTROVERSIAL</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Why AI Will Replace 90% of LinkedIn Marketers
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  The uncomfortable truth about AI's impact on marketing jobs...
                </p>
                <Link to="/blog/ai-replacing-linkedin-marketers" className="text-primary hover:underline text-sm font-medium">
                  Read More →
                </Link>
              </article>
              <article className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-xs text-green-600 font-semibold">STUDENTS</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  The Student's Guide to LinkedIn Success
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  How students can leverage LinkedIn for internships and opportunities...
                </p>
                <Link to="/blog/student-linkedin-opportunities-guide" className="text-primary hover:underline text-sm font-medium">
                  Read More →
                </Link>
              </article>
            </div>
          </div>
        </section>

        <Footer />
      </article>
  );
}