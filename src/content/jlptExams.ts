export interface JLPTQuestion {
  id: number;
  section: 'Vocabulary' | 'Grammar' | 'Kanji' | 'Reading' | 'Listening';
  japanesePrompt: string;
  subPrompt?: string;
  audioText?: string;
  options: string[];
  answer: string;
  explanation: string;
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
}

export const jlptExamBank: Record<'N5' | 'N4' | 'N3' | 'N2' | 'N1', JLPTQuestion[]> = {
  N5: [
    {
      id: 1,
      section: 'Kanji',
      japanesePrompt: '「日曜日」の読み方はどれですか？',
      subPrompt: 'How is 「日曜日」 pronounced?',
      options: ['にちようび', 'げつようび', 'かようび', 'すいようび'],
      answer: 'にちようび',
      explanation: '日曜日 is pronounced にちようび (Nichiyoubi) and means Sunday.',
      jlptLevel: 'N5'
    },
    {
      id: 2,
      section: 'Vocabulary',
      japanesePrompt: '毎朝、パンを___。',
      subPrompt: 'Select the verb meaning "to eat".',
      options: ['食べます', '飲みます', '見ます', '行きます'],
      answer: '食べます',
      explanation: '食べます (tabemasu) means to eat. パンを食べます = eat bread.',
      jlptLevel: 'N5'
    },
    {
      id: 3,
      section: 'Grammar',
      japanesePrompt: '私___田中です。よろしくお願いします。',
      subPrompt: 'Choose the appropriate topic marker particle.',
      options: ['は', 'を', 'に', 'で'],
      answer: 'は',
      explanation: '「は」(wa) marks the topic of the sentence: 私は田中です (As for me, I am Tanaka).',
      jlptLevel: 'N5'
    },
    {
      id: 4,
      section: 'Grammar',
      japanesePrompt: '昨日、デパート___靴を買いました。',
      subPrompt: 'Choose the particle that marks the location of an action.',
      options: ['で', 'に', 'へ', 'と'],
      answer: 'で',
      explanation: '「で」(de) marks the place where an active event or action takes place.',
      jlptLevel: 'N5'
    },
    {
      id: 5,
      section: 'Listening',
      japanesePrompt: '【聴解問題】音声を聞いて、質問に答えてください。',
      subPrompt: 'Listen to the audio: What does the speaker want to drink?',
      audioText: 'すみません、冷たい水を一杯ください。',
      options: ['お茶', '水', 'コーヒー', 'ビール'],
      answer: '水',
      explanation: 'The speaker said: 「冷たい水を一杯ください」(Please give me a glass of cold water).',
      jlptLevel: 'N5'
    },
    {
      id: 6,
      section: 'Reading',
      japanesePrompt: '【短文読解】\n「私の部屋には机と本棚があります。机の上にパソコンがあります。」\n質問：机の上には何がありますか？',
      subPrompt: 'What is located on the desk?',
      options: ['パソコン', '本棚', '猫', 'テレビ'],
      answer: 'パソコン',
      explanation: 'The passage explicitly states 「机の上にパソコンがあります」(There is a personal computer on the desk).',
      jlptLevel: 'N5'
    }
  ],

  N4: [
    {
      id: 1,
      section: 'Grammar',
      japanesePrompt: '来年、日本へ___と思っています。',
      subPrompt: 'Choose the volitional form expressing intent.',
      options: ['行こう', '行く', '行きます', '行けば'],
      answer: '行こう',
      explanation: 'Volitional form + と思っています expresses a speaker’s intention (行こうと思っています = I am thinking of going).',
      jlptLevel: 'N4'
    },
    {
      id: 2,
      section: 'Vocabulary',
      japanesePrompt: '部屋が暗いので、電気を___ください。',
      subPrompt: 'Select the verb meaning "to turn on (light)".',
      options: ['つけて', '消して', 'あけて', 'しめて'],
      answer: 'つけて',
      explanation: '電気をつける (tsukeru) means to turn on the light. 電気をつける ➔ つけてください.',
      jlptLevel: 'N4'
    },
    {
      id: 3,
      section: 'Kanji',
      japanesePrompt: '「案内」の読み方はどれですか？',
      subPrompt: 'What is the correct reading for 「案内」?',
      options: ['あんない', 'あんないん', 'あない', 'こうない'],
      answer: 'あんない',
      explanation: '案内 (annai) means guidance or information.',
      jlptLevel: 'N4'
    },
    {
      id: 4,
      section: 'Grammar',
      japanesePrompt: '雨が降って___、試合は続きました。',
      subPrompt: 'Express "even though / despite".',
      options: ['いたのに', 'いたら', 'いれば', 'いたから'],
      answer: 'いたのに',
      explanation: '「のに」(noni) expresses contrast or unexpected outcome: "Even though it was raining, the match continued."',
      jlptLevel: 'N4'
    },
    {
      id: 5,
      section: 'Listening',
      japanesePrompt: '【聴解問題】音声を聞いて、明日の集合場所を選んでください。',
      subPrompt: 'Listen to the audio: Where will they meet tomorrow?',
      audioText: '明日は雨が降るかもしれませんから、駅の改札の前で待ち合わせましょう。',
      options: ['駅の改札の前', '公園のベンチ', '学校の教室', 'カフェの中'],
      answer: '駅の改札の前',
      explanation: 'The speaker decided: 「駅の改札の前で待ち合わせましょう」(Let\'s meet in front of the station ticket gates).',
      jlptLevel: 'N4'
    },
    {
      id: 6,
      section: 'Reading',
      japanesePrompt: '【短文読解】\n「最近、健康のために毎朝30分ジョギングをすることにしています。雨の日だけは家でストレッチをします。」\n質問：雨の日は何をしますか？',
      subPrompt: 'What does the person do on rainy days?',
      options: ['家でストレッチ', '外でジョギング', '水泳に行く', '何もしない'],
      answer: '家でストレッチ',
      explanation: 'The passage says 「雨の日だけは家でストレッチをします」(Only on rainy days I do stretching at home).',
      jlptLevel: 'N4'
    }
  ],

  N3: [
    {
      id: 1,
      section: 'Grammar',
      japanesePrompt: 'いくら忙しくても、健康のために野菜を___ようにしています。',
      subPrompt: 'Express conscious ongoing effort.',
      options: ['食べる', '食べた', '食べられる', '食べよう'],
      answer: '食べる',
      explanation: 'Dictionary form verb + ようにしている expresses making a conscious habit or regular effort.',
      jlptLevel: 'N3'
    },
    {
      id: 2,
      section: 'Vocabulary',
      japanesePrompt: '試験の前に、これまでの復習を___行う必要がある。',
      subPrompt: 'Choose the adverb meaning "thoroughly / firmly".',
      options: ['しっかり', 'すっきり', 'うっかり', 'がっかり'],
      answer: 'しっかり',
      explanation: 'しっかり (shikkari) means properly, solidly, thoroughly.',
      jlptLevel: 'N3'
    },
    {
      id: 3,
      section: 'Grammar',
      japanesePrompt: 'この仕事は、経験者で___難しいと言われています。',
      subPrompt: 'Express "even for [someone]".',
      options: ['あっても', 'あっては', 'あってもない', 'あれば'],
      answer: 'あっても',
      explanation: '〜であっても means "even if / even for": 経験者であっても難しい (Even for an experienced person, it is difficult).',
      jlptLevel: 'N3'
    },
    {
      id: 4,
      section: 'Kanji',
      japanesePrompt: '「複雑な問題」の「複雑」の読み方はどれですか？',
      subPrompt: 'Select reading for 複雑.',
      options: ['ふくざつ', 'ふくさつ', 'ふくぞう', 'ふくしつ'],
      answer: 'ふくざつ',
      explanation: '複雑 is pronounced ふくざつ (fukuzatsu) and means complicated / complex.',
      jlptLevel: 'N3'
    },
    {
      id: 5,
      section: 'Listening',
      japanesePrompt: '【聴解問題】音声を聞いて、女性が最初にするべきことを選んでください。',
      subPrompt: 'Listen to the audio: What is the first action to take?',
      audioText: '会議の準備ですが、資料をコピーする前に、まず会議室の予約状況を確認してください。',
      options: ['会議室の予約状況を確認する', '資料をコピーする', '部長に連絡する', 'プロジェクターを運ぶ'],
      answer: '会議室の予約状況を確認する',
      explanation: 'The speaker instructions say: 「まず会議室の予約状況を確認してください」(First check the conference room reservation status).',
      jlptLevel: 'N3'
    },
    {
      id: 6,
      section: 'Reading',
      japanesePrompt: '【短文読解】\n「SNSの普及によって情報収集は格段に容易になったが、真偽の定かでない情報に惑わされる危険性も高まっている。情報を鵜呑みにせず、発信元の信頼性を見極める姿勢が不可欠である。」\n質問：筆者が最も重要だと述べていることは何か？',
      subPrompt: 'What does the author emphasize most?',
      options: ['情報の信頼性を見極めること', 'SNSの利用を禁止すること', '情報の収集スピードを上げること', '多くのSNSに登録すること'],
      answer: '情報の信頼性を見極めること',
      explanation: 'The concluding sentence emphasizes: 「発信元の信頼性を見極める姿勢が不可欠である」(Critically evaluating the credibility of the information source is essential).',
      jlptLevel: 'N3'
    }
  ],

  N2: [
    {
      id: 1,
      section: 'Grammar',
      japanesePrompt: '社長のご挨拶に___、ただ今より新入社員歓迎会を開催いたします。',
      subPrompt: 'Choose the formal connective pattern.',
      options: ['もちまして', 'おいては', 'かんがみて', 'かかわらず'],
      answer: 'もちまして',
      explanation: '〜をもちまして is formal keigo used at events to indicate "with / through / as of": 社長のご挨拶をもちまして...',
      jlptLevel: 'N2'
    },
    {
      id: 2,
      section: 'Vocabulary',
      japanesePrompt: '長年の努力が実を結び、ついに研究が___を見た。',
      subPrompt: 'Idiomatic expression for "reached daylight / fruition".',
      options: ['日の目', '月の目', '光の目', '風の目'],
      answer: '日の目',
      explanation: '日の目を見る (hi no me wo miru) is an idiom meaning to see the light of day / to be recognized after long effort.',
      jlptLevel: 'N2'
    },
    {
      id: 3,
      section: 'Grammar',
      japanesePrompt: '彼ほどの優秀な人材であっても、この難問を解決することは___。',
      subPrompt: 'Express "incapable / cannot possibly do".',
      options: ['できまい', 'できるに違いない', 'できざるをえない', 'できかねるはずだ'],
      answer: 'できまい',
      explanation: '〜まい is negative conjecture: できまい means "probably cannot / surely cannot".',
      jlptLevel: 'N2'
    },
    {
      id: 4,
      section: 'Kanji',
      japanesePrompt: '「迅速な対応」の「迅速」の正しい読み方はどれですか？',
      subPrompt: 'Select correct reading for 迅速.',
      options: ['じんそく', 'しんそく', 'じんぞく', 'しんぞく'],
      answer: 'じんそく',
      explanation: '迅速 is read じんそく (jinsoku), meaning prompt / swift / speedy.',
      jlptLevel: 'N2'
    },
    {
      id: 5,
      section: 'Listening',
      japanesePrompt: '【聴解問題】音声を聞いて、取引先の懸念事項を特定してください。',
      subPrompt: 'Listen to the audio: What is the client\'s main concern?',
      audioText: '品質に関しては十分評価しておりますが、現行の納期の短縮が可能かどうかが契約締結の鍵となります。',
      options: ['納期の短縮ができるかどうか', '製品の品質が不十分なこと', '提示価格が高すぎること', '担当者の対応が遅いこと'],
      answer: '納期の短縮ができるかどうか',
      explanation: 'The speaker states: 「現行の納期の短縮が可能かどうかが契約締結の鍵となります」(Whether the current delivery timeline can be shortened is the key).',
      jlptLevel: 'N2'
    },
    {
      id: 6,
      section: 'Reading',
      japanesePrompt: '【長文読解】\n「現代社会における効率性の追求は、人間の創造的な思考の余白を削ぎ落としてきた側面がある。一見無駄に見える思索の時間こそが、画期的なイノベーションを生み出す土壌となるのである。」\n質問：筆者の考えと合致するものはどれか？',
      subPrompt: 'Which statement matches the author\'s view?',
      options: ['無駄に見える思索の時間こそがイノベーションを生む', 'あらゆる無駄を排除した効率性こそが不可欠である', '現代社会では創造的思考は不要である', '思考の余白は作業能率を著しく低下させる'],
      answer: '無駄に見える思索の時間こそがイノベーションを生む',
      explanation: 'The text highlights that seemingly wasteful contemplation provides the fertile ground for breakthrough innovation.',
      jlptLevel: 'N2'
    }
  ],

  N1: [
    {
      id: 1,
      section: 'Grammar',
      japanesePrompt: '不祥事の発覚により、同社は事業からの撤退を___。',
      subPrompt: 'Select formal expression meaning "was forced into / had no choice but to".',
      options: ['余儀なくされた', '禁じ得なかった', '極まりなかった', '至らなかった'],
      answer: '余儀なくされた',
      explanation: '〜を余儀なくされる (wo yoginaku sareru) means to be forced into a situation against one\'s will.',
      jlptLevel: 'N1'
    },
    {
      id: 2,
      section: 'Vocabulary',
      japanesePrompt: '彼の並々ならぬ執念には、ただただ___を巻くばかりだった。',
      subPrompt: 'Idiomatic phrase meaning "to be completely amazed / outdone".',
      options: ['舌', '首', '腕', '目'],
      answer: '舌',
      explanation: '舌を巻く (shita wo maku) is an idiomatic expression meaning to be astounded or deeply impressed by someone\'s prowess.',
      jlptLevel: 'N1'
    },
    {
      id: 3,
      section: 'Grammar',
      japanesePrompt: '国家の存亡に___重大な局面において、私利私欲を優先することは許されない。',
      subPrompt: 'Express "concerning / impacting (a grave matter)".',
      options: ['かかわる', '即した', 'のっとった', 'ふまえた'],
      answer: 'かかわる',
      explanation: '〜にかかわる (ni kakawaru) indicates involving or impacting heavily: 国家の存亡にかかわる (concerning the very survival of the nation).',
      jlptLevel: 'N1'
    },
    {
      id: 4,
      section: 'Kanji',
      japanesePrompt: '「躊躇」の正しい読み方はどれですか？',
      subPrompt: 'Select reading for 躊躇 (hesitation).',
      options: ['ちゅうちょ', 'ちゅうじょ', 'とうちょ', 'しょうちょ'],
      answer: 'ちゅうちょ',
      explanation: '躊躇 (chuucho) means hesitation or vacillation.',
      jlptLevel: 'N1'
    },
    {
      id: 5,
      section: 'Listening',
      japanesePrompt: '【聴解問題】音声を聞いて、研究者の主張の要点を捉えてください。',
      subPrompt: 'Listen to the audio: What is the core finding of the researcher?',
      audioText: '単なるデータの集積にとどまらず、文脈的文脈の差異を体系化して初めて、人工知能の言語理解は次の段階へと昇華するのです。',
      options: ['文脈的差異の体系化がAIの言語理解の発展に不可欠である', 'データの集積量のみを極大化するべきである', '人工知能に言語理解を求めるのは不可能である', '既存の理論を全て破棄して再設計すべきである'],
      answer: '文脈的差異の体系化がAIの言語理解の発展に不可欠である',
      explanation: 'The speaker emphasizes that categorizing and systematizing contextual differences is the prerequisite for elevating AI understanding.',
      jlptLevel: 'N1'
    },
    {
      id: 6,
      section: 'Reading',
      japanesePrompt: '【評論文読解】\n「古典の価値とは、過去の遺物としての保存にあるのではなく、時代を超えて現代の我々に投げかけられる根源的な問い直しの力にある。古人の思索を追体験することは、現代の常識という牢獄から精神を解き放つ営みに他ならない。」\n質問：筆者が考える「古典を読む意義」とは何か？',
      subPrompt: 'What is the significance of reading classics according to the author?',
      options: ['現代の常識に縛られた精神を解放し、根源的な問いを得ること', '過去の遺物を正確に保存して歴史的記録を残すこと', '現代の思想がいかに古典より優れているかを確認すること', '古語の文法規則を正確に習得すること'],
      answer: '現代の常識に縛られた精神を解放し、根源的な問いを得ること',
      explanation: 'The author states that re-experiencing the ancients\' contemplation liberates our minds from contemporary dogma and offers timeless inquiry.',
      jlptLevel: 'N1'
    }
  ]
};
