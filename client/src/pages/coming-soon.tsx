import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";

export default function ComingSoonPage() {
  // Countdown timer state
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Set launch date to 30 days from now
  useEffect(() => {
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 30);
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;
      
      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
      
      if (distance < 0) {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

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
      
      {/* Countdown Timer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12">
        <div className="flex flex-col items-center">
          <div className="text-3xl md:text-5xl font-bold text-blue-600 mb-1">
            {countdown.days}
          </div>
          <div className="text-sm uppercase text-gray-500">Days</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-3xl md:text-5xl font-bold text-blue-600 mb-1">
            {countdown.hours}
          </div>
          <div className="text-sm uppercase text-gray-500">Hours</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-3xl md:text-5xl font-bold text-blue-600 mb-1">
            {countdown.minutes}
          </div>
          <div className="text-sm uppercase text-gray-500">Minutes</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-3xl md:text-5xl font-bold text-blue-600 mb-1">
            {countdown.seconds}
          </div>
          <div className="text-sm uppercase text-gray-500">Seconds</div>
        </div>
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
        <div className="flex flex-col sm:flex-row gap-2">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Notify Me
          </button>
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