import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface DoctorRouteProps {
  children: React.ReactNode;
}

const DoctorRoute: React.FC<DoctorRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== "doctor") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default DoctorRoute; 