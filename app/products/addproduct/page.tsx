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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addLogHandler } from "@/helper/AddLog";
import { useSelector } from "react-redux";
import { InitialState } from "@/redux/types";
import PageTitle from "@/components/page-title";
import { Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Cloudinary } from "cloudinary-core";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

const AddProduct = () => {
  const userData = useSelector((state: InitialState) => state.userData);
  const [image, setImage] = useState("");
  const navigate = useRouter();
  const [categoryData, setCategoryData] = useState<
    Array<{ name: string; id: string }>
  >([]);
  const [dataFetched, setDataFetched] = useState<Boolean>(false);
  const formSchema = z.object({
    product_name: z.string().nonempty(),
    product_description: z.string().nonempty(),
    price: z.coerce.number(),
    quantity: z.coerce.number(),
    file: z.string().optional(),
    category: z.string().nonempty(),
    featured: z.string().optional(),
    image: z.string().optional(),
  });

  const cloudinary = new Cloudinary({
    cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_name: "",
      product_description: "",
      file: "",
      category: "",
      image: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Adding Product..");
    try {
      const selectedCategory = categoryData.find(
        (item) => item.id === values.category
      );
      values.category = selectedCategory ? selectedCategory.id : "";

      await axios.post("/api/product/addproduct", values);
      await addLogHandler({
        type: "Product",
        message: `Product Added: ${values.product_name}`,
        userId: userData.userId,
      });
      toast.dismiss();
      toast.success("Product Added");
      navigate.push("/products");
      form.reset();
    } catch (error: any) {
      toast.dismiss();
      toast.error("Something Went Wrong!");
    }
  };

  useEffect(() => {
    if (!dataFetched) {
      getCategoryData();
    }
  }, [dataFetched]);

  const getCategoryData = async (): Promise<void> => {
    toast.loading("Loading Data");
    try {
      const resp = await axios.post("/api/category/getcategory");
      setCategoryData(resp.data);
      setDataFetched(true);
      toast.dismiss();
    } catch (error: any) {
      setCategoryData([]);
      setDataFetched(true);
      toast.dismiss();
      toast.error("Something Went Wrong!");
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
      setImage(imageUrl);
      form.setValue("image", imageUrl);
      toast.dismiss();
      toast.success("Image Upload!");
    } catch (error) {
      toast.dismiss();
      toast.error("Image Upload Error!");
      console.error("Upload error:", error);
    }
  };

  return (
    <section className="w-full min-h-[100vh] bg-white">
      <PageTitle
        title={"Add Product"}
        icon={<Plus className="mr-3" size={20} />}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 w-[92%] mx-auto py-6"
        >
          <FormField
            control={form.control}
            name="product_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Textarea {...field} />
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
                  <FormItem className="mt-2">
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
                  <FormItem className="mt-2">
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
                  <FormItem className="mt-2">
                    <FormLabel>Product Quantity</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormLabel>Product Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Product Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryData &&
                            categoryData.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex justify-start items-center mt-6 pb-4">
                    <FormLabel>Product Featured</FormLabel>
                    <FormControl>
                      <Switch className="ml-2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {image && (
              <div>
                <FormLabel>Product Image Preview</FormLabel>
                <Image
                  src={image}
                  width={200}
                  height={300}
                  alt="product preview"
                />
              </div>
            )}
          </section>
          <span className="mt-10 w-4"></span>
          <Button type="submit">Add Product</Button>
        </form>
      </Form>
    </section>
  );
};

export default AddProduct;
