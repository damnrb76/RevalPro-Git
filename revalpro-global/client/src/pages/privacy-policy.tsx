import { Helmet } from "react-helmet";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Helmet>
        <title>Privacy Policy - RevalPro</title>
        <meta name="description" content="RevalPro Privacy Policy - How we collect, use, and protect your personal data in compliance with UK GDPR." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-600 mb-8"><strong>Last updated: January 26, 2025</strong></p>

        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Introduction</h2>
          <p className="mb-4">
            RevalPro ("we", "our", or "us") is committed to protecting your privacy and ensuring the security of your personal data. 
            This Privacy Policy explains how we collect, use, store, and protect your information when you use our NMC revalidation 
            tracking service and visit our website.
          </p>
          <p className="mb-4">
            This policy applies to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Our coming soon page at revalpro.co.uk</li>
            <li>The RevalPro application and all associated services</li>
            <li>Email communications and marketing</li>
          </ul>
          <p className="mb-4">
            We are the data controller for your personal data and are committed to compliance with the UK General Data Protection 
            Regulation (UK GDPR), Data Protection Act 2018, and all applicable healthcare data protection standards.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Contact Information</h2>
          <p className="mb-4">
            <strong>Data Controller:</strong> RevalPro<br/>
            <strong>Email:</strong> revalpro2025@gmail.com<br/>
            <strong>Website:</strong> revalpro.co.uk
          </p>
          <p className="mb-4">
            For any privacy-related queries, please contact us using the details above.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Information We Collect</h2>
          
          <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">3.1 Email Collection (Coming Soon Page)</h3>
          <p className="mb-4">When you register your interest on our coming soon page, we collect:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your email address</li>
            <li>Timestamp of registration</li>
            <li>IP address (for security purposes)</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">3.2 RevalPro Application Data</h3>
          <p className="mb-4">When you use our application, we may collect:</p>
          
          <p className="font-semibold mb-2">Personal Information:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Name and contact details</li>
            <li>NMC PIN and registration details</li>
            <li>Job title and workplace information</li>
            <li>Profile picture (optional)</li>
          </ul>

          <p className="font-semibold mb-2">Professional Data:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Practice hours and work settings</li>
            <li>Continuing Professional Development (CPD) records</li>
            <li>Reflective accounts and professional reflections</li>
            <li>Feedback records from colleagues and patients</li>
            <li>Health and character declarations</li>
            <li>Confirmation details from confirming officers</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Legal Basis for Processing</h2>
          <p className="mb-4">We process your personal data under the following legal bases:</p>
          
          <p className="font-semibold mb-2">Contract Performance (Article 6(1)(b) UK GDPR):</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Providing NMC revalidation tracking services</li>
            <li>Managing your account and subscription</li>
            <li>Processing payments</li>
          </ul>

          <p className="font-semibold mb-2">Consent (Article 6(1)(a) UK GDPR):</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Email marketing communications</li>
            <li>Optional features and analytics</li>
            <li>Profile picture uploads</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. How We Use Your Information</h2>
          
          <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">5.1 Email Addresses (Coming Soon)</h3>
          <p className="mb-4">We use collected email addresses to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Send launch notifications and updates</li>
            <li>Provide priority access information</li>
            <li>Share important service announcements</li>
            <li>Offer early access benefits</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">5.2 Application Data</h3>
          <p className="mb-4">We use your application data to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide NMC revalidation tracking services</li>
            <li>Generate compliance reports and documentation</li>
            <li>Offer AI-powered guidance and suggestions</li>
            <li>Calculate progress towards revalidation requirements</li>
            <li>Enable data export and backup functionality</li>
            <li>Improve our services and user experience</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Data Storage and Security</h2>
          <p className="mb-4">We implement industry-standard security measures including:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>End-to-end encryption for all data transmission</li>
            <li>Secure authentication and access controls</li>
            <li>Regular security assessments and updates</li>
            <li>Automated backup and recovery systems</li>
            <li>Staff training on data protection requirements</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Your Rights Under UK GDPR</h2>
          <p className="mb-4">You have the following rights regarding your personal data:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Right of Access:</strong> Request copies of your personal data</li>
            <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your data (subject to legal obligations)</li>
            <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
            <li><strong>Right to Data Portability:</strong> Receive your data in a portable format</li>
            <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for consent-based processing</li>
          </ul>
          <p className="mb-4">
            To exercise any of these rights, contact us at revalpro2025@gmail.com.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8. Data Retention</h2>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Email Addresses:</strong> Retained until service launch completion or unsubscribe request (maximum 24 months)</li>
            <li><strong>Application Data:</strong> Retained for the duration of your NMC registration plus 7 years for professional record-keeping requirements</li>
            <li><strong>Technical Logs:</strong> Retained for 12 months for security and performance monitoring</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">9. Healthcare and Professional Standards</h2>
          <p className="mb-4">As a healthcare professional service, we adhere to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>NMC Code of Conduct and professional standards</li>
            <li>NHS Digital security and information governance standards</li>
            <li>Clinical governance frameworks</li>
            <li>Professional confidentiality requirements</li>
            <li>Healthcare data protection best practices</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">10. Contact and Complaints</h2>
          <p className="mb-4">
            If you have concerns about how we handle your data:
          </p>
          <p className="mb-4">
            <strong>First:</strong> Contact us directly at revalpro2025@gmail.com<br/>
            <strong>If unsatisfied:</strong> Contact the Information Commissioner's Office (ICO)
          </p>
          <p className="mb-4">
            <strong>ICO Contact Details:</strong><br/>
            Website: ico.org.uk<br/>
            Phone: 0303 123 1113<br/>
            Post: Information Commissioner's Office, Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF
          </p>

          <hr className="my-8 border-gray-300" />
          
          <p className="text-sm text-gray-600 text-center">
            This Privacy Policy is effective from January 26, 2025, and governs all data processing activities by RevalPro.
          </p>
          <p className="text-sm text-gray-600 text-center mt-2">
            For the most current version of this policy, please visit: revalpro.co.uk/privacy
          </p>
          <p className="text-sm text-gray-600 text-center mt-2">
            <strong>Contact us:</strong> revalpro2025@gmail.com for any questions about this Privacy Policy or our data practices.
          </p>
        </div>
      </div>
    </div>
  );
}