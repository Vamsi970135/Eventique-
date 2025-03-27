import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, X, User, LogOut } from "lucide-react";

export default function Header() {
  const [location, navigate] = useLocation();
  const { user, loading, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if the page is scrolled to add shadow to header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle user sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.fullName) return "U";
    
    const names = user.fullName.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <header className={`fixed w-full bg-white z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <svg className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="currentColor"/>
              <path d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 4V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="ml-2 text-xl font-heading font-bold text-gray-900">Eventique</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {location === "/" && (
            <>
              <a href="#how-it-works" className="text-gray-600 hover:text-indigo-600 font-medium">How It Works</a>
              <a href="#services" className="text-gray-600 hover:text-indigo-600 font-medium">Services</a>
              <a href="#for-providers" className="text-gray-600 hover:text-indigo-600 font-medium">For Providers</a>
              <a href="#join-waitlist" className="text-gray-600 hover:text-indigo-600 font-medium">Join Waitlist</a>
            </>
          )}
          
          {!loading && !user ? (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="outline">Log In</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          ) : !loading && user ? (
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(user.userType === 'provider' || user.userType === 'both' ? "/dashboard/provider" : "/dashboard/user")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : null}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          {!loading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 h-10 w-10 rounded-full mr-2">
                  <Avatar>
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(user.userType === 'provider' || user.userType === 'both' ? "/dashboard/provider" : "/dashboard/user")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 py-3 space-y-3">
            {location === "/" && (
              <>
                <a 
                  href="#how-it-works" 
                  className="block text-gray-600 hover:text-indigo-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How It Works
                </a>
                <a 
                  href="#services" 
                  className="block text-gray-600 hover:text-indigo-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </a>
                <a 
                  href="#for-providers" 
                  className="block text-gray-600 hover:text-indigo-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  For Providers
                </a>
                <a 
                  href="#join-waitlist" 
                  className="block text-gray-600 hover:text-indigo-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Join Waitlist
                </a>
              </>
            )}
            
            {!loading && !user && (
              <div className="flex flex-col space-y-2 pt-2">
                <Link href="/login">
                  <Button variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
