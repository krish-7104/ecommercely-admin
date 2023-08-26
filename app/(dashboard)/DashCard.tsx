import { Activity, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

type DashCardData = {
  data: {
    title: string;
    data: number;
    type: string;
    today: number;
    percentage: number;
  };
};

const DashCard = ({ data }: DashCardData) => {
  return (
    <div className="p-4 flex w-[15%] flex-col justify-between items-start bg-white shadow-md border rounded-md mr-6">
      <p className="font-semibold text-slate-500 text-sm">{data.title}</p>
      <p className="font-semibold text-lg my-1">{data.data}</p>
      <div className="flex justify-between items-center w-full">
        <p className="font-medium text-sm text-slate-500">{data.today}</p>
        <p
          className={`font-medium text-sm ${
            data.type === "positive"
              ? "text-green-500"
              : data.type === "negative"
              ? "text-red-500"
              : "text-indigo-500"
          } flex justify-center items-center`}
        >
          {data.type === "positive" ? (
            <TrendingUp className="mr-1" size={20} />
          ) : data.type === "negative" ? (
            <TrendingDown className="mr-1" size={20} />
          ) : (
            <Activity className="mr-1" size={14} />
          )}
          {data.percentage}%
        </p>
      </div>
    </div>
  );
};

export default DashCard;
