import { Link } from 'wouter';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

export default function BlogPost3() {
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
            How to Write Effective Reflective Accounts: Step-by-Step Guide
          </h1>
          <div className="flex items-center gap-6 text-teal-50">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>March 21, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>10 min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-600 mb-8">
            Reflective practice is one of the most important—and most misunderstood—requirements for NMC revalidation. Many nurses struggle with writing reflective accounts, unsure of what the NMC actually wants to see.
          </p>

          <p className="text-lg text-gray-600 mb-8">
            The good news? Writing effective reflective accounts isn't complicated once you understand the process. In this guide, we'll walk you through exactly how to write reflections that meet NMC standards and genuinely capture your professional growth.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Why Reflective Practice Matters</h2>

          <p className="text-gray-700 mb-6">
            The NMC requires 5 reflective accounts during your 3-year revalidation cycle because reflection is fundamental to nursing practice. It demonstrates that you:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Learn from your experiences</li>
            <li>Identify areas for improvement</li>
            <li>Connect theory to practice</li>
            <li>Develop professionally</li>
            <li>Provide safe, effective patient care</li>
          </ul>

          <p className="text-gray-700 mb-8">
            Reflective accounts aren't just a box to tick—they're evidence of your professional development and commitment to excellence.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Understanding Reflection Models</h2>

          <p className="text-gray-700 mb-6">
            The NMC requires you to use a <strong>recognized reflection model</strong>. Here are the most popular ones:
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">1. Gibbs' Reflective Cycle (Most Popular)</h3>

          <p className="text-gray-700 mb-4">
            Gibbs' model is the most commonly used for nursing reflections. It has 6 stages:
          </p>

          <ol className="list-decimal list-inside space-y-3 mb-8 text-gray-700">
            <li><strong>Description:</strong> What happened? Describe the situation objectively</li>
            <li><strong>Feelings:</strong> What were you thinking and feeling?</li>
            <li><strong>Evaluation:</strong> What was good or bad about the experience?</li>
            <li><strong>Analysis:</strong> What sense can you make of the situation?</li>
            <li><strong>Conclusion:</strong> What else could you have done?</li>
            <li><strong>Action Plan:</strong> What will you do differently next time?</li>
          </ol>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">2. Schön's Reflection-in-Action</h3>

          <p className="text-gray-700 mb-6">
            Focuses on thinking during practice. Good for describing how you responded to situations in real-time.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">3. Johns' Model of Structured Reflection</h3>

          <p className="text-gray-700 mb-6">
            More detailed and philosophical. Includes questions about aesthetics, personal knowledge, ethics, and empirics.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">4. Driscoll's What? So What? Now What?</h3>

          <p className="text-gray-700 mb-6">
            Simpler 3-stage model. Great for quick reflections or those new to reflective practice.
          </p>

          <p className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 text-gray-700">
            <strong>Pro tip:</strong> Choose one model and stick with it throughout your revalidation cycle. Consistency shows depth of understanding.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Step-by-Step: Writing Your First Reflection</h2>

          <p className="text-gray-700 mb-6">
            Let's use Gibbs' model (the most popular) to write a complete reflection:
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Step 1: Choose Your Experience</h3>

          <p className="text-gray-700 mb-4">
            Select a meaningful experience from your practice. This should be:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Real and recent (within your revalidation cycle)</li>
            <li>Significant—something that made you think or feel</li>
            <li>A learning opportunity (challenge, success, or mistake)</li>
            <li>Relevant to your role and professional development</li>
          </ul>

          <p className="text-gray-700 mb-8">
            <strong>Example:</strong> "A patient became distressed during a procedure, and I had to adapt my approach to support them emotionally while completing the clinical task."
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Step 2: Describe the Situation (Gibbs Stage 1)</h3>

          <p className="text-gray-700 mb-4">
            Write what happened, objectively and factually. Include:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>When and where it happened</li>
            <li>Who was involved (use initials, not names)</li>
            <li>What the situation was</li>
            <li>What you did</li>
            <li>What others did</li>
          </ul>

          <p className="text-gray-700 mb-8 bg-gray-50 p-4 rounded">
            <strong>Example:</strong> "On 15th March 2026, I was assisting with a wound dressing for patient J.M. in the community clinic. The patient became visibly anxious as we began the procedure, expressing concerns about pain. The supervising nurse continued with the procedure as planned. I noticed the patient's distress and decided to pause the procedure to address their emotional needs."
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Step 3: Express Your Feelings (Gibbs Stage 2)</h3>

          <p className="text-gray-700 mb-4">
            Be honest about what you were thinking and feeling. This is personal and reflective:
          </p>

          <p className="text-gray-700 mb-8 bg-gray-50 p-4 rounded">
            <strong>Example:</strong> "I felt concerned about the patient's wellbeing and worried that proceeding without addressing their anxiety might cause harm. I felt a responsibility to advocate for the patient, but I was also uncertain about whether I should intervene. I felt empowered when the supervising nurse supported my decision to pause."
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Step 4: Evaluate the Experience (Gibbs Stage 3)</h3>

          <p className="text-gray-700 mb-4">
            What went well? What could have been better?
          </p>

          <p className="text-gray-700 mb-8 bg-gray-50 p-4 rounded">
            <strong>Example:</strong> "What went well: I recognized the patient's distress and took action. The supervising nurse was receptive to my input. We successfully completed the procedure with the patient feeling supported. What could have been better: I could have communicated my concerns more clearly earlier. I could have used specific anxiety-reduction techniques like breathing exercises."
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Step 5: Analyze the Situation (Gibbs Stage 4)</h3>

          <p className="text-gray-700 mb-4">
            Connect theory to practice. What did you learn? What nursing principles apply?
          </p>

          <p className="text-gray-700 mb-8 bg-gray-50 p-4 rounded">
            <strong>Example:</strong> "This experience demonstrates the importance of holistic patient care and emotional support during procedures. According to Peplau's theory of therapeutic relationships, nurses should establish trust and support patients emotionally. My action aligned with the NMC Code's requirement to 'listen and respond to people's concerns and preferences.' I learned that patient advocacy sometimes means pausing to address emotional needs, not just completing tasks efficiently."
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Step 6: Conclude and Plan Action (Gibbs Stages 5-6)</h3>

          <p className="text-gray-700 mb-4">
            What will you do differently? How will this change your practice?
          </p>

          <p className="text-gray-700 mb-8 bg-gray-50 p-4 rounded">
            <strong>Example:</strong> "I will continue to prioritize emotional support alongside clinical tasks. In future, I will communicate my concerns about patient anxiety earlier in the procedure. I will develop my skills in anxiety-reduction techniques by completing a course on patient communication. This reflection reinforces my commitment to patient-centered care and advocacy."
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Common Mistakes to Avoid</h2>

          <div className="space-y-4 mb-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="font-bold text-red-900">❌ Mistake 1: Being Too Vague</p>
              <p className="text-gray-700">Writing generic reflections that could apply to anyone</p>
              <p className="text-gray-700 font-semibold">✓ Solution: Be specific about the situation, your actions, and your learning</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="font-bold text-red-900">❌ Mistake 2: Not Using a Model</p>
              <p className="text-gray-700">Writing rambling thoughts without structure</p>
              <p className="text-gray-700 font-semibold">✓ Solution: Follow Gibbs or another recognized model</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="font-bold text-red-900">❌ Mistake 3: Blaming Others</p>
              <p className="text-gray-700">Focusing on what others did wrong instead of your learning</p>
              <p className="text-gray-700 font-semibold">✓ Solution: Focus on your own actions and professional development</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="font-bold text-red-900">❌ Mistake 4: Identifying Patients</p>
              <p className="text-gray-700">Using real names or identifying details</p>
              <p className="text-gray-700 font-semibold">✓ Solution: Use initials only and maintain confidentiality</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="font-bold text-red-900">❌ Mistake 5: No Action Plan</p>
              <p className="text-gray-700">Reflecting but not committing to change</p>
              <p className="text-gray-700 font-semibold">✓ Solution: Always include specific actions you'll take next time</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="font-bold text-red-900">❌ Mistake 6: Too Short</p>
              <p className="text-gray-700">Writing just a paragraph or two</p>
              <p className="text-gray-700 font-semibold">✓ Solution: Aim for 500-800 words per reflection</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Reflection Tips for Success</h2>

          <ul className="list-disc list-inside space-y-3 mb-8 text-gray-700">
            <li><strong>Write regularly:</strong> Don't wait until the last minute. Write reflections throughout your cycle</li>
            <li><strong>Be honest:</strong> The NMC wants to see genuine learning, including challenges and mistakes</li>
            <li><strong>Link to the NMC Code:</strong> Reference the NMC Code of Conduct to show alignment with professional standards</li>
            <li><strong>Show evidence of learning:</strong> Explain how you've grown or changed because of the experience</li>
            <li><strong>Use professional language:</strong> Write clearly and professionally, as if submitting to the NMC</li>
            <li><strong>Vary your topics:</strong> Reflect on different situations—patient care, teamwork, leadership, challenges, successes</li>
            <li><strong>Keep copies:</strong> Save all your reflections in one secure place</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Reflection Template</h2>

          <p className="text-gray-700 mb-4">
            Here's a template you can use for your reflections:
          </p>

          <div className="bg-gray-50 p-6 rounded-lg mb-8 text-gray-700 font-mono text-sm">
            <p className="mb-4"><strong>DESCRIPTION (Gibbs Stage 1)</strong></p>
            <p className="mb-6 text-gray-500">[Describe the situation, when, where, who, what happened]</p>

            <p className="mb-4"><strong>FEELINGS (Gibbs Stage 2)</strong></p>
            <p className="mb-6 text-gray-500">[What were you thinking and feeling?]</p>

            <p className="mb-4"><strong>EVALUATION (Gibbs Stage 3)</strong></p>
            <p className="mb-6 text-gray-500">[What went well? What could have been better?]</p>

            <p className="mb-4"><strong>ANALYSIS (Gibbs Stage 4)</strong></p>
            <p className="mb-6 text-gray-500">[What theory applies? What did you learn? Reference the NMC Code]</p>

            <p className="mb-4"><strong>CONCLUSION (Gibbs Stage 5)</strong></p>
            <p className="mb-6 text-gray-500">[What else could you have done?]</p>

            <p className="mb-4"><strong>ACTION PLAN (Gibbs Stage 6)</strong></p>
            <p className="text-gray-500">[What will you do differently next time? How will this change your practice?]</p>
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-8 border border-teal-200 my-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Organize Your Reflections?</h3>
            <p className="text-gray-700 mb-6">
              Use RevalPro to store, organize, and track all your reflective accounts in one secure place.
            </p>
            <Link href="/quiz-landing">
              <a className="inline-block px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                Explore RevalPro
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
