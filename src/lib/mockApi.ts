
// Types
export type Department = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  department: string;
  avatar: string;
  rating: number;
  experience: number;
  availableTimes?: TimeSlot[];
};

export type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
  available: boolean;
};

export type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  symptoms?: string;
  urgency?: "low" | "medium" | "high" | "emergency";
  queueNumber?: number;
  estimatedWaitTime?: number; // in minutes
};

export type QueueItem = {
  id: string;
  appointmentId: string;
  patientName: string;
  doctorName: string;
  department: string;
  queueNumber: number;
  status: "waiting" | "in-progress" | "completed";
  estimatedWaitTime: number; // in minutes
  priority: "normal" | "urgent" | "emergency";
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: "info" | "appointment" | "queue" | "reminder" | "system";
};

export type MedicalRecord = {
  id: string;
  patientId: string;
  date: string;
  doctorName: string;
  diagnosis: string;
  prescription?: string;
  notes?: string;
};

// Mock data
const mockDepartments: Department[] = [
  {
    id: "dept1",
    name: "Cardiology",
    description: "Diagnosis and treatment of heart diseases",
    icon: "heart",
  },
  {
    id: "dept2",
    name: "Orthopedics",
    description: "Treatment of musculoskeletal disorders",
    icon: "bone",
  },
  {
    id: "dept3",
    name: "Neurology",
    description: "Diagnosis and treatment of nervous system disorders",
    icon: "brain",
  },
  {
    id: "dept4",
    name: "Dermatology",
    description: "Diagnosis and treatment of skin disorders",
    icon: "clipboard",
  },
  {
    id: "dept5",
    name: "Pediatrics",
    description: "Medical care for infants, children, and adolescents",
    icon: "baby",
  },
  {
    id: "dept6",
    name: "Ophthalmology",
    description: "Diagnosis and treatment of eye disorders",
    icon: "eye",
  },
];

const mockDoctors: Doctor[] = [
  {
    id: "doc1",
    name: "Dr. John Smith",
    specialization: "Cardiologist",
    department: "dept1",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZG9jdG9yfGVufDB8fDB8fHww",
    rating: 4.8,
    experience: 15,
  },
  {
    id: "doc2",
    name: "Dr. Sarah Johnson",
    specialization: "Orthopedic Surgeon",
    department: "dept2",
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
    rating: 4.9,
    experience: 12,
  },
  {
    id: "doc3",
    name: "Dr. Michael Chen",
    specialization: "Neurologist",
    department: "dept3",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
    rating: 4.7,
    experience: 10,
  },
  {
    id: "doc4",
    name: "Dr. Emily Patel",
    specialization: "Dermatologist",
    department: "dept4",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
    rating: 4.6,
    experience: 8,
  },
  {
    id: "doc5",
    name: "Dr. Lisa Wong",
    specialization: "Pediatrician",
    department: "dept5",
    avatar: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
    rating: 4.9,
    experience: 9,
  },
  {
    id: "doc6",
    name: "Dr. Robert Brown",
    specialization: "Ophthalmologist",
    department: "dept6",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D",
    rating: 4.7,
    experience: 14,
  },
];

// Generate available time slots for the next 7 days
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const today = new Date();
  
  for (let day = 0; day < 7; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    const dateStr = date.toISOString().split("T")[0];
    
    // Morning slots
    for (let hour = 9; hour < 12; hour++) {
      slots.push({
        id: `slot-${dateStr}-${hour}`,
        date: dateStr,
        startTime: `${hour}:00`,
        endTime: `${hour}:30`,
        available: Math.random() > 0.3, // 70% chance of being available
      });
      slots.push({
        id: `slot-${dateStr}-${hour}-30`,
        date: dateStr,
        startTime: `${hour}:30`,
        endTime: `${hour + 1}:00`,
        available: Math.random() > 0.3,
      });
    }
    
    // Afternoon slots
    for (let hour = 14; hour < 17; hour++) {
      slots.push({
        id: `slot-${dateStr}-${hour}`,
        date: dateStr,
        startTime: `${hour}:00`,
        endTime: `${hour}:30`,
        available: Math.random() > 0.3,
      });
      slots.push({
        id: `slot-${dateStr}-${hour}-30`,
        date: dateStr,
        startTime: `${hour}:30`,
        endTime: `${hour + 1}:00`,
        available: Math.random() > 0.3,
      });
    }
  }
  
  return slots;
};

