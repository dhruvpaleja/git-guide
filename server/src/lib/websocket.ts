import { WebSocketServer, WebSocket } from 'ws';
import type { Server as HTTPServer } from 'http';
import { logger } from './logger.js';
import { tokensService } from '../services/tokens.service.js';
import type { AccessTokenPayload } from '../shared/contracts/auth.contracts.js';
import {
  isClientToServerWebSocketMessage,
  type ClientToServerWebSocketMessage,
  type ServerToClientWebSocketMessage,
} from '../shared/contracts/websocket.contracts.js';

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  isAlive?: boolean;
}

class WebSocketService {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, Set<AuthenticatedWebSocket>> = new Map();

  initialize(server: HTTPServer): void {
    this.wss = new WebSocketServer({
      server,
      path: '/ws',
      // Verify client connections
      verifyClient: (info, callback) => {
        try {
          const url = new URL(info.req.url || '', `http://${info.req.headers.host}`);
          const token = url.searchParams.get('token');

          if (!token) {
            callback(false, 401, 'Unauthorized: No token provided');
            return;
          }

          const decoded = tokensService.verifyToken<AccessTokenPayload>(token);
          if (!decoded?.sub) {
            callback(false, 401, 'Unauthorized: Invalid token');
            return;
          }

          (info.req as { userId?: string }).userId = decoded.sub;
          callback(true);
        } catch {
          callback(false, 400, 'Bad Request');
        }
      },
    });

    this.wss.on('connection', (ws: AuthenticatedWebSocket, req) => {
      const userId = (req as { userId?: string }).userId || '';
      ws.userId = userId;
      ws.isAlive = true;

      // Add client to tracking
      if (!this.clients.has(userId)) {
        this.clients.set(userId, new Set());
      }
      const clientSet = this.clients.get(userId);
      if (clientSet) {
        clientSet.add(ws);
      }

      logger.info('websocket_connected', { userId, totalConnections: this.getConnectionCount() });

      // Handle ping/pong for connection health
      ws.on('pong', () => {
        ws.isAlive = true;
      });

      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString()) as unknown;
          if (!isClientToServerWebSocketMessage(message)) {
            logger.warn('websocket_invalid_message', { userId, message });
            return;
          }
          this.handleMessage(ws, message);
        } catch (error) {
          logger.error('websocket_message_error', { error: error instanceof Error ? error.message : String(error), userId });
        }
      });

      ws.on('close', () => {
        this.removeClient(userId, ws);
        logger.info('websocket_disconnected', { userId, totalConnections: this.getConnectionCount() });
      });

      ws.on('error', (error) => {
        logger.error('websocket_error', { error: error.message, userId });
        this.removeClient(userId, ws);
      });

      // Send welcome message
      this.sendToClient(ws, {
        type: 'connected',
        data: { message: 'WebSocket connected successfully', timestamp: new Date().toISOString() },
      });
    });

    // Heartbeat interval to detect dead connections
    const heartbeatInterval = setInterval(() => {
      this.wss?.clients.forEach((ws: WebSocket) => {
        const client = ws as AuthenticatedWebSocket;
        if (!client.isAlive) {
          logger.warn('websocket_timeout', { userId: client.userId });
          return client.terminate();
        }
        client.isAlive = false;
        client.ping();
      });
    }, 30000); // 30 seconds

    this.wss.on('close', () => {
      clearInterval(heartbeatInterval);
    });

    logger.info('websocket_server_initialized', { path: '/ws' });
  }

  private handleMessage(ws: AuthenticatedWebSocket, message: ClientToServerWebSocketMessage): void {
    const { userId } = ws;
    logger.debug('websocket_message_received', { userId, type: message.type });

    // Handle different message types
    switch (message.type) {
      case 'ping':
        this.sendToClient(ws, { type: 'pong', data: { timestamp: Date.now() } });
        break;

      case 'mark_read':
        // Could trigger notification mark as read
        // For now, just acknowledge
        this.sendToClient(ws, { type: 'ack', data: message.data });
        break;

      default:
        logger.warn('websocket_unknown_message_type', { userId, type: message.type });
    }
  }

  private removeClient(userId: string, ws: AuthenticatedWebSocket): void {
    const userClients = this.clients.get(userId);
    if (userClients) {
      userClients.delete(ws);
      if (userClients.size === 0) {
        this.clients.delete(userId);
      }
    }
  }

  private sendToClient(ws: AuthenticatedWebSocket, message: ServerToClientWebSocketMessage): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  /**
   * Send notification to a specific user (all their active connections)
   */
  sendToUser(userId: string, message: ServerToClientWebSocketMessage): void {
    const userClients = this.clients.get(userId);
    if (!userClients || userClients.size === 0) {
      logger.debug('websocket_user_not_connected', { userId, messageType: message.type });
      return;
    }

    userClients.forEach((ws) => {
      this.sendToClient(ws, message);
    });

    logger.debug('websocket_message_sent', { userId, messageType: message.type, connections: userClients.size });
  }

  /**
   * Broadcast to all connected users
   */
  broadcast(message: ServerToClientWebSocketMessage): void {
    this.wss?.clients.forEach((ws: WebSocket) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
    logger.debug('websocket_broadcast', { messageType: message.type, connections: this.wss?.clients.size });
  }

  /**
   * Get total number of active connections
   */
  getConnectionCount(): number {
    return this.wss?.clients.size ?? 0;
  }

  /**
   * Get number of unique connected users
   */
  getConnectedUserCount(): number {
    return this.clients.size;
  }

  /**
   * Close all connections and shutdown server
   */
  shutdown(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.wss) {
        resolve();
        return;
      }

      logger.info('websocket_shutdown_started');

      this.wss.clients.forEach((ws) => {
        ws.close(1001, 'Server shutting down');
      });

      this.wss.close(() => {
        logger.info('websocket_shutdown_complete');
        this.clients.clear();
        resolve();
      });
    });
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();
