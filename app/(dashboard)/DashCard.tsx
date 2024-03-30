import React from "react";
import { TiArrowSortedDown, TiArrowSortedUp, TiEquals } from "react-icons/ti";

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
    <div className="p-4 flex flex-col justify-between items-start bg-[#fff] shadow rounded-xl w-full">
      <p className="font-normal text-slate-500 text-sm">{data.title}</p>
      <p className="font-semibold text-xl my-2">{data.data}</p>
      <div className="flex justify-between items-center w-full mt-1">
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
            <TiArrowSortedUp className="mr-1" size={20} />
          ) : data.type === "negative" ? (
            <TiArrowSortedDown className="mr-1" size={20} />
          ) : (
            <TiEquals className="mr-1" size={14} />
          )}
          {data.percentage.toFixed(2)}%
        </p>
      </div>
    </div>
  );
};

export default DashCard;
