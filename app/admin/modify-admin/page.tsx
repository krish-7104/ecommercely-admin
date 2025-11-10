"use client";
import React, { useEffect } from "react";
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
import { useSelector } from "react-redux";
import { InitialState } from "@/redux/types";
import { ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { addLogHandler } from "@/helper/AddLog";

const ModifyAdmin = () => {
  const userData = useSelector((state: InitialState) => state?.userData);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const formSchema = z.object({
    email: z.string().nonempty(),
    password: z.string().optional(),
    name: z.string().nonempty(),
    active: z.boolean().optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      active: true,
    },
  });

  useEffect(() => {
    if (userId) {
      getUserDetails(userId);
    }
  }, [userId]);

  const getUserDetails = async (id: string) => {
    try {
      const response = await axios.get(`/api/auth/admin/${id}`);
      const data = response.data;
      form.setValue("email", data.email);
      form.setValue("name", data.name);
      form.setValue("active", data.active);
    } catch (error: any) {
      router.push("/admin");
      toast.error(error?.response?.data || "Something went wrong");
    }
  };

  const AddNewAdminHandler = async (values: any) => {
    toast.loading("Adding Admin..");
    try {
      const response = await axios.post("/api/auth/register", values);
      const afterData = response.data;
      toast.dismiss();
      toast.success("Admin Added Successfull");
      router.push("/admin");
      await addLogHandler({
        type: "Admin",
        message: `Admin (${values.name}) Added`,
        userId: userData.userId,
        before: null,
        after: afterData,
      });
    } catch (error: any) {
      toast.dismiss();
      toast.error("Uh oh! Something went wrong.");
    }
  };

  const UpdateAdminHandler = async (values: any) => {
    toast.loading("Updating Admin..");
    try {
      const payload: any = {
        type: "update-info",
        email: values.email,
        name: values.name,
        active: values.active,
      };
      const response = await axios.patch(`/api/auth/admin/${userId}`, payload);
      const { before, after } = response.data;
      await addLogHandler({
        type: "Admin",
        message: `Admin (${values.name}) Details Updated`,
        userId: userData.userId,
        before: before,
        after: after,
      });
      toast.dismiss();
      toast.success("Admin Added Successfull");
      router.push("/admin");
    } catch (error: any) {
      toast.dismiss();
      toast.error("Uh oh! Something went wrong.");
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (userId) {
      UpdateAdminHandler(values);
    } else {
      AddNewAdminHandler(values);
    }
  };
  return (
    <section className="relative flex justify-center items-center h-[100vh] w-full">
      <div className="w-[45%] px-7 py-5 bg-white border rounded-xl">
        <p className="text-xl font-semibold text-center mb-6">
          {userId ? "Modify Admin" : "Add New Admin"}
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
            <div className="mt-1"></div>
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
            {!userId ? (
              <>
                <div className="mt-1"></div>
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
              </>
            ) : null}
            <div className="mt-1"></div>
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex justify-start items-center">
                  <FormLabel className="me-2">Active Status</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-1"></div>
            <Button type="submit">{userId ? "Update" : "Add"} Admin</Button>
          </form>
        </Form>
      </div>

      <button
        className="bg-[#28292e] hover:bg-[#3c3d42] text-white p-4 flex justify-center items-center rounded-2xl absolute bottom-8 right-8"
        onClick={() => router.push("/admin")}
      >
        <ChevronLeft />
      </button>
    </section>
  );
};

export default ModifyAdmin;
