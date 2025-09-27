"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Phone,
  Mail,
  MapPin,
  IdCard,
  Shield,
  CheckCircle,
  Building,
  Users,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  Info,
  Lock,
  Globe,
  Heart,
  Star,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  Map,
  Navigation,
  Languages,
  UserCheck,
  Settings,
  DollarSign,
  FileText,
  BarChart3,
  Send,
  Archive,
  Target,
  Activity,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  operatorRegistrationSchema,
  OperatorRegistrationFormData,
} from "@/lib/validations/operator";

// Available actions for operator permissions with categorization
const availableActions = {
  "Supporter Management": [
    {
      id: "view_supporters",
      label: "View Supporters",
      description: "View supporter information and lists",
    },
    {
      id: "manage_supporters",
      label: "Manage Supporters",
      description: "Create, edit, and update supporter records",
    },
    {
      id: "approve_supporter",
      label: "Approve Supporters",
      description: "Approve or reject supporter registrations",
    },
  ],
  "Event Management": [
    {
      id: "view_events",
      label: "View Events",
      description: "View event information and schedules",
    },
    {
      id: "manage_events",
      label: "Manage Events",
      description: "Create, edit, and manage events",
    },
    {
      id: "create_event",
      label: "Create Events",
      description: "Create new campaign events",
    },
  ],
  "Financial Management": [
    {
      id: "view_funds",
      label: "View Funds",
      description: "View financial information and reports",
    },
    {
      id: "manage_funds",
      label: "Manage Funds",
      description: "Manage financial transactions and budgets",
    },
    {
      id: "log_fund",
      label: "Log Funds",
      description: "Record financial transactions",
    },
  ],
  Communication: [
    {
      id: "send_messages",
      label: "Send Messages",
      description: "Send messages to supporters and operators",
    },
    {
      id: "view_reports",
      label: "View Reports",
      description: "Access and view system reports",
    },
  ],
  "Task Management": [
    {
      id: "manage_tasks",
      label: "Manage Tasks",
      description: "Create and assign tasks to operators",
    },
    {
      id: "assign_task",
      label: "Assign Tasks",
      description: "Assign tasks to specific operators",
    },
  ],
  "System Administration": [
    {
      id: "view_operators",
      label: "View Operators",
      description: "View operator information",
    },
    {
      id: "manage_operators",
      label: "Manage Operators",
      description: "Create and manage operator accounts",
    },
    {
      id: "view_map",
      label: "View Maps",
      description: "Access mapping and location features",
    },
    {
      id: "generate_report",
      label: "Generate Reports",
      description: "Create custom reports",
    },
    {
      id: "system_admin",
      label: "System Admin",
      description: "Full system administration access",
    },
  ],
};

// Form steps configuration
const formSteps = [
  {
    id: "personal",
    title: "Personal Information",
    icon: User,
    description: "Basic personal details",
  },
  {
    id: "contact",
    title: "Contact Information",
    icon: Phone,
    description: "Phone numbers and emergency contacts",
  },
  {
    id: "location",
    title: "Location Details",
    icon: MapPin,
    description: "Address and geolocation",
  },
  {
    id: "role",
    title: "Role & Permissions",
    icon: Shield,
    description: "Role assignment and access permissions",
  },
  {
    id: "terms",
    title: "Terms & Agreement",
    icon: FileText,
    description: "Terms and conditions acceptance",
  },
];

// Helper function to add phone number
const addPhoneNumber = (phones: any[], setValue: any) => {
  const newPhone = { phone_number: "", phone_type: "primary" as const };
  setValue("phones", [...phones, newPhone]);
};

// Helper function to remove phone number
const removePhoneNumber = (index: number, phones: any[], setValue: any) => {
  const updatedPhones = phones.filter((_, i) => i !== index);
  setValue("phones", updatedPhones);
};

// Helper function to add emergency contact
const addEmergencyContact = (contacts: any[], setValue: any) => {
  const newContact = {
    name: "",
    relationship: "",
    phone_number: "",
    email: "",
    address: "",
  };
  setValue("emergency_contacts", [...contacts, newContact]);
};

// Helper function to remove emergency contact
const removeEmergencyContact = (
  index: number,
  contacts: any[],
  setValue: any
) => {
  const updatedContacts = contacts.filter((_, i) => i !== index);
  setValue("emergency_contacts", updatedContacts);
};

