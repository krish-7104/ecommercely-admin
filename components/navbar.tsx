"use client";
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const logoutHandler = async () => {
    toast.loading("Processing Logout...");
    try {
      const resp = await axios.get("/api/auth/logout");
      console.log(resp.data);
      toast.dismiss();
      window.location.assign("/");
    } catch (error: any) {
      toast.dismiss();
      toast.error("Uh oh! Something went wrong.");
    }
  };
  return (
    <nav className="w-full shadow-md border-b py-2 px-8 flex justify-between items-center">
      <p className="font-bold text-lg">Admin Dashboard</p>
      <div className="flex justify-end items-center w-[80%]">
        <div className="flex justify-evenly items-center mr-6">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger onClick={() => router.push("/")}>
                Home
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Products</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => router.push("/products")}>
                  View Product
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem
                  onClick={() => router.push("/products/addproduct")}
                >
                  Add Product
                </MenubarItem>
                <MenubarSeparator />
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Category</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => router.push("/category")}>
                  View Category
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem
                  onClick={() => router.push("/category/addcategory")}
                >
                  Add Category
                </MenubarItem>
                <MenubarSeparator />
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger onClick={() => router.push("/orders")}>
                Orders
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger onClick={() => router.push("/users")}>
                Users
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Admin Settings</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => router.push("/category")}>
                  View Admin
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem
                  onClick={() => router.push("/category/addcategory")}
                >
                  Add Admin
                </MenubarItem>
                <MenubarSeparator />
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger onClick={() => router.push("/settings")}>
                Settings
              </MenubarTrigger>
            </MenubarMenu>
          </Menubar>
        </div>
        <Popover>
          <PopoverTrigger>
            <Avatar className="cursor-pointer shadow">
              <AvatarFallback>KJ</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2">
            <Command>
              <CommandList>
                <CommandGroup>
                  <CommandItem
                    className="cursor-pointer font-medium"
                    onClickCapture={logoutHandler}
                  >
                    Logout
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
};

export default Navbar;
