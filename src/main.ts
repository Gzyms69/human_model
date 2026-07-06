import './style.css';
import { MIKRO_MODEL, MAKRO_MODEL } from './data';
import type { DomainNode, HumanModel } from './data';

// --- Interfaces for LocalStorage ---
interface PracticeStatusMap {
  [key: string]: boolean; // key format: nodeId_practiceIndex -> true/false
}

interface NoteLog {
  timestamp: string;
  value?: number; // slider telemetry if present
  note: string;
}

interface NodeLogsMap {
  [nodeId: string]: NoteLog[];
}

// --- Application State ---
let selectedNode: DomainNode | null = null;
let selectedModel: HumanModel | null = null;
let activeSubTab: 'psychology' | 'philosophy' | 'science' = 'psychology';

// Load initial states from LocalStorage
let completedPractices: PracticeStatusMap = JSON.parse(
  localStorage.getItem('completed_practices') || '{}'
);
let nodeLogs: NodeLogsMap = JSON.parse(
  localStorage.getItem('node_logs') || '{}'
);

// Helper: Get color mapping for nodes based on ID
function getNodeColors(id: string): { color: string; glow: string } {
  if (id.startsWith('m')) {
    switch (id) {
      case 'm1': return { color: 'var(--c-core)', glow: 'rgba(181, 95, 230, 0.4)' }; // Jaźń
      case 'm2': return { color: 'var(--c-exec)', glow: 'rgba(0, 210, 255, 0.4)' }; // Wola
      case 'm3': return { color: 'var(--c-cog)', glow: 'rgba(59, 130, 246, 0.4)' }; // Myśli
      case 'm4': return { color: 'var(--c-aff)', glow: 'rgba(236, 72, 153, 0.4)' }; // Uczucia
      case 'm5': return { color: 'var(--c-vol)', glow: 'rgba(249, 115, 22, 0.4)' }; // Impulsy
      case 'm6': return { color: 'var(--c-vol)', glow: 'rgba(249, 115, 22, 0.4)' }; // Zachowania
      case 'm7': return { color: 'var(--c-som)', glow: 'rgba(20, 184, 166, 0.4)' }; // Wrażenia
      case 'm8': return { color: 'var(--c-cog)', glow: 'rgba(59, 130, 246, 0.4)' }; // Przekonania
      case 'm9': return { color: 'var(--c-env)', glow: 'rgba(16, 185, 129, 0.4)' }; // Czynniki zew
      case 'm10': return { color: 'var(--c-core)', glow: 'rgba(181, 95, 230, 0.4)' }; // Język
      case 'm11': return { color: 'var(--c-env)', glow: 'rgba(16, 185, 129, 0.4)' }; // Bateria
      case 'm12': return { color: 'var(--c-bio)', glow: 'rgba(244, 63, 94, 0.4)' }; // Biochemia
      case 'm13': return { color: 'var(--c-social)', glow: 'rgba(245, 158, 11, 0.4)' }; // Rezonans
      default: return { color: '#ffffff', glow: 'rgba(255, 255, 255, 0.1)' };
    }
  } else {
    switch (id) {
      case 'ma1': return { color: 'var(--c-env)', glow: 'rgba(16, 185, 129, 0.4)' }; // Fundament bio
      case 'ma2': return { color: 'var(--c-som)', glow: 'rgba(20, 184, 166, 0.4)' }; // Środowisko geo
      case 'ma3': return { color: 'var(--c-core)', glow: 'rgba(181, 95, 230, 0.4)' }; // Nieświadomość
      case 'ma4': return { color: 'var(--c-aff)', glow: 'rgba(236, 72, 153, 0.4)' }; // Trauma/Pamięć
      case 'ma5': return { color: 'var(--c-core)', glow: 'rgba(181, 95, 230, 0.4)' }; // Rodzina
      case 'ma6': return { color: 'var(--c-cog)', glow: 'rgba(59, 130, 246, 0.4)' }; // Język/Symbol
      case 'ma7': return { color: 'var(--c-bio)', glow: 'rgba(244, 63, 94, 0.4)' }; // Kryzysy
      case 'ma8': return { color: 'var(--c-social)', glow: 'rgba(245, 158, 11, 0.4)' }; // Zeitgeist
      case 'ma9': return { color: 'var(--c-meaning)', glow: 'rgba(16, 185, 129, 0.4)' }; // Cel
      case 'ma10': return { color: 'var(--c-vol)', glow: 'rgba(249, 115, 22, 0.4)' }; // Chaos
      case 'ma11': return { color: 'var(--c-tech)', glow: 'rgba(6, 182, 212, 0.4)' }; // Technosfera
      default: return { color: '#ffffff', glow: 'rgba(255, 255, 255, 0.1)' };
    }
  }
}

