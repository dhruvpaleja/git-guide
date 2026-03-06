/**
 * WebSocket Service for Real-Time Notifications
 * Manages WebSocket connection for push notifications, live updates, and real-time features.
 */

import {
  isServerToClientWebSocketMessage,
  type ClientToServerEventType,
  type ClientToServerPayloadMap,
  type ServerToClientEventType,
  type ServerToClientPayloadMap,
} from '@contracts/websocket.contracts';

export const WEBSOCKET_CONNECTION_STATES = [
  'idle',
  'connecting',
  'connected',
  'reconnecting',
  'disconnected',
  'failed',
] as const;

export type WebSocketConnectionState = (typeof WEBSOCKET_CONNECTION_STATES)[number];

export interface WebSocketConnectionStatePayload {
  state: WebSocketConnectionState;
  attempt: number;
  maxAttempts: number;
  nextRetryInMs?: number;
  reason?: string;
}

type WildcardPayload = {
  type: ServerToClientEventType;
  data: ServerToClientPayloadMap[ServerToClientEventType];
};

type HandlerKey = ServerToClientEventType | '*' | 'connection_state';

type HandlerPayloadMap = {
  connected: ServerToClientPayloadMap['connected'];
  notification: ServerToClientPayloadMap['notification'];
  ack: ServerToClientPayloadMap['ack'];
  pong: ServerToClientPayloadMap['pong'];
  error: ServerToClientPayloadMap['error'];
  '*': WildcardPayload;
  connection_state: WebSocketConnectionStatePayload;
};

type MessageHandler<K extends HandlerKey = HandlerKey> = (data: HandlerPayloadMap[K]) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 8;
  private readonly reconnectBaseDelayMs = 1000;
  private readonly reconnectMaxDelayMs = 30_000;
  private handlers: Map<HandlerKey, Set<MessageHandler>> = new Map();
  private isConnecting = false;
  private readonly url: string;
  private token: string | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private manualDisconnect = false;
  private connectionState: WebSocketConnectionState = 'idle';

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

  private emit<K extends HandlerKey>(eventType: K, data: HandlerPayloadMap[K]): void {
    const handlers = this.handlers.get(eventType);
    if (!handlers) {
      return;
    }

    handlers.forEach((handler) => {
      (handler as MessageHandler<K>)(data);
    });
  }

  private setConnectionState(state: WebSocketConnectionState, options?: {
    reason?: string;
    attempt?: number;
    nextRetryInMs?: number;
  }): void {
    this.connectionState = state;

    this.emit('connection_state', {
      state,
      attempt: options?.attempt ?? this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts,
      nextRetryInMs: options?.nextRetryInMs,
      reason: options?.reason,
    });
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private computeReconnectDelayMs(attempt: number): number {
    const exponentialDelay = Math.min(
      this.reconnectMaxDelayMs,
      this.reconnectBaseDelayMs * Math.pow(2, attempt - 1),
    );
    const jitterFactor = 0.7 + Math.random() * 0.6;
    return Math.round(exponentialDelay * jitterFactor);
  }

  private scheduleReconnect(reason: string): void {
    if (this.manualDisconnect || !this.token) {
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.setConnectionState('failed', {
        reason,
        attempt: this.reconnectAttempts,
      });
      return;
    }

    this.reconnectAttempts += 1;
    const delayMs = this.computeReconnectDelayMs(this.reconnectAttempts);

    this.setConnectionState('reconnecting', {
      reason,
      attempt: this.reconnectAttempts,
      nextRetryInMs: delayMs,
    });

    this.clearReconnectTimer();
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;

      if (!this.token || this.manualDisconnect) {
        return;
      }

      this.connect(this.token);
    }, delayMs);
  }

  /**
   * Connect to WebSocket server with authentication token.
   */
  connect(authToken: string): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.token = authToken;
    this.manualDisconnect = false;
    this.isConnecting = true;
    this.clearReconnectTimer();

    this.setConnectionState(this.reconnectAttempts > 0 ? 'reconnecting' : 'connecting', {
      attempt: this.reconnectAttempts,
      reason: this.reconnectAttempts > 0 ? 'reconnect_attempt' : 'connect_attempt',
    });

    try {
      this.ws = new WebSocket(`${this.url}?token=${encodeURIComponent(authToken)}`);

      this.ws.onopen = () => {
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.setConnectionState('connected', {
          reason: 'connected',
          attempt: 0,
        });
      };

      this.ws.onmessage = (event: MessageEvent) => {
        if (typeof event.data !== 'string') {
          return;
        }

        try {
          const message = JSON.parse(event.data) as unknown;
          if (!isServerToClientWebSocketMessage(message)) {
            return;
          }

          this.handleMessage(message.type, message.data);
        } catch {
          // Invalid message payloads are ignored.
        }
      };

      this.ws.onclose = (event: CloseEvent) => {
        this.isConnecting = false;
        this.ws = null;

        if (this.manualDisconnect) {
          this.setConnectionState('disconnected', { reason: 'manual_disconnect', attempt: 0 });
          return;
        }

        const reason = event.reason || `close_code_${event.code}`;
        this.setConnectionState('disconnected', {
          reason,
          attempt: this.reconnectAttempts,
        });
        this.scheduleReconnect(reason);
      };

      this.ws.onerror = () => {
        this.isConnecting = false;
      };
    } catch {
      this.isConnecting = false;
      this.scheduleReconnect('connection_error');
    }
  }

  /**
   * Disconnect from WebSocket server.
   */
  disconnect(): void {
    this.manualDisconnect = true;
    this.token = null;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.clearReconnectTimer();

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      this.ws.close(1000, 'Client disconnect');
    }

    this.ws = null;
    this.setConnectionState('disconnected', { reason: 'manual_disconnect', attempt: 0 });
  }

  /**
   * Subscribe to a specific event type.
   */
  on<K extends HandlerKey>(eventType: K, handler: MessageHandler<K>): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }

    const eventHandlers = this.handlers.get(eventType);
    if (eventHandlers) {
      eventHandlers.add(handler as MessageHandler);
    }

    // Emit current connection state immediately for state listeners.
    if (eventType === 'connection_state') {
      (handler as MessageHandler<'connection_state'>)({
        state: this.connectionState,
        attempt: this.reconnectAttempts,
        maxAttempts: this.maxReconnectAttempts,
      });
    }

    // Return unsubscribe function.
    return () => {
      const handlersForType = this.handlers.get(eventType);
      if (handlersForType) {
        handlersForType.delete(handler as MessageHandler);
        if (handlersForType.size === 0) {
          this.handlers.delete(eventType);
        }
      }
    };
  }

  /**
   * Send a message to the server.
   */
  send<T extends ClientToServerEventType>(type: T, data: ClientToServerPayloadMap[T]): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    }
  }

  /**
   * Get current connection status.
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private handleMessage<T extends ServerToClientEventType>(type: T, data: ServerToClientPayloadMap[T]): void {
    this.emit(type, data as HandlerPayloadMap[T]);
    this.emit('*', { type, data });
  }
}

// Export singleton instance.
export const websocketService = new WebSocketService();
