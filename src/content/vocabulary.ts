export interface VocabItem {
  id: string;
  japanese: string;
  reading: string;
  meaning: string;
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  partOfSpeech: string;
  category: string;
  examples: { japanese: string; reading: string; english: string }[];
  tags: string[];
}

export const vocabularyData: VocabItem[] = [
  // Greetings
  { id: 'v001', japanese: 'こんにちは', reading: 'konnichiwa', meaning: 'Hello / Good afternoon', jlptLevel: 'N5', partOfSpeech: 'expression', category: 'greetings', examples: [{ japanese: 'こんにちは！元気ですか？', reading: 'Konnichiwa! Genki desu ka?', english: 'Hello! How are you?' }], tags: ['greeting', 'basic'] },
  { id: 'v002', japanese: 'おはようございます', reading: 'ohayou gozaimasu', meaning: 'Good morning (polite)', jlptLevel: 'N5', partOfSpeech: 'expression', category: 'greetings', examples: [{ japanese: 'おはようございます、先生。', reading: 'Ohayou gozaimasu, sensei.', english: 'Good morning, teacher.' }], tags: ['greeting', 'polite', 'morning'] },
  { id: 'v003', japanese: 'こんばんは', reading: 'konbanwa', meaning: 'Good evening', jlptLevel: 'N5', partOfSpeech: 'expression', category: 'greetings', examples: [{ japanese: 'こんばんは！今日はいい天気でしたね。', reading: 'Konbanwa! Kyou wa ii tenki deshita ne.', english: 'Good evening! The weather was nice today.' }], tags: ['greeting', 'evening'] },
  { id: 'v004', japanese: 'さようなら', reading: 'sayounara', meaning: 'Goodbye', jlptLevel: 'N5', partOfSpeech: 'expression', category: 'greetings', examples: [{ japanese: 'では、さようなら。', reading: 'Dewa, sayounara.', english: 'Well then, goodbye.' }], tags: ['farewell', 'basic'] },
  { id: 'v005', japanese: 'ありがとう', reading: 'arigatou', meaning: 'Thank you', jlptLevel: 'N5', partOfSpeech: 'expression', category: 'greetings', examples: [{ japanese: 'ありがとうございます。', reading: 'Arigatou gozaimasu.', english: 'Thank you very much.' }], tags: ['gratitude', 'basic'] },
  { id: 'v006', japanese: 'すみません', reading: 'sumimasen', meaning: 'Excuse me / Sorry', jlptLevel: 'N5', partOfSpeech: 'expression', category: 'greetings', examples: [{ japanese: 'すみません、駅はどこですか？', reading: 'Sumimasen, eki wa doko desu ka?', english: 'Excuse me, where is the station?' }], tags: ['apology', 'polite', 'basic'] },
  // Numbers
  { id: 'v010', japanese: 'いち', reading: 'ichi', meaning: 'one (1)', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'numbers', examples: [{ japanese: 'りんごが一つあります。', reading: 'Ringo ga hitotsu arimasu.', english: 'There is one apple.' }], tags: ['number', 'counting'] },
  { id: 'v011', japanese: 'に', reading: 'ni', meaning: 'two (2)', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'numbers', examples: [{ japanese: '二人の学生がいます。', reading: 'Futari no gakusei ga imasu.', english: 'There are two students.' }], tags: ['number', 'counting'] },
  { id: 'v012', japanese: 'さん', reading: 'san', meaning: 'three (3)', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'numbers', examples: [{ japanese: '三時に会いましょう。', reading: 'San-ji ni aimashou.', english: "Let's meet at three o'clock." }], tags: ['number', 'counting'] },
  { id: 'v013', japanese: 'よん / し', reading: 'yon / shi', meaning: 'four (4)', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'numbers', examples: [{ japanese: '四月は春です。', reading: 'Shigatsu wa haru desu.', english: 'April is spring.' }], tags: ['number', 'counting'] },
  { id: 'v014', japanese: 'ご', reading: 'go', meaning: 'five (5)', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'numbers', examples: [{ japanese: '五分待ってください。', reading: 'Go-fun matte kudasai.', english: 'Please wait five minutes.' }], tags: ['number', 'counting'] },
  { id: 'v015', japanese: 'ろく', reading: 'roku', meaning: 'six (6)', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'numbers', examples: [], tags: ['number'] },
  { id: 'v016', japanese: 'なな / しち', reading: 'nana / shichi', meaning: 'seven (7)', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'numbers', examples: [], tags: ['number'] },
  { id: 'v017', japanese: 'はち', reading: 'hachi', meaning: 'eight (8)', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'numbers', examples: [], tags: ['number'] },
  { id: 'v018', japanese: 'きゅう / く', reading: 'kyuu / ku', meaning: 'nine (9)', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'numbers', examples: [], tags: ['number'] },
  { id: 'v019', japanese: 'じゅう', reading: 'juu', meaning: 'ten (10)', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'numbers', examples: [], tags: ['number'] },
  // Food
  { id: 'v030', japanese: '食べる', reading: 'taberu', meaning: 'to eat', jlptLevel: 'N5', partOfSpeech: 'verb (る)', category: 'food', examples: [{ japanese: '私は毎日寿司を食べます。', reading: 'Watashi wa mainichi sushi o tabemasu.', english: 'I eat sushi every day.' }, { japanese: '何を食べたいですか？', reading: 'Nani o tabetai desu ka?', english: 'What do you want to eat?' }], tags: ['verb', 'food', 'basic'] },
  { id: 'v031', japanese: '飲む', reading: 'nomu', meaning: 'to drink', jlptLevel: 'N5', partOfSpeech: 'verb (う)', category: 'food', examples: [{ japanese: 'コーヒーを飲みます。', reading: 'Kōhī o nomimasu.', english: 'I drink coffee.' }], tags: ['verb', 'food', 'basic'] },
  { id: 'v032', japanese: '水', reading: 'mizu', meaning: 'water', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'food', examples: [{ japanese: '水を一杯ください。', reading: 'Mizu o ippai kudasai.', english: 'Please give me a glass of water.' }], tags: ['drink', 'food', 'basic'] },
  { id: 'v033', japanese: 'ご飯', reading: 'gohan', meaning: 'rice / meal', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'food', examples: [{ japanese: '朝ご飯を食べましたか？', reading: 'Asa gohan o tabemashita ka?', english: 'Did you eat breakfast?' }], tags: ['food', 'basic'] },
  { id: 'v034', japanese: 'パン', reading: 'pan', meaning: 'bread', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'food', examples: [{ japanese: '毎朝パンを食べます。', reading: 'Maiasa pan o tabemasu.', english: 'I eat bread every morning.' }], tags: ['food', 'katakana'] },
  { id: 'v035', japanese: '肉', reading: 'niku', meaning: 'meat', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'food', examples: [{ japanese: '肉が好きです。', reading: 'Niku ga suki desu.', english: 'I like meat.' }], tags: ['food', 'basic'] },
  { id: 'v036', japanese: '魚', reading: 'sakana', meaning: 'fish', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'food', examples: [{ japanese: '魚を食べます。', reading: 'Sakana o tabemasu.', english: 'I eat fish.' }], tags: ['food', 'basic'] },
  { id: 'v037', japanese: '野菜', reading: 'yasai', meaning: 'vegetables', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'food', examples: [{ japanese: '野菜は体にいいです。', reading: 'Yasai wa karada ni ii desu.', english: 'Vegetables are good for the body.' }], tags: ['food', 'healthy'] },
  // People & Family
  { id: 'v050', japanese: '私', reading: 'watashi', meaning: 'I / me', jlptLevel: 'N5', partOfSpeech: 'pronoun', category: 'pronouns', examples: [{ japanese: '私は学生です。', reading: 'Watashi wa gakusei desu.', english: 'I am a student.' }], tags: ['pronoun', 'basic', 'person'] },
  { id: 'v051', japanese: 'あなた', reading: 'anata', meaning: 'you', jlptLevel: 'N5', partOfSpeech: 'pronoun', category: 'pronouns', examples: [{ japanese: 'あなたの名前は何ですか？', reading: 'Anata no namae wa nan desu ka?', english: 'What is your name?' }], tags: ['pronoun', 'basic'] },
  { id: 'v052', japanese: '彼', reading: 'kare', meaning: 'he / boyfriend', jlptLevel: 'N5', partOfSpeech: 'pronoun', category: 'pronouns', examples: [{ japanese: '彼は日本人です。', reading: 'Kare wa Nihonjin desu.', english: 'He is Japanese.' }], tags: ['pronoun'] },
  { id: 'v053', japanese: '彼女', reading: 'kanojo', meaning: 'she / girlfriend', jlptLevel: 'N5', partOfSpeech: 'pronoun', category: 'pronouns', examples: [{ japanese: '彼女は学生です。', reading: 'Kanojo wa gakusei desu.', english: 'She is a student.' }], tags: ['pronoun'] },
  { id: 'v060', japanese: '父', reading: 'chichi', meaning: 'father (my own)', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'family', examples: [{ japanese: '父は医者です。', reading: 'Chichi wa isha desu.', english: 'My father is a doctor.' }], tags: ['family'] },
  { id: 'v061', japanese: '母', reading: 'haha', meaning: 'mother (my own)', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'family', examples: [{ japanese: '母は料理が上手です。', reading: 'Haha wa ryouri ga jouzu desu.', english: 'My mother is good at cooking.' }], tags: ['family'] },
  { id: 'v062', japanese: '兄', reading: 'ani', meaning: 'older brother (my own)', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'family', examples: [], tags: ['family'] },
  { id: 'v063', japanese: '姉', reading: 'ane', meaning: 'older sister (my own)', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'family', examples: [], tags: ['family'] },
  // Places
  { id: 'v070', japanese: '学校', reading: 'gakkou', meaning: 'school', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'places', examples: [{ japanese: '学校に行きます。', reading: 'Gakkou ni ikimasu.', english: 'I go to school.' }], tags: ['place', 'education'] },
  { id: 'v071', japanese: '駅', reading: 'eki', meaning: 'train station', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'places', examples: [{ japanese: '駅はどこですか？', reading: 'Eki wa doko desu ka?', english: 'Where is the station?' }], tags: ['place', 'transport'] },
  { id: 'v072', japanese: '病院', reading: 'byouin', meaning: 'hospital', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'places', examples: [{ japanese: '病院に行きたいです。', reading: 'Byouin ni ikitai desu.', english: 'I want to go to the hospital.' }], tags: ['place', 'health'] },
  { id: 'v073', japanese: 'スーパー', reading: 'suupaa', meaning: 'supermarket', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'places', examples: [{ japanese: 'スーパーで野菜を買います。', reading: 'Suupaa de yasai o kaimasu.', english: 'I buy vegetables at the supermarket.' }], tags: ['place', 'shopping', 'katakana'] },
  // Verbs (common)
  { id: 'v080', japanese: '行く', reading: 'iku', meaning: 'to go', jlptLevel: 'N5', partOfSpeech: 'verb (う)', category: 'verbs', examples: [{ japanese: '日本に行きたいです。', reading: 'Nihon ni ikitai desu.', english: 'I want to go to Japan.' }], tags: ['verb', 'movement', 'basic'] },
  { id: 'v081', japanese: '来る', reading: 'kuru', meaning: 'to come', jlptLevel: 'N5', partOfSpeech: 'verb (irregular)', category: 'verbs', examples: [{ japanese: '明日来てください。', reading: 'Ashita kite kudasai.', english: 'Please come tomorrow.' }], tags: ['verb', 'movement', 'basic', 'irregular'] },
  { id: 'v082', japanese: '見る', reading: 'miru', meaning: 'to see / to look / to watch', jlptLevel: 'N5', partOfSpeech: 'verb (る)', category: 'verbs', examples: [{ japanese: '映画を見ます。', reading: 'Eiga o mimasu.', english: 'I watch a movie.' }], tags: ['verb', 'sense', 'basic'] },
  { id: 'v083', japanese: '聞く', reading: 'kiku', meaning: 'to listen / to hear / to ask', jlptLevel: 'N5', partOfSpeech: 'verb (う)', category: 'verbs', examples: [{ japanese: '音楽を聞きます。', reading: 'Ongaku o kikimasu.', english: 'I listen to music.' }], tags: ['verb', 'sense', 'basic'] },
  { id: 'v084', japanese: '話す', reading: 'hanasu', meaning: 'to speak / to talk', jlptLevel: 'N5', partOfSpeech: 'verb (う)', category: 'verbs', examples: [{ japanese: '日本語を話します。', reading: 'Nihongo o hanashimasu.', english: 'I speak Japanese.' }], tags: ['verb', 'communication', 'basic'] },
  { id: 'v085', japanese: '読む', reading: 'yomu', meaning: 'to read', jlptLevel: 'N5', partOfSpeech: 'verb (う)', category: 'verbs', examples: [{ japanese: '本を読みます。', reading: 'Hon o yomimasu.', english: 'I read a book.' }], tags: ['verb', 'basic', 'study'] },
  { id: 'v086', japanese: '書く', reading: 'kaku', meaning: 'to write', jlptLevel: 'N5', partOfSpeech: 'verb (う)', category: 'verbs', examples: [{ japanese: '手紙を書きます。', reading: 'Tegami o kakimasu.', english: 'I write a letter.' }], tags: ['verb', 'basic', 'study'] },
  { id: 'v087', japanese: '買う', reading: 'kau', meaning: 'to buy', jlptLevel: 'N5', partOfSpeech: 'verb (う)', category: 'verbs', examples: [{ japanese: '本を買います。', reading: 'Hon o kaimasu.', english: 'I buy a book.' }], tags: ['verb', 'shopping'] },
  { id: 'v088', japanese: '作る', reading: 'tsukuru', meaning: 'to make / to create', jlptLevel: 'N5', partOfSpeech: 'verb (う)', category: 'verbs', examples: [{ japanese: '料理を作ります。', reading: 'Ryouri o tsukurimasu.', english: 'I make food.' }], tags: ['verb', 'basic'] },
  { id: 'v089', japanese: '寝る', reading: 'neru', meaning: 'to sleep / to go to bed', jlptLevel: 'N5', partOfSpeech: 'verb (る)', category: 'verbs', examples: [{ japanese: '十時に寝ます。', reading: 'Juuji ni nemasu.', english: 'I go to bed at 10 o\'clock.' }], tags: ['verb', 'daily life'] },
  { id: 'v090', japanese: '起きる', reading: 'okiru', meaning: 'to wake up / to get up', jlptLevel: 'N5', partOfSpeech: 'verb (る)', category: 'verbs', examples: [{ japanese: '七時に起きます。', reading: 'Shichiji ni okimasu.', english: 'I wake up at 7 o\'clock.' }], tags: ['verb', 'daily life'] },
  // Adjectives
  { id: 'v100', japanese: '大きい', reading: 'ookii', meaning: 'big / large', jlptLevel: 'N5', partOfSpeech: 'い-adjective', category: 'adjectives', examples: [{ japanese: 'この犬は大きいです。', reading: 'Kono inu wa ookii desu.', english: 'This dog is big.' }], tags: ['adjective', 'size'] },
  { id: 'v101', japanese: '小さい', reading: 'chiisai', meaning: 'small / little', jlptLevel: 'N5', partOfSpeech: 'い-adjective', category: 'adjectives', examples: [{ japanese: '小さい猫がいます。', reading: 'Chiisai neko ga imasu.', english: 'There is a small cat.' }], tags: ['adjective', 'size'] },
  { id: 'v102', japanese: 'いい / よい', reading: 'ii / yoi', meaning: 'good', jlptLevel: 'N5', partOfSpeech: 'い-adjective', category: 'adjectives', examples: [{ japanese: 'いい天気ですね！', reading: 'Ii tenki desu ne!', english: 'The weather is nice, isn\'t it!' }], tags: ['adjective', 'basic'] },
  { id: 'v103', japanese: '悪い', reading: 'warui', meaning: 'bad', jlptLevel: 'N5', partOfSpeech: 'い-adjective', category: 'adjectives', examples: [{ japanese: '悪い天気です。', reading: 'Warui tenki desu.', english: 'The weather is bad.' }], tags: ['adjective', 'basic'] },
  { id: 'v104', japanese: '新しい', reading: 'atarashii', meaning: 'new', jlptLevel: 'N5', partOfSpeech: 'い-adjective', category: 'adjectives', examples: [{ japanese: '新しい本を買いました。', reading: 'Atarashii hon o kaimashita.', english: 'I bought a new book.' }], tags: ['adjective'] },
  { id: 'v105', japanese: '古い', reading: 'furui', meaning: 'old (thing)', jlptLevel: 'N5', partOfSpeech: 'い-adjective', category: 'adjectives', examples: [{ japanese: '古い車です。', reading: 'Furui kuruma desu.', english: 'It is an old car.' }], tags: ['adjective'] },
  { id: 'v106', japanese: '好き', reading: 'suki', meaning: 'like / fond of', jlptLevel: 'N5', partOfSpeech: 'な-adjective', category: 'adjectives', examples: [{ japanese: '日本語が好きです。', reading: 'Nihongo ga suki desu.', english: 'I like Japanese.' }], tags: ['adjective', 'feeling', 'basic'] },
  { id: 'v107', japanese: '嫌い', reading: 'kirai', meaning: 'dislike', jlptLevel: 'N5', partOfSpeech: 'な-adjective', category: 'adjectives', examples: [{ japanese: '虫が嫌いです。', reading: 'Mushi ga kirai desu.', english: 'I dislike insects.' }], tags: ['adjective', 'feeling'] },
  // Time expressions
  { id: 'v110', japanese: '今日', reading: 'kyou', meaning: 'today', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'time', examples: [{ japanese: '今日は何曜日ですか？', reading: 'Kyou wa nanyoubi desu ka?', english: 'What day of the week is today?' }], tags: ['time', 'basic'] },
  { id: 'v111', japanese: '明日', reading: 'ashita', meaning: 'tomorrow', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'time', examples: [{ japanese: '明日、学校があります。', reading: 'Ashita, gakkou ga arimasu.', english: 'Tomorrow there is school.' }], tags: ['time', 'basic'] },
  { id: 'v112', japanese: '昨日', reading: 'kinou', meaning: 'yesterday', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'time', examples: [{ japanese: '昨日何をしましたか？', reading: 'Kinou nani o shimashita ka?', english: 'What did you do yesterday?' }], tags: ['time', 'basic'] },
  { id: 'v113', japanese: '今', reading: 'ima', meaning: 'now', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'time', examples: [{ japanese: '今、何時ですか？', reading: 'Ima, nanji desu ka?', english: 'What time is it now?' }], tags: ['time', 'basic'] },
  { id: 'v114', japanese: '毎日', reading: 'mainichi', meaning: 'every day', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'time', examples: [{ japanese: '毎日日本語を勉強します。', reading: 'Mainichi Nihongo o benkyou shimasu.', english: 'I study Japanese every day.' }], tags: ['time', 'frequency'] },
  // School/Study
  { id: 'v120', japanese: '勉強する', reading: 'benkyou suru', meaning: 'to study', jlptLevel: 'N5', partOfSpeech: 'verb (する)', category: 'school', examples: [{ japanese: '日本語を勉強します。', reading: 'Nihongo o benkyou shimasu.', english: 'I study Japanese.' }], tags: ['verb', 'study', 'school'] },
  { id: 'v121', japanese: '先生', reading: 'sensei', meaning: 'teacher', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'school', examples: [{ japanese: '田中先生は親切です。', reading: 'Tanaka-sensei wa shinsetsu desu.', english: 'Teacher Tanaka is kind.' }], tags: ['school', 'person'] },
  { id: 'v122', japanese: '学生', reading: 'gakusei', meaning: 'student', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'school', examples: [{ japanese: '私は日本語の学生です。', reading: 'Watashi wa Nihongo no gakusei desu.', english: 'I am a Japanese language student.' }], tags: ['school', 'person'] },
  { id: 'v123', japanese: '本', reading: 'hon', meaning: 'book', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'school', examples: [{ japanese: '本を読みます。', reading: 'Hon o yomimasu.', english: 'I read a book.' }], tags: ['school', 'study', 'object'] },
  // Nature/Weather
  { id: 'v130', japanese: '天気', reading: 'tenki', meaning: 'weather', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'weather', examples: [{ japanese: '今日の天気はどうですか？', reading: 'Kyou no tenki wa dou desu ka?', english: 'How is the weather today?' }], tags: ['weather', 'nature'] },
  { id: 'v131', japanese: '雨', reading: 'ame', meaning: 'rain', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'weather', examples: [{ japanese: '今日は雨が降っています。', reading: 'Kyou wa ame ga futte imasu.', english: 'It is raining today.' }], tags: ['weather', 'nature'] },
  { id: 'v132', japanese: '雪', reading: 'yuki', meaning: 'snow', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'weather', examples: [{ japanese: '冬に雪が降ります。', reading: 'Fuyu ni yuki ga furimasu.', english: 'It snows in winter.' }], tags: ['weather', 'nature', 'season'] },
  { id: 'v133', japanese: '春', reading: 'haru', meaning: 'spring', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'seasons', examples: [{ japanese: '春に桜が咲きます。', reading: 'Haru ni sakura ga sakimasu.', english: 'Cherry blossoms bloom in spring.' }], tags: ['season', 'nature'] },
  { id: 'v134', japanese: '夏', reading: 'natsu', meaning: 'summer', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'seasons', examples: [{ japanese: '夏は暑いです。', reading: 'Natsu wa atsui desu.', english: 'Summer is hot.' }], tags: ['season', 'nature'] },
  { id: 'v135', japanese: '秋', reading: 'aki', meaning: 'autumn / fall', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'seasons', examples: [], tags: ['season', 'nature'] },
  { id: 'v136', japanese: '冬', reading: 'fuyu', meaning: 'winter', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'seasons', examples: [], tags: ['season', 'nature'] },
  // Countries / Places
  { id: 'v140', japanese: '日本', reading: 'nihon / nippon', meaning: 'Japan', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'countries', examples: [{ japanese: '日本語を勉強しています。', reading: 'Nihongo o benkyou shite imasu.', english: 'I am studying Japanese.' }], tags: ['country', 'place'] },
  { id: 'v141', japanese: '日本語', reading: 'nihongo', meaning: 'Japanese language', jlptLevel: 'N5', partOfSpeech: 'noun', category: 'language', examples: [{ japanese: '日本語は難しいですか？', reading: 'Nihongo wa muzukashii desu ka?', english: 'Is Japanese difficult?' }], tags: ['language', 'study', 'basic'] },
];

