import { KanaChar } from './hiragana';
export type { KanaChar };

export const katakanaData: KanaChar[] = [
  // Vowels
  { char: 'ア', romaji: 'a', audioKey: 'a', strokeCount: 2, group: 'vowels', examples: [{ word: 'アイス', reading: 'aisu', meaning: 'ice cream' }, { word: 'アメリカ', reading: 'Amerika', meaning: 'America' }] },
  { char: 'イ', romaji: 'i', audioKey: 'i', strokeCount: 2, group: 'vowels', examples: [{ word: 'イタリア', reading: 'Itaria', meaning: 'Italy' }, { word: 'インク', reading: 'inku', meaning: 'ink' }] },
  { char: 'ウ', romaji: 'u', audioKey: 'u', strokeCount: 3, group: 'vowels', examples: [{ word: 'ウイルス', reading: 'uirusu', meaning: 'virus' }, { word: 'ウォーター', reading: 'wōtā', meaning: 'water' }] },
  { char: 'エ', romaji: 'e', audioKey: 'e', strokeCount: 3, group: 'vowels', examples: [{ word: 'エレベーター', reading: 'erebētā', meaning: 'elevator' }, { word: 'エアコン', reading: 'eakon', meaning: 'air conditioner' }] },
  { char: 'オ', romaji: 'o', audioKey: 'o', strokeCount: 3, group: 'vowels', examples: [{ word: 'オレンジ', reading: 'orenji', meaning: 'orange' }, { word: 'オフィス', reading: 'ofisu', meaning: 'office' }] },
  // K row
  { char: 'カ', romaji: 'ka', audioKey: 'ka', strokeCount: 2, group: 'k', examples: [{ word: 'カメラ', reading: 'kamera', meaning: 'camera' }, { word: 'カフェ', reading: 'kafe', meaning: 'café' }] },
  { char: 'キ', romaji: 'ki', audioKey: 'ki', strokeCount: 3, group: 'k', examples: [{ word: 'キッチン', reading: 'kicchin', meaning: 'kitchen' }, { word: 'キロ', reading: 'kiro', meaning: 'kilo' }] },
  { char: 'ク', romaji: 'ku', audioKey: 'ku', strokeCount: 2, group: 'k', examples: [{ word: 'クラス', reading: 'kurasu', meaning: 'class' }, { word: 'クリスマス', reading: 'Kurisumasu', meaning: 'Christmas' }] },
  { char: 'ケ', romaji: 'ke', audioKey: 'ke', strokeCount: 3, group: 'k', examples: [{ word: 'ケーキ', reading: 'kēki', meaning: 'cake' }, { word: 'ケータイ', reading: 'kētai', meaning: 'mobile phone' }] },
  { char: 'コ', romaji: 'ko', audioKey: 'ko', strokeCount: 2, group: 'k', examples: [{ word: 'コーヒー', reading: 'kōhī', meaning: 'coffee' }, { word: 'コンビニ', reading: 'konbini', meaning: 'convenience store' }] },
  // S row
  { char: 'サ', romaji: 'sa', audioKey: 'sa', strokeCount: 3, group: 's', examples: [{ word: 'サラダ', reading: 'sarada', meaning: 'salad' }, { word: 'サービス', reading: 'sābisu', meaning: 'service' }] },
  { char: 'シ', romaji: 'shi', audioKey: 'shi', strokeCount: 3, group: 's', examples: [{ word: 'シャワー', reading: 'shawā', meaning: 'shower' }, { word: 'シアター', reading: 'shiatā', meaning: 'theater' }] },
  { char: 'ス', romaji: 'su', audioKey: 'su', strokeCount: 2, group: 's', examples: [{ word: 'スポーツ', reading: 'supōtsu', meaning: 'sports' }, { word: 'スーパー', reading: 'sūpā', meaning: 'supermarket' }] },
  { char: 'セ', romaji: 'se', audioKey: 'se', strokeCount: 3, group: 's', examples: [{ word: 'セーター', reading: 'sētā', meaning: 'sweater' }, { word: 'センター', reading: 'sentā', meaning: 'center' }] },
  { char: 'ソ', romaji: 'so', audioKey: 'so', strokeCount: 2, group: 's', examples: [{ word: 'ソファ', reading: 'sofa', meaning: 'sofa' }, { word: 'ソース', reading: 'sōsu', meaning: 'sauce' }] },
  // T row
  { char: 'タ', romaji: 'ta', audioKey: 'ta', strokeCount: 3, group: 't', examples: [{ word: 'タクシー', reading: 'takushī', meaning: 'taxi' }, { word: 'タオル', reading: 'taoru', meaning: 'towel' }] },
  { char: 'チ', romaji: 'chi', audioKey: 'chi', strokeCount: 3, group: 't', examples: [{ word: 'チーズ', reading: 'chīzu', meaning: 'cheese' }, { word: 'チケット', reading: 'chiketto', meaning: 'ticket' }] },
  { char: 'ツ', romaji: 'tsu', audioKey: 'tsu', strokeCount: 3, group: 't', examples: [{ word: 'ツアー', reading: 'tsuā', meaning: 'tour' }, { word: 'ツナ', reading: 'tsuna', meaning: 'tuna' }] },
  { char: 'テ', romaji: 'te', audioKey: 'te', strokeCount: 3, group: 't', examples: [{ word: 'テレビ', reading: 'terebi', meaning: 'television' }, { word: 'テスト', reading: 'tesuto', meaning: 'test' }] },
  { char: 'ト', romaji: 'to', audioKey: 'to', strokeCount: 2, group: 't', examples: [{ word: 'トイレ', reading: 'toire', meaning: 'toilet' }, { word: 'トマト', reading: 'tomato', meaning: 'tomato' }] },
  // N row
  { char: 'ナ', romaji: 'na', audioKey: 'na', strokeCount: 2, group: 'n', examples: [{ word: 'ナイフ', reading: 'naifu', meaning: 'knife' }, { word: 'ナンバー', reading: 'nanbā', meaning: 'number' }] },
  { char: 'ニ', romaji: 'ni', audioKey: 'ni', strokeCount: 2, group: 'n', examples: [{ word: 'ニュース', reading: 'nyūsu', meaning: 'news' }, { word: 'ニコニコ', reading: 'nikoniko', meaning: 'smiling' }] },
  { char: 'ヌ', romaji: 'nu', audioKey: 'nu', strokeCount: 2, group: 'n', examples: [{ word: 'ヌードル', reading: 'nūdoru', meaning: 'noodle' }] },
  { char: 'ネ', romaji: 'ne', audioKey: 'ne', strokeCount: 4, group: 'n', examples: [{ word: 'ネクタイ', reading: 'nekutai', meaning: 'necktie' }, { word: 'ネット', reading: 'netto', meaning: 'internet/net' }] },
  { char: 'ノ', romaji: 'no', audioKey: 'no', strokeCount: 1, group: 'n', examples: [{ word: 'ノート', reading: 'nōto', meaning: 'notebook' }, { word: 'ノイズ', reading: 'noizu', meaning: 'noise' }] },
  // H row
  { char: 'ハ', romaji: 'ha', audioKey: 'ha', strokeCount: 2, group: 'h', examples: [{ word: 'ハンバーガー', reading: 'hanbāgā', meaning: 'hamburger' }, { word: 'ホテル', reading: 'hoteru', meaning: 'hotel' }] },
  { char: 'ヒ', romaji: 'hi', audioKey: 'hi', strokeCount: 2, group: 'h', examples: [{ word: 'ヒーター', reading: 'hītā', meaning: 'heater' }, { word: 'ヒント', reading: 'hinto', meaning: 'hint' }] },
  { char: 'フ', romaji: 'fu', audioKey: 'fu', strokeCount: 1, group: 'h', examples: [{ word: 'フランス', reading: 'Furansu', meaning: 'France' }, { word: 'フォーク', reading: 'fōku', meaning: 'fork' }] },
  { char: 'ヘ', romaji: 'he', audioKey: 'he', strokeCount: 1, group: 'h', examples: [{ word: 'ヘルメット', reading: 'herumetto', meaning: 'helmet' }, { word: 'ヘア', reading: 'hea', meaning: 'hair' }] },
  { char: 'ホ', romaji: 'ho', audioKey: 'ho', strokeCount: 4, group: 'h', examples: [{ word: 'ホテル', reading: 'hoteru', meaning: 'hotel' }, { word: 'ホームページ', reading: 'hōmupēji', meaning: 'homepage' }] },
  // M row
  { char: 'マ', romaji: 'ma', audioKey: 'ma', strokeCount: 3, group: 'm', examples: [{ word: 'マクドナルド', reading: 'Makudonarudo', meaning: "McDonald's" }, { word: 'マップ', reading: 'mappu', meaning: 'map' }] },
  { char: 'ミ', romaji: 'mi', audioKey: 'mi', strokeCount: 3, group: 'm', examples: [{ word: 'ミルク', reading: 'miruku', meaning: 'milk' }, { word: 'ミーティング', reading: 'mītingu', meaning: 'meeting' }] },
  { char: 'ム', romaji: 'mu', audioKey: 'mu', strokeCount: 2, group: 'm', examples: [{ word: 'ムービー', reading: 'mūbī', meaning: 'movie' }] },
  { char: 'メ', romaji: 'me', audioKey: 'me', strokeCount: 2, group: 'm', examples: [{ word: 'メール', reading: 'mēru', meaning: 'email' }, { word: 'メニュー', reading: 'menyū', meaning: 'menu' }] },
  { char: 'モ', romaji: 'mo', audioKey: 'mo', strokeCount: 3, group: 'm', examples: [{ word: 'モデル', reading: 'moderu', meaning: 'model' }, { word: 'モール', reading: 'mōru', meaning: 'mall' }] },
  // Y row
  { char: 'ヤ', romaji: 'ya', audioKey: 'ya', strokeCount: 2, group: 'y', examples: [{ word: 'ヤード', reading: 'yādo', meaning: 'yard' }, { word: 'ヤング', reading: 'yangu', meaning: 'young' }] },
  { char: 'ユ', romaji: 'yu', audioKey: 'yu', strokeCount: 2, group: 'y', examples: [{ word: 'ユニフォーム', reading: 'yunifōmu', meaning: 'uniform' }, { word: 'ユーモア', reading: 'yūmoa', meaning: 'humor' }] },
  { char: 'ヨ', romaji: 'yo', audioKey: 'yo', strokeCount: 3, group: 'y', examples: [{ word: 'ヨーロッパ', reading: 'Yōroppa', meaning: 'Europe' }, { word: 'ヨガ', reading: 'yoga', meaning: 'yoga' }] },
  // R row
  { char: 'ラ', romaji: 'ra', audioKey: 'ra', strokeCount: 2, group: 'r', examples: [{ word: 'ラジオ', reading: 'rajio', meaning: 'radio' }, { word: 'ラーメン', reading: 'rāmen', meaning: 'ramen' }] },
  { char: 'リ', romaji: 'ri', audioKey: 'ri', strokeCount: 2, group: 'r', examples: [{ word: 'リモコン', reading: 'rimokon', meaning: 'remote control' }, { word: 'リスト', reading: 'risuto', meaning: 'list' }] },
  { char: 'ル', romaji: 'ru', audioKey: 'ru', strokeCount: 2, group: 'r', examples: [{ word: 'ルーム', reading: 'rūmu', meaning: 'room' }, { word: 'ルール', reading: 'rūru', meaning: 'rule' }] },
  { char: 'レ', romaji: 're', audioKey: 're', strokeCount: 1, group: 'r', examples: [{ word: 'レストラン', reading: 'resutoran', meaning: 'restaurant' }, { word: 'レポート', reading: 'repōto', meaning: 'report' }] },
  { char: 'ロ', romaji: 'ro', audioKey: 'ro', strokeCount: 3, group: 'r', examples: [{ word: 'ロボット', reading: 'robotto', meaning: 'robot' }, { word: 'ロシア', reading: 'Roshia', meaning: 'Russia' }] },
  // W row
  { char: 'ワ', romaji: 'wa', audioKey: 'wa', strokeCount: 2, group: 'w', examples: [{ word: 'ワイン', reading: 'wain', meaning: 'wine' }, { word: 'ワールド', reading: 'wārudo', meaning: 'world' }] },
  { char: 'ヲ', romaji: 'wo', audioKey: 'wo', strokeCount: 3, group: 'w', examples: [{ word: 'ヲ (particle)', reading: 'wo', meaning: 'object particle (rare in katakana)' }] },
  // N
  { char: 'ン', romaji: 'n', audioKey: 'n', strokeCount: 2, group: 'n_alone', examples: [{ word: 'パン', reading: 'pan', meaning: 'bread' }, { word: 'テレビン', reading: 'terebin', meaning: 'turpentine' }] },
];

