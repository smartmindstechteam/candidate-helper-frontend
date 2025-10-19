"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bot,
  MessageCircle,
  Users,
  TrendingUp,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Mock data for chatbot analytics
const chatStats = {
  totalConversations: 1247,
  activeUsers: 89,
  responseTime: "2.3s",
  satisfactionRate: 94.2,
  todayMessages: 156,
  weeklyGrowth: 23.5,
};

const recentConversations = [
  {
    id: "conv-001",
    user: "Ahmed Hassan",
    lastMessage: "What are the voting requirements?",
    timestamp: "2 minutes ago",
    status: "active",
    satisfaction: "positive",
  },
  {
    id: "conv-002",
    user: "Fatima Ali",
    lastMessage: "How do I register to vote?",
    timestamp: "5 minutes ago",
    status: "resolved",
    satisfaction: "positive",
  },
  {
    id: "conv-003",
    user: "Omar Mohamed",
    lastMessage: "When is the election date?",
    timestamp: "8 minutes ago",
    status: "resolved",
    satisfaction: "neutral",
  },
  {
    id: "conv-004",
    user: "Aisha Jama",
    lastMessage: "Where is my polling station?",
    timestamp: "12 minutes ago",
    status: "active",
    satisfaction: "positive",
  },
];

const categoryStats = [
  {
    category: "Voter Registration",
    count: 456,
    percentage: 32.1,
    trend: "+12%",
  },
  {
    category: "Election Information",
    count: 234,
    percentage: 16.5,
    trend: "+8%",
  },
  { category: "Transport", count: 189, percentage: 13.3, trend: "+15%" },
  { category: "General Questions", count: 212, percentage: 14.9, trend: "+5%" },
  { category: "Technical Support", count: 156, percentage: 11.0, trend: "+3%" },
];

const dailyStats = [
  { day: "Mon", messages: 45, sessions: 12 },
  { day: "Tue", messages: 52, sessions: 15 },
  { day: "Wed", messages: 38, sessions: 10 },
  { day: "Thu", messages: 41, sessions: 11 },
  { day: "Fri", messages: 47, sessions: 13 },
  { day: "Sat", messages: 35, sessions: 9 },
  { day: "Sun", messages: 28, sessions: 7 },
];

export default function AdminChatbotPage() {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            AI Chatbot Management
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage the AI chatbot system
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] card-glass"></Card>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Today's Messages</span>
                    </div>
                    <span className="font-semibold">
                      {chatStats.todayMessages}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Active Users</span>
                    </div>
                    <span className="font-semibold">
                      {chatStats.activeUsers}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Avg Response</span>
                    </div>
                    <span className="font-semibold">
                      {chatStats.responseTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Satisfaction</span>
                    </div>
                    <span className="font-semibold">
                      {chatStats.satisfactionRate}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentConversations.slice(0, 4).map((conv) => (
                      <div
                        key={conv.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                      >
                        <div>
                          <p className="text-sm font-medium">{conv.user}</p>
                          <p className="text-xs text-muted-foreground">
                            {conv.lastMessage}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              conv.status === "active" ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {conv.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {conv.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Conversations
                    </p>
                    <p className="text-2xl font-bold">
                      {chatStats.totalConversations}
                    </p>
                  </div>
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <div className="flex items-center mt-2">
                  <Badge className="bg-green-100 text-green-800">
                    +{chatStats.weeklyGrowth}% this week
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Active Users
                    </p>
                    <p className="text-2xl font-bold">
                      {chatStats.activeUsers}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="flex items-center mt-2">
                  <Badge variant="outline">Online now</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Response Time
                    </p>
                    <p className="text-2xl font-bold">
                      {chatStats.responseTime}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <div className="flex items-center mt-2">
                  <Badge className="bg-green-100 text-green-800">Fast</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Satisfaction Rate
                    </p>
                    <p className="text-2xl font-bold">
                      {chatStats.satisfactionRate}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div className="flex items-center mt-2">
                  <Badge className="bg-green-100 text-green-800">
                    Excellent
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryStats.map((stat, index) => (
                    <div key={stat.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {stat.category}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {stat.count}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {stat.trend}
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyStats.map((stat) => (
                    <div
                      key={stat.day}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {stat.day}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {stat.messages} messages
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {stat.sessions} sessions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-primary rounded-full"
                            style={{ width: `${(stat.messages / 60) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{conv.user}</p>
                        <p className="text-sm text-muted-foreground">
                          {conv.lastMessage}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{conv.timestamp}</p>
                        <Badge
                          variant={
                            conv.satisfaction === "positive"
                              ? "default"
                              : "secondary"
                          }
                          className="mt-1"
                        >
                          {conv.satisfaction}
                        </Badge>
                      </div>
                      <Badge
                        variant={
                          conv.status === "active" ? "default" : "outline"
                        }
                      >
                        {conv.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chatbot Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">
                    AI Response Settings
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Configure how the AI responds to different types of queries
                    and manage response templates.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">
                    Analytics & Monitoring
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Set up monitoring for conversation quality, response times,
                    and user satisfaction metrics.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">
                    Integration Settings
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Configure integrations with other campaign modules and
                    external services.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
