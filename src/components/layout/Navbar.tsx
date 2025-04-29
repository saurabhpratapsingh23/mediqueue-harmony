import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppButton } from "@/components/ui/AppButton";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import Doctors from "@/pages/Doctors"; 

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleViewDoctors = () => {
    navigate("/doctors");
  };

  // Check if user is admin
  const isAdmin = user?.role === "admin";

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
          to="/landing"
          className="flex items-center space-x-2 text-foreground font-semibold text-xl"
        >
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
            M
          </div>
          <span className="hidden sm:inline">MediQ</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/landing"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/landing" ? "text-primary" : "text-foreground/80"
            )}
          >
            Home
          </Link>
          <Link
            to="/queue-status"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/queue-status" ? "text-primary" : "text-foreground/80"
            )}
          >
            Queue Status
          </Link>
          <Link
            to="/book-appointment"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/book-appointment" ? "text-primary" : "text-foreground/80"
            )}
          >
            Book Appointment
          </Link>
          <Link
            to="/how-it-works"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/how-it-works" ? "text-primary" : "text-foreground/80"
            )}
          >
            How It Works
          </Link>
          <Link
            to="/departments"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/departments" ? "text-primary" : "text-foreground/80"
            )}
          >
            Departments
          </Link>
          <Link
            to="/doctors"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/doctors" ? "text-primary" : "text-foreground/80"
            )}
          >
            Doctors
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
                      to="/records"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Medical Records
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin/doctors"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Manage Doctors
                      </Link>
                    )}
                    {isAdmin && (
                      <Link
                        to="/admin/statistics"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        System Statistics
                      </Link>
                    )}
                    {(isAdmin || user?.role === "doctor") && (
                      <Link
                        to="/manage-queue"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Manage Queue
                      </Link>
                    )}
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
              <Link to="/sign-in">
                <AppButton variant="outline" size="sm">
                  Sign in
                </AppButton>
              </Link>
              <Link to="/sign-up">
                <AppButton size="sm">Get Started</AppButton>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button with enhanced animation */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-accent transition-colors relative"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <div className="relative w-5 h-5">
            <Menu 
              size={20} 
              className={cn(
                "absolute inset-0 transition-all duration-300 transform",
                isMobileMenuOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
              )} 
            />
            <X 
              size={20} 
              className={cn(
                "absolute inset-0 transition-all duration-300 transform",
                isMobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
              )} 
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu with close button */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition-transform duration-300 ease-in-out pt-20",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Close button inside mobile menu */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <X size={20} className="text-primary" />
        </button>
        
        <div className="container px-4 mx-auto h-full overflow-y-auto pb-20">
          <nav className="flex flex-col space-y-4 py-8">
            <Link
              to="/landing"
              className={cn(
                "px-4 py-3 rounded-md text-sm font-medium transition-colors",
                location.pathname === "/landing"
                  ? "bg-accent text-primary"
                  : "hover:bg-accent/50"
              )}
            >
              Home
            </Link>
            <Link
              to="/queue-status"
              className={cn(
                "px-4 py-3 rounded-md text-sm font-medium transition-colors",
                location.pathname === "/queue-status"
                  ? "bg-accent text-primary"
                  : "hover:bg-accent/50"
              )}
            >
              Queue Status
            </Link>
            <Link
              to="/book-appointment"
              className={cn(
                "px-4 py-3 rounded-md text-sm font-medium transition-colors",
                location.pathname === "/book-appointment"
                  ? "bg-accent text-primary"
                  : "hover:bg-accent/50"
              )}
            >
              Book Appointment
            </Link>
            <Link
              to="/how-it-works"
              className={cn(
                "px-4 py-3 rounded-md text-sm font-medium transition-colors",
                location.pathname === "/how-it-works"
                  ? "bg-accent text-primary"
                  : "hover:bg-accent/50"
              )}
            >
              How It Works
            </Link>
            <Link
              to="/departments"
              className={cn(
                "px-4 py-3 rounded-md text-sm font-medium transition-colors",
                location.pathname === "/departments"
                  ? "bg-accent text-primary"
                  : "hover:bg-accent/50"
              )}
            >
              Departments
            </Link>
            <Link
              to="/doctors"
              className={cn(
                "px-4 py-3 rounded-md text-sm font-medium transition-colors",
                location.pathname === "/doctors"
                  ? "bg-accent text-primary"
                  : "hover:bg-accent/50"
              )}
            >
              Doctors
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={cn(
                    "px-4 py-3 rounded-md text-sm font-medium transition-colors",
                    location.pathname === "/dashboard"
                      ? "bg-accent text-primary"
                      : "hover:bg-accent/50"
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  to="/records"
                  className={cn(
                    "px-4 py-3 rounded-md text-sm font-medium transition-colors",
                    location.pathname === "/records"
                      ? "bg-accent text-primary"
                      : "hover:bg-accent/50"
                  )}
                >
                  Medical Records
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin/doctors"
                    className={cn(
                      "px-4 py-3 rounded-md text-sm font-medium transition-colors",
                      location.pathname === "/admin/doctors"
                        ? "bg-accent text-primary"
                        : "hover:bg-accent/50"
                    )}
                  >
                    Manage Doctors
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    to="/admin/statistics"
                    className={cn(
                      "px-4 py-3 rounded-md text-sm font-medium transition-colors",
                      location.pathname === "/admin/statistics"
                        ? "bg-accent text-primary"
                        : "hover:bg-accent/50"
                    )}
                  >
                    System Statistics
                  </Link>
                )}
                {(isAdmin || user?.role === "doctor") && (
                  <Link
                    to="/manage-queue"
                    className={cn(
                      "px-4 py-3 rounded-md text-sm font-medium transition-colors",
                      location.pathname === "/manage-queue"
                        ? "bg-accent text-primary"
                        : "hover:bg-accent/50"
                    )}
                  >
                    Manage Queue
                  </Link>
                )}
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
                <Link to="/sign-in" className="block">
                  <AppButton variant="outline" className="w-full">
                    Sign in
                  </AppButton>
                </Link>
                <Link to="/sign-up" className="block">
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
