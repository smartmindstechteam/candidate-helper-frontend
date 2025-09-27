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
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Video,
  Mic,
  Image,
  ExternalLink,
  Copy,
  Share,
  Archive,
  RefreshCw,
  Tag,
  Shield,
  AlertTriangle,
  Phone,
  Building,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { type Event, type EventTableData } from "@/types/event";

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Presidential Campaign Rally",
    type: "rally",
    category: "Political Rally",
    timezone: "Africa/Mogadishu",
    description:
      "Major campaign rally in Hargeisa with keynote speeches and supporter engagement",
    objective: "Mobilize supporters and communicate campaign platform",
    tags: ["campaign", "rally", "hargeisa"],
    priority: "high",
    start_time: "2024-02-15T14:00:00Z",
    end_time: "2024-02-15T18:00:00Z",
    recurrence: "none",
    setup_time: "2024-02-15T12:00:00Z",
    teardown_time: "2024-02-15T20:00:00Z",
    venue: "Hargeisa Stadium",
    city: "Hargeisa",
    district_id: 1,
    region_id: 1,
    address: "Hargeisa Stadium, Hargeisa, Somaliland",
    lat: 9.5616,
    lng: 44.065,
    max_capacity: 5000,
    expected_attendance: 3500,
    actual_attendance: 2800,
    budget_amount: 15000,
    estimated_cost: 12000,
    funding_source_id: 1,
    status: "scheduled",
    media_links: [
      "https://youtube.com/live/rally",
      "https://facebook.com/events/rally",
    ],
    organizer_name: "Ahmed Hassan",
    organizer_contact: "+252 61 234 5678",
    backup_contact: "+252 61 234 5679",
    assigned_operator_id: 1,
    risk_assessment: "High security risk due to large crowd",
    contingency_plan: "Emergency medical team on standby, security backup plan",
    feedback_link: "https://forms.gle/rally-feedback",
    created_by: 1,
    updated_by: 1,
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z",
  },
  {
    id: 2,
    title: "Youth Engagement Workshop",
    type: "training",
    category: "Youth Development",
    timezone: "Africa/Mogadishu",
    description:
      "Interactive workshop focusing on youth participation in politics",
    objective: "Educate young people about political participation",
    tags: ["youth", "training", "education"],
    priority: "medium",
    start_time: "2024-02-10T09:00:00Z",
    end_time: "2024-02-10T16:00:00Z",
    recurrence: "none",
    venue: "Hargeisa University",
    city: "Hargeisa",
    district_id: 2,
    region_id: 1,
    address: "Hargeisa University, Hargeisa, Somaliland",
    lat: 9.57,
    lng: 44.07,
    max_capacity: 200,
    expected_attendance: 150,
    actual_attendance: 120,
    budget_amount: 5000,
    estimated_cost: 4500,
    status: "completed",
    media_links: [],
    organizer_name: "Fatima Ali",
    organizer_contact: "+252 61 234 5679",
    created_by: 1,
    updated_by: 1,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-02-10T16:00:00Z",
  },
  {
    id: 3,
    title: "Fundraising Gala Dinner",
    type: "fundraiser",
    category: "Fundraising",
    timezone: "Africa/Mogadishu",
    description: "Elegant fundraising event for campaign supporters and donors",
    objective: "Raise funds for campaign activities",
    tags: ["fundraising", "dinner", "donors"],
    priority: "high",
    start_time: "2024-02-20T19:00:00Z",
    end_time: "2024-02-20T23:00:00Z",
    recurrence: "none",
    venue: "Hargeisa Hotel",
    city: "Hargeisa",
    district_id: 1,
    region_id: 1,
    address: "Hargeisa Hotel, Hargeisa, Somaliland",
    lat: 9.56,
    lng: 44.06,
    max_capacity: 300,
    expected_attendance: 250,
    actual_attendance: 200,
    budget_amount: 25000,
    estimated_cost: 20000,
    funding_source_id: 2,
    status: "scheduled",
    media_links: [],
    organizer_name: "Omar Mohamed",
    organizer_contact: "+252 61 234 5680",
    backup_contact: "+252 61 234 5681",
    assigned_operator_id: 2,
    risk_assessment: "Low risk event in controlled environment",
    contingency_plan: "Backup venue available if needed",
    feedback_link: "https://forms.gle/gala-feedback",
    created_by: 1,
    updated_by: 1,
    created_at: "2024-01-18T10:00:00Z",
    updated_at: "2024-01-18T10:00:00Z",
  },
  {
    id: 4,
    title: "Community Meeting - Berbera",
    type: "meeting",
    category: "Community Engagement",
    timezone: "Africa/Mogadishu",
    description:
      "Community engagement meeting to discuss local issues and campaign promises",
    objective: "Engage with local community and address concerns",
    tags: ["community", "meeting", "berbera"],
    priority: "medium",
    start_time: "2024-02-05T16:00:00Z",
    end_time: "2024-02-05T19:00:00Z",
    recurrence: "none",
    venue: "Berbera Community Center",
    city: "Berbera",
    district_id: 6,
    region_id: 6,
    address: "Berbera Community Center, Berbera, Somaliland",
    lat: 10.4333,
    lng: 45.0167,
    max_capacity: 500,
    expected_attendance: 300,
    actual_attendance: 250,
    budget_amount: 3000,
    estimated_cost: 2500,
    status: "in_progress",
    media_links: [],
    organizer_name: "Aisha Ahmed",
    organizer_contact: "+252 61 234 5681",
    created_by: 1,
    updated_by: 1,
    created_at: "2024-01-12T10:00:00Z",
    updated_at: "2024-02-05T16:00:00Z",
  },
  {
    id: 5,
    title: "Media Conference",
    type: "meeting",
    category: "Media Event",
    timezone: "Africa/Mogadishu",
    description: "Press conference to announce new campaign initiatives",
    objective: "Communicate new policies to media and public",
    tags: ["media", "press", "announcement"],
    priority: "high",
    start_time: "2024-02-08T10:00:00Z",
    end_time: "2024-02-08T12:00:00Z",
    recurrence: "none",
    venue: "Campaign Headquarters",
    city: "Hargeisa",
    district_id: 1,
    region_id: 1,
    address: "Campaign Headquarters, Hargeisa, Somaliland",
    lat: 9.55,
    lng: 44.05,
    max_capacity: 100,
    expected_attendance: 50,
    actual_attendance: 45,
    budget_amount: 2000,
    estimated_cost: 1500,
    status: "cancelled",
    media_links: ["https://youtube.com/live/press-conference"],
    organizer_name: "Hassan Ibrahim",
    organizer_contact: "+252 61 234 5682",
    backup_contact: "+252 61 234 5683",
    assigned_operator_id: 3,
    risk_assessment: "Low risk indoor event",
    contingency_plan: "Virtual conference backup available",
    feedback_link: "https://forms.gle/press-feedback",
    created_by: 1,
    updated_by: 1,
    created_at: "2024-01-25T10:00:00Z",
    updated_at: "2024-02-07T10:00:00Z",
  },
];

