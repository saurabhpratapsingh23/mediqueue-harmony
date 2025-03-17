
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppButton } from "@/components/ui/AppButton";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-subtle py-3"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-foreground font-semibold text-xl"
        >
          <div className="h-8 w-8 rounded-lg bg-mediq-500 flex items-center justify-center text-white font-bold">
            M
          </div>
          <span className="hidden sm:inline">MediQ</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-mediq-600",
              location.pathname === "/" ? "text-mediq-600" : "text-foreground/80"
            )}
          >
            Home
          </Link>
          <Link
            to="/queue"
            className={cn(
              "text-sm font-medium transition-colors hover:text-mediq-600",
              location.pathname === "/queue" ? "text-mediq-600" : "text-foreground/80"
            )}
          >
            Queue Status
          </Link>
          <Link
            to="/book"
            className={cn(
              "text-sm font-medium transition-colors hover:text-mediq-600",
              location.pathname === "/book" ? "text-mediq-600" : "text-foreground/80"
            )}
          >
            Book Appointment
          </Link>
        </nav>

        {/* User Menu or Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <AppButton variant="glass" size="sm">
                  Dashboard
                </AppButton>
              </Link>
              <div className="relative group">
                <button className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
                  <User size={18} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-2">
                        <LogOut size={14} />
                        <span>Sign out</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/auth?mode=login">
                <AppButton variant="outline" size="sm">
                  Sign in
                </AppButton>
              </Link>
              <Link to="/auth?mode=register">
                <AppButton size="sm">Get Started</AppButton>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition-transform duration-300 ease-in-out pt-20",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="container px-4 mx-auto flex flex-col space-y-6 py-8">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/"
              className={cn(
                "px-4 py-3 rounded-md text-sm font-medium transition-colors",
                location.pathname === "/"
                  ? "bg-accent text-mediq-600"
                  : "hover:bg-accent/50"
              )}
            >
              Home
            </Link>
            <Link
              to="/queue"
              className={cn(
                "px-4 py-3 rounded-md text-sm font-medium transition-colors",
                location.pathname === "/queue"
                  ? "bg-accent text-mediq-600"
                  : "hover:bg-accent/50"
              )}
            >
              Queue Status
            </Link>
            <Link
              to="/book"
              className={cn(
                "px-4 py-3 rounded-md text-sm font-medium transition-colors",
                location.pathname === "/book"
                  ? "bg-accent text-mediq-600"
                  : "hover:bg-accent/50"
              )}
            >
              Book Appointment
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={cn(
                    "px-4 py-3 rounded-md text-sm font-medium transition-colors",
                    location.pathname === "/dashboard"
                      ? "bg-accent text-mediq-600"
                      : "hover:bg-accent/50"
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className={cn(
                    "px-4 py-3 rounded-md text-sm font-medium transition-colors",
                    location.pathname === "/profile"
                      ? "bg-accent text-mediq-600"
                      : "hover:bg-accent/50"
                  )}
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-3 text-left rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <div className="mt-4 space-y-3">
                <Link to="/auth?mode=login" className="block">
                  <AppButton variant="outline" className="w-full">
                    Sign in
                  </AppButton>
                </Link>
                <Link to="/auth?mode=register" className="block">
                  <AppButton className="w-full">Get Started</AppButton>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

// Import the cn utility function
import { cn } from "@/lib/utils";
