"use client";
import { Button } from "@/components/ui/button";
import { InitialState } from "@/redux/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import dateFormaterHandler from "@/helper/DataFormatter";
import PageTitle from "@/components/page-title";
import { Settings as SettingIcon } from "lucide-react";
import { removeUserHandler } from "@/redux/actions";

const Settings = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    email: "",
    id: "",
    updatedAt: "",
    createdAt: "",
  });
  const userData = useSelector((state: InitialState) => state.userData);
  const [access, setAccess] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (userData.email === "test@admin.com") {
      toast.dismiss();
      toast.error("Access Denied!");
      setAccess(false);
    } else {
      setAccess(true);
    }
  }, [userData]);

  useEffect(() => {
    const getUserData = async () => {
      const { data } = await axios.get("/api/auth/profile/" + userData.userId);
      setUser(data.user);
    };
    userData.userId && getUserData();
  }, [userData]);

  const resetPasswordHandler = async () => {
    toast.loading("Initiating Password Reset..");
    try {
      const resp = await axios.post("/api/auth/forget", { email: user.email });
      toast.dismiss();
      toast.success("Password Reset Link Send On Your Email");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message);
    }
  };
  const logoutHandler = async () => {
    toast.loading("Initiating Logout..");
    try {
      await axios.get("/api/auth/logout");
      toast.dismiss();
      dispatch(removeUserHandler());
      router.replace("/login");
      toast.success("Logout Successfull");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message);
    }
  };
  return (
    <main className="flex w-full justify-center items-center flex-col">
      <PageTitle title={"Settings"} icon={<SettingIcon className="mr-2" />} />
      {access && (
        <section className="w-[95%] my-4">
          <section className="w-full mx-auto">
            {user.name !== "" && (
              <div className="p-4">
                <div className="flex justify-between items-baseline">
                  <p className="md:text-xl font-semibold">User Profile</p>
                </div>
                <div className="border-b pb-4">
                  <p className="my-2 text-sm md:text-base">Name: {user.name}</p>
                  <p className="my-2 text-sm md:text-base">
                    Email: {user.email}
                  </p>
                  <p className="my-2 text-sm md:text-base">
                    Registered On: {dateFormaterHandler(user.createdAt)}
                  </p>
                  <p className="my-2 text-sm md:text-base">
                    Updated On: {dateFormaterHandler(user.updatedAt)}
                  </p>
                </div>
                <div className="mt-6 flex justify-center items-start flex-col">
                  <Button
                    size={"lg"}
                    className="mb-4"
                    onClick={resetPasswordHandler}
                  >
                    Change Password
                  </Button>
                  <Button
                    variant={"destructive"}
                    size={"lg"}
                    onClick={logoutHandler}
                  >
                    Account Logout
                  </Button>
                </div>
              </div>
            )}
          </section>
        </section>
      )}
      {!access && (
        <p className="mt-10">You Don&apos;t Have Access To This Page.</p>
      )}
    </main>
  );
};

export default Settings;
