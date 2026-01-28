/**
 * MessageInput Component
 * Input field for sending messages with validation
 * Props: onSendMessage, disabled
 */

import { useState, useRef } from "react";
import { UI_CONFIG } from "../../constants/config";
import "./MessageInput.css";

const MessageInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() || disabled || isSending) {
      return;
    }

    setIsSending(true);

    try {
      await onSendMessage(message.trim());
      setMessage("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("[MessageInput] Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    // Send on Enter, but allow Shift+Enter for new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= UI_CONFIG.MAX_MESSAGE_LENGTH) {
      setMessage(value);
    }
  };

  const remainingChars = UI_CONFIG.MAX_MESSAGE_LENGTH - message.length;
  const showCharCount = message.length > UI_CONFIG.MAX_MESSAGE_LENGTH * 0.8;

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit} className="message-input-form">
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            placeholder="Type a message... (Press Enter to send)"
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            disabled={disabled || isSending}
            rows={1}
            className="message-textarea"
          />
          {showCharCount && (
            <span
              className={`char-count ${remainingChars < 50 ? "warning" : ""}`}
            >
              {remainingChars}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={!message.trim() || disabled || isSending}
          className="send-button"
          title="Send message (Enter)"
        >
          {isSending ? (
            <span className="spinner-small"></span>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
