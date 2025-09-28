"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  User,
  Shield,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formUtils, useFormSubmission } from "@/lib/form-submission";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
  userType: z.enum(["admin", "operator", "supporter"], {
    message: "Please select a user type",
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface AuthLoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function AuthLoginForm({ onSuccess, onError }: AuthLoginFormProps = {}) {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const { isSubmitting, error, errors, submitForm, clearErrors } =
    useFormSubmission();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
      userType: "supporter",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await submitForm(async () => {
      return formUtils.submitAuth(data, "login");
    });

    if (result.success) {
      setIsSuccess(true);
      onSuccess?.();
    } else {
      onError?.(result.error || "Login failed");
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                Login Successful!
              </h3>
              <p className="text-muted-foreground mt-2">
                Welcome back! Redirecting to your dashboard...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Sign In
        </CardTitle>
        <p className="text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userType">User Type *</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={
                    form.watch("userType") === "admin" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => form.setValue("userType", "admin")}
                  className="flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Button>
                <Button
                  type="button"
                  variant={
                    form.watch("userType") === "operator"
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => form.setValue("userType", "operator")}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Operator
                </Button>
                <Button
                  type="button"
                  variant={
                    form.watch("userType") === "supporter"
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => form.setValue("userType", "supporter")}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Supporter
                </Button>
              </div>
              {form.formState.errors.userType && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.userType.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="your.email@example.com"
                  className="pl-10"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={form.watch("rememberMe")}
                  onCheckedChange={(checked) =>
                    form.setValue("rememberMe", checked as boolean)
                  }
                />
                <Label htmlFor="rememberMe" className="text-sm">
                  Remember me
                </Label>
              </div>
              <Button type="button" variant="link" size="sm" className="px-0">
                Forgot password?
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button variant="outline" type="button">
              <svg
                className="mr-2 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <Button variant="link" className="p-0 h-auto">
              Sign up
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
