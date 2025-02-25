import AuthContext from '@/context/Auth/AuthContext'
import React, { PropsWithChildren, useContext } from 'react'
import { Navigate } from 'react-router-dom'

const PublicRoute: React.FC<PropsWithChildren> = ({ children }) => {
  console.log('public');
  const authMethod = useContext(AuthContext)
  return authMethod?.isAuthenticated || false ? <Navigate to='/' /> : <>{children}</>
}

export default PublicRoute
