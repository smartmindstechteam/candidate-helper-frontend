"use client";

import * as React from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
} from "react-hook-form";
import {
  User,
  Phone,
  Shield,
  FileText,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Info,
  Users,
  MapPin,
} from "lucide-react";
import {
    createOperatorDbSchema,
  CreateOperatorInput,
} from "@/lib/validations/operator";
import { useCreateOperator } from "@/hooks/api/useOperators";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { OperatorRole, OperatorStatus } from "@/types/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectField } from "../ui/selectField";

// --- FORM STEPS CONFIGURATION ---
const formSteps = [
  { id: "personal", title: "Personal", icon: User },
  { id: "contact", title: "Contact", icon: Phone },
  { id: "credentials", title: "Credentials", icon: Shield },
  { id: "location", title: "Location & More", icon: MapPin },
  { id: "finalize", title: "Finalize", icon: FileText },
];

export default function OperatorRegistrationForm() {
  const [currentStep, setCurrentStep] = React.useState(0);

  const {
    mutateAsync: createOperator,
    isPending: isCreating,
    isSuccess,
    isError: isCreationError,
  } = useCreateOperator();

  const form = useForm<CreateOperatorInput>({
    resolver: zodResolver(createOperatorDbSchema),
    mode: "onChange",
    defaultValues: {
      phones: [{ type: "primary", phone: "" }],
      status: OperatorStatus.PENDING,
      role: OperatorRole.OPERATOR,
      language: "somali",
    },
  });

  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors },
  } = form;

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({ control, name: "phones" });

  const nextStep = async () => {
    const stepFields: (keyof CreateOperatorInput)[][] = [
      ["firstname", "lastname", "birthdate", "gender"],
      ["email", "phones", "language"],
      ["role", "status"],
      ["address", "specialNeeds"],
      [],
    ];

    const isValid = await trigger(stepFields[currentStep]);
    if (isValid && currentStep < formSteps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const onSubmit: SubmitHandler<CreateOperatorInput> = async (data) =>
    await createOperator(data);

  if (isSuccess) {
    return (
      <Card className="w-full max-w-3xl mx-auto text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="mt-4">Registration Successful</CardTitle>
          <CardDescription>
            The new operator has been successfully created and can now log in.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-4">
          <Button onClick={() => window.location.reload()} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Register Another
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/admin/operators")}
            size="sm"
          >
            <Users className="mr-2 h-4 w-4" /> View Operators
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto px-4">
      <CardHeader>
        <CardTitle>New Operator Registration</CardTitle>
        <CardDescription>
          Follow the steps to add a new operator to the system.
        </CardDescription>
        <Progress
          value={((currentStep + 1) / formSteps.length) * 100}
          className="mt-4"
        />
      </CardHeader>
      <CardContent>
        {/* --- Step Indicator UI --- */}
        <div className="flex justify-between items-start mb-6 text-center">
          {formSteps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center w-20">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2",
                    index === currentStep
                      ? "bg-primary border-primary text-primary-foreground"
                      : index < currentStep
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-muted border-muted-foreground/20"
                  )}
                >
                  {index < currentStep ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <step.icon size={18} />
                  )}
                </div>
                <p
                  className={cn(
                    "mt-2 text-xs font-medium",
                    index === currentStep
                      ? "text-primary"
                      : index < currentStep
                      ? "text-green-600"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
              </div>
              {index < formSteps.length - 1 && (
                <div className="flex-1 h-0.5 bg-border mt-5 mx-2" />
              )}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Personal Information */}
          <div className={currentStep === 0 ? "block" : "hidden"}>
            <h3 className="text-sm uppercase text-muted-foreground tracking-wide mb-3">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="firstname"
                label="First Name *"
                control={control}
                placeholder="e.g. Ali"
              />
              <InputField
                name="middlename"
                label="Middle Name"
                control={control}
                placeholder="e.g. Omar"
              />
              <InputField
                name="lastname"
                label="Last Name *"
                control={control}
                placeholder="e.g. Ahmed"
              />
              <InputField
                name="fourthname"
                label="Fourth Name"
                control={control}
                placeholder="e.g. Yusuf"
              />
              <InputField
                name="birthdate"
                label="Date of Birth *"
                control={control}
                type="date"
              />
              <SelectField
                name="gender"
                label="Gender *"
                control={control}
                options={[
                  { value: "m", label: "Male" },
                  { value: "f", label: "Female" },
                ]}
                placeholder="Select gender"
              />
            </div>
          </div>

          {/* Step 2: Contact Details */}
          <div className={currentStep === 1 ? "block" : "hidden"}>
            <h3 className="text-sm uppercase text-muted-foreground tracking-wide mb-3">
              Contact Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="email"
                label="Email Address *"
                control={control}
                placeholder="operator@example.com"
                type="email"
              />
              <SelectField
                name="language"
                label="Preferred Language *"
                control={control}
                options={[
                  { value: "somali", label: "Somali" },
                  { value: "english", label: "English" },
                  { value: "arabic", label: "Arabic" },
                ]}
                placeholder="Select language"
              />
            </div>

            <div className="mt-4">
              <Label className="text-sm">Phone Numbers *</Label>
              {phoneFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 mt-2">
                  <Controller
                    name={`phones.${index}.type`}
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                      >
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                      </select>
                    )}
                  />

                  <InputField
                    name={`phones.${index}.phone`}
                    control={control}
                    placeholder="e.g. 634000000"
                    noLabel
                  />

                  <Button
                    type="button"
                    variant={
                      (phoneFields[index] as any).type === "primary"
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setValue(
                        "phones",
                        phoneFields.map((p, i) => ({
                          ...p,
                          type: i === index ? "primary" : p.type || "secondary",
                        }))
                      )
                    }
                  >
                    {(phoneFields[index] as any).type === "primary"
                      ? "Primary"
                      : "Set"}
                  </Button>

                  {phoneFields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removePhone(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              ))}

              {errors.phones && (
                <p className="text-sm text-destructive mt-1">
                  {errors.phones.message ||
                    (errors.phones as any).root?.message}
                </p>
              )}

              {phoneFields.length < 2 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => appendPhone({ type: "secondary", phone: "" })}
                >
                  <Plus size={16} className="mr-2" /> Add Phone
                </Button>
              )}
            </div>
          </div>

          {/* Step 3: Credentials */}
          <div className={currentStep === 2 ? "block" : "hidden"}>
            <h3 className="text-sm uppercase text-muted-foreground tracking-wide mb-3">
              Credentials & Role
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                name="role"
                label="Operator Role *"
                control={control}
                options={[
                  { value: "operator", label: "Operator" },
                  { value: "supervisor", label: "Supervisor" },
                  { value: "admin", label: "Admin" },
                ]}
                placeholder="Select role"
              />

              <SelectField
                name="status"
                label="Status *"
                control={control}
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                ]}
                placeholder="Select status"
              />

              <InputField
                name="password"
                label="Password *"
                control={control}
                type="password"
                placeholder="Min 8 characters"
              />

              <InputField
                name="passwordConfirmation"
                label="Confirm Password *"
                control={control}
                type="password"
                placeholder="Re-enter password"
              />
            </div>
          </div>

          {/* Step 4: Location & More */}
          <div className={currentStep === 3 ? "block" : "hidden"}>
            <h3 className="text-sm uppercase text-muted-foreground tracking-wide mb-3">
              Location & Additional Info
            </h3>
            <div className="space-y-4">
              <InputField
                name="address"
                label="Address (Optional)"
                control={control}
                placeholder="e.g. Downtown, Burco"
              />

              <div>
                <Label htmlFor="specialNeeds" className="text-sm">
                  Special Needs (Optional)
                </Label>
                <Controller
                  name="specialNeeds"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="specialNeeds"
                      placeholder="Describe any special needs or considerations"
                      className="mt-2"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Step 5: Finalize */}
          <div className={currentStep === 4 ? "block" : "hidden"}>
            <h3 className="text-sm uppercase text-muted-foreground tracking-wide mb-3">
              Review and Submit
            </h3>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Final Step!</AlertTitle>
              <AlertDescription>
                Please review all information before submitting. The new
                operator account will be created.
              </AlertDescription>
            </Alert>

            {isCreationError && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Submission Failed</AlertTitle>
                <AlertDescription>
                  An unexpected error occurred. Please check the details and try
                  again.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              size="sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>

            {currentStep < formSteps.length - 1 ? (
              <Button type="button" onClick={nextStep} size="sm">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isCreating} size="sm">
                {isCreating ? "Submitting..." : "Create Operator"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// --- Reusable field components ---
const InputField = ({
  name,
  label,
  control,
  type = "text",
  placeholder,
  noLabel = false,
}: any) => (
  <div className="space-y-2 flex-grow">
    {!noLabel && (
      <Label
        htmlFor={name}
        className="text-xs font-medium text-muted-foreground"
      >
        {label}
      </Label>
    )}
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            {...field}
            value={field.value ?? ""}
            className={cn("h-9")}
            step={type === "number" ? "any" : undefined}
          />
          {error && <p className="text-sm text-destructive">{error.message}</p>}
        </>
      )}
    />
  </div>
);

