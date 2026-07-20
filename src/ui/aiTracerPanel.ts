import { createIcons, icons } from 'lucide';
import { analyzeSituation, type SituationAnalysisResult } from '../aiService';
import { TracerAnimationController } from '../tracerAnimation';

export class AiTracerPanel {
  private container: HTMLElement;
  private animationController: TracerAnimationController;

  constructor(animationController: TracerAnimationController) {
    this.animationController = animationController;
    this.container = this.createPanelElement();
    document.body.appendChild(this.container);
    this.setupEventListeners();
    this.setupAnimationCallbacks();
  }

  private createPanelElement(): HTMLElement {
    const panel = document.createElement('aside');
    panel.id = 'ai-tracer-panel';
    panel.className = 'ai-panel hidden';

    const savedKey = localStorage.getItem('human_model_openrouter_key') || '';
    const savedModel = localStorage.getItem('human_model_openrouter_model') || 'google/gemini-2.5-flash:free';

    panel.innerHTML = `
      <div class="ai-panel-header">
        <div class="ai-title-wrap">
          <div class="ai-icon-badge"><i data-lucide="sparkles"></i></div>
          <div>
            <h2>Analiza Sytuacyjna AI</h2>
            <p class="ai-subtitle">Odkryj podskórną mechanikę swoich zachowań</p>
          </div>
        </div>
        <div class="ai-header-actions">
          <button id="btn-ai-settings" class="icon-btn-sm" title="Ustawienia API">
            <i data-lucide="settings"></i>
          </button>
          <button id="btn-close-ai-panel" class="icon-btn-sm" title="Zamknij">
            <i data-lucide="x"></i>
          </button>
        </div>
      </div>

      <div id="ai-settings-drawer" class="ai-settings-drawer hidden">
        <h4><i data-lucide="key"></i> Ustawienia OpenRouter API</h4>
        <label>
          Klucz API:
          <input type="password" id="input-openrouter-key" placeholder="sk-or-v1-..." value="${savedKey}" />
        </label>
        <label>
          Model LLM:
          <input type="text" id="input-openrouter-model" placeholder="google/gemini-2.5-flash:free" value="${savedModel}" />
        </label>
        <button id="btn-save-settings" class="btn-save-sm">Zapisz Ustawienia</button>
      </div>

      <div class="ai-panel-body">
        <section class="ai-input-section">
          <label for="ai-story-input" class="input-label">Opisz zdarzenie ze swojego dnia:</label>
          <textarea id="ai-story-input" rows="3" placeholder="np. Po 8h w pracy pokłóciłem się z partnerką o błogą rzecz..."></textarea>
          
          <div class="ai-presets-wrap">
            <span class="presets-label">Szybkie przykłady:</span>
            <div class="presets-chips">
              <button class="preset-chip" data-preset="Po 8 godzinach trudnej pracy pokłóciłem się z partnerką o błahostkę po wejściu do domu.">💬 Kłótnia po pracy</button>
              <button class="preset-chip" data-preset="Mimo mocnego postanowienia diety, po stresoogennej rozmowie z szefem zjadłem dużą pizzę i słodycze.">🍔 Zajadanie stresu</button>
              <button class="preset-chip" data-preset="Od trzech dni odkładam wysłanie trudnego maila z wyjaśnieniem błędu w projekcie i odczuwam ściśnięty żołądek.">⏰ Prokrastynacja zadania</button>
              <button class="preset-chip" data-preset="Gdy ktoś zajechał mi drogę w korku, poczułem gwałtowną falę wściekłości i uderzyłem w kierownicę.">⚡ Wybuch złości w korku</button>
            </div>
          </div>

          <button id="btn-run-analysis" class="btn-primary-ai">
            <i data-lucide="brain-circuit"></i>
            <span>Przeanalizuj Sytuację</span>
          </button>
        </section>

        <div id="ai-loading" class="ai-loading-state hidden">
          <div class="ai-spinner"></div>
          <p id="ai-loading-text">Dekomponuję sytuację na czynniki pierwsze...</p>
        </div>

        <div id="ai-error-box" class="ai-error-box hidden">
          <i data-lucide="alert-triangle"></i>
          <span id="ai-error-msg"></span>
        </div>

        <div id="ai-results-wrapper" class="ai-results-wrapper hidden">
          <div class="result-summary-card">
            <h3><i data-lucide="activity"></i> Synteza Mechaniki</h3>
            <p id="result-summary-text"></p>
            <div class="root-cause-badge">
              <strong>Przyczyna Źródłowa:</strong> <span id="result-root-cause"></span>
            </div>
          </div>

          <div class="ai-controls-card">
            <div class="controls-top-row">
              <span class="controls-title"><i data-lucide="play-circle"></i> Odtwarzacz Śladu</span>
              <span id="step-counter-badge" class="step-badge">Krok 0 / 0</span>
            </div>
            <div class="playback-btn-group">
              <button id="btn-trace-prev" class="ctrl-btn" title="Poprzedni krok"><i data-lucide="skip-back"></i></button>
              <button id="btn-trace-play" class="ctrl-btn main-play-btn" title="Odtwórz / Pauza"><i data-lucide="play"></i></button>
              <button id="btn-trace-next" class="ctrl-btn" title="Następny krok"><i data-lucide="skip-forward"></i></button>
              <button id="btn-trace-reset" class="ctrl-btn" title="Resetuj podświetlenie"><i data-lucide="rotate-ccw"></i></button>
            </div>
          </div>

          <div class="timeline-section">
            <h3><i data-lucide="list-ordered"></i> Sekwencja Przyczynowo-Skutkowa</h3>
            <div id="timeline-steps-list" class="timeline-steps-list"></div>
          </div>

          <div class="lifehack-result-card">
            <h3><i data-lucide="zap"></i> Wskazówka Operacyjna (Stoper)</h3>
            <p id="result-lifehack-text"></p>
          </div>
        </div>
      </div>
    `;

    return panel;
  }

