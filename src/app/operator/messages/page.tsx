"use client";
import React, { useState } from "react";
import {
  MessageCircle,
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
  Send,
  Smartphone,
  Monitor,
  Globe,
  Zap,
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

export default function OperatorMessagesPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for messages
  const messages = [
    {
      id: 1,
      type: "sms",
      recipient: "Ahmed Hassan",
      phone: "+252 61 234 5678",
      content:
        "Election Day is tomorrow! Don't forget to vote at Hargeisa Central Polling Center.",
      status: "delivered",
      sentAt: "2025-01-15 10:30",
      channel: "SMS",
    },
    {
      id: 2,
      type: "whatsapp",
      recipient: "Fatima Ali",
      phone: "+252 61 234 5679",
      content: "Campaign rally tomorrow at 2 PM. Join us at Hargeisa Stadium!",
      status: "sent",
      sentAt: "2025-01-15 09:15",
      channel: "WhatsApp",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "status-success";
      case "sent":
        return "status-info";
      case "pending":
        return "status-warning";
      case "failed":
        return "status-danger";
      default:
        return "status-info";
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "SMS":
        return <Smartphone className="h-4 w-4" />;
      case "WhatsApp":
        return <MessageCircle className="h-4 w-4" />;
      case "Email":
        return <Mail className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const filteredMessages = messages.filter(
    (message) =>
      message.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase())
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
                <BreadcrumbPage>Messages</BreadcrumbPage>
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
                <h2 className="text-2xl font-bold text-foreground">Messages</h2>
                <p className="text-muted-foreground">
                  Send and manage messages to supporters
                </p>
              </div>
              <Button className="btn-gradient">
                <Plus className="mr-2 h-4 w-4" />
                New Message
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid auto-rows-min gap-4 grid-cols-2 lg:grid-cols-4">
            <Card className="card-professional">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Messages Sent
                </CardTitle>
                <Send className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-foreground">156</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Delivery Rate
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-foreground">94.2%</div>
                <p className="text-xs text-muted-foreground">Success rate</p>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Pending
                </CardTitle>
                <Clock className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-foreground">8</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting delivery
                </p>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Response Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-foreground">12.8%</div>
                <p className="text-xs text-muted-foreground">User engagement</p>
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
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="compose">Compose</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Recent Messages */}
                <Card className="card-professional">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-accent" />
                      Recent Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {messages.slice(0, 3).map((message) => (
                        <div
                          key={message.id}
                          className="flex items-center space-x-4 py-3 border-b last:border-b-0"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                            {getChannelIcon(message.channel)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-foreground truncate">
                              {message.recipient}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate">
                              {message.content}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {message.sentAt}
                              </span>
                              <Badge className={getStatusColor(message.status)}>
                                {message.status}
                              </Badge>
                            </div>
                          </div>
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
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Send SMS
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Smartphone className="mr-2 h-4 w-4" />
                        Send WhatsApp
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View Templates
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-4">
              <Card className="card-professional">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      All Messages
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search messages..."
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
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            {getChannelIcon(message.channel)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground">
                              {message.recipient}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {message.phone} • {message.channel}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {message.content}
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {message.sentAt}
                              </span>
                              <Badge className={getStatusColor(message.status)}>
                                {message.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
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

            {/* Compose Tab */}
            <TabsContent value="compose" className="space-y-4">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-accent" />
                    Compose Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Message Composer
                    </h3>
                    <p className="text-muted-foreground">
                      Message composition tools will be available here
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
















