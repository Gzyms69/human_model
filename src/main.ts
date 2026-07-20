import './style.css';
import { Network, type Options, type Edge, type Node } from 'vis-network';
import { DataSet } from 'vis-data';
import { createIcons, icons } from 'lucide';
import { MIKRO_NODES, MAKRO_NODES, MIKRO_LINKS, MAKRO_LINKS, type DomainNode, type DomainLink } from './data';

createIcons({ icons });

const isMobile = window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);

let network: Network | null = null;
let currentMode: 'MIKRO' | 'MAKRO' = 'MIKRO';
let nodesDataSet = new DataSet<Node>([]);
let edgesDataSet = new DataSet<Edge>([]);
let chaosInterval: number | null = null;
let clearSelection: (() => void) | null = null;

const colors = {
  cognitive: { border: '#00e5ff', background: 'rgba(0, 229, 255, 0.1)', glow: '#00e5ff' },
  physiological: { border: '#00ffaa', background: 'rgba(0, 255, 170, 0.1)', glow: '#00ffaa' },
  emotional: { border: '#ff007f', background: 'rgba(255, 0, 127, 0.1)', glow: '#ff007f' },
  executive: { border: '#ffaa00', background: 'rgba(255, 170, 0, 0.1)', glow: '#ffaa00' },
  environmental: { border: '#8888ff', background: 'rgba(136, 136, 255, 0.1)', glow: '#8888ff' },
  awareness: { border: '#ffffff', background: 'rgba(255, 255, 255, 0.1)', glow: '#ffffff' }
};

function mapNode(dn: DomainNode): Node {
  const g = dn.group as keyof typeof colors || 'environmental';
  const c = colors[g];
  
  let node: Node = {
    id: dn.id,
    label: dn.title,
    shape: 'dot',
    size: 25,
    font: {
      color: '#ffffff',
      size: 14,
      face: 'Inter',
      strokeWidth: 4,
      strokeColor: '#0f1218',
      background: 'rgba(15, 18, 24, 0.75)'
    },
    color: {
      border: c.border,
      background: c.background,
      highlight: { border: '#fff', background: c.border }
    },
    shadow: isMobile ? false : { enabled: true, color: c.glow, size: 20, x: 0, y: 0 }
  };

  if (dn.id === 'm1') {
    node.physics = false;
    node.x = 0;
    node.y = 0;
    node.size = 35;
  }

  if (dn.id === 'ma9') {
    node.fixed = { x: true, y: false };
    node.x = 800;
    node.mass = 5;
    node.size = 35;
  }
  if (dn.id === 'ma10') {
    node.physics = false;
    node.x = -800;
    node.y = -800;
  }
  if (dn.id === 'ma1') {
    node.size = 40;
    node.mass = 3;
  }

  return node;
}

function mapEdge(dl: DomainLink): Edge {
  const dir = dl.direction || 'to';
  let arrowsConfig: any = false;

  if (dir === 'to') {
    arrowsConfig = { to: { enabled: true, scaleFactor: 0.75 } };
  } else if (dir === 'from') {
    arrowsConfig = { from: { enabled: true, scaleFactor: 0.75 } };
  } else if (dir === 'both') {
    arrowsConfig = {
      to: { enabled: true, scaleFactor: 0.75 },
      from: { enabled: true, scaleFactor: 0.75 }
    };
  }

  let edge: Edge = {
    id: dl.id || `${dl.from}-${dl.to}-${dl.type}`,
    from: dl.from,
    to: dl.to,
    label: dl.label,
    arrows: arrowsConfig,
    font: { color: 'rgba(0,0,0,0)', size: 0, strokeWidth: 0, face: 'Inter', align: 'middle' },
    shadow: isMobile ? false : { enabled: true, size: 10, x: 0, y: 0 },
    smooth: { enabled: true, type: 'curvedCW', roundness: 0.2 }
  };

  switch (dl.type) {
    case 'flow':
      edge.color = { color: 'rgba(255, 255, 255, 0.25)', highlight: '#ffffff' };
      edge.width = 1.5;
      break;
    case 'awareness':
      edge.color = { color: 'rgba(255, 255, 255, 0.4)', highlight: '#ffffff' };
      edge.dashes = [5, 5];
      edge.physics = false;
      edge.width = 1;
      if (!isMobile) edge.shadow = { enabled: true, color: '#ffffff', size: 10, x: 0, y: 0 };
      break;
    case 'override':
      edge.color = { color: '#00e5ff', highlight: '#00e5ff' };
      edge.width = 3;
      if (!isMobile) edge.shadow = { enabled: true, color: '#00e5ff', size: 10, x: 0, y: 0 };
      break;
    case 'conflict':
      edge.color = { color: '#ff003c', highlight: '#ff003c' };
      edge.width = 2;
      edge.dashes = [10, 5];
      edge.length = 300;
      if (!isMobile) edge.shadow = { enabled: true, color: '#ff003c', size: 10, x: 0, y: 0 };
      break;
  }

  return edge;
}

