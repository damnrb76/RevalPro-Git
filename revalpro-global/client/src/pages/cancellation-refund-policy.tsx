import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";

export default function CancellationRefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Cancellation and Refund Policy - RevalPro</title>
        <meta name="description" content="RevalPro Cancellation and Refund Policy - Understand your rights for subscription cancellations and refund eligibility." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Cancellation and Refund Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: January 28, 2025</p>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Overview</h2>
            <p className="mb-4">
              This Cancellation and Refund Policy applies to all RevalPro subscriptions and services. 
              We are committed to fair and transparent billing practices while ensuring sustainable 
              service delivery for all healthcare professionals.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Subscription Cancellation</h2>
            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">2.1 How to Cancel</h3>
            <p className="mb-4">You can cancel your RevalPro subscription at any time through:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your account settings within the RevalPro application</li>
              <li>Contacting our support team at revalpro2025@gmail.com</li>
              <li>Following the cancellation link in your billing emails</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">2.2 When Cancellation Takes Effect</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Immediate Effect:</strong> You can request immediate cancellation, which stops all future billing</li>
              <li><strong>End of Billing Period:</strong> Standard cancellations take effect at the end of your current billing cycle</li>
              <li><strong>Access Retention:</strong> You retain full access to paid features until your current billing period expires</li>
              <li><strong>Data Retention:</strong> Your data remains accessible for 30 days after cancellation for export purposes</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">2.3 No Cancellation Fees</h3>
            <p className="mb-4">
              RevalPro does not charge any fees for subscription cancellation. You are only responsible 
              for payments due until the cancellation takes effect.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Refund Policy</h2>
            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">3.1 Standard Refund Policy</h3>
            <p className="mb-4">
              <strong>No Refund Policy:</strong> All RevalPro subscription fees are generally non-refundable. 
              This policy enables us to provide professional healthcare services at affordable rates.
            </p>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">3.2 Refund Exceptions</h3>
            <p className="mb-4">We may provide full or partial refunds in the following circumstances:</p>
            
            <h4 className="text-lg font-semibold text-gray-600 mt-4 mb-2">3.2.1 Technical Issues</h4>
            <ul className="list-disc pl-6 mb-4">
              <li>Extended service outages (more than 48 consecutive hours)</li>
              <li>Complete loss of access due to technical faults on our end</li>
              <li>Data loss caused by system failures (subject to investigation)</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-600 mt-4 mb-2">3.2.2 Billing Errors</h4>
            <ul className="list-disc pl-6 mb-4">
              <li>Duplicate charges due to payment processing errors</li>
              <li>Incorrect subscription tier billing</li>
              <li>Charges after confirmed cancellation</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-600 mt-4 mb-2">3.2.3 Exceptional Circumstances</h4>
            <ul className="list-disc pl-6 mb-4">
              <li>Serious illness preventing service use (medical documentation required)</li>
              <li>Bereavement in immediate family</li>
              <li>Change in NMC registration status (loss of licence)</li>
              <li>Regulatory changes affecting service viability</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">3.3 Consumer Rights (UK)</h3>
            <p className="mb-4">
              Under UK Consumer Rights legislation, you may be entitled to refunds in cases of:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Service not as described</li>
              <li>Service not fit for purpose</li>
              <li>Misleading information at point of purchase</li>
            </ul>
            <p className="mb-4">
              These rights apply within reasonable timeframes and do not override our standard policy 
              for services that function as described.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Annual Subscription Refunds</h2>
            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">4.1 Pro-Rata Refunds</h3>
            <p className="mb-4">
              For annual subscriptions cancelled within the first 30 days, we may provide a pro-rata 
              refund of unused months in exceptional circumstances outlined in Section 3.2.
            </p>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">4.2 Cooling-Off Period</h3>
            <p className="mb-4">
              UK consumers have a 14-day cooling-off period for online purchases. However, by actively 
              using RevalPro services during this period, you waive your right to a cooling-off refund 
              unless exceptional circumstances apply.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Free Trials and Promotions</h2>
            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">5.1 Free Trial Periods</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Free trials can be cancelled at any time before the trial period ends</li>
              <li>No charges apply if cancelled during the trial period</li>
              <li>Automatic billing begins if trial is not cancelled</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">5.2 Promotional Pricing</h3>
            <p className="mb-4">
              Refunds for promotional or discounted subscriptions are calculated based on the amount 
              actually paid, not the full subscription price.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Refund Process</h2>
            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">6.1 How to Request a Refund</h3>
            <ol className="list-decimal pl-6 mb-4">
              <li>Contact our support team at revalpro2025@gmail.com</li>
              <li>Include your account details and reason for refund request</li>
              <li>Provide any supporting documentation if applicable</li>
              <li>Allow up to 5 business days for initial review</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">6.2 Refund Processing Times</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Approved Refunds:</strong> Processed within 5-10 business days</li>
              <li><strong>Credit/Debit Cards:</strong> 3-5 business days to appear in your account</li>
              <li><strong>Bank Transfers:</strong> Up to 7 business days</li>
              <li><strong>PayPal:</strong> 1-3 business days</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">6.3 Refund Method</h3>
            <p className="mb-4">
              Refunds are processed back to the original payment method used for the subscription. 
              We cannot issue refunds to different accounts or payment methods for security reasons.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Data and Content After Cancellation</h2>
            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">7.1 Data Retention</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>30-Day Grace Period:</strong> Full data access for export purposes</li>
              <li><strong>After 30 Days:</strong> Account data archived (recoverable upon resubscription)</li>
              <li><strong>After 12 Months:</strong> Permanent deletion unless legal retention required</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">7.2 Data Export</h3>
            <p className="mb-4">
              You can export all your revalidation data in JSON and PDF formats at any time before 
              or after cancellation within the 30-day grace period.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8. Dispute Resolution</h2>
            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">8.1 Internal Resolution</h3>
            <p className="mb-4">
              We encourage resolving any billing disputes directly with our support team first. 
              Most issues can be resolved quickly and amicably through direct communication.
            </p>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">8.2 External Dispute Resolution</h3>
            <p className="mb-4">If internal resolution fails, you may:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Contact your bank or credit card company for chargeback procedures</li>
              <li>Seek resolution through UK Alternative Dispute Resolution services</li>
              <li>Contact Citizens Advice for consumer rights guidance</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">9. Contact Information</h2>
            <p className="mb-4">For cancellation or refund requests:</p>
            <p className="mb-2"><strong>Email:</strong> revalpro2025@gmail.com</p>
            <p className="mb-2"><strong>Subject Line:</strong> "Cancellation Request" or "Refund Request"</p>
            <p className="mb-2"><strong>Response Time:</strong> Within 2 business days</p>
            <p className="mb-2"><strong>Website:</strong> revalpro.co.uk</p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">10. Policy Updates</h2>
            <p className="mb-4">
              We may update this policy from time to time. Changes will be communicated via email 
              and posted on our website at least 30 days before taking effect. Continued use of 
              RevalPro after policy updates constitutes acceptance of the new terms.
            </p>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Need Help?</strong> Our support team is here to assist with any questions 
                about cancellation, refunds, or your subscription. We're committed to fair treatment 
                of all healthcare professionals using our service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}