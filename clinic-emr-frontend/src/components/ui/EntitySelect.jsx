import { useState, useEffect, useRef } from "react";
import { getPatients } from "../../api/patients";
import { getDoctors } from "../../api/doctors";

export default function EntitySelect({ type = "patient", value, onChange, required = false, className = "" }) {
    const [options, setOptions] = useState([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const fetchFn = type === "patient" ? getPatients : getDoctors;
    const label = type === "patient" ? "Patient" : "Doctor";

    useEffect(() => {
        let active = true;
        const load = async () => {
            try {
                const data = await fetchFn();
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
    }, [type, fetchFn]);

    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const filtered = options.filter((o) => {
        const label = type === "patient"
            ? `${o.fullName || o.firstName + " " + o.lastName} ${o.patientCode || ""}`
            : `${o.firstName} ${o.lastName} ${o.doctorCode || ""} ${o.specialization || ""}`;
        return label.toLowerCase().includes(search.toLowerCase());
    });

    const selected = options.find((o) => String(o.id) === String(value));
    const displayLabel = selected
        ? type === "patient"
            ? `${selected.fullName || selected.firstName + " " + selected.lastName} (${selected.patientCode || selected.id})`
            : `Dr. ${selected.firstName} ${selected.lastName} - ${selected.specialization || ""} (${selected.doctorCode || selected.id})`
        : `Select ${label}...`;

    return (
        <div ref={ref} className={`relative ${className}`}>
            <input type="hidden" name={`${type}Id`} value={value || ""} required={required && !value} />
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
                            placeholder={`Search ${label.toLowerCase()}s...`}
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
                                onChange({ target: { name: `${type}Id`, value: "" } });
                                setOpen(false);
                                setSearch("");
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 border-b border-slate-100"
                        >
                            Clear selection
                        </button>
                    )}
                    {filtered.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-slate-400">No {label.toLowerCase()}s found</div>
                    ) : (
                        filtered.map((o) => (
                            <button
                                key={o.id}
                                type="button"
                                onClick={() => {
                                    onChange({ target: { name: `${type}Id`, value: String(o.id) } });
                                    setOpen(false);
                                    setSearch("");
                                }}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors ${
                                    String(o.id) === String(value) ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-700"
                                }`}
                            >
                                {type === "patient"
                                    ? `${o.fullName || o.firstName + " " + o.lastName} - ${o.patientCode || ""}`
                                    : `Dr. ${o.firstName} ${o.lastName} - ${o.specialization || ""} (${o.doctorCode || ""})`}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
