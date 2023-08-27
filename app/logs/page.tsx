"use client";
import axios from "axios";
import { ActivitySquare } from "lucide-react";
import React, { useEffect, useState } from "react";

type Log = {
  type: string;
  message: string;
  id: string;
  createdAt: string;
};

const Logs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const getLogData = async () => {
    const { data } = await axios.get("/api/logs/getlogs");
    let formattedData: Log[] = [];
    data.forEach((item: Log) => {
      let createdAtNew = new Date(item.createdAt);
      let data = {
        ...item,
        createdAt: createdAtNew
          .toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
          })
          .replace(" GMT+5:30", ""),
      };
      formattedData.push(data);
    });
    setLogs(formattedData);
  };
  useEffect(() => {
    getLogData();
  }, []);
  return (
    <section className="w-full">
      <section className="w-[92%] mx-auto my-6">
        <p className="font-bold text-2xl mb-4 flex justify-start items-center">
          <ActivitySquare className="mr-2" /> Changes Log
        </p>
        {logs &&
          logs.map((item: any) => (
            <div
              key={item.id}
              className="bg-white rounded-md shadow-md border px-6 py-4 mb-4"
            >
              <p className="text-xs float-right inline-block text-right font-semibold bg-green-400 px-3 py-1 rounded-full">
                {item.type}
              </p>
              <p className="font-medium">{item.message}</p>
              <p className="text-sm mt-1">{item.createdAt}</p>
            </div>
          ))}
      </section>
    </section>
  );
};

export default Logs;
