
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Check, Smartphone, File, User } from "lucide-react";

const HowItWorks = () => {
  const navigate = useNavigate();
  
  const steps = [
    {
      title: "Register & Sign In",
      description: "Create an account or sign in to access the MediQ system.",
      icon: <User className="h-10 w-10" />,
    },
    {
      title: "Book an Appointment",
      description: "Choose your preferred department, doctor, date, and time.",
      icon: <Calendar className="h-10 w-10" />,
    },
    {
      title: "Receive Confirmation",
      description: "Get your appointment details and queue number via email or SMS.",
      icon: <Smartphone className="h-10 w-10" />,
    },
    {
      title: "Track Queue Status",
      description: "Monitor your position in the queue in real-time from anywhere.",
      icon: <Clock className="h-10 w-10" />,
    },
    {
      title: "Get Notified",
      description: "Receive notifications when it's almost your turn.",
      icon: <Check className="h-10 w-10" />,
    },
    {
      title: "Digital Records",
      description: "Access your medical records and history online anytime.",
      icon: <File className="h-10 w-10" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold">How MediQ Works</h1>
          <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto">
            MediQ modernizes healthcare queues, saving you time and improving your experience.
          </p>
        </div>
        
        <Tabs defaultValue="patients">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="patients">For Patients</TabsTrigger>
              <TabsTrigger value="doctors">For Doctors</TabsTrigger>
              <TabsTrigger value="facilities">For Facilities</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="patients">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {steps.map((step, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 rounded-full bg-blue-100 p-4 text-primary">
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button size="lg" onClick={() => navigate("/sign-up")}>
                Get Started Now
              </Button>
              <p className="mt-2 text-sm text-muted-foreground">
                Join thousands of patients already using MediQ
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="doctors">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-medium mb-4">Benefits for Healthcare Providers</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Streamlined patient management with real-time queue updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Reduce no-shows with automated reminders and notifications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Access to digital patient records for better care continuity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>More efficient scheduling and reduced administrative overhead</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <div className="text-center mt-8">
                <Button size="lg" onClick={() => navigate("/sign-up")}>
                  Join as a Doctor
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="facilities">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-medium mb-4">Benefits for Healthcare Facilities</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Improve patient satisfaction with reduced wait times</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Analytics and reporting to optimize resource allocation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Streamlined operations with integrated appointment systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Customizable to fit your facility's specific needs</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <div className="text-center mt-8">
                <Button size="lg" onClick={() => navigate("/contact")}>
                  Contact for Facility Integration
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="text-center bg-blue-50 rounded-lg p-8 mt-12">
          <h2 className="text-2xl font-bold mb-4">Ready to experience MediQ?</h2>
          <p className="text-lg mb-6">Join thousands of users who have already transformed their healthcare experience</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={() => navigate("/book-appointment")}>
              Book Appointment Now
            </Button>
            <Button variant="outline" onClick={() => navigate("/sign-up")}>
              Create Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
