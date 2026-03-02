/**
 * useConstellation Hook
 * Manages constellation state, CRUD operations, and view state
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import constellationService from '../services/constellation.service.js';
import type {
  ConstellationData,
  ConstellationNode,
  ConstellationConnection,
  ConstellationInsight,
  ConstellationViewState,
  CreateNodePayload,
  UpdateNodePayload,
  CreateConnectionPayload,
  NodeCategory,
} from '../types/index.js';

interface UseConstellationReturn {
  // Data
  nodes: ConstellationNode[];
  connections: ConstellationConnection[];
  insights: ConstellationInsight[];
  unreadInsightCount: number;

  // Loading
  isLoading: boolean;
  error: string | null;

  // View state
  viewState: ConstellationViewState;
  setSelectedNode: (id: string | null) => void;
  setHoveredNode: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  setIsAddingNode: (adding: boolean) => void;
  setActiveFilter: (filter: NodeCategory | 'all') => void;
  toggleInsights: () => void;

  // CRUD
  createNode: (payload: CreateNodePayload) => Promise<void>;
  updateNode: (nodeId: string, payload: UpdateNodePayload) => Promise<void>;
  deleteNode: (nodeId: string) => Promise<void>;
  moveNode: (nodeId: string, x: number, y: number) => void;
  createConnection: (payload: CreateConnectionPayload) => Promise<void>;
  deleteConnection: (connectionId: string) => Promise<void>;
  markInsightRead: (insightId: string) => Promise<void>;

  // Computed
  selectedNode: ConstellationNode | null;
  filteredNodes: ConstellationNode[];
  nodeConnections: (nodeId: string) => ConstellationConnection[];
  refetch: () => Promise<void>;
}

export function useConstellation(): UseConstellationReturn {
  const [data, setData] = useState<ConstellationData>({
    nodes: [],
    connections: [],
    insights: [],
    lastUpdated: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewState, setViewState] = useState<ConstellationViewState>({
    zoom: 1,
    panX: 0,
    panY: 0,
    selectedNodeId: null,
    hoveredNodeId: null,
    isAddingNode: false,
    activeFilter: 'all',
    showInsights: true,
  });

  // ── Fetch data ─────────────────────────────────────────────────────────

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await constellationService.getConstellation();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load constellation');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // ── View state setters ─────────────────────────────────────────────────

  const setSelectedNode = useCallback((id: string | null) => {
    setViewState((prev) => ({ ...prev, selectedNodeId: id }));
  }, []);

  const setHoveredNode = useCallback((id: string | null) => {
    setViewState((prev) => ({ ...prev, hoveredNodeId: id }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setViewState((prev) => ({ ...prev, zoom: Math.max(0.3, Math.min(3, zoom)) }));
  }, []);

  const setPan = useCallback((x: number, y: number) => {
    setViewState((prev) => ({ ...prev, panX: x, panY: y }));
  }, []);

  const setIsAddingNode = useCallback((adding: boolean) => {
    setViewState((prev) => ({ ...prev, isAddingNode: adding, selectedNodeId: adding ? null : prev.selectedNodeId }));
  }, []);

  const setActiveFilter = useCallback((filter: NodeCategory | 'all') => {
    setViewState((prev) => ({ ...prev, activeFilter: filter }));
  }, []);

  const toggleInsights = useCallback(() => {
    setViewState((prev) => ({ ...prev, showInsights: !prev.showInsights }));
  }, []);

  // ── CRUD operations ────────────────────────────────────────────────────

  const createNode = useCallback(async (payload: CreateNodePayload) => {
    try {
      const newNode = await constellationService.createNode(payload);
      setData((prev) => ({
        ...prev,
        nodes: [...prev.nodes, newNode],
        lastUpdated: new Date().toISOString(),
      }));
      setViewState((prev) => ({ ...prev, isAddingNode: false, selectedNodeId: newNode.id }));
      toast.success('Node added to your constellation');
    } catch {
      toast.error('Failed to add node');
    }
  }, []);

  const updateNode = useCallback(async (nodeId: string, payload: UpdateNodePayload) => {
    try {
      const updated = await constellationService.updateNode(nodeId, payload);
      setData((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n) => (n.id === nodeId ? updated : n)),
        lastUpdated: new Date().toISOString(),
      }));
      toast.success('Node updated');
    } catch {
      toast.error('Failed to update node');
    }
  }, []);

  const deleteNode = useCallback(async (nodeId: string) => {
    try {
      await constellationService.deleteNode(nodeId);
      setData((prev) => ({
        ...prev,
        nodes: prev.nodes.filter((n) => n.id !== nodeId),
        connections: prev.connections.filter((c) => c.sourceId !== nodeId && c.targetId !== nodeId),
        lastUpdated: new Date().toISOString(),
      }));
      setViewState((prev) => ({
        ...prev,
        selectedNodeId: prev.selectedNodeId === nodeId ? null : prev.selectedNodeId,
      }));
      toast.success('Node removed from constellation');
    } catch {
      toast.error('Failed to remove node');
    }
  }, []);

  const moveNode = useCallback((nodeId: string, x: number, y: number) => {
    setData((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) =>
        n.id === nodeId ? { ...n, x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) } : n,
      ),
    }));
    // Debounced persistence would go here in production
  }, []);

  const createConnection = useCallback(async (payload: CreateConnectionPayload) => {
    try {
      const newConn = await constellationService.createConnection(payload);
      setData((prev) => ({
        ...prev,
        connections: [...prev.connections, newConn],
        lastUpdated: new Date().toISOString(),
      }));
      toast.success('Connection created');
    } catch {
      toast.error('Failed to create connection');
    }
  }, []);

  const deleteConnection = useCallback(async (connectionId: string) => {
    try {
      await constellationService.deleteConnection(connectionId);
      setData((prev) => ({
        ...prev,
        connections: prev.connections.filter((c) => c.id !== connectionId),
        lastUpdated: new Date().toISOString(),
      }));
      toast.success('Connection removed');
    } catch {
      toast.error('Failed to remove connection');
    }
  }, []);

  const markInsightRead = useCallback(async (insightId: string) => {
    try {
      await constellationService.markInsightRead(insightId);
      setData((prev) => ({
        ...prev,
        insights: prev.insights.map((i) => (i.id === insightId ? { ...i, isRead: true } : i)),
      }));
    } catch {
      // Silent fail for read marking
    }
  }, []);

  // ── Computed values ────────────────────────────────────────────────────

  const selectedNode = useMemo(
    () => data.nodes.find((n) => n.id === viewState.selectedNodeId) ?? null,
    [data.nodes, viewState.selectedNodeId],
  );

  const filteredNodes = useMemo(
    () =>
      viewState.activeFilter === 'all'
        ? data.nodes
        : data.nodes.filter((n) => n.category === viewState.activeFilter),
    [data.nodes, viewState.activeFilter],
  );

  const nodeConnections = useCallback(
    (nodeId: string) => data.connections.filter((c) => c.sourceId === nodeId || c.targetId === nodeId),
    [data.connections],
  );

  const unreadInsightCount = useMemo(() => data.insights.filter((i) => !i.isRead).length, [data.insights]);

  return {
    nodes: data.nodes,
    connections: data.connections,
    insights: data.insights,
    unreadInsightCount,
    isLoading,
    error,
    viewState,
    setSelectedNode,
    setHoveredNode,
    setZoom,
    setPan,
    setIsAddingNode,
    setActiveFilter,
    toggleInsights,
    createNode,
    updateNode,
    deleteNode,
    moveNode,
    createConnection,
    deleteConnection,
    markInsightRead,
    selectedNode,
    filteredNodes,
    nodeConnections,
    refetch: fetchData,
  };
}
