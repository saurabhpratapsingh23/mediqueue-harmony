import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Hospital } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface Department {
  id: string;
  name: string;
  description: string;
  doctors: number;
  waitTime: string;
}

const initialDepartments: Department[] = [
  {
    id: "cardio",
    name: "Cardiology",
    description: "Specialized care for heart and cardiovascular conditions.",
    doctors: 7,
    waitTime: "~20 min",
  },
  {
    id: "ortho",
    name: "Orthopedics",
    description: "Treatment for bones, joints, ligaments, tendons, and muscles.",
    doctors: 5,
    waitTime: "~35 min",
  },
  {
    id: "neuro",
    name: "Neurology",
    description: "Diagnosis and treatment of disorders of the nervous system.",
    doctors: 4,
    waitTime: "~45 min",
  },
];

const ManageDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const { user } = useAuth();

  const handleAddDepartment = () => {
    if (!formData.name || !formData.description) {
      toast.error("Please fill in all fields");
      return;
    }

    const newDepartment: Department = {
      id: formData.name.toLowerCase().replace(/\s+/g, "-"),
      name: formData.name,
      description: formData.description,
      doctors: 0,
      waitTime: "~30 min",
    };

    setDepartments([...departments, newDepartment]);
    setFormData({ name: "", description: "" });
    setIsAddDialogOpen(false);
    toast.success("Department added successfully");
  };

  const handleEditDepartment = () => {
    if (!editingDepartment || !formData.name || !formData.description) {
      toast.error("Please fill in all fields");
      return;
    }

    const updatedDepartments = departments.map((dept) =>
      dept.id === editingDepartment.id
        ? {
            ...dept,
            name: formData.name,
            description: formData.description,
          }
        : dept
    );

    setDepartments(updatedDepartments);
    setFormData({ name: "", description: "" });
    setEditingDepartment(null);
    setIsEditDialogOpen(false);
    toast.success("Department updated successfully");
  };

  const handleDeleteDepartment = (id: string) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      setDepartments(departments.filter((dept) => dept.id !== id));
      toast.success("Department deleted successfully");
    }
  };

  const openEditDialog = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description,
    });
    setIsEditDialogOpen(true);
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pt-16 md:pt-24">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Manage Departments</h1>
            <p className="text-muted-foreground">Add, edit, or remove departments</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Department</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Department Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter department name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter department description"
                  />
                </div>
                <Button onClick={handleAddDepartment} className="w-full">
                  Add Department
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department) => (
            <Card key={department.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">
                  {department.name}
                </CardTitle>
                <Hospital className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {department.description}
                </p>
                <div className="flex justify-between text-sm mb-4">
                  <span>{department.doctors} doctors</span>
                  <span>Wait time: {department.waitTime}</span>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(department)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteDepartment(department.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Department</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Department Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter department name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter department description"
                />
              </div>
              <Button onClick={handleEditDepartment} className="w-full">
                Update Department
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ManageDepartments; 