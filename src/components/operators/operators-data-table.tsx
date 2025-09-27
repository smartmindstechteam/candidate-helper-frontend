"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Download,
  Filter,
  X,
  RotateCcw,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  UserCheck,
  UserX,
  Send,
  Archive,
  RefreshCw,
  User,
  Shield,
  Phone,
  Mail,
  MapPin,
  Building,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Activity,
  DollarSign,
  Users,
  Target,
  Map,
  Globe,
  Languages,
  Heart,
  Star,
  Award,
  TrendingUp,
  BarChart3,
  FileText,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";

export type Operator = {
  id: number;
  firstname: string;
  middlename?: string;
  lastname: string;
  fourthname?: string;
  birthdate?: string;
  gender?: "male" | "female" | "other";
  language?: string;
  special_needs?: string;
  email?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  role: "operator" | "supervisor" | "admin";
  status: "pending" | "approved" | "rejected";
  created_by?: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;

  // Related data
  phones?: {
    id: number;
    operator_id: number;
    phone_number: string;
    phone_type: "primary" | "secondary" | "emergency";
    is_verified: boolean;
  }[];
  emergency_contacts?: {
    id: number;
    operator_id: number;
    name: string;
    relationship: string;
    phone_number: string;
    email?: string;
    address?: string;
  }[];
  assigned_tasks?: {
    id: number;
    title: string;
    description?: string;
    status: "pending" | "in_progress" | "completed" | "cancelled";
    priority: "low" | "medium" | "high";
    due_date?: string;
  }[];
  assigned_supporters?: any[];
  assigned_events?: {
    id: number;
    title: string;
    description?: string;
    event_date: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    status: "planned" | "ongoing" | "completed" | "cancelled";
  }[];
  activity_logs?: {
    id: number;
    operator_id: number;
    action_name: string;
    entity_type: string;
    entity_id?: number;
    description?: string;
    metadata?: Record<string, any>;
    created_at: string;
  }[];
  funds?: {
    id: number;
    operator_id: number;
    amount: number;
    category: string;
    source: string;
    description?: string;
    transaction_date: string;
  }[];
  allowed_actions?: string[];

  // Additional fields for data table display
  full_name?: string;
  age?: number;
  location_name?: string;
  last_activity?: string;
  task_count?: number;
  supporter_count?: number;
  event_count?: number;
  total_funds?: number;
};

