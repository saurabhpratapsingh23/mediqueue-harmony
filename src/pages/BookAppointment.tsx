import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApi, MockTimeSlot } from '@/lib/mockAppointmentService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { toast } from 'sonner';

// Mock data for departments and doctors
const mockDepartments = [
  { id: 'dept1', name: 'Cardiology' },
  { id: 'dept2', name: 'Pediatrics' },
  { id: 'dept3', name: 'Orthopedics' },
  { id: 'dept4', name: 'Neurology' },
  { id: 'dept5', name: 'Dermatology' }
];

const mockDoctors = [
  { id: 'doc1', name: 'Dr. Smith', department: 'Cardiology', availability: 'Mon-Fri, 9AM-5PM' },
  { id: 'doc2', name: 'Dr. Johnson', department: 'Pediatrics', availability: 'Mon-Thu, 10AM-6PM' },
  { id: 'doc3', name: 'Dr. Williams', department: 'Orthopedics', availability: 'Tue-Sat, 9AM-5PM' },
  { id: 'doc4', name: 'Dr. Brown', department: 'Neurology', availability: 'Mon-Fri, 11AM-7PM' },
  { id: 'doc5', name: 'Dr. Davis', department: 'Dermatology', availability: 'Wed-Sun, 9AM-5PM' }
];

interface Doctor {
  id: string;
  name: string;
  department: string;
  availability?: string;
}

interface Department {
  id: string;
  name: string;
}

const BookAppointment: React.FC = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [timeSlots, setTimeSlots] = useState<MockTimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  const [urgency, setUrgency] = useState<string>('MEDIUM');
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);

  // Fetch departments and doctors on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use mock data instead of API calls
        setDepartments(mockDepartments);
        setDoctors(mockDoctors);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load departments and doctors');
      }
    };

    fetchData();
  }, []);

  // Filter doctors when department changes
  useEffect(() => {
    if (selectedDepartment) {
      const filtered = doctors.filter(doctor => doctor.department === selectedDepartment);
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors([]);
    }
    setSelectedDoctor('');
  }, [selectedDepartment, doctors]);

  // Fetch time slots when doctor and date are selected
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (selectedDoctor && selectedDate) {
        try {
          setLoading(true);
          const formattedDate = format(selectedDate, 'yyyy-MM-dd');
          const slots = await mockApi.getTimeSlots(selectedDoctor, formattedDate);
          setTimeSlots(slots);
        } catch (error) {
          console.error('Error fetching time slots:', error);
          toast.error('Failed to load available time slots');
        } finally {
          setLoading(false);
        }
      } else {
        setTimeSlots([]);
      }
    };

    fetchTimeSlots();
  }, [selectedDoctor, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDoctor || !selectedDate || !selectedTimeSlot || !symptoms) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Format the date
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      // Check if the time slot is still available
      const availabilityCheck = await mockApi.checkTimeSlotAvailability(
        selectedDoctor,
        formattedDate,
        selectedTimeSlot
      );
      
      if (!availabilityCheck.available) {
        toast.error('This time slot is no longer available. Please select another time.');
        return;
      }
      
      // Block the time slot
      await mockApi.blockTimeSlot(
        selectedDoctor,
        formattedDate,
        selectedTimeSlot,
        'patient123' // In a real app, this would be the logged-in user's ID
      );
      
      // Get the selected time slot details
      const slot = timeSlots.find(s => s.id === selectedTimeSlot);
      
      // Create the appointment
      const appointment = await mockApi.createAppointment({
        patientId: 'patient123', // In a real app, this would be the logged-in user's ID
        patientName: 'John Doe', // In a real app, this would be the logged-in user's name
        doctorId: selectedDoctor,
        doctorName: doctors.find(d => d.id === selectedDoctor)?.name || '',
        department: selectedDepartment,
        date: formattedDate,
        timeSlotId: selectedTimeSlot,
        startTime: slot?.startTime || '',
        endTime: slot?.endTime || '',
        symptoms,
        urgency,
        status: 'SCHEDULED'
      });
      
      // Send notifications
      await mockApi.sendNotifications({
        type: 'APPOINTMENT_CREATED',
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        date: appointment.date,
        timeSlotId: appointment.timeSlotId,
        startTime: appointment.startTime,
        endTime: appointment.endTime
      });
      
      toast.success('Appointment booked successfully!');
      navigate('/appointments');
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
          <CardDescription>
            Fill in the details below to schedule your appointment
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor">Doctor</Label>
              <Select
                value={selectedDoctor}
                onValueChange={setSelectedDoctor}
                disabled={!selectedDepartment}
              >
                <SelectTrigger id="doctor">
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {filteredDoctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => {
                  // Disable past dates and weekends
                  const day = date.getDay();
                  return date < new Date() || day === 0 || day === 6;
                }}
                className="rounded-md border"
              />
            </div>

            {selectedDoctor && selectedDate && (
              <div className="space-y-2">
                <Label>Available Time Slots</Label>
                <div className="grid grid-cols-3 gap-2">
                  {loading ? (
                    <div className="col-span-3 text-center py-4">Loading time slots...</div>
                  ) : timeSlots.length > 0 ? (
                    timeSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        type="button"
                        variant={selectedTimeSlot === slot.id ? "default" : "outline"}
                        className={`w-full ${!slot.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => slot.available && setSelectedTimeSlot(slot.id)}
                        disabled={!slot.available}
                      >
                        {slot.startTime} - {slot.endTime}
                      </Button>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-4">No time slots available for this date</div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="symptoms">Symptoms</Label>
              <Textarea
                id="symptoms"
                placeholder="Describe your symptoms..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Urgency Level</Label>
              <RadioGroup
                value={urgency}
                onValueChange={setUrgency}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="LOW" id="low" />
                  <Label htmlFor="low">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="MEDIUM" id="medium" />
                  <Label htmlFor="medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="HIGH" id="high" />
                  <Label htmlFor="high">High</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Booking...' : 'Book Appointment'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default BookAppointment; 