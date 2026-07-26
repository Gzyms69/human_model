import { createIcons, icons } from 'lucide';
import { analyzeSituation, generateClarifyingQuestions, type SituationAnalysisResult } from '../aiService';
import { TracerAnimationController } from '../tracerAnimation';
import { MIKRO_NODES } from '../data';
import { initiateOpenRouterLogin } from '../openrouterAuth';

export class AiTracerPanel {
  private container: HTMLElement;
  private animationController: TracerAnimationController;
  private lastAnalysisResult: SituationAnalysisResult | null = null;

  constructor(animationController: TracerAnimationController) {
    this.animationController = animationController;
    this.container = this.createPanelElement();
    document.body.appendChild(this.container);
    this.setupEventListeners();
    this.setupAnimationCallbacks();
    this.setupTopPlayerEventListeners();
    this.updateAuthState();
  }

  private createPanelElement(): HTMLElement {
    const panel = document.createElement('aside');
    panel.id = 'ai-tracer-panel';
    panel.className = 'ai-panel hidden';

    const savedKey = localStorage.getItem('human_model_openrouter_key') || '';
    const savedModel = localStorage.getItem('human_model_openrouter_model') || 'google/gemma-2-9b-it:free';

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
        <h4><i data-lucide="key"></i> Ustawienia API (OpenRouter / Google AI Studio)</h4>
        <label>
          Klucz API (OpenRouter lub Google AI Studio):
          <input type="password" id="input-openrouter-key" placeholder="sk-or-v1-... lub AIzaSy..." value="${savedKey}" />
        </label>
        <label>
          Model Domyślny OpenRouter:
          <select id="select-openrouter-model" class="model-select">
            <option value="google/gemma-2-9b-it:free" ${savedModel === 'google/gemma-2-9b-it:free' ? 'selected' : ''}>Google Gemma 2 9B (Free)</option>
            <option value="meta-llama/llama-3.3-70b-instruct:free" ${savedModel === 'meta-llama/llama-3.3-70b-instruct:free' ? 'selected' : ''}>Meta LLaMA 3.3 70B (Free)</option>
            <option value="qwen/qwen-2.5-72b-instruct:free" ${savedModel === 'qwen/qwen-2.5-72b-instruct:free' ? 'selected' : ''}>Qwen 2.5 72B (Free)</option>
            <option value="deepseek/deepseek-r1:free" ${savedModel === 'deepseek/deepseek-r1:free' ? 'selected' : ''}>DeepSeek R1 (Free)</option>
            <option value="google/gemini-2.5-flash:free" ${savedModel === 'google/gemini-2.5-flash:free' ? 'selected' : ''}>Google Gemini 2.5 Flash (Free)</option>
            <option value="openrouter/free" ${savedModel === 'openrouter/free' ? 'selected' : ''}>Auto OpenRouter Router (Free)</option>
          </select>
        </label>
        <div class="settings-actions">
          <button id="btn-save-settings" class="btn-save-sm">Zapisz Ustawienia</button>
          <button id="btn-clear-settings" class="btn-clear-sm" style="margin-left: 8px; background: transparent; border: 1px solid var(--border-color, #444); color: #ff6b6b; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Usuń Klucz</button>
        </div>
      </div>

      <div class="ai-panel-body">
        <!-- LOGIN WALL SECTION -->
        <div id="ai-login-wall" class="ai-login-wall hidden">
          <div class="login-wall-card">
            <div class="login-icon-badge">
              <i data-lucide="shield-lock"></i>
            </div>
            <h3>Wymagane Logowanie / Klucz API</h3>
            <p>
              Darmowa analiza behawioralna AI wymaga połączenia z Twoim darmowym kontem OpenRouter.
              Zaloguj się przez Google, aby pobrać Twój osobisty API Key i odblokować analizę.
            </p>
            <button id="btn-login-openrouter" class="btn-openrouter-login">
              <svg class="google-icon" viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Zaloguj się przez Google / OpenRouter</span>
            </button>
            <div class="login-wall-footer">
              <span>Masz własny klucz API? <button id="btn-open-settings-link" class="btn-link">Wklej go w Ustawieniach</button></span>
            </div>
          </div>
        </div>

        <!-- INPUT SECTION -->
        <section id="ai-input-section" class="ai-input-section">
          <label for="ai-story-input" class="input-label">Opisz zdarzenie ze swojego dnia:</label>
          <textarea id="ai-story-input" rows="3" placeholder="np. Po całym tygodniu pracy bez ani dnia przerwy pokłóciłem się i zerwałem z dziewczyną. Co się stało tak naprawdę?"></textarea>
          
          <div class="ai-presets-wrap">
            <span class="presets-label">Szybkie przykłady:</span>
            <div class="presets-chips">
              <button class="preset-chip" data-preset="Po całym tygodniu pracy bez ani dnia przerwy pokłóciłem się i zerwałem z dziewczyną. Co się stało tak naprawdę?">💬 Kłótnia po pracy</button>
              <button class="preset-chip" data-preset="Mimo mocnego postanowienia diety, po stresoogennej rozmowie z szefem zjadłem dużą pizzę i słodycze.">🍔 Zajadanie stresu</button>
              <button class="preset-chip" data-preset="Od trzech dni odkładam wysłanie trudnego maila z wyjaśnieniem błędu w projekcie i odczuwam ściśnięty żołądek.">⏰ Prokrastynacja zadania</button>
              <button class="preset-chip" data-preset="Gdy ktoś zajechał mi drogę w korku, poczułem gwałtowną falę wściekłości i uderzyłem w kierownicę.">⚡ Wybuch złości w korku</button>
            </div>
          </div>

          <button id="btn-start-interview" class="btn-primary-ai">
            <i data-lucide="help-circle"></i>
            <span>Przeanalizuj Sytuację (Wywiad Doprecyzowujący)</span>
          </button>
        </section>

        <!-- STAGE 2: CLARIFYING QUESTIONS INTERVIEW -->
        <div id="ai-interview-wrapper" class="ai-interview-wrapper hidden">
          <div class="interview-header-card">
            <h3><i data-lucide="message-square"></i> Doprecyzowanie Kontekstu (3 Pytania AI)</h3>
            <p>Aby analiza była w 100% trafna, odpowiedz krótko na poniższe pytania:</p>
          </div>

          <div id="interview-questions-list" class="interview-questions-list"></div>

          <div class="interview-actions">
            <button id="btn-submit-interview" class="btn-primary-ai">
              <i data-lucide="brain-circuit"></i>
              <span>Wygeneruj Głęboki Ślad AI</span>
            </button>
            <button id="btn-skip-interview" class="btn-secondary-ai">
              <i data-lucide="zap"></i>
              <span>Pomiń wywiad i generuj od razu</span>
            </button>
          </div>
        </div>

        <div id="ai-loading" class="ai-loading-state hidden">
          <div class="ai-spinner"></div>
          <p id="ai-loading-text">Dekomponuję sytuację na czynniki pierwsze...</p>
        </div>

        <div id="ai-error-box" class="ai-error-box hidden">
          <i data-lucide="alert-triangle"></i>
          <span id="ai-error-msg"></span>
        </div>

        <!-- STAGE 3: RESULTS WRAPPER -->
        <div id="ai-results-wrapper" class="ai-results-wrapper hidden">
          <!-- CONTEXT HEADER CARD -->
          <div id="result-context-card" class="result-context-card">
            <div class="context-card-top">
              <h3><i data-lucide="file-text"></i> Kontekst Zgłoszenia i Wywiadu</h3>
              <button id="btn-edit-story" class="btn-edit-sm"><i data-lucide="edit-2"></i> Edytuj</button>
            </div>
            <div class="context-story-box">
              <strong>💬 Pierwotny Opis:</strong>
              <p id="context-story-text"></p>
            </div>
            <div id="context-answers-box" class="context-answers-box hidden">
              <strong>❓ Doprecyzowanie Faktów (Wywiad):</strong>
              <div id="context-qa-list" class="context-qa-list"></div>
            </div>
          </div>

          <!-- DYNAMIC SYNTHESIS CARD -->
          <div class="result-summary-card">
            <div class="card-header-flex">
              <h3 id="synthesis-header-title"><i data-lucide="activity"></i> Synteza Mechaniki</h3>
              <span id="result-model-badge" class="model-used-badge"></span>
            </div>
            <p id="result-summary-text"></p>
            <div class="root-cause-badge">
              <strong>Przyczyna Źródłowa:</strong> <span id="result-root-cause"></span>
            </div>
          </div>

          <div id="observer-card" class="observer-result-card hidden">
            <h3><i data-lucide="eye"></i> Rola Jaźni / Obserwator (m1)</h3>
            <p id="result-observer-text"></p>
          </div>

          <div class="timeline-section">
            <h3><i data-lucide="list-ordered"></i> Sekwencja Przepływu Kroki</h3>
            <div id="timeline-steps-list" class="timeline-steps-list"></div>
          </div>

          <div class="lifehack-result-card">
            <h3><i data-lucide="zap"></i> Wskazówka Operacyjna (Stoper)</h3>
            <p id="result-lifehack-text"></p>
          </div>

          <div class="results-export-actions">
            <button id="btn-copy-report" class="btn-export-primary">
              <i data-lucide="copy"></i>
              <span>Kopiuj Pełny Raport Analizy (.md)</span>
            </button>
          </div>
        </div>
      </div>
    `;

    return panel;
  }

  private setupEventListeners() {
    this.container.querySelector('#btn-close-ai-panel')?.addEventListener('click', () => {
      this.close();
    });

    this.container.querySelector('#btn-ai-settings')?.addEventListener('click', () => {
      const drawer = this.container.querySelector('#ai-settings-drawer');
      drawer?.classList.toggle('hidden');
    });

    this.container.querySelector('#btn-save-settings')?.addEventListener('click', () => {
      const keyInput = this.container.querySelector('#input-openrouter-key') as HTMLInputElement;
      const modelSelect = this.container.querySelector('#select-openrouter-model') as HTMLSelectElement;
      
      if (keyInput) localStorage.setItem('human_model_openrouter_key', keyInput.value.trim());
      if (modelSelect) localStorage.setItem('human_model_openrouter_model', modelSelect.value.trim());
      
      this.container.querySelector('#ai-settings-drawer')?.classList.add('hidden');
      this.updateAuthState();
    });

    this.container.querySelector('#btn-clear-settings')?.addEventListener('click', () => {
      localStorage.removeItem('human_model_openrouter_key');
      const keyInput = this.container.querySelector('#input-openrouter-key') as HTMLInputElement;
      if (keyInput) keyInput.value = '';
      this.container.querySelector('#ai-settings-drawer')?.classList.add('hidden');
      this.updateAuthState();
    });

    this.container.querySelector('#btn-login-openrouter')?.addEventListener('click', () => {
      initiateOpenRouterLogin();
    });

    this.container.querySelector('#btn-open-settings-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      const drawer = this.container.querySelector('#ai-settings-drawer');
      drawer?.classList.remove('hidden');
    });

    this.container.querySelectorAll('.preset-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const text = chip.getAttribute('data-preset');
        const textarea = this.container.querySelector('#ai-story-input') as HTMLTextAreaElement;
        if (text && textarea) {
          textarea.value = text;
        }
      });
    });

    this.container.querySelector('#btn-start-interview')?.addEventListener('click', () => {
      this.handleStartInterview();
    });

    this.container.querySelector('#btn-submit-interview')?.addEventListener('click', () => {
      this.handleRunFullAnalysisWithInterview();
    });

    this.container.querySelector('#btn-skip-interview')?.addEventListener('click', () => {
      this.handleRunFullAnalysisWithInterview(true);
    });

    this.container.querySelector('#btn-edit-story')?.addEventListener('click', () => {
      this.container.querySelector('#ai-results-wrapper')?.classList.add('hidden');
      this.container.querySelector('#ai-input-section')?.classList.remove('hidden');
    });

    this.container.querySelector('#btn-copy-report')?.addEventListener('click', () => {
      this.handleCopyReport();
    });
  }

  private setupTopPlayerEventListeners() {
    document.getElementById('top-btn-play')?.addEventListener('click', () => {
      if (this.animationController['isPlaying']) {
        this.animationController.pause();
      } else {
        this.animationController.play();
      }
    });

    document.getElementById('top-btn-prev')?.addEventListener('click', () => {
      this.animationController.prev();
    });

    document.getElementById('top-btn-next')?.addEventListener('click', () => {
      this.animationController.next();
    });

    document.getElementById('top-btn-reset')?.addEventListener('click', () => {
      this.animationController.reset();
    });

    document.getElementById('top-btn-close-player')?.addEventListener('click', () => {
      this.hideTopPlayer();
      this.animationController.reset();
    });
  }

  private setupAnimationCallbacks() {
    this.animationController.onStepChange = (index: number, nodeId: string) => {
      this.updateActiveTimelineStep(index);
      this.updateDynamicSynthesisHeader(index, nodeId);
      this.updateTopPlayerStepInfo(index, nodeId);
    };

    this.animationController.onStateChange = (isPlaying: boolean, index: number, total: number) => {
      const topPlayBtn = document.getElementById('top-btn-play');
      if (topPlayBtn) {
        topPlayBtn.innerHTML = isPlaying ? '<i data-lucide="pause"></i>' : '<i data-lucide="play"></i>';
        createIcons({ icons });
      }

      const topStepCounter = document.getElementById('top-step-counter');
      if (topStepCounter) {
        const displayStep = Math.min(index + 1, total);
        topStepCounter.textContent = `Krok ${displayStep} / ${total}`;
      }
    };
  }

  private updateTopPlayerStepInfo(index: number, nodeId: string) {
    const titleEl = document.getElementById('top-step-title');
    if (!titleEl) return;

    const nodeDef = MIKRO_NODES.find((n) => n.id === nodeId);
    const title = nodeDef ? `${nodeId} - ${nodeDef.title}` : nodeId;

    if (this.lastAnalysisResult && index >= 0 && index < this.lastAnalysisResult.storyNodes.length - 1) {
      const u = this.lastAnalysisResult.storyNodes[index];
      const v = this.lastAnalysisResult.storyNodes[index + 1];
      const edgeExp = (this.lastAnalysisResult.edgeExplanations || []).find(
        (e) => (e.fromNodeId === u && e.toNodeId === v) || (e.fromNodeId === v && e.toNodeId === u)
      );

      if (edgeExp?.transitionText) {
        titleEl.textContent = `${nodeId} ➔ ${v}: ${edgeExp.transitionText.slice(0, 45)}...`;
        return;
      }
    }

    titleEl.textContent = title;
  }

  private showTopPlayer() {
    const player = document.getElementById('top-tracer-player');
    if (player) {
      player.classList.remove('hidden');
      createIcons({ icons });
    }
  }

  private hideTopPlayer() {
    const player = document.getElementById('top-tracer-player');
    if (player) {
      player.classList.add('hidden');
    }
  }

  private async handleStartInterview() {
    const textarea = this.container.querySelector('#ai-story-input') as HTMLTextAreaElement;
    const story = textarea?.value.trim();

    if (!story) {
      this.showError('Proszę opisać sytuację przed uruchomieniem analizy.');
      return;
    }

    this.hideError();
    this.showLoading(true, 'AI analizuje wstępnie sytuację i generuje pytania...');
    this.container.querySelector('#ai-results-wrapper')?.classList.add('hidden');
    this.container.querySelector('#ai-interview-wrapper')?.classList.add('hidden');

    const keyInput = this.container.querySelector('#input-openrouter-key') as HTMLInputElement;
    const modelSelect = this.container.querySelector('#select-openrouter-model') as HTMLSelectElement;

    try {
      const questions = await generateClarifyingQuestions(story, keyInput?.value, modelSelect?.value);
      this.renderInterviewQuestions(questions);
      this.container.querySelector('#ai-interview-wrapper')?.classList.remove('hidden');
      this.container.querySelector('#ai-interview-wrapper')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err: any) {
      this.showError(err.message || 'Nie udało się wygenerować pytań.');
    } finally {
      this.showLoading(false);
    }
  }

  private renderInterviewQuestions(questions: string[]) {
    const list = this.container.querySelector('#interview-questions-list');
    if (!list) return;

    list.innerHTML = '';
    questions.forEach((q, idx) => {
      const qBox = document.createElement('div');
      qBox.className = 'interview-question-box';
      qBox.innerHTML = `
        <label class="q-label">Pytanie ${idx + 1}: ${q}</label>
        <input type="text" class="interview-answer-input" data-question="${q}" placeholder="Krótka odpowiedź (opcjonalnie)..." />
      `;
      list.appendChild(qBox);
    });
  }

  private async handleRunFullAnalysisWithInterview(skipAnswers: boolean = false) {
    const textarea = this.container.querySelector('#ai-story-input') as HTMLTextAreaElement;
    const story = textarea?.value.trim();

    if (!story) return;

    const answersMap: Record<string, string> = {};
    if (!skipAnswers) {
      const answerInputs = this.container.querySelectorAll('.interview-answer-input');
      answerInputs.forEach((input) => {
        const inp = input as HTMLInputElement;
        const q = inp.dataset.question;
        const val = inp.value.trim();
        if (q && val) {
          answersMap[q] = val;
        }
      });
    }

    this.hideError();
    this.showLoading(true, 'Generuję głęboką sekwencję przepływu na grafie...');
    this.container.querySelector('#ai-interview-wrapper')?.classList.add('hidden');

    const keyInput = this.container.querySelector('#input-openrouter-key') as HTMLInputElement;
    const modelSelect = this.container.querySelector('#select-openrouter-model') as HTMLSelectElement;

    try {
      const result = await analyzeSituation(story, answersMap, keyInput?.value, modelSelect?.value);
      this.lastAnalysisResult = result;
      this.renderResults(result);
      
      this.showTopPlayer();
      this.animationController.loadTrace(result.storyNodes, result.matchedLinks);
      this.animationController.play();
    } catch (err: any) {
      this.showError(err.message || 'Wystąpił błąd podczas analizy.');
    } finally {
      this.showLoading(false);
    }
  }

  private renderResults(result: SituationAnalysisResult) {
    const wrapper = this.container.querySelector('#ai-results-wrapper');
    if (!wrapper) return;

    wrapper.classList.remove('hidden');

    // Context Card Render
    const storyTextEl = this.container.querySelector('#context-story-text');
    if (storyTextEl) storyTextEl.textContent = result.initialStory || 'Brak wpisu';

    const answersBox = this.container.querySelector('#context-answers-box');
    const qaList = this.container.querySelector('#context-qa-list');
    if (result.interviewAnswers && Object.keys(result.interviewAnswers).length > 0 && answersBox && qaList) {
      qaList.innerHTML = '';
      Object.entries(result.interviewAnswers).forEach(([q, a]) => {
        const qaItem = document.createElement('div');
        qaItem.className = 'context-qa-item';
        qaItem.innerHTML = `<span class="qa-q">❓ ${q}</span><span class="qa-a">➔ ${a}</span>`;
        qaList.appendChild(qaItem);
      });
      answersBox.classList.remove('hidden');
    } else if (answersBox) {
      answersBox.classList.add('hidden');
    }

    (this.container.querySelector('#result-summary-text') as HTMLElement).textContent = result.summary;
    (this.container.querySelector('#result-root-cause') as HTMLElement).textContent = result.rootCause;
    (this.container.querySelector('#result-lifehack-text') as HTMLElement).textContent = result.operationalLifehack;

    const modelBadge = this.container.querySelector('#result-model-badge');
    if (modelBadge) {
      modelBadge.textContent = result.usedModel ? `AI: ${result.usedModel}` : '';
    }

    const observerCard = this.container.querySelector('#observer-card');
    const observerText = this.container.querySelector('#result-observer-text');
    if (result.observerRoleSummary && observerCard && observerText) {
      observerText.textContent = result.observerRoleSummary;
      observerCard.classList.remove('hidden');
    }

    const timelineContainer = this.container.querySelector('#timeline-steps-list');
    if (timelineContainer) {
      timelineContainer.innerHTML = '';
      
      result.steps.forEach((step, idx) => {
        const stepEl = document.createElement('div');
        const isObserver = step.nodeId === 'm1';
        stepEl.className = `timeline-step-card ${isObserver ? 'observer-step' : ''}`;
        stepEl.dataset.stepIndex = idx.toString();
        stepEl.dataset.nodeId = step.nodeId;

        stepEl.innerHTML = `
          <div class="step-num ${isObserver ? 'observer-num' : ''}">${idx + 1}</div>
          <div class="step-content">
            <div class="step-header">
              <span class="step-node-badge ${isObserver ? 'observer-node-badge' : ''}">${step.nodeId}</span>
              <strong class="step-title">${step.title}</strong>
              ${isObserver ? '<span class="observer-tag">KLUCZOWY OBSERWATOR</span>' : ''}
            </div>
            <p class="step-trigger">⚡ <strong>Wyzwalacz:</strong> ${step.trigger}</p>
            <p class="step-desc">🧠 <strong>Co się stało:</strong> ${step.whatHappened}</p>
            <p class="step-why">🔍 <strong>Mechanika kroku:</strong> ${step.whyItHappened}</p>
          </div>
        `;

        stepEl.addEventListener('click', () => {
          this.animationController.stepTo(idx);
        });

        timelineContainer.appendChild(stepEl);

        if (idx < result.steps.length - 1) {
          const nextStep = result.steps[idx + 1];
          const edgeExp = (result.edgeExplanations || []).find(
            (e) =>
              (e.fromNodeId === step.nodeId && e.toNodeId === nextStep.nodeId) ||
              (e.fromNodeId === nextStep.nodeId && e.toNodeId === step.nodeId)
          );

          const transitionCard = document.createElement('div');
          transitionCard.className = 'edge-transition-card';
          transitionCard.innerHTML = `
            <div class="edge-line-visual"></div>
            <div class="edge-text-content">
              <span class="edge-flow-arrow">➔ PRZEPŁYW IMPETU (${step.nodeId} ➔ ${nextStep.nodeId}):</span>
              <p>${edgeExp?.transitionText || `Przeniesienie sygnału z ${step.title} do ${nextStep.title}.`}</p>
            </div>
          `;
          timelineContainer.appendChild(transitionCard);
        }
      });
    }

    createIcons({ icons });
  }

  private handleCopyReport() {
    if (!this.lastAnalysisResult) return;

    const r = this.lastAnalysisResult;
    let md = `# Raport Analizy Sytuacyjnej Human Model\n\n`;
    md += `**Czas:** ${r.createdAt || 'b/d'} | **Model AI:** ${r.usedModel || 'b/d'}\n\n`;
    md += `## 💬 Pierwotna Sytuacja Zgłoszona\n> ${r.initialStory}\n\n`;

    if (r.interviewAnswers && Object.keys(r.interviewAnswers).length > 0) {
      md += `## ❓ Doprecyzowanie z Wywiadu\n`;
      Object.entries(r.interviewAnswers).forEach(([q, a]) => {
        md += `- **Pytanie:** ${q}\n  - **Odpowiedź:** ${a}\n`;
      });
      md += `\n`;
    }

    md += `## 🧠 Synteza Mechaniki\n${r.summary}\n\n`;
    md += `**Przyczyna Źródłowa:** ${r.rootCause}\n\n`;
    md += `## 👁️ Rola Jaźni / Obserwatora (m1)\n${r.observerRoleSummary}\n\n`;
    md += `## 🔄 Sekwencja Przepływu Kroki\n`;

    r.steps.forEach((s) => {
      md += `### Kroki ${s.step}: ${s.nodeId} - ${s.title}\n`;
      md += `- **Wyzwalacz:** ${s.trigger}\n`;
      md += `- **Co się stało:** ${s.whatHappened}\n`;
      md += `- **Mechanika:** ${s.whyItHappened}\n\n`;
    });

    md += `## ⚡ Wskazówka Operacyjna (Stoper)\n${r.operationalLifehack}\n`;

    navigator.clipboard.writeText(md).then(() => {
      const btn = this.container.querySelector('#btn-copy-report span');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = 'Skopiowano Raport w Markdown! ✓';
        setTimeout(() => {
          btn.textContent = orig;
        }, 2500);
      }
    });
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

