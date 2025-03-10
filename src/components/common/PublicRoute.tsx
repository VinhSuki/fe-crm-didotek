import { useAuthContext } from "@/context/AuthContext";
import React, { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

const PublicRoute: React.FC<PropsWithChildren> = ({ children }) => {
  console.log("public");
  const authMethod = useAuthContext();
  return authMethod?.isAuthenticated || false ? (
    <Navigate to="/" />
  ) : (
    <>{children}</>
  );
};

export default PublicRoute;
