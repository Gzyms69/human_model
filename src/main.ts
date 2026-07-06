import './style.css';
import { Network, type Options, type Edge, type Node } from 'vis-network';
import { DataSet } from 'vis-data';
import { createIcons, icons } from 'lucide';
import { MIKRO_NODES, MAKRO_NODES, MIKRO_LINKS, MAKRO_LINKS, type DomainNode, type DomainLink } from './data';

createIcons({ icons });

let network: Network | null = null;
let currentMode: 'MIKRO' | 'MAKRO' = 'MIKRO';
let nodesDataSet = new DataSet<Node>([]);
let edgesDataSet = new DataSet<Edge>([]);
let chaosInterval: number | null = null;

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
    font: { color: '#ffffff', size: 14, face: 'Inter' },
    color: {
      border: c.border,
      background: c.background,
      highlight: { border: '#fff', background: c.border }
    },
    shadow: { enabled: true, color: c.glow, size: 20, x: 0, y: 0 }
  };

  if (dn.id === 'm1') { // Jaźń (Obserwator)
    node.fixed = true; // Zawsze absolutnie w centrum
    node.x = 0;
    node.y = 0;
    node.size = 35;
  }

  if (dn.id === 'ma9') { // Wektor Egzystencjalny (Atraktor)
    node.fixed = { x: true, y: false };
    node.x = 800; // Prawa strona
    node.mass = 5; // Potężna grawitacja ściągająca
    node.size = 35;
  }
  if (dn.id === 'ma10') { // Czynnik Chaosu
    node.physics = false; // Lata samodzielnie
    node.x = -800;
    node.y = -800;
  }
  if (dn.id === 'ma1') { // Fundament (Rdzeń)
    node.size = 40;
    node.mass = 3;
  }

  return node;
}

