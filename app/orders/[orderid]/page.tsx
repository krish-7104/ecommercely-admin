"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addLogHandler } from "@/helper/AddLog";
import { InitialState } from "@/redux/types";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

type Product = {
  category: string;
  name: string;
  price: number;
  productId: string;
  quantity: number;
};

type User = {
  name: string;
  email: string;
  address: string;
  phoneno: string;
  state: string;
  city: string;
  country: string;
  pincode: number;
};

type OrderData = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  products: Product[];
  user: User;
};

const Order = () => {
  const router = useRouter();
  const param = useParams();
  const userData = useSelector((state: InitialState) => state.userData);
  const [data, setData] = useState<OrderData>();
  useEffect(() => {
    const getOrderData = async () => {
      const resp = await axios.get(`/api/order/${param.orderid}`);
      setData(resp.data);
    };
    getOrderData();
  }, [param.orderid]);

  const updateStatushandler = async (value: string) => {
    data && setData({ ...data, status: value });
    toast.loading("Updating Status");
    try {
      await axios.put(`/api/order/updateorder/${param.orderid}`, {
        status: value,
      });
      await addLogHandler({
        type: "Order",
        message: `Order Updated: Status - ${value} (${data?.id})`,
        userId: userData.userId,
      });
      toast.dismiss();
      toast.success("Status Updated");
    } catch (error) {
      toast.dismiss();
      console.log(error);
      toast.error("Something Went Wrong!");
    }
  };

  return (
    <main className="flex w-full justify-center items-center">
      <section className="container w-[80%] my-10">
        <div className="my-2">
          <Button onClick={() => router.back()} variant={"ghost"} size={"icon"}>
            <ChevronLeft />
          </Button>
        </div>
        <p className="font-bold text-2xl  flex items-center mb-4">
          Order Details
        </p>
        {data && (
          <>
            <section className="flex justify-between items-start">
              <div>
                <p>
                  <span className="font-medium">Order Id:</span> {data.id}
                </p>
                <p className="my-1">
                  <span className="font-medium">Name: </span>
                  {data.user.name}
                </p>
                <p className="my-1">
                  <span className="font-medium">Email Address: </span>
                  {data.user.email}
                </p>
                <p className="my-1">
                  <span className="font-medium">Phone No.: </span>
                  {data.user.phoneno}
                </p>
                <p className="my-1">
                  <span className="font-medium">Country: </span>
                  {data.user.country}
                </p>
                <p className="my-1">
                  <span className="font-medium">State and City:</span>{" "}
                  {data.user.state}, {data.user.city}, {data.user.pincode}
                </p>
                <p className="my-1">
                  <span className="font-medium">Address</span>{" "}
                  {data.user.address}
                </p>
              </div>
              <div>
                <p className="mb-2 font-semibold">Order Status</p>
                <Select onValueChange={updateStatushandler} value={data.status}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={data.status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Shipping">Shipping</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>
            <div className="border px-4 pb-2 my-4 rounded">
              <div className="grid grid-cols-4 mt-4 mb-2 border-b pb-2">
                <p className="col-span-2 font-medium">Product Name</p>
                <p className="col-span-1 font-medium">Price</p>
                <p className="col-span-1 font-medium">Quantity</p>
              </div>
              {data.products.map((product: Product) => (
                <div key={product.productId} className="grid grid-cols-4">
                  <p className="col-span-2 my-2 text-sm">
                    <Link
                      target="_blank"
                      href={`https://ecommercely.vercel.app/product/${product.productId}`}
                    >
                      {product.name}
                    </Link>
                  </p>
                  <p className="col-span-1 my-2 text-sm">₹{product.price}</p>
                  <p className="col-span-1 my-2 text-sm">{product.quantity}</p>
                </div>
              ))}
              <div className="grid grid-cols-4 mt-4 mb-2">
                <p className="col-span-2 font-medium">
                  Total Price And Quantity
                </p>
                <p className="col-span-1 font-medium">
                  ₹{data.products.reduce((sum, b) => sum + b.price, 0)}
                </p>
                <p className="col-span-1 font-medium">
                  {" "}
                  {data.products.reduce((sum, b) => sum + b.quantity, 0)}
                </p>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Order;
