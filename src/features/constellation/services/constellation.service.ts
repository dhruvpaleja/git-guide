/**
 * Constellation Service
 * API layer for constellation CRUD + mock data fallback for dev mode
 */

import apiService from '@/services/api.service.js';
import type {
  ConstellationData,
  ConstellationNode,
  ConstellationConnection,
  ConstellationInsight,
  CreateNodePayload,
  UpdateNodePayload,
  CreateConnectionPayload,
} from '../types/index.js';

// ── Mock data for development ────────────────────────────────────────────

const MOCK_NODES: ConstellationNode[] = [
  {
    id: 'node-self',
    userId: 'dev-user',
    label: 'You',
    description: 'Your core emotional center — the anchor of your constellation.',
    category: 'self',
    emotion: 'neutral',
    intensity: 5,
    x: 50,
    y: 45,
    size: 1.6,
    isPinned: true,
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-03-01T08:30:00Z',
    tags: ['core', 'identity'],
  },
  {
    id: 'node-career',
    userId: 'dev-user',
    label: 'Career Burnout',
    description: 'Persistent exhaustion from Q4 crunch. 3rd cycle this year.',
    category: 'career',
    emotion: 'burnout',
    intensity: 4,
    x: 72,
    y: 30,
    size: 1.2,
    isPinned: false,
    createdAt: '2026-02-20T14:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
    note: 'Every deadline triggers the same spiral. Need to break the pattern.',
    tags: ['work', 'stress', 'recurring'],
  },
  {
    id: 'node-boss',
    userId: 'dev-user',
    label: 'Tech Lead Conflict',
    description: 'Recurring friction with team lead over autonomy and micromanagement.',
    category: 'career',
    emotion: 'anger',
    intensity: 3,
    x: 78,
    y: 55,
    size: 1.0,
    isPinned: false,
    createdAt: '2026-02-22T16:00:00Z',
    updatedAt: '2026-02-28T11:00:00Z',
    tags: ['work', 'conflict', 'authority'],
  },
  {
    id: 'node-partner',
    userId: 'dev-user',
    label: 'Relationship Growth',
    description: 'Deepening connection with partner. Communication improving.',
    category: 'relationship',
    emotion: 'hope',
    intensity: 3,
    x: 28,
    y: 28,
    size: 1.1,
    isPinned: false,
    createdAt: '2026-02-18T09:00:00Z',
    updatedAt: '2026-03-01T07:00:00Z',
    note: 'Started couples meditation. Feeling closer.',
    tags: ['love', 'growth', 'communication'],
  },
  {
    id: 'node-anxiety',
    userId: 'dev-user',
    label: 'Social Anxiety',
    description: 'Dread around large gatherings and networking events.',
    category: 'social',
    emotion: 'anxiety',
    intensity: 4,
    x: 35,
    y: 68,
    size: 1.0,
    isPinned: false,
    createdAt: '2026-02-25T12:00:00Z',
    updatedAt: '2026-02-28T18:00:00Z',
    tags: ['social', 'fear', 'avoidance'],
  },
  {
    id: 'node-meditation',
    userId: 'dev-user',
    label: 'Meditation Practice',
    description: 'Daily 20-min morning sits. Building consistency.',
    category: 'spirituality',
    emotion: 'peace',
    intensity: 2,
    x: 22,
    y: 48,
    size: 0.9,
    isPinned: false,
    createdAt: '2026-01-10T06:00:00Z',
    updatedAt: '2026-03-02T06:30:00Z',
    note: '45-day streak! Noticing real shifts in reactivity.',
    tags: ['practice', 'mindfulness', 'routine'],
  },
  {
    id: 'node-fitness',
    userId: 'dev-user',
    label: 'Physical Health',
    description: 'Started running again after 6-month break. Knees holding up.',
    category: 'health',
    emotion: 'excitement',
    intensity: 2,
    x: 58,
    y: 72,
    size: 0.85,
    isPinned: false,
    createdAt: '2026-02-01T07:00:00Z',
    updatedAt: '2026-03-01T07:30:00Z',
    tags: ['exercise', 'recovery', 'body'],
  },
];

const MOCK_CONNECTIONS: ConstellationConnection[] = [
  {
    id: 'conn-1',
    sourceId: 'node-self',
    targetId: 'node-career',
    type: 'friction',
    strength: 0.85,
    label: 'Energy drain',
    createdAt: '2026-02-20T14:00:00Z',
  },
  {
    id: 'conn-2',
    sourceId: 'node-career',
    targetId: 'node-boss',
    type: 'friction',
    strength: 0.9,
    label: 'Triggers burnout',
    createdAt: '2026-02-22T16:00:00Z',
  },
  {
    id: 'conn-3',
    sourceId: 'node-self',
    targetId: 'node-partner',
    type: 'harmony',
    strength: 0.75,
    label: 'Safe space',
    createdAt: '2026-02-18T09:00:00Z',
  },
  {
    id: 'conn-4',
    sourceId: 'node-self',
    targetId: 'node-meditation',
    type: 'harmony',
    strength: 0.8,
    label: 'Grounding force',
    createdAt: '2026-01-10T06:00:00Z',
  },
  {
    id: 'conn-5',
    sourceId: 'node-self',
    targetId: 'node-anxiety',
    type: 'friction',
    strength: 0.6,
    label: 'Avoidance cycle',
    createdAt: '2026-02-25T12:00:00Z',
  },
  {
    id: 'conn-6',
    sourceId: 'node-meditation',
    targetId: 'node-anxiety',
    type: 'evolving',
    strength: 0.45,
    label: 'Slowly healing',
    createdAt: '2026-02-26T06:00:00Z',
  },
  {
    id: 'conn-7',
    sourceId: 'node-partner',
    targetId: 'node-meditation',
    type: 'harmony',
    strength: 0.5,
    label: 'Shared practice',
    createdAt: '2026-02-28T07:00:00Z',
  },
  {
    id: 'conn-8',
    sourceId: 'node-self',
    targetId: 'node-fitness',
    type: 'harmony',
    strength: 0.55,
    label: 'Rebuilding',
    createdAt: '2026-02-01T07:00:00Z',
  },
  {
    id: 'conn-9',
    sourceId: 'node-career',
    targetId: 'node-anxiety',
    type: 'friction',
    strength: 0.7,
    label: 'Deadline dread',
    createdAt: '2026-02-26T14:00:00Z',
  },
];

