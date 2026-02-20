export default function Card({ children, className = "" }) {
    return (
        <div
            className={`rounded-xl border border-surface-800 bg-surface-900 p-6 shadow-md sm:p-8 ${className}`}
        >
            {children}
        </div>
    );
}
