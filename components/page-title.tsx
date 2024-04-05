import React, { ReactElement } from "react";

const PageTitle = ({
  title,
  icon,
  action,
}: {
  title: String;
  icon: ReactElement;
  action?: ReactElement;
}) => {
  return (
    <div className="w-full bg-[#f6f6f6] sticky p-4 top-0 rounded-br-2xl shadow-md">
      <div className="w-[92%] mx-auto justify-between flex">
        <p className="font-bold text-2xl flex justify-start items-center">
          {icon} {title}
        </p>
        {action}
      </div>
    </div>
  );
};
export default PageTitle;
