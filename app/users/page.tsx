"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export type Products = {
  id: string;
  product_name: string;
  price: Number;
  quantity: Number;
  category: string;
  visible: Boolean;
  featured: Boolean;
};

type UserData = {
  id: string;
  name: string;
  email: string;
  phoneno: string;
  address: string;
  pincode: string;
  state: string;
  city: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  carts: Cart;
  orders: string;
};

type Cart = {
  name: String;
  id: String;
  products: Products[];
};

const Users = () => {
  const navigate = useRouter();
  const [dataFetched, setDataFetched] = useState(false);
  const [userData, setUserData] = useState<UserData[]>([]);
  const getUserData = async (): Promise<void> => {
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
      getUserData();
    }
  }, [dataFetched]);

  return (
    <div className="container mx-auto py-10">
      {userData.length !== 0 && userData && (
        <DataTable columns={columns} data={userData} />
      )}
      {userData.length === 0 && <DataTable columns={columns} data={userData} />}
    </div>
  );
};

export default Users;
