"use client";
import {
  ActivityIcon,
  Home,
  Settings,
  ShoppingBag,
  Truck,
  UserCog,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = () => {
  const pathname = usePathname();
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
  return (
    <main className="bg-[#15161b] w-[20%] h-[100vh] py-6 pl-4 pr-6 rounded-r-2xl">
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
    </main>
  );
};

export default Sidebar;
