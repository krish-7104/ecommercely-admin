"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export type Products = {
  id: string;
  product_name: string;
  price: Number;
  quantity: Number;
  category: String;
  visible: Boolean;
  featured: Boolean;
};

type UserData = {
  id: String;
  name: String;
  email: String;
  phoneno: String;
  address: String;
  pincode: String;
  state: String;
  city: String;
  country: String;
  createdAt: String;
  updatedAt: String;
  carts: Cart;
  orders: String;
};

type Cart = {
  name: String;
  id: String;
  products: Products[];
};

const Users = () => {
  const navigate = useRouter();
  const [dataFetched, setDataFetched] = useState(false);
  const [userData, setUserData] = useState([]);
  const getCategoryData = async (): Promise<void> => {
    toast.loading("Loading Data");
    try {
      const resp = await axios.post("/api/user/getUsers");
      setUserData(resp.data);
      toast.dismiss();
    } catch (error: any) {
      setUserData([]);
      setDataFetched(true);
      toast.dismiss();
      toast.error("Error! [User Data Fetch]");
    }
  };

  useEffect(() => {
    if (!dataFetched) {
      getCategoryData();
    }
  }, [dataFetched]);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={userData} />
    </div>
  );
};

export default Users;
