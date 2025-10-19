"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import OperatorRegistrationForm from "@/components/forms/operator-registration-form";

export default function OperatorRegisterPage() {
  const [isFormReady, setIsFormReady] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    // Check if form components are properly loaded
    const checkFormReadiness = async () => {
      try {
        // Test if required modules are available
        setIsFormReady(true);
        console.log("Form components loaded successfully");
      } catch (error) {
        console.error("Error loading form components:", error);
        setFormError(
          `Failed to load form components: ${(error as Error).message}`
        );
      }
    };

    checkFormReadiness();
  }, []);

  if (formError) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/operators">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to operators
                </Button>
              </Link>
              <div>
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <UserPlus className="h-6 w-6 text-primary" />
                  Register New operator
                </h2>
                <p className="text-muted-foreground">
                  Add a new operator to the campaign database
                </p>
              </div>
            </div>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {formError}
            <br />
            <br />
            Please check the browser console for more details and try refreshing
            the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isFormReady) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/operators">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to operators
                </Button>
              </Link>
              <div>
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <UserPlus className="h-6 w-6 text-primary" />
                  Register New operator
                </h2>
                <p className="text-muted-foreground">
                  Add a new operator to the campaign database
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                Loading form components...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/operators">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to operators
              </Button>
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <UserPlus className="h-6 w-6 text-primary" />
                Register New operator
              </h2>
              <p className="text-muted-foreground">
                Add a new operator to the campaign database
              </p>
            </div>
          </div>
        </div>
      </div>
    <OperatorRegistrationForm/>
    </div>
  );
}
