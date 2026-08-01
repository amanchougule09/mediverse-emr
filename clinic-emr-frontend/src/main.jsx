import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

import { AuthProvider } from "./auth/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <App />
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        fontSize: "14px",
                        borderRadius: "10px",
                        padding: "12px 16px",
                    },
                    success: {
                        iconTheme: { primary: "#10b981", secondary: "#fff" },
                    },
                    error: {
                        iconTheme: { primary: "#ef4444", secondary: "#fff" },
                    },
                }}
            />
        </AuthProvider>
    </React.StrictMode>
);
