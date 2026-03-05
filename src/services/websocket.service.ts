/**
 * WebSocket Service for Real-Time Notifications
 * Manages WebSocket connection for push notifications, live updates, and real-time features
 */

import {
  isServerToClientWebSocketMessage,
  type ClientToServerEventType,
  type ClientToServerPayloadMap,
  type ServerToClientEventType,
  type ServerToClientPayloadMap,
} from '@contracts/websocket.contracts';

type MessageHandler<T = unknown> = (data: T) => void;
type HandlerKey = ServerToClientEventType | '*';

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1s
  private handlers: Map<HandlerKey, Set<MessageHandler>> = new Map();
  private isConnecting = false;
  private url: string;
  private token: string | null = null;

  constructor() {
    this.url = this.resolveWebSocketUrl();
  }

  private resolveWebSocketUrl(): string {
    const explicitWsUrl = import.meta.env.VITE_WS_URL as string | undefined;
    if (explicitWsUrl) {
      const normalized = explicitWsUrl.replace(/\/$/, '');
      return normalized.endsWith('/ws') ? normalized : `${normalized}/ws`;
    }

    const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
    if (apiUrl) {
      try {
        const parsed = new URL(apiUrl);
        const protocol = parsed.protocol === 'https:' ? 'wss:' : 'ws:';
        return `${protocol}//${parsed.host}/ws`;
      } catch {
        // Fall through to window-location fallback.
      }
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/ws`;
  }

  /**
   * Connect to WebSocket server with authentication token
   */
  connect(authToken: string): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return; // Already connected or connecting
    }

    this.token = authToken;
    this.isConnecting = true;

    try {
      this.ws = new WebSocket(`${this.url}?token=${encodeURIComponent(authToken)}`);

      this.ws.onopen = () => {
        // eslint-disable-next-line no-console
        console.log('[WebSocket] Connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
      };

      this.ws.onmessage = (event: MessageEvent) => {
        try {
          if (typeof event.data !== 'string') {
            console.warn('[WebSocket] Ignoring non-text message');
            return;
          }

          const message = JSON.parse(event.data) as unknown;
          if (!isServerToClientWebSocketMessage(message)) {
            console.warn('[WebSocket] Ignoring unsupported message shape');
            return;
          }

          this.handleMessage(message.type, message.data);
        } catch (error) {
           
          console.error('[WebSocket] Failed to parse message:', error);
        }
      };

      this.ws.onclose = () => {
        // eslint-disable-next-line no-console
        console.log('[WebSocket] Disconnected');
        this.isConnecting = false;
        this.ws = null;
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
         
        console.error('[WebSocket] Error:', error);
        this.isConnecting = false;
      };
    } catch (error) {
       
      console.error('[WebSocket] Connection failed:', error);
      this.isConnecting = false;
      this.attemptReconnect();
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.token = null;
    this.isConnecting = false;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
  }

  /**
   * Subscribe to a specific event type
   */
  on(eventType: HandlerKey, handler: MessageHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.add(handler);
    }

    // Return unsubscribe function
    return () => {
      const handlers = this.handlers.get(eventType);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.handlers.delete(eventType);
        }
      }
    };
  }

  /**
   * Send a message to the server
   */
  send<T extends ClientToServerEventType>(type: T, data: ClientToServerPayloadMap[T]): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    } else {
      console.warn('[WebSocket] Cannot send message - not connected');
    }
  }

  /**
   * Get current connection status
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private handleMessage<T extends ServerToClientEventType>(type: T, data: ServerToClientPayloadMap[T]): void {
    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }

    // Also trigger wildcard handlers
    const wildcardHandlers = this.handlers.get('*');
    if (wildcardHandlers) {
      wildcardHandlers.forEach((handler) => handler({ type, data }));
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts || !this.token) {
      // eslint-disable-next-line no-console
      console.log('[WebSocket] Max reconnect attempts reached or no token');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    // eslint-disable-next-line no-console
    console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      if (this.token) {
        this.connect(this.token);
      }
    }, delay);
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();
