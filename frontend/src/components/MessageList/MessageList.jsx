/**
 * MessageList Component
 * Displays chat messages with auto-scroll
 * Props: messages, currentUser
 */

import { useEffect, useRef } from "react";
import { MESSAGE_TYPES } from "../../constants/config";
import "./MessageList.css";

const MessageList = ({ messages, currentUser }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMessage = (message, index) => {
    // System messages (JOIN/LEAVE)
    if (
      message.type === MESSAGE_TYPES.JOIN ||
      message.type === MESSAGE_TYPES.LEAVE
    ) {
      return (
        <div key={index} className="message-wrapper system">
          <div className="system-message">
            <span className="system-icon">
              {message.type === MESSAGE_TYPES.JOIN ? "👋" : "👋"}
            </span>
            <span className="system-text">{message.content}</span>
          </div>
        </div>
      );
    }

    // Chat messages
    const isOwnMessage = message.sender === currentUser;

    return (
      <div
        key={index}
        className={`message-wrapper ${isOwnMessage ? "own" : "other"}`}
      >
        <div
          className={`chat-message ${isOwnMessage ? "own-message" : "other-message"}`}
        >
          {!isOwnMessage && (
            <div className="message-sender">{message.sender}</div>
          )}
          <div className="message-content">{message.content}</div>
          <div className="message-time">{formatTime(message.timestamp)}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="message-list-container">
      {messages.length === 0 ? (
        <div className="empty-messages">
          <div className="empty-icon">💬</div>
          <h3>No messages yet</h3>
          <p>Be the first to say hello!</p>
        </div>
      ) : (
        <div className="messages-scroll">
          {messages.map((message, index) => renderMessage(message, index))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessageList;
