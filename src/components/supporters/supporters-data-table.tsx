"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Download,
  Filter,
  X,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  UserX,
  Send,
  Archive,
  RefreshCw,
  UserCheck,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Supporter } from "@/types/supporter";
import { demographicsConfig } from "@/lib/utils/demographicsConfig";
import { District, PollingStation, Region } from "@/types/geography";
import { supporterTypes } from "@/lib/utils/supporterType";
import { number } from "zod";

// Helpers
const getStatusColor = (status: Supporter["status"]) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getInitials = (supporter: Supporter) => {
  const firstInitial = supporter.firstname?.[0] || "";
  const lastInitial = supporter.lastname?.[0] || "";
  return (firstInitial + lastInitial).toUpperCase();
};

const getStatusIcon = (status: Supporter["status"]) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case "rejected":
      return <UserX className="h-4 w-4 text-red-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-600" />;
  }
};

// Columns
const createColumns = (router: any): ColumnDef<Supporter>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
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
    accessorKey: "firstname",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2 lg:px-3"
      >
        Supporter
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const supporter = row.original;
      const fullName = `${supporter.firstname} ${
        supporter.middlename ? supporter.middlename + " " : ""
      }${supporter.lastname}`;
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={supporter.photoVerification || ""}
              alt={fullName}
            />
            <AvatarFallback className="text-xs">
              {getInitials(supporter)}
            </AvatarFallback>
          </Avatar>
          <div>
            <button
              onClick={() =>
                router.push(`/admin/supporters/${supporter.id}/view`)
              }
              className="font-medium text-foreground hover:text-primary transition-colors text-left"
            >
              {fullName}
            </button>
            <div className="text-sm text-muted-foreground">
              {supporter.favParty || "No party preference"}
            </div>
            <div className="text-xs text-muted-foreground">
              Type: {supporter.specialNeeds ? supporter.specialNeeds : "N/A"}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => {
      const supporter = row.original;
      const primaryPhone = supporter.phones?.find(
        (phone) => phone.type === "primary"
      );
      return (
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="text-foreground">
              {supporter.email || "No email"}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">
              {primaryPhone?.phone || "No phone"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "residency_location",
    header: "Residency Location",
    cell: ({ row }) => {
      const supporter = row.original;
      return (
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="text-foreground">
              {supporter.district?.name || "No district"}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {supporter.region?.name || "No region"}
          </div>
          {supporter.address && (
            <div className="text-xs text-muted-foreground">
              {supporter.address}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "polling_station",
    header: "Polling Station",
    cell: ({ row }) => {
      const supporter = row.original;
      return (
        <div className="space-y-1">
          <div className="text-sm text-foreground">
            {supporter.pollingStation?.name || "No polling station"}
          </div>
          {supporter.pollingStation && (
            <div className="text-xs text-muted-foreground">
              {supporter.pollingStation.district?.name || "No district"}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2 lg:px-3"
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as Supporter["status"];
      return (
        <div className="flex items-center space-x-2">
          {getStatusIcon(status)}
          <Badge className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "language",
    header: "Language",
    cell: ({ row }) => {
      const language = row.getValue("language") as string;
      const languageOption = demographicsConfig.languageOptions.find(
        (opt) => opt.value === language
      );
      return (
        <Badge variant="outline" className="text-xs">
          {languageOption ? languageOption.label : "Not specified"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.getValue("gender") as string;
      const genderOption = demographicsConfig.genderOptions.find(
        (opt) => opt.value === gender
      );
      return (
        <Badge variant="outline" className="text-xs">
          {genderOption ? genderOption.label : "Not specified"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2 lg:px-3"
      >
        Registered
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div className="text-sm">{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
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
      const supporter = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Supporter Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(supporter.id.toString())
              }
            >
              <User className="mr-2 h-4 w-4" />
              Copy supporter ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                router.push(`/admin/supporters/${supporter.id}/view`)
              }
            >
              <Eye className="mr-2 h-4 w-4" />
              View full details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(`/admin/supporters/${supporter.id}/edit`)
              }
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit supporter info
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Phone className="mr-2 h-4 w-4" />
              Call supporter
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Send email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Send className="mr-2 h-4 w-4" />
              Send SMS
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve supporter
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserX className="mr-2 h-4 w-4" />
              Reject supporter
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Export data
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive className="mr-2 h-4 w-4" />
              Archive supporter
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete supporter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export interface SupportersDataTableProps {
  data?: Supporter[];
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
}

export function SupportersDataTable({
  data = [],
  loading = false,
  error,
  onRefresh,
}: SupportersDataTableProps) {
  const router = useRouter();
  const columns = createColumns(router);
  const [selectedRows, setSelectedRows] = React.useState<Supporter[]>([]);

  const [filters, setFilters] = React.useState({
    status: "",
    gender: "",
    language: "",
    region: 0,
    district: 0,
    pollingStation: 0,
  });

  const filteredData = React.useMemo(() => {
    return data.filter((supporter) => {
      return (
        (filters.status ? supporter.status === filters.status : true) &&
        (filters.gender ? supporter.gender === filters.gender : true) &&
        (filters.language ? supporter.language === filters.language : true) &&
        (filters.region ? supporter.region?.id === filters.region : true) &&
        (filters.district
          ? supporter.district?.id === filters.district
          : true) &&
        (filters.pollingStation
          ? supporter.pollingStation?.id === filters.pollingStation
          : true)
      );
    });
  }, [data, filters]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supporters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
          <Select
            onValueChange={(value) => setFilters({ ...filters, status: value })}
            value={filters.status}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => setFilters({ ...filters, gender: value })}
            value={filters.gender}
          >
            <SelectTrigger>
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {demographicsConfig.genderOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) =>
              setFilters({ ...filters, language: value })
            }
            value={filters.language}
          >
            <SelectTrigger>
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {demographicsConfig.languageOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) =>
              setFilters({ ...filters, region: parseFloat(value) })
            }
            value={filters.region.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {supporterTypes.regions.map((r: Region) => (
                <SelectItem key={r.id} value={r.id.toString()}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) =>
              setFilters({ ...filters, district: parseInt(value) })
            }
            value={filters.district.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="District" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {supporterTypes.districts.map((d: District) => (
                <SelectItem key={d.id} value={d.id.toString()}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) =>
              setFilters({ ...filters, pollingStation: parseInt(value) })
            }
            value={filters.pollingStation.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Polling Station" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {supporterTypes.pollingStations.map((p: PollingStation) => (
                <SelectItem key={p.id} value={p.id.toString()}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DataTable
          filteringField="firstname"
          registering={{
            link: "/admin/register",
            name: "Supporter",
          }}
          columns={columns}
          data={filteredData}
        />
      </CardContent>
    </Card>
  );
}
