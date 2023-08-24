"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type Product = {
  id: String;
  product_name: String;
  product_description: String;
  price: Number;
  quantity: Number;
  image: String;
  createdAt: String;
  updatedAt: String;
  category: String;
  featured: Boolean;
  visible: Boolean;
  Category: {};
};

type CategoryData = {
  id: String;
  name: String;
};

type FormateProduct = {
  name: String;
  featured: Number;
  published: Number;
  totalProduct: Number;
  stock: Number;
};

const Product = () => {
  const navigate = useRouter();
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [data, setData] = useState<FormateProduct[]>([]);
  const [dataFetched, setDataFetched] = useState(false);

  const getCategoryData = async (): Promise<void> => {
    toast.loading("Loading Data");
    try {
      const resp = await axios.post("/api/category/get");
      setCategoryData(resp.data);
      getProductData(resp.data);
    } catch (error: any) {
      setCategoryData([]);
      setDataFetched(true);
      toast.dismiss();
      toast.error("Error! [Cart Data Fetch]");
    }
  };

  const getProductData = async (
    categoryData: [
      {
        id: String;
        name: String;
      }
    ]
  ): Promise<void> => {
    try {
      const resp = await axios.post("/api/product/getproducts");
      let formattedData: FormateProduct[] = [];

      for (let i = 0; i < categoryData.length; i++) {
        const element = categoryData[i];
        const totalQuantity = resp.data.reduce(
          (total: number, product: Product) =>
            total +
            (element.id === product.category ? Number(product.quantity) : 0),
          0
        );
        const totalProduct = resp.data.reduce(
          (total: Number, product: Product) =>
            Number(total) + (element.id === product.category ? 1 : 0),
          0
        );
        const featuredProduct = resp.data.reduce(
          (total: Number, product: Product) =>
            Number(total) +
            (product.featured === true && element.id === product.category
              ? 1
              : 0),
          0
        );
        const visibleProduct = resp.data.reduce(
          (total: Number, product: Product) =>
            Number(total) +
            (product.visible === true && element.id === product.category
              ? 1
              : 0),
          0
        );

        formattedData.push({
          name: element.name,
          featured: featuredProduct,
          published: visibleProduct,
          totalProduct,
          stock: totalQuantity,
        });
      }
      setData(formattedData);
      setDataFetched(true);
      toast.dismiss();
    } catch (error: any) {
      setDataFetched(true);
      toast.dismiss();
      toast.error("Error! [Product Data Fetch]");
    }
  };

  useEffect(() => {
    if (!dataFetched) {
      getCategoryData();
    }
  }, [dataFetched]);

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
