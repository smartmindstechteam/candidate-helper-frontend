"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Bus,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Upload,
  IdCard,
  Clock,
  Route,
  Fuel,
  Settings,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formUtils, useFormSubmission } from "@/lib/form-submission";

const busRegistrationSchema = z.object({
  // Bus Information
  busNumber: z.string().min(3, "Bus number must be at least 3 characters"),
  plateNumber: z.string().min(6, "License plate must be at least 6 characters"),
  busType: z
    .enum(["standard", "deluxe", "minibus", "coach"])
    .refine((val) => val !== undefined, {
      message: "Please select a bus type",
    }),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  year: z.number().min(1990, "Year must be 1990 or later"),
  manufacturer: z.string().min(2, "Manufacturer is required"),
  model: z.string().min(2, "Model is required"),
  color: z.string().min(2, "Color is required"),

  // Driver Information
  driverName: z.string().min(2, "Driver name must be at least 2 characters"),
  driverPhone: z
    .string()
    .min(10, "Driver phone must be at least 10 characters"),
  driverEmail: z.string().email("Please enter a valid email address"),
  driverLicense: z
    .string()
    .min(8, "Driver license must be at least 8 characters"),
  driverIdNumber: z.string().min(5, "Driver ID must be at least 5 characters"),

  // Route Information
  assignedRoute: z.string().min(1, "Assigned route is required"),
  startLocation: z.string().min(2, "Start location is required"),
  endLocation: z.string().min(2, "End location is required"),
  intermediateStops: z.string().optional(),

  // Operational Information
  fuelType: z
    .enum(["diesel", "petrol", "electric", "hybrid"])
    .refine((val) => val !== undefined, {
      message: "Please select a fuel type",
    }),
  maintenanceDate: z.string().min(1, "Last maintenance date is required"),
  insuranceExpiry: z.string().min(1, "Insurance expiry date is required"),
  inspectionDate: z.string().min(1, "Last inspection date is required"),

  // Status and Preferences
  status: z
    .enum(["active", "maintenance", "inactive", "retired"])
    .refine((val) => val !== undefined, {
      message: "Please select a status",
    }),
  isGpsEnabled: z.boolean().optional(),
  hasWifi: z.boolean().optional(),
  hasAirConditioning: z.boolean().optional(),
  isAccessible: z.boolean().optional(),

  // Additional Information
  notes: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
});

type BusRegistrationFormData = z.infer<typeof busRegistrationSchema>;

const busTypes = [
  { value: "standard", label: "Standard Bus", capacity: 50 },
  { value: "deluxe", label: "Deluxe Bus", capacity: 40 },
  { value: "minibus", label: "Minibus", capacity: 20 },
  { value: "coach", label: "Coach", capacity: 60 },
];

