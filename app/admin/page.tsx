"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type AdminType = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

const Admin = () => {
  const navigate = useRouter();
  const [data, setData] = useState<AdminType[]>([]);
  const [dataFetched, setDataFetched] = useState(false);

  const getAdminData = async (): Promise<void> => {
    toast.loading("Loading Data");
    try {
      const resp = await axios.post("/api/auth/getadmins");
      let formattedData: AdminType[] = [];
      resp.data.forEach((item: AdminType) => {
        let updatedAtNew = new Date(item.updatedAt);
        let createdAtNew = new Date(item.createdAt);
        let data: AdminType = {
          ...item,
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
        };
        formattedData.push(data);
      });
      setData(formattedData);
      toast.dismiss();
    } catch (error: any) {
      setData([]);
      toast.dismiss();
      toast.error("Error! [Admin Data Fetch]");
    }
  };

  useEffect(() => {
    if (!dataFetched) {
      getAdminData();
    }
  }, [dataFetched]);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Admin;
