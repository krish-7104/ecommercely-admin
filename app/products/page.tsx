"use client";
import axios from "axios";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import PageTitle from "@/components/page-title";
import { ShoppingBag, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";

export type Products = {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
  category: string;
  visible: boolean;
  featured: boolean;
  image: string;
  product_description: string;
  Category: {
    name: string;
  };
};
const Product = () => {
  const navigate = useRouter();
  const [data, setData] = useState<Products[]>([]);
  const [dataFetched, setDataFetched] = useState(false);
  const userData = useSelector((state: any) => state?.userData);
  
  const getData = useCallback(async (): Promise<void> => {
    toast.loading("Loading Data");
    try {
      const resp = await axios.post("/api/product/getproducts");
      setData(resp.data);
      setDataFetched(true);
      toast.dismiss();
    } catch (error: any) {
      setData([]);
      setDataFetched(true);
      toast.dismiss();
      toast.error("Something Went Wrong!");
    }
  }, []);

  useEffect(() => {
    if (!dataFetched) {
      getData();
    }
  }, [dataFetched, getData]);

  const [access, setAccess] = useState(false);
  useEffect(() => {
    if (userData.email === "test@admin.com") {
      toast.dismiss();
      setAccess(false);
    } else {
      setAccess(true);
    }
  }, [userData]);

  const columns = useMemo(
    () => createColumns(navigate.push),
    [navigate.push]
  );

  return (
    <section className="w-full min-h-[100vh] bg-white">
      {access ? (
        <PageTitle
          title={"Products"}
          icon={<ShoppingBag className="mr-2" size={20} />}
          action={
            <div
              className="flex justify-center items-center cursor-pointer bg-[#e4e4e5] rounded-xl text-[#15161b] px-4 py-2 border-2 border-[#e4e4e5] hover:border-[#15161b]"
              onClick={() => navigate.push("/products/addproduct")}
            >
              <Plus size={20} />
              <p className="ml-2 text-sm">Add Product</p>
            </div>
          }
        />
      ) : (
        <PageTitle
          title={"Products"}
          icon={<ShoppingBag className="mr-2" size={20} />}
        />
      )}
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </section>
  );
};

export default Product;
