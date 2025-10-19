"use client";

import * as React from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Phone,
  MapPin,
  IdCard,
  FileText,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Info,
  Heart,
  Users,
  ChevronsUpDown,
  Crosshair, // Added Crosshair icon
} from "lucide-react";
import {
  CreateSupporterInput,
  createSupporterSchema,
} from "@/lib/validations/supporter";
import {
  useDistricts,
  usePollingStations,
  useRegions,
} from "@/hooks/api/useGeography";
import { useCreateSupporter } from "@/hooks/api/useSupporters";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Progress } from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { Input } from "../ui/input";
import { Gender, SupporterStatus } from "@/types/enums";
// --- MOCKED UI COMPONENTS & UTILS (to resolve imports) ---

const formSteps = [
  { id: "personal", title: "Personal", icon: User },
  { id: "contact", title: "Contact", icon: Phone },
  { id: "location", title: "Location", icon: MapPin },
  { id: "identity", title: "Identity", icon: IdCard },
  { id: "finalize", title: "Finalize", icon: FileText },
];

export function SupporterRegistrationForm() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [selectedRegionId, setSelectedRegionId] = React.useState<
    number | undefined
  >();
  const [selectedDistrictId, setSelectedDistrictId] = React.useState<
    number | undefined
  >();

  const { data: regions, isLoading: isLoadingRegions } = useRegions();
  const { data: districts, isLoading: isLoadingDistricts } =
    useDistricts(selectedRegionId);
  const { data: pollingStations, isLoading: isLoadingPollingStations } =
    usePollingStations(selectedDistrictId);
  const {
    mutate: createSupporter,
    isPending: isCreating,
    isSuccess,
    isError: isCreationError,
  } = useCreateSupporter();

  const form = useForm<CreateSupporterInput>({
    resolver: zodResolver(createSupporterSchema),
    mode: "onChange",
    defaultValues: {
      phones: [{ type: "primary", phone: "" }],
      emergencyContacts: [],
      status: SupporterStatus.PENDING,
      language: "somali",
      gender: Gender.M,
    },
  });

  const {
    control,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({ control, name: "phones" });
  const {
    fields: emergencyFields,
    append: appendEmergency,
    remove: removeEmergency,
  } = useFieldArray({ control, name: "emergencyContacts" });

  const watchedRegion = watch("regionId");
  const watchedDistrict = watch("districtId");

  React.useEffect(() => {
    if (watchedRegion !== selectedRegionId) {
      setSelectedRegionId(watchedRegion);
      setValue("districtId", undefined as any);
      setValue("pollingStationId", undefined as any);
      setSelectedDistrictId(undefined);
    }
  }, [watchedRegion, selectedRegionId, setValue]);

  React.useEffect(() => {
    if (watchedDistrict !== selectedDistrictId) {
      setSelectedDistrictId(watchedDistrict);
      setValue("pollingStationId", undefined as any);
    }
  }, [watchedDistrict, selectedDistrictId, setValue]);

  // --- GPS Location Handler ---
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue("latitude", position.coords.latitude, {
            shouldValidate: true,
          });
          setValue("longitude", position.coords.longitude, {
            shouldValidate: true,
          });
          // Optionally, you could show a success message to the user here.
        },
        (error) => {
          console.error("Error getting location: ", error);
          // In a real app, you would show a user-friendly error message.
          alert(`Error: ${error.message}`);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // In a real app, inform the user that their browser doesn't support this feature.
      alert("Geolocation is not supported by your browser.");
    }
  };

  const nextStep = async () => {
    const stepFields: (keyof CreateSupporterInput)[][] = [
      [
        "firstname",
        "middlename",
        "lastname",
        "fourthname",
        "birthdate",
        "gender",
      ],
      ["phones", "language", "email", "emergencyContacts"],
      // Updated location step to include lat/long for validation
      [
        "regionId",
        "districtId",
        "pollingStationId",
        "address",
        "latitude",
        "longitude",
      ],
      ["voterId", "favParty", "specialNeeds"],
      [],
    ];
    const isValid = await trigger(stepFields[currentStep]);
    if (isValid && currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const onSubmit: SubmitHandler<CreateSupporterInput> = (data) =>
    createSupporter(data);

  if (isSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="mt-4">Registration Successful</CardTitle>
          <CardDescription>
            The supporter has been successfully registered.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Heart className="h-4 w-4" />
            <AlertTitle>Welcome to the Team!</AlertTitle>
            <AlertDescription>
              Your support is crucial for building a better future.
            </AlertDescription>
          </Alert>
          <div className="flex justify-center gap-4">
            <Button onClick={() => window.location.reload()}>
              <Plus className="mr-2 h-4 w-4" /> Register Another
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/admin/supporters")}
            >
              <Users className="mr-2 h-4 w-4" /> View Supporters
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>New Supporter Registration</CardTitle>
        <CardDescription>
          Follow the steps to add a new supporter to the campaign.
        </CardDescription>
        <Progress
          value={((currentStep + 1) / formSteps.length) * 100}
          className="mt-4"
        />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-start mb-8 text-center">
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
                    <CheckCircle2 size={20} />
                  ) : (
                    <step.icon size={20} />
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
          <div className={currentStep === 0 ? "block" : "hidden"}>
            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="firstname"
                label="First Name *"
                control={control}
                placeholder="e.g. Mohamed"
              />
              <InputField
                name="middlename"
                label="Middle Name *"
                control={control}
                placeholder="e.g. Abdullahi"
              />
              <InputField
                name="lastname"
                label="Last Name *"
                control={control}
                placeholder="e.g. Hassan"
              />
              <InputField
                name="fourthname"
                label="Fourth Name"
                control={control}
                placeholder="e.g. Ali"
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

          <div className={currentStep === 1 ? "block" : "hidden"}>
            <h3 className="text-lg font-medium mb-4">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="email"
                label="Email Address (Optional)"
                control={control}
                placeholder="supporter@example.com"
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
            <div className="mt-6">
              <Label>Phone Numbers *</Label>
              {phoneFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 mt-2">
                  <Controller
                    name={`phones.${index}.type`}
                    control={control}
                    render={({ field }) => (
                      <select
                        onChange={field.onChange}
                        defaultValue={field.value}
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                  {errors.phones.message || errors.phones.root?.message}
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
                  <Plus size={16} className="mr-2" />
                  Add Phone
                </Button>
              )}
            </div>
            <div className="mt-6">
              <Label>Emergency Contacts (Optional)</Label>
              {emergencyFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-3 border rounded-md mt-2 space-y-2 relative"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      name={`emergencyContact.${index}.name`}
                      control={control}
                      label="Full Name"
                      placeholder="e.g. Aisha Ali"
                    />
                    <InputField
                      name={`emergencyContact.${index}.relationship`}
                      control={control}
                      label="Relationship"
                      placeholder="e.g. Sister"
                    />
                    <InputField
                      name={`emergencyContact.${index}.phone`}
                      control={control}
                      label="Phone Number"
                      placeholder="e.g. 634111222"
                    />
                    <InputField
                      name={`emergencyContact.${index}.email`}
                      control={control}
                      label="Email (Optional)"
                      placeholder="e.g. aisha@email.com"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1"
                    onClick={() => removeEmergency(index)}
                  >
                    <Trash2 className="text-destructive" size={16} />
                  </Button>
                </div>
              ))}
              {emergencyFields.length < 2 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() =>
                    appendEmergency({
                      name: "",
                      relationship: "",
                      phone: "",
                      email: "",
                    })
                  }
                >
                  <Plus size={16} className="mr-2" />
                  Add Contact
                </Button>
              )}
            </div>
          </div>

          <div className={currentStep === 2 ? "block" : "hidden"}>
            <h3 className="text-lg font-medium mb-4">Geographic Location *</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SearchableSelectField
                name="regionId"
                label="Region"
                control={control}
                options={regions}
                placeholder="Select Region"
                loading={isLoadingRegions}
                disabled={isLoadingRegions}
              />
              <SearchableSelectField
                name="districtId"
                label="District"
                control={control}
                options={districts}
                placeholder="Select District"
                loading={isLoadingDistricts}
                disabled={!selectedRegionId || isLoadingDistricts}
              />
              <SearchableSelectField
                name="pollingStationId"
                label="Polling Station"
                control={control}
                options={pollingStations}
                placeholder="Select Polling Station"
                loading={isLoadingPollingStations}
                disabled={!selectedDistrictId || isLoadingPollingStations}
              />
              <InputField
                name="address"
                label="Home Address (Optional)"
                control={control}
                placeholder="e.g. Jigjiga Yar, Hargeisa"
              />
              {/* --- New Latitude/Longitude fields --- */}
              <InputField
                name="latitude"
                label="Latitude (Optional)"
                control={control}
                type="number"
                placeholder="e.g. 9.5623"
              />
              <InputField
                name="longitude"
                label="Longitude (Optional)"
                control={control}
                type="number"
                placeholder="e.g. 44.0769"
              />
            </div>
            {/* --- New GPS Button --- */}
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleGetLocation}
              >
                <Crosshair className="mr-2 h-4 w-4" />
                Get GPS Coordinates
              </Button>
            </div>
          </div>

          <div className={currentStep === 3 ? "block" : "hidden"}>
            <h3 className="text-lg font-medium mb-4">
              Voter & Additional Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="voterId"
                label="Voter ID (Optional)"
                control={control}
                placeholder="e.g. SL-1234567"
              />
              <InputField
                name="favParty"
                label="Favorite Party (Optional)"
                control={control}
                placeholder="e.g. Kulmiye"
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="specialNeeds">Special Needs (Optional)</Label>
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

          <div className={currentStep === 4 ? "block" : "hidden"}>
            <h3 className="text-lg font-medium mb-4">Review and Submit</h3>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Final Step!</AlertTitle>
              <AlertDescription>
                Please review all information before submitting. The
                registration will be sent for approval.
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

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            {currentStep < formSteps.length - 1 ? (
              <Button type="button" onClick={nextStep}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Submitting..." : "Submit Registration"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

const InputField = ({
  name,
  label,
  control,
  type = "text",
  placeholder,
  noLabel = false,
}: any) => (
  <div className="space-y-2 flex-grow">
    {!noLabel && <Label htmlFor={name}>{label}</Label>}
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
            value={field.value || ""}
            step={type === "number" ? "any" : undefined}
          />
          {error && <p className="text-sm text-destructive">{error.message}</p>}
        </>
      )}
    />
  </div>
);

const SelectField = ({ name, label, control, options, placeholder }: any) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <select
            id={name}
            {...field}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {error && <p className="text-sm text-destructive">{error.message}</p>}
        </>
      )}
    />
  </div>
);

const SearchableSelectField = ({
  name,
  label,
  control,
  options,
  placeholder,
  loading,
  disabled,
}: any) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between font-normal"
                  disabled={disabled}
                >
                  {field.value
                    ? options?.find((o: any) => o.id === field.value)?.name
                    : loading
                    ? "Loading..."
                    : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput
                    placeholder={`Search ${label.toLowerCase()}...`}
                  />
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {options?.map((option: any) => (
                      <CommandItem
                        key={option.id}
                        value={option.name}
                        onSelect={() => {
                          field.onChange(option.id);
                          setOpen(false);
                        }}
                      >
                        {option.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {error && (
              <p className="text-sm text-destructive">{error.message}</p>
            )}
          </>
        )}
      />
    </div>
  );
};
