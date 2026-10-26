/**
 * 암기의 신 (Memory God) - 타격감 넘치는 고난도 장문 완벽 암기 엔진 PRO
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

  // 찰진 기계식 키보드 타건음
  playKeyClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.012);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(1600, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(340 + Math.random() * 60, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.02);

    oscGain.gain.setValueAtTime(0.08, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.025);
  },

  // 팡! 정답 타격음
  playHit(combo = 0) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const pitchOffset = Math.min(combo * 16, 260);

    const oscKick = this.ctx.createOscillator();
    const gainKick = this.ctx.createGain();
    oscKick.type = 'sine';
    oscKick.frequency.setValueAtTime(240 + pitchOffset, t);
    oscKick.frequency.exponentialRampToValueAtTime(45, t + 0.09);

    gainKick.gain.setValueAtTime(0.35, t);
    gainKick.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    oscKick.connect(gainKick);
    gainKick.connect(this.ctx.destination);
    oscKick.start(t);
    oscKick.stop(t + 0.1);

    const oscSnap = this.ctx.createOscillator();
    const gainSnap = this.ctx.createGain();
    oscSnap.type = 'triangle';
    oscSnap.frequency.setValueAtTime(900 + pitchOffset, t);
    oscSnap.frequency.exponentialRampToValueAtTime(220, t + 0.06);

    gainSnap.gain.setValueAtTime(0.2, t);
    gainSnap.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    oscSnap.connect(gainSnap);
    gainSnap.connect(this.ctx.destination);
    oscSnap.start(t);
    oscSnap.stop(t + 0.07);
  },

  // 단어 하나 맞췄을 때 딩동 체크 사운드
  playWordCheck() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, t); // E5
    osc.frequency.exponentialRampToValueAtTime(1046.5, t + 0.12); // C6

    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  },

  // 콤보 팡팡 아케이드 사운드
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
    osc.frequency.exponentialRampToValueAtTime(freq * 1.4, t + 0.12);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  },

  // 문장 격파 사운드 (크리티컬 폭발 💥)
  playSentenceMastered() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    const oscBoom = this.ctx.createOscillator();
    const gainBoom = this.ctx.createGain();
    oscBoom.type = 'triangle';
    oscBoom.frequency.setValueAtTime(200, t);
    oscBoom.frequency.exponentialRampToValueAtTime(30, t + 0.35);

    gainBoom.gain.setValueAtTime(0.5, t);
    gainBoom.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    oscBoom.connect(gainBoom);
    gainBoom.connect(this.ctx.destination);
    oscBoom.start(t);
    oscBoom.stop(t + 0.36);

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

  // 스테이지 클리어 팡파레
  playStageClear() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    chords.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const st = t + i * 0.08;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, st);
      gain.gain.setValueAtTime(0.3, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(st);
      osc.stop(st + 0.42);
    });
  },

  // 타임어택 틱 사운드
  playTimerTick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, t);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.05);
  },

  // 타임오버 경고 사운드
  playTimeOver() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.linearRampToValueAtTime(60, t + 0.3);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.32);
  },

  // 오답 퍽!
  playErrorThud() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, t);
    osc.frequency.linearRampToValueAtTime(45, t + 0.16);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.17);
  },

  // 100% 완전 정복 그랜드 팡파레
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
      { f: 1046.5, d: 0.8, offset: 1.15 }
    ];

    const t = this.ctx.currentTime;
    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startT = t + n.offset;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, startT);

      gain.gain.setValueAtTime(0.35, startT);
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

  spawnBurst(x, y, count = 45) {
    const goldColors = ['#fbbf24', '#f59e0b', '#10b981', '#34d399', '#ffffff', '#e11d48'];
    this.spawnHit(x, y, count, goldColors);
  },

  shake(type = 'hit') {
    if (!Store.settings.screenShake) return; // 기본 꺼짐

    const app = document.getElementById('app');
    if (!app) return;
    const className = type === 'error' ? 'shake-error' : 'shake-hit';
    app.classList.remove('shake-hit', 'shake-error');
    void app.offsetWidth;
    app.classList.add(className);
    setTimeout(() => {
      app.classList.remove(className);
    }, 80);
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
// 3. 지능형 핵심 키워드 분석기 & 초성 엔진 (NLPAnalyzer)
// ============================================================================
const NLPAnalyzer = {
  KO_STOPWORDS: new Set([
    '은', '는', '이', '가', '을', '를', '의', '에', '에서', '로', '으로',
    '과', '와', '하고', '도', '만', '뿐', '부터', '까지', '에게', '한테',
    '보다', '등', '및', '즉', '수', '것', '때', '그', '이', '저', '우리',
    '또한', '그리고', '그러나', '하지만', '하여', '하며', '하고', '이다',
    '있다', '없다', '된다', '한다'
  ]),

  EN_STOPWORDS: new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'to', 'of', 'in', 'for',
    'on', 'with', 'at', 'by', 'from', 'up', 'about', 'into', 'over', 'after',
    'and', 'or', 'but', 'so', 'if', 'that', 'this', 'it', 'they', 'we',
    'you', 'he', 'she', 'his', 'her', 'their', 'my', 'your', 'our'
  ]),

  CHOSUNG_LIST: [
    'ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'
  ],

  // 단일 단어의 초성 추출 (예: "유구한" -> "ㅇㄱㅎ", "Hello" -> "H____")
  getWordChosung(word, lang = 'ko-KR') {
    if (lang.startsWith('en')) {
      const match = word.match(/[a-zA-Z]+/);
      if (!match) return word;
      const letters = match[0];
      const rest = '_'.repeat(Math.max(1, letters.length - 1));
      return word.replace(letters, letters[0] + rest);
    }

    return word.split('').map(char => {
      const code = char.charCodeAt(0);
      if (code >= 0xAC00 && code <= 0xD7A3) {
        const chosungIndex = Math.floor((code - 0xAC00) / (21 * 28));
        return this.CHOSUNG_LIST[chosungIndex];
      }
      return char;
    }).join('');
  },

  getKeywordScore(word, lang = 'ko-KR') {
    const clean = word.replace(/[^a-zA-Z0-9가-힣]/g, '').toLowerCase();
    if (clean.length <= 1) return 0;

    if (lang.startsWith('en')) {
      if (this.EN_STOPWORDS.has(clean)) return 1;
      return clean.length >= 4 ? 10 : 5;
    }

    if (this.KO_STOPWORDS.has(clean)) return 1;

    const commonPostpositions = ['에서', '으로', '부터', '까지', '에게', '은', '는', '이', '가', '을', '를', '의', '에', '로', '과', '와', '도'];
    let stem = clean;
    for (const post of commonPostpositions) {
      if (stem.endsWith(post) && stem.length > post.length + 1) {
        stem = stem.slice(0, -post.length);
        break;
      }
    }

    if (stem.length >= 2 && !this.KO_STOPWORDS.has(stem)) {
      return 10;
    }
    return 3;
  },

  generateKeywordCloze(sentence, level = 75, lang = 'ko-KR') {
    const tokens = sentence.split(/(\s+)/);
    const wordList = [];
    tokens.forEach((token, idx) => {
      if (!/^\s+$/.test(token) && /[a-zA-Z0-9가-힣]/.test(token)) {
        const score = this.getKeywordScore(token, lang);
        wordList.push({ token, idx, score });
      }
    });

    const sorted = [...wordList].sort((a, b) => b.score - a.score);
    const ratio = level / 100;
    const targetCount = Math.max(1, Math.round(wordList.length * ratio));
    const blankIndices = new Set(sorted.slice(0, targetCount).map(item => item.idx));

    return tokens.map((token, idx) => {
      if (blankIndices.has(idx)) {
        return `<span class="cloze-blank" data-ans="${encodeURIComponent(token)}" onclick="App.handleClozeClick(this)">???</span>`;
      }
      return App.escapeHtml(token);
    }).join('');
  }
};


// ============================================================================
// 4. 스토어 및 진행도 관리 (Store)
// ============================================================================
const Store = {
  STORAGE_KEY: 'MEMORY_GOD_PRO_DATA_V4',
  SETTINGS_KEY: 'MEMORY_GOD_PRO_SETTINGS_V4',

  data: {
    texts: [],
    currentTextId: null
  },

  settings: {
    sound: true,
    screenShake: false,
    punctFlexible: true,
    fontScale: 1,
    theme: 'dark',
    ttsRate: 1.0,
    clozeLevel: 75
  },

  init() {
    const savedSettings = localStorage.getItem(this.SETTINGS_KEY);
    if (savedSettings) {
      try {
        this.settings = Object.assign(this.settings, JSON.parse(savedSettings));
      } catch (e) {
        console.error(e);
      }
    }
    if (this.settings.screenShake === undefined) {
      this.settings.screenShake = false;
    }

    const savedData = localStorage.getItem(this.STORAGE_KEY);
    if (savedData) {
      try {
        this.data = JSON.parse(savedData);
      } catch (e) {
        console.error(e);
      }
    }

    if (!this.data.texts || this.data.texts.length === 0) {
      this.data.texts = (typeof SAMPLE_TEXTS !== 'undefined') ? JSON.parse(JSON.stringify(SAMPLE_TEXTS)) : [];
      this.data.texts.forEach(t => {
        t.stepProgress = t.stepProgress || { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} };
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
    const t = this.data.texts.find(item => item.id === this.data.currentTextId) || this.data.texts[0];
    if (t && !t.stepProgress) {
      t.stepProgress = { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} };
    }
    return t;
  },

  setCurrentTextId(id) {
    this.data.currentTextId = id;
    this.saveData();
  },

  addNewText(textObj) {
    textObj.stepProgress = { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} };
    textObj.weakList = [];
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

    const voices = this.synth.getVoices();
    const suitableVoice = voices.find(v => v.lang.startsWith(lang.substring(0, 2)));
    if (suitableVoice) utterance.voice = suitableVoice;

    if (onEnd) utterance.onend = onEnd;
    this.synth.speak(utterance);
  },

  stopSpeak() {
    if (this.synth) this.synth.cancel();
  }
};


// ============================================================================
// 6. 메인 애플리케이션 코어 컨트롤러 (App)
// ============================================================================
const App = {
  currentMode: 1, // 1~5, 'drill'
  currentIndex: 0,
  revealed: false,
  combo: 0,
  sidebarFilter: 'all',

  // STAGE 3: 초성 단어 락커 상태
  stage3State: {
    words: [],
    activeIndex: 0
  },

  // STAGE 4: 스노우볼 30% 징검다리 상태
  stage4State: {
    items: []
  },

  // DRILL: 타임어택 단어 나열 상태
  scrambleState: {
    targetWords: [],
    selectedWords: [],
    remainingWords: []
  },

  // 타임어택 공통 타이머 객체 (STAGE 5 & DRILL용)
  timer: {
    intervalId: null,
    totalSeconds: 0,
    remainingSeconds: 0,
    onTimeOver: null
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

  applySettingsToUI() {
    document.body.className = Store.settings.theme === 'light' ? 'theme-light' : 'theme-dark';
    document.getElementById('themeIcon').textContent = Store.settings.theme === 'light' ? '☀️' : '🌙';

    SoundFX.enabled = Store.settings.sound;
    const btnSound = document.getElementById('btnSoundToggle');
    btnSound.classList.toggle('active', Store.settings.sound);
    document.getElementById('soundIcon').textContent = Store.settings.sound ? '🔊' : '🔇';

    const btnShake = document.getElementById('btnShakeToggle');
    if (btnShake) {
      btnShake.classList.toggle('active', !!Store.settings.screenShake);
      document.getElementById('shakeIcon').textContent = Store.settings.screenShake ? '📳' : '📴';
      btnShake.title = Store.settings.screenShake ? '화면 흔들림 켜짐 (클릭시 끔)' : '화면 흔들림 꺼짐 (클릭시 켬)';
    }

    const btnPunct = document.getElementById('btnPunctuationToggle');
    btnPunct.classList.toggle('active', Store.settings.punctFlexible);

    document.documentElement.style.setProperty('--font-scale', Store.settings.fontScale);
    document.getElementById('ttsRateSelect').value = Store.settings.ttsRate;

    document.querySelectorAll('.btn-fade').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.level, 10) === Store.settings.clozeLevel);
    });
  },

  bindEvents() {
    document.getElementById('textSelect').addEventListener('change', (e) => {
      this.loadText(e.target.value);
    });

    document.getElementById('btnShakeToggle').addEventListener('click', () => {
      Store.settings.screenShake = !Store.settings.screenShake;
      Store.saveSettings();
      this.applySettingsToUI();
      if (Store.settings.screenShake) SoundFX.playHit(0);
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

    // 네비 탭
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const mode = tab.dataset.mode;
        this.setMode(mode === 'drill' ? 'drill' : parseInt(mode, 10));
      });
    });

    // 기본 버튼
    document.getElementById('btnPrevSentence').addEventListener('click', () => this.prevSentence());
    document.getElementById('btnNextSentence').addEventListener('click', () => this.nextSentence());
    document.getElementById('btnMarkMemorized').addEventListener('click', () => this.markCurrentAsMemorized());
    document.getElementById('btnDontKnow').addEventListener('click', () => this.markAsDontKnow());
    document.getElementById('btnToggleReveal').addEventListener('click', () => this.toggleReveal());
    document.getElementById('btnSpeakCurrent').addEventListener('click', () => this.speakCurrentSentence());
    document.getElementById('btnToggleWeakness').addEventListener('click', () => this.toggleCurrentWeakness());

    // 사이드바 토글 버튼 (기본 접힘)
    document.getElementById('btnToggleSidebar').addEventListener('click', () => this.toggleSidebar());
    document.getElementById('btnCloseSidebar').addEventListener('click', () => this.toggleSidebar(false));

    document.getElementById('ttsRateSelect').addEventListener('change', (e) => {
      Store.settings.ttsRate = parseFloat(e.target.value);
      Store.saveSettings();
    });
    document.getElementById('btnPlayFullTTS').addEventListener('click', () => this.playFullTextTTS());

    document.querySelectorAll('.btn-fade').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-fade').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        Store.settings.clozeLevel = parseInt(btn.dataset.level, 10);
        Store.saveSettings();
        this.renderCardContent();
      });
    });

    // STAGE 3: 초성 락커 입력 이벤트
    const chosungInput = document.getElementById('chosungWordInput');
    chosungInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.submitChosungWord();
      }
    });
    document.getElementById('btnSubmitChosungWord').addEventListener('click', () => this.submitChosungWord());

    // STAGE 4: 스노우볼 조립 검사 버튼
    document.getElementById('btnCheckSnowball').addEventListener('click', () => this.checkSnowballSlots());

    // DRILL: 스크램블 리셋 버튼
    document.getElementById('btnResetScramble').addEventListener('click', () => this.resetScramble());

    // STAGE 5: 블라인드 타자
    const typingInput = document.getElementById('typingInput');
    typingInput.addEventListener('input', (e) => this.handleBlindTypingInput(e));

    // 사이드바 필터
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.sidebarFilter = chip.dataset.filter;
        this.renderSentenceList();
      });
    });

    document.getElementById('btnResetProgress').addEventListener('click', () => {
      if (confirm('현재 지문의 전체 스테이지 학습 진행도를 초기화하시겠습니까?')) {
        const curText = Store.getCurrentText();
        curText.stepProgress = { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} };
        Store.saveData();
        this.updateMasteryUI();
        this.renderSentenceList();
        this.renderCardContent();
      }
    });

    // 전역 단축키
    window.addEventListener('keydown', (e) => {
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

    document.getElementById('btnProceedNextStage').addEventListener('click', () => {
      document.getElementById('modalStageClear').classList.add('hidden');
      if (typeof this.currentMode === 'number' && this.currentMode < 5) {
        this.setMode(this.currentMode + 1);
        this.currentIndex = 0;
        this.renderCardContent();
      }
    });

    this.bindModalEvents();
  },

  bindModalEvents() {
    document.getElementById('btnOpenAddModal').addEventListener('click', () => {
      document.getElementById('modalAddText').classList.remove('hidden');
      document.getElementById('inputTitle').value = '';
      document.getElementById('inputContent').value = '';
      document.getElementById('splitPreviewList').innerHTML = '<p class="empty-tip">본문을 입력하면 문장이 자동으로 나누어져 표시됩니다.</p>';
      document.getElementById('previewCount').textContent = '0';
    });

    document.getElementById('btnOpenManageModal').addEventListener('click', () => {
      this.renderManageModalList();
      document.getElementById('modalManageText').classList.remove('hidden');
    });

    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close');
        document.getElementById(modalId).classList.add('hidden');
      });
    });

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
        stepProgress: { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} },
        weakList: []
      };

      Store.addNewText(newText);
      this.renderTextSelectOptions();
      this.loadText(newText.id);
      document.getElementById('modalAddText').classList.add('hidden');
      SoundFX.playSentenceMastered();
    });

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

  splitTextToSentences(text, method = 'smart') {
    if (!text) return [];
    if (method === 'newline') {
      return text.split(/\r?\n/).map(s => s.trim()).filter(s => s.length > 0);
    }
    if (method === 'period') {
      return text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 0);
    }
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

  renderTextSelectOptions() {
    const select = document.getElementById('textSelect');
    select.innerHTML = Store.data.texts.map(t => 
      `<option value="${t.id}" ${t.id === Store.data.currentTextId ? 'selected' : ''}>[${t.category}] ${t.title}</option>`
    ).join('');
  },

  loadText(textId) {
    this.stopTimer();
    Store.setCurrentTextId(textId);
    this.currentIndex = 0;
    this.revealed = false;
    this.combo = 0;
    this.updateComboUI();

    const curText = Store.getCurrentText();
    curText.stepProgress = curText.stepProgress || { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} };
    curText.weakList = curText.weakList || [];

    document.getElementById('textSelect').value = curText.id;
    this.updateMasteryUI();
    this.renderSentenceList();
    this.renderCardContent();
  },

  setMode(mode) {
    this.stopTimer();
    this.currentMode = mode;
    this.revealed = false;

    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.mode === String(mode));
    });

    const badgeMap = {
      1: 'STAGE 1: 정독 & 뇌새김',
      2: 'STAGE 2: 키워드 강제인출',
      3: 'STAGE 3: 초성 단어 락커',
      4: 'STAGE 4: 스노우볼 30% 조립',
      5: 'STAGE 5: 타임어택 백지 블라인드',
      'drill': '🔥 타임어택 단어 나열'
    };
    document.getElementById('currentModeBadge').textContent = badgeMap[mode] || '학습 모드';

    // 서브 컨트롤
    document.querySelectorAll('.sub-ctrl-panel').forEach(p => p.classList.add('hidden'));
    if (mode === 1) document.getElementById('ctrlStep1').classList.remove('hidden');
    if (mode === 2) document.getElementById('ctrlStep2').classList.remove('hidden');
    if (mode === 3) document.getElementById('ctrlStep3').classList.remove('hidden');
    if (mode === 4) document.getElementById('ctrlStep4').classList.remove('hidden');
    if (mode === 5) document.getElementById('ctrlStep5').classList.remove('hidden');

    this.renderCardContent();
  },

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

  // --------------------------------------------------------------------------
  // 타임어택 카운트다운 타이머 제어기
  // --------------------------------------------------------------------------
  startTimer(seconds, onTimeOver) {
    this.stopTimer();
    this.timer.totalSeconds = seconds;
    this.timer.remainingSeconds = seconds;
    this.timer.onTimeOver = onTimeOver;

    const timerBox = document.getElementById('timerBarContainer');
    const timerFill = document.getElementById('timerFill');
    const countdownText = document.getElementById('timerCountdownText');

    timerBox.classList.remove('hidden');
    timerFill.style.width = '100%';
    countdownText.textContent = `${seconds}s`;

    const startTime = Date.now();
    const durationMs = seconds * 1000;

    this.timer.intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const leftMs = Math.max(0, durationMs - elapsed);
      const leftSec = Math.ceil(leftMs / 1000);

      const pct = (leftMs / durationMs) * 100;
      timerFill.style.width = `${pct}%`;
      countdownText.textContent = `${leftSec}s`;

      if (leftSec <= 3 && leftSec > 0 && Math.floor(leftMs / 500) % 2 === 0) {
        SoundFX.playTimerTick();
      }

      if (leftMs <= 0) {
        this.stopTimer();
        SoundFX.playTimeOver();
        if (this.timer.onTimeOver) {
          this.timer.onTimeOver();
        }
      }
    }, 100);
  },

  stopTimer() {
    if (this.timer.intervalId) {
      clearInterval(this.timer.intervalId);
      this.timer.intervalId = null;
    }
    const timerBox = document.getElementById('timerBarContainer');
    if (timerBox) timerBox.classList.add('hidden');
  },

  // --------------------------------------------------------------------------
  // 카드 렌더링 코어
  // --------------------------------------------------------------------------
  renderCardContent() {
    this.stopTimer();
    const item = this.getCurrentSentenceData();
    const curText = Store.getCurrentText();

    if (!item) {
      if (this.currentMode === 'drill') {
        document.getElementById('targetDisplayText').innerHTML = '🎉 등록된 취약 문장이 없습니다!<br><span style="font-size:0.9rem; color:var(--text-muted)">다른 단계에서 별표(⭐)를 눌러 취약 문장을 추가해보세요.</span>';
        document.getElementById('sentenceCounter').textContent = '0 / 0';
        document.getElementById('stepSentenceStatus').textContent = '완벽 클리어!';
        this.hideAllCardContainers();
        return;
      }
      return;
    }

    const { sentence, originalIndex } = item;
    const totalCount = this.getActiveSentences().length;
    document.getElementById('sentenceCounter').textContent = `문장 ${this.currentIndex + 1} / ${totalCount}`;

    if (typeof this.currentMode === 'number') {
      const stepProg = (curText.stepProgress && curText.stepProgress[this.currentMode]) || {};
      const passedCount = Object.keys(stepProg).filter(k => stepProg[k]).length;
      document.getElementById('stepSentenceStatus').textContent = `이 스텝 통과: ${passedCount} / ${curText.sentences.length}`;
    } else {
      document.getElementById('stepSentenceStatus').textContent = `취약 문장 훈련 중`;
    }

    const isWeak = (curText.weakList || []).includes(originalIndex);
    document.getElementById('weaknessBadge').classList.toggle('hidden', !isWeak);
    document.getElementById('btnToggleWeakness').classList.toggle('starred', isWeak);
    document.getElementById('starIcon').textContent = isWeak ? '★' : '⭐';

    this.hideAllCardContainers();
    this.revealed = false;
    document.getElementById('revealedTextContent').textContent = sentence;

    // -------------------------------------------------------------
    // STAGE 1: 정독 & 뇌새김
    // -------------------------------------------------------------
    if (this.currentMode === 1) {
      document.getElementById('targetDisplayText').innerHTML = this.escapeHtml(sentence);
    }
    // -------------------------------------------------------------
    // STAGE 2: 키워드 강제인출
    // -------------------------------------------------------------
    else if (this.currentMode === 2) {
      document.getElementById('revealArea').classList.remove('hidden');
      document.getElementById('targetDisplayText').innerHTML = NLPAnalyzer.generateKeywordCloze(sentence, Store.settings.clozeLevel, curText.language);
    }
    // -------------------------------------------------------------
    // STAGE 3: 초성 단어 락커 (단어별 초성 칩 맞추기)
    // -------------------------------------------------------------
    else if (this.currentMode === 3) {
      document.getElementById('targetDisplayText').innerHTML = `<span style="font-size:1.15rem; color:var(--text-muted)">💡 초성 칩을 클릭하고 원래 단어를 입력하여 [✅]를 띄우세요!</span>`;
      document.getElementById('stage3ChosungArea').classList.remove('hidden');
      document.getElementById('revealArea').classList.remove('hidden');
      this.setupStage3Chosung(sentence, curText.language);
    }
    // -------------------------------------------------------------
    // STAGE 4: 스노우볼 30% 징검다리 조립
    // -------------------------------------------------------------
    else if (this.currentMode === 4) {
      document.getElementById('targetDisplayText').innerHTML = `<span style="font-size:1.15rem; color:var(--text-muted)">🔗 30% 힌트를 징검다리 삼아 빈칸을 직접 타이핑하여 완성하세요!</span>`;
      document.getElementById('stage4SnowballArea').classList.remove('hidden');
      document.getElementById('revealArea').classList.remove('hidden');
      this.setupStage4Snowball(sentence);
    }
    // -------------------------------------------------------------
    // STAGE 5: 타임어택 백지 블라인드
    // -------------------------------------------------------------
    else if (this.currentMode === 5) {
      document.getElementById('targetDisplayText').innerHTML = `<span style="color:var(--accent-rose); font-weight:800;">⚡ 타임어택! 제한시간 내에 입력하지 못하면 처음부터 다시 작성합니다!</span>`;
      document.getElementById('typingArea').classList.remove('hidden');
      this.setupStage5Blind(sentence);
    }
    // -------------------------------------------------------------
    // DRILL: 타임어택 단어 나열
    // -------------------------------------------------------------
    else if (this.currentMode === 'drill') {
      document.getElementById('targetDisplayText').innerHTML = `<span style="color:var(--accent-gold); font-weight:800;">⏱️ 타임어택 단어 나열! 제한시간 내에 올바른 순서대로 단어를 클릭하세요!</span>`;
      document.getElementById('drillScrambleArea').classList.remove('hidden');
      this.setupDrillScramble(sentence);
    }

    this.renderSentenceList();
  },

  hideAllCardContainers() {
    document.getElementById('stage3ChosungArea').classList.add('hidden');
    document.getElementById('stage4SnowballArea').classList.add('hidden');
    document.getElementById('drillScrambleArea').classList.add('hidden');
    document.getElementById('typingArea').classList.add('hidden');
    document.getElementById('revealArea').classList.add('hidden');
    document.getElementById('revealedOriginalText').classList.add('hidden');
    document.getElementById('errorAlertBanner').classList.add('hidden');
  },

  // --------------------------------------------------------------------------
  // STAGE 2: 빈칸 클릭 핸들러
  // --------------------------------------------------------------------------
  handleClozeClick(el) {
    if (el.classList.contains('revealed')) return;
    const ans = decodeURIComponent(el.dataset.ans);
    el.textContent = ans;
    el.classList.add('revealed');

    const rect = el.getBoundingClientRect();
    SoundFX.playHit(this.combo);
    VisualFX.spawnHit(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
    VisualFX.shake('hit');
    this.addCombo();
  },

  // --------------------------------------------------------------------------
  // STAGE 3: 초성 단어 락커 모듈
  // --------------------------------------------------------------------------
  setupStage3Chosung(sentence, lang) {
    const rawTokens = sentence.split(/(\s+)/);
    const wordList = [];
    rawTokens.forEach(token => {
      if (!/^\s+$/.test(token) && token.length > 0) {
        wordList.push({
          word: token,
          chosung: NLPAnalyzer.getWordChosung(token, lang),
          solved: false
        });
      }
    });

    this.stage3State.words = wordList;
    this.stage3State.activeIndex = 0;
    this.renderStage3ChosungGrid();
  },

  renderStage3ChosungGrid() {
    const grid = document.getElementById('chosungChipsGrid');
    const { words, activeIndex } = this.stage3State;

    grid.innerHTML = words.map((item, idx) => {
      if (item.solved) {
        return `<div class="chosung-word-chip solved">${this.escapeHtml(item.word)} ✅</div>`;
      }
      const isActive = idx === activeIndex;
      return `<div class="chosung-word-chip ${isActive ? 'active' : ''}" onclick="App.selectChosungChip(${idx})">[${this.escapeHtml(item.chosung)}]</div>`;
    }).join('');

    const activeItem = words[activeIndex];
    const hintLabel = document.getElementById('activeChosungHint');
    const inputEl = document.getElementById('chosungWordInput');

    if (activeItem && !activeItem.solved) {
      hintLabel.textContent = `[${activeItem.chosung}]`;
      inputEl.value = '';
      inputEl.disabled = false;
      inputEl.focus();
    } else {
      hintLabel.textContent = '완료!';
      inputEl.disabled = true;
    }
  },

  selectChosungChip(index) {
    const item = this.stage3State.words[index];
    if (item && !item.solved) {
      this.stage3State.activeIndex = index;
      this.renderStage3ChosungGrid();
    }
  },

  submitChosungWord() {
    const inputEl = document.getElementById('chosungWordInput');
    const userVal = inputEl.value.trim();
    const { words, activeIndex } = this.stage3State;
    const activeItem = words[activeIndex];
    if (!activeItem || activeItem.solved) return;

    const cleanInput = Store.settings.punctFlexible ? userVal.replace(/[^\w가-힣]/g, '') : userVal;
    const cleanTarget = Store.settings.punctFlexible ? activeItem.word.replace(/[^\w가-힣]/g, '') : activeItem.word;

    if (cleanInput.toLowerCase() === cleanTarget.toLowerCase()) {
      // ✅ 정답!
      activeItem.solved = true;
      SoundFX.playWordCheck();
      VisualFX.spawnHit(window.innerWidth / 2, window.innerHeight / 2, 8);
      this.addCombo();

      // 다음 미해결 단어로 자동 이동
      const nextUnsolved = words.findIndex((w, i) => i > activeIndex && !w.solved);
      if (nextUnsolved >= 0) {
        this.stage3State.activeIndex = nextUnsolved;
      } else {
        const anyUnsolved = words.findIndex(w => !w.solved);
        if (anyUnsolved >= 0) {
          this.stage3State.activeIndex = anyUnsolved;
        } else {
          // 🎉 문장 내 모든 초성 단어 정복 완료!
          this.renderStage3ChosungGrid();
          SoundFX.playSentenceMastered();
          VisualFX.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 50);
          setTimeout(() => {
            this.markCurrentAsMemorized(false);
          }, 600);
          return;
        }
      }
      this.renderStage3ChosungGrid();
    } else {
      // ❌ 오답
      SoundFX.playErrorThud();
      VisualFX.shake('error');
      inputEl.classList.add('shake-error');
      setTimeout(() => inputEl.classList.remove('shake-error'), 250);
    }
  },

  // --------------------------------------------------------------------------
  // STAGE 4: 스노우볼 30% 징검다리 조립 모듈
  // --------------------------------------------------------------------------
  setupStage4Snowball(sentence) {
    const tokens = sentence.split(/\s+/).filter(t => t.length > 0);
    // 30%의 단어만 힌트로 제공 (최소 1개)
    const hintCount = Math.max(1, Math.round(tokens.length * 0.3));
    const step = tokens.length / hintCount;
    const hintIndices = new Set();
    for (let i = 0; i < hintCount; i++) {
      hintIndices.add(Math.min(tokens.length - 1, Math.floor(i * step)));
    }

    const items = tokens.map((token, idx) => ({
      word: token,
      isHint: hintIndices.has(idx),
      solved: hintIndices.has(idx)
    }));

    this.stage4State.items = items;
    const container = document.getElementById('snowballSlotsBox');

    container.innerHTML = items.map((item, idx) => {
      if (item.isHint) {
        return `<span class="snowball-chip-hint">💡 ${this.escapeHtml(item.word)}</span>`;
      }
      return `<input type="text" class="snowball-slot-input" data-idx="${idx}" data-ans="${encodeURIComponent(item.word)}" placeholder="직접 입력" autocomplete="off" spellcheck="false">`;
    }).join('');

    // 인풋 포커스 및 엔터 이동
    const inputs = container.querySelectorAll('.snowball-slot-input');
    inputs.forEach((inp, i) => {
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.checkSingleSnowballInput(inp);
          if (inputs[i + 1]) inputs[i + 1].focus();
          else document.getElementById('btnCheckSnowball').focus();
        }
      });
      inp.addEventListener('blur', () => this.checkSingleSnowballInput(inp));
    });

    if (inputs[0]) inputs[0].focus();
  },

  checkSingleSnowballInput(inp) {
    const val = inp.value.trim();
    const ans = decodeURIComponent(inp.dataset.ans);
    const cleanIn = Store.settings.punctFlexible ? val.replace(/[^\w가-힣]/g, '').toLowerCase() : val;
    const cleanAns = Store.settings.punctFlexible ? ans.replace(/[^\w가-힣]/g, '').toLowerCase() : ans;

    if (cleanIn.length > 0 && cleanIn === cleanAns) {
      if (!inp.classList.contains('correct')) {
        inp.classList.add('correct');
        inp.value = ans;
        SoundFX.playWordCheck();
        VisualFX.spawnHit(inp.getBoundingClientRect().left + 40, inp.getBoundingClientRect().top + 10, 6);
      }
    }
  },

  checkSnowballSlots() {
    const container = document.getElementById('snowballSlotsBox');
    const inputs = Array.from(container.querySelectorAll('.snowball-slot-input'));
    let allCorrect = true;

    inputs.forEach(inp => {
      this.checkSingleSnowballInput(inp);
      if (!inp.classList.contains('correct')) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      SoundFX.playSentenceMastered();
      VisualFX.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 50);
      setTimeout(() => {
        this.markCurrentAsMemorized(false);
      }, 600);
    } else {
      SoundFX.playErrorThud();
      VisualFX.shake('error');
      alert('아직 비어있거나 틀린 슬롯이 있습니다. 30% 힌트를 보며 다시 채워보세요!');
    }
  },

  // --------------------------------------------------------------------------
  // STAGE 5: 타임어택 백지 블라인드 모듈 (제한시간 초과 시 처음부터 다시 쓰기)
  // --------------------------------------------------------------------------
  setupStage5Blind(sentence) {
    const typingInput = document.getElementById('typingInput');
    typingInput.value = '';
    typingInput.disabled = false;
    typingInput.focus();

    this.updateBlindTypedView('');
    document.getElementById('errorAlertBanner').classList.add('hidden');

    // 제한시간 계산 (약 10초 ~ 30초)
    const timeLimit = Math.max(8, Math.round(sentence.length * 0.75 + 4));

    // 타이머 시작!
    this.startTimer(timeLimit, () => {
      // 💥 타임오버 처리: 입력 초기화 및 처음부터 재도전!
      alert(`⏰ [타임오버!] ${timeLimit}초 안에 완주하지 못했습니다.\n이 문장을 처음부터 다시 도전합니다!`);
      this.setupStage5Blind(sentence);
    });
  },

  // STAGE 5: 글자 하나를 완성 후 다음 글자로 넘어갈 때 확정 검사하는 정밀 블라인드 타이핑
  handleBlindTypingInput(e) {
    const inputVal = e.target.value;
    const item = this.getCurrentSentenceData();
    if (!item) return;

    SoundFX.playKeyClick();
    const target = item.sentence;
    const errorBanner = document.getElementById('errorAlertBanner');
    const errorText = document.getElementById('errorAlertText');

    if (!inputVal) {
      this.updateBlindTypedView('');
      errorBanner.classList.add('hidden');
      return;
    }

    // 한글 조합(IME) 중 글자 분리 오인 방지:
    // 사용자가 다음 글자로 넘어갔을 때(길이가 2 이상이거나 마지막 글자가 완성형)
    // 이전의 완성된 글자들은 100% 확정된 상태이므로 그 글자들을 정확히 검사!
    // e.inputType이 'insertText'이고 공백이거나, 전체 길이에 도달했을 때는 마지막 글자도 검사!
    const isCompletedLength = inputVal.length >= target.length;
    // 확정 완료된 글자 개수 (다음 글자로 넘어갔으므로 최소 inputVal.length - 1 개는 확정됨)
    const confirmedCount = isCompletedLength ? inputVal.length : Math.max(0, inputVal.length - 1);

    let hasError = false;
    let wrongChar = '';
    let expectedChar = '';
    let correctPrefix = '';

    // 1. 이미 완성되어 다음 글자로 넘어간 글자들에 대한 엄밀 검사
    for (let i = 0; i < confirmedCount; i++) {
      const inCh = inputVal[i];
      const tgCh = target[i] || '';

      const isMatch = Store.settings.punctFlexible
        ? this.normalizeChar(inCh) === this.normalizeChar(tgCh)
        : inCh === tgCh;

      if (isMatch) {
        correctPrefix += tgCh || inCh;
      } else {
        hasError = true;
        wrongChar = inCh;
        expectedChar = tgCh;
        break;
      }
    }

    // 화면 블라인드 뷰: 올바르게 완성된 글자들만 표시
    this.updateBlindTypedView(correctPrefix);

    if (hasError) {
      // 💥 완성되어 넘어간 글자가 틀렸을 때만 즉시 퍽! 소리와 함께 오답 경고!
      SoundFX.playErrorThud();
      VisualFX.shake('error');
      this.combo = 0;
      this.updateComboUI();
      errorBanner.classList.remove('hidden');
      errorText.innerHTML = `💥 <strong>[오답 발생!]</strong> 완성된 글자 '<strong>${this.escapeHtml(wrongChar)}</strong>' 자리가 틀렸습니다. (정답: '<strong>${this.escapeHtml(expectedChar)}</strong>')`;
    } else {
      errorBanner.classList.add('hidden');
      if (confirmedCount > 0) {
        this.addCombo();
        SoundFX.playHit(this.combo);
      }
    }

    // 문장 전체 완성 검사
    const cleanInput = Store.settings.punctFlexible ? inputVal.replace(/[^\w가-힣]/g, '') : inputVal.trim();
    const cleanTarget = Store.settings.punctFlexible ? target.replace(/[^\w가-힣]/g, '') : target.trim();

    if (cleanInput.length >= cleanTarget.length && cleanInput === cleanTarget) {
      // 💥 타임어택 제한시간 내 완주 성공!
      this.stopTimer();
      SoundFX.playSentenceMastered();
      VisualFX.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 60);
      this.markCurrentAsMemorized(false);
    }
  },

  updateBlindTypedView(correctPrefix) {
    const view = document.getElementById('blindTypedView');
    if (!correctPrefix) {
      view.innerHTML = `<span class="blind-placeholder">머릿속에서 기억을 끄집어내어 타이핑을 시작하세요...</span>`;
      return;
    }
    view.innerHTML = `
      <span class="blind-char-correct">${this.escapeHtml(correctPrefix)}</span>
      <span class="blind-char-cursor"></span>
    `;
  },

  normalizeChar(ch) {
    if (!ch) return '';
    return ch.toLowerCase().replace(/['"`.,~!?\s]/g, '');
  },

  // --------------------------------------------------------------------------
  // DRILL: 취약 문장 타임어택 단어 나열 모듈 (Scramble)
  // --------------------------------------------------------------------------
  setupDrillScramble(sentence) {
    const rawTokens = sentence.split(/\s+/).filter(t => t.length > 0);
    this.scrambleState.targetWords = [...rawTokens];
    this.scrambleState.selectedWords = [];
    this.scrambleState.remainingWords = [...rawTokens].sort(() => Math.random() - 0.5);

    this.renderDrillScramble();

    // 단어당 2.2초 타임어택 배부
    const timeLimit = Math.max(10, Math.round(rawTokens.length * 2.2));
    this.startTimer(timeLimit, () => {
      alert(`⏰ [타임오버!] 시간 초과로 단어가 다시 섞입니다!`);
      this.setupDrillScramble(sentence);
    });
  },

  renderDrillScramble() {
    const tray = document.getElementById('scrambleSentenceTray');
    const bank = document.getElementById('scrambleWordBank');
    const { selectedWords, remainingWords } = this.scrambleState;

    tray.innerHTML = selectedWords.length === 0
      ? '<span style="color:var(--text-dim); font-size:0.9rem;">아래 단어를 순서대로 클릭하면 이곳에 채워집니다...</span>'
      : selectedWords.map((word, i) => `<span class="word-pill in-tray">${this.escapeHtml(word)}</span>`).join('');

    bank.innerHTML = remainingWords.map((word, idx) => 
      `<button class="word-pill" onclick="App.clickScrambleWord(${idx})">${this.escapeHtml(word)}</button>`
    ).join('');
  },

  clickScrambleWord(index) {
    const { targetWords, selectedWords, remainingWords } = this.scrambleState;
    const clickedWord = remainingWords[index];
    const nextExpected = targetWords[selectedWords.length];

    if (clickedWord === nextExpected) {
      // ✅ 순서 일치!
      selectedWords.push(clickedWord);
      remainingWords.splice(index, 1);
      SoundFX.playWordCheck();
      VisualFX.spawnHit(window.innerWidth / 2, window.innerHeight / 2, 6);
      this.renderDrillScramble();

      if (selectedWords.length === targetWords.length) {
        // 💥 전체 문장 조립 완료!
        this.stopTimer();
        SoundFX.playSentenceMastered();
        VisualFX.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 50);
        setTimeout(() => {
          this.markCurrentAsMemorized(false);
        }, 600);
      }
    } else {
      // ❌ 순서 불일치
      SoundFX.playErrorThud();
      VisualFX.shake('error');
    }
  },

  resetScramble() {
    const item = this.getCurrentSentenceData();
    if (item) this.setupDrillScramble(item.sentence);
  },

  // --------------------------------------------------------------------------
  // 공통 마스터 체크 & 다음 문장 전환
  // --------------------------------------------------------------------------
  markCurrentAsMemorized(playSound = true) {
    this.stopTimer();
    const item = this.getCurrentSentenceData();
    if (!item) return;

    const curText = Store.getCurrentText();
    curText.stepProgress = curText.stepProgress || { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} };

    if (typeof this.currentMode === 'number') {
      curText.stepProgress[this.currentMode] = curText.stepProgress[this.currentMode] || {};
      curText.stepProgress[this.currentMode][item.originalIndex] = true;
    }

    if (this.currentMode === 'drill') {
      curText.weakList = (curText.weakList || []).filter(idx => idx !== item.originalIndex);
    }

    Store.saveData();

    if (playSound) {
      SoundFX.playSentenceMastered();
      VisualFX.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 30);
    }

    this.updateMasteryUI();
    this.renderSentenceList();

    const totalSentences = curText.sentences.length;
    let stepAllCleared = false;

    if (typeof this.currentMode === 'number') {
      const stepProg = curText.stepProgress[this.currentMode] || {};
      const passedCount = Object.keys(stepProg).filter(k => stepProg[k]).length;
      if (passedCount >= totalSentences) {
        stepAllCleared = true;
      }
    }

    if (stepAllCleared) {
      SoundFX.playStageClear();
      VisualFX.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 80);

      if (this.currentMode === 5) {
        this.showCongratulationModal();
      } else {
        const stageNames = {
          1: 'STAGE 1: 정독 & 뇌새김',
          2: 'STAGE 2: 키워드 강제인출',
          3: 'STAGE 3: 초성 단어 락커',
          4: 'STAGE 4: 스노우볼 30% 조립',
          5: 'STAGE 5: 타임어택 백지 블라인드'
        };
        const nextMode = this.currentMode + 1;
        document.getElementById('stageClearTitle').textContent = `🎉 ${stageNames[this.currentMode]} 정복 완료!`;
        document.getElementById('stageClearMessage').innerHTML = `
          모든 문장의 훈련을 완벽하게 마스터했습니다!<br>
          이제 다음 단계인 <strong>${stageNames[nextMode]}</strong> 단계로 진격합니다!
        `;
        document.getElementById('modalStageClear').classList.remove('hidden');
      }
    } else {
      setTimeout(() => {
        this.nextSentence();
      }, 350);
    }
  },

  addCombo() {
    this.combo++;
    if (this.combo >= 3 && this.combo % 3 === 0) {
      SoundFX.playComboSound(this.combo);
    }
    this.updateComboUI();
  },

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

  toggleReveal() {
    this.revealed = !this.revealed;
    const box = document.getElementById('revealedOriginalText');
    box.classList.toggle('hidden', !this.revealed);
    document.getElementById('revealBtnLabel').textContent = this.revealed ? '🙈 정답 가리기 (Space)' : '👁️ 정답 원문 확인 (Space)';
    if (this.revealed) SoundFX.playHit(0);
  },

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

  // "잘 모르겠습니다" 클릭 시: 취약 문장에 등록하고 정답을 보여준 뒤 다음 문장으로 이동
  markAsDontKnow() {
    this.stopTimer();
    const item = this.getCurrentSentenceData();
    if (!item) return;

    const curText = Store.getCurrentText();
    curText.weakList = curText.weakList || [];
    if (!curText.weakList.includes(item.originalIndex)) {
      curText.weakList.push(item.originalIndex);
    }
    Store.saveData();

    SoundFX.playErrorThud();
    VisualFX.shake('hit');

    // 정답 원문 박스 열어주기
    const box = document.getElementById('revealedOriginalText');
    if (box) box.classList.remove('hidden');

    // 별표 표시 활성화
    document.getElementById('weaknessBadge').classList.remove('hidden');
    document.getElementById('btnToggleWeakness').classList.add('starred');
    document.getElementById('starIcon').textContent = '★';

    this.renderSentenceList();

    setTimeout(() => {
      this.nextSentence();
    }, 1200);
  },

  // 문장 전체 목록 사이드바 접기/펼치기 (기본값: 접힘)
  toggleSidebar(forceState) {
    const sidebar = document.getElementById('sidebarOverview');
    const mainLayout = document.querySelector('.main-layout');
    if (!sidebar || !mainLayout) return;

    const isCollapsed = sidebar.classList.contains('collapsed');
    const willOpen = forceState !== undefined ? forceState : isCollapsed;

    if (willOpen) {
      sidebar.classList.remove('collapsed');
      mainLayout.classList.add('sidebar-open');
    } else {
      sidebar.classList.add('collapsed');
      mainLayout.classList.remove('sidebar-open');
    }
    SoundFX.playHit(0);
  },

  prevSentence() {
    const list = this.getActiveSentences();
    if (list.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + list.length) % list.length;
    this.renderCardContent();
  },

  nextSentence() {
    const list = this.getActiveSentences();
    if (list.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % list.length;
    this.renderCardContent();
  },

  speakCurrentSentence() {
    const item = this.getCurrentSentenceData();
    const curText = Store.getCurrentText();
    if (!item) return;
    SoundFX.playHit(0);
    SpeechEngine.speak(item.sentence, curText.language, Store.settings.ttsRate);
  },

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

  updateMasteryUI() {
    const curText = Store.getCurrentText();
    if (!curText || !curText.sentences || curText.sentences.length === 0) return;

    const total = curText.sentences.length;
    const finalProg = (curText.stepProgress && curText.stepProgress[5]) || {};
    const mastered = Object.keys(finalProg).filter(k => finalProg[k]).length;
    const pct = Math.round((mastered / total) * 100);

    document.getElementById('masteryRateText').textContent = `${pct}%`;
    document.getElementById('masteryProgressBar').style.width = `${pct}%`;
    document.getElementById('sidebarCountBadge').textContent = `${mastered} / ${total}`;

    const stepLabel = typeof this.currentMode === 'number' ? `STAGE ${this.currentMode} 진행` : '타임어택 단어 나열';
    document.getElementById('stepProgressLabel').textContent = stepLabel;
  },

  renderSentenceList() {
    const container = document.getElementById('sentenceListContainer');
    const curText = Store.getCurrentText();
    if (!curText || !curText.sentences) {
      container.innerHTML = '<p class="empty-tip">문장이 없습니다.</p>';
      return;
    }

    const sentences = curText.sentences;
    const curStepProg = (curText.stepProgress && curText.stepProgress[this.currentMode]) || {};
    const weakList = curText.weakList || [];
    const activeItem = this.getCurrentSentenceData();

    const filtered = sentences.map((sentence, idx) => ({
      sentence,
      idx,
      isMastered: !!curStepProg[idx],
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

  jumpToSentence(originalIndex) {
    const list = this.getActiveSentences();
    const targetIdx = list.findIndex(item => item.originalIndex === originalIndex);
    if (targetIdx >= 0) {
      this.currentIndex = targetIdx;
      this.renderCardContent();
      SoundFX.playHit(0);
    } else {
      this.setMode(1);
      this.currentIndex = originalIndex;
      this.renderCardContent();
    }
  },

  showCongratulationModal() {
    SoundFX.playFanfare();
    const curText = Store.getCurrentText();
    document.getElementById('congratTextTitle').textContent = `"${curText.title}"`;
    document.getElementById('congratTotalCount').textContent = curText.sentences.length;
    document.getElementById('modalCongratulation').classList.remove('hidden');

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

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
