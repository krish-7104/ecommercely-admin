"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Products, columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const Product = () => {
  const navigate = useRouter();
  const [data, setData] = useState<Products[]>([]);
  const [dataFetched, setDataFetched] = useState(false);

  const getData = async (): Promise<void> => {
    try {
      const resp = await axios.post("/api/product/getproducts");
      setData(resp.data);
      setDataFetched(true);
    } catch (error: any) {
      setData([]);
      setDataFetched(true);
    }
  };

  useEffect(() => {
    if (!dataFetched) {
      getData();
    }
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-end items-center mb-4">
        <Button onClick={() => navigate.push("/products/addproduct")}>
          Add Product <Plus className="h-4 w-4 ml-2" />
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Product;
