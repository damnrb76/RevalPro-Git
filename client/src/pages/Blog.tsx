import { Link } from 'wouter';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

export default function Blog() {
  const blogPosts = [
    {
      id: 'quiz-scores',
      title: 'Your Revalidation Readiness Quiz: What Your Score Means',
      excerpt: 'Understand what your quiz score means and get a personalized action plan based on your revalidation readiness level.',
      date: 'March 21, 2026',
      readTime: '5 min read',
      category: 'Revalidation Preparation',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop'
    },
    {
      id: 'nmc-deadlines',
      title: 'The Ultimate Guide to NMC Revalidation Deadlines and Requirements',
      excerpt: 'A comprehensive guide covering all 5 NMC revalidation requirements, deadlines, and step-by-step submission process.',
      date: 'March 21, 2026',
      readTime: '8 min read',
      category: 'Revalidation Requirements',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop'
    },
    {
      id: 'reflective-accounts',
      title: 'How to Write Effective Reflective Accounts: Step-by-Step Guide',
      excerpt: 'Master the art of reflective practice with our comprehensive guide using Gibbs and other recognized models.',
      date: 'March 21, 2026',
      readTime: '10 min read',
      category: 'Reflective Practice',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop'
    },
    {
      id: 'cpd-activities',
      title: 'CPD Activities That Count: A Nurses Guide to Professional Development',
      excerpt: 'Discover what counts as CPD and how to build a comprehensive professional development portfolio.',
      date: 'March 21, 2026',
      readTime: '7 min read',
      category: 'Professional Development',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f70504c8a?w=600&h=400&fit=crop'
    },
    {
      id: 'organizing-evidence',
      title: 'Organizing Your Revalidation Evidence: Best Practices and Tools',
      excerpt: 'Learn how to organize and manage all your revalidation evidence efficiently using proven systems and tools.',
      date: 'March 21, 2026',
      readTime: '9 min read',
      category: 'Organization',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop'
    },
    {
      id: 'nmc-revalidation-checklist',
      title: 'The NMC Revalidation Checklist: Everything Nurses Need to Know',
      excerpt: 'A comprehensive checklist breaking down everything you need to do for NMC revalidation, step-by-step.',
      date: 'April 16, 2026',
      readTime: '8 min read',
      category: 'Revalidation Preparation',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop'
    },
    {
      id: 'five-reasons-fail-revalidation',
      title: '5 Reasons Nurses Fail Revalidation (And How to Avoid Them)',
      excerpt: 'Discover the five most common reasons nurses don\'t revalidate successfully and how to prevent them.',
      date: 'April 17, 2026',
      readTime: '7 min read',
      category: 'Revalidation Requirements',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop'
    },
    {
      id: 'rachel-organised-revalidation',
      title: 'How One Nurse Organised Her Entire Revalidation in 30 Days',
      excerpt: 'A real story of how Rachel organised her complete revalidation in just 30 days—and how you can too.',
      date: 'April 22, 2026',
      readTime: '7 min read',
      category: 'Organization',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop'
    },
    {
      id: 'nurses-guide-cpd',
      title: 'The Nurse\'s Guide to CPD: Finding the Right Learning for Your Revalidation',
      excerpt: 'Everything you need to know about CPD, including what counts, where to find it, and how to choose the right learning.',
      date: 'April 23, 2026',
      readTime: '9 min read',
      category: 'Professional Development',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f70504c8a?w=600&h=400&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">RevalPro Blog</h1>
          <p className="text-lg text-teal-50">
            Expert guidance and insights to help you navigate your nursing revalidation journey with confidence.
          </p>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="grid md:grid-cols-3 gap-0">
                {/* Image */}
                <div className="md:col-span-1 h-64 md:h-auto overflow-hidden bg-gray-200">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="md:col-span-2 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                      <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-teal-600 transition-colors">
                      <Link href={`/blog/${post.id}`}>
                        <a>{post.title}</a>
                      </Link>
                    </h2>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>

                  <Link href={`/blog/${post.id}`}>
                    <a className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium group">
                      Read More
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-8 text-center border border-teal-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Ready to assess your revalidation readiness?
          </h3>
          <p className="text-gray-600 mb-6">
            Take our free 2-minute quiz and get a personalized action plan.
          </p>
          <Link href="/quiz-landing">
            <a className="inline-block px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
              Take the Quiz
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
