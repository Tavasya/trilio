import { Upload, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full px-6">
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-normal text-gray-900 text-center">
          What would you like to do on LinkedIn today?
        </h1>
        
        <div className="w-[50vw] min-w-[320px] max-w-[600px] mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
            <textarea
              placeholder="Write a post about product launch..."
              className="w-full outline-none text-gray-700 placeholder:text-gray-400 placeholder:font-normal placeholder:text-sm text-lg resize-none h-14"
            />
            
            <div className="flex items-center justify-between mt-3">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Upload className="w-4 h-4 text-gray-500" />
              </button>
              
              <button className="p-2 bg-primary text-white hover:bg-primary/90 rounded-full transition-colors">
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}