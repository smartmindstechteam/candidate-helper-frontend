"use client";

import * as React from "react";
import { SupportersDataTable } from "@/components/supporters/supporters-data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, Filter, Download } from "lucide-react";
import { supportersApi } from "@/lib/api";

export default function SupportersPage() {
  const [supporters, setSupporters] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Load supporters data on component mount
  React.useEffect(() => {
    const fetchSupporters = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await supportersApi.getAll();

        if (response.data) {
          setSupporters(response.data);
        } else {
          setError("Failed to load supporters data");
        }
      } catch (err) {
        console.error("Failed to fetch supporters:", err);
        setError("Failed to load supporters data");
      } finally {
        setLoading(false);
      }
    };

    fetchSupporters();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Supporters Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and track supporter information
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Supporter
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Supporters
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    1,234
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Approved
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    1,089
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <Users className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    123
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <Users className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Rejected
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    22
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Supporters Data Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Supporters List
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-muted-foreground">
                  Loading supporters...
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-destructive">{error}</div>
              </div>
            ) : (
              <SupportersDataTable data={supporters} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
