"use client";
import { removeUserHandler, setUserHandler } from "@/redux/actions";
import axios from "axios";
import {
  ActivityIcon,
  Home,
  LogOut,
  Settings,
  ShoppingBag,
  Truck,
  UserCog,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  useEffect(() => {
    const getUserTokenData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          router.replace("/login");
        }
        const resp = await axios.post("/api/auth/user", { data: { token } });
        dispatch(setUserHandler(resp.data.user));
      } catch (error: any) {
        localStorage.clear();
        !(
          pathname.includes("login") ||
          pathname.includes("reset-password") ||
          pathname.includes("verify-token")
        ) && router.replace("/login");
      }
    };
    !(
      pathname.includes("login") ||
      pathname.includes("reset-password") ||
      pathname.includes("verify-token")
    ) && getUserTokenData();
  }, [dispatch, pathname, router]);

  const navbarMenu = [
    {
      id: 1,
      title: "Home",
      route: "/",
      icon: <Home className="mr-3" size={20} />,
    },
    {
      id: 2,
      title: "Products",
      route: "/products",
      icon: <ShoppingBag className="mr-3" size={20} />,
    },
    {
      id: 3,
      title: "Orders",
      route: "/orders",
      icon: <Truck className="mr-3" size={20} />,
    },
    {
      id: 4,
      title: "Users",
      route: "/users",
      icon: <Users2 className="mr-3" size={20} />,
    },
    {
      id: 5,
      title: "Admin",
      route: "/admin",
      icon: <UserCog className="mr-3" size={20} />,
    },
    {
      id: 6,
      title: "Logs",
      route: "/logs",
      icon: <ActivityIcon className="mr-3" size={20} />,
    },
    {
      id: 7,
      title: "Settings",
      route: "/settings",
      icon: <Settings className="mr-3" size={20} />,
    },
  ];

  const logoutHandler = async () => {
    toast.loading("Initiating Logout..");
    try {
      toast.dismiss();
      dispatch(removeUserHandler());
      router.replace("/login");
      localStorage.clear();
      toast.success("Logout Successfull");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message);
    }
  };

  return (
    <>
      {!(
        pathname.includes("login") ||
        pathname.includes("reset-password") ||
        pathname.includes("verify-token")
      ) && (
        <main className="bg-[#15161b] w-[20%] h-[100vh] py-6 pl-4 pr-6 rounded-r-2xl overflow-hidden">
          <div className="mt-2 mb-6">
            <p className="text-slate-200 text-lg font-semibold">
              Ecommercely Admin
            </p>
          </div>
          <ul className="">
            {navbarMenu.map((item) => {
              return (
                <Link
                  href={item.route}
                  key={"menu" + item.id}
                  className={`my-3 py-2 px-2 w-full cursor-pointer rounded-md flex justify-start items-center ${
                    pathname === item.route
                      ? "text-gray-100 bg-[#1e1f24]"
                      : "hover:text-gray-200 text-gray-500"
                  }`}
                >
                  {item.icon} {item.title}
                </Link>
              );
            })}
          </ul>
          <div
            className={`my-3 py-2 px-2 cursor-pointer rounded-md flex justify-start items-center hover:text-gray-200 text-gray-500 absolute bottom-1`}
            onClick={logoutHandler}
          >
            <LogOut className="mr-3" size={20} />
            Logout
          </div>
        </main>
      )}
    </>
  );
};

export default Sidebar;
