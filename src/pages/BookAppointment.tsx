
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

const departments = [
  { id: "cardio", name: "Cardiology" },
  { id: "ortho", name: "Orthopedics" },
  { id: "neuro", name: "Neurology" },
  { id: "dermo", name: "Dermatology" },
  { id: "pedia", name: "Pediatrics" },
];

const doctors = [
  { id: "dr1", name: "Dr. John Smith", departmentId: "cardio" },
  { id: "dr2", name: "Dr. Emma Johnson", departmentId: "cardio" },
  { id: "dr3", name: "Dr. Michael Brown", departmentId: "ortho" },
  { id: "dr4", name: "Dr. Jennifer Davis", departmentId: "neuro" },
  { id: "dr5", name: "Dr. Robert Wilson", departmentId: "dermo" },
  { id: "dr6", name: "Dr. Sarah Thompson", departmentId: "pedia" },
];

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM", 
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM"
];

const BookAppointment = () => {
  const navigate = useNavigate();
  const [bookingMethod, setBookingMethod] = useState<"department" | "doctor">("department");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredDoctors = selectedDepartment ? 
    doctors.filter(doctor => doctor.departmentId === selectedDepartment) : 
    doctors;

  const handleBooking = () => {
    setIsSubmitting(true);

    // Validate form
    if (!selectedDate || !selectedTime || (!selectedDoctor && !selectedDepartment)) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast.success("Appointment booked successfully!");
      setIsSubmitting(false);
      navigate("/queue-status");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={bookingMethod} onValueChange={(v) => setBookingMethod(v as "department" | "doctor")}>
            <TabsList className="mb-6">
              <TabsTrigger value="department">Book by Department</TabsTrigger>
              <TabsTrigger value="doctor">Book by Doctor</TabsTrigger>
            </TabsList>
            
            <TabsContent value="department" className="space-y-4">
              <div>
                <Label htmlFor="department">Select Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedDepartment && (
                <div>
                  <Label htmlFor="doctor">Select Doctor (Optional)</Label>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger id="doctor">
                      <SelectValue placeholder="Any available doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredDoctors.map(doctor => (
                        <SelectItem key={doctor.id} value={doctor.id}>{doctor.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="doctor" className="space-y-4">
              <div>
                <Label htmlFor="doctor-direct">Select Doctor</Label>
                <Select value={selectedDoctor} onValueChange={(value) => {
                  setSelectedDoctor(value);
                  const doctor = doctors.find(doc => doc.id === value);
                  if (doctor) setSelectedDepartment(doctor.departmentId);
                }}>
                  <SelectTrigger id="doctor-direct">
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map(doctor => (
                      <SelectItem key={doctor.id} value={doctor.id}>{doctor.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today || date.getDay() === 0 || date.getDay() === 6;
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="time">Select Time</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger id="time" className="mt-1">
                  <SelectValue placeholder="Select time slot">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {selectedTime || "Select time slot"}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="reason">Reason for Visit (Optional)</Label>
            <Textarea 
              id="reason" 
              placeholder="Briefly describe your symptoms or reason for the appointment"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Cancel
            </Button>
            <Button onClick={handleBooking} disabled={isSubmitting}>
              {isSubmitting ? "Booking..." : "Book Appointment"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookAppointment;
