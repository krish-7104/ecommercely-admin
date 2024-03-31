"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import PageTitle from "@/components/page-title";
import { Users2 } from "lucide-react";

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
    <section className="w-full mx-auto h-[100vh] bg-[#fff]">
      <PageTitle title={"Users"} icon={<Users2 className="mr-2" />} />
      <div className="overflow-x-auto w-[96%] mx-auto my-4 container">
        {userData.length !== 0 && userData && (
          <DataTable columns={columns} data={userData} />
        )}
        {userData.length === 0 && (
          <DataTable columns={columns} data={userData} />
        )}
      </div>
    </section>
  );
};

export default Users;