export function OperatorRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [showPassword, setShowPassword] = React.useState(false);
  const [locationMode, setLocationMode] = React.useState<"manual" | "map">(
    "manual"
  );

  const form = useForm<OperatorRegistrationFormData>({
    resolver: zodResolver(operatorRegistrationSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      firstname: "",
      middlename: "",
      lastname: "",
      fourthname: "",
      birthdate: "",
      gender: undefined,
      language: "",
      special_needs: "",
      email: "",
      address: "",
      phones: [{ phone_number: "", phone_type: "primary" }],
      emergency_contacts: [
        {
          name: "",
          relationship: "",
          phone_number: "",
          email: "",
          address: "",
        },
      ],
      latitude: undefined,
      longitude: undefined,
      role: "operator",
      status: "pending",
      allowed_actions: [],
      agree_to_terms: false,
      agree_to_confidentiality: false,
      agree_to_background_check: false,
    },
  });

  const {
    watch,
    trigger,
    formState: { errors, isValid },
  } = form;
  const watchedFields = watch();

  // Step validation functions
  const validateStep = async (step: number) => {
    const stepFields = {
      0: ["firstname", "lastname", "birthdate", "gender"], // Personal info
      1: ["phones", "emergency_contacts"], // Contact info
      2: ["address", "latitude", "longitude"], // Location
      3: ["role", "allowed_actions"], // Role & permissions
      4: [
        "agree_to_terms",
        "agree_to_confidentiality",
        "agree_to_background_check",
      ], // Terms
    };

    const fieldsToValidate = stepFields[step as keyof typeof stepFields] || [];
    return await trigger(fieldsToValidate as any);
  };

  const nextStep = async () => {
    const isStepValid = await validateStep(currentStep);
    if (isStepValid && currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  // Calculate form completion percentage
  const getCompletionPercentage = () => {
    const totalFields = Object.keys(watchedFields).length;
    const filledFields = Object.values(watchedFields).filter((value) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "boolean") return value;
      return value !== "" && value !== undefined && value !== null;
    }).length;
    return Math.round((filledFields / totalFields) * 100);
  };

  const onSubmit = async (data: OperatorRegistrationFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Operator registration data:", data);
      setIsSuccess(true);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-foreground">
                Registration Successful!
              </h3>
              <p className="text-muted-foreground text-lg">
                The operator has been successfully registered and will receive
                login credentials via email shortly.
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-400">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Account Security</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                All data is encrypted and secure. The operator will receive a
                secure password via email.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => {
                  setIsSuccess(false);
                  form.reset();
                  setCurrentStep(0);
                }}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Register Another Operator</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/admin/operators")}
                className="flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>View All Operators</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Operator Registration
              </CardTitle>
              <p className="text-muted-foreground">
                Register a new campaign operator with appropriate access levels
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Progress</div>
              <div className="text-2xl font-bold text-primary">
                {getCompletionPercentage()}%
              </div>
            </div>
          </div>
          <Progress value={getCompletionPercentage()} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Step Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {formSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const isAccessible = index <= currentStep || isCompleted;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center space-y-2"
                >
                  <button
                    type="button"
                    onClick={() => isAccessible && goToStep(index)}
                    disabled={!isAccessible}
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : isCompleted
                        ? "border-green-500 bg-green-500 text-white"
                        : isAccessible
                        ? "border-muted-foreground bg-background text-muted-foreground hover:border-primary hover:text-primary"
                        : "border-muted bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <StepIcon className="h-6 w-6" />
                    )}
                  </button>
                  <div className="text-center">
                    <div
                      className={`text-sm font-medium ${
                        isActive
                          ? "text-primary"
                          : isCompleted
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground hidden sm:block">
                      {step.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Form */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Step 1: Personal Information */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">
                    Personal Information
                  </h3>
                </div>
                <Separator />

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Please provide accurate personal information. This will be
                    used for identity verification and system access.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstname">First Name *</Label>
                    <Input
                      id="firstname"
                      {...form.register("firstname")}
                      placeholder="Enter first name"
                    />
                    {form.formState.errors.firstname && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.firstname.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastname">Last Name *</Label>
                    <Input
                      id="lastname"
                      {...form.register("lastname")}
                      placeholder="Enter last name"
                    />
                    {form.formState.errors.lastname && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.lastname.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="middlename">Middle Name</Label>
                    <Input
                      id="middlename"
                      {...form.register("middlename")}
                      placeholder="Enter middle name (optional)"
                    />
                    {form.formState.errors.middlename && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.middlename.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fourthname">Fourth Name</Label>
                    <Input
                      id="fourthname"
                      {...form.register("fourthname")}
                      placeholder="Enter fourth name (optional)"
                    />
                    {form.formState.errors.fourthname && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.fourthname.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthdate">Date of Birth</Label>
                    <Input
                      id="birthdate"
                      type="date"
                      {...form.register("birthdate")}
                    />
                    {form.formState.errors.birthdate && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.birthdate.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      onValueChange={(value) =>
                        form.setValue("gender", value as any)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.gender && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.gender.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Input
                      id="language"
                      {...form.register("language")}
                      placeholder="Primary language"
                    />
                    {form.formState.errors.language && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.language.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="special_needs">Special Needs</Label>
                    <Textarea
                      id="special_needs"
                      {...form.register("special_needs")}
                      placeholder="Describe any special needs or accommodations"
                      rows={3}
                    />
                    {form.formState.errors.special_needs && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.special_needs.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Step Navigation */}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2"
                  >
                    <span>Next: Contact Information</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                </div>
                <Separator />

                <Alert>
                  <Phone className="h-4 w-4" />
                  <AlertDescription>
                    Provide multiple contact methods to ensure we can reach you
                    when needed. At least one primary phone number is required.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        {...form.register("email")}
                        placeholder="operator@campaign.com"
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
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      {...form.register("address")}
                      placeholder="Enter complete address"
                      rows={3}
                    />
                    {form.formState.errors.address && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.address.message}
                      </p>
                    )}
                  </div>

                  {/* Phone Numbers */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Phone Numbers *</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          addPhoneNumber(
                            form.watch("phones") || [],
                            form.setValue
                          )
                        }
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Phone
                      </Button>
                    </div>

                    {form.watch("phones")?.map((phone, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`phone_${index}`}>Phone Number</Label>
                          <Input
                            id={`phone_${index}`}
                            {...form.register(`phones.${index}.phone_number`)}
                            placeholder="+252 61 234 5678"
                          />
                        </div>
                        <div className="w-32 space-y-2">
                          <Label htmlFor={`phone_type_${index}`}>Type</Label>
                          <Select
                            onValueChange={(value) =>
                              form.setValue(
                                `phones.${index}.phone_type`,
                                value as any
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="primary">Primary</SelectItem>
                              <SelectItem value="secondary">
                                Secondary
                              </SelectItem>
                              <SelectItem value="emergency">
                                Emergency
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {form.watch("phones")?.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              removePhoneNumber(
                                index,
                                form.watch("phones") || [],
                                form.setValue
                              )
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {form.formState.errors.phones && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.phones.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Contacts Section - Part of Step 2 */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Emergency Contacts</h3>
                </div>
                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Emergency Contacts *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addEmergencyContact(
                          form.watch("emergency_contacts") || [],
                          form.setValue
                        )
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Contact
                    </Button>
                  </div>

                  {form.watch("emergency_contacts")?.map((contact, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">
                          Emergency Contact {index + 1}
                        </h4>
                        {form.watch("emergency_contacts")?.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              removeEmergencyContact(
                                index,
                                form.watch("emergency_contacts") || [],
                                form.setValue
                              )
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`emergency_name_${index}`}>
                            Name *
                          </Label>
                          <Input
                            id={`emergency_name_${index}`}
                            {...form.register(
                              `emergency_contacts.${index}.name`
                            )}
                            placeholder="Contact person name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`emergency_relationship_${index}`}>
                            Relationship *
                          </Label>
                          <Input
                            id={`emergency_relationship_${index}`}
                            {...form.register(
                              `emergency_contacts.${index}.relationship`
                            )}
                            placeholder="e.g., Spouse, Parent, Sibling"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`emergency_phone_${index}`}>
                            Phone Number *
                          </Label>
                          <Input
                            id={`emergency_phone_${index}`}
                            {...form.register(
                              `emergency_contacts.${index}.phone_number`
                            )}
                            placeholder="+252 61 234 5678"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`emergency_email_${index}`}>
                            Email
                          </Label>
                          <Input
                            id={`emergency_email_${index}`}
                            type="email"
                            {...form.register(
                              `emergency_contacts.${index}.email`
                            )}
                            placeholder="contact@email.com"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`emergency_address_${index}`}>
                            Address
                          </Label>
                          <Textarea
                            id={`emergency_address_${index}`}
                            {...form.register(
                              `emergency_contacts.${index}.address`
                            )}
                            placeholder="Emergency contact address"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {form.formState.errors.emergency_contacts && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.emergency_contacts.message}
                    </p>
                  )}
                </div>

                {/* Step Navigation */}
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back: Contact Info</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2"
                  >
                    <span>Next: Location Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Location Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">
                    Location Information
                  </h3>
                </div>
                <Separator />

                <Alert>
                  <Map className="h-4 w-4" />
                  <AlertDescription>
                    Location information helps us assign you to the appropriate
                    region and optimize campaign logistics.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      {...form.register("address")}
                      placeholder="Enter complete address"
                      rows={3}
                    />
                    {form.formState.errors.address && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        {...form.register("latitude", { valueAsNumber: true })}
                        placeholder="9.5616"
                      />
                      {form.formState.errors.latitude && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.latitude.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        {...form.register("longitude", { valueAsNumber: true })}
                        placeholder="44.0650"
                      />
                      {form.formState.errors.longitude && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.longitude.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setLocationMode(
                          locationMode === "manual" ? "map" : "manual"
                        )
                      }
                      className="flex items-center space-x-2"
                    >
                      <Navigation className="h-4 w-4" />
                      <span>
                        {locationMode === "manual" ? "Use Map" : "Manual Entry"}
                      </span>
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {locationMode === "manual"
                        ? "Enter coordinates manually"
                        : "Click on map to set location"}
                    </span>
                  </div>
                </div>

                {/* Step Navigation */}
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back: Contact Info</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2"
                  >
                    <span>Next: Role & Permissions</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Role and Permissions */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">
                    Role and Permissions
                  </h3>
                </div>
                <Separator />

                <Alert>
                  <Settings className="h-4 w-4" />
                  <AlertDescription>
                    Select the appropriate role and permissions for this
                    operator. Permissions determine what actions they can
                    perform in the system.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select
                      onValueChange={(value) =>
                        form.setValue("role", value as any)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="operator">Operator</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.role && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.role.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      onValueChange={(value) =>
                        form.setValue("status", value as any)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.status && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.status.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4 md:col-span-2">
                    <Label>Allowed Actions *</Label>
                    <div className="space-y-4">
                      {Object.entries(availableActions).map(
                        ([category, actions]) => (
                          <div key={category} className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground">
                              {category}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {actions.map((action) => (
                                <div
                                  key={action.id}
                                  className="flex items-start space-x-2"
                                >
                                  <Checkbox
                                    id={action.id}
                                    checked={
                                      form
                                        .watch("allowed_actions")
                                        ?.includes(action.id) || false
                                    }
                                    onCheckedChange={(checked) => {
                                      const current =
                                        form.getValues("allowed_actions") || [];
                                      if (checked) {
                                        form.setValue("allowed_actions", [
                                          ...current,
                                          action.id,
                                        ]);
                                      } else {
                                        form.setValue(
                                          "allowed_actions",
                                          current.filter((a) => a !== action.id)
                                        );
                                      }
                                    }}
                                  />
                                  <div className="space-y-1">
                                    <Label
                                      htmlFor={action.id}
                                      className="text-sm font-medium"
                                    >
                                      {action.label}
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                      {action.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                    {form.formState.errors.allowed_actions && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.allowed_actions.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Step Navigation */}
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back: Location</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2"
                  >
                    <span>Next: Terms & Agreement</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Terms and Conditions */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">
                    Terms and Conditions
                  </h3>
                </div>
                <Separator />

                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    Please read and agree to the following terms and conditions
                    to complete your operator registration.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agree_to_terms"
                      checked={form.watch("agree_to_terms")}
                      onCheckedChange={(checked) =>
                        form.setValue("agree_to_terms", checked as boolean)
                      }
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor="agree_to_terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the employment terms and conditions *
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        By checking this box, you agree to our employment terms
                        and conditions.
                      </p>
                    </div>
                  </div>
                  {form.formState.errors.agree_to_terms && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.agree_to_terms.message}
                    </p>
                  )}

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agree_to_confidentiality"
                      checked={form.watch("agree_to_confidentiality")}
                      onCheckedChange={(checked) =>
                        form.setValue(
                          "agree_to_confidentiality",
                          checked as boolean
                        )
                      }
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor="agree_to_confidentiality"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to confidentiality agreement *
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        I understand the importance of maintaining
                        confidentiality regarding campaign information.
                      </p>
                    </div>
                  </div>
                  {form.formState.errors.agree_to_confidentiality && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.agree_to_confidentiality.message}
                    </p>
                  )}

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agree_to_background_check"
                      checked={form.watch("agree_to_background_check")}
                      onCheckedChange={(checked) =>
                        form.setValue(
                          "agree_to_background_check",
                          checked as boolean
                        )
                      }
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor="agree_to_background_check"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I consent to background check *
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        I consent to background verification as part of the
                        employment process.
                      </p>
                    </div>
                  </div>
                  {form.formState.errors.agree_to_background_check && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.agree_to_background_check.message}
                    </p>
                  )}
                </div>

                {/* Trust Signals */}
                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-700 dark:text-green-400 mb-2">
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Security & Privacy</span>
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400 space-y-1">
                    <p>• All data is encrypted and stored securely</p>
                    <p>
                      • Your information is protected by industry-standard
                      security measures
                    </p>
                    <p>• We comply with data protection regulations</p>
                  </div>
                </div>

                {/* Final Step Navigation */}
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back: Permissions</span>
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        form.reset();
                        setCurrentStep(0);
                      }}
                      disabled={isSubmitting}
                    >
                      Reset Form
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="min-w-[140px] flex items-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          <span>Registering...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Register Operator</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