// Set available times for each doctor
const doctorsWithAvailability = mockDoctors.map(doctor => ({
  ...doctor,
  availableTimes: generateTimeSlots(),
}));

// Generate mock appointments
const generateMockAppointments = (userId: string): Appointment[] => {
  const appointments: Appointment[] = [];
  const statuses: Array<"scheduled" | "in-progress" | "completed" | "cancelled"> = [
    "scheduled", "scheduled", "scheduled", "in-progress", "completed"
  ];
  
  for (let i = 0; i < 5; i++) {
    const doctor = mockDoctors[Math.floor(Math.random() * mockDoctors.length)];
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 14) - 7); // Random date between -7 and +7 days
    
    const department = mockDepartments.find(d => d.id === doctor.department);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const urgency = Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low";
    
    appointments.push({
      id: `appt-${i}-${userId}`,
      patientId: userId,
      patientName: "Patient Name", // This would be filled with actual user data
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: department?.name || "Unknown Department",
      date: date.toISOString().split('T')[0],
      time: `${9 + Math.floor(Math.random() * 8)}:${Math.random() > 0.5 ? '30' : '00'}`,
      status,
      urgency: urgency as "low" | "medium" | "high",
      queueNumber: Math.floor(Math.random() * 20) + 1,
      estimatedWaitTime: Math.floor(Math.random() * 60) + 5,
    });
  }
  
  return appointments;
};

// Generate mock queue
const generateMockQueue = (): QueueItem[] => {
  const queue: QueueItem[] = [];
  
  for (let i = 0; i < 15; i++) {
    const doctor = mockDoctors[Math.floor(Math.random() * mockDoctors.length)];
    const department = mockDepartments.find(d => d.id === doctor.department);
    const status = Math.random() > 0.7 ? "in-progress" : Math.random() > 0.3 ? "waiting" : "completed";
    const priority = Math.random() > 0.8 ? "emergency" : Math.random() > 0.7 ? "urgent" : "normal";
    
    queue.push({
      id: `queue-${i}`,
      appointmentId: `appt-mock-${i}`,
      patientName: `Patient ${i + 1}`,
      doctorName: doctor.name,
      department: department?.name || "Unknown Department",
      queueNumber: i + 1,
      status: status as "waiting" | "in-progress" | "completed",
      estimatedWaitTime: Math.floor(Math.random() * 60) + 5,
      priority: priority as "normal" | "urgent" | "emergency",
    });
  }
  
  return queue;
};

// Generate mock notifications
const generateMockNotifications = (userId: string): Notification[] => {
  const notifications: Notification[] = [];
  const types: Array<"info" | "appointment" | "queue" | "reminder" | "system"> = [
    "info", "appointment", "queue", "reminder", "system"
  ];
  
  for (let i = 0; i < 5; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const date = new Date();
    date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 300)); // Random time in the last 5 hours
    
    let title = "", message = "";
    
    switch (type) {
      case "appointment":
        title = "Appointment Reminder";
        message = "Your appointment with Dr. Smith is tomorrow at 10:00 AM.";
        break;
      case "queue":
        title = "Queue Update";
        message = "Your position in the queue has been updated. You are now #3.";
        break;
      case "reminder":
        title = "Medication Reminder";
        message = "Don't forget to take your medication at 2:00 PM today.";
        break;
      case "system":
        title = "System Maintenance";
        message = "The system will be down for maintenance tonight from 2:00 AM to 4:00 AM.";
        break;
      default:
        title = "Information";
        message = "Thank you for using MediQ. We appreciate your trust.";
    }
    
    notifications.push({
      id: `notif-${i}-${userId}`,
      userId,
      title,
      message,
      timestamp: date,
      read: Math.random() > 0.5,
      type,
    });
  }
  
  return notifications;
};

