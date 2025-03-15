import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    if (user)
    {
        return children;
    }
    else 
    {
        return <Navigate to="/" />;
    }
};

export default ProtectedRoute;