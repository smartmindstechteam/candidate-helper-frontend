"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarIcon,
  MapPin,
  Phone,
  User,
  Mail,
  IdCard,
  Upload,
  CheckCircle,
  Plus,
  Trash2,
  Users,
  Navigation,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  Map,
  Languages,
  UserCheck,
  Settings,
  FileText,
  BarChart3,
  Send,
  Archive,
  Target,
  Activity,
  Info,
  AlertCircle,
  Lock,
  Globe,
  Heart,
  Star,
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
  supporterRegistrationSchema,
  type SupporterRegistrationFormData,
} from "@/lib/validations/supporter";
import { formUtils, useFormSubmission } from "@/lib/form-submission";

// Mock data for regions, districts, and polling stations
const regions = [
  { id: 1, name: "Maroodi Jeex" },
  { id: 2, name: "Sanaag" },
  { id: 3, name: "Sool" },
  { id: 4, name: "Togdheer" },
  { id: 5, name: "Awdal" },
  { id: 6, name: "Sahil" },
];

const districts = [
  { id: 1, name: "Hargeisa Central", region_id: 1 },
  { id: 2, name: "Hargeisa North", region_id: 1 },
  { id: 3, name: "Hargeisa South", region_id: 1 },
  { id: 4, name: "Hargeisa East", region_id: 1 },
  { id: 5, name: "Hargeisa West", region_id: 1 },
  { id: 6, name: "Berbera", region_id: 1 },
  { id: 7, name: "Burao", region_id: 4 },
  { id: 8, name: "Borama", region_id: 5 },
  { id: 9, name: "Las Anod", region_id: 3 },
  { id: 10, name: "Erigavo", region_id: 2 },
  { id: 11, name: "Ceerigaabo", region_id: 2 },
  { id: 12, name: "Caynabo", region_id: 3 },
  { id: 13, name: "Laasqoray", region_id: 2 },
  { id: 14, name: "Oodweyne", region_id: 4 },
  { id: 15, name: "Sheikh", region_id: 1 },
  { id: 16, name: "Zeila", region_id: 5 },
];

