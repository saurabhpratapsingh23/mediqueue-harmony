import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO, isToday, isPast } from "date-fns";
import { Calendar, Clock, Users, Stethoscope, AlertCircle, CheckCircle, XCircle, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { mockApi, MockAppointment } from "@/lib/mockAppointmentService";

// Mock doctor data - in a real app, this would come from authentication
const MOCK_DOCTOR = {
  id: "doctor123",
  name: "Dr. Sarah Thompson",
  department: "Cardiology",
  specialization: "Cardiologist",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg"
};

interface DoctorAppointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  timeSlotId: string;
  startTime: string;
  endTime: string;
  symptoms: string;
  urgency: "LOW" | "MEDIUM" | "HIGH";
  status: "waiting" | "in-progress" | "completed" | "cancelled";
  queueNumber: number;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientHistory: string[];
}

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointment | null>(null);
  const [activeTab, setActiveTab] = useState("today");

  // Fetch doctor's appointments
  useEffect(() => {
    const fetchDoctorAppointments = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call to get doctor's appointments
        // For now, we'll filter the mock appointments
        const allAppointments = await mockApi.getAllAppointments();
        
        // Filter appointments for this doctor
        const doctorAppointments = allAppointments
          .filter(apt => apt.doctorId === MOCK_DOCTOR.id)
          .map(apt => {
            // Add mock patient data
            return {
              id: apt.id,
              patientId: apt.patientId,
              doctorId: apt.doctorId,
              doctorName: apt.doctorName,
              department: apt.department,
              date: apt.date,
              timeSlotId: apt.timeSlotId,
              startTime: apt.startTime,
              endTime: apt.endTime,
              symptoms: apt.symptoms,
              urgency: apt.urgency as "LOW" | "MEDIUM" | "HIGH",
              status: apt.status === "SCHEDULED" ? "waiting" : 
                      apt.status === "IN_PROGRESS" ? "in-progress" : 
                      apt.status === "COMPLETED" ? "completed" : "cancelled" as "waiting" | "in-progress" | "completed" | "cancelled",
              queueNumber: apt.queueNumber,
              patientName: apt.patientName || "Patient",
              patientAge: Math.floor(Math.random() * 50) + 20,
              patientGender: Math.random() > 0.5 ? "Male" : "Female",
              patientHistory: [
                "Hypertension (2020)",
                "Type 2 Diabetes (2019)",
                "Appendectomy (2015)"
              ]
            };
          });
        
        setAppointments(doctorAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorAppointments();
  }, []);

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter(apt => {
    const appointmentDate = parseISO(apt.date);
    
    if (activeTab === "today") {
      return isToday(appointmentDate);
    } else if (activeTab === "upcoming") {
      return !isToday(appointmentDate) && !isPast(appointmentDate);
    } else if (activeTab === "past") {
      return isPast(appointmentDate);
    }
    
    return true;
  });

  // Handle appointment status change
  const handleStatusChange = async (appointmentId: string, newStatus: "waiting" | "in-progress" | "completed") => {
    try {
      // In a real app, this would be an API call
      // For now, we'll update the local state
      setAppointments(prevAppointments => 
        prevAppointments.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: newStatus } 
            : apt
        )
      );
      
      // Update the selected appointment if it's the one being changed
      if (selectedAppointment?.id === appointmentId) {
        setSelectedAppointment(prev => 
          prev ? { ...prev, status: newStatus } : null
        );
      }
      
      toast.success(`Appointment marked as ${newStatus}`);
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Failed to update appointment status");
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "waiting":
        return <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200">Waiting</Badge>;
      case "in-progress":
        return <Badge variant="default" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return null;
    }
  };

  // Get urgency badge
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'HIGH':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><AlertCircle className="w-3 h-3 mr-1" /> High</Badge>;
      case 'MEDIUM':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><AlertCircle className="w-3 h-3 mr-1" /> Medium</Badge>;
      case 'LOW':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><AlertCircle className="w-3 h-3 mr-1" /> Low</Badge>;
      default:
        return <Badge variant="outline">{urgency}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
            <Button onClick={() => navigate("/doctor-profile")}>
              My Profile
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {MOCK_DOCTOR.name}</CardTitle>
              <CardDescription>{MOCK_DOCTOR.specialization} - {MOCK_DOCTOR.department}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-700">Today's Appointments</h3>
                  <p className="text-2xl font-bold text-blue-800">
                    {appointments.filter(apt => isToday(parseISO(apt.date))).length}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-700">Completed This Week</h3>
                  <p className="text-2xl font-bold text-green-800">
                    {appointments.filter(apt => 
                      apt.status === "completed" && 
                      parseISO(apt.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ).length}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-medium text-yellow-700">Waiting Patients</h3>
                  <p className="text-2xl font-bold text-yellow-800">
                    {appointments.filter(apt => 
                      isToday(parseISO(apt.date)) && apt.status === "waiting"
                    ).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="today" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            
            <TabsContent value="today" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>Manage your appointments for today</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="py-8 text-center">
                      <p>Loading appointments...</p>
                    </div>
                  ) : filteredAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {filteredAppointments.map((appointment) => (
                        <div 
                          key={appointment.id} 
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedAppointment?.id === appointment.id 
                              ? "border-blue-500 bg-blue-50" 
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={`https://randomuser.me/api/portraits/${appointment.patientGender.toLowerCase() === 'male' ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`} />
                                <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{appointment.patientName}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.patientAge} years • {appointment.patientGender}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              {getStatusBadge(appointment.status)}
                              <div className="mt-1 text-sm text-muted-foreground">
                                Queue #{appointment.queueNumber}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{appointment.startTime} - {appointment.endTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-muted-foreground" />
                              <span>Urgency: {getUrgencyBadge(appointment.urgency)}</span>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <p className="text-sm font-medium">Symptoms:</p>
                            <p className="text-sm text-muted-foreground">{appointment.symptoms}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p>No appointments scheduled for today.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="upcoming" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>View your future appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="py-8 text-center">
                      <p>Loading appointments...</p>
                    </div>
                  ) : filteredAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {filteredAppointments.map((appointment) => (
                        <div 
                          key={appointment.id} 
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedAppointment?.id === appointment.id 
                              ? "border-blue-500 bg-blue-50" 
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={`https://randomuser.me/api/portraits/${appointment.patientGender.toLowerCase() === 'male' ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`} />
                                <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{appointment.patientName}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.patientAge} years • {appointment.patientGender}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              {getStatusBadge(appointment.status)}
                              <div className="mt-1 text-sm text-muted-foreground">
                                Queue #{appointment.queueNumber}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{format(parseISO(appointment.date), 'EEEE, MMMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{appointment.startTime} - {appointment.endTime}</span>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <p className="text-sm font-medium">Symptoms:</p>
                            <p className="text-sm text-muted-foreground">{appointment.symptoms}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p>No upcoming appointments scheduled.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="past" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Past Appointments</CardTitle>
                  <CardDescription>View your past appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="py-8 text-center">
                      <p>Loading appointments...</p>
                    </div>
                  ) : filteredAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {filteredAppointments.map((appointment) => (
                        <div 
                          key={appointment.id} 
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedAppointment?.id === appointment.id 
                              ? "border-blue-500 bg-blue-50" 
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={`https://randomuser.me/api/portraits/${appointment.patientGender.toLowerCase() === 'male' ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`} />
                                <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{appointment.patientName}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.patientAge} years • {appointment.patientGender}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              {getStatusBadge(appointment.status)}
                              <div className="mt-1 text-sm text-muted-foreground">
                                Queue #{appointment.queueNumber}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{format(parseISO(appointment.date), 'EEEE, MMMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{appointment.startTime} - {appointment.endTime}</span>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <p className="text-sm font-medium">Symptoms:</p>
                            <p className="text-sm text-muted-foreground">{appointment.symptoms}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p>No past appointments found.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Patient Details Sidebar */}
        {selectedAppointment && (
          <div className="w-full md:w-80 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://randomuser.me/api/portraits/${selectedAppointment.patientGender.toLowerCase() === 'male' ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`} />
                    <AvatarFallback>{selectedAppointment.patientName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedAppointment.patientName}</CardTitle>
                    <CardDescription>
                      {selectedAppointment.patientAge} years • {selectedAppointment.patientGender}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Appointment Details</h3>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{format(parseISO(selectedAppointment.date), 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span>{selectedAppointment.startTime} - {selectedAppointment.endTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Queue #:</span>
                      <span>{selectedAppointment.queueNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      {getStatusBadge(selectedAppointment.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Urgency:</span>
                      {getUrgencyBadge(selectedAppointment.urgency)}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium">Symptoms</h3>
                  <p className="mt-2 text-sm">{selectedAppointment.symptoms}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium">Medical History</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    {selectedAppointment.patientHistory.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-muted-foreground">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                {selectedAppointment.status === "waiting" && (
                  <Button 
                    className="w-full" 
                    onClick={() => handleStatusChange(selectedAppointment.id, "in-progress")}
                  >
                    <Stethoscope className="mr-2 h-4 w-4" />
                    Start Consultation
                  </Button>
                )}
                
                {selectedAppointment.status === "in-progress" && (
                  <Button 
                    className="w-full" 
                    onClick={() => handleStatusChange(selectedAppointment.id, "completed")}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete Consultation
                  </Button>
                )}
                
                <div className="flex gap-2 w-full">
                  <Button variant="outline" className="flex-1">
                    <FileText className="mr-2 h-4 w-4" />
                    Notes
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
      <Button variant="outline" onClick={() => navigate("/view-appointments")}>
        <Calendar className="mr-2 h-4 w-4" />
        View All Appointments
      </Button>
    </div>
  );
};

export default DoctorDashboard; 