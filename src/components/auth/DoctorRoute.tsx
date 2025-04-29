import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface DoctorRouteProps {
  children: React.ReactNode;
}

const DoctorRoute = ({ children }: DoctorRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  // If authenticated but not a doctor, redirect to dashboard
  if (user?.role !== "doctor") {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and is a doctor, render the protected content
  return <>{children}</>;
};

export default DoctorRoute; 