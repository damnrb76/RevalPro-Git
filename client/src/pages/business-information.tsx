import { ArrowLeft, Building, Mail, Globe, Users, Shield, Award } from "lucide-react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";

export default function BusinessInformation() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Business Information - RevalPro</title>
        <meta name="description" content="RevalPro Business Information - Company details, registration, and compliance information for transparency." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Business Information</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: January 28, 2025</p>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 flex items-center">
              <Building className="h-6 w-6 mr-2" />
              1. Company Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Trading Name</h3>
                <p className="text-gray-600">RevalPro</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Business Type</h3>
                <p className="text-gray-600">Healthcare Technology Service</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Service Focus</h3>
                <p className="text-gray-600">NMC Revalidation Management Platform</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Industry</h3>
                <p className="text-gray-600">Healthcare Software & Professional Services</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 flex items-center">
              <Mail className="h-6 w-6 mr-2" />
              2. Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Primary Email</h3>
                <p className="text-gray-600">revalpro2025@gmail.com</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Support Email</h3>
                <p className="text-gray-600">support@revalpro.co.uk</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Website</h3>
                <p className="text-gray-600">revalpro.co.uk</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Response Time</h3>
                <p className="text-gray-600">Within 24-48 hours</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 flex items-center">
              <Globe className="h-6 w-6 mr-2" />
              3. Operational Details
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-700 mb-4">Service Territories</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Primary Market:</strong> United Kingdom</li>
                <li><strong>Target Users:</strong> NHS and private healthcare professionals</li>
                <li><strong>Regulatory Scope:</strong> NMC registered nurses and midwives</li>
                <li><strong>Language:</strong> English (UK)</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Operating Hours</h3>
                <p className="text-gray-600">24/7 Service Access</p>
                <p className="text-sm text-gray-500">Support: Monday-Friday, 9 AM - 5 PM GMT</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Platform Availability</h3>
                <p className="text-gray-600">Web Application</p>
                <p className="text-sm text-gray-500">Compatible with all modern browsers</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 flex items-center">
              <Users className="h-6 w-6 mr-2" />
              4. Service Offering
            </h2>
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-800 mb-4">Professional Revalidation Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="list-disc pl-6 text-blue-700">
                  <li>Practice hours tracking and verification</li>
                  <li>CPD activity logging and evidence storage</li>
                  <li>Reflective practice templates and guidance</li>
                  <li>Feedback collection and management</li>
                </ul>
                <ul className="list-disc pl-6 text-blue-700">
                  <li>AI-powered revalidation assistance</li>
                  <li>Document generation and export</li>
                  <li>Progress tracking and reminders</li>
                  <li>Professional compliance monitoring</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Subscription Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Free Plan</h4>
                <p className="text-sm text-green-700">Basic revalidation tracking</p>
                <p className="text-lg font-bold text-green-800">£0/month</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Standard Plan</h4>
                <p className="text-sm text-blue-700">Enhanced features and AI assistance</p>
                <p className="text-lg font-bold text-blue-800">£4.99/month</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Premium Plan</h4>
                <p className="text-sm text-purple-700">Full feature access and priority support</p>
                <p className="text-lg font-bold text-purple-800">£7.99/month</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-2" />
              5. Compliance and Standards
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-700 mb-4">Data Protection and Privacy</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>UK GDPR Compliance:</strong> Full compliance with UK General Data Protection Regulation</li>
                <li><strong>Data Protection Act 2018:</strong> Adherence to UK data protection legislation</li>
                <li><strong>Healthcare Standards:</strong> NHS Digital security and information governance standards</li>
                <li><strong>Professional Standards:</strong> NMC Code of Conduct alignment</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Security Measures</h3>
                <ul className="list-disc pl-4 text-sm text-gray-600">
                  <li>End-to-end encryption</li>
                  <li>Secure authentication</li>
                  <li>Regular security assessments</li>
                  <li>HTTPS/TLS encryption</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Quality Assurance</h3>
                <ul className="list-disc pl-4 text-sm text-gray-600">
                  <li>Continuous service monitoring</li>
                  <li>Regular backup procedures</li>
                  <li>Performance optimization</li>
                  <li>User feedback integration</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 flex items-center">
              <Award className="h-6 w-6 mr-2" />
              6. Professional Disclaimers
            </h2>
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-3">Important Notice</h3>
              <ul className="list-disc pl-6 text-yellow-800">
                <li><strong>Independence:</strong> RevalPro is not affiliated with, endorsed by, or connected to the Nursing and Midwifery Council (NMC)</li>
                <li><strong>Professional Responsibility:</strong> Users remain fully responsible for meeting NMC revalidation requirements</li>
                <li><strong>Service Nature:</strong> RevalPro is a management tool and does not guarantee NMC compliance or approval</li>
                <li><strong>Verification Required:</strong> All information and requirements must be verified independently with the NMC</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Payment and Billing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Payment Processor</h3>
                <p className="text-gray-600">Stripe (PCI DSS Compliant)</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Accepted Payment Methods</h3>
                <p className="text-gray-600">All major credit/debit cards</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Billing Frequency</h3>
                <p className="text-gray-600">Monthly or Annual</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Currency</h3>
                <p className="text-gray-600">British Pounds (GBP)</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8. Intellectual Property</h2>
            <p className="mb-4">
              RevalPro and all associated trademarks, logos, and content are the intellectual property 
              of the business owners. Users retain full ownership and control of all content they create 
              within the platform.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">9. Third-Party Services</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-700 mb-4">Integrated Services</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>AI Services:</strong> OpenAI GPT-4, Google Gemini, Anthropic Claude for professional guidance</li>
                <li><strong>Payment Processing:</strong> Stripe for secure transaction handling</li>
                <li><strong>Email Services:</strong> Professional email communication systems</li>
                <li><strong>Cloud Infrastructure:</strong> Reliable hosting and data storage</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">10. Contact for Business Inquiries</h2>
            <p className="mb-4">For business-related inquiries, partnerships, or compliance questions:</p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="mb-2"><strong>General Business:</strong> revalpro2025@gmail.com</p>
              <p className="mb-2"><strong>Data Protection Officer:</strong> revalpro2025@gmail.com</p>
              <p className="mb-2"><strong>Technical Support:</strong> support@revalpro.co.uk</p>
              <p className="mb-2"><strong>Website:</strong> revalpro.co.uk</p>
            </div>

            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Transparency Commitment:</strong> RevalPro is committed to maintaining transparent 
                business practices and providing clear information about our services, policies, and 
                procedures to support healthcare professionals in their revalidation journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}