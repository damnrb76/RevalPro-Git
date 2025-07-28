import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: January 26, 2025</p>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Introduction and Acceptance</h2>
            <p className="mb-4">
              Welcome to RevalPro ("we", "our", or "us"). These Terms of Service govern your use of our NMC revalidation 
              tracking platform and associated services. By accessing or using RevalPro, you agree to be bound by these terms.
            </p>
            <p className="mb-4">
              <strong>Important:</strong> RevalPro is not affiliated with, endorsed by, or connected to the Nursing and 
              Midwifery Council (NMC). We are an independent service designed to assist healthcare professionals with 
              revalidation management.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Service Description</h2>
            <p className="mb-4">RevalPro provides:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>NMC revalidation tracking and management tools</li>
              <li>Practice hours recording and verification</li>
              <li>CPD activity logging and evidence storage</li>
              <li>Reflective practice templates and guidance</li>
              <li>AI-powered assistance for revalidation requirements</li>
              <li>Document management and export capabilities</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. User Responsibilities</h2>
            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">3.1 Eligibility</h3>
            <p className="mb-4">To use RevalPro, you must:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Be a registered healthcare professional with a valid NMC PIN</li>
              <li>Be at least 18 years of age</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the confidentiality of your account credentials</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">3.2 Professional Responsibility</h3>
            <p className="mb-4">You acknowledge and agree that:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>You remain fully responsible for meeting NMC revalidation requirements</li>
              <li>RevalPro is a management tool and does not guarantee NMC compliance</li>
              <li>You must verify all information and requirements independently</li>
              <li>Final submission to NMC is your responsibility</li>
              <li>You will maintain professional standards and integrity in all platform use</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">3.3 Data Accuracy</h3>
            <p className="mb-4">You agree to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate and truthful information</li>
              <li>Update your profile and records promptly when circumstances change</li>
              <li>Maintain accurate practice hours and CPD records</li>
              <li>Ensure all uploaded documents are genuine and belong to you</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Prohibited Uses</h2>
            <p className="mb-4">You may not use RevalPro to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Submit false or misleading information</li>
              <li>Share account access with unauthorized individuals</li>
              <li>Upload malicious software or content</li>
              <li>Attempt to reverse engineer or compromise the platform</li>
              <li>Use the service for any unlawful purpose</li>
              <li>Interfere with other users' access to the service</li>
              <li>Violate any applicable healthcare regulations or professional standards</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Intellectual Property</h2>
            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">5.1 Platform Content</h3>
            <p className="mb-4">
              All RevalPro content, including software, designs, text, graphics, and functionality, 
              is owned by RevalPro and protected by copyright and other intellectual property laws.
            </p>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">5.2 User Content</h3>
            <p className="mb-4">
              You retain full ownership and control of all content you create within RevalPro. 
              Your data is stored locally on your device and is not uploaded to our servers. 
              RevalPro processes this data locally to provide our services, and you can export 
              or delete your data at any time.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Subscription and Payment</h2>
            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">6.1 Subscription Plans</h3>
            <p className="mb-4">
              RevalPro offers various subscription tiers with different features and capabilities. 
              Current pricing and features are available on our website.
            </p>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">6.2 Payment Terms</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Subscriptions are billed in advance on a recurring basis</li>
              <li>All fees are non-refundable except as required by law</li>
              <li>We may change pricing with 30 days' notice</li>
              <li>Failure to pay may result in service suspension or termination</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">6.3 Cancellation</h3>
            <p className="mb-4">
              You may cancel your subscription at any time. Cancellation will take effect at the 
              end of your current billing period. You will retain access to your data for export 
              purposes for 30 days after cancellation.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Data Protection and Privacy</h2>
            <p className="mb-4">
              Our collection, use, and protection of your personal data is governed by our Privacy Policy, 
              which forms an integral part of these Terms. We comply with UK GDPR and healthcare data 
              protection standards.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8. Service Availability</h2>
            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">8.1 Uptime</h3>
            <p className="mb-4">
              While we strive for continuous availability, we do not guarantee uninterrupted service. 
              We may perform maintenance that temporarily affects service availability.
            </p>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">8.2 Service Modifications</h3>
            <p className="mb-4">
              We reserve the right to modify, suspend, or discontinue any aspect of the service 
              with reasonable notice. We will provide at least 30 days' notice for significant changes.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">9. Limitation of Liability</h2>
            <p className="mb-4">
              <strong>IMPORTANT DISCLAIMER:</strong> RevalPro is a management tool only. We do not:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Guarantee NMC revalidation approval</li>
              <li>Provide professional healthcare advice</li>
              <li>Accept responsibility for NMC compliance failures</li>
              <li>Warrant the accuracy of NMC requirements or procedures</li>
            </ul>
            <p className="mb-4">
              To the maximum extent permitted by law, RevalPro's liability is limited to the amount 
              you paid for the service in the 12 months preceding the claim.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">10. Professional Indemnity</h2>
            <p className="mb-4">
              RevalPro does not provide professional indemnity coverage. You are responsible for 
              maintaining appropriate professional indemnity insurance as required by the NMC.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">11. Account Termination</h2>
            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">11.1 Termination by You</h3>
            <p className="mb-4">
              You may terminate your account at any time by canceling your subscription and 
              contacting our support team.
            </p>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">11.2 Termination by Us</h3>
            <p className="mb-4">We may terminate your account if you:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Violate these Terms of Service</li>
              <li>Engage in fraudulent or unlawful activity</li>
              <li>Fail to pay subscription fees</li>
              <li>Compromise platform security or other users' experience</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">12. Governing Law</h2>
            <p className="mb-4">
              These Terms are governed by the laws of England and Wales. Any disputes will be 
              subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">13. Changes to Terms</h2>
            <p className="mb-4">
              We may update these Terms from time to time. Material changes will be communicated 
              via email and in-app notifications at least 30 days before taking effect. Continued 
              use of the service after changes constitutes acceptance of the new terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">14. Contact Information</h2>
            <p className="mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <p className="mb-2"><strong>Email:</strong> revalpro2025@gmail.com</p>
            <p className="mb-2"><strong>Website:</strong> revalpro.co.uk</p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">15. Severability</h2>
            <p className="mb-4">
              If any provision of these Terms is found to be unenforceable, the remaining 
              provisions will continue in full force and effect.
            </p>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Remember:</strong> RevalPro assists with revalidation management but does not 
                replace your professional responsibility to meet NMC requirements. Always verify 
                requirements directly with the NMC and maintain your professional standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}