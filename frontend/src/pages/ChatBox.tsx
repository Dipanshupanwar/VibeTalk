import { useEffect, useRef, useState } from "react";
import { useChatContext } from "../context/chatContext";
import EmojiPicker from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";
// Correct import
import ChatAttachmentMenu from "../components/chatAttachmentMenu";
import ImagePreviewModal from "../components/ImagePreviewModal";
import CameraCaptureModal from "../components/CameraCaptureModal";
import { IoIosArrowDown } from "react-icons/io";
import ChatHeader from "../components/ChatHeader";
import { useNavigate } from "react-router-dom";

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

  const [unreadCount, setUnreadCount] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const unreadRef = useRef(0);
  const lastUnreadMessageId = useRef<string | null>(null);
  const navigate = useNavigate();

  const handleEmojiClick = (emojiData: any) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const handleAttachmentSelect = (type: string) => {
    setShowAttachmentMenu(false);
    if (type === "gallery" || type === "video") {
      fileInputRef.current?.click();
    } else if (type === "camera") {
      setCameraMode("photo");
      setShowCameraModal(true);
    }
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const isBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 50;

    setIsAtBottom(isBottom);

    if (isBottom) {
      unreadRef.current = 0;
      setUnreadCount(0);
      lastUnreadMessageId.current = null;
      setShowScrollButton(false);
    } else {
      setShowScrollButton(true);
    }
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    unreadRef.current = 0;
    setUnreadCount(0);
    lastUnreadMessageId.current = null;
    setShowScrollButton(false);
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || messages.length === 0) return;

    const isUserAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    setIsAtBottom(isUserAtBottom);

    const lastMsg = messages[messages.length - 1];

    if (isUserAtBottom || lastMsg?.senderId === currentUserId) {
      scrollToBottom();
    } else if (
      lastMsg &&
      lastMsg.senderId !== currentUserId &&
      lastMsg.id !== lastUnreadMessageId.current
    ) {
      lastUnreadMessageId.current = lastMsg.id;
      unreadRef.current += 1;
      setUnreadCount(unreadRef.current);
      setShowScrollButton(true);
    }
  }, [messages, currentUserId]);

  return (
    <div className="h-full w-full bg-gray-600 text-white flex flex-col">
      <div className="w-full h-full bg-gray-800 flex flex-col relative">
        <ChatHeader
          receiver={receiver || {}}
          onVoiceCall={() => console.log("Voice call")}
          onVideoCall={() => console.log("Video call")}
        />

        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-2 sm:px-4 py-3 space-y-2 custom-scrollbar"
        >
          {messages.map((msg) => {
            const isSentByCurrentUser = msg.senderId === currentUserId;

            return (
              <div
                key={msg.id}
                className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] lg:max-w-[50%] px-4 py-2 rounded-lg text-sm shadow-md break-words ${
                  isSentByCurrentUser
                    ? "ml-auto bg-blue-600 text-white"
                    : "mr-auto bg-gray-700 text-gray-200"
                }`}
              >
                {msg.mediaUrl ? (
                  msg.mediaType === "video" ? (
                    <video controls className="max-w-full rounded-md">
                      <source src={msg.mediaUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={msg.mediaUrl}
                      alt="sent"
                      className="max-w-full rounded-md"
                    />
                  )
                ) : (
                  <div>{msg.text}</div>
                )}

                {isSentByCurrentUser && (
                  <div className="text-right text-xs mt-1 flex justify-end items-center gap-1">
                    {msg.seenBy && msg.seenBy.length > 1 ? (
                      <span className="text-green-400">✓✓</span>
                    ) : (
                      <span className="text-white">✓✓</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {showScrollButton && (
          <div className="fixed bottom-24 right-4 sm:right-6 z-50">
            <button
              onClick={scrollToBottom}
              className="relative bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
            >
              <IoIosArrowDown size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
            scrollToBottom();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 border-t border-gray-700 bg-gray-800"
        >
          {/* ➕ Attachment Button */}
          <button
            type="button"
            onClick={() => setShowAttachmentMenu((prev) => !prev)}
            className="text-white bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
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

          {/* 😊 Emoji Button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-yellow-300 hover:text-yellow-400"
          >
            <FaSmile size={22} />
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-[60px] left-2 sm:left-12 z-10 max-w-[90vw]">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}

          {/* ✍️ Text Input */}
          <div className="flex-1">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-4 py-2 bg-gray-700 rounded-full text-white text-sm focus:outline-none"
            />
          </div>

          {/* 📤 Send Button */}
          <button
            type="submit"
            className="p-2 px-3 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm"
          >
            Send
          </button>
        </form>

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