const fuelTypes = [
  { value: "diesel", label: "Diesel" },
  { value: "petrol", label: "Petrol" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
];

const routes = [
  "Hargeisa - Berbera",
  "Hargeisa - Burao",
  "Hargeisa - Borama",
  "Hargeisa - Las Anod",
  "Hargeisa - Erigavo",
  "Berbera - Burao",
  "Burao - Las Anod",
  "Borama - Hargeisa",
  "Las Anod - Erigavo",
  "Erigavo - Hargeisa",
];

export function BusRegistrationForm() {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [selectedBusType, setSelectedBusType] = React.useState("");

  const { isSubmitting, error, errors, submitForm, clearErrors } =
    useFormSubmission();

  const form = useForm<BusRegistrationFormData>({
    resolver: zodResolver(busRegistrationSchema),
    defaultValues: {
      isGpsEnabled: true,
      hasWifi: false,
      hasAirConditioning: true,
      isAccessible: false,
      status: "active",
    },
  });

  const onSubmit = async (data: BusRegistrationFormData) => {
    const result = await submitForm(async () => {
      return formUtils.submitBusRegistration(data);
    });

    if (result.success) {
      setIsSuccess(true);
    }
  };

  const handleBusTypeChange = (value: string) => {
    setSelectedBusType(value);
    const busType = busTypes.find((type) => type.value === value);
    if (busType) {
      form.setValue("capacity", busType.capacity);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                Bus Registration Successful!
              </h3>
              <p className="text-muted-foreground mt-2">
                The bus has been successfully registered in the system.
              </p>
            </div>
            <Button
              onClick={() => {
                setIsSuccess(false);
                form.reset();
              }}
              className="mt-4"
            >
              Register Another Bus
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bus className="h-6 w-6 text-primary" />
          Bus Registration
        </CardTitle>
        <p className="text-muted-foreground">
          Register a new bus for the campaign transport system
        </p>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive font-medium">Error</p>
            </div>
            <p className="text-sm text-destructive mt-1">{error}</p>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Bus Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bus className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Bus Information</h3>
            </div>
            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="busNumber">Bus Number *</Label>
                <Input
                  id="busNumber"
                  {...form.register("busNumber")}
                  placeholder="e.g., BUS-001"
                />
                {form.formState.errors.busNumber && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.busNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="plateNumber">License Plate *</Label>
                <Input
                  id="plateNumber"
                  {...form.register("plateNumber")}
                  placeholder="e.g., SL-123-ABC"
                />
                {form.formState.errors.plateNumber && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.plateNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="busType">Bus Type *</Label>
                <Select onValueChange={handleBusTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bus type" />
                  </SelectTrigger>
                  <SelectContent>
                    {busTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label} ({type.capacity} seats)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.busType && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.busType.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  {...form.register("capacity", { valueAsNumber: true })}
                  placeholder="Number of seats"
                />
                {form.formState.errors.capacity && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.capacity.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  {...form.register("year", { valueAsNumber: true })}
                  placeholder="Manufacturing year"
                />
                {form.formState.errors.year && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.year.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer *</Label>
                <Input
                  id="manufacturer"
                  {...form.register("manufacturer")}
                  placeholder="e.g., Mercedes, Volvo"
                />
                {form.formState.errors.manufacturer && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.manufacturer.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  {...form.register("model")}
                  placeholder="e.g., Sprinter, B7R"
                />
                {form.formState.errors.model && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.model.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color *</Label>
                <Input
                  id="color"
                  {...form.register("color")}
                  placeholder="e.g., Blue, White"
                />
                {form.formState.errors.color && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.color.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Driver Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Driver Information</h3>
            </div>
            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="driverName">Driver Name *</Label>
                <Input
                  id="driverName"
                  {...form.register("driverName")}
                  placeholder="Full name"
                />
                {form.formState.errors.driverName && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.driverName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="driverPhone">Driver Phone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="driverPhone"
                    {...form.register("driverPhone")}
                    placeholder="+252 61 234 5678"
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.driverPhone && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.driverPhone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="driverEmail">Driver Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="driverEmail"
                    type="email"
                    {...form.register("driverEmail")}
                    placeholder="driver@email.com"
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.driverEmail && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.driverEmail.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="driverLicense">Driver License *</Label>
                <Input
                  id="driverLicense"
                  {...form.register("driverLicense")}
                  placeholder="License number"
                />
                {form.formState.errors.driverLicense && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.driverLicense.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="driverIdNumber">Driver ID Number *</Label>
                <Input
                  id="driverIdNumber"
                  {...form.register("driverIdNumber")}
                  placeholder="National ID or passport number"
                />
                {form.formState.errors.driverIdNumber && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.driverIdNumber.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Route Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Route className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Route Information</h3>
            </div>
            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="assignedRoute">Assigned Route *</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("assignedRoute", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route} value={route}>
                        {route}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.assignedRoute && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.assignedRoute.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="startLocation">Start Location *</Label>
                <Input
                  id="startLocation"
                  {...form.register("startLocation")}
                  placeholder="Starting point"
                />
                {form.formState.errors.startLocation && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.startLocation.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endLocation">End Location *</Label>
                <Input
                  id="endLocation"
                  {...form.register("endLocation")}
                  placeholder="Destination"
                />
                {form.formState.errors.endLocation && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.endLocation.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="intermediateStops">Intermediate Stops</Label>
                <Textarea
                  id="intermediateStops"
                  {...form.register("intermediateStops")}
                  placeholder="List intermediate stops (optional)"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Operational Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Operational Information</h3>
            </div>
            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type *</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("fuelType", value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((fuel) => (
                      <SelectItem key={fuel.value} value={fuel.value}>
                        {fuel.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.fuelType && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.fuelType.message}
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.status && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.status.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenanceDate">Last Maintenance Date *</Label>
                <Input
                  id="maintenanceDate"
                  type="date"
                  {...form.register("maintenanceDate")}
                />
                {form.formState.errors.maintenanceDate && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.maintenanceDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="insuranceExpiry">Insurance Expiry Date *</Label>
                <Input
                  id="insuranceExpiry"
                  type="date"
                  {...form.register("insuranceExpiry")}
                />
                {form.formState.errors.insuranceExpiry && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.insuranceExpiry.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="inspectionDate">Last Inspection Date *</Label>
                <Input
                  id="inspectionDate"
                  type="date"
                  {...form.register("inspectionDate")}
                />
                {form.formState.errors.inspectionDate && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.inspectionDate.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Bus Features</h3>
            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isGpsEnabled"
                  checked={form.watch("isGpsEnabled")}
                  onCheckedChange={(checked) =>
                    form.setValue("isGpsEnabled", checked as boolean)
                  }
                />
                <Label htmlFor="isGpsEnabled">GPS Tracking Enabled</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasWifi"
                  checked={form.watch("hasWifi")}
                  onCheckedChange={(checked) =>
                    form.setValue("hasWifi", checked as boolean)
                  }
                />
                <Label htmlFor="hasWifi">WiFi Available</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasAirConditioning"
                  checked={form.watch("hasAirConditioning")}
                  onCheckedChange={(checked) =>
                    form.setValue("hasAirConditioning", checked as boolean)
                  }
                />
                <Label htmlFor="hasAirConditioning">Air Conditioning</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isAccessible"
                  checked={form.watch("isAccessible")}
                  onCheckedChange={(checked) =>
                    form.setValue("isAccessible", checked as boolean)
                  }
                />
                <Label htmlFor="isAccessible">Wheelchair Accessible</Label>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                <Input
                  id="emergencyContact"
                  {...form.register("emergencyContact")}
                  placeholder="Emergency contact person"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  {...form.register("emergencyPhone")}
                  placeholder="+252 61 234 5678"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  {...form.register("notes")}
                  placeholder="Additional notes or comments"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isSubmitting}
            >
              Reset Form
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Registering...
                </>
              ) : (
                "Register Bus"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
