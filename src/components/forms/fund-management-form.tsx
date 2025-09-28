"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  DollarSign,
  CreditCard,
  Banknote,
  TrendingUp,
  TrendingDown,
  Receipt,
  FileText,
  Calendar,
  User,
  Building,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Upload,
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
import { formUtils, useFormSubmission } from "@/lib/form-submission";

const fundManagementSchema = z.object({
  // Transaction Information
  transactionType: z.enum(["income", "expense", "transfer", "adjustment"], {
    message: "Please select a transaction type",
  }),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  currency: z.enum(["USD", "SOS", "EUR", "GBP"], {
    message: "Please select a currency",
  }),

  // Payment Information
  paymentMethod: z.enum(
    [
      "cash",
      "bank_transfer",
      "mobile_money",
      "check",
      "card",
      "cryptocurrency",
    ],
    {
      message: "Please select a payment method",
    }
  ),
  paymentReference: z.string().optional(),
  bankAccount: z.string().optional(),
  transactionId: z.string().optional(),

  // Source/Destination
  source: z.string().min(1, "Source is required"),
  destination: z.string().optional(),
  donorName: z.string().optional(),
  donorContact: z.string().optional(),
  donorEmail: z.string().email().optional().or(z.literal("")),

  // Purpose and Description
  purpose: z.string().min(5, "Purpose must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  project: z.string().optional(),
  campaign: z.string().optional(),

  // Date and Time
  transactionDate: z.string().min(1, "Transaction date is required"),
  dueDate: z.string().optional(),
  recurring: z.boolean().optional(),
  recurringFrequency: z
    .enum(["daily", "weekly", "monthly", "quarterly", "yearly"])
    .optional(),

  // Approval and Authorization
  requiresApproval: z.boolean().optional(),
  approvedBy: z.string().optional(),
  approvalDate: z.string().optional(),
  authorizationLevel: z.enum(["low", "medium", "high", "critical"]).optional(),

  // Documentation
  receiptNumber: z.string().optional(),
  invoiceNumber: z.string().optional(),
  documentPath: z.string().optional(),
  attachments: z.array(z.string()).optional(),

  // Budget and Allocation
  budgetCategory: z.string().optional(),
  allocatedAmount: z.number().min(0).optional(),
  remainingBudget: z.number().min(0).optional(),
  isBudgeted: z.boolean().optional(),

  // Compliance and Reporting
  isTaxDeductible: z.boolean().optional(),
  reportingCategory: z.string().optional(),
  complianceNotes: z.string().optional(),
  auditTrail: z.string().optional(),

  // Additional Information
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  status: z
    .enum(["pending", "approved", "rejected", "completed", "cancelled"])
    .optional(),
});

type FundManagementFormData = z.infer<typeof fundManagementSchema>;

const incomeCategories = [
  "Donations",
  "Fundraising Events",
  "Government Grants",
  "Corporate Sponsorships",
  "Individual Contributions",
  "Membership Fees",
  "Merchandise Sales",
  "Investment Returns",
  "Other Income",
];

const expenseCategories = [
  "Campaign Materials",
  "Advertising & Marketing",
  "Transportation",
  "Venue Rental",
  "Staff Salaries",
  "Volunteer Expenses",
  "Technology & Software",
  "Office Supplies",
  "Legal & Compliance",
  "Banking Fees",
  "Other Expenses",
];

const projects = [
  "Voter Registration Drive",
  "Rally Organization",
  "Media Campaign",
  "Community Outreach",
  "Youth Engagement",
  "Women's Program",
  "Rural Development",
  "Digital Campaign",
  "Other",
];

const campaigns = [
  "2024 Presidential Campaign",
  "2024 Parliamentary Campaign",
  "2024 Local Elections",
  "General Awareness",
  "Special Events",
  "Other",
];

interface FundManagementFormProps {
  onSuccess?: () => void;
}

export function FundManagementForm({
  onSuccess,
}: FundManagementFormProps = {}) {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  const { isSubmitting, error, errors, submitForm, clearErrors } =
    useFormSubmission();

  const form = useForm<FundManagementFormData>({
    resolver: zodResolver(fundManagementSchema),
    defaultValues: {
      currency: "USD",
      recurring: false,
      requiresApproval: false,
      isTaxDeductible: false,
      isBudgeted: false,
      priority: "medium",
      status: "pending",
      tags: [],
    },
  });

  const transactionType = form.watch("transactionType");

  const onSubmit = async (data: FundManagementFormData) => {
    const result = await submitForm(async () => {
      return formUtils.submitFundManagement(data, false);
    });

    if (result.success) {
      setIsSuccess(true);
      onSuccess?.();
    }
  };

  const handleTagToggle = (tag: string) => {
    const current = form.getValues("tags") || [];
    if (current.includes(tag)) {
      form.setValue(
        "tags",
        current.filter((t) => t !== tag)
      );
    } else {
      form.setValue("tags", [...current, tag]);
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
                Transaction Recorded Successfully!
              </h3>
              <p className="text-muted-foreground mt-2">
                The financial transaction has been recorded and is now visible
                in the fund management dashboard.
              </p>
            </div>
            <Button
              onClick={() => {
                setIsSuccess(false);
                form.reset();
              }}
              className="mt-4"
            >
              Record Another Transaction
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-primary" />
          Fund Management
        </CardTitle>
        <p className="text-muted-foreground">
          Record and manage campaign financial transactions with comprehensive
          tracking
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Transaction Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Transaction Information</h3>
            </div>
            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="transactionType">Transaction Type *</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("transactionType", value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        Income
                      </div>
                    </SelectItem>
                    <SelectItem value="expense">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        Expense
                      </div>
                    </SelectItem>
                    <SelectItem value="transfer">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                        Transfer
                      </div>
                    </SelectItem>
                    <SelectItem value="adjustment">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-orange-600" />
                        Adjustment
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.transactionType && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.transactionType.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  onValueChange={(value) => form.setValue("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionType === "income"
                      ? incomeCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))
                      : expenseCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory (Optional)</Label>
                <Input
                  id="subcategory"
                  {...form.register("subcategory")}
                  placeholder="Enter subcategory"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    {...form.register("amount", { valueAsNumber: true })}
                    placeholder="0.00"
                    className="pl-10"
                  />
                </div>
                {form.formState.errors.amount && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.amount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency *</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("currency", value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="SOS">SOS - Somali Shilling</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.currency && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.currency.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Payment Information</h3>
            </div>
            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("paymentMethod", value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="mobile_money">Mobile Money</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="cryptocurrency">
                      Cryptocurrency
                    </SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.paymentMethod && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.paymentMethod.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentReference">Payment Reference</Label>
                <Input
                  id="paymentReference"
                  {...form.register("paymentReference")}
                  placeholder="Enter payment reference"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankAccount">Bank Account (Optional)</Label>
                <Input
                  id="bankAccount"
                  {...form.register("bankAccount")}
                  placeholder="Enter bank account details"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID</Label>
                <Input
                  id="transactionId"
                  {...form.register("transactionId")}
                  placeholder="Enter transaction ID"
                />
              </div>
            </div>
          </div>

          {/* Source/Destination Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Source/Destination</h3>
            </div>
            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="source">Source *</Label>
                <Input
                  id="source"
                  {...form.register("source")}
                  placeholder="Enter source of funds"
                />
                {form.formState.errors.source && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.source.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Destination (Optional)</Label>
                <Input
                  id="destination"
                  {...form.register("destination")}
                  placeholder="Enter destination"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="donorName">Donor/Contributor Name</Label>
                <Input
                  id="donorName"
                  {...form.register("donorName")}
                  placeholder="Enter donor name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="donorContact">Donor Contact</Label>
                <Input
                  id="donorContact"
                  {...form.register("donorContact")}
                  placeholder="Enter donor contact"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="donorEmail">Donor Email</Label>
                <Input
                  id="donorEmail"
                  type="email"
                  {...form.register("donorEmail")}
                  placeholder="donor@example.com"
                />
                {form.formState.errors.donorEmail && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.donorEmail.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Purpose and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Purpose & Description</h3>
            </div>
            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose *</Label>
                <Input
                  id="purpose"
                  {...form.register("purpose")}
                  placeholder="Brief purpose of transaction"
                />
                {form.formState.errors.purpose && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.purpose.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="project">Project (Optional)</Label>
                <Select
                  onValueChange={(value) => form.setValue("project", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project} value={project}>
                        {project}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign">Campaign (Optional)</Label>
                <Select
                  onValueChange={(value) => form.setValue("campaign", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign} value={campaign}>
                        {campaign}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Detailed description of the transaction"
                  rows={3}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Date & Time</h3>
            </div>
            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="transactionDate">Transaction Date *</Label>
                <Input
                  id="transactionDate"
                  type="date"
                  {...form.register("transactionDate")}
                />
                {form.formState.errors.transactionDate && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.transactionDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date (Optional)</Label>
                <Input id="dueDate" type="date" {...form.register("dueDate")} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="recurring"
                    checked={form.watch("recurring")}
                    onCheckedChange={(checked) =>
                      form.setValue("recurring", checked)
                    }
                  />
                  <Label htmlFor="recurring">Recurring Transaction</Label>
                </div>
              </div>

              {form.watch("recurring") && (
                <div className="space-y-2">
                  <Label htmlFor="recurringFrequency">
                    Recurring Frequency
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      form.setValue("recurringFrequency", value as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Budget and Allocation */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Budget & Allocation</h3>
            </div>
            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="budgetCategory">Budget Category</Label>
                <Input
                  id="budgetCategory"
                  {...form.register("budgetCategory")}
                  placeholder="Enter budget category"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allocatedAmount">Allocated Amount</Label>
                <Input
                  id="allocatedAmount"
                  type="number"
                  step="0.01"
                  {...form.register("allocatedAmount", { valueAsNumber: true })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="remainingBudget">Remaining Budget</Label>
                <Input
                  id="remainingBudget"
                  type="number"
                  step="0.01"
                  {...form.register("remainingBudget", { valueAsNumber: true })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isBudgeted"
                    checked={form.watch("isBudgeted")}
                    onCheckedChange={(checked) =>
                      form.setValue("isBudgeted", checked)
                    }
                  />
                  <Label htmlFor="isBudgeted">Is Budgeted</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="receiptNumber">Receipt Number</Label>
                <Input
                  id="receiptNumber"
                  {...form.register("receiptNumber")}
                  placeholder="Enter receipt number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  {...form.register("invoiceNumber")}
                  placeholder="Enter invoice number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("priority", value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
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
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
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
                  Recording...
                </>
              ) : (
                "Record Transaction"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
