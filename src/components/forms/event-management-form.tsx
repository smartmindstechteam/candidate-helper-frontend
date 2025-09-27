"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  DollarSign,
  FileText,
  Image,
  Video,
  Mic,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Tag,
  Shield,
  AlertTriangle,
  Phone,
  Mail,
  Building,
  Target,
  X,
  ExternalLink,
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
import { eventFormSchema, type EventFormInput } from "@/lib/validations/event";
import { type Event } from "@/types/event";

// Mock data - in a real app, this would come from API
const districts = [
  { id: 1, name: "Hargeisa Central", region_id: 1 },
  { id: 2, name: "Hargeisa North", region_id: 1 },
  { id: 3, name: "Hargeisa South", region_id: 1 },
  { id: 4, name: "Hargeisa East", region_id: 1 },
  { id: 5, name: "Hargeisa West", region_id: 1 },
  { id: 6, name: "Berbera", region_id: 6 },
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

const regions = [
  { id: 1, name: "Maroodi Jeex" },
  { id: 2, name: "Sanaag" },
  { id: 3, name: "Sool" },
  { id: 4, name: "Togdheer" },
  { id: 5, name: "Awdal" },
  { id: 6, name: "Sahil" },
];

const timezones = [
  "Africa/Mogadishu",
  "UTC",
  "Africa/Nairobi",
  "Europe/London",
  "America/New_York",
];

const eventTypes = [
  { value: "rally", label: "Rally" },
  { value: "fundraiser", label: "Fundraiser" },
  { value: "training", label: "Training" },
  { value: "meeting", label: "Meeting" },
  { value: "other", label: "Other" },
];

const priorities = [
  { value: "low", label: "Low", color: "bg-gray-100 text-gray-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-red-100 text-red-800" },
];

const statuses = [
  { value: "planned", label: "Planned", color: "bg-blue-100 text-blue-800" },
  {
    value: "scheduled",
    label: "Scheduled",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "in_progress",
    label: "In Progress",
    color: "bg-orange-100 text-orange-800",
  },
  {
    value: "completed",
    label: "Completed",
    color: "bg-gray-100 text-gray-800",
  },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

const recurrenceOptions = [
  { value: "none", label: "No Recurrence" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "custom", label: "Custom" },
];

interface EventManagementFormProps {
  event?: Event;
  onSuccess?: (event: Event) => void;
  onCancel?: () => void;
}

export function EventManagementForm({
  event,
  onSuccess,
  onCancel,
}: EventManagementFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [newTag, setNewTag] = React.useState("");
  const [selectedMediaLinks, setSelectedMediaLinks] = React.useState<string[]>(
    []
  );
  const [newMediaLink, setNewMediaLink] = React.useState("");

  const form = useForm<EventFormInput>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: event?.title || "",
      type: event?.type || "rally",
      category: event?.category || "",
      timezone: event?.timezone || "Africa/Mogadishu",
      description: event?.description || "",
      objective: event?.objective || "",
      tags: event?.tags || [],
      priority: event?.priority || "low",
      start_time: event?.start_time || "",
      end_time: event?.end_time || "",
      recurrence: event?.recurrence || "none",
      setup_time: event?.setup_time || "",
      teardown_time: event?.teardown_time || "",
      venue: event?.venue || "",
      city: event?.city || "",
      district_id: event?.district_id || 0,
      region_id: event?.region_id || 0,
      address: event?.address || "",
      lat: event?.lat,
      lng: event?.lng,
      max_capacity: event?.max_capacity || 100,
      expected_attendance: event?.expected_attendance,
      actual_attendance: event?.actual_attendance,
      budget_amount: event?.budget_amount || 0,
      estimated_cost: event?.estimated_cost,
      funding_source_id: event?.funding_source_id,
      status: event?.status || "planned",
      organizer_name: event?.organizer_name || "",
      organizer_contact: event?.organizer_contact || "",
      backup_contact: event?.backup_contact,
      assigned_operator_id: event?.assigned_operator_id,
      media_links: event?.media_links || [],
      feedback_link: event?.feedback_link,
      risk_assessment: event?.risk_assessment,
      contingency_plan: event?.contingency_plan,
    },
  });

  const onSubmit = async (data: EventFormInput) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Event form data:", data);
      setIsSuccess(true);

      // Create event object for callback
      const eventData: Event = {
        id: event?.id || 0,
        title: data.title,
        type: data.type,
        category: data.category,
        timezone: data.timezone,
        description: data.description,
        objective: data.objective,
        tags: data.tags,
        priority: data.priority,
        start_time: data.start_time,
        end_time: data.end_time,
        recurrence: data.recurrence,
        recurrence_rule: data.recurrence_rule,
        setup_time: data.setup_time,
        teardown_time: data.teardown_time,
        venue: data.venue,
        city: data.city,
        district_id: data.district_id,
        region_id: data.region_id,
        address: data.address,
        lat: data.lat,
        lng: data.lng,
        max_capacity: data.max_capacity,
        expected_attendance: data.expected_attendance,
        actual_attendance: data.actual_attendance,
        budget_amount: data.budget_amount,
        estimated_cost: data.estimated_cost,
        funding_source_id: data.funding_source_id,
        status: data.status,
        media_links: data.media_links,
        organizer_name: data.organizer_name,
        organizer_contact: data.organizer_contact,
        backup_contact: data.backup_contact,
        assigned_operator_id: data.assigned_operator_id,
        risk_assessment: data.risk_assessment,
        contingency_plan: data.contingency_plan,
        feedback_link: data.feedback_link,
        created_by: 1, // This would come from auth context
        updated_by: 1, // This would come from auth context
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      onSuccess?.(eventData);
    } catch (error) {
      console.error("Event creation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagAdd = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      const updatedTags = [...selectedTags, newTag.trim()];
      setSelectedTags(updatedTags);
      form.setValue("tags", updatedTags);
      setNewTag("");
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    const updatedTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(updatedTags);
    form.setValue("tags", updatedTags);
  };

  const handleMediaLinkAdd = () => {
    if (
      newMediaLink.trim() &&
      !selectedMediaLinks.includes(newMediaLink.trim())
    ) {
      const updatedLinks = [...selectedMediaLinks, newMediaLink.trim()];
      setSelectedMediaLinks(updatedLinks);
      form.setValue("media_links", updatedLinks);
      setNewMediaLink("");
    }
  };

  const handleMediaLinkRemove = (linkToRemove: string) => {
    const updatedLinks = selectedMediaLinks.filter(
      (link) => link !== linkToRemove
    );
    setSelectedMediaLinks(updatedLinks);
    form.setValue("media_links", updatedLinks);
  };

  const handleCoordinatesChange = (value: string) => {
    const [lat, lng] = value
      .split(",")
      .map((coord) => parseFloat(coord.trim()));
    if (!isNaN(lat) && !isNaN(lng)) {
      form.setValue("lat", lat);
      form.setValue("lng", lng);
    }
  };

  const getCoordinatesDisplay = () => {
    const lat = form.watch("lat");
    const lng = form.watch("lng");
    return lat && lng ? `${lat}, ${lng}` : "";
  };

  // Initialize tags and media links from form data
  React.useEffect(() => {
    if (event?.tags) {
      setSelectedTags(event.tags);
    }
    if (event?.media_links) {
      setSelectedMediaLinks(event.media_links);
    }
  }, [event]);

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
                {event
                  ? "Event Updated Successfully!"
                  : "Event Created Successfully!"}
              </h3>
              <p className="text-muted-foreground mt-2">
                {event
                  ? "The event has been updated and changes are now visible."
                  : "The event has been created and is now visible in the events calendar."}
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => {
                  setIsSuccess(false);
                  form.reset();
                }}
                variant="outline"
              >
                {event ? "Edit Another Event" : "Create Another Event"}
              </Button>
              {onCancel && <Button onClick={onCancel}>Back to Events</Button>}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          {event ? "Edit Event" : "Create Event"}
        </CardTitle>
        <p className="text-muted-foreground">
          {event
            ? "Update event details and manage all aspects of the event"
            : "Create and manage campaign events with comprehensive details"}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Event Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Basic Information</h3>
            </div>
            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  placeholder="Enter event title"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Event Type *</Label>
                <Select
                  value={form.watch("type")}
                  onValueChange={(value) => form.setValue("type", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.type && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.type.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  {...form.register("category")}
                  placeholder="Enter event category"
                />
                {form.formState.errors.category && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone *</Label>
                <Select
                  value={form.watch("timezone")}
                  onValueChange={(value) => form.setValue("timezone", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.timezone && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.timezone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  value={form.watch("priority")}
                  onValueChange={(value) =>
                    form.setValue("priority", value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className="flex items-center gap-2">
                          <Badge className={priority.color}>
                            {priority.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.priority && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.priority.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={form.watch("status")}
                  onValueChange={(value) =>
                    form.setValue("status", value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                          <Badge className={status.color}>{status.label}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.status && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.status.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Enter detailed event description"
                  rows={4}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="objective">Objective</Label>
                <Textarea
                  id="objective"
                  {...form.register("objective")}
                  placeholder="Enter event objective (optional)"
                  rows={3}
                />
                {form.formState.errors.objective && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.objective.message}
                  </p>
                )}
              </div>

              {/* Tags Section */}
              <div className="space-y-2 md:col-span-2">
                <Label>Tags</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleTagAdd())
                      }
                    />
                    <Button type="button" onClick={handleTagAdd} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleTagRemove(tag)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                {form.formState.errors.tags && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.tags.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Date & Time</h3>
            </div>
            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start_time">Start Date & Time *</Label>
                <Input
                  id="start_time"
                  type="datetime-local"
                  {...form.register("start_time")}
                />
                {form.formState.errors.start_time && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.start_time.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_time">End Date & Time *</Label>
                <Input
                  id="end_time"
                  type="datetime-local"
                  {...form.register("end_time")}
                />
                {form.formState.errors.end_time && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.end_time.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="recurrence">Recurrence</Label>
                <Select
                  value={form.watch("recurrence")}
                  onValueChange={(value) =>
                    form.setValue("recurrence", value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recurrence" />
                  </SelectTrigger>
                  <SelectContent>
                    {recurrenceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.recurrence && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.recurrence.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="setup_time">Setup Time (Optional)</Label>
                <Input
                  id="setup_time"
                  type="datetime-local"
                  {...form.register("setup_time")}
                />
                {form.formState.errors.setup_time && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.setup_time.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="teardown_time">Teardown Time (Optional)</Label>
                <Input
                  id="teardown_time"
                  type="datetime-local"
                  {...form.register("teardown_time")}
                />
                {form.formState.errors.teardown_time && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.teardown_time.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Location Information</h3>
            </div>
            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="venue">Venue Name *</Label>
                <Input
                  id="venue"
                  {...form.register("venue")}
                  placeholder="Enter venue name"
                />
                {form.formState.errors.venue && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.venue.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  {...form.register("city")}
                  placeholder="Enter city"
                />
                {form.formState.errors.city && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.city.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="region_id">Region *</Label>
                <Select
                  value={form.watch("region_id")?.toString()}
                  onValueChange={(value) =>
                    form.setValue("region_id", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.id} value={region.id.toString()}>
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
                <Label htmlFor="district_id">District *</Label>
                <Select
                  value={form.watch("district_id")?.toString()}
                  onValueChange={(value) =>
                    form.setValue("district_id", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts
                      .filter(
                        (d) =>
                          !form.watch("region_id") ||
                          d.region_id === form.watch("region_id")
                      )
                      .map((district) => (
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
                <Label htmlFor="address">Full Address *</Label>
                <Textarea
                  id="address"
                  {...form.register("address")}
                  placeholder="Enter complete address"
                  rows={2}
                />
                {form.formState.errors.address && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.address.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="coordinates">Coordinates (Optional)</Label>
                <Input
                  id="coordinates"
                  value={getCoordinatesDisplay()}
                  onChange={(e) => handleCoordinatesChange(e.target.value)}
                  placeholder="Latitude, Longitude"
                />
                <p className="text-xs text-muted-foreground">
                  Format: 9.5616, 44.0650
                </p>
              </div>
            </div>
          </div>

          {/* Capacity and Attendance */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Capacity & Attendance</h3>
            </div>
            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="max_capacity">Maximum Capacity *</Label>
                <Input
                  id="max_capacity"
                  type="number"
                  {...form.register("max_capacity", { valueAsNumber: true })}
                  placeholder="Enter maximum capacity"
                />
                {form.formState.errors.max_capacity && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.max_capacity.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected_attendance">Expected Attendance</Label>
                <Input
                  id="expected_attendance"
                  type="number"
                  {...form.register("expected_attendance", {
                    valueAsNumber: true,
                  })}
                  placeholder="Enter expected attendance"
                />
                {form.formState.errors.expected_attendance && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.expected_attendance.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="actual_attendance">Actual Attendance</Label>
                <Input
                  id="actual_attendance"
                  type="number"
                  {...form.register("actual_attendance", {
                    valueAsNumber: true,
                  })}
                  placeholder="Enter actual attendance"
                />
                {form.formState.errors.actual_attendance && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.actual_attendance.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Budget and Funding */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Budget & Funding</h3>
            </div>
            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="budget_amount">Budget Amount (USD) *</Label>
                <Input
                  id="budget_amount"
                  type="number"
                  step="0.01"
                  {...form.register("budget_amount", { valueAsNumber: true })}
                  placeholder="Enter budget amount"
                />
                {form.formState.errors.budget_amount && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.budget_amount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimated_cost">Estimated Cost (USD)</Label>
                <Input
                  id="estimated_cost"
                  type="number"
                  step="0.01"
                  {...form.register("estimated_cost", { valueAsNumber: true })}
                  placeholder="Enter estimated cost"
                />
                {form.formState.errors.estimated_cost && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.estimated_cost.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="funding_source_id">Funding Source ID</Label>
                <Input
                  id="funding_source_id"
                  type="number"
                  {...form.register("funding_source_id", {
                    valueAsNumber: true,
                  })}
                  placeholder="Enter funding source ID"
                />
                {form.formState.errors.funding_source_id && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.funding_source_id.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Media and Links */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Media & Links</h3>
            </div>
            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="feedback_link">Feedback Link</Label>
                <Input
                  id="feedback_link"
                  {...form.register("feedback_link")}
                  placeholder="https://example.com/feedback"
                />
                {form.formState.errors.feedback_link && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.feedback_link.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Media Links</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newMediaLink}
                      onChange={(e) => setNewMediaLink(e.target.value)}
                      placeholder="Add a media link (URL)"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleMediaLinkAdd())
                      }
                    />
                    <Button
                      type="button"
                      onClick={handleMediaLinkAdd}
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {selectedMediaLinks.length > 0 && (
                    <div className="space-y-1">
                      {selectedMediaLinks.map((link) => (
                        <div
                          key={link}
                          className="flex items-center gap-2 p-2 bg-muted rounded-md"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span className="text-sm flex-1 truncate">
                            {link}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleMediaLinkRemove(link)}
                            className="text-destructive hover:bg-destructive/10 p-1 rounded"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {form.formState.errors.media_links && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.media_links.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Contact Information</h3>
            </div>
            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="organizer_name">Organizer Name *</Label>
                <Input
                  id="organizer_name"
                  {...form.register("organizer_name")}
                  placeholder="Enter organizer name"
                />
                {form.formState.errors.organizer_name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.organizer_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizer_contact">Organizer Contact *</Label>
                <Input
                  id="organizer_contact"
                  {...form.register("organizer_contact")}
                  placeholder="+252 61 234 5678"
                />
                {form.formState.errors.organizer_contact && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.organizer_contact.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup_contact">Backup Contact</Label>
                <Input
                  id="backup_contact"
                  {...form.register("backup_contact")}
                  placeholder="+252 61 234 5678"
                />
                {form.formState.errors.backup_contact && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.backup_contact.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="assigned_operator_id">
                  Assigned Operator ID
                </Label>
                <Input
                  id="assigned_operator_id"
                  type="number"
                  {...form.register("assigned_operator_id", {
                    valueAsNumber: true,
                  })}
                  placeholder="Enter operator ID"
                />
                {form.formState.errors.assigned_operator_id && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.assigned_operator_id.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Risk Management */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Risk Management</h3>
            </div>
            <Separator />

            <div className="grid gap-4 md:grid-cols-1">
              <div className="space-y-2">
                <Label htmlFor="risk_assessment">Risk Assessment</Label>
                <Textarea
                  id="risk_assessment"
                  {...form.register("risk_assessment")}
                  placeholder="Describe potential risks and mitigation strategies"
                  rows={4}
                />
                {form.formState.errors.risk_assessment && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.risk_assessment.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contingency_plan">Contingency Plan</Label>
                <Textarea
                  id="contingency_plan"
                  {...form.register("contingency_plan")}
                  placeholder="Describe backup plans and emergency procedures"
                  rows={4}
                />
                {form.formState.errors.contingency_plan && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.contingency_plan.message}
                  </p>
                )}
              </div>
            </div>
          </div>

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
                  Cancel
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
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
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  {event ? "Updating..." : "Creating..."}
                </>
              ) : event ? (
                "Update Event"
              ) : (
                "Create Event"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
