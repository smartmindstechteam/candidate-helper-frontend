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
  Users,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Bus,
  Star,
  Phone,
  Mail,
  IdCard,
} from "lucide-react";
import { Driver } from "@/lib/bus";
import { getDriverStatusColor } from "@/lib/bus";

interface DriverDataTableProps {
  data: Driver[];
  onEdit?: (driver: Driver) => void;
  onDelete?: (driver: Driver) => void;
  onView?: (driver: Driver) => void;
  onAssignBus?: (driver: Driver) => void;
}

export function DriverDataTable({ 
  data, 
  onEdit, 
  onDelete, 
  onView, 
  onAssignBus 
}: DriverDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<Driver>[] = [
    {
      accessorKey: "name",
      header: "Driver Name",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "licenseNumber",
      header: "License",
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <IdCard className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm">{row.getValue("licenseNumber")}</span>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Contact",
      cell: ({ row }) => {
        const driver = row.original;
        return (
          <div>
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">{driver.phone}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{driver.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "experience",
      header: "Experience",
      cell: ({ row }) => {
        const experience = row.getValue("experience") as number;
        return (
          <div className="text-center">
            <span className="font-medium">{experience}</span>
            <span className="text-sm text-muted-foreground ml-1">years</span>
          </div>
        );
      },
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => {
        const rating = row.getValue("rating") as number;
        return (
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="font-medium">{rating}</span>
            <span className="text-sm text-muted-foreground">/5</span>
          </div>
        );
      },
    },
    {
      accessorKey: "salary",
      header: "Salary",
      cell: ({ row }) => {
        const salary = row.getValue("salary") as number;
        return (
          <div className="text-right">
            <span className="font-medium">${salary}</span>
            <span className="text-sm text-muted-foreground ml-1">/month</span>
          </div>
        );
      },
    },
    {
      accessorKey: "assignedBusId",
      header: "Assigned Bus",
      cell: ({ row }) => {
        const assignedBusId = row.getValue("assignedBusId") as string;
        return assignedBusId ? (
          <div className="flex items-center space-x-1">
            <Bus className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-mono">{assignedBusId}</span>
          </div>
        ) : (
          <Badge variant="outline">Unassigned</Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge className={getDriverStatusColor(status as any)}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const driver = row.original;
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
              <DropdownMenuItem onClick={() => onView?.(driver)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(driver)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Driver
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAssignBus?.(driver)}>
                <Bus className="mr-2 h-4 w-4" />
                Assign Bus
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(driver)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Driver
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
            placeholder="Search drivers..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="max-w-sm"
          />
          <Select
            value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
            onValueChange={(value) =>
              table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="fired">Fired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} of {data.length} drivers
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
                  No drivers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
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
