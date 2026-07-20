import type { Network, Node, Edge } from 'vis-network';
import type { DataSet } from 'vis-data';
import type { DomainNode, DomainLink } from './data';

export class TracerAnimationController {
  private network: Network;
  private nodesDataSet: DataSet<Node>;
  private edgesDataSet: DataSet<Edge>;
  private sourceNodes: DomainNode[];
  private sourceLinks: DomainLink[];

  private storyNodes: string[] = [];
  private currentIndex: number = -1;
  private isPlaying: boolean = false;
  private stepDurationMs: number = 1800;
  private timer: number | null = null;

  public onStepChange?: (index: number, nodeId: string) => void;
  public onStateChange?: (isPlaying: boolean, index: number, total: number) => void;

  constructor(
    network: Network,
    nodesDataSet: DataSet<Node>,
    edgesDataSet: DataSet<Edge>,
    sourceNodes: DomainNode[],
    sourceLinks: DomainLink[]
  ) {
    this.network = network;
    this.nodesDataSet = nodesDataSet;
    this.edgesDataSet = edgesDataSet;
    this.sourceNodes = sourceNodes;
    this.sourceLinks = sourceLinks;
  }

  public updateReferences(
    network: Network,
    nodesDataSet: DataSet<Node>,
    edgesDataSet: DataSet<Edge>,
    sourceNodes: DomainNode[],
    sourceLinks: DomainLink[]
  ) {
    this.network = network;
    this.nodesDataSet = nodesDataSet;
    this.edgesDataSet = edgesDataSet;
    this.sourceNodes = sourceNodes;
    this.sourceLinks = sourceLinks;
  }

  public loadTrace(storyNodes: string[]) {
    this.stopTimer();
    this.storyNodes = storyNodes;
    this.currentIndex = -1;
    this.isPlaying = false;
    this.dimGraph();
  }

  public play() {
    if (this.storyNodes.length === 0) return;
    if (this.currentIndex >= this.storyNodes.length - 1) {
      this.currentIndex = -1;
    }
    this.isPlaying = true;
    this.notifyState();
    this.stepAndScheduleNext();
  }

  public pause() {
    this.stopTimer();
    this.isPlaying = false;
    this.notifyState();
  }

  public reset() {
    this.stopTimer();
    this.currentIndex = -1;
    this.isPlaying = false;
    this.resetGraphVisuals();
    this.notifyState();
  }

  public stepTo(index: number) {
    this.stopTimer();
    this.isPlaying = false;
    if (index < 0) index = 0;
    if (index >= this.storyNodes.length) index = this.storyNodes.length - 1;
    this.currentIndex = index;
    this.renderCurrentStep();
    this.notifyState();
  }

  public next() {
    if (this.currentIndex < this.storyNodes.length - 1) {
      this.stepTo(this.currentIndex + 1);
    }
  }

  public prev() {
    if (this.currentIndex > 0) {
      this.stepTo(this.currentIndex - 1);
    }
  }

  public setSpeed(durationMs: number) {
    this.stepDurationMs = durationMs;
  }

  private stepAndScheduleNext() {
    if (!this.isPlaying) return;
    this.currentIndex++;
    if (this.currentIndex >= this.storyNodes.length) {
      this.isPlaying = false;
      this.notifyState();
      return;
    }

    this.renderCurrentStep();

    this.timer = window.setTimeout(() => {
      if (this.isPlaying) {
        this.stepAndScheduleNext();
      }
    }, this.stepDurationMs) as unknown as number;
  }

  private stopTimer() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private dimGraph() {
    const storyNodeSet = new Set(this.storyNodes);

    this.nodesDataSet.update(
      this.nodesDataSet.get().map((n) => {
        if (n.id && storyNodeSet.has(n.id as string)) {
          return {
            id: n.id,
            color: { background: 'rgba(30, 40, 55, 0.6)', border: 'rgba(0, 229, 255, 0.4)' },
            font: { color: 'rgba(255, 255, 255, 0.7)', size: 12 }
          };
        } else {
          return {
            id: n.id,
            color: { background: 'rgba(20, 22, 28, 0.25)', border: 'rgba(50, 60, 75, 0.3)' },
            font: { color: 'rgba(255, 255, 255, 0.15)', size: 10 }
          };
        }
      })
    );

    this.edgesDataSet.update(
      this.edgesDataSet.get().map((e) => ({
        id: e.id,
        color: { color: 'rgba(40, 50, 65, 0.15)' },
        width: 1
      }))
    );
  }

