// ChatAttachmentMenu.tsx
import { FaCamera, FaImage, FaFile, FaVideo, FaUserFriends } from 'react-icons/fa';

const ChatAttachmentMenu = ({ onSelect }: { onSelect: (type: string) => void }) => {
  return (
    <div className="absolute bottom-16 left-4 z-20 bg-gray-800 p-2 rounded-lg shadow-lg flex flex-col gap-2">
      <button onClick={() => onSelect('camera')} className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
        <FaCamera /> Camera
      </button>
      <button onClick={() => onSelect('gallery')} className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
        <FaImage /> Gallery
      </button>
      <button onClick={() => onSelect('documents')} className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
        <FaFile /> Documents
      </button>
      <button onClick={() => onSelect('video')} className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
        <FaVideo /> Video
      </button>
      <button onClick={() => onSelect('contacts')} className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
        <FaUserFriends /> Contact
      </button>
    </div>
  );
};

export default ChatAttachmentMenu;
