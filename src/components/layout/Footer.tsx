
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-mediq-500 flex items-center justify-center text-white font-bold">
                M
              </div>
              <span className="font-semibold text-lg">MediQ</span>
            </Link>
            <p className="text-sm text-gray-600 max-w-md">
              MediQ is a smart healthcare queue management system designed to streamline patient flow,
              reduce wait times, and enhance the overall healthcare experience.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-mediq-500 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-mediq-500 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-mediq-500 transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-mediq-500 transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="font-medium text-sm text-gray-900 mb-4 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-mediq-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/queue-status" className="text-sm text-gray-600 hover:text-mediq-500 transition-colors">
                  Queue Status
                </Link>
              </li>
              <li>
                <Link to="/book-appointment" className="text-sm text-gray-600 hover:text-mediq-500 transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-gray-600 hover:text-mediq-500 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-medium text-sm text-gray-900 mb-4 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li className="text-sm text-gray-600">
                123 Healthcare Street<br />
                Medical District, MD 12345
              </li>
              <li className="text-sm text-gray-600">
                support@mediq.example.com
              </li>
              <li className="text-sm text-gray-600">
                +1 (555) 123-4567
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} MediQ Healthcare Systems. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/terms" className="text-xs text-gray-500 hover:text-mediq-500 transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-xs text-gray-500 hover:text-mediq-500 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="text-xs text-gray-500 hover:text-mediq-500 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
