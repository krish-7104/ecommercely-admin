import { Loader2 } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="h-[100vh] w-full flex justify-center items-center flex-col bg-white">
      <Loader2 className="animate-spin" size={40} />
      <p className="mt-4 text-gray-600">Loading add product page...</p>
    </div>
  );
};

export default Loading;

