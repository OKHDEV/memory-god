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

  // 끄투 스타일 장문 정답/완벽히 외움 연출 ("투두두둑!" + "뜬! 뜬! 딴~!")
  playKkutuSuccess(onComplete) {
    if (!this.enabled) {
      if (onComplete) setTimeout(onComplete, 350);
      return;
    }
    this.init();
    if (!this.ctx) {
      if (onComplete) setTimeout(onComplete, 350);
      return;
    }

    const t = this.ctx.currentTime;

    // 1단계: "투두두둑!" (빠른 고속 연속 타자 아르페지오 - 약 0.35초)
    const rapidSteps = 8;
    for (let i = 0; i < rapidSteps; i++) {
      const stepT = t + i * 0.042;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const freq = 450 + i * 85;
      osc.frequency.setValueAtTime(freq, stepT);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, stepT + 0.035);

      gain.gain.setValueAtTime(0.25, stepT);
      gain.gain.exponentialRampToValueAtTime(0.001, stepT + 0.038);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(stepT);
      osc.stop(stepT + 0.04);
    }

    // 2단계: "뜬! 뜬! 딴~!" (경쾌하고 웅장한 3단 팡파레)
    // 뜬! (1타: 도5 523Hz)
    const t1 = t + 0.38;
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(523.25, t1);
    gain1.gain.setValueAtTime(0.35, t1);
    gain1.gain.exponentialRampToValueAtTime(0.001, t1 + 0.13);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(t1);
    osc1.stop(t1 + 0.14);

    // 뜬! (2타: 미5 659Hz)
    const t2 = t + 0.52;
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(659.25, t2);
    gain2.gain.setValueAtTime(0.38, t2);
    gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.13);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t2);
    osc2.stop(t2 + 0.14);

    // 딴~! (3타: 솔5 783Hz + 도6 1046Hz + 미6 1318Hz 웅장한 승리 화음)
    const t3 = t + 0.66;
    const finalChords = [783.99, 1046.50, 1318.51];
    finalChords.forEach(freq => {
      const osc3 = this.ctx.createOscillator();
      const gain3 = this.ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(freq, t3);
      gain3.gain.setValueAtTime(0.3, t3);
      gain3.gain.exponentialRampToValueAtTime(0.001, t3 + 0.45);
      osc3.connect(gain3);
      gain3.connect(this.ctx.destination);
      osc3.start(t3);
      osc3.stop(t3 + 0.48);
    });

    // 뜬! 뜬! 딴~! 리듬에 맞춘 화려한 폭발 파티클
    setTimeout(() => {
      if (window.VisualFX) VisualFX.spawnBurst(window.innerWidth * 0.4, window.innerHeight * 0.45, 18);
    }, 380);
    setTimeout(() => {
      if (window.VisualFX) VisualFX.spawnBurst(window.innerWidth * 0.6, window.innerHeight * 0.45, 22);
    }, 520);
    setTimeout(() => {
      if (window.VisualFX) VisualFX.spawnBurst(window.innerWidth * 0.5, window.innerHeight * 0.4, 45);
    }, 660);

    if (onComplete) {
      setTimeout(onComplete, 1150);
    }
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

  JUNGSUNG_LIST: [
    'ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'
  ],

  JONGSUNG_LIST: [
    '','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'
  ],

  // 한국어 음절을 초성/중성/종성 자모 문자열로 분해
  // 예: "사과를 먹었습니다" -> "ㅅㅏㄱㅘㄹㅡㄹㅁㅓㄱㅇㅓㅆㅅㅡㅂㄴㅣㄷㅏ"
  // 연음 및 발음 차이를 자모 단위로 정규화하여 STT 인식률 극대화
  decomposeHangul(str) {
    if (!str) return '';
    let result = '';
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code >= 0xAC00 && code <= 0xD7A3) {
        const offset = code - 0xAC00;
        const jong = offset % 28;
        const jung = Math.floor((offset - jong) / 28) % 21;
        const cho = Math.floor((offset - jong) / (28 * 21));

        result += this.CHOSUNG_LIST[cho];
        result += this.JUNGSUNG_LIST[jung];
        if (jong > 0) {
          result += this.JONGSUNG_LIST[jong];
        }
      } else {
        const char = str[i].toLowerCase();
        // 공백, 마침표, 물음표 등 특수문자 제외하고 영문/숫자 유지
        if (/[a-z0-9]/.test(char)) {
          result += char;
        }
      }
    }
    return result;
  },

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

    // 기본 예시 지문 (스티브 잡스, 헌법, 마틴 루터 킹 등 기본 샘플) 영구 제거
    if (this.data && this.data.texts && this.data.texts.length > 0) {
      this.data.texts = this.data.texts.filter(t => 
        !t.id.startsWith('sample_') &&
        !t.title.includes('스티브 잡스') &&
        !t.title.includes('헌법 전문') &&
        !t.title.includes('마틴 루터') &&
        !t.title.includes('서시') &&
        !t.title.includes('실전 발표')
      );
    } else {
      this.data = { texts: [], currentTextId: null };
    }

    if (this.data.texts.length > 0) {
      if (!this.data.currentTextId || !this.data.texts.find(t => t.id === this.data.currentTextId)) {
        this.data.currentTextId = this.data.texts[0].id;
      }
    } else {
      this.data.currentTextId = null;
    }
    this.saveData();
  },

  saveData() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
  },

  saveSettings() {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.settings));
  },

  getCurrentText() {
    if (!this.data || !this.data.texts || this.data.texts.length === 0) return null;
    const t = this.data.texts.find(item => item.id === this.data.currentTextId) || this.data.texts[0];
    if (t && !t.stepProgress) {
      t.stepProgress = { '1': {}, '1.5': {}, '2': {}, '3': {}, '4': {}, '5': {}, '6': {}, 'drill': {} };
    }
    return t || null;
  },

  setCurrentTextId(id) {
    this.data.currentTextId = id;
    this.saveData();
  },

  addNewText(textObj) {
    textObj.stepProgress = { '1': {}, '1.5': {}, '2': {}, '3': {}, '4': {}, '5': {}, '6': {}, 'drill': {} };
    textObj.weakList = [];
    this.data.texts.push(textObj);
    this.data.currentTextId = textObj.id;
    this.saveData();
  },

  updateText(id, updatedObj) {
    const idx = this.data.texts.findIndex(t => t.id === id);
    if (idx >= 0) {
      this.data.texts[idx] = {
        ...this.data.texts[idx],
        ...updatedObj
      };
      this.saveData();
      return this.data.texts[idx];
    }
    return null;
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
    if (this.synth) {
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          this.synth.getVoices();
        };
      }
      this.synth.getVoices();
    }
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      this.recognition = new SpeechRec();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
    }
  },

  getBestVoice(lang = 'ko-KR') {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    const langPrefix = lang.substring(0, 2).toLowerCase();
    const candidateVoices = voices.filter(v => v.lang.toLowerCase().startsWith(langPrefix));
    if (candidateVoices.length === 0) return null;

    if (langPrefix === 'ko') {
      // 한국어 고품질 자연스러운 음성 우선 탐색 (Google 한국의, Microsoft SunHi Natural 등)
      const naturalVoice = candidateVoices.find(v => 
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online')) && !v.name.includes('Desktop')
      );
      if (naturalVoice) return naturalVoice;

      const nonDesktop = candidateVoices.find(v => !v.name.includes('Desktop'));
      if (nonDesktop) return nonDesktop;
    } else if (langPrefix === 'en') {
      const naturalVoice = candidateVoices.find(v => 
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online')) && !v.name.includes('Desktop')
      );
      if (naturalVoice) return naturalVoice;
    }

    return candidateVoices[0];
  },

  speak(text, lang = 'ko-KR', rate = 1.0, onEnd = null) {
    if (!this.synth) return;
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const bestVoice = this.getBestVoice(lang);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    if (onEnd) utterance.onend = onEnd;
    this.synth.speak(utterance);
  },

  stopSpeak() {
    if (this.synth) this.synth.cancel();
  },

  async startListen(lang, onResult, onEnd, onError) {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('이 브라우저는 음성 인식(STT)을 지원하지 않습니다. Chrome 또는 Edge 브라우저를 이용해 주세요.');
      if (onError) onError(new Error('Speech recognition not supported'));
      return;
    }

    // 마이크 접근 권한 확인 (사용 후 트랙 즉시 해제하여 SpeechRecognition 독점 보장)
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(t => t.stop());
      }
    } catch (permErr) {
      console.warn('Microphone permission check error:', permErr);
    }

    try {
      if (this.recognition) {
        try { this.recognition.abort(); } catch (e) {}
      }
      this.recognition = new SpeechRec();
      this.recognition.lang = lang || 'ko-KR';
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
      this.isRecognizing = true;

      this.recognition.onstart = () => {
        this.isRecognizing = true;
      };

      this.recognition.onresult = (event) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          fullTranscript += event.results[i][0].transcript;
        }
        if (onResult) onResult(fullTranscript.trim());
      };

      this.recognition.onerror = (e) => {
        if (e.error === 'no-speech') {
          return; // 침묵 상태는 대기 지속
        }
        console.warn('SpeechRecognition error:', e.error);
        if (e.error === 'not-allowed') {
          alert('마이크 접근이 차단되어 있습니다. 브라우저 주소창 왼쪽의 자물쇠/마이크 설정을 허용으로 변경해 주세요!');
        }
        this.isRecognizing = false;
        if (onError) onError(e);
      };

      this.recognition.onend = () => {
        this.isRecognizing = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
    } catch (err) {
      this.isRecognizing = false;
      console.error('Recognition start failed:', err);
      if (onError) onError(err);
    }
  },

  stopListen() {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {}
      this.isRecognizing = false;
    }
  }
};


