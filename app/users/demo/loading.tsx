import React from "react";
import Image from "next/image";
import { Loader } from "lucide-react";

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="mt-4 flex items-center justify-center">
        <Loader size={48} className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    </div>
  );
};

export default Loading;
