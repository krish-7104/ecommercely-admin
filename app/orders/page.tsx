"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { columns } from "../orders/columns";
import { DataTable } from "./data-table";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export type FormateProduct = {
  id: string;
  userId: string;
  products: {
    name: string;
    price: number;
    category: string;
    quantity: number;
    productid: string;
  };
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    email: string;
  };
};

const Product = () => {
  const navigate = useRouter();
  const [data, setData] = useState<FormateProduct[]>([]);
  const [dataFetched, setDataFetched] = useState(false);

  const getOrderData = async (): Promise<void> => {
    toast.loading("Loading Data");
    try {
      const resp = await axios.post("/api/order/getorders");
      setData(resp.data);
      setDataFetched(true);
      toast.dismiss();
    } catch (error: any) {
      setDataFetched(true);
      toast.dismiss();
      toast.error("Error! [Order Data Fetch]");
    }
  };

  useEffect(() => {
    if (!dataFetched) {
      getOrderData();
    }
  }, [dataFetched]);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Product;
