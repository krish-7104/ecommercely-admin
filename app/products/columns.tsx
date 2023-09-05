"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-hot-toast";
import axios from "axios";
import { addLogHandler } from "@/helper/AddLog";
import mystore from "@/redux/store";
const state = mystore.getState();
let refreshTableCallback: (() => void) | null = null;

export type Products = {
  id: string;
  product_name: string;
  price: Number;
  quantity: Number;
  category: string;
  visible: Boolean;
  featured: Boolean;
};

const updateData = async (
  id: string,
  type: any,
  value: Boolean,
  name: string
) => {
  toast.loading("Uploading Data");
  try {
    const resp = await axios.put("/api/product/updateproduct", {
      id,
      [type]: value,
    });
    console.log(state.userData);
    await addLogHandler({
      type: "Product",
      message: `Product Updated: ${type} - ${value} (${name})`,
      userId: state.userData.user.userId,
    });
    console.log(`Product Updated: ${type} - ${value} (${name})`);
    if (refreshTableCallback) {
      refreshTableCallback();
    }
    toast.dismiss();
  } catch (error: any) {
    toast.dismiss();
    toast.error("Something Went Wrong!");
  }
};

export const columns: ColumnDef<Products>[] = [
  {
    accessorKey: "product_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p className="line-clamp-2">{row.original.product_name}</p>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "visible",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Published
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Switch
        checked={Boolean(row.original.visible)}
        onCheckedChange={(value) =>
          updateData(
            row.original.id,
            "visible",
            value,
            row.original.product_name
          )
        }
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "featured",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Featured
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Switch
        checked={Boolean(row.original.featured)}
        onCheckedChange={(value) =>
          updateData(
            row.original.id,
            "featured",
            value,
            row.original.product_name
          )
        }
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "Category.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const productId = row.original.id;
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
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(productId);
                toast.success("Product Id Copied");
              }}
            >
              Copy Product ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                window.open(`/products/updateproduct/${productId}`, "_self")
              }
            >
              Edit Product
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                window.open(
                  `https://ecommercely.vercel.app/product/${productId}`
                )
              }
            >
              View Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function setRefreshTableCallback(callback: () => void) {
  refreshTableCallback = callback;
}
