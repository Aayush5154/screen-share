export default function Button({
    label,
    onClick,
    disabled = false,
    variant = "primary",
}) {
    const base =
        "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-950 disabled:cursor-not-allowed disabled:opacity-40";

    const variants = {
        primary:
            "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
        secondary:
            "bg-surface-800 text-surface-200 hover:bg-surface-700 focus:ring-surface-500 border border-surface-700",
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${variants[variant] || variants.primary}`}
        >
            {label}
        </button>
    );
}
