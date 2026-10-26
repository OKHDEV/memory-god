/**
 * 암기의 신 (Memory God) - 타격감 넘치는 장문 완벽 암기 엔진
 */

// ============================================================================
// 1. Web Audio API 기반 타격감 사운드 엔진 (SoundFX)
// ============================================================================
const SoundFX = {
  ctx: null,
  enabled: true,

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  toggle(enable) {
    this.enabled = enable !== undefined ? enable : !this.enabled;
    return this.enabled;
  },

  // 찰진 기계식 키보드 타건음 (단일 글자 입력 시)
  playKeyClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // 노이즈 버스트 (찰칵 소리)
    const bufferSize = this.ctx.sampleRate * 0.015;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(1400, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);

    // 가벼운 바디 틱
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320 + Math.random() * 80, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.02);

    oscGain.gain.setValueAtTime(0.08, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.025);
  },

  // 팡! 찰진 정답 타격음 (콤보에 따라 피치 상승)
  playHit(combo = 0) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const pitchOffset = Math.min(combo * 18, 240);

    // 1. 묵직한 펀치 킥
    const oscKick = this.ctx.createOscillator();
    const gainKick = this.ctx.createGain();
    oscKick.type = 'sine';
    oscKick.frequency.setValueAtTime(220 + pitchOffset, t);
    oscKick.frequency.exponentialRampToValueAtTime(45, t + 0.09);

    gainKick.gain.setValueAtTime(0.35, t);
    gainKick.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    oscKick.connect(gainKick);
    gainKick.connect(this.ctx.destination);
    oscKick.start(t);
    oscKick.stop(t + 0.1);

    // 2. 촥! 하는 크런치 스냅
    const oscSnap = this.ctx.createOscillator();
    const gainSnap = this.ctx.createGain();
    oscSnap.type = 'triangle';
    oscSnap.frequency.setValueAtTime(850 + pitchOffset, t);
    oscSnap.frequency.exponentialRampToValueAtTime(200, t + 0.06);

    gainSnap.gain.setValueAtTime(0.2, t);
    gainSnap.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    oscSnap.connect(gainSnap);
    gainSnap.connect(this.ctx.destination);
    oscSnap.start(t);
    oscSnap.stop(t + 0.07);
  },

  // 콤보 팡팡 아케이드 사운드 (3콤보 이상)
  playComboSound(combo) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const baseFreqs = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    const freq = baseFreqs[(combo % baseFreqs.length)];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.12);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  },

  // 문장 격파 사운드 (크리티컬 폭발 💥 + 승리 코드)
  playSentenceMastered() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 강력한 폭발음
    const oscBoom = this.ctx.createOscillator();
    const gainBoom = this.ctx.createGain();
    oscBoom.type = 'triangle';
    oscBoom.frequency.setValueAtTime(180, t);
    oscBoom.frequency.exponentialRampToValueAtTime(30, t + 0.35);

    gainBoom.gain.setValueAtTime(0.5, t);
    gainBoom.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    oscBoom.connect(gainBoom);
    gainBoom.connect(this.ctx.destination);
    oscBoom.start(t);
    oscBoom.stop(t + 0.36);

    // 반짝이는 챠임 아르페지오 (C5 - E5 - G5 - C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startT = t + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startT);

      gain.gain.setValueAtTime(0, startT);
      gain.gain.linearRampToValueAtTime(0.25, startT + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startT);
      osc.stop(startT + 0.32);
    });
  },

  // 오답 퍽! 둔탁한 타격음
  playErrorThud() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.linearRampToValueAtTime(50, t + 0.15);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  },

  // 100% 완전 정복 팡파레
  playFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [
      { f: 523.25, d: 0.15, offset: 0 },
      { f: 659.25, d: 0.15, offset: 0.15 },
      { f: 783.99, d: 0.15, offset: 0.3 },
      { f: 1046.5, d: 0.45, offset: 0.45 },
      { f: 880.00, d: 0.2, offset: 0.95 },
      { f: 1046.5, d: 0.7, offset: 1.15 }
    ];

    const t = this.ctx.currentTime;
    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startT = t + n.offset;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, startT);

      gain.gain.setValueAtTime(0.3, startT);
      gain.gain.exponentialRampToValueAtTime(0.001, startT + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startT);
      osc.stop(startT + n.d + 0.05);
    });
  }
};


// ============================================================================
// 2. 시각적 타격감 & 파티클 엔진 (VisualFX)
// ============================================================================
const VisualFX = {
  canvas: null,
  ctx: null,
  particles: [],
  animFrameId: null,

  init() {
    this.canvas = document.getElementById('particleCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.loop();
  },

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  // 팡! 스파크 파티클 터짐
  spawnHit(x, y, count = 12, colors = ['#fbbf24', '#f59e0b', '#38bdf8', '#818cf8', '#ffffff']) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      const size = 3 + Math.random() * 4;
      this.particles.push({
        x: x || window.innerWidth / 2,
        y: y || window.innerHeight / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: size,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: 0.025 + Math.random() * 0.03,
        gravity: 0.15
      });
    }
  },

  // 문장 완료 대폭발 파티클
  spawnBurst(x, y, count = 40) {
    const goldColors = ['#fbbf24', '#f59e0b', '#10b981', '#34d399', '#ffffff', '#e11d48'];
    this.spawnHit(x, y, count, goldColors);
  },

  // 화면 흔들림(Screen Shake) 효과
  shake(type = 'hit') {
    const app = document.getElementById('app');
    if (!app) return;
    const className = type === 'error' ? 'shake-error' : 'shake-hit';
    app.classList.remove('shake-hit', 'shake-error');
    void app.offsetWidth; // Force Reflow
    app.classList.add(className);
    setTimeout(() => {
      app.classList.remove(className);
    }, type === 'error' ? 250 : 150);
  },

  loop() {
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.fillStyle = p.color;
        this.ctx.shadowColor = p.color;
        this.ctx.shadowBlur = 8;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }
    this.animFrameId = requestAnimationFrame(() => this.loop());
  }
};


