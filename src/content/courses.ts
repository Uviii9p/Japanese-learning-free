export interface Lesson {
  id: string;
  title: string;
  titleJP: string;
  description: string;
  level: 'beginner' | 'n5' | 'n4' | 'n3' | 'n2' | 'n1';
  type: 'hiragana' | 'katakana' | 'vocabulary' | 'kanji' | 'grammar' | 'reading' | 'listening' | 'speaking' | 'conversation' | 'culture';
  xpReward: number;
  estimatedMinutes: number;
  prerequisites: string[];
  order: number;
  icon: string;
  color: string;
  content: string[];
}

export interface CourseModule {
  id: string;
  title: string;
  titleJP: string;
  description: string;
  level: string;
  levelLabel: string;
  color: string;
  icon: string;
  lessons: Lesson[];
  totalXP: number;
  estimatedDays: number;
}

export const courseModules: CourseModule[] = [
  {
    id: 'module-beginner',
    title: 'Japanese Basics',
    titleJP: '日本語の基礎',
    description: 'Start your Japanese journey. Learn about the language, writing systems, and basic pronunciation.',
    level: 'beginner',
    levelLabel: '🌱 Beginner',
    color: 'from-emerald-500 to-teal-600',
    icon: '🌱',
    totalXP: 500,
    estimatedDays: 7,
    lessons: [
      { id: 'l001', title: 'Welcome to Japanese', titleJP: 'ようこそ', description: 'Introduction to the Japanese language: history, writing systems, and what makes it unique.', level: 'beginner', type: 'culture', xpReward: 20, estimatedMinutes: 5, prerequisites: [], order: 1, icon: '🎌', color: 'from-red-500 to-rose-600', content: ['intro_japanese'] },
      { id: 'l002', title: 'Japanese Sounds & Pronunciation', titleJP: '発音', description: 'Learn the basic sounds of Japanese. Vowels, consonants, and pitch accent basics.', level: 'beginner', type: 'speaking', xpReward: 30, estimatedMinutes: 10, prerequisites: ['l001'], order: 2, icon: '🔊', color: 'from-purple-500 to-violet-600', content: ['pronunciation_basics'] },
      { id: 'l003', title: 'Japanese Writing Systems', titleJP: '書き方', description: 'Overview of Hiragana, Katakana, and Kanji. Understand when each is used.', level: 'beginner', type: 'culture', xpReward: 20, estimatedMinutes: 5, prerequisites: ['l001'], order: 3, icon: '✍️', color: 'from-blue-500 to-cyan-600', content: ['writing_systems'] },
    ]
  },
  {
    id: 'module-hiragana',
    title: 'Hiragana',
    titleJP: 'ひらがな',
    description: 'Master the 46 basic hiragana characters — the foundation of Japanese reading and writing.',
    level: 'beginner',
    levelLabel: '🌱 Beginner',
    color: 'from-pink-500 to-rose-600',
    icon: 'あ',
    totalXP: 800,
    estimatedDays: 14,
    lessons: [
      { id: 'l010', title: 'Hiragana: Vowels', titleJP: 'あいうえお', description: 'Learn the five Japanese vowel sounds: あ, い, う, え, お', level: 'beginner', type: 'hiragana', xpReward: 50, estimatedMinutes: 15, prerequisites: ['l003'], order: 1, icon: 'あ', color: 'from-pink-400 to-rose-500', content: ['a', 'i', 'u', 'e', 'o'] },
      { id: 'l011', title: 'Hiragana: K-row', titleJP: 'かきくけこ', description: 'Learn か, き, く, け, こ', level: 'beginner', type: 'hiragana', xpReward: 50, estimatedMinutes: 15, prerequisites: ['l010'], order: 2, icon: 'か', color: 'from-pink-400 to-rose-500', content: ['ka', 'ki', 'ku', 'ke', 'ko'] },
      { id: 'l012', title: 'Hiragana: S-row', titleJP: 'さしすせそ', description: 'Learn さ, し, す, せ, そ', level: 'beginner', type: 'hiragana', xpReward: 50, estimatedMinutes: 15, prerequisites: ['l011'], order: 3, icon: 'さ', color: 'from-pink-400 to-rose-500', content: ['sa', 'shi', 'su', 'se', 'so'] },
      { id: 'l013', title: 'Hiragana: T-row', titleJP: 'たちつてと', description: 'Learn た, ち, つ, て, と', level: 'beginner', type: 'hiragana', xpReward: 50, estimatedMinutes: 15, prerequisites: ['l012'], order: 4, icon: 'た', color: 'from-pink-400 to-rose-500', content: ['ta', 'chi', 'tsu', 'te', 'to'] },
      { id: 'l014', title: 'Hiragana: N-row', titleJP: 'なにぬねの', description: 'Learn な, に, ぬ, ね, の', level: 'beginner', type: 'hiragana', xpReward: 50, estimatedMinutes: 15, prerequisites: ['l013'], order: 5, icon: 'な', color: 'from-pink-400 to-rose-500', content: ['na', 'ni', 'nu', 'ne', 'no'] },
      { id: 'l015', title: 'Hiragana: H-row', titleJP: 'はひふへほ', description: 'Learn は, ひ, ふ, へ, ほ', level: 'beginner', type: 'hiragana', xpReward: 50, estimatedMinutes: 15, prerequisites: ['l014'], order: 6, icon: 'は', color: 'from-pink-400 to-rose-500', content: ['ha', 'hi', 'fu', 'he', 'ho'] },
      { id: 'l016', title: 'Hiragana: M, Y, R, W, N rows', titleJP: 'まやらわん', description: 'Learn the remaining hiragana characters', level: 'beginner', type: 'hiragana', xpReward: 80, estimatedMinutes: 20, prerequisites: ['l015'], order: 7, icon: 'ま', color: 'from-pink-400 to-rose-500', content: ['ma', 'mi', 'mu', 'me', 'mo', 'ya', 'yu', 'yo', 'ra', 'ri', 'ru', 're', 'ro', 'wa', 'wo', 'n'] },
      { id: 'l017', title: 'Hiragana Review & Quiz', titleJP: 'ひらがな復習', description: 'Review all hiragana with flashcards and recognition quiz', level: 'beginner', type: 'hiragana', xpReward: 100, estimatedMinutes: 20, prerequisites: ['l016'], order: 8, icon: '✅', color: 'from-green-400 to-emerald-500', content: ['review_all'] },
    ]
  },
  {
    id: 'module-katakana',
    title: 'Katakana',
    titleJP: 'カタカナ',
    description: 'Master katakana — used for foreign words, loanwords, and emphasis.',
    level: 'beginner',
    levelLabel: '🌱 Beginner',
    color: 'from-blue-500 to-indigo-600',
    icon: 'ア',
    totalXP: 800,
    estimatedDays: 14,
    lessons: [
      { id: 'l020', title: 'Katakana: Vowels', titleJP: 'アイウエオ', description: 'Learn ア, イ, ウ, エ, オ and common loan words', level: 'beginner', type: 'katakana', xpReward: 50, estimatedMinutes: 15, prerequisites: ['l017'], order: 1, icon: 'ア', color: 'from-blue-400 to-indigo-500', content: ['A', 'I', 'U', 'E', 'O'] },
      { id: 'l021', title: 'Katakana: K & S rows', titleJP: 'カキクケコ・サシスセソ', description: 'Learn カ through ソ', level: 'beginner', type: 'katakana', xpReward: 60, estimatedMinutes: 15, prerequisites: ['l020'], order: 2, icon: 'カ', color: 'from-blue-400 to-indigo-500', content: ['KA', 'KI', 'KU', 'KE', 'KO', 'SA', 'SHI', 'SU', 'SE', 'SO'] },
      { id: 'l022', title: 'Katakana: T, N, H rows', titleJP: 'タチツテト他', description: 'Learn タ through ホ', level: 'beginner', type: 'katakana', xpReward: 60, estimatedMinutes: 15, prerequisites: ['l021'], order: 3, icon: 'タ', color: 'from-blue-400 to-indigo-500', content: ['TA', 'CHI', 'TSU', 'TE', 'TO', 'NA', 'NI', 'NU', 'NE', 'NO', 'HA', 'HI', 'FU', 'HE', 'HO'] },
      { id: 'l023', title: 'Katakana: M, Y, R, W, N rows', titleJP: 'マヤラワン', description: 'Learn remaining katakana characters', level: 'beginner', type: 'katakana', xpReward: 80, estimatedMinutes: 20, prerequisites: ['l022'], order: 4, icon: 'マ', color: 'from-blue-400 to-indigo-500', content: ['MA', 'MI', 'MU', 'ME', 'MO', 'YA', 'YU', 'YO', 'RA', 'RI', 'RU', 'RE', 'RO', 'WA', 'WO', 'N'] },
      { id: 'l024', title: 'Loan Words in Katakana', titleJP: '外来語', description: 'Practice reading common foreign loan words written in katakana', level: 'beginner', type: 'katakana', xpReward: 60, estimatedMinutes: 15, prerequisites: ['l023'], order: 5, icon: '🌐', color: 'from-purple-400 to-violet-500', content: ['loan_words'] },
      { id: 'l025', title: 'Katakana Review & Quiz', titleJP: 'カタカナ復習', description: 'Review all katakana with flashcards and recognition quiz', level: 'beginner', type: 'katakana', xpReward: 100, estimatedMinutes: 20, prerequisites: ['l024'], order: 6, icon: '✅', color: 'from-green-400 to-emerald-500', content: ['review_all'] },
    ]
  },
  {
    id: 'module-n5',
    title: 'JLPT N5',
    titleJP: 'JLPT N5',
    description: 'Begin your JLPT journey. Learn fundamental vocabulary, grammar, and kanji for N5.',
    level: 'n5',
    levelLabel: '📗 N5',
    color: 'from-green-500 to-emerald-600',
    icon: 'N5',
    totalXP: 3000,
    estimatedDays: 90,
    lessons: [
      { id: 'l030', title: 'Greetings & Self Introduction', titleJP: 'あいさつ・自己紹介', description: 'Learn essential greetings and how to introduce yourself in Japanese.', level: 'n5', type: 'vocabulary', xpReward: 60, estimatedMinutes: 20, prerequisites: ['l025'], order: 1, icon: '👋', color: 'from-green-400 to-emerald-500', content: ['greetings'] },
      { id: 'l031', title: 'Numbers 1-100', titleJP: '数字', description: 'Learn Japanese numbers and how to count.', level: 'n5', type: 'vocabulary', xpReward: 60, estimatedMinutes: 20, prerequisites: ['l030'], order: 2, icon: '🔢', color: 'from-green-400 to-emerald-500', content: ['numbers'] },
      { id: 'l032', title: 'Days & Time', titleJP: '時間・曜日', description: 'Days of the week, telling time, and time expressions.', level: 'n5', type: 'vocabulary', xpReward: 60, estimatedMinutes: 20, prerequisites: ['l031'], order: 3, icon: '📅', color: 'from-green-400 to-emerald-500', content: ['time', 'days'] },
      { id: 'l033', title: 'は and です', titleJP: '〜は〜です', description: 'The fundamental sentence structure of Japanese.', level: 'n5', type: 'grammar', xpReward: 80, estimatedMinutes: 25, prerequisites: ['l030'], order: 4, icon: '📝', color: 'from-yellow-400 to-amber-500', content: ['g001'] },
      { id: 'l034', title: 'Food & Eating', titleJP: '食べ物・食べる', description: 'Food vocabulary and eating expressions.', level: 'n5', type: 'vocabulary', xpReward: 60, estimatedMinutes: 20, prerequisites: ['l031'], order: 5, icon: '🍜', color: 'from-green-400 to-emerald-500', content: ['food'] },
      { id: 'l035', title: 'Verbs: ます Form', titleJP: 'ます形', description: 'Learn polite verb forms and essential action verbs.', level: 'n5', type: 'grammar', xpReward: 100, estimatedMinutes: 30, prerequisites: ['l033'], order: 6, icon: '🏃', color: 'from-yellow-400 to-amber-500', content: ['g004'] },
      { id: 'l036', title: 'Particles: を, に, で', titleJP: '助詞', description: 'Master the essential Japanese particles.', level: 'n5', type: 'grammar', xpReward: 100, estimatedMinutes: 30, prerequisites: ['l035'], order: 7, icon: '⚡', color: 'from-yellow-400 to-amber-500', content: ['g006', 'g007'] },
      { id: 'l037', title: 'N5 Kanji: Numbers & Nature', titleJP: '漢字・数字・自然', description: 'Learn your first kanji: numbers and nature kanji.', level: 'n5', type: 'kanji', xpReward: 100, estimatedMinutes: 30, prerequisites: ['l033'], order: 8, icon: '漢', color: 'from-red-400 to-rose-500', content: ['k016', 'k017', 'k018', 'k019', 'k020', 'k008', 'k009', 'k001', 'k002'] },
      { id: 'l038', title: 'あります & います', titleJP: 'あります・います', description: 'Expressing existence of things and people.', level: 'n5', type: 'grammar', xpReward: 80, estimatedMinutes: 25, prerequisites: ['l036'], order: 9, icon: '📍', color: 'from-yellow-400 to-amber-500', content: ['g008'] },
      { id: 'l039', title: 'て-form & Requests', titleJP: 'て形・依頼', description: 'The versatile て-form and making polite requests.', level: 'n5', type: 'grammar', xpReward: 100, estimatedMinutes: 30, prerequisites: ['l038'], order: 10, icon: '🙏', color: 'from-yellow-400 to-amber-500', content: ['g009', 'g011'] },
      { id: 'l040', title: 'N5 Vocabulary Review', titleJP: 'N5語彙復習', description: 'SRS-powered review of all N5 vocabulary learned so far.', level: 'n5', type: 'vocabulary', xpReward: 80, estimatedMinutes: 20, prerequisites: ['l034'], order: 11, icon: '🔄', color: 'from-blue-400 to-indigo-500', content: ['review_n5_vocab'] },
      { id: 'l041', title: 'N5 Reading: Simple Sentences', titleJP: '読解・N5', description: 'Practice reading simple Japanese sentences and short paragraphs.', level: 'n5', type: 'reading', xpReward: 80, estimatedMinutes: 20, prerequisites: ['l039'], order: 12, icon: '📖', color: 'from-purple-400 to-violet-500', content: ['reading_n5_01'] },
      { id: 'l042', title: 'N5 Mock Test', titleJP: 'N5模擬試験', description: 'Practice JLPT N5 exam with vocabulary, kanji, grammar, reading and listening sections.', level: 'n5', type: 'vocabulary', xpReward: 200, estimatedMinutes: 60, prerequisites: ['l041'], order: 13, icon: '🏆', color: 'from-gold-400 to-yellow-500', content: ['mock_test_n5'] },
    ]
  },
  {
    id: 'module-n4',
    title: 'JLPT N4',
    titleJP: 'JLPT N4',
    description: 'Advance your Japanese to N4. More complex grammar, expanded vocabulary, and longer kanji study.',
    level: 'n4',
    levelLabel: '📘 N4',
    color: 'from-blue-500 to-indigo-600',
    icon: 'N4',
    totalXP: 5000,
    estimatedDays: 120,
    lessons: [
      { id: 'l050', title: 'N4 Grammar: たい, と思います', titleJP: '〜たい・と思います', description: 'Expressing desires and thoughts.', level: 'n4', type: 'grammar', xpReward: 100, estimatedMinutes: 30, prerequisites: ['l042'], order: 1, icon: '💭', color: 'from-blue-400 to-indigo-500', content: ['g012', 'g015'] },
    ]
  },
];

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  condition: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const achievements: Achievement[] = [
  { id: 'first_lesson', title: 'First Steps', description: 'Complete your first lesson', icon: '🌱', xpReward: 50, condition: 'lessons_completed >= 1', rarity: 'common' },
  { id: 'hiragana_complete', title: 'Hiragana Master', description: 'Learn all hiragana characters', icon: 'あ', xpReward: 200, condition: 'hiragana_learned >= 46', rarity: 'rare' },
  { id: 'katakana_complete', title: 'Katakana Complete', description: 'Learn all katakana characters', icon: 'ア', xpReward: 200, condition: 'katakana_learned >= 46', rarity: 'rare' },
  { id: 'streak_7', title: '7-Day Streak! 🔥', description: 'Study 7 days in a row', icon: '🔥', xpReward: 100, condition: 'streak >= 7', rarity: 'common' },
  { id: 'streak_30', title: 'Dedicated Learner', description: 'Study 30 days in a row', icon: '💪', xpReward: 500, condition: 'streak >= 30', rarity: 'rare' },
  { id: 'streak_100', title: 'Century Streak!', description: 'Study 100 days in a row', icon: '🏆', xpReward: 2000, condition: 'streak >= 100', rarity: 'legendary' },
  { id: 'vocab_100', title: 'Word Collector', description: 'Learn 100 vocabulary words', icon: '📚', xpReward: 150, condition: 'vocab_learned >= 100', rarity: 'common' },
  { id: 'vocab_500', title: 'Vocabulary Master', description: 'Learn 500 vocabulary words', icon: '🎓', xpReward: 500, condition: 'vocab_learned >= 500', rarity: 'rare' },
  { id: 'kanji_50', title: 'Kanji Beginner', description: 'Learn 50 kanji', icon: '漢', xpReward: 200, condition: 'kanji_learned >= 50', rarity: 'common' },
  { id: 'n5_complete', title: 'N5 Graduate!', description: 'Complete the JLPT N5 curriculum', icon: '🏯', xpReward: 1000, condition: 'n5_complete', rarity: 'epic' },
  { id: 'n4_complete', title: 'N4 Graduate!', description: 'Complete the JLPT N4 curriculum', icon: '🗼', xpReward: 2000, condition: 'n4_complete', rarity: 'epic' },
  { id: 'n1_complete', title: '日本語マスター', description: 'Complete the JLPT N1 curriculum', icon: '🎌', xpReward: 10000, condition: 'n1_complete', rarity: 'legendary' },
  { id: 'first_kanji', title: 'Kanji Curious', description: 'Write your first kanji correctly', icon: '✍️', xpReward: 50, condition: 'kanji_written >= 1', rarity: 'common' },
  { id: 'listening_master', title: 'Listening Master', description: 'Score 90%+ on 10 listening exercises', icon: '🎧', xpReward: 300, condition: 'listening_90_count >= 10', rarity: 'rare' },
  { id: 'xp_1000', title: 'Rising Star', description: 'Earn 1,000 XP', icon: '⭐', xpReward: 0, condition: 'total_xp >= 1000', rarity: 'common' },
  { id: 'xp_10000', title: 'Language Hero', description: 'Earn 10,000 XP', icon: '🌟', xpReward: 0, condition: 'total_xp >= 10000', rarity: 'epic' },
];

