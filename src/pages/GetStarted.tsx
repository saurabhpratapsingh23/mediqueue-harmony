
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppCard } from "@/components/ui/AppCard";
import { Calendar, Clock, User, Users, Hospital } from "lucide-react";

const GetStarted = () => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState<string | null>(null);
  
  const cards = [
    {
      id: "patient",
      title: "I'm a Patient",
      description: "Book appointments, check queue status, and manage your medical records.",
      icon: <User className="h-12 w-12" />,
      action: () => navigate("/sign-up")
    },
    {
      id: "doctor",
      title: "I'm a Doctor",
      description: "Manage your schedule, patient queue, and access patient records.",
      icon: <Users className="h-12 w-12" />,
      action: () => navigate("/sign-up")
    },
    {
      id: "facility",
      title: "I represent a Healthcare Facility",
      description: "Integrate MediQ with your facility's systems for better patient management.",
      icon: <Hospital className="h-12 w-12" />,
      action: () => navigate("/contact")
    }
  ];
  
  const features = [
    {
      title: "Online Appointment Booking",
      description: "Book appointments with your preferred doctors at your convenience, 24/7.",
      icon: <Calendar className="h-8 w-8" />,
      path: "/book-appointment"
    },
    {
      title: "Real-time Queue Status",
      description: "Check your position in the queue and estimated waiting time, from anywhere.",
      icon: <Clock className="h-8 w-8" />,
      path: "/check-queue"
    },
    {
      title: "Digital Medical Records",
      description: "Access your complete medical history, test results, and prescriptions online.",
      icon: <User className="h-8 w-8" />,
      path: "/records"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Get Started with MediQ</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Choose how you'd like to use MediQ and get started in minutes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <AppCard
              key={card.id}
              variant={activeCard === card.id ? "glass" : "outline"}
              hover="lift"
              className={`cursor-pointer ${activeCard === card.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setActiveCard(card.id)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div className="mb-4 rounded-full bg-blue-100 p-4 text-primary">
                  {card.icon}
                </div>
                <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
                <p className="text-muted-foreground mb-6 flex-grow">{card.description}</p>
                <Button onClick={card.action} className="w-full">
                  Get Started
                </Button>
              </CardContent>
            </AppCard>
          ))}
        </div>
        
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-center">Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center p-4">
                  <div className="mb-4 rounded-full bg-blue-100 p-4 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <Button variant="outline" onClick={() => navigate(feature.path)}>
                    Try it Now
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Ready to transform your healthcare experience?</h2>
            <p className="text-lg text-muted-foreground mt-2">Join thousands of satisfied users today</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/sign-up")}>
              Create an Account
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/how-it-works")}>
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
