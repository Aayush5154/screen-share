import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card.jsx";
import StatusMessage from "../components/StatusMessage.jsx";

export default function Home() {
    const [error, setError] = useState(null);

    const supportsScreenShare = !!navigator.mediaDevices?.getDisplayMedia;

    const handleClick = () => {
        if (!supportsScreenShare) {
            setError(
                "Your browser does not support screen sharing. Please use a modern browser like Chrome, Edge, or Firefox."
            );
        }
    };

    return (
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-md text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-surface-700 bg-surface-800 text-surface-200">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-7 w-7"
                    >
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                </div>

                <h1 className="mb-2 text-2xl font-semibold text-white sm:text-3xl">
                    Screen Share Test App
                </h1>

                <p className="mx-auto mb-8 max-w-sm text-sm text-surface-400">
                    Verify your screen sharing setup. Test display capture, check
                    resolution, and confirm everything works before your next call.
                </p>

                <Card>
                    <div className="flex flex-col items-center gap-4">
                        {error && <StatusMessage message={error} type="error" />}

                        {supportsScreenShare ? (
                            <Link
                                to="/screen-test"
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface-950"
                            >
                                Start Screen Test
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={handleClick}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface-950"
                            >
                                Start Screen Test
                            </button>
                        )}

                        <p className="text-xs text-surface-500">
                            Uses your browser&apos;s native screen sharing API. No data
                            leaves your device.
                        </p>
                    </div>
                </Card>
            </div>
        </main>
    );
}