const mockOperators: Operator[] = [
  {
    id: 1,
    firstname: "Ahmed",
    middlename: "Hassan",
    lastname: "Mohamed",
    fourthname: "Ali",
    birthdate: "1985-03-15",
    gender: "male",
    language: "Somali",
    special_needs: undefined,
    email: "ahmed.hassan@campaign.com",
    address: "Hargeisa Central, Maroodi Jeex",
    latitude: 9.5616,
    longitude: 44.065,
    role: "admin",
    status: "approved",
    created_by: 1,
    updated_by: 1,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T14:30:00Z",
    phones: [
      {
        id: 1,
        operator_id: 1,
        phone_number: "+252 61 234 5678",
        phone_type: "primary",
        is_verified: true,
      },
      {
        id: 2,
        operator_id: 1,
        phone_number: "+252 61 234 5679",
        phone_type: "secondary",
        is_verified: false,
      },
    ],
    emergency_contacts: [
      {
        id: 1,
        operator_id: 1,
        name: "Fatima Hassan",
        relationship: "Wife",
        phone_number: "+252 61 234 5680",
        email: "fatima.hassan@email.com",
        address: "Hargeisa Central",
      },
    ],
    assigned_tasks: [
      {
        id: 1,
        title: "Campaign Strategy Review",
        description: "Review and update campaign strategy for Q1",
        status: "completed",
        priority: "high",
        due_date: "2024-01-25",
      },
    ],
    assigned_supporters: [],
    assigned_events: [
      {
        id: 1,
        title: "Campaign Launch Event",
        description: "Official campaign launch in Hargeisa",
        event_date: "2024-02-01",
        location: "Hargeisa Convention Center",
        latitude: 9.5616,
        longitude: 44.065,
        status: "planned",
      },
    ],
    activity_logs: [
      {
        id: 1,
        operator_id: 1,
        action_name: "create_supporter",
        entity_type: "supporter",
        entity_id: 101,
        description: "Created new supporter record",
        metadata: { supporter_name: "John Doe" },
        created_at: "2024-01-20T14:30:00Z",
      },
    ],
    funds: [
      {
        id: 1,
        operator_id: 1,
        amount: 5000,
        category: "campaign_funds",
        source: "donation",
        description: "Initial campaign funding",
        transaction_date: "2024-01-15",
      },
    ],
    allowed_actions: [
      "create_supporter",
      "update_supporter",
      "approve_supporter",
      "assign_task",
      "create_event",
      "log_fund",
      "view_map",
      "generate_report",
    ],
    full_name: "Ahmed Hassan Mohamed Ali",
    age: 39,
    location_name: "Hargeisa Central, Maroodi Jeex",
    last_activity: "2024-01-20T14:30:00Z",
    task_count: 1,
    supporter_count: 0,
    event_count: 1,
    total_funds: 5000,
  },
  {
    id: 2,
    firstname: "Fatima",
    middlename: "Ali",
    lastname: "Ahmed",
    birthdate: "1990-07-22",
    gender: "female",
    language: "Somali",
    special_needs: undefined,
    email: "fatima.ali@campaign.com",
    address: "Berbera, Sahil",
    latitude: 10.4342,
    longitude: 45.0143,
    role: "supervisor",
    status: "approved",
    created_by: 1,
    updated_by: 1,
    created_at: "2024-01-10T09:00:00Z",
    updated_at: "2024-01-19T16:45:00Z",
    phones: [
      {
        id: 3,
        operator_id: 2,
        phone_number: "+252 61 234 5681",
        phone_type: "primary",
        is_verified: true,
      },
    ],
    emergency_contacts: [
      {
        id: 2,
        operator_id: 2,
        name: "Omar Ahmed",
        relationship: "Brother",
        phone_number: "+252 61 234 5682",
        address: "Berbera, Sahil",
      },
    ],
    assigned_tasks: [
      {
        id: 2,
        title: "Supporter Outreach",
        description: "Contact and register new supporters",
        status: "in_progress",
        priority: "medium",
        due_date: "2024-01-30",
      },
    ],
    assigned_supporters: [],
    assigned_events: [],
    activity_logs: [
      {
        id: 2,
        operator_id: 2,
        action_name: "update_supporter",
        entity_type: "supporter",
        entity_id: 102,
        description: "Updated supporter contact information",
        created_at: "2024-01-19T16:45:00Z",
      },
    ],
    funds: [],
    allowed_actions: [
      "create_supporter",
      "update_supporter",
      "assign_task",
      "view_map",
      "generate_report",
    ],
    full_name: "Fatima Ali Ahmed",
    age: 34,
    location_name: "Berbera, Sahil",
    last_activity: "2024-01-19T16:45:00Z",
    task_count: 1,
    supporter_count: 0,
    event_count: 0,
    total_funds: 0,
  },
  {
    id: 3,
    firstname: "Omar",
    middlename: "Mohamed",
    lastname: "Hassan",
    birthdate: "1995-11-08",
    gender: "male",
    language: "Somali",
    special_needs: undefined,
    email: "omar.mohamed@campaign.com",
    address: "Burao, Togdheer",
    latitude: 9.5221,
    longitude: 45.5336,
    role: "operator",
    status: "pending",
    created_by: 1,
    updated_by: 1,
    created_at: "2024-01-18T11:30:00Z",
    updated_at: "2024-01-18T11:30:00Z",
    phones: [
      {
        id: 4,
        operator_id: 3,
        phone_number: "+252 61 234 5683",
        phone_type: "primary",
        is_verified: false,
      },
    ],
    emergency_contacts: [],
    assigned_tasks: [],
    assigned_supporters: [],
    assigned_events: [],
    activity_logs: [],
    funds: [],
    allowed_actions: [],
    full_name: "Omar Mohamed Hassan",
    age: 29,
    location_name: "Burao, Togdheer",
    last_activity: "2024-01-18T11:30:00Z",
    task_count: 0,
    supporter_count: 0,
    event_count: 0,
    total_funds: 0,
  },
];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getStatusColor = (status: Operator["status"]) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getRoleColor = (role: Operator["role"]) => {
  switch (role) {
    case "admin":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
    case "supervisor":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "operator":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getGenderIcon = (gender: Operator["gender"]) => {
  switch (gender) {
    case "male":
      return <User className="h-4 w-4 text-blue-600" />;
    case "female":
      return <User className="h-4 w-4 text-pink-600" />;
    case "other":
      return <User className="h-4 w-4 text-purple-600" />;
    default:
      return <User className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusIcon = (status: Operator["status"]) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "rejected":
      return <UserX className="h-4 w-4 text-red-600" />;
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-600" />;
  }
};

const calculateAge = (birthdate: string) => {
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const formatPhoneNumber = (phone: string) => {
  // Format phone number for display
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 12 && cleaned.startsWith("252")) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(
      5,
      8
    )} ${cleaned.slice(8)}`;
  }
  return phone;
};

export const columns: ColumnDef<Operator>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(!!e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Operator
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const operator = row.original;
      const fullName = `${operator.firstname} ${operator.middlename || ""} ${
        operator.lastname
      } ${operator.fourthname || ""}`.trim();
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`/avatars/${operator.id}.jpg`} />
            <AvatarFallback className="text-xs">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="font-medium">{fullName}</div>
            <div className="text-sm text-muted-foreground">
              ID: {operator.id}
            </div>
            {operator.birthdate && (
              <div className="text-xs text-muted-foreground">
                Age: {calculateAge(operator.birthdate)}
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as Operator["role"];
      return (
        <div className="flex items-center space-x-2">
          <Badge className={getRoleColor(role)}>{role.toUpperCase()}</Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.getValue("gender") as Operator["gender"];
      return (
        <div className="flex items-center space-x-2">
          {getGenderIcon(gender)}
          <span className="capitalize">{gender || "Not specified"}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => {
      const operator = row.original;
      const primaryPhone = operator.phones?.find(
        (p) => p.phone_type === "primary"
      );
      return (
        <div className="space-y-1">
          {operator.email && (
            <div className="flex items-center space-x-1 text-sm">
              <Mail className="h-3 w-3 text-muted-foreground" />
              <span className="truncate max-w-[120px]">{operator.email}</span>
            </div>
          )}
          {primaryPhone && (
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{formatPhoneNumber(primaryPhone.phone_number)}</span>
              {primaryPhone.is_verified && (
                <CheckCircle className="h-3 w-3 text-green-500" />
              )}
            </div>
          )}
          {operator.language && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Languages className="h-3 w-3" />
              <span>{operator.language}</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const operator = row.original;
      return (
        <div className="space-y-1">
          <div className="flex items-center space-x-1 text-sm">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span>
              {operator.location_name || operator.address || "Not specified"}
            </span>
          </div>
          {operator.latitude && operator.longitude && (
            <div className="text-xs text-muted-foreground">
              {operator.latitude.toFixed(4)}, {operator.longitude.toFixed(4)}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as Operator["status"];
      return (
        <div className="flex items-center space-x-2">
          {getStatusIcon(status)}
          <Badge className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "activity",
    header: "Activity",
    cell: ({ row }) => {
      const operator = row.original;
      return (
        <div className="space-y-1">
          <div className="flex items-center space-x-1 text-sm">
            <Activity className="h-3 w-3 text-muted-foreground" />
            <span>{operator.task_count || 0} tasks</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{operator.supporter_count || 0} supporters</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{operator.event_count || 0} events</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "funds",
    header: "Funds",
    cell: ({ row }) => {
      const operator = row.original;
      const totalFunds = operator.total_funds || 0;
      return (
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium">
            ${totalFunds.toLocaleString()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "allowed_actions",
    header: "Permissions",
    cell: ({ row }) => {
      const actions = row.getValue("allowed_actions") as string[];
      const displayActions = actions?.slice(0, 2) || [];

      return (
        <div className="flex flex-wrap gap-1">
          {displayActions.map((action) => (
            <Badge key={action} variant="outline" className="text-xs">
              {action.replace("_", " ")}
            </Badge>
          ))}
          {actions && actions.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{actions.length - 2}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "special_needs",
    header: "Special Needs",
    cell: ({ row }) => {
      const specialNeeds = row.getValue("special_needs") as string;
      return specialNeeds ? (
        <div className="flex items-center space-x-1 text-sm">
          <Heart className="h-3 w-3 text-muted-foreground" />
          <span className="truncate max-w-[100px]" title={specialNeeds}>
            {specialNeeds}
          </span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">None</span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return (
        <div className="flex items-center space-x-1 text-sm">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span>{date.toLocaleDateString()}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "last_activity",
    header: "Last Activity",
    cell: ({ row }) => {
      const operator = row.original;
      const lastActivity = operator.last_activity || operator.updated_at;
      const date = new Date(lastActivity);
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString()}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const operator = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Operator Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(operator.id.toString())
              }
            >
              <User className="mr-2 h-4 w-4" />
              Copy operator ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View full details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit operator info
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Phone className="mr-2 h-4 w-4" />
              Call operator
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Send email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Send className="mr-2 h-4 w-4" />
              Send message
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {operator.status === "pending" && (
              <DropdownMenuItem>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve operator
              </DropdownMenuItem>
            )}
            {operator.status === "approved" && (
              <DropdownMenuItem>
                <UserX className="mr-2 h-4 w-4" />
                Reject operator
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Manage permissions
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Activity className="mr-2 h-4 w-4" />
              View activity logs
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DollarSign className="mr-2 h-4 w-4" />
              View funds
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Export data
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive className="mr-2 h-4 w-4" />
              Archive operator
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete operator
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface OperatorsDataTableProps {
  data?: Operator[];
}

export function OperatorsDataTable({
  data = mockOperators,
}: OperatorsDataTableProps) {
  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const [genderFilter, setGenderFilter] = React.useState<string>("all");

  const filteredData = React.useMemo(() => {
    return data.filter((operator) => {
      const statusMatch =
        statusFilter === "all" || operator.status === statusFilter;
      const roleMatch = roleFilter === "all" || operator.role === roleFilter;
      const genderMatch =
        genderFilter === "all" || operator.gender === genderFilter;

      return statusMatch && roleMatch && genderMatch;
    });
  }, [data, statusFilter, roleFilter, genderFilter]);

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on ${selectedRows.length} operators`);
    // Implement bulk actions here
  };

  const getUniqueRoles = () => {
    return Array.from(new Set(data.map((o) => o.role))).sort();
  };

  const getUniqueGenders = () => {
    return Array.from(
      new Set(data.map((o) => o.gender).filter(Boolean))
    ).sort();
  };

  return (
    <div className="w-full space-y-4">
      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Advanced Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role-filter">Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {getUniqueRoles().map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender-filter">Gender</Label>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  {getUniqueGenders().map((gender) => (
                    <SelectItem key={gender} value={gender || ""}>
                      {gender
                        ? gender.charAt(0).toUpperCase() + gender.slice(1)
                        : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Actions</Label>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStatusFilter("all");
                    setRoleFilter("all");
                    setGenderFilter("all");
                  }}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {selectedRows.length} operator(s) selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRows([])}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4 mr-2" />
                      Bulk Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleBulkAction("approve")}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleBulkAction("reject")}
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      Reject Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleBulkAction("archive")}
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Archive Selected
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleBulkAction("export")}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleBulkAction("message")}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleBulkAction("delete")}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Data Table */}
      <div className="w-full overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable columns={columns} data={filteredData} />
        </div>
      </div>
    </div>
  );
}