export const katakanaGroups = [
  { id: 'vowels', label: 'Vowels', chars: ['ア', 'イ', 'ウ', 'エ', 'オ'] },
  { id: 'k', label: 'K-row', chars: ['カ', 'キ', 'ク', 'ケ', 'コ'] },
  { id: 's', label: 'S-row', chars: ['サ', 'シ', 'ス', 'セ', 'ソ'] },
  { id: 't', label: 'T-row', chars: ['タ', 'チ', 'ツ', 'テ', 'ト'] },
  { id: 'n', label: 'N-row', chars: ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'] },
  { id: 'h', label: 'H-row', chars: ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'] },
  { id: 'm', label: 'M-row', chars: ['マ', 'ミ', 'ム', 'メ', 'モ'] },
  { id: 'y', label: 'Y-row', chars: ['ヤ', 'ユ', 'ヨ'] },
  { id: 'r', label: 'R-row', chars: ['ラ', 'リ', 'ル', 'レ', 'ロ'] },
  { id: 'w', label: 'W-row', chars: ['ワ', 'ヲ'] },
  { id: 'n_alone', label: 'N', chars: ['ン'] },
];

export const loanWordExamples = [
  { katakana: 'コーヒー', romaji: 'kōhī', english: 'coffee', category: 'food' },
  { katakana: 'テレビ', romaji: 'terebi', english: 'television', category: 'technology' },
  { katakana: 'ホテル', romaji: 'hoteru', english: 'hotel', category: 'travel' },
  { katakana: 'バス', romaji: 'basu', english: 'bus', category: 'transport' },
  { katakana: 'コンピューター', romaji: 'konpyūtā', english: 'computer', category: 'technology' },
  { katakana: 'スマートフォン', romaji: 'sumātofon', english: 'smartphone', category: 'technology' },
  { katakana: 'アイスクリーム', romaji: 'aisu kurīmu', english: 'ice cream', category: 'food' },
  { katakana: 'レストラン', romaji: 'resutoran', english: 'restaurant', category: 'food' },
  { katakana: 'タクシー', romaji: 'takushī', english: 'taxi', category: 'transport' },
  { katakana: 'チョコレート', romaji: 'chokurēto', english: 'chocolate', category: 'food' },
  { katakana: 'サンドイッチ', romaji: 'sandoitchi', english: 'sandwich', category: 'food' },
  { katakana: 'スーパーマーケット', romaji: 'sūpāmāketto', english: 'supermarket', category: 'places' },
];
