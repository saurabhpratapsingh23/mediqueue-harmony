import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Search, User, Calendar, FileText, Activity, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { mockPatientApi, PatientRecord } from '@/lib/mockPatientService';
import { useAuth } from '@/context/AuthContext';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { AppCard } from '@/components/ui/AppCard';
import { AppBadge } from '@/components/ui/AppBadge';
import { AppTabs, AppTabsContent, AppTabsList, AppTabsTrigger } from '@/components/ui/AppTabs';
import { format } from 'date-fns';

const PatientRecords = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Redirect if not a doctor
  useEffect(() => {
    if (user && user.role !== 'doctor') {
      toast.error('Only doctors can access patient records');
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch all patients on initial load
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const data = await mockPatientApi.getAllPatients();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to load patient records');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // If search is empty, fetch all patients
      setIsLoading(true);
      try {
        const data = await mockPatientApi.getAllPatients();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to load patient records');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setIsSearching(true);
    try {
      const results = await mockPatientApi.searchPatients(searchQuery);
      setPatients(results);
      
      if (results.length === 0) {
        toast('No patients found matching your search');
      }
    } catch (error) {
      console.error('Error searching patients:', error);
      toast.error('Failed to search patient records');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle patient selection
  const handleSelectPatient = (patient: PatientRecord) => {
    setSelectedPatient(patient);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    try {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    } catch (error) {
      return 'N/A';
    }
  };

  // Get status badge for lab results
  const getLabStatusBadge = (status: 'Normal' | 'Abnormal') => {
    if (status === 'Normal') {
      return <AppBadge variant="success">Normal</AppBadge>;
    } else {
      return <AppBadge variant="destructive">Abnormal</AppBadge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Search Panel */}
        <div className="w-full md:w-1/3">
          <AppCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">Patient Records</h2>
            
            <div className="mb-6">
              <div className="flex gap-2">
                <AppInput
                  placeholder="Search by name or ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <AppButton 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="shrink-0"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </AppButton>
              </div>
            </div>
            
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading patients...</p>
                </div>
              ) : patients.length === 0 ? (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="mt-2 text-muted-foreground">No patients found</p>
                </div>
              ) : (
                patients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedPatient?.id === patient.id
                        ? 'bg-primary/10 border border-primary'
                        : 'hover:bg-accent border border-transparent'
                    }`}
                    onClick={() => handleSelectPatient(patient)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <User size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">{patient.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ID: {patient.id} • {calculateAge(patient.dateOfBirth)} years
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </AppCard>
        </div>
        
        {/* Patient Details Panel */}
        <div className="w-full md:w-2/3">
          {selectedPatient ? (
            <AppCard className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
                  <p className="text-muted-foreground">
                    ID: {selectedPatient.id} • {selectedPatient.gender} • {selectedPatient.bloodGroup}
                  </p>
                </div>
                <AppBadge variant="outline">
                  {calculateAge(selectedPatient.dateOfBirth)} years
                </AppBadge>
              </div>
              
              <AppTabs defaultValue="personal">
                <AppTabsList className="mb-6">
                  <AppTabsTrigger value="personal">Personal Info</AppTabsTrigger>
                  <AppTabsTrigger value="medical">Medical History</AppTabsTrigger>
                  <AppTabsTrigger value="appointments">Appointments</AppTabsTrigger>
                  <AppTabsTrigger value="lab">Lab Results</AppTabsTrigger>
                </AppTabsList>
                
                {/* Personal Information Tab */}
                <AppTabsContent value="personal">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground w-24">Phone:</span>
                          <span>{selectedPatient.contactNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground w-24">Email:</span>
                          <span>{selectedPatient.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground w-24">Address:</span>
                          <span>{selectedPatient.address}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Emergency Contact</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground w-24">Name:</span>
                          <span>{selectedPatient.emergencyContact.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground w-24">Relationship:</span>
                          <span>{selectedPatient.emergencyContact.relationship}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground w-24">Phone:</span>
                          <span>{selectedPatient.emergencyContact.contactNumber}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Insurance Information</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground w-24">Provider:</span>
                          <span>{selectedPatient.insurance.provider}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground w-24">Policy #:</span>
                          <span>{selectedPatient.insurance.policyNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground w-24">Expiry:</span>
                          <span>{formatDate(selectedPatient.insurance.expiryDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AppTabsContent>
                
                {/* Medical History Tab */}
                <AppTabsContent value="medical">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Medical Conditions</h3>
                      {selectedPatient.medicalHistory.conditions.length > 0 ? (
                        <div className="space-y-2">
                          {selectedPatient.medicalHistory.conditions.map((condition, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Activity size={16} className="text-primary" />
                              <span>{condition}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No medical conditions recorded</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Allergies</h3>
                      {selectedPatient.medicalHistory.allergies.length > 0 ? (
                        <div className="space-y-2">
                          {selectedPatient.medicalHistory.allergies.map((allergy, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <AlertTriangle size={16} className="text-destructive" />
                              <span>{allergy}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No allergies recorded</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Current Medications</h3>
                      {selectedPatient.medicalHistory.medications.length > 0 ? (
                        <div className="space-y-2">
                          {selectedPatient.medicalHistory.medications.map((medication, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <FileText size={16} className="text-primary" />
                              <span>{medication}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No medications recorded</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Surgical History</h3>
                      {selectedPatient.medicalHistory.surgeries.length > 0 ? (
                        <div className="space-y-3">
                          {selectedPatient.medicalHistory.surgeries.map((surgery, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <div className="font-medium">{surgery.procedure}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(surgery.date)} at {surgery.hospital}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No surgical history recorded</p>
                      )}
                    </div>
                  </div>
                </AppTabsContent>
                
                {/* Appointments Tab */}
                <AppTabsContent value="appointments">
                  {selectedPatient.appointments.length > 0 ? (
                    <div className="space-y-4">
                      {selectedPatient.appointments.map((appointment) => (
                        <div key={appointment.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{appointment.department}</h3>
                              <p className="text-sm text-muted-foreground">
                                {appointment.doctorName}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{formatDate(appointment.date)}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(appointment.date)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 space-y-2">
                            <div>
                              <span className="text-muted-foreground">Diagnosis:</span>
                              <p className="mt-1">{appointment.diagnosis}</p>
                            </div>
                            
                            <div>
                              <span className="text-muted-foreground">Prescription:</span>
                              <p className="mt-1">{appointment.prescription}</p>
                            </div>
                            
                            <div>
                              <span className="text-muted-foreground">Notes:</span>
                              <p className="mt-1">{appointment.notes}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
                      <p className="mt-2 text-muted-foreground">No appointment history</p>
                    </div>
                  )}
                </AppTabsContent>
                
                {/* Lab Results Tab */}
                <AppTabsContent value="lab">
                  {selectedPatient.labResults.length > 0 ? (
                    <div className="space-y-4">
                      {selectedPatient.labResults.map((result) => (
                        <div key={result.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{result.testName}</h3>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(result.date)}
                              </p>
                            </div>
                            {getLabStatusBadge(result.status)}
                          </div>
                          
                          <div className="mt-3 space-y-2">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-muted-foreground">Result:</span>
                                <p className="mt-1 font-medium">{result.result}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Reference Range:</span>
                                <p className="mt-1">{result.referenceRange}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 text-muted-foreground mx-auto" />
                      <p className="mt-2 text-muted-foreground">No lab results available</p>
                    </div>
                  )}
                </AppTabsContent>
              </AppTabs>
            </AppCard>
          ) : (
            <AppCard className="p-6 flex flex-col items-center justify-center h-full">
              <User className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Select a Patient</h3>
              <p className="text-muted-foreground text-center">
                Choose a patient from the list to view their medical records
              </p>
            </AppCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientRecords; 