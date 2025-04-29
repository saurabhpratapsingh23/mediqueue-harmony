import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Calendar, Clock, Users, Stethoscope, AlertCircle, Settings, Bell, FileText } from "lucide-react";

// Mock doctor data - in a real app, this would come from authentication
const MOCK_DOCTOR = {
  id: "doctor123",
  name: "Dr. Sarah Thompson",
  email: "sarah.thompson@mediqueue.com",
  phone: "+1 (555) 123-4567",
  department: "Cardiology",
  specialization: "Cardiologist",
  bio: "Dr. Thompson has over 15 years of experience in cardiology. She specializes in preventive cardiology and has published numerous research papers on heart health.",
  education: [
    { degree: "MD", institution: "Harvard Medical School", year: "2005" },
    { degree: "Residency", institution: "Johns Hopkins Hospital", year: "2008" },
    { degree: "Fellowship", institution: "Mayo Clinic", year: "2010" }
  ],
  certifications: [
    "American Board of Internal Medicine",
    "American College of Cardiology",
    "Advanced Cardiac Life Support (ACLS)"
  ],
  avatar: "https://randomuser.me/api/portraits/women/44.jpg"
};

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(MOCK_DOCTOR);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(MOCK_DOCTOR);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({ ...profile });
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Doctor Profile</h1>
          <Button onClick={() => navigate("/doctor-dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <Tabs defaultValue="profile" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{profile.name}</CardTitle>
                    <CardDescription>{profile.specialization} - {profile.department}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={editedProfile.name} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          value={editedProfile.email} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={editedProfile.phone} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input 
                          id="department" 
                          name="department" 
                          value={editedProfile.department} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input 
                          id="specialization" 
                          name="specialization" 
                          value={editedProfile.specialization} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        name="bio" 
                        value={editedProfile.bio} 
                        onChange={handleInputChange} 
                        rows={4}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Contact Information</h3>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Email:</span>
                          <span>{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Phone:</span>
                          <span>{profile.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Bio</h3>
                      <p className="mt-2 text-sm">{profile.bio}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Education</h3>
                      <ul className="mt-2 space-y-2">
                        {profile.education.map((edu, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="font-medium">{edu.degree}</span>
                            <span className="text-muted-foreground">•</span>
                            <span>{edu.institution}</span>
                            <span className="text-muted-foreground">•</span>
                            <span>{edu.year}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Certifications</h3>
                      <ul className="mt-2 space-y-1 text-sm">
                        {profile.certifications.map((cert, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-muted-foreground">•</span>
                            <span>{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleEdit}>
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Settings</CardTitle>
                <CardDescription>Manage your availability and working hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <div>
                        <h3 className="font-medium">Working Days</h3>
                        <p className="text-sm text-muted-foreground">Monday - Friday</p>
                      </div>
                    </div>
                    <Button variant="outline">Edit</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-green-500" />
                      <div>
                        <h3 className="font-medium">Working Hours</h3>
                        <p className="text-sm text-muted-foreground">9:00 AM - 5:00 PM</p>
                      </div>
                    </div>
                    <Button variant="outline">Edit</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-purple-500" />
                      <div>
                        <h3 className="font-medium">Appointment Duration</h3>
                        <p className="text-sm text-muted-foreground">30 minutes</p>
                      </div>
                    </div>
                    <Button variant="outline">Edit</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Stethoscope className="h-5 w-5 text-red-500" />
                      <div>
                        <h3 className="font-medium">Break Time</h3>
                        <p className="text-sm text-muted-foreground">12:00 PM - 1:00 PM</p>
                      </div>
                    </div>
                    <Button variant="outline">Edit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-amber-500" />
                      <div>
                        <h3 className="font-medium">Notifications</h3>
                        <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
                      </div>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-indigo-500" />
                      <div>
                        <h3 className="font-medium">Document Templates</h3>
                        <p className="text-sm text-muted-foreground">Manage your document templates</p>
                      </div>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5 text-gray-500" />
                      <div>
                        <h3 className="font-medium">Privacy Settings</h3>
                        <p className="text-sm text-muted-foreground">Manage your privacy and security settings</p>
                      </div>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorProfile; 