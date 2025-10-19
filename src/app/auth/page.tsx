"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/theme-toggle";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthLoginForm } from "@/components/forms/auth-login-form";
import { AuthRegisterForm } from "@/components/forms/auth-register-form";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Redirect if already authenticated
  // useEffect(() => {
  //   if (isAuthenticated && user) {
  //     const roleRedirects: Record<string, string> = {
  //       admin: "/admin",
  //       operator: "/operator",
  //       supporter: "/supporter",
  //     };

  //     const redirectPath = roleRedirects[user.role || ""] || "/";
  //     router.push(redirectPath);
  //   }
  // }, [isAuthenticated, user, router]);

  const roleIcons = {
    admin: "🛡️",
    operator: "👥",
    supporter: "✅",
  };

  const roleFeatures = {
    admin: [
      "Complete campaign oversight",
      "Real-time analytics & reporting",
      "Operator & supporter management",
      "Funds & resource allocation",
      "AI-powered fraud detection",
    ],
    operator: [
      "GPS tracking & navigation",
      "Supporter registration",
      "Task management",
      "Real-time communication",
      "Field operations tools",
    ],
    supporter: [
      "Easy registration process",
      "Polling station information",
      "Transport & logistics",
      "Campaign updates",
      "Community engagement",
    ],
  };

  const handleSuccess = () => {
    router.push(isLogin ? "/admin" : "/");
    setIsSuccess(true);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <Button asChild variant="ghost" className="text-foreground">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center space-x-4">
                <ModeToggle />
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-green-700 mb-2">
                    Success!
                  </h2>
                  <p className="text-muted-foreground">
                    {isLogin ? "Login successful!" : "Registration successful!"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Redirecting to your dashboard...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Button asChild variant="ghost" className="text-foreground">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <div className="flex items-center space-x-4">
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left Side - Auth Form */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary">
                      <span className="text-2xl">🛡️</span>
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {isLogin ? "Welcome Back" : "Create Account"}
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    {isLogin
                      ? "Sign in to your account to continue"
                      : "Sign up to get started with the platform"}
                  </p>
                </div>

                <Card className="card-professional">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">
                      {isLogin ? "Sign In" : "Sign Up"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {isLogin ? (
                      <AuthLoginForm
                        onSuccess={handleSuccess}
                        onError={handleError}
                      />
                    ) : (
                      <AuthRegisterForm
                        onSuccess={handleSuccess}
                        onError={handleError}
                      />
                    )}

                    <div className="text-center">
                      <Button
                        variant="link"
                        className="px-0"
                        onClick={() => {
                          setIsLogin(!isLogin);
                          setError("");
                        }}
                      >
                        {isLogin
                          ? "Don't have an account? Sign up"
                          : "Already have an account? Sign in"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Side - Role Features */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                  <Badge className="mb-4 bg-gradient-primary text-primary-foreground border-0 px-4 py-2 text-sm font-medium">
                    <Zap className="mr-2 h-4 w-4" />
                    Choose Your Role
                  </Badge>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    What can you do with each role?
                  </h2>
                  <p className="text-muted-foreground">
                    Each role provides different capabilities and access levels
                  </p>
                </div>

                <div className="space-y-6">
                  {Object.entries(roleFeatures).map(([role, features]) => (
                    <Card
                      key={role}
                      className="card-professional transition-all duration-300 hover:shadow-strong"
                    >
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${
                              role === "admin"
                                ? "bg-destructive/10"
                                : role === "operator"
                                ? "bg-primary/10"
                                : "bg-accent/10"
                            }`}
                          >
                            {roleIcons[role as keyof typeof roleIcons]}
                          </div>
                          <div>
                            <CardTitle className="text-lg capitalize">
                              {role}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {role === "admin"
                                ? "Complete campaign oversight"
                                : role === "operator"
                                ? "Mobile field operations"
                                : "Community engagement"}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center text-sm text-muted-foreground"
                            >
                              <CheckCircle className="mr-3 h-4 w-4 text-accent flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
