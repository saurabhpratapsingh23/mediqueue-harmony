
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle, Clock, Calendar, Bell, Heart, Shield, ChevronRight } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { Badge } from "@/components/ui/badge"; 
import { mockApi, Department, Doctor } from "@/lib/mockApi";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const LandingPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deptData = await mockApi.getDepartments();
        setDepartments(deptData);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoadingDepartments(false);
      }

      try {
        const doctorsData = await mockApi.getDoctors();
        setDoctors(doctorsData.slice(0, 4)); // Just get top 4 doctors
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col space-y-6 animate-slide-up" style={{ "--index": 0 } as any}>
              <Badge variant="secondary" className="w-fit bg-mediq-100 text-mediq-800">
                Smart Healthcare Queue Management
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance tracking-tight">
                <span className="text-mediq-600">Revolutionizing</span> the way you experience healthcare
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                MediQ streamlines patient flow, reduces wait times, and enhances 
                the healthcare experience through intelligent queue management and predictive wait times.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <Link to="/book-appointment">
                  <AppButton size="xl" className="w-full sm:w-auto">
                    Book an Appointment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </AppButton>
                </Link>
                <Link to="/queue-status">
                  <AppButton variant="outline" size="xl" className="w-full sm:w-auto">
                    Check Queue Status
                  </AppButton>
                </Link>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Link to="/how-it-works" className="flex items-center hover:text-mediq-600">
                  <PlayCircle className="h-5 w-5 text-mediq-600" />
                  <span className="text-sm font-medium ml-2">
                    Watch how it works
                  </span>
                </Link>
              </div>
            </div>
            <div className="lg:ml-auto relative animate-slide-up" style={{ "--index": 1 } as any}>
              <div className="relative rounded-2xl overflow-hidden shadow-elevated">
                <img 
                  src="https://images.unsplash.com/photo-1638202993928-7d113507adb2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
                  alt="MediQ Healthcare" 
                  className="w-full h-auto object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
              </div>
              
              {/* Floating cards */}
              <div className="absolute -left-16 top-14 animate-slide-up" style={{ "--index": 2 } as any}>
                <AppCard variant="glass" padding="sm" className="shadow-elevated w-52">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-mediq-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-mediq-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Current wait time</p>
                      <p className="text-lg font-semibold">~15 minutes</p>
                    </div>
                  </div>
                </AppCard>
              </div>
              
              <div className="absolute -right-10 bottom-20 animate-slide-up" style={{ "--index": 3 } as any}>
                <AppCard variant="glass" padding="sm" className="shadow-elevated w-52">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Next available</p>
                      <p className="text-lg font-semibold">Today, 2PM</p>
                    </div>
                  </div>
                </AppCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <Badge variant="secondary" className="mb-4 bg-mediq-100 text-mediq-800">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience the MediQ difference</h2>
            <p className="text-muted-foreground">
              Our innovative features combine to create a seamless healthcare experience, 
              putting you in control of your time and care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AppCard 
              variant="glass" 
              hover="subtle" 
              className="flex flex-col animate-slide-up" 
              style={{ "--index": 0 } as any}
            >
              <div className="h-12 w-12 rounded-full bg-mediq-100 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-mediq-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Wait Times</h3>
              <p className="text-muted-foreground flex-1">
                Know exactly how long you'll wait before you arrive, with continuously updated estimates.
              </p>
              <div className="mt-4 pt-4 border-t">
                <Link to="/queue-status" className="text-mediq-600 hover:text-mediq-700 text-sm font-medium inline-flex items-center">
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </AppCard>
            
            <AppCard 
              variant="glass" 
              hover="subtle" 
              className="flex flex-col animate-slide-up" 
              style={{ "--index": 1 } as any}
            >
              <div className="h-12 w-12 rounded-full bg-mediq-100 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-mediq-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Simplified Scheduling</h3>
              <p className="text-muted-foreground flex-1">
                Book appointments in seconds with our intuitive system that matches you with the right specialist.
              </p>
              <div className="mt-4 pt-4 border-t">
                <Link to="/book-appointment" className="text-mediq-600 hover:text-mediq-700 text-sm font-medium inline-flex items-center">
                  Book now
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </AppCard>
            
            <AppCard 
              variant="glass" 
              hover="subtle" 
              className="flex flex-col animate-slide-up" 
              style={{ "--index": 2 } as any}
            >
              <div className="h-12 w-12 rounded-full bg-mediq-100 flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-mediq-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Notifications</h3>
              <p className="text-muted-foreground flex-1">
                Receive timely updates about your queue position, so you can arrive just when you're needed.
              </p>
              <div className="mt-4 pt-4 border-t">
                <Link to="/sign-up" className="text-mediq-600 hover:text-mediq-700 text-sm font-medium inline-flex items-center">
                  Sign up
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </AppCard>
            
            <AppCard 
              variant="glass" 
              hover="subtle" 
              className="flex flex-col animate-slide-up" 
              style={{ "--index": 3 } as any}
            >
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Intelligent Triage</h3>
              <p className="text-muted-foreground flex-1">
                Our AI-powered symptom assessment helps prioritize cases based on urgency.
              </p>
              <div className="mt-4 pt-4 border-t">
                <Link to="/book-appointment" className="text-green-600 hover:text-green-700 text-sm font-medium inline-flex items-center">
                  Try it now
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </AppCard>
            
            <AppCard 
              variant="glass" 
              hover="subtle" 
              className="flex flex-col animate-slide-up" 
              style={{ "--index": 4 } as any}
            >
              <div className="h-12 w-12 rounded-full bg-mediq-100 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-mediq-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Medical Records</h3>
              <p className="text-muted-foreground flex-1">
                Access your complete medical history securely, anytime you need it.
              </p>
              <div className="mt-4 pt-4 border-t">
                <Link to="/records" className="text-mediq-600 hover:text-mediq-700 text-sm font-medium inline-flex items-center">
                  View records
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </AppCard>
            
            <AppCard 
              variant="glass" 
              hover="subtle" 
              className="flex flex-col animate-slide-up" 
              style={{ "--index": 5 } as any}
            >
              <div className="h-12 w-12 rounded-full bg-mediq-100 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-mediq-600"
                >
                  <path d="M12 8V8.5" />
                  <path d="M12 12v4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Virtual Check-in</h3>
              <p className="text-muted-foreground flex-1">
                Skip the line with our contactless digital check-in process from your mobile device.
              </p>
              <div className="mt-4 pt-4 border-t">
                <Link to="/sign-up" className="text-mediq-600 hover:text-mediq-700 text-sm font-medium inline-flex items-center">
                  Get started
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </AppCard>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <Badge variant="secondary" className="mb-4 bg-mediq-100 text-mediq-800">Specialties</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our medical departments</h2>
            <p className="text-muted-foreground">
              MediQ provides queue management solutions across all major medical specialties, 
              ensuring every patient receives timely, specialized care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingDepartments ? (
              // Skeleton loader for departments
              Array.from({ length: 6 }).map((_, index) => (
                <div 
                  key={`dept-skeleton-${index}`} 
                  className="rounded-xl bg-gray-100 animate-pulse h-36"
                ></div>
              ))
            ) : (
              departments.map((department, index) => (
                <Link 
                  key={department.id} 
                  to={`/book-appointment?department=${department.id}`}
                  className="group"
                >
                  <AppCard 
                    variant="glass" 
                    padding="md" 
                    hover="subtle"
                    className="h-full transition-all duration-300 animate-slide-up"
                    style={{ "--index": index } as any}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="h-12 w-12 rounded-full bg-mediq-100 flex items-center justify-center flex-shrink-0">
                        <div className="text-mediq-600">
                          {/* Use a simple letter if no specific icon available */}
                          {department.icon === "heart" ? (
                            <Heart className="h-6 w-6" />
                          ) : department.icon === "bone" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-6 w-6"
                            >
                              <path d="M18 3a.5.5 0 0 0-.5-.5H16a3.5 3.5 0 0 0-3.17 5" />
                              <path d="M9.17 7.5a3.5 3.5 0 0 0-3.17-5H4.5A.5.5 0 0 0 4 3v7" />
                              <path d="M18 21a.5.5 0 0 1-.5.5H16a3.5 3.5 0 0 1-3.17-5" />
                              <path d="M9.17 16.5a3.5 3.5 0 0 1-3.17 5H4.5a.5.5 0 0 1-.5-.5v-7" />
                              <path d="M18 10v4" />
                              <path d="M4 10v4" />
                              <path d="M13.5 12.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
                            </svg>
                          ) : department.icon === "brain" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-6 w-6"
                            >
                              <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5" />
                              <path d="M15.7 10.4a1 1 0 1 0-1.4-1.4" />
                              <path d="M13.1 7.9a1 1 0 1 0-1.4-1.4" />
                              <path d="M13.1 15.5a1 1 0 1 0 1.4 1.4" />
                              <path d="m10.5 13.1 1.4 1.4" />
                            </svg>
                          ) : department.icon === "eye" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-6 w-6"
                            >
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          ) : department.icon === "baby" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-6 w-6"
                            >
                              <path d="M9 12h.01" />
                              <path d="M15 12h.01" />
                              <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" />
                              <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-6 w-6"
                            >
                              <rect width="14" height="20" x="5" y="2" rx="2" />
                              <path d="M15 2v4" />
                              <path d="M9 2v4" />
                              <path d="M9 14h6" />
                              <path d="M12 11v6" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold group-hover:text-mediq-600 transition-colors">
                          {department.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {department.description}
                        </p>
                      </div>
                    </div>
                  </AppCard>
                </Link>
              ))
            )}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/departments">
              <AppButton variant="outline">
                View All Departments
                <ArrowRight className="ml-2 h-4 w-4" />
              </AppButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <Badge variant="secondary" className="mb-4 bg-mediq-100 text-mediq-800">Our Team</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet our specialists</h2>
            <p className="text-muted-foreground">
              Our team of experienced healthcare professionals is dedicated to 
              providing you with the highest quality care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingDoctors ? (
              // Skeleton loader for doctors
              Array.from({ length: 4 }).map((_, index) => (
                <div 
                  key={`doctor-skeleton-${index}`} 
                  className="rounded-xl bg-gray-100 animate-pulse h-72"
                ></div>
              ))
            ) : (
              doctors.map((doctor, index) => (
                <AppCard 
                  key={doctor.id} 
                  variant="glass" 
                  padding="none" 
                  hover="subtle"
                  className="overflow-hidden animate-slide-up"
                  style={{ "--index": index } as any}
                >
                  <div className="aspect-[3/4] relative">
                    <img 
                      src={doctor.avatar} 
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <p className="text-sm font-medium opacity-90">{doctor.specialization}</p>
                      <h3 className="text-xl font-semibold">{doctor.name}</h3>
                      <div className="flex items-center mt-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < Math.floor(doctor.rating) ? "text-yellow-400" : "text-gray-400"
                              )}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm">{doctor.rating.toFixed(1)}</span>
                      </div>
                      <Link to={`/book-appointment?doctor=${doctor.id}`}>
                        <AppButton 
                          variant="glass" 
                          size="sm" 
                          className="mt-4 w-full bg-white/20 hover:bg-white/30"
                        >
                          Book Appointment
                        </AppButton>
                      </Link>
                    </div>
                  </div>
                </AppCard>
              ))
            )}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/doctors">
              <AppButton variant="outline">
                View All Doctors
                <ArrowRight className="ml-2 h-4 w-4" />
              </AppButton>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <AppCard 
            variant="glass" 
            padding="lg" 
            className="bg-gradient-to-r from-mediq-50 to-mediq-100 border-none relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path fill="#4070FF" d="M44.9,-76.8C59.7,-70.3,74.4,-61.4,81.4,-48.1C88.5,-34.7,87.8,-17.4,83.8,-2.3C79.9,12.8,72.7,25.5,65.4,38.5C58.1,51.4,50.7,64.6,39.6,73.1C28.5,81.7,14.2,85.7,-0.4,86.3C-15,87,-30,84.2,-42.3,76.7C-54.5,69.1,-64,56.7,-71.8,43.3C-79.7,29.8,-85.9,14.9,-86,0C-86.1,-14.9,-80.2,-29.8,-71.6,-43.3C-63,-56.8,-51.7,-68.9,-38.5,-76.3C-25.3,-83.8,-10.1,-86.5,3.3,-92.2C16.8,-97.8,33.5,-106.3,44.9,-76.8Z" transform="translate(100 100)" />
              </svg>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
              <div>
                <Badge variant="outline" className="mb-4 w-fit bg-white/40 backdrop-blur-sm">
                  Ready to get started?
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Experience healthcare without the wait
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  Join thousands of patients who have transformed their healthcare experience with MediQ. 
                  Book your appointment today and say goodbye to long wait times.
                </p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link to="/sign-up">
                    <AppButton size="lg">
                      Create Account
                    </AppButton>
                  </Link>
                  <Link to="/book-appointment">
                    <AppButton variant="outline" size="lg">
                      Book Without Account
                    </AppButton>
                  </Link>
                </div>
              </div>
              
              <div className="relative">
                <div className="rounded-xl overflow-hidden shadow-elevated">
                  <img 
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80" 
                    alt="Patient using MediQ app" 
                    className="w-full h-auto object-cover"
                  />
                </div>
                
                {/* Floating card */}
                <div className="absolute -left-8 -bottom-8">
                  <AppCard variant="glass" padding="sm" className="shadow-elevated w-44">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Bell className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-xs text-center mt-2">Your appointment is in 10 minutes</p>
                    </div>
                  </AppCard>
                </div>
              </div>
            </div>
          </AppCard>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
