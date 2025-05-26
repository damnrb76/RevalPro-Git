import { Helmet } from "react-helmet";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
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
      
      {/* Email Notification */}
      <div className="bg-white p-6 rounded-xl shadow-md max-w-xl w-full">
        <h3 className="text-xl font-bold text-center mb-4">Be the first to know when we launch</h3>
        <form onSubmit={handleEmailSignup}>
          <div className="flex flex-col sm:flex-row gap-2">
            <input 
              type="email" 
              placeholder="Your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Notify Me"}
            </button>
          </div>
        </form>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Join our early access list for priority updates and exclusive launch benefits!
        </p>
      </div>
      
      {/* Footer */}
      <div className="mt-12 text-center text-gray-500">
        <p>&copy; 2025 RevalPro. All rights reserved.</p>
        <p className="mt-2">The complete NMC revalidation companion for UK nurses and midwives.</p>
      </div>
    </div>
  );
}