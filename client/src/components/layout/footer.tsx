import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-nhs-dark-blue text-white mt-12 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">NurseValidate UK</h3>
            <p className="text-sm text-nhs-pale-grey">Supporting UK nurses with their NMC revalidation journey.</p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Important Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://www.nmc.org.uk/" 
                  className="text-nhs-pale-grey hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NMC Official Website
                </a>
              </li>
              <li>
                <a 
                  href="https://www.nmc.org.uk/standards/code/" 
                  className="text-nhs-pale-grey hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  The Code
                </a>
              </li>
              <li>
                <a 
                  href="https://www.nmc.org.uk/revalidation/" 
                  className="text-nhs-pale-grey hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Revalidation Guidelines
                </a>
              </li>
              <li>
                <Link href="/settings?tab=privacy">
                  <a className="text-nhs-pale-grey hover:text-white">Privacy Policy</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Data Privacy</h3>
            <p className="text-sm text-nhs-pale-grey mb-2">
              All your revalidation data is stored locally on your device.
            </p>
            <Link href="/settings?tab=data">
              <button className="bg-nhs-pale-grey text-nhs-dark-blue text-sm px-4 py-2 rounded hover:bg-white transition">
                Backup My Data
              </button>
            </Link>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-nhs-bright-blue text-center text-sm text-nhs-pale-grey">
          <p>© {new Date().getFullYear()} NurseValidate UK. This app is not affiliated with the Nursing & Midwifery Council.</p>
        </div>
      </div>
    </footer>
  );
}
