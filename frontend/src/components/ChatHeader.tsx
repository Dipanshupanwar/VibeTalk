import React from "react";

interface ChatHeaderProps {
  receiver: {
    name?: string;
  };
  onVoiceCall: () => void;
  onVideoCall: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  receiver,
  onVoiceCall,
  onVideoCall,
}) => {
  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between p-3 sm:p-4 bg-gray-900 border-b border-gray-700 shadow-sm">
      <div className="flex items-center gap-3 flex-grow min-w-0">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold text-white uppercase">
          {receiver?.name?.[0] || "U"}
        </div>
        <div className="truncate">
          <div className="font-semibold text-lg text-white truncate">
            {receiver?.name || "Loading..."}
          </div>
          <div className="text-xs text-gray-400">Active now</div>
        </div>
      </div>

      <div className="flex gap-3 mt-2 sm:mt-0 sm:ml-4">
        <button
          onClick={onVoiceCall}
          title="Voice Call"
          className="p-2 rounded-full bg-gray-800 hover:bg-green-600 transition text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h.75a2.25 2.25 0 002.25-2.25v-2.508a1.5 1.5 0 00-1.057-1.437l-3.514-1.172a1.5 1.5 0 00-1.887.845l-.546 1.29a11.25 11.25 0 01-5.787-5.787l1.29-.546a1.5 1.5 0 00.845-1.887L8.445 4.814A1.5 1.5 0 007.008 3.75H4.5A2.25 2.25 0 002.25 6v.75z"
            />
          </svg>
        </button>

        <button
          onClick={onVideoCall}
          title="Video Call"
          className="p-2 rounded-full bg-gray-800 hover:bg-blue-600 transition text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-9A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21h9a2.25 2.25 0 002.25-2.25V15m0-6l6 4.5-6 4.5V9z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