  private setupEventListeners() {
    // Close panel
    this.container.querySelector('#btn-close-ai-panel')?.addEventListener('click', () => {
      this.close();
    });

    // Toggle settings drawer
    this.container.querySelector('#btn-ai-settings')?.addEventListener('click', () => {
      const drawer = this.container.querySelector('#ai-settings-drawer');
      drawer?.classList.toggle('hidden');
    });

    // Save settings
    this.container.querySelector('#btn-save-settings')?.addEventListener('click', () => {
      const keyInput = this.container.querySelector('#input-openrouter-key') as HTMLInputElement;
      const modelInput = this.container.querySelector('#input-openrouter-model') as HTMLInputElement;
      
      if (keyInput) localStorage.setItem('human_model_openrouter_key', keyInput.value.trim());
      if (modelInput) localStorage.setItem('human_model_openrouter_model', modelInput.value.trim());
      
      this.container.querySelector('#ai-settings-drawer')?.classList.add('hidden');
    });

    // Preset chips
    this.container.querySelectorAll('.preset-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const text = chip.getAttribute('data-preset');
        const textarea = this.container.querySelector('#ai-story-input') as HTMLTextAreaElement;
        if (text && textarea) {
          textarea.value = text;
        }
      });
    });

    // Run Analysis Button
    this.container.querySelector('#btn-run-analysis')?.addEventListener('click', () => {
      this.handleRunAnalysis();
    });

    // Playback Controls
    this.container.querySelector('#btn-trace-play')?.addEventListener('click', () => {
      if (this.animationController['isPlaying']) {
        this.animationController.pause();
      } else {
        this.animationController.play();
      }
    });

    this.container.querySelector('#btn-trace-prev')?.addEventListener('click', () => {
      this.animationController.prev();
    });

    this.container.querySelector('#btn-trace-next')?.addEventListener('click', () => {
      this.animationController.next();
    });

    this.container.querySelector('#btn-trace-reset')?.addEventListener('click', () => {
      this.animationController.reset();
    });
  }

  private setupAnimationCallbacks() {
    this.animationController.onStepChange = (index: number) => {
      this.updateActiveTimelineStep(index);
    };

    this.animationController.onStateChange = (isPlaying: boolean, index: number, total: number) => {
      const playBtn = this.container.querySelector('#btn-trace-play');
      if (playBtn) {
        playBtn.innerHTML = isPlaying ? '<i data-lucide="pause"></i>' : '<i data-lucide="play"></i>';
        createIcons({ icons });
      }

      const counterBadge = this.container.querySelector('#step-counter-badge');
      if (counterBadge) {
        const currentDisplay = index >= 0 ? index + 1 : 0;
        counterBadge.textContent = `Krok ${currentDisplay} / ${total}`;
      }
    };
  }

  private async handleRunAnalysis() {
    const textarea = this.container.querySelector('#ai-story-input') as HTMLTextAreaElement;
    const story = textarea?.value.trim();

    if (!story) {
      this.showError('Proszę opisać sytuację przed uruchomieniem analizy.');
      return;
    }

    this.hideError();
    this.showLoading(true);
    this.container.querySelector('#ai-results-wrapper')?.classList.add('hidden');

    const keyInput = this.container.querySelector('#input-openrouter-key') as HTMLInputElement;
    const modelInput = this.container.querySelector('#input-openrouter-model') as HTMLInputElement;

    try {
      const result = await analyzeSituation(story, keyInput?.value, modelInput?.value);
      this.renderResults(result);
      
      // Load animation into controller & auto-start trace
      this.animationController.loadTrace(result.storyNodes);
      this.animationController.play();
    } catch (err: any) {
      this.showError(err.message || 'Wystąpił nieoczekiwany błąd podczas analizy.');
    } finally {
      this.showLoading(false);
    }
  }

  private renderResults(result: SituationAnalysisResult) {
    const wrapper = this.container.querySelector('#ai-results-wrapper');
    if (!wrapper) return;

    wrapper.classList.remove('hidden');

    (this.container.querySelector('#result-summary-text') as HTMLElement).textContent = result.summary;
    (this.container.querySelector('#result-root-cause') as HTMLElement).textContent = result.rootCause;
    (this.container.querySelector('#result-lifehack-text') as HTMLElement).textContent = result.operationalLifehack;

    const timelineContainer = this.container.querySelector('#timeline-steps-list');
    if (timelineContainer) {
      timelineContainer.innerHTML = '';
      
      result.steps.forEach((step, idx) => {
        const stepEl = document.createElement('div');
        stepEl.className = 'timeline-step-card';
        stepEl.dataset.stepIndex = idx.toString();
        stepEl.dataset.nodeId = step.nodeId;

        stepEl.innerHTML = `
          <div class="step-num">${idx + 1}</div>
          <div class="step-content">
            <div class="step-header">
              <span class="step-node-badge">${step.nodeId}</span>
              <strong class="step-title">${step.title}</strong>
            </div>
            <p class="step-trigger">⚡ <strong>Wyzwalacz:</strong> ${step.trigger}</p>
            <p class="step-desc">🧠 <strong>Co się stało:</strong> ${step.whatHappened}</p>
            <p class="step-why">🔍 <strong>Mechanika:</strong> ${step.whyItHappened}</p>
          </div>
        `;

        stepEl.addEventListener('click', () => {
          this.animationController.stepTo(idx);
        });

        timelineContainer.appendChild(stepEl);
      });
    }

    createIcons({ icons });
  }

  private updateActiveTimelineStep(activeIndex: number) {
    const stepCards = this.container.querySelectorAll('.timeline-step-card');
    stepCards.forEach((card, idx) => {
      if (idx === activeIndex) {
        card.classList.add('active');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        card.classList.remove('active');
      }
    });
  }

  private showLoading(loading: boolean) {
    const loadingState = this.container.querySelector('#ai-loading');
    if (loading) {
      loadingState?.classList.remove('hidden');
    } else {
      loadingState?.classList.add('hidden');
    }
  }

  private showError(msg: string) {
    const errBox = this.container.querySelector('#ai-error-box');
    const errMsg = this.container.querySelector('#ai-error-msg');
    if (errBox && errMsg) {
      errMsg.textContent = msg;
      errBox.classList.remove('hidden');
    }
  }

  private hideError() {
    this.container.querySelector('#ai-error-box')?.classList.add('hidden');
  }

  public open() {
    this.container.classList.remove('hidden');
    createIcons({ icons });
  }

  public close() {
    this.container.classList.add('hidden');
    this.animationController.reset();
  }

  public toggle() {
    if (this.container.classList.contains('hidden')) {
      this.open();
    } else {
      this.close();
    }
  }
}
