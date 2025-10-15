import { Link } from 'react-router';
import trilioLogo from '@/lib/logo/trilio-logo.png';

export default function Footer() {
  return (
    <footer className="bg-primary px-6 pb-6 pt-12">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl p-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <img src={trilioLogo} alt="Trilio LinkedIn automation tool logo" className="h-8 w-auto mb-4" />
            <p className="text-sm text-gray-600 mb-4">
            Authentic AI content for LinkedIn that connects and  converts your audience into prospects
            </p>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/company/trilio-company" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://x.com/trytrilio" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/#features" className="text-sm text-gray-600 hover:text-primary">Features</Link></li>
              <li><Link to="/#pricing" className="text-sm text-gray-600 hover:text-primary">Pricing</Link></li>
              <li><Link to="/#testimonials" className="text-sm text-gray-600 hover:text-primary">Testimonials</Link></li>
              <li><Link to="/#faq" className="text-sm text-gray-600 hover:text-primary">FAQ</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Tools</h3>
            <ul className="space-y-2">
              <li><Link to="/rate-linkedin" className="text-sm text-gray-600 hover:text-primary">Profile Rating</Link></li>
              <li><Link to="/review-resume" className="text-sm text-gray-600 hover:text-primary">Resume Review</Link></li>
              <li><Link to="/tools/linkedin-character-counter" className="text-sm text-gray-600 hover:text-primary">Character Counter</Link></li>
              <li><Link to="/tools/linkedin-hashtag-generator" className="text-sm text-gray-600 hover:text-primary">Hashtag Generator</Link></li>
            </ul>
          </div>

          {/* Blogs */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Blogs</h3>
            <ul className="space-y-2">
              <li><Link to="/blog/linkedin-content-strategies" className="text-sm text-gray-600 hover:text-primary">LinkedIn Strategies</Link></li>
              <li><Link to="/blog/ai-replacing-linkedin-marketers" className="text-sm text-gray-600 hover:text-primary">AI Impact</Link></li>
              <li><Link to="/blog/personal-brand-founder-linkedin" className="text-sm text-gray-600 hover:text-primary">Founder Guide</Link></li>
              <li><Link to="/blog/student-linkedin-opportunities-guide" className="text-sm text-gray-600 hover:text-primary">Student Guide</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex justify-center">
          <p className="text-sm text-gray-500">© 2025 Trilio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}