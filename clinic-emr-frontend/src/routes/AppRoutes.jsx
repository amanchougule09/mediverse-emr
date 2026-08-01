import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../auth/Login";
import Register from "../auth/Register";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";
import ProtectedRoute from "../auth/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/dashboard/Dashboard";
import Patients from "../pages/patient/Patients";
import Doctors from "../pages/doctor/Doctors";
import Appointments from "../pages/appointment/Appointments";
import Consultations from "../pages/consultation/Consultations";
import Prescriptions from "../pages/prescription/Prescriptions";
import Billing from "../pages/billing/Billing";
import Laboratory from "../pages/laboratory/Laboratory";
import Pharmacy from "../pages/pharmacy/Pharmacy";
import Notifications from "../pages/notification/Notifications";
import Audit from "../pages/audit/Audit";
import Files from "../pages/file/Files";
import Roles from "../pages/admin/Roles";
import Users from "../pages/admin/Users";
import NotFound from "../pages/NotFound";
import Forbidden from "../pages/Forbidden";
import PendingApproval from "../pages/PendingApproval";

function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/forbidden" element={<Forbidden />} />
                <Route path="/pending-approval" element={<PendingApproval />} />

                <Route
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path="/dashboard"
                        element={<ProtectedRoute permission="dashboard:view"><Dashboard /></ProtectedRoute>}
                    />
                    <Route
                        path="/patients"
                        element={<ProtectedRoute permission="patient:view"><Patients /></ProtectedRoute>}
                    />
                    <Route
                        path="/doctors"
                        element={<ProtectedRoute permission="doctor:view"><Doctors /></ProtectedRoute>}
                    />
                    <Route
                        path="/appointments"
                        element={<ProtectedRoute permission="appointment:view"><Appointments /></ProtectedRoute>}
                    />
                    <Route
                        path="/consultations"
                        element={<ProtectedRoute permission="consultation:view"><Consultations /></ProtectedRoute>}
                    />
                    <Route
                        path="/prescriptions"
                        element={<ProtectedRoute permission="prescription:view"><Prescriptions /></ProtectedRoute>}
                    />
                    <Route
                        path="/billing"
                        element={<ProtectedRoute permission="billing:view"><Billing /></ProtectedRoute>}
                    />
                    <Route
                        path="/laboratory"
                        element={<ProtectedRoute permission="laboratory:view"><Laboratory /></ProtectedRoute>}
                    />
                    <Route
                        path="/pharmacy"
                        element={<ProtectedRoute permission="pharmacy:view"><Pharmacy /></ProtectedRoute>}
                    />
                    <Route
                        path="/notifications"
                        element={<ProtectedRoute permission="notification:view"><Notifications /></ProtectedRoute>}
                    />
                    <Route
                        path="/audits"
                        element={<ProtectedRoute permission="audit:view"><Audit /></ProtectedRoute>}
                    />
                    <Route
                        path="/files"
                        element={<ProtectedRoute permission="file:view"><Files /></ProtectedRoute>}
                    />
                    <Route
                        path="/roles"
                        element={<ProtectedRoute permission="role:view"><Roles /></ProtectedRoute>}
                    />
                    <Route
                        path="/users"
                        element={<ProtectedRoute permission="user:view"><Users /></ProtectedRoute>}
                    />
                </Route>

                <Route path="*" element={<NotFound />} />

            </Routes>

        </BrowserRouter>

    );

}

export default AppRoutes;