// ============================================================================
// 5.5 아케이드 미니게임 엔진 (MiniGameEngine)
// ============================================================================
const MiniGameEngine = {
  activeGame: 'bomb', // 'bomb' | 'acid' | 'race'
  difficulty: 'normal', // 'normal' | 'hard'
  score: 0,
  combo: 0,
  highScores: {
    bomb: { normal: 0, hard: 0 },
    acid: { normal: 0, hard: 0 },
    race: { normal: 0, hard: 0 }
  },

  bomb: {
    round: 1,
    maxRounds: 5,
    fuseSeconds: 10,
    currentHolder: 0, // 0: Player, 1: Npc1, 2: Npc2, 3: Npc3
    scores: [0, 0, 0, 0],
    timerInterval: null,
    npcTimeout: null,
    active: false
  },

  acid: {
    timerSeconds: 60,
    playerScore: 0,
    npcScore: 0,
    combo: 0,
    words: [],
    spawnInterval: null,
    gameTimerInterval: null,
    npcInterval: null,
    animationFrameId: null,
    isFrozen: false,
    freezeTimeout: null,
    isDouble: false,
    doubleTimeout: null,
    active: false
  },

  race: {
    lap: 1,
    maxLaps: 3,
    playerProgress: 0,
    npcProgress: 0,
    playerScore: 0,
    npcScore: 0,
    npcInterval: null,
    targetWords: [],
    assembledWords: [],
    active: false
  },

  init() {
    this.loadHighScores();
    this.bindEvents();
    this.updateScoreUI();
  },

  loadHighScores() {
    try {
      const saved = localStorage.getItem('MEMORY_GOD_MINIGAME_SCORES');
      if (saved) {
        this.highScores = Object.assign(this.highScores, JSON.parse(saved));
      }
    } catch (e) {
      console.warn('MiniGameEngine loadHighScores error:', e);
    }
  },

  saveHighScores() {
    try {
      localStorage.setItem('MEMORY_GOD_MINIGAME_SCORES', JSON.stringify(this.highScores));
    } catch (e) {
      console.warn('MiniGameEngine saveHighScores error:', e);
    }
  },

  bindEvents() {
    // 게임 탭 전환
    document.querySelectorAll('.arcade-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const game = btn.dataset.game;
        this.switchGame(game);
      });
    });

    // 난이도 토글
    document.querySelectorAll('.btn-diff').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-diff').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setDifficulty(btn.dataset.diff);
      });
    });

    // 산성비 단어 전송
    const acidInput = document.getElementById('acidInput');
    const btnAcidSubmit = document.getElementById('btnAcidSubmit');
    if (acidInput && btnAcidSubmit) {
      acidInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.submitAcidWord();
        }
      });
      btnAcidSubmit.addEventListener('click', () => this.submitAcidWord());
    }

    // 결과 모달 버튼
    const btnRestart = document.getElementById('btnRestartMiniGame');
    const btnSwitch = document.getElementById('btnSwitchMiniGame');
    if (btnRestart) {
      btnRestart.addEventListener('click', () => {
        document.getElementById('minigameResultOverlay').classList.add('hidden');
        this.start(this.activeGame);
      });
    }
    if (btnSwitch) {
      btnSwitch.addEventListener('click', () => {
        document.getElementById('minigameResultOverlay').classList.add('hidden');
        const games = ['bomb', 'acid', 'race'];
        const nextGame = games[(games.indexOf(this.activeGame) + 1) % games.length];
        this.switchGame(nextGame);
      });
    }

    // 키보드 숫자 1~4 단축키 (폭탄 게임 4지선다용)
    window.addEventListener('keydown', (e) => {
      if (!this.bomb.active || this.bomb.currentHolder !== 0) return;
      if (e.key >= '1' && e.key <= '4') {
        const idx = parseInt(e.key, 10) - 1;
        const btns = document.querySelectorAll('.btn-bomb-option');
        if (btns[idx]) btns[idx].click();
      }
    });
  },

  getPracticeSentences() {
    const cur = Store.getCurrentText();
    if (cur && cur.sentences && cur.sentences.length > 0) {
      return cur.sentences;
    }
    return [
      '인생은 속도가 아니라 올바른 방향이다.',
      '시작이 반이고 꾸준함이 기적을 만든다.',
      '지혜로운 자는 남의 실수에서 배운다.',
      '오늘 걷지 않으면 내일은 뛰어야 한다.',
      '가장 어두운 밤도 언젠가 아침을 맞이한다.',
      '꿈을 날짜와 함께 적어놓으면 목표가 된다.',
      '지식은 배울수록 겸손해지고 지혜로워진다.'
    ];
  },

  getAllWords() {
    const sentences = this.getPracticeSentences();
    const words = [];
    sentences.forEach(s => {
      s.split(/\s+/).forEach(w => {
        const cleaned = w.replace(/['"`.,~!?]/g, '').trim();
        if (cleaned.length > 0 && !words.includes(cleaned)) {
          words.push(cleaned);
        }
      });
    });
    return words.length > 0 ? words : ['열정', '도전', '성취', '희망', '노력', '성공', '행복', '지혜'];
  },

  setDifficulty(diff) {
    this.difficulty = diff;
    this.updateScoreUI();
    this.start(this.activeGame);
  },

  switchGame(gameKey) {
    this.stopAll();
    this.activeGame = gameKey;
    document.querySelectorAll('.arcade-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.game === gameKey);
    });
    document.querySelectorAll('.arcade-arena').forEach(arena => arena.classList.add('hidden'));

    if (gameKey === 'bomb') document.getElementById('arenaBomb').classList.remove('hidden');
    else if (gameKey === 'acid') document.getElementById('arenaAcid').classList.remove('hidden');
    else if (gameKey === 'race') document.getElementById('arenaRace').classList.remove('hidden');

    this.updateScoreUI();
    this.start(gameKey);
  },

  updateScoreUI() {
    const high = (this.highScores[this.activeGame] && this.highScores[this.activeGame][this.difficulty]) || 0;
    const elHigh = document.getElementById('arcadeHighScore');
    const elCur = document.getElementById('arcadeCurrentScore');
    if (elHigh) elHigh.textContent = high.toLocaleString();
    if (elCur) elCur.textContent = this.score.toLocaleString();
  },

  addScore(pts) {
    this.score += pts;
    const high = (this.highScores[this.activeGame] && this.highScores[this.activeGame][this.difficulty]) || 0;
    if (this.score > high) {
      this.highScores[this.activeGame][this.difficulty] = this.score;
      this.saveHighScores();
    }
    this.updateScoreUI();
  },

  start(gameKey) {
    this.stopAll();
    this.score = 0;
    this.combo = 0;
    this.updateScoreUI();
    const overlay = document.getElementById('minigameResultOverlay');
    if (overlay) overlay.classList.add('hidden');

    if (gameKey === 'bomb') this.startBombGame();
    else if (gameKey === 'acid') this.startAcidGame();
    else if (gameKey === 'race') this.startRaceGame();
  },

  stopAll() {
    // 폭탄 타이머 정리
    clearInterval(this.bomb.timerInterval);
    clearTimeout(this.bomb.npcTimeout);
    this.bomb.active = false;

    // 산성비 타이머 정리
    clearInterval(this.acid.spawnInterval);
    clearInterval(this.acid.gameTimerInterval);
    clearTimeout(this.acid.npcInterval);
    clearInterval(this.acid.npcInterval);
    if (this.acid.animationFrameId) cancelAnimationFrame(this.acid.animationFrameId);
    clearTimeout(this.acid.freezeTimeout);
    clearTimeout(this.acid.doubleTimeout);
    this.acid.active = false;
    this.acid.words = [];
    const sky = document.getElementById('acidSkyScreen');
    if (sky) sky.innerHTML = '';

    // 레이싱 타이머 정리
    clearInterval(this.race.npcInterval);
    this.race.active = false;
  },

  // --------------------------------------------------------------------------
  // GAME 1: 💣 끄투식 폭탄 릴레이
  // --------------------------------------------------------------------------
  startBombGame() {
    this.bomb.active = true;
    this.bomb.round = 1;
    this.bomb.maxRounds = 5;
    this.bomb.scores = [0, 0, 0, 0];
    this.startBombRound();
  },

  startBombRound() {
    if (!this.bomb.active) return;
    clearInterval(this.bomb.timerInterval);
    clearTimeout(this.bomb.npcTimeout);

    const roundBadge = document.getElementById('bombRoundBadge');
    if (roundBadge) roundBadge.textContent = `ROUND ${this.bomb.round} / ${this.bomb.maxRounds}`;

    this.renderBombScores();
    this.passBombTo(0); // 내 차례부터 시작
  },

  renderBombScores() {
    const s0 = document.getElementById('scorePlayer');
    const s1 = document.getElementById('scoreNpc1');
    const s2 = document.getElementById('scoreNpc2');
    const s3 = document.getElementById('scoreNpc3');
    if (s0) s0.textContent = `${this.bomb.scores[0]}점`;
    if (s1) s1.textContent = `${this.bomb.scores[1]}점`;
    if (s2) s2.textContent = `${this.bomb.scores[2]}점`;
    if (s3) s3.textContent = `${this.bomb.scores[3]}점`;

    const comboTag = document.getElementById('playerBombCombo');
    if (comboTag) comboTag.textContent = `${this.combo} COMBO`;
  },

  passBombTo(holderIdx) {
    if (!this.bomb.active) return;
    clearInterval(this.bomb.timerInterval);
    clearTimeout(this.bomb.npcTimeout);

    this.bomb.currentHolder = holderIdx;
    this.bomb.fuseSeconds = this.difficulty === 'hard' ? 6 : 10;

    // 시각적 턴 표시
    const slots = [
      document.getElementById('slotPlayer'),
      document.getElementById('slotNpc1'),
      document.getElementById('slotNpc2'),
      document.getElementById('slotNpc3')
    ];
    slots.forEach((s, idx) => {
      if (s) s.classList.toggle('active-turn', idx === holderIdx);
    });

    ['bubbleNpc1', 'bubbleNpc2', 'bubbleNpc3'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    SoundFX.playWordCheck();
    VisualFX.spawnHit(window.innerWidth / 2, window.innerHeight * 0.45, 6);

    const fuseTimerEl = document.getElementById('bombFuseTimer');
    if (fuseTimerEl) fuseTimerEl.textContent = `${this.bomb.fuseSeconds}s`;

    // 째깍째깍 초침 카운트다운
    this.bomb.timerInterval = setInterval(() => {
      this.bomb.fuseSeconds--;
      if (fuseTimerEl) fuseTimerEl.textContent = `${this.bomb.fuseSeconds}s`;

      if (this.bomb.fuseSeconds <= 0) {
        clearInterval(this.bomb.timerInterval);
        this.explodeBomb(this.bomb.currentHolder);
      }
    }, 1000);

    if (holderIdx === 0) {
      // 내 턴: 문제 출제
      this.presentBombQuestion();
    } else {
      // NPC 턴: AI 반응
      const qPrompt = document.getElementById('bombPromptSentence');
      const qGrid = document.getElementById('bombOptionsGrid');
      if (qPrompt) qPrompt.innerHTML = `🤖 NPC가 폭탄을 쥐고 암기 단어를 생각 중입니다...`;
      if (qGrid) qGrid.innerHTML = '';

      const bubbleId = holderIdx === 1 ? 'bubbleNpc1' : (holderIdx === 2 ? 'bubbleNpc2' : 'bubbleNpc3');
      const bubbleEl = document.getElementById(bubbleId);
      if (bubbleEl) {
        bubbleEl.classList.remove('hidden');
        bubbleEl.textContent = '💭 생각 중...';
      }

      const npcDelay = this.difficulty === 'hard' 
        ? (1000 + Math.random() * 800)
        : (2000 + Math.random() * 1400);

      const passProbability = this.difficulty === 'hard' ? 0.90 : 0.75;

      this.bomb.npcTimeout = setTimeout(() => {
        if (!this.bomb.active) return;
        if (Math.random() < passProbability) {
          if (bubbleEl) bubbleEl.textContent = '💬 정답! 패스~!';
          this.bomb.scores[holderIdx] += 100;
          this.renderBombScores();
          // 다른 사람에게 패스 (나를 포함)
          const nextHolders = [0, 1, 2, 3].filter(i => i !== holderIdx);
          const next = nextHolders[Math.floor(Math.random() * nextHolders.length)];
          setTimeout(() => this.passBombTo(next), 500);
        } else {
          // NPC 실수로 폭발
          if (bubbleEl) bubbleEl.textContent = '💥 으악 틀렸다!!';
          clearInterval(this.bomb.timerInterval);
          this.explodeBomb(holderIdx);
        }
      }, npcDelay);
    }
  },

  presentBombQuestion() {
    const sentences = this.getPracticeSentences();
    const sentence = sentences[Math.floor(Math.random() * sentences.length)];
    const words = sentence.split(/\s+/).filter(w => w.length > 0);
    const targetIdx = Math.floor(Math.random() * words.length);
    const targetWord = words[targetIdx].replace(/['"`.,~!?]/g, '');

    const promptHtml = words.map((w, idx) => {
      if (idx === targetIdx) return `<span class="blank-highlight">[ ? ]</span>`;
      return App.escapeHtml(w);
    }).join(' ');

    document.getElementById('bombPromptSentence').innerHTML = promptHtml;

    // 보기 4개 (1개 정답 + 3개 오답 단어)
    const allWords = this.getAllWords().filter(w => w !== targetWord);
    for (let i = allWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allWords[i], allWords[j]] = [allWords[j], allWords[i]];
    }
    const distractors = allWords.slice(0, 3);
    const options = [targetWord, ...distractors];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    const grid = document.getElementById('bombOptionsGrid');
    grid.innerHTML = options.map((opt, i) => `
      <button class="btn-bomb-option" data-ans="${App.escapeHtml(opt)}" data-correct="${opt === targetWord}">
        <span class="opt-key-tag">[${i + 1}]</span>
        <span>${App.escapeHtml(opt)}</span>
      </button>
    `).join('');

    grid.querySelectorAll('.btn-bomb-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.bomb.currentHolder !== 0) return;
        const isCorrect = btn.dataset.correct === 'true';
        if (isCorrect) {
          clearInterval(this.bomb.timerInterval);
          SoundFX.playWordCheck();
          VisualFX.spawnBurst(btn.getBoundingClientRect().left + 40, btn.getBoundingClientRect().top + 10, 10);
          this.combo++;
          const pts = Math.round(150 * (this.combo >= 2 ? 1.5 : 1));
          this.bomb.scores[0] += pts;
          this.addScore(pts);
          this.renderBombScores();

          // NPC에게 패스
          const npcs = [1, 2, 3];
          const next = npcs[Math.floor(Math.random() * npcs.length)];
          this.passBombTo(next);
        } else {
          SoundFX.playErrorThud();
          VisualFX.shake('error');
          clearInterval(this.bomb.timerInterval);
          this.explodeBomb(0);
        }
      });
    });
  },

  explodeBomb(victimIdx) {
    if (!this.bomb.active) return;
    clearInterval(this.bomb.timerInterval);
    clearTimeout(this.bomb.npcTimeout);

    SoundFX.playErrorThud();
    VisualFX.shake('error');
    VisualFX.spawnBurst(window.innerWidth / 2, window.innerHeight * 0.45, 40);

    const victimNames = ['나 (Player)', '냥냥박사', '알파독', '고스트'];
    const victimSlot = [
      document.getElementById('slotPlayer'),
      document.getElementById('slotNpc1'),
      document.getElementById('slotNpc2'),
      document.getElementById('slotNpc3')
    ][victimIdx];

    if (victimSlot) {
      victimSlot.classList.add('shake-error');
      setTimeout(() => victimSlot.classList.remove('shake-error'), 600);
    }

    // 감점 ("안죽게" 계속 진행)
    this.bomb.scores[victimIdx] = Math.max(0, this.bomb.scores[victimIdx] - 80);
    if (victimIdx === 0) {
      this.combo = 0;
    }
    this.renderBombScores();

    document.getElementById('bombPromptSentence').innerHTML = `
      💥 <strong style="color:#ef4444">${victimNames[victimIdx]}</strong>의 자리에서 폭탄이 터졌습니다! (-80점)
    `;
    document.getElementById('bombOptionsGrid').innerHTML = '';

    setTimeout(() => {
      if (!this.bomb.active) return;
      this.bomb.round++;
      if (this.bomb.round > this.bomb.maxRounds) {
        this.finishMiniGame('bomb');
      } else {
        this.startBombRound();
      }
    }, 1800);
  },

  // --------------------------------------------------------------------------
  // GAME 2: 🌧️ 산성비 단어 디펜스
  // --------------------------------------------------------------------------
  startAcidGame() {
    this.acid.active = true;
    this.acid.timerSeconds = 60;
    this.acid.playerScore = 0;
    this.acid.npcScore = 0;
    this.acid.combo = 0;
    this.acid.words = [];
    this.acid.isFrozen = false;
    this.acid.isDouble = false;

    const sky = document.getElementById('acidSkyScreen');
    if (sky) sky.innerHTML = '';

    this.updateAcidScoreUI();
    const input = document.getElementById('acidInput');
    if (input) {
      input.value = '';
      input.focus();
    }

    // 60초 게임 타이머
    this.acid.gameTimerInterval = setInterval(() => {
      this.acid.timerSeconds--;
      const timerEl = document.getElementById('acidTimerText');
      if (timerEl) timerEl.textContent = `${this.acid.timerSeconds}s`;

      if (this.acid.timerSeconds <= 0) {
        this.stopAll();
        this.finishMiniGame('acid');
      }
    }, 1000);

    // 단어 생성 주기 (화면에 5개 미만일 때만 생성)
    const spawnRate = this.difficulty === 'hard' ? 1300 : 1800;
    this.acid.spawnInterval = setInterval(() => {
      if (!this.acid.active || this.acid.isFrozen) return;
      if (this.acid.words.length < 5) {
        this.spawnAcidWord();
      }
    }, spawnRate);

    // 시작 시 초기 단어 순차 스폰
    setTimeout(() => {
      if (this.acid.active) {
        this.spawnAcidWord();
        setTimeout(() => { if (this.acid.active) this.spawnAcidWord(); }, 800);
      }
    }, 300);

    // NPC 요격 루프 (화면 35% 이상 내려온 단어만 1.2초 조준 후 요격)
    const scheduleNpcShot = () => {
      if (!this.acid.active) return;
      const delay = this.difficulty === 'hard' 
        ? (2500 + Math.random() * 1200) 
        : (3800 + Math.random() * 1600);

      this.acid.npcInterval = setTimeout(() => {
        if (!this.acid.active || this.acid.isFrozen) {
          scheduleNpcShot();
          return;
        }
        this.npcInterceptAcidWord();
        scheduleNpcShot();
      }, delay);
    };
    scheduleNpcShot();

    // 부드러운 낙하 루프
    const speed = this.difficulty === 'hard' ? 0.95 : 0.65;
    const animateFall = () => {
      if (!this.acid.active) return;

      if (!this.acid.isFrozen) {
        const skyHeight = sky && sky.clientHeight > 100 ? sky.clientHeight : 310;

        for (let i = this.acid.words.length - 1; i >= 0; i--) {
          const item = this.acid.words[i];
          item.y += speed;
          if (item.el) {
            item.el.style.top = `${item.y}px`;
          }

          // 바닥 도달 검사 (반드시 60px 이상 떨어졌고, 바닥 쉴드에 도달했을 때만 흡수)
          if (item.y > 60 && item.y >= skyHeight - 34) {
            if (item.el) item.el.remove();
            this.acid.words.splice(i, 1);
            this.acid.playerScore = Math.max(0, this.acid.playerScore - 15);
            this.acid.combo = 0;
            this.updateAcidScoreUI();
            VisualFX.spawnHit(window.innerWidth / 2, window.innerHeight * 0.7, 4);
          }
        }
      }

      this.acid.animationFrameId = requestAnimationFrame(animateFall);
    };

    this.acid.animationFrameId = requestAnimationFrame(animateFall);
  },

  spawnAcidWord() {
    const sky = document.getElementById('acidSkyScreen');
    if (!sky) return;

    const allWords = this.getAllWords();
    const wordText = allWords[Math.floor(Math.random() * allWords.length)];

    // 15% 확률로 특수 파워업
    const rand = Math.random();
    let powerType = null;
    let displayText = wordText;
    if (rand < 0.05) {
      powerType = 'freeze';
      displayText = `❄️ ${wordText}`;
    } else if (rand < 0.10) {
      powerType = 'nuke';
      displayText = `💣 ${wordText}`;
    } else if (rand < 0.15) {
      powerType = 'double';
      displayText = `✨ ${wordText}`;
    }

    const wordEl = document.createElement('div');
    wordEl.className = 'acid-word-drop';
    if (powerType) wordEl.classList.add(`powerup-${powerType}`);
    wordEl.textContent = displayText;

    const xPos = 12 + Math.random() * 76;
    wordEl.style.left = `${xPos}%`;
    wordEl.style.top = `0px`;

    sky.appendChild(wordEl);

    this.acid.words.push({
      text: wordText,
      powerType,
      el: wordEl,
      y: 0,
      isTargeted: false
    });
  },

  submitAcidWord() {
    const input = document.getElementById('acidInput');
    if (!input) return;
    const typed = input.value.trim().toLowerCase();
    if (!typed) return;

    const cleanTyped = Store.settings.punctFlexible ? typed.replace(/[^\w가-힣]/g, '') : typed;

    const matchIdx = this.acid.words.findIndex(w => {
      const cleanW = Store.settings.punctFlexible 
        ? w.text.replace(/[^\w가-힣]/g, '').toLowerCase() 
        : w.text.toLowerCase();
      return cleanW === cleanTyped || cleanW === typed;
    });

    if (matchIdx >= 0) {
      const matched = this.acid.words[matchIdx];
      const rect = matched.el.getBoundingClientRect();
      VisualFX.spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
      SoundFX.playWordCheck();

      matched.el.remove();
      this.acid.words.splice(matchIdx, 1);

      this.acid.combo++;
      const multiplier = (this.acid.isDouble ? 2 : 1) * (this.acid.combo >= 3 ? 1.5 : 1);
      const earned = Math.round(100 * multiplier);
      this.acid.playerScore += earned;
      this.addScore(earned);

      if (matched.powerType === 'freeze') {
        this.acid.isFrozen = true;
        SoundFX.playFanfare();
        clearTimeout(this.acid.freezeTimeout);
        this.acid.freezeTimeout = setTimeout(() => {
          this.acid.isFrozen = false;
        }, 4000);
      } else if (matched.powerType === 'nuke') {
        SoundFX.playFanfare();
        VisualFX.spawnBurst(window.innerWidth / 2, window.innerHeight * 0.45, 50);
        this.acid.words.forEach(w => w.el.remove());
        const nukeBonus = this.acid.words.length * 80;
        this.acid.playerScore += nukeBonus;
        this.addScore(nukeBonus);
        this.acid.words = [];
      } else if (matched.powerType === 'double') {
        this.acid.isDouble = true;
        clearTimeout(this.acid.doubleTimeout);
        this.acid.doubleTimeout = setTimeout(() => {
          this.acid.isDouble = false;
        }, 8000);
      }

      this.updateAcidScoreUI();
      input.value = '';
    } else {
      SoundFX.playErrorThud();
      input.classList.add('shake-error');
      setTimeout(() => input.classList.remove('shake-error'), 400);
    }
  },

  npcInterceptAcidWord() {
    if (this.acid.words.length === 0) return;
    const sky = document.getElementById('acidSkyScreen');
    const skyHeight = sky && sky.clientHeight > 100 ? sky.clientHeight : 310;

    // 화면 35% 이상 내려온 단어 중에서만 조준 (새로 생성된 단어는 건드리지 않음)
    const eligible = this.acid.words.filter(w => w.y > skyHeight * 0.35 && !w.isTargeted);
    if (eligible.length === 0) return;

    const target = eligible[Math.floor(Math.random() * eligible.length)];
    target.isTargeted = true;
    if (target.el) {
      target.el.classList.add('npc-targeting');
      target.el.setAttribute('title', '🤖 NPC가 조준 중! 먼저 입력해 가로채세요!');
    }

    // 1.2초간 조준 예고 후 요격 (그 사이에 플레이어가 먼저 치면 가로채기 성공!)
    setTimeout(() => {
      if (!this.acid.active) return;
      const curIdx = this.acid.words.indexOf(target);
      if (curIdx >= 0) {
        const rect = target.el.getBoundingClientRect();
        VisualFX.spawnHit(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);

        target.el.remove();
        this.acid.words.splice(curIdx, 1);
        this.acid.npcScore += 80;
        this.updateAcidScoreUI();
      }
    }, 1200);
  },

  updateAcidScoreUI() {
    const pScoreEl = document.getElementById('acidPlayerScore');
    const nScoreEl = document.getElementById('acidNpcScore');
    const comboEl = document.getElementById('acidPlayerCombo');
    if (pScoreEl) pScoreEl.textContent = this.acid.playerScore.toLocaleString();
    if (nScoreEl) nScoreEl.textContent = this.acid.npcScore.toLocaleString();
    if (comboEl) comboEl.textContent = `${this.acid.combo} COMBO`;
  },

  // --------------------------------------------------------------------------
  // GAME 3: 🏎️ 문장 질주 1:1 레이싱
  // --------------------------------------------------------------------------
  startRaceGame() {
    this.race.active = true;
    this.race.lap = 1;
    this.race.maxLaps = 3;
    this.race.playerScore = 0;
    this.race.npcScore = 0;
    this.startRaceLap();
  },

  startRaceLap() {
    if (!this.race.active) return;
    clearInterval(this.race.npcInterval);

    this.race.playerProgress = 0;
    this.race.npcProgress = 0;
    this.updateRaceCars();

    const lapBadge = document.getElementById('raceLapBadge');
    if (lapBadge) lapBadge.textContent = `LAP ${this.race.lap} / ${this.race.maxLaps}`;

    const pScore = document.getElementById('racePlayerScore');
    const nScore = document.getElementById('raceNpcScore');
    if (pScore) pScore.textContent = `${this.race.playerScore}점`;
    if (nScore) nScore.textContent = `${this.race.npcScore}점`;

    const sentences = this.getPracticeSentences();
    const sentence = sentences[(this.race.lap - 1) % sentences.length];
    this.race.currentSentence = sentence;
    this.race.targetWords = sentence.split(/\s+/).filter(w => w.length > 0);
    this.race.assembledWords = [];

    const progressBox = document.getElementById('raceSentenceProgress');
    if (progressBox) progressBox.innerHTML = '';

    const shuffled = [...this.race.targetWords];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const choicesGrid = document.getElementById('raceWordChoices');
    if (choicesGrid) {
      choicesGrid.innerHTML = shuffled.map((w, idx) => `
        <button class="btn-race-word" data-word="${App.escapeHtml(w)}">
          ${App.escapeHtml(w)}
        </button>
      `).join('');

      choicesGrid.querySelectorAll('.btn-race-word').forEach(btn => {
        btn.addEventListener('click', () => {
          this.handleRaceWordClick(btn);
        });
      });
    }

    // NPC 주행
    const npcIntervalMs = this.difficulty === 'hard' ? 420 : 700;
    const stepPct = 100 / Math.max(3, this.race.targetWords.length * 2.2);

    this.race.npcInterval = setInterval(() => {
      if (!this.race.active) return;
      this.race.npcProgress = Math.min(100, this.race.npcProgress + stepPct);
      this.updateRaceCars();

      if (this.race.npcProgress >= 100) {
        clearInterval(this.race.npcInterval);
        this.race.npcScore += 150;
        this.endRaceLap(false);
      }
    }, npcIntervalMs);
  },

  handleRaceWordClick(btn) {
    if (!this.race.active) return;
    const word = btn.dataset.word;
    const expected = this.race.targetWords[this.race.assembledWords.length];

    if (word === expected) {
      btn.remove();
      this.race.assembledWords.push(word);
      SoundFX.playWordCheck();
      VisualFX.spawnHit(btn.getBoundingClientRect().left + 30, btn.getBoundingClientRect().top + 10, 6);

      const progressBox = document.getElementById('raceSentenceProgress');
      if (progressBox) {
        const chip = document.createElement('span');
        chip.className = 'race-completed-chip';
        chip.textContent = word;
        progressBox.appendChild(chip);
      }

      this.race.playerProgress = (this.race.assembledWords.length / this.race.targetWords.length) * 100;
      this.updateRaceCars();

      if (this.race.playerProgress >= 100) {
        clearInterval(this.race.npcInterval);
        this.race.playerScore += 300;
        this.addScore(300);
        this.endRaceLap(true);
      }
    } else {
      SoundFX.playErrorThud();
      btn.classList.add('shake-error');
      setTimeout(() => btn.classList.remove('shake-error'), 400);
    }
  },

  updateRaceCars() {
    const pCar = document.getElementById('playerCar');
    const pFill = document.getElementById('playerTrackFill');
    const nCar = document.getElementById('npcCar');
    const nFill = document.getElementById('npcTrackFill');

    const maxTravel = 85;
    const pPos = 10 + (this.race.playerProgress / 100) * maxTravel;
    const nPos = 10 + (this.race.npcProgress / 100) * maxTravel;

    if (pCar) pCar.style.left = `${Math.min(92, pPos)}%`;
    if (pFill) pFill.style.width = `${this.race.playerProgress}%`;
    if (nCar) nCar.style.left = `${Math.min(92, nPos)}%`;
    if (nFill) nFill.style.width = `${this.race.npcProgress}%`;
  },

  endRaceLap(playerWon) {
    if (!this.race.active) return;
    clearInterval(this.race.npcInterval);

    if (playerWon) {
      SoundFX.playFanfare();
      VisualFX.spawnBurst(window.innerWidth / 2, window.innerHeight * 0.4, 30);
    } else {
      SoundFX.playErrorThud();
    }

    setTimeout(() => {
      if (!this.race.active) return;
      this.race.lap++;
      if (this.race.lap > this.race.maxLaps) {
        this.finishMiniGame('race');
      } else {
        this.startRaceLap();
      }
    }, 1400);
  },

  // --------------------------------------------------------------------------
  // 공통 결과 창
  // --------------------------------------------------------------------------
  finishMiniGame(gameKey) {
    this.stopAll();
    SoundFX.playFanfare();
    VisualFX.spawnBurst(window.innerWidth / 2, window.innerHeight * 0.4, 60);

    const overlay = document.getElementById('minigameResultOverlay');
    const trophy = document.getElementById('resultTrophyIcon');
    const title = document.getElementById('resultTitleText');
    const sub = document.getElementById('resultSubText');
    const board = document.getElementById('resultStatsBoard');

    if (overlay) overlay.classList.remove('hidden');

    const high = (this.highScores[gameKey] && this.highScores[gameKey][this.difficulty]) || 0;
    const isNewRecord = this.score > 0 && this.score >= high;

    if (isNewRecord) {
      if (trophy) trophy.textContent = '🌟';
      if (title) title.textContent = '🎉 신기록 달성!';
      if (sub) sub.innerHTML = `대단합니다! <strong style="color:var(--accent-gold)">${this.score}점</strong>으로 최고 기록을 갱신했습니다!`;
    } else {
      if (trophy) trophy.textContent = '🏆';
      if (title) title.textContent = '게임 종료!';
      if (sub) sub.innerHTML = `총 획득 점수: <strong style="color:var(--accent-cyan)">${this.score}점</strong> (최고 기록: ${high}점)`;
    }

    let boardHtml = '';
    if (gameKey === 'bomb') {
      const players = [
        { name: '나 (Player)', score: this.bomb.scores[0], isPlayer: true },
        { name: '냥냥박사', score: this.bomb.scores[1], isPlayer: false },
        { name: '알파독', score: this.bomb.scores[2], isPlayer: false },
        { name: '고스트', score: this.bomb.scores[3], isPlayer: false }
      ].sort((a, b) => b.score - a.score);

      const medals = ['🥇 1위', '🥈 2위', '🥉 3위', '4위'];
      boardHtml = players.map((p, i) => `
        <div class="result-rank-row ${p.isPlayer ? 'is-player' : ''}">
          <span><span class="rank-medal">${medals[i]}</span>${p.name}</span>
          <strong>${p.score}점</strong>
        </div>
      `).join('');
    } else if (gameKey === 'acid') {
      const pWon = this.acid.playerScore >= this.acid.npcScore;
      boardHtml = `
        <div class="result-rank-row ${pWon ? 'is-player' : ''}">
          <span><span class="rank-medal">${pWon ? '🥇 승리' : '🥈 준우승'}</span>나 (Player)</span>
          <strong>${this.acid.playerScore}점</strong>
        </div>
        <div class="result-rank-row ${!pWon ? 'is-player' : ''}">
          <span><span class="rank-medal">${!pWon ? '🥇 승리' : '🥈 준우승'}</span>사이버 라이벌 (NPC)</span>
          <strong>${this.acid.npcScore}점</strong>
        </div>
      `;
    } else if (gameKey === 'race') {
      const pWon = this.race.playerScore >= this.race.npcScore;
      boardHtml = `
        <div class="result-rank-row ${pWon ? 'is-player' : ''}">
          <span><span class="rank-medal">${pWon ? '🥇 우승' : '🥈 준우승'}</span>나 (Player)</span>
          <strong>${this.race.playerScore}점</strong>
        </div>
        <div class="result-rank-row ${!pWon ? 'is-player' : ''}">
          <span><span class="rank-medal">${!pWon ? '🥇 우승' : '🥈 준우승'}</span>터보봇 (AI)</span>
          <strong>${this.race.npcScore}점</strong>
        </div>
      `;
    }

    if (board) board.innerHTML = boardHtml;
  }
};


