export interface KanjiItem {
  id: string;
  kanji: string;
  meanings: string[];
  onyomi: string[];
  kunyomi: string[];
  strokeCount: number;
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  radicals: string[];
  mnemonic: string;
  examples: { word: string; reading: string; meaning: string }[];
  grade: number;
}

export const kanjiData: KanjiItem[] = [
  {
    id: 'k001', kanji: '日', meanings: ['sun', 'day'], onyomi: ['ニチ', 'ジツ'], kunyomi: ['ひ', '-か'],
    strokeCount: 4, jlptLevel: 'N5', radicals: ['日'], grade: 1,
    mnemonic: 'Looks like a window with a bar across - the sun shining through a window.',
    examples: [{ word: '日本', reading: 'にほん', meaning: 'Japan' }, { word: '日曜日', reading: 'にちようび', meaning: 'Sunday' }, { word: '今日', reading: 'きょう', meaning: 'today' }]
  },
  {
    id: 'k002', kanji: '月', meanings: ['moon', 'month'], onyomi: ['ゲツ', 'ガツ'], kunyomi: ['つき'],
    strokeCount: 4, jlptLevel: 'N5', radicals: ['月'], grade: 1,
    mnemonic: 'A crescent moon with two horizontal lines inside.',
    examples: [{ word: '月曜日', reading: 'げつようび', meaning: 'Monday' }, { word: '今月', reading: 'こんげつ', meaning: 'this month' }, { word: '月', reading: 'つき', meaning: 'moon' }]
  },
  {
    id: 'k003', kanji: '火', meanings: ['fire'], onyomi: ['カ'], kunyomi: ['ひ', 'ほ'],
    strokeCount: 4, jlptLevel: 'N5', radicals: ['火'], grade: 1,
    mnemonic: 'A person with arms up, standing over flames.',
    examples: [{ word: '火曜日', reading: 'かようび', meaning: 'Tuesday' }, { word: '火事', reading: 'かじ', meaning: 'fire (disaster)' }]
  },
  {
    id: 'k004', kanji: '水', meanings: ['water'], onyomi: ['スイ'], kunyomi: ['みず'],
    strokeCount: 4, jlptLevel: 'N5', radicals: ['水'], grade: 1,
    mnemonic: 'Looks like water flowing between rocks.',
    examples: [{ word: '水曜日', reading: 'すいようび', meaning: 'Wednesday' }, { word: '水', reading: 'みず', meaning: 'water' }, { word: '水泳', reading: 'すいえい', meaning: 'swimming' }]
  },
  {
    id: 'k005', kanji: '木', meanings: ['tree', 'wood'], onyomi: ['モク', 'ボク'], kunyomi: ['き', 'こ'],
    strokeCount: 4, jlptLevel: 'N5', radicals: ['木'], grade: 1,
    mnemonic: 'A tree with branches at the top and roots at the bottom.',
    examples: [{ word: '木曜日', reading: 'もくようび', meaning: 'Thursday' }, { word: '木', reading: 'き', meaning: 'tree' }, { word: '木造', reading: 'もくぞう', meaning: 'wooden' }]
  },
  {
    id: 'k006', kanji: '金', meanings: ['gold', 'money'], onyomi: ['キン', 'コン'], kunyomi: ['かね', 'かな'],
    strokeCount: 8, jlptLevel: 'N5', radicals: ['金'], grade: 1,
    mnemonic: 'Gold nuggets buried under the ground with an X marking the spot.',
    examples: [{ word: '金曜日', reading: 'きんようび', meaning: 'Friday' }, { word: 'お金', reading: 'おかね', meaning: 'money' }, { word: '金色', reading: 'きんいろ', meaning: 'gold color' }]
  },
  {
    id: 'k007', kanji: '土', meanings: ['earth', 'soil', 'ground'], onyomi: ['ド', 'ト'], kunyomi: ['つち'],
    strokeCount: 3, jlptLevel: 'N5', radicals: ['土'], grade: 1,
    mnemonic: 'A cross planted in the ground - a stake in the earth.',
    examples: [{ word: '土曜日', reading: 'どようび', meaning: 'Saturday' }, { word: '土地', reading: 'とち', meaning: 'land' }, { word: '土', reading: 'つち', meaning: 'soil' }]
  },
  {
    id: 'k008', kanji: '山', meanings: ['mountain'], onyomi: ['サン'], kunyomi: ['やま'],
    strokeCount: 3, jlptLevel: 'N5', radicals: ['山'], grade: 1,
    mnemonic: 'Three peaks of a mountain range.',
    examples: [{ word: '富士山', reading: 'ふじさん', meaning: 'Mt. Fuji' }, { word: '山道', reading: 'やまみち', meaning: 'mountain path' }]
  },
  {
    id: 'k009', kanji: '川', meanings: ['river', 'stream'], onyomi: ['セン'], kunyomi: ['かわ'],
    strokeCount: 3, jlptLevel: 'N5', radicals: ['川'], grade: 1,
    mnemonic: 'Three streams flowing together to form a river.',
    examples: [{ word: '川', reading: 'かわ', meaning: 'river' }, { word: '川上', reading: 'かわかみ', meaning: 'upstream' }]
  },
  {
    id: 'k010', kanji: '人', meanings: ['person', 'people'], onyomi: ['ジン', 'ニン'], kunyomi: ['ひと'],
    strokeCount: 2, jlptLevel: 'N5', radicals: ['人'], grade: 1,
    mnemonic: 'A person walking - you can see two legs.',
    examples: [{ word: '日本人', reading: 'にほんじん', meaning: 'Japanese person' }, { word: '人', reading: 'ひと', meaning: 'person' }, { word: '人気', reading: 'にんき', meaning: 'popularity' }]
  },
  {
    id: 'k011', kanji: '口', meanings: ['mouth', 'opening'], onyomi: ['コウ', 'ク'], kunyomi: ['くち'],
    strokeCount: 3, jlptLevel: 'N5', radicals: ['口'], grade: 1,
    mnemonic: 'A square that looks like an open mouth.',
    examples: [{ word: '口', reading: 'くち', meaning: 'mouth' }, { word: '人口', reading: 'じんこう', meaning: 'population' }, { word: '出口', reading: 'でぐち', meaning: 'exit' }]
  },
  {
    id: 'k012', kanji: '目', meanings: ['eye'], onyomi: ['モク', 'ボク'], kunyomi: ['め'],
    strokeCount: 5, jlptLevel: 'N5', radicals: ['目'], grade: 1,
    mnemonic: 'An eye turned on its side with two horizontal lines for eyelids.',
    examples: [{ word: '目', reading: 'め', meaning: 'eye' }, { word: '目標', reading: 'もくひょう', meaning: 'goal/target' }, { word: '注目', reading: 'ちゅうもく', meaning: 'attention' }]
  },
  {
    id: 'k013', kanji: '耳', meanings: ['ear'], onyomi: ['ジ'], kunyomi: ['みみ'],
    strokeCount: 6, jlptLevel: 'N5', radicals: ['耳'], grade: 1,
    mnemonic: 'Looks like an ear with channels inside.',
    examples: [{ word: '耳', reading: 'みみ', meaning: 'ear' }, { word: '耳鼻科', reading: 'じびか', meaning: 'ENT clinic' }]
  },
  {
    id: 'k014', kanji: '手', meanings: ['hand'], onyomi: ['シュ'], kunyomi: ['て', 'た'],
    strokeCount: 4, jlptLevel: 'N5', radicals: ['手'], grade: 1,
    mnemonic: 'Fingers spreading out from a palm.',
    examples: [{ word: '手', reading: 'て', meaning: 'hand' }, { word: '手紙', reading: 'てがみ', meaning: 'letter (mail)' }, { word: '上手', reading: 'じょうず', meaning: 'skillful' }]
  },
  {
    id: 'k015', kanji: '足', meanings: ['foot', 'leg', 'enough'], onyomi: ['ソク'], kunyomi: ['あし', 'た'],
    strokeCount: 7, jlptLevel: 'N5', radicals: ['足'], grade: 1,
    mnemonic: 'A leg with a foot at the bottom.',
    examples: [{ word: '足', reading: 'あし', meaning: 'foot/leg' }, { word: '足りる', reading: 'たりる', meaning: 'to be enough' }]
  },
  {
    id: 'k016', kanji: '一', meanings: ['one'], onyomi: ['イチ', 'イツ'], kunyomi: ['ひと', 'ひと-'],
    strokeCount: 1, jlptLevel: 'N5', radicals: ['一'], grade: 1,
    mnemonic: 'A single horizontal stroke — the number one.',
    examples: [{ word: '一人', reading: 'ひとり', meaning: 'one person' }, { word: '一月', reading: 'いちがつ', meaning: 'January' }, { word: '一番', reading: 'いちばん', meaning: 'number one / best' }]
  },
  {
    id: 'k017', kanji: '二', meanings: ['two'], onyomi: ['ニ'], kunyomi: ['ふた', 'ふた-'],
    strokeCount: 2, jlptLevel: 'N5', radicals: ['二'], grade: 1,
    mnemonic: 'Two horizontal strokes.',
    examples: [{ word: '二人', reading: 'ふたり', meaning: 'two people' }, { word: '二月', reading: 'にがつ', meaning: 'February' }]
  },
  {
    id: 'k018', kanji: '三', meanings: ['three'], onyomi: ['サン'], kunyomi: ['み', 'みっ-'],
    strokeCount: 3, jlptLevel: 'N5', radicals: ['三'], grade: 1,
    mnemonic: 'Three horizontal strokes.',
    examples: [{ word: '三月', reading: 'さんがつ', meaning: 'March' }, { word: '三角', reading: 'さんかく', meaning: 'triangle' }]
  },
  {
    id: 'k019', kanji: '四', meanings: ['four'], onyomi: ['シ'], kunyomi: ['よ', 'よっ-', 'よん'],
    strokeCount: 5, jlptLevel: 'N5', radicals: ['口'], grade: 1,
    mnemonic: 'A box divided into four parts.',
    examples: [{ word: '四月', reading: 'しがつ', meaning: 'April' }, { word: '四角', reading: 'しかく', meaning: 'square' }]
  },
  {
    id: 'k020', kanji: '五', meanings: ['five'], onyomi: ['ゴ'], kunyomi: ['いつ', 'いつ-'],
    strokeCount: 4, jlptLevel: 'N5', radicals: ['五'], grade: 1,
    mnemonic: 'A number that looks like a bent arm holding five fingers.',
    examples: [{ word: '五月', reading: 'ごがつ', meaning: 'May' }, { word: '五輪', reading: 'ごりん', meaning: 'Olympics (five rings)' }]
  },
  {
    id: 'k021', kanji: '六', meanings: ['six'], onyomi: ['ロク'], kunyomi: ['む', 'むっ-', 'むい'],
    strokeCount: 4, jlptLevel: 'N5', radicals: ['六'], grade: 1,
    mnemonic: 'A hat on a person - the number six.',
    examples: [{ word: '六月', reading: 'ろくがつ', meaning: 'June' }, { word: '六時', reading: 'ろくじ', meaning: '6 o\'clock' }]
  },
  {
    id: 'k022', kanji: '七', meanings: ['seven'], onyomi: ['シチ'], kunyomi: ['なな', 'なな-', 'なの'],
    strokeCount: 2, jlptLevel: 'N5', radicals: ['七'], grade: 1,
    mnemonic: 'Looks like a 7 with a crossing stroke.',
    examples: [{ word: '七月', reading: 'しちがつ', meaning: 'July' }, { word: '七夕', reading: 'たなばた', meaning: 'Tanabata festival' }]
  },
  {
    id: 'k023', kanji: '八', meanings: ['eight'], onyomi: ['ハチ'], kunyomi: ['や', 'やっ-', 'よう'],
    strokeCount: 2, jlptLevel: 'N5', radicals: ['八'], grade: 1,
    mnemonic: 'Two strokes opening wide - spreading out to eight.',
    examples: [{ word: '八月', reading: 'はちがつ', meaning: 'August' }, { word: '八百屋', reading: 'やおや', meaning: 'greengrocer' }]
  },
  {
    id: 'k024', kanji: '九', meanings: ['nine'], onyomi: ['キュウ', 'ク'], kunyomi: ['ここの', 'ここの-'],
    strokeCount: 2, jlptLevel: 'N5', radicals: ['九'], grade: 1,
    mnemonic: 'A curve that bends back - like the number 9.',
    examples: [{ word: '九月', reading: 'くがつ', meaning: 'September' }, { word: '九時', reading: 'くじ', meaning: '9 o\'clock' }]
  },
  {
    id: 'k025', kanji: '十', meanings: ['ten'], onyomi: ['ジュウ', 'ジッ', 'ジュ'], kunyomi: ['とお', 'と'],
    strokeCount: 2, jlptLevel: 'N5', radicals: ['十'], grade: 1,
    mnemonic: 'A cross - perfect ten.',
    examples: [{ word: '十月', reading: 'じゅうがつ', meaning: 'October' }, { word: '十分', reading: 'じゅうぶん', meaning: 'sufficient / ten minutes' }]
  },
  {
    id: 'k026', kanji: '百', meanings: ['hundred'], onyomi: ['ヒャク'], kunyomi: [],
    strokeCount: 6, jlptLevel: 'N5', radicals: ['一', '白'], grade: 2,
    mnemonic: 'One (一) on top of a white (白) — a hundred whites.',
    examples: [{ word: '百円', reading: 'ひゃくえん', meaning: '100 yen' }, { word: '百科事典', reading: 'ひゃっかじてん', meaning: 'encyclopedia' }]
  },
  {
    id: 'k027', kanji: '千', meanings: ['thousand'], onyomi: ['セン'], kunyomi: ['ち'],
    strokeCount: 3, jlptLevel: 'N5', radicals: ['千'], grade: 2,
    mnemonic: 'A person leaning - one thousand people leaning together.',
    examples: [{ word: '千円', reading: 'せんえん', meaning: '1000 yen' }, { word: '千葉', reading: 'ちば', meaning: 'Chiba (city)' }]
  },
  {
    id: 'k028', kanji: '万', meanings: ['ten thousand', 'myriad'], onyomi: ['マン', 'バン'], kunyomi: [],
    strokeCount: 3, jlptLevel: 'N5', radicals: ['万'], grade: 2,
    mnemonic: 'A scorpion waving — ten thousand scorpions!',
    examples: [{ word: '一万円', reading: 'いちまんえん', meaning: '10,000 yen' }, { word: '万国', reading: 'ばんこく', meaning: 'all nations' }]
  },
  {
    id: 'k029', kanji: '年', meanings: ['year'], onyomi: ['ネン'], kunyomi: ['とし'],
    strokeCount: 6, jlptLevel: 'N5', radicals: ['年'], grade: 1,
    mnemonic: 'A person bent under the weight of the passing years.',
    examples: [{ word: '今年', reading: 'ことし', meaning: 'this year' }, { word: '来年', reading: 'らいねん', meaning: 'next year' }, { word: '毎年', reading: 'まいとし', meaning: 'every year' }]
  },
  {
    id: 'k030', kanji: '大', meanings: ['large', 'big', 'great'], onyomi: ['ダイ', 'タイ'], kunyomi: ['おお', 'おお-', 'おお-きい'],
    strokeCount: 3, jlptLevel: 'N5', radicals: ['大'], grade: 1,
    mnemonic: 'A person with arms stretched wide — big!',
    examples: [{ word: '大学', reading: 'だいがく', meaning: 'university' }, { word: '大きい', reading: 'おおきい', meaning: 'big' }, { word: '大阪', reading: 'おおさか', meaning: 'Osaka' }]
  },
  {
    id: 'k031', kanji: '小', meanings: ['small', 'little'], onyomi: ['ショウ'], kunyomi: ['ちい-', 'こ', 'お'],
    strokeCount: 3, jlptLevel: 'N5', radicals: ['小'], grade: 1,
    mnemonic: 'Three small dots — little things scattered around.',
    examples: [{ word: '小学校', reading: 'しょうがっこう', meaning: 'elementary school' }, { word: '小さい', reading: 'ちいさい', meaning: 'small' }]
  },
  {
    id: 'k032', kanji: '中', meanings: ['middle', 'inside', 'China'], onyomi: ['チュウ'], kunyomi: ['なか'],
    strokeCount: 4, jlptLevel: 'N5', radicals: ['口', '丨'], grade: 1,
    mnemonic: 'A vertical line through the middle of a box — in the center.',
    examples: [{ word: '中国', reading: 'ちゅうごく', meaning: 'China' }, { word: '中学校', reading: 'ちゅうがっこう', meaning: 'middle school' }, { word: '中', reading: 'なか', meaning: 'inside' }]
  },
  {
    id: 'k033', kanji: '上', meanings: ['above', 'up', 'on', 'upper'], onyomi: ['ジョウ', 'ショウ'], kunyomi: ['うえ', 'うわ', 'かみ', 'あ-げる', 'のぼ-る'],
    strokeCount: 3, jlptLevel: 'N5', radicals: ['一', '上'], grade: 1,
    mnemonic: 'A line above — something going up.',
    examples: [{ word: '上手', reading: 'じょうず', meaning: 'skillful' }, { word: '上', reading: 'うえ', meaning: 'above / on top' }, { word: '地上', reading: 'ちじょう', meaning: 'above ground' }]
  },
  {
    id: 'k034', kanji: '下', meanings: ['below', 'down', 'under', 'lower'], onyomi: ['カ', 'ゲ'], kunyomi: ['した', 'しも', 'もと', 'さ-げる', 'くだ-る'],
    strokeCount: 3, jlptLevel: 'N5', radicals: ['一', '下'], grade: 1,
    mnemonic: 'A line below — something going down.',
    examples: [{ word: '下手', reading: 'へた', meaning: 'unskillful' }, { word: '下', reading: 'した', meaning: 'below / under' }, { word: '地下', reading: 'ちか', meaning: 'underground' }]
  },
  {
    id: 'k035', kanji: '国', meanings: ['country', 'nation'], onyomi: ['コク'], kunyomi: ['くに'],
    strokeCount: 8, jlptLevel: 'N5', radicals: ['囗', '玉'], grade: 2,
    mnemonic: 'A jewel (precious thing) enclosed within borders.',
    examples: [{ word: '日本', reading: 'にほん', meaning: 'Japan' }, { word: '外国', reading: 'がいこく', meaning: 'foreign country' }, { word: '中国', reading: 'ちゅうごく', meaning: 'China' }]
  },
  {
    id: 'k036', kanji: '語', meanings: ['language', 'word', 'speech'], onyomi: ['ゴ'], kunyomi: ['かた-る', 'かた-らう'],
    strokeCount: 14, jlptLevel: 'N5', radicals: ['言', '吾'], grade: 2,
    mnemonic: 'Words (言) that I (吾) speak — language.',
    examples: [{ word: '日本語', reading: 'にほんご', meaning: 'Japanese language' }, { word: '英語', reading: 'えいご', meaning: 'English' }, { word: '語学', reading: 'ごがく', meaning: 'language study' }]
  },
  {
    id: 'k037', kanji: '学', meanings: ['study', 'learning', 'science'], onyomi: ['ガク'], kunyomi: ['まな-ぶ'],
    strokeCount: 8, jlptLevel: 'N5', radicals: ['学'], grade: 1,
    mnemonic: 'Hands reaching down to a child — teaching/learning.',
    examples: [{ word: '学校', reading: 'がっこう', meaning: 'school' }, { word: '大学', reading: 'だいがく', meaning: 'university' }, { word: '学生', reading: 'がくせい', meaning: 'student' }]
  },
  {
    id: 'k038', kanji: '校', meanings: ['school'], onyomi: ['コウ'], kunyomi: [],
    strokeCount: 10, jlptLevel: 'N5', radicals: ['木', '交'], grade: 1,
    mnemonic: 'A wooden (木) building where things cross (交) paths — school.',
    examples: [{ word: '学校', reading: 'がっこう', meaning: 'school' }, { word: '高校', reading: 'こうこう', meaning: 'high school' }]
  },
  {
    id: 'k039', kanji: '先', meanings: ['ahead', 'before', 'previous', 'tip'], onyomi: ['セン'], kunyomi: ['さき', 'ま-ず'],
    strokeCount: 6, jlptLevel: 'N5', radicals: ['牛', '儿'], grade: 1,
    mnemonic: 'Walking ahead (先) — going first.',
    examples: [{ word: '先生', reading: 'せんせい', meaning: 'teacher' }, { word: '先週', reading: 'せんしゅう', meaning: 'last week' }, { word: '先月', reading: 'せんげつ', meaning: 'last month' }]
  },
  {
    id: 'k040', kanji: '生', meanings: ['life', 'birth', 'fresh', 'raw'], onyomi: ['セイ', 'ショウ'], kunyomi: ['い-きる', 'う-む', 'は-える', 'き', 'なま'],
    strokeCount: 5, jlptLevel: 'N5', radicals: ['生'], grade: 1,
    mnemonic: 'A sprout growing from the ground — new life.',
    examples: [{ word: '先生', reading: 'せんせい', meaning: 'teacher' }, { word: '学生', reading: 'がくせい', meaning: 'student' }, { word: '生活', reading: 'せいかつ', meaning: 'life/living' }]
  },
];

export const kanjiByLevel = {
  N5: kanjiData.filter(k => k.jlptLevel === 'N5'),
  N4: kanjiData.filter(k => k.jlptLevel === 'N4'),
  N3: kanjiData.filter(k => k.jlptLevel === 'N3'),
  N2: kanjiData.filter(k => k.jlptLevel === 'N2'),
  N1: kanjiData.filter(k => k.jlptLevel === 'N1'),
};
