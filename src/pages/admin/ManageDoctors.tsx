import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, UserRound, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

const initialDoctors: Doctor[] = [
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
];

const departments = [
  "Cardiology",
  "Orthopedics",
  "Neurology",
  "Dermatology",
  "Pediatrics",
  "Ophthalmology"
];

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    specialty: "",
    experience: "",
    availability: "",
    rating: 4.5,
  });

  const handleAddDoctor = () => {
    if (!formData.name || !formData.department || !formData.specialty || !formData.experience || !formData.availability) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newDoctor: Doctor = {
      id: `dr${doctors.length + 1}`,
      name: formData.name,
      department: formData.department,
      specialty: formData.specialty,
      experience: formData.experience,
      availability: formData.availability,
      rating: formData.rating,
      image: "/placeholder.svg"
    };

    setDoctors([...doctors, newDoctor]);
    setFormData({
      name: "",
      department: "",
      specialty: "",
      experience: "",
      availability: "",
      rating: 4.5,
    });
    setIsAddDialogOpen(false);
    toast.success("Doctor added successfully");
  };

  const handleEditDoctor = () => {
    if (!editingDoctor || !formData.name || !formData.department || !formData.specialty || !formData.experience || !formData.availability) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedDoctors = doctors.map((doctor) =>
      doctor.id === editingDoctor.id
        ? {
            ...doctor,
            name: formData.name,
            department: formData.department,
            specialty: formData.specialty,
            experience: formData.experience,
            availability: formData.availability,
            rating: formData.rating,
          }
        : doctor
    );

    setDoctors(updatedDoctors);
    setFormData({
      name: "",
      department: "",
      specialty: "",
      experience: "",
      availability: "",
      rating: 4.5,
    });
    setEditingDoctor(null);
    setIsEditDialogOpen(false);
    toast.success("Doctor updated successfully");
  };

  const handleDeleteDoctor = (id: string) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      setDoctors(doctors.filter((doctor) => doctor.id !== id));
      toast.success("Doctor deleted successfully");
    }
  };

  const openEditDialog = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      department: doctor.department,
      specialty: doctor.specialty,
      experience: doctor.experience,
      availability: doctor.availability,
      rating: doctor.rating,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pt-16 md:pt-24">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Manage Doctors</h1>
            <p className="text-muted-foreground">Add, edit, or remove doctors</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Doctor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Doctor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Doctor Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter doctor name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    value={formData.department} 
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Input
                    id="specialty"
                    value={formData.specialty}
                    onChange={(e) =>
                      setFormData({ ...formData, specialty: e.target.value })
                    }
                    placeholder="Enter specialty"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                    placeholder="e.g. 10 years"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Input
                    id="availability"
                    value={formData.availability}
                    onChange={(e) =>
                      setFormData({ ...formData, availability: e.target.value })
                    }
                    placeholder="e.g. Mon, Wed, Fri"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) =>
                        setFormData({ ...formData, rating: parseFloat(e.target.value) })
                      }
                      className="w-20"
                    />
                  </div>
                </div>
                <Button onClick={handleAddDoctor} className="w-full">
                  Add Doctor
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">
                  {doctor.name}
                </CardTitle>
                <UserRound className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-600 mb-1">{doctor.department}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {doctor.specialty}
                </p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm"><strong>Experience:</strong> {doctor.experience}</p>
                  <p className="text-sm"><strong>Availability:</strong> {doctor.availability}</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-sm">{doctor.rating}</span>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(doctor)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteDoctor(doctor.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Doctor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Doctor Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter doctor name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger id="edit-department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-specialty">Specialty</Label>
                <Input
                  id="edit-specialty"
                  value={formData.specialty}
                  onChange={(e) =>
                    setFormData({ ...formData, specialty: e.target.value })
                  }
                  placeholder="Enter specialty"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-experience">Experience</Label>
                <Input
                  id="edit-experience"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  placeholder="e.g. 10 years"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-availability">Availability</Label>
                <Input
                  id="edit-availability"
                  value={formData.availability}
                  onChange={(e) =>
                    setFormData({ ...formData, availability: e.target.value })
                  }
                  placeholder="e.g. Mon, Wed, Fri"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-rating">Rating</Label>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <Input
                    id="edit-rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: parseFloat(e.target.value) })
                    }
                    className="w-20"
                  />
                </div>
              </div>
              <Button onClick={handleEditDoctor} className="w-full">
                Update Doctor
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ManageDoctors; 