export const vocabularyCategories = [
  { id: 'greetings', label: 'Greetings', icon: '👋', jlpt: 'N5' },
  { id: 'numbers', label: 'Numbers', icon: '🔢', jlpt: 'N5' },
  { id: 'food', label: 'Food & Drink', icon: '🍜', jlpt: 'N5' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧', jlpt: 'N5' },
  { id: 'pronouns', label: 'Pronouns', icon: '👤', jlpt: 'N5' },
  { id: 'verbs', label: 'Common Verbs', icon: '🏃', jlpt: 'N5' },
  { id: 'adjectives', label: 'Adjectives', icon: '✨', jlpt: 'N5' },
  { id: 'places', label: 'Places', icon: '🏫', jlpt: 'N5' },
  { id: 'time', label: 'Time', icon: '⏰', jlpt: 'N5' },
  { id: 'school', label: 'School & Study', icon: '📚', jlpt: 'N5' },
  { id: 'weather', label: 'Weather', icon: '🌤️', jlpt: 'N5' },
  { id: 'seasons', label: 'Seasons', icon: '🌸', jlpt: 'N5' },
  { id: 'countries', label: 'Countries', icon: '🌍', jlpt: 'N5' },
  { id: 'language', label: 'Language', icon: '💬', jlpt: 'N5' },
];
