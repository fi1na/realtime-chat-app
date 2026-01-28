/**
 * useChat Hook
 * Custom React hook for chat functionality
 * Encapsulates WebSocket logic and state management
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import chatService from '../services/chatService';
import { MESSAGE_TYPES, ERROR_MESSAGES } from '../constants/config';

export const useChat = () => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const unsubscribeRefs = useRef([]);

  /**
   * Connect to chat server
   * @param {string} username - User's username
   */
  const connect = useCallback(async (username) => {
    if (!username?.trim()) {
      setError(ERROR_MESSAGES.INVALID_USERNAME);
      return false;
    }

    setIsConnecting(true);
    setError(null);

    try {
      await chatService.connect(username);
      
      // Subscribe to messages
      const unsubMessage = chatService.onMessage((message) => {
        handleNewMessage(message);
      });
      
      // Subscribe to connection changes
      const unsubConnection = chatService.onConnectionChange((isConnected) => {
        setConnected(isConnected);
        if (!isConnected) {
          setError(ERROR_MESSAGES.WEBSOCKET_ERROR);
        }
      });
      
      // Subscribe to errors
      const unsubError = chatService.onError((err) => {
        console.error('[useChat] Error:', err);
        setError(ERROR_MESSAGES.CONNECTION_FAILED);
      });
      
      // Store unsubscribe functions
      unsubscribeRefs.current = [unsubMessage, unsubConnection, unsubError];
      
      setConnected(true);
      setIsConnecting(false);
      return true;
      
    } catch (err) {
      console.error('[useChat] Connection failed:', err);
      setError(ERROR_MESSAGES.CONNECTION_FAILED);
      setIsConnecting(false);
      return false;
    }
  }, []);

  /**
   * Handle new incoming message
   * @param {Object} message - Chat message
   */
  const handleNewMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
    
    // Update online users list
    if (message.type === MESSAGE_TYPES.JOIN) {
      setOnlineUsers(prev => new Set([...prev, message.sender]));
    } else if (message.type === MESSAGE_TYPES.LEAVE) {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(message.sender);
        return newSet;
      });
    }
  }, []);

  /**
   * Send a chat message
   * @param {string} username - Sender username
   * @param {string} content - Message content
   */
  const sendMessage = useCallback((username, content) => {
    if (!content?.trim()) {
      return false;
    }

    const success = chatService.sendMessage(username, content);
    
    if (!success) {
      setError(ERROR_MESSAGES.MESSAGE_SEND_FAILED);
    }
    
    return success;
  }, []);

  /**
   * Disconnect from chat
   */
  const disconnect = useCallback(() => {
    chatService.disconnect();
    
    // Cleanup subscriptions
    unsubscribeRefs.current.forEach(unsub => unsub?.());
    unsubscribeRefs.current = [];
    
    setConnected(false);
    setMessages([]);
    setOnlineUsers(new Set());
    setError(null);
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    // State
    connected,
    messages,
    onlineUsers: Array.from(onlineUsers),
    error,
    isConnecting,
    
    // Actions
    connect,
    sendMessage,
    disconnect,
    clearError,
  };
};