const getEventTypeColor = (eventType: Event["type"]) => {
  switch (eventType) {
    case "rally":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    case "meeting":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "training":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "fundraiser":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "other":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getStatusColor = (status: Event["status"]) => {
  switch (status) {
    case "planned":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
    case "scheduled":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "in_progress":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "completed":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getPriorityColor = (priority: Event["priority"]) => {
  switch (priority) {
    case "low":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getStatusIcon = (status: Event["status"]) => {
  switch (status) {
    case "planned":
      return <Edit className="h-4 w-4 text-orange-600" />;
    case "scheduled":
      return <Clock className="h-4 w-4 text-blue-600" />;
    case "in_progress":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "completed":
      return <CheckCircle className="h-4 w-4 text-gray-600" />;
    case "cancelled":
      return <X className="h-4 w-4 text-red-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-600" />;
  }
};

const getEventTypeIcon = (eventType: Event["type"]) => {
  switch (eventType) {
    case "rally":
      return <Mic className="h-4 w-4 text-red-600" />;
    case "meeting":
      return <Users className="h-4 w-4 text-blue-600" />;
    case "training":
      return <Target className="h-4 w-4 text-green-600" />;
    case "fundraiser":
      return <DollarSign className="h-4 w-4 text-yellow-600" />;
    case "other":
      return <Calendar className="h-4 w-4 text-gray-600" />;
    default:
      return <Calendar className="h-4 w-4 text-gray-600" />;
  }
};

const getPriorityIcon = (priority: Event["priority"]) => {
  switch (priority) {
    case "low":
      return <AlertCircle className="h-4 w-4 text-gray-600" />;
    case "medium":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    case "high":
      return <Shield className="h-4 w-4 text-red-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-600" />;
  }
};

const createColumns = (
  onViewEvent?: (event: Event) => void,
  onEditEvent?: (event: Event) => void,
  onDeleteEvent?: (event: Event) => void
): ColumnDef<Event>[] => [
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
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Event
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className="space-y-1">
          <div className="font-medium max-w-[200px] truncate">
            {event.title}
          </div>
          <div className="text-sm text-muted-foreground">ID: {event.id}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const eventType = row.getValue("type") as Event["type"];
      return (
        <div className="flex items-center space-x-2">
          {getEventTypeIcon(eventType)}
          <Badge className={getEventTypeColor(eventType)}>
            {eventType.charAt(0).toUpperCase() + eventType.slice(1)}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as Event["priority"];
      if (!priority) {
        return (
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-gray-600" />
            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
              Not Set
            </Badge>
          </div>
        );
      }
      return (
        <div className="flex items-center space-x-2">
          {getPriorityIcon(priority)}
          <Badge className={getPriorityColor(priority)}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "start_time",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Date & Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const event = row.original;
      const startDate = new Date(event.start_time);
      const endDate = new Date(event.end_time);
      return (
        <div className="space-y-1">
          <div className="flex items-center space-x-1 text-sm">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>{startDate.toLocaleDateString()}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {startDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {endDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "venue",
    header: "Location",
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className="space-y-1">
          <div className="flex items-center space-x-1 text-sm">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="max-w-[150px] truncate">{event.venue}</span>
          </div>
          <div className="text-sm text-muted-foreground">{event.city}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "attendance",
    header: "Attendance",
    cell: ({ row }) => {
      const event = row.original;
      const actual = event.actual_attendance || 0;
      const expected = event.expected_attendance || 0;
      const max = event.max_capacity;
      const attendanceRate = expected > 0 ? (actual / expected) * 100 : 0;
      return (
        <div className="space-y-1">
          <div className="text-sm font-medium">
            {actual}/{max}
          </div>
          <div className="text-sm text-muted-foreground">
            {attendanceRate.toFixed(1)}% of expected
          </div>
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
      const status = row.getValue("status") as Event["status"];
      return (
        <div className="flex items-center space-x-2">
          {getStatusIcon(status)}
          <Badge className={getStatusColor(status)}>
            {status.replace("_", " ").charAt(0).toUpperCase() +
              status.replace("_", " ").slice(1)}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "budget_amount",
    header: "Budget",
    cell: ({ row }) => {
      const budget = row.getValue("budget_amount") as number;
      const estimated = row.original.estimated_cost;
      return (
        <div className="space-y-1">
          <div className="text-sm font-medium">${budget.toLocaleString()}</div>
          {estimated && (
            <div className="text-sm text-muted-foreground">
              Est: ${estimated.toLocaleString()}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "organizer_name",
    header: "Organizer",
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className="space-y-1">
          <div className="text-sm font-medium">{event.organizer_name}</div>
          <div className="text-sm text-muted-foreground">
            {event.organizer_contact}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const event = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Event Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(event.id.toString())}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy event ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewEvent?.(event)}>
              <Eye className="mr-2 h-4 w-4" />
              View full details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditEvent?.(event)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit event
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {event.media_links && event.media_links.length > 0 && (
              <>
                <DropdownMenuItem>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View media links
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem>
              <Share className="mr-2 h-4 w-4" />
              Share event
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              Manage attendees
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DollarSign className="mr-2 h-4 w-4" />
              View budget
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Archive className="mr-2 h-4 w-4" />
              Archive event
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDeleteEvent?.(event)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete event
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export { createColumns };

interface EventsDataTableProps {
  data?: Event[];
  onCreateEvent?: () => void;
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (event: Event) => void;
  onViewEvent?: (event: Event) => void;
}

export function EventsDataTable({
  data = mockEvents,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
  onViewEvent,
}: EventsDataTableProps) {
  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all");

  const columns = React.useMemo(
    () => createColumns(onViewEvent, onEditEvent, onDeleteEvent),
    [onViewEvent, onEditEvent, onDeleteEvent]
  );

  const filteredData = React.useMemo(() => {
    return data.filter((event) => {
      const statusMatch =
        statusFilter === "all" || event.status === statusFilter;
      const typeMatch = typeFilter === "all" || event.type === typeFilter;
      const priorityMatch =
        priorityFilter === "all" || event.priority === priorityFilter;

      return statusMatch && typeMatch && priorityMatch;
    });
  }, [data, statusFilter, typeFilter, priorityFilter]);

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on ${selectedRows.length} events`);
    // Implement bulk actions here
  };

  const getUniqueTypes = () => {
    return Array.from(new Set(data.map((e) => e.type))).sort();
  };

  const getUniqueStatuses = () => {
    return Array.from(new Set(data.map((e) => e.status))).sort();
  };

  const getUniquePriorities = () => {
    return Array.from(
      new Set(
        data
          .map((e) => e.priority)
          .filter((p): p is NonNullable<typeof p> => Boolean(p))
      )
    ).sort();
  };

  return (
    <div className="w-full space-y-4">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Events</h2>
          <p className="text-muted-foreground">
            Manage and track all campaign events
          </p>
        </div>
        {onCreateEvent && (
          <Button onClick={onCreateEvent}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        )}
      </div>

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
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type-filter">Event Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {getUniqueTypes().map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority-filter">Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  {getUniquePriorities().map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
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
                    setTypeFilter("all");
                    setPriorityFilter("all");
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
                  {selectedRows.length} event(s) selected
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
                      onClick={() => handleBulkAction("schedule")}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Schedule Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleBulkAction("cancel")}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleBulkAction("complete")}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Complete
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleBulkAction("export")}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("share")}>
                      <Share className="mr-2 h-4 w-4" />
                      Share Selected
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
      <div className="w-full">
        <DataTable columns={columns} data={filteredData} />
      </div>
    </div>
  );
}