function renderNetwork(mode: 'MIKRO' | 'MAKRO') {
  const container = document.getElementById('network-canvas');
  if (!container) return;
  
  if (chaosInterval) {
    clearInterval(chaosInterval);
    chaosInterval = null;
  }

  if (network) {
    network.destroy();
    network = null;
  }

  const sourceNodes = mode === 'MIKRO' ? MIKRO_NODES : MAKRO_NODES;
  const sourceLinks = mode === 'MIKRO' ? MIKRO_LINKS : MAKRO_LINKS;

  nodesDataSet = new DataSet<Node>([]);
  edgesDataSet = new DataSet<Edge>([]);
  
  const initialNodes = sourceNodes.map(mapNode);
  
  if (mode === 'MIKRO') {
    const categoryOrder = ['cognitive', 'emotional', 'executive', 'physiological', 'environmental'];
    
    const outerNodes = initialNodes.filter(node => node.id && node.id !== 'm1' && !node.id.toString().startsWith('ma'));
    
    outerNodes.sort((a, b) => {
      const dnA = sourceNodes.find(n => n.id === a.id);
      const dnB = sourceNodes.find(n => n.id === b.id);
      const gA = dnA?.group || 'environmental';
      const gB = dnB?.group || 'environmental';
      
      const idxA = categoryOrder.indexOf(gA);
      const idxB = categoryOrder.indexOf(gB);
      
      if (idxA !== idxB) {
        return idxA - idxB;
      }
      
      const numA = parseInt(a.id!.toString().replace(/\D/g, '')) || 0;
      const numB = parseInt(b.id!.toString().replace(/\D/g, '')) || 0;
      return numA - numB;
    });

    const totalOuter = outerNodes.length;
    const radius = 460;
    
    outerNodes.forEach((node, index) => {
      const angle = -Math.PI / 2 + (index * 2 * Math.PI) / totalOuter;
      node.x = Math.cos(angle) * radius;
      node.y = Math.sin(angle) * radius;
      node.physics = false;
    });
  }

  nodesDataSet.add(initialNodes);
  edgesDataSet.add(sourceLinks.map(mapEdge));

  const options: Options = {
    nodes: { borderWidth: 2 },
    edges: { hoverWidth: 2, selectionWidth: 3 },
    physics: {
      solver: 'forceAtlas2Based',
      forceAtlas2Based: {
        gravitationalConstant: -100,
        centralGravity: 0.005,
        springLength: 150,
        springConstant: 0.05,
        damping: 0.1
      },
      stabilization: { iterations: 100 }
    },
    interaction: { hover: !isMobile, tooltipDelay: 200 }
  };

  network = new Network(container, { nodes: nodesDataSet, edges: edgesDataSet }, options);

  let selectedNodeId: string | null = null;
  let selectedEdgeId: string | null = null;

  const showNodeInPanel = (nodeData: DomainNode) => {
    document.getElementById('relation-nodes-nav')?.classList.add('hidden');
    document.getElementById('node-title')!.textContent = nodeData.title;
    document.getElementById('node-desc')!.textContent = nodeData.description;
    document.getElementById('node-psych')!.textContent = nodeData.psychology;
    document.getElementById('node-phil')!.textContent = nodeData.philosophy;
    document.getElementById('node-sci')!.textContent = nodeData.science;
    document.getElementById('node-lifehack')!.textContent = nodeData.lifehack;
  };

  const highlightNode = (nodeId: string, clickDOMPos: {x: number, y: number}) => {
    if (nodeId.toString().startsWith('anchor_')) return;

    const connectedEdges = network!.getConnectedEdges(nodeId).filter((id: any) => !id.toString().startsWith('tether_'));
    const connectedNodes = network!.getConnectedNodes(nodeId).filter((id: any) => !id.toString().startsWith('anchor_')) as string[];

    nodesDataSet.update(nodesDataSet.get().filter(n => n.id === nodeId || connectedNodes.includes(n.id as string)).map(n => {
        const dn = sourceNodes.find(src => src.id === n.id);
        const mapped = mapNode(dn!);
        return { id: n.id, color: mapped.color, font: mapped.font };
    }));

    edgesDataSet.update(connectedEdges.map(edgeId => {
        const dl = sourceLinks.find(src => (src.id || `${src.from}-${src.to}-${src.type}`) === edgeId);
        if (dl) {
          const mapped = mapEdge(dl);
          return {
            id: edgeId,
            color: mapped.color,
            font: {
              color: 'rgba(0,0,0,0)',
              size: 11,
              face: 'Inter',
              background: 'rgba(0,0,0,0)',
              strokeWidth: 0
            }
          };
        }
        return { id: edgeId };
    }));

    const otherNodes = nodesDataSet.get().filter(n => n.id !== nodeId && !connectedNodes.includes(n.id as string) && !n.id.toString().startsWith('anchor_'));
    const otherEdges = edgesDataSet.get().filter(e => !connectedEdges.includes(e.id as string) && !e.id.toString().startsWith('tether_'));
    
    const positions = network!.getPositions();
    const originCanvas = network!.DOMtoCanvas(clickDOMPos);
    const waveSpeed = 0.5;

    otherNodes.forEach(n => {
      const pos = positions[n.id];
      if (pos) {
        const dist = Math.sqrt(Math.pow(pos.x - originCanvas.x, 2) + Math.pow(pos.y - originCanvas.y, 2));
        const delay = dist * waveSpeed;
        
        setTimeout(() => {
            if (selectedNodeId === nodeId.toString()) {
              nodesDataSet.update({
                id: n.id,
                color: { background: 'rgba(40,45,50,0.5)', border: 'rgba(40,45,50,0.8)' },
                font: { color: 'rgba(0,0,0,0)' }
              });
            }
        }, delay);
      }
    });

    otherEdges.forEach(e => {
      const fromPos = positions[e.from as string];
      const toPos = positions[e.to as string];
      if (fromPos && toPos) {
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;
        const dist = Math.sqrt(Math.pow(midX - originCanvas.x, 2) + Math.pow(midY - originCanvas.y, 2));
        const delay = dist * waveSpeed;
        
        setTimeout(() => {
          if (selectedNodeId === nodeId.toString()) {
            edgesDataSet.update({
              id: e.id,
              color: { color: 'rgba(40,45,50,0.2)' },
              font: { size: 0 }
            });
          }
        }, delay);
      }
    });
  };

  const highlightEdge = (edgeId: string, fromId: string, toId: string, clickDOMPos: {x: number, y: number}) => {
    // 1. Podświetl wybraną krawędź i TYLKO 2 połączone węzły
    nodesDataSet.update(nodesDataSet.get().filter(n => n.id === fromId || n.id === toId).map(n => {
      const dn = sourceNodes.find(src => src.id === n.id);
      const mapped = mapNode(dn!);
      return { id: n.id, color: mapped.color, font: mapped.font };
    }));

    const dl = sourceLinks.find(src => (src.id || `${src.from}-${src.to}-${src.type}`) === edgeId);
    if (dl) {
      edgesDataSet.update({
        id: edgeId,
        width: 3.5,
        font: {
          color: 'rgba(0,0,0,0)',
          size: 12,
          face: 'Inter',
          background: 'rgba(0,0,0,0)',
          strokeWidth: 0
        }
      });
    }

    // 2. Wygaś pozostałe węzły i krawędzie
    const otherNodes = nodesDataSet.get().filter(n => n.id !== fromId && n.id !== toId && !n.id.toString().startsWith('anchor_'));
    const otherEdges = edgesDataSet.get().filter(e => e.id !== edgeId && !e.id.toString().startsWith('tether_'));

    const positions = network!.getPositions();
    const originCanvas = network!.DOMtoCanvas(clickDOMPos);
    const waveSpeed = 0.5;

    otherNodes.forEach(n => {
      const pos = positions[n.id];
      if (pos) {
        const dist = Math.sqrt(Math.pow(pos.x - originCanvas.x, 2) + Math.pow(pos.y - originCanvas.y, 2));
        const delay = dist * waveSpeed;
        
        setTimeout(() => {
          if (selectedEdgeId === edgeId) {
            nodesDataSet.update({
              id: n.id,
              color: { background: 'rgba(40,45,50,0.5)', border: 'rgba(40,45,50,0.8)' },
              font: { color: 'rgba(0,0,0,0)' }
            });
          }
        }, delay);
      }
    });

    otherEdges.forEach(e => {
      const fromPos = positions[e.from as string];
      const toPos = positions[e.to as string];
      if (fromPos && toPos) {
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;
        const dist = Math.sqrt(Math.pow(midX - originCanvas.x, 2) + Math.pow(midY - originCanvas.y, 2));
        const delay = dist * waveSpeed;
        
        setTimeout(() => {
          if (selectedEdgeId === edgeId) {
            edgesDataSet.update({
              id: e.id,
              color: { color: 'rgba(40,45,50,0.15)' },
              font: { size: 0 }
            });
          }
        }, delay);
      }
    });
  };

  const resetHighlight = () => {
    nodesDataSet.update(sourceNodes.map(dn => {
      const mapped = mapNode(dn);
      return { id: mapped.id, color: mapped.color, font: mapped.font };
    }));
    edgesDataSet.update(sourceLinks.map(dl => {
      const mapped = mapEdge(dl);
      return { id: mapped.id, color: mapped.color, font: mapped.font, width: mapped.width };
    }));
  };

  clearSelection = () => {
    selectedNodeId = null;
    selectedEdgeId = null;
    resetHighlight();
    document.getElementById('details-bar')?.classList.add('hidden');
    document.getElementById('side-panel')?.classList.add('hidden');
  };

  const renderRelationInPanel = (dl: DomainLink, fromNode: DomainNode, toNode: DomainNode) => {
    const navCont = document.getElementById('relation-nodes-nav');
    if (navCont) {
      navCont.classList.remove('hidden');
      document.getElementById('from-node-title')!.textContent = fromNode.title;
      document.getElementById('to-node-title')!.textContent = toNode.title;

      const btnFrom = document.getElementById('btn-from-node');
      const btnTo = document.getElementById('btn-to-node');

      if (btnFrom) {
        btnFrom.onclick = (e) => {
          e.stopPropagation();
          selectedNodeId = fromNode.id;
          selectedEdgeId = null;
          highlightNode(fromNode.id, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
          showNodeInPanel(fromNode);
        };
      }
      if (btnTo) {
        btnTo.onclick = (e) => {
          e.stopPropagation();
          selectedNodeId = toNode.id;
          selectedEdgeId = null;
          highlightNode(toNode.id, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
          showNodeInPanel(toNode);
        };
      }
    }

    const symbol = dl.direction === 'both' ? '⇄' : '➔';
    document.getElementById('node-title')!.textContent = `${fromNode.title} ${symbol} ${toNode.title}`;
    document.getElementById('node-desc')!.textContent = `${dl.label} — ${dl.description}`;
    document.getElementById('node-psych')!.textContent = dl.psychology;
    document.getElementById('node-phil')!.textContent = dl.philosophy;
    document.getElementById('node-sci')!.textContent = dl.science;
    document.getElementById('node-lifehack')!.textContent = dl.lifehack;
  };

  network.on("click", (params: any) => {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];

      if (selectedNodeId === nodeId.toString()) {
        clearSelection?.();
        return;
      }

      const nodeData = sourceNodes.find(n => n.id === nodeId);
      if (nodeData) {
        selectedNodeId = nodeId.toString();
        selectedEdgeId = null;

        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = `${params.pointer.DOM.x}px`;
        ripple.style.top = `${params.pointer.DOM.y}px`;
        document.querySelector('.network-wrapper')!.appendChild(ripple);
        setTimeout(() => ripple.remove(), 1200);

        highlightNode(nodeId, params.pointer.DOM);
        showNodeInPanel(nodeData);
        
        document.getElementById('details-bar')!.classList.remove('hidden');
        document.getElementById('side-panel')!.classList.add('hidden');
      }
    } else if (params.edges.length > 0) {
      const edgeId = params.edges[0];

      if (selectedEdgeId === edgeId) {
        clearSelection?.();
        return;
      }

      const dl = sourceLinks.find(src => (src.id || `${src.from}-${src.to}-${src.type}`) === edgeId);
      if (dl) {
        const fromNode = sourceNodes.find(n => n.id === dl.from);
        const toNode = sourceNodes.find(n => n.id === dl.to);

        if (fromNode && toNode) {
          selectedEdgeId = edgeId;
          selectedNodeId = null;

          const ripple = document.createElement('div');
          ripple.className = 'ripple';
          ripple.style.left = `${params.pointer.DOM.x}px`;
          ripple.style.top = `${params.pointer.DOM.y}px`;
          document.querySelector('.network-wrapper')!.appendChild(ripple);
          setTimeout(() => ripple.remove(), 1200);

          highlightEdge(edgeId, dl.from, dl.to, params.pointer.DOM);
          renderRelationInPanel(dl, fromNode, toNode);

          document.getElementById('details-bar')!.classList.remove('hidden');
          document.getElementById('side-panel')!.classList.add('hidden');
        }
      }
    } else {
      clearSelection?.();
    }
  });

  network.on("hoverEdge", (params: any) => {
    const edgeId = params.edge;
    if (!selectedNodeId && !selectedEdgeId) {
      edgesDataSet.update({
        id: edgeId,
        width: 2.5,
        font: {
          color: 'rgba(0,0,0,0)',
          size: 11,
          face: 'Inter',
          background: 'rgba(0,0,0,0)',
          strokeWidth: 0
        }
      });
    }
  });

  network.on("blurEdge", (params: any) => {
    const edgeId = params.edge;
    if (!selectedNodeId && !selectedEdgeId) {
      const dl = sourceLinks.find(src => (src.id || `${src.from}-${src.to}-${src.type}`) === edgeId);
      if (dl) {
        const mapped = mapEdge(dl);
        edgesDataSet.update({
          id: edgeId,
          width: mapped.width,
          font: { size: 0 }
        });
      }
    }
  });

  network.on("beforeDrawing", (ctx: any) => {
    if (mode === 'MAKRO') {
      const coreNodes = ['ma1', 'ma3', 'ma4', 'ma6'];
      const positions = network!.getPositions(coreNodes);
      
      let xs = [], ys = [];
      for (const id in positions) {
        xs.push(positions[id].x);
        ys.push(positions[id].y);
      }
      
      if (xs.length > 0) {
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const radius = Math.max((maxX - minX), (maxY - minY)) / 2 + 100;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'rgba(0, 229, 255, 0.03)';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 15]);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.font = "14px Inter";
        ctx.fillStyle = 'rgba(0, 229, 255, 0.5)';
        ctx.fillText("MATRYCA JĘZYKOWA (MEMBRANA)", centerX - 120, centerY - radius - 10);
      }
    }
  });

  network.on("afterDrawing", (ctx: any) => {
    if (!network) return;
    const positions = network.getPositions();
    const edges = edgesDataSet.get();

    const activeEdges = edges.filter((edge: any) => 
      edge.font && typeof edge.font === 'object' && edge.font.size && edge.font.size > 0 && edge.label
    );

    if (activeEdges.length === 0) return;

    const pairGroups: { [key: string]: any[] } = {};
    activeEdges.forEach((edge: any) => {
      const pairKey = [edge.from, edge.to].sort().join(':::');
      if (!pairGroups[pairKey]) pairGroups[pairKey] = [];
      pairGroups[pairKey].push(edge);
    });

    interface LabelBox {
      label: string;
      x: number;
      y: number;
      angle: number;
      width: number;
      height: number;
      fontSize: number;
      fontFace: string;
      borderColor: string;
    }

    const boxes: LabelBox[] = [];

    for (const key in pairGroups) {
      const group = pairGroups[key];
      const count = group.length;

      group.forEach((edge: any, index: number) => {
        const fromPos = positions[edge.from];
        const toPos = positions[edge.to];
        if (!fromPos || !toPos) return;

        const dx = toPos.x - fromPos.x;
        const dy = toPos.y - fromPos.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;

        const tx = dx / len;
        const ty = dy / len;
        const nx = -ty;
        const ny = tx;

        let normalOffset = 20;
        if (count > 1) {
          normalOffset = (index === 0 ? -1 : 1) * 24;
        }

        const midX = fromPos.x + dx * 0.5;
        const midY = fromPos.y + dy * 0.5;

        const x = midX + nx * normalOffset;
        const y = midY + ny * normalOffset;

        let angle = Math.atan2(dy, dx);
        if (angle > Math.PI / 2) angle -= Math.PI;
        if (angle < -Math.PI / 2) angle += Math.PI;

        const fontSize = edge.font.size || 11;
        const fontFace = edge.font.face || 'Inter';

        ctx.save();
        ctx.font = `${fontSize}px ${fontFace}`;
        const metrics = ctx.measureText(edge.label);
        ctx.restore();

        const padX = 9;
        const padY = 5;
        const width = metrics.width + padX * 2;
        const height = fontSize + padY * 2;

        let borderColor = 'rgba(255, 255, 255, 0.4)';
        const dl = sourceLinks.find(src => (src.id || `${src.from}-${src.to}-${src.type}`) === edge.id);
        if (dl) {
          if (dl.type === 'override') borderColor = '#00e5ff';
          else if (dl.type === 'conflict') borderColor = '#ff003c';
          else if (dl.type === 'awareness') borderColor = 'rgba(255, 255, 255, 0.7)';
        }

        boxes.push({
          label: edge.label,
          x,
          y,
          angle,
          width,
          height,
          fontSize,
          fontFace,
          borderColor
        });
      });
    }

    boxes.forEach(box => {
      ctx.save();
      ctx.translate(box.x, box.y);
      ctx.rotate(box.angle);

      ctx.font = `${box.fontSize}px ${box.fontFace}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const rx = -box.width / 2;
      const ry = -box.height / 2;
      const r = 6;

      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(rx, ry, box.width, box.height, r);
      } else {
        ctx.rect(rx, ry, box.width, box.height);
      }
      ctx.fillStyle = 'rgba(15, 18, 24, 0.96)';
      ctx.fill();

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = box.borderColor;
      ctx.stroke();

      ctx.lineWidth = 3;
      ctx.strokeStyle = '#0f1218';
      ctx.strokeText(box.label, 0, 0);
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(box.label, 0, 0);

      ctx.restore();
    });
  });

  if (mode === 'MAKRO' && !isMobile) {
    let orbitAngle = Math.PI;
    chaosInterval = window.setInterval(() => {
      orbitAngle += 0.003;
      const radius = 800;
      
      const newX = Math.cos(orbitAngle) * radius;
      const newY = Math.sin(orbitAngle) * radius;

      nodesDataSet.update({ id: 'ma10', x: newX, y: newY });
    }, 50) as unknown as number;
  }
}

document.getElementById('details-bar')!.addEventListener('click', () => {
  document.getElementById('side-panel')!.classList.remove('hidden');
  document.getElementById('details-bar')!.classList.add('hidden');
  document.getElementById('system-log')!.classList.add('collapsed');
  createIcons({ icons });
});

document.getElementById('close-panel')!.addEventListener('click', () => {
  document.getElementById('side-panel')!.classList.add('hidden');
  if (document.getElementById('node-title')!.textContent !== "") {
    document.getElementById('details-bar')!.classList.remove('hidden');
  }
});

document.querySelector('[data-tab="mikro"]')!.addEventListener('click', (e) => {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  (e.target as HTMLElement).classList.add('active');
  currentMode = 'MIKRO';
  renderNetwork(currentMode);
});

document.querySelector('[data-tab="makro"]')!.addEventListener('click', (e) => {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  (e.target as HTMLElement).classList.add('active');
  currentMode = 'MAKRO';
  renderNetwork(currentMode);
});

const logToggle = document.getElementById('log-toggle');
if (logToggle) {
  logToggle.addEventListener('click', () => {
    document.getElementById('system-log')!.classList.toggle('collapsed');
  });
}

renderNetwork(currentMode);
