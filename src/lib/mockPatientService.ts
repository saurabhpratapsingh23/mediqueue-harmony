import { v4 as uuidv4 } from 'uuid';

// Define interfaces for patient data
export interface PatientRecord {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  contactNumber: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    contactNumber: string;
  };
  medicalHistory: {
    conditions: string[];
    allergies: string[];
    medications: string[];
    surgeries: {
      procedure: string;
      date: string;
      hospital: string;
    }[];
  };
  appointments: {
    id: string;
    date: string;
    doctorId: string;
    doctorName: string;
    department: string;
    diagnosis: string;
    prescription: string;
    notes: string;
  }[];
  labResults: {
    id: string;
    date: string;
    testName: string;
    result: string;
    referenceRange: string;
    status: 'Normal' | 'Abnormal';
  }[];
  insurance: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
}

// Generate mock patient records
const generateMockPatients = (): PatientRecord[] => {
  const patients: PatientRecord[] = [];
  
  // Sample data for generating realistic patient records
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'William', 'Emma'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const conditions = ['Hypertension', 'Type 2 Diabetes', 'Asthma', 'Arthritis', 'Migraine', 'Allergies', 'Anxiety', 'Depression', 'Insomnia', 'High Cholesterol'];
  const allergies = ['Penicillin', 'Peanuts', 'Shellfish', 'Latex', 'Pollen', 'Dust mites', 'Eggs', 'Soy'];
  const medications = ['Metformin', 'Lisinopril', 'Atorvastatin', 'Albuterol', 'Sertraline', 'Ibuprofen', 'Amlodipine', 'Insulin'];
  const departments = ['Cardiology', 'Orthopedics', 'Neurology', 'Dermatology', 'Pediatrics', 'Ophthalmology', 'ENT', 'General Medicine'];
  const labTests = ['Complete Blood Count', 'Lipid Panel', 'HbA1c', 'Thyroid Function', 'Liver Function', 'Kidney Function', 'Vitamin D', 'Iron Studies'];
  
  // Generate 20 mock patients
  for (let i = 0; i < 20; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    
    // Generate a random date of birth (between 18 and 80 years ago)
    const today = new Date();
    const minAge = 18;
    const maxAge = 80;
    const minDate = new Date(today.getFullYear() - maxAge, 0, 1);
    const maxDate = new Date(today.getFullYear() - minAge, 11, 31);
    const randomDate = new Date(minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime()));
    const dateOfBirth = randomDate.toISOString().split('T')[0];
    
    // Generate random medical conditions (1-3)
    const numConditions = Math.floor(Math.random() * 3) + 1;
    const patientConditions = [];
    for (let j = 0; j < numConditions; j++) {
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      if (!patientConditions.includes(condition)) {
        patientConditions.push(condition);
      }
    }
    
    // Generate random allergies (0-2)
    const numAllergies = Math.floor(Math.random() * 3);
    const patientAllergies = [];
    for (let j = 0; j < numAllergies; j++) {
      const allergy = allergies[Math.floor(Math.random() * allergies.length)];
      if (!patientAllergies.includes(allergy)) {
        patientAllergies.push(allergy);
      }
    }
    
    // Generate random medications (1-3)
    const numMedications = Math.floor(Math.random() * 3) + 1;
    const patientMedications = [];
    for (let j = 0; j < numMedications; j++) {
      const medication = medications[Math.floor(Math.random() * medications.length)];
      if (!patientMedications.includes(medication)) {
        patientMedications.push(medication);
      }
    }
    
    // Generate random surgeries (0-2)
    const numSurgeries = Math.floor(Math.random() * 3);
    const patientSurgeries = [];
    for (let j = 0; j < numSurgeries; j++) {
      const surgeryDate = new Date(today.getTime() - Math.random() * 10 * 365 * 24 * 60 * 60 * 1000);
      patientSurgeries.push({
        procedure: `Surgery ${j + 1}`,
        date: surgeryDate.toISOString().split('T')[0],
        hospital: 'General Hospital'
      });
    }
    
    // Generate random appointments (1-5)
    const numAppointments = Math.floor(Math.random() * 5) + 1;
    const patientAppointments = [];
    for (let j = 0; j < numAppointments; j++) {
      const appointmentDate = new Date(today.getTime() - Math.random() * 2 * 365 * 24 * 60 * 60 * 1000);
      const department = departments[Math.floor(Math.random() * departments.length)];
      const doctorId = `doc${Math.floor(Math.random() * 5) + 1}`;
      const doctorName = `Dr. ${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
      
      patientAppointments.push({
        id: uuidv4(),
        date: appointmentDate.toISOString().split('T')[0],
        doctorId,
        doctorName,
        department,
        diagnosis: `Diagnosis for ${patientConditions[Math.floor(Math.random() * patientConditions.length)]}`,
        prescription: `Prescription for ${patientMedications[Math.floor(Math.random() * patientMedications.length)]}`,
        notes: 'Patient reported improvement in symptoms.'
      });
    }
    
    // Generate random lab results (1-3)
    const numLabResults = Math.floor(Math.random() * 3) + 1;
    const patientLabResults = [];
    for (let j = 0; j < numLabResults; j++) {
      const labDate = new Date(today.getTime() - Math.random() * 1 * 365 * 24 * 60 * 60 * 1000);
      const testName = labTests[Math.floor(Math.random() * labTests.length)];
      const isAbnormal = Math.random() > 0.7;
      
      patientLabResults.push({
        id: uuidv4(),
        date: labDate.toISOString().split('T')[0],
        testName,
        result: isAbnormal ? 'High' : 'Normal',
        referenceRange: 'Normal Range',
        status: isAbnormal ? 'Abnormal' : 'Normal'
      });
    }
    
    // Create the patient record
    patients.push({
      id: `patient${i + 1}`,
      name,
      dateOfBirth,
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      bloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
      contactNumber: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      address: `${Math.floor(Math.random() * 9999) + 1} Main St, Anytown, USA`,
      emergencyContact: {
        name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        relationship: Math.random() > 0.5 ? 'Spouse' : 'Sibling',
        contactNumber: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
      },
      medicalHistory: {
        conditions: patientConditions,
        allergies: patientAllergies,
        medications: patientMedications,
        surgeries: patientSurgeries
      },
      appointments: patientAppointments,
      labResults: patientLabResults,
      insurance: {
        provider: 'Health Insurance Co.',
        policyNumber: `POL-${Math.floor(Math.random() * 900000) + 100000}`,
        expiryDate: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString().split('T')[0]
      }
    });
  }
  
  return patients;
};

// Mock patient data
const mockPatients = generateMockPatients();

// Mock API functions for patient records
export const mockPatientApi = {
  // Get all patients
  getAllPatients: async (): Promise<PatientRecord[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPatients;
  },
  
  // Search patients by name or ID
  searchPatients: async (query: string): Promise<PatientRecord[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query) {
      return mockPatients;
    }
    
    const lowercaseQuery = query.toLowerCase();
    return mockPatients.filter(patient => 
      patient.name.toLowerCase().includes(lowercaseQuery) || 
      patient.id.toLowerCase().includes(lowercaseQuery)
    );
  },
  
  // Get a patient by ID
  getPatientById: async (patientId: string): Promise<PatientRecord | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const patient = mockPatients.find(p => p.id === patientId);
    return patient || null;
  },
  
  // Add a new patient
  addPatient: async (patient: Omit<PatientRecord, 'id'>): Promise<PatientRecord> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newPatient: PatientRecord = {
      ...patient,
      id: `patient${mockPatients.length + 1}`
    };
    
    mockPatients.push(newPatient);
    return newPatient;
  },
  
  // Update a patient record
  updatePatient: async (patientId: string, updates: Partial<PatientRecord>): Promise<PatientRecord | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockPatients.findIndex(p => p.id === patientId);
    if (index === -1) {
      return null;
    }
    
    mockPatients[index] = {
      ...mockPatients[index],
      ...updates
    };
    
    return mockPatients[index];
  }
}; 