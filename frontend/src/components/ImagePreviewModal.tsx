import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";

interface ImageData {
  url: string;
  caption: string;
}

interface ImagePreviewModalProps {
  images: string[];
  onClose: () => void;
  onSend: (imagesWithCaptions: ImageData[]) => void;
  onRemove: (index: number) => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  images,
  onClose,
  onSend,
  onRemove,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [captions, setCaptions] = useState<string[]>([]);

  useEffect(() => {
    // Sync captions array length with images only if they mismatch
    if (images.length !== captions.length) {
      setCaptions((prev) => {
        const updated = [...prev];
        while (updated.length < images.length) updated.push("");
        return updated.slice(0, images.length);
      });
    }
  }, [images]);

  const handleSend = () => {
    const data: ImageData[] = images.map((url, index) => ({
      url,
      caption: captions[index] || "",
    }));
    onSend(data);
  };

  const handleCaptionChange = (text: string) => {
    setCaptions((prev) => {
      const updated = [...prev];
      updated[currentIndex] = text;
      return updated;
    });
  };

  const goNext = () => {
    if (currentIndex < images.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleRemove = () => {
    onRemove(currentIndex);
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 text-white bg-gray-900">
        <button onClick={onClose} title="Close">
          <IoArrowBack size={24} />
        </button>
        <button
          onClick={handleRemove}
          className="text-red-500 text-sm hover:underline"
        >
          Remove
        </button>
      </div>

      {/* Image */}
      <div className="flex-1 flex items-center justify-center">
       {images[currentIndex] ? (
  images[currentIndex].match(/\.(mp4|webm|ogg)$/) ? (
    <video
      src={images[currentIndex]}
      controls
      className="max-h-[70vh] max-w-full rounded"
    />
  ) : (
    <img
      src={images[currentIndex]}
      alt={`preview-${currentIndex}`}
      className="max-h-[70vh] object-contain"
    />
  )
) : (
  <p className="text-white">No media to display</p>
)}

      </div>

      {/* Caption */}
      <div className="px-4 pb-2">
        <input
          type="text"
          placeholder="Add a caption..."
          value={captions[currentIndex] || ""}
          onChange={(e) => handleCaptionChange(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-100 text-black"
        />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center p-4 bg-gray-900 text-white">
        <div className="flex gap-2">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={goNext}
            disabled={currentIndex === images.length - 1}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
