"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import {
  drag,
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  select,
  zoom,
  zoomIdentity,
  type Simulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
  type ZoomBehavior,
} from "d3";

export type ForceGraphNode = {
  id: string;
  order: number;
  label: string;
  subtitle: string;
  group: string;
};

export type ForceGraphLink = {
  id: string;
  source: string;
  target: string;
  relation: string;
  directed: boolean;
  reciprocal?: boolean;
};

type RuntimeNode = ForceGraphNode & SimulationNodeDatum & { radius: number };
type RuntimeLink = Omit<ForceGraphLink, "source" | "target"> &
  SimulationLinkDatum<RuntimeNode> & { source: string | RuntimeNode; target: string | RuntimeNode };

type ForceGraphProps = {
  variant: "typed" | "relation";
  title: string;
  description: string;
  ariaLabel: string;
  nodes: ForceGraphNode[];
  links: ForceGraphLink[];
  relationColors: Record<string, string>;
  focusedId: string | null;
  onFocus: (id: string | null) => void;
};

const width = 1000;
const height = 440;
const groupPalette = ["#a63d31", "#314b3d", "#77546d", "#b4772f", "#4e7080", "#7b6b3f", "#8b5f3c", "#665c87", "#3f6c72"];

const endpointId = (endpoint: string | RuntimeNode) => typeof endpoint === "string" ? endpoint : endpoint.id;

const splitLabel = (label: string) => {
  if (label.length <= 9) return [label];
  const first = label.slice(0, 9);
  const remainder = label.slice(9);
  return [first, remainder.length > 9 ? `${remainder.slice(0, 8)}…` : remainder];
};

