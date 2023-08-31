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
      let formattedData: UserData[] = [];
      resp.data.forEach((item: UserData) => {
        let createdAtNew = new Date(item.createdAt);
        let updatedAtNew = new Date(item.updatedAt);
        let data: UserData = {
          ...item,
          createdAt: createdAtNew
            .toLocaleString("en-US", {
              timeZone: "Asia/Kolkata",
              day: "numeric",
              month: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
            })
            .replace(" GMT+5:30", ""),
          updatedAt: updatedAtNew
            .toLocaleString("en-US", {
              timeZone: "Asia/Kolkata",
              day: "numeric",
              month: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
            })
            .replace(" GMT+5:30", ""),
        };
        formattedData.push(data);
      });
      setUserData(formattedData);
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
