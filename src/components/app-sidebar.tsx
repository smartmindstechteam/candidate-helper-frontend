"use client";

import * as React from "react";
import {
  Users,
  DollarSign,
  MapPin,
  MessageCircle,
  Shield,
  Truck,
  LayoutDashboard,
  Settings,
  LogOut,
  BarChart,
  FileText,
  Bell,
  Camera,
  Bot,
  Bus,
  UserPlus,
  Calendar,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/api/useAuth";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userType?: "admin" | "operator" | "supporter";
}

export function AppSidebar({ userType, ...props }: AppSidebarProps) {
  const { authStatus, logout } = useAuth();
  const { data: userResponse } = authStatus;
  const user = userResponse?.data.user;

  // Determine user type from auth context if not provided
  const currentUserType =
    userType ||
    (user?.role as "admin" | "operator" | "supporter") ||
    "supporter";
  const getNavigationData = () => {
    switch (currentUserType) {
      case "admin":
        return {
          title: "Candidate Helper",
          navMain: [
            {
              title: "Dashboard",
              url: "/admin",
              icon: <LayoutDashboard className="h-4 w-4" />,
            },
            {
              title: "Operators",
              url: "/admin/operators",
              icon: <Users className="h-4 w-4" />,
            },
            {
              title: "Supporters",
              url: "/admin/supporters",
              icon: <Shield className="h-4 w-4" />,
            },
            {
              title: "Events",
              url: "/admin/events",
              icon: <Calendar className="h-4 w-4" />,
            },
            {
              title: "Register Supporter",
              url: "/admin/register",
              icon: <UserPlus className="h-4 w-4" />,
            },
            {
              title: "Buses",
              url: "/admin/buses",
              icon: <Bus className="h-4 w-4" />,
            },
            {
              title: "AI Chatbot",
              url: "/admin/chatbot",
              icon: <Bot className="h-4 w-4" />,
            },
            {
              title: "Funds",
              url: "/admin/funds",
              icon: <DollarSign className="h-4 w-4" />,
            },
            {
              title: "Communication",
              url: "/admin/communication",
              icon: <MessageCircle className="h-4 w-4" />,
            },
            {
              title: "Transport",
              url: "/admin/transport",
              icon: <Truck className="h-4 w-4" />,
            },
            {
              title: "Reports",
              url: "/admin/reports",
              icon: <BarChart className="h-4 w-4" />,
            },
            {
              title: "Permissions",
              url: "/admin/permissions",
              icon: <Shield className="h-4 w-4" />,
            },
          ],
        };
      case "operator":
        return {
          title: "Operator Dashboard 🚨",
          navMain: [
            {
              title: "Home",
              url: "/operator",
              icon: <MapPin className="h-4 w-4" />,
            },
            {
              title: "Supporters",
              url: "/operator/supporters",
              icon: <Users className="h-4 w-4" />,
            },
            {
              title: "Transport",
              url: "/operator/transport",
              icon: <Truck className="h-4 w-4" />,
            },
            {
              title: "Messages",
              url: "/operator/messages",
              icon: <MessageCircle className="h-4 w-4" />,
            },
            {
              title: "Tasks",
              url: "/operator/tasks",
              icon: <FileText className="h-4 w-4" />,
            },
          ],
        };
      case "supporter":
        return {
          title: "Supporter Portal 🤝",
          navMain: [
            {
              title: "Home",
              url: "/supporter",
              icon: <MapPin className="h-4 w-4" />,
            },
            {
              title: "Campaign Info",
              url: "/supporter/campaign",
              icon: <MessageCircle className="h-4 w-4" />,
            },
            {
              title: "Funds",
              url: "/supporter/funds",
              icon: <DollarSign className="h-4 w-4" />,
            },
            {
              title: "Upload Documents",
              url: "/supporter/upload",
              icon: <Camera className="h-4 w-4" />,
            },
          ],
        };
      default:
        return { title: "Candidate Helper", navMain: [] };
    }
  };

  const data = getNavigationData();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between p-2">
          <h1 className="text-lg font-bold text-card-foreground">
            {data.title}
          </h1>
          <div className="flex items-center space-x-2">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer h-8 w-8">
                  <AvatarImage
                    src={`/placeholder-${currentUserType}.jpg`}
                    alt={`${currentUserType} Avatar`}
                  />
                  <AvatarFallback>
                    {user?.name
                      ? user.name.substring(0, 2).toUpperCase()
                      : currentUserType === "admin"
                      ? "AD"
                      : currentUserType === "operator"
                      ? "OP"
                      : "SP"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>
                  {user?.name || "My Account"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => await logout.mutateAsync()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center space-x-2">
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
