import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  isAuthenticated: boolean;
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  isAuthenticated,
  children,
}) => {
  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
