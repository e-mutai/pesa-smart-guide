
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-finance-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">PesaSmart</h2>
            <p className="text-gray-300">
              AI-powered investment recommendations for Kenyan money market and unit trust funds.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link to="/funds" className="text-gray-300 hover:text-white">Fund Explorer</Link></li>
              <li><Link to="/education" className="text-gray-300 hover:text-white">Investment Education</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/disclaimer" className="text-gray-300 hover:text-white">Investment Disclaimer</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">support@pesasmart.co.ke</li>
              <li className="text-gray-300">Nairobi, Kenya</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} PesaSmart. All rights reserved.
          </p>
          <p className="mt-2">
            Investment recommendations provided by PesaSmart are for informational purposes only and do not constitute financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
