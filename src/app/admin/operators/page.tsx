"use client";
import React, { useState, useEffect } from "react";
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
  Shield,
  Star,
  TrendingUp,
  BarChart3,
  Settings,
  Bell,
  User,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ModeToggle } from "@/components/theme-toggle";
import { OperatorsDataTable } from "@/components/operators/operators-data-table";
import OperatorRegisterationForm from "@/components/forms/operator-registration-form";
import { useOperators } from "@/hooks/api/useOperators";

export default function AdminOperatorsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOperatorOpen, setIsAddOperatorOpen] = useState(false);
  const { isLoading, isError: error, data: response } = useOperators();

  const operators = response?.operators;
  console.log(operators);
  // Mock data for operators (fallback)
  const mockOperators = [
    {
      id: 1,
      name: "Ahmed Hassan",
      phone: "+252 61 234 5678",
      email: "ahmed.hassan@email.com",
      district: "Hargeisa Central",
      status: "active",
      tasksCompleted: 45,
      supportersRegistered: 23,
      lastActive: "2 hours ago",
      location: "Hargeisa Central",
      rating: 4.8,
      joinDate: "2025-01-15",
    },
    {
      id: 2,
      name: "Fatima Ali",
      phone: "+252 61 234 5679",
      email: "fatima.ali@email.com",
      district: "Hargeisa North",
      status: "active",
      tasksCompleted: 38,
      supportersRegistered: 19,
      lastActive: "1 hour ago",
      location: "Hargeisa North",
      rating: 4.6,
      joinDate: "2025-01-20",
    },
    {
      id: 3,
      name: "Omar Mohamed",
      phone: "+252 61 234 5680",
      email: "omar.mohamed@email.com",
      district: "Berbera",
      status: "inactive",
      tasksCompleted: 12,
      supportersRegistered: 8,
      lastActive: "3 days ago",
      location: "Berbera",
      rating: 4.2,
      joinDate: "2025-01-10",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "status-success";
      case "inactive":
        return "status-warning";
      case "pending":
        return "status-info";
      default:
        return "status-info";
    }
  };

  const filteredOperators = operators?.filter(
    (operator) =>
      (
        operator.firstname +
        operator.lastname +
        operator.middlename +
        operator.fourthname
      )
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      operator?.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Operators</h2>
            <p className="text-muted-foreground">
              Manage field operators and track their performance
            </p>
          </div>
          <Dialog open={isAddOperatorOpen} onOpenChange={setIsAddOperatorOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gradient">
                <Plus className="mr-2 h-4 w-4" />
                Add Operator
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Register New Operator</DialogTitle>
              </DialogHeader>
              <OperatorRegisterationForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid auto-rows-min gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Operators
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-foreground">156</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Active Now
            </CardTitle>
            <Activity className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-foreground">89</div>
            <p className="text-xs text-muted-foreground">57% of total</p>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Tasks Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-foreground">1,247</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Avg Rating
            </CardTitle>
            <Star className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-foreground">4.6</div>
            <p className="text-xs text-muted-foreground">Out of 5.0</p>
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
          <TabsTrigger value="operators">Operators</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
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
                      operator: "Ahmed Hassan",
                      action: "Completed supporter registration",
                      time: "2 hours ago",
                      status: "success",
                    },
                    {
                      operator: "Fatima Ali",
                      action: "Uploaded document verification",
                      time: "3 hours ago",
                      status: "success",
                    },
                    {
                      operator: "Omar Mohamed",
                      action: "Started new task assignment",
                      time: "5 hours ago",
                      status: "info",
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
                          {activity.operator}
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

            {/* Top Performers */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Ahmed Hassan", tasks: 45, rating: 4.8 },
                    { name: "Fatima Ali", tasks: 38, rating: 4.6 },
                    { name: "Omar Mohamed", tasks: 12, rating: 4.2 },
                  ].map((performer, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-sm font-bold text-primary">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-foreground">
                            {performer.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {performer.tasks} tasks completed
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-foreground">
                          {performer.rating}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          rating
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Operators Tab */}
        <TabsContent value="operators" className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-muted-foreground">Loading operators...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-destructive">{error}</div>
            </div>
          ) : (
            <OperatorsDataTable data={filteredOperators} />
          )}
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-accent" />
                Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Performance Charts
                </h3>
                <p className="text-muted-foreground">
                  Detailed performance analytics will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-secondary" />
                Operator Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Configuration Options
                </h3>
                <p className="text-muted-foreground">
                  Operator management settings will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
