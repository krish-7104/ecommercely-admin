"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import PageTitle from "@/components/page-title";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { GoArrowUpRight } from "react-icons/go";

export type Products = {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
  category: string;
  visible: boolean;
  featured: boolean;
  image: string;
  Category: {
    name: string;
  };
};
const Product = () => {
  const navigate = useRouter();
  const [data, setData] = useState<Products[]>([]);
  const [dataFetched, setDataFetched] = useState(false);

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

  return (
    <section className="w-full min-h-[100vh] bg-white">
      <PageTitle
        title={"Products"}
        icon={<ShoppingBag className="mr-2" size={20} />}
      />
      <section className="w-[92%] mx-auto my-6">
        <ul className="bg-[#f6f6f6] rounded-lg p-3 grid grid-cols-7 mb-3">
          <li className="font-medium text-center">Image</li>
          <li className="font-medium text-center">Price</li>
          <li className="font-medium text-center">Stock</li>
          <li className="font-medium text-center">Category</li>
          <li className="font-medium text-center">Published</li>
          <li className="font-medium text-center">Featured</li>
          <li className="font-medium text-center">Actions</li>
        </ul>
        {data &&
          data.map((item) => (
            <div
              key={item.id}
              className="bg-[#fff] p-2 grid grid-cols-7 border-b place-items-center cursor-pointer group"
            >
              <Image
                src={item.image}
                alt="product image"
                width={100}
                height={100}
                className="rounded-xl mx-auto object-contain"
              />
              <p className="font-medium text-center text-black/80">
                ₹{item.price}
              </p>
              <p className="font-medium text-center text-black/80">
                {item.quantity}
              </p>
              <p className="font-medium text-center text-black/80">
                {item.Category.name}
              </p>
              <p className="font-medium text-center text-black/80">
                <Switch id="airplane-mode" checked={item.visible} />
              </p>
              <p className="font-medium text-center text-black/80">
                <Switch id="airplane-mode" checked={item.featured} />
              </p>
              <p className="font-medium text-center text-black/80"></p>
            </div>
          ))}
      </section>
    </section>
  );
};

export default Product;
