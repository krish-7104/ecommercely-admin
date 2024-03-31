"use client";
import React, { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "react-hot-toast";
import { addLogHandler } from "@/helper/AddLog";
import { useSelector } from "react-redux";
import { InitialState } from "@/redux/types";
import { ChevronLeft, UserPlus2 } from "lucide-react";
import { useRouter } from "next/navigation";

const AddAdmin = () => {
  const userData = useSelector((state: InitialState) => state?.userData);
  const [access, setAccess] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (userData.email === "test@admin.com") {
      toast.dismiss();
      toast.error("Access Denied!");
      setAccess(false);
    } else {
      setAccess(true);
    }
  }, [userData]);
  const formSchema = z.object({
    email: z.string().nonempty(),
    password: z.string().nonempty(),
    name: z.string().nonempty(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Adding Admin..");
    try {
      await axios.post("/api/auth/register", values);
      await addLogHandler({
        type: "Admin",
        message: `Admin Added: ${values.name} (${values.email})`,
        userId: userData.id,
      });
      toast.dismiss();
      toast.success("Admin Added Successfull");
    } catch (error: any) {
      toast.dismiss();
      toast.error("Uh oh! Something went wrong.");
    }
  };
  return (
    <section className="relative flex justify-center items-center h-[100vh] w-full">
      {access && (
        <div className="w-[45%] px-7 py-5 bg-white border rounded-xl">
          <p className="text-xl font-semibold text-center mb-6">
            Add New Admin
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 flex justify-center flex-col"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Wick" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="abc@admin.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="*********"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Add Admin</Button>
            </form>
          </Form>
        </div>
      )}
      <button
        className="bg-[#28292e] hover:bg-[#3c3d42] text-white p-4 flex justify-center items-center rounded-2xl absolute bottom-8 right-8"
        onClick={() => router.push("/admin")}
      >
        <ChevronLeft />
      </button>
      {!access && <p>You Don&apos;t Have Access To Add Admin.</p>}
    </section>
  );
};

export default AddAdmin;
