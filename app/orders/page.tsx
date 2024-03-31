"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Truck } from "lucide-react";
import PageTitle from "@/components/page-title";
import { columns } from "./columns";

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
    <section className="w-full mx-auto h-[100vh] bg-[#fff]">
      <PageTitle title={"Orders"} icon={<Truck className="mr-2" />} />
      <div className="overflow-x-hidden w-[96%] mx-auto my-4 container">
        {data.length !== 0 && data && (
          <DataTable columns={columns} data={data} />
        )}
      </div>
    </section>
  );
};

export default Product;
