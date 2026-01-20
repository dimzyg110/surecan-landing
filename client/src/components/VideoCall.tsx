import { useEffect, useRef, useState } from "react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import { Button } from "./ui/button";
import { Video, VideoOff, Mic, MicOff, PhoneOff, Monitor } from "lucide-react";

interface VideoCallProps {
  roomUrl: string;
  userName: string;
  onLeave?: () => void;
}

export function VideoCall({ roomUrl, userName, onLeave }: VideoCallProps) {
  const callFrameRef = useRef<DailyCall | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create Daily call frame
    const callFrame = DailyIframe.createFrame(containerRef.current, {
      showLeaveButton: false,
      showFullscreenButton: true,
      iframeStyle: {
        width: "100%",
        height: "100%",
        border: "0",
        borderRadius: "8px",
      },
    });

    callFrameRef.current = callFrame;

    // Set up event listeners
    callFrame
      .on("joined-meeting", () => {
        setIsJoined(true);
        setError(null);
      })
      .on("left-meeting", () => {
        setIsJoined(false);
        if (onLeave) onLeave();
      })
      .on("error", (e) => {
        console.error("Daily.co error:", e);
        setError(e?.errorMsg || "An error occurred with the video call");
      });

    // Join the meeting
    callFrame
      .join({
        url: roomUrl,
        userName,
      })
      .catch((e) => {
        console.error("Failed to join meeting:", e);
        setError("Failed to join the video call. Please try again.");
      });

    // Cleanup
    return () => {
      if (callFrame) {
        callFrame.destroy();
      }
    };
  }, [roomUrl, userName, onLeave]);

  const toggleCamera = () => {
    if (callFrameRef.current) {
      callFrameRef.current.setLocalVideo(!isCameraOn);
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMic = () => {
    if (callFrameRef.current) {
      callFrameRef.current.setLocalAudio(!isMicOn);
      setIsMicOn(!isMicOn);
    }
  };

  const toggleScreenShare = async () => {
    if (callFrameRef.current) {
      if (isScreenSharing) {
        await callFrameRef.current.stopScreenShare();
        setIsScreenSharing(false);
      } else {
        await callFrameRef.current.startScreenShare();
        setIsScreenSharing(true);
      }
    }
  };

  const leaveCall = () => {
    if (callFrameRef.current) {
      callFrameRef.current.leave();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div
        ref={containerRef}
        className="flex-1 bg-gray-900 rounded-lg overflow-hidden"
        style={{ minHeight: "500px" }}
      />

      {isJoined && (
        <div className="flex items-center justify-center gap-4 mt-4 p-4 bg-gray-100 rounded-lg">
          <Button
            variant={isCameraOn ? "default" : "destructive"}
            size="lg"
            onClick={toggleCamera}
            className="flex items-center gap-2"
          >
            {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            {isCameraOn ? "Camera On" : "Camera Off"}
          </Button>

          <Button
            variant={isMicOn ? "default" : "destructive"}
            size="lg"
            onClick={toggleMic}
            className="flex items-center gap-2"
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            {isMicOn ? "Mic On" : "Mic Off"}
          </Button>

          <Button
            variant={isScreenSharing ? "secondary" : "outline"}
            size="lg"
            onClick={toggleScreenShare}
            className="flex items-center gap-2"
          >
            <Monitor className="w-5 h-5" />
            {isScreenSharing ? "Stop Sharing" : "Share Screen"}
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={leaveCall}
            className="flex items-center gap-2"
          >
            <PhoneOff className="w-5 h-5" />
            Leave Call
          </Button>
        </div>
      )}
    </div>
  );
}
