import { useState, useEffect, useRef } from "react";
import { getAppointments } from "../../api/appointments";

export default function AppointmentSelect({ value, onChange, required = false, className = "" }) {
    const [options, setOptions] = useState([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        let active = true;
        const load = async () => {
            try {
                const data = await getAppointments();
                if (active) {
                    setOptions(Array.isArray(data) ? data : data?.content || []);
                }
            } catch {
                if (active) setOptions([]);
            }
        };
        load();
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const filtered = options.filter((o) => {
        const text = `${o.appointmentCode || ""} ${o.patientName || ""} ${o.doctorName || ""} ${o.appointmentDate || ""} ${o.appointmentTime || ""}`.toLowerCase();
        return text.includes(search.toLowerCase());
    });

    const selected = options.find((o) => String(o.id) === String(value));
    const displayLabel = selected
        ? `${selected.appointmentCode || selected.id}${selected.patientName ? " - " + selected.patientName : ""} (${selected.appointmentDate || ""}${selected.appointmentTime ? " " + selected.appointmentTime : ""})`
        : "Select Appointment...";

    return (
        <div ref={ref} className={`relative ${className}`}>
            <input type="hidden" name="appointmentId" value={value || ""} required={required && !value} />
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            >
                <span className={value ? "text-slate-800" : "text-slate-400"}>{displayLabel}</span>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    <div className="p-2 sticky top-0 bg-white border-b border-slate-100">
                        <input
                            type="text"
                            placeholder="Search by code, patient, doctor..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                            autoFocus
                        />
                    </div>
                    {!required && value && (
                        <button
                            type="button"
                            onClick={() => {
                                onChange({ target: { name: "appointmentId", value: "" } });
                                setOpen(false);
                                setSearch("");
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 border-b border-slate-100"
                        >
                            Clear selection
                        </button>
                    )}
                    {filtered.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-slate-400">No appointments found</div>
                    ) : (
                        filtered.map((o) => (
                            <button
                                key={o.id}
                                type="button"
                                onClick={() => {
                                    onChange({ target: { name: "appointmentId", value: String(o.id) } });
                                    setOpen(false);
                                    setSearch("");
                                }}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors ${
                                    String(o.id) === String(value) ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-700"
                                }`}
                            >
                                <span className="font-medium">{o.appointmentCode || o.id}</span>
                                {o.patientName && <span> - {o.patientName}</span>}
                                {o.doctorName && <span> ({o.doctorName})</span>}
                                <span className="text-slate-400"> {o.appointmentDate || ""}{o.appointmentTime ? " " + o.appointmentTime : ""}</span>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
