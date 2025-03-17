
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppCard } from "@/components/ui/AppCard";
import { Input } from "@/components/ui/input";
import { Hospital, Users, Calendar, Search } from "lucide-react";

interface Department {
  id: string;
  name: string;
  description: string;
  doctors: number;
  waitTime: string;
  image?: string;
}

const departments: Department[] = [
  {
    id: "cardio",
    name: "Cardiology",
    description: "Specialized care for heart and cardiovascular conditions.",
    doctors: 7,
    waitTime: "~20 min",
    image: "/placeholder.svg"
  },
  {
    id: "ortho",
    name: "Orthopedics",
    description: "Treatment for bones, joints, ligaments, tendons, and muscles.",
    doctors: 5,
    waitTime: "~35 min",
    image: "/placeholder.svg"
  },
  {
    id: "neuro",
    name: "Neurology",
    description: "Diagnosis and treatment of disorders of the nervous system.",
    doctors: 4,
    waitTime: "~45 min",
    image: "/placeholder.svg"
  },
  {
    id: "dermo",
    name: "Dermatology",
    description: "Care for conditions related to skin, hair, and nails.",
    doctors: 3,
    waitTime: "~15 min",
    image: "/placeholder.svg"
  },
  {
    id: "pedia",
    name: "Pediatrics",
    description: "Healthcare for infants, children, and adolescents.",
    doctors: 6,
    waitTime: "~25 min",
    image: "/placeholder.svg"
  },
  {
    id: "ophthal",
    name: "Ophthalmology",
    description: "Diagnosis and treatment of eye disorders.",
    doctors: 4,
    waitTime: "~30 min",
    image: "/placeholder.svg"
  }
];

const Departments = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Departments</h1>
            <p className="text-muted-foreground">Browse all medical departments available at MediQ</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search departments"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-[300px] pl-10"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map(department => (
            <AppCard 
              key={department.id} 
              variant="glass"
              hover="lift"
              className="cursor-pointer"
              onClick={() => navigate(`/departments/${department.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <div className="h-40 rounded-md bg-blue-100 flex items-center justify-center">
                      <Hospital className="h-16 w-16 text-blue-500" />
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-semibold mb-2">{department.name}</h2>
                  <p className="text-muted-foreground flex-grow mb-4">{department.description}</p>
                  
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{department.doctors} doctors</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Current wait: {department.waitTime}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </AppCard>
          ))}
        </div>
        
        {filteredDepartments.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="mb-4">No departments found matching your search criteria.</p>
              <Button onClick={() => setSearchTerm("")}>View All Departments</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Departments;
