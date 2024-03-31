import { Loader2 } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="h-[100vh] w-full flex justify-center items-center flex-col">
      <Loader2 className="animate-spin" />
    </div>
  );
};

export default Loading;
