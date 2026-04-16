import { Link } from 'wouter';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

export default function BlogPost6() {
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
            The NMC Revalidation Checklist: Everything Nurses Need to Know
          </h1>
          <div className="flex items-center gap-6 text-teal-50">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>April 16, 2026</span>
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
            Revalidation. Just the word can send shivers down a nurse's spine. You've been practising, caring for patients, managing the chaos of healthcare—and now you have to prove you're still competent. But here's the truth: revalidation doesn't have to be overwhelming.
          </p>

          <p className="text-lg text-gray-600 mb-8">
            The NMC (Nursing and Midwifery Council) has set clear requirements, and if you know what they are, you can tackle them systematically. This comprehensive checklist breaks down everything you need to do, step-by-step, so you can approach revalidation with confidence instead of panic.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">What is NMC Revalidation?</h2>

          <p className="text-gray-700 mb-6">
            First, let's clarify what revalidation actually is. The NMC requires all nurses and midwives on the register to revalidate every three years to maintain their registration. It's not a test you pass or fail—it's a process where you demonstrate that you're continuing to meet the NMC's standards for professional practice.
          </p>

          <p className="text-gray-700 mb-6">
            Think of it as saying: "I'm still competent, I'm still developing, and I'm still committed to providing safe, ethical care."
          </p>

          <p className="text-gray-700 mb-8">
            The NMC introduced revalidation in 2016 to replace the old PREP (Post-Registration Education and Practice) requirements. It's more flexible, more focused on reflection, and more aligned with how modern nursing actually works.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The Core Requirements: Your Revalidation Checklist</h2>

          <p className="text-gray-700 mb-6">
            Here's what you need to complete for revalidation. Print this out, bookmark it, or save it to your phone—you'll want to refer back to it.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">1. 450 Hours of Practice ✓</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li>You need to have worked at least 450 hours in the three years since your last registration.</li>
            <li>This can be paid work, voluntary work, or a combination.</li>
            <li>It doesn't all have to be in one setting—you can work across different organisations.</li>
            <li><strong>Action:</strong> Calculate your hours. If you're part-time, this might take longer. If you're full-time, you'll easily exceed this.</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">2. 35 Hours of CPD (Continuing Professional Development) ✓</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li>At least 35 hours of CPD in the three-year period.</li>
            <li>CPD can be formal (courses, conferences, university programmes) or informal (reading journals, online learning, in-house training).</li>
            <li>At least 20 hours must be "practice-related" (directly relevant to your role).</li>
            <li>At least 5 hours must be "professional development" (ethics, law, professional issues).</li>
            <li><strong>Action:</strong> Start collecting evidence of your CPD now. Keep certificates, course confirmations, and notes about what you learned.</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">3. Five Reflective Accounts ✓</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li>You need to write five reflective accounts of your practice.</li>
            <li>Each should be 250-300 words.</li>
            <li>They should demonstrate how you've met the NMC's Code of Practice.</li>
            <li>They should show learning, development, and improvement.</li>
            <li><strong>Action:</strong> Don't wait until the last minute. Start writing these throughout your three-year cycle. Reflect on real situations you've encountered.</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">4. Practice-Related Feedback ✓</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li>You need to gather feedback from people you work with.</li>
            <li>This could be from colleagues, managers, patients, or other professionals.</li>
            <li>You need at least three pieces of feedback.</li>
            <li>It should be constructive and demonstrate your professional practice.</li>
            <li><strong>Action:</strong> Ask colleagues, managers, or patients to give you feedback. Make it easy for them—provide a simple template if needed.</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">5. Health and Character Declaration ✓</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li>You need to declare that you're in good health and of good character.</li>
            <li>This is a straightforward declaration—unless you have serious health or conduct issues, you'll pass this.</li>
            <li><strong>Action:</strong> Be honest. If you have health concerns that might affect your practice, declare them. The NMC is there to support, not punish.</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">6. Professional Indemnity Insurance ✓</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li>You must have professional indemnity insurance.</li>
            <li>This is usually arranged through your employer or a professional organisation like the RCN.</li>
            <li><strong>Action:</strong> Check you're covered. If not, arrange it immediately.</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">7. Confirmation ✓</h3>
          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>You need a "confirmer"—someone who knows you professionally and can confirm you meet the revalidation requirements.</li>
            <li>This is usually your manager or a senior colleague.</li>
            <li>They need to have supervised you for at least 40% of your practice hours in the three-year period.</li>
            <li><strong>Action:</strong> Identify your confirmer early. Build a good relationship with them. Keep them updated on your progress.</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The Timeline: When to Start</h2>

          <p className="text-gray-700 mb-6">
            <strong>Don't wait until the last minute.</strong> Here's a realistic timeline:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li><strong>Year 1 (Months 1-12):</strong> Start collecting CPD evidence. Write your first 2-3 reflective accounts. Gather initial feedback.</li>
            <li><strong>Year 2 (Months 13-24):</strong> Continue CPD. Write 2 more reflective accounts. Gather more feedback. Check your practice hours.</li>
            <li><strong>Year 3 (Months 25-36):</strong> Finalise everything. Organise all your evidence. Submit your revalidation application.</li>
          </ul>

          <p className="text-gray-700 mb-8">
            The key is consistency. Don't try to cram everything into the last three months.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Common Mistakes Nurses Make</h2>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Mistake 1: Waiting Too Long</h3>
          <p className="text-gray-700 mb-4">
            Many nurses wait until month 35 of their three-year cycle to start revalidation. By then, they've forgotten what CPD they did, they can't remember where they worked, and they're stressed.
          </p>
          <p className="text-gray-700 mb-8">
            <em>Solution:</em> Start organising your evidence from day one. Use a simple folder (physical or digital) to collect certificates, feedback, and notes.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Mistake 2: Confusing CPD with Revalidation</h3>
          <p className="text-gray-700 mb-4">
            CPD is just one part of revalidation. You also need practice hours, reflective accounts, and feedback.
          </p>
          <p className="text-gray-700 mb-8">
            <em>Solution:</em> Use the checklist above. Make sure you're collecting evidence for all seven requirements.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Mistake 3: Writing Weak Reflective Accounts</h3>
          <p className="text-gray-700 mb-4">
            Some nurses write vague reflections that don't clearly show learning or development.
          </p>
          <p className="text-gray-700 mb-8">
            <em>Solution:</em> Use a structured reflection model (like Gibbs or Schön). Describe the situation, what you learned, and how you've changed your practice.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Mistake 4: Not Getting Feedback Early</h3>
          <p className="text-gray-700 mb-4">
            Waiting until the last minute to ask for feedback means people might not remember working with you well enough to give meaningful feedback.
          </p>
          <p className="text-gray-700 mb-8">
            <em>Solution:</em> Ask for feedback throughout your three-year cycle. Make it easy for people by providing a simple template.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Mistake 5: Choosing the Wrong Confirmer</h3>
          <p className="text-gray-700 mb-4">
            Your confirmer needs to have supervised you for at least 40% of your practice hours. If you choose someone who doesn't know your work well, they might not be able to confirm you effectively.
          </p>
          <p className="text-gray-700 mb-8">
            <em>Solution:</em> Choose someone who knows your practice well and who you trust. Build a relationship with them. Keep them updated on your progress.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Your Action Plan</h2>

          <p className="text-gray-700 mb-6">
            Here's what to do right now:
          </p>

          <ol className="list-decimal list-inside space-y-3 mb-8 text-gray-700">
            <li>Write down your revalidation deadline. Mark it on your calendar.</li>
            <li>Calculate your practice hours. Are you on track?</li>
            <li>List your CPD. What have you done in the last year? What do you still need to do?</li>
            <li>Start reflecting. Think about situations where you've learned and grown. Write them down.</li>
            <li>Identify your confirmer. Have a conversation with them about revalidation.</li>
            <li>Create your evidence folder. Start collecting certificates and documents.</li>
            <li>Set reminders. Schedule monthly check-ins to review your progress.</li>
          </ol>

          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-8 border border-teal-200 my-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Struggling to Organise Your Revalidation?</h3>
            <p className="text-gray-700 mb-6">
              RevalPro makes it simple. Track your practice hours, organise your CPD, write and store your reflective accounts, and manage your feedback—all in one place.
            </p>
            <Link href="/pricing">
              <a className="inline-block px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                Start Your Free Trial
              </a>
            </Link>
          </div>

          <p className="text-gray-700 text-center text-sm mt-12 pt-8 border-t border-gray-200">
            <em>Your registration matters. Your patients depend on it. Make revalidation work for you.</em>
          </p>
        </div>
      </article>
    </div>
  );
}