export function D3ForceGraph({
  variant,
  title,
  description,
  ariaLabel,
  nodes,
  links,
  relationColors,
  focusedId,
  onFocus,
}: ForceGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<Simulation<RuntimeNode, RuntimeLink> | null>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const runtimeNodesRef = useRef<RuntimeNode[]>([]);
  const markerPrefix = useId().replaceAll(":", "");
  const groups = useMemo(() => [...new Set(nodes.map((node) => node.group))], [nodes]);
  const groupColors = useMemo(() => new Map(groups.map((group, index) => [group, groupPalette[index % groupPalette.length]])), [groups]);
  const relationTypes = useMemo(() => Object.keys(relationColors).filter((relation) => links.some((link) => link.relation === relation)), [links, relationColors]);

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const degree = new Map<string, number>();
    links.forEach((link) => {
      degree.set(link.source, (degree.get(link.source) || 0) + 1);
      degree.set(link.target, (degree.get(link.target) || 0) + 1);
    });
    const runtimeNodes: RuntimeNode[] = nodes.map((node, index) => {
      const angle = (index / Math.max(1, nodes.length)) * Math.PI * 2;
      const relationRadius = Math.min(22, 10 + Math.sqrt(degree.get(node.id) || 1) * 2.25);
      return {
        ...node,
        radius: variant === "typed" ? 16 : relationRadius,
        x: width / 2 + Math.cos(angle) * width * .28,
        y: height / 2 + Math.sin(angle) * height * .28,
      };
    });
    const runtimeLinks: RuntimeLink[] = links.map((link) => ({ ...link }));
    runtimeNodesRef.current = runtimeNodes;

    const svg = select(svgElement);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const defs = svg.append("defs");
    const markerIds = new Map<string, string>();
    relationTypes.forEach((relation, index) => {
      const id = `${markerPrefix}-${variant}-${index}`;
      markerIds.set(relation, id);
      defs.append("marker")
        .attr("id", id)
        .attr("markerWidth", 8)
        .attr("markerHeight", 8)
        .attr("refX", 7)
        .attr("refY", 4)
        .attr("orient", "auto")
        .attr("markerUnits", "strokeWidth")
        .append("path")
        .attr("d", "M 0 0 L 8 4 L 0 8 z")
        .attr("fill", relationColors[relation] || "#6d736e");
    });

    const root = svg.append("g").attr("class", "d3-force-root");
    root.append("rect")
      .attr("class", "d3-force-background")
      .attr("width", width)
      .attr("height", height)
      .on("click", () => onFocus(null));

    const linkSelection = root.append("g")
      .attr("class", "d3-force-links")
      .selectAll<SVGLineElement, RuntimeLink>("line")
      .data(runtimeLinks)
      .join("line")
      .attr("class", "d3-force-link")
      .attr("data-link-id", (link) => link.id)
      .attr("data-source-id", (link) => endpointId(link.source))
      .attr("data-target-id", (link) => endpointId(link.target))
      .attr("data-relation", (link) => link.relation)
      .attr("stroke", (link) => relationColors[link.relation] || "#6d736e")
      .attr("stroke-dasharray", (link) => link.reciprocal ? "6 5" : null)
      .attr("marker-end", (link) => link.directed ? `url(#${markerIds.get(link.relation)})` : null);

    const nodeSelection = root.append("g")
      .attr("class", "d3-force-nodes")
      .selectAll<SVGGElement, RuntimeNode>("g")
      .data(runtimeNodes)
      .join("g")
      .attr("class", `d3-force-node d3-force-node-${variant}`)
      .attr("data-node-id", (node) => node.id)
      .attr("role", "button")
      .attr("tabindex", 0)
      .attr("aria-label", (node) => `聚焦：${node.label}，${node.subtitle}`)
      .on("click", (event, node) => {
        event.stopPropagation();
        onFocus(node.id);
      })
      .on("keydown", (event, node) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        onFocus(node.id);
      });

    nodeSelection.append("circle")
      .attr("r", (node) => node.radius)
      .attr("fill", (node) => variant === "typed" ? groupColors.get(node.group) || groupPalette[0] : "#faf8f2")
      .attr("stroke", (node) => variant === "typed" ? "#faf8f2" : groupColors.get(node.group) || "#314b3d")
      .attr("stroke-width", (node) => variant === "relation" ? Math.min(4, 1.4 + (degree.get(node.id) || 0) * .12) : 2);

    nodeSelection.append("text")
      .attr("class", "d3-force-index")
      .attr("text-anchor", "middle")
      .attr("dy", ".34em")
      .text((node) => String(node.order).padStart(2, "0"));

    const labels = nodeSelection.append("text").attr("class", "d3-force-label");
    labels.each(function (node) {
      const text = select(this);
      splitLabel(node.label).forEach((line, index) => {
        text.append("tspan")
          .attr("x", node.radius + 7)
          .attr("dy", index === 0 ? "-.16em" : "1.22em")
          .text(line);
      });
      if (variant === "typed") {
        text.append("tspan")
          .attr("class", "d3-force-sublabel")
          .attr("x", node.radius + 7)
          .attr("dy", "1.3em")
          .text(node.group);
      }
    });

    const linkForce = forceLink<RuntimeNode, RuntimeLink>(runtimeLinks)
      .id((node) => node.id)
      .distance(variant === "typed" ? 105 : 82)
      .strength(variant === "typed" ? .34 : .62);
    const simulation = forceSimulation<RuntimeNode>(runtimeNodes)
      .force("link", linkForce)
      .force("charge", forceManyBody<RuntimeNode>().strength(variant === "typed" ? -235 : -290))
      .force("center", forceCenter(width / 2, height / 2))
      .force("collision", forceCollide<RuntimeNode>().radius((node) => node.radius + (variant === "typed" ? 34 : 28)).iterations(2));

    if (variant === "typed") {
      const columns = Math.ceil(Math.sqrt(groups.length));
      const rows = Math.ceil(groups.length / columns);
      const centers = new Map(groups.map((group, index) => [group, {
        x: width * ((index % columns) + 1) / (columns + 1),
        y: height * (Math.floor(index / columns) + 1) / (rows + 1),
      }]));
      simulation
        .force("group-x", forceX<RuntimeNode>((node) => centers.get(node.group)?.x || width / 2).strength(.19))
        .force("group-y", forceY<RuntimeNode>((node) => centers.get(node.group)?.y || height / 2).strength(.19));
    }

    const dragBehavior = drag<SVGGElement, RuntimeNode>()
      .on("start", (event, node) => {
        if (!event.active) simulation.alphaTarget(.22).restart();
        node.fx = node.x;
        node.fy = node.y;
      })
      .on("drag", (event, node) => {
        node.fx = event.x;
        node.fy = event.y;
      })
      .on("end", (event, node) => {
        if (!event.active) simulation.alphaTarget(0);
        node.fx = null;
        node.fy = null;
      });
    nodeSelection.call(dragBehavior);

    simulation.on("tick", () => {
      linkSelection
        .attr("x1", (link) => (link.source as RuntimeNode).x || 0)
        .attr("y1", (link) => (link.source as RuntimeNode).y || 0)
        .attr("x2", (link) => (link.target as RuntimeNode).x || 0)
        .attr("y2", (link) => (link.target as RuntimeNode).y || 0);
      nodeSelection.attr("transform", (node) => {
        node.x = Math.max(34, Math.min(width - 145, node.x || width / 2));
        node.y = Math.max(34, Math.min(height - 42, node.y || height / 2));
        return `translate(${node.x},${node.y})`;
      });
    });
    simulationRef.current = simulation;

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([.42, 2.6])
      .on("zoom", (event) => root.attr("transform", event.transform.toString()));
    svg.call(zoomBehavior).on("dblclick.zoom", null);
    zoomRef.current = zoomBehavior;
    const centerStageFrame = requestAnimationFrame(() => {
      const stage = stageRef.current;
      if (stage && stage.scrollWidth > stage.clientWidth) stage.scrollLeft = (stage.scrollWidth - stage.clientWidth) / 2;
    });

    return () => {
      cancelAnimationFrame(centerStageFrame);
      simulation.stop();
      svg.on(".zoom", null);
      simulationRef.current = null;
      zoomRef.current = null;
    };
  }, [groupColors, groups, links, markerPrefix, nodes, onFocus, relationColors, relationTypes, variant]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const connected = new Set<string>();
    links.forEach((link) => {
      if (link.source !== focusedId && link.target !== focusedId) return;
      connected.add(link.source);
      connected.add(link.target);
    });
    svg.querySelectorAll<SVGGElement>(".d3-force-node").forEach((node) => {
      const id = node.dataset.nodeId || "";
      node.classList.toggle("active", id === focusedId);
      node.classList.toggle("muted", Boolean(focusedId) && !connected.has(id));
    });
    svg.querySelectorAll<SVGLineElement>(".d3-force-link").forEach((link) => {
      const active = !focusedId || link.dataset.sourceId === focusedId || link.dataset.targetId === focusedId;
      link.classList.toggle("muted", !active);
      link.classList.toggle("active", Boolean(focusedId) && active);
    });
  }, [focusedId, links]);

  const zoomBy = (factor: number) => {
    if (!svgRef.current || !zoomRef.current) return;
    select(svgRef.current).call(zoomRef.current.scaleBy, factor);
  };

  const resetView = () => {
    if (svgRef.current && zoomRef.current) select(svgRef.current).call(zoomRef.current.transform, zoomIdentity);
    runtimeNodesRef.current.forEach((node, index) => {
      const angle = (index / Math.max(1, runtimeNodesRef.current.length)) * Math.PI * 2;
      node.fx = null;
      node.fy = null;
      node.x = width / 2 + Math.cos(angle) * width * .26;
      node.y = height / 2 + Math.sin(angle) * height * .25;
    });
    simulationRef.current?.alpha(1).restart();
  };

  return <section className="d3-force-panel" data-graph-variant={variant}>
    <header className="d3-force-heading">
      <div><span>{variant === "typed" ? "历史分组布局" : "关系布局"}</span><h3>{title}</h3><p>{description}</p></div>
      <div className="d3-force-actions" aria-label={`${title}视图操作`}>
        <button onClick={() => zoomBy(1.25)} aria-label="放大图谱">＋</button>
        <button onClick={() => zoomBy(.8)} aria-label="缩小图谱">−</button>
        <button onClick={resetView}>复位</button>
        <button className={!focusedId ? "active" : ""} onClick={() => onFocus(null)}>全部关系</button>
      </div>
    </header>
    <div className="d3-force-legend">
      {(variant === "typed" ? groups : relationTypes).map((item) => <span key={item}>
        <i style={{ background: variant === "typed" ? groupColors.get(item) : relationColors[item] }} aria-hidden="true" />{item}
      </span>)}
    </div>
    <div ref={stageRef} className="d3-force-stage">
      <svg ref={svgRef} className="d3-force-svg" role="img" aria-label={ariaLabel} />
    </div>
    <footer><span>拖动节点调整局部结构</span><span>滚轮／双指缩放</span><span>拖动空白处平移</span><span>点击节点同步聚焦</span></footer>
  </section>;
}
