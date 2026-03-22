import { Link } from 'wouter';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

export default function BlogPost4() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog">
            <a className="inline-flex items-center gap-2 text-teal-100 hover:text-white mb-6 transition-colors">
              <ArrowLeft size={18} />
              Back to Blog
            </a>
          </Link>
          <h1 className="text-4xl font-bold mb-4">
            CPD Activities That Count: A Nurse's Guide to Professional Development
          </h1>
          <div className="flex items-center gap-6 text-teal-50">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>March 21, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>7 min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-600 mb-8">
            One of the most common questions nurses ask about revalidation is: "What counts as CPD?" Many nurses worry they haven't done "enough" or that their learning activities don't qualify.
          </p>

          <p className="text-lg text-gray-600 mb-8">
            The good news? CPD is much broader than you might think. In this guide, we'll break down exactly what the NMC considers CPD, give you a comprehensive list of activities that count, and help you recognize the learning you're already doing.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">What is CPD?</h2>

          <p className="text-gray-700 mb-6">
            CPD stands for <strong>Continuing Professional Development</strong>. According to the NMC, CPD is learning that:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Develops your knowledge, skills, and competence</li>
            <li>Helps you provide safe, effective patient care</li>
            <li>Keeps you up-to-date with professional practice</li>
            <li>Supports your professional development</li>
          </ul>

          <p className="text-gray-700 mb-8">
            The key point: <strong>The NMC doesn't require a specific number of CPD hours.</strong> Instead, they want to see evidence of <strong>regular, ongoing learning</strong> that's relevant to your practice.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">CPD Activities That Count</h2>

          <p className="text-gray-700 mb-6">
            Here's a comprehensive list of activities the NMC recognizes as CPD:
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Formal Learning</h3>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>University courses and qualifications</li>
            <li>Professional diplomas and certificates</li>
            <li>Conferences and seminars</li>
            <li>Workshops and training days</li>
            <li>Online courses and e-learning</li>
            <li>Webinars and virtual learning events</li>
            <li>Professional development programs</li>
            <li>Accredited training (e.g., ACLS, BLS, first aid)</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Reading and Research</h3>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Reading professional journals and articles</li>
            <li>Reading nursing textbooks</li>
            <li>Reviewing clinical guidelines and evidence</li>
            <li>Participating in journal clubs</li>
            <li>Reading case studies and clinical reviews</li>
            <li>Staying updated with professional publications</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Teaching and Mentoring</h3>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Teaching students or junior colleagues</li>
            <li>Mentoring or precepting new staff</li>
            <li>Delivering training sessions</li>
            <li>Supervising clinical placements</li>
            <li>Presenting at conferences or meetings</li>
            <li>Writing articles or case studies</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Practice-Based Learning</h3>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Reflective practice (learning from experience)</li>
            <li>Clinical supervision and feedback</li>
            <li>Observing colleagues and learning from them</li>
            <li>Participating in case discussions</li>
            <li>Attending ward rounds and team meetings</li>
            <li>Completing competency assessments</li>
            <li>Participating in quality improvement projects</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Professional Involvement</h3>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Joining professional organizations (RCN, Unison, etc.)</li>
            <li>Participating in professional committees</li>
            <li>Attending professional meetings</li>
            <li>Contributing to policy development</li>
            <li>Participating in research projects</li>
            <li>Engaging with professional networks</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Self-Directed Learning</h3>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Identifying learning needs and creating a plan</li>
            <li>Using online resources and podcasts</li>
            <li>Watching educational videos</li>
            <li>Completing online modules</li>
            <li>Pursuing personal interests related to nursing</li>
            <li>Keeping a learning portfolio</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Real-World Examples of CPD</h2>

          <p className="text-gray-700 mb-6">
            Here are practical examples of CPD activities you might already be doing:
          </p>

          <div className="space-y-4 mb-8">
            <div className="bg-teal-50 border-l-4 border-teal-500 p-4">
              <p className="font-bold text-teal-900">✓ Attending a 2-hour workshop on wound care</p>
              <p className="text-gray-700">This counts as CPD. Keep the certificate or attendance record.</p>
            </div>

            <div className="bg-teal-50 border-l-4 border-teal-500 p-4">
              <p className="font-bold text-teal-900">✓ Reading 3 articles from a nursing journal</p>
              <p className="text-gray-700">This counts as CPD. Keep a record of what you read and what you learned.</p>
            </div>

            <div className="bg-teal-50 border-l-4 border-teal-500 p-4">
              <p className="font-bold text-teal-900">✓ Mentoring a new graduate nurse over 6 months</p>
              <p className="text-gray-700">This counts as CPD. Document your mentoring activities and what you both learned.</p>
            </div>

            <div className="bg-teal-50 border-l-4 border-teal-500 p-4">
              <p className="font-bold text-teal-900">✓ Completing an online course on patient communication</p>
              <p className="text-gray-700">This counts as CPD. Save your certificate and course materials.</p>
            </div>

            <div className="bg-teal-50 border-l-4 border-teal-500 p-4">
              <p className="font-bold text-teal-900">✓ Presenting a case study at a team meeting</p>
              <p className="text-gray-700">This counts as CPD. Document the presentation and what you shared.</p>
            </div>

            <div className="bg-teal-50 border-l-4 border-teal-500 p-4">
              <p className="font-bold text-teal-900">✓ Participating in a quality improvement project</p>
              <p className="text-gray-700">This counts as CPD. Keep records of your involvement and outcomes.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">What Doesn't Count as CPD</h2>

          <p className="text-gray-700 mb-6">
            To be clear, here are activities that generally don't count as CPD:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Routine daily work without reflection or learning</li>
            <li>Administrative tasks unrelated to professional development</li>
            <li>Social events or general socializing</li>
            <li>Activities unrelated to nursing or healthcare</li>
            <li>Mandatory training that you're required to do (though it can support CPD)</li>
          </ul>

          <p className="text-gray-700 mb-8">
            <strong>However:</strong> Even mandatory training can count as CPD if you reflect on what you learned and how it applies to your practice.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">How to Evidence Your CPD</h2>

          <p className="text-gray-700 mb-6">
            For each CPD activity, keep evidence such as:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Certificates of attendance or completion</li>
            <li>Course materials or notes</li>
            <li>Reflections on what you learned</li>
            <li>How you applied the learning to your practice</li>
            <li>Dates and duration of the activity</li>
            <li>Provider or organization details</li>
          </ul>

          <p className="text-gray-700 mb-8">
            <strong>Pro tip:</strong> Create a simple spreadsheet or document to track your CPD throughout your revalidation cycle. Include the activity, date, duration, and what you learned.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">CPD Planning for Your Revalidation Cycle</h2>

          <p className="text-gray-700 mb-6">
            Here's how to ensure you have sufficient CPD evidence:
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Year 1 of Your Cycle</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li>Identify your learning needs</li>
            <li>Plan CPD activities that address these needs</li>
            <li>Start with 2-3 activities (courses, reading, etc.)</li>
            <li>Begin tracking everything</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Year 2 of Your Cycle</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li>Continue with regular CPD activities</li>
            <li>Reflect on what you've learned</li>
            <li>Adjust your CPD plan based on new learning needs</li>
            <li>Aim for 2-3 more activities</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Year 3 of Your Cycle</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li>Continue CPD activities</li>
            <li>Review your complete CPD portfolio</li>
            <li>Ensure you have evidence of regular, ongoing learning</li>
            <li>Complete any final activities before revalidation</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">CPD Ideas for Different Nursing Roles</h2>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">General Practice Nurses</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li>Chronic disease management courses</li>
            <li>Vaccination and immunization training</li>
            <li>Safeguarding updates</li>
            <li>Sexual health and contraception training</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Hospital Nurses</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li>Specialty-specific courses (e.g., oncology, cardiac)</li>
            <li>Advanced clinical skills training</li>
            <li>Leadership and management courses</li>
            <li>Research and evidence-based practice</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Community and District Nurses</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li>Wound care and tissue viability</li>
            <li>Palliative care training</li>
            <li>Safeguarding and mental health awareness</li>
            <li>Community health promotion</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Free and Low-Cost CPD Resources</h2>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li><strong>RCN Learning:</strong> Free and paid courses for RCN members</li>
            <li><strong>Nursing Times:</strong> Free articles and webinars</li>
            <li><strong>British Journal of Nursing:</strong> Professional journal with evidence-based articles</li>
            <li><strong>YouTube:</strong> Educational nursing channels</li>
            <li><strong>Your employer:</strong> Many provide free training and development</li>
            <li><strong>Professional networks:</strong> Free webinars and meetings</li>
            <li><strong>Podcasts:</strong> Nursing-focused podcasts</li>
          </ul>

          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-8 border border-teal-200 my-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Track Your CPD Easily</h3>
            <p className="text-gray-700 mb-6">
              Use RevalPro to organize and track all your CPD activities in one place. Never lose a certificate again.
            </p>
            <Link href="/quiz-landing">
              <a className="inline-block px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                Get Started with RevalPro
              </a>
            </Link>
          </div>

          <p className="text-gray-700 text-center text-sm mt-12 pt-8 border-t border-gray-200">
            <em>RevalPro is committed to helping UK nurses navigate revalidation with confidence and clarity.</em>
          </p>
        </div>
      </article>
    </div>
  );
}
