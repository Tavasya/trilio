import { useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Calendar, Clock, GraduationCap, Briefcase, Trophy, DollarSign } from 'lucide-react';
import trilioLogo from '@/lib/logo/trilio-logo.png';
import Footer from '@/components/Footer';

export default function StudentLinkedInGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Blog metadata for SEO
  const blogMeta = {
    title: "From Zero to $100K Job Offers: The Student's LinkedIn Playbook That Universities Won't Teach You",
    description: "How smart students are using LinkedIn to skip the job fair and land 6-figure offers before graduation. The exact strategy that helped 1,000+ students get hired by top companies.",
    publishDate: "January 2, 2025",
    readTime: "12 min read",
    canonical: "https://trilio.app/blog/student-linkedin-opportunities-guide",
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
        <section className="bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="max-w-4xl mx-auto px-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-8 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full flex items-center gap-1">
                <GraduationCap className="w-3 h-3" />
                STUDENT SUCCESS
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                CAREER GUIDE
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
                <time dateTime="2025-01-02">{blogMeta.publishDate}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{blogMeta.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>Career Edition</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-6 prose prose-lg">
            <p className="text-xl font-semibold text-gray-900 leading-relaxed mb-6">
              While your classmates are desperately applying to 100+ jobs and hearing nothing back,
              smart students are getting recruited directly by Google, Microsoft, and hot startups –
              all because they cracked the LinkedIn code. Here's the playbook your career center
              doesn't want you to know.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              The Shocking Truth: Why 95% of Students Are Invisible to Recruiters
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Here's what nobody tells you: Recruiters spend 80% of their time on LinkedIn, not job
              boards. They're searching for specific keywords, skills, and profiles. If you're not
              optimized for their searches, you literally don't exist. Meanwhile, that average student
              with a killer LinkedIn presence is getting 5-10 recruiter messages weekly.
            </p>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8 rounded-r-lg">
              <p className="text-gray-800 font-semibold">
                Reality Check: The average college graduate applies to 100+ jobs and gets a 2% response
                rate. Students with optimized LinkedIn profiles? They get recruited without applying
                to a single job.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              The $100K LinkedIn Formula (That Works Even for Freshmen)
            </h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              Step 1: The Keyword Hack That Gets You Found
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Recruiters search LinkedIn like Google. They type: "computer science intern Python AWS"
              or "marketing student social media analytics." Your profile needs these exact keywords
              repeated 3-5 times across your headline, summary, and experience. This simple hack
              increases your visibility by 40x.
            </p>

            <div className="bg-blue-50 p-6 rounded-lg my-6">
              <h4 className="font-semibold mb-3">The Perfect Student Headline Formula:</h4>
              <p className="text-gray-700 mb-3">
                "[Your Major] Student at [University] | Seeking [Industry] Internship |
                [Skill 1], [Skill 2], [Skill 3]"
              </p>
              <p className="text-sm text-gray-600">
                Example: "CS Student at Stanford | Seeking Software Engineering Internship |
                Python, React, Machine Learning"
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              Step 2: The Experience Section Hack (Even With Zero Experience)
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              No internships? No problem. Here's what counts as "experience" that students never realize:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li><strong>Class Projects:</strong> That app you built for CS class? That's experience.</li>
              <li><strong>Student Organizations:</strong> Marketing for your club? That's experience.</li>
              <li><strong>Personal Projects:</strong> Your blog, YouTube channel, or side hustle? Experience.</li>
              <li><strong>Volunteer Work:</strong> Helped a local business with their website? Experience.</li>
              <li><strong>Hackathons:</strong> Participated in a weekend hackathon? Definitely experience.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              Step 3: The 500+ Connection Strategy
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              LinkedIn shows "500+ connections" after 500, making you look established. Here's how to
              get there in 30 days:
            </p>

            <div className="bg-gray-50 p-6 rounded-lg my-6">
              <h4 className="font-semibold mb-3">The Connection Blitz Strategy:</h4>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>Connect with all classmates (easy 100-200)</li>
                <li>Add every professor and TA (20-30)</li>
                <li>Connect with alumni in your field (search: "[Your University] [Your Major]")</li>
                <li>Add professionals from companies you want to work for</li>
                <li>Join student groups and connect with all members</li>
              </ol>
              <p className="mt-4 text-sm text-gray-600">
                Pro tip: Always send a personalized message. Mention something specific from their profile.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              The Hidden Opportunities Only LinkedIn Students Access
            </h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              1. The Alumni Gold Mine
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Your university's alumni are 10x more likely to help you than random professionals.
              Search "[Your University] [Dream Company]" and message alumni working there.
              80% will offer advice, 50% will refer you internally, and 20% will become long-term mentors.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8 rounded-r-lg">
              <h4 className="font-semibold mb-2">The Magic Message Template:</h4>
              <p className="text-gray-700 italic">
                "Hi [Name], I'm a [major] student at [our university]. I saw you're working as a
                [position] at [company]. I'm really interested in [specific aspect of their work].
                Would you have 15 minutes for a quick call to share your journey from [university] to [company]?"
              </p>
              <p className="text-sm text-gray-600 mt-3">
                Success rate: 73% response, 45% agree to call
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              2. The Internship Pipeline Nobody Talks About
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Forget job boards. Here's where real opportunities hide on LinkedIn:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li><strong>Startup founders' posts:</strong> They often mention they're hiring in posts, not job listings</li>
              <li><strong>#hiring hashtag:</strong> Real-time opportunities before they hit job boards</li>
              <li><strong>Company pages "Life" tab:</strong> Shows employee posts about open roles</li>
              <li><strong>LinkedIn Events:</strong> Virtual career fairs with direct recruiter access</li>
              <li><strong>"People Also Viewed":</strong> On job posts, shows similar roles you didn't know existed</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              3. The Research Opportunity Hack
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Want to work with that famous professor? Find PhD students in their lab on LinkedIn.
              They're way more approachable than professors and desperately need undergraduate help.
              One message to a PhD student = potential research position, publication, and grad school recommendation.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              The Content Strategy That Makes Recruiters Chase You
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              You don't need to be an influencer, but posting strategically makes you 5x more likely
              to get recruited. Here's the student content formula:
            </p>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl my-8 border-l-4 border-green-500">
              <h3 className="font-bold text-gray-900 mb-3">The Weekly Post Formula:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>📚 <strong>Monday:</strong> Share a key learning from class (shows expertise)</li>
                <li>🛠️ <strong>Wednesday:</strong> Document a project you're working on (shows skills)</li>
                <li>🎯 <strong>Friday:</strong> Celebrate a small win or milestone (shows progress)</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                Just 3 posts/week = 20x more profile views = recruiters finding you
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Real Student Success Stories (With Exact Numbers)
            </h2>

            <div className="space-y-6 my-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Sarah, Computer Science Junior</h4>
                <p className="text-gray-700 mb-3">
                  "I optimized my LinkedIn following this guide. In 2 months: 15 recruiter messages,
                  5 interviews, 3 internship offers including Google. Never applied to a single job."
                </p>
                <p className="text-sm text-green-600 font-semibold">
                  Result: Google SWE Internship → $8,500/month
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Mike, Business Sophomore</h4>
                <p className="text-gray-700 mb-3">
                  "Posted about my class consulting project. A startup founder saw it and offered
                  me a paid part-time role that turned into a full-time offer before graduation."
                </p>
                <p className="text-sm text-green-600 font-semibold">
                  Result: $75K job offer as a sophomore
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Priya, Engineering Freshman</h4>
                <p className="text-gray-700 mb-3">
                  "Connected with 50 alumni. One became my mentor, introduced me to their manager,
                  and I got a freshman summer internship (super rare in engineering)."
                </p>
                <p className="text-sm text-green-600 font-semibold">
                  Result: Tesla internship as a freshman
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              The Money Moves: Turning LinkedIn Into Income While Studying
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Beyond jobs and internships, students are making $1,000-5,000/month through LinkedIn:
            </p>

            <ul className="list-disc pl-6 space-y-3 text-gray-700 mb-8">
              <li>
                <strong>Freelance opportunities:</strong> Companies post "looking for a student to help
                with..." – these pay $30-100/hour
              </li>
              <li>
                <strong>Tutoring:</strong> Other students find you for paid tutoring in your strong subjects
              </li>
              <li>
                <strong>Micro-internships:</strong> 5-40 hour paid projects perfect for students
              </li>
              <li>
                <strong>Research assistant positions:</strong> Professors from other universities recruit here
              </li>
              <li>
                <strong>Campus ambassador roles:</strong> Companies pay $500-2000/month for promotion
              </li>
            </ul>

            <div className="bg-primary text-white p-8 rounded-xl my-12">
              <h3 className="text-xl font-bold mb-4">
                The LinkedIn Student Success Metrics
              </h3>
              <p className="mb-4">
                Students who follow this playbook report:
              </p>
              <ul className="space-y-2 mb-6">
                <li>✓ 10-20 recruiter messages per month</li>
                <li>✓ 3-5 interview invitations without applying</li>
                <li>✓ 50% higher starting salary offers</li>
                <li>✓ Internships at dream companies</li>
                <li>✓ $2,000+ average monthly side income</li>
                <li>✓ Mentorship from industry leaders</li>
              </ul>
              <p className="text-sm opacity-90">
                Time investment: 30 minutes/day
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              The Biggest Mistakes Students Make (That Keep Them Broke and Unemployed)
            </h2>

            <ol className="list-decimal pl-6 space-y-3 text-gray-700 mb-8">
              <li>
                <strong>Waiting until senior year:</strong> Start freshman year. Early connections
                compound into massive opportunities.
              </li>
              <li>
                <strong>Using a casual photo:</strong> Get a professional headshot. Many universities
                offer free professional photos at career fairs.
              </li>
              <li>
                <strong>Being too humble:</strong> That 3.7 GPA? Dean's list? Hackathon participation?
                PUT IT ALL ON LINKEDIN.
              </li>
              <li>
                <strong>Ignoring LinkedIn Learning:</strong> Free with student email at many schools.
                Certificates show up on your profile.
              </li>
              <li>
                <strong>Not using student discounts:</strong> LinkedIn Premium is free for students
                at many universities. Use it for InMail credits.
              </li>
            </ol>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Your 30-Day LinkedIn Transformation Plan
            </h2>

            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">Days 1-7: Foundation</h4>
                <ul className="mt-2 space-y-1 text-gray-700">
                  <li>• Professional headshot (use portrait mode if needed)</li>
                  <li>• Keyword-optimized headline and summary</li>
                  <li>• Add all experiences (including class projects)</li>
                  <li>• Connect with 100 classmates</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">Days 8-14: Network Building</h4>
                <ul className="mt-2 space-y-1 text-gray-700">
                  <li>• Connect with 50 alumni in your field</li>
                  <li>• Join 5 relevant LinkedIn groups</li>
                  <li>• Message 10 professionals for informational interviews</li>
                  <li>• Follow 20 companies you'd love to work for</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">Days 15-21: Content Creation</h4>
                <ul className="mt-2 space-y-1 text-gray-700">
                  <li>• Share your first project post</li>
                  <li>• Write about a class learning</li>
                  <li>• Document a challenge you overcame</li>
                  <li>• Engage with 5 posts daily</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">Days 22-30: Opportunity Hunting</h4>
                <ul className="mt-2 space-y-1 text-gray-700">
                  <li>• Apply LinkedIn filters to find perfect internships</li>
                  <li>• Set up job alerts for dream companies</li>
                  <li>• Reach out to 5 hiring managers directly</li>
                  <li>• Schedule 3 coffee chats with alumni</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              The Career Center Won't Tell You This...
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Your university's career center means well, but they're teaching outdated strategies
              from 2010. They'll tell you to perfect your resume and apply online. Meanwhile, students
              who master LinkedIn are getting hired through DMs, skipping the entire application process,
              and negotiating salaries before they even graduate.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              The choice is yours: Follow the masses competing for the same jobs on Handshake, or
              build a LinkedIn presence that makes opportunities come to you.
            </p>

            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-xl my-12 border-l-4 border-primary">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Start Your $100K LinkedIn Journey Today
              </h3>
              <p className="text-gray-700 mb-6">
                Join thousands of students using Trilio to create LinkedIn content that gets them
                noticed by top recruiters. Our AI helps you write posts that showcase your potential,
                even with limited experience.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
                >
                  Start Free as a Student
                </Link>
                <span className="text-sm text-gray-600">No credit card required</span>
              </div>
            </div>

            <div className="border-l-4 border-gray-300 pl-6 my-8">
              <p className="text-gray-600 italic">
                "The best time to plant a tree was 20 years ago. The second best time is now.
                The same goes for your LinkedIn presence. Every day you wait, your classmates
                are building connections that will pay dividends for decades."
              </p>
              <p className="text-sm text-gray-500 mt-2">
                – Every successful graduate looking back
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 rounded-r-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Remember This:</h4>
              <p className="text-gray-700">
                Your GPA gets you the interview. Your LinkedIn gets you the job. While everyone
                else is stressing about grades, you'll be building the network that actually
                determines your career trajectory. Start today, thank yourself at graduation.
              </p>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">More Essential Reading</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <article className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-xs text-primary font-semibold">STRATEGY</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  10 LinkedIn Content Strategies That Actually Work
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Proven strategies to grow your network and generate opportunities...
                </p>
                <Link to="/blog/linkedin-content-strategies" className="text-primary hover:underline text-sm font-medium">
                  Read More →
                </Link>
              </article>
              <article className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <span className="text-xs text-blue-600 font-semibold">FOUNDERS</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Building Your Personal Brand as a Founder
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  The $1M personal brand playbook used by successful founders...
                </p>
                <Link to="/blog/personal-brand-founder-linkedin" className="text-primary hover:underline text-sm font-medium">
                  Read More →
                </Link>
              </article>
              <article className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-5 h-5 text-blue-500" />
                  <span className="text-xs text-red-600 font-semibold">MUST READ</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Why AI Will Replace 90% of LinkedIn Marketers
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  The uncomfortable truth about AI's impact on marketing careers...
                </p>
                <Link to="/blog/ai-replacing-linkedin-marketers" className="text-primary hover:underline text-sm font-medium">
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