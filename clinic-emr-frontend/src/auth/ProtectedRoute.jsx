import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";

function ProtectedRoute({ children, permission }) {

    const { isAuthenticated, hasPermission, permissions, initializing } = useAuth();

    if (initializing) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (permission && !hasPermission(permission)) {
        return permissions.length === 0 ? (
            <Navigate to="/pending-approval" replace />
        ) : (
            <Navigate to="/forbidden" replace />
        );
    }

    return children;
}

export default ProtectedRoute;
