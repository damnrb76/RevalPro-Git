import { Link } from 'wouter';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

export default function BlogPost2() {
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
            The Ultimate Guide to NMC Revalidation Deadlines and Requirements
          </h1>
          <div className="flex items-center gap-6 text-teal-50">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>March 21, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>8 min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-600 mb-8">
            One of the most common sources of stress for UK nurses is understanding revalidation deadlines and requirements. When is your revalidation due? What exactly do you need to submit? What happens if you miss the deadline?
          </p>

          <p className="text-lg text-gray-600 mb-8">
            This comprehensive guide covers everything you need to know about NMC revalidation deadlines and requirements, so you can stay compliant and avoid unnecessary stress.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Your Revalidation Deadline: How to Find It</h2>

          <p className="text-gray-700 mb-6">
            Your revalidation deadline is based on your <strong>PIN (Personal Identification Number)</strong> and when you last revalidated. The NMC sends you notification letters at specific times before your deadline.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Key Timeline Dates</h3>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li><strong>3 years before deadline:</strong> You become eligible to revalidate</li>
            <li><strong>2 years before deadline:</strong> You can start gathering evidence</li>
            <li><strong>1 year before deadline:</strong> You should be actively preparing</li>
            <li><strong>3 months before deadline:</strong> NMC sends first reminder</li>
            <li><strong>1 month before deadline:</strong> NMC sends final reminder</li>
            <li><strong>Deadline date:</strong> Last day to submit revalidation</li>
            <li><strong>After deadline:</strong> Your registration becomes inactive if not revalidated</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">How to Check Your Deadline</h3>

          <ol className="list-decimal list-inside space-y-2 mb-8 text-gray-700">
            <li>Log into the <strong>NMC Online Services</strong> portal (www.nmc.org.uk)</li>
            <li>Navigate to "My registration"</li>
            <li>Look for "Revalidation due date"</li>
            <li>Mark this date in your calendar immediately</li>
          </ol>

          <p className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 text-gray-700">
            <strong>Pro tip:</strong> Don't rely on memory or NMC letters. Check the portal now and write down your exact deadline date.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The Five Core Revalidation Requirements</h2>

          <p className="text-gray-700 mb-6">
            The NMC requires evidence in five key areas. Let's break down each one:
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">1. Practice Hours (450 hours minimum)</h3>

          <p className="text-gray-700 mb-4">
            <strong>What it means:</strong> You must have completed at least 450 hours of practice in your revalidation cycle (3 years).
          </p>

          <p className="text-gray-700 mb-4">
            <strong>What counts:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mb-6 text-gray-700">
            <li>Direct patient care</li>
            <li>Clinical supervision</li>
            <li>Teaching and mentoring</li>
            <li>Research activities</li>
            <li>Any nursing practice that uses your professional knowledge</li>
          </ul>

          <p className="text-gray-700 mb-4">
            <strong>What doesn't count:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mb-6 text-gray-700">
            <li>Holiday or sick leave</li>
            <li>Administrative work unrelated to nursing</li>
            <li>Time spent on non-nursing activities</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">2. CPD (Continuing Professional Development)</h3>

          <p className="text-gray-700 mb-4">
            <strong>What it means:</strong> You must have undertaken CPD activities relevant to your practice.
          </p>

          <p className="text-gray-700 mb-4">
            <strong>What counts:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mb-6 text-gray-700">
            <li>Formal courses and training</li>
            <li>Conferences and workshops</li>
            <li>Online learning and webinars</li>
            <li>Reading professional journals</li>
            <li>Reflective learning from practice</li>
            <li>Teaching and mentoring others</li>
            <li>Professional development activities</li>
          </ul>

          <p className="text-gray-700 mb-6">
            <strong>How much is needed?</strong> The NMC doesn't specify a minimum number of hours, but you should have evidence of <strong>regular, ongoing learning</strong> throughout your cycle.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">3. Reflective Practice (5 reflective accounts)</h3>

          <p className="text-gray-700 mb-4">
            <strong>What it means:</strong> You must have completed at least 5 reflective accounts using a recognized nursing model.
          </p>

          <p className="text-gray-700 mb-4">
            <strong>Recognized models include:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mb-6 text-gray-700">
            <li>Gibbs' Reflective Cycle</li>
            <li>Schön's Reflection-in-Action</li>
            <li>Johns' Model of Structured Reflection</li>
            <li>Driscoll's What? So What? Now What? Model</li>
            <li>Kolb's Experiential Learning Cycle</li>
          </ul>

          <p className="text-gray-700 mb-6">
            <strong>What to reflect on:</strong> Challenging situations you've handled, times you've made a difference, learning experiences, mistakes and how you've grown, interactions with patients or colleagues.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">4. Health and Conduct Declarations</h3>

          <p className="text-gray-700 mb-4">
            <strong>What it means:</strong> You must declare that you're fit to practice and haven't had any health or conduct issues.
          </p>

          <p className="text-gray-700 mb-4">
            <strong>What you're declaring:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mb-6 text-gray-700">
            <li>You're in good health and able to practice safely</li>
            <li>You haven't been convicted of any criminal offences</li>
            <li>You haven't been subject to disciplinary action</li>
            <li>You haven't had any concerns raised about your conduct</li>
          </ul>

          <p className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8 text-gray-700">
            <strong>If you answer "yes" to any of these:</strong> Don't panic. You still may be able to revalidate. You'll need to provide more information to the NMC. Contact the NMC for guidance if you're unsure.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">5. Professional Indemnity Insurance</h3>

          <p className="text-gray-700 mb-4">
            <strong>What it means:</strong> You must have current professional indemnity insurance.
          </p>

          <p className="text-gray-700 mb-4">
            <strong>Why it matters:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mb-6 text-gray-700">
            <li>Protects you if a patient makes a claim against you</li>
            <li>Required by the NMC for revalidation</li>
            <li>Often provided by your employer</li>
            <li>Can be purchased independently if needed</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The Revalidation Submission Process</h2>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Step 1: Gather Your Evidence (Months 1-30 of your cycle)</h3>
          <ul className="list-disc list-inside space-y-1 mb-6 text-gray-700">
            <li>Track practice hours</li>
            <li>Complete CPD activities</li>
            <li>Write reflective accounts</li>
            <li>Keep all certificates and records</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Step 2: Organize Your Evidence (Month 30-33)</h3>
          <ul className="list-disc list-inside space-y-1 mb-6 text-gray-700">
            <li>Compile all evidence in one place</li>
            <li>Ensure you have everything you need</li>
            <li>Check against the 5 requirements</li>
            <li>Use RevalPro to organize digitally</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Step 3: Find Your Confirmer (Month 33-35)</h3>
          <ul className="list-disc list-inside space-y-1 mb-6 text-gray-700">
            <li>Choose a confirmer (usually a senior colleague)</li>
            <li>They must be on the NMC register</li>
            <li>They must have known you professionally for at least 3 years</li>
            <li>Discuss your evidence with them</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Step 4: Submit Your Revalidation (Month 35-36)</h3>
          <ul className="list-disc list-inside space-y-1 mb-6 text-gray-700">
            <li>Log into NMC Online Services</li>
            <li>Upload your evidence</li>
            <li>Provide confirmer details</li>
            <li>Pay the revalidation fee (currently £90)</li>
            <li>Submit before your deadline</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Step 5: Wait for Confirmation (2-4 weeks)</h3>
          <ul className="list-disc list-inside space-y-1 mb-6 text-gray-700">
            <li>NMC reviews your submission</li>
            <li>You'll receive confirmation of revalidation</li>
            <li>Your registration is renewed for another 3 years</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Common Revalidation Mistakes (And How to Avoid Them)</h2>

          <div className="space-y-4 mb-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="font-bold text-red-900">❌ Mistake 1: Starting Too Late</p>
              <p className="text-gray-700">Waiting until 3 months before deadline to gather evidence</p>
              <p className="text-gray-700 font-semibold">✓ Solution: Start organizing evidence 6 months before deadline</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="font-bold text-red-900">❌ Mistake 2: Insufficient Practice Hours</p>
              <p className="text-gray-700">Not tracking hours and falling short of 450</p>
              <p className="text-gray-700 font-semibold">✓ Solution: Keep a simple log throughout your cycle</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="font-bold text-red-900">❌ Mistake 3: Poor Quality Reflections</p>
              <p className="text-gray-700">Writing superficial reflections at the last minute</p>
              <p className="text-gray-700 font-semibold">✓ Solution: Use a recognized model and reflect on meaningful experiences</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="font-bold text-red-900">❌ Mistake 4: Missing CPD Evidence</p>
              <p className="text-gray-700">Doing CPD but not keeping certificates</p>
              <p className="text-gray-700 font-semibold">✓ Solution: File certificates immediately and store digitally</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="font-bold text-red-900">❌ Mistake 5: Submitting Incomplete Evidence</p>
              <p className="text-gray-700">Missing one of the 5 requirements</p>
              <p className="text-gray-700 font-semibold">✓ Solution: Use a checklist to verify all requirements before submitting</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="font-bold text-red-900">❌ Mistake 6: Missing the Deadline</p>
              <p className="text-gray-700">Submitting after the deadline date</p>
              <p className="text-gray-700 font-semibold">✓ Solution: Submit at least 2 weeks early to avoid technical issues</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-8 border border-teal-200 my-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Assess Your Revalidation Readiness</h3>
            <p className="text-gray-700 mb-6">
              Take our free 2-minute quiz to understand where you stand and get a personalized action plan.
            </p>
            <Link href="/quiz-landing">
              <a className="inline-block px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                Take the Quiz Now
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
