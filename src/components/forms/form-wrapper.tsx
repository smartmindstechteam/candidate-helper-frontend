"use client";

import * as React from "react";
import { AlertCircle, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFormSubmission } from "@/lib/form-submission";

interface FormWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit: (data: any) => Promise<any>;
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  showSuccessState?: boolean;
  successMessage?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function FormWrapper({
  title,
  description,
  children,
  onSubmit,
  onSuccess,
  onCancel,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  showSuccessState = true,
  successMessage,
  className = "",
  icon,
}: FormWrapperProps) {
  const { isSubmitting, error, errors, submitForm, clearErrors } =
    useFormSubmission();
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);

  const handleSubmit = async (data: any) => {
    const result = await submitForm(async () => {
      return onSubmit(data);
    });

    if (result.success) {
      setIsSuccess(true);
      onSuccess?.(result.data);
    } else {
      setRetryCount((prev) => prev + 1);
    }
  };

  const handleRetry = () => {
    clearErrors();
    setRetryCount(0);
  };

  const handleReset = () => {
    setIsSuccess(false);
    clearErrors();
    setRetryCount(0);
  };

  if (isSuccess && showSuccessState) {
    return (
      <Card className={`w-full max-w-2xl mx-auto ${className}`}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                {successMessage || "Success!"}
              </h3>
              <p className="text-muted-foreground mt-2">
                Your request has been processed successfully.
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleReset} variant="outline">
                Submit Another
              </Button>
              {onCancel && (
                <Button onClick={onCancel}>Back to Dashboard</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        {description && <p className="text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">{error}</p>
                {retryCount > 0 && (
                  <p className="text-sm opacity-90">
                    Attempt {retryCount + 1} failed. Please try again.
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRetry}
                    className="text-destructive border-destructive hover:bg-destructive hover:text-white"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Retry
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Field-specific Errors */}
        {errors && Object.keys(errors).length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Please fix the following errors:</p>
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([field, fieldErrors]) => (
                    <li key={field} className="text-sm">
                      <strong>{field}:</strong> {fieldErrors.join(", ")}
                    </li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Form Content */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());
            handleSubmit(data);
          }}
          className="space-y-6"
        >
          {children}

          {/* Submit Buttons */}
          <div className="flex justify-between space-x-4 pt-6">
            <div className="flex space-x-2">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  {cancelLabel}
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const form = document.querySelector("form");
                  if (form) form.reset();
                  clearErrors();
                }}
                disabled={isSubmitting}
              >
                Reset Form
              </Button>
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Higher-order component for easy form wrapping
export function withFormWrapper<P extends object>(
  Component: React.ComponentType<P>,
  formConfig: Omit<FormWrapperProps, "children" | "onSubmit">
) {
  return function WrappedForm(
    props: P & { onSubmit: (data: any) => Promise<any> }
  ) {
    const { onSubmit, ...restProps } = props;

    return (
      <FormWrapper {...formConfig} onSubmit={onSubmit}>
        <Component {...(restProps as P)} />
      </FormWrapper>
    );
  };
}

// Utility hook for form state management
export function useFormState() {
  const [isDirty, setIsDirty] = React.useState(false);
  const [isValid, setIsValid] = React.useState(false);
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  const markFieldTouched = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  const markFormDirty = () => {
    setIsDirty(true);
  };

  const resetFormState = () => {
    setIsDirty(false);
    setIsValid(false);
    setTouched({});
  };

  return {
    isDirty,
    isValid,
    touched,
    markFieldTouched,
    markFormDirty,
    resetFormState,
  };
}
