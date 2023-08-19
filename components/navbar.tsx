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
import { toast } from "@/components/ui/use-toast";

const Navbar = () => {
  const logoutHandler = async () => {
    try {
      const resp = await axios.get("/api/auth/logout");
      console.log(resp.data);
      window.location.assign("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.response.data,
      });
    }
  };
  return (
    <nav className="w-full shadow-md border-b py-2 px-8 flex justify-between items-center">
      <p className="font-bold text-lg">Admin Dashboard</p>
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
    </nav>
  );
};

export default Navbar;
