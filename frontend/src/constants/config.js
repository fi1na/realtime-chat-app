/**
 * Application configuration constants
 * Centralized configuration for easy maintenance and environment-specific changes
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  WS_ENDPOINT: "/ws",
  RECONNECT_DELAY: 5000,
  HEARTBEAT_INCOMING: 4000,
  HEARTBEAT_OUTGOING: 4000,
};

// WebSocket Topics
export const WS_TOPICS = {
  PUBLIC: "/topic/public",
  SEND_MESSAGE: "/app/chat.sendMessage",
  ADD_USER: "/app/chat.addUser",
};

// Message Types
export const MESSAGE_TYPES = {
  CHAT: "CHAT",
  JOIN: "JOIN",
  LEAVE: "LEAVE",
};

// UI Configuration
export const UI_CONFIG = {
  MAX_USERNAME_LENGTH: 20,
  MAX_MESSAGE_LENGTH: 500,
  SCROLL_BEHAVIOR: "smooth",
};

// Error Messages
export const ERROR_MESSAGES = {
  CONNECTION_FAILED: "Failed to connect to chat server. Please try again.",
  MESSAGE_SEND_FAILED: "Failed to send message. Please check your connection.",
  INVALID_USERNAME: "Please enter a valid username.",
  WEBSOCKET_ERROR: "WebSocket connection error. Reconnecting...",
};