const MOCK_INSIGHTS: ConstellationInsight[] = [
  {
    id: 'insight-1',
    type: 'pattern',
    title: 'Burnout Cycle Detected',
    description:
      'You\'ve mentioned "burnout" precisely 3 days before every major deadline for the last 4 months. This is the same pattern from Q3.',
    severity: 'high',
    relatedNodeIds: ['node-career', 'node-boss'],
    createdAt: '2026-03-01T08:00:00Z',
    isRead: false,
    actionLabel: 'View Pattern Timeline',
  },
  {
    id: 'insight-2',
    type: 'suggestion',
    title: 'Meditation is Working',
    description:
      'Your anxiety node intensity has dropped from 5 to 4 since starting the meditation practice. The connection between them is evolving positively.',
    severity: 'info',
    relatedNodeIds: ['node-meditation', 'node-anxiety'],
    createdAt: '2026-02-28T12:00:00Z',
    isRead: true,
    actionLabel: 'See Progress',
  },
  {
    id: 'insight-3',
    type: 'warning',
    title: 'Career Friction Spreading',
    description:
      'The friction from your career node is now connected to 3 other nodes. Consider scheduling a session to address the root cause.',
    severity: 'medium',
    relatedNodeIds: ['node-career', 'node-boss', 'node-anxiety'],
    createdAt: '2026-03-01T10:00:00Z',
    isRead: false,
    actionLabel: 'Book Session',
    actionRoute: '/dashboard/sessions',
  },
  {
    id: 'insight-4',
    type: 'milestone',
    title: '45-Day Meditation Streak',
    description:
      'Your longest consistent practice. The constellation shows measurable improvement in your peace & anxiety nodes.',
    severity: 'info',
    relatedNodeIds: ['node-meditation'],
    createdAt: '2026-03-02T06:30:00Z',
    isRead: false,
    actionLabel: 'Celebrate',
  },
];

// ── Service class ────────────────────────────────────────────────────────

class ConstellationService {
  private isDev = import.meta.env.MODE === 'development';

  /** Fetch full constellation data */
  async getConstellation(): Promise<ConstellationData> {
    // In dev mode, return mock data immediately — skips 3 failed retries + delays
    if (this.isDev) {
      return {
        nodes: MOCK_NODES,
        connections: MOCK_CONNECTIONS,
        insights: MOCK_INSIGHTS,
        lastUpdated: new Date().toISOString(),
      };
    }

    const res = await apiService.get<ConstellationData>('/constellation');

    if (res.success && res.data) {
      return res.data;
    }

    return { nodes: [], connections: [], insights: [], lastUpdated: new Date().toISOString() };
  }

  /** Create a new node */
  async createNode(payload: CreateNodePayload): Promise<ConstellationNode> {
    // In dev mode, return mock immediately
    if (this.isDev) {
      const newNode: ConstellationNode = {
        id: `node-${Date.now()}`,
        userId: 'dev-user',
        ...payload,
        size: 1.0,
        isPinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: payload.tags ?? [],
      };
      return newNode;
    }

    const res = await apiService.post<ConstellationNode>('/constellation/nodes', payload);
    if (res.success && res.data) return res.data;
    throw new Error('Failed to create node');
  }

  /** Update an existing node */
  async updateNode(nodeId: string, payload: UpdateNodePayload): Promise<ConstellationNode> {
    if (this.isDev) {
      const existingNode = MOCK_NODES.find((n) => n.id === nodeId);
      if (existingNode) {
        return { ...existingNode, ...payload, updatedAt: new Date().toISOString() } as ConstellationNode;
      }
    }

    const res = await apiService.put<ConstellationNode>(`/constellation/nodes/${nodeId}`, payload);
    if (res.success && res.data) return res.data;
    throw new Error('Failed to update node');
  }

  /** Delete a node */
  async deleteNode(nodeId: string): Promise<void> {
    if (this.isDev) return;
    const res = await apiService.delete(`/constellation/nodes/${nodeId}`);
    if (!res.success) throw new Error('Failed to delete node');
  }

  /** Create a connection between nodes */
  async createConnection(payload: CreateConnectionPayload): Promise<ConstellationConnection> {
    if (this.isDev) {
      return {
        id: `conn-${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString(),
      };
    }

    const res = await apiService.post<ConstellationConnection>('/constellation/connections', payload);
    if (res.success && res.data) return res.data;
    throw new Error('Failed to create connection');
  }

  /** Delete a connection */
  async deleteConnection(connectionId: string): Promise<void> {
    if (this.isDev) return;
    const res = await apiService.delete(`/constellation/connections/${connectionId}`);
    if (!res.success) throw new Error('Failed to delete connection');
  }

  /** Mark an insight as read */
  async markInsightRead(insightId: string): Promise<void> {
    if (this.isDev) return;
    await apiService.put(`/constellation/insights/${insightId}/read`);
  }
}

export const constellationService = new ConstellationService();
export default constellationService;
