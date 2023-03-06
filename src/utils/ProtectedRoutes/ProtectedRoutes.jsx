import { Outlet, Navigate, useLocation } from "react-router-dom";

const ProtectedRoutes = () => {
    const isAdmin = true;
    const location = useLocation();

    return (
        isAdmin ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default ProtectedRoutes;