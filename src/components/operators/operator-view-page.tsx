"use client";

import * as React from "react";
import {
  useForm,
  Controller,
  SubmitHandler,
  useFieldArray,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Edit, X, Save, Dot } from "lucide-react";

// --- Hooks & types from your codebase ---
import {
  useOperator,
  useUpdateOperator,
  useApproveOperator,
  useRejectOperator,
} from "@/hooks/api/useOperators";
import {
  EditOperatorInput,
  editOperatorSchema,
} from "@/lib/validations/operator";
import { Operator } from "@/types/operator";
import { Gender, OperatorRole, OperatorStatus } from "@/types/enums";

// --- UI primitives used in your project (replace with your real components) ---
// Card, Input, Select, Textarea, Button, Label, FieldError, SearchableSelectField
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectItem } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { SupporterPhoneType } from "@/types/supporter";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { SelectContent, SelectTrigger, Value } from "@radix-ui/react-select";
import { SelectField } from "../ui/selectField";
import { capitalize, cn } from "@/lib/utils";
import { languageEnum } from "@/lib/validations/supporter";

// NOTE: If some of the UI components above don't exist in your codebase, swap them for your project's equivalents.
export function FieldError({ message }: { message: string }) {
  return (
    <Alert className="transition-all" variant={"destructive"}>
      <AlertTitle>error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
export function OperatorProfilePage({ operatorId }: { operatorId: string }) {
  const numericOperatorId = React.useMemo(
    () => parseFloat(operatorId),
    [operatorId]
  );

  const { data, isLoading: isLoadingOperator } = useOperator(numericOperatorId);
  const { mutateAsync: updateOperator, isPending: isUpdating } =
    useUpdateOperator(numericOperatorId);
  const { mutateAsync: approveOperator, isPending: isApproving } =
    useApproveOperator(numericOperatorId);
  const { mutate: rejectOperator, isPending: isRejecting } =
    useRejectOperator(numericOperatorId);

  const operator: Operator | null = data?.operator ?? null;

  const form = useForm<EditOperatorInput>({
    resolver: zodResolver(editOperatorSchema),
    mode: "onChange",
    defaultValues: {},
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = form;

  // for phones
  const {
    fields: phoneFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "phones" as any, // typed as any because edit schema is partial
  });

  // --- watch cascading selects ---

  const [isEditing, setIsEditing] = React.useState(false);

  const formatOperatorForForm = React.useCallback(
    (o: Operator): EditOperatorInput => ({
      firstname: o.firstname ?? "",
      middlename: o.middlename ?? undefined,
      lastname: o.lastname ?? "",
      fourthname: o.fourthname ?? undefined,
      birthdate: o.birthdate
        ? new Date(o.birthdate).toISOString().split("T")[0]
        : "",
      gender: (o.gender as unknown as any) ?? Gender.M,
      email: o.email ?? undefined,
      language: (o.language as any) ?? undefined,
      address: o.address ?? undefined,
      role: (o.role as unknown as any) ?? OperatorRole.OPERATOR,
      status: (o.status as unknown as any) ?? OperatorStatus.PENDING,
      phones:
        o.phones?.map((p) => ({
          phone: p.phone,
          type: (p.type as SupporterPhoneType) ?? SupporterPhoneType.PRIMARY,
        })) ?? [],
      specialNeeds: o.specialNeeds ?? undefined,
    }),
    []
  );

  React.useEffect(() => {
    if (operator) {
      reset(formatOperatorForForm(operator));
    }
  }, [operator, reset, formatOperatorForForm]);

  // when region/district changes, reset dependent fields while editing

  const onSubmit: SubmitHandler<EditOperatorInput> = async (data) => {
    // Clean up undefined fields if needed
    await updateOperator({ ...data } as any);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (operator) reset(formatOperatorForForm(operator));
    setIsEditing(false);
  };

  if (isLoadingOperator) return <p>Loading operator...</p>;
  if (!operator) return <p>Operator not found.</p>;

  return (
    <Card className="w-full max-w-4xl mx-auto p-6">
      <div
        className={cn(
          "flex items-start justify-between gap-4 bg-gradient-to-br transition-all",
          operator.status == OperatorStatus.APPROVED
            ? "from-green-300 to-50% "
            : "from-red-300 to-50%"
        )}
      >
        <div>
          <h2 className="text-2xl font-semibold">
            {capitalize(operator.firstname) + " "}
            {capitalize(operator.middlename) + " "}
            {capitalize(operator.lastname) + " "}
            {capitalize(operator.fourthname) + " "}
            {}
          </h2>
          <p className="text-sm text-muted-foreground">
            Role: <span className="font-medium">{operator.role}</span> Status:{" "}
            <span className="font-medium">{operator.status}</span>
            <Dot
              size={34}
              className={cn(
                "animate-pulse inline-block",
                operator.status == OperatorStatus.APPROVED
                  ? "text-green-700"
                  : "text-red-700"
              )}
            />
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit size={16} className="mr-2" /> Edit
              </Button>
              {operator.status == OperatorStatus.PENDING && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => approveOperator()}
                    disabled={isApproving}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => rejectOperator()}
                    disabled={isRejecting}
                  >
                    Reject
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => approveOperator()}
                disabled={isApproving}
                className={cn(
                  operator.status == OperatorStatus.APPROVED && "hidden"
                )}
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => rejectOperator()}
                disabled={isRejecting}
                className={cn(
                  operator.status == OperatorStatus.REJECTED && "hidden"
                )}
              >
                Reject
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X size={16} className="mr-2" /> Cancel
              </Button>
              <Button
                variant="link"
                size="sm"
                onClick={handleSubmit(onSubmit)}
                disabled={isUpdating || !isDirty}
              >
                <Save size={16} className="mr-2" /> Save
              </Button>
            </>
          )}
        </div>
      </div>

      <form
        className="mt-6 grid grid-cols-1 gap-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Personal</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* firstname */}
            <div>
              <Label>First name</Label>
              <Controller
                control={control}
                name="firstname"
                render={({ field }) => (
                  <Input {...field} disabled={!isEditing} />
                )}
              />
              {errors.firstname && (
                <FieldError message={errors.firstname.message as string} />
              )}
            </div>

            {/* lastname */}
            <div>
              <Label>Last name</Label>
              <Controller
                control={control}
                name="lastname"
                render={({ field }) => (
                  <Input {...field} disabled={!isEditing} />
                )}
              />
              {errors.lastname && (
                <FieldError message={errors.lastname.message as string} />
              )}
            </div>

            {/* middlename */}
            <div>
              <Label>Middle name</Label>
              <Controller
                control={control}
                name="middlename"
                render={({ field }) => (
                  <Input {...field} disabled={!isEditing} />
                )}
              />
            </div>

            {/* fourthname */}
            <div>
              <Label>Fourth name</Label>
              <Controller
                control={control}
                name="fourthname"
                render={({ field }) => (
                  <Input {...field} disabled={!isEditing} />
                )}
              />
            </div>

            {/* birthdate */}
            <div>
              <Label>Birthdate</Label>
              <Controller
                control={control}
                name="birthdate"
                render={({ field }) => (
                  <Input type="date" {...field} disabled={!isEditing} />
                )}
              />
              {errors.birthdate && (
                <FieldError message={errors.birthdate.message as string} />
              )}
            </div>

            {/* gender */}
            <div>
              <Label>Gender</Label>

              {isEditing ? (
                <SelectField
                  control={control}
                  name="gender"
                  label=""
                  placeholder={operator.gender}
                  options={Object.values(Gender).map((g) => {
                    return { label: g == "m" ? "male" : "female", value: g };
                  })}
                />
              ) : (
                <Label>{operator.gender == "m" ? "male" : "female"}</Label>
              )}
            </div>

            {/* email */}
            <div className="col-span-2">
              <Label>Email</Label>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Input {...field} disabled={!isEditing} />
                )}
              />
              {errors.email && (
                <FieldError message={errors.email.message as string} />
              )}
            </div>

            {/* address */}
            <div className="col-span-2">
              <Label>Address</Label>
              <Controller
                control={control}
                name="address"
                render={({ field }) => (
                  <Textarea {...field} disabled={!isEditing} />
                )}
              />
            </div>

            {/* language */}
            <div>
              <Label>Language</Label>
              {!isEditing && <div>{operator.language} </div>}
              {isEditing && (
                <SelectField
                  options={Object.values(languageEnum.enum).map((l) => {
                    return { label: l.toString(), value: l };
                  })}
                  control={control}
                  label=""
                  name="language"
                  placeholder="somali"
                />
              )}
            </div>

            {/* special needs */}
            <div>
              <Label>Special Needs</Label>
              <Controller
                control={control}
                name="specialNeeds"
                render={({ field }) => (
                  <Input {...field} disabled={!isEditing} />
                )}
              />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Role & Location</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Role</Label>
              {!isEditing && <div>{operator.role}</div>}
              {isEditing && (
                <Controller
                  control={control}
                  name="role"
                  render={({ field }) => (
                    <SelectField
                      {...field}
                      control={control}
                      options={Object.values(OperatorRole).map((o) => {
                        return { label: o.toString(), value: o };
                      })}
                      name="role"
                      label="Role"
                      placeholder={operator.role as OperatorRole}
                    />
                  )}
                />
              )}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Phones</h3>

          <div className="space-y-3">
            {phoneFields.length === 0 && !isEditing && (
              <p className="text-sm text-muted-foreground">
                No phones provided.
              </p>
            )}

            {phoneFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2 mt-2">
                {/* Phone Type */}
                <Controller
                  name={`phones.${index}.type`}
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      disabled={!isEditing}
                      className={cn(
                        "h-9 rounded-md border border-input bg-background px-3 py-1 text-sm w-32",
                        !isEditing && "opacity-70 cursor-not-allowed"
                      )}
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                    </select>
                  )}
                />

                {/* Phone Number */}
                <Controller
                  name={`phones.${index}.phone`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      disabled={!isEditing}
                      placeholder="e.g. 634000000"
                      className="flex-1"
                    />
                  )}
                />

                {/* Primary Setter */}
                {isEditing && (
                  <Button
                    type="button"
                    variant={
                      (phoneFields[index] as any).type === "primary"
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      form.setValue(
                        "phones",
                        phoneFields.map((p, i) => ({
                          phone: (p as any).phone ?? "",
                          type:
                            i === index
                              ? "primary"
                              : (p as any).type || "secondary",
                        }))
                      )
                    }
                  >
                    {(phoneFields[index] as any).type === "primary"
                      ? "Primary"
                      : "Set"}
                  </Button>
                )}

                {/* Remove Button */}
                {isEditing && phoneFields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            ))}

            {/* Validation Error */}
            {errors.phones && (
              <p className="text-sm text-destructive mt-1">
                {errors.phones.message || (errors.phones as any).root?.message}
              </p>
            )}

            {/* Add Phone Button */}
            {isEditing && phoneFields.length < 2 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ type: "secondary", phone: "" })}
              >
                + Add Phone
              </Button>
            )}
          </div>
        </Card>

        <div className="flex justify-end gap-2">
          {!isEditing ? null : (
            <>
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSubmit(onSubmit)}
                disabled={isUpdating}
              >
                Save changes
              </Button>
            </>
          )}
        </div>
      </form>
    </Card>
  );
}
