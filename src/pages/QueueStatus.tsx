
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";

interface QueueItem {
  id: string;
  patientName: string;
  doctor: string;
  department: string;
  estimatedTime: string;
  status: "waiting" | "in-progress" | "completed" | "cancelled";
  position: number;
}

const QueueStatus = () => {
  const navigate = useNavigate();
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to fetch queue status
    setTimeout(() => {
      const mockQueueItems: QueueItem[] = [
        {
          id: "q1",
          patientName: "John Doe",
          doctor: "Dr. Sarah Thompson",
          department: "Cardiology",
          estimatedTime: "10:30 AM",
          status: "in-progress",
          position: 0
        },
        {
          id: "q2",
          patientName: "Current User",
          doctor: "Dr. Michael Brown",
          department: "Orthopedics",
          estimatedTime: "11:15 AM",
          status: "waiting",
          position: 3
        }
      ];
      setQueueItems(mockQueueItems);
      setLoading(false);
    }, 1500);
  }, []);

  const getStatusBadge = (status: QueueItem['status']) => {
    switch (status) {
      case "waiting":
        return <Badge variant="secondary">Waiting</Badge>;
      case "in-progress":
        return <Badge variant="default">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Queue Status</CardTitle>
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
                          <h3 className="font-medium">{item.patientName === "Current User" ? "Your Appointment" : item.patientName}</h3>
                          <p className="text-sm text-muted-foreground">{item.department} • {item.doctor}</p>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                      
                      {item.status === "waiting" && (
                        <div className="space-y-2">
                          <div className="flex items-center text-sm gap-2">
                            <Users className="h-4 w-4" />
                            <span>Position in queue: <strong>{item.position}</strong></span>
                          </div>
                          <div className="flex items-center text-sm gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Estimated time: <strong>{item.estimatedTime}</strong></span>
                          </div>
                          <Progress value={70} className="mt-2" />
                        </div>
                      )}
                      
                      {item.status === "in-progress" && (
                        <div className="text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Started at <strong>{item.estimatedTime}</strong></span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <div className="flex justify-end">
                    <Button onClick={() => navigate("/check-queue")}>
                      Refresh Queue Status
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p>You don't have any active appointments in the queue.</p>
                  <Button className="mt-4" onClick={() => navigate("/book-appointment")}>
                    Book an Appointment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QueueStatus;
