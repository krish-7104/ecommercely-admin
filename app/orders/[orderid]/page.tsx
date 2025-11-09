"use client";
import PageTitle from "@/components/page-title";
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
import { ArrowLeft, Truck, Calendar, User, Mail, Phone, MapPin, Package } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dateFormaterHandler from "@/helper/DataFormatter";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrderData = async () => {
      try {
        setLoading(true);
        toast.loading("Loading order details...");
        const resp = await axios.get(`/api/order/${param.orderid}`);
        setData(resp.data);
        toast.dismiss();
      } catch (error: any) {
        toast.dismiss();
        toast.error("Failed to load order details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (param.orderid) {
      getOrderData();
    }
  }, [param.orderid]);

  const updateStatushandler = async (value: string) => {
    if (!data) return;
    
    const previousStatus = data.status;
    setData({ ...data, status: value });
    toast.loading("Updating Status");
    try {
      await axios.put(`/api/order/updateorder/${param.orderid}`, {
        status: value,
      });
      await addLogHandler({
        type: "Order",
        message: `Order Updated: Status - ${previousStatus} → ${value} (${data.id})`,
        userId: userData.userId,
      });
      toast.dismiss();
      toast.success("Status Updated Successfully");
    } catch (error) {
      setData({ ...data, status: previousStatus });
      toast.dismiss();
      console.log(error);
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      Shipping: "bg-blue-100 text-blue-800 border-blue-300",
      Delivered: "bg-green-100 text-green-800 border-green-300",
      Cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  if (loading) {
    return (
      <div className="h-[100vh] w-full flex justify-center items-center flex-col bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-600">Loading order details...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-[100vh] w-full flex justify-center items-center flex-col bg-white">
        <p className="text-gray-600">Order not found</p>
        <Button onClick={() => router.push("/orders")} className="mt-4">
          Back to Orders
        </Button>
      </div>
    );
  }

  const totalPrice = data.products.reduce((sum, product) => sum + product.price * product.quantity, 0);
  const totalQuantity = data.products.reduce((sum, product) => sum + product.quantity, 0);

  return (
    <main className="w-full min-h-[100vh] bg-white">
      <PageTitle
        title={"Order Details"}
        icon={<Truck className="mr-2" />}
        action={
          <Button
            onClick={() => router.push("/orders")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </Button>
        }
      />
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Items
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {data.products.length} item{data.products.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-xs font-mono text-gray-700">{data.id}</p>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.products.map((product: Product) => (
                    <TableRow key={product.productId}>
                      <TableCell>
                        <Link
                          target="_blank"
                          href={`https://ecommercely.vercel.app/product/${product.productId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">
                          Category: {product.category}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">₹{product.price}</TableCell>
                      <TableCell className="text-right">{product.quantity}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{product.price * product.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold">
                    <TableCell colSpan={3} className="text-right">
                      Total
                    </TableCell>
                    <TableCell className="text-right text-green-700">
                      ₹{totalPrice}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Order Status
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Current Status
                  </label>
                  <Select onValueChange={updateStatushandler} value={data.status}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Shipping">Shipping</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        data.status
                      )}`}
                    >
                      {data.status}
                    </span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Order Date:</span>
                  </div>
                  <p className="text-sm">{dateFormaterHandler(data.createdAt)}</p>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Total Amount</span>
                    <span className="text-2xl font-bold text-green-700">₹{totalPrice}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Total Items</span>
                    <span className="font-medium">{totalQuantity}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <User className="h-4 w-4" />
                    <span className="font-medium">Name</span>
                  </div>
                  <p className="text-sm">{data.user.name}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Mail className="h-4 w-4" />
                    <span className="font-medium">Email</span>
                  </div>
                  <p className="text-sm break-all">{data.user.email}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">Phone</span>
                  </div>
                  <p className="text-sm">{data.user.phoneno}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">Address</span>
                  </div>
                  <p className="text-sm">
                    {data.user.address}
                    <br />
                    {data.user.city}, {data.user.state}
                    <br />
                    {data.user.country} - {data.user.pincode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Order;
