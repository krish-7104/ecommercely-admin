"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { InitialState } from "@/redux/types";

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
  const [access, setAccess] = useState(false);
  const userData = useSelector((state: InitialState) => state.userData);
  useEffect(() => {
    if (userData.email === "test@admin.com") {
      toast.dismiss();
      toast.error("Access Denied!");
      setAccess(false);
    } else {
      setAccess(true);
    }
  }, [userData]);

  const getAdminData = async (): Promise<void> => {
    if (access) {
      toast.loading("Loading Data");
      try {
        const resp = await axios.post("/api/auth/getadmins");
        setData(resp.data);
        toast.dismiss();
      } catch (error: any) {
        setData([]);
        toast.dismiss();
        toast.error("Error! [Admin Data Fetch]");
      }
    }
  };

  useEffect(() => {
    if (!dataFetched) {
      getAdminData();
    }
  }, [dataFetched]);

  return (
    <div className="container mx-auto py-10">
      {access && <DataTable columns={columns} data={data} />}
      {!access && (
        <p className="mt-10 text-center">
          You Don&apos;t Have Access To This Page.
        </p>
      )}
    </div>
  );
};

export default Admin;