  private renderCurrentStep() {
    if (this.currentIndex < 0 || this.currentIndex >= this.storyNodes.length) return;

    const activeNodeId = this.storyNodes[this.currentIndex];
    const visitedNodes = new Set(this.storyNodes.slice(0, this.currentIndex + 1));

    // Update nodes
    this.nodesDataSet.update(
      this.nodesDataSet.get().map((n) => {
        const idStr = n.id as string;

        if (idStr === activeNodeId) {
          // Current active node - glowing pulse
          return {
            id: n.id,
            color: {
              background: '#00e5ff',
              border: '#ffffff',
              highlight: { background: '#00ffaa', border: '#ffffff' }
            },
            font: { color: '#ffffff', size: 16 },
            shadow: { enabled: true, color: '#00e5ff', size: 30, x: 0, y: 0 }
          };
        } else if (visitedNodes.has(idStr)) {
          // Visited node in current trace
          return {
            id: n.id,
            color: {
              background: 'rgba(0, 229, 255, 0.35)',
              border: '#00e5ff'
            },
            font: { color: 'rgba(255, 255, 255, 0.95)', size: 13 },
            shadow: { enabled: true, color: '#00e5ff', size: 15, x: 0, y: 0 }
          };
        } else if (this.storyNodes.includes(idStr)) {
          // Future node in trace
          return {
            id: n.id,
            color: { background: 'rgba(255, 255, 255, 0.08)', border: 'rgba(0, 229, 255, 0.3)' },
            font: { color: 'rgba(255, 255, 255, 0.5)', size: 11 },
            shadow: false
          };
        } else {
          // Non-trace node
          return {
            id: n.id,
            color: { background: 'rgba(15, 18, 24, 0.15)', border: 'rgba(40, 45, 55, 0.2)' },
            font: { color: 'rgba(255, 255, 255, 0.1)' },
            shadow: false
          };
        }
      })
    );

    // Update edges between trace nodes up to current step
    const activeTraceEdges = new Set<string>();
    for (let i = 0; i < this.currentIndex; i++) {
      const from = this.storyNodes[i];
      const to = this.storyNodes[i + 1];
      const edge = this.sourceLinks.find((l) => (l.from === from && l.to === to) || (l.from === to && l.to === from));
      if (edge) {
        activeTraceEdges.add(edge.id || `${edge.from}-${edge.to}-${edge.type}`);
      }
    }

    this.edgesDataSet.update(
      this.edgesDataSet.get().map((e) => {
        const idStr = e.id as string;
        if (activeTraceEdges.has(idStr)) {
          return {
            id: e.id,
            color: { color: '#00e5ff' },
            width: 3.5,
            shadow: { enabled: true, color: '#00e5ff', size: 12, x: 0, y: 0 }
          };
        } else {
          return {
            id: e.id,
            color: { color: 'rgba(40, 50, 65, 0.12)' },
            width: 1,
            shadow: false
          };
        }
      })
    );

    // Camera focus on active node
    try {
      this.network.focus(activeNodeId, {
        scale: 1.05,
        animation: { duration: 600, easingFunction: 'easeInOutQuad' }
      });
    } catch {}

    if (this.onStepChange) {
      this.onStepChange(this.currentIndex, activeNodeId);
    }
    this.notifyState();
  }

  private resetGraphVisuals() {
    this.nodesDataSet.update(
      this.sourceNodes.map((dn) => {
        return {
          id: dn.id,
          color: {
            border: '#00e5ff',
            background: 'rgba(0, 229, 255, 0.1)'
          },
          font: { color: '#ffffff', size: 14 }
        };
      })
    );

    this.edgesDataSet.update(
      this.sourceLinks.map((dl) => ({
        id: dl.id || `${dl.from}-${dl.to}-${dl.type}`,
        color: { color: 'rgba(255, 255, 255, 0.25)' },
        width: 1.5
      }))
    );

    try {
      this.network.fit({ animation: { duration: 800, easingFunction: 'easeInOutQuad' } });
    } catch {}
  }

  private notifyState() {
    if (this.onStateChange) {
      this.onStateChange(this.isPlaying, this.currentIndex, this.storyNodes.length);
    }
  }
}
