const SAMPLE_TEXTS = [
  {
    id: "steve-jobs",
    title: "스티브 잡스 스탠포드 졸업 축사 (Stay Hungry, Stay Foolish)",
    category: "영어 명연설",
    language: "en-US",
    description: "인생의 세 가지 이야기와 '계속 갈망하라, 여전히 우직하라'는 전설적인 명문",
    sentences: [
      "Your time is limited, so don't waste it living someone else's life.",
      "Don't be trapped by dogma, which is living with the results of other people's thinking.",
      "Don't let the noise of others' opinions drown out your own inner voice.",
      "And most important, have the courage to follow your heart and intuition.",
      "They somehow already know what you truly want to become.",
      "Everything else is secondary.",
      "Stay Hungry. Stay Foolish."
    ]
  },
  {
    id: "korean-constitution",
    title: "대한민국 헌법 전문 (Preamble of the Constitution)",
    category: "법률/공시",
    language: "ko-KR",
    description: "공무원 시험, 로스쿨, 행정고시 필수 암기 헌법 전문",
    sentences: [
      "유구한 역사와 전통에 빛나는 우리 대한국민은 3·1운동으로 건립된 대한민국임시정부의 법통과 불의에 항거한 4·19민주이념을 계승하고,",
      "조국의 민주개혁과 평화적 통일의 사명에 입각하여 정의·인도와 동포애로써 민족의 단결을 공고히 하고,",
      "모든 사회적 폐습과 불의를 타파하며,",
      "자율과 조화를 바탕으로 자유민주적 기본질서를 더욱 확고히 하여 정치·경제·사회·문화의 모든 영역에 있어서 각인의 기회를 균등히 하고,",
      "능력을 최고도로 발휘하게 하며,",
      "자유와 권리에 따르는 책임과 의무를 완수하게 하여,",
      "안으로는 국민생활의 균등한 향상을 기하고 밖으로는 항구적인 세계평화와 인류공영에 이바지함으로써",
      "우리들과 우리들의 자손의 안전과 자유와 행복을 영원히 확보할 것을 다짐하면서",
      "1948년 7월 12일에 제정되고 8차에 걸쳐 개정된 헌법을 이제 국회의 의결을 거쳐 국민투표에 의하여 개정한다."
    ]
  },
  {
    id: "mlk-dream",
    title: "마틴 루터 킹 목사 - 나에게는 꿈이 있습니다 (I Have a Dream)",
    category: "영어 명연설",
    language: "en-US",
    description: "인류 역사상 가장 위대한 연설 중 하나로 꼽히는 명문",
    sentences: [
      "I say to you today, my friends, so even though we face the difficulties of today and tomorrow, I still have a dream.",
      "It is a dream deeply rooted in the American dream.",
      "I have a dream that one day this nation will rise up and live out the true meaning of its creed: We hold these truths to be self-evident, that all men are created equal.",
      "I have a dream that my four little children will one day live in a nation where they will not be judged by the color of their skin but by the content of their character.",
      "I have a dream today!"
    ]
  },
  {
    id: "yoondongju-seosi",
    title: "윤동주 - 서시 (Prologue)",
    category: "한국 명시",
    language: "ko-KR",
    description: "순결한 내면의 고백을 노래한 한국인이 가장 사랑하는 시",
    sentences: [
      "죽는 날까지 하늘을 우러러",
      "한 점 부끄럼이 없기를,",
      "잎새에 이는 바람에도 나는 괴로워했다.",
      "별을 노래하는 마음으로",
      "모든 죽어가는 것을 사랑해야지.",
      "그리고 나한테 주어진 길을 걸어가야겠다.",
      "오늘 밤에도 별이 바람에 스치운다."
    ]
  },
  {
    id: "presentation-pitch",
    title: "실전 발표/PT 오프닝 (Impactful Pitch Opening)",
    category: "발표/대본",
    language: "ko-KR",
    description: "청중의 시선을 30초 안에 사로잡는 강력한 프레젠테이션 도입부 템플릿",
    sentences: [
      "안녕하십니까, 오늘 여러분께 우리의 미래를 바꿀 혁신적인 아이디어를 소개해 드릴 발표자입니다.",
      "혹시 여러분은 매일 반복되는 업무 속에서 '더 가치 있는 일에 집중할 순 없을까?' 고민해 보신 적 있으십니까?",
      "우리가 마주한 가장 큰 낭비는 바로 단순 반복에 쓰이는 소중한 시간입니다.",
      "오늘 제가 제시할 솔루션은 바로 그 시간을 여러분께 되돌려 드리는 열쇠입니다.",
      "지금부터 10분간, 상상이 현실이 되는 놀라운 여정에 함께해 주시기 바랍니다.",
      "감사합니다."
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SAMPLE_TEXTS;
}
