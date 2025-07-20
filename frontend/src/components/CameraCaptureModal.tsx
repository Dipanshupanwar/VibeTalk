// ✅ New Component: CameraCaptureModal.tsx
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";

interface CameraCaptureModalProps {
  onClose: () => void;
  onCapture: (mediaUrl: string) => void;
  mode: "photo" | "video";
}

const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({ onClose, onCapture, mode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: mode === "video",
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Failed to access camera", error);
        onClose();
      }
    };

    startCamera();
    return () => {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [mode, onClose]);

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");
    onCapture(dataUrl);
    onClose();
  };

  const startRecording = () => {
    const stream = mediaStreamRef.current;
    if (!stream) return;

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    recordedChunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      onCapture(url);
      onClose();
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center">
      <div className="relative">
        <video ref={videoRef} autoPlay playsInline className="rounded-md w-full max-w-[500px]" />

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-2xl bg-gray-800 rounded-full p-1"
        >
          <IoClose />
        </button>

        {mode === "photo" ? (
          <button
            onClick={capturePhoto}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full"
          >
            Capture Photo
          </button>
        ) : (
          <div className="mt-4 flex gap-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="px-6 py-2 bg-red-600 text-white rounded-full"
              >
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-6 py-2 bg-green-600 text-white rounded-full"
              >
                Stop Recording
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCaptureModal;
