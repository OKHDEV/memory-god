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
    
    // 찰칵 스냅 노이즈
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

    // 바디 틱
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

  // 팡! 찰진 정답 타격음 (콤보에 따라 피치 상승)
  playHit(combo = 0) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const pitchOffset = Math.min(combo * 16, 260);

    // 1. 묵직한 펀치 킥
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

    // 2. 촥! 하는 크런치 스냅
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

    // 강력한 폭발음
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

    // 반짝이는 챠임 (C5 - E5 - G5 - C6)
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

  // 스테이지 클리어 팡파레 (스텝 완료 시)
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

  // 오답 퍽! 둔탁한 타격음
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

  // 스파크 파티클 터짐
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

  // 대폭발 파티클
  spawnBurst(x, y, count = 45) {
    const goldColors = ['#fbbf24', '#f59e0b', '#10b981', '#34d399', '#ffffff', '#e11d48'];
    this.spawnHit(x, y, count, goldColors);
  },

  // 화면 흔들림(Screen Shake) 효과 - 사용자의 요청에 따라 기본적으로 완전 차단
  shake(type = 'hit') {
    if (!Store.settings.screenShake) return; // 화면 흔들림 완전 끔!

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
// 3. 지능형 핵심 키워드 분석기 & 초성 엔진 (Keyword & Chosung Analyzer)
// ============================================================================
const NLPAnalyzer = {
  // 한국어 불용어 (조사, 형식 형태소, 접속사 등)
  KO_STOPWORDS: new Set([
    '은', '는', '이', '가', '을', '를', '의', '에', '에서', '로', '으로',
    '과', '와', '하고', '도', '만', '뿐', '부터', '까지', '에게', '한테',
    '보다', '등', '및', '즉', '수', '것', '때', '그', '이', '저', '우리',
    '또한', '그리고', '그러나', '하지만', '하여', '하며', '하고', '이다',
    '있다', '없다', '된다', '한다'
  ]),

  // 영어 불용어 (관사, 전치사, be동사, 대명사 등)
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

  // 단어가 핵심 키워드인지 판별하고 중요도 점수 반환
  getKeywordScore(word, lang = 'ko-KR') {
    const clean = word.replace(/[^a-zA-Z0-9가-힣]/g, '').toLowerCase();
    if (clean.length <= 1) return 0;

    if (lang.startsWith('en')) {
      if (this.EN_STOPWORDS.has(clean)) return 1;
      return clean.length >= 4 ? 10 : 5;
    }

    // 한국어: 조사 분리 분석
    if (this.KO_STOPWORDS.has(clean)) return 1;

    // 조사가 붙어있는 긴 단어 검사 (예: "헌법을", "민주개혁과")
    const commonPostpositions = ['에서', '으로', '부터', '까지', '에게', '은', '는', '이', '가', '을', '를', '의', '에', '로', '과', '와', '도'];
    let stem = clean;
    for (const post of commonPostpositions) {
      if (stem.endsWith(post) && stem.length > post.length + 1) {
        stem = stem.slice(0, -post.length);
        break;
      }
    }

    if (stem.length >= 2 && !this.KO_STOPWORDS.has(stem)) {
      return 10; // 명사/핵심어
    }
    return 3;
  },

  // 2단계: 핵심 키워드 우선 가리기 (기본 난이도: 어려움 75%)
  generateKeywordCloze(sentence, level = 75, lang = 'ko-KR') {
    const tokens = sentence.split(/(\s+)/);
    // 각 단어별 점수 계산
    const wordList = [];
    tokens.forEach((token, idx) => {
      if (!/^\s+$/.test(token) && /[a-zA-Z0-9가-힣]/.test(token)) {
        const score = this.getKeywordScore(token, lang);
        wordList.push({ token, idx, score });
      }
    });

    // 점수가 높은 핵심 키워드 순으로 정렬
    const sorted = [...wordList].sort((a, b) => b.score - a.score);
    // 가릴 단어 개수 산출 (어려움: 75% -> 핵심 키워드 80% 이상 전멸)
    const ratio = level / 100;
    const targetCount = Math.max(1, Math.round(wordList.length * ratio));
    const blankIndices = new Set(sorted.slice(0, targetCount).map(item => item.idx));

    return tokens.map((token, idx) => {
      if (blankIndices.has(idx)) {
        return `<span class="cloze-blank" data-ans="${encodeURIComponent(token)}" onclick="App.handleClozeClick(this)">???</span>`;
      }
      return App.escapeHtml(token);
    }).join('');
  },

  // 3단계: 초성/첫글자 단서 생성
  generateChosungPrompt(sentence, lang = 'ko-KR') {
    if (lang.startsWith('en')) {
      return sentence.replace(/[a-zA-Z]+/g, match => {
        if (match.length <= 1) return match;
        const first = match[0];
        const rest = '_'.repeat(match.length - 1);
        return `<span class="chosung-char">${first}</span><span class="chosung-mask">${rest}</span>`;
      });
    }

    // 한국어 초성 분리
    return sentence.split('').map(char => {
      const code = char.charCodeAt(0);
      if (code >= 0xAC00 && code <= 0xD7A3) {
        const chosungIndex = Math.floor((code - 0xAC00) / (21 * 28));
        return `<span class="chosung-char">${this.CHOSUNG_LIST[chosungIndex]}</span>`;
      }
      return char;
    }).join('');
  }
};


// ============================================================================
// 4. 스토어 및 진행도 관리 (Store)
// ============================================================================
const Store = {
  STORAGE_KEY: 'MEMORY_GOD_PRO_DATA_V3',
  SETTINGS_KEY: 'MEMORY_GOD_PRO_SETTINGS_V3',

  data: {
    texts: [],
    currentTextId: null
  },

  settings: {
    sound: true,
    screenShake: false, // 기본값: 완전 꺼짐 (눈 편안함)
    punctFlexible: true,
    fontScale: 1,
    theme: 'dark',
    ttsRate: 1.0,
    clozeLevel: 75 // 기본: 어려움 (핵심 75%)
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
    // 사용자가 너무 어지럽지 않도록 화면 흔들림 기본값은 완전 OFF로 초기화
    if (this.settings.screenShake === undefined || this.settings.screenShake === true) {
      this.settings.screenShake = false;
      this.saveSettings();
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
  currentMode: 1, // 1~5, 'drill'
  currentIndex: 0,
  revealed: false,
  combo: 0,
  sidebarFilter: 'all',

  // 5단계 블라인드 타자 상태
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

    // 2단계 난이도 기본값 활성화
    document.querySelectorAll('.btn-fade').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.level, 10) === Store.settings.clozeLevel);
    });
  },

  bindEvents() {
    // 1. 헤더 컨트롤
    document.getElementById('textSelect').addEventListener('change', (e) => {
      this.loadText(e.target.value);
    });

    document.getElementById('btnShakeToggle').addEventListener('click', () => {
      Store.settings.screenShake = !Store.settings.screenShake;
      Store.saveSettings();
      this.applySettingsToUI();
      if (Store.settings.screenShake) {
        SoundFX.playHit(0);
      }
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

    // 2. 5대 마스터리 탭
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const mode = tab.dataset.mode;
        this.setMode(mode === 'drill' ? 'drill' : parseInt(mode, 10));
      });
    });

    // 3. 카드 제어 버튼
    document.getElementById('btnPrevSentence').addEventListener('click', () => this.prevSentence());
    document.getElementById('btnNextSentence').addEventListener('click', () => this.nextSentence());
    document.getElementById('btnMarkMemorized').addEventListener('click', () => this.markCurrentAsMemorized());
    document.getElementById('btnToggleReveal').addEventListener('click', () => this.toggleReveal());
    document.getElementById('btnSpeakCurrent').addEventListener('click', () => this.speakCurrentSentence());
    document.getElementById('btnToggleWeakness').addEventListener('click', () => this.toggleCurrentWeakness());

    // 4. 서브 컨트롤
    document.getElementById('ttsRateSelect').addEventListener('change', (e) => {
      Store.settings.ttsRate = parseFloat(e.target.value);
      Store.saveSettings();
    });
    document.getElementById('btnPlayFullTTS').addEventListener('click', () => this.playFullTextTTS());

    // 2단계 키워드 난이도
    document.querySelectorAll('.btn-fade').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-fade').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        Store.settings.clozeLevel = parseInt(btn.dataset.level, 10);
        Store.saveSettings();
        this.renderCardContent();
      });
    });

    // 5. 5단계 블라인드 타자
    const typingInput = document.getElementById('typingInput');
    typingInput.addEventListener('input', (e) => this.handleBlindTypingInput(e));
    typingInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.checkBlindTypingComplete();
      }
    });

    // 6. 음성 인식
    document.getElementById('btnStartVoiceRec').addEventListener('click', () => this.toggleVoiceRecognition());

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

    // 7. 사이드바 필터
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

    // 8. 전역 키보드 단축키
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

    // 9. 스테이지 클리어 모달에서 다음 스테이지로 진격 버튼
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
    this.currentMode = mode;
    this.revealed = false;

    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.mode === String(mode));
    });

    const badgeMap = {
      1: 'STAGE 1: 정독 & 뇌새김',
      2: 'STAGE 2: 키워드 강제인출',
      3: 'STAGE 3: 초성 락커',
      4: 'STAGE 4: 스노우볼 체이닝',
      5: 'STAGE 5: 백지 블라인드',
      'drill': '🔥 취약 문장 지옥훈련'
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

  renderCardContent() {
    const item = this.getCurrentSentenceData();
    const curText = Store.getCurrentText();

    if (!item) {
      if (this.currentMode === 'drill') {
        document.getElementById('targetDisplayText').innerHTML = '🎉 등록된 취약 문장이 없습니다!<br><span style="font-size:0.9rem; color:var(--text-muted)">다른 단계에서 별표(⭐)를 눌러 취약 문장을 추가해보세요.</span>';
        document.getElementById('sentenceCounter').textContent = '0 / 0';
        document.getElementById('stepSentenceStatus').textContent = '완벽 클리어!';
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

    // 현재 스텝 통과 개수 표시
    if (typeof this.currentMode === 'number') {
      const stepProg = (curText.stepProgress && curText.stepProgress[this.currentMode]) || {};
      const passedCount = Object.keys(stepProg).filter(k => stepProg[k]).length;
      document.getElementById('stepSentenceStatus').textContent = `이 스텝 통과: ${passedCount} / ${curText.sentences.length}`;
    } else {
      document.getElementById('stepSentenceStatus').textContent = `취약 문장 훈련 중`;
    }

    // 취약 문장 뱃지
    const isWeak = (curText.weakList || []).includes(originalIndex);
    document.getElementById('weaknessBadge').classList.toggle('hidden', !isWeak);
    document.getElementById('btnToggleWeakness').classList.toggle('starred', isWeak);
    document.getElementById('starIcon').textContent = isWeak ? '★' : '⭐';

    const textDisplayBox = document.getElementById('targetDisplayText');
    const revealArea = document.getElementById('revealArea');
    const typingArea = document.getElementById('typingArea');
    const voiceArea = document.getElementById('voiceArea');
    const contextPreviewBox = document.getElementById('contextPreviewBox');
    const errorAlertBanner = document.getElementById('errorAlertBanner');

    revealArea.classList.add('hidden');
    typingArea.classList.add('hidden');
    voiceArea.classList.add('hidden');
    contextPreviewBox.classList.add('hidden');
    errorAlertBanner.classList.add('hidden');
    this.revealed = false;
    document.getElementById('revealedOriginalText').classList.add('hidden');

    // -------------------------------------------------------------
    // STAGE 1: 정독 & 뇌새김
    // -------------------------------------------------------------
    if (this.currentMode === 1) {
      textDisplayBox.innerHTML = this.escapeHtml(sentence);
    }
    // -------------------------------------------------------------
    // STAGE 2: 키워드 강제인출 (NLP 형태소 분석 기반 중요 키워드 우선 소멸)
    // -------------------------------------------------------------
    else if (this.currentMode === 2) {
      revealArea.classList.remove('hidden');
      textDisplayBox.innerHTML = NLPAnalyzer.generateKeywordCloze(sentence, Store.settings.clozeLevel, curText.language);
      document.getElementById('revealedTextContent').textContent = sentence;
    }
    // -------------------------------------------------------------
    // STAGE 3: 초성 락커 (원문 0%, 초성만으로 전체 인출)
    // -------------------------------------------------------------
    else if (this.currentMode === 3) {
      revealArea.classList.remove('hidden');
      textDisplayBox.innerHTML = NLPAnalyzer.generateChosungPrompt(sentence, curText.language);
      document.getElementById('revealedTextContent').textContent = sentence;
    }
    // -------------------------------------------------------------
    // STAGE 4: 스노우볼 체이닝 (배우식 누적 폭풍 암기)
    // -------------------------------------------------------------
    else if (this.currentMode === 4) {
      revealArea.classList.remove('hidden');
      contextPreviewBox.classList.remove('hidden');

      const prevSentences = curText.sentences.slice(0, originalIndex);
      if (prevSentences.length > 0) {
        contextPreviewBox.innerHTML = `<strong>앞선 문장 연결 사슬:</strong><br>${prevSentences.map((s, idx) => `[${idx + 1}] ${s}`).join('<br>')}`;
      } else {
        contextPreviewBox.innerHTML = `<strong>첫 문장 개시!</strong> 거대한 스노우볼의 첫 번째 뼈대를 세우세요.`;
      }

      document.getElementById('chainingRangeText').textContent = `누적 범위: 1번 ~ ${originalIndex + 1}번 문장 연쇄`;
      // 현재 문장은 초성으로만 노출하여 인출 자극
      textDisplayBox.innerHTML = NLPAnalyzer.generateChosungPrompt(sentence, curText.language);
      document.getElementById('revealedTextContent').textContent = sentence;
    }
    // -------------------------------------------------------------
    // STAGE 5 or 드릴: 백지 블라인드 타자 (정답 완전 비노출)
    // -------------------------------------------------------------
    else if (this.currentMode === 5 || this.currentMode === 'drill') {
      textDisplayBox.innerHTML = `<span style="color:var(--text-dim); font-size:1.15rem;">🔒 정답은 봉인되어 있습니다. 머릿속의 기억만으로 첫 글자부터 타이핑하세요!</span>`;
      typingArea.classList.remove('hidden');
      
      const typingInput = document.getElementById('typingInput');
      typingInput.value = '';
      typingInput.focus();

      this.typingStats = {
        startTime: null,
        totalChars: 0,
        errors: 0
      };
      
      // 블라인드 결과창 초기화 (정답 노출 없음!)
      this.updateBlindTypedView('');
      this.updateTypingStatsUI();
    }

    this.renderSentenceList();
  },

  // 빈칸 클릭 시 팡! 소리와 함께 공개
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

  // 5단계 완전 블라인드 타자 실시간 처리 (정답 미리보기 완전 배제)
  handleBlindTypingInput(e) {
    const inputVal = e.target.value;
    const item = this.getCurrentSentenceData();
    if (!item) return;

    if (!this.typingStats.startTime) {
      this.typingStats.startTime = Date.now();
    }

    SoundFX.playKeyClick();
    this.checkBlindTypingRealtime(inputVal, item.sentence);
  },

  // 블라인드 타자 실시간 정밀 채점
  checkBlindTypingRealtime(inputVal, target) {
    const errorBanner = document.getElementById('errorAlertBanner');
    const errorText = document.getElementById('errorAlertText');

    if (!inputVal) {
      this.updateBlindTypedView('');
      errorBanner.classList.add('hidden');
      return;
    }

    // 일치 여부 비교 (구두점 유연 모드)
    let hasError = false;
    let correctPrefix = '';
    let errorChar = '';

    for (let i = 0; i < inputVal.length; i++) {
      const inCh = inputVal[i];
      const tgCh = target[i] || '';

      const isMatch = Store.settings.punctFlexible
        ? this.normalizeChar(inCh) === this.normalizeChar(tgCh)
        : inCh === tgCh;

      if (isMatch) {
        correctPrefix += tgCh || inCh;
      } else {
        hasError = true;
        errorChar = inCh;
        break;
      }
    }

    // 화면 뷰 갱신: 맞춘 글자만 네온 그린으로 채움!
    this.updateBlindTypedView(correctPrefix);

    if (hasError) {
      // 💥 오답 발생! 틀릴 때만 빨간색 경고 배너와 소리로 알려줌!
      this.typingStats.errors++;
      SoundFX.playErrorThud();
      VisualFX.shake('error');
      this.combo = 0;
      this.updateComboUI();

      errorBanner.classList.remove('hidden');
      const curIndexInTarget = correctPrefix.length;
      const expectedChar = target[curIndexInTarget] || '';
      errorText.innerHTML = `💥 <strong>[오답 발생!]</strong> 입력한 '<strong>${this.escapeHtml(errorChar)}</strong>' 자리가 틀렸습니다. (백스페이스로 지우고 다시 쳐보세요!)`;
    } else {
      errorBanner.classList.add('hidden');
      this.addCombo();
      SoundFX.playHit(this.combo);
      VisualFX.shake('hit');

      const inputEl = document.getElementById('typingInput');
      const rect = inputEl.getBoundingClientRect();
      VisualFX.spawnHit(rect.left + rect.width / 2, rect.top + 20, 5);
    }

    // 문장 전체 완성 검사
    const cleanInput = Store.settings.punctFlexible ? inputVal.replace(/[^\w가-힣]/g, '') : inputVal.trim();
    const cleanTarget = Store.settings.punctFlexible ? target.replace(/[^\w가-힣]/g, '') : target.trim();

    if (cleanInput.length >= cleanTarget.length && cleanInput === cleanTarget) {
      this.onSentenceCompleted();
    }

    this.updateTypingStatsUI();
  },

  // 맞춘 글자만 보여주는 블라인드 뷰
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

  checkBlindTypingComplete() {
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
      alert('문장이 아직 완전히 일치하지 않습니다. 틀린 글자를 수정해주세요!');
    }
  },

  onSentenceCompleted() {
    SoundFX.playSentenceMastered();
    VisualFX.shake('hit');
    const card = document.getElementById('practiceCard');
    const rect = card.getBoundingClientRect();
    VisualFX.spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 50);

    this.markCurrentAsMemorized(false);
  },

  updateTypingStatsUI() {
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
    if (this.revealed) {
      SoundFX.playHit(0);
    }
  },

  // "완벽히 외웠음!" 버튼 동작: 현재 문장 마크 -> 다음 문장으로 스무스 전환 -> 스텝 완료 시 다음 스텝 자동 승급
  markCurrentAsMemorized(playSound = true) {
    const item = this.getCurrentSentenceData();
    if (!item) return;

    const curText = Store.getCurrentText();
    curText.stepProgress = curText.stepProgress || { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} };

    // 현재 스텝에 마스터 체크
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
      const rect = document.getElementById('btnMarkMemorized').getBoundingClientRect();
      VisualFX.spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);
      VisualFX.shake('hit');
    }

    this.updateMasteryUI();
    this.renderSentenceList();

    // 해당 스텝 전체 완료 여부 검사
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
      // 스테이지 클리어!
      SoundFX.playStageClear();
      VisualFX.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 80);

      if (this.currentMode === 5) {
        // 5단계 최종 완료!
        this.showCongratulationModal();
      } else {
        // 1~4단계 클리어 시 축하 및 다음 스텝 전환 모달
        const stageNames = {
          1: 'STAGE 1: 정독 & 뇌새김',
          2: 'STAGE 2: 키워드 강제인출',
          3: 'STAGE 3: 초성 락커',
          4: 'STAGE 4: 스노우볼 체이닝',
          5: 'STAGE 5: 백지 블라인드'
        };
        const nextMode = this.currentMode + 1;
        document.getElementById('stageClearTitle').textContent = `🎉 ${stageNames[this.currentMode]} 정복 완료!`;
        document.getElementById('stageClearMessage').innerHTML = `
          해당 지문의 모든 문장을 완벽하게 소화했습니다!<br>
          이제 더 고난도인 <strong>${stageNames[nextMode]}</strong> 단계로 진격합니다!
        `;
        document.getElementById('modalStageClear').classList.remove('hidden');
      }
    } else {
      // 스텝이 아직 덜 끝났으면 다음 문장으로 부드럽게 자동 전환!
      setTimeout(() => {
        this.nextSentence();
      }, 350);
    }
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
      statusText.textContent = '마이크 누르고 문장 외워서 말하기';
      return;
    }

    btnMic.classList.add('recording');
    statusText.textContent = '듣고 있습니다... 머릿속 문장을 외쳐보세요!';
    resultPreview.textContent = '음성 입력 대기 중...';

    SpeechEngine.startListen(
      curText.language,
      (transcript) => {
        resultPreview.textContent = `인식 결과: "${transcript}"`;
        const cleanInput = transcript.replace(/[^\w가-힣]/g, '').toLowerCase();
        const cleanTarget = item.sentence.replace(/[^\w가-힣]/g, '').toLowerCase();

        if (cleanTarget.includes(cleanInput) || cleanInput.includes(cleanTarget) || cleanInput === cleanTarget) {
          resultPreview.innerHTML = `🎉 <strong style="color:#34d399">완벽 일치!</strong> ("${transcript}")`;
          this.onSentenceCompleted();
        }
      },
      () => {
        btnMic.classList.remove('recording');
        statusText.textContent = '마이크 누르고 문장 외워서 말하기';
      },
      () => {
        btnMic.classList.remove('recording');
        statusText.textContent = '마이크 누르고 문장 외워서 말하기';
        resultPreview.textContent = '음성 인식 오류가 발생했습니다.';
      }
    );
  },

  updateMasteryUI() {
    const curText = Store.getCurrentText();
    if (!curText || !curText.sentences || curText.sentences.length === 0) return;

    const total = curText.sentences.length;
    // 5단계 최종 마스터 완료된 문장 기준 또는 현재 스텝 기준
    const finalProg = (curText.stepProgress && curText.stepProgress[5]) || {};
    const mastered = Object.keys(finalProg).filter(k => finalProg[k]).length;
    const pct = Math.round((mastered / total) * 100);

    document.getElementById('masteryRateText').textContent = `${pct}%`;
    document.getElementById('masteryProgressBar').style.width = `${pct}%`;
    document.getElementById('sidebarCountBadge').textContent = `${mastered} / ${total}`;

    // 현재 스텝 라벨
    const stepLabel = typeof this.currentMode === 'number' ? `STAGE ${this.currentMode} 진행` : '지옥훈련 진행';
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
