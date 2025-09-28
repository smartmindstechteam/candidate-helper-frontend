"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Users,
  Calendar,
  Wrench,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Bus as BusType } from "@/lib/bus";
import {
  getBusStatusColor,
  getMaintenanceStatus,
  getMaintenanceStatusColor,
} from "@/lib/bus";
import { BusApiService } from "@/lib/bus-api";

interface BusDataTableProps {
  data: BusType[];
  onEdit?: (bus: BusType) => void;
  onDelete?: (bus: BusType) => void;
  onView?: (bus: BusType) => void;
}

export function BusDataTable({
  data,
  onEdit,
  onDelete,
  onView,
}: BusDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const columns: ColumnDef<BusType>[] = [
    {
      accessorKey: "busNumber",
      header: "Bus Number",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Bus className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue("busNumber")}</span>
        </div>
      ),
    },
    {
      accessorKey: "plateNumber",
      header: "License Plate",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("plateNumber")}</div>
      ),
    },
    {
      accessorKey: "model",
      header: "Model",
      cell: ({ row }) => {
        const bus = row.original;
        return (
          <div>
            <div className="font-medium">{bus.model}</div>
            <div className="text-sm text-muted-foreground">
              {bus.manufacturer} • {bus.year}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "capacity",
      header: "Capacity",
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{row.getValue("capacity")} seats</span>
        </div>
      ),
    },
    {
      accessorKey: "busType",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("busType") as string;
        return (
          <Badge variant="outline" className="capitalize">
            {type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const maintenanceStatus = getMaintenanceStatus(row.original);
        return (
          <div className="space-y-1">
            <Badge className={getBusStatusColor(status as any)}>{status}</Badge>
            <Badge
              variant="outline"
              className={getMaintenanceStatusColor(maintenanceStatus)}
            >
              {maintenanceStatus}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "features",
      header: "Features",
      cell: ({ row }) => {
        const bus = row.original;
        const features = [];
        if (bus.isGpsEnabled) features.push("GPS");
        if (bus.hasWifi) features.push("WiFi");
        if (bus.hasAirConditioning) features.push("AC");
        if (bus.isAccessible) features.push("Accessible");

        return (
          <div className="flex flex-wrap gap-1">
            {features.map((feature) => (
              <Badge key={feature} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "fuelType",
      header: "Fuel",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.getValue("fuelType")}
        </Badge>
      ),
    },
    {
      accessorKey: "nextMaintenance",
      header: "Next Maintenance",
      cell: ({ row }) => {
        const date = new Date(row.getValue("nextMaintenance"));
        const now = new Date();
        const daysUntil = Math.ceil(
          (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        return (
          <div className="flex items-center space-x-1">
            {daysUntil <= 7 ? (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            ) : daysUntil <= 30 ? (
              <Wrench className="h-4 w-4 text-yellow-500" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            <span className="text-sm">
              {daysUntil <= 0 ? "Overdue" : `${daysUntil}d`}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const bus = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onView?.(bus)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(bus)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Bus
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(bus)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Bus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search buses..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="max-w-sm"
          />
          <Select
            value={
              (table.getColumn("status")?.getFilterValue() as string) ?? ""
            }
            onValueChange={(value) =>
              table
                .getColumn("status")
                ?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={
              (table.getColumn("busType")?.getFilterValue() as string) ?? ""
            }
            onValueChange={(value) =>
              table
                .getColumn("busType")
                ?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="deluxe">Deluxe</SelectItem>
              <SelectItem value="minibus">Minibus</SelectItem>
              <SelectItem value="coach">Coach</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} of {data.length} buses
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No buses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{" "}
          to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
