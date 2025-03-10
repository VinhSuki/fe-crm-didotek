import { useAuthContext } from "@/context/AuthContext";
import React, { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const authMethod = useAuthContext();
  return authMethod?.isAuthenticated || false ? (
    <>{children}</>
  ) : (
    <Navigate to="/dang-nhap" />
  );
};

export default PrivateRoute;
