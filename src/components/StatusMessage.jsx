const statusStyles = {
    success: "text-emerald-400 bg-emerald-950/50 border-emerald-800",
    error: "text-red-400 bg-red-950/50 border-red-800",
    info: "text-blue-400 bg-blue-950/50 border-blue-800",
    warning: "text-amber-400 bg-amber-950/50 border-amber-800",
};

export default function StatusMessage({
    message,
    type = "info",
    className = "",
}) {
    if (!message) return null;

    return (
        <div
            className={`rounded-lg border px-4 py-2.5 text-sm font-medium ${statusStyles[type] || statusStyles.info} ${className}`}
            role="alert"
        >
            {message}
        </div>
    );
}
