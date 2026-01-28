/**
 * ChatRoom Component
 * Main chat interface container
 * Orchestrates MessageList, MessageInput, and UserList
 * Props: username, messages, onlineUsers, onSendMessage, onDisconnect
 */

import MessageList from "../MessageList/MessageList";
import MessageInput from "../MessageInput/MessageInput";
import UserList from "../UserList/UserList";
import "./ChatRoom.css";

const ChatRoom = ({
  username,
  messages,
  onlineUsers,
  onSendMessage,
  onDisconnect,
}) => {
  const handleSendMessage = (content) => {
    return onSendMessage(username, content);
  };

  return (
    <div className="chat-room-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <h2>💬 Chat Room</h2>
          <span className="connection-status">
            <span className="status-dot"></span>
            Connected
          </span>
        </div>

        <div className="header-right">
          <span className="current-user-badge">
            <span className="user-icon">👤</span>
            {username}
          </span>
          <button
            onClick={onDisconnect}
            className="disconnect-button"
            title="Leave chat"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Leave
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="chat-body">
        {/* Sidebar - User List */}
        <UserList users={onlineUsers} currentUser={username} />

        {/* Main Chat Area */}
        <div className="chat-main">
          <MessageList messages={messages} currentUser={username} />
          <MessageInput onSendMessage={handleSendMessage} disabled={false} />
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