// ============================================================================
// 3. 한글 초성 분해 및 힌트 알고리즘 (ChosungEngine)
// ============================================================================
const ChosungEngine = {
  CHOSUNG_LIST: [
    'ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'
  ],

  // 한국어 초성 분리 또는 영문 첫글자 분리
  toChosungString(text) {
    return text.split('').map(char => {
      const code = char.charCodeAt(0);
      // 한글 음절 범위: 가(0xAC00) ~ 힣(0xD7A3)
      if (code >= 0xAC00 && code <= 0xD7A3) {
        const chosungIndex = Math.floor((code - 0xAC00) / (21 * 28));
        return `<span class="chosung-char">${this.CHOSUNG_LIST[chosungIndex]}</span>`;
      }
      return char;
    }).join('');
  },

  // 영문 단어 첫 글자 + 마스킹 변환 (예: "apple" -> "a____")
  toEnglishPrompt(text) {
    return text.replace(/[a-zA-Z]+/g, match => {
      if (match.length <= 1) return match;
      const first = match[0];
      const rest = '_'.repeat(match.length - 1);
      return `<span class="chosung-char">${first}</span><span class="chosung-mask">${rest}</span>`;
    });
  },

  // 언어에 맞게 자동 스마트 프롬프트 생성
  generatePrompt(text, lang = 'ko-KR') {
    if (lang.startsWith('en')) {
      return this.toEnglishPrompt(text);
    }
    return this.toChosungString(text);
  }
};


// ============================================================================
// 4. 애플리케이션 상태 및 저장소 관리 (Store)
// ============================================================================
const Store = {
  STORAGE_KEY: 'MEMORY_GOD_DATA_V2',
  SETTINGS_KEY: 'MEMORY_GOD_SETTINGS_V2',

  data: {
    texts: [],
    currentTextId: null
  },

  settings: {
    sound: true,
    punctFlexible: true,
    fontScale: 1,
    theme: 'dark',
    ttsRate: 1.0,
    clozeLevel: 25
  },

  init() {
    // 1. 설정 로드
    const savedSettings = localStorage.getItem(this.SETTINGS_KEY);
    if (savedSettings) {
      try {
        this.settings = Object.assign(this.settings, JSON.parse(savedSettings));
      } catch (e) {
        console.error(e);
      }
    }

    // 2. 지문 데이터 로드
    const savedData = localStorage.getItem(this.STORAGE_KEY);
    if (savedData) {
      try {
        this.data = JSON.parse(savedData);
      } catch (e) {
        console.error(e);
      }
    }

    // 데이터가 없으면 samples.js 데이터 주입
    if (!this.data.texts || this.data.texts.length === 0) {
      this.data.texts = (typeof SAMPLE_TEXTS !== 'undefined') ? JSON.parse(JSON.stringify(SAMPLE_TEXTS)) : [];
      // 초기 상태 메타데이터 보강
      this.data.texts.forEach(t => {
        t.progress = t.progress || {};
        t.weakList = t.weakList || [];
      });
      if (this.data.texts.length > 0) {
        this.data.currentTextId = this.data.texts[0].id;
      }
      this.saveData();
    }

    if (!this.data.currentTextId && this.data.texts.length > 0) {
      this.data.currentTextId = this.data.texts[0].id;
    }
  },

  saveData() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
  },

  saveSettings() {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.settings));
  },

  getCurrentText() {
    return this.data.texts.find(t => t.id === this.data.currentTextId) || this.data.texts[0];
  },

  setCurrentTextId(id) {
    this.data.currentTextId = id;
    this.saveData();
  },

  addNewText(textObj) {
    this.data.texts.push(textObj);
    this.data.currentTextId = textObj.id;
    this.saveData();
  },

  deleteText(id) {
    this.data.texts = this.data.texts.filter(t => t.id !== id);
    if (this.data.currentTextId === id) {
      this.data.currentTextId = this.data.texts.length > 0 ? this.data.texts[0].id : null;
    }
    this.saveData();
  }
};


// ============================================================================
// 5. 음성 합성(TTS) 및 음성 인식(STT) 엔진 (SpeechEngine)
// ============================================================================
const SpeechEngine = {
  synth: window.speechSynthesis,
  recognition: null,
  isRecognizing: false,

  init() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      this.recognition = new SpeechRec();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
    }
  },

  speak(text, lang = 'ko-KR', rate = 1.0, onEnd = null) {
    if (!this.synth) return;
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;

    // 한국어/영어 적합 음성 선택
    const voices = this.synth.getVoices();
    const suitableVoice = voices.find(v => v.lang.startsWith(lang.substring(0, 2)));
    if (suitableVoice) {
      utterance.voice = suitableVoice;
    }

    if (onEnd) utterance.onend = onEnd;
    this.synth.speak(utterance);
  },

  stopSpeak() {
    if (this.synth) this.synth.cancel();
  },

  startListen(lang, onResult, onEnd, onError) {
    if (!this.recognition) {
      alert('이 브라우저는 음성 인식(STT)을 지원하지 않습니다. 키보드 타자 모드를 이용해 주세요.');
      return;
    }
    if (this.isRecognizing) {
      this.recognition.stop();
      return;
    }

    this.recognition.lang = lang;
    this.isRecognizing = true;

    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript;
      }
      if (onResult) onResult(finalTranscript);
    };

    this.recognition.onerror = (e) => {
      this.isRecognizing = false;
      if (onError) onError(e);
    };

    this.recognition.onend = () => {
      this.isRecognizing = false;
      if (onEnd) onEnd();
    };

    this.recognition.start();
  },

  stopListen() {
    if (this.recognition && this.isRecognizing) {
      this.recognition.stop();
      this.isRecognizing = false;
    }
  }
};


