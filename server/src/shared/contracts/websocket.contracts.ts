export const CLIENT_TO_SERVER_EVENTS = ['ping', 'mark_read'] as const;
export type ClientToServerEventType = (typeof CLIENT_TO_SERVER_EVENTS)[number];

export const SERVER_TO_CLIENT_EVENTS = ['connected', 'notification', 'ack', 'pong', 'error'] as const;
export type ServerToClientEventType = (typeof SERVER_TO_CLIENT_EVENTS)[number];

export interface ClientToServerPayloadMap {
  ping: { timestamp?: number };
  mark_read: { id: string } | Record<string, unknown>;
}

export interface ServerToClientPayloadMap {
  connected: { message: string; timestamp: string };
  notification: Record<string, unknown>;
  ack: unknown;
  pong: { timestamp: number };
  error: { message: string; code?: string };
}

export type ClientToServerWebSocketMessage<T extends ClientToServerEventType = ClientToServerEventType> = {
  type: T;
  data: ClientToServerPayloadMap[T];
};

export type ServerToClientWebSocketMessage<T extends ServerToClientEventType = ServerToClientEventType> = {
  type: T;
  data: ServerToClientPayloadMap[T];
};

export type WebSocketMessage = ClientToServerWebSocketMessage | ServerToClientWebSocketMessage;

const clientEvents = new Set<string>(CLIENT_TO_SERVER_EVENTS);
const serverEvents = new Set<string>(SERVER_TO_CLIENT_EVENTS);

function hasMessageShape(value: unknown): value is { type: string; data: unknown } {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return typeof candidate.type === 'string' && Object.prototype.hasOwnProperty.call(candidate, 'data');
}

export function isWebSocketMessage(value: unknown): value is WebSocketMessage {
  return hasMessageShape(value) && (clientEvents.has(value.type) || serverEvents.has(value.type));
}

export function isClientToServerWebSocketMessage(value: unknown): value is ClientToServerWebSocketMessage {
  return hasMessageShape(value) && clientEvents.has(value.type);
}

export function isServerToClientWebSocketMessage(value: unknown): value is ServerToClientWebSocketMessage {
  return hasMessageShape(value) && serverEvents.has(value.type);
}
