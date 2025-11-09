"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { FormateProduct } from "./page";
import dateFormaterHandler from "@/helper/DataFormatter";

export const createColumns = (
  navigate: (path: string) => void
): ColumnDef<FormateProduct>[] => [
  {
    accessorKey: "user.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p className="font-medium">{row.original.user.name}</p>;
    },
  },
  {
    accessorKey: "user.email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <p className="text-sm">{dateFormaterHandler(row.original.createdAt)}</p>
    ),
  },
  {
    accessorKey: "products.length",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Items
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const productCount = Array.isArray(row.original.products)
        ? row.original.products.length
        : 0;
      return <p className="text-center">{productCount}</p>;
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <p className="font-semibold text-green-700">₹{row.original.total}</p>
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
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      const statusColors: Record<string, string> = {
        Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
        Shipping: "bg-blue-100 text-blue-800 border-blue-300",
        Delivered: "bg-green-100 text-green-800 border-green-300",
        Cancelled: "bg-red-100 text-red-800 border-red-300",
      };
      const colorClass =
        statusColors[status] ||
        "bg-gray-100 text-gray-800 border-gray-300";

      return (
        <span
          className={`inline-block text-center px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/orders/${row.original.id}`)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          View
        </Button>
      );
    },
  },
];
