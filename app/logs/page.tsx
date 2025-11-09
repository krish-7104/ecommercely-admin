"use client";
import PageTitle from "@/components/page-title";
import dateFormaterHandler from "@/helper/DataFormatter";
import axios from "axios";
import { Activity } from "lucide-react";
import React, { useEffect, useState } from "react";

type Log = {
  type: string;
  message: string;
  id: string;
  createdAt: string;
  before?: any;
  after?: any;
};

const Logs = () => {
  const [logs, setLogs] = useState<Log[]>([]);

  const getLogData = async () => {
    const { data } = await axios.get("/api/logs/getlogs");
    setLogs(data);
  };

  useEffect(() => {
    getLogData();
  }, []);

  return (
    <section className="w-full mx-auto h-[100vh] overflow-y-scroll bg-[#f6f6f6]">
      <div className="w-full">
        <PageTitle title={"Log Changes"} icon={<Activity className="mr-2" />} />
        <div className="mt-4">
          {logs.map((item: Log) => (
            <div
              key={item.id}
              className="bg-white rounded-md border px-6 py-4 mb-4 w-[92%] mx-auto"
            >
              <p className="text-xs float-right inline-block text-right font-semibold bg-[#f6f6f6] px-3 py-1 rounded-full">
                {item.type}
              </p>
              <p className="font-medium text-sm w-[90%]">{item.message}</p>
              <p className="text-xs mt-1">
                {dateFormaterHandler(item.createdAt)}
              </p>
              {(item.before || item.after) && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {item.before && (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <p className="text-xs font-semibold text-red-700 mb-2">Before:</p>
                      <pre className="text-xs overflow-auto max-h-40">
                        {JSON.stringify(item.before, null, 2)}
                      </pre>
                    </div>
                  )}
                  {item.after && (
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <p className="text-xs font-semibold text-green-700 mb-2">After:</p>
                      <pre className="text-xs overflow-auto max-h-40">
                        {JSON.stringify(item.after, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Logs;
