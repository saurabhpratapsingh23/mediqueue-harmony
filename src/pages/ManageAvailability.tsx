import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Clock, Loader2, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

interface TimeSlot {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  isAvailable: boolean;
}

const ManageAvailability = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [newTimeSlot, setNewTimeSlot] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not a doctor
  useEffect(() => {
    if (user && user.role !== "doctor") {
      toast.error("Only doctors can manage their availability");
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch time slots for the selected date
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!user || user.role !== "doctor" || !selectedDate) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
          throw new Error("API URL not configured");
        }

        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const url = `${apiUrl}/api/timeslots/doctor/${user.id}?date=${formattedDate}`;
        
        console.log("Fetching time slots from:", url);
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          let errorMessage = "Failed to fetch time slots";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            console.error("Error parsing error response:", e);
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log("Received time slots:", data);
        setTimeSlots(data);
      } catch (err) {
        console.error("Error fetching time slots:", err);
        if (err instanceof Error) {
          setError(err.message);
          toast.error(err.message);
        } else {
          setError("Failed to fetch time slots");
          toast.error("Failed to fetch time slots");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeSlots();
  }, [user, selectedDate]);

  const handleAddTimeSlot = async () => {
    if (!user || user.role !== "doctor" || !selectedDate || !newTimeSlot) {
      toast.error("Please select a date and enter a time");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      
      const response = await fetch(`${apiUrl}/api/timeslots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          doctorId: user.id,
          date: formattedDate,
          time: newTimeSlot,
          isAvailable: true,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to add time slot";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Error parsing error response:", e);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Time slot added successfully:", data);
      
      // Refresh time slots
      const updatedTimeSlots = [...timeSlots, data];
      setTimeSlots(updatedTimeSlots);
      setNewTimeSlot("");
      
      toast.success("Time slot added successfully");
    } catch (err) {
      console.error("Error adding time slot:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to add time slot";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTimeSlot = async (timeSlotId: string) => {
    if (!user || user.role !== "doctor") return;
    
    try {
      setIsSubmitting(true);
      
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const response = await fetch(`${apiUrl}/api/timeslots/${timeSlotId}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        let errorMessage = "Failed to delete time slot";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Error parsing error response:", e);
        }
        throw new Error(errorMessage);
      }

      console.log("Time slot deleted successfully");
      
      // Update local state
      const updatedTimeSlots = timeSlots.filter(slot => slot.id !== timeSlotId);
      setTimeSlots(updatedTimeSlots);
      
      toast.success("Time slot deleted successfully");
    } catch (err) {
      console.error("Error deleting time slot:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to delete time slot";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== "doctor") {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 pt-16 md:pt-24 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500 mb-4">Access denied. Only doctors can manage their availability.</p>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 pt-16 md:pt-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pt-16 md:pt-24">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Manage Your Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>Add New Time Slot</Label>
                <div className="flex gap-2">
                  <Input
                    type="time"
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    placeholder="Enter time (e.g., 09:00)"
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAddTimeSlot}
                    disabled={isSubmitting || !newTimeSlot}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Your Time Slots for {selectedDate ? format(selectedDate, "PPP") : "Selected Date"}</Label>
                {timeSlots.length === 0 ? (
                  <p className="text-muted-foreground">No time slots available for this date.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <div 
                        key={slot.id} 
                        className="flex items-center justify-between p-3 border rounded-md"
                      >
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{slot.time}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTimeSlot(slot.id)}
                          disabled={isSubmitting}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageAvailability; 