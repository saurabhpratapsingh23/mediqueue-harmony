import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Stethoscope, AlertCircle, CheckCircle, XCircle, Clock4 } from 'lucide-react';
import { toast } from 'sonner';
import { mockApi, MockAppointment } from '@/lib/mockAppointmentService';

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<MockAppointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('upcoming');

  // Mock user ID - in a real app, this would come from authentication
  const userId = 'patient123';

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        // Use the mock API to get the user's appointments
        const userAppointments = await mockApi.getPatientAppointments(userId);
        setAppointments(userAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Clock4 className="w-3 h-3 mr-1" /> Scheduled</Badge>;
      case 'COMPLETED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (activeTab === 'upcoming') {
      return appointmentDate >= today && appointment.status === 'SCHEDULED';
    } else if (activeTab === 'past') {
      return appointmentDate < today || appointment.status === 'COMPLETED';
    } else if (activeTab === 'cancelled') {
      return appointment.status === 'CANCELLED';
    }
    return true;
  });

  const handleBookNewAppointment = () => {
    navigate('/book-appointment');
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      // Use the mock API to cancel the appointment
      await mockApi.cancelAppointment(appointmentId);
      
      // Update the local state
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, status: 'CANCELLED' } 
            : appointment
        )
      );
      
      toast.success('Appointment cancelled successfully');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Appointments</h1>
        <Button onClick={handleBookNewAppointment}>
          Book New Appointment
        </Button>
      </div>

      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {loading ? (
            <div className="text-center py-8">Loading appointments...</div>
          ) : filteredAppointments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                  onCancel={() => handleCancelAppointment(appointment.id)}
                  showCancelButton={true}
                  getStatusBadge={getStatusBadge}
                  getUrgencyBadge={getUrgencyBadge}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                <Button onClick={handleBookNewAppointment}>Book an Appointment</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past">
          {loading ? (
            <div className="text-center py-8">Loading appointments...</div>
          ) : filteredAppointments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                  showCancelButton={false}
                  getStatusBadge={getStatusBadge}
                  getUrgencyBadge={getUrgencyBadge}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">No past appointments</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {loading ? (
            <div className="text-center py-8">Loading appointments...</div>
          ) : filteredAppointments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                  showCancelButton={false}
                  getStatusBadge={getStatusBadge}
                  getUrgencyBadge={getUrgencyBadge}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">No cancelled appointments</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface AppointmentCardProps {
  appointment: MockAppointment;
  onCancel?: () => void;
  showCancelButton: boolean;
  getStatusBadge: (status: string) => React.ReactNode;
  getUrgencyBadge: (urgency: string) => React.ReactNode;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  onCancel, 
  showCancelButton,
  getStatusBadge,
  getUrgencyBadge
}) => {
  const formattedDate = format(new Date(appointment.date), 'EEEE, MMMM d, yyyy');
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{appointment.department}</CardTitle>
          <div className="flex flex-col items-end">
            {getStatusBadge(appointment.status)}
            <div className="mt-1 text-sm text-muted-foreground">
              Queue #{appointment.queueNumber}
            </div>
          </div>
        </div>
        <CardDescription>
          {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center">
          <Stethoscope className="w-4 h-4 mr-2 text-muted-foreground" />
          <span className="font-medium">{appointment.doctorName}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
          <span>{appointment.startTime} - {appointment.endTime}</span>
        </div>
        <div className="flex items-center">
          <AlertCircle className="w-4 h-4 mr-2 text-muted-foreground" />
          <span>Urgency: {getUrgencyBadge(appointment.urgency)}</span>
        </div>
        <div className="pt-2">
          <p className="text-sm font-medium">Symptoms:</p>
          <p className="text-sm text-muted-foreground">{appointment.symptoms}</p>
        </div>
      </CardContent>
      {showCancelButton && (
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full text-red-600 border-red-200 hover:bg-red-50" 
            onClick={onCancel}
          >
            Cancel Appointment
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default Appointments; 