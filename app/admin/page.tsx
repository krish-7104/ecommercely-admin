"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { toast } from "react-hot-toast";

type AdminType = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

const Admin = () => {
  const [data, setData] = useState<AdminType[]>([]);
  const [dataFetched, setDataFetched] = useState(false);
  const config = {
    headers: {
      "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
    },
  };
  const getAdminData = async (): Promise<void> => {
    toast.loading("Loading Data");
    try {
      const resp = await axios.post("/api/auth/getadmins", config);
      setData(resp.data);
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
