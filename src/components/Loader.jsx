export default function Loader({ text = "Loading…" }) {
    return (
        <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-surface-700 border-t-primary-500" />
            <p className="text-sm text-surface-400">{text}</p>
        </div>
    );
}
