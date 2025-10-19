"use client";

import * as React from "react";
// --- IMPORTS (no changes here) ---
import {
  useForm,
  Controller,
  SubmitHandler,
  Control,
  Path,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Phone,
  MapPin,
  IdCard,
  ChevronsUpDown,
  Edit,
  X,
  Save,
} from "lucide-react";
import { useSupporter, useUpdateSupporter } from "@/hooks/api/useSupporters";
import {
  useDistricts,
  usePollingStations,
  useRegions,
} from "@/hooks/api/useGeography";
import {
  EditSupporterInput,
  editSupporterSchema,
} from "@/lib/validations/supporter";
import { Supporter } from "@/types/supporter";
import { Gender, SupporterStatus } from "@/types/enums";
import { Card } from "../ui/card";
// --- Assume other imports and mocked components are the same ---

// --- MOCKED UI COMPONENTS & UTILS (no changes here) ---

export function SupporterProfilePage({ supporterId }: { supporterId: string }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const numericSupporterId = React.useMemo(
    () => parseFloat(supporterId),
    [supporterId]
  );

  const { data, isLoading: isLoadingSupporter } =
    useSupporter(numericSupporterId);
  const { mutate: updateSupporter, isPending: isUpdating } =
    useUpdateSupporter(numericSupporterId);
  const supporter: Supporter | null = data?.supporter || null;

  const form = useForm<EditSupporterInput>({
    resolver: zodResolver(editSupporterSchema),
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    reset,
    watch, // <-- 1. IMPORT `watch` FROM THE useForm HOOK
    setValue, // <-- 1. IMPORT `setValue` TO RESET FIELDS
    formState: { errors },
  } = form;

  // --- WATCH RELEVANT FORM FIELDS FOR CHANGES ---
  const watchedRegionId = watch("regionId");
  const watchedDistrictId = watch("districtId");

  // --- DATA FETCHING HOOKS ---
  const { data: regions } = useRegions();
  // <-- 2. UPDATE HOOKS to use watched values instead of static supporter data
  const { data: districts } = useDistricts(watchedRegionId);
  const { data: pollingStations } = usePollingStations(watchedDistrictId);

  // <-- 3. ADD useEffect TO RESET DEPENDENT FIELDS ---
  React.useEffect(() => {
    // When the watched region changes, reset the district and polling station fields
    if (isEditing) {
      setValue("districtId", undefined, { shouldValidate: true });
      setValue("pollingStationId", undefined, { shouldValidate: true });
    }
  }, [watchedRegionId, setValue, isEditing]);

  React.useEffect(() => {
    // When the watched district changes, reset the polling station field
    if (isEditing) {
      setValue("pollingStationId", undefined, { shouldValidate: true });
    }
  }, [watchedDistrictId, setValue, isEditing]);

  // Helper to format API data (no changes needed here)
  const formatSupporterForForm = React.useCallback(
    (s: Supporter): EditSupporterInput => ({
      firstname: s.firstname ?? "",
      middlename: s.middlename ?? "",
      lastname: s.lastname ?? "",
      fourthname: s.fourthname ?? "",
      birthdate: s.birthdate
        ? new Date(s.birthdate).toISOString().split("T")[0]
        : "",
      gender: (s.gender as Gender) || Gender.M,
      email: s.email ?? "",
      language: (s.language as "somali" | "english" | "arabic") ?? "somali",
      address: s.address ?? "",
      voterId: s.voterId ?? "",
      favParty: s.favParty ?? "",
      phones: s.phones ?? [],
      emergencyContacts: s.emergencyContacts.map(m => {return {...m, email:m.email?m.email:undefined}}) ?? [],
      specialNeeds: s.specialNeeds ?? "",
      status: (s.status as SupporterStatus) || SupporterStatus.PENDING,
      regionId: s.regionId ?? undefined,
      districtId: s.districtId ?? undefined,
      pollingStationId: s.pollingStationId ?? undefined,
    }),
    []
  );

  React.useEffect(() => {
    if (supporter) {
      reset(formatSupporterForForm(supporter));
    }
  }, [supporter, reset, formatSupporterForForm]);

  const onSubmit: SubmitHandler<EditSupporterInput> = (data) => {
    updateSupporter({...data});
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (supporter) {
      reset(formatSupporterForForm(supporter));
    }
    setIsEditing(false);
  };

  if (isLoadingSupporter) return <p>Loading supporter details...</p>;
  if (!supporter) return <p>Supporter not found.</p>;
  
  // NOTE: Your getGeoName function will now work correctly for display mode because the
  // data from the hooks will be correct based on the initial supporter data.
  // In edit mode, the dropdowns will have the correct, updated options.
  const getGeoName = (
    type: "region" | "district" | "pollingStation",
    id: number | null | undefined
  ): string => {
    if (id === null || id === undefined) return "Not Provided";
    if (type === "region") return regions?.find((r) => r.id === id)?.name ?? "Unknown";
    if (type === "district") return districts?.find((d) => d.id === id)?.name ?? "Unknown";
    if (type === "pollingStation") return pollingStations?.find((p) => p.id === id)?.name ?? "Unknown";
    return "N/A";
  };


  // --- JSX REMAINS THE SAME ---
  // The rest of your component's return statement (JSX) does not need to change at all.
  // The SearchableSelectField components will automatically receive the updated `districts`
  // and `pollingStations` props when they are re-fetched.

  return (
    <Card className="w-full max-w-4xl mx-auto">
        {/* ... your entire JSX structure ... */}
    </Card>
  );
}

// --- ALL SUB-COMPONENTS REMAIN THE SAME ---