function mapEdge(dl: DomainLink): Edge {
  let edge: Edge = {
    id: `${dl.from}-${dl.to}-${dl.type}`,
    from: dl.from,
    to: dl.to,
    label: dl.label,
    font: { color: 'rgba(0,0,0,0)', size: 0, strokeWidth: 0, face: 'Inter', align: 'middle' }, // Całkowicie ukryte domyślnie
    shadow: { enabled: true, size: 10, x: 0, y: 0 }
  };

  switch (dl.type) {
    case 'flow':
      edge.color = { color: 'rgba(255, 255, 255, 0.2)', highlight: '#fff' };
      edge.smooth = { enabled: true, type: 'continuous', roundness: 0.5 };
      edge.width = 1.5;
      break;
    case 'awareness':
      edge.color = { color: 'rgba(255, 255, 255, 0.4)', highlight: '#fff' };
      edge.dashes = [5, 5];
      edge.physics = false;
      edge.width = 1;
      edge.shadow = { enabled: true, color: '#ffffff', size: 10, x: 0, y: 0 };
      break;
    case 'override':
      edge.color = { color: '#00e5ff', highlight: '#00e5ff' };
      edge.smooth = false; // Prosta, tnąca linia
      edge.width = 3;
      edge.shadow = { enabled: true, color: '#00e5ff', size: 10, x: 0, y: 0 };
      break;
    case 'conflict':
      edge.color = { color: '#ff003c', highlight: '#ff003c' };
      edge.smooth = { enabled: true, type: 'curvedCW', roundness: 0.3 };
      edge.width = 2;
      edge.dashes = [10, 5];
      edge.length = 300; // Sprężyna odpychająca węzły
      edge.shadow = { enabled: true, color: '#ff003c', size: 10, x: 0, y: 0 };
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
  
  // Przypisanie perfekcyjnych pozycji początkowych i zamrożenie MIKRO (żeby zapobiec ściąganiu przez sprężyny)
  if (mode === 'MIKRO') {
    const groupCounts: Record<string, number> = {};
    const groupIndex: Record<string, number> = {};
    
    // Zliczamy węzły w grupach
    initialNodes.forEach(node => {
      const dn = sourceNodes.find(n => n.id === node.id);
      if (dn && node.id && node.id !== 'm1' && !node.id.toString().startsWith('ma')) {
        const g = dn.group || 'environmental';
        groupCounts[g] = (groupCounts[g] || 0) + 1;
        groupIndex[g] = 0;
      }
    });

    initialNodes.forEach(node => {
      const dn = sourceNodes.find(n => n.id === node.id);
      if (dn && node.id && node.id !== 'm1' && !node.id.toString().startsWith('ma')) {
        const g = dn.group || 'environmental';
        const angles: Record<string, number> = {
          cognitive: -Math.PI / 2, // Góra
          emotional: -Math.PI / 2 + (Math.PI * 2 / 5), // Prawy górny
          executive: -Math.PI / 2 + (Math.PI * 2 / 5) * 2, // Prawy dolny
          physiological: -Math.PI / 2 + (Math.PI * 2 / 5) * 3, // Lewy dolny
          environmental: -Math.PI / 2 + (Math.PI * 2 / 5) * 4, // Lewy górny
        };
        const baseAngle = angles[g] !== undefined ? angles[g] : 0;
        
        // Rozłożenie węzłów w danej grupie równomiernie
        const count = groupCounts[g];
        const idx = groupIndex[g]++;
        const spread = 0.6; // Szerokość kątowa klastra
        const offset = count > 1 ? -spread/2 + (spread / (count - 1)) * idx : 0;
        const finalAngle = baseAngle + offset;
        
        const radius = 350 + (idx % 2 === 0 ? 0 : 40); // Lekki zygzak dla lepszego wyglądu
        
        node.x = Math.cos(finalAngle) * radius;
        node.y = Math.sin(finalAngle) * radius;
        node.fixed = true; // Zamrożenie węzła! Fizyka go nie ściągnie.
      }
    });
  }

  nodesDataSet.add(initialNodes);
  edgesDataSet.add(sourceLinks.map(mapEdge));

  const options: Options = {
    nodes: { borderWidth: 2 },
    edges: { hoverWidth: 2, selectionWidth: 2 },
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
    interaction: { hover: true, tooltipDelay: 200 }
  };

  network = new Network(container, { nodes: nodesDataSet, edges: edgesDataSet }, options);

  // Nie dodajemy już kotwic i smyczy, ponieważ pozycje w MIKRO są zamrożone (fixed: true)
  // To oszczędza CPU i zapobiega jakimkolwiek błędom silnika fizycznego.

  // LOGIKA HOVER (Ukrywanie reszty grafu i pokazywanie etykiet)
  network.on("hoverNode", (params: any) => {
    const nodeId = params.node;
    if (nodeId.toString().startsWith('anchor_')) return;

    const connectedEdges = network!.getConnectedEdges(nodeId).filter((id: any) => !id.toString().startsWith('tether_'));
    const connectedNodes = network!.getConnectedNodes(nodeId).filter((id: any) => !id.toString().startsWith('anchor_')) as string[];
    
    nodesDataSet.update(nodesDataSet.get().filter(n => !n.id.toString().startsWith('anchor_')).map(n => ({
      id: n.id,
      color: (n.id === nodeId || connectedNodes.includes(n.id as string)) ? undefined : { background: 'rgba(50,50,50,0.1)', border: 'rgba(50,50,50,0.2)' },
      font: { color: (n.id === nodeId || connectedNodes.includes(n.id as string)) ? '#fff' : 'rgba(0,0,0,0)' }
    })));

    edgesDataSet.update(edgesDataSet.get().filter(e => !e.id.toString().startsWith('tether_')).map(e => {
      const isConnected = connectedEdges.includes(e.id as string);
      return {
        id: e.id,
        color: isConnected ? undefined : { color: 'rgba(0,0,0,0)' },
        font: { 
          color: isConnected ? '#ffffff' : 'rgba(0,0,0,0)',
          size: isConnected ? 13 : 0,
          strokeWidth: isConnected ? 5 : 0,
          strokeColor: isConnected ? '#0f1115' : 'rgba(0,0,0,0)' 
        } 
      };
    }));
  });

  network.on("blurNode", () => {
    // Reset stylów tylko dla elementów, bez nadpisywania całej struktury
    nodesDataSet.update(sourceNodes.map(dn => {
      const mapped = mapNode(dn);
      return { id: mapped.id, color: mapped.color, font: mapped.font };
    }));
    edgesDataSet.update(sourceLinks.map(dl => {
      const mapped = mapEdge(dl);
      return { id: mapped.id, color: mapped.color, font: mapped.font, width: mapped.width };
    }));
  });

  network.on("click", (params: any) => {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      const nodeData = sourceNodes.find(n => n.id === nodeId);
      if (nodeData) displayLog(nodeData);
    }
  });

  network.on("beforeDrawing", (ctx: any) => {
    if (mode === 'MAKRO') {
      // Wittgenstein: Rysowanie Membrany (pola siłowego)
      const coreNodes = ['ma1', 'ma3', 'ma4', 'ma6']; // Biologia, Trauma, Cień + Membrana jako granica
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

  // Pętla Chaosu (Taleb) - Powolna orbita
  if (mode === 'MAKRO') {
    let orbitAngle = Math.PI; // Zaczyna po lewej (przeciwnie do Wektora po prawej)
    chaosInterval = window.setInterval(() => {
      orbitAngle += 0.003; // Bardzo powolny, majestatyczny ruch
      const radius = 800; // Taka sama odległość jak Wektor Egzystencjalny
      
      const newX = Math.cos(orbitAngle) * radius;
      const newY = Math.sin(orbitAngle) * radius;

      nodesDataSet.update({ id: 'ma10', x: newX, y: newY });
    }, 50) as unknown as number;
  }
}

function displayLog(node: DomainNode) {
  document.getElementById('node-title')!.textContent = node.title;
  document.getElementById('node-desc')!.textContent = node.description;
  document.getElementById('node-psych')!.textContent = node.psychology;
  document.getElementById('node-phil')!.textContent = node.philosophy;
  document.getElementById('node-sci')!.textContent = node.science;
  document.getElementById('node-lifehack')!.textContent = node.lifehack;
  document.getElementById('side-panel')!.classList.remove('hidden');
}

document.getElementById('close-panel')!.addEventListener('click', () => {
  document.getElementById('side-panel')!.classList.add('hidden');
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

// Obsługa Dzienniczka (Log Toggle)
const logToggle = document.getElementById('log-toggle');
if (logToggle) {
  logToggle.addEventListener('click', () => {
    document.getElementById('system-log')!.classList.toggle('collapsed');
  });
}

// Init
renderNetwork(currentMode);
