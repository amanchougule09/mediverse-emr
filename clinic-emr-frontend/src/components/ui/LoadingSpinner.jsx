export default function LoadingSpinner({ message = "Loading..." }) {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="text-center">
                <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="mt-3 text-sm text-slate-500">{message}</p>
            </div>
        </div>
    );
}
