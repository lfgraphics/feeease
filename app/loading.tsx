import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="mt-4 flex items-center justify-center">
        <Loader className="animate-spin h-8 w-8 text-foreground" />
      </div>
    </div>
  );
};

export default Loading;
