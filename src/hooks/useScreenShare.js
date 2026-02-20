import { useState, useCallback, useRef } from "react";

export default function useScreenShare() {
    const [screenShareStatus, setScreenShareStatus] = useState("idle");
    const [screenMediaStream, setScreenMediaStream] = useState(null);
    const [screenMetadata, setScreenMetadata] = useState(null);
    const [screenErrorMessage, setScreenErrorMessage] = useState(null);

    const streamRef = useRef(null);
    const videoRef = useRef(null);

    const releaseStream = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => {
                track.onended = null;
                track.stop();
            });
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }, []);

    const cleanupScreenSharing = useCallback(() => {
        releaseStream();
        setScreenMediaStream(null);
        setScreenMetadata(null);
        setScreenErrorMessage(null);
        setScreenShareStatus("idle");
    }, [releaseStream]);

    const stopScreenSharing = useCallback(() => {
        releaseStream();
        setScreenMediaStream(null);
        setScreenShareStatus("stream-ended");
    }, [releaseStream]);

    const startScreenSharing = useCallback(async () => {
        releaseStream();
        setScreenMediaStream(null);

        setScreenShareStatus("requesting-permission");
        setScreenErrorMessage(null);
        setScreenMetadata(null);

        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { frameRate: { ideal: 30 } },
                audio: false,
            });

            streamRef.current = stream;
            setScreenMediaStream(stream);

            const videoTrack = stream.getVideoTracks()[0];

            if (videoTrack) {
                const settings = videoTrack.getSettings();
                setScreenMetadata({
                    width: settings.width || 0,
                    height: settings.height || 0,
                    displaySurface: settings.displaySurface || "unknown",
                });

                videoTrack.onended = () => {
                    streamRef.current = null;

                    if (videoRef.current) {
                        videoRef.current.srcObject = null;
                    }

                    setScreenMediaStream(null);
                    setScreenShareStatus("stream-ended");
                };
            }

            setScreenShareStatus("permission-granted");
        } catch (error) {
            streamRef.current = null;
            setScreenMediaStream(null);

            if (
                error.name === "NotAllowedError" &&
                (error.message.toLowerCase().includes("cancel") ||
                    error.message.toLowerCase().includes("abort") ||
                    error.message === "Permission denied")
            ) {
                setScreenShareStatus("user-cancelled");
                setScreenErrorMessage("You cancelled the screen selection.");
            } else if (
                error.name === "NotAllowedError" ||
                error.name === "SecurityError"
            ) {
                setScreenShareStatus("permission-denied");
                setScreenErrorMessage("Screen sharing permission was denied.");
            } else if (error.name === "AbortError") {
                setScreenShareStatus("user-cancelled");
                setScreenErrorMessage("Screen selection was aborted.");
            } else if (error.name === "NotFoundError") {
                setScreenShareStatus("unexpected-error");
                setScreenErrorMessage("No screen sharing source was found.");
            } else if (error.name === "NotReadableError") {
                setScreenShareStatus("unexpected-error");
                setScreenErrorMessage(
                    "Could not read the selected screen. It may be restricted by the OS."
                );
            } else {
                setScreenShareStatus("unexpected-error");
                setScreenErrorMessage(
                    error.message || "An unexpected error occurred while screen sharing."
                );
            }
        }
    }, [releaseStream]);

    return {
        screenShareStatus,
        screenMediaStream,
        screenMetadata,
        screenErrorMessage,
        videoRef,
        startScreenSharing,
        stopScreenSharing,
        cleanupScreenSharing,
    };
}