// --- Render Domain Nodes ---
function renderNodes(model: HumanModel, containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  model.domains.forEach((node) => {
    const { color, glow } = getNodeColors(node.id);
    const card = document.createElement('div');
    card.className = 'node-card';
    card.setAttribute('style', `--theme-color: ${color}; --theme-glow: ${glow};`);
    
    // Count completed practices for badge
    const nodePracticesCount = node.practices.length;
    let completedCount = 0;
    for (let i = 0; i < nodePracticesCount; i++) {
      if (completedPractices[`${node.id}_${i}`]) {
        completedCount++;
      }
    }

    card.innerHTML = `
      <div class="node-card-header">
        <span class="node-number">#${node.num}</span>
        ${completedCount > 0 ? `<span class="badge" style="background: rgba(255, 255, 255, 0.08); color: ${color}; font-weight: bold;">Praktyka: ${completedCount}/${nodePracticesCount}</span>` : ''}
      </div>
      <div>
        <h3>${node.title}</h3>
        <p>${node.subtitle}</p>
      </div>
      <div class="node-card-footer">
        <span class="badge">Psychologia</span>
        <span class="badge">Filozofia</span>
        <span class="badge">Nauka</span>
      </div>
    `;

    card.addEventListener('click', () => openDrawer(node, model));
    container.appendChild(card);
  });
}

