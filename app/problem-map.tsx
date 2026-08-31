"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { chapters } from "./book-data";
import { historyStages, stageDetailPanels } from "./history-data";
import { philosopherProfiles } from "./philosopher-data";
import { findSchoolProfilesByPhilosopher } from "./school-data";
import {
  ancientDifferenceProblemMap,
  problemConnectionNotes,
  problemRelationNotes,
  type ProblemConnectionKind,
  type ProblemEdge,
  type ProblemHistoryLink,
  type ProblemNode,
  type ProblemNodeKind,
  type ProblemRelationKind,
} from "./problem-map-data";
import {
  problemBoundaryNotes,
  problemComparisonFans,
  problemDensityOptions,
  problemFamilies,
  problemPhaseHistoryStageIds,
  type ProblemDensityId,
  type ProblemFamily,
} from "./problem-map-view-data";
import { SelfSummaryGraph } from "./problem-map-self";
import { selfNodeTopics } from "./knowledge-paths";
import {
  problemCompressionLevels,
  problemFacetOptions,
  nextSelfSummaryLevel,
  selfSummaryEntryNodeId,
  type ProblemCompressionLevel,
  type ProblemFacetId,
  type SelfSummaryLevel,
} from "./problem-map-self-data";
import { ACTIVE_TOPIC_STORAGE_KEY, isReadingTopic, nodeReadingTopics, resolveTopicUnit, restoreTopicView, selectedTopicNodeIds, topicForUnit, topicLabel, topicPreferenceKey, type ReadingTopicId } from "./reading-topics-data";

const GRAPH_WIDTH = 1280;
const NODE_WIDTH = 220;
const NODE_COMPACT_HEIGHT = 82;
const NODE_TITLE_LINE_HEIGHT = 19;
const GRAPH_TOP = 58;
const GRAPH_LEFT = 48;
const GRAPH_RIGHT = 48;
const MAX_GRAPH_LANE = 4.7;
const ROW_GAP = 32;
const NODE_GAP = 20;
const LANE_GAP = (GRAPH_WIDTH - GRAPH_LEFT - GRAPH_RIGHT - NODE_WIDTH) / MAX_GRAPH_LANE;
const DENSITY_STORAGE_KEY = "ahowp-problem-map-density";
const FACET_STORAGE_KEY = "ahowp-problem-map-facets";

function saveTopicPreference(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch { /* Reading still works when storage is unavailable. */ }
}

function readProblemPreference(key: string) {
  try { return window.localStorage.getItem(key); } catch { return null; }
}

const kindEnglish: Record<ProblemNodeKind, string> = {
  观察: "OBSERVATION",
  问题: "QUESTION",
  答案: "ANSWER",
};

const relationEnglish: Record<ProblemRelationKind, string> = {
  提出问题: "RAISES",
  回应问题: "ANSWERS",
  产生问题: "GENERATES",
};

const connectionClass: Record<ProblemConnectionKind, string> = {
  原书线索: "source",
  历史回应: "historical",
  同题并列: "parallel",
  本站推演: "reconstruction",
  后世重构: "retrospective",
};

type ChainGroup = {
  id: string;
  leaderId: string;
  nodeIds: string[];
};

type DisplayEdge = ProblemEdge & {
  folded: boolean;
  hiddenNodeCount: number;
  underlyingEdgeIds: string[];
  connectionKinds: ProblemConnectionKind[];
};

type GraphPoint = {
  x: number;
  y: number;
  row: number;
  lane: number;
};

const familyByAnchorNodeId = new Map<string, ProblemFamily>();
problemFamilies.forEach((family) => family.anchorNodeIds.forEach((nodeId) => {
  if (!familyByAnchorNodeId.has(nodeId)) familyByAnchorNodeId.set(nodeId, family);
}));

