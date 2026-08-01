import { createContext, useContext, useCallback, useEffect, useRef, useState } from "react";
import { setLogoutHandler } from "../api/axiosInstance";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

function readPermissions() {
    try {
        return JSON.parse(localStorage.getItem("permissions")) || [];
    } catch {
        return [];
    }
}

export function AuthProvider({ children }) {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [role, setRole] = useState(localStorage.getItem("role"));
    const [permissions, setPermissions] = useState(readPermissions);
    const [initializing, setInitializing] = useState(
        () => Boolean(localStorage.getItem("token"))
    );
    const sessionRequestRef = useRef(null);

    const login = useCallback((data) => {

        sessionRequestRef.current?.abort();

        const token = data.token || "";
        const tokenType = data.tokenType || "Bearer";
        const username = data.username || "";
        const role = data.role || "";
        const permissions = Array.isArray(data.permissions) ? data.permissions : [];

        localStorage.setItem("token", token);
        localStorage.setItem("tokenType", tokenType);
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);
        localStorage.setItem("permissions", JSON.stringify(permissions));

        setToken(token);
        setUsername(username);
        setRole(role);
        setPermissions(permissions);
        setInitializing(false);
    }, []);

    const logout = useCallback(() => {

        sessionRequestRef.current?.abort();

        localStorage.removeItem("token");
        localStorage.removeItem("tokenType");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("permissions");

        setToken(null);
        setUsername(null);
        setRole(null);
        setPermissions([]);
        setInitializing(false);
    }, []);

    const hasPermission = useCallback(
        (permission) => (Array.isArray(permissions) ? permissions.includes(permission) : false),
        [permissions]
    );

    useEffect(() => {
        setLogoutHandler(logout);
        return () => setLogoutHandler(null);
    }, [logout]);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            return;
        }

        const controller = new AbortController();
        sessionRequestRef.current = controller;

        axiosInstance
            .get("/api/auth/me", { signal: controller.signal })
            .then((response) => {
                if (controller.signal.aborted) {
                    return;
                }
                login(response.data);
            })
            .catch(() => {
                if (controller.signal.aborted) {
                    return;
                }
                logout();
            })
            .finally(() => {
                if (sessionRequestRef.current === controller) {
                    setInitializing(false);
                    sessionRequestRef.current = null;
                }
            });

        return () => controller.abort();
    }, [login, logout]);

    return (
        <AuthContext.Provider
            value={{
                token,
                username,
                role,
                permissions,
                login,
                logout,
                hasPermission,
                isAuthenticated: !!token,
                initializing
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
