// Draft curriculum content, structured to match the schema in
// supabase/migrations/0001_init.sql. order_index is assigned from array
// position at seed time, so it's omitted here.

export type Question = {
  prompt_ko?: string;
  prompt_en?: string;
  romanization?: string;
  audio_url?: string;
  image_url?: string;
  options?: string[];
  correct_answer?: string;
};

export type Exercise = {
  exercise_type: "vocab_card" | "multiple_choice" | "listening" | "matching" | "sentence_build";
  questions: Question[];
};

export type Lesson = {
  name: string;
  lesson_type: "standard" | "unlock_game";
  unlock_threshold_pct?: number;
  exercises: Exercise[];
};

export type Unit = {
  name: string;
  slug: string;
  icon: string;
  lessons: Lesson[];
};

export type Level = {
  name: string;
  slug: string;
  description?: string;
  units: Unit[];
};

export const CONTENT: Level[] = [
  {
    name: "Beginner",
    slug: "beginner",
    description: "Sogang 1A/1B equivalent",
    units: [
      {
        name: "안녕하세요? (Greetings & Self-Introduction)",
        slug: "greetings",
        icon: "wave",
        lessons: [
          {
            name: "인사하기 (Saying Hello)",
            lesson_type: "standard",
            exercises: [
              {
                exercise_type: "vocab_card",
                questions: [
                  { prompt_ko: "안녕하세요?", romanization: "annyeonghaseyo?", prompt_en: "Hello", audio_url: "/audio/u1/annyeonghaseyo.mp3" },
                  { prompt_ko: "반가워요", romanization: "bangawoyo", prompt_en: "Nice to meet you", audio_url: "/audio/u1/bangawoyo.mp3" },
                  { prompt_ko: "안녕히 가세요", romanization: "annyeonghi gaseyo", prompt_en: "Goodbye (to person leaving)", audio_url: "/audio/u1/annyeonghi-gaseyo.mp3" },
                  { prompt_ko: "안녕히 계세요", romanization: "annyeonghi gyeseyo", prompt_en: "Goodbye (to person staying)", audio_url: "/audio/u1/annyeonghi-gyeseyo.mp3" },
                ],
              },
              {
                exercise_type: "multiple_choice",
                questions: [
                  {
                    prompt_en: "You're leaving your teacher's office, and the teacher stays behind. What do you say?",
                    options: ["안녕히 가세요", "안녕히 계세요", "반가워요"],
                    correct_answer: "안녕히 계세요",
                  },
                ],
              },
            ],
          },
          {
            name: "이름과 나라 (Name & Country)",
            lesson_type: "standard",
            exercises: [
              {
                exercise_type: "vocab_card",
                questions: [
                  { prompt_ko: "저는 [이름]이에요/예요", romanization: "jeoneun [ireum]-ieyo/yeyo", prompt_en: "I'm [name]", audio_url: "/audio/u1/jeoneun-ieyo.mp3" },
                  { prompt_ko: "이름이 뭐예요?", romanization: "ireumi mwoyeyo?", prompt_en: "What's your name?", audio_url: "/audio/u1/ireumi-mwoyeyo.mp3" },
                  { prompt_ko: "어느 나라 사람이에요?", romanization: "eoneu nara saramieyo?", prompt_en: "What country are you from?", audio_url: "/audio/u1/eoneu-nara.mp3" },
                  { prompt_ko: "저는 미국 사람이에요", romanization: "jeoneun miguk saramieyo", prompt_en: "I'm American", audio_url: "/audio/u1/miguk-saram.mp3" },
                ],
              },
              {
                exercise_type: "sentence_build",
                questions: [
                  { prompt_en: "Build: \"I'm Sarah.\" (name ends in a vowel sound, so use 예요, not 이에요)", options: ["저는", "사라", "예요"], correct_answer: "저는 사라예요" },
                  { prompt_en: "Build: \"What country are you from?\"", options: ["어느", "나라", "사람이에요?"], correct_answer: "어느 나라 사람이에요?" },
                ],
              },
              {
                exercise_type: "listening",
                questions: [
                  { audio_url: "/audio/u1/eoneu-nara.mp3", prompt_en: "What did you hear?", options: ["이름이 뭐예요?", "어느 나라 사람이에요?", "반가워요"], correct_answer: "어느 나라 사람이에요?" },
                ],
              },
            ],
          },
          {
            name: "역할극: 첫 만남 (Unlock Game: First Meeting Roleplay)",
            lesson_type: "unlock_game",
            unlock_threshold_pct: 80,
            exercises: [
              {
                exercise_type: "matching",
                questions: [
                  { prompt_ko: "안녕하세요?", correct_answer: "Hello" },
                  { prompt_ko: "이름이 뭐예요?", correct_answer: "What's your name?" },
                  { prompt_ko: "어느 나라 사람이에요?", correct_answer: "What country are you from?" },
                  { prompt_ko: "만나서 반가워요", correct_answer: "Nice to meet you" },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "이게 뭐예요? (What is this?)",
        slug: "objects",
        icon: "box",
        lessons: [
          {
            name: "이거/그거/저거 (This / That / That over there)",
            lesson_type: "standard",
            exercises: [
              {
                exercise_type: "vocab_card",
                questions: [
                  { prompt_ko: "이거", romanization: "igeo", prompt_en: "this (near me)", audio_url: "/audio/u2/igeo.mp3" },
                  { prompt_ko: "그거", romanization: "geugeo", prompt_en: "that (near you)", audio_url: "/audio/u2/geugeo.mp3" },
                  { prompt_ko: "저거", romanization: "jeogeo", prompt_en: "that over there (far from both)", audio_url: "/audio/u2/jeogeo.mp3" },
                  { prompt_ko: "이게 뭐예요?", romanization: "ige mwoyeyo?", prompt_en: "What is this?", audio_url: "/audio/u2/ige-mwoyeyo.mp3" },
                ],
              },
              {
                exercise_type: "multiple_choice",
                questions: [
                  {
                    prompt_en: "You're holding an object and asking your friend what it is. Which phrase do you use?",
                    options: ["그게 뭐예요?", "이게 뭐예요?", "저게 뭐예요?"],
                    correct_answer: "이게 뭐예요?",
                  },
                ],
              },
            ],
          },
          {
            name: "교실 물건 (Classroom Objects)",
            lesson_type: "standard",
            exercises: [
              {
                exercise_type: "vocab_card",
                questions: [
                  { prompt_ko: "책", romanization: "chaek", prompt_en: "book", audio_url: "/audio/u2/chaek.mp3" },
                  { prompt_ko: "가방", romanization: "gabang", prompt_en: "bag", audio_url: "/audio/u2/gabang.mp3" },
                  { prompt_ko: "볼펜", romanization: "bolpen", prompt_en: "pen", audio_url: "/audio/u2/bolpen.mp3" },
                  { prompt_ko: "시계", romanization: "sigye", prompt_en: "watch / clock", audio_url: "/audio/u2/sigye.mp3" },
                ],
              },
              {
                exercise_type: "sentence_build",
                questions: [
                  { prompt_en: "Build: \"This is a book.\"", options: ["이거는", "책", "이에요"], correct_answer: "이거는 책이에요" },
                  { prompt_en: "Build: \"That (over there) is a bag.\"", options: ["저거는", "가방", "이에요"], correct_answer: "저거는 가방이에요" },
                ],
              },
              {
                exercise_type: "listening",
                questions: [
                  { audio_url: "/audio/u2/bolpen.mp3", prompt_en: "What did you hear?", options: ["볼펜", "가방", "시계"], correct_answer: "볼펜" },
                ],
              },
            ],
          },
          {
            name: "물건 맞추기 (Unlock Game: Object Match)",
            lesson_type: "unlock_game",
            unlock_threshold_pct: 80,
            exercises: [
              {
                exercise_type: "matching",
                questions: [
                  { prompt_ko: "책", correct_answer: "book" },
                  { prompt_ko: "가방", correct_answer: "bag" },
                  { prompt_ko: "볼펜", correct_answer: "pen" },
                  { prompt_ko: "시계", correct_answer: "watch/clock" },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "화장실이 어디에 있어요? (Where's the bathroom?)",
        slug: "locations",
        icon: "map-pin",
        lessons: [
          {
            name: "있어요/없어요 (There is / isn't)",
            lesson_type: "standard",
            exercises: [
              {
                exercise_type: "vocab_card",
                questions: [
                  { prompt_ko: "있어요", romanization: "isseoyo", prompt_en: "there is / to have", audio_url: "/audio/u3/isseoyo.mp3" },
                  { prompt_ko: "없어요", romanization: "eopseoyo", prompt_en: "there isn't / to not have", audio_url: "/audio/u3/eopseoyo.mp3" },
                  { prompt_ko: "화장실", romanization: "hwajangsil", prompt_en: "bathroom", audio_url: "/audio/u3/hwajangsil.mp3" },
                  { prompt_ko: "어디에 있어요?", romanization: "eodie isseoyo?", prompt_en: "Where is it?", audio_url: "/audio/u3/eodie-isseoyo.mp3" },
                ],
              },
              {
                exercise_type: "multiple_choice",
                questions: [
                  {
                    prompt_en: "Someone asks if you have an umbrella, but you don't. How do you answer?",
                    options: ["있어요", "없어요", "어디에 있어요?"],
                    correct_answer: "없어요",
                  },
                ],
              },
            ],
          },
          {
            name: "위치 표현 (Position Words)",
            lesson_type: "standard",
            exercises: [
              {
                exercise_type: "vocab_card",
                questions: [
                  { prompt_ko: "위", romanization: "wi", prompt_en: "above / on top", audio_url: "/audio/u3/wi.mp3" },
                  { prompt_ko: "아래", romanization: "arae", prompt_en: "below / under", audio_url: "/audio/u3/arae.mp3" },
                  { prompt_ko: "옆", romanization: "yeop", prompt_en: "next to", audio_url: "/audio/u3/yeop.mp3" },
                  { prompt_ko: "앞", romanization: "ap", prompt_en: "in front of", audio_url: "/audio/u3/ap.mp3" },
                ],
              },
              {
                exercise_type: "sentence_build",
                questions: [
                  { prompt_en: "Build: \"The bathroom is next to the classroom.\"", options: ["화장실이", "교실", "옆에", "있어요"], correct_answer: "화장실이 교실 옆에 있어요" },
                ],
              },
              {
                exercise_type: "listening",
                questions: [
                  { audio_url: "/audio/u3/eodie-isseoyo.mp3", prompt_en: "What did you hear?", options: ["어디에 있어요?", "뭐예요?", "이름이 뭐예요?"], correct_answer: "어디에 있어요?" },
                ],
              },
            ],
          },
          {
            name: "길 찾기 (Unlock Game: Find the Location)",
            lesson_type: "unlock_game",
            unlock_threshold_pct: 80,
            exercises: [
              {
                exercise_type: "matching",
                questions: [
                  { prompt_ko: "화장실이 어디에 있어요?", correct_answer: "Where's the bathroom?" },
                  { prompt_ko: "책상 위에 있어요", correct_answer: "It's on the desk" },
                  { prompt_ko: "가방 옆에 있어요", correct_answer: "It's next to the bag" },
                  { prompt_ko: "없어요", correct_answer: "There isn't one" },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "오늘 뭐 해요? (What are you doing today?)",
        slug: "daily-activities",
        icon: "calendar-check",
        lessons: [
          {
            name: "-아/어요 동사 활용 (Verb Conjugation)",
            lesson_type: "standard",
            exercises: [
              {
                exercise_type: "vocab_card",
                questions: [
                  { prompt_ko: "가다 → 가요", romanization: "gada → gayo", prompt_en: "to go → go(es)", audio_url: "/audio/u4/gayo.mp3" },
                  { prompt_ko: "먹다 → 먹어요", romanization: "meokda → meogeoyo", prompt_en: "to eat → eat(s)", audio_url: "/audio/u4/meogeoyo.mp3" },
                  { prompt_ko: "읽다 → 읽어요", romanization: "ilkda → ilgeoyo", prompt_en: "to read → read(s)", audio_url: "/audio/u4/ilgeoyo.mp3" },
                  { prompt_ko: "공부하다 → 공부해요", romanization: "gongbuhada → gongbuhaeyo", prompt_en: "to study → study/studies", audio_url: "/audio/u4/gongbuhaeyo.mp3" },
                ],
              },
              {
                exercise_type: "multiple_choice",
                questions: [
                  {
                    prompt_en: "Conjugate 오다 (to come) into -아/어요 form. Stem vowel is ㅗ, so...",
                    options: ["오어요", "와요", "오해요"],
                    correct_answer: "와요",
                  },
                ],
              },
            ],
          },
          {
            name: "하루 일과 (Daily Routine)",
            lesson_type: "standard",
            exercises: [
              {
                exercise_type: "sentence_build",
                questions: [
                  { prompt_en: "Build: \"I eat breakfast.\"", options: ["아침을", "먹어요"], correct_answer: "아침을 먹어요" },
                  { prompt_en: "Build: \"I study Korean today.\"", options: ["오늘", "한국어를", "공부해요"], correct_answer: "오늘 한국어를 공부해요" },
                ],
              },
              {
                exercise_type: "listening",
                questions: [
                  { audio_url: "/audio/u4/gongbuhaeyo.mp3", prompt_en: "What did you hear?", options: ["공부해요", "가요", "먹어요"], correct_answer: "공부해요" },
                ],
              },
            ],
          },
          {
            name: "동사 짝짓기 (Unlock Game: Verb Match)",
            lesson_type: "unlock_game",
            unlock_threshold_pct: 80,
            exercises: [
              {
                exercise_type: "matching",
                questions: [
                  { prompt_ko: "가요", correct_answer: "go(es)" },
                  { prompt_ko: "먹어요", correct_answer: "eat(s)" },
                  { prompt_ko: "읽어요", correct_answer: "read(s)" },
                  { prompt_ko: "공부해요", correct_answer: "study/studies" },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "무슨 요일이에요? (What day is it?)",
        slug: "days-numbers",
        icon: "calendar",
        lessons: [
          {
            name: "숫자 1-10 (Sino-Korean Numbers)",
            lesson_type: "standard",
            exercises: [
              {
                exercise_type: "vocab_card",
                questions: [
                  { prompt_ko: "일", romanization: "il", prompt_en: "1", audio_url: "/audio/u5/il.mp3" },
                  { prompt_ko: "이", romanization: "i", prompt_en: "2", audio_url: "/audio/u5/i.mp3" },
                  { prompt_ko: "삼", romanization: "sam", prompt_en: "3", audio_url: "/audio/u5/sam.mp3" },
                  { prompt_ko: "사", romanization: "sa", prompt_en: "4", audio_url: "/audio/u5/sa.mp3" },
                  { prompt_ko: "오", romanization: "o", prompt_en: "5", audio_url: "/audio/u5/o.mp3" },
                ],
              },
              {
                exercise_type: "multiple_choice",
                questions: [
                  { prompt_en: "Which number is 삼?", options: ["2", "3", "4"], correct_answer: "3" },
                ],
              },
            ],
          },
          {
            name: "요일과 날짜 (Days & Dates)",
            lesson_type: "standard",
            exercises: [
              {
                exercise_type: "vocab_card",
                questions: [
                  { prompt_ko: "월요일", romanization: "woryoil", prompt_en: "Monday", audio_url: "/audio/u5/woryoil.mp3" },
                  { prompt_ko: "화요일", romanization: "hwayoil", prompt_en: "Tuesday", audio_url: "/audio/u5/hwayoil.mp3" },
                  { prompt_ko: "무슨 요일이에요?", romanization: "museun yoirieyo?", prompt_en: "What day is it?", audio_url: "/audio/u5/museun-yoil.mp3" },
                  { prompt_ko: "오늘은 [요일]이에요", romanization: "oneureun [yoil]-ieyo", prompt_en: "Today is [day]", audio_url: "/audio/u5/oneureun.mp3" },
                ],
              },
              {
                exercise_type: "sentence_build",
                questions: [
                  { prompt_en: "Build: \"Today is Monday.\"", options: ["오늘은", "월요일", "이에요"], correct_answer: "오늘은 월요일이에요" },
                ],
              },
              {
                exercise_type: "listening",
                questions: [
                  { audio_url: "/audio/u5/hwayoil.mp3", prompt_en: "What did you hear?", options: ["월요일", "화요일", "무슨 요일"], correct_answer: "화요일" },
                ],
              },
            ],
          },
          {
            name: "달력 게임 (Unlock Game: Calendar Game)",
            lesson_type: "unlock_game",
            unlock_threshold_pct: 80,
            exercises: [
              {
                exercise_type: "matching",
                questions: [
                  { prompt_ko: "월요일", correct_answer: "Monday" },
                  { prompt_ko: "화요일", correct_answer: "Tuesday" },
                  { prompt_ko: "일", correct_answer: "1" },
                  { prompt_ko: "삼", correct_answer: "3" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Elementary",
    slug: "elementary",
    description: "Sogang 2A/2B equivalent",
    units: [
      {
        name: "식당에서 (At the Restaurant)",
        slug: "restaurant",
        icon: "utensils",
        lessons: [
          {
            name: "-고 싶어요 (I want to...)",
            lesson_type: "standard",
            exercises: [
              {
                exercise_type: "vocab_card",
                questions: [
                  { prompt_ko: "메뉴", romanization: "menyu", prompt_en: "menu", audio_url: "/audio/l2u1/menyu.mp3" },
                  { prompt_ko: "배고파요", romanization: "baegopayo", prompt_en: "I'm hungry", audio_url: "/audio/l2u1/baegopayo.mp3" },
                  { prompt_ko: "맛있어요", romanization: "masisseoyo", prompt_en: "It's delicious", audio_url: "/audio/l2u1/masisseoyo.mp3" },
                  { prompt_ko: "비빔밥을 먹고 싶어요", romanization: "bibimbabeul meokgo sipeoyo", prompt_en: "I want to eat bibimbap", audio_url: "/audio/l2u1/bibimbap.mp3" },
                ],
              },
              {
                exercise_type: "sentence_build",
                questions: [
                  { prompt_en: "Build: \"I want to eat bibimbap.\"", options: ["비빔밥을", "먹고", "싶어요"], correct_answer: "비빔밥을 먹고 싶어요" },
                ],
              },
            ],
          },
          {
            name: "-(으)ㄹ까요? (Shall we...?)",
            lesson_type: "standard",
            exercises: [
              {
                exercise_type: "vocab_card",
                questions: [
                  { prompt_ko: "뭘 주문할까요?", romanization: "mwol jumunhalkkayo?", prompt_en: "What shall we order?", audio_url: "/audio/l2u1/jumunhalkkayo.mp3" },
                  { prompt_ko: "계산서 주세요", romanization: "gyesanseo juseyo", prompt_en: "Check, please", audio_url: "/audio/l2u1/gyesanseo.mp3" },
                ],
              },
              {
                exercise_type: "multiple_choice",
                questions: [
                  {
                    prompt_en: "You're at a restaurant with a friend and want to suggest ordering bibimbap together. Which do you say?",
                    options: ["비빔밥을 먹고 싶어요", "비빔밥을 먹을까요?", "비빔밥이 맛있어요"],
                    correct_answer: "비빔밥을 먹을까요?",
                  },
                ],
              },
              {
                exercise_type: "listening",
                questions: [
                  { audio_url: "/audio/l2u1/gyesanseo.mp3", prompt_en: "What did you hear?", options: ["메뉴 주세요", "계산서 주세요", "물 주세요"], correct_answer: "계산서 주세요" },
                ],
              },
            ],
          },
          {
            name: "주문하기 (Unlock Game: Ordering Roleplay)",
            lesson_type: "unlock_game",
            unlock_threshold_pct: 80,
            exercises: [
              {
                exercise_type: "matching",
                questions: [
                  { prompt_ko: "메뉴", correct_answer: "menu" },
                  { prompt_ko: "배고파요", correct_answer: "I'm hungry" },
                  { prompt_ko: "맛있어요", correct_answer: "It's delicious" },
                  { prompt_ko: "계산서 주세요", correct_answer: "Check, please" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Intermediate",
    slug: "intermediate",
    description: "Sogang 3A/3B equivalent",
    units: [
      {
        name: "제 생각에는... (In My Opinion)",
        slug: "opinions",
        icon: "message-circle",
        lessons: [
          {
            name: "-는/-(으)ㄴ 것 같아요 (It seems...)",
            lesson_type: "standard",
            exercises: [
              {
                exercise_type: "vocab_card",
                questions: [
                  { prompt_ko: "제 생각에는", romanization: "je saenggagieneun", prompt_en: "In my opinion", audio_url: "/audio/l3u1/je-saenggak.mp3" },
                  { prompt_ko: "이 영화가 재미있는 것 같아요", romanization: "i yeonghwaga jaemiinneun geot gatayo", prompt_en: "I think this movie seems interesting", audio_url: "/audio/l3u1/jaemiitneun.mp3" },
                  { prompt_ko: "동의해요", romanization: "dong-uihaeyo", prompt_en: "I agree", audio_url: "/audio/l3u1/donguihaeyo.mp3" },
                  { prompt_ko: "반대해요", romanization: "bandaehaeyo", prompt_en: "I disagree", audio_url: "/audio/l3u1/bandaehaeyo.mp3" },
                ],
              },
              {
                exercise_type: "multiple_choice",
                questions: [
                  {
                    prompt_en: "You want to politely say you think the exam was difficult (어렵다 is a descriptive adjective). Which is correct?",
                    options: ["시험이 어려운 것 같아요", "시험이 어렵는 것 같아요", "시험이 어려워요 것 같아요"],
                    correct_answer: "시험이 어려운 것 같아요",
                  },
                ],
              },
            ],
          },
          {
            name: "의견 말하기 (Stating & Supporting Opinions)",
            lesson_type: "standard",
            exercises: [
              {
                exercise_type: "sentence_build",
                questions: [
                  { prompt_en: "Build: \"I agree with that opinion.\"", options: ["저는", "그 의견에", "동의해요"], correct_answer: "저는 그 의견에 동의해요" },
                ],
              },
              {
                exercise_type: "listening",
                questions: [
                  { audio_url: "/audio/l3u1/je-saenggak.mp3", prompt_en: "What did you hear?", options: ["제 생각에는", "동의해요", "반대해요"], correct_answer: "제 생각에는" },
                ],
              },
            ],
          },
          {
            name: "토론 게임 (Unlock Game: Mini Debate Match)",
            lesson_type: "unlock_game",
            unlock_threshold_pct: 80,
            exercises: [
              {
                exercise_type: "matching",
                questions: [
                  { prompt_ko: "제 생각에는", correct_answer: "In my opinion" },
                  { prompt_ko: "동의해요", correct_answer: "I agree" },
                  { prompt_ko: "반대해요", correct_answer: "I disagree" },
                  { prompt_ko: "왜냐하면", correct_answer: "because" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Upper-Intermediate",
    slug: "upper-intermediate",
    description: "Sogang 4A/4B equivalent",
    units: [
      {
        name: "조언하기 (Giving Advice)",
        slug: "giving-advice",
        icon: "heart-pulse",
        lessons: [
          {
            name: "-는 게 좋겠어요 (It would be good to...)",
            lesson_type: "standard",
            exercises: [
              {
                exercise_type: "vocab_card",
                questions: [
                  { prompt_ko: "스트레스", romanization: "seuteureseu", prompt_en: "stress", audio_url: "/audio/l4u1/seuteureseu.mp3" },
                  { prompt_ko: "습관", romanization: "seupgwan", prompt_en: "habit", audio_url: "/audio/l4u1/seupgwan.mp3" },
                  { prompt_ko: "건강", romanization: "geon-gang", prompt_en: "health", audio_url: "/audio/l4u1/geongang.mp3" },
                  { prompt_ko: "스트레스를 줄이는 게 좋겠어요", romanization: "seuteureseureul jurineun ge jokesseoyo", prompt_en: "It would be good to reduce your stress", audio_url: "/audio/l4u1/julineun-ge.mp3" },
                ],
              },
              {
                exercise_type: "sentence_build",
                questions: [
                  { prompt_en: "Build: \"It would be good to exercise.\"", options: ["운동을", "하는 게", "좋겠어요"], correct_answer: "운동을 하는 게 좋겠어요" },
                ],
              },
            ],
          },
          {
            name: "-도록 하다 (Make sure to...)",
            lesson_type: "standard",
            exercises: [
              {
                exercise_type: "vocab_card",
                questions: [
                  { prompt_ko: "잠을 충분히 자도록 하세요", romanization: "jameul chungbunhi jadorok haseyo", prompt_en: "Make sure to get enough sleep", audio_url: "/audio/l4u1/jadorok-haseyo.mp3" },
                ],
              },
              {
                exercise_type: "multiple_choice",
                questions: [
                  {
                    prompt_en: "You're a doctor telling a patient to make sure they exercise regularly. Which form fits the register?",
                    options: ["운동을 하도록 하세요", "운동을 하고 싶어요", "운동을 할까요?"],
                    correct_answer: "운동을 하도록 하세요",
                  },
                ],
              },
              {
                exercise_type: "listening",
                questions: [
                  { audio_url: "/audio/l4u1/jadorok-haseyo.mp3", prompt_en: "What did you hear?", options: ["운동을 하도록 하세요", "잠을 충분히 자도록 하세요", "스트레스를 줄이는 게 좋겠어요"], correct_answer: "잠을 충분히 자도록 하세요" },
                ],
              },
            ],
          },
          {
            name: "상담 롤플레이 (Unlock Game: Counseling Roleplay)",
            lesson_type: "unlock_game",
            unlock_threshold_pct: 80,
            exercises: [
              {
                exercise_type: "matching",
                questions: [
                  { prompt_ko: "스트레스", correct_answer: "stress" },
                  { prompt_ko: "습관", correct_answer: "habit" },
                  { prompt_ko: "건강", correct_answer: "health" },
                  { prompt_ko: "운동을 하도록 하세요", correct_answer: "Make sure to exercise" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Advanced",
    slug: "advanced",
    description: "Sogang 5A/5B equivalent",
    units: [
      {
        name: "사자성어 (Four-Character Idioms)",
        slug: "idioms",
        icon: "scroll-text",
        lessons: [
          {
            name: "사자성어 소개 (Intro to Idioms)",
            lesson_type: "standard",
            exercises: [
              {
                exercise_type: "vocab_card",
                questions: [
                  { prompt_ko: "일석이조", romanization: "ilseogijo", prompt_en: "Kill two birds with one stone (lit. one stone, two birds)", audio_url: "/audio/l5u1/ilseogijo.mp3" },
                  { prompt_ko: "유비무환", romanization: "yubimuhwan", prompt_en: "Being prepared prevents disaster", audio_url: "/audio/l5u1/yubimuhwan.mp3" },
                  { prompt_ko: "온고지신", romanization: "ongojisin", prompt_en: "Learn from the old to understand the new", audio_url: "/audio/l5u1/ongojisin.mp3" },
                  { prompt_ko: "자업자득", romanization: "jaeopjadeuk", prompt_en: "Reap what you sow", audio_url: "/audio/l5u1/jaeopjadeuk.mp3" },
                ],
              },
            ],
          },
          {
            name: "상황에 맞는 사자성어 (Using Idioms in Context)",
            lesson_type: "standard",
            exercises: [
              {
                exercise_type: "multiple_choice",
                questions: [
                  {
                    prompt_en: "Your friend studies old textbooks carefully in order to understand new trends. Which idiom fits?",
                    options: ["온고지신", "일석이조", "자업자득"],
                    correct_answer: "온고지신",
                  },
                ],
              },
              {
                exercise_type: "sentence_build",
                questions: [
                  { prompt_en: "Fill the blank: \"그는 항상 준비를 철저히 해요. 정말 ___이에요.\" (He always prepares thoroughly. That's truly ___.)", options: ["유비무환", "일석이조", "자업자득"], correct_answer: "유비무환" },
                ],
              },
              {
                exercise_type: "listening",
                questions: [
                  { audio_url: "/audio/l5u1/ilseogijo.mp3", prompt_en: "What did you hear?", options: ["일석이조", "온고지신", "자업자득"], correct_answer: "일석이조" },
                ],
              },
            ],
          },
          {
            name: "사자성어 매칭 (Unlock Game: Idiom Match)",
            lesson_type: "unlock_game",
            unlock_threshold_pct: 80,
            exercises: [
              {
                exercise_type: "matching",
                questions: [
                  { prompt_ko: "일석이조", correct_answer: "Kill two birds with one stone" },
                  { prompt_ko: "유비무환", correct_answer: "Being prepared prevents disaster" },
                  { prompt_ko: "온고지신", correct_answer: "Learn from the old to understand the new" },
                  { prompt_ko: "자업자득", correct_answer: "Reap what you sow" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
