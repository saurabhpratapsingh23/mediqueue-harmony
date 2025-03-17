
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Filter } from "lucide-react";

interface MedicalRecord {
  id: string;
  date: string;
  doctor: string;
  department: string;
  diagnosis: string;
  prescription: string;
  notes?: string;
  attachments?: { name: string; type: string }[];
}

const ViewRecords = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
      return;
    }
    
    // Simulate API call to fetch medical records
    setTimeout(() => {
      const mockRecords: MedicalRecord[] = [
        {
          id: "rec1",
          date: "2023-03-15",
          doctor: "Dr. Sarah Thompson",
          department: "Cardiology",
          diagnosis: "Hypertension",
          prescription: "Lisinopril 10mg daily",
          notes: "Blood pressure: 145/90. Follow-up in 3 months.",
          attachments: [
            { name: "ECG_Report.pdf", type: "pdf" },
            { name: "Blood_Work.pdf", type: "pdf" }
          ]
        },
        {
          id: "rec2",
          date: "2023-01-10",
          doctor: "Dr. Michael Brown",
          department: "Orthopedics",
          diagnosis: "Ankle sprain, grade II",
          prescription: "Ibuprofen 400mg as needed",
          notes: "Apply ice and rest. Physical therapy recommended.",
          attachments: [
            { name: "X-Ray_Results.jpg", type: "image" }
          ]
        },
        {
          id: "rec3",
          date: "2022-11-22",
          doctor: "Dr. Jennifer Davis",
          department: "General Medicine",
          diagnosis: "Upper respiratory infection",
          prescription: "Azithromycin 500mg for 3 days",
          notes: "Symptomatic treatment. Plenty of fluids."
        }
      ];
      setRecords(mockRecords);
      setFilteredRecords(mockRecords);
      setLoading(false);
    }, 1500);
  }, [user, navigate]);
  
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRecords(records);
    } else {
      const filtered = records.filter(record => 
        record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecords(filtered);
    }
  }, [searchTerm, records]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Medical Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Input
                  placeholder="Search by doctor, department, or diagnosis"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
              <Button variant="outline" className="md:w-auto w-full">
                Export All
                <Download className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            {loading ? (
              <div className="py-8 text-center">
                <p>Loading your medical records...</p>
              </div>
            ) : filteredRecords.length > 0 ? (
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Records</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="reports">Test Reports</TabsTrigger>
                  <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-4">
                  {filteredRecords.map(record => (
                    <Card key={record.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{record.diagnosis}</h3>
                              <Badge variant="outline">
                                {new Date(record.date).toLocaleDateString()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {record.department} • {record.doctor}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                        
                        <div className="border-t pt-3 mt-3">
                          <p className="text-sm"><strong>Prescription:</strong> {record.prescription}</p>
                          {record.notes && (
                            <p className="text-sm mt-1"><strong>Notes:</strong> {record.notes}</p>
                          )}
                        </div>
                        
                        {record.attachments && record.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {record.attachments.map((attachment, index) => (
                              <Button 
                                key={index} 
                                variant="outline" 
                                size="sm"
                                className="text-xs"
                              >
                                <FileText className="mr-1 h-3 w-3" />
                                {attachment.name}
                              </Button>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                
                <TabsContent value="recent">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p>Records from the last 3 months will appear here</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reports">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p>Laboratory and test reports will appear here</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="prescriptions">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p>Prescription history will appear here</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="py-8 text-center">
                <p>No records found matching your search criteria.</p>
                <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewRecords;
