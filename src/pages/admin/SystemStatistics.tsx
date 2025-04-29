import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Users, 
  UserCheck, 
  UserX, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  BarChart3,
  Download,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for statistics
const mockPatientVisits = {
  today: 42,
  thisWeek: 287,
  thisMonth: 1245,
  lastMonth: 1187,
  lastTwoMonths: 2432,
  lastThreeMonths: 3621,
  trend: "+4.9%",
};

const mockDoctorAttendance = [
  { id: "dr1", name: "Dr. Sarah Thompson", department: "Cardiology", present: true, patients: 8, rating: 4.8 },
  { id: "dr2", name: "Dr. Michael Brown", department: "Orthopedics", present: true, patients: 6, rating: 4.7 },
  { id: "dr3", name: "Dr. Jennifer Davis", department: "Neurology", present: false, patients: 0, rating: 4.9 },
  { id: "dr4", name: "Dr. Robert Wilson", department: "Pediatrics", present: true, patients: 10, rating: 4.6 },
  { id: "dr5", name: "Dr. Emily Johnson", department: "Dermatology", present: true, patients: 5, rating: 4.5 },
];

const mockFinancialData = {
  today: 12500,
  thisWeek: 87500,
  thisMonth: 375000,
  lastMonth: 362000,
  lastTwoMonths: 737000,
  lastThreeMonths: 1105000,
  trend: "+3.6%",
};

const mockDepartmentStats = [
  { name: "Cardiology", patients: 245, revenue: 122500, waitTime: "~20 min" },
  { name: "Orthopedics", patients: 187, revenue: 93500, waitTime: "~35 min" },
  { name: "Neurology", patients: 156, revenue: 78000, waitTime: "~45 min" },
  { name: "Pediatrics", patients: 312, revenue: 156000, waitTime: "~15 min" },
  { name: "Dermatology", patients: 198, revenue: 99000, waitTime: "~25 min" },
];

const SystemStatistics = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("thisMonth");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pt-16 md:pt-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">System Statistics</h1>
            <p className="text-muted-foreground">Monitor hospital performance metrics</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="lastTwoMonths">Last 2 Months</SelectItem>
                <SelectItem value="lastThreeMonths">Last 3 Months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patient Visits</TabsTrigger>
            <TabsTrigger value="doctors">Doctor Performance</TabsTrigger>
            <TabsTrigger value="financial">Financial Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(mockPatientVisits.thisMonth)}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className={cn(mockPatientVisits.trend.startsWith('+') ? "text-green-500" : "text-red-500")}>
                      {mockPatientVisits.trend}
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Doctors</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockDoctorAttendance.filter(doc => doc.present).length}/{mockDoctorAttendance.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {mockDoctorAttendance.filter(doc => doc.present).length} present today
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Wait Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">~28 min</div>
                  <p className="text-xs text-muted-foreground">
                    Across all departments
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(mockFinancialData.thisMonth)}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className={cn(mockFinancialData.trend.startsWith('+') ? "text-green-500" : "text-red-500")}>
                      {mockFinancialData.trend}
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Department Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockDepartmentStats.map((dept) => (
                      <div key={dept.name} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{dept.name}</p>
                          <p className="text-sm text-muted-foreground">Wait time: {dept.waitTime}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatNumber(dept.patients)} patients</p>
                          <p className="text-sm text-muted-foreground">{formatCurrency(dept.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Doctor Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockDoctorAttendance.map((doctor) => (
                      <div key={doctor.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-sm text-muted-foreground">{doctor.department}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium">{doctor.patients} patients</p>
                            <p className="text-sm text-muted-foreground">Rating: {doctor.rating}</p>
                          </div>
                          <div className={cn(
                            "h-3 w-3 rounded-full",
                            doctor.present ? "bg-green-500" : "bg-red-500"
                          )} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Patient Visits Tab */}
          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Visit Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Today</h3>
                    <p className="text-3xl font-bold">{formatNumber(mockPatientVisits.today)}</p>
                    <p className="text-sm text-muted-foreground">Patient visits</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">This Week</h3>
                    <p className="text-3xl font-bold">{formatNumber(mockPatientVisits.thisWeek)}</p>
                    <p className="text-sm text-muted-foreground">Patient visits</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">This Month</h3>
                    <p className="text-3xl font-bold">{formatNumber(mockPatientVisits.thisMonth)}</p>
                    <p className="text-sm text-muted-foreground">Patient visits</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Last Month</h3>
                    <p className="text-3xl font-bold">{formatNumber(mockPatientVisits.lastMonth)}</p>
                    <p className="text-sm text-muted-foreground">Patient visits</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Last 2 Months</h3>
                    <p className="text-3xl font-bold">{formatNumber(mockPatientVisits.lastTwoMonths)}</p>
                    <p className="text-sm text-muted-foreground">Patient visits</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Last 3 Months</h3>
                    <p className="text-3xl font-bold">{formatNumber(mockPatientVisits.lastThreeMonths)}</p>
                    <p className="text-sm text-muted-foreground">Patient visits</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patient Visits by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDepartmentStats.map((dept) => (
                    <div key={dept.name} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{dept.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatNumber(dept.patients)} patients</p>
                        <p className="text-sm text-muted-foreground">Wait time: {dept.waitTime}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Doctor Performance Tab */}
          <TabsContent value="doctors" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Doctor Performance</h2>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="dermatology">Dermatology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Doctor Attendance & Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDoctorAttendance.map((doctor) => (
                    <div key={doctor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "h-3 w-3 rounded-full",
                          doctor.present ? "bg-green-500" : "bg-red-500"
                        )} />
                        <div>
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-sm text-muted-foreground">{doctor.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="font-medium">{doctor.patients}</p>
                          <p className="text-xs text-muted-foreground">Patients</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{doctor.rating}</p>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{doctor.present ? "Present" : "Absent"}</p>
                          <p className="text-xs text-muted-foreground">Status</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Reports Tab */}
          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Today</h3>
                    <p className="text-3xl font-bold">{formatCurrency(mockFinancialData.today)}</p>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">This Week</h3>
                    <p className="text-3xl font-bold">{formatCurrency(mockFinancialData.thisWeek)}</p>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">This Month</h3>
                    <p className="text-3xl font-bold">{formatCurrency(mockFinancialData.thisMonth)}</p>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Last Month</h3>
                    <p className="text-3xl font-bold">{formatCurrency(mockFinancialData.lastMonth)}</p>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Last 2 Months</h3>
                    <p className="text-3xl font-bold">{formatCurrency(mockFinancialData.lastTwoMonths)}</p>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Last 3 Months</h3>
                    <p className="text-3xl font-bold">{formatCurrency(mockFinancialData.lastThreeMonths)}</p>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDepartmentStats.map((dept) => (
                    <div key={dept.name} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{dept.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(dept.revenue)}</p>
                        <p className="text-sm text-muted-foreground">{formatNumber(dept.patients)} patients</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SystemStatistics; 