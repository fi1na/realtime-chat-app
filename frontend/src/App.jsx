/**
 * App Component
 * Main application entry point
 * Manages authentication and routes between login and chat
 */

import { useState } from "react";
import { useChat } from "./hooks/useChat";
import LoginForm from "./components/LoginForm/LoginForm";
import ChatRoom from "./components/ChatRoom/ChatRoom";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");

  const {
    connected,
    messages,
    onlineUsers,
    error,
    isConnecting,
    connect,
    sendMessage,
    disconnect,
    clearError,
  } = useChat();

  /**
   * Handle user login
   * @param {string} username - User's username
   */
  const handleLogin = async (username) => {
    const success = await connect(username);
    if (success) {
      setUsername(username);
    }
  };

  /**
   * Handle user disconnect
   */
  const handleDisconnect = () => {
    disconnect();
    setUsername("");
  };

  /**
   * Handle sending a message
   * @param {string} sender - Username
   * @param {string} content - Message content
   */
  const handleSendMessage = (sender, content) => {
    return sendMessage(sender, content);
  };

  // Show login screen if not connected
  if (!connected) {
    return (
      <LoginForm
        onLogin={handleLogin}
        isConnecting={isConnecting}
        error={error}
      />
    );
  }

  // Show chat room when connected
  return (
    <ChatRoom
      username={username}
      messages={messages}
      onlineUsers={onlineUsers}
      onSendMessage={handleSendMessage}
      onDisconnect={handleDisconnect}
    />
  );
}

export default App;
