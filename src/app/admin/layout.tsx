"use client";

import React from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Providers } from "../providers";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const handleSidebarOpenChange = (open: boolean) => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <Providers>
      <ProtectedRoute requiredRole="admin" redirectTo="/auth">
        <SidebarProvider
          open={isSidebarOpen}
          onOpenChange={handleSidebarOpenChange}
        >
          <div className="flex h-screen w-screen bg-background">
            <AppSidebar />
            <main
              className={cn(
                "flex-1 w-screen transition-all",
                isSidebarOpen ? "px-2 py-4" : "px-8 py-4"
              )}
            >
              {children}
            </main>
          </div>
        </SidebarProvider>
      </ProtectedRoute>
    </Providers>
  );
}