// ============================================================================
// 6. 메인 애플리케이션 코어 컨트롤러 (App)
// ============================================================================
const App = {
  currentMode: 1, // 1~6, 'drill'
  currentIndex: 0,
  revealed: false,
  combo: 0,
  sidebarFilter: 'all',
  isTransitioning: false, // 문장 중복 건너뛰기 방지 락

  // STAGE 1.5: 슬라이더 가림막 상태
  stage15State: {
    lines: [],
    passed: []
  },

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

  // STAGE 6: 말로 외우기 AI 음성 코치 상태
  stage6VoiceState: {
    isListening: false,
    timerId: null
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
    MiniGameEngine.init();

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
        if (mode === 'minigame') {
          this.setMode('minigame');
        } else {
          this.setMode(mode === 'drill' ? 'drill' : (mode === '1.5' ? '1.5' : parseInt(mode, 10)));
        }
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
        curText.stepProgress = { '1': {}, '1.5': {}, '2': {}, '3': {}, '4': {}, '5': {}, '6': {}, 'drill': {} };
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
      const stages = [1, '1.5', 2, 3, 4, 5, 'drill'];
      const curIdx = stages.findIndex(s => String(s) === String(this.currentMode));
      if (curIdx >= 0 && curIdx < stages.length - 1) {
        this.setMode(stages[curIdx + 1]);
        this.currentIndex = 0;
        this.renderCardContent();
      }
    });

    this.bindModalEvents();
  },

  bindModalEvents() {
    // 🎙️ 상단 헤더 '말로 외우기' 버튼
    const btnOpenVoice = document.getElementById('btnOpenVoiceCoachModal');
    if (btnOpenVoice) {
      btnOpenVoice.addEventListener('click', () => {
        this.openVoiceCoachModal();
      });
    }

    // 🎮 상단 헤더 '미니게임' 버튼
    const btnOpenMinigame = document.getElementById('btnOpenMinigame');
    if (btnOpenMinigame) {
      btnOpenMinigame.addEventListener('click', () => {
        if (this.currentMode === 'minigame') {
          this.setMode(this.previousLearningMode || 1);
        } else {
          this.setMode('minigame');
        }
      });
    }

    // 미니게임 화면 내 '학습으로 복귀' 버튼
    const btnExitMinigame = document.getElementById('btnExitMinigame');
    if (btnExitMinigame) {
      btnExitMinigame.addEventListener('click', () => {
        this.setMode(this.previousLearningMode || 1);
      });
    }

    // 모달 내부 컨트롤
    const btnVcPrev = document.getElementById('btnVcPrev');
    if (btnVcPrev) btnVcPrev.addEventListener('click', () => this.voiceCoachModalPrev());

    const btnVcNext = document.getElementById('btnVcNext');
    if (btnVcNext) btnVcNext.addEventListener('click', () => this.voiceCoachModalNext());

    const btnVcToggleMask = document.getElementById('btnVcToggleMask');
    if (btnVcToggleMask) btnVcToggleMask.addEventListener('click', () => this.toggleVoiceCoachModalMask());

    const btnVcMicToggle = document.getElementById('btnVcMicToggle');
    if (btnVcMicToggle) btnVcMicToggle.addEventListener('click', () => this.toggleVoiceCoachModalMic());

    const btnVcMarkPassed = document.getElementById('btnVcMarkPassed');
    if (btnVcMarkPassed) btnVcMarkPassed.addEventListener('click', () => this.markVoiceCoachPassed());

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
        const modalEl = document.getElementById(modalId);
        if (modalEl) modalEl.classList.add('hidden');

        // 음성 코치 모달 닫힐 때 음성 및 마이크 즉시 정지
        if (modalId === 'modalVoiceCoach') {
          SpeechEngine.stopSpeak();
          SpeechEngine.stopListen();
          const micBtn = document.getElementById('btnVcMicToggle');
          if (micBtn) micBtn.classList.remove('recording');
        }
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
        stepProgress: { '1': {}, '1.5': {}, '2': {}, '3': {}, '4': {}, '5': {}, '6': {}, 'drill': {} },
        weakList: []
      };

      Store.addNewText(newText);
      this.renderTextSelectOptions();
      this.loadText(newText.id);
      document.getElementById('modalAddText').classList.add('hidden');
      SoundFX.playSentenceMastered();
    });

    // TXT 파일 불러오기 & 저장 이벤트
    document.getElementById('btnExportTxt').addEventListener('click', () => this.exportTextAsTxt());
    document.getElementById('btnImportTxt').addEventListener('click', () => document.getElementById('importTxtInput').click());
    document.getElementById('btnExportTxtFromModal').addEventListener('click', () => this.exportTextAsTxt());
    document.getElementById('btnImportTxtFromModal').addEventListener('click', () => document.getElementById('importTxtInput').click());
    document.getElementById('importTxtInput').addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this.importTextFromTxtFile(e.target.files[0]);
      }
      e.target.value = '';
    });

    // 지문 내용 수정 저장 버튼
    document.getElementById('btnSaveEditedText').addEventListener('click', () => this.saveEditedText());

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
    if (!Store.data.texts || Store.data.texts.length === 0) {
      container.innerHTML = '<p class="empty-tip" style="padding:20px; text-align:center;">등록된 지문이 없습니다. 새 지문을 등록하거나 txt 파일을 불러와보세요!</p>';
      return;
    }
    container.innerHTML = Store.data.texts.map(text => `
      <div class="sentence-item" style="justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-right:8px;">
          <strong>${this.escapeHtml(text.title)}</strong>
          <span style="font-size: 0.8rem; color: var(--text-dim); margin-left: 8px;">(${text.sentences.length}문장 / ${text.category})</span>
        </div>
        <div style="display:flex; gap: 6px; flex-shrink:0;">
          <button class="btn btn-secondary btn-sm" onclick="App.loadText('${text.id}'); document.getElementById('modalManageText').classList.add('hidden');">열기</button>
          <button class="btn btn-secondary btn-sm" onclick="App.openEditTextModal('${text.id}')">✏️ 수정</button>
          <button class="btn btn-secondary btn-sm" onclick="App.exportTextAsTxt('${text.id}')">💾 .txt</button>
          <button class="btn btn-text-danger btn-sm" onclick="App.deleteText('${text.id}')">삭제</button>
        </div>
      </div>
    `).join('');
  },

  openEditTextModal(textId) {
    const text = Store.data.texts.find(t => t.id === textId);
    if (!text) return;
    document.getElementById('editTargetId').value = text.id;
    document.getElementById('editTitle').value = text.title;
    document.getElementById('editCategory').value = text.category || '';
    document.getElementById('editLanguage').value = text.language || 'ko-KR';
    document.getElementById('editContent').value = text.sentences.join('\n');
    document.getElementById('modalManageText').classList.add('hidden');
    document.getElementById('modalEditText').classList.remove('hidden');
  },

  saveEditedText() {
    const id = document.getElementById('editTargetId').value;
    const title = document.getElementById('editTitle').value.trim();
    const category = document.getElementById('editCategory').value.trim() || '일반';
    const language = document.getElementById('editLanguage').value;
    const content = document.getElementById('editContent').value.trim();

    if (!title || !content) {
      alert('지문 제목과 본문 내용을 모두 입력해주세요!');
      return;
    }

    const sentences = this.splitTextToSentences(content, 'smart');
    if (sentences.length === 0) {
      alert('분할된 유효 문장이 없습니다.');
      return;
    }

    Store.updateText(id, {
      title,
      category,
      language,
      sentences
    });

    document.getElementById('modalEditText').classList.add('hidden');
    this.renderTextSelectOptions();
    this.loadText(id);
    SoundFX.playWordCheck();
    alert(`🎉 "${title}" 지문이 성공적으로 수정 및 저장되었습니다!`);
  },

  exportTextAsTxt(textId) {
    const targetId = textId || Store.data.currentTextId;
    const text = Store.data.texts.find(t => t.id === targetId);
    if (!text) {
      alert('저장할 지문이 없습니다.');
      return;
    }
    const fullContent = text.sentences.join('\n\n');
    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeTitle = text.title.replace(/[\\/:*?"<>|]/g, '_');
    a.download = `${safeTitle}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    SoundFX.playWordCheck();
  },

  importTextFromTxtFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      if (!content || !content.trim()) {
        alert('선택한 텍스트 파일이 비어 있습니다.');
        return;
      }
      const title = file.name.replace(/\.[^/.]+$/, '');
      const sentences = this.splitTextToSentences(content, 'smart');
      if (sentences.length === 0) {
        alert('유효한 문장을 분할할 수 없습니다.');
        return;
      }
      const isKorean = /[가-힣]/.test(content);
      const language = isKorean ? 'ko-KR' : 'en-US';

      const newText = {
        id: 'user_' + Date.now(),
        title,
        category: '내 파일',
        language,
        description: `txt 파일에서 불러옴 (${sentences.length}개 문장)`,
        sentences,
        stepProgress: { '1': {}, '1.5': {}, '2': {}, '3': {}, '4': {}, '5': {}, '6': {}, 'drill': {} },
        weakList: []
      };

      Store.addNewText(newText);
      this.renderTextSelectOptions();
      this.loadText(newText.id);
      SoundFX.playSentenceMastered();
      alert(`🎉 "${title}" 지문 (${sentences.length}개 문장)을 성공적으로 불러왔습니다!`);
    };
    reader.readAsText(file, 'utf-8');
  },

  deleteText(id) {
    if (confirm('이 지문을 정말 삭제하시겠습니까?')) {
      Store.deleteText(id);
      this.renderManageModalList();
      this.renderTextSelectOptions();
      if (Store.data.currentTextId) {
        this.loadText(Store.data.currentTextId);
      } else {
        this.renderCardContent();
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
    if (!Store.data.texts || Store.data.texts.length === 0) {
      select.innerHTML = '<option value="">(등록된 지문 없음)</option>';
      return;
    }
    select.innerHTML = Store.data.texts.map(t => 
      `<option value="${t.id}" ${t.id === Store.data.currentTextId ? 'selected' : ''}>[${t.category}] ${t.title}</option>`
    ).join('');
  },

  loadText(textId) {
    this.stopTimer();
    if (!textId) {
      this.currentIndex = 0;
      this.renderCardContent();
      return;
    }
    Store.setCurrentTextId(textId);
    this.currentIndex = 0;
    this.revealed = false;
    this.combo = 0;
    this.updateComboUI();

    const curText = Store.getCurrentText();
    if (!curText) {
      this.renderCardContent();
      return;
    }
    curText.stepProgress = curText.stepProgress || { '1': {}, '1.5': {}, '2': {}, '3': {}, '4': {}, '5': {}, '6': {}, 'drill': {} };
    curText.weakList = curText.weakList || [];

    document.getElementById('textSelect').value = curText.id;
    this.updateMasteryUI();
    this.renderSentenceList();
    this.renderCardContent();
  },

  setMode(mode) {
    this.stopTimer();
    SpeechEngine.stopSpeak();
    SpeechEngine.stopListen();

    if (String(mode) === 'minigame') {
      if (this.currentMode && String(this.currentMode) !== 'minigame') {
        this.previousLearningMode = this.currentMode;
      }
    } else {
      this.previousLearningMode = mode;
    }

    this.currentMode = mode;
    this.revealed = false;

    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.toggle('active', String(tab.dataset.mode) === String(mode));
    });

    const btnOpenMinigame = document.getElementById('btnOpenMinigame');
    if (btnOpenMinigame) {
      btnOpenMinigame.classList.toggle('active', String(mode) === 'minigame');
    }

    const badgeMap = {
      '1': 'STAGE 1: 정독 & 뇌새김',
      '1.5': 'STAGE 1.5: 슬라이더 가림막',
      '2': 'STAGE 2: 키워드 강제인출',
      '3': 'STAGE 3: 초성 단어 락커',
      '4': 'STAGE 4: 스노우볼 30% 조립',
      '5': 'STAGE 5: 타임어택 단어 나열',
      'drill': '⚡ FINAL DRILL: 타임어택 백지 블라인드',
      'minigame': '🎮 ARCADE: NPC 실시간 미니게임 배틀'
    };
    document.getElementById('currentModeBadge').textContent = badgeMap[String(mode)] || '학습 모드';

    // 서브 컨트롤 패널
    document.querySelectorAll('.sub-ctrl-panel').forEach(p => p.classList.add('hidden'));
    const strMode = String(mode);
    if (strMode === '1') document.getElementById('ctrlStep1').classList.remove('hidden');
    else if (strMode === '1.5') document.getElementById('ctrlStep15').classList.remove('hidden');
    else if (strMode === '2') document.getElementById('ctrlStep2').classList.remove('hidden');
    else if (strMode === '3') document.getElementById('ctrlStep3').classList.remove('hidden');
    else if (strMode === '4') document.getElementById('ctrlStep4').classList.remove('hidden');
    else if (strMode === '5') document.getElementById('ctrlStep5').classList.remove('hidden');
    else if (strMode === 'drill') document.getElementById('ctrlDrill').classList.remove('hidden');

    if (strMode === 'minigame') {
      const practiceCard = document.getElementById('practiceCard');
      if (practiceCard) practiceCard.classList.add('hidden');
      const footerActions = document.querySelector('.card-footer-actions');
      if (footerActions) footerActions.classList.add('hidden');
      const shortcuts = document.querySelector('.shortcuts-legend');
      if (shortcuts) shortcuts.classList.add('hidden');
      const minigameWs = document.getElementById('minigameWorkspace');
      if (minigameWs) minigameWs.classList.remove('hidden');
      MiniGameEngine.start(MiniGameEngine.activeGame);
    } else {
      const practiceCard = document.getElementById('practiceCard');
      if (practiceCard) practiceCard.classList.remove('hidden');
      const footerActions = document.querySelector('.card-footer-actions');
      if (footerActions) footerActions.classList.remove('hidden');
      const shortcuts = document.querySelector('.shortcuts-legend');
      if (shortcuts) shortcuts.classList.remove('hidden');
      const minigameWs = document.getElementById('minigameWorkspace');
      if (minigameWs) minigameWs.classList.add('hidden');
      MiniGameEngine.stopAll();
      this.renderCardContent();
    }
  },

  getActiveSentences() {
    const curText = Store.getCurrentText();
    if (!curText || !curText.sentences) return [];
    if (this.currentMode === 'drill') {
      const weakIndices = curText.weakList || [];
      // 취약 문장이 있으면 취약 문장을 훈련, 비어있으면 전체 문장으로 즉시 플레이!
      if (weakIndices.length > 0) {
        return weakIndices.map(idx => ({ sentence: curText.sentences[idx], originalIndex: idx }));
      }
      return curText.sentences.map((sentence, idx) => ({ sentence, originalIndex: idx }));
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
    SpeechEngine.stopSpeak();
    SpeechEngine.stopListen();

    if (String(this.currentMode) === 'minigame') {
      return;
    }

    const curText = Store.getCurrentText();
    if (!curText || !curText.sentences || curText.sentences.length === 0) {
      document.getElementById('targetDisplayText').innerHTML = `
        <div class="empty-state-card">
          <h3>📝 등록된 암기 지문이 없습니다</h3>
          <p>상단의 <strong>[➕ 새 지문 추가]</strong> 또는 <strong>[📂 txt 불러오기]</strong> 버튼을 눌러<br>외우고 싶은 장문이나 대본을 등록해 보세요!</p>
        </div>
      `;
      document.getElementById('sentenceCounter').textContent = '0 / 0';
      document.getElementById('stepSentenceStatus').textContent = '대기 중';
      this.hideAllCardContainers();
      return;
    }

    const item = this.getCurrentSentenceData();
    if (!item) {
      if (this.currentMode === 'drill') {
        document.getElementById('targetDisplayText').innerHTML = '🎉 등록된 취약 문장이 없습니다!<br><span style="font-size:0.9rem; color:var(--text-muted)">다른 단계에서 잘 모르겠습니다 버튼이나 별표(⭐)를 눌러 추가해보세요.</span>';
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

    const modeKey = String(this.currentMode);
    const stepProg = (curText.stepProgress && curText.stepProgress[modeKey]) || {};
    const passedCount = Object.keys(stepProg).filter(k => stepProg[k]).length;
    document.getElementById('stepSentenceStatus').textContent = `이 스텝 통과: ${passedCount} / ${curText.sentences.length}`;

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
    if (modeKey === '1') {
      document.getElementById('targetDisplayText').innerHTML = this.escapeHtml(sentence);
    }
    // -------------------------------------------------------------
    // STAGE 1.5: 슬라이더 가림막 (오른쪽으로 밀어 읽기)
    // -------------------------------------------------------------
    else if (modeKey === '1.5') {
      document.getElementById('targetDisplayText').innerHTML = `<span style="font-size:1.15rem; color:var(--accent-gold); font-weight:700;">🎚️ 슬라이더를 잡고 오른쪽으로 쭈우욱 밀어서 문장을 소리 내어 읽으세요!</span>`;
      document.getElementById('stage15SliderArea').classList.remove('hidden');
      document.getElementById('revealArea').classList.remove('hidden');
      this.setupStage15Slider(sentence);
    }
    // -------------------------------------------------------------
    // STAGE 2: 키워드 강제인출
    // -------------------------------------------------------------
    else if (modeKey === '2') {
      document.getElementById('revealArea').classList.remove('hidden');
      document.getElementById('targetDisplayText').innerHTML = NLPAnalyzer.generateKeywordCloze(sentence, Store.settings.clozeLevel, curText.language);
    }
    // -------------------------------------------------------------
    // STAGE 3: 초성 단어 락커 (단어별 초성 칩 맞추기)
    // -------------------------------------------------------------
    else if (modeKey === '3') {
      document.getElementById('targetDisplayText').innerHTML = `<span style="font-size:1.15rem; color:var(--text-muted)">💡 초성 칩을 클릭하고 원래 단어를 입력하여 [✅]를 띄우세요!</span>`;
      document.getElementById('stage3ChosungArea').classList.remove('hidden');
      document.getElementById('revealArea').classList.remove('hidden');
      this.setupStage3Chosung(sentence, curText.language);
    }
    // -------------------------------------------------------------
    // STAGE 4: 스노우볼 30% 징검다리 조립
    // -------------------------------------------------------------
    else if (modeKey === '4') {
      document.getElementById('targetDisplayText').innerHTML = `<span style="font-size:1.15rem; color:var(--text-muted)">🔗 30% 힌트를 징검다리 삼아 빈칸을 직접 타이핑하여 완성하세요!</span>`;
      document.getElementById('stage4SnowballArea').classList.remove('hidden');
      document.getElementById('revealArea').classList.remove('hidden');
      this.setupStage4Snowball(sentence);
    }
    // -------------------------------------------------------------
    // STAGE 5: 🔥 타임어택 단어 나열 (Scramble)
    // -------------------------------------------------------------
    else if (modeKey === '5') {
      document.getElementById('targetDisplayText').innerHTML = `<span style="color:var(--accent-gold); font-weight:800;">🔥 STAGE 5: 타임어택 단어 나열! 제한시간 내에 올바른 순서대로 단어를 클릭하세요!</span>`;
      document.getElementById('drillScrambleArea').classList.remove('hidden');
      this.setupDrillScramble(sentence);
    }
    // -------------------------------------------------------------
    // FINAL DRILL: ⚡ 끝판왕 타임어택 백지 블라인드
    // -------------------------------------------------------------
    else if (modeKey === 'drill') {
      const isCustomWeak = (curText.weakList || []).length > 0;
      const drillLabel = isCustomWeak ? '⚡ FINAL DRILL [취약 문장 끝판왕 타임어택 블라인드]' : '⚡ FINAL DRILL [전체 문장 끝판왕 타임어택 블라인드]';
      document.getElementById('targetDisplayText').innerHTML = `<span style="color:var(--accent-rose); font-weight:800;">${drillLabel}! 제한시간 내에 백지 상태에서 완주하지 못하면 처음부터 다시 씁니다!</span>`;
      document.getElementById('typingArea').classList.remove('hidden');
      this.setupStage5Blind(sentence);
    }

    this.renderSentenceList();
  },

  hideAllCardContainers() {
    const ids = ['stage15SliderArea', 'stage3ChosungArea', 'stage4SnowballArea', 'drillScrambleArea', 'typingArea', 'revealArea', 'revealedOriginalText', 'errorAlertBanner'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
  },

  // --------------------------------------------------------------------------
  // STAGE 1.5: 슬라이더 가림막 (밀어서 읽기 암기 모듈)
  // --------------------------------------------------------------------------
  splitSentenceIntoLines(sentence) {
    if (!sentence) return [];
    if (sentence.includes('\n')) {
      return sentence.split(/\r?\n/).map(s => s.trim()).filter(s => s.length > 0);
    }
    // 긴 문장(35자 이상)의 경우 자연스러운 쉼표, 접속사, 공백을 찾아 2줄로 분할하여 별개 마스킹 부여
    if (sentence.length >= 35) {
      const mid = Math.floor(sentence.length / 2);
      const searchStart = Math.floor(sentence.length * 0.25);
      const searchEnd = Math.floor(sentence.length * 0.75);
      let bestIdx = -1;
      let bestScore = -999;

      for (let i = searchStart; i <= searchEnd; i++) {
        const ch = sentence[i];
        let score = 0;
        if (ch === ',' || ch === ';' || ch === '?' || ch === '!') {
          score = 100 - Math.abs(i - mid);
        } else if (ch === ' ' && (sentence[i - 1] === ',' || sentence[i - 1] === '.')) {
          score = 90 - Math.abs(i - mid);
        } else if (ch === ' ') {
          score = 50 - Math.abs(i - mid);
        }
        if (score > bestScore) {
          bestScore = score;
          bestIdx = i;
        }
      }

      if (bestIdx > 0) {
        const splitPos = (sentence[bestIdx] === ' ') ? bestIdx : bestIdx + 1;
        const line1 = sentence.slice(0, splitPos).trim();
        const line2 = sentence.slice(splitPos).trim();
        if (line1 && line2) {
          return [line1, line2];
        }
      }
    }
    return [sentence];
  },

  setupStage15Slider(sentence) {
    const container = document.getElementById('sliderLinesList');
    if (!container) return;

    const lines = this.splitSentenceIntoLines(sentence);
    this.stage15State = {
      lines,
      passed: new Array(lines.length).fill(false)
    };

    container.innerHTML = lines.map((line, idx) => `
      <div class="slider-line-item" id="sliderLineItem_${idx}">
        <div class="slider-text-box">
          <div class="slider-text-layer" id="sliderTextLayer_${idx}">${this.escapeHtml(line)}</div>
          <div class="slider-mask-layer" id="sliderMaskLayer_${idx}" style="width: 100%;">
            <span class="mask-lock-icon">🔒 밀어서 읽기</span>
          </div>
        </div>
        <div class="slider-control-row">
          <span class="slider-label" style="font-size:0.85rem; color:var(--text-dim); font-weight:700;">👉 ${lines.length > 1 ? `${idx + 1}줄 밀기:` : '밀기:'}</span>
          <input type="range" class="mask-range-slider" id="maskSlider_${idx}" min="0" max="100" value="0" data-idx="${idx}">
          <span class="slider-status-tag" id="maskSliderPct_${idx}">0%</span>
        </div>
      </div>
    `).join('');

    lines.forEach((line, idx) => {
      const slider = document.getElementById(`maskSlider_${idx}`);
      const mask = document.getElementById(`sliderMaskLayer_${idx}`);
      const pctTag = document.getElementById(`maskSliderPct_${idx}`);
      const lineItem = document.getElementById(`sliderLineItem_${idx}`);

      if (!slider || !mask || !pctTag) return;

      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        const remainWidth = Math.max(0, 100 - val);
        mask.style.width = `${remainWidth}%`;
        pctTag.textContent = `${val}%`;

        if (val % 10 === 0) {
          SoundFX.playKeyClick();
        }

        if (val >= 95) {
          if (!this.stage15State.passed[idx]) {
            this.stage15State.passed[idx] = true;
            slider.value = 100;
            slider.disabled = true;
            mask.style.width = '0%';
            pctTag.innerHTML = '통과! ✅';
            lineItem.classList.add('passed');
            SoundFX.playWordCheck();
            VisualFX.spawnHit(slider.getBoundingClientRect().right - 20, slider.getBoundingClientRect().top + 10, 8);

            const allPassed = this.stage15State.passed.every(p => p === true);
            if (allPassed) {
              this.markCurrentAsMemorized(true);
            }
          }
        }
      });

      const handleRelease = () => {
        if (!this.stage15State.passed[idx]) {
          slider.value = 0;
          mask.style.width = '100%';
          pctTag.textContent = '0%';
        }
      };
      slider.addEventListener('change', handleRelease);
      slider.addEventListener('mouseup', handleRelease);
      slider.addEventListener('touchend', handleRelease);
    });
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
          this.markCurrentAsMemorized(true);
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
      return `
        <span class="snowball-slot-unit" id="snowballUnit_${idx}">
          <input type="text" class="snowball-slot-input" data-idx="${idx}" data-ans="${encodeURIComponent(item.word)}" placeholder="직접 입력" autocomplete="off" spellcheck="false">
          <span class="snowball-check-icon hidden" id="snowballCheck_${idx}">✅</span>
        </span>
      `;
    }).join('');

    // 인풋 실시간 타이핑 검사 및 엔터/포커스 이동
    const inputs = container.querySelectorAll('.snowball-slot-input');
    inputs.forEach((inp, i) => {
      inp.addEventListener('input', () => {
        this.checkSingleSnowballInput(inp, true);
      });

      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const isRight = this.checkSingleSnowballInput(inp, false);
          if (isRight) {
            const nextEmpty = Array.from(inputs).find((other, idx) => idx > i && !other.classList.contains('correct'));
            if (nextEmpty) nextEmpty.focus();
            else document.getElementById('btnCheckSnowball').focus();
          } else {
            SoundFX.playErrorThud();
            VisualFX.shake('error');
            inp.classList.add('shake-error');
            setTimeout(() => inp.classList.remove('shake-error'), 400);
          }
        }
      });

      inp.addEventListener('blur', () => this.checkSingleSnowballInput(inp, false));
    });

    if (inputs[0]) inputs[0].focus();
  },

  checkSingleSnowballInput(inp, autoAdvance = false) {
    const val = inp.value.trim();
    const ans = decodeURIComponent(inp.dataset.ans);
    const idx = inp.dataset.idx;
    const unit = document.getElementById(`snowballUnit_${idx}`);
    const checkIcon = document.getElementById(`snowballCheck_${idx}`);

    const cleanIn = Store.settings.punctFlexible ? val.replace(/[^\w가-힣]/g, '').toLowerCase() : val;
    const cleanAns = Store.settings.punctFlexible ? ans.replace(/[^\w가-힣]/g, '').toLowerCase() : ans;

    if (cleanIn.length > 0 && cleanIn === cleanAns) {
      if (!inp.classList.contains('correct')) {
        inp.classList.add('correct');
        inp.value = ans;
        if (unit) unit.classList.add('correct');
        if (checkIcon) {
          checkIcon.classList.remove('hidden');
          checkIcon.classList.remove('pop-check');
          void checkIcon.offsetWidth; // trigger reflow
          checkIcon.classList.add('pop-check');
        }
        SoundFX.playWordCheck();
        VisualFX.spawnHit(inp.getBoundingClientRect().left + 40, inp.getBoundingClientRect().top + 10, 8);

        // 다음 빈칸으로 자동 포커스 이동 (실시간 타이핑 완료 시)
        if (autoAdvance) {
          const container = document.getElementById('snowballSlotsBox');
          const allInputs = Array.from(container.querySelectorAll('.snowball-slot-input'));
          const nextEmpty = allInputs.find(i => !i.classList.contains('correct'));
          if (nextEmpty) {
            nextEmpty.focus();
          }
        }

        // 모든 슬롯이 맞았는지 확인하여 자동 클리어
        const container = document.getElementById('snowballSlotsBox');
        const allInputs = Array.from(container.querySelectorAll('.snowball-slot-input'));
        const allDone = allInputs.every(i => i.classList.contains('correct'));
        if (allDone) {
          setTimeout(() => {
            this.markCurrentAsMemorized(true);
          }, 350);
        }
      }
      return true;
    } else {
      if (inp.classList.contains('correct')) {
        inp.classList.remove('correct');
        if (unit) unit.classList.remove('correct');
        if (checkIcon) checkIcon.classList.add('hidden');
      }
      return false;
    }
  },

  checkSnowballSlots() {
    const container = document.getElementById('snowballSlotsBox');
    const inputs = Array.from(container.querySelectorAll('.snowball-slot-input'));
    let allCorrect = true;

    inputs.forEach(inp => {
      const isRight = this.checkSingleSnowballInput(inp, false);
      if (!isRight) {
        allCorrect = false;
        inp.classList.add('shake-error');
        setTimeout(() => inp.classList.remove('shake-error'), 400);
      }
    });

    if (allCorrect) {
      this.markCurrentAsMemorized(true);
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
      this.markCurrentAsMemorized(true);
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
        this.markCurrentAsMemorized(true);
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
  // STAGE 6: 말로 외우기 AI 음성 코치 모듈
  // --------------------------------------------------------------------------
  setupStage6VoiceCoach(sentence, lang) {
    SpeechEngine.stopSpeak();
    SpeechEngine.stopListen();

    const statusText = document.getElementById('voiceCoachStatusText');
    const liveText = document.getElementById('liveTranscriptText');
    const simRate = document.getElementById('voiceSimilarityRate');
    const simBar = document.getElementById('similarityBarFill');
    const feedbackBox = document.getElementById('voiceCoachFeedbackBox');
    const btnMic = document.getElementById('btnToggleVoiceCoachMic');

    btnMic.classList.remove('recording');
    statusText.textContent = '마이크 누르고 문장 외워서 말하기';
    liveText.textContent = '마이크 버튼을 누르면 인식이 시작됩니다...';
    simRate.textContent = '0%';
    simBar.style.width = '0%';
    feedbackBox.classList.add('hidden');

    btnMic.onclick = () => {
      this.toggleStage6Mic(sentence, lang);
    };
  },

  toggleStage6Mic(sentence, lang) {
    const btnMic = document.getElementById('btnToggleVoiceCoachMic');
    const statusText = document.getElementById('voiceCoachStatusText');
    const liveText = document.getElementById('liveTranscriptText');
    const simRate = document.getElementById('voiceSimilarityRate');
    const simBar = document.getElementById('similarityBarFill');
    const feedbackBox = document.getElementById('voiceCoachFeedbackBox');

    // 마이크 버튼을 누르면 AI가 말하고 있던 음성 코칭을 즉시 중단(cancel)
    SpeechEngine.stopSpeak();

    if (SpeechEngine.isRecognizing) {
      SpeechEngine.stopListen();
      btnMic.classList.remove('recording');
      statusText.textContent = '마이크 켜기 (재도전)';
      return;
    }

    btnMic.classList.add('recording');
    statusText.textContent = '듣고 있습니다... 말씀하세요!';
    feedbackBox.classList.add('hidden');
    liveText.textContent = '말씀하시는 내용을 분석 중입니다...';

    SpeechEngine.startListen(
      lang,
      (transcript) => {
        liveText.textContent = `"${transcript}"`;

        // 1. 실시간 단어 오답 감지 ("안녕하세요 저는 바나나" -> "바나나가 아닌 사과라고 말해야 해요!" 즉시 피드백)
        const mismatch = this.findVoiceMismatch(transcript, sentence);
        if (mismatch) {
          SpeechEngine.stopListen();
          btnMic.classList.remove('recording');
          statusText.textContent = '마이크 켜기 (재도전)';

          SoundFX.playErrorThud();
          VisualFX.shake('error');

          const getParticle = (w) => {
            if (!w) return '이';
            const c = w.charCodeAt(w.length - 1);
            if (c < 0xAC00 || c > 0xD7A3) return '이';
            return (c - 0xAC00) % 28 > 0 ? '이' : '가';
          };
          const p = getParticle(mismatch.wrongWord);

          const promptText = lang.startsWith('en')
            ? `Not "${mismatch.wrongWord}", you should say "${mismatch.expectedWord}"!`
            : `"${mismatch.wrongWord}"${p} 아닌 "${mismatch.expectedWord}"라고 말해야 해요!`;

          const voicePrompt = lang.startsWith('en')
            ? `Not ${mismatch.wrongWord}, you should say ${mismatch.expectedWord}!`
            : `${mismatch.wrongWord}${p} 아닌 ${mismatch.expectedWord}라고 말해야 해요!`;

          feedbackBox.classList.remove('hidden');
          document.getElementById('voiceCoachFeedbackText').textContent = `🗣️ ${promptText}`;

          SpeechEngine.speak(voicePrompt, lang, 1.0, () => {
            setTimeout(() => {
              liveText.textContent = '처음부터 다시 말씀해보세요!';
            }, 500);
          });
          return;
        }

        // 2. 실시간 퍼지 유사도 계산 (한국어 자모 분해로 억양/발음/띄어쓰기 완벽 인식)
        const sim = this.calculateFuzzySimilarity(transcript, sentence);
        simRate.textContent = `${sim}%`;
        simBar.style.width = `${sim}%`;

        // 65% 이상 일치 시 시원하게 합격 인정!
        if (sim >= 65) {
          SpeechEngine.stopListen();
          btnMic.classList.remove('recording');
          statusText.textContent = '🎉 완벽히 일치합니다!';
          liveText.innerHTML = `🎉 <strong style="color:#34d399">합격!</strong> ("${this.escapeHtml(transcript)}")`;
          
          this.markCurrentAsMemorized(true);
        }
      },
      () => {
        // 음성 입력이 끝났을 때(사용자가 말을 멈춤) 검사
        btnMic.classList.remove('recording');
        statusText.textContent = '마이크 누르고 문장 외워서 말하기';

        const lastSpoken = liveText.textContent.replace(/^"|"$/g, '').trim();
        if (lastSpoken && !lastSpoken.startsWith('마이크') && !lastSpoken.startsWith('처음부터') && !lastSpoken.startsWith('말씀하시는')) {
          const finalSim = this.calculateFuzzySimilarity(lastSpoken, sentence);
          if (finalSim < 65) {
            SoundFX.playErrorThud();
            VisualFX.shake('error');
            feedbackBox.classList.remove('hidden');

            const getParticle = (w) => {
              if (!w) return '이';
              const c = w.charCodeAt(w.length - 1);
              if (c < 0xAC00 || c > 0xD7A3) return '이';
              return (c - 0xAC00) % 28 > 0 ? '이' : '가';
            };

            const mismatch = this.findVoiceMismatch(lastSpoken, sentence);
            let promptText = '';
            let voicePrompt = '';

            if (mismatch) {
              const p = getParticle(mismatch.wrongWord);
              promptText = lang.startsWith('en')
                ? `Not "${mismatch.wrongWord}", you should say "${mismatch.expectedWord}"!`
                : `"${mismatch.wrongWord}"${p} 아닌 "${mismatch.expectedWord}"라고 말해야 해요!`;
              voicePrompt = lang.startsWith('en')
                ? `Not ${mismatch.wrongWord}, you should say ${mismatch.expectedWord}!`
                : `${mismatch.wrongWord}${p} 아닌 ${mismatch.expectedWord}라고 말해야 해요!`;
            } else {
              const cleanPunct = (str) => str.replace(/['"`.,~!?]/g, '').trim();
              const tWords = cleanPunct(sentence).split(/\s+/).filter(Boolean);
              const sWords = cleanPunct(lastSpoken).split(/\s+/).filter(Boolean);
              const nextExpected = tWords[sWords.length] || tWords[0] || '다음 단어';

              promptText = lang.startsWith('en')
                ? `You should say "${nextExpected}"!`
                : `"${nextExpected}"라고 이어서 말해야 해요!`;
              voicePrompt = lang.startsWith('en')
                ? `You should say ${nextExpected}!`
                : `${nextExpected}라고 이어서 말해야 해요!`;
            }

            document.getElementById('voiceCoachFeedbackText').textContent = `🗣️ ${promptText}`;

            SpeechEngine.speak(voicePrompt, lang, 1.0, () => {
              setTimeout(() => {
                feedbackBox.classList.add('hidden');
                simRate.textContent = '0%';
                simBar.style.width = '0%';
                liveText.textContent = '처음부터 다시 말씀해보세요!';
              }, 1200);
            });
          }
        }
      },
      () => {
        btnMic.classList.remove('recording');
        statusText.textContent = '마이크 누르고 문장 외워서 말하기';
      }
    );
  },

  // 실시간 음성 단어 단위 불일치(오답) 감지
  findVoiceMismatch(spoken, target) {
    if (!spoken || !target) return null;

    const cleanPunct = (str) => str.replace(/['"`.,~!?]/g, '').trim();
    const targetWords = cleanPunct(target).split(/\s+/).filter(Boolean);
    const spokenWords = cleanPunct(spoken).split(/\s+/).filter(Boolean);

    if (spokenWords.length === 0 || targetWords.length === 0) return null;

    let sIdx = 0;
    let tIdx = 0;

    const areWordsSimilar = (w1, w2) => {
      if (!w1 || !w2) return false;
      const n1 = w1.toLowerCase().replace(/(은|는|이|가|을|를|의|에|로|과|와|도|만|고)$/g, '');
      const n2 = w2.toLowerCase().replace(/(은|는|이|가|을|를|의|에|로|과|와|도|만|고)$/g, '');
      if (n1 === n2) return true;
      if (w1 === w2) return true;
      if (this.calculateFuzzySimilarity(w1, w2) >= 50) return true;
      return false;
    };

    while (sIdx < spokenWords.length && tIdx < targetWords.length) {
      const sWord = spokenWords[sIdx];
      const tWord = targetWords[tIdx];

      // 1. 단어 일치 또는 발음/자모 오차 허용
      if (areWordsSimilar(sWord, tWord)) {
        sIdx++;
        tIdx++;
        continue;
      }

      // 2. 띄어쓰기 결합 검사 (spoken이 2단어로 쪼개졌을 때: target "먹고싶다" vs spoken "먹고", "싶다")
      if (sIdx + 1 < spokenWords.length) {
        const combinedSpoken = sWord + spokenWords[sIdx + 1];
        if (areWordsSimilar(combinedSpoken, tWord)) {
          sIdx += 2;
          tIdx++;
          continue;
        }
      }

      // 3. 띄어쓰기 결합 역검사 (target이 2단어인데 spoken이 1단어로 붙었을 때)
      if (tIdx + 1 < targetWords.length) {
        const combinedTarget = tWord + targetWords[tIdx + 1];
        if (areWordsSimilar(sWord, combinedTarget)) {
          sIdx++;
          tIdx += 2;
          continue;
        }
      }

      // 4. 마지막 단어 발음 중인 상태 검사 (사용자가 아직 말을 끝내지 않고 음절을 이어 말하는 중)
      const isLastSpokenWord = (sIdx === spokenWords.length - 1);
      if (isLastSpokenWord) {
        if (tWord.startsWith(sWord) || sWord.startsWith(tWord)) {
          return null; // 아직 말하는 중
        }
        if (this.calculateFuzzySimilarity(sWord, tWord) >= 40) {
          return null; // 자모가 유사하므로 발화 진행 중
        }
        if (sWord.length < 2 && tWord.length > sWord.length) {
          return null;
        }
      }

      // 5. 확정 오답 반환!
      return {
        wrongWord: sWord,
        expectedWord: tWord
      };
    }

    // 초과 발화 단어 검사 (원문 끝난 후 불필요한 단어가 더 붙었을 때)
    if (sIdx < spokenWords.length && tIdx >= targetWords.length) {
      return {
        wrongWord: spokenWords[sIdx],
        expectedWord: targetWords[targetWords.length - 1]
      };
    }

    return null;
  },

  // 한글 자모 분해 기반 퍼지 매칭 알고리즘 (발음/연음/띄어쓰기 오차 완전 극복)
  calculateFuzzySimilarity(spoken, target) {
    if (!spoken || !target) return 0;

    // 1. 한국어 자모 분해 (영문/숫자 소문자 유지, 공백/구두점 완전 정규화)
    const s1 = NLPAnalyzer.decomposeHangul(spoken);
    const s2 = NLPAnalyzer.decomposeHangul(target);

    if (!s1 || !s2) return 0;
    if (s1 === s2) return 100;
    if (s2.includes(s1) || s1.includes(s2)) {
      const minL = Math.min(s1.length, s2.length);
      const maxL = Math.max(s1.length, s2.length);
      return Math.round((minL / maxL) * 100);
    }

    const track = Array(s2.length + 1).fill(null).map(() =>
      Array(s1.length + 1).fill(null));
    for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
    for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;

    for (let j = 1; j <= s2.length; j += 1) {
      for (let i = 1; i <= s1.length; i += 1) {
        const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1,
          track[j - 1][i] + 1,
          track[j - 1][i - 1] + indicator
        );
      }
    }

    const dist = track[s2.length][s1.length];
    const maxLen = Math.max(s1.length, s2.length);
    if (maxLen === 0) return 100;

    return Math.max(0, Math.round((1 - (dist / maxLen)) * 100));
  },

  // --------------------------------------------------------------------------
  // 상단 🎙️ 말로 외우기 AI 음성 코치 모달 전용 모듈
  // --------------------------------------------------------------------------
  voiceCoachModalState: {
    isOpen: false,
    currentIndex: 0,
    isMasked: true
  },

  openVoiceCoachModal() {
    const curText = this.getCurrentText();
    if (!curText || !curText.sentences || curText.sentences.length === 0) {
      alert('현재 선택된 지문에 문장이 없습니다.');
      return;
    }

    this.voiceCoachModalState.isOpen = true;
    this.voiceCoachModalState.currentIndex = this.currentIndex || 0;
    this.voiceCoachModalState.isMasked = true;

    document.getElementById('modalVoiceCoach').classList.remove('hidden');
    this.updateVoiceCoachModalView();
  },

  updateVoiceCoachModalView() {
    const curText = this.getCurrentText();
    if (!curText || !curText.sentences) return;

    const total = curText.sentences.length;
    const idx = Math.max(0, Math.min(this.voiceCoachModalState.currentIndex, total - 1));
    this.voiceCoachModalState.currentIndex = idx;

    const sentence = curText.sentences[idx];
    const targetEl = document.getElementById('vcTargetSentence');
    const counterEl = document.getElementById('vcSentenceCounter');
    const maskText = document.getElementById('vcMaskText');
    const maskIcon = document.getElementById('vcMaskIcon');
    const liveEl = document.getElementById('vcLiveTranscript');
    const feedbackBox = document.getElementById('vcCoachFeedback');
    const simBar = document.getElementById('vcSimBar');
    const simVal = document.getElementById('vcSimPercent');
    const micBtn = document.getElementById('btnVcMicToggle');
    const micText = document.getElementById('vcMicStatusText');

    counterEl.textContent = `문장 ${idx + 1} / ${total}`;
    targetEl.textContent = sentence;

    if (this.voiceCoachModalState.isMasked) {
      targetEl.classList.add('masked');
      maskText.textContent = '정답 보기';
      maskIcon.textContent = '👁️';
    } else {
      targetEl.classList.remove('masked');
      maskText.textContent = '가리기';
      maskIcon.textContent = '🔒';
    }

    SpeechEngine.stopSpeak();
    SpeechEngine.stopListen();
    micBtn.classList.remove('recording');
    micText.textContent = '마이크 켜고 외워서 말하기';
    liveEl.textContent = '마이크 버튼을 누르고 문장을 말씀해 보세요...';
    feedbackBox.classList.add('hidden');
    simBar.style.width = '0%';
    simVal.textContent = '0%';

    document.getElementById('btnVcPrev').disabled = (idx === 0);
    document.getElementById('btnVcNext').disabled = (idx === total - 1);
  },

  toggleVoiceCoachModalMask() {
    this.voiceCoachModalState.isMasked = !this.voiceCoachModalState.isMasked;
    const targetEl = document.getElementById('vcTargetSentence');
    const maskText = document.getElementById('vcMaskText');
    const maskIcon = document.getElementById('vcMaskIcon');
    if (this.voiceCoachModalState.isMasked) {
      targetEl.classList.add('masked');
      maskText.textContent = '정답 보기';
      maskIcon.textContent = '👁️';
    } else {
      targetEl.classList.remove('masked');
      maskText.textContent = '가리기';
      maskIcon.textContent = '🔒';
    }
  },

  voiceCoachModalPrev() {
    if (this.voiceCoachModalState.currentIndex > 0) {
      this.voiceCoachModalState.currentIndex--;
      this.updateVoiceCoachModalView();
    }
  },

  voiceCoachModalNext() {
    const curText = this.getCurrentText();
    if (curText && this.voiceCoachModalState.currentIndex < curText.sentences.length - 1) {
      this.voiceCoachModalState.currentIndex++;
      this.updateVoiceCoachModalView();
    }
  },

  toggleVoiceCoachModalMic() {
    const curText = this.getCurrentText();
    if (!curText) return;
    const idx = this.voiceCoachModalState.currentIndex;
    const sentence = curText.sentences[idx];
    const lang = curText.language || 'ko-KR';

    const micBtn = document.getElementById('btnVcMicToggle');
    const micText = document.getElementById('vcMicStatusText');
    const liveEl = document.getElementById('vcLiveTranscript');
    const feedbackBox = document.getElementById('vcCoachFeedback');
    const feedbackText = document.getElementById('vcCoachFeedbackText');
    const simBar = document.getElementById('vcSimBar');
    const simVal = document.getElementById('vcSimPercent');

    SpeechEngine.stopSpeak();

    if (SpeechEngine.isRecognizing) {
      SpeechEngine.stopListen();
      micBtn.classList.remove('recording');
      micText.textContent = '마이크 켜기 (재도전)';
      return;
    }

    micBtn.classList.add('recording');
    micText.textContent = '듣고 있습니다... 말씀하세요!';
    feedbackBox.classList.add('hidden');
    liveEl.textContent = '말씀하시는 내용을 분석 중입니다...';

    SpeechEngine.startListen(
      lang,
      (transcript) => {
        liveEl.textContent = `"${transcript}"`;

        // 1. 단어 오답 감지 ("바나나" -> "바나나가 아닌 사과라고 말해야 해요!")
        const mismatch = this.findVoiceMismatch(transcript, sentence);
        if (mismatch) {
          SpeechEngine.stopListen();
          micBtn.classList.remove('recording');
          micText.textContent = '마이크 켜기 (재도전)';

          SoundFX.playErrorThud();
          VisualFX.shake('error');

          const getParticle = (w) => {
            if (!w) return '이';
            const c = w.charCodeAt(w.length - 1);
            if (c < 0xAC00 || c > 0xD7A3) return '이';
            return (c - 0xAC00) % 28 > 0 ? '이' : '가';
          };
          const p = getParticle(mismatch.wrongWord);

          const promptText = lang.startsWith('en')
            ? `Not "${mismatch.wrongWord}", you should say "${mismatch.expectedWord}"!`
            : `"${mismatch.wrongWord}"${p} 아닌 "${mismatch.expectedWord}"라고 말해야 해요!`;

          const voicePrompt = lang.startsWith('en')
            ? `Not ${mismatch.wrongWord}, you should say ${mismatch.expectedWord}!`
            : `${mismatch.wrongWord}${p} 아닌 ${mismatch.expectedWord}라고 말해야 해요!`;

          feedbackBox.classList.remove('hidden');
          feedbackText.textContent = `🗣️ ${promptText}`;

          SpeechEngine.speak(voicePrompt, lang, 1.0, () => {
            setTimeout(() => {
              liveEl.textContent = '처음부터 다시 말씀해보세요!';
            }, 500);
          });
          return;
        }

        // 2. 실시간 자모 퍼지 유사도 계산
        const sim = this.calculateFuzzySimilarity(transcript, sentence);
        simVal.textContent = `${sim}%`;
        simBar.style.width = `${sim}%`;

        // 65% 이상 일치 시 시원하게 합격!
        if (sim >= 65) {
          SpeechEngine.stopListen();
          micBtn.classList.remove('recording');
          micText.textContent = '🎉 완벽히 일치합니다!';
          liveEl.innerHTML = `🎉 <strong style="color:#34d399">합격!</strong> ("${this.escapeHtml(transcript)}")`;

          SoundFX.playSuccessChime();
          VisualFX.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 60);

          setTimeout(() => {
            if (this.voiceCoachModalState.currentIndex < curText.sentences.length - 1) {
              this.voiceCoachModalNext();
            } else {
              alert('🎉 모든 문장의 말로 외우기를 완주하셨습니다!');
            }
          }, 1500);
        }
      },
      () => {
        micBtn.classList.remove('recording');
        micText.textContent = '마이크 누르고 외워서 말하기';
      },
      () => {
        micBtn.classList.remove('recording');
        micText.textContent = '마이크 누르고 외워서 말하기';
      }
    );
  },

  markVoiceCoachPassed() {
    const curText = this.getCurrentText();
    if (!curText) return;
    SoundFX.playSuccessChime();
    VisualFX.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 50);

    if (this.voiceCoachModalState.currentIndex < curText.sentences.length - 1) {
      this.voiceCoachModalNext();
    } else {
      alert('🎉 축하합니다! 모든 문장의 말로 외우기를 마스터하셨습니다!');
    }
  },

  // --------------------------------------------------------------------------
  // 끄투 스타일 텍스트 애니메이션 연출 ("투두두둑!" + "뜬! 뜬! 딴~!")
  // --------------------------------------------------------------------------
  triggerKkutuCelebration(sentence, onComplete) {
    const textDisplayBox = document.getElementById('textDisplayBox');
    const targetDisplayText = document.getElementById('targetDisplayText');

    if (textDisplayBox && targetDisplayText) {
      textDisplayBox.classList.remove('hidden');
      textDisplayBox.classList.add('kkutu-celebrating');

      // 단어별 끄투 팝 애니메이션 스팬 생성 (0.04s씩 순차 팝업)
      const words = sentence.trim().split(/\s+/);
      targetDisplayText.innerHTML = words.map((w, i) => 
        `<span class="kkutu-word" style="animation-delay: ${i * 42}ms">${this.escapeHtml(w)}</span>`
      ).join(' ');
    }

    // 끄투 사운드 ("투두두둑!" + "뜬! 뜬! 딴~!" 팡파레)
    SoundFX.playKkutuSuccess(() => {
      if (textDisplayBox) {
        textDisplayBox.classList.remove('kkutu-celebrating');
      }
      if (onComplete) onComplete();
    });
  },

  // --------------------------------------------------------------------------
  // 공통 마스터 체크 & 다음 문장 전환 (끄투 연출 완료 후 부드럽게 전환)
  // --------------------------------------------------------------------------
  markCurrentAsMemorized(playSound = true) {
    if (this.isTransitioning) return; // 문장 중복 건너뛰기 방지
    this.isTransitioning = true;

    this.stopTimer();
    SpeechEngine.stopSpeak();
    SpeechEngine.stopListen();

    const item = this.getCurrentSentenceData();
    if (!item) {
      this.isTransitioning = false;
      return;
    }

    const curText = Store.getCurrentText();
    curText.stepProgress = curText.stepProgress || { '1': {}, '1.5': {}, '2': {}, '3': {}, '4': {}, '5': {}, '6': {}, 'drill': {} };

    const modeKey = String(this.currentMode);
    curText.stepProgress[modeKey] = curText.stepProgress[modeKey] || {};
    curText.stepProgress[modeKey][item.originalIndex] = true;

    if (this.currentMode === 'drill') {
      curText.weakList = (curText.weakList || []).filter(idx => idx !== item.originalIndex);
    }

    Store.saveData();
    this.addCombo();
    this.updateMasteryUI();
    this.renderSentenceList();

    const proceedToNext = () => {
      const totalSentences = curText.sentences.length;
      let stepAllCleared = false;

      const stepProg = curText.stepProgress[modeKey] || {};
      const passedCount = Object.keys(stepProg).filter(k => stepProg[k]).length;
      if (passedCount >= totalSentences) {
        stepAllCleared = true;
      }

      if (stepAllCleared) {
        SoundFX.playStageClear();
        VisualFX.spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 80);

        const stageSequence = [1, '1.5', 2, 3, 4, 5, 'drill'];
        const curIdx = stageSequence.findIndex(s => String(s) === modeKey);

        if (curIdx === stageSequence.length - 1) {
          // 끝판왕 FINAL DRILL까지 전부 클리어!
          this.showCongratulationModal();
          this.isTransitioning = false;
        } else {
          const stageNames = {
            '1': 'STAGE 1: 정독 & 뇌새김',
            '1.5': 'STAGE 1.5: 슬라이더 가림막',
            '2': 'STAGE 2: 키워드 강제인출',
            '3': 'STAGE 3: 초성 단어 락커',
            '4': 'STAGE 4: 스노우볼 30% 조립',
            '5': 'STAGE 5: 타임어택 단어 나열',
            '6': 'STAGE 6: 말로 외우기 AI 코치',
            'drill': 'FINAL DRILL: 타임어택 백지 블라인드'
          };
          const nextMode = stageSequence[curIdx + 1];
          document.getElementById('stageClearTitle').textContent = `🎉 ${stageNames[modeKey]} 정복 완료!`;
          document.getElementById('stageClearMessage').innerHTML = `
            모든 문장의 훈련을 완벽하게 마스터했습니다!<br>
            이제 다음 단계인 <strong>${stageNames[String(nextMode)]}</strong> 단계로 진격합니다!
          `;
          document.getElementById('modalStageClear').classList.remove('hidden');
          this.isTransitioning = false;
        }
      } else {
        this.nextSentence();
        this.isTransitioning = false;
      }
    };

    if (playSound) {
      // 끄투 스타일 투두두둑 + 뜬뜬딴 연출 후 재생 끝나면 넘어감
      this.triggerKkutuCelebration(item.sentence, () => {
        proceedToNext();
      });
    } else {
      setTimeout(() => {
        proceedToNext();
      }, 300);
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
    // FINAL DRILL 또는 STAGE 6 클리어 완료된 문장 기준
    const drillProg = (curText.stepProgress && curText.stepProgress['drill']) || {};
    const stage6Prog = (curText.stepProgress && curText.stepProgress['6']) || {};
    const mastered = curText.sentences.filter((_, idx) => drillProg[idx] || stage6Prog[idx]).length;
    const pct = Math.round((mastered / total) * 100);

    document.getElementById('masteryRateText').textContent = `${pct}%`;
    document.getElementById('masteryProgressBar').style.width = `${pct}%`;
    document.getElementById('sidebarCountBadge').textContent = `${mastered} / ${total}`;

    const stageNames = {
      '1': 'STAGE 1: 정독 & 뇌새김',
      '1.5': 'STAGE 1.5: 슬라이더 가림막',
      '2': 'STAGE 2: 키워드 강제인출',
      '3': 'STAGE 3: 초성 단어 락커',
      '4': 'STAGE 4: 스노우볼 30% 조립',
      '5': 'STAGE 5: 타임어택 단어 나열',
      '6': 'STAGE 6: 말로 외우기 AI 코치',
      'drill': 'FINAL DRILL: 타임어택 블라인드'
    };
    const stepLabel = stageNames[String(this.currentMode)] || '학습 진행';
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
    const modeKey = String(this.currentMode);
    const curStepProg = (curText.stepProgress && curText.stepProgress[modeKey]) || {};
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