function splitTitle(title: string, limit = 13) {
  const lines: string[] = [];
  let line = "";
  let weight = 0;
  Array.from(title).forEach((character) => {
    const nextWeight = character.charCodeAt(0) <= 0x7f ? 0.55 : 1;
    if (line && weight + nextWeight > limit) {
      lines.push(line);
      line = character;
      weight = nextWeight;
    } else {
      line += character;
      weight += nextWeight;
    }
  });
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function nodeHeight(node: ProblemNode, chain?: ChainGroup) {
  const extraLines = Math.max(0, splitTitle(node.title).length - 2);
  return NODE_COMPACT_HEIGHT + extraLines * NODE_TITLE_LINE_HEIGHT + (chain ? 18 : 0);
}

function buildDegreeMaps(nodes: ProblemNode[], edges: ProblemEdge[]) {
  const incoming = new Map(nodes.map((node) => [node.id, [] as ProblemEdge[]]));
  const outgoing = new Map(nodes.map((node) => [node.id, [] as ProblemEdge[]]));
  edges.forEach((edge) => {
    incoming.get(edge.to)?.push(edge);
    outgoing.get(edge.from)?.push(edge);
  });
  return { incoming, outgoing };
}

function buildChainGroups(nodes: ProblemNode[], edges: ProblemEdge[], phaseIdByNodeId: Map<string, string>) {
  const { incoming, outgoing } = buildDegreeMaps(nodes, edges);
  const candidateIds = new Set(nodes
    .filter((node) => incoming.get(node.id)?.length === 1 && outgoing.get(node.id)?.length === 1)
    .map((node) => node.id));
  const starts = nodes.filter((node) => {
    if (!candidateIds.has(node.id)) return false;
    const predecessorId = incoming.get(node.id)?.[0]?.from;
    return !predecessorId
      || !candidateIds.has(predecessorId)
      || phaseIdByNodeId.get(predecessorId) !== phaseIdByNodeId.get(node.id);
  });
  const groups: ChainGroup[] = [];
  const visited = new Set<string>();

  starts.forEach((start) => {
    if (visited.has(start.id)) return;
    const nodeIds = [start.id];
    visited.add(start.id);
    let currentId = start.id;
    while (true) {
      const nextId = outgoing.get(currentId)?.[0]?.to;
      if (!nextId || !candidateIds.has(nextId) || visited.has(nextId)) break;
      if (phaseIdByNodeId.get(nextId) !== phaseIdByNodeId.get(start.id)) break;
      nodeIds.push(nextId);
      visited.add(nextId);
      currentId = nextId;
    }
    if (nodeIds.length >= 2) groups.push({ id: `chain-${start.id}`, leaderId: start.id, nodeIds });
  });
  return groups;
}

function buildDisplayEdges(edges: ProblemEdge[], visibleNodeIds: Set<string>, allowedNodeIds?: Set<string>) {
  const outgoing = new Map<string, ProblemEdge[]>();
  edges.forEach((edge) => outgoing.set(edge.from, [...(outgoing.get(edge.from) || []), edge]));
  const displayEdges: DisplayEdge[] = [];

  const follow = (sourceId: string, edge: ProblemEdge, path: ProblemEdge[], visitedNodeIds: Set<string>) => {
    if (allowedNodeIds && !allowedNodeIds.has(edge.to)) return;
    if (visitedNodeIds.has(edge.to)) return;
    if (visibleNodeIds.has(edge.to)) {
      const connectionKinds = [...new Set(path.map((item) => item.connection))];
      displayEdges.push({
        ...path[0],
        id: `display-${sourceId}-${path.map((item) => item.id).join("-")}`,
        from: sourceId,
        to: edge.to,
        label: path.length === 1 ? path[0].label : `折叠路径：${path.map((item) => item.label).join("；")}`,
        folded: path.length > 1,
        hiddenNodeCount: Math.max(0, path.length - 1),
        underlyingEdgeIds: path.map((item) => item.id),
        connectionKinds,
      });
      return;
    }
    const nextVisited = new Set(visitedNodeIds).add(edge.to);
    (outgoing.get(edge.to) || []).forEach((nextEdge) => follow(sourceId, nextEdge, [...path, nextEdge], nextVisited));
  };

  visibleNodeIds.forEach((sourceId) => {
    (outgoing.get(sourceId) || []).forEach((edge) => follow(sourceId, edge, [edge], new Set([sourceId])));
  });
  return displayEdges;
}

function buildGraphPoints(nodes: ProblemNode[], density: ProblemDensityId, chainByLeaderId: Map<string, ChainGroup>) {
  const points = new Map<string, GraphPoint>();
  const nodesByOriginalRow = new Map<number, ProblemNode[]>();
  nodes.forEach((node) => nodesByOriginalRow.set(node.graph.row, [...(nodesByOriginalRow.get(node.graph.row) || []), node]));
  let verticalCursor = GRAPH_TOP;
  let layoutRow = 0;

  [...nodesByOriginalRow.entries()].sort(([left], [right]) => left - right).forEach(([, rowNodes]) => {
    const subrows: ProblemNode[][] = [];
    const rightEdgesBySubrow: number[] = [];
    rowNodes.sort((left, right) => left.graph.lane - right.graph.lane).forEach((node) => {
      const lane = density === "guide" ? (familyByAnchorNodeId.get(node.id)?.lane ?? node.graph.lane) : node.graph.lane;
      const x = GRAPH_LEFT + lane * LANE_GAP;
      let subrow = rightEdgesBySubrow.findIndex((rightEdge) => rightEdge + NODE_GAP <= x);
      if (subrow < 0) {
        subrow = subrows.length;
        subrows.push([]);
        rightEdgesBySubrow.push(0);
      }
      subrows[subrow].push(node);
      rightEdgesBySubrow[subrow] = x + NODE_WIDTH;
    });

    subrows.forEach((subrowNodes) => {
      subrowNodes.forEach((node) => {
        const lane = density === "guide" ? (familyByAnchorNodeId.get(node.id)?.lane ?? node.graph.lane) : node.graph.lane;
        points.set(node.id, {
          x: GRAPH_LEFT + lane * LANE_GAP,
          y: verticalCursor,
          row: layoutRow,
          lane,
        });
      });
      verticalCursor += Math.max(...subrowNodes.map((node) => nodeHeight(node, chainByLeaderId.get(node.id)))) + ROW_GAP;
      layoutRow += 1;
    });
  });
  return points;
}

function edgePath(edge: DisplayEdge, nodesById: Map<string, ProblemNode>, points: Map<string, GraphPoint>, chainByLeaderId: Map<string, ChainGroup>) {
  const source = nodesById.get(edge.from);
  const target = nodesById.get(edge.to);
  const sourcePoint = points.get(edge.from);
  const targetPoint = points.get(edge.to);
  if (!source || !target || !sourcePoint || !targetPoint) return "";
  const startX = sourcePoint.x + NODE_WIDTH / 2;
  const startY = sourcePoint.y + nodeHeight(source, chainByLeaderId.get(source.id));
  const endX = targetPoint.x + NODE_WIDTH / 2;
  const endY = targetPoint.y;
  const bend = Math.max(42, (endY - startY) * 0.48);
  return `M ${startX} ${startY} C ${startX} ${startY + bend}, ${endX} ${endY - bend}, ${endX} ${endY}`;
}

export function ProblemMapView({ activePhaseId, activeNodeId, onPhaseChange, onNodeChange, onPhilosopher, onSchool, onHistory, onChapter, showEnglish, initialReadingTarget, onReadingTargetConsumed, originLabel, onBack }: {
  initialReadingTarget?: import("./knowledge-paths").ReadingTarget | null;
  onReadingTargetConsumed?: () => void;
  originLabel?: string;
  onBack?: () => void;
  activePhaseId: string;
  activeNodeId: string;
  onPhaseChange: (id: string) => void;
  onNodeChange: (id: string) => void;
  onPhilosopher: (id: string) => void;
  onSchool: (id: string) => void;
  onHistory: (link: ProblemHistoryLink, nodeId: string) => void;
  onChapter: (id: string) => void;
  showEnglish: boolean;
}) {
  const map = ancientDifferenceProblemMap;
  const [launch] = useState(initialReadingTarget);
  const launchTopic = launch?.topicId || topicForUnit(launch?.unitId) || "self";
  const [density, setDensity] = useState<ProblemDensityId>("standard");
  const [focusDepth, setFocusDepth] = useState<0 | 1 | 2>(0);
  const [expandedChainIds, setExpandedChainIds] = useState<Set<string>>(() => new Set());
  const [selectedFacetIds, setSelectedFacetIds] = useState<ProblemFacetId[]>(launch ? [launchTopic] : []);
  const [compressionLevel, setCompressionLevel] = useState<ProblemCompressionLevel>(launch?.level || "5");
  const [summaryUnitId, setSummaryUnitId] = useState(launch?.unitId || resolveTopicUnit(launchTopic, "5").id);
  const [pendingTopicTargetId, setPendingTopicTargetId] = useState<string | null>(launch ? launch.level === "all" ? `problem-node-${launch.nodeId}` : `self-summary-${resolveTopicUnit(launchTopic, launch.level, launch.unitId, launch.nodeId).id}` : null);
  const allNodes = useMemo(() => map.phases.flatMap((phase) => phase.nodes), [map.phases]);
  const nodesById = useMemo(() => new Map(allNodes.map((node) => [node.id, node])), [allNodes]);
  const phaseByNodeId = useMemo(() => new Map(map.phases.flatMap((phase) => phase.nodes.map((node) => [node.id, phase]))), [map.phases]);
  const phaseIdByNodeId = useMemo(() => new Map([...phaseByNodeId].map(([nodeId, phase]) => [nodeId, phase.id])), [phaseByNodeId]);
  const { incoming: incomingByNodeId, outgoing: outgoingByNodeId } = useMemo(() => buildDegreeMaps(allNodes, map.edges), [allNodes, map.edges]);
  const chainGroups = useMemo(() => buildChainGroups(allNodes, map.edges, phaseIdByNodeId), [allNodes, map.edges, phaseIdByNodeId]);
  const chainByNodeId = useMemo(() => new Map(chainGroups.flatMap((group) => group.nodeIds.map((nodeId) => [nodeId, group]))), [chainGroups]);
  const selectedTopics = useMemo(() => selectedFacetIds.filter(isReadingTopic), [selectedFacetIds]);
  const topicMode = selectedTopics.length > 0;
  const currentTopic = topicForUnit(summaryUnitId);
  const activeTopic = currentTopic && selectedTopics.includes(currentTopic) ? currentTopic : selectedTopics[0] || "self";
  const topicsLabel = selectedTopics.map(topicLabel).join(" / ");
  const topicSummaryLevel: "5" | "10" | "20" | null = topicMode && (compressionLevel === "5" || compressionLevel === "10" || compressionLevel === "20") ? compressionLevel : null;
  const parentSummaryLevel: SelfSummaryLevel | null = compressionLevel === "all" ? "20" : compressionLevel === "20" ? "10" : compressionLevel === "10" ? "5" : null;
  const summaryBackLabel = parentSummaryLevel ? `返回上一级：${parentSummaryLevel} 个总结节点` : "已是最上一级";
  const topicAtomicNodeIdSet = useMemo(() => selectedTopicNodeIds(selectedTopics), [selectedTopics]);
  const requestedNode = nodesById.get(activeNodeId);
  const selectedNode = topicMode && (!requestedNode || !topicAtomicNodeIdSet.has(requestedNode.id))
    ? allNodes.find((node) => topicAtomicNodeIdSet.has(node.id)) || allNodes[0]
    : requestedNode || allNodes[0];
  const selectedPhase = phaseByNodeId.get(selectedNode.id) || map.phases[0];
  const selectedChain = chainByNodeId.get(selectedNode.id);
  const incomingEdges = incomingByNodeId.get(selectedNode.id) || [];
  const outgoingEdges = outgoingByNodeId.get(selectedNode.id) || [];
  const densityOption = problemDensityOptions.find((option) => option.id === density) || problemDensityOptions[2];

  const focusNodeIds = useMemo(() => {
    if (!focusDepth || topicMode) return null;
    const visible = new Set([selectedNode.id]);
    let frontier = new Set([selectedNode.id]);
    for (let depth = 0; depth < focusDepth; depth += 1) {
      const next = new Set<string>();
      frontier.forEach((nodeId) => {
        [...(incomingByNodeId.get(nodeId) || []), ...(outgoingByNodeId.get(nodeId) || [])].forEach((edge) => {
          const adjacentId = edge.from === nodeId ? edge.to : edge.from;
          if (!visible.has(adjacentId)) next.add(adjacentId);
          visible.add(adjacentId);
        });
      });
      frontier = next;
    }
    return visible;
  }, [focusDepth, incomingByNodeId, outgoingByNodeId, selectedNode.id, topicMode]);

  const visibleNodeIds = useMemo(() => {
    if (topicMode) return topicAtomicNodeIdSet;
    if (focusNodeIds) return focusNodeIds;
    if (density === "complete" || density === "research") return new Set(allNodes.map((node) => node.id));
    if (density === "guide") {
      const visible = new Set(problemFamilies.flatMap((family) => family.anchorNodeIds));
      visible.add(selectedNode.id);
      return visible;
    }
    if (density === "backbone") {
      const landmarks = new Set(problemFamilies.flatMap((family) => family.anchorNodeIds));
      const visible = new Set(allNodes.filter((node) => {
        const incomingCount = incomingByNodeId.get(node.id)?.length || 0;
        const outgoingCount = outgoingByNodeId.get(node.id)?.length || 0;
        return incomingCount !== 1 || outgoingCount !== 1 || landmarks.has(node.id);
      }).map((node) => node.id));
      visible.add(selectedNode.id);
      return visible;
    }
    const visible = new Set(allNodes.map((node) => node.id));
    chainGroups.forEach((group) => {
      const selectedMemberNeedsExpansion = group.nodeIds.includes(selectedNode.id) && selectedNode.id !== group.leaderId;
      if (expandedChainIds.has(group.id) || selectedMemberNeedsExpansion) return;
      group.nodeIds.slice(1).forEach((nodeId) => visible.delete(nodeId));
    });
    return visible;
  }, [allNodes, chainGroups, density, expandedChainIds, focusNodeIds, incomingByNodeId, outgoingByNodeId, selectedNode.id, topicMode, topicAtomicNodeIdSet]);

  const displayNodes = useMemo(() => allNodes.filter((node) => visibleNodeIds.has(node.id)), [allNodes, visibleNodeIds]);
  const displayEdges = useMemo(() => buildDisplayEdges(map.edges, visibleNodeIds, topicMode ? topicAtomicNodeIdSet : undefined), [map.edges, topicAtomicNodeIdSet, topicMode, visibleNodeIds]);
  const collapsedChainByLeaderId = useMemo(() => {
    const result = new Map<string, ChainGroup>();
    if (topicMode || density !== "standard" || focusDepth) return result;
    chainGroups.forEach((group) => {
      if (!expandedChainIds.has(group.id) && visibleNodeIds.has(group.leaderId) && !visibleNodeIds.has(group.nodeIds[1])) result.set(group.leaderId, group);
    });
    return result;
  }, [chainGroups, density, expandedChainIds, focusDepth, topicMode, visibleNodeIds]);
  const layoutDensity = topicMode ? "complete" : density;
  const graphPoints = useMemo(() => buildGraphPoints(displayNodes, layoutDensity, collapsedChainByLeaderId), [collapsedChainByLeaderId, displayNodes, layoutDensity]);
  const graphHeight = Math.max(...displayNodes.map((node) => (graphPoints.get(node.id)?.y || 0) + nodeHeight(node, collapsedChainByLeaderId.get(node.id))), 180) + 70;
  const historyBands = useMemo(() => historyStages.map((stage) => {
    const stageNodes = displayNodes.filter((node) => {
      const phase = phaseByNodeId.get(node.id);
      return phase && problemPhaseHistoryStageIds[phase.id] === stage.id;
    });
    if (!stageNodes.length) return null;
    const top = Math.min(...stageNodes.map((node) => graphPoints.get(node.id)?.y || 0)) - 52;
    const bottom = Math.max(...stageNodes.map((node) => (graphPoints.get(node.id)?.y || 0) + nodeHeight(node, collapsedChainByLeaderId.get(node.id)))) + 28;
    return { stage, top, height: bottom - top };
  }).filter((band): band is NonNullable<typeof band> => Boolean(band)), [collapsedChainByLeaderId, displayNodes, graphPoints, phaseByNodeId]);
  const selectedHistoryStageId = problemPhaseHistoryStageIds[selectedPhase.id];
  const selectedFamily = familyByAnchorNodeId.get(selectedNode.id);
  const selectedBoundaryNotes = problemBoundaryNotes[selectedNode.id] || [];
  const selectedComparisonFan = problemComparisonFans.find((fan) => fan.questionId === selectedNode.id || fan.answerIds.includes(selectedNode.id));
  const comparisonNodeIds = new Set(selectedComparisonFan ? [selectedComparisonFan.questionId, ...selectedComparisonFan.answerIds] : []);
  const connectedDisplayEdges = displayEdges.filter((edge) => edge.from === selectedNode.id || edge.to === selectedNode.id);
  const connectedEdgeIds = new Set(connectedDisplayEdges.map((edge) => edge.id));
  const connectedNodeIds = new Set([selectedNode.id, ...connectedDisplayEdges.flatMap((edge) => [edge.from, edge.to]), ...comparisonNodeIds]);

  const relatedParticipants = useMemo(() => {
    const oneHopIds = new Set(map.edges.flatMap((edge) => edge.from === selectedNode.id ? [edge.to] : edge.to === selectedNode.id ? [edge.from] : []));
    let sourceNodes = selectedNode.participants.length > 0
      ? [selectedNode]
      : [...oneHopIds].map((id) => nodesById.get(id)).filter((node): node is ProblemNode => Boolean(node?.participants.length));
    if (!sourceNodes.length) {
      const twoHopIds = new Set(map.edges.flatMap((edge) => oneHopIds.has(edge.from) ? [edge.to] : oneHopIds.has(edge.to) ? [edge.from] : []));
      sourceNodes = [...twoHopIds].map((id) => nodesById.get(id)).filter((node): node is ProblemNode => Boolean(node?.participants.length));
    }
    const unique = new Map<string, ProblemNode["participants"][number]>();
    sourceNodes.flatMap((node) => node.participants).forEach((participant) => {
      const key = participant.philosopherId || participant.name;
      if (!unique.has(key)) unique.set(key, participant);
    });
    return [...unique.values()];
  }, [map.edges, nodesById, selectedNode]);
  const relatedSchools = useMemo(() => {
    const unique = new Map<string, ReturnType<typeof findSchoolProfilesByPhilosopher>[number]>();
    relatedParticipants.forEach((participant) => {
      if (!participant.philosopherId) return;
      findSchoolProfilesByPhilosopher(participant.philosopherId).forEach((school) => unique.set(school.id, school));
    });
    return [...unique.values()].sort((left, right) => left.order - right.order);
  }, [relatedParticipants]);

  const selectNode = (id: string) => {
    if (topicMode && topicAtomicNodeIdSet.has(id)) {
      const topic = nodeReadingTopics(id).includes(activeTopic) ? activeTopic : nodeReadingTopics(id).find((item) => selectedTopics.includes(item));
      if (topic) saveTopicPreference(topicPreferenceKey(topic, "node"), id);
    }
    if (topicMode && !topicAtomicNodeIdSet.has(id)) {
      // Following an evidence link may leave the curated topic. Show the actual
      // destination and its neighborhood instead of silently selecting the first self node.
      setSelectedFacetIds([]);
      saveTopicPreference(FACET_STORAGE_KEY, "[]");
      setFocusDepth(1);
    }
    const chain = chainByNodeId.get(id);
    if (chain && id !== chain.leaderId) setExpandedChainIds((current) => new Set(current).add(chain.id));
    const phase = phaseByNodeId.get(id);
    onNodeChange(id);
    if (phase) onPhaseChange(phase.id);
  };

  const toggleChain = (group: ChainGroup) => {
    setExpandedChainIds((current) => {
      const next = new Set(current);
      if (next.has(group.id)) next.delete(group.id);
      else next.add(group.id);
      return next;
    });
  };

  const collapseSelectedChain = (group: ChainGroup) => {
    setExpandedChainIds((current) => {
      const next = new Set(current);
      next.delete(group.id);
      return next;
    });
    selectNode(group.leaderId);
  };

  const changeDensity = (nextDensity: ProblemDensityId) => {
    setDensity(nextDensity);
    setFocusDepth(0);
    saveTopicPreference(DENSITY_STORAGE_KEY, nextDensity);
  };

  const toggleFacet = (facetId: ProblemFacetId) => {
    if (!isReadingTopic(facetId)) return;
    setPendingTopicTargetId(null);
    const next = selectedTopics.includes(facetId) ? selectedTopics.filter((id) => id !== facetId) : [...selectedTopics, facetId];
    setSelectedFacetIds(next);
    saveTopicPreference(FACET_STORAGE_KEY, JSON.stringify(next));
    const targetTopic = next.includes(facetId) ? facetId : next.includes(activeTopic) ? activeTopic : next[0];
    if (targetTopic) {
      const view = restoreTopicView(targetTopic, readProblemPreference);
      setCompressionLevel(view.level);
      setSummaryUnitId(view.unitId);
      saveTopicPreference(ACTIVE_TOPIC_STORAGE_KEY, targetTopic);
      if (view.level !== "all") setPendingTopicTargetId(`self-summary-${view.unitId}`);
      else {
        onNodeChange(view.nodeId);
        const phase = phaseByNodeId.get(view.nodeId);
        if (phase) onPhaseChange(phase.id);
        setPendingTopicTargetId(`problem-node-${view.nodeId}`);
      }
    }
    setFocusDepth(0);
  };

  const clearFacets = () => {
    setPendingTopicTargetId(null);
    setSelectedFacetIds([]);
    setFocusDepth(0);
    saveTopicPreference(FACET_STORAGE_KEY, "[]");
  };

  const selectSummaryUnit = (id: string) => {
    setSummaryUnitId(id);
    const topic = topicForUnit(id) || activeTopic;
    saveTopicPreference(topicPreferenceKey(topic, "summary"), id);
    saveTopicPreference(topicPreferenceKey(topic, "compression"), compressionLevel);
    saveTopicPreference(ACTIVE_TOPIC_STORAGE_KEY, topic);
  };

  const openTopicAtomicNode = (nodeId: string, topic = activeTopic) => {
    if (!topicAtomicNodeIdSet.has(nodeId)) return;
    setCompressionLevel("all");
    saveTopicPreference(topicPreferenceKey(topic, "compression"), "all");
    saveTopicPreference(topicPreferenceKey(topic, "node"), nodeId);
    selectNode(nodeId);
    setPendingTopicTargetId(`problem-node-${nodeId}`);
  };

  const showTopicSummary = (level: SelfSummaryLevel, fromUnitId?: string) => {
    const contextUnitId = fromUnitId || summaryUnitId;
    const fromTopic = topicForUnit(contextUnitId);
    const topic = fromTopic && selectedTopics.includes(fromTopic) && (compressionLevel !== "all" || nodeReadingTopics(selectedNode.id).includes(fromTopic)) ? fromTopic
      : nodeReadingTopics(selectedNode.id).includes(activeTopic) ? activeTopic
      : nodeReadingTopics(selectedNode.id).find((id) => selectedTopics.includes(id)) || activeTopic;
    const unit = resolveTopicUnit(topic, level, contextUnitId, selectedNode.id, compressionLevel === "all");
    selectSummaryUnit(unit.id);
    setCompressionLevel(level);
    saveTopicPreference(topicPreferenceKey(topic, "compression"), level);
    setPendingTopicTargetId(`self-summary-${unit.id}`);
  };

  const changeCompression = (nextLevel: ProblemCompressionLevel, fromUnitId = summaryUnitId) => {
    if (nextLevel === "all") {
      const unit = topicSummaryLevel ? resolveTopicUnit(topicForUnit(fromUnitId) || activeTopic, topicSummaryLevel, fromUnitId) : null;
      if (unit) selectSummaryUnit(unit.id);
      openTopicAtomicNode((unit && selfSummaryEntryNodeId(unit)) || selectedNode.id, topicForUnit(unit?.id) || activeTopic);
      return;
    }
    showTopicSummary(nextLevel, topicSummaryLevel ? fromUnitId : undefined);
  };

  const locateNodeInTopic = (topic: ReadingTopicId, nodeId: string) => {
    const unit = resolveTopicUnit(topic, "20", undefined, nodeId);
    setSelectedFacetIds([topic]);
    setSummaryUnitId(unit.id);
    setCompressionLevel("20");
    setFocusDepth(0);
    saveTopicPreference(FACET_STORAGE_KEY, JSON.stringify([topic]));
    saveTopicPreference(ACTIVE_TOPIC_STORAGE_KEY, topic);
    saveTopicPreference(topicPreferenceKey(topic, "summary"), unit.id);
    saveTopicPreference(topicPreferenceKey(topic, "compression"), "20");
    saveTopicPreference(topicPreferenceKey(topic, "node"), nodeId);
    onNodeChange(nodeId);
    setPendingTopicTargetId(`self-summary-${unit.id}`);
  };

  const densityIndex = problemDensityOptions.findIndex((option) => option.id === density);

  useEffect(() => {
    const savedDensity = readProblemPreference(DENSITY_STORAGE_KEY) as ProblemDensityId | null;
    if (!savedDensity || !problemDensityOptions.some((option) => option.id === savedDensity)) return;
    const frame = window.requestAnimationFrame(() => setDensity(savedDensity));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (launch) {
      saveTopicPreference(FACET_STORAGE_KEY, JSON.stringify([launchTopic]));
      saveTopicPreference(ACTIVE_TOPIC_STORAGE_KEY, launchTopic);
      saveTopicPreference(topicPreferenceKey(launchTopic, "compression"), launch.level);
      saveTopicPreference(topicPreferenceKey(launchTopic, "summary"), launch.unitId);
      saveTopicPreference(topicPreferenceKey(launchTopic, "node"), launch.nodeId);
      onReadingTargetConsumed?.();
      return;
    }
    const savedFacets = readProblemPreference(FACET_STORAGE_KEY);
    const frame = window.requestAnimationFrame(() => {
      let topics: ReadingTopicId[] = [];
      if (savedFacets) {
        try {
          const parsed: unknown = JSON.parse(savedFacets);
          topics = Array.isArray(parsed) ? [...new Set(parsed.filter(isReadingTopic))] : [];
          setSelectedFacetIds(topics);
        } catch {
          saveTopicPreference(FACET_STORAGE_KEY, null);
        }
      }
      const savedTopic = readProblemPreference(ACTIVE_TOPIC_STORAGE_KEY);
      const topic = isReadingTopic(savedTopic) && topics.includes(savedTopic) ? savedTopic : topics[0] || "self";
      const view = restoreTopicView(topic, readProblemPreference);
      setCompressionLevel(view.level);
      setSummaryUnitId(view.unitId);
      saveTopicPreference(topicPreferenceKey(topic, "compression"), view.level);
      if (topics.length && view.level === "all") {
        onNodeChange(view.nodeId);
        const phase = phaseByNodeId.get(view.nodeId);
        if (phase) onPhaseChange(phase.id);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [launch, launchTopic, onReadingTargetConsumed, onNodeChange, onPhaseChange, phaseByNodeId]);

  useEffect(() => {
    if (!topicMode || !pendingTopicTargetId) return;
    // Wait for the new SVG and its layout before locating a child or atomic node.
    let frame = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(() => {
        const target = document.getElementById(pendingTopicTargetId);
        if (target) {
          target.focus({ preventScroll: true });
          target.scrollIntoView({ behavior: "instant", block: "center", inline: "nearest" });
        }
        setPendingTopicTargetId(null);
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pendingTopicTargetId, topicMode, topicSummaryLevel]);

  useEffect(() => {
    if (topicMode) return;
    if (selectedPhase.id === activePhaseId) return;
    const phase = map.phases.find((item) => item.id === activePhaseId);
    const target = phase?.nodes.find((node) => node.kind === "问题") || phase?.nodes[0];
    if (!target) return;
    const frame = window.requestAnimationFrame(() => onNodeChange(target.id));
    return () => window.cancelAnimationFrame(frame);
  }, [activePhaseId, map.phases, onNodeChange, selectedPhase.id, topicMode]);

  return <article className="problem-map-page page-wrap">
    {onBack && <button className="context-back" onClick={onBack}><span>←</span><small>返回刚才的阅读位置</small><b>{originLabel}</b></button>}
    <header className="problem-map-hero">
      <div className="problem-map-mark"><span>?</span><small>PROBLEM<br />GENEALOGY</small></div>
      <div className="problem-map-title">
        <p className="eyebrow">{map.period}</p>
        <h2>{map.title}</h2>
        <p className="problem-map-english">{map.english}</p>
        <blockquote>{map.thesis}</blockquote>
      </div>
      <aside className="problem-map-facts">
        <div><span>当前范围</span><b>泰勒斯 → 罗素</b></div>
        <div><span>节点语法</span><b>观察 · 问题 · 答案</b></div>
        <div><span>原子节点</span><b>{allNodes.length} 个</b></div>
        <div><span>关系连线</span><b>{map.edges.length} 条</b></div>
      </aside>
    </header>

    <aside className="problem-map-boundary"><span>阅读边界</span><p>{map.scopeNote}</p></aside>

    <section className="problem-map-controls" aria-label="图谱图例与组织尺度">
      <div className={`problem-control-main ${topicMode ? "topic-mode" : "full-mode"}`}>
        <div className="problem-facet-controls" role="group" aria-label="主题筛选，可多选">
          <span><small>01</small>阅读主题</span>
          <button type="button" className={selectedFacetIds.length === 0 ? "active" : ""} aria-pressed={selectedFacetIds.length === 0} onClick={clearFacets}>全图</button>
          {problemFacetOptions.map((option) => <button type="button" className={selectedFacetIds.includes(option.id) ? "active" : ""} aria-pressed={selectedFacetIds.includes(option.id)} disabled={!option.available} title={option.available ? option.question : `${option.label}主题尚未整理独立分层路径`} onClick={() => toggleFacet(option.id)} key={option.id}>{option.label}</button>)}
        </div>
        {topicMode ? <div className="problem-compression-controls" role="group" aria-label={`${topicsLabel}主题总结层级`}>
          <span><small>02</small>{selectedTopics.length > 1 ? "并列层级" : "阅读层级"}</span>
          {problemCompressionLevels.map((option) => <button type="button" className={compressionLevel === option.id ? "active" : ""} aria-pressed={compressionLevel === option.id} title={option.note} onClick={() => changeCompression(option.id)} key={option.id}>{option.label}</button>)}
          <button type="button" className="problem-compression-back" disabled={!parentSummaryLevel} aria-label={summaryBackLabel} title={summaryBackLabel} onClick={() => { if (parentSummaryLevel) showTopicSummary(parentSummaryLevel, topicSummaryLevel ? summaryUnitId : undefined); }}><span aria-hidden="true">←</span></button>
        </div> : <>
          <div className="problem-density-slider" data-tooltip={`${densityOption.description} 当前显示 ${displayNodes.length}／${allNodes.length} 个节点。`}>
            <label htmlFor="problem-density"><span><small>02</small>组织尺度</span><b>{densityOption.label}</b></label>
            <input id="problem-density" type="range" min="0" max={problemDensityOptions.length - 1} step="1" value={densityIndex} aria-valuetext={`${densityOption.label}模式：${densityOption.description}`} onChange={(event) => changeDensity(problemDensityOptions[Number(event.target.value)].id)} />
            <div aria-hidden="true">{problemDensityOptions.map((option) => <span className={option.id === density ? "active" : ""} key={option.id}>{option.label}</span>)}</div>
          </div>
          <div className="problem-focus-controls" role="group" aria-label="局部聚焦范围" data-tooltip="只显示当前节点前后的一跳或两跳关系；可随时返回完整图谱。">
            <span><small>03</small>局部聚焦</span>
            <button type="button" className={focusDepth === 1 ? "active" : ""} aria-pressed={focusDepth === 1} onClick={() => setFocusDepth(focusDepth === 1 ? 0 : 1)}>一跳</button>
            <button type="button" className={focusDepth === 2 ? "active" : ""} aria-pressed={focusDepth === 2} onClick={() => setFocusDepth(focusDepth === 2 ? 0 : 2)}>两跳</button>
            {focusDepth > 0 && <button type="button" className="reset" onClick={() => setFocusDepth(0)}>全图</button>}
          </div>
        </>}
      </div>
      <div className="problem-control-reference" aria-label="图谱图例">
        <div className="problem-control-legend" aria-label="节点类型">
          <span className="problem-control-label">节点</span>
          {(Object.keys(kindEnglish) as ProblemNodeKind[]).map((kind) => <span className={`problem-control-token kind-${kind}`} data-tooltip={`${kindEnglish[kind]}：${kind === "观察" ? "记录使问题出现的经验、实践或历史条件。" : kind === "问题" ? "明确尚待回答的解释压力。" : "对问题提出的区分、反驳、修复或综合。"}`} key={kind}><i aria-hidden="true" />{kind}</span>)}
        </div>
        <div className="problem-control-legend" aria-label="关系类型">
          <span className="problem-control-label">箭头</span>
          {(Object.keys(problemRelationNotes) as ProblemRelationKind[]).map((relation) => <span className="problem-control-token relation" data-tooltip={`${relationEnglish[relation]}：${problemRelationNotes[relation]}`} key={relation}><i aria-hidden="true" />{relation}</span>)}
        </div>
      </div>
    </section>

    {!topicMode && density === "guide" && <section className="problem-family-legend" aria-label="导览问题家族">{problemFamilies.map((family) => <article key={family.id} data-tooltip={family.description}><i style={{ "--family-lane": family.lane } as CSSProperties} /><b>{family.label}</b><small>{family.english}</small></article>)}</section>}

    {topicSummaryLevel ? <SelfSummaryGraph topicIds={selectedTopics} level={topicSummaryLevel} allNodes={allNodes} phaseByNodeId={phaseByNodeId} selectedUnitId={summaryUnitId} onUnitSelect={selectSummaryUnit} onDrillDown={(unit) => changeCompression(nextSelfSummaryLevel(topicSummaryLevel), unit.id)} onAtomicNode={openTopicAtomicNode} /> : <section className="problem-graph-workspace" id="problem-graph">
      <div className="problem-graph-panel">
        <header className="problem-graph-toolbar">
          <div><p className="section-label">DIRECTED PROBLEM GRAPH</p><h3>{topicMode ? `${topicsLabel} · ${displayNodes.length} 个相关原子节点` : focusDepth ? `局部聚焦 · 前后 ${focusDepth} 跳` : "观察提出问题，答案又产生问题"}</h3></div>
          {topicMode && <p className="problem-graph-fit-note">已到最细一层；单击节点查看解释与原书入口。</p>}
        </header>

        <div className="problem-graph-scroll" role="region" aria-label="观察、问题与答案的有向关系图">
          <svg viewBox={`0 0 ${GRAPH_WIDTH} ${graphHeight}`} role="img" aria-label={`${map.title}：当前显示 ${displayNodes.length} 个节点、${displayEdges.length} 条可见路径`}>
            <defs>
              <marker id="problem-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L7,3 z" fill="context-stroke" />
              </marker>
            </defs>

            <g className="problem-graph-phases">
              {historyBands.map((band, index) => <g className={band.stage.id === selectedHistoryStageId ? "active" : ""} role="button" tabIndex={0} aria-label={`进入历史概览：${band.stage.title}`} onClick={() => onHistory({ stageId: band.stage.id, label: band.stage.title, note: "从问题图谱的历史时期背景带进入历史概览。" }, selectedNode.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onHistory({ stageId: band.stage.id, label: band.stage.title, note: "从问题图谱的历史时期背景带进入历史概览。" }, selectedNode.id); } }} key={band.stage.id}>
                <rect className={index % 2 ? "phase-even" : "phase-odd"} x="0" y={band.top} width={GRAPH_WIDTH} height={band.height} />
                <rect className="phase-label" x={GRAPH_LEFT} y={band.top + 8} width="206" height="29" rx="3" />
                <text className="phase-label-text" x={GRAPH_LEFT + 10} y={band.top + 20}>{band.stage.title}<tspan className="phase-label-years" dx="9">{band.stage.years}</tspan></text>
              </g>)}
            </g>

            <g className="problem-graph-edges">
              {displayEdges.map((edge) => {
                const connected = connectedEdgeIds.has(edge.id);
                const edgeConnectionClass = edge.connectionKinds.length === 1 ? connectionClass[edge.connectionKinds[0]] : "mixed";
                return <g className={connected ? "connected" : ""} key={edge.id}>
                  <path className={`problem-graph-edge relation-${edge.relation} connection-${edgeConnectionClass}${edge.folded ? " folded" : ""}`} d={edgePath(edge, nodesById, graphPoints, collapsedChainByLeaderId)} markerEnd="url(#problem-arrow)">
                    <title>{`${edge.folded ? `折叠 ${edge.hiddenNodeCount} 个中间节点。` : ""}${edge.label} · ${edge.connectionKinds.join("／")}`}</title>
                  </path>
                </g>;
              })}
            </g>

            <g className="problem-graph-nodes">
              {displayNodes.map((node) => {
                const point = graphPoints.get(node.id);
                if (!point) return null;
                const selected = node.id === selectedNode.id;
                const connected = connectedNodeIds.has(node.id);
                const collapsedChain = collapsedChainByLeaderId.get(node.id);
                const lines = splitTitle(node.title);
                const height = nodeHeight(node, collapsedChain);
                const family = familyByAnchorNodeId.get(node.id);
                return <g className={`problem-graph-node kind-${node.kind}${selected ? " selected" : ""}${connected ? " connected" : ""}${collapsedChain ? " folded-chain" : ""}${comparisonNodeIds.has(node.id) ? " comparison-peer" : ""}`} id={`problem-node-${node.id}`} key={node.id} role="button" tabIndex={0} aria-label={`${node.kind}${node.answerRole ? `，${node.answerRole}型答案` : ""}：${node.title}${collapsedChain ? `，包含 ${collapsedChain.nodeIds.length} 个连续节点` : ""}`} transform={`translate(${point.x}, ${point.y})`} onClick={() => { if (collapsedChain) toggleChain(collapsedChain); selectNode(node.id); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); if (collapsedChain) toggleChain(collapsedChain); selectNode(node.id); } }}>
                  {collapsedChain && <><rect className="problem-chain-shadow shadow-two" x="7" y="7" width={NODE_WIDTH} height={height} rx="7" /><rect className="problem-chain-shadow shadow-one" x="3.5" y="3.5" width={NODE_WIDTH} height={height} rx="7" /></>}
                  <rect width={NODE_WIDTH} height={height} rx="7" />
                  <text className="problem-graph-node-meta" x="13" y="18">{String(allNodes.indexOf(node) + 1).padStart(2, "0")} · {family && density === "guide" ? family.label : kindEnglish[node.kind]}{node.answerRole && density !== "guide" ? ` · ${node.answerRole}` : ""}</text>
                  <text className="problem-graph-node-title" x="13" y="41">{lines.map((line, lineIndex) => <tspan x="13" dy={lineIndex === 0 ? 0 : NODE_TITLE_LINE_HEIGHT} key={`${node.id}-${lineIndex}`}>{line}</tspan>)}</text>
                  {collapsedChain && <text className="problem-chain-count" x="13" y={height - 9}>{collapsedChain.nodeIds.length} 个连续节点 · 点击展开</text>}
                  <circle cx={NODE_WIDTH - 14} cy="14" r="3.5" />
                </g>;
              })}
            </g>
          </svg>
        </div>

        <footer className="problem-graph-evidence">
          {(Object.keys(problemConnectionNotes) as ProblemConnectionKind[]).map((kind) => <span className={`connection-${connectionClass[kind]}`} title={problemConnectionNotes[kind]} key={kind}><i aria-hidden="true" />{kind}</span>)}
          {displayEdges.some((edge) => edge.folded) && <span className="connection-folded"><i aria-hidden="true" />折叠路径</span>}
        </footer>
      </div>

      <aside className={`problem-node-detail kind-${selectedNode.kind}`} aria-live="polite">
        <header>
          <div><span>{selectedNode.kind}</span>{selectedNode.answerRole && <em>{selectedNode.answerRole}型答案</em>}</div>
          <small>{kindEnglish[selectedNode.kind]} · {incomingEdges.length} 条进入 / {outgoingEdges.length} 条发出</small>
          <h3>{selectedNode.title}</h3>
          {topicMode && <small>相接维度 · {selfNodeTopics(selectedNode.id).join(" / ")}</small>}
          <p>{selectedNode.summary}</p>
        </header>

        <div className="problem-node-detail-logic">
          <section><span>为什么进入图谱</span><p>{selectedNode.pressure}</p></section>
          <section><span>它又留下什么</span><p>{selectedNode.consequence}</p></section>
        </div>

        <div className="problem-node-detail-links">
          {nodeReadingTopics(selectedNode.id).length > 0 && <section className="problem-history-links"><span>从其他角度看同一论证</span>{nodeReadingTopics(selectedNode.id).map((topic) => <button type="button" key={topic} onClick={() => locateNodeInTopic(topic, selectedNode.id)}>在{topicLabel(topic)}主线定位 →</button>)}</section>}
          {topicMode && <section className="problem-history-links"><span>在历史中定位</span><button type="button" onClick={() => onHistory({
            stageId: problemPhaseHistoryStageIds[selectedPhase.id],
            label: selectedPhase.title,
            note: "这是论证所在的历史阶段，不把历史背景当作观点的充分原因。",
          }, selectedNode.id)}><b>{historyStages.find((stage) => stage.id === problemPhaseHistoryStageIds[selectedPhase.id])?.title}</b><em>{selectedPhase.title}</em></button></section>}
          {selectedBoundaryNotes.length > 0 && <section className="problem-explanation-boundary"><span>解释边界</span>{selectedBoundaryNotes.map((boundary) => <article key={`${selectedNode.id}-${boundary.label}`}><b>{boundary.label}</b><p>{boundary.note}</p></article>)}</section>}
          {selectedFamily && <section className="problem-family-context"><span>问题家族</span><b>{selectedFamily.label}</b><small>{selectedFamily.english}</small><p>{selectedFamily.description}</p></section>}
          {selectedChain && <section className="problem-chain-detail"><span>连续论证链</span><p>这一链包含 {selectedChain.nodeIds.length} 个原子节点；折叠只改变显示，不改变节点 ID 与关系。</p><div>{selectedChain.nodeIds.map((nodeId, index) => {
            const node = nodesById.get(nodeId);
            return node ? <button type="button" className={node.id === selectedNode.id ? "active" : ""} onClick={() => selectNode(node.id)} key={node.id}><small>{String(index + 1).padStart(2, "0")} · {node.kind}</small><b>{node.title}</b></button> : null;
          })}</div><button type="button" className="problem-chain-toggle" onClick={() => expandedChainIds.has(selectedChain.id) || selectedNode.id !== selectedChain.leaderId ? collapseSelectedChain(selectedChain) : toggleChain(selectedChain)}>{expandedChainIds.has(selectedChain.id) || selectedNode.id !== selectedChain.leaderId ? "收起为论证链" : "在图中展开全部步骤"}</button></section>}
          {selectedComparisonFan && <section className="problem-comparison-fan"><span>并行答案扇面</span><b>{selectedComparisonFan.label}</b><p>{selectedComparisonFan.note}</p><div><button type="button" className={selectedNode.id === selectedComparisonFan.questionId ? "active" : ""} onClick={() => selectNode(selectedComparisonFan.questionId)}>共同问题</button>{selectedComparisonFan.answerIds.map((answerId) => {
            const answer = nodesById.get(answerId);
            return answer ? <button type="button" className={selectedNode.id === answerId ? "active" : ""} onClick={() => selectNode(answerId)} key={answerId}>{answer.title}</button> : null;
          })}</div></section>}
          {(topicMode || density === "research") && <section className="problem-edge-audit"><span>关系与证据</span><div>{[...incomingEdges.map((edge) => ({ edge, adjacentId: edge.from, direction: "进入" })), ...outgoingEdges.map((edge) => ({ edge, adjacentId: edge.to, direction: "发出" }))].map(({ edge, adjacentId, direction }) => {
            const adjacent = nodesById.get(adjacentId);
            return <button type="button" onClick={() => selectNode(adjacentId)} key={edge.id}><small>{direction} · {edge.relation} · {edge.connection}</small><b>{adjacent?.title}</b><em>{edge.label}</em></button>;
          })}</div></section>}
          {selectedNode.observation && <section className="problem-observation-context">
            <span>观察范围</span>
            <div className="problem-observation-domain"><b>{selectedNode.observation.domain}</b><p>{selectedNode.observation.note}</p></div>
            {(selectedNode.observation.historyLinks?.length || 0) > 0 && <div className="problem-history-links"><small>关联历史概览</small>{selectedNode.observation.historyLinks?.map((link) => {
              const stage = historyStages.find((item) => item.id === link.stageId);
              const event = stageDetailPanels[link.stageId]?.events.find((item) => item.id === link.eventId);
              return stage ? <button type="button" key={`${selectedNode.id}-${link.stageId}-${link.eventId || link.responseId || "stage"}`} onClick={() => onHistory(link, selectedNode.id)}><small>{stage.years} · {stage.title}</small><b>{event?.title || link.label}</b><em>{link.note}</em><i aria-hidden="true">↗</i></button> : null;
            })}</div>}
          </section>}
          <section className="problem-participants"><span>对应哲学家</span><div>{relatedParticipants.length > 0 ? relatedParticipants.map((participant) => {
            const profile = participant.philosopherId ? philosopherProfiles.find((item) => item.id === participant.philosopherId) : undefined;
            return participant.philosopherId && profile
              ? <button key={`${selectedNode.id}-${participant.name}`} onClick={() => onPhilosopher(participant.philosopherId!)}><b>{participant.name}</b>{showEnglish && <small>{profile.nameEn}</small>}<em>{participant.role}</em><i aria-hidden="true">↗</i></button>
              : <span className="problem-participant-pending" key={`${selectedNode.id}-${participant.name}`}><b>{participant.name}</b><em>{participant.role}</em><small>人物页待补</small></span>;
          }) : <p>这一节点暂未连接到可核验的人物页面。</p>}</div></section>
          <section className="problem-school-links"><span>对应哲学流派与传统</span><div>{relatedSchools.length > 0 ? relatedSchools.map((school) => <button key={`${selectedNode.id}-${school.id}`} onClick={() => onSchool(school.id)}><b>{school.nameZh}</b>{showEnglish && <small>{school.nameEn}</small>}<em>{school.kind}</em><i aria-hidden="true">↗</i></button>) : <p>现有流派页面中尚无可直接对应的规范分类。</p>}</div></section>
          <section className="problem-chapter-links"><span>回到原书</span><div>{selectedNode.chapterIds.map((id) => {
            const chapter = chapters.find((item) => item.id === id);
            return chapter ? <button key={`${selectedNode.id}-${id}`} onClick={() => onChapter(id)}><small>{chapter.roman}</small><b>{chapter.title}</b></button> : null;
          })}</div></section>
        </div>
      </aside>
    </section>}

  </article>;
}