// --- Side Drawer Management ---
function openDrawer(node: DomainNode, model: HumanModel) {
  selectedNode = node;
  selectedModel = model;
  
  const drawer = document.getElementById('drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const title = document.getElementById('drawer-title');
  const subtitle = document.getElementById('drawer-subtitle');
  const notesTextarea = document.getElementById('notes-textarea') as HTMLTextAreaElement;

  if (!drawer || !backdrop || !title || !subtitle || !notesTextarea) return;

  // Header content
  const { color } = getNodeColors(node.id);
  title.style.color = color;
  title.innerText = node.title;
  subtitle.innerText = node.subtitle;

  // Active sub-tab styling
  drawer.style.setProperty('--tab-active-bg', color);
  
  // Set tab details content
  updateDrawerTabs();

  // Populate practices list
  renderPractices();

  // Telemetry check
  const telemetrySection = document.getElementById('telemetry-log-section');
  const telemetrySlider = document.getElementById('telemetry-slider') as HTMLInputElement;
  const sliderLabelText = document.getElementById('slider-label-text');
  const sliderValDisplay = document.getElementById('slider-val-display');

  if (telemetrySection && telemetrySlider && sliderLabelText && sliderValDisplay) {
    // Show telemetry for energy (m11), biochem (m12), social (m13)
    if (node.id === 'm11' || node.id === 'm12' || node.id === 'm13') {
      telemetrySection.style.display = 'block';
      let label = 'Wartość:';
      if (node.id === 'm11') label = 'Poziom Energii (Stan Baterii):';
      if (node.id === 'm12') label = 'Stan Biochemiczny / Pobudzenie:';
      if (node.id === 'm13') label = 'Jakość Rezonansu Interpersonalnego:';
      sliderLabelText.innerText = label;

      // Load latest logged value if present
      const logs = nodeLogs[node.id] || [];
      if (logs.length > 0 && logs[logs.length - 1].value !== undefined) {
        const val = logs[logs.length - 1].value!;
        telemetrySlider.value = val.toString();
        sliderValDisplay.innerText = `${val} / 10`;
      } else {
        telemetrySlider.value = '5';
        sliderValDisplay.innerText = '5 / 10';
      }
    } else {
      telemetrySection.style.display = 'none';
    }
  }

  // Clear textarea editor
  notesTextarea.value = '';

  // Render logs history
  renderNodeLogsHistory();

  // Show Drawer and backdrop
  drawer.classList.add('open');
  backdrop.classList.add('show');
}

function closeDrawer() {
  const drawer = document.getElementById('drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (drawer) drawer.classList.remove('open');
  if (backdrop) backdrop.classList.remove('show');
  selectedNode = null;
  selectedModel = null;
}

// Update Detail Content Panes based on activeSubTab
function updateDrawerTabs() {
  if (!selectedNode) return;
  
  const panePsych = document.getElementById('pane-psychology');
  const panePhil = document.getElementById('pane-philosophy');
  const paneSci = document.getElementById('pane-science');

  if (panePsych && panePhil && paneSci) {
    panePsych.innerText = selectedNode.details.psychology;
    panePhil.innerText = selectedNode.details.philosophy;
    paneSci.innerText = selectedNode.details.science;
  }

  // Set active class on buttons
  const tabButtons = document.querySelectorAll('.drawer-tab-btn');
  tabButtons.forEach(btn => {
    const type = btn.getAttribute('data-sub');
    if (type === activeSubTab) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Set active class on panes
  const panes = [
    { id: 'pane-psychology', key: 'psychology' },
    { id: 'pane-philosophy', key: 'philosophy' },
    { id: 'pane-science', key: 'science' }
  ];

  panes.forEach(pane => {
    const el = document.getElementById(pane.id);
    if (el) {
      if (pane.key === activeSubTab) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }
  });
}

// Render practices list inside drawer
function renderPractices() {
  const list = document.getElementById('practices-list');
  if (!list || !selectedNode) return;

  list.innerHTML = '';
  selectedNode.practices.forEach((practice, index) => {
    const key = `${selectedNode!.id}_${index}`;
    const isCompleted = !!completedPractices[key];
    
    const item = document.createElement('div');
    item.className = `practice-item ${isCompleted ? 'completed' : ''}`;
    item.innerHTML = `
      <input type="checkbox" class="practice-checkbox" ${isCompleted ? 'checked' : ''}>
      <span class="practice-text">${practice}</span>
    `;

    // Handle check toggling
    const checkbox = item.querySelector('.practice-checkbox') as HTMLInputElement;
    checkbox.addEventListener('change', () => {
      completedPractices[key] = checkbox.checked;
      localStorage.setItem('completed_practices', JSON.stringify(completedPractices));
      if (checkbox.checked) {
        item.classList.add('completed');
      } else {
        item.classList.remove('completed');
      }
      
      // Update nodes grids to update practice progress badge
      if (selectedModel) {
        renderNodes(selectedModel, selectedModel === MIKRO_MODEL ? 'mikro-nodes' : 'makro-nodes');
      }
    });

    list.appendChild(item);
  });
}

// Render node logs history inside drawer
function renderNodeLogsHistory() {
  const container = document.getElementById('node-logs-history');
  if (!container || !selectedNode) return;

  container.innerHTML = '';
  const logs = nodeLogs[selectedNode.id] || [];
  
  if (logs.length === 0) {
    container.innerHTML = `<p style="color: var(--text-dark); font-size: 0.8rem; padding: 0.5rem; text-align: center;">Brak historii wpisów dla tego węzła.</p>`;
    return;
  }

  // Render reverse chronological
  [...logs].reverse().forEach((log) => {
    const dateStr = new Date(log.timestamp).toLocaleString('pl-PL');
    const item = document.createElement('div');
    item.className = 'log-entry';
    item.innerHTML = `
      <div class="log-entry-meta">
        <span>${dateStr}</span>
        ${log.value !== undefined ? `<strong>Wartość: ${log.value}/10</strong>` : ''}
      </div>
      <div class="log-entry-content">${escapeHtml(log.note)}</div>
    `;
    container.appendChild(item);
  });
}

// Escape HTML for user-generated strings
function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

// Save note and telemetry log
function saveNoteAndTelemetry() {
  const notesTextarea = document.getElementById('notes-textarea') as HTMLTextAreaElement;
  if (!selectedNode || !notesTextarea) return;

  const noteText = notesTextarea.value.trim();
  const telemetrySlider = document.getElementById('telemetry-slider') as HTMLInputElement;
  
  let val: number | undefined = undefined;
  if (selectedNode.id === 'm11' || selectedNode.id === 'm12' || selectedNode.id === 'm13') {
    if (telemetrySlider) {
      val = parseInt(telemetrySlider.value);
    }
  }

  // Standardize notes log even if empty note, as long as slider is changed
  if (noteText === '' && val === undefined) {
    alert('Wpisz notatkę lub zarejestruj parametr przed zapisem.');
    return;
  }

  const logEntry: NoteLog = {
    timestamp: new Date().toISOString(),
    value: val,
    note: noteText || 'Zarejestrowano sam pomiar parametru.'
  };

  if (!nodeLogs[selectedNode.id]) {
    nodeLogs[selectedNode.id] = [];
  }
  nodeLogs[selectedNode.id].push(logEntry);

  // Save to localStorage
  localStorage.setItem('node_logs', JSON.stringify(nodeLogs));

  // Render updated history in drawer
  renderNodeLogsHistory();

  // Clear note textarea
  notesTextarea.value = '';

  // Trigger feedback confirmation
  alert('Wpis zapisany pomyślnie!');
}

// --- Top Level View Toggle ---
function setupTabs() {
  const buttons = document.querySelectorAll('header .tab-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      if (!tabId) return;

      // Update active classes on buttons
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update active classes on sections
      const sections = document.querySelectorAll('.view-section');
      sections.forEach(sec => {
        const id = sec.getAttribute('id');
        if (id === `view-${tabId}`) {
          sec.classList.add('active');
        } else {
          sec.classList.remove('active');
        }
      });

      // Refresh data if dashboard
      if (tabId === 'dashboard') {
        updateDashboard();
      }
    });
  });
}

// --- Dashboard Logic ---
function updateDashboard() {
  // 1. Get latest values for Telemetry
  updateTelemetryWidget('m11', 'dash-val-energy', 'dash-bar-energy'); // Energy
  updateTelemetryWidget('m12', 'dash-val-biochem', 'dash-bar-biochem'); // Biochem
  updateTelemetryWidget('m13', 'dash-val-social', 'dash-bar-social'); // Social

  // 2. Compute Practices Completion rates
  updatePracticesProgress();

  // 3. Render Combined Checkin Feed
  renderGlobalCheckinFeed();
}

function updateTelemetryWidget(nodeId: string, textId: string, barId: string) {
  const textEl = document.getElementById(textId);
  const barEl = document.getElementById(barId);
  if (!textEl || !barEl) return;

  const logs = nodeLogs[nodeId] || [];
  if (logs.length > 0) {
    // Find last log with value
    const valLogs = logs.filter(l => l.value !== undefined);
    if (valLogs.length > 0) {
      const latestVal = valLogs[valLogs.length - 1].value!;
      textEl.innerText = `${latestVal} / 10`;
      barEl.style.width = `${latestVal * 10}%`;
      return;
    }
  }

  textEl.innerText = 'Brak danych';
  barEl.style.width = '0%';
}

function updatePracticesProgress() {
  const countMikroEl = document.getElementById('dash-count-mikro');
  const barMikroEl = document.getElementById('dash-bar-count-mikro');
  const countMakroEl = document.getElementById('dash-count-makro');
  const barMakroEl = document.getElementById('dash-bar-count-makro');

  if (!countMikroEl || !barMikroEl || !countMakroEl || !barMakroEl) return;

  // Compute MIKRO
  let totalMikro = 0;
  let completedMikro = 0;
  MIKRO_MODEL.domains.forEach(node => {
    node.practices.forEach((_, idx) => {
      totalMikro++;
      if (completedPractices[`${node.id}_${idx}`]) {
        completedMikro++;
      }
    });
  });

  const percentMikro = totalMikro > 0 ? (completedMikro / totalMikro) * 100 : 0;
  countMikroEl.innerText = `${completedMikro} / ${totalMikro} (${Math.round(percentMikro)}%)`;
  barMikroEl.style.width = `${percentMikro}%`;

  // Compute MAKRO
  let totalMakro = 0;
  let completedMakro = 0;
  MAKRO_MODEL.domains.forEach(node => {
    node.practices.forEach((_, idx) => {
      totalMakro++;
      if (completedPractices[`${node.id}_${idx}`]) {
        completedMakro++;
      }
    });
  });

  const percentMakro = totalMakro > 0 ? (completedMakro / totalMakro) * 100 : 0;
  countMakroEl.innerText = `${completedMakro} / ${totalMakro} (${Math.round(percentMakro)}%)`;
  barMakroEl.style.width = `${percentMakro}%`;
}

function renderGlobalCheckinFeed() {
  const feed = document.getElementById('checkin-feed');
  if (!feed) return;

  // Flatten logs with node titles
  interface FlatLog {
    timestamp: string;
    nodeTitle: string;
    nodeId: string;
    value?: number;
    note: string;
  }

  const allLogs: FlatLog[] = [];
  
  // Combine all models data helper to fetch titles easily
  const allNodes = [...MIKRO_MODEL.domains, ...MAKRO_MODEL.domains];
  
  Object.keys(nodeLogs).forEach(nodeId => {
    const node = allNodes.find(n => n.id === nodeId);
    if (!node) return;

    nodeLogs[nodeId].forEach(log => {
      allLogs.push({
        timestamp: log.timestamp,
        nodeTitle: node.title,
        nodeId: nodeId,
        value: log.value,
        note: log.note
      });
    });
  });

  // Sort logs by newest first
  allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (allLogs.length === 0) {
    feed.innerHTML = `<p style="color: var(--text-dark); font-size: 0.9rem; text-align: center; padding: 1.5rem 0;">Brak historii wpisów. Otwórz dowolny węzeł i utwórz pierwszy wpis, aby zasilić tablicę dziennika.</p>`;
    return;
  }

  feed.innerHTML = '';
  // Show max 20 entries
  allLogs.slice(0, 20).forEach(log => {
    const dateStr = new Date(log.timestamp).toLocaleString('pl-PL');
    const { color } = getNodeColors(log.nodeId);
    
    const item = document.createElement('div');
    item.className = 'feed-item';
    item.innerHTML = `
      <div class="feed-item-header">
        <span style="color: ${color}; font-weight: bold; font-family: var(--font-title);">${log.nodeTitle}</span>
        <span>${dateStr}</span>
      </div>
      <div class="feed-item-metrics">
        ${log.value !== undefined ? `<span class="feed-item-val">Parametr: <strong>${log.value}/10</strong></span>` : ''}
        <span class="feed-item-val">${log.nodeId.startsWith('m') && log.nodeId.length <= 3 ? 'Mikro' : 'Makro'}</span>
      </div>
      <div class="feed-item-text">${escapeHtml(log.note)}</div>
    `;
    feed.appendChild(item);
  });
}

// --- Initialization ---
function init() {
  // Render grids
  renderNodes(MIKRO_MODEL, 'mikro-nodes');
  renderNodes(MAKRO_MODEL, 'makro-nodes');

  // Setup tabs
  setupTabs();

  // Drawer event listeners
  const closeBtn = document.getElementById('drawer-close');
  const backdrop = document.getElementById('drawer-backdrop');
  
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  // Drawer Sub-tab switching
  const subTabButtons = document.querySelectorAll('.drawer-tab-btn');
  subTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-sub') as any;
      if (type) {
        activeSubTab = type;
        updateDrawerTabs();
      }
    });
  });

  // Telemetry slider label update
  const slider = document.getElementById('telemetry-slider') as HTMLInputElement;
  const sliderValDisplay = document.getElementById('slider-val-display');
  if (slider && sliderValDisplay) {
    slider.addEventListener('input', () => {
      sliderValDisplay.innerText = `${slider.value} / 10`;
    });
  }

  // Save notes handler
  const saveBtn = document.getElementById('save-note-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveNoteAndTelemetry);
  }
}

// Run on page load
window.addEventListener('DOMContentLoaded', init);