const pollingStations = [
  {
    id: 1,
    name: "Hargeisa Central Station 1",
    district_id: 1,
    latitude: 9.5616,
    longitude: 44.065,
  },
  {
    id: 2,
    name: "Hargeisa Central Station 2",
    district_id: 1,
    latitude: 9.562,
    longitude: 44.0655,
  },
  {
    id: 3,
    name: "Hargeisa North Station 1",
    district_id: 2,
    latitude: 9.57,
    longitude: 44.07,
  },
  {
    id: 4,
    name: "Berbera Station 1",
    district_id: 6,
    latitude: 10.4342,
    longitude: 45.0137,
  },
  {
    id: 5,
    name: "Burao Station 1",
    district_id: 7,
    latitude: 9.5221,
    longitude: 45.5336,
  },
];

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
    id: "residency",
    title: "Residency Location",
    icon: MapPin,
    description: "Where you currently live",
  },
  {
    id: "voting",
    title: "Voting Location",
    icon: Map,
    description: "Where you will vote",
  },
  {
    id: "additional",
    title: "Additional Information",
    icon: IdCard,
    description: "Voter ID and preferences",
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
  const newPhone = { phone_number: "", phone_type: "secondary" as const };
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

export function SupporterRegistrationForm() {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);

  const { isSubmitting, error, errors, submitForm, clearErrors } =
    useFormSubmission();
  const [selectedRegion, setSelectedRegion] = React.useState<
    number | undefined
  >();
  const [selectedDistrict, setSelectedDistrict] = React.useState<
    number | undefined
  >();
  const [selectedResidencyRegion, setSelectedResidencyRegion] = React.useState<
    number | undefined
  >();
  const [selectedResidencyDistrict, setSelectedResidencyDistrict] =
    React.useState<number | undefined>();

  const form = useForm<SupporterRegistrationFormData>({
    resolver: zodResolver(supporterRegistrationSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      firstname: "",
      lastname: "",
      phones: [{ phone_number: "", phone_type: "primary" as const }],
      emergency_contacts: [{ name: "", relationship: "", phone_number: "" }],
      receive_updates: true,
      agree_to_terms: false,
      agree_to_data_processing: false,
    },
  });

  const {
    watch,
    trigger,
    formState: { errors: formErrors, isValid },
  } = form;
  const watchedFields = watch();

  // Step validation functions
  const validateStep = async (step: number) => {
    const stepFields = {
      0: ["firstname", "lastname", "birthdate", "gender"], // Personal info
      1: ["phones", "emergency_contacts"], // Contact info
      2: ["residency_address", "residency_region_id", "residency_district_id"], // Residency
      3: ["region_id", "district_id", "pollingstation_id"], // Voting location
      4: ["voter_id", "fav_party"], // Additional info
      5: ["agree_to_terms", "agree_to_data_processing"], // Terms
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

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    control: form.control,
    name: "phones",
  });

  const {
    fields: emergencyFields,
    append: appendEmergency,
    remove: removeEmergency,
  } = useFieldArray({
    control: form.control,
    name: "emergency_contacts",
  });

  // Filter districts based on selected region
  const filteredDistricts = selectedRegion
    ? districts.filter((district) => district.region_id === selectedRegion)
    : districts;

  // Filter polling stations based on selected district
  const filteredPollingStations = selectedDistrict
    ? pollingStations.filter(
        (station) => station.district_id === selectedDistrict
      )
    : pollingStations;

  // Filter districts for residency based on selected residency region
  const filteredResidencyDistricts = selectedResidencyRegion
    ? districts.filter(
        (district) => district.region_id === selectedResidencyRegion
      )
    : districts;

  const onSubmit = async (data: any) => {
    const result = await submitForm(async () => {
      return formUtils.submitSupporterRegistration(data);
    });

    if (result.success) {
      setIsSuccess(true);
    }
  };

  const handleRegionChange = (regionId: string) => {
    const regionIdNum = parseInt(regionId);
    setSelectedRegion(regionIdNum);
    setSelectedDistrict(undefined);
    form.setValue("region_id", regionIdNum);
    form.setValue("district_id", undefined);
    form.setValue("pollingstation_id", undefined);
  };

  const handleDistrictChange = (districtId: string) => {
    const districtIdNum = parseInt(districtId);
    setSelectedDistrict(districtIdNum);
    form.setValue("district_id", districtIdNum);
    form.setValue("pollingstation_id", undefined);
  };

  const handleResidencyRegionChange = (regionId: string) => {
    const regionIdNum = parseInt(regionId);
    setSelectedResidencyRegion(regionIdNum);
    setSelectedResidencyDistrict(undefined);
    form.setValue("residency_region_id", regionIdNum);
    form.setValue("residency_district_id", undefined);
  };

  const handleResidencyDistrictChange = (districtId: string) => {
    const districtIdNum = parseInt(districtId);
    setSelectedResidencyDistrict(districtIdNum);
    form.setValue("residency_district_id", districtIdNum);
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
                Thank you for registering as a supporter. You will receive a
                confirmation message shortly.
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-400">
                <Heart className="h-5 w-5" />
                <span className="font-medium">Welcome to Our Campaign!</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Your support means everything to us. Together, we can make a
                difference in Somaliland's future.
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
                <span>Register Another Supporter</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/admin/supporters")}
                className="flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>View All Supporters</span>
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
                <User className="h-6 w-6 text-primary" />
                Supporter Registration
              </CardTitle>
              <p className="text-muted-foreground">
                Join our campaign and make a difference in Somaliland's future
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
                    used for identity verification and voter registration.
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

                {/* Emergency Contacts Section - Part of Step 2 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">
                      Emergency Contacts
                    </h3>
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
                    <span>Back: Personal Info</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2"
                  >
                    <span>Next: Residency Location</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Residency Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Residency Location</h3>
                </div>
                <Separator />

                <Alert>
                  <Map className="h-4 w-4" />
                  <AlertDescription>
                    Please provide your current residency information. This
                    helps us understand our supporter base and plan campaign
                    activities.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="residency_region_id">Region</Label>
                    <Select onValueChange={handleResidencyRegionChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your residency region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem
                            key={region.id}
                            value={region.id.toString()}
                          >
                            {region.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.residency_region_id && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.residency_region_id.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="residency_district_id">District</Label>
                    <Select
                      onValueChange={handleResidencyDistrictChange}
                      disabled={!selectedResidencyRegion}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your residency district" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredResidencyDistricts.map((district) => (
                          <SelectItem
                            key={district.id}
                            value={district.id.toString()}
                          >
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.residency_district_id && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.residency_district_id.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="residency_address">Residency Address</Label>
                    <Textarea
                      id="residency_address"
                      {...form.register("residency_address")}
                      placeholder="Enter your complete residency address (optional)"
                      rows={3}
                    />
                    {form.formState.errors.residency_address && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.residency_address.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="residency_latitude">Latitude</Label>
                    <div className="relative">
                      <Navigation className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="residency_latitude"
                        type="number"
                        step="any"
                        {...form.register("residency_latitude", {
                          valueAsNumber: true,
                        })}
                        placeholder="9.5616"
                        className="pl-10"
                      />
                    </div>
                    {form.formState.errors.residency_latitude && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.residency_latitude.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="residency_longitude">Longitude</Label>
                    <div className="relative">
                      <Navigation className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="residency_longitude"
                        type="number"
                        step="any"
                        {...form.register("residency_longitude", {
                          valueAsNumber: true,
                        })}
                        placeholder="44.0650"
                        className="pl-10"
                      />
                    </div>
                    {form.formState.errors.residency_longitude && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.residency_longitude.message}
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
                    <span>Back: Contact Info</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2"
                  >
                    <span>Next: Voting Location</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Voting Location Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">
                    Voting Location Information
                  </h3>
                </div>
                <Separator />

                <Alert>
                  <MapPin className="h-4 w-4" />
                  <AlertDescription>
                    Please provide your voting location information. This helps
                    us ensure you're registered at the correct polling station.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="region_id">Region</Label>
                    <Select onValueChange={handleRegionChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem
                            key={region.id}
                            value={region.id.toString()}
                          >
                            {region.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.region_id && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.region_id.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district_id">District</Label>
                    <Select
                      onValueChange={handleDistrictChange}
                      disabled={!selectedRegion}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your district" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredDistricts.map((district) => (
                          <SelectItem
                            key={district.id}
                            value={district.id.toString()}
                          >
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.district_id && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.district_id.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="voting_address">Voting Address</Label>
                    <Textarea
                      id="voting_address"
                      {...form.register("voting_address")}
                      placeholder="Enter your complete voting address (optional)"
                      rows={3}
                    />
                    {form.formState.errors.voting_address && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.voting_address.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="pollingstation_id">Polling Station</Label>
                    <Select
                      onValueChange={(value) =>
                        form.setValue("pollingstation_id", parseInt(value))
                      }
                      disabled={!selectedDistrict}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your polling station" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredPollingStations.map((station) => (
                          <SelectItem
                            key={station.id}
                            value={station.id.toString()}
                          >
                            {station.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.pollingstation_id && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.pollingstation_id.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <div className="relative">
                      <Navigation className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        {...form.register("latitude", { valueAsNumber: true })}
                        placeholder="9.5616"
                        className="pl-10"
                      />
                    </div>
                    {form.formState.errors.latitude && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.latitude.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <div className="relative">
                      <Navigation className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        {...form.register("longitude", { valueAsNumber: true })}
                        placeholder="44.0650"
                        className="pl-10"
                      />
                    </div>
                    {form.formState.errors.longitude && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.longitude.message}
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
                    <span>Back: Residency</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2"
                  >
                    <span>Next: Additional Info</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Additional Information */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <IdCard className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">
                    Additional Information
                  </h3>
                </div>
                <Separator />

                <Alert>
                  <IdCard className="h-4 w-4" />
                  <AlertDescription>
                    Provide additional information to help us better understand
                    your preferences and verify your identity.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="voter_id">Voter ID</Label>
                    <Input
                      id="voter_id"
                      {...form.register("voter_id")}
                      placeholder="Your voter identification number"
                    />
                    {form.formState.errors.voter_id && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.voter_id.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fav_party">Favorite Party</Label>
                    <Input
                      id="fav_party"
                      {...form.register("fav_party")}
                      placeholder="Your preferred political party"
                    />
                    {form.formState.errors.fav_party && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.fav_party.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="photo_verification">
                      Photo Verification URL
                    </Label>
                    <div className="relative">
                      <Upload className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="photo_verification"
                        {...form.register("photo_verification")}
                        placeholder="https://example.com/photo.jpg"
                        className="pl-10"
                      />
                    </div>
                    {form.formState.errors.photo_verification && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.photo_verification.message}
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
                    <span>Back: Voting Location</span>
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

            {/* Step 6: Terms and Conditions */}
            {currentStep === 5 && (
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
                    to complete your supporter registration.
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
                        I agree to the terms and conditions *
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        By checking this box, you agree to our terms of service
                        and privacy policy.
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
                      id="agree_to_data_processing"
                      checked={form.watch("agree_to_data_processing")}
                      onCheckedChange={(checked) =>
                        form.setValue(
                          "agree_to_data_processing",
                          checked as boolean
                        )
                      }
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor="agree_to_data_processing"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I consent to data processing *
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        I consent to the processing of my personal data for
                        campaign purposes.
                      </p>
                    </div>
                  </div>
                  {form.formState.errors.agree_to_data_processing && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.agree_to_data_processing.message}
                    </p>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="receive_updates"
                      checked={form.watch("receive_updates")}
                      onCheckedChange={(checked) =>
                        form.setValue("receive_updates", checked)
                      }
                    />
                    <Label
                      htmlFor="receive_updates"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Receive campaign updates and notifications
                    </Label>
                  </div>
                </div>

                {/* Trust Signals */}
                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-700 dark:text-green-400 mb-2">
                    <Heart className="h-5 w-5" />
                    <span className="font-medium">Your Privacy Matters</span>
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
                    <span>Back: Additional Info</span>
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
                          <span>Register Supporter</span>
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
