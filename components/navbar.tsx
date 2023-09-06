"use client";
import React, { useContext, useEffect, useReducer } from "react";
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
import toast from "react-hot-toast";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setUserHandler } from "@/redux/actions";
import { InitialState } from "@/redux/types";

const Navbar = () => {
  const router = useRouter();
  const pathname: string = usePathname();
  const dispatch = useDispatch();
  const userData = useSelector((state: InitialState) => state?.userData);
  useEffect(() => {
    const getUserTokenData = async () => {
      try {
        const resp = await axios.get("/api/auth/user");
        dispatch(
          setUserHandler({
            id: resp.data.user.userId,
            name: resp.data.user.name,
            email: resp.data.user.email,
          })
        );
      } catch (error: any) {
        router.push("/login");
      }
    };

    if (
      pathname !== "/login" &&
      pathname !== "/reset-password" &&
      !pathname.includes("verify-token")
    ) {
      getUserTokenData();
    }
  }, [dispatch, router, pathname]);

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
      <p className="font-bold text-lg">Ecommercely Admin</p>
      {pathname !== "/login" &&
        pathname !== "/reset-password" &&
        !pathname.includes("/verify-token") && (
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
                    <MenubarItem onClick={() => router.push("/admin")}>
                      View Admin
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem onClick={() => router.push("/admin/addadmin")}>
                      Add Admin
                    </MenubarItem>
                    <MenubarSeparator />
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger onClick={() => router.push("/logs")}>
                    Logs
                  </MenubarTrigger>
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
                  <AvatarFallback>
                    {userData?.name?.split(" ")[0]?.slice(0, 1)}
                    {userData?.name?.split(" ")[1]?.slice(0, 1)}
                  </AvatarFallback>
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
        )}
    </nav>
  );
};

export default Navbar;
