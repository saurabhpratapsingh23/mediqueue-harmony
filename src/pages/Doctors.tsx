
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppCard } from "@/components/ui/AppCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, Star, UserRound } from "lucide-react";

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

const doctors: Doctor[] = [
  {
    id: "dr1",
    name: "Dr. Sarah Thompson",
    department: "Cardiology",
    specialty: "Heart Failure, Arrhythmias",
    experience: "15 years",
    availability: "Mon, Wed, Fri",
    rating: 4.8,
    image: "/placeholder.svg"
  },
  {
    id: "dr2",
    name: "Dr. Michael Brown",
    department: "Orthopedics",
    specialty: "Sports Medicine, Joint Replacement",
    experience: "12 years",
    availability: "Tue, Thu, Sat",
    rating: 4.7,
    image: "/placeholder.svg"
  },
  {
    id: "dr3",
    name: "Dr. Jennifer Davis",
    department: "Neurology",
    specialty: "Headache, Epilepsy",
    experience: "10 years",
    availability: "Mon, Tue, Thu",
    rating: 4.9,
    image: "/placeholder.svg"
  },
  {
    id: "dr4",
    name: "Dr. Robert Wilson",
    department: "Dermatology",
    specialty: "Cosmetic Dermatology, Skin Cancer",
    experience: "8 years",
    availability: "Wed, Fri, Sat",
    rating: 4.6,
    image: "/placeholder.svg"
  },
  {
    id: "dr5",
    name: "Dr. Emma Johnson",
    department: "Pediatrics",
    specialty: "Neonatology, Developmental Disorders",
    experience: "14 years",
    availability: "Mon, Wed, Fri",
    rating: 4.9,
    image: "/placeholder.svg"
  },
  {
    id: "dr6",
    name: "Dr. John Smith",
    department: "Ophthalmology",
    specialty: "Cataract Surgery, Glaucoma",
    experience: "20 years",
    availability: "Tue, Thu",
    rating: 4.8,
    image: "/placeholder.svg"
  }
];

const Doctors = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  
  const departments = [...new Set(doctors.map(doctor => doctor.department))];
  
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === "" || doctor.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  const handleBookAppointment = (doctorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/book-appointment?doctor=${doctorId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
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
              <SelectItem value="">All Departments</SelectItem>
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
