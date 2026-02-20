import { useEffect } from "react";
import { Link } from "react-router-dom";
import useScreenShare from "../hooks/useScreenShare.js";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import Loader from "../components/Loader.jsx";
import StatusMessage from "../components/StatusMessage.jsx";

const SURFACE_LABELS = {
    monitor: "Entire Screen",
    window: "Application Window",
    browser: "Browser Tab",
    unknown: "Unknown Source",
};

const backLinkClasses =
    "inline-flex items-center justify-center gap-2 rounded-lg bg-surface-800 px-5 py-2.5 text-sm font-medium text-surface-200 transition-colors duration-150 hover:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-surface-500 focus:ring-offset-2 focus:ring-offset-surface-950 border border-surface-700";

export default function ScreenTest() {
    const {
        screenShareStatus,
        screenMediaStream,
        screenMetadata,
        screenErrorMessage,
        videoRef,
        startScreenSharing,
        stopScreenSharing,
        cleanupScreenSharing,
    } = useScreenShare();

    useEffect(() => {
        return () => {
            cleanupScreenSharing();
        };
    }, [cleanupScreenSharing]);

    useEffect(() => {
        if (videoRef.current && screenMediaStream) {
            videoRef.current.srcObject = screenMediaStream;
        }
    }, [screenMediaStream, videoRef]);

    const isRequesting = screenShareStatus === "requesting-permission";
    const isActive = screenShareStatus === "permission-granted";
    const isCancelled = screenShareStatus === "user-cancelled";
    const isDenied = screenShareStatus === "permission-denied";
    const isEnded = screenShareStatus === "stream-ended";
    const isError = screenShareStatus === "unexpected-error";
    const isIdle = screenShareStatus === "idle";

    return (
        <main className="flex flex-1 flex-col items-center px-4 py-8 sm:py-12">
            <div className="w-full max-w-2xl">
                <div className="mb-6 flex items-center gap-3">
                    <Link
                        to="/"
                        onClick={cleanupScreenSharing}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-surface-400 transition-colors hover:bg-surface-800 hover:text-white"
                        aria-label="Back to home"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                        >
                            <path d="M19 12H5" />
                            <path d="m12 19-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-lg font-semibold text-white">Screen Test</h1>

                    {isActive && (
                        <span className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-800 bg-emerald-950/50 px-3 py-1 text-xs font-medium text-emerald-400">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                            Live
                        </span>
                    )}
                </div>

                {isIdle && (
                    <Card>
                        <div className="flex flex-col items-center gap-4 py-4 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-surface-700 bg-surface-800 text-surface-300">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-6 w-6"
                                >
                                    <rect x="2" y="3" width="20" height="14" rx="2" />
                                    <line x1="8" y1="21" x2="16" y2="21" />
                                    <line x1="12" y1="17" x2="12" y2="21" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="mb-1 text-base font-semibold text-white">
                                    Ready to Share
                                </h2>
                                <p className="text-sm text-surface-400">
                                    Click the button below to select a screen, window, or tab.
                                    A live preview will appear here once sharing begins.
                                </p>
                            </div>
                            <Button
                                label="Start Screen Sharing"
                                onClick={startScreenSharing}
                            />
                        </div>
                    </Card>
                )}

                {isRequesting && (
                    <Card>
                        <div className="flex flex-col items-center gap-4 py-8">
                            <Loader text="Waiting for screen selection…" />
                            <Button
                                label="Start Screen Sharing"
                                onClick={startScreenSharing}
                                disabled
                            />
                        </div>
                    </Card>
                )}

                {isActive && screenMediaStream && (
                    <Card>
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <StatusMessage message="Screen sharing active" type="success" />
                            </div>

                            {screenMetadata && (
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="rounded-md border border-surface-700 bg-surface-800 px-2.5 py-1 font-medium text-surface-300">
                                        {SURFACE_LABELS[screenMetadata.displaySurface] ||
                                            screenMetadata.displaySurface}
                                    </span>
                                    <span className="rounded-md border border-surface-700 bg-surface-800 px-2.5 py-1 font-mono text-surface-300">
                                        {screenMetadata.width} × {screenMetadata.height}
                                    </span>
                                </div>
                            )}

                            <div className="overflow-hidden rounded-lg border border-surface-700 bg-black">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="h-auto w-full"
                                />
                            </div>

                            <div className="flex justify-center">
                                <Button
                                    label="Stop Screen Sharing"
                                    onClick={stopScreenSharing}
                                    variant="secondary"
                                />
                            </div>
                        </div>
                    </Card>
                )}

                {isCancelled && (
                    <Card>
                        <div className="flex flex-col items-center gap-4 py-4 text-center">
                            <StatusMessage
                                message={screenErrorMessage || "You cancelled the screen selection."}
                                type="warning"
                            />
                            <div className="flex gap-3">
                                <Button
                                    label="Try Again"
                                    onClick={startScreenSharing}
                                />
                                <Link to="/" className={backLinkClasses}>
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </Card>
                )}

                {isDenied && (
                    <Card>
                        <div className="flex flex-col items-center gap-4 py-4 text-center">
                            <StatusMessage
                                message={
                                    screenErrorMessage ||
                                    "Screen sharing permission was denied."
                                }
                                type="error"
                            />
                            <p className="max-w-sm text-xs text-surface-500">
                                Your browser or OS blocked the request. Check your browser
                                permissions and system privacy settings, then try again.
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    label="Retry Screen Test"
                                    onClick={startScreenSharing}
                                />
                                <Link to="/" className={backLinkClasses}>
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </Card>
                )}

                {isEnded && (
                    <Card>
                        <div className="flex flex-col items-center gap-4 py-4 text-center">
                            <StatusMessage
                                message="Screen sharing stopped."
                                type="info"
                            />
                            <div className="flex gap-3">
                                <Button
                                    label="Retry Screen Test"
                                    onClick={startScreenSharing}
                                />
                                <Link to="/" className={backLinkClasses}>
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </Card>
                )}

                {isError && (
                    <Card>
                        <div className="flex flex-col items-center gap-4 py-4 text-center">
                            <StatusMessage
                                message={
                                    screenErrorMessage || "An unexpected error occurred."
                                }
                                type="error"
                            />
                            <div className="flex gap-3">
                                <Button
                                    label="Retry Screen Test"
                                    onClick={startScreenSharing}
                                />
                                <Link to="/" className={backLinkClasses}>
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </main>
    );
}
