import AuthContext from '@/context/Auth/AuthContext';
import React, { PropsWithChildren, useContext } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const authMethod = useContext(AuthContext)
  return authMethod?.isAuthenticated || false ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
