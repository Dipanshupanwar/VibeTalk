import { useEffect, useRef, useState } from "react";
import { useChatContext } from "../context/chatContext";
import EmojiPicker from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";
import ChatAttachmentMenu from "../components/chatAttachmentMenu";
import ImagePreviewModal from "../components/ImagePreviewModal";
import CameraCaptureModal from "../components/CameraCaptureModal";
import { IoIosArrowDown } from "react-icons/io";

function ChatBox() {
  const {
    messages,
    receiver,
    text,
    setText,
    sendMessage,
    selectedImages,
    setSelectedImages,
    handleSendImages,
    handleImageUpload,
    currentUserId,
    showImagePreview,
    setShowImagePreview,
  } = useChatContext();

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraMode, setCameraMode] = useState<"photo" | "video">("photo");

  const handleEmojiClick = (emojiData: any) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const handleAttachmentSelect = (type: string) => {
    setShowAttachmentMenu(false);
    if (type === "gallery" || type === "video") {
      fileInputRef.current?.click();
    } else if (type === "camera") {
      setCameraMode("photo"); // You can customize this for "video" too
      setShowCameraModal(true);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const threshold = 150;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      threshold;

    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 100;

    setShowScrollButton(!isAtBottom);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

  return (
    <div className="h-full w-full bg-gray-600 text-white flex flex-col">
      <div className="w-full h-full bg-gray-800 flex flex-col relative">
        {/* 🔵 Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-900">
          <div className="text-lg font-semibold">
            Chatting with:{" "}
            <span className="text-blue-400">{receiver?.name || "Loading..."}</span>
          </div>
          <div className="flex gap-4 text-gray-300">
            <button
              onClick={() => alert(`Calling ${receiver?.name}...`)}
              title="Voice Call"
              className="hover:text-green-400 transition"
            >
              📞
            </button>
            <button
              onClick={() => alert(`Starting video call with ${receiver?.name}...`)}
              title="Video Call"
              className="hover:text-blue-400 transition"
            >
              📹
            </button>
          </div>
        </div>

        {/* 🔵 Messages */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-3 space-y-2 custom-scrollbar"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[80%] sm:max-w-[70%] px-4 py-2 rounded-lg text-sm shadow-md break-words ${
                msg.senderId === currentUserId
                  ? "ml-auto bg-blue-600 text-white"
                  : "mr-auto bg-gray-700 text-gray-200"
              }`}
            >
              {msg.mediaUrl ? (
                msg.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video controls className="max-w-full rounded-md">
                    <source src={msg.mediaUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img src={msg.mediaUrl} alt="sent" className="max-w-full rounded-md" />
                )
              ) : (
                msg.text
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* 🔽 Scroll Button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-24 right-6 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg"
          >
            <IoIosArrowDown size={24} />
          </button>
        )}

        {/* ✍️ Input Area */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center gap-2 p-4 border-t border-gray-700 relative"
        >
          <button
            type="button"
            onClick={() => setShowAttachmentMenu((prev) => !prev)}
            className="text-white bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-full"
          >
            +
          </button>
          {showAttachmentMenu && (
            <ChatAttachmentMenu onSelect={handleAttachmentSelect} />
          )}

          <input
            type="file"
            accept="image/*,video/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            multiple
            className="hidden"
          />

          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-yellow-300 hover:text-yellow-400"
          >
            <FaSmile size={24} />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-[60px] left-12 z-10">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-700 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
          >
            Send
          </button>
        </form>

        {/* 📸 Preview Modal */}
        {showImagePreview && selectedImages.length > 0 && (
          <ImagePreviewModal
            images={selectedImages}
            onClose={() => {
              setSelectedImages([]);
              setShowImagePreview(false);
            }}
            onSend={(imagesWithCaptions) => {
              handleSendImages(imagesWithCaptions);
              setShowImagePreview(false);
            }}
            onRemove={(index) =>
              setSelectedImages((prev) => prev.filter((_, i) => i !== index))
            }
          />
        )}

        {/* 📷 Camera Modal */}
        {showCameraModal && (
          <CameraCaptureModal
            mode={cameraMode}
            onClose={() => setShowCameraModal(false)}
            onCapture={(mediaUrl) => {
              setSelectedImages([mediaUrl]);
              setShowImagePreview(true);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default ChatBox;
