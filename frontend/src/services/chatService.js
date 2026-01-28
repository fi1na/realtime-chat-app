/**
 * Chat Service
 * Handles all WebSocket communication logic
 * Separates business logic from UI components
 */

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_CONFIG, WS_TOPICS, MESSAGE_TYPES } from "../constants/config";

class ChatService {
  constructor() {
    this.stompClient = null;
    this.isConnected = false;
    this.messageHandlers = [];
    this.connectionHandlers = [];
    this.errorHandlers = [];
  }

  /**
   * Initialize WebSocket connection
   * @param {string} username - User's username
   */
  connect(username) {
    return new Promise((resolve, reject) => {
      try {
        const socket = new SockJS(
          `${API_CONFIG.BASE_URL}${API_CONFIG.WS_ENDPOINT}`,
        );

        this.stompClient = new Client({
          webSocketFactory: () => socket,
          reconnectDelay: API_CONFIG.RECONNECT_DELAY,
          heartbeatIncoming: API_CONFIG.HEARTBEAT_INCOMING,
          heartbeatOutgoing: API_CONFIG.HEARTBEAT_OUTGOING,

          onConnect: () => {
            console.log("[ChatService] Connected to WebSocket");
            this.isConnected = true;

            // Subscribe to public topic
            this.stompClient.subscribe(WS_TOPICS.PUBLIC, (message) => {
              this.handleIncomingMessage(message);
            });

            // Send join message
            this.sendJoinMessage(username);

            // Notify connection handlers
            this.connectionHandlers.forEach((handler) => handler(true));

            resolve();
          },

          onStompError: (frame) => {
            console.error("[ChatService] STOMP error:", frame);
            this.isConnected = false;
            this.errorHandlers.forEach((handler) => handler(frame));
            reject(frame);
          },

          onWebSocketError: (error) => {
            console.error("[ChatService] WebSocket error:", error);
            this.errorHandlers.forEach((handler) => handler(error));
          },

          onDisconnect: () => {
            console.log("[ChatService] Disconnected from WebSocket");
            this.isConnected = false;
            this.connectionHandlers.forEach((handler) => handler(false));
          },
        });

        this.stompClient.activate();
      } catch (error) {
        console.error("[ChatService] Connection error:", error);
        reject(error);
      }
    });
  }

  /**
   * Handle incoming messages from WebSocket
   * @param {Object} message - STOMP message
   */
  handleIncomingMessage(message) {
    try {
      const chatMessage = JSON.parse(message.body);
      console.log("[ChatService] Received message:", chatMessage);

      // Notify all registered message handlers
      this.messageHandlers.forEach((handler) => handler(chatMessage));
    } catch (error) {
      console.error("[ChatService] Error parsing message:", error);
    }
  }

  /**
   * Send a chat message
   * @param {string} sender - Username
   * @param {string} content - Message content
   */
  sendMessage(sender, content) {
    if (!this.isConnected || !this.stompClient) {
      console.error("[ChatService] Cannot send message: not connected");
      return false;
    }

    try {
      const chatMessage = {
        sender,
        content,
        type: MESSAGE_TYPES.CHAT,
      };

      this.stompClient.publish({
        destination: WS_TOPICS.SEND_MESSAGE,
        body: JSON.stringify(chatMessage),
      });

      console.log("[ChatService] Message sent:", chatMessage);
      return true;
    } catch (error) {
      console.error("[ChatService] Error sending message:", error);
      return false;
    }
  }

  /**
   * Send join notification
   * @param {string} username - Username joining
   */
  sendJoinMessage(username) {
    if (!this.stompClient) return;

    try {
      this.stompClient.publish({
        destination: WS_TOPICS.ADD_USER,
        body: JSON.stringify({
          sender: username,
          type: MESSAGE_TYPES.JOIN,
        }),
      });

      console.log("[ChatService] Join message sent for:", username);
    } catch (error) {
      console.error("[ChatService] Error sending join message:", error);
    }
  }

  /**
   * Register a message handler
   * @param {Function} handler - Callback for messages
   */
  onMessage(handler) {
    this.messageHandlers.push(handler);

    // Return unsubscribe function
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  /**
   * Register a connection state handler
   * @param {Function} handler - Callback for connection state changes
   */
  onConnectionChange(handler) {
    this.connectionHandlers.push(handler);

    return () => {
      this.connectionHandlers = this.connectionHandlers.filter(
        (h) => h !== handler,
      );
    };
  }

  /**
   * Register an error handler
   * @param {Function} handler - Callback for errors
   */
  onError(handler) {
    this.errorHandlers.push(handler);

    return () => {
      this.errorHandlers = this.errorHandlers.filter((h) => h !== handler);
    };
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.stompClient) {
      console.log("[ChatService] Disconnecting...");
      this.stompClient.deactivate();
      this.isConnected = false;
    }
  }

  /**
   * Get connection status
   * @returns {boolean}
   */
  getConnectionStatus() {
    return this.isConnected;
  }
}

// Export singleton instance
export default new ChatService();
