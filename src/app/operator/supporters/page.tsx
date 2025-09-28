"use client";
import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  Navigation,
  Target,
  Activity,
  User,
  Star,
  TrendingUp,
  BarChart3,
  Settings,
  Bell,
  ArrowLeft,
  FileText,
  Camera,
  Download,
  Upload,
  Shield,
  UserPlus,
  UserCheck,
  UserX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/theme-toggle";

export default function OperatorSupportersPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for supporters
  const supporters = [
    {
      id: 1,
      name: "Ahmed Hassan",
      phone: "+252 61 234 5678",
      email: "ahmed.hassan@email.com",
      district: "Hargeisa Central",
      status: "verified",
      registrationDate: "2025-01-15",
      pollingStation: "Hargeisa Central Polling Center",
      documentsUploaded: true,
      lastActive: "2 hours ago",
      assignedOperator: "Ahmed Ali",
      benefits: "Eligible",
      location: "Hargeisa Central",
    },
    {
      id: 2,
      name: "Fatima Ali",
      phone: "+252 61 234 5679",
      email: "fatima.ali@email.com",
      district: "Hargeisa North",
      status: "pending",
      registrationDate: "2025-01-20",
      pollingStation: "Hargeisa North Polling Center",
      documentsUploaded: false,
      lastActive: "1 day ago",
      assignedOperator: "Ahmed Ali",
      benefits: "Under Review",
      location: "Hargeisa North",
    },
    {
      id: 3,
      name: "Omar Mohamed",
      phone: "+252 61 234 5680",
      email: "omar.mohamed@email.com",
      district: "Berbera",
      status: "rejected",
      registrationDate: "2025-01-10",
      pollingStation: "Berbera Polling Center",
      documentsUploaded: true,
      lastActive: "3 days ago",
      assignedOperator: "Ahmed Ali",
      benefits: "Not Eligible",
      location: "Berbera",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "status-success";
      case "pending":
        return "status-warning";
      case "rejected":
        return "status-danger";
      default:
        return "status-info";
    }
  };

  const filteredSupporters = supporters.filter(
    (supporter) =>
      supporter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supporter.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarProvider>
      <AppSidebar userType="operator" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/operator">
                  Operator Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Supporters</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Bell className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </Button>
            <ModeToggle />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  My Supporters
                </h2>
                <p className="text-muted-foreground">
                  Manage supporters assigned to you
                </p>
              </div>
              <Button className="btn-gradient">
                <Plus className="mr-2 h-4 w-4" />
                Register Supporter
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid auto-rows-min gap-4 grid-cols-2 lg:grid-cols-4">
            <Card className="card-professional">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Total Assigned
                </CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-foreground">23</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Verified
                </CardTitle>
                <UserCheck className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-foreground">18</div>
                <p className="text-xs text-muted-foreground">78% of total</p>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Pending Review
                </CardTitle>
                <Clock className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-foreground">3</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting verification
                </p>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Rejected
                </CardTitle>
                <UserX className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-foreground">2</div>
                <p className="text-xs text-muted-foreground">9% of total</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="supporters">Supporters</TabsTrigger>
              <TabsTrigger value="registration">Registration</TabsTrigger>
              <TabsTrigger value="verification">Verification</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Recent Activity */}
                <Card className="card-professional">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-accent" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          supporter: "Ahmed Hassan",
                          action: "Registration completed",
                          time: "2 hours ago",
                          status: "success",
                        },
                        {
                          supporter: "Fatima Ali",
                          action: "Documents uploaded",
                          time: "4 hours ago",
                          status: "info",
                        },
                        {
                          supporter: "Omar Mohamed",
                          action: "Verification rejected",
                          time: "1 day ago",
                          status: "warning",
                        },
                      ].map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4 py-3 border-b last:border-b-0"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                            <User className="h-4 w-4 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-foreground truncate">
                              {activity.supporter}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate">
                              {activity.action}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {activity.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="card-professional">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Register New Supporter
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Upload Documents
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Report
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Supporters Tab */}
            <TabsContent value="supporters" className="space-y-4">
              <Card className="card-professional">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      All Supporters
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search supporters..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8 w-64"
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredSupporters.map((supporter) => (
                      <div
                        key={supporter.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground">
                              {supporter.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {supporter.district} • {supporter.phone}
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {supporter.pollingStation}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {supporter.registrationDate}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {supporter.location}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(supporter.status)}>
                            {supporter.status}
                          </Badge>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Registration Tab */}
            <TabsContent value="registration" className="space-y-4">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-accent" />
                    Supporter Registration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Registration Form
                    </h3>
                    <p className="text-muted-foreground">
                      Supporter registration form will be available here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Verification Tab */}
            <TabsContent value="verification" className="space-y-4">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-secondary" />
                    Document Verification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Verification Tools
                    </h3>
                    <p className="text-muted-foreground">
                      Document verification tools will be available here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

















