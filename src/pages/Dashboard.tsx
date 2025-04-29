import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppCard } from "@/components/ui/AppCard";
import { Clock, Calendar, FileText, Users, List, Hospital, LayoutDashboard } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
  }, [user, navigate]);

  if (!user) return null;

  const patientActions = [
    { title: "Patient Dashboard", icon: <LayoutDashboard className="h-6 w-6" />, url: "/patient-dashboard" },
    { title: "Book Appointment", icon: <Calendar className="h-6 w-6" />, url: "/book-appointment" },
    { title: "Check Queue Status", icon: <List className="h-6 w-6" />, url: "/check-queue" },
    { title: "View Records", icon: <FileText className="h-6 w-6" />, url: "/records" },
    { title: "View All Departments", icon: <Hospital className="h-6 w-6" />, url: "/departments" },
    { title: "View All Doctors", icon: <Users className="h-6 w-6" />, url: "/doctors" },
  ];

  const doctorActions = [
    { title: "View Appointments", icon: <Calendar className="h-6 w-6" />, url: "/doctor/appointments" },
    { title: "Manage Queue", icon: <Clock className="h-6 w-6" />, url: "/manage-queue" },
    { title: "Patient Records", icon: <FileText className="h-6 w-6" />, url: "/patient-records" },
  ];

  const adminActions = [
    { title: "Manage Departments", icon: <Hospital className="h-6 w-6" />, url: "/admin/departments" },
    { title: "Manage Doctors", icon: <Users className="h-6 w-6" />, url: "/admin/doctors" },
    { title: "System Statistics", icon: <FileText className="h-6 w-6" />, url: "/admin/statistics" },
  ];

  const actions = 
    user.role === "patient" ? patientActions : 
    user.role === "doctor" ? doctorActions : adminActions;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pt-16 md:pt-24">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Welcome, {user.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Welcome to your MediQ {user.role} dashboard. Use the options below to navigate.
          </p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <AppCard
            key={action.title}
            className="cursor-pointer"
            variant="glass"
            hover="lift"
            onClick={() => navigate(action.url)}
          >
            <div className="flex flex-col items-center p-6">
              <div className="mb-4 rounded-full bg-blue-100 p-3 text-primary">
                {action.icon}
              </div>
              <h3 className="text-lg font-medium">{action.title}</h3>
            </div>
          </AppCard>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
