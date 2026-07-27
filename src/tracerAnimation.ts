import type { Network, Node, Edge } from 'vis-network';
import type { DataSet } from 'vis-data';
import type { DomainNode, DomainLink } from './data';

export class TracerAnimationController {
  private network: Network;
  private nodesDataSet: DataSet<Node>;
  private edgesDataSet: DataSet<Edge>;
  private sourceNodes: DomainNode[];
  private sourceLinks: DomainLink[];
  private nodeMapper?: (dn: DomainNode) => Node;
  private edgeMapper?: (dl: DomainLink) => Edge;

  private storyNodes: string[] = [];
  private matchedLinks: DomainLink[] = [];
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
    sourceLinks: DomainLink[],
    nodeMapper?: (dn: DomainNode) => Node,
    edgeMapper?: (dl: DomainLink) => Edge
  ) {
    this.network = network;
    this.nodesDataSet = nodesDataSet;
    this.edgesDataSet = edgesDataSet;
    this.sourceNodes = sourceNodes;
    this.sourceLinks = sourceLinks;
    this.nodeMapper = nodeMapper;
    this.edgeMapper = edgeMapper;
  }

  public updateReferences(
    network: Network,
    nodesDataSet: DataSet<Node>,
    edgesDataSet: DataSet<Edge>,
    sourceNodes: DomainNode[],
    sourceLinks: DomainLink[],
    nodeMapper?: (dn: DomainNode) => Node,
    edgeMapper?: (dl: DomainLink) => Edge
  ) {
    this.network = network;
    this.nodesDataSet = nodesDataSet;
    this.edgesDataSet = edgesDataSet;
    this.sourceNodes = sourceNodes;
    this.sourceLinks = sourceLinks;
    this.nodeMapper = nodeMapper;
    this.edgeMapper = edgeMapper;
  }

  public loadTrace(storyNodes: string[], matchedLinks: DomainLink[] = []) {
    this.stopTimer();
    this.storyNodes = storyNodes;
    this.matchedLinks = matchedLinks;
    this.currentIndex = -1;
    this.isPlaying = false;
    this.dimGraph();
  }

  public restoreActiveStep() {
    if (this.storyNodes.length === 0) return;
    if (this.currentIndex < 0) {
      this.currentIndex = 0;
    }
    this.dimGraph();
    this.renderCurrentStep();
    this.notifyState();
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
      this.currentIndex = this.storyNodes.length - 1;
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
      this.sourceNodes.map((dn) => {
        const mapped = this.nodeMapper ? this.nodeMapper(dn) : null;
        const baseBorder = (mapped?.color as any)?.border || '#00e5ff';
        const baseBg = (mapped?.color as any)?.background || 'rgba(0, 229, 255, 0.1)';

        if (storyNodeSet.has(dn.id)) {
          return {
            id: dn.id,
            color: { background: baseBg, border: baseBorder },
            font: mapped?.font || { color: 'rgba(255, 255, 255, 0.85)', size: 12 }
          };
        } else {
          return {
            id: dn.id,
            color: { background: 'rgba(20, 22, 28, 0.25)', border: 'rgba(50, 60, 75, 0.3)' },
            font: { color: 'rgba(255, 255, 255, 0.18)', size: 10 }
          };
        }
      })
    );

    this.edgesDataSet.update(
      this.sourceLinks.map((dl) => {
        const mapped = this.edgeMapper ? this.edgeMapper(dl) : null;
        return {
          id: mapped?.id || dl.id || `${dl.from}-${dl.to}-${dl.type}`,
          color: { color: 'rgba(40, 50, 65, 0.15)' },
          dashes: mapped?.dashes,
          width: 1,
          font: { size: 0 }
        };
      })
    );
  }

  private renderCurrentStep() {
    if (this.currentIndex < 0 || this.currentIndex >= this.storyNodes.length) return;

    const activeNodeId = this.storyNodes[this.currentIndex];
    const visitedNodes = new Set(this.storyNodes.slice(0, this.currentIndex + 1));

    this.nodesDataSet.update(
      this.sourceNodes.map((dn) => {
        const mapped = this.nodeMapper ? this.nodeMapper(dn) : null;
        const baseBorder = (mapped?.color as any)?.border || '#00e5ff';
        const baseGlow = (mapped?.shadow as any)?.color || baseBorder;

        if (dn.id === activeNodeId) {
          return {
            id: dn.id,
            color: {
              background: baseBorder,
              border: '#ffffff',
              highlight: { background: baseBorder, border: '#ffffff' }
            },
            font: { color: '#ffffff', size: 16 },
            shadow: { enabled: true, color: baseGlow, size: 32, x: 0, y: 0 }
          };
        } else if (visitedNodes.has(dn.id)) {
          return {
            id: dn.id,
            color: {
              background: baseBorder,
              border: baseBorder
            },
            font: { color: 'rgba(255, 255, 255, 0.95)', size: 13 },
            shadow: { enabled: true, color: baseGlow, size: 16, x: 0, y: 0 }
          };
        } else if (this.storyNodes.includes(dn.id)) {
          return {
            id: dn.id,
            color: {
              background: (mapped?.color as any)?.background || 'rgba(255, 255, 255, 0.08)',
              border: baseBorder
            },
            font: { color: 'rgba(255, 255, 255, 0.5)', size: 11 },
            shadow: false
          };
        } else {
          return {
            id: dn.id,
            color: { background: 'rgba(15, 18, 24, 0.15)', border: 'rgba(40, 45, 55, 0.2)' },
            font: { color: 'rgba(255, 255, 255, 0.1)' },
            shadow: false
          };
        }
      })
    );

    const activeTraceEdgeIds = new Set<string>();
    for (let i = 0; i < this.currentIndex; i++) {
      const u = this.storyNodes[i];
      const v = this.storyNodes[i + 1];

      const edge =
        this.matchedLinks.find((l) => l.from === u && l.to === v) ||
        this.matchedLinks.find((l) => l.from === v && l.to === u) ||
        this.sourceLinks.find((l) => l.from === u && l.to === v) ||
        this.sourceLinks.find((l) => l.from === v && l.to === u);

      if (edge) {
        activeTraceEdgeIds.add(edge.id || `${edge.from}-${edge.to}-${edge.type}`);
      }
    }

    const currentStepEdgeId =
      this.currentIndex > 0
        ? String(
            (
              this.matchedLinks.find(
                (l) =>
                  (l.from === this.storyNodes[this.currentIndex - 1] && l.to === this.storyNodes[this.currentIndex]) ||
                  (l.from === this.storyNodes[this.currentIndex] && l.to === this.storyNodes[this.currentIndex - 1])
              ) ||
              this.sourceLinks.find(
                (l) =>
                  (l.from === this.storyNodes[this.currentIndex - 1] && l.to === this.storyNodes[this.currentIndex]) ||
                  (l.from === this.storyNodes[this.currentIndex] && l.to === this.storyNodes[this.currentIndex - 1])
              )
            )?.id || `${this.storyNodes[this.currentIndex - 1]}-${this.storyNodes[this.currentIndex]}`
          )
        : null;

    this.edgesDataSet.update(
      this.sourceLinks.map((dl) => {
        const mapped = this.edgeMapper ? this.edgeMapper(dl) : null;
        const edgeId = String(mapped?.id || dl.id || `${dl.from}-${dl.to}-${dl.type}`);

        if (activeTraceEdgeIds.has(edgeId)) {
          const mappedColor = (mapped?.color as any)?.color || '#ffffff';
          const traceColor = typeof mapped?.color === 'object' ? mappedColor : mapped?.color || '#ffffff';
          const isCurrentEdge = currentStepEdgeId && edgeId.includes(currentStepEdgeId);

          return {
            id: edgeId,
            color: { color: traceColor, highlight: traceColor },
            width: isCurrentEdge ? Math.max(((mapped?.width as number) || 1.5) * 2.5, 4) : Math.max(((mapped?.width as number) || 1.5) * 1.5, 2.5),
            dashes: mapped?.dashes,
            arrows: mapped?.arrows || { to: { enabled: true, scaleFactor: 1.0 } },
            shadow: { enabled: true, color: traceColor, size: isCurrentEdge ? 20 : 10, x: 0, y: 0 },
            font: isCurrentEdge
              ? {
                  color: 'rgba(0,0,0,0)',
                  size: 11,
                  face: 'Inter',
                  background: 'rgba(0,0,0,0)',
                  strokeWidth: 0
                }
              : { size: 0 }
          };
        } else {
          return {
            id: edgeId,
            color: { color: 'rgba(40, 50, 65, 0.12)' },
            width: 1,
            dashes: mapped?.dashes,
            shadow: false,
            font: { size: 0 }
          };
        }
      })
    );

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
    if (this.nodeMapper && this.edgeMapper) {
      this.nodesDataSet.update(this.sourceNodes.map(this.nodeMapper));
      this.edgesDataSet.update(this.sourceLinks.map(this.edgeMapper));
    } else {
      this.nodesDataSet.update(
        this.sourceNodes.map((dn) => ({
          id: dn.id,
          color: { border: '#00e5ff', background: 'rgba(0, 229, 255, 0.1)' },
          font: { color: '#ffffff', size: 14 }
        }))
      );

      this.edgesDataSet.update(
        this.sourceLinks.map((dl) => ({
          id: dl.id || `${dl.from}-${dl.to}-${dl.type}`,
          color: { color: 'rgba(255, 255, 255, 0.25)' },
          width: 1.5
        }))
      );
    }

    try {
      this.network.fit({ animation: { duration: 800, easingFunction: 'easeInOutQuad' } });
    } catch {}
  }

  private notifyState() {
    if (this.onStateChange) {
      const clampedCurrent = Math.max(0, Math.min(this.currentIndex, this.storyNodes.length - 1));
      this.onStateChange(this.isPlaying, clampedCurrent, this.storyNodes.length);
    }
  }
}
