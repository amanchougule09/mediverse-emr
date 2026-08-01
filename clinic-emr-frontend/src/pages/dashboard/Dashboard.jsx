import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import axiosInstance from "../../api/axiosInstance";

const statCards = [
    { key: "totalPatients", label: "Patients" },
    { key: "totalDoctors", label: "Doctors" },
    { key: "totalAppointments", label: "Appointments" },
    { key: "totalConsultations", label: "Consultations" },
    { key: "totalPrescriptions", label: "Prescriptions" },
    { key: "totalBills", label: "Bills" },
    { key: "totalRevenue", label: "Revenue", isCurrency: true },
    { key: "totalMedicines", label: "Medicines" },
    { key: "totalLabTests", label: "Lab Tests" },
    { key: "totalFiles", label: "Files" },
    { key: "totalNotifications", label: "Notifications" },
];

const PIE_COLORS = [
    "#3b82f6",
    "#10b981",
    "#8b5cf6",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
];

const chartEntities = [
    { key: "totalPatients", label: "Patients" },
    { key: "totalDoctors", label: "Doctors" },
    { key: "totalAppointments", label: "Appointments" },
    { key: "totalConsultations", label: "Consultations" },
    { key: "totalPrescriptions", label: "Prescriptions" },
    { key: "totalMedicines", label: "Medicines" },
];

function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axiosInstance
            .get("/api/dashboard")
            .then((res) => setDashboard(res.data))
            .catch((err) => {
                console.error(err);
                setError("Failed to load dashboard data.");
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div>
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">
                        Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Welcome back to your clinic overview
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl p-5 shadow-sm animate-pulse"
                        >
                            <div className="h-4 bg-slate-200 rounded w-20 mb-3"></div>
                            <div className="h-8 bg-slate-200 rounded w-16"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">
                <p className="text-lg font-medium">{error}</p>
            </div>
        );
    }

    const barData = chartEntities.map((e) => ({
        name: e.label,
        value: dashboard?.[e.key] ?? 0,
    }));

    const pieData = chartEntities
        .map((e) => ({
            name: e.label,
            value: dashboard?.[e.key] ?? 0,
        }))
        .filter((d) => d.value > 0);

    const hasChartData = barData.some((d) => d.value > 0);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">
                    Dashboard
                </h1>
                <p className="text-slate-500 mt-1">
                    Welcome back to your clinic overview
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {statCards.map((card) => (
                    <div
                        key={card.key}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-5 border border-slate-100"
                    >
                        <p className="text-sm text-slate-500 font-medium">
                            {card.label}
                        </p>

                        <p className="text-2xl font-bold text-slate-800 mt-1">
                            {card.isCurrency
                                ? `₹${Number(
                                    dashboard?.[card.key] || 0
                                ).toLocaleString("en-IN")}`
                                : dashboard?.[card.key] ?? 0}
                        </p>
                    </div>
                ))}
            </div>

            {hasChartData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">
                            Entity Counts
                        </h2>

                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e2e8f0"
                                />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar
                                    dataKey="value"
                                    fill="#3b82f6"
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {pieData.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">
                                Status Distribution
                            </h2>

                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={110}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {pieData.map((_, index) => (
                                            <Cell
                                                key={index}
                                                fill={
                                                    PIE_COLORS[
                                                    index %
                                                    PIE_COLORS.length
                                                        ]
                                                }
                                            />
                                        ))}
                                    </Pie>

                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Dashboard;