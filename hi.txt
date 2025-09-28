"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  DollarSign,
  MapPin,
  MessageCircle,
  Shield,
  Truck,
  Bot,
  BarChart3,
  FileText,
  Bell,
  TrendingUp,
  Activity,
  Target,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Settings,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  MoreHorizontal,
  Phone,
  Mail,
  Map,
  Camera,
  UserCheck,
  UserX,
  CreditCard,
  Globe,
  Smartphone,
  Monitor,
  Zap,
  Lock,
  Unlock,
  Edit,
  Trash2,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { ModeToggle } from "@/components/theme-toggle";
import { CHART_COLORS } from "@/lib/chart-colors";
import { SupporterRegistrationForm } from "@/components/forms/supporter-registration-form";
import { SupportersDataTable } from "@/components/supporters/supporters-data-table";
import { OperatorsDataTable } from "@/components/operators/operators-data-table";
import { EventsDataTable } from "@/components/events/events-data-table";
import { FundManagementDataTable } from "@/components/funds/fund-management-data-table";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for charts
  const supporterGrowthData = [
    { month: "Jan", supporters: 120, operators: 8, funds: 15000 },
    { month: "Feb", supporters: 180, operators: 12, funds: 22000 },
    { month: "Mar", supporters: 250, operators: 15, funds: 28000 },
    { month: "Apr", supporters: 320, operators: 18, funds: 35000 },
    { month: "May", supporters: 380, operators: 20, funds: 42000 },
    { month: "Jun", supporters: 456, operators: 24, funds: 45678 },
  ];

  const fundsData = [
    {
      category: "Campaign Materials",
      amount: 15000,
      color: "var(--color-chart-1)",
    },
    {
      category: "Transportation",
      amount: 12000,
      color: "var(--color-chart-2)",
    },
    { category: "Communication", amount: 8000, color: "var(--color-chart-3)" },
    { category: "Events", amount: 6000, color: "var(--color-chart-4)" },
    { category: "Miscellaneous", amount: 4000, color: "var(--color-chart-5)" },
  ];

  const districtData = [
    { district: "Hargeisa", supporters: 156, percentage: 34, status: "active" },
    { district: "Berbera", supporters: 98, percentage: 21, status: "active" },
    { district: "Burao", supporters: 87, percentage: 19, status: "pending" },
    { district: "Borama", supporters: 78, percentage: 17, status: "active" },
    { district: "Others", supporters: 37, percentage: 8, status: "inactive" },
  ];

  const fraudAlerts = [
    {
      id: 1,
      type: "Duplicate ID",
      severity: "high",
      description: "Multiple registrations with same ID number",
      location: "Hargeisa Central",
      time: "2 hours ago",
      status: "pending",
    },
    {
      id: 2,
      type: "Suspicious Pattern",
      severity: "medium",
      description: "Unusual registration pattern detected",
      location: "Berbera",
      time: "4 hours ago",
      status: "investigating",
    },
    {
      id: 3,
      type: "Invalid Document",
      severity: "low",
      description: "Blurry ID image uploaded",
      location: "Burao",
      time: "6 hours ago",
      status: "resolved",
    },
  ];

  const recentActivities = [
    {
      icon: <Users className="h-5 w-5 text-primary" />,
      title: "New Supporter Registered",
      description: "Ahmed Hassan from Hargeisa",
      time: "2 mins ago",
      type: "registration",
    },
    {
      icon: <DollarSign className="h-5 w-5 text-accent" />,
      title: "Funds Distributed",
      description: "$2,500 allocated to Berbera district",
      time: "1 hour ago",
      type: "funds",
    },
    {
      icon: <Truck className="h-5 w-5 text-warning" />,
      title: "Vehicle Tracking",
      description: "Campaign vehicle #3 completed route",
      time: "3 hours ago",
      type: "transport",
    },
    {
      icon: <MessageCircle className="h-5 w-5 text-info" />,
      title: "Broadcast Sent",
      description: "Election reminder sent to 200 supporters",
      time: "5 hours ago",
      type: "communication",
    },
    {
      icon: <Bot className="h-5 w-5 text-secondary" />,
      title: "AI Analysis Complete",
      description: "Fraud detection scan completed",
      time: "1 day ago",
      type: "ai",
    },
  ];

  const operators = [
    {
      id: 1,
      name: "Ahmed Ali",
      phone: "+252 61 234 5678",
      district: "Hargeisa Central",
      status: "active",
      tasks: 12,
      supporters: 45,
      lastSeen: "2 mins ago",
    },
    {
      id: 2,
      name: "Fatima Hassan",
      phone: "+252 61 234 5679",
      district: "Berbera",
      status: "active",
      tasks: 8,
      supporters: 32,
      lastSeen: "15 mins ago",
    },
    {
      id: 3,
      name: "Omar Mohamed",
      phone: "+252 61 234 5680",
      district: "Burao",
      status: "offline",
      tasks: 5,
      supporters: 28,
      lastSeen: "2 hours ago",
    },
  ];

  const supporters = [
    {
      id: 1,
      name: "Amina Ahmed",
      phone: "+252 61 234 5681",
      district: "Hargeisa Central",
      status: "verified",
      registrationDate: "2024-01-15",
      pollingStation: "Hargeisa Central School",
    },
    {
      id: 2,
      name: "Hassan Ali",
      phone: "+252 61 234 5682",
      district: "Berbera",
      status: "pending",
      registrationDate: "2024-01-16",
      pollingStation: "Berbera High School",
    },
    {
      id: 3,
      name: "Khadija Omar",
      phone: "+252 61 234 5683",
      district: "Burao",
      status: "verified",
      registrationDate: "2024-01-17",
      pollingStation: "Burao Community Center",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "verified":
        return "status-success";
      case "pending":
        return "status-warning";
      case "offline":
      case "inactive":
        return "status-danger";
      case "investigating":
        return "status-info";
      default:
        return "status-info";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-destructive";
      case "medium":
        return "text-warning";
      case "low":
        return "text-info";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground">
          Campaign Dashboard
        </h2>
        <p className="text-muted-foreground">
          Complete oversight and management of your political campaign
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">
              Total Supporters
            </CardTitle>
            <Users className="h-6 w-6 text-primary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-foreground">
              456
            </div>
            <p className="text-xs text-primary-foreground/70">
              +12% from last month
            </p>
            <div className="mt-2">
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">
              Active Operators
            </CardTitle>
            <Shield className="h-6 w-6 text-primary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-foreground">24</div>
            <p className="text-xs text-primary-foreground/70">
              +5% from last month
            </p>
            <div className="mt-2">
              <Progress value={80} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">
              Campaign Funds
            </CardTitle>
            <DollarSign className="h-6 w-6 text-primary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-foreground">
              $45,678
            </div>
            <p className="text-xs text-primary-foreground/70">
              +8% from last month
            </p>
            <div className="mt-2">
              <Progress value={60} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient-info">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">
              Fraud Alerts
            </CardTitle>
            <AlertTriangle className="h-6 w-6 text-primary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-foreground">3</div>
            <p className="text-xs text-primary-foreground/70">
              2 pending review
            </p>
            <div className="mt-2">
              <Progress value={33} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="operators">Operators</TabsTrigger>
          <TabsTrigger value="supporters">Supporters</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="funds">Funds</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
          <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
          <TabsTrigger value="chatbot">AI Chatbot</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Supporter Growth Chart */}
            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Supporter Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    supporters: {
                      label: "Supporters",
                      color: "var(--color-chart-1)",
                    },
                    operators: {
                      label: "Operators",
                      color: "var(--color-chart-2)",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={supporterGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="supporters"
                        stackId="1"
                        stroke="var(--color-chart-1)"
                        fill="var(--color-chart-1)"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="operators"
                        stackId="2"
                        stroke="var(--color-chart-2)"
                        fill="var(--color-chart-2)"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Funds Distribution */}
            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-warning" />
                  Funds Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{ amount: { label: "Amount" } }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={fundsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percentage }) =>
                          `${category} (${percentage}%)`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {fundsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          `$${value.toLocaleString()}`,
                          "Amount",
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* District Performance and Recent Activities */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  District Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    supporters: {
                      label: "Supporters",
                      color: "var(--color-chart-3)",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={districtData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="district" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="supporters" fill="var(--color-chart-3)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="card-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-info" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 py-3 border-b last:border-b-0"
                    >
                      {activity.icon}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-foreground truncate">
                          {activity.title}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {activity.description}
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
          </div>
        </TabsContent>

        {/* Operators Tab */}
        <TabsContent value="operators" className="space-y-4">
          <OperatorsDataTable />
        </TabsContent>

        {/* Supporters Tab */}
        <TabsContent value="supporters" className="space-y-4">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-accent" />
                Supporter Management
              </CardTitle>
              <p className="text-muted-foreground">
                View and manage all registered supporters with advanced
                filtering and sorting
              </p>
            </CardHeader>
            <CardContent>
              <SupportersDataTable />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <EventsDataTable />
        </TabsContent>

        {/* Funds Tab */}
        <TabsContent value="funds" className="space-y-4">
          <FundManagementDataTable />
        </TabsContent>

        {/* Register Tab */}
        <TabsContent value="register" className="space-y-4">
          <SupporterRegistrationForm />
        </TabsContent>

        {/* Fraud Detection Tab */}
        <TabsContent value="fraud" className="space-y-4">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Fraud Detection & Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fraudAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          alert.severity === "high"
                            ? "bg-destructive/10"
                            : alert.severity === "medium"
                            ? "bg-warning/10"
                            : "bg-info/10"
                        }`}
                      >
                        <AlertTriangle
                          className={`h-5 w-5 ${
                            alert.severity === "high"
                              ? "text-destructive"
                              : alert.severity === "medium"
                              ? "text-warning"
                              : "text-info"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {alert.type}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {alert.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {alert.location} • {alert.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(alert.status)}>
                        {alert.status}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Chatbot Tab */}
        <TabsContent value="chatbot" className="space-y-4">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-secondary" />
                AI Election Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">
                    Campaign Insights
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Based on current data, your campaign is performing 15% above
                    average compared to similar campaigns. The Hargeisa district
                    shows the strongest support with 34% of total supporters.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">
                    Recommendations
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Increase operator presence in Burao district</li>
                    <li>
                      • Consider additional communication campaigns for Berbera
                    </li>
                    <li>
                      • Monitor fraud alerts more closely in high-traffic areas
                    </li>
                  </ul>
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask AI about your campaign..."
                    className="flex-1"
                  />
                  <Button className="btn-gradient">
                    <Bot className="mr-2 h-4 w-4" />
                    Ask AI
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
