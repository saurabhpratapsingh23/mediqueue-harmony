import { v4 as uuidv4 } from 'uuid';

// Mock data types
export interface MockTimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface MockAppointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  timeSlotId: string;
  startTime: string;
  endTime: string;
  symptoms: string;
  urgency: string;
  status: string;
  queueNumber: number;
}

// Mock data storage
const mockTimeSlots: Record<string, MockTimeSlot[]> = {};
const mockAppointments: MockAppointment[] = [
  {
    id: 'apt1',
    patientId: 'patient123',
    patientName: 'John Doe',
    doctorId: 'doc1',
    doctorName: 'Dr. Smith',
    department: 'Cardiology',
    date: new Date().toISOString().split('T')[0], // Today
    timeSlotId: 'slot1',
    startTime: '10:00',
    endTime: '10:30',
    symptoms: 'Chest pain and shortness of breath',
    urgency: 'HIGH',
    status: 'SCHEDULED',
    queueNumber: 1001
  },
  {
    id: 'apt2',
    patientId: 'patient123',
    patientName: 'John Doe',
    doctorId: 'doc3',
    doctorName: 'Dr. Williams',
    department: 'Orthopedics',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next week
    timeSlotId: 'slot2',
    startTime: '14:00',
    endTime: '14:30',
    symptoms: 'Knee pain after running',
    urgency: 'MEDIUM',
    status: 'SCHEDULED',
    queueNumber: 1002
  },
  {
    id: 'apt3',
    patientId: 'patient123',
    patientName: 'John Doe',
    doctorId: 'doc5',
    doctorName: 'Dr. Davis',
    department: 'Dermatology',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last week
    timeSlotId: 'slot3',
    startTime: '11:00',
    endTime: '11:30',
    symptoms: 'Rash on arms',
    urgency: 'LOW',
    status: 'COMPLETED',
    queueNumber: 1003
  },
  {
    id: 'apt4',
    patientId: 'patient123',
    patientName: 'John Doe',
    doctorId: 'doc2',
    doctorName: 'Dr. Johnson',
    department: 'Pediatrics',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Two weeks ago
    timeSlotId: 'slot4',
    startTime: '09:00',
    endTime: '09:30',
    symptoms: 'Fever and cough',
    urgency: 'HIGH',
    status: 'CANCELLED',
    queueNumber: 1004
  }
];
let nextQueueNumber = 1005;

// Helper function to generate time slots for a day
const generateTimeSlots = (): MockTimeSlot[] => {
  const slots: MockTimeSlot[] = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM
  
  for (let hour = startHour; hour < endHour; hour++) {
    // Create slots in 30-minute intervals
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${hour.toString().padStart(2, '0')}:30`;
    
    slots.push({
      id: uuidv4(),
      startTime,
      endTime,
      available: Math.random() > 0.3 // 70% chance of being available
    });
    
    const startTime2 = `${hour.toString().padStart(2, '0')}:30`;
    const endTime2 = `${(hour + 1).toString().padStart(2, '0')}:00`;
    
    slots.push({
      id: uuidv4(),
      startTime: startTime2,
      endTime: endTime2,
      available: Math.random() > 0.3 // 70% chance of being available
    });
  }
  
  return slots;
};

// Mock API functions
export const mockApi = {
  // Get time slots for a doctor on a specific date
  getTimeSlots: async (doctorId: string, date: string): Promise<MockTimeSlot[]> => {
    const key = `${doctorId}-${date}`;
    
    // Generate new time slots if they don't exist for this doctor and date
    if (!mockTimeSlots[key]) {
      mockTimeSlots[key] = generateTimeSlots();
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockTimeSlots[key];
  },
  
  // Check if a time slot is available
  checkTimeSlotAvailability: async (
    doctorId: string,
    date: string,
    timeSlotId: string
  ): Promise<{ available: boolean }> => {
    const key = `${doctorId}-${date}`;
    const slots = mockTimeSlots[key] || generateTimeSlots();
    const slot = slots.find(s => s.id === timeSlotId);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!slot) {
      throw new Error("Time slot not found");
    }
    
    return { available: slot.available };
  },
  
  // Block a time slot
  blockTimeSlot: async (
    doctorId: string,
    date: string,
    timeSlotId: string,
    patientId: string
  ): Promise<{ success: boolean }> => {
    const key = `${doctorId}-${date}`;
    const slots = mockTimeSlots[key] || generateTimeSlots();
    const slot = slots.find(s => s.id === timeSlotId);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (!slot) {
      throw new Error("Time slot not found");
    }
    
    if (!slot.available) {
      throw new Error("Time slot is not available");
    }
    
    // Mark the slot as unavailable
    slot.available = false;
    mockTimeSlots[key] = slots;
    
    return { success: true };
  },
  
  // Create an appointment
  createAppointment: async (appointmentData: Omit<MockAppointment, 'id' | 'queueNumber'>): Promise<MockAppointment> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newAppointment: MockAppointment = {
      ...appointmentData,
      id: uuidv4(),
      queueNumber: nextQueueNumber++
    };
    
    mockAppointments.push(newAppointment);
    return newAppointment;
  },
  
  // Send notifications
  sendNotifications: async (notificationData: {
    type: string;
    appointmentId: string;
    patientId: string;
    doctorId: string;
    date: string;
    timeSlotId: string;
    startTime: string;
    endTime: string;
  }): Promise<{ success: boolean }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real implementation, this would send emails
    console.log("Sending notification:", notificationData);
    
    return { success: true };
  },
  
  // Get appointments for a patient
  getPatientAppointments: async (patientId: string): Promise<MockAppointment[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter appointments for the patient
    return mockAppointments.filter(appointment => appointment.patientId === patientId);
  },
  
  // Cancel an appointment
  cancelAppointment: async (appointmentId: string): Promise<{ success: boolean }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const appointmentIndex = mockAppointments.findIndex(apt => apt.id === appointmentId);
    
    if (appointmentIndex === -1) {
      throw new Error("Appointment not found");
    }
    
    // Update the appointment status
    mockAppointments[appointmentIndex].status = 'CANCELLED';
    
    return { success: true };
  },

  // Get all appointments (for doctor dashboard)
  getAllAppointments: async (): Promise<MockAppointment[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockAppointments];
  }
}; 