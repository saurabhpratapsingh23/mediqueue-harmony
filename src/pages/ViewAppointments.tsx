import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isToday, isPast, isFuture } from 'date-fns';
import { Calendar, Clock, User, Stethoscope, AlertCircle, CheckCircle, XCircle, FileText, MessageSquare, Phone, Mail, History, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { mockDoctorApi, DoctorAppointment } from '@/lib/mockDoctorService';

// Mock doctor ID - in a real app, this would come from authentication
const MOCK_DOCTOR_ID = 'doc1';

const ViewAppointments: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('today');
  const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointment | null>(null);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState<boolean>(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState<boolean>(false);
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [prescription, setPrescription] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [cancelReason, setCancelReason] = useState<string>('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        // Use the mock doctor API to get the doctor's appointments
        const doctorAppointments = await mockDoctorApi.getDoctorAppointments(MOCK_DOCTOR_ID);
        setAppointments(doctorAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = parseISO(appointment.date);
    
    switch (activeTab) {
      case 'today':
        return isToday(appointmentDate) && appointment.status !== 'CANCELLED';
      case 'upcoming':
        return isFuture(appointmentDate) && appointment.status !== 'CANCELLED';
      case 'past':
        return isPast(appointmentDate) || appointment.status === 'CANCELLED';
      default:
        return true;
    }
  });

  // Sort appointments by date and time
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`);
    const dateB = new Date(`${b.date}T${b.startTime}`);
    return dateA.getTime() - dateB.getTime();
  });

  // Handle completing an appointment
  const handleCompleteAppointment = async () => {
    if (!selectedAppointment) return;
    
    try {
      await mockDoctorApi.completeAppointment(
        selectedAppointment.id,
        diagnosis,
        prescription,
        notes
      );
      
      // Update the local state
      setAppointments(prevAppointments => 
        prevAppointments.map(apt => 
          apt.id === selectedAppointment.id 
            ? { 
                ...apt, 
                status: 'COMPLETED',
                diagnosis,
                prescription,
                notes,
                followUpDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              } 
            : apt
        )
      );
      
      toast.success('Appointment completed successfully');
      setIsCompleteDialogOpen(false);
      setSelectedAppointment(null);
      setDiagnosis('');
      setPrescription('');
      setNotes('');
    } catch (error) {
      console.error('Error completing appointment:', error);
      toast.error('Failed to complete appointment');
    }
  };

  // Handle cancelling an appointment
  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;
    
    try {
      await mockDoctorApi.cancelAppointment(
        selectedAppointment.id,
        cancelReason
      );
      
      // Update the local state
      setAppointments(prevAppointments => 
        prevAppointments.map(apt => 
          apt.id === selectedAppointment.id 
            ? { ...apt, status: 'CANCELLED', notes: cancelReason } 
            : apt
        )
      );
      
      toast.success('Appointment cancelled successfully');
      setIsCancelDialogOpen(false);
      setSelectedAppointment(null);
      setCancelReason('');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200">Scheduled</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="default" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
      case 'COMPLETED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'CANCELLED':
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
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Appointments</h1>
          <Button onClick={() => navigate("/doctor-dashboard")}>
            Back to Dashboard
          </Button>
        </div>
        
        <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Today's Appointments</CardTitle>
                <CardDescription>View and manage your appointments for today</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-8 text-center">
                    <p>Loading appointments...</p>
                  </div>
                ) : sortedAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {sortedAppointments.map((appointment) => (
                      <Card key={appointment.id} className="overflow-hidden">
                        <CardHeader className="bg-gray-50 p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{appointment.patientName}</CardTitle>
                              <CardDescription>
                                {appointment.department} • Queue #{appointment.queueNumber}
                              </CardDescription>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {getStatusBadge(appointment.status)}
                              {getUrgencyBadge(appointment.urgency)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{appointment.startTime} - {appointment.endTime}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{appointment.patientName} ({appointment.patientAge} years, {appointment.patientGender})</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{appointment.patientContact}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{appointment.patientEmail}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                                <span>Symptoms: {appointment.symptoms}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <History className="h-4 w-4 text-muted-foreground" />
                                <span>Medical History:</span>
                              </div>
                              <ul className="list-disc list-inside pl-6 text-sm text-muted-foreground">
                                {appointment.patientHistory.map((condition, index) => (
                                  <li key={index}>{condition}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          {appointment.status === 'COMPLETED' && (
                            <div className="mt-4 p-3 bg-green-50 rounded-md">
                              <h4 className="font-medium text-green-800">Diagnosis</h4>
                              <p className="text-sm text-green-700">{appointment.diagnosis}</p>
                              
                              <h4 className="font-medium text-green-800 mt-2">Prescription</h4>
                              <p className="text-sm text-green-700">{appointment.prescription}</p>
                              
                              <h4 className="font-medium text-green-800 mt-2">Notes</h4>
                              <p className="text-sm text-green-700">{appointment.notes}</p>
                              
                              {appointment.followUpDate && (
                                <div className="flex items-center gap-2 mt-2">
                                  <CalendarIcon className="h-4 w-4 text-green-700" />
                                  <span className="text-sm text-green-700">
                                    Follow-up: {format(parseISO(appointment.followUpDate), 'MMMM d, yyyy')}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {appointment.status === 'CANCELLED' && (
                            <div className="mt-4 p-3 bg-red-50 rounded-md">
                              <h4 className="font-medium text-red-800">Cancellation Reason</h4>
                              <p className="text-sm text-red-700">{appointment.notes}</p>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="p-4 bg-gray-50 flex justify-end gap-2">
                          {appointment.status === 'SCHEDULED' && (
                            <>
                              <Dialog open={isCompleteDialogOpen && selectedAppointment?.id === appointment.id} onOpenChange={setIsCompleteDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                    onClick={() => {
                                      setSelectedAppointment(appointment);
                                      setIsCompleteDialogOpen(true);
                                    }}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Complete
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Complete Appointment</DialogTitle>
                                    <DialogDescription>
                                      Enter diagnosis, prescription, and notes for {appointment.patientName}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="diagnosis">Diagnosis</Label>
                                      <Textarea 
                                        id="diagnosis" 
                                        value={diagnosis} 
                                        onChange={(e) => setDiagnosis(e.target.value)}
                                        placeholder="Enter diagnosis..."
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="prescription">Prescription</Label>
                                      <Textarea 
                                        id="prescription" 
                                        value={prescription} 
                                        onChange={(e) => setPrescription(e.target.value)}
                                        placeholder="Enter prescription..."
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="notes">Notes</Label>
                                      <Textarea 
                                        id="notes" 
                                        value={notes} 
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Enter notes..."
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCompleteDialogOpen(false)}>
                                      Cancel
                                    </Button>
                                    <Button onClick={handleCompleteAppointment}>
                                      Complete Appointment
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              
                              <Dialog open={isCancelDialogOpen && selectedAppointment?.id === appointment.id} onOpenChange={setIsCancelDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                    onClick={() => {
                                      setSelectedAppointment(appointment);
                                      setIsCancelDialogOpen(true);
                                    }}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancel
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Cancel Appointment</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to cancel the appointment with {appointment.patientName}?
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="reason">Cancellation Reason</Label>
                                      <Textarea 
                                        id="reason" 
                                        value={cancelReason} 
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        placeholder="Enter reason for cancellation..."
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                                      No, Keep Appointment
                                    </Button>
                                    <Button variant="destructive" onClick={handleCancelAppointment}>
                                      Yes, Cancel Appointment
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </>
                          )}
                          
                          {appointment.status === 'IN_PROGRESS' && (
                            <Dialog open={isCompleteDialogOpen && selectedAppointment?.id === appointment.id} onOpenChange={setIsCompleteDialogOpen}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                  onClick={() => {
                                    setSelectedAppointment(appointment);
                                    setIsCompleteDialogOpen(true);
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Complete
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Complete Appointment</DialogTitle>
                                  <DialogDescription>
                                    Enter diagnosis, prescription, and notes for {appointment.patientName}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="diagnosis">Diagnosis</Label>
                                    <Textarea 
                                      id="diagnosis" 
                                      value={diagnosis} 
                                      onChange={(e) => setDiagnosis(e.target.value)}
                                      placeholder="Enter diagnosis..."
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="prescription">Prescription</Label>
                                    <Textarea 
                                      id="prescription" 
                                      value={prescription} 
                                      onChange={(e) => setPrescription(e.target.value)}
                                      placeholder="Enter prescription..."
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea 
                                      id="notes" 
                                      value={notes} 
                                      onChange={(e) => setNotes(e.target.value)}
                                      placeholder="Enter notes..."
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setIsCompleteDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleCompleteAppointment}>
                                    Complete Appointment
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p>No appointments found for today.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>View your scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-8 text-center">
                    <p>Loading appointments...</p>
                  </div>
                ) : sortedAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {sortedAppointments.map((appointment) => (
                      <Card key={appointment.id} className="overflow-hidden">
                        <CardHeader className="bg-gray-50 p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{appointment.patientName}</CardTitle>
                              <CardDescription>
                                {appointment.department} • Queue #{appointment.queueNumber}
                              </CardDescription>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {getStatusBadge(appointment.status)}
                              {getUrgencyBadge(appointment.urgency)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{format(parseISO(appointment.date), 'EEEE, MMMM d, yyyy')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{appointment.startTime} - {appointment.endTime}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{appointment.patientName} ({appointment.patientAge} years, {appointment.patientGender})</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                                <span>Symptoms: {appointment.symptoms}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{appointment.patientContact}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{appointment.patientEmail}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 bg-gray-50 flex justify-end gap-2">
                          <Dialog open={isCancelDialogOpen && selectedAppointment?.id === appointment.id} onOpenChange={setIsCancelDialogOpen}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setIsCancelDialogOpen(true);
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Cancel Appointment</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to cancel the appointment with {appointment.patientName}?
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="reason">Cancellation Reason</Label>
                                  <Textarea 
                                    id="reason" 
                                    value={cancelReason} 
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="Enter reason for cancellation..."
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                                  No, Keep Appointment
                                </Button>
                                <Button variant="destructive" onClick={handleCancelAppointment}>
                                  Yes, Cancel Appointment
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p>No upcoming appointments found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Past Appointments</CardTitle>
                <CardDescription>View your completed and cancelled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-8 text-center">
                    <p>Loading appointments...</p>
                  </div>
                ) : sortedAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {sortedAppointments.map((appointment) => (
                      <Card key={appointment.id} className="overflow-hidden">
                        <CardHeader className="bg-gray-50 p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{appointment.patientName}</CardTitle>
                              <CardDescription>
                                {appointment.department} • Queue #{appointment.queueNumber}
                              </CardDescription>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {getStatusBadge(appointment.status)}
                              {getUrgencyBadge(appointment.urgency)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{format(parseISO(appointment.date), 'EEEE, MMMM d, yyyy')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{appointment.startTime} - {appointment.endTime}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{appointment.patientName} ({appointment.patientAge} years, {appointment.patientGender})</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                                <span>Symptoms: {appointment.symptoms}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{appointment.patientContact}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{appointment.patientEmail}</span>
                              </div>
                            </div>
                          </div>
                          
                          {appointment.status === 'COMPLETED' && (
                            <div className="mt-4 p-3 bg-green-50 rounded-md">
                              <h4 className="font-medium text-green-800">Diagnosis</h4>
                              <p className="text-sm text-green-700">{appointment.diagnosis}</p>
                              
                              <h4 className="font-medium text-green-800 mt-2">Prescription</h4>
                              <p className="text-sm text-green-700">{appointment.prescription}</p>
                              
                              <h4 className="font-medium text-green-800 mt-2">Notes</h4>
                              <p className="text-sm text-green-700">{appointment.notes}</p>
                              
                              {appointment.followUpDate && (
                                <div className="flex items-center gap-2 mt-2">
                                  <CalendarIcon className="h-4 w-4 text-green-700" />
                                  <span className="text-sm text-green-700">
                                    Follow-up: {format(parseISO(appointment.followUpDate), 'MMMM d, yyyy')}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {appointment.status === 'CANCELLED' && (
                            <div className="mt-4 p-3 bg-red-50 rounded-md">
                              <h4 className="font-medium text-red-800">Cancellation Reason</h4>
                              <p className="text-sm text-red-700">{appointment.notes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
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
    </div>
  );
};

export default ViewAppointments; 