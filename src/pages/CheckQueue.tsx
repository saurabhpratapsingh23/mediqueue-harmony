
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Users, Clock } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CheckQueue = () => {
  const navigate = useNavigate();
  const [appointmentId, setAppointmentId] = useState("");
  const [searchDone, setSearchDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appointmentFound, setAppointmentFound] = useState(false);
  
  const handleSearch = () => {
    if (!appointmentId.trim()) {
      toast.error("Please enter an appointment ID");
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (appointmentId === "MQ12345") {
        setAppointmentFound(true);
      } else {
        setAppointmentFound(false);
        toast.error("Appointment not found. Please check the ID and try again.");
      }
      setSearchDone(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Check Queue Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="appointment-id">Enter your appointment ID</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="appointment-id"
                    placeholder="e.g. MQ12345"
                    value={appointmentId}
                    onChange={(e) => setAppointmentId(e.target.value)}
                  />
                  <Button onClick={handleSearch} disabled={loading}>
                    {loading ? "Searching..." : "Check"}
                    <Search className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  You can find your appointment ID in your confirmation email or SMS
                </p>
              </div>
              
              {searchDone && appointmentFound && (
                <Card className="mt-6">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium">Appointment #MQ12345</h3>
                        <p className="text-sm text-muted-foreground">Orthopedics • Dr. Michael Brown</p>
                      </div>
                      <Badge>Waiting</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm gap-2">
                        <Users className="h-4 w-4" />
                        <span>Position in queue: <strong>3</strong></span>
                      </div>
                      <div className="flex items-center text-sm gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Estimated time: <strong>11:15 AM</strong></span>
                      </div>
                      <Progress value={70} className="mt-2" />
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" onClick={() => navigate("/queue-status")}>
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {searchDone && !appointmentFound && (
                <div className="text-center py-4">
                  <p>No appointment found with this ID.</p>
                  <Button variant="outline" className="mt-2" onClick={() => navigate("/book-appointment")}>
                    Book an Appointment
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Department Queue Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 border rounded">
                <span>Cardiology</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Current wait: ~25 min</span>
                  <Badge variant="outline">5 waiting</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center p-2 border rounded">
                <span>Orthopedics</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Current wait: ~40 min</span>
                  <Badge variant="outline">8 waiting</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center p-2 border rounded">
                <span>Dermatology</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Current wait: ~15 min</span>
                  <Badge variant="outline">2 waiting</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckQueue;
