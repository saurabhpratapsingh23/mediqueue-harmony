import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface PatientRouteProps {
  children: React.ReactNode;
}

const PatientRoute: React.FC<PatientRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== "patient") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PatientRoute; 