import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Plus, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for patient appointments
const mockAppointments = [
  {
    id: "apt1",
    doctorName: "Dr. Sarah Johnson",
    department: "Cardiology",
    date: "2023-05-15",
    time: "09:00 AM",
    status: "scheduled",
    type: "Regular Checkup",
  },
  {
    id: "apt2",
    doctorName: "Dr. Michael Brown",
    department: "Dermatology",
    date: "2023-05-20",
    time: "10:30 AM",
    status: "scheduled",
    type: "Follow-up",
  },
  {
    id: "apt3",
    doctorName: "Dr. Emily Davis",
    department: "General Medicine",
    date: "2023-04-28",
    time: "02:00 PM",
    status: "completed",
    type: "Consultation",
  },
  {
    id: "apt4",
    doctorName: "Dr. Robert Wilson",
    department: "Orthopedics",
    date: "2023-04-15",
    time: "11:00 AM",
    status: "cancelled",
    type: "Follow-up",
  },
];

// Mock data for medical records
const mockMedicalRecords = [
  {
    id: "rec1",
    date: "2023-04-28",
    doctorName: "Dr. Emily Davis",
    department: "General Medicine",
    diagnosis: "Upper respiratory infection",
    prescription: "Amoxicillin 500mg, 3 times daily for 7 days",
    notes: "Follow-up in 2 weeks if symptoms persist",
  },
  {
    id: "rec2",
    date: "2023-03-15",
    doctorName: "Dr. Sarah Johnson",
    department: "Cardiology",
    diagnosis: "Hypertension",
    prescription: "Lisinopril 10mg, once daily",
    notes: "Blood pressure check in 1 month",
  },
  {
    id: "rec3",
    date: "2023-02-10",
    doctorName: "Dr. Michael Brown",
    department: "Dermatology",
    diagnosis: "Eczema",
    prescription: "Hydrocortisone cream, apply twice daily",
    notes: "Avoid triggers and moisturize regularly",
  },
];

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState(mockAppointments);
  const [medicalRecords, setMedicalRecords] = useState(mockMedicalRecords);

  // Redirect if not a patient
  useEffect(() => {
    if (user && user.role !== "patient") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      case "no-show":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pt-16 md:pt-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Patient Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.email}</p>
          </div>
          <Button onClick={() => navigate("/book-appointment")}>
            <Plus className="h-4 w-4 mr-2" />
            Book New Appointment
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming Appointments</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {appointments.filter(apt => apt.status === "scheduled").length}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Medical Records</p>
                  <h3 className="text-2xl font-bold mt-1">{medicalRecords.length}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Next Appointment</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {appointments.filter(apt => apt.status === "scheduled").length > 0 
                      ? new Date(appointments.filter(apt => apt.status === "scheduled")[0].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                      : "None"}
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4">
            {appointments.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No appointments found</h3>
                  <p className="text-muted-foreground">You don't have any appointments scheduled.</p>
                  <Button className="mt-4" onClick={() => navigate("/book-appointment")}>
                    Book an Appointment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              appointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-medium">{appointment.doctorName}</h3>
                            <p className="text-sm text-muted-foreground">{appointment.department}</p>
                          </div>
                          <Badge className={cn("capitalize", getStatusBadgeColor(appointment.status))}>
                            {appointment.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{formatDate(appointment.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{appointment.time}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{appointment.type}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {appointment.status === "scheduled" && (
                        <div className="flex flex-col gap-2 md:items-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setAppointments(
                                appointments.map((apt) =>
                                  apt.id === appointment.id ? { ...apt, status: "cancelled" } : apt
                                )
                              );
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel Appointment
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Medical Records Tab */}
          <TabsContent value="records" className="space-y-4">
            {medicalRecords.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No medical records found</h3>
                  <p className="text-muted-foreground">You don't have any medical records yet.</p>
                </CardContent>
              </Card>
            ) : (
              medicalRecords.map((record) => (
                <Card key={record.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-medium">{record.doctorName}</h3>
                            <p className="text-sm text-muted-foreground">{record.department}</p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(record.date)}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium">Diagnosis:</p>
                            <p className="text-sm">{record.diagnosis}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium">Prescription:</p>
                            <p className="text-sm">{record.prescription}</p>
                          </div>
                          
                          {record.notes && (
                            <div>
                              <p className="text-sm font-medium">Notes:</p>
                              <p className="text-sm">{record.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientDashboard; 