// ============================================================================
// 6. 메인 애플리케이션 코어 컨트롤러 (App)
// ============================================================================
const App = {
  currentMode: 1, // 1: 낭독, 2: 빈칸, 3: 초성, 4: 체이닝, 5: 고스트타자, 'drill': 오답드릴
  currentIndex: 0,
  revealed: false,
  combo: 0,
  sidebarFilter: 'all',

  // 5단계 타자 관련 변수
  typingStats: {
    startTime: null,
    totalChars: 0,
    errors: 0
  },

  init() {
    Store.init();
    SoundFX.init();
    VisualFX.init();
    SpeechEngine.init();

    this.applySettingsToUI();
    this.bindEvents();
    this.renderTextSelectOptions();
    this.loadText(Store.data.currentTextId);
  },

  // UI 설정 반영
  applySettingsToUI() {
    document.body.className = Store.settings.theme === 'light' ? 'theme-light' : 'theme-dark';
    document.getElementById('themeIcon').textContent = Store.settings.theme === 'light' ? '☀️' : '🌙';
    
    SoundFX.enabled = Store.settings.sound;
    const btnSound = document.getElementById('btnSoundToggle');
    btnSound.classList.toggle('active', Store.settings.sound);
    document.getElementById('soundIcon').textContent = Store.settings.sound ? '🔊' : '🔇';

    const btnPunct = document.getElementById('btnPunctuationToggle');
    btnPunct.classList.toggle('active', Store.settings.punctFlexible);

    document.documentElement.style.setProperty('--font-scale', Store.settings.fontScale);
    document.getElementById('ttsRateSelect').value = Store.settings.ttsRate;
  },

  // 이벤트 바인딩
  bindEvents() {
    // 1. 헤더 컨트롤
    document.getElementById('textSelect').addEventListener('change', (e) => {
      this.loadText(e.target.value);
    });

    document.getElementById('btnSoundToggle').addEventListener('click', () => {
      const active = SoundFX.toggle();
      Store.settings.sound = active;
      Store.saveSettings();
      document.getElementById('btnSoundToggle').classList.toggle('active', active);
      document.getElementById('soundIcon').textContent = active ? '🔊' : '🔇';
      if (active) SoundFX.playHit(0);
    });

    document.getElementById('btnThemeToggle').addEventListener('click', () => {
      Store.settings.theme = Store.settings.theme === 'dark' ? 'light' : 'dark';
      Store.saveSettings();
      this.applySettingsToUI();
    });

    document.getElementById('btnPunctuationToggle').addEventListener('click', () => {
      Store.settings.punctFlexible = !Store.settings.punctFlexible;
      Store.saveSettings();
      document.getElementById('btnPunctuationToggle').classList.toggle('active', Store.settings.punctFlexible);
    });

    document.getElementById('btnFontSize').addEventListener('click', () => {
      const scales = [1, 1.15, 1.3, 0.9];
      const curIdx = scales.indexOf(Store.settings.fontScale);
      Store.settings.fontScale = scales[(curIdx + 1) % scales.length];
      Store.saveSettings();
      this.applySettingsToUI();
    });

    // 2. 5단계 네비게이션 탭
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const mode = tab.dataset.mode;
        this.setMode(mode === 'drill' ? 'drill' : parseInt(mode, 10));
      });
    });

    // 3. 카드 네비게이션 버튼
    document.getElementById('btnPrevSentence').addEventListener('click', () => this.prevSentence());
    document.getElementById('btnNextSentence').addEventListener('click', () => this.nextSentence());
    document.getElementById('btnMarkMemorized').addEventListener('click', () => this.markCurrentAsMemorized());
    document.getElementById('btnToggleReveal').addEventListener('click', () => this.toggleReveal());
    document.getElementById('btnSpeakCurrent').addEventListener('click', () => this.speakCurrentSentence());
    document.getElementById('btnToggleWeakness').addEventListener('click', () => this.toggleCurrentWeakness());

    // 4. 서브 컨트롤 (1단계 낭독 속도, 전체 낭독)
    document.getElementById('ttsRateSelect').addEventListener('change', (e) => {
      Store.settings.ttsRate = parseFloat(e.target.value);
      Store.saveSettings();
    });
    document.getElementById('btnPlayFullTTS').addEventListener('click', () => this.playFullTextTTS());

    // 5. 서브 컨트롤 (2단계 은닉률)
    document.querySelectorAll('.btn-fade').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-fade').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        Store.settings.clozeLevel = parseInt(btn.dataset.level, 10);
        Store.saveSettings();
        this.renderCardContent();
      });
    });

    // 6. 5단계 고스트 타자 인풋
    const typingInput = document.getElementById('typingInput');
    typingInput.addEventListener('input', (e) => this.handleTypingInput(e));
    typingInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.checkTypingComplete();
      }
    });

    // 7. 음성 인식(STT)
    const btnMic = document.getElementById('btnStartVoiceRec');
    btnMic.addEventListener('click', () => this.toggleVoiceRecognition());

    // 8. 5단계 모드 전환 (타자 vs 음성)
    document.getElementById('btnTypeModeKey').addEventListener('click', () => {
      document.getElementById('btnTypeModeKey').classList.add('active');
      document.getElementById('btnTypeModeVoice').classList.remove('active');
      document.getElementById('typingArea').classList.remove('hidden');
      document.getElementById('voiceArea').classList.add('hidden');
    });
    document.getElementById('btnTypeModeVoice').addEventListener('click', () => {
      document.getElementById('btnTypeModeVoice').classList.add('active');
      document.getElementById('btnTypeModeKey').classList.remove('active');
      document.getElementById('typingArea').classList.add('hidden');
      document.getElementById('voiceArea').classList.remove('hidden');
    });

    // 9. 사이드바 필터 탭
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.sidebarFilter = chip.dataset.filter;
        this.renderSentenceList();
      });
    });

    document.getElementById('btnResetProgress').addEventListener('click', () => {
      if (confirm('현재 지문의 학습 진행도를 초기화하시겠습니까?')) {
        const curText = Store.getCurrentText();
        curText.progress = {};
        Store.saveData();
        this.updateMasteryUI();
        this.renderSentenceList();
        this.renderCardContent();
      }
    });

    // 10. 전역 키보드 단축키
    window.addEventListener('keydown', (e) => {
      // 모달 열려있거나 텍스트 입력창 포커스 중엔 기본 단축키 차단
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        this.toggleReveal();
      } else if (e.code === 'Enter') {
        e.preventDefault();
        this.markCurrentAsMemorized();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        this.prevSentence();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        this.nextSentence();
      } else if (e.key >= '1' && e.key <= '5') {
        this.setMode(parseInt(e.key, 10));
      }
    });

    // 11. 모달 팝업 핸들러
    this.bindModalEvents();
  },

  // 모달 이벤트 바인딩
  bindModalEvents() {
    // 새 지문 등록 모달 열기
    document.getElementById('btnOpenAddModal').addEventListener('click', () => {
      document.getElementById('modalAddText').classList.remove('hidden');
      document.getElementById('inputTitle').value = '';
      document.getElementById('inputContent').value = '';
      document.getElementById('splitPreviewList').innerHTML = '<p class="empty-tip">본문을 입력하면 문장이 자동으로 나누어져 표시됩니다.</p>';
      document.getElementById('previewCount').textContent = '0';
    });

    // 지문 관리 모달 열기
    document.getElementById('btnOpenManageModal').addEventListener('click', () => {
      this.renderManageModalList();
      document.getElementById('modalManageText').classList.remove('hidden');
    });

    // 모달 닫기 공통
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close');
        document.getElementById(modalId).classList.add('hidden');
      });
    });

    // 실시간 본문 입력 시 분할 미리보기
    const inputContent = document.getElementById('inputContent');
    const splitMethod = document.getElementById('splitMethod');
    const updatePreview = () => {
      const text = inputContent.value.trim();
      const sentences = this.splitTextToSentences(text, splitMethod.value);
      document.getElementById('previewCount').textContent = sentences.length;
      const previewBox = document.getElementById('splitPreviewList');
      if (sentences.length === 0) {
        previewBox.innerHTML = '<p class="empty-tip">본문을 입력하면 문장이 자동으로 나누어져 표시됩니다.</p>';
      } else {
        previewBox.innerHTML = sentences.map((s, idx) => 
          `<div class="preview-item"><strong>${idx + 1}.</strong> ${this.escapeHtml(s)}</div>`
        ).join('');
      }
    };
    inputContent.addEventListener('input', updatePreview);
    splitMethod.addEventListener('change', updatePreview);

    // 새 지문 저장
    document.getElementById('btnSaveNewText').addEventListener('click', () => {
      const title = document.getElementById('inputTitle').value.trim();
      const content = document.getElementById('inputContent').value.trim();
      const category = document.getElementById('inputCategory').value.trim() || '일반';
      const language = document.getElementById('inputLanguage').value;
      const method = document.getElementById('splitMethod').value;

      if (!title || !content) {
        alert('지문 제목과 본문 내용을 모두 입력해주세요!');
        return;
      }

      const sentences = this.splitTextToSentences(content, method);
      if (sentences.length === 0) {
        alert('분할된 유효 문장이 없습니다.');
        return;
      }

      const newText = {
        id: 'user_' + Date.now(),
        title,
        category,
        language,
        description: `사용자 등록 지문 (${sentences.length}개 문장)`,
        sentences,
        progress: {},
        weakList: []
      };

      Store.addNewText(newText);
      this.renderTextSelectOptions();
      this.loadText(newText.id);
      document.getElementById('modalAddText').classList.add('hidden');
      SoundFX.playSentenceMastered();
    });

    // JSON 내보내기 & 가져오기
    document.getElementById('btnExportData').addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(Store.data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `암기의신_백업_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });

    const fileInput = document.getElementById('importFileInput');
    document.getElementById('btnImportDataTrigger').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (imported && imported.texts) {
            Store.data = imported;
            Store.saveData();
            this.renderTextSelectOptions();
            this.loadText(Store.data.currentTextId);
            alert('데이터를 성공적으로 복원했습니다!');
            document.getElementById('modalManageText').classList.add('hidden');
          }
        } catch (err) {
          alert('올바르지 않은 JSON 파일입니다.');
        }
      };
      reader.readAsText(file);
    });
  },

  // 지문 관리 모달 목록 렌더링
  renderManageModalList() {
    const container = document.getElementById('manageTextList');
    container.innerHTML = Store.data.texts.map(text => `
      <div class="sentence-item" style="justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div>
          <strong>${this.escapeHtml(text.title)}</strong>
          <span style="font-size: 0.8rem; color: var(--text-dim); margin-left: 8px;">(${text.sentences.length}문장 / ${text.category})</span>
        </div>
        <div style="display:flex; gap: 6px;">
          <button class="btn btn-secondary btn-sm" onclick="App.loadText('${text.id}'); document.getElementById('modalManageText').classList.add('hidden');">열기</button>
          <button class="btn btn-text-danger btn-sm" onclick="App.deleteText('${text.id}')">삭제</button>
        </div>
      </div>
    `).join('');
  },

  deleteText(id) {
    if (confirm('이 지문을 정말 삭제하시겠습니까?')) {
      Store.deleteText(id);
      this.renderManageModalList();
      this.renderTextSelectOptions();
      if (Store.data.currentTextId) {
        this.loadText(Store.data.currentTextId);
      }
    }
  },

  // 텍스트를 문장 단위로 분할하는 스마트 파서
  splitTextToSentences(text, method = 'smart') {
    if (!text) return [];
    if (method === 'newline') {
      return text.split(/\r?\n/).map(s => s.trim()).filter(s => s.length > 0);
    }
    if (method === 'period') {
      return text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 0);
    }
    // smart: 줄바꿈과 구두점을 적절히 분할
    const lines = text.split(/\r?\n/);
    const results = [];
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      const subSentences = trimmed.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 0);
      results.push(...subSentences);
    });
    return results;
  },

  // 지문 선택 드롭다운 갱신
  renderTextSelectOptions() {
    const select = document.getElementById('textSelect');
    select.innerHTML = Store.data.texts.map(t => 
      `<option value="${t.id}" ${t.id === Store.data.currentTextId ? 'selected' : ''}>[${t.category}] ${t.title}</option>`
    ).join('');
  },

  // 지문 불러오기
  loadText(textId) {
    Store.setCurrentTextId(textId);
    this.currentIndex = 0;
    this.revealed = false;
    this.combo = 0;
    this.updateComboUI();

    const curText = Store.getCurrentText();
    curText.progress = curText.progress || {};
    curText.weakList = curText.weakList || [];

    document.getElementById('textSelect').value = curText.id;
    this.updateMasteryUI();
    this.renderSentenceList();
    this.renderCardContent();
  },

  // 모드 설정 (1~5, drill)
  setMode(mode) {
    this.currentMode = mode;
    this.revealed = false;

    // 네비 탭 활성화 변경
    document.querySelectorAll('.nav-tab').forEach(tab => {
      if (tab.dataset.mode === String(mode)) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // 상단 뱃지 텍스트
    const badgeMap = {
      1: 'STEP 1: 낭독 & 쉐도잉',
      2: 'STEP 2: 점진적 빈칸 뚫기',
      3: 'STEP 3: 초성/첫글자 연상',
      4: 'STEP 4: 누적 체이닝 암기',
      5: 'STEP 5: 고스트 실시간 타자',
      'drill': '🔥 취약 문장 무한 드릴'
    };
    document.getElementById('currentModeBadge').textContent = badgeMap[mode] || '학습 모드';

    // 서브 컨트롤 패널 토글
    document.querySelectorAll('.sub-ctrl-panel').forEach(p => p.classList.add('hidden'));
    if (mode === 1) document.getElementById('ctrlStep1').classList.remove('hidden');
    if (mode === 2) document.getElementById('ctrlStep2').classList.remove('hidden');
    if (mode === 3) document.getElementById('ctrlStep3').classList.remove('hidden');
    if (mode === 4) document.getElementById('ctrlStep4').classList.remove('hidden');
    if (mode === 5) document.getElementById('ctrlStep5').classList.remove('hidden');

    this.renderCardContent();
  },

  // 현재 모드에 따라 사용되는 문장 목록 가져오기
  getActiveSentences() {
    const curText = Store.getCurrentText();
    if (!curText || !curText.sentences) return [];
    if (this.currentMode === 'drill') {
      const weakIndices = curText.weakList || [];
      if (weakIndices.length === 0) return [];
      return weakIndices.map(idx => ({ sentence: curText.sentences[idx], originalIndex: idx }));
    }
    return curText.sentences.map((sentence, idx) => ({ sentence, originalIndex: idx }));
  },

  getCurrentSentenceData() {
    const list = this.getActiveSentences();
    if (list.length === 0) return null;
    if (this.currentIndex >= list.length) this.currentIndex = 0;
    return list[this.currentIndex];
  },

  // 카드 내용 렌더링
  renderCardContent() {
    const item = this.getCurrentSentenceData();
    const curText = Store.getCurrentText();

    if (!item) {
      if (this.currentMode === 'drill') {
        document.getElementById('targetDisplayText').innerHTML = '🎉 등록된 취약 문장이 없습니다!<br><span style="font-size:0.9rem; color:var(--text-muted)">다른 단계에서 별표(⭐)를 눌러 취약 문장을 추가해보세요.</span>';
        document.getElementById('sentenceCounter').textContent = '0 / 0';
        document.getElementById('revealArea').classList.add('hidden');
        document.getElementById('typingArea').classList.add('hidden');
        document.getElementById('voiceArea').classList.add('hidden');
        return;
      }
      return;
    }

    const { sentence, originalIndex } = item;
    const totalCount = this.getActiveSentences().length;
    document.getElementById('sentenceCounter').textContent = `문장 ${this.currentIndex + 1} / ${totalCount}`;

    // 취약 문장 뱃지 및 별표 버튼 상태
    const isWeak = (curText.weakList || []).includes(originalIndex);
    document.getElementById('weaknessBadge').classList.toggle('hidden', !isWeak);
    document.getElementById('btnToggleWeakness').classList.toggle('starred', isWeak);
    document.getElementById('starIcon').textContent = isWeak ? '★' : '⭐';

    // 영역 초기화
    const textDisplayBox = document.getElementById('targetDisplayText');
    const revealArea = document.getElementById('revealArea');
    const typingArea = document.getElementById('typingArea');
    const voiceArea = document.getElementById('voiceArea');
    const contextPreviewBox = document.getElementById('contextPreviewBox');

    revealArea.classList.add('hidden');
    typingArea.classList.add('hidden');
    voiceArea.classList.add('hidden');
    contextPreviewBox.classList.add('hidden');
    this.revealed = false;
    document.getElementById('revealedOriginalText').classList.add('hidden');

    // -------------------------------------------------------------
    // 모드 1: 낭독 & 쉐도잉
    // -------------------------------------------------------------
    if (this.currentMode === 1) {
      textDisplayBox.innerHTML = this.escapeHtml(sentence);
    }
    // -------------------------------------------------------------
    // 모드 2: 점진적 빈칸 뚫기
    // -------------------------------------------------------------
    else if (this.currentMode === 2) {
      revealArea.classList.remove('hidden');
      textDisplayBox.innerHTML = this.generateClozeHtml(sentence, Store.settings.clozeLevel);
      document.getElementById('revealedTextContent').textContent = sentence;
    }
    // -------------------------------------------------------------
    // 모드 3: 초성 / 첫글자 단서 훈련
    // -------------------------------------------------------------
    else if (this.currentMode === 3) {
      revealArea.classList.remove('hidden');
      textDisplayBox.innerHTML = ChosungEngine.generatePrompt(sentence, curText.language);
      document.getElementById('revealedTextContent').textContent = sentence;
    }
    // -------------------------------------------------------------
    // 모드 4: 누적 체이닝 암기
    // -------------------------------------------------------------
    else if (this.currentMode === 4) {
      revealArea.classList.remove('hidden');
      contextPreviewBox.classList.remove('hidden');

      // 이전 문장들을 누적 맥락으로 표시
      const prevSentences = curText.sentences.slice(0, originalIndex);
      if (prevSentences.length > 0) {
        contextPreviewBox.innerHTML = `<strong>앞 문장 흐름:</strong><br>${prevSentences.map((s, idx) => `[${idx + 1}] ${s}`).join('<br>')}`;
      } else {
        contextPreviewBox.innerHTML = `<strong>첫 번째 문장 시작!</strong> 긴 장문의 첫 단추를 완벽하게 각인하세요.`;
      }

      document.getElementById('chainingRangeText').textContent = `누적 범위: 1번 ~ ${originalIndex + 1}번 문장 연쇄`;
      // 현재 문장은 첫 글자 힌트 상태로 보여줌
      textDisplayBox.innerHTML = ChosungEngine.generatePrompt(sentence, curText.language);
      document.getElementById('revealedTextContent').textContent = sentence;
    }
    // -------------------------------------------------------------
    // 모드 5 or 드릴: 고스트 타자 / 음성 구술
    // -------------------------------------------------------------
    else if (this.currentMode === 5 || this.currentMode === 'drill') {
      textDisplayBox.innerHTML = `<span style="color:var(--text-dim); font-size:1.1rem;">⌨️ 머릿속으로 전체 문장을 떠올려 아래에 타이핑하세요!</span>`;
      typingArea.classList.remove('hidden');
      const typingInput = document.getElementById('typingInput');
      typingInput.value = '';
      typingInput.focus();

      this.typingStats = {
        startTime: null,
        totalChars: 0,
        errors: 0
      };
      this.updateTypingGuide('');
      this.updateTypingStatsUI();
    }

    this.renderSentenceList();
  },

  // 점진적 빈칸 뚫기 HTML 생성
  generateClozeHtml(sentence, level) {
    const words = sentence.split(/(\s+)/);
    // level: 25, 50, 75, 100
    const blankProbability = level / 100;

    return words.map(w => {
      if (/^\s+$/.test(w)) return w;
      // 특수문자만 있는 경우 빈칸 제외
      if (!/[a-zA-Z0-9가-힣]/.test(w)) return w;

      if (level === 100 || Math.random() < blankProbability) {
        return `<span class="cloze-blank" data-ans="${encodeURIComponent(w)}" onclick="App.handleClozeClick(this)">???</span>`;
      }
      return this.escapeHtml(w);
    }).join('');
  },

  // 빈칸 클릭 시 팡! 소리와 함께 공개
  handleClozeClick(el) {
    if (el.classList.contains('revealed')) return;
    const ans = decodeURIComponent(el.dataset.ans);
    el.textContent = ans;
    el.classList.add('revealed');

    // 타격 사운드 + 파티클 + 스크린 쉐이크
    const rect = el.getBoundingClientRect();
    SoundFX.playHit(this.combo);
    VisualFX.spawnHit(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
    VisualFX.shake('hit');
    this.addCombo();
  },

  // 5단계 고스트 타자 실시간 입력 처리
  handleTypingInput(e) {
    const inputVal = e.target.value;
    const item = this.getCurrentSentenceData();
    if (!item) return;

    if (!this.typingStats.startTime) {
      this.typingStats.startTime = Date.now();
    }

    // 키 타건음
    SoundFX.playKeyClick();

    this.updateTypingGuide(inputVal);
    this.checkTypingRealtime(inputVal, item.sentence);
  },

  // 실시간 타자 가이드 렌더링
  updateTypingGuide(inputVal) {
    const item = this.getCurrentSentenceData();
    if (!item) return;
    const target = item.sentence;
    const guideBox = document.getElementById('ghostGuide');

    let html = '';
    const maxLen = Math.max(inputVal.length, target.length);

    for (let i = 0; i < maxLen; i++) {
      const targetChar = target[i] || '';
      const inputChar = inputVal[i] || '';

      if (i < inputVal.length) {
        // 일치 여부 비교
        const isMatch = Store.settings.punctFlexible
          ? this.normalizeChar(inputChar) === this.normalizeChar(targetChar)
          : inputChar === targetChar;

        if (isMatch) {
          html += `<span class="ghost-char-correct">${this.escapeHtml(targetChar || inputChar)}</span>`;
        } else {
          html += `<span class="ghost-char-wrong">${this.escapeHtml(inputChar)}</span>`;
        }
      } else if (i === inputVal.length) {
        // 현재 커서 위치
        html += `<span class="ghost-char-cursor"></span><span class="ghost-char-pending">${this.escapeHtml(targetChar)}</span>`;
      } else {
        html += `<span class="ghost-char-pending">${this.escapeHtml(targetChar)}</span>`;
      }
    }

    guideBox.innerHTML = html;
  },

  // 문자 정규화 (구두점/공백 유연 모드)
  normalizeChar(ch) {
    if (!ch) return '';
    return ch.toLowerCase().replace(/['"`.,~!?\s]/g, '');
  },

  // 실시간 타자 정확도 체크 & 타격감 효과
  checkTypingRealtime(inputVal, target) {
    const lastIdx = inputVal.length - 1;
    if (lastIdx < 0) return;

    const inputChar = inputVal[lastIdx];
    const targetChar = target[lastIdx];

    const isMatch = Store.settings.punctFlexible
      ? this.normalizeChar(inputChar) === this.normalizeChar(targetChar)
      : inputChar === targetChar;

    if (!isMatch) {
      this.typingStats.errors++;
      SoundFX.playErrorThud();
      VisualFX.shake('error');
      this.combo = 0;
      this.updateComboUI();
    } else {
      // 맞으면 팡! 효과
      this.addCombo();
      SoundFX.playHit(this.combo);
      VisualFX.shake('hit');
      const inputEl = document.getElementById('typingInput');
      const rect = inputEl.getBoundingClientRect();
      VisualFX.spawnHit(rect.left + rect.width / 2, rect.top + 20, 6);
    }

    // 문장 전체 완성 검사
    const cleanInput = Store.settings.punctFlexible ? inputVal.replace(/[^\w가-힣]/g, '') : inputVal.trim();
    const cleanTarget = Store.settings.punctFlexible ? target.replace(/[^\w가-힣]/g, '') : target.trim();

    if (cleanInput.length >= cleanTarget.length && cleanInput === cleanTarget) {
      // 💥 문장 완성 격파!
      this.onSentenceCompleted();
    }

    this.updateTypingStatsUI();
  },

  // 타자 수동 완료 검사 (엔터 키)
  checkTypingComplete() {
    const inputVal = document.getElementById('typingInput').value;
    const item = this.getCurrentSentenceData();
    if (!item) return;

    const cleanInput = Store.settings.punctFlexible ? inputVal.replace(/[^\w가-힣]/g, '') : inputVal.trim();
    const cleanTarget = Store.settings.punctFlexible ? item.sentence.replace(/[^\w가-힣]/g, '') : item.sentence.trim();

    if (cleanInput === cleanTarget) {
      this.onSentenceCompleted();
    } else {
      SoundFX.playErrorThud();
      VisualFX.shake('error');
      alert('아직 일치하지 않는 글자가 있습니다. 빨간색 표시를 확인해주세요!');
    }
  },

  // 문장 격파 성공 시 공통 처리
  onSentenceCompleted() {
    SoundFX.playSentenceMastered();
    VisualFX.shake('hit');
    const card = document.getElementById('practiceCard');
    const rect = card.getBoundingClientRect();
    VisualFX.spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 50);

    this.markCurrentAsMemorized(false);

    setTimeout(() => {
      this.nextSentence();
    }, 700);
  },

  // 타자 통계 UI 업데이트
  updateTypingStatsUI() {
    const item = this.getCurrentSentenceData();
    if (!item) return;
    const inputVal = document.getElementById('typingInput').value;
    const totalChars = inputVal.length;
    const errors = this.typingStats.errors;

    const acc = totalChars === 0 ? 100 : Math.max(0, Math.round(((totalChars - errors) / totalChars) * 100));
    document.getElementById('typingAccuracy').textContent = `${acc}%`;
    document.getElementById('typingErrors').textContent = errors;

    if (this.typingStats.startTime && totalChars > 0) {
      const elapsedMins = (Date.now() - this.typingStats.startTime) / 60000;
      const wpm = Math.round((totalChars / 5) / (elapsedMins || 0.01));
      document.getElementById('typingSpeed').textContent = `${wpm} WPM`;
    }
  },

  // 콤보 증가
  addCombo() {
    this.combo++;
    if (this.combo >= 3 && this.combo % 3 === 0) {
      SoundFX.playComboSound(this.combo);
    }
    this.updateComboUI();
  },

  // 콤보 UI 갱신
  updateComboUI() {
    const banner = document.getElementById('comboBanner');
    const text = document.getElementById('comboText');
    if (this.combo >= 2) {
      banner.classList.add('active');
      text.textContent = `${this.combo} COMBO!`;
    } else {
      banner.classList.remove('active');
    }
  },

  // 정답 원문 토글 (Space 키)
  toggleReveal() {
    this.revealed = !this.revealed;
    const box = document.getElementById('revealedOriginalText');
    box.classList.toggle('hidden', !this.revealed);
    document.getElementById('revealBtnLabel').textContent = this.revealed ? '🙈 정답 가리기 (Space)' : '👁️ 원문 정답 확인 (Space)';
    if (this.revealed) {
      SoundFX.playHit(0);
    }
  },

  // 현재 문장 외움 마크
  markCurrentAsMemorized(playSound = true) {
    const item = this.getCurrentSentenceData();
    if (!item) return;

    const curText = Store.getCurrentText();
    curText.progress = curText.progress || {};
    curText.progress[item.originalIndex] = true;

    // 만약 드릴 모드였다면 취약 목록에서 제거
    if (this.currentMode === 'drill') {
      curText.weakList = curText.weakList.filter(idx => idx !== item.originalIndex);
    }

    Store.saveData();

    if (playSound) {
      SoundFX.playSentenceMastered();
      const rect = document.getElementById('btnMarkMemorized').getBoundingClientRect();
      VisualFX.spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);
      VisualFX.shake('hit');
    }

    this.updateMasteryUI();
    this.renderSentenceList();

    // 100% 마스터 검사
    const totalSentences = curText.sentences.length;
    const masteredCount = Object.keys(curText.progress).filter(k => curText.progress[k]).length;
    if (masteredCount >= totalSentences) {
      this.showCongratulationModal();
    } else if (playSound) {
      setTimeout(() => this.nextSentence(), 400);
    }
  },

  // 취약 문장 지정 토글 (별표)
  toggleCurrentWeakness() {
    const item = this.getCurrentSentenceData();
    if (!item) return;

    const curText = Store.getCurrentText();
    curText.weakList = curText.weakList || [];
    const idxInWeak = curText.weakList.indexOf(item.originalIndex);

    if (idxInWeak >= 0) {
      curText.weakList.splice(idxInWeak, 1);
    } else {
      curText.weakList.push(item.originalIndex);
      SoundFX.playHit(1);
    }

    Store.saveData();
    this.renderCardContent();
  },

  // 이전 문장으로 이동
  prevSentence() {
    const list = this.getActiveSentences();
    if (list.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + list.length) % list.length;
    this.renderCardContent();
  },

  // 다음 문장으로 이동
  nextSentence() {
    const list = this.getActiveSentences();
    if (list.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % list.length;
    this.renderCardContent();
  },

  // 현재 문장 음성 듣기
  speakCurrentSentence() {
    const item = this.getCurrentSentenceData();
    const curText = Store.getCurrentText();
    if (!item) return;

    SoundFX.playHit(0);
    SpeechEngine.speak(item.sentence, curText.language, Store.settings.ttsRate);
  },

  // 지문 전체 연속 재생
  playFullTextTTS() {
    const curText = Store.getCurrentText();
    if (!curText || !curText.sentences) return;

    let idx = 0;
    const playNext = () => {
      if (idx >= curText.sentences.length) return;
      this.currentIndex = idx;
      this.renderCardContent();
      SpeechEngine.speak(curText.sentences[idx], curText.language, Store.settings.ttsRate, () => {
        idx++;
        playNext();
      });
    };
    playNext();
  },

  // 음성 인식(STT) 구술 모드 토글
  toggleVoiceRecognition() {
    const btnMic = document.getElementById('btnStartVoiceRec');
    const statusText = document.getElementById('voiceRecStatus');
    const resultPreview = document.getElementById('voiceResultPreview');
    const item = this.getCurrentSentenceData();
    const curText = Store.getCurrentText();
    if (!item) return;

    if (SpeechEngine.isRecognizing) {
      SpeechEngine.stopListen();
      btnMic.classList.remove('recording');
      statusText.textContent = '마이크 누르고 문장 말하기';
      return;
    }

    btnMic.classList.add('recording');
    statusText.textContent = '듣고 있습니다... 말씀하세요!';
    resultPreview.textContent = '음성 입력 대기 중...';

    SpeechEngine.startListen(
      curText.language,
      (transcript) => {
        resultPreview.textContent = `인식 결과: "${transcript}"`;
        // 일치도 검사
        const cleanInput = transcript.replace(/[^\w가-힣]/g, '').toLowerCase();
        const cleanTarget = item.sentence.replace(/[^\w가-힣]/g, '').toLowerCase();

        if (cleanTarget.includes(cleanInput) || cleanInput.includes(cleanTarget) || cleanInput === cleanTarget) {
          resultPreview.innerHTML = `🎉 <strong style="color:#34d399">완벽 일치!</strong> ("${transcript}")`;
          this.onSentenceCompleted();
        }
      },
      () => {
        btnMic.classList.remove('recording');
        statusText.textContent = '마이크 누르고 문장 말하기';
      },
      (err) => {
        btnMic.classList.remove('recording');
        statusText.textContent = '마이크 누르고 문장 말하기';
        resultPreview.textContent = '음성 인식 오류가 발생했습니다.';
      }
    );
  },

  // 전체 암기 마스터율 UI 업데이트
  updateMasteryUI() {
    const curText = Store.getCurrentText();
    if (!curText || !curText.sentences || curText.sentences.length === 0) return;

    const total = curText.sentences.length;
    const mastered = Object.keys(curText.progress || {}).filter(k => curText.progress[k]).length;
    const pct = Math.round((mastered / total) * 100);

    document.getElementById('masteryRateText').textContent = `${pct}%`;
    document.getElementById('masteryProgressBar').style.width = `${pct}%`;
    document.getElementById('sidebarCountBadge').textContent = `${mastered} / ${total}`;
  },

  // 사이드바 문장 목록 렌더링
  renderSentenceList() {
    const container = document.getElementById('sentenceListContainer');
    const curText = Store.getCurrentText();
    if (!curText || !curText.sentences) {
      container.innerHTML = '<p class="empty-tip">문장이 없습니다.</p>';
      return;
    }

    const sentences = curText.sentences;
    const progress = curText.progress || {};
    const weakList = curText.weakList || [];
    const activeItem = this.getCurrentSentenceData();

    const filtered = sentences.map((sentence, idx) => ({
      sentence,
      idx,
      isMastered: !!progress[idx],
      isWeak: weakList.includes(idx)
    })).filter(item => {
      if (this.sidebarFilter === 'unmastered') return !item.isMastered;
      if (this.sidebarFilter === 'weak') return item.isWeak;
      if (this.sidebarFilter === 'mastered') return item.isMastered;
      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = '<p class="empty-tip">해당 조건의 문장이 없습니다.</p>';
      return;
    }

    container.innerHTML = filtered.map(item => {
      const isCurrent = activeItem && activeItem.originalIndex === item.idx;
      return `
        <div class="sentence-item ${isCurrent ? 'current' : ''} ${item.isMastered ? 'mastered' : ''}" onclick="App.jumpToSentence(${item.idx})">
          <span class="sentence-idx">${item.idx + 1}.</span>
          <div class="sentence-preview-text">${this.escapeHtml(item.sentence)}</div>
          <div class="sentence-status-icons">
            ${item.isMastered ? '<span>✅</span>' : ''}
            ${item.isWeak ? '<span>🔥</span>' : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  // 사이드바 클릭으로 특정 문장 점프
  jumpToSentence(originalIndex) {
    const list = this.getActiveSentences();
    const targetIdx = list.findIndex(item => item.originalIndex === originalIndex);
    if (targetIdx >= 0) {
      this.currentIndex = targetIdx;
      this.renderCardContent();
      SoundFX.playHit(0);
    } else {
      // 만약 현재 드릴 모드여서 해당 문장이 목록에 없다면 일반 모드로 전환
      this.setMode(1);
      this.currentIndex = originalIndex;
      this.renderCardContent();
    }
  },

  // 100% 완전 정복 축하 모달 띄우기
  showCongratulationModal() {
    SoundFX.playFanfare();
    const curText = Store.getCurrentText();
    document.getElementById('congratTextTitle').textContent = `"${curText.title}"`;
    document.getElementById('congratTotalCount').textContent = curText.sentences.length;
    document.getElementById('modalCongratulation').classList.remove('hidden');

    // 축하 컨페티 폭죽 팡팡
    VisualFX.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 100);
    VisualFX.spawnBurst(window.innerWidth / 3, window.innerHeight / 2.5, 60);
    VisualFX.spawnBurst(window.innerWidth * 2 / 3, window.innerHeight / 2.5, 60);
  },

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m]));
  }
};

// 앱 초기화 구동
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
