import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Filter,
  Search
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
import { QueuePatient, mockQueuePatients } from "@/lib/mockApi";

const ManageQueue = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [queuePatients, setQueuePatients] = useState<QueuePatient[]>(mockQueuePatients);
  const [filteredPatients, setFilteredPatients] = useState<QueuePatient[]>(mockQueuePatients);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<QueuePatient | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    priority: "",
    status: "",
    doctorId: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    // Check if user is doctor or admin
    if (user && user.role !== "doctor" && user.role !== "admin") {
      toast.error("Access denied. This page is for doctors and admins only.");
      navigate("/dashboard");
      return;
    }

    // In a real app, this would be an API call
    // For now, we'll use the mock data directly
    setQueuePatients(mockQueuePatients);
    setFilteredPatients(mockQueuePatients);
  }, [user, loading, navigate]);

  // Filter patients based on status, department, priority, and search query
  useEffect(() => {
    console.log("Filtering patients:", {
      statusFilter,
      departmentFilter,
      priorityFilter,
      searchQuery,
      queuePatients
    });
    
    let filtered = [...queuePatients];

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((patient) => patient.status === statusFilter);
    }

    // Filter by department
    if (departmentFilter !== "all") {
      filtered = filtered.filter((patient) => patient.department === departmentFilter);
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter((patient) => patient.priority === priorityFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (patient) =>
          patient.patientName.toLowerCase().includes(query) ||
          patient.patientId.toLowerCase().includes(query) ||
          patient.department.toLowerCase().includes(query)
      );
    }

    console.log("Filtered patients:", filtered);
    setFilteredPatients(filtered);
  }, [queuePatients, statusFilter, departmentFilter, priorityFilter, searchQuery]);

  // Handle patient status change
  const handleStatusChange = (patientId: string, newStatus: string) => {
    setQueuePatients(
      queuePatients.map((patient) =>
        patient.id === patientId ? { ...patient, status: newStatus as "waiting" | "in-progress" | "completed" | "cancelled" } : patient
      )
    );
    toast.success(`Patient status updated to ${newStatus}`);
  };

  // Handle priority change
  const handlePriorityChange = (patientId: string, newPriority: string) => {
    setQueuePatients(
      queuePatients.map((patient) =>
        patient.id === patientId ? { ...patient, priority: newPriority as "high" | "medium" | "low" } : patient
      )
    );
    toast.success(`Patient priority updated to ${newPriority}`);
  };

  // Open edit dialog
  const openEditDialog = (patient: QueuePatient) => {
    setSelectedPatient(patient);
    setEditFormData({
      priority: patient.priority,
      status: patient.status,
      doctorId: patient.doctorId || "",
      notes: patient.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  // Handle edit form submission
  const handleEditSubmit = () => {
    if (!selectedPatient) return;

    setQueuePatients(
      queuePatients.map((patient) =>
        patient.id === selectedPatient.id
          ? {
              ...patient,
              priority: editFormData.priority as "high" | "medium" | "low",
              status: editFormData.status as "waiting" | "in-progress" | "completed" | "cancelled",
              doctorId: editFormData.doctorId,
              notes: editFormData.notes,
            }
          : patient
      )
    );
    setIsEditDialogOpen(false);
    toast.success("Patient information updated successfully");
  };

  // Handle patient removal from queue
  const handleRemovePatient = (patientId: string) => {
    if (window.confirm("Are you sure you want to remove this patient from the queue?")) {
      setQueuePatients(queuePatients.filter((patient) => patient.id !== patientId));
      toast.success("Patient removed from queue");
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-500";
      case "in-progress":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get priority badge color
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate wait time in minutes
  const calculateWaitTime = (arrivalTime: string) => {
    const arrival = new Date(arrivalTime);
    const now = new Date();
    const diffMs = now.getTime() - arrival.getTime();
    return Math.floor(diffMs / 60000); // Convert to minutes
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading queue data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <p className="mt-4 text-destructive">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
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
            <h1 className="text-2xl font-bold">Manage Queue</h1>
            <p className="text-muted-foreground">View and manage the patient queue</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search patients..."
                className="pl-8 w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Cardiology">Cardiology</SelectItem>
                <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                <SelectItem value="Dermatology">Dermatology</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="waiting">Waiting</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="active">Active Queue</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Patients</TabsTrigger>
          </TabsList>

          {/* Active Queue Tab */}
          <TabsContent value="active" className="space-y-4">
            {filteredPatients.filter(patient => patient.status !== "completed" && patient.status !== "cancelled").length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No active patients</h3>
                  <p className="text-muted-foreground">There are no patients currently in the queue.</p>
                </CardContent>
              </Card>
            ) : (
              filteredPatients
                .filter(patient => patient.status !== "completed" && patient.status !== "cancelled")
                .map((patient) => (
                  <QueuePatientCard
                    key={patient.id}
                    patient={patient}
                    onStatusChange={handleStatusChange}
                    onPriorityChange={handlePriorityChange}
                    onEdit={openEditDialog}
                    onRemove={handleRemovePatient}
                    getStatusBadgeColor={getStatusBadgeColor}
                    getPriorityBadgeColor={getPriorityBadgeColor}
                    formatTime={formatTime}
                    calculateWaitTime={calculateWaitTime}
                  />
                ))
            )}
          </TabsContent>

          {/* Completed Tab */}
          <TabsContent value="completed" className="space-y-4">
            {filteredPatients.filter(patient => patient.status === "completed" || patient.status === "cancelled").length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No completed patients</h3>
                  <p className="text-muted-foreground">There are no completed or cancelled patients.</p>
                </CardContent>
              </Card>
            ) : (
              filteredPatients
                .filter(patient => patient.status === "completed" || patient.status === "cancelled")
                .map((patient) => (
                  <QueuePatientCard
                    key={patient.id}
                    patient={patient}
                    onStatusChange={handleStatusChange}
                    onPriorityChange={handlePriorityChange}
                    onEdit={openEditDialog}
                    onRemove={handleRemovePatient}
                    getStatusBadgeColor={getStatusBadgeColor}
                    getPriorityBadgeColor={getPriorityBadgeColor}
                    formatTime={formatTime}
                    calculateWaitTime={calculateWaitTime}
                  />
                ))
            )}
          </TabsContent>

          {/* All Patients Tab */}
          <TabsContent value="all" className="space-y-4">
            {filteredPatients.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No patients found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters.</p>
                </CardContent>
              </Card>
            ) : (
              filteredPatients.map((patient) => (
                <QueuePatientCard
                  key={patient.id}
                  patient={patient}
                  onStatusChange={handleStatusChange}
                  onPriorityChange={handlePriorityChange}
                  onEdit={openEditDialog}
                  onRemove={handleRemovePatient}
                  getStatusBadgeColor={getStatusBadgeColor}
                  getPriorityBadgeColor={getPriorityBadgeColor}
                  formatTime={formatTime}
                  calculateWaitTime={calculateWaitTime}
                />
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Patient Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Patient Information</DialogTitle>
              <DialogDescription>
                Make changes to the patient's queue information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={editFormData.priority}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, priority: value })
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="waiting">Waiting</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor">Assign Doctor</Label>
                <Select
                  value={editFormData.doctorId}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, doctorId: value })
                  }
                >
                  <SelectTrigger id="doctor">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="D101">Dr. Sarah Johnson</SelectItem>
                    <SelectItem value="D102">Dr. Michael Brown</SelectItem>
                    <SelectItem value="D103">Dr. Lisa Davis</SelectItem>
                    <SelectItem value="D104">Dr. Robert Wilson</SelectItem>
                    <SelectItem value="D105">Dr. Jennifer Taylor</SelectItem>
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
                  placeholder="Add notes about the patient"
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

// Queue Patient Card Component
const QueuePatientCard = ({
  patient,
  onStatusChange,
  onPriorityChange,
  onEdit,
  onRemove,
  getStatusBadgeColor,
  getPriorityBadgeColor,
  formatTime,
  calculateWaitTime,
}: {
  patient: QueuePatient;
  onStatusChange: (id: string, status: string) => void;
  onPriorityChange: (id: string, priority: string) => void;
  onEdit: (patient: QueuePatient) => void;
  onRemove: (id: string) => void;
  getStatusBadgeColor: (status: string) => string;
  getPriorityBadgeColor: (priority: string) => string;
  formatTime: (time: string) => string;
  calculateWaitTime: (time: string) => number;
}) => {
  const waitTime = calculateWaitTime(patient.arrivalTime);
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium">{patient.patientName}</h3>
                <p className="text-sm text-muted-foreground">ID: {patient.patientId}</p>
              </div>
              <div className="flex gap-2">
                <Badge className={cn("capitalize", getPriorityBadgeColor(patient.priority))}>
                  {patient.priority}
                </Badge>
                <Badge className={cn("capitalize", getStatusBadgeColor(patient.status))}>
                  {patient.status}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Arrival: {formatTime(patient.arrivalTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Wait Time: {waitTime} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Department: {patient.department}</span>
                </div>
                {patient.doctorName && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Doctor: {patient.doctorName}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{patient.contact}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{patient.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{patient.address}</span>
                </div>
              </div>
            </div>
            
            {patient.notes && (
              <div className="pt-2 border-t">
                <p className="text-sm font-medium mb-1">Notes:</p>
                <p className="text-sm text-muted-foreground">{patient.notes}</p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2 md:items-end">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(patient)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => onRemove(patient.id)}
              >
                Remove
              </Button>
            </div>
            
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "text-red-600 hover:text-red-700",
                    patient.priority === "high" && "bg-red-50"
                  )}
                  onClick={() => onPriorityChange(patient.id, "high")}
                  disabled={patient.priority === "high"}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "text-green-600 hover:text-green-700",
                    patient.priority === "low" && "bg-green-50"
                  )}
                  onClick={() => onPriorityChange(patient.id, "low")}
                  disabled={patient.priority === "low"}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "text-green-600 hover:text-green-700",
                  patient.status === "completed" && "bg-green-50"
                )}
                onClick={() => onStatusChange(patient.id, "completed")}
                disabled={patient.status === "completed"}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Complete
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "text-blue-600 hover:text-blue-700",
                  patient.status === "in-progress" && "bg-blue-50"
                )}
                onClick={() => onStatusChange(patient.id, "in-progress")}
                disabled={patient.status === "in-progress"}
              >
                <Clock className="h-4 w-4 mr-1" />
                In Progress
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "text-red-600 hover:text-red-700",
                  patient.status === "cancelled" && "bg-red-50"
                )}
                onClick={() => onStatusChange(patient.id, "cancelled")}
                disabled={patient.status === "cancelled"}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManageQueue; 