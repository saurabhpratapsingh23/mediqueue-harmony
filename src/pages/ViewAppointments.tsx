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
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Edit,
  Trash2,
  Filter,
  Search,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  contact: string;
  email: string;
  address: string;
  notes?: string;
}

const ViewAppointments = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    date: "",
    time: "",
    status: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      fetchAppointments();
    }
  }, [loading, user]);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      let endpoint = "";
      if (user?.role === "doctor") {
        // For doctors, fetch their appointments
        endpoint = `${apiUrl}/api/appointments/doctor/${user.id}`;
      } else if (user?.role === "patient") {
        // For patients, fetch their own appointments
        endpoint = `${apiUrl}/api/appointments/patient/${user.id}`;
      } else if (user?.role === "admin") {
        // For admins, fetch all appointments
        endpoint = `${apiUrl}/api/appointments`;
      } else {
        throw new Error("User role not recognized");
      }

      console.log("Fetching appointments from:", endpoint);

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        let errorMessage = "Failed to fetch appointments";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Error parsing error response:", e);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Received appointments:", data);
      setAppointments(data);
      setFilteredAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch appointments";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter appointments based on status, date, and search query
  useEffect(() => {
    let filtered = [...appointments];

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    // Filter by date
    if (dateFilter !== "all") {
      const today = new Date().toISOString().split("T")[0];
      if (dateFilter === "today") {
        filtered = filtered.filter((apt) => apt.date === today);
      } else if (dateFilter === "tomorrow") {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0];
        filtered = filtered.filter((apt) => apt.date === tomorrowStr);
      } else if (dateFilter === "thisWeek") {
        // Simple implementation - could be more sophisticated
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        filtered = filtered.filter((apt) => {
          const aptDate = new Date(apt.date);
          return aptDate >= today && aptDate <= nextWeek;
        });
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.patientName.toLowerCase().includes(query) ||
          apt.patientId.toLowerCase().includes(query) ||
          apt.type.toLowerCase().includes(query)
      );
    }

    setFilteredAppointments(filtered);
  }, [appointments, statusFilter, dateFilter, searchQuery]);

  // Handle appointment status change
  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      let endpoint = "";
      let method = "PATCH";
      
      if (newStatus === "cancelled") {
        // Using the real API endpoint for cancelling appointments
        endpoint = `${apiUrl}/api/appointments/cancel/${appointmentId}`;
        method = "PUT";
      } else {
        // Using the real API endpoint for updating appointment status
        endpoint = `${apiUrl}/api/appointments/${appointmentId}`;
      }

      console.log(`Updating appointment status to ${newStatus} at:`, endpoint);

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        let errorMessage = `Failed to update appointment status to ${newStatus}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Error parsing error response:", e);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Appointment status updated successfully:", data);

      // Update the local state
      const updatedAppointments = appointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: newStatus as Appointment["status"] } 
          : appointment
      );
      
      setAppointments(updatedAppointments);
      setFilteredAppointments(updatedAppointments);
      
      toast.success(`Appointment marked as ${newStatus}`);
    } catch (err) {
      console.error("Error updating appointment status:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to update appointment status";
      toast.error(errorMessage);
    }
  };

  // Open edit dialog
  const openEditDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setEditFormData({
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      notes: appointment.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  // Handle edit form submission
  const handleEditSubmit = async () => {
    if (!selectedAppointment) return;
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      // Using the real API endpoint for updating appointments
      const endpoint = `${apiUrl}/api/appointments/${selectedAppointment.id}`;
      console.log("Updating appointment at:", endpoint);

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          date: editFormData.date,
          time: editFormData.time,
          status: editFormData.status,
          notes: editFormData.notes,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to update appointment";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Error parsing error response:", e);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Appointment updated successfully:", data);

      // Update the local state
      const updatedAppointments = appointments.map(appointment => 
        appointment.id === selectedAppointment.id 
          ? { 
              ...appointment, 
              date: editFormData.date,
              time: editFormData.time,
              status: editFormData.status as Appointment["status"],
              notes: editFormData.notes,
            } 
          : appointment
      );
      
      setAppointments(updatedAppointments);
      setFilteredAppointments(updatedAppointments);
      setIsEditDialogOpen(false);
      
      toast.success("Appointment updated successfully");
    } catch (err) {
      console.error("Error updating appointment:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to update appointment";
      toast.error(errorMessage);
    }
  };

  // Handle appointment deletion
  const handleDeleteAppointment = async (appointmentId: string) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      // Using the real API endpoint for deleting appointments
      const endpoint = `${apiUrl}/api/appointments/${appointmentId}`;
      console.log("Deleting appointment at:", endpoint);

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        let errorMessage = "Failed to delete appointment";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Error parsing error response:", e);
        }
        throw new Error(errorMessage);
      }

      console.log("Appointment deleted successfully");

      // Update the local state
      const updatedAppointments = appointments.filter(appointment => appointment.id !== appointmentId);
      setAppointments(updatedAppointments);
      setFilteredAppointments(updatedAppointments);
      
      toast.success("Appointment deleted successfully");
    } catch (err) {
      console.error("Error deleting appointment:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to delete appointment";
      toast.error(errorMessage);
    }
  };

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

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 pt-16 md:pt-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 pt-16 md:pt-24 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pt-16 md:pt-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Appointments</h1>
            <p className="text-muted-foreground">View and manage your appointments</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search appointments..."
                className="pl-8 w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="thisWeek">This Week</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no-show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          {/* Upcoming Appointments Tab */}
          <TabsContent value="upcoming" className="space-y-4">
            {filteredAppointments.filter(apt => apt.status === "scheduled").length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No upcoming appointments</h3>
                  <p className="text-muted-foreground">You don't have any scheduled appointments.</p>
                </CardContent>
              </Card>
            ) : (
              filteredAppointments
                .filter(apt => apt.status === "scheduled")
                .map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onStatusChange={handleStatusChange}
                    onEdit={openEditDialog}
                    onDelete={handleDeleteAppointment}
                    getStatusBadgeColor={getStatusBadgeColor}
                    formatDate={formatDate}
                  />
                ))
            )}
          </TabsContent>

          {/* Past Appointments Tab */}
          <TabsContent value="past" className="space-y-4">
            {filteredAppointments.filter(apt => apt.status !== "scheduled").length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No past appointments</h3>
                  <p className="text-muted-foreground">You don't have any past appointments.</p>
                </CardContent>
              </Card>
            ) : (
              filteredAppointments
                .filter(apt => apt.status !== "scheduled")
                .map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onStatusChange={handleStatusChange}
                    onEdit={openEditDialog}
                    onDelete={handleDeleteAppointment}
                    getStatusBadgeColor={getStatusBadgeColor}
                    formatDate={formatDate}
                  />
                ))
            )}
          </TabsContent>

          {/* All Appointments Tab */}
          <TabsContent value="all" className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No appointments found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters.</p>
                </CardContent>
              </Card>
            ) : (
              filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onStatusChange={handleStatusChange}
                  onEdit={openEditDialog}
                  onDelete={handleDeleteAppointment}
                  getStatusBadgeColor={getStatusBadgeColor}
                  formatDate={formatDate}
                />
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Appointment Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Appointment</DialogTitle>
              <DialogDescription>
                Make changes to the appointment details.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editFormData.date}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, date: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={editFormData.time}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, time: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editFormData.status}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no-show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={editFormData.notes}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, notes: e.target.value })
                  }
                  placeholder="Add notes about the appointment"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSubmit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// Appointment Card Component
const AppointmentCard = ({
  appointment,
  onStatusChange,
  onEdit,
  onDelete,
  getStatusBadgeColor,
  formatDate,
}: {
  appointment: Appointment;
  onStatusChange: (id: string, status: string) => void;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
  getStatusBadgeColor: (status: string) => string;
  formatDate: (date: string) => string;
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium">{appointment.patientName}</h3>
                <p className="text-sm text-muted-foreground">ID: {appointment.patientId}</p>
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
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{appointment.type}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{appointment.contact}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{appointment.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{appointment.address}</span>
                </div>
              </div>
            </div>
            
            {appointment.notes && (
              <div className="pt-2 border-t">
                <p className="text-sm font-medium mb-1">Notes:</p>
                <p className="text-sm text-muted-foreground">{appointment.notes}</p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2 md:items-end">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(appointment)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(appointment.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
            
            <div className="flex flex-col gap-1 mt-2">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "text-green-600 hover:text-green-700",
                  appointment.status === "completed" && "bg-green-50"
                )}
                onClick={() => onStatusChange(appointment.id, "completed")}
                disabled={appointment.status === "completed"}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Mark Complete
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "text-red-600 hover:text-red-700",
                  appointment.status === "cancelled" && "bg-red-50"
                )}
                onClick={() => onStatusChange(appointment.id, "cancelled")}
                disabled={appointment.status === "cancelled"}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "text-yellow-600 hover:text-yellow-700",
                  appointment.status === "no-show" && "bg-yellow-50"
                )}
                onClick={() => onStatusChange(appointment.id, "no-show")}
                disabled={appointment.status === "no-show"}
              >
                <AlertCircle className="h-4 w-4 mr-1" />
                Mark No-Show
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ViewAppointments; 