import { Link } from "wouter";
import { cn } from "@/lib/utils";

type FooterProps = {
  logo: string;
  className?: string;
};

export default function Footer({ logo, className }: FooterProps) {
  return (
    <footer className={cn("bg-gradient-to-r from-revalpro-dark-blue to-revalpro-blue text-white mt-12 py-8", className)}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 mr-3 rounded-full overflow-hidden shadow-md">
                <img 
                  src={logo} 
                  alt="RevalPro Logo" 
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg">RevalPro</h3>
            </div>
            <p className="text-sm text-revalpro-white/80">Supporting UK nurses with their NMC revalidation journey.</p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">NMC Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://www.nmc.org.uk/" 
                  className="text-revalpro-white/80 hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NMC Official Website
                </a>
              </li>
              <li>
                <a 
                  href="https://www.nmc.org.uk/standards/code/" 
                  className="text-revalpro-white/80 hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  The Code
                </a>
              </li>
              <li>
                <a 
                  href="https://www.nmc.org.uk/revalidation/" 
                  className="text-revalpro-white/80 hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Revalidation Guidelines
                </a>
              </li>
            </ul>
            
            <h4 className="font-semibold text-md mb-3 mt-6">Legal Documents</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-revalpro-white/80 hover:text-white cursor-pointer">
                  <Link href="/privacy-policy">
                    Privacy Policy
                  </Link>
                </span>
              </li>
              <li>
                <span className="text-revalpro-white/80 hover:text-white cursor-pointer">
                  <Link href="/terms-of-service">
                    Terms of Service
                  </Link>
                </span>
              </li>
              <li>
                <span className="text-revalpro-white/80 hover:text-white cursor-pointer">
                  <Link href="/cancellation-refund-policy">
                    Cancellation & Refunds
                  </Link>
                </span>
              </li>
              <li>
                <span className="text-revalpro-white/80 hover:text-white cursor-pointer">
                  <Link href="/business-information">
                    Business Information
                  </Link>
                </span>
              </li>
              <li>
                <span className="text-revalpro-white/80 hover:text-white cursor-pointer">
                  <Link href="/vat-invoicing-policy">
                    VAT & Invoicing
                  </Link>
                </span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <p className="text-sm text-revalpro-white/80 mb-4">
              Have questions? Email us at:<br/>
              <a href="mailto:support@revalpro.co.uk" className="text-white hover:underline font-medium">support@revalpro.co.uk</a>
            </p>
            <div className="flex space-x-4 mb-6">
              <a href="https://www.facebook.com/profile.php?id=61571637733696" target="_blank" rel="noopener noreferrer" className="text-revalpro-white/80 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                </svg>
              </a>
            </div>

            <h3 className="font-bold text-lg mb-4">Data Privacy</h3>
            <p className="text-sm text-revalpro-white/80 mb-2">
              All your revalidation data is stored locally on your device.
            </p>
            <Link href="/settings?tab=data">
              <button className="bg-revalpro-orange text-white font-medium text-sm px-4 py-2 rounded hover:bg-revalpro-orange/90 transition shadow-sm">
                Backup My Data
              </button>
            </Link>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-revalpro-blue/30 text-center text-sm text-revalpro-white/80">
          <p>© {new Date().getFullYear()} RevalPro. Your Nursing Revalidation Assistant.</p>
        </div>
      </div>
    </footer>
  );
}