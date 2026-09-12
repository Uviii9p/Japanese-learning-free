export interface GrammarPoint {
  id: string;
  title: string;
  meaning: string;
  structure: string;
  explanation: string;
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  category: string;
  examples: { japanese: string; reading: string; english: string }[];
  notes: string[];
  commonMistakes: string[];
  exercises: GrammarExercise[];
}

export interface GrammarExercise {
  type: 'multiple_choice' | 'fill_blank' | 'translate' | 'arrange';
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
}

export const grammarData: GrammarPoint[] = [
  {
    id: 'g001', title: '〜は〜です', meaning: 'Topic marker + to be', jlptLevel: 'N5', category: 'particles',
    structure: '[Topic] は [Noun/Na-adjective] です',
    explanation: 'は (wa) is the topic marker particle. です (desu) is the polite copula meaning "to be". This is the most fundamental sentence structure in Japanese.',
    examples: [
      { japanese: '私は学生です。', reading: 'Watashi wa gakusei desu.', english: 'I am a student.' },
      { japanese: '彼は先生です。', reading: 'Kare wa sensei desu.', english: 'He is a teacher.' },
      { japanese: '東京は大きいです。', reading: 'Toukyou wa ookii desu.', english: 'Tokyo is big.' },
    ],
    notes: ['は is written as "ha" but pronounced "wa" when used as a particle.', 'です makes sentences polite — in casual speech you can drop it.'],
    commonMistakes: ['Don\'t confuse は (topic) with が (subject). は emphasizes what comes after; が emphasizes the topic itself.'],
    exercises: [
      { type: 'multiple_choice', question: 'How do you say "I am Japanese"?', options: ['私は日本人です。', '私が日本人です。', '私を日本人です。', '私に日本人です。'], answer: '私は日本人です。', explanation: 'Use は for the topic (I) and です for "am".' },
      { type: 'translate', question: 'She is a student.', answer: '彼女は学生です。', explanation: '彼女 (she) は (topic) 学生 (student) です (is).' },
    ]
  },
  {
    id: 'g002', title: '〜じゃないです / ではありません', meaning: 'Negative: is not', jlptLevel: 'N5', category: 'copula',
    structure: '[Noun/Na-adj] じゃないです / ではありません',
    explanation: 'To negate です, use じゃないです (casual/semi-polite) or ではありません (formal). Both mean "is not".',
    examples: [
      { japanese: '私は学生じゃないです。', reading: 'Watashi wa gakusei ja nai desu.', english: 'I am not a student.' },
      { japanese: 'これは本ではありません。', reading: 'Kore wa hon dewa arimasen.', english: 'This is not a book.' },
    ],
    notes: ['じゃないです is more casual; ではありません is formal and used in writing/formal speech.'],
    commonMistakes: ['Don\'t say "ではないです" — while technically understood, じゃないです or ではありません are preferred.'],
    exercises: [
      { type: 'fill_blank', question: '彼は先生___。(He is not a teacher)', answer: 'じゃないです', explanation: 'Negate the noun predicate with じゃないです.' },
    ]
  },
  {
    id: 'g003', title: '〜が好きです / 嫌いです', meaning: 'Like / Dislike', jlptLevel: 'N5', category: 'expressions',
    structure: '[Noun/Verb-dictionary] が 好き / 嫌い です',
    explanation: 'Use が to mark what you like or dislike. 好き (suki) = like, 嫌い (kirai) = dislike. Notice Japanese uses が here, not を.',
    examples: [
      { japanese: '私は日本語が好きです。', reading: 'Watashi wa Nihongo ga suki desu.', english: 'I like Japanese.' },
      { japanese: '猫が好きですか？', reading: 'Neko ga suki desu ka?', english: 'Do you like cats?' },
      { japanese: '野菜が嫌いです。', reading: 'Yasai ga kirai desu.', english: 'I dislike vegetables.' },
    ],
    notes: ['が is used instead of を with 好き and 嫌い — this is a common source of mistakes.', 'To say you love something: 大好き (daisuki).'],
    commonMistakes: ['Do NOT say "を好きです" — it must be "が好きです".'],
    exercises: [
      { type: 'multiple_choice', question: 'Which is correct for "I like sushi"?', options: ['寿司を好きです。', '寿司が好きです。', '寿司は好きです。', '寿司に好きです。'], answer: '寿司が好きです。', explanation: '好き (like) always takes が, not を.' },
    ]
  },
  {
    id: 'g004', title: 'Verb ます form', meaning: 'Polite present/future tense', jlptLevel: 'N5', category: 'verbs',
    structure: '[Verb stem] + ます',
    explanation: 'The ます form makes verbs polite. For る-verbs: remove る, add ます. For う-verbs: change the final う sound to its い-row equivalent, then add ます.',
    examples: [
      { japanese: '毎日日本語を勉強します。', reading: 'Mainichi Nihongo o benkyou shimasu.', english: 'I study Japanese every day.' },
      { japanese: '映画を見ます。', reading: 'Eiga o mimasu.', english: 'I watch movies.' },
      { japanese: '音楽を聞きます。', reading: 'Ongaku o kikimasu.', english: 'I listen to music.' },
    ],
    notes: ['ます form is used for polite present and future tense.', 'Negative: ません (masen)', 'Past: ました (mashita)', 'Past negative: ませんでした (masen deshita)'],
    commonMistakes: ['Forgetting to change う-verb endings: 飲む (nomu) → 飲みます (nomimasu) NOT 飲むます.'],
    exercises: [
      { type: 'fill_blank', question: '食べる → polite form: 食べ___', answer: 'ます', explanation: '食べる is a る-verb. Remove る and add ます → 食べます.' },
      { type: 'multiple_choice', question: 'What is the ます form of 飲む (to drink)?', options: ['飲みます', '飲うます', '飲ります', '飲えます'], answer: '飲みます', explanation: 'む → み + ます = 飲みます' },
    ]
  },
  {
    id: 'g005', title: '〜ました / ませんでした', meaning: 'Polite past tense', jlptLevel: 'N5', category: 'verbs',
    structure: '[Verb stem] + ました / ませんでした',
    explanation: 'To express completed past actions in polite speech, change ます → ました (positive) or ません → ませんでした (negative).',
    examples: [
      { japanese: '昨日映画を見ました。', reading: 'Kinou eiga o mimashita.', english: 'I watched a movie yesterday.' },
      { japanese: '今朝ご飯を食べませんでした。', reading: 'Kesa gohan o tabemasen deshita.', english: 'I did not eat breakfast this morning.' },
    ],
    notes: ['ました is often used with time expressions like 昨日 (yesterday), 先週 (last week).'],
    commonMistakes: ['Don\'t say "見ましたか" for "Did you watch?" — this is actually correct! ましたか is the polite past question form.'],
    exercises: [
      { type: 'translate', question: 'I studied Japanese yesterday.', answer: '昨日日本語を勉強しました。', explanation: '昨日 (yesterday) + 勉強しました (studied).' },
    ]
  },
  {
    id: 'g006', title: 'Object Particle を', meaning: 'Direct object marker', jlptLevel: 'N5', category: 'particles',
    structure: '[Object] を [Verb]',
    explanation: 'を (wo/o) marks the direct object of an action — what is being acted upon. It is written "を" but pronounced "o".',
    examples: [
      { japanese: '本を読みます。', reading: 'Hon o yomimasu.', english: 'I read a book.' },
      { japanese: 'コーヒーを飲みます。', reading: 'Koohii o nomimasu.', english: 'I drink coffee.' },
      { japanese: '日本語を勉強します。', reading: 'Nihongo o benkyou shimasu.', english: 'I study Japanese.' },
    ],
    notes: ['を is almost always followed by a verb.', 'It cannot be used with adjectives or です.'],
    commonMistakes: ['Using は instead of を for direct objects. "本は読みます" is technically grammatical but changes the emphasis/meaning.'],
    exercises: [
      { type: 'arrange', question: 'Arrange: 食べます / を / 寿司 / 私は', answer: '私は寿司を食べます。', explanation: 'Topic は + Object を + Verb.' },
    ]
  },
  {
    id: 'g007', title: 'Location Particle に vs で', meaning: 'Location of existence vs. action', jlptLevel: 'N5', category: 'particles',
    structure: '[Place] に [あります/います] | [Place] で [Action verb]',
    explanation: 'に indicates where something exists (あります/います). で indicates where an action takes place.',
    examples: [
      { japanese: '図書館に本があります。', reading: 'Toshokan ni hon ga arimasu.', english: 'There are books in the library.' },
      { japanese: '図書館で勉強します。', reading: 'Toshokan de benkyou shimasu.', english: 'I study at the library.' },
      { japanese: '駅にいます。', reading: 'Eki ni imasu.', english: 'I am at the station.' },
    ],
    notes: ['に = location of existence (static)', 'で = location of action (dynamic)', 'Also: に is used for destinations of movement (行きます, 来ます)'],
    commonMistakes: ['Using で with あります/います — these must use に.'],
    exercises: [
      { type: 'multiple_choice', question: '公園___ 遊びます。(I play in the park)', options: ['に', 'で', 'を', 'が'], answer: 'で', explanation: '遊びます is an action verb, so use で.' },
    ]
  },
  {
    id: 'g008', title: 'あります vs います', meaning: 'Existence of things vs. people/animals', jlptLevel: 'N5', category: 'verbs',
    structure: '[Thing] が あります | [Person/Animal] が います',
    explanation: 'あります is used for inanimate objects. います is used for people and animals.',
    examples: [
      { japanese: 'テーブルの上に本があります。', reading: 'Tēburu no ue ni hon ga arimasu.', english: 'There is a book on the table.' },
      { japanese: '公園に子供がいます。', reading: 'Kouen ni kodomo ga imasu.', english: 'There are children in the park.' },
      { japanese: '猫がいますか？', reading: 'Neko ga imasu ka?', english: 'Is there a cat?' },
    ],
    notes: ['Plants can use either, but あります is more common for plants.', 'Robots/mechanical things use あります.'],
    commonMistakes: ['Using あります for people: "人があります" is wrong — use "人がいます".'],
    exercises: [
      { type: 'multiple_choice', question: '犬が___。(There is a dog)', options: ['あります', 'います', 'できます', 'なります'], answer: 'います', explanation: '犬 (dog) is an animal, so use います.' },
    ]
  },
  {
    id: 'g009', title: 'て-form (連用形)', meaning: 'Connecting actions / request / ongoing', jlptLevel: 'N5', category: 'verbs',
    structure: '[Verb て-form]',
    explanation: 'The て-form is one of the most important verb forms. It is used to connect sequential actions, make requests (〜てください), describe ongoing states (〜ています), and more.',
    examples: [
      { japanese: '食べてください。', reading: 'Tabete kudasai.', english: 'Please eat.' },
      { japanese: '今、勉強しています。', reading: 'Ima, benkyou shite imasu.', english: 'I am studying now.' },
      { japanese: 'シャワーを浴びて、朝ご飯を食べます。', reading: 'Shawaa o abite, asagohan o tabemasu.', english: 'I shower and then eat breakfast.' },
    ],
    notes: ['る-verbs: remove る, add て', 'う-verbs conjugation table needed (see below)', 'Irregular: する→して, くる→きて'],
    commonMistakes: ['Forgetting the irregular て-form conjugations of certain う-verbs (書く→書いて, 飲む→飲んで).'],
    exercises: [
      { type: 'fill_blank', question: '食べる → て-form: 食べ___', answer: 'て', explanation: '食べる is a る-verb. Remove る, add て → 食べて.' },
    ]
  },
  {
    id: 'g010', title: '〜ている', meaning: 'Ongoing action / current state', jlptLevel: 'N5', category: 'verbs',
    structure: '[Verb て-form] + いる',
    explanation: 'Used for: 1) Actions currently in progress (like English -ing). 2) Ongoing states that result from a past action.',
    examples: [
      { japanese: '今、テレビを見ています。', reading: 'Ima, terebi o mite imasu.', english: 'I am watching TV now.' },
      { japanese: '彼は結婚しています。', reading: 'Kare wa kekkon shite imasu.', english: 'He is married.' },
      { japanese: '雨が降っています。', reading: 'Ame ga futte imasu.', english: 'It is raining.' },
    ],
    notes: ['For actions in progress: 読んでいます (reading)', 'For resulting states: 結婚しています (married = result of wedding)'],
    commonMistakes: ['Using ています for ALL situations — some verbs describe states not actions (知っています not 知りません).'],
    exercises: [
      { type: 'translate', question: 'She is eating sushi.', answer: '彼女は寿司を食べています。', explanation: '食べる → 食べて + います = eating.' },
    ]
  },
  {
    id: 'g011', title: '〜てください', meaning: 'Please do ~', jlptLevel: 'N5', category: 'requests',
    structure: '[Verb て-form] + ください',
    explanation: 'Used to make polite requests. More polite than the plain imperative.',
    examples: [
      { japanese: 'ここに書いてください。', reading: 'Koko ni kaite kudasai.', english: 'Please write here.' },
      { japanese: 'ゆっくり話してください。', reading: 'Yukkuri hanashite kudasai.', english: 'Please speak slowly.' },
      { japanese: 'もう一度言ってください。', reading: 'Mou ichido itte kudasai.', english: 'Please say it one more time.' },
    ],
    notes: ['Very common and useful phrase for learners.', 'More polite: 〜ていただけますか'],
    commonMistakes: ['Don\'t use the plain form — 書くください is wrong.'],
    exercises: [
      { type: 'multiple_choice', question: 'How do you say "Please listen"?', options: ['聞くください', '聞いてください', '聞けください', '聞きください'], answer: '聞いてください', explanation: '聞く → て-form is 聞いて + ください.' },
    ]
  },
  {
    id: 'g012', title: '〜たい', meaning: 'Want to ~', jlptLevel: 'N5', category: 'expressions',
    structure: '[Verb stem] + たい',
    explanation: 'Express your own desires. For る-verbs: remove る, add たい. For う-verbs: change to い-row + たい.',
    examples: [
      { japanese: '日本に行きたいです。', reading: 'Nihon ni ikitai desu.', english: 'I want to go to Japan.' },
      { japanese: '寿司を食べたいです。', reading: 'Sushi o tabetai desu.', english: 'I want to eat sushi.' },
      { japanese: '日本語を上手に話したいです。', reading: 'Nihongo o jouzu ni hanashitai desu.', english: 'I want to speak Japanese well.' },
    ],
    notes: ['たい is an い-adjective, so it conjugates like one.', 'Past: たかったです, Negative: たくないです', 'Don\'t use たい for other people\'s desires — use たがっています.'],
    commonMistakes: ['Using たい for third person: "彼は日本に行きたいです" is acceptable in casual speech but technically 行きたがっています is more correct.'],
    exercises: [
      { type: 'fill_blank', question: 'コーヒーを飲み___です。(I want to drink coffee)', answer: 'たい', explanation: '飲む → 飲み + たい = 飲みたい.' },
    ]
  },
  {
    id: 'g013', title: 'い-adjective conjugation', meaning: 'Inflecting い-adjectives', jlptLevel: 'N5', category: 'adjectives',
    structure: '[い-adj]: Remove い → add く + verb',
    explanation: 'い-adjectives can conjugate for tense and negativity. Key patterns: positive present (そのまま), negative (〜くない), past (〜かった), negative past (〜くなかった).',
    examples: [
      { japanese: '今日は寒いです。', reading: 'Kyou wa samui desu.', english: 'Today is cold.' },
      { japanese: '昨日は寒くなかったです。', reading: 'Kinou wa samuku nakatta desu.', english: 'Yesterday was not cold.' },
      { japanese: '大きくて、きれいな家です。', reading: 'Ookikute, kirei na ie desu.', english: 'It is a big, beautiful house.' },
    ],
    notes: ['Exception: いい (good) → よかった (was good), よくない (not good)', 'て-form of い-adj: 〜くて'],
    commonMistakes: ['"いいくない" is wrong — use "よくない" for the negative of いい.'],
    exercises: [
      { type: 'multiple_choice', question: 'What is the past negative of 大きい?', options: ['大きくなかった', '大きじゃなかった', '大きなかった', '大きでなかった'], answer: '大きくなかった', explanation: 'い-adj negative past: remove い, add くなかった.' },
    ]
  },
  {
    id: 'g014', title: 'な-adjective conjugation', meaning: 'Inflecting な-adjectives', jlptLevel: 'N5', category: 'adjectives',
    structure: '[な-adj] + な + noun | [な-adj] + です / じゃない',
    explanation: 'な-adjectives behave more like nouns. When modifying a noun they take な. When used as predicates they use です / じゃない.',
    examples: [
      { japanese: 'きれいな花です。', reading: 'Kirei na hana desu.', english: 'It is a beautiful flower.' },
      { japanese: '彼女はとても親切です。', reading: 'Kanojo wa totemo shinsetsu desu.', english: 'She is very kind.' },
      { japanese: '部屋は静かじゃないです。', reading: 'Heya wa shizuka ja nai desu.', english: 'The room is not quiet.' },
    ],
    notes: ['な-adjectives take じゃない (not くない like い-adj)', 'Common な-adjectives: 好き、嫌い、元気、きれい、静か、有名'],
    commonMistakes: ['Treating な-adj like い-adj: "きれいくない" is wrong — use "きれいじゃない".'],
    exercises: [
      { type: 'fill_blank', question: '静か___ 部屋 (quiet room)', answer: 'な', explanation: 'な-adjectives use な before nouns.' },
    ]
  },
  {
    id: 'g015', title: '〜と思います', meaning: 'I think that ~', jlptLevel: 'N4', category: 'expressions',
    structure: '[Plain form] + と思います',
    explanation: 'Use the plain form (dictionary, nai-form, ta-form) before と思います to express what you think.',
    examples: [
      { japanese: '明日は雨だと思います。', reading: 'Ashita wa ame da to omoimasu.', english: 'I think it will rain tomorrow.' },
      { japanese: '彼は来ないと思います。', reading: 'Kare wa konai to omoimasu.', english: 'I think he won\'t come.' },
    ],
    notes: ['Use plain form, not ます/です form before と思います.'],
    commonMistakes: ['Saying "来ますと思います" — should be "来ると思います" (plain form).'],
    exercises: [
      { type: 'translate', question: 'I think this is delicious.', answer: 'これはおいしいと思います。', explanation: 'おいしい (plain form of い-adj) + と思います.' },
    ]
  },
];

export const grammarByLevel = {
  N5: grammarData.filter(g => g.jlptLevel === 'N5'),
  N4: grammarData.filter(g => g.jlptLevel === 'N4'),
  N3: grammarData.filter(g => g.jlptLevel === 'N3'),
  N2: grammarData.filter(g => g.jlptLevel === 'N2'),
  N1: grammarData.filter(g => g.jlptLevel === 'N1'),
};

export const grammarCategories = [
  { id: 'particles', label: 'Particles', icon: '⚡' },
  { id: 'verbs', label: 'Verbs', icon: '🏃' },
  { id: 'adjectives', label: 'Adjectives', icon: '✨' },
  { id: 'copula', label: 'Copula', icon: '🔗' },
  { id: 'expressions', label: 'Expressions', icon: '💬' },
  { id: 'requests', label: 'Requests', icon: '🙏' },
];
