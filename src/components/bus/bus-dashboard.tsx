"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bus,
  Route,
  Users,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Wrench,
  CheckCircle,
} from "lucide-react";
import {
  BusAnalytics,
  mockBuses,
  mockRoutes,
  mockDrivers,
  mockSchedules,
} from "@/lib/bus";
import {
  getBusStatusColor,
  getMaintenanceStatus,
  getMaintenanceStatusColor,
} from "@/lib/bus";
import { BusApiService } from "@/lib/bus-api";

interface BusDashboardProps {
  className?: string;
}

export function BusDashboard({ className = "" }: BusDashboardProps) {
  const [analytics, setAnalytics] = useState<BusAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const busApi = new BusApiService();
        const analyticsResponse = await busApi.getAnalytics();

        if (analyticsResponse.success) {
          setAnalytics(analyticsResponse.data);
        } else {
          // Fallback to mock data if API fails
          const mockAnalytics: BusAnalytics = {
            totalBuses: mockBuses.length,
            activeBuses: mockBuses.filter((b) => b.status === "active").length,
            maintenanceBuses: mockBuses.filter(
              (b) => b.status === "maintenance"
            ).length,
            inactiveBuses: mockBuses.filter((b) => b.status === "inactive")
              .length,
            totalRoutes: mockRoutes.length,
            activeRoutes: mockRoutes.filter((r) => r.isActive).length,
            totalDrivers: mockDrivers.length,
            activeDrivers: mockDrivers.filter((d) => d.status === "active")
              .length,
            dailyTrips: mockSchedules.filter((s) => s.isActive).length,
            weeklyTrips: mockSchedules.filter((s) => s.isActive).length * 7,
            monthlyTrips: mockSchedules.filter((s) => s.isActive).length * 30,
            averageUtilization: 75,
            maintenanceAlerts: mockBuses.filter((b) => {
              const now = new Date();
              const daysUntilMaintenance = Math.ceil(
                (b.nextMaintenance.getTime() - now.getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              return daysUntilMaintenance <= 30;
            }).length,
            driverAlerts: mockDrivers.filter((d) => d.status === "suspended")
              .length,
          };
          setAnalytics(mockAnalytics);
          setError("Using mock data - API unavailable");
        }
      } catch (err) {
        console.error("Failed to fetch bus analytics:", err);
        setError("Failed to load analytics data");
        // Fallback to mock data
        const mockAnalytics: BusAnalytics = {
          totalBuses: mockBuses.length,
          activeBuses: mockBuses.filter((b) => b.status === "active").length,
          maintenanceBuses: mockBuses.filter((b) => b.status === "maintenance")
            .length,
          inactiveBuses: mockBuses.filter((b) => b.status === "inactive")
            .length,
          totalRoutes: mockRoutes.length,
          activeRoutes: mockRoutes.filter((r) => r.isActive).length,
          totalDrivers: mockDrivers.length,
          activeDrivers: mockDrivers.filter((d) => d.status === "active")
            .length,
          dailyTrips: mockSchedules.filter((s) => s.isActive).length,
          weeklyTrips: mockSchedules.filter((s) => s.isActive).length * 7,
          monthlyTrips: mockSchedules.filter((s) => s.isActive).length * 30,
          averageUtilization: 75,
          maintenanceAlerts: mockBuses.filter((b) => {
            const now = new Date();
            const daysUntilMaintenance = Math.ceil(
              (b.nextMaintenance.getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24)
            );
            return daysUntilMaintenance <= 30;
          }).length,
          driverAlerts: mockDrivers.filter((d) => d.status === "suspended")
            .length,
        };
        setAnalytics(mockAnalytics);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Buses
                </p>
                <p className="text-2xl font-bold">{analytics.totalBuses}</p>
              </div>
              <Bus className="h-8 w-8 text-primary" />
            </div>
            <div className="flex items-center mt-2">
              <Badge className={getBusStatusColor("active")}>
                {analytics.activeBuses} Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Routes
                </p>
                <p className="text-2xl font-bold">{analytics.activeRoutes}</p>
              </div>
              <Route className="h-8 w-8 text-primary" />
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="outline">{analytics.totalRoutes} Total</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Drivers
                </p>
                <p className="text-2xl font-bold">{analytics.activeDrivers}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="outline">{analytics.totalDrivers} Total</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Daily Trips
                </p>
                <p className="text-2xl font-bold">{analytics.dailyTrips}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <div className="flex items-center mt-2">
              <Badge variant="outline">{analytics.weeklyTrips} Weekly</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span>Maintenance Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.maintenanceAlerts > 0 ? (
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Wrench className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">
                      {analytics.maintenanceAlerts} buses need maintenance
                    </span>
                  </div>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">
                    All buses up to date
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <span>Utilization</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Utilization</span>
                <span className="text-2xl font-bold text-primary">
                  {analytics.averageUtilization}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${analytics.averageUtilization}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Bus className="h-6 w-6" />
              <span className="text-sm">Add Bus</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Route className="h-6 w-6" />
              <span className="text-sm">Create Route</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Add Driver</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Schedule Trip</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockBuses.slice(0, 3).map((bus) => {
              const maintenanceStatus = getMaintenanceStatus(bus);
              return (
                <div
                  key={bus.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Bus className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{bus.plateNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {bus.model}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getBusStatusColor(bus.status)}>
                      {bus.status}
                    </Badge>
                    <Badge
                      className={getMaintenanceStatusColor(maintenanceStatus)}
                    >
                      {maintenanceStatus}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