export const xpLevels = [
  { level: 1, title: 'Absolute Beginner', titleJP: '初めて', minXP: 0, maxXP: 500, color: '#6b7280' },
  { level: 2, title: 'Beginner', titleJP: '初心者', minXP: 500, maxXP: 1500, color: '#10b981' },
  { level: 3, title: 'Learner', titleJP: '学習者', minXP: 1500, maxXP: 3000, color: '#3b82f6' },
  { level: 4, title: 'Explorer', titleJP: '探求者', minXP: 3000, maxXP: 6000, color: '#8b5cf6' },
  { level: 5, title: 'Intermediate', titleJP: '中級者', minXP: 6000, maxXP: 12000, color: '#f59e0b' },
  { level: 6, title: 'Advanced Learner', titleJP: '上級学習者', minXP: 12000, maxXP: 25000, color: '#ef4444' },
  { level: 7, title: 'Expert', titleJP: '専門家', minXP: 25000, maxXP: 50000, color: '#f97316' },
  { level: 8, title: 'Master', titleJP: 'マスター', minXP: 50000, maxXP: 100000, color: '#ec4899' },
  { level: 9, title: '日本語マスター', titleJP: '日本語マスター', minXP: 100000, maxXP: Infinity, color: '#dc2626' },
];

export function getXPLevel(xp: number) {
  return xpLevels.find(l => xp >= l.minXP && xp < l.maxXP) || xpLevels[xpLevels.length - 1];
}

export const motivationalMessages = [
  { japanese: '毎日少しずつ！', translation: 'A little every day!' },
  { japanese: '継続は力なり。', translation: 'Consistency is strength.' },
  { japanese: '七転び八起き。', translation: 'Fall seven times, stand up eight.' },
  { japanese: '石の上にも三年。', translation: 'Three years on a rock (perseverance pays off).' },
  { japanese: '一歩一歩。', translation: 'One step at a time.' },
  { japanese: 'できる！', translation: 'You can do it!' },
  { japanese: 'がんばって！', translation: 'Do your best!' },
  { japanese: '諦めないで！', translation: "Don't give up!" },
  { japanese: '素晴らしい！', translation: 'Wonderful!' },
  { japanese: '日本語上手になってる！', translation: 'Your Japanese is improving!' },
];
