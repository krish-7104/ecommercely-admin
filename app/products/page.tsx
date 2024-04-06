"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import PageTitle from "@/components/page-title";
import { ShoppingBag, ArrowRight, Expand, Plus } from "lucide-react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { addLogHandler } from "@/helper/AddLog";
import { useSelector } from "react-redux";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

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
  const [selected, setSelected] = useState();
  const [data, setData] = useState<Products[]>([]);
  const [dataFetched, setDataFetched] = useState(false);
  const userData = useSelector((state: any) => state?.userData);
  const getData = async (): Promise<void> => {
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
  };

  useEffect(() => {
    if (!dataFetched) {
      getData();
    }
  }, [dataFetched]);

  const updateData = async (
    id: string,
    type: any,
    value: Boolean,
    name: string
  ) => {
    toast.loading("Uploading Data");
    try {
      const resp = await axios.put(`/api/product/updateproduct/${id}`, {
        [type]: value,
      });
      await addLogHandler({
        type: "Product",
        message: `Product Updated: ${type} - ${value} (${name})`,
        userId: userData?.userId,
      });
      console.log(`Product Updated: ${type} - ${value} (${name})`);
      getData();
      toast.dismiss();
    } catch (error: any) {
      toast.dismiss();
      toast.error("Something Went Wrong!");
    }
  };

  const [access, setAccess] = useState(false);
  useEffect(() => {
    if (userData.email === "test@admin.com") {
      toast.dismiss();
      setAccess(false);
    } else {
      setAccess(true);
    }
  }, [userData]);

  return (
    <section className="w-full min-h-[100vh] bg-white">
      <PageTitle
        title={"Products"}
        icon={<ShoppingBag className="mr-2" size={20} />}
        action={
          access && (
            <div
              className="flex justify-center items-center cursor-pointer bg-[#e4e4e5] rounded-xl text-[#15161b] px-4 py-2 border-2 border-[#e4e4e5] hover:border-[#15161b]"
              onClick={() => navigate.push("/products/addproduct")}
            >
              <Plus size={20} />
              <p className="ml-2 text-sm">Add Product</p>
            </div>
          )
        }
      />
      <section className="w-[92%] mx-auto my-6">
        <ul className="bg-[#f6f6f6] rounded-lg p-3 grid grid-cols-7 mb-3 border border-black sticky top-20 z-20">
          <li className="font-medium text-center">Image</li>
          <li className="font-medium text-center">Price</li>
          <li className="font-medium text-center">Stock</li>
          <li className="font-medium text-center">Category</li>
          <li className="font-medium text-center">Published</li>
          <li className="font-medium text-center">Featured</li>
          <li className="font-medium text-center"></li>
        </ul>
        {data &&
          data.map((item) => (
            <div
              key={item.id}
              className="bg-[#fff] p-2 grid grid-cols-7 border-b place-items-center cursor-pointer group"
            >
              {item.image && (
                <Image
                  src={item.image}
                  alt="product image"
                  width={100}
                  height={100}
                  className="rounded-xl mx-auto object-contain"
                />
              )}
              <p className="font-medium text-center text-black/80 text-sm">
                ₹{item.price}
              </p>
              <p className="font-medium text-center text-black/80 text-sm">
                {item.quantity}
              </p>
              <p className="font-medium text-center text-black/80 text-sm">
                {item.Category.name}
              </p>
              <p
                className="font-medium text-center text-black/80 text-sm"
                onClick={() =>
                  updateData(
                    item.id,
                    "visible",
                    !item.visible,
                    item.product_name
                  )
                }
              >
                <Switch id="airplane-mode" checked={item.visible} />
              </p>
              <p className="font-medium text-center text-black/80 text-sm">
                <Switch
                  id="airplane-mode"
                  checked={item.featured}
                  onClick={() =>
                    updateData(
                      item.id,
                      "featured",
                      !item.featured,
                      item.product_name
                    )
                  }
                />
              </p>
              <Expand
                size={20}
                onClick={() =>
                  navigate.push(`/products/updateproduct/${item.id}`)
                }
              />
            </div>
          ))}
      </section>
    </section>
  );
};

export default Product;
