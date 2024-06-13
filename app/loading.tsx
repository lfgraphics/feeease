import React from "react";
import Image from "next/image";
import { Loader } from "lucide-react";

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* <Image src="/logo-horizontal.png" alt="Loading" width={200} height={50} /> */}
      <div className="mt-4 flex items-center justify-center">
        <Loader className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    </div>
  );
};

export default Loading;
