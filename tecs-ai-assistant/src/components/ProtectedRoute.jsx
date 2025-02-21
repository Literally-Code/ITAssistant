import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { fetchTest } from "../utils/api";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    fetchTest(user);

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