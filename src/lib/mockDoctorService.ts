import { v4 as uuidv4 } from 'uuid';
import { MockAppointment } from './mockAppointmentService';

// Extended appointment interface for doctors with additional patient information
export interface DoctorAppointment extends MockAppointment {
  patientAge: number;
  patientGender: string;
  patientHistory: string[];
  patientContact: string;
  patientEmail: string;
  notes?: string;
  diagnosis?: string;
  prescription?: string;
  followUpDate?: string;
}

// Mock doctor data
export const mockDoctors = [
  {
    id: "doc1",
    name: "Dr. John Smith",
    specialization: "Cardiologist",
    department: "Cardiology",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZG9jdG9yfGVufDB8fDB8fHww",
    rating: 4.8,
    experience: 15,
  },
  {
    id: "doc2",
    name: "Dr. Sarah Johnson",
    specialization: "Orthopedic Surgeon",
    department: "Orthopedics",
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
    rating: 4.9,
    experience: 12,
  },
  {
    id: "doc3",
    name: "Dr. Michael Chen",
    specialization: "Neurologist",
    department: "Neurology",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
    rating: 4.7,
    experience: 10,
  },
  {
    id: "doc4",
    name: "Dr. Emily Patel",
    specialization: "Dermatologist",
    department: "Dermatology",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
    rating: 4.6,
    experience: 8,
  },
  {
    id: "doc5",
    name: "Dr. Lisa Wong",
    specialization: "Pediatrician",
    department: "Pediatrics",
    avatar: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
    rating: 4.9,
    experience: 9,
  }
];

