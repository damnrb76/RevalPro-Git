import { Link } from 'wouter';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

export default function BlogPost1() {
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
            Your Revalidation Readiness Quiz: What Your Score Means
          </h1>
          <div className="flex items-center gap-6 text-teal-50">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>March 21, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>5 min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-600 mb-8">
            Revalidation can feel overwhelming. With so many requirements to track—CPD hours, reflective practice, health declarations, and more—it's easy to wonder if you're truly ready. That's why we created the <strong>Revalidation Readiness Quiz</strong>: a quick, free assessment that gives you clarity on your revalidation status in just 2 minutes.
          </p>

          <p className="text-lg text-gray-600 mb-8">
            But what does your score actually mean? And more importantly, what should you do about it? In this guide, we'll break down the quiz scoring system and help you understand exactly where you stand in your revalidation journey.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Understanding the Quiz Scoring System</h2>

          <p className="text-gray-700 mb-6">
            Our Revalidation Readiness Quiz evaluates five critical areas that the NMC requires for revalidation:
          </p>

          <ol className="list-decimal list-inside space-y-3 mb-8 text-gray-700">
            <li><strong>Practice Hours</strong> - Have you completed at least 450 practice hours in your revalidation cycle?</li>
            <li><strong>CPD Activities</strong> - Do you have evidence of continuing professional development?</li>
            <li><strong>Reflective Practice</strong> - Have you completed reflective accounts using recognized nursing models?</li>
            <li><strong>Health Declarations</strong> - Are your health and conduct declarations up to date?</li>
            <li><strong>Professional Indemnity Insurance</strong> - Do you have current professional indemnity insurance?</li>
          </ol>

          <p className="text-gray-700 mb-8">
            Each question is weighted based on the importance of that requirement. Your total score is out of 50 points.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The Three Revalidation Status Levels</h2>

          <p className="text-gray-700 mb-8">
            Based on your quiz responses, you'll receive one of three status levels:
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Status 1: READY (Score 40-50)</h3>

          <p className="text-gray-700 mb-4">
            <strong>What it means:</strong> You're in excellent shape for revalidation. You have strong evidence across all five key areas and are well-prepared for your submission.
          </p>

          <p className="text-gray-700 mb-6">
            <strong>What to do:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Review your evidence one more time to ensure it's organized and accessible</li>
            <li>Prepare your revalidation portfolio for submission</li>
            <li>Consider upgrading to RevalPro Premium to streamline your final submission</li>
            <li>Start thinking about your next revalidation cycle and how to maintain your evidence</li>
          </ul>

          <p className="text-gray-700 mb-8">
            <strong>Timeline:</strong> You can confidently proceed with your revalidation submission. No urgent action needed.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Status 2: ALMOST READY (Score 25-39)</h3>

          <p className="text-gray-700 mb-4">
            <strong>What it means:</strong> You're on the right track, but there are one or two areas where you need to strengthen your evidence. This is the most common status, and it's absolutely manageable.
          </p>

          <p className="text-gray-700 mb-6">
            <strong>What to do:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Identify which areas need attention (the quiz results will highlight these)</li>
            <li>Create a focused action plan to address the gaps</li>
            <li>If you're short on CPD hours, plan some activities in the coming weeks</li>
            <li>If you're missing reflective accounts, start writing them now</li>
            <li>Use RevalPro Premium to organize your evidence and track your progress</li>
          </ul>

          <p className="text-gray-700 mb-8">
            <strong>Timeline:</strong> You typically have 2-4 weeks to address gaps, depending on your revalidation deadline. Start immediately to avoid last-minute stress.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Status 3: AT RISK (Score Below 25)</h3>

          <p className="text-gray-700 mb-4">
            <strong>What it means:</strong> You have significant gaps in your revalidation evidence. This doesn't mean you won't be ready—it means you need to take action now.
          </p>

          <p className="text-gray-700 mb-6">
            <strong>What to do:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Don't panic. Many nurses find themselves in this position and successfully complete revalidation</li>
            <li>Prioritize the most critical gaps (practice hours and CPD are usually the quickest to address)</li>
            <li>Create a detailed action plan with specific deadlines</li>
            <li>Consider speaking with your manager or a mentor for support</li>
            <li>Use RevalPro Premium to track your progress and ensure you don't miss anything</li>
            <li>If your revalidation deadline is very soon, contact the NMC to discuss your options</li>
          </ul>

          <p className="text-gray-700 mb-8">
            <strong>Timeline:</strong> Act immediately. You may need 4-8 weeks to address significant gaps, depending on what's missing.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">What Each Score Range Tells You</h2>

          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-teal-50">
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold">Score Range</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold">Status</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold">Action Required</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">40-50</td>
                  <td className="border border-gray-300 px-4 py-2">READY</td>
                  <td className="border border-gray-300 px-4 py-2">Minor review; proceed with submission</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">30-39</td>
                  <td className="border border-gray-300 px-4 py-2">ALMOST READY</td>
                  <td className="border border-gray-300 px-4 py-2">Address 1-2 gaps; 2-4 weeks</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">25-29</td>
                  <td className="border border-gray-300 px-4 py-2">AT RISK</td>
                  <td className="border border-gray-300 px-4 py-2">Multiple gaps; 4-8 weeks</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Below 25</td>
                  <td className="border border-gray-300 px-4 py-2">AT RISK</td>
                  <td className="border border-gray-300 px-4 py-2">Significant gaps; urgent action needed</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Your Personalized Action Plan</h2>

          <p className="text-gray-700 mb-6">
            When you complete the quiz, you'll receive a <strong>personalized action plan</strong> based on your specific situation. This plan includes:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Your exact score and status</li>
            <li>Which areas need attention (and which are strong)</li>
            <li>Specific next steps tailored to your gaps</li>
            <li>Timeline recommendations based on your deadline</li>
            <li>Resources and guidance to help you succeed</li>
          </ul>

          <p className="text-gray-700 mb-8">
            This personalized approach is far more helpful than generic advice—because your revalidation situation is unique to you.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Next Steps</h2>

          <ol className="list-decimal list-inside space-y-3 mb-8 text-gray-700">
            <li><strong>Take the Quiz</strong> - If you haven't already, complete the 2-minute Revalidation Readiness Quiz</li>
            <li><strong>Review Your Results</strong> - Understand your score and what it means for you</li>
            <li><strong>Create Your Action Plan</strong> - Use your personalized plan to guide your next steps</li>
            <li><strong>Take Action</strong> - Address any gaps with a clear timeline</li>
            <li><strong>Track Your Progress</strong> - Use RevalPro Premium to stay organized and on track</li>
          </ol>

          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-8 border border-teal-200 my-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Take the Quiz?</h3>
            <p className="text-gray-700 mb-6">
              Get clarity on your revalidation readiness in just 2 minutes. Receive a personalized action plan and 10% discount code.
            </p>
            <Link href="/quiz-landing">
              <a className="inline-block px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                Start Your Assessment
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
