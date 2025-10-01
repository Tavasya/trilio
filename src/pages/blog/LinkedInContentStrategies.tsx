import { useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import trilioLogo from '@/lib/logo/trilio-logo.png';
import Footer from '@/components/Footer';

export default function LinkedInContentStrategies() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Blog metadata for SEO
  const blogMeta = {
    title: "10 LinkedIn Content Strategies That Actually Work in 2025",
    description: "Discover proven LinkedIn content strategies to grow your professional network, increase engagement, and generate quality leads using AI-powered tools.",
    publishDate: "December 30, 2024",
    readTime: "8 min read",
    canonical: "https://trilio.app/blog/linkedin-content-strategies",
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

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {blogMeta.title}
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {blogMeta.description}
            </p>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime="2024-12-30">{blogMeta.publishDate}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{blogMeta.readTime}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-6 prose prose-lg">
            <p className="text-gray-700 leading-relaxed mb-6">
              LinkedIn has evolved from a simple networking platform to a powerful content marketing machine.
              With over 900 million professionals actively engaging on the platform, creating content that
              resonates with your audience has never been more crucial for business growth.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              1. The Hook is Everything
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Your first two lines determine whether someone reads your post or scrolls past. Studies show
              that posts with compelling hooks see 3x higher engagement rates. Start with a question,
              surprising statistic, or bold statement that stops the scroll.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              2. Authentic Storytelling Wins
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              LinkedIn users crave authentic, relatable content. Share your failures alongside your successes.
              Talk about the lessons learned, the challenges overcome, and the real journey behind your
              professional growth. This vulnerability creates deeper connections with your audience.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              3. Leverage AI Without Losing Your Voice
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              AI tools like Trilio can supercharge your content creation, but the key is maintaining your
              unique voice. Use AI to generate ideas, overcome writer's block, and optimize your posts for
              engagement—but always add your personal touch and expertise to make the content truly yours.
            </p>

            <div className="bg-primary/5 border-l-4 border-primary p-6 my-8 rounded-r-lg">
              <p className="text-gray-700 italic">
                "The best LinkedIn content doesn't just inform—it starts conversations. Every post should
                invite your audience to share their thoughts and experiences."
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              4. Consistency Beats Perfection
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Posting consistently is more valuable than posting perfectly. Aim for 3-5 posts per week
              to stay top of mind with your network. Use scheduling tools to maintain consistency even
              during busy periods.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              5. Engage Before You Post
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Spend 10-15 minutes engaging with others' content before publishing your own. This primes
              the LinkedIn algorithm to show your post to more people and builds reciprocal relationships
              with your network.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Key Takeaways
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
              <li>Start every post with a compelling hook that stops the scroll</li>
              <li>Share authentic stories that showcase both successes and failures</li>
              <li>Use AI tools strategically while maintaining your unique voice</li>
              <li>Post consistently 3-5 times per week for maximum visibility</li>
              <li>Engage with your network before and after posting</li>
            </ul>

            <div className="bg-gray-50 p-8 rounded-xl my-12">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Ready to Transform Your LinkedIn Presence?
              </h3>
              <p className="text-gray-700 mb-6">
                Join thousands of professionals using Trilio to create engaging LinkedIn content that
                converts. Our AI-powered platform helps you craft authentic posts that resonate with
                your audience.
              </p>
              <Link
                to="/dashboard"
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
              >
                Start Creating Better Content
              </Link>
            </div>
          </div>
        </section>


        {/* Related Articles */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <article className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Why AI Will Replace 90% of LinkedIn Marketers by 2026
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  The uncomfortable truth about AI's impact on marketing jobs and what you can do...
                </p>
                <Link to="/blog/ai-replacing-linkedin-marketers" className="text-primary hover:underline text-sm font-medium">
                  Read More →
                </Link>
              </article>
              <article className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Building Your Personal Brand as a Founder on LinkedIn
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Essential strategies for founders to build authentic presence and thought leadership...
                </p>
                <Link to="/blog/personal-brand-founder-linkedin" className="text-primary hover:underline text-sm font-medium">
                  Read More →
                </Link>
              </article>
              <article className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2">
                  The Student's Guide to LinkedIn: Landing Your Dream Career
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  How students can leverage LinkedIn for internships and career opportunities...
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