// Generate mock doctor appointments
const generateDoctorAppointments = (doctorId: string): DoctorAppointment[] => {
  const appointments: DoctorAppointment[] = [];
  const today = new Date();
  
  // Generate appointments for the past 7 days and next 7 days
  for (let i = -7; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Generate 0-3 appointments per day
    const numAppointments = Math.floor(Math.random() * 4);
    
    for (let j = 0; j < numAppointments; j++) {
      const hour = 9 + Math.floor(Math.random() * 8); // 9 AM to 5 PM
      const minute = Math.random() > 0.5 ? '30' : '00';
      const startTime = `${hour.toString().padStart(2, '0')}:${minute}`;
      const endHour = minute === '30' ? hour + 1 : hour;
      const endTime = `${endHour.toString().padStart(2, '0')}:${minute === '30' ? '00' : '30'}`;
      
      // Determine appointment status based on date
      let status: string;
      if (i < 0) {
        // Past appointments
        status = Math.random() > 0.2 ? 'COMPLETED' : 'CANCELLED';
      } else if (i === 0) {
        // Today's appointments
        const currentHour = new Date().getHours();
        if (hour < currentHour) {
          status = 'COMPLETED';
        } else if (hour === currentHour) {
          status = 'IN_PROGRESS';
        } else {
          status = 'SCHEDULED';
        }
      } else {
        // Future appointments
        status = 'SCHEDULED';
      }
      
      // Generate patient data
      const patientNames = [
        'John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 
        'Michael Wilson', 'Sarah Brown', 'David Miller', 'Jennifer Taylor',
        'James Anderson', 'Patricia Thomas', 'Thomas Jackson', 'Linda White',
        'Charles Harris', 'Barbara Martin', 'Daniel Thompson', 'Susan Garcia'
      ];
      
      const patientName = patientNames[Math.floor(Math.random() * patientNames.length)];
      const patientAge = Math.floor(Math.random() * 60) + 20;
      const patientGender = Math.random() > 0.5 ? 'Male' : 'Female';
      
      // Generate patient history
      const conditions = [
        'Hypertension', 'Type 2 Diabetes', 'Asthma', 'Arthritis', 
        'Migraine', 'Allergies', 'Anxiety', 'Depression', 'Insomnia',
        'High Cholesterol', 'Acid Reflux', 'Back Pain', 'Knee Pain',
        'Shoulder Pain', 'Eczema', 'Psoriasis'
      ];
      
      const patientHistory: string[] = [];
      const numConditions = Math.floor(Math.random() * 3) + 1;
      
      for (let k = 0; k < numConditions; k++) {
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        const year = 2020 + Math.floor(Math.random() * 4);
        patientHistory.push(`${condition} (${year})`);
      }
      
      // Generate contact information
      const patientContact = `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
      const patientEmail = `${patientName.toLowerCase().replace(' ', '.')}@example.com`;
      
      // Generate symptoms
      const symptomsList = [
        'Fever and cough', 'Chest pain', 'Shortness of breath', 'Headache',
        'Back pain', 'Joint pain', 'Rash', 'Allergic reaction', 'Dizziness',
        'Nausea', 'Abdominal pain', 'Fatigue', 'Insomnia', 'Anxiety',
        'Depression', 'High blood pressure', 'Diabetes symptoms'
      ];
      
      const symptoms = symptomsList[Math.floor(Math.random() * symptomsList.length)];
      
      // Generate urgency
      const urgencyLevels = ['LOW', 'MEDIUM', 'HIGH'];
      const urgency = urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)];
      
      // Generate queue number
      const queueNumber = Math.floor(Math.random() * 20) + 1;
      
      // Create the appointment
      appointments.push({
        id: uuidv4(),
        patientId: `patient${Math.floor(Math.random() * 1000) + 1}`,
        patientName,
        doctorId,
        doctorName: mockDoctors.find(d => d.id === doctorId)?.name || 'Unknown Doctor',
        department: mockDoctors.find(d => d.id === doctorId)?.department || 'Unknown Department',
        date: dateStr,
        timeSlotId: uuidv4(),
        startTime,
        endTime,
        symptoms,
        urgency,
        status,
        queueNumber,
        // Additional doctor-specific fields
        patientAge,
        patientGender,
        patientHistory,
        patientContact,
        patientEmail,
        notes: status === 'COMPLETED' ? 'Patient responded well to treatment. Follow-up recommended in 3 months.' : undefined,
        diagnosis: status === 'COMPLETED' ? 'Diagnosis: ' + conditions[Math.floor(Math.random() * conditions.length)] : undefined,
        prescription: status === 'COMPLETED' ? 'Prescribed medication for symptoms. Take as directed.' : undefined,
        followUpDate: status === 'COMPLETED' ? new Date(date.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined
      });
    }
  }
  
  return appointments;
};

// Mock doctor appointments data
const mockDoctorAppointments: Record<string, DoctorAppointment[]> = {};

// Initialize mock data for each doctor
mockDoctors.forEach(doctor => {
  mockDoctorAppointments[doctor.id] = generateDoctorAppointments(doctor.id);
});

// Mock API functions for doctors
export const mockDoctorApi = {
  // Get a doctor's appointments
  getDoctorAppointments: async (doctorId: string): Promise<DoctorAppointment[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!mockDoctorAppointments[doctorId]) {
      mockDoctorAppointments[doctorId] = generateDoctorAppointments(doctorId);
    }
    
    return mockDoctorAppointments[doctorId];
  },
  
  // Get a doctor's appointments for a specific date
  getDoctorAppointmentsByDate: async (doctorId: string, date: string): Promise<DoctorAppointment[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (!mockDoctorAppointments[doctorId]) {
      mockDoctorAppointments[doctorId] = generateDoctorAppointments(doctorId);
    }
    
    return mockDoctorAppointments[doctorId].filter(apt => apt.date === date);
  },
  
  // Get a doctor's appointments for today
  getDoctorAppointmentsToday: async (doctorId: string): Promise<DoctorAppointment[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!mockDoctorAppointments[doctorId]) {
      mockDoctorAppointments[doctorId] = generateDoctorAppointments(doctorId);
    }
    
    const today = new Date().toISOString().split('T')[0];
    return mockDoctorAppointments[doctorId].filter(apt => apt.date === today);
  },
  
  // Update an appointment (add notes, diagnosis, prescription, etc.)
  updateAppointment: async (appointmentId: string, updates: Partial<DoctorAppointment>): Promise<DoctorAppointment> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Find the appointment in all doctors' appointments
    for (const doctorId in mockDoctorAppointments) {
      const appointmentIndex = mockDoctorAppointments[doctorId].findIndex(apt => apt.id === appointmentId);
      
      if (appointmentIndex !== -1) {
        // Update the appointment
        mockDoctorAppointments[doctorId][appointmentIndex] = {
          ...mockDoctorAppointments[doctorId][appointmentIndex],
          ...updates
        };
        
        return mockDoctorAppointments[doctorId][appointmentIndex];
      }
    }
    
    throw new Error("Appointment not found");
  },
  
  // Complete an appointment
  completeAppointment: async (appointmentId: string, diagnosis: string, prescription: string, notes: string): Promise<DoctorAppointment> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Find the appointment in all doctors' appointments
    for (const doctorId in mockDoctorAppointments) {
      const appointmentIndex = mockDoctorAppointments[doctorId].findIndex(apt => apt.id === appointmentId);
      
      if (appointmentIndex !== -1) {
        // Update the appointment
        const today = new Date();
        const followUpDate = new Date(today);
        followUpDate.setDate(today.getDate() + 90); // 3 months from now
        
        mockDoctorAppointments[doctorId][appointmentIndex] = {
          ...mockDoctorAppointments[doctorId][appointmentIndex],
          status: 'COMPLETED',
          diagnosis,
          prescription,
          notes,
          followUpDate: followUpDate.toISOString().split('T')[0]
        };
        
        return mockDoctorAppointments[doctorId][appointmentIndex];
      }
    }
    
    throw new Error("Appointment not found");
  },
  
  // Cancel an appointment
  cancelAppointment: async (appointmentId: string, reason: string): Promise<DoctorAppointment> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find the appointment in all doctors' appointments
    for (const doctorId in mockDoctorAppointments) {
      const appointmentIndex = mockDoctorAppointments[doctorId].findIndex(apt => apt.id === appointmentId);
      
      if (appointmentIndex !== -1) {
        // Update the appointment
        mockDoctorAppointments[doctorId][appointmentIndex] = {
          ...mockDoctorAppointments[doctorId][appointmentIndex],
          status: 'CANCELLED',
          notes: reason
        };
        
        return mockDoctorAppointments[doctorId][appointmentIndex];
      }
    }
    
    throw new Error("Appointment not found");
  },
  
  // Get doctor profile
  getDoctorProfile: async (doctorId: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const doctor = mockDoctors.find(d => d.id === doctorId);
    
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    
    return doctor;
  },
  
  // Get all doctors
  getAllDoctors: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockDoctors;
  },
  
  // Get doctors by department
  getDoctorsByDepartment: async (department: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return mockDoctors.filter(d => d.department === department);
  }
}; 