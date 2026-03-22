import { Link } from 'wouter';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

export default function BlogPost5() {
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
            Organizing Your Revalidation Evidence: Best Practices and Tools
          </h1>
          <div className="flex items-center gap-6 text-teal-50">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>March 21, 2026</span>
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
            One of the biggest challenges nurses face during revalidation isn't gathering evidence—it's organizing it. With certificates scattered across your computer, emails, filing cabinets, and drawers, the revalidation deadline can feel overwhelming.
          </p>

          <p className="text-lg text-gray-600 mb-8">
            The good news? With the right system and tools, organizing your revalidation evidence becomes manageable and even straightforward. In this guide, we'll show you best practices and tools to keep everything organized throughout your revalidation cycle.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Why Organization Matters</h2>

          <p className="text-gray-700 mb-6">
            When you're organized, revalidation becomes easier because you:
          </p>

          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Know exactly what evidence you have</li>
            <li>Can quickly identify gaps</li>
            <li>Spend less time searching for documents</li>
            <li>Feel more confident about your submission</li>
            <li>Can submit earlier and reduce stress</li>
            <li>Have everything ready if the NMC audits you</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The Five Categories of Evidence</h2>

          <p className="text-gray-700 mb-6">
            Start by organizing your evidence into the 5 NMC requirements:
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">1. Practice Hours (450+ hours)</h3>
          <p className="text-gray-700 mb-4">
            <strong>What to keep:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mb-6 text-gray-700">
            <li>Timesheets or payroll records</li>
            <li>Rota records</li>
            <li>Employment contracts</li>
            <li>Supervisor confirmation letters</li>
            <li>Practice hour calculation spreadsheet</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">2. CPD (Continuing Professional Development)</h3>
          <p className="text-gray-700 mb-4">
            <strong>What to keep:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mb-6 text-gray-700">
            <li>Course certificates</li>
            <li>Attendance records</li>
            <li>Training completion confirmations</li>
            <li>Journal articles or reading records</li>
            <li>Conference programs</li>
            <li>CPD log or spreadsheet</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">3. Reflective Practice (5+ reflections)</h3>
          <p className="text-gray-700 mb-4">
            <strong>What to keep:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mb-6 text-gray-700">
            <li>5 written reflective accounts</li>
            <li>Reflections using a recognized model (Gibbs, Schön, etc.)</li>
            <li>Reflections on different situations/learning</li>
            <li>Evidence of action taken based on reflections</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">4. Health and Conduct</h3>
          <p className="text-gray-700 mb-4">
            <strong>What to keep:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mb-6 text-gray-700">
            <li>Occupational health clearance (if applicable)</li>
            <li>DBS check (if applicable)</li>
            <li>Records of any health or conduct issues (if applicable)</li>
            <li>Notes for your declaration</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">5. Professional Indemnity Insurance</h3>
          <p className="text-gray-700 mb-4">
            <strong>What to keep:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mb-6 text-gray-700">
            <li>Current insurance certificate</li>
            <li>Policy details</li>
            <li>Proof of payment</li>
            <li>Insurance provider contact information</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Organization Systems: Choose Your Method</h2>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Option 1: Physical Folder System</h3>

          <p className="text-gray-700 mb-4">
            <strong>Best for:</strong> Those who prefer paper or have limited digital access
          </p>

          <p className="text-gray-700 mb-4">
            <strong>Setup:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Create a large folder labeled "Revalidation [Your Name] [Dates]"</li>
            <li>Create 5 subfolders for each requirement</li>
            <li>Create an index sheet listing all documents</li>
            <li>Use page numbers on all documents</li>
            <li>Keep a master checklist</li>
          </ul>

          <p className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 text-gray-700">
            <strong>Pro tip:</strong> Take photos of all documents and back them up digitally in case the physical copies are lost.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Option 2: Digital Folder System</h3>

          <p className="text-gray-700 mb-4">
            <strong>Best for:</strong> Those comfortable with technology who want easy access
          </p>

          <p className="text-gray-700 mb-4">
            <strong>Setup:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Create a folder on your computer: "Revalidation_[Your Name]_[Dates]"</li>
            <li>Create 5 subfolders (Practice Hours, CPD, Reflections, Health/Conduct, Insurance)</li>
            <li>Scan and save all certificates as PDFs</li>
            <li>Name files clearly (e.g., "CPD_Wound_Care_Course_March2026.pdf")</li>
            <li>Back up to cloud storage (Google Drive, OneDrive, Dropbox)</li>
          </ul>

          <p className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 text-gray-700">
            <strong>Pro tip:</strong> Use cloud storage so you can access your evidence from anywhere, on any device.
          </p>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Option 3: Spreadsheet System</h3>

          <p className="text-gray-700 mb-4">
            <strong>Best for:</strong> Those who like tracking and want a quick overview
          </p>

          <p className="text-gray-700 mb-4">
            <strong>Setup:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Create a spreadsheet with columns: Date, Activity, Category, Evidence, Status</li>
            <li>Add a row for each piece of evidence</li>
            <li>Link to digital files or note physical location</li>
            <li>Track completion status (e.g., "Collected," "Organized," "Ready")</li>
            <li>Use color-coding for each requirement</li>
          </ul>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Option 4: Dedicated Revalidation Tool (Recommended)</h3>

          <p className="text-gray-700 mb-4">
            <strong>Best for:</strong> Those who want an all-in-one solution designed for revalidation
          </p>

          <p className="text-gray-700 mb-4">
            <strong>Benefits:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Organized specifically for the 5 NMC requirements</li>
            <li>Upload and store all documents in one place</li>
            <li>Automatic reminders and deadline tracking</li>
            <li>Progress tracking and checklists</li>
            <li>Secure cloud storage</li>
            <li>Easy to generate a final portfolio for submission</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Step-by-Step Organization Process</h2>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Week 1: Gather Everything</h3>

          <ol className="list-decimal list-inside space-y-2 mb-8 text-gray-700">
            <li>Search your computer for all certificates and documents</li>
            <li>Check your email for confirmations and attachments</li>
            <li>Gather physical documents (certificates, letters, etc.)</li>
            <li>Ask your employer for records (timesheets, training records)</li>
            <li>Collect any other relevant evidence</li>
          </ol>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Week 2: Scan and Digitize</h3>

          <ol className="list-decimal list-inside space-y-2 mb-8 text-gray-700">
            <li>Scan all physical documents using your phone or scanner</li>
            <li>Save as PDFs with clear names</li>
            <li>Organize into digital folders</li>
            <li>Back up to cloud storage</li>
            <li>Delete blurry or unclear scans and re-do them</li>
          </ol>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Week 3: Categorize and Index</h3>

          <ol className="list-decimal list-inside space-y-2 mb-8 text-gray-700">
            <li>Sort all evidence into the 5 requirement categories</li>
            <li>Create an index or spreadsheet listing everything</li>
            <li>Number all documents</li>
            <li>Note the location of each piece of evidence</li>
            <li>Create a master checklist</li>
          </ol>

          <h3 className="text-2xl font-bold text-teal-600 mt-8 mb-4">Week 4: Identify Gaps</h3>

          <ol className="list-decimal list-inside space-y-2 mb-8 text-gray-700">
            <li>Review your evidence against the 5 requirements</li>
            <li>Identify what's missing or incomplete</li>
            <li>Create an action plan to address gaps</li>
            <li>Set deadlines for gathering additional evidence</li>
            <li>Update your checklist</li>
          </ol>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Organization Checklist</h2>

          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <p className="font-bold text-gray-900 mb-4">Use this checklist to stay organized:</p>
            <div className="space-y-2 text-gray-700">
              <p>☐ Gathered all evidence</p>
              <p>☐ Scanned and digitized documents</p>
              <p>☐ Created folder structure</p>
              <p>☐ Named files clearly</p>
              <p>☐ Backed up to cloud storage</p>
              <p>☐ Created index or spreadsheet</p>
              <p>☐ Categorized into 5 requirements</p>
              <p>☐ Identified gaps</p>
              <p>☐ Created action plan for gaps</p>
              <p>☐ Set reminders for deadlines</p>
              <p>☐ Reviewed all evidence for completeness</p>
              <p>☐ Ready to submit</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Best Practices for Staying Organized</h2>

          <ul className="list-disc list-inside space-y-3 mb-8 text-gray-700">
            <li><strong>Start early:</strong> Don't wait until the last minute. Organize as you go throughout your cycle</li>
            <li><strong>Be consistent:</strong> Use the same naming convention and folder structure throughout</li>
            <li><strong>Back up regularly:</strong> Use cloud storage and keep physical backups</li>
            <li><strong>Keep it simple:</strong> Don't over-complicate your system; simple is easier to maintain</li>
            <li><strong>Update regularly:</strong> Add new evidence as you collect it, not all at once</li>
            <li><strong>Create a checklist:</strong> Track what you have and what you still need</li>
            <li><strong>Set reminders:</strong> Use calendar alerts for important deadlines</li>
            <li><strong>Share with your confirmer:</strong> Give your confirmer access to your organized evidence</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Common Organization Mistakes</h2>

          <div className="space-y-4 mb-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="font-bold text-red-900">❌ Mistake 1: Disorganized File Names</p>
              <p className="text-gray-700">Saving files as "Document1," "Certificate," "Scan001"</p>
              <p className="text-gray-700 font-semibold">✓ Solution: Use descriptive names like "CPD_Wound_Care_March2026.pdf"</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="font-bold text-red-900">❌ Mistake 2: No Backup</p>
              <p className="text-gray-700">Keeping evidence only on your computer</p>
              <p className="text-gray-700 font-semibold">✓ Solution: Back up to cloud storage (Google Drive, OneDrive, Dropbox)</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="font-bold text-red-900">❌ Mistake 3: Scattered Evidence</p>
              <p className="text-gray-700">Evidence in multiple folders, emails, and locations</p>
              <p className="text-gray-700 font-semibold">✓ Solution: Centralize everything in one organized system</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="font-bold text-red-900">❌ Mistake 4: No Index</p>
              <p className="text-gray-700">Can't find things when you need them</p>
              <p className="text-gray-700 font-semibold">✓ Solution: Create an index or spreadsheet listing all evidence</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="font-bold text-red-900">❌ Mistake 5: Waiting Until the Last Minute</p>
              <p className="text-gray-700">Scrambling to organize everything 1 month before deadline</p>
              <p className="text-gray-700 font-semibold">✓ Solution: Organize as you go throughout your cycle</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-8 border border-teal-200 my-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Organize Your Evidence with RevalPro</h3>
            <p className="text-gray-700 mb-6">
              RevalPro makes organizing your revalidation evidence simple. Upload, organize, and track all your evidence in one secure place designed specifically for the NMC requirements.
            </p>
            <Link href="/quiz-landing">
              <a className="inline-block px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                Get Organized with RevalPro
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
