import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import LoginModal from "@/components/ui/LoginModal";
import WaitlistModal from "@/components/ui/WaitlistModal";
import { Button } from "@/components/ui/button";
import { CalendarCheck } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
    closeMobileMenu();
  };

  const handleWaitlistClick = () => {
    setIsWaitlistModalOpen(true);
    closeMobileMenu();
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-2xl font-bold text-primary flex items-center">
                <CalendarCheck className="mr-2" />
                <span>Eventique</span>
              </a>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/#features">
              <a className={`text-gray-600 hover:text-primary transition ${location === '/#features' ? 'text-primary' : ''}`}>
                Features
              </a>
            </Link>
            <Link href="/#how-it-works">
              <a className={`text-gray-600 hover:text-primary transition ${location === '/#how-it-works' ? 'text-primary' : ''}`}>
                How It Works
              </a>
            </Link>
            <Link href="/#categories">
              <a className={`text-gray-600 hover:text-primary transition ${location === '/#categories' ? 'text-primary' : ''}`}>
                Categories
              </a>
            </Link>
            <Link href="/#testimonials">
              <a className={`text-gray-600 hover:text-primary transition ${location === '/#testimonials' ? 'text-primary' : ''}`}>
                Testimonials
              </a>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.userType === 'customer' ? (
                  <Link href="/dashboard/customer">
                    <Button variant="outline" className="hidden md:block">Dashboard</Button>
                  </Link>
                ) : (
                  <Link href="/dashboard/provider">
                    <Button variant="outline" className="hidden md:block">Dashboard</Button>
                  </Link>
                )}
                <Button 
                  variant="default" 
                  onClick={logout}
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleLoginClick}
                >
                  Log In
                </Button>
                <Button 
                  className="hidden md:block" 
                  onClick={handleWaitlistClick}
                >
                  Join Waitlist
                </Button>
              </>
            )}
          </div>
          
          <button 
            className="md:hidden text-gray-500 focus:outline-none" 
            onClick={toggleMobileMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-white border-t`} id="mobile-menu">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <Link href="/#features">
              <a className="block py-2 text-gray-600 hover:text-primary transition" onClick={closeMobileMenu}>
                Features
              </a>
            </Link>
            <Link href="/#how-it-works">
              <a className="block py-2 text-gray-600 hover:text-primary transition" onClick={closeMobileMenu}>
                How It Works
              </a>
            </Link>
            <Link href="/#categories">
              <a className="block py-2 text-gray-600 hover:text-primary transition" onClick={closeMobileMenu}>
                Categories
              </a>
            </Link>
            <Link href="/#testimonials">
              <a className="block py-2 text-gray-600 hover:text-primary transition" onClick={closeMobileMenu}>
                Testimonials
              </a>
            </Link>
            {user ? (
              <>
                {user.userType === 'customer' ? (
                  <Link href="/dashboard/customer">
                    <a className="block py-2 text-gray-600 hover:text-primary transition" onClick={closeMobileMenu}>
                      Dashboard
                    </a>
                  </Link>
                ) : (
                  <Link href="/dashboard/provider">
                    <a className="block py-2 text-gray-600 hover:text-primary transition" onClick={closeMobileMenu}>
                      Dashboard
                    </a>
                  </Link>
                )}
              </>
            ) : (
              <Button 
                className="w-full" 
                onClick={handleWaitlistClick}
              >
                Join Waitlist
              </Button>
            )}
          </div>
        </div>
      </header>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSignupClick={() => {
          setIsLoginModalOpen(false);
          setIsWaitlistModalOpen(true);
        }} 
      />
      
      <WaitlistModal 
        isOpen={isWaitlistModalOpen} 
        onClose={() => setIsWaitlistModalOpen(false)} 
        userType="customer"
      />
    </>
  );
}
