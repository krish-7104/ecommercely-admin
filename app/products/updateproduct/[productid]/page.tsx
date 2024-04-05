"use client";
import React, { FormEvent, useEffect, useState } from "react";
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
import { useParams, useRouter } from "next/navigation";
import { addLogHandler } from "@/helper/AddLog";
import { useSelector } from "react-redux";
import { InitialState } from "@/redux/types";
import PageTitle from "@/components/page-title";
import { Delete, Pencil, Trash } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Cloudinary } from "cloudinary-core";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const UpdateProduct = () => {
  const navigate = useRouter();
  const [data, setData] = useState({
    product_name: "",
    product_description: "",
    image: "",
    price: 0,
    quantity: 0,
    id: "",
  });
  const param = useParams();
  const userData = useSelector((state: InitialState) => state.userData);
  const cloudinary = new Cloudinary({
    cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
  });
  useEffect(() => {
    const getProductData = async () => {
      try {
        toast.loading("Loading Product Data..");
        const resp = await axios.post(
          `/api/product/getproducts/${param.productid}`
        );
        toast.dismiss();
        setData(resp.data);
      } catch (error: any) {
        toast.dismiss();
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
    file: z.string().optional(),
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
    toast.loading("Updating Product");
    try {
      await axios.put(`/api/product/updateproduct/${data.id}`, values);
      await addLogHandler({
        type: "Product",
        message: `Product Updated: ${values.product_name}`,
        userId: userData?.userId,
      });
      toast.dismiss();
      toast.success("Product Updated");
      navigate.push("/products");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      alert("Please select a file.");
      return;
    }
    try {
      toast.loading("Upload Image!");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET!);
      formData.append("folder", "Ecommercely");
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const imageUrl = cloudinary.url(response.data.public_id);
      setData({ ...data, image: imageUrl });
      toast.dismiss();
      toast.success("Image Upload!");
    } catch (error) {
      toast.dismiss();
      toast.error("Image Upload Error!");
      console.error("Upload error:", error);
    }
  };

  const deleteProductHandler = async () => {
    toast.loading("Deleting Product");
    try {
      await axios.delete(`/api/product/deleteproduct/${data.id}`);
      await addLogHandler({
        type: "Product",
        message: `Product Deleted: ${data.product_name}`,
        userId: userData?.userId,
      });
      toast.dismiss();
      toast.success("Product Deleted");
      navigate.push("/products");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message);
    }
  };

  return (
    <section className="w-full min-h-[100vh] bg-white">
      <PageTitle
        title={"Edit Product"}
        icon={<Pencil className="mr-3" size={20} />}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 w-[92%] mx-auto my-6"
        >
          <FormField
            control={form.control}
            name="product_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Textarea placeholder="Type your message here." {...field} />
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
                  <Textarea placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <section className="grid grid-cols-2 gap-x-4">
            <div>
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Image</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        type="file"
                        {...field}
                        onChange={handleFileUpload}
                      />
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
            </div>
            <div>
              <FormLabel>Product Image Preview</FormLabel>
              {data && data.image && (
                <Image
                  src={data.image}
                  width={200}
                  height={300}
                  alt="product preview"
                />
              )}
            </div>
          </section>
          <span className="mt-10 w-4"></span>
          <div className="flex justify-start items-center">
            <Button type="submit">Update Product</Button>
          </div>
        </form>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button
              className="ml-2 absolute top-10 right-10"
              variant={"destructive"}
              size={"icon"}
            >
              <Trash size={20} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your product from the database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={deleteProductHandler}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Form>
    </section>
  );
};

export default UpdateProduct;
