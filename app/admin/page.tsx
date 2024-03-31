"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { InitialState } from "@/redux/types";
import PageTitle from "@/components/page-title";
import { UserCog, UserPlus2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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
  }, [dataFetched, access]);

  return (
    <section className="w-full mx-auto h-[100vh] bg-[#fff]">
      <PageTitle title={"Admin"} icon={<UserCog className="mr-2" />} />
      <div className="overflow-x-auto w-[96%] mx-auto my-4 container">
        {access && <DataTable columns={columns} data={data} />}
        {!access && (
          <p className="mt-10 text-center">
            You Don&apos;t Have Access To This Page.
          </p>
        )}
        {access && (
          <button
            className="bg-red-500 hover:bg-red-600 text-white p-4 flex justify-center items-center rounded-2xl absolute bottom-8 right-8"
            onClick={() => router.push("/admin/addadmin")}
          >
            <UserPlus2 />
          </button>
        )}
      </div>
    </section>
  );
};

export default Admin;
