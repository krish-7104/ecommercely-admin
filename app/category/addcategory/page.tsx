"use client";
import React, { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { addLogHandler } from "@/helper/AddLog";
import { useSelector } from "react-redux";
import { InitialState } from "@/redux/types";
const AddCategory = () => {
  const userData = useSelector((state: InitialState) => state?.userData);
  const [access, setAccess] = useState(false);
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
    name: z.string().nonempty(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Adding Category..");
    try {
      const resp = await axios.post("/api/category/addcategory", values);
      const logResp = await addLogHandler({
        type: "Category",
        message: `Category Added: ${values.name}`,
        userId: userData.id,
      });
      toast.dismiss();
      toast.success("Category Added");
      form.reset();
    } catch (error: any) {
      toast.dismiss();
      toast.error("Something Went Wrong!");
    }
  };

  return (
    <section className="relative flex justify-center items-center w-full mt-6">
      {access && (
        <div className="w-[35%] py-5">
          <p className="text-xl font-semibold text-center mb-6">
            Add New Category
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
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <span className="mt-10 w-4"></span>
              <Button type="submit">Add New Category</Button>
            </form>
          </Form>
        </div>
      )}
      {!access && <p>You Don&apos;t Have Access To Add Admin.</p>}
    </section>
  );
};

export default AddCategory;
