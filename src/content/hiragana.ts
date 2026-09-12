export interface KanaChar {
  char: string;
  romaji: string;
  audioKey: string;
  strokeCount: number;
  examples: { word: string; reading: string; meaning: string }[];
  group: string;
}

export const hiraganaData: KanaChar[] = [
  // Vowels
  { char: 'あ', romaji: 'a', audioKey: 'a', strokeCount: 3, group: 'vowels', examples: [{ word: 'あめ', reading: 'ame', meaning: 'rain' }, { word: 'あか', reading: 'aka', meaning: 'red' }] },
  { char: 'い', romaji: 'i', audioKey: 'i', strokeCount: 2, group: 'vowels', examples: [{ word: 'いぬ', reading: 'inu', meaning: 'dog' }, { word: 'いす', reading: 'isu', meaning: 'chair' }] },
  { char: 'う', romaji: 'u', audioKey: 'u', strokeCount: 2, group: 'vowels', examples: [{ word: 'うみ', reading: 'umi', meaning: 'sea' }, { word: 'うた', reading: 'uta', meaning: 'song' }] },
  { char: 'え', romaji: 'e', audioKey: 'e', strokeCount: 2, group: 'vowels', examples: [{ word: 'えき', reading: 'eki', meaning: 'station' }, { word: 'えん', reading: 'en', meaning: 'yen / circle' }] },
  { char: 'お', romaji: 'o', audioKey: 'o', strokeCount: 3, group: 'vowels', examples: [{ word: 'おか', reading: 'oka', meaning: 'hill' }, { word: 'おに', reading: 'oni', meaning: 'demon' }] },
  // K row
  { char: 'か', romaji: 'ka', audioKey: 'ka', strokeCount: 3, group: 'k', examples: [{ word: 'かさ', reading: 'kasa', meaning: 'umbrella' }, { word: 'かお', reading: 'kao', meaning: 'face' }] },
  { char: 'き', romaji: 'ki', audioKey: 'ki', strokeCount: 4, group: 'k', examples: [{ word: 'きた', reading: 'kita', meaning: 'north' }, { word: 'きつね', reading: 'kitsune', meaning: 'fox' }] },
  { char: 'く', romaji: 'ku', audioKey: 'ku', strokeCount: 1, group: 'k', examples: [{ word: 'くに', reading: 'kuni', meaning: 'country' }, { word: 'くも', reading: 'kumo', meaning: 'cloud' }] },
  { char: 'け', romaji: 'ke', audioKey: 'ke', strokeCount: 3, group: 'k', examples: [{ word: 'けん', reading: 'ken', meaning: 'prefecture' }, { word: 'けむり', reading: 'kemuri', meaning: 'smoke' }] },
  { char: 'こ', romaji: 'ko', audioKey: 'ko', strokeCount: 2, group: 'k', examples: [{ word: 'こえ', reading: 'koe', meaning: 'voice' }, { word: 'こども', reading: 'kodomo', meaning: 'child' }] },
  // S row
  { char: 'さ', romaji: 'sa', audioKey: 'sa', strokeCount: 3, group: 's', examples: [{ word: 'さかな', reading: 'sakana', meaning: 'fish' }, { word: 'さくら', reading: 'sakura', meaning: 'cherry blossom' }] },
  { char: 'し', romaji: 'shi', audioKey: 'shi', strokeCount: 1, group: 's', examples: [{ word: 'しお', reading: 'shio', meaning: 'salt' }, { word: 'しろ', reading: 'shiro', meaning: 'white/castle' }] },
  { char: 'す', romaji: 'su', audioKey: 'su', strokeCount: 2, group: 's', examples: [{ word: 'すし', reading: 'sushi', meaning: 'sushi' }, { word: 'すな', reading: 'suna', meaning: 'sand' }] },
  { char: 'せ', romaji: 'se', audioKey: 'se', strokeCount: 3, group: 's', examples: [{ word: 'せかい', reading: 'sekai', meaning: 'world' }, { word: 'せんせい', reading: 'sensei', meaning: 'teacher' }] },
  { char: 'そ', romaji: 'so', audioKey: 'so', strokeCount: 2, group: 's', examples: [{ word: 'そら', reading: 'sora', meaning: 'sky' }, { word: 'そで', reading: 'sode', meaning: 'sleeve' }] },
  // T row
  { char: 'た', romaji: 'ta', audioKey: 'ta', strokeCount: 4, group: 't', examples: [{ word: 'たこ', reading: 'tako', meaning: 'octopus' }, { word: 'たいよう', reading: 'taiyou', meaning: 'sun' }] },
  { char: 'ち', romaji: 'chi', audioKey: 'chi', strokeCount: 2, group: 't', examples: [{ word: 'ちず', reading: 'chizu', meaning: 'map' }, { word: 'ちから', reading: 'chikara', meaning: 'strength' }] },
  { char: 'つ', romaji: 'tsu', audioKey: 'tsu', strokeCount: 1, group: 't', examples: [{ word: 'つき', reading: 'tsuki', meaning: 'moon' }, { word: 'つくえ', reading: 'tsukue', meaning: 'desk' }] },
  { char: 'て', romaji: 'te', audioKey: 'te', strokeCount: 1, group: 't', examples: [{ word: 'てら', reading: 'tera', meaning: 'temple' }, { word: 'てがみ', reading: 'tegami', meaning: 'letter' }] },
  { char: 'と', romaji: 'to', audioKey: 'to', strokeCount: 2, group: 't', examples: [{ word: 'とり', reading: 'tori', meaning: 'bird' }, { word: 'とけい', reading: 'tokei', meaning: 'clock' }] },
  // N row
  { char: 'な', romaji: 'na', audioKey: 'na', strokeCount: 4, group: 'n', examples: [{ word: 'なつ', reading: 'natsu', meaning: 'summer' }, { word: 'なまえ', reading: 'namae', meaning: 'name' }] },
  { char: 'に', romaji: 'ni', audioKey: 'ni', strokeCount: 3, group: 'n', examples: [{ word: 'にく', reading: 'niku', meaning: 'meat' }, { word: 'にほん', reading: 'nihon', meaning: 'Japan' }] },
  { char: 'ぬ', romaji: 'nu', audioKey: 'nu', strokeCount: 2, group: 'n', examples: [{ word: 'ぬの', reading: 'nuno', meaning: 'cloth' }, { word: 'ぬま', reading: 'numa', meaning: 'swamp' }] },
  { char: 'ね', romaji: 'ne', audioKey: 'ne', strokeCount: 2, group: 'n', examples: [{ word: 'ねこ', reading: 'neko', meaning: 'cat' }, { word: 'ねつ', reading: 'netsu', meaning: 'fever' }] },
  { char: 'の', romaji: 'no', audioKey: 'no', strokeCount: 1, group: 'n', examples: [{ word: 'のり', reading: 'nori', meaning: 'seaweed' }, { word: 'のど', reading: 'nodo', meaning: 'throat' }] },
  // H row
  { char: 'は', romaji: 'ha', audioKey: 'ha', strokeCount: 3, group: 'h', examples: [{ word: 'はな', reading: 'hana', meaning: 'flower/nose' }, { word: 'はる', reading: 'haru', meaning: 'spring' }] },
  { char: 'ひ', romaji: 'hi', audioKey: 'hi', strokeCount: 1, group: 'h', examples: [{ word: 'ひと', reading: 'hito', meaning: 'person' }, { word: 'ひかり', reading: 'hikari', meaning: 'light' }] },
  { char: 'ふ', romaji: 'fu', audioKey: 'fu', strokeCount: 4, group: 'h', examples: [{ word: 'ふじ', reading: 'fuji', meaning: 'Mt. Fuji' }, { word: 'ふね', reading: 'fune', meaning: 'ship' }] },
  { char: 'へ', romaji: 'he', audioKey: 'he', strokeCount: 1, group: 'h', examples: [{ word: 'へや', reading: 'heya', meaning: 'room' }, { word: 'へた', reading: 'heta', meaning: 'unskilled' }] },
  { char: 'ほ', romaji: 'ho', audioKey: 'ho', strokeCount: 4, group: 'h', examples: [{ word: 'ほし', reading: 'hoshi', meaning: 'star' }, { word: 'ほん', reading: 'hon', meaning: 'book' }] },
  // M row
  { char: 'ま', romaji: 'ma', audioKey: 'ma', strokeCount: 3, group: 'm', examples: [{ word: 'まち', reading: 'machi', meaning: 'town' }, { word: 'まど', reading: 'mado', meaning: 'window' }] },
  { char: 'み', romaji: 'mi', audioKey: 'mi', strokeCount: 2, group: 'm', examples: [{ word: 'みず', reading: 'mizu', meaning: 'water' }, { word: 'みち', reading: 'michi', meaning: 'road' }] },
  { char: 'む', romaji: 'mu', audioKey: 'mu', strokeCount: 3, group: 'm', examples: [{ word: 'むし', reading: 'mushi', meaning: 'insect' }, { word: 'むら', reading: 'mura', meaning: 'village' }] },
  { char: 'め', romaji: 'me', audioKey: 'me', strokeCount: 2, group: 'm', examples: [{ word: 'めだか', reading: 'medaka', meaning: 'killifish' }, { word: 'めがね', reading: 'megane', meaning: 'glasses' }] },
  { char: 'も', romaji: 'mo', audioKey: 'mo', strokeCount: 3, group: 'm', examples: [{ word: 'もも', reading: 'momo', meaning: 'peach' }, { word: 'もり', reading: 'mori', meaning: 'forest' }] },
  // Y row
  { char: 'や', romaji: 'ya', audioKey: 'ya', strokeCount: 3, group: 'y', examples: [{ word: 'やま', reading: 'yama', meaning: 'mountain' }, { word: 'やさい', reading: 'yasai', meaning: 'vegetable' }] },
  { char: 'ゆ', romaji: 'yu', audioKey: 'yu', strokeCount: 2, group: 'y', examples: [{ word: 'ゆき', reading: 'yuki', meaning: 'snow' }, { word: 'ゆめ', reading: 'yume', meaning: 'dream' }] },
  { char: 'よ', romaji: 'yo', audioKey: 'yo', strokeCount: 2, group: 'y', examples: [{ word: 'よる', reading: 'yoru', meaning: 'night' }, { word: 'よん', reading: 'yon', meaning: 'four' }] },
  // R row
  { char: 'ら', romaji: 'ra', audioKey: 'ra', strokeCount: 2, group: 'r', examples: [{ word: 'らいねん', reading: 'rainen', meaning: 'next year' }, { word: 'らく', reading: 'raku', meaning: 'easy/comfortable' }] },
  { char: 'り', romaji: 'ri', audioKey: 'ri', strokeCount: 2, group: 'r', examples: [{ word: 'りんご', reading: 'ringo', meaning: 'apple' }, { word: 'りょう', reading: 'ryou', meaning: 'dormitory' }] },
  { char: 'る', romaji: 'ru', audioKey: 'ru', strokeCount: 1, group: 'r', examples: [{ word: 'るす', reading: 'rusu', meaning: 'absence' }, { word: 'るび', reading: 'rubi', meaning: 'ruby' }] },
  { char: 'れ', romaji: 're', audioKey: 're', strokeCount: 2, group: 'r', examples: [{ word: 'れきし', reading: 'rekishi', meaning: 'history' }, { word: 'れんしゅう', reading: 'renshuu', meaning: 'practice' }] },
  { char: 'ろ', romaji: 'ro', audioKey: 'ro', strokeCount: 1, group: 'r', examples: [{ word: 'ろうか', reading: 'rouka', meaning: 'corridor' }, { word: 'ろく', reading: 'roku', meaning: 'six' }] },
  // W row
  { char: 'わ', romaji: 'wa', audioKey: 'wa', strokeCount: 2, group: 'w', examples: [{ word: 'わに', reading: 'wani', meaning: 'crocodile' }, { word: 'わかい', reading: 'wakai', meaning: 'young' }] },
  { char: 'を', romaji: 'wo', audioKey: 'wo', strokeCount: 3, group: 'w', examples: [{ word: 'を (particle)', reading: 'wo', meaning: 'object particle' }] },
  // N
  { char: 'ん', romaji: 'n', audioKey: 'n', strokeCount: 1, group: 'n_alone', examples: [{ word: 'ほん', reading: 'hon', meaning: 'book' }, { word: 'でんわ', reading: 'denwa', meaning: 'telephone' }] },
];

export const hiraganaGroups = [
  { id: 'vowels', label: 'Vowels', chars: ['あ', 'い', 'う', 'え', 'お'] },
  { id: 'k', label: 'K-row', chars: ['か', 'き', 'く', 'け', 'こ'] },
  { id: 's', label: 'S-row', chars: ['さ', 'し', 'す', 'せ', 'そ'] },
  { id: 't', label: 'T-row', chars: ['た', 'ち', 'つ', 'て', 'と'] },
  { id: 'n', label: 'N-row', chars: ['な', 'に', 'ぬ', 'ね', 'の'] },
  { id: 'h', label: 'H-row', chars: ['は', 'ひ', 'ふ', 'へ', 'ほ'] },
  { id: 'm', label: 'M-row', chars: ['ま', 'み', 'む', 'め', 'も'] },
  { id: 'y', label: 'Y-row', chars: ['や', 'ゆ', 'よ'] },
  { id: 'r', label: 'R-row', chars: ['ら', 'り', 'る', 'れ', 'ろ'] },
  { id: 'w', label: 'W-row', chars: ['わ', 'を'] },
  { id: 'n_alone', label: 'N', chars: ['ん'] },
];
