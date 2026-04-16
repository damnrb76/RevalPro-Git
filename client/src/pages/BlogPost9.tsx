import { Link } from 'wouter';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

export default function BlogPost9() {
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
            The Nurse's Guide to CPD: Finding the Right Learning for Your Revalidation
          </h1>
          <div className="flex items-center gap-6 text-teal-50">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>April 23, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>9 min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-600 mb-8">
            CPD. Continuing Professional Development. It sounds important (because it is). But it's also confusing. What counts as CPD? How much do you need? What's the difference between practice-related and professional development? Where do you find good CPD?
          </p>

          <p className="text-lg text-gray-600 mb-8">
            We've answered all of these questions in our complete guide to CPD for nurses.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">What is CPD?</h2>

          <p className="text-gray-700 mb-6">
            CPD stands for Continuing Professional Development. It's learning that helps you develop professionally and stay current in your field.
          </p>

          <p className="text-gray-700 mb-8">
            For nurses, CPD is any learning activity that helps you:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Develop new skills</li>
            <li>Deepen existing knowledge</li>
            <li>Stay current with best practice</li>
            <li>Improve patient care</li>
            <li>Develop professionally</li>
          </ul>

          <p className="text-gray-700 mb-8">
            The key word is "professional." CPD isn't just any learning—it's learning that relates to your nursing practice.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Why CPD Matters</h2>

          <p className="text-gray-700 mb-6">
            CPD matters for three reasons:
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">1. Patient Safety</h3>
          <p className="text-gray-700 mb-8">
            Nursing practice evolves. New evidence emerges. New treatments are developed. CPD keeps you up-to-date with the latest best practice, which means better care for your patients.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">2. Professional Development</h3>
          <p className="text-gray-700 mb-8">
            CPD helps you develop as a nurse. It might help you move into a new speciality, develop leadership skills, or deepen expertise in your current area.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">3. Revalidation</h3>
          <p className="text-gray-700 mb-8">
            The NMC requires 35 hours of CPD in your three-year revalidation cycle. CPD is a key part of demonstrating that you're maintaining your professional competence.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The NMC's CPD Requirements</h2>

          <p className="text-gray-700 mb-6">
            The NMC requires:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li><strong>35 hours of CPD</strong> in your three-year revalidation cycle</li>
            <li><strong>At least 20 hours</strong> must be "practice-related" (directly relevant to your role)</li>
            <li><strong>At least 5 hours</strong> must be "professional development" (ethics, law, professional issues, management, etc.)</li>
          </ul>

          <p className="text-gray-700 mb-8">
            The remaining 10 hours can be either practice-related or professional development.
          </p>

          <p className="text-gray-700 mb-8">
            <strong>Important:</strong> The NMC counts CPD hours, not contact hours. If you attend a 2-day course (16 contact hours), that counts as 16 CPD hours, even if you only attended part of it.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Types of CPD: What Counts?</h2>

          <p className="text-gray-700 mb-6">
            The good news is that CPD comes in many forms. Here's what counts:
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Formal CPD</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li>University courses and qualifications</li>
            <li>Professional conferences and seminars</li>
            <li>Accredited training courses</li>
            <li>Online courses (from reputable providers)</li>
            <li>In-house training and workshops</li>
            <li>Webinars and virtual learning</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Informal CPD</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li>Reading professional journals and articles</li>
            <li>Reading books related to your practice</li>
            <li>Podcasts about nursing and healthcare</li>
            <li>Online learning (non-accredited)</li>
            <li>Mentoring and coaching</li>
            <li>Teaching colleagues</li>
            <li>Reflection on practice</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Work-Based CPD</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li>Shadowing a colleague</li>
            <li>Learning a new clinical skill</li>
            <li>Taking on a new responsibility</li>
            <li>Participating in quality improvement projects</li>
            <li>Attending team meetings and grand rounds</li>
            <li>Supervising students</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Professional Activities</h3>
          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Writing articles or blog posts</li>
            <li>Speaking at conferences</li>
            <li>Serving on committees</li>
            <li>Professional networking</li>
            <li>Volunteering</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Practice-Related vs. Professional Development CPD</h2>

          <p className="text-gray-700 mb-6">
            The NMC distinguishes between two types of CPD:
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Practice-Related CPD (at least 20 hours)</h3>
          <p className="text-gray-700 mb-4">
            This is CPD directly relevant to your nursing role. Examples:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Advanced wound care (if you work in wound care)</li>
            <li>Paediatric assessment skills (if you work in paediatrics)</li>
            <li>Mental health awareness (if you work in mental health)</li>
            <li>Communication skills (relevant to any nursing role)</li>
            <li>Clinical skills updates</li>
            <li>Speciality-specific training</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Professional Development CPD (at least 5 hours)</h3>
          <p className="text-gray-700 mb-4">
            This is CPD about professional issues, ethics, law, management, etc. Examples:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Ethics and professional conduct</li>
            <li>NMC Code of Practice</li>
            <li>Safeguarding and child protection</li>
            <li>Equality and diversity</li>
            <li>Leadership and management</li>
            <li>Professional communication</li>
            <li>Reflective practice</li>
          </ul>

          <p className="text-gray-700 mb-8">
            <strong>The Key Difference:</strong> Practice-related CPD helps you do your job better. Professional development CPD helps you be a better professional.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">How to Find Good CPD</h2>

          <p className="text-gray-700 mb-6">
            There's a lot of CPD out there. How do you find the right stuff for you?
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Step 1: Identify Your Learning Needs</h3>
          <p className="text-gray-700 mb-6">
            What do you need to learn? What gaps do you have in your knowledge or skills? What would help you do your job better?
          </p>

          <p className="text-gray-700 mb-8">
            Think about:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Your current role and responsibilities</li>
            <li>New areas you want to develop</li>
            <li>Feedback you've received from colleagues or patients</li>
            <li>Changes in best practice or guidelines</li>
            <li>Your career aspirations</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Step 2: Choose CPD That Aligns With Your Needs</h3>
          <p className="text-gray-700 mb-8">
            Don't just do random CPD. Choose learning that's relevant to your role and your goals.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Step 3: Check the Quality</h3>
          <p className="text-gray-700 mb-8">
            Is the CPD from a reputable provider? Is it evidence-based? Will it actually help you?
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Step 4: Consider the Format</h3>
          <p className="text-gray-700 mb-8">
            Do you prefer face-to-face learning, online learning, or a mix? How much time do you have? What fits your schedule?
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Step 5: Keep Evidence</h3>
          <p className="text-gray-700 mb-8">
            Save certificates, course confirmations, and notes about what you learned. You'll need this for revalidation.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Where to Find CPD</h2>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Free or Low-Cost CPD</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li><strong>NHS Learning Hub</strong> - Free online learning for NHS staff</li>
            <li><strong>OpenLearn</strong> - Free online courses from the Open University</li>
            <li><strong>Coursera</strong> - Free and paid online courses</li>
            <li><strong>Udemy</strong> - Affordable online courses</li>
            <li><strong>Professional journals</strong> - Many nursing journals are available free through your employer or library</li>
            <li><strong>Podcasts</strong> - Many nursing and healthcare podcasts are free</li>
            <li><strong>Webinars</strong> - Many organisations offer free webinars</li>
            <li><strong>In-house training</strong> - Your employer often provides free training</li>
            <li><strong>Professional organisations</strong> - RCN, Unison, etc. offer CPD for members</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Paid CPD</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li><strong>University courses</strong> - Postgraduate diplomas, master's degrees, etc.</li>
            <li><strong>Professional conferences</strong> - RCN Congress, speciality conferences, etc.</li>
            <li><strong>Online course providers</strong> - Udemy, Coursera, LinkedIn Learning, etc.</li>
            <li><strong>Training companies</strong> - Various companies offer specialised training</li>
            <li><strong>Professional organisations</strong> - RCN, Unison, etc. offer paid courses</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Employer-Provided CPD</h3>
          <p className="text-gray-700 mb-8">
            Many employers provide CPD as part of professional development. Ask your manager about CPD opportunities. Many employers will fund courses if they're relevant to your role.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Common CPD Mistakes</h2>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Mistake 1: Doing CPD That Doesn't Relate to Your Role</h3>
          <p className="text-gray-700 mb-4">
            You attend a course on a topic you're interested in but never use in your practice. Whilst it might be interesting, it doesn't count as practice-related CPD.
          </p>
          <p className="text-gray-700 mb-8">
            <em>Solution:</em> Choose CPD that's relevant to your current role or your career goals.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Mistake 2: Not Keeping Evidence</h3>
          <p className="text-gray-700 mb-4">
            You complete a course but don't keep the certificate or confirmation. When revalidation comes, you can't prove you did it.
          </p>
          <p className="text-gray-700 mb-8">
            <em>Solution:</em> Keep all certificates, course confirmations, and notes about what you learned.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Mistake 3: Confusing Attendance With Learning</h3>
          <p className="text-gray-700 mb-4">
            You attend a conference but don't actually engage with the content. You sit in the back and check your phone.
          </p>
          <p className="text-gray-700 mb-8">
            <em>Solution:</em> Actively engage with CPD. Take notes. Reflect on what you learned. Think about how you'll apply it.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Mistake 4: Waiting Until the Last Minute</h3>
          <p className="text-gray-700 mb-4">
            You realise you need 35 hours of CPD and you have 2 months until revalidation. You panic and do random courses just to get the hours.
          </p>
          <p className="text-gray-700 mb-8">
            <em>Solution:</em> Spread your CPD throughout your three-year cycle. Do a bit at a time.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Mistake 5: Not Reflecting on Learning</h3>
          <p className="text-gray-700 mb-4">
            You complete CPD but don't think about how it's changed your practice.
          </p>
          <p className="text-gray-700 mb-8">
            <em>Solution:</em> After each CPD activity, reflect on what you learned and how you'll use it.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Your CPD Action Plan</h2>

          <p className="text-gray-700 mb-6">
            Here's what to do:
          </p>

          <ol className="list-decimal list-inside space-y-3 mb-8 text-gray-700">
            <li><strong>Identify Your Learning Needs</strong> - What do you need to learn? Write down 3-5 areas where you want to develop.</li>
            <li><strong>Find CPD</strong> - For each area, find 1-2 CPD opportunities (courses, reading, webinars, etc.).</li>
            <li><strong>Create a CPD Plan</strong> - Plan when you'll do your CPD over the next 12 months. Aim for a mix of practice-related and professional development.</li>
            <li><strong>Keep Evidence</strong> - Create a folder for your CPD evidence. Save all certificates and confirmations.</li>
            <li><strong>Reflect</strong> - After each CPD activity, write a brief note about what you learned and how you'll use it.</li>
          </ol>

          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-8 border border-teal-200 my-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Want to Organise Your CPD and Track Your Revalidation Progress?</h3>
            <p className="text-gray-700 mb-6">
              RevalPro helps you track your CPD hours, organise your certificates, and manage your revalidation.
            </p>
            <Link href="/pricing">
              <a className="inline-block px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                Start Your Free Trial
              </a>
            </Link>
          </div>

          <p className="text-gray-700 text-center text-sm mt-12 pt-8 border-t border-gray-200">
            <em>Start today. Identify your learning needs. Find CPD that matters. Develop as a nurse.</em>
          </p>
        </div>
      </article>
    </div>
  );
}
