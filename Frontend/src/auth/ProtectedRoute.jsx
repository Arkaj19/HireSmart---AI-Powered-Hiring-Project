import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // or spinner
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
  
// import { useAuth } from "@/context/AuthContext";
// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children }) {
//   const { user, loading } = useAuth();

//   if (loading) return <div>Loading...</div>;

//   return user ? children : <Navigate to="/login" replace />;
// }
