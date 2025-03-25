
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const goToLandingPage = () => {
    navigate("/landing");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800">Welcome to MediQ</h1>
        <p className="text-xl text-slate-600 mb-8">
          Experience the future of healthcare queue management with our innovative platform.
        </p>
        <div className="space-x-4">
          <Button 
            onClick={goToLandingPage} 
            className="text-lg px-6 py-6 h-auto"
          >
            Enter MediQ
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
