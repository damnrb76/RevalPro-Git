import { ArrowLeft, Receipt, Calculator, Download, FileText, CreditCard } from "lucide-react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";

export default function VATInvoicingPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>VAT and Invoicing Policy - RevalPro</title>
        <meta name="description" content="RevalPro VAT and Invoicing Policy - Understanding VAT rates, invoice generation, and tax compliance for subscriptions." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <Receipt className="h-8 w-8 mr-3 text-blue-600" />
            VAT and Invoicing Policy
          </h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: January 28, 2025</p>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 flex items-center">
              <Calculator className="h-6 w-6 mr-2" />
              1. VAT Status and Registration
            </h2>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
              <h3 className="font-semibold text-blue-800 mb-3">Current VAT Status</h3>
              <p className="text-blue-800 mb-4">
                <strong>VAT Registration:</strong> RevalPro operates under the UK VAT threshold and current 
                pricing does not include VAT charges. This status may change as our business grows.
              </p>
              <p className="text-sm text-blue-700">
                <strong>Important:</strong> VAT may be applied to future subscriptions if/when we exceed 
                the UK VAT registration threshold of £85,000 annual turnover.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Current Pricing</h3>
                <p className="text-gray-600">All prices shown are inclusive of any applicable taxes</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Future VAT Status</h3>
                <p className="text-gray-600">30 days' notice will be given before any VAT application</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 flex items-center">
              <FileText className="h-6 w-6 mr-2" />
              2. Invoice Generation and Delivery
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">2.1 Automatic Invoice Generation</h3>
            <p className="mb-4">RevalPro automatically generates invoices for all paid subscriptions through our payment processor, Stripe:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Timing:</strong> Invoices are generated immediately upon successful payment</li>
              <li><strong>Delivery:</strong> Sent to your registered email address within 15 minutes</li>
              <li><strong>Format:</strong> PDF format for easy storage and record-keeping</li>
              <li><strong>Language:</strong> All invoices issued in English</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">2.2 Invoice Content</h3>
            <p className="mb-4">All invoices include the following information:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Business Details</h4>
                <ul className="list-disc pl-4 text-sm text-gray-600">
                  <li>RevalPro business information</li>
                  <li>Contact details</li>
                  <li>VAT status (when applicable)</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Customer Details</h4>
                <ul className="list-disc pl-4 text-sm text-gray-600">
                  <li>Your name and email address</li>
                  <li>Billing address (if provided)</li>
                  <li>Customer reference number</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Transaction Details</h4>
                <ul className="list-disc pl-4 text-sm text-gray-600">
                  <li>Invoice number and date</li>
                  <li>Service description</li>
                  <li>Billing period</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Payment Information</h4>
                <ul className="list-disc pl-4 text-sm text-gray-600">
                  <li>Amount charged</li>
                  <li>Payment method</li>
                  <li>Transaction reference</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 flex items-center">
              <Download className="h-6 w-6 mr-2" />
              3. Accessing Your Invoices
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">3.1 Email Delivery</h3>
            <p className="mb-4">
              Invoices are automatically emailed to your account's registered email address. 
              Please ensure your email settings allow emails from:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>RevalPro:</strong> revalpro2025@gmail.com</li>
              <li><strong>Stripe Billing:</strong> receipts@stripe.com</li>
              <li><strong>No-reply addresses:</strong> Various automated billing emails</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">3.2 Account Dashboard</h3>
            <p className="mb-4">You can also access your invoice history through:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your RevalPro account settings</li>
              <li>Subscription management section</li>
              <li>Billing history tab</li>
              <li>Download previous invoices in PDF format</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">3.3 Missing Invoices</h3>
            <p className="mb-4">If you haven't received an expected invoice:</p>
            <ol className="list-decimal pl-6 mb-4">
              <li>Check your email spam/junk folder</li>
              <li>Verify your email address in account settings</li>
              <li>Contact support at revalpro2025@gmail.com</li>
              <li>Provide your subscription reference number</li>
            </ol>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. VAT Rates and Application</h2>
            
            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">4.1 Current Exemption</h3>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
              <h4 className="font-semibold text-green-800 mb-3">No VAT Currently Applied</h4>
              <p className="text-green-800 mb-2">
                RevalPro subscriptions are currently provided without VAT charges as we operate 
                below the UK VAT registration threshold.
              </p>
              <p className="text-sm text-green-700">
                <strong>Benefit:</strong> Current pricing is the final amount you pay - no additional taxes.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">4.2 Future VAT Application</h3>
            <p className="mb-4">When VAT registration becomes required, the following rates will apply:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">Standard VAT Rate</h4>
                <p className="text-yellow-800 mb-2"><strong>20%</strong> - Standard UK VAT rate</p>
                <p className="text-sm text-yellow-700">Applied to digital services and software subscriptions</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Healthcare Exemption</h4>
                <p className="text-blue-800 mb-2"><strong>Potentially Exempt</strong></p>
                <p className="text-sm text-blue-700">Healthcare services may qualify for VAT exemption under certain conditions</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">4.3 VAT Registration Notification</h3>
            <p className="mb-4">When VAT registration occurs:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>30 Days Notice:</strong> Advance notification via email to all customers</li>
              <li><strong>Effective Date:</strong> Clear communication of when VAT charges begin</li>
              <li><strong>Rate Confirmation:</strong> Final VAT rate and any exemptions confirmed</li>
              <li><strong>Invoice Updates:</strong> All future invoices will include VAT breakdown</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 flex items-center">
              <CreditCard className="h-6 w-6 mr-2" />
              5. Payment Processing and Invoicing
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">5.1 Payment Processor</h3>
            <p className="mb-4">
              All payments and invoicing are processed through <strong>Stripe</strong>, a PCI DSS compliant 
              payment processor that meets the highest standards of payment security and reliability.
            </p>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">5.2 Billing Cycles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Monthly Subscriptions</h4>
                <ul className="list-disc pl-4 text-sm text-gray-600">
                  <li>Billed on the same date each month</li>
                  <li>Invoice generated on payment date</li>
                  <li>Pro-rata billing for mid-month changes</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Annual Subscriptions</h4>
                <ul className="list-disc pl-4 text-sm text-gray-600">
                  <li>Billed annually on subscription date</li>
                  <li>Full year invoice issued immediately</li>
                  <li>Discounted rate compared to monthly</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">5.3 Failed Payment Invoicing</h3>
            <p className="mb-4">When payments fail:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Failed Payment Notice:</strong> Immediate notification of payment failure</li>
              <li><strong>Retry Attempts:</strong> Automatic retry according to Stripe's smart retry logic</li>
              <li><strong>Updated Invoices:</strong> New invoices generated for successful retry payments</li>
              <li><strong>Account Status:</strong> Service suspension after final payment failure</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Invoice Corrections and Disputes</h2>
            
            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">6.1 Invoice Errors</h3>
            <p className="mb-4">If you notice an error on your invoice:</p>
            <ol className="list-decimal pl-6 mb-4">
              <li>Contact support immediately at revalpro2025@gmail.com</li>
              <li>Include your invoice number and description of the error</li>
              <li>We will investigate and issue corrected invoices within 3 business days</li>
              <li>Refunds will be processed if overcharging occurred</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">6.2 Billing Disputes</h3>
            <p className="mb-4">For billing disputes:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Direct Contact:</strong> Email revalpro2025@gmail.com with dispute details</li>
              <li><strong>Documentation:</strong> Provide any supporting evidence or transaction references</li>
              <li><strong>Resolution Timeline:</strong> Most disputes resolved within 5 business days</li>
              <li><strong>Escalation:</strong> Contact your bank/card provider if internal resolution fails</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Business Use and Expense Claims</h2>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
              <h3 className="font-semibold text-blue-800 mb-3">Professional Development Expense</h3>
              <p className="text-blue-800 mb-2">
                RevalPro subscriptions may qualify as a professional development expense for healthcare 
                professionals. Our invoices provide the necessary documentation for:
              </p>
              <ul className="list-disc pl-6 text-blue-800">
                <li>Personal tax deductions (if applicable)</li>
                <li>Employer reimbursement claims</li>
                <li>Professional development budgets</li>
                <li>NHS learning and development allocations</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">7.1 Invoice Details for Expense Claims</h3>
            <p className="mb-4">Our invoices include all information typically required for expense claims:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Clear service description: "NMC Revalidation Management Service"</li>
              <li>Business purpose: Professional healthcare compliance</li>
              <li>Date and amount paid</li>
              <li>Supplier details and contact information</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8. Data Retention and Access</h2>
            
            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">8.1 Invoice Storage</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Digital Storage:</strong> All invoices stored securely by Stripe for 7+ years</li>
              <li><strong>Account Access:</strong> Available through your RevalPro account indefinitely</li>
              <li><strong>Email Backup:</strong> Recommended to save invoice emails for your records</li>
              <li><strong>Download Option:</strong> PDF download available at any time</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">8.2 Account Closure Access</h3>
            <p className="mb-4">
              Even after account closure, you can request access to your invoice history by contacting 
              our support team. Invoice data is retained in compliance with UK tax and business record requirements.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">9. Contact Information</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-700 mb-4">Invoice and VAT Inquiries</h3>
              <p className="mb-2"><strong>Email:</strong> revalpro2025@gmail.com</p>
              <p className="mb-2"><strong>Subject Line:</strong> "Invoice Inquiry" or "VAT Question"</p>
              <p className="mb-2"><strong>Response Time:</strong> Within 24 hours for invoice issues</p>
              <p className="mb-2"><strong>Phone:</strong> No phone support currently available</p>
              <p className="mb-2"><strong>Website:</strong> revalpro.co.uk</p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">10. Policy Updates</h2>
            <p className="mb-4">
              This VAT and Invoicing Policy may be updated to reflect changes in:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>UK VAT legislation and rates</li>
              <li>Business VAT registration status</li>
              <li>Payment processing procedures</li>
              <li>Invoice generation systems</li>
            </ul>
            <p className="mb-4">
              All policy changes will be communicated via email at least 30 days before taking effect, 
              with the updated policy posted on our website.
            </p>

            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Transparency Note:</strong> RevalPro is committed to clear, honest invoicing 
                practices. All charges are clearly explained, and we never include hidden fees or 
                surprise charges in our billing. Your invoice reflects exactly what you agreed to pay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}