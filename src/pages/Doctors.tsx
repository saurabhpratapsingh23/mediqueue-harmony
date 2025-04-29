import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppCard } from "@/components/ui/AppCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, Star, UserRound, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface Doctor {
  id: string;
  name: string;
  department: string;
  specialty: string;
  experience: string;
  availability: string;
  rating: number;
  image?: string;
}

const Doctors = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
          throw new Error("API URL not configured");
        }

        const response = await fetch(`${apiUrl}/api/doctors`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }

        const data = await response.json();
        setDoctors(data);
        
        // Extract unique departments from the doctors data
        const uniqueDepartments = [...new Set(data.map((doctor: Doctor) => doctor.department))] as string[];
        setDepartments(uniqueDepartments);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch doctors";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);
  
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === "all" || doctor.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  const handleBookAppointment = (doctorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/book-appointment?doctor=${doctorId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 pt-16 md:pt-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading doctors...</p>
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
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Our Doctors</h1>
            <p className="text-muted-foreground">Find and book appointments with qualified healthcare professionals</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or specialty"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map(doctor => (
            <AppCard 
              key={doctor.id} 
              variant="glass"
              hover="subtle"
              className="cursor-pointer"
              onClick={() => navigate(`/doctors/${doctor.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <div className="mb-4 flex flex-col sm:flex-row gap-4 items-center">
                    <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserRound className="h-12 w-12 text-blue-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{doctor.name}</h2>
                      <p className="text-sm text-blue-600">{doctor.department}</p>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm ml-1">{doctor.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 flex-grow mb-4">
                    <p className="text-sm"><strong>Specialty:</strong> {doctor.specialty}</p>
                    <p className="text-sm"><strong>Experience:</strong> {doctor.experience}</p>
                    <p className="text-sm"><strong>Availability:</strong> {doctor.availability}</p>
                  </div>
                  
                  <Button 
                    onClick={(e) => handleBookAppointment(doctor.id, e)}
                    className="w-full"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Appointment
                  </Button>
                </div>
              </CardContent>
            </AppCard>
          ))}
        </div>
        
        {filteredDoctors.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="mb-4">No doctors found matching your search criteria.</p>
              <Button onClick={() => {
                setSearchTerm("");
                setDepartmentFilter("");
              }}>View All Doctors</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Doctors;
