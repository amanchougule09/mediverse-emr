import { useEffect, useRef } from "react";

export default function Modal({ title, onClose, children, maxWidth = "max-w-3xl" }) {
    const overlayRef = useRef(null);

    useEffect(() => {
        const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handleEsc);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-10 sm:pt-16 overflow-y-auto"
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
            <div className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} mx-4 mb-8`}>
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none transition-colors">&times;</button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
