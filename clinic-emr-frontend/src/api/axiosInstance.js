import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        const tokenType = localStorage.getItem("tokenType") || "Bearer";

        if (token) {
            config.headers.Authorization = `${tokenType} ${token}`;
        }

        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }

        return config;
    },
    (error) => Promise.reject(error)
);

let logoutHandler = null;

export function setLogoutHandler(handler) {
    logoutHandler = handler;
}

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const requestUrl = error.config?.url || "";
        const isAuthRequest = requestUrl.includes("/api/auth/");

        if (error.response?.status === 401 && !isAuthRequest) {
            localStorage.removeItem("token");
            localStorage.removeItem("tokenType");
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            localStorage.removeItem("permissions");

            if (logoutHandler) {
                logoutHandler();
            } else {
                window.location.href = "/";
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
