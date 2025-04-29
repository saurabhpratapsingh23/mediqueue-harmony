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
          {user?.role !== "doctor" && (
            <>
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
                to="/departments"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === "/departments" ? "text-primary" : "text-foreground/80"
                )}
              >
                Departments
              </Link>
            </>
          )}
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
                    {user?.role === "doctor" && (
                      <Link
                        to="/patient-records"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Patient Records
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

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <Link
              to="/landing"
              className="flex items-center space-x-2 text-foreground font-semibold text-xl"
            >
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
                M
              </div>
              <span>MediQ</span>
            </Link>
            <button
              className="p-2 rounded-md hover:bg-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              <Link
                to="/landing"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Home
              </Link>
              {user?.role !== "doctor" && (
                <>
                  <Link
                    to="/queue-status"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Queue Status
                  </Link>
                  <Link
                    to="/book-appointment"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Book Appointment
                  </Link>
                  <Link
                    to="/departments"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Departments
                  </Link>
                </>
              )}
              <Link
                to="/how-it-works"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                How It Works
              </Link>
              <Link
                to="/doctors"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Doctors
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
