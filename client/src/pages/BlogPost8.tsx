import { Link } from 'wouter';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

export default function BlogPost8() {
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
            How One Nurse Organised Her Entire Revalidation in 30 Days
          </h1>
          <div className="flex items-center gap-6 text-teal-50">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>April 22, 2026</span>
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
            Meet Rachel. She's a brilliant nurse—compassionate, skilled, and dedicated to her patients. But she's also disorganised. Very disorganised.
          </p>

          <p className="text-lg text-gray-600 mb-8">
            With just 30 days until her revalidation deadline, Rachel realised she hadn't organised any of her evidence. No CPD certificates. No reflective accounts. No feedback. Nothing.
          </p>

          <p className="text-lg text-gray-600 mb-8">
            She was panicking. But then she took a deep breath, made a plan, and got to work. In 30 days, she organised everything and successfully revalidated.
          </p>

          <p className="text-lg text-gray-600 mb-8">
            Here's how she did it—and how you can too.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The Situation: Rachel's Revalidation Crisis</h2>

          <p className="text-gray-700 mb-6">
            Rachel had been working as a community nurse for three years. She'd done her job well, completed her CPD, gathered feedback, and written reflections. But she'd never organised any of it.
          </p>

          <p className="text-gray-700 mb-6">
            Her revalidation deadline was 30 days away. She had:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>CPD certificates scattered across her emails and filing cabinet</li>
            <li>Reflective accounts written in a Word document with no structure</li>
            <li>Feedback from colleagues but not in any organised format</li>
            <li>No clear picture of whether she'd worked 450 hours</li>
            <li>A confirmer (her manager) who didn't have clear records of her practice</li>
          </ul>

          <p className="text-gray-700 mb-8">
            She was stressed. She was worried she'd miss the deadline. She was considering asking for a deadline extension.
          </p>

          <p className="text-gray-700 mb-8">
            But then she realised something: <strong>she had all the evidence. She just needed to organise it.</strong>
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Week 1: Assessment and Planning</h2>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Days 1-2: Audit Everything</h3>

          <p className="text-gray-700 mb-6">
            Rachel started by auditing what she had:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li>She searched her emails for CPD certificates and course confirmations</li>
            <li>She found all her reflective accounts and notes</li>
            <li>She contacted colleagues for feedback</li>
            <li>She reviewed her practice hours with her manager</li>
          </ul>

          <p className="text-gray-700 mb-8">
            By day 2, she had a complete picture of what she had and what she was missing.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Days 3-7: Create a System</h3>

          <p className="text-gray-700 mb-6">
            Rachel created a simple system:
          </p>

          <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-700">
            <li>A Google Drive folder with subfolders for each requirement</li>
            <li>A spreadsheet to track her progress</li>
            <li>A checklist of all seven revalidation requirements</li>
          </ol>

          <p className="text-gray-700 mb-8">
            She organised her evidence into the folders:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Practice hours (spreadsheet with dates and hours)</li>
            <li>CPD evidence (PDFs of certificates and course notes)</li>
            <li>Reflective accounts (Word documents)</li>
            <li>Feedback (emails and documents from colleagues)</li>
            <li>Health and character declaration (template)</li>
            <li>Insurance confirmation (email from her employer)</li>
            <li>Confirmer details (notes about her manager)</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Week 2: Gather Missing Evidence</h2>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Days 8-14: Fill the Gaps</h3>

          <p className="text-gray-700 mb-6">
            Rachel reviewed her checklist and identified what was missing:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li>She had 35 hours of CPD ✓</li>
            <li>She had 450+ practice hours ✓</li>
            <li>She had 4 reflective accounts but needed 5 ✗</li>
            <li>She had feedback from 2 colleagues but needed 3 ✗</li>
            <li>She had health and character declaration ✓</li>
            <li>She had insurance confirmation ✓</li>
            <li>She had confirmer details ✓</li>
          </ul>

          <p className="text-gray-700 mb-8">
            She spent this week:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Writing her 5th reflective account (2 days)</li>
            <li>Asking a third colleague for feedback (3 days)</li>
            <li>Organising all her CPD certificates (2 days)</li>
          </ul>

          <p className="text-gray-700 mb-8">
            By day 14, she had everything she needed.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Week 3: Organise and Review</h2>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Days 15-21: Final Organisation</h3>

          <p className="text-gray-700 mb-6">
            Rachel organised everything into a clear, logical structure:
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8 font-mono text-sm text-gray-700 overflow-x-auto">
            <pre>{`Rachel's Revalidation
├── 1. Practice Hours
│   └── Practice Hours Spreadsheet.xlsx
├── 2. CPD Evidence
│   ├── CPD Tracking Spreadsheet.xlsx
│   ├── Advanced Communication Skills.pdf
│   ├── Safeguarding Training.pdf
│   └── [8 more CPD certificates]
├── 3. Reflective Accounts
│   ├── Account 1 - Patient Communication.docx
│   ├── Account 2 - Difficult Situation.docx
│   ├── Account 3 - Team Work.docx
│   ├── Account 4 - Professional Development.docx
│   └── Account 5 - Learning from Feedback.docx
├── 4. Feedback
│   ├── Feedback from Manager.pdf
│   ├── Feedback from Colleague 1.pdf
│   └── Feedback from Colleague 2.pdf
├── 5. Health and Character
│   └── Declaration.docx
├── 6. Insurance
│   └── Confirmation.pdf
└── 7. Confirmer
    └── Details and Agreement.docx`}</pre>
          </div>

          <p className="text-gray-700 mb-8">
            She reviewed everything to make sure:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>All documents were clearly labelled</li>
            <li>All evidence was complete and legible</li>
            <li>All reflective accounts were 250-300 words</li>
            <li>All feedback was meaningful and relevant</li>
            <li>All CPD was practice-related or professional development</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Week 4: Submit and Celebrate</h2>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Days 22-30: Submission and Follow-Up</h3>

          <p className="text-gray-700 mb-6">
            Rachel logged into the NMC portal and submitted her revalidation application. She uploaded all her evidence, provided her confirmer's details, and submitted.
          </p>

          <p className="text-gray-700 mb-8">
            Within 2 weeks, she received confirmation that she'd successfully revalidated. Her registration was renewed for another three years.
          </p>

          <p className="text-gray-700 mb-8">
            She was relieved. She was proud. And she made a promise to herself: <strong>next time, she'd organise as she went, not wait until the last minute.</strong>
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Rachel's Key Lessons (And Yours)</h2>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Lesson 1: You Probably Have More Than You Think</h3>
          <p className="text-gray-700 mb-8">
            Rachel thought she had nothing organised. In reality, she had most of what she needed. She just needed to find it and organise it.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Lesson 2: A Simple System Works Best</h3>
          <p className="text-gray-700 mb-8">
            Rachel didn't need fancy software or complicated processes. A Google Drive folder, a spreadsheet, and a checklist were enough.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Lesson 3: Organisation Reduces Stress</h3>
          <p className="text-gray-700 mb-8">
            Once Rachel organised everything, she felt so much better. The task went from overwhelming to manageable.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Lesson 4: 30 Days is Tight But Possible</h3>
          <p className="text-gray-700 mb-8">
            Rachel organised everything in 30 days, but it was stressful. If she'd organised as she went, it would have been effortless.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Lesson 5: Ask for Help</h3>
          <p className="text-gray-700 mb-8">
            Rachel's manager helped her verify her practice hours. Her colleagues provided feedback. Her confirmer supported her. Don't try to do this alone.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Your 30-Day Plan</h2>

          <p className="text-gray-700 mb-6">
            If you're in a similar situation, here's your 30-day plan:
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Week 1: Audit and Plan</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li>Days 1-2: Gather all your evidence (emails, documents, certificates)</li>
            <li>Days 3-7: Create a system (folder structure, spreadsheet, checklist)</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Week 2: Fill Gaps</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li>Days 8-14: Write missing reflective accounts, gather missing feedback, organise CPD</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Week 3: Organise and Review</h3>
          <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
            <li>Days 15-21: Organise everything into your system, review for completeness</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Week 4: Submit</h3>
          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Days 22-30: Submit your application, follow up with the NMC</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The Bigger Lesson: Don't Be Like Rachel (At First)</h2>

          <p className="text-gray-700 mb-8">
            Rachel's story has a happy ending, but it was stressful. The real lesson is: <strong>don't wait until the last minute.</strong>
          </p>

          <p className="text-gray-700 mb-8">
            If you're reading this and your revalidation deadline is more than a year away, start organising now:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Create your folder system</li>
            <li>Start collecting CPD evidence</li>
            <li>Begin writing reflective accounts</li>
            <li>Ask for feedback throughout your cycle</li>
            <li>Track your practice hours</li>
          </ul>

          <p className="text-gray-700 mb-8">
            By the time your deadline comes, you'll have everything organised and ready to submit. No stress. No panic. Just revalidation.
          </p>

          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-8 border border-teal-200 my-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Want to Make Revalidation as Easy as Rachel's Final 30 Days?</h3>
            <p className="text-gray-700 mb-6">
              RevalPro helps you organise everything from day one—track your practice hours, organise your CPD, write and store your reflective accounts, and manage your feedback.
            </p>
            <Link href="/pricing">
              <a className="inline-block px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                Start Your Free Trial
              </a>
            </Link>
          </div>

          <p className="text-gray-700 text-center text-sm mt-12 pt-8 border-t border-gray-200">
            <em>Start today. Create your system. Organise your evidence. Make revalidation easy.</em>
          </p>
        </div>
      </article>
    </div>
  );
}
