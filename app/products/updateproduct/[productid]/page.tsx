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
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useParams } from "next/navigation";

const UpdateProduct = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    product_name: "",
    product_description: "",
    image: "",
    price: 0,
    quantity: 0,
    id: "",
  });
  const param = useParams();
  useEffect(() => {
    const getProductData = async () => {
      try {
        const resp = await axios.post(
          `/api/product/getproducts/${param.productid}`
        );
        setData(resp.data);
        setLoading(false);
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    param.productid && getProductData();
  }, [param.productid]);

  const formSchema = z.object({
    product_name: z.string().nonempty(),
    product_description: z.string().nonempty(),
    image: z.string().nonempty(),
    price: z.coerce.number(),
    quantity: z.coerce.number(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    form.setValue("product_name", data.product_name);
    form.setValue("product_description", data.product_description);
    form.setValue("image", data.image);
    form.setValue("price", data.price);
    form.setValue("quantity", data.quantity);
  }, [data, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      toast.loading("Updating Product");
      await axios.put(`/api/product/updateproduct/${data.id}`, values);
      toast.dismiss();
      toast.success("Product Updated");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message);
    }
  };
  return (
    <main className="flex w-full justify-center items-center">
      <div className="w-[35%] py-5">
        <p className="text-xl font-semibold text-center mb-6">Update Product</p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 flex justify-center flex-col"
          >
            <FormField
              control={form.control}
              name="product_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="product_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Description</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Quantity</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span className="mt-10 w-4"></span>
            <Button type="submit">Update Product</Button>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default UpdateProduct;
