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
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
const Login = () => {
  useEffect(() => {
    toast.dismiss();
  }, []);
  const router = useRouter();
  const formSchema = z.object({
    email: z.string().nonempty(),
    password: z.string().nonempty(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Logging In...");
    try {
      const resp = await axios.post("/api/auth/login", values);
      localStorage.setItem("adminToken", resp.data.token);
      toast.dismiss();
      router.push("/");
      toast.success("Login Successfull");
    } catch (error: any) {
      toast.dismiss();
      console.log(error);
      if (error.response.status === 401) toast.error(error.response.data);
      else toast.error("Uh oh! Something went wrong.");
    }
  };
  return (
    <section className="relative bg-[#f6f6f6] flex justify-center items-center h-[100vh] w-full">
      <div className="w-[40%] bg-white shadow-md px-7 py-5">
        <p className="text-xl font-semibold text-center mb-6">
          Login - Admin Panel
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 flex justify-center flex-col"
          >
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
                    <Input placeholder="*********" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-right text-sm font-medium my-3">
              <Link href={"/reset-password"}>Forget Password?</Link>
            </p>
            <Button type="submit">Login Now</Button>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default Login;