  private updateDynamicSynthesisHeader(index: number, nodeId: string) {
    const headerTitle = this.container.querySelector('#synthesis-header-title');
    if (!headerTitle) return;

    const nodeDef = MIKRO_NODES.find((n) => n.id === nodeId);
    const nodeTitle = nodeDef ? nodeDef.title : nodeId;

    if (index >= 0) {
      headerTitle.innerHTML = `<i data-lucide="activity"></i> Synteza Mechaniki (Krok ${index + 1}: ${nodeTitle})`;
    } else {
      headerTitle.innerHTML = `<i data-lucide="activity"></i> Synteza Mechaniki`;
    }
    createIcons({ icons });
  }

  private showLoading(loading: boolean, text: string = 'Dekomponuję sytuację na czynniki pierwsze...') {
    const loadingState = this.container.querySelector('#ai-loading');
    const loadingText = this.container.querySelector('#ai-loading-text');
    if (loadingText) loadingText.textContent = text;
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

  public updateAuthState() {
    const savedKey = localStorage.getItem('human_model_openrouter_key') || '';
    const loginWall = this.container.querySelector('#ai-login-wall');
    const inputSection = this.container.querySelector('#ai-input-section');

    if (!savedKey.trim()) {
      loginWall?.classList.remove('hidden');
      inputSection?.classList.add('hidden');
    } else {
      loginWall?.classList.add('hidden');
      const interview = this.container.querySelector('#ai-interview-wrapper');
      const results = this.container.querySelector('#ai-results-wrapper');
      if (interview?.classList.contains('hidden') && results?.classList.contains('hidden')) {
        inputSection?.classList.remove('hidden');
      }
    }
  }

  public open() {
    this.updateAuthState();
    this.container.classList.remove('hidden');
    createIcons({ icons });
  }

  public close() {
    this.container.classList.add('hidden');
    this.hideTopPlayer();
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
