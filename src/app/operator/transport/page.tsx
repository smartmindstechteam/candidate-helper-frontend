"use client";
import React, { useState } from "react";
import {
  Truck,
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
  Route,
  Map,
  Car,
  Bus,
  Fuel,
  DollarSign,
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

export default function OperatorTransportPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for transport
  const routes = [
    {
      id: 1,
      name: "Hargeisa Central Route",
      from: "Hargeisa Central",
      to: "Hargeisa Stadium",
      distance: "15.2 km",
      duration: "25 min",
      passengers: 45,
      status: "active",
      cost: 250,
      assignedTo: "Ahmed Ali",
    },
    {
      id: 2,
      name: "Berbera Route",
      from: "Hargeisa",
      to: "Berbera",
      distance: "140.5 km",
      duration: "2h 15min",
      passengers: 28,
      status: "active",
      cost: 1200,
      assignedTo: "Ahmed Ali",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "status-success";
      case "maintenance":
        return "status-warning";
      case "inactive":
        return "status-danger";
      default:
        return "status-info";
    }
  };

  const filteredRoutes = routes.filter(
    (route) =>
      route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.to.toLowerCase().includes(searchTerm.toLowerCase())
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
                <BreadcrumbPage>Transport</BreadcrumbPage>
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
                  Transport Routes
                </h2>
                <p className="text-muted-foreground">
                  Manage your assigned transport routes
                </p>
              </div>
              <Button className="btn-gradient">
                <Plus className="mr-2 h-4 w-4" />
                Request Route
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid auto-rows-min gap-4 grid-cols-2 lg:grid-cols-4">
            <Card className="card-professional">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Assigned Routes
                </CardTitle>
                <Route className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-foreground">2</div>
                <p className="text-xs text-muted-foreground">Active routes</p>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Total Passengers
                </CardTitle>
                <User className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-foreground">73</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Distance Covered
                </CardTitle>
                <Map className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-foreground">
                  155.7 km
                </div>
                <p className="text-xs text-muted-foreground">Today</p>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Fuel Cost
                </CardTitle>
                <Fuel className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-foreground">$145</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="routes">Routes</TabsTrigger>
              <TabsTrigger value="navigation">Navigation</TabsTrigger>
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
                          route: "Hargeisa Central Route",
                          action: "Completed 3 trips",
                          time: "2 hours ago",
                          status: "success",
                        },
                        {
                          route: "Berbera Route",
                          action: "Started morning route",
                          time: "6 hours ago",
                          status: "info",
                        },
                      ].map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4 py-3 border-b last:border-b-0"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                            <Truck className="h-4 w-4 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-foreground truncate">
                              {activity.route}
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
                        <Navigation className="mr-2 h-4 w-4" />
                        Start Navigation
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Map className="mr-2 h-4 w-4" />
                        View Map
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Report Issue
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Route
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Routes Tab */}
            <TabsContent value="routes" className="space-y-4">
              <Card className="card-professional">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Route className="h-5 w-5 text-primary" />
                      My Routes
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search routes..."
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
                    {filteredRoutes.map((route) => (
                      <div
                        key={route.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Truck className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground">
                              {route.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {route.from} → {route.to}
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {route.distance} • {route.duration}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {route.passengers} passengers
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ${route.cost}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(route.status)}>
                            {route.status}
                          </Badge>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Navigation className="h-4 w-4" />
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

            {/* Navigation Tab */}
            <TabsContent value="navigation" className="space-y-4">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-accent" />
                    GPS Navigation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Navigation className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      GPS Navigation
                    </h3>
                    <p className="text-muted-foreground">
                      Interactive GPS navigation will be available here
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















