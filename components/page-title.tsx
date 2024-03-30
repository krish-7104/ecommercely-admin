import { Activity } from "lucide-react";
import React, { ReactElement } from "react";

const PageTitle = ({ title, icon }: { title: String; icon: ReactElement }) => {
  return (
    <div className="w-full bg-[#f6f6f6] sticky p-4 top-0 rounded-br-2xl shadow-md">
      <p className="font-bold text-2xl flex justify-start items-center w-[92%] mx-auto">
        {icon} {title}
      </p>
    </div>
  );
};
export default PageTitle;