// Generate mock medical records
const generateMockMedicalRecords = (patientId: string): MedicalRecord[] => {
  const records: MedicalRecord[] = [];
  
  for (let i = 0; i < 3; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    
    const doctor = mockDoctors[Math.floor(Math.random() * mockDoctors.length)];
    
    records.push({
      id: `record-${i}-${patientId}`,
      patientId,
      date: date.toISOString().split('T')[0],
      doctorName: doctor.name,
      diagnosis: "Seasonal allergies",
      prescription: "Antihistamine, 10mg daily for 2 weeks",
      notes: "Patient should avoid outdoor activities during high pollen count days."
    });
  }
  
  return records;
};

// Mock API functions
export const mockApi = {
  // Departments
  getDepartments: async (): Promise<Department[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return mockDepartments;
  },
  
  // Doctors
  getDoctors: async (): Promise<Doctor[]> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return doctorsWithAvailability;
  },
  
  getDoctorsByDepartment: async (departmentId: string): Promise<Doctor[]> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return doctorsWithAvailability.filter(doctor => doctor.department === departmentId);
  },
  
  getDoctorById: async (doctorId: string): Promise<Doctor | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return doctorsWithAvailability.find(doctor => doctor.id === doctorId);
  },
  
  // Appointments
  getAppointments: async (userId: string): Promise<Appointment[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return generateMockAppointments(userId);
  },
  
  createAppointment: async (appointmentData: Partial<Appointment>): Promise<Appointment> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a new appointment with the provided data
    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      patientId: appointmentData.patientId || "unknown",
      patientName: appointmentData.patientName || "Unknown Patient",
      doctorId: appointmentData.doctorId || "unknown",
      doctorName: appointmentData.doctorName || "Unknown Doctor",
      department: appointmentData.department || "Unknown Department",
      date: appointmentData.date || new Date().toISOString().split('T')[0],
      time: appointmentData.time || "12:00",
      status: "scheduled",
      symptoms: appointmentData.symptoms,
      urgency: appointmentData.urgency || "medium",
      queueNumber: Math.floor(Math.random() * 20) + 1,
      estimatedWaitTime: Math.floor(Math.random() * 60) + 15,
    };
    
    return newAppointment;
  },
  
  cancelAppointment: async (appointmentId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return true; // Simulate successful cancellation
  },
  
  // Queue
  getQueueStatus: async (): Promise<QueueItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return generateMockQueue();
  },
  
  getUserQueuePosition: async (userId: string, appointmentId: string): Promise<QueueItem | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const queue = generateMockQueue();
    return queue.find(item => item.appointmentId === appointmentId) || null;
  },
  
  // Notifications
  getNotifications: async (userId: string): Promise<Notification[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return generateMockNotifications(userId);
  },
  
  markNotificationAsRead: async (notificationId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return true; // Simulate successful operation
  },
  
  // Medical Records
  getMedicalRecords: async (patientId: string): Promise<MedicalRecord[]> => {
    await new Promise(resolve => setTimeout(resolve, 900));
    return generateMockMedicalRecords(patientId);
  },
  
  // AI Triage (Simulated)
  assessSymptoms: async (symptoms: string): Promise<{ 
    urgency: "low" | "medium" | "high" | "emergency";
    recommendation: string;
  }> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Very simplified symptom assessment logic
    const symptomWords = symptoms.toLowerCase();
    
    if (
      symptomWords.includes("chest pain") || 
      symptomWords.includes("difficulty breathing") || 
      symptomWords.includes("severe bleeding") ||
      symptomWords.includes("unconscious")
    ) {
      return {
        urgency: "emergency",
        recommendation: "Please seek emergency medical attention immediately by calling 911 or going to the nearest emergency room."
      };
    } else if (
      symptomWords.includes("fever") && 
      (symptomWords.includes("cough") || symptomWords.includes("sore throat"))
    ) {
      return {
        urgency: "medium",
        recommendation: "Your symptoms may indicate a respiratory infection. We recommend scheduling an appointment within 24-48 hours."
      };
    } else if (
      symptomWords.includes("headache") ||
      symptomWords.includes("nausea") ||
      symptomWords.includes("dizziness")
    ) {
      return {
        urgency: "medium",
        recommendation: "Your symptoms should be evaluated soon. We recommend scheduling an appointment within 24-48 hours."
      };
    } else {
      return {
        urgency: "low",
        recommendation: "Based on the symptoms described, this appears to be a routine case. Please schedule an appointment at your convenience."
      };
    }
  },
};
