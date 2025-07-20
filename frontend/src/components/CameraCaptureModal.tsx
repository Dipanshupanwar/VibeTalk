import React, { useEffect, useRef, useState } from "react";

interface Props {
  mode: "photo" | "video";
  onClose: () => void;
  onCapture: (mediaUrl: string) => void;
}

const CameraCaptureModal: React.FC<Props> = ({ mode, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentMode, setCurrentMode] = useState<"photo" | "video">(mode);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  // Get user camera stream
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: currentMode === "video",
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        onClose();
      }
    };

    startCamera();

    return () => {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [facingMode, currentMode, onClose]);

  // 📸 Take Photo
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL("image/png");
      onCapture(imageUrl);
      onClose();
    }
  };

  // 🎥 Start Recording
  const startRecording = () => {
    if (!mediaStreamRef.current) return;
    const recorder = new MediaRecorder(mediaStreamRef.current);
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/mp4" });
      const videoUrl = URL.createObjectURL(blob);
      onCapture(videoUrl);
      onClose();
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between text-white z-10">
        <button onClick={onClose} className="text-lg font-semibold">✖ Close</button>
        <button onClick={toggleFacingMode} className="text-lg font-semibold">🔁 Flip</button>
      </div>

      {/* Mode Switch */}
      <div className="absolute top-16 text-white text-sm z-10">
        <button
          onClick={() => setCurrentMode((prev) => (prev === "photo" ? "video" : "photo"))}
          className="bg-gray-800 px-4 py-2 rounded"
        >
          Mode: {currentMode === "photo" ? "📸 Photo" : "🎥 Video"}
        </button>
      </div>

      {/* Center Capture Button */}
      <div className="absolute bottom-10 flex items-center justify-center w-full z-10">
        {currentMode === "photo" ? (
          <button
            onClick={capturePhoto}
            className="w-20 h-20 bg-white rounded-full border-4 border-gray-800"
          />
        ) : (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-20 h-20 rounded-full border-4 ${
              isRecording ? "bg-red-600 border-red-800" : "bg-white border-gray-800"
            }`}
          />
        )}
      </div>
    </div>
  );
};

export default CameraCaptureModal;
