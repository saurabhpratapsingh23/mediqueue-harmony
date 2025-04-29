import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, Calendar, Stethoscope, AlertCircle, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import { mockApi, MockAppointment } from "@/lib/mockAppointmentService";

interface QueueItem {
  id: string;
  appointmentId: string;
  patientName: string;
  doctor: string;
  department: string;
  date: string;
  startTime: string;
  endTime: string;
  estimatedTime: string;
  status: "waiting" | "in-progress" | "completed" | "cancelled";
  position: number;
  queueNumber: number;
  symptoms: string;
  urgency: string;
}

const QueueStatus = () => {
  const navigate = useNavigate();
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Mock user ID - in a real app, this would come from authentication
  const userId = 'patient123';
  
  const fetchQueueStatus = async () => {
    try {
      setRefreshing(true);
      
      // Get the user's appointments
      const appointments = await mockApi.getPatientAppointments(userId);
      
      // Filter for today's appointments that are scheduled
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointments.filter(apt => 
        apt.date === today && apt.status === 'SCHEDULED'
      );
      
      if (todayAppointments.length === 0) {
        setQueueItems([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      
      // Convert appointments to queue items
      const queueItemsData: QueueItem[] = todayAppointments.map((apt, index) => {
        // Calculate position based on queue number (lower number = higher position)
        const position = index;
        
        // Calculate estimated time (in a real app, this would come from the backend)
        const startTimeHour = parseInt(apt.startTime.split(':')[0]);
        const startTimeMinute = parseInt(apt.startTime.split(':')[1]);
        const estimatedHour = startTimeHour + Math.floor(position / 2);
        const estimatedMinute = (startTimeMinute + (position % 2) * 30) % 60;
        const estimatedTime = `${estimatedHour.toString().padStart(2, '0')}:${estimatedMinute.toString().padStart(2, '0')}`;
        
        // Determine status based on current time
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        
        let status: "waiting" | "in-progress" | "completed" | "cancelled" = "waiting";
        
        if (apt.status === 'CANCELLED') {
          status = "cancelled";
        } else if (currentTime > apt.endTime) {
          status = "completed";
        } else if (currentTime >= apt.startTime && currentTime <= apt.endTime) {
          status = "in-progress";
        }
        
        return {
          id: `q${apt.id}`,
          appointmentId: apt.id,
          patientName: apt.patientName,
          doctor: apt.doctorName,
          department: apt.department,
          date: apt.date,
          startTime: apt.startTime,
          endTime: apt.endTime,
          estimatedTime,
          status,
          position,
          queueNumber: apt.queueNumber,
          symptoms: apt.symptoms,
          urgency: apt.urgency
        };
      });
      
      // Sort by queue number
      queueItemsData.sort((a, b) => a.queueNumber - b.queueNumber);
      
      setQueueItems(queueItemsData);
    } catch (error) {
      console.error('Error fetching queue status:', error);
      toast.error('Failed to load queue status');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchQueueStatus();
    
    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchQueueStatus();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const getStatusBadge = (status: QueueItem['status']) => {
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
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Queue Status</h1>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate("/appointments")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <CalendarDays className="h-4 w-4" />
              My Appointments
            </Button>
            <Button 
              onClick={fetchQueueStatus} 
              disabled={refreshing}
              variant="outline"
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center">
                <p>Loading queue information...</p>
              </div>
            ) : queueItems.length > 0 ? (
              <div className="space-y-6">
                {queueItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <h3 className="font-medium">Your Appointment</h3>
                        <p className="text-sm text-muted-foreground">{item.department} • {item.doctor}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        {getStatusBadge(item.status)}
                        <div className="mt-1 text-sm text-muted-foreground">
                          Queue #{item.queueNumber}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(item.date), 'EEEE, MMMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{item.startTime} - {item.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-muted-foreground" />
                        <span>{item.doctor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <span>Urgency: {getUrgencyBadge(item.urgency)}</span>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-sm font-medium">Symptoms:</p>
                      <p className="text-sm text-muted-foreground">{item.symptoms}</p>
                    </div>
                    
                    {item.status === "waiting" && (
                      <div className="space-y-2 mt-3">
                        <div className="flex items-center text-sm gap-2">
                          <Users className="h-4 w-4" />
                          <span>Position in queue: <strong>{item.position + 1}</strong></span>
                        </div>
                        <div className="flex items-center text-sm gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Estimated time: <strong>{item.estimatedTime}</strong></span>
                        </div>
                        <Progress value={70} className="mt-2" />
                      </div>
                    )}
                    
                    {item.status === "in-progress" && (
                      <div className="text-sm mt-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Started at <strong>{item.startTime}</strong></span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p>You don't have any active appointments in the queue today.</p>
                <div className="mt-4 space-x-2">
                  <Button onClick={() => navigate("/book-appointment")}>
                    Book an Appointment
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/appointments")}>
                    View All Appointments
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QueueStatus;