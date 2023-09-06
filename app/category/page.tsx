"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type Product = {
  id: string;
  product_name: string;
  product_description: string;
  price: Number;
  quantity: Number;
  image: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  featured: Boolean;
  visible: Boolean;
  Category: {};
};

type CategoryData = {
  id: string;
  name: string;
};

type FormateProduct = {
  name: string;
  featured: Number;
  published: Number;
  totalProduct: Number;
  stock: Number;
  id: string;
};

const Product = () => {
  const navigate = useRouter();
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [data, setData] = useState<FormateProduct[]>([]);
  const [dataFetched, setDataFetched] = useState(false);
  const config = {
    headers: {
      "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
    },
  };
  const getCategoryData = async (): Promise<void> => {
    toast.loading("Loading Data");
    try {
      const resp = await axios.post("/api/category/getcategory", config);
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
        id: string;
        name: string;
      }
    ]
  ): Promise<void> => {
    try {
      const resp = await axios.post("/api/product/getproducts", config);
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
          id: element.id,
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
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Product;
