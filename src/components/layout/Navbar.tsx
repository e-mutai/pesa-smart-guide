
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-finance-primary">PesaSmart</h1>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/about" className="text-finance-muted hover:text-finance-primary px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
              <Link to="/funds" className="text-finance-muted hover:text-finance-primary px-3 py-2 rounded-md text-sm font-medium">
                Explore Funds
              </Link>
              <Link to="/recommendations" className="text-finance-muted hover:text-finance-primary px-3 py-2 rounded-md text-sm font-medium">
                Recommendations
              </Link>
              <Button variant="outline" className="text-finance-muted border-finance-muted hover:text-finance-primary hover:border-finance-primary">
                Sign In
              </Button>
              <Button className="bg-finance-primary hover:bg-finance-secondary text-white">
                Get Started
              </Button>
            </div>
          </div>
          
          <div className="md:hidden">
            <button 
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-finance-muted hover:text-finance-primary focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <Link 
              to="/about" 
              className="text-finance-muted hover:text-finance-primary block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/funds" 
              className="text-finance-muted hover:text-finance-primary block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore Funds
            </Link>
            <Link 
              to="/recommendations" 
              className="text-finance-muted hover:text-finance-primary block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Recommendations
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <Button variant="outline" className="w-full mb-2 text-finance-muted border-finance-muted hover:text-finance-primary hover:border-finance-primary">
                Sign In
              </Button>
              <Button className="w-full bg-finance-primary hover:bg-finance-secondary text-white">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
