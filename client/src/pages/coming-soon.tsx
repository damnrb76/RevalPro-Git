import { Helmet } from "react-helmet";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    if (!consent) {
      toast({
        title: "Consent required",
        description: "Please confirm you'd like to receive updates by checking the consent box",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/register-interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast({
          title: "Thank you!",
          description: "We'll notify you as soon as RevalPro launches!",
        });
        setEmail("");
        setConsent(false);
      } else {
        throw new Error('Failed to register interest');
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later or contact us directly",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <Helmet>
        <title>Coming Soon - RevalPro</title>
        <meta name="description" content="RevalPro is launching soon. The UK's premier NMC revalidation tracker for nurses and midwives." />
      </Helmet>
      
      {/* Logo */}
      <div className="mb-8 animate-pulse">
        <div className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400">
          RevalPro
        </div>
      </div>
      
      {/* Main Heading */}
      <h1 className="text-3xl md:text-5xl font-bold text-center text-gray-800 mb-4">
        Coming Soon
      </h1>
      
      {/* Subheading */}
      <p className="text-xl text-center text-gray-600 max-w-2xl mb-10">
        We're building something special to transform your NMC revalidation experience.
        Stay tuned!
      </p>

      {/* Email Signup Form - Moved to Top */}
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full mb-12 border-2 border-blue-100">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-700 mb-2">
          Be the First to Experience RevalPro!
        </h2>
        <h3 className="text-xl font-semibold text-center text-gray-700 mb-6">
          Get Exclusive Access & Updates for RevalPro!
        </h3>
        
        <p className="text-gray-600 text-center mb-6">
          Enter your email below to receive notifications about the RevalPro launch, important product updates, 
          and information on how to get priority access when it becomes available.
        </p>
        
        <form onSubmit={handleEmailSignup} className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              required
            />
          </div>
          
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="consent" className="text-sm text-gray-700 leading-relaxed">
              Yes, please keep me informed about RevalPro! By checking this box, I agree to receive emails about the RevalPro launch, 
              product updates, and priority access opportunities. I understand I can unsubscribe at any time.
            </label>
          </div>
          
          <div className="text-center">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-3 bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Sign Up for RevalPro: Launch News, Updates & Priority Access!"}
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            We value your privacy. Please review our{" "}
            <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
              Privacy Policy
            </a>{" "}
            to see how we manage your data.
          </div>
        </form>
      </div>
      
      {/* Launch Announcement */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl w-full text-center mb-12">
        <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-2">
          Launching Soon
        </h2>
        <p className="text-gray-700">
          We're working hard to bring you the best NMC revalidation experience.
          Our platform will be available in the coming weeks.
        </p>
      </div>
      
      {/* Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mb-12">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="text-blue-500 text-2xl mb-3">✓</div>
          <h3 className="text-xl font-semibold mb-2">Track Practice Hours</h3>
          <p className="text-gray-600">Easily log and monitor your 450 required practice hours across different settings.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="text-blue-500 text-2xl mb-3">✓</div>
          <h3 className="text-xl font-semibold mb-2">Record CPD Activities</h3>
          <p className="text-gray-600">Track your 35 CPD hours with automatic calculation of participatory learning.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="text-blue-500 text-2xl mb-3">✓</div>
          <h3 className="text-xl font-semibold mb-2">AI-Powered Assistance</h3>
          <p className="text-gray-600">Get help writing reflective accounts and understanding NMC requirements.</p>
        </div>
      </div>
      

      
      {/* Footer */}
      <div className="mt-12 text-center text-gray-500">
        <p>&copy; 2025 RevalPro. All rights reserved.</p>
        <p className="mt-2">The complete NMC revalidation companion for UK nurses and midwives.</p>
      </div>
    </div>
  );
}