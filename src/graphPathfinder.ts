import { MIKRO_LINKS, type DomainLink } from './data';

// Build adjacency graph from MIKRO_LINKS
interface GraphEdge {
  link: DomainLink;
  target: string;
}

const adjacencyMap = new Map<string, GraphEdge[]>();

function getAdjacencyMap(): Map<string, GraphEdge[]> {
  if (adjacencyMap.size > 0) return adjacencyMap;

  MIKRO_LINKS.forEach((link) => {
    // Forward edge
    if (!adjacencyMap.has(link.from)) adjacencyMap.set(link.from, []);
    adjacencyMap.get(link.from)!.push({ link, target: link.to });

    // Reverse edge for undirected traversal if graph is loosely connected
    if (!adjacencyMap.has(link.to)) adjacencyMap.set(link.to, []);
    adjacencyMap.get(link.to)!.push({ link, target: link.from });
  });

  return adjacencyMap;
}

// Find shortest path between startNode and endNode using BFS
export function findShortestPath(startNode: string, endNode: string): { nodes: string[]; links: DomainLink[] } | null {
  if (startNode === endNode) {
    return { nodes: [startNode], links: [] };
  }

  const adj = getAdjacencyMap();
  const queue: Array<{ current: string; pathNodes: string[]; pathLinks: DomainLink[] }> = [
    { current: startNode, pathNodes: [startNode], pathLinks: [] }
  ];
  const visited = new Set<string>([startNode]);

  while (queue.length > 0) {
    const { current, pathNodes, pathLinks } = queue.shift()!;

    if (current === endNode) {
      return { nodes: pathNodes, links: pathLinks };
    }

    const neighbors = adj.get(current) || [];
    for (const edge of neighbors) {
      if (!visited.has(edge.target)) {
        visited.add(edge.target);
        queue.push({
          current: edge.target,
          pathNodes: [...pathNodes, edge.target],
          pathLinks: [...pathLinks, edge.link]
        });
      }
    }
  }

  return null;
}

// Expand a raw sequence of story nodes so that EVERY adjacent pair has a valid physical edge in MIKRO_LINKS
export function expandPathToValidGraphEdges(rawStoryNodes: string[]): {
  expandedNodes: string[];
  matchedLinks: DomainLink[];
} {
  if (rawStoryNodes.length === 0) {
    return { expandedNodes: [], matchedLinks: [] };
  }

  // Always attempt to include m1 (Jaźń/Obserwator) if missing
  let storyNodes = [...rawStoryNodes];
  if (!storyNodes.includes('m1')) {
    // Insert m1 before m2 or m5 if present, or near middle
    const idxM2 = storyNodes.indexOf('m2');
    const idxM5 = storyNodes.indexOf('m5');
    const insertIdx = idxM2 !== -1 ? idxM2 : idxM5 !== -1 ? idxM5 : Math.floor(storyNodes.length / 2);
    storyNodes.splice(Math.max(0, insertIdx), 0, 'm1');
  }

  const expandedNodes: string[] = [storyNodes[0]];
  const matchedLinks: DomainLink[] = [];

  for (let i = 0; i < storyNodes.length - 1; i++) {
    const u = storyNodes[i];
    const v = storyNodes[i + 1];

    if (u === v) continue;

    const pathResult = findShortestPath(u, v);
    if (pathResult && pathResult.nodes.length > 1) {
      // Append nodes after u
      for (let k = 1; k < pathResult.nodes.length; k++) {
        expandedNodes.push(pathResult.nodes[k]);
      }
      matchedLinks.push(...pathResult.links);
    } else {
      // Direct fallback if no path found
      expandedNodes.push(v);
    }
  }

  // Remove contiguous duplicates if any
  const deduplicatedNodes: string[] = [];
  expandedNodes.forEach((nodeId) => {
    if (deduplicatedNodes.length === 0 || deduplicatedNodes[deduplicatedNodes.length - 1] !== nodeId) {
      deduplicatedNodes.push(nodeId);
    }
  });

  return {
    expandedNodes: deduplicatedNodes,
    matchedLinks
  };
}
