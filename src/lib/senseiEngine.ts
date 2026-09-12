/**
 * Sensei Linguistic Engine
 * An intelligent, built-in Japanese language processing engine that understands
 * Japanese grammar queries, translates common phrases, classifies mistakes,
 * and generates realistic conversational responses without requiring an external API key.
 */

export interface SenseiResponse {
  text: string;
  correction?: {
    incorrect: string;
    correct: string;
    explanation: string;
  };
  suggestions?: string[];
  japaneseAudio?: string;
}

// Common grammar explanations
const GRAMMAR_KNOWLEDGE: Record<string, SenseiResponse> = {
  'wa_vs_ga': {
    text: `### は (wa) vs が (ga) — The Ultimate Guide 💡

• **は (wa)** is the **Topic Marker**: It sets the stage for "as for [X]...". It often contrasts things or refers to already known information.
  *Example:* 私は学生です。(Watashi wa gakusei desu.) — "As for me, I am a student."

• **が (ga)** is the **Subject Marker**: It marks the actor of an action or introduces *new information*, or answers "who/which one?".
  *Example:* 猫がいます。(Neko ga imasu.) — "There is a cat." (Focus is on the cat!)

**Quick Rule of Thumb:**
- Use **は** when emphasizing what comes *after* it.
- Use **が** when emphasizing the word *before* it.`,
    suggestions: ['How to use に vs で?', 'Explain て-form', 'Give me an N5 practice sentence']
  },
  'ni_vs_de': {
    text: `### に (ni) vs で (de) — Place Particles 📍

• **で (de)** marks the location where an **ACTION takes place**:
  *Example:* カフェ**で**本を読みます。(Kafe **de** hon wo yomimasu.) — "I read a book **at** the cafe."

• **に (ni)** marks the location of **EXISTENCE (いる / ある)** or a **DESTINATION/DIRECTION**:
  *Example 1:* 東京**に**行きます。(Toukyou **ni** ikimasu.) — "I will go **to** Tokyo."
  *Example 2:* 部屋**に**猫がいます。(Heya **ni** neko ga imasu.) — "There is a cat **in** the room."

**Quick Rule:**
- Action happening there? ➔ **で**
- Moving toward or existing there? ➔ **に**`,
    suggestions: ['Explain は vs が', 'How to use を (wo/o)?', 'How to use て-form?']
  },
  'te_form': {
    text: `### て-Form (Te-form) — The Connecting Verb Form 🔗

The **て-form** is one of the most versatile forms in Japanese! It's used for:
1. Connecting multiple actions: 朝起きて、ご飯を食べる。(Wake up **and** eat.)
2. Polite requests: 食べてください (Please eat).
3. Ongoing actions: 勉強しています (I am studying).

**Conjugation Rules for Group 1 (Godan) Verbs:**
- う、つ、る ➔ **って** (買う ➔ 買って)
- む、ぶ、ぬ ➔ **んで** (飲む ➔ 飲んで)
- く ➔ **いて** (書く ➔ 書いて) *[Exception: 行く ➔ 行って]*
- ぐ ➔ **いで** (泳ぐ ➔ 泳いで)
- す ➔ **して** (話す ➔ 話して)

**Group 2 (Ichidan):** Drop る and add て (食べる ➔ 食べて, 見る ➔ 見て)
**Group 3 (Irregular):** する ➔ して, 来る ➔ きて`,
    suggestions: ['How to use てください?', 'How to say past tense in Japanese?', 'Explain は vs が']
  },
  'i_vs_na_adjectives': {
    text: `### い-Adjectives vs な-Adjectives 🎨

Japanese has two types of adjectives with different conjugation rules:

**1. い-Adjectives (True Adjectives)** — End in ~い (e.g., おいしい, たかい, あつい):
- Present Affirmative: おいしいです (Delicious)
- Present Negative: おいしくないです (Not delicious — drop い + くない)
- Past Affirmative: おいしかったです (Was delicious — drop い + かった)
- Past Negative: おいしくなかったです (Was not delicious)
*⚠️ Common Mistake: Never say "おいしいでした" (incorrect!)*

**2. な-Adjectives (Adjectival Nouns)** — Require な before a noun (e.g., 静か, きれい, 元気):
- Present Affirmative: 静かです (Quiet)
- Present Negative: 静かじゃないです / 静かではありません (Not quiet)
- Past Affirmative: 静かでした (Was quiet)
- Past Negative: 静かじゃなかったです
*⚠️ Note: きれい (beautiful/clean) and きらい (dislike) end in 'i' but are な-adjectives!*`,
    suggestions: ['Explain は vs が', 'How to use て-form?', 'Explain に vs で']
  }
};

// Common phrase translations
const COMMON_PHRASES: { pattern: RegExp; japanese: string; romaji: string; english: string; explanation: string }[] = [
  {
    pattern: /where is the (bathroom|restroom|toilet)/i,
    japanese: 'トイレはどこですか？',
    romaji: 'Toire wa doko desu ka?',
    english: 'Where is the restroom?',
    explanation: 'トイレ (toilet) + は (topic marker) + どこ (where) + ですか (polite question).'
  },
  {
    pattern: /where is the (train )?station/i,
    japanese: '駅はどこですか？',
    romaji: 'Eki wa doko desu ka?',
    english: 'Where is the station?',
    explanation: '駅 (eki = station) + は (topic) + どこですか (where is it?).'
  },
  {
    pattern: /how much (is this|does it cost)/i,
    japanese: 'これはいくらですか？',
    romaji: 'Kore wa ikura desu ka?',
    english: 'How much is this?',
    explanation: 'これ (this) + は + いくら (how much) + ですか.'
  },
  {
    pattern: /thank you( very much)?/i,
    japanese: 'ありがとうございます！',
    romaji: 'Arigatou gozaimasu!',
    english: 'Thank you very much!',
    explanation: 'Use ありがとうございます for polite everyday situations. For friends, just ありがとう (Arigatou) is fine!'
  },
  {
    pattern: /(i am )?sorry|(excuse me)/i,
    japanese: 'すみません。/ ごめんなさい。',
    romaji: 'Sumimasen. / Gomen nasai.',
    english: 'Excuse me / I am sorry.',
    explanation: 'すみません is versatile: use it to get a waiter\'s attention, apologize for a minor bump, or say thank you for a favor!'
  },
  {
    pattern: /delicious|tasty/i,
    japanese: 'おいしいです！ / うまい！',
    romaji: 'Oishii desu! / Umai!',
    english: 'It\'s delicious!',
    explanation: 'おいしい (oishii) is standard and polite. うまい (umai) is casual, often used by guys with friends.'
  },
  {
    pattern: /i don'?t understand|i don'?t know/i,
    japanese: 'わかりません。(Wakarimasen.)',
    romaji: 'Wakarimasen.',
    english: 'I don\'t understand / I don\'t know.',
    explanation: 'You can also say もう一度お願いします (Mou ichido onegai shimasu) — "Once more, please."'
  },
  {
    pattern: /nice to meet you/i,
    japanese: 'はじめまして。よろしくお願いします。',
    romaji: 'Hajimemashite. Yoroshiku onegai shimasu.',
    english: 'Nice to meet you. Please treat me well.',
    explanation: 'This is the standard self-introduction greeting in Japanese culture.'
  },
  {
    pattern: /can you speak english/i,
    japanese: '英語が話せますか？',
    romaji: 'Eigo ga hanasemasu ka?',
    english: 'Can you speak English?',
    explanation: '英語 (Eigo = English) + が + 話せますか (can you speak?).'
  },
  {
    pattern: /water please|check please/i,
    japanese: 'お水をお願いします。 / お会計をお願いします。',
    romaji: 'Omizu wo onegai shimasu. / Okaikei wo onegai shimasu.',
    english: 'Water please / Check please.',
    explanation: '〜をお願いします (~ wo onegai shimasu) is the polite way to ask for anything in a restaurant or store!'
  }
];

/**
 * Checks for common Japanese grammatical mistakes in user input
 */
function checkGrammarMistakes(input: string): SenseiResponse | null {
  const clean = input.trim();

  // 1. Past time marker (昨日, 先週, 去年) with non-past polite verb (〜ます)
  if (/(昨日|きのう|先週|去年)/.test(clean) && /(見ます|行きます|食べます|飲みます|勉強します|買います|します|来ます)/.test(clean)) {
    const wrongVerb = clean.match(/(見ます|行きます|食べます|飲みます|勉強します|買います|します|来ます)/)?.[0] || '見ます';
    const pastMap: Record<string, string> = {
      '見ます': '見ました',
      '行きます': '行きました',
      '食べます': '食べました',
      '飲みます': '飲みました',
      '勉強します': '勉強しました',
      '買います': '買いました',
      'します': 'しました',
      '来ます': '来ました'
    };
    const correctVerb = pastMap[wrongVerb] || wrongVerb.replace(/ます$/, 'ました');
    return {
      text: `Good try! Since your sentence refers to a past time (昨日 / 先週 etc.), the verb must be in the **past tense** (〜ました), not present (〜ます).`,
      correction: {
        incorrect: clean,
        correct: clean.replace(wrongVerb, correctVerb),
        explanation: `${wrongVerb} (present/future) ➔ ${correctVerb} (polite past tense).`
      },
      suggestions: ['Explain Japanese past tense', 'Give me another practice sentence', 'Explain は vs が'],
      japaneseAudio: clean.replace(wrongVerb, correctVerb)
    };
  }

  // 2. Future time marker (明日, 来週) with past verb (〜ました)
  if (/(明日|あした|来週|来年)/.test(clean) && /(見ました|行きました|食べました|飲みました|勉強しました|買いました)/.test(clean)) {
    const wrongVerb = clean.match(/(見ました|行きます|食べました|飲みました|勉強しました|買いました)/)?.[0] || '行きました';
    const presentVerb = wrongVerb.replace(/ました$/, 'ます');
    return {
      text: `Careful with timing! Since you mentioned a future time (明日 / 来週), use the **non-past tense** (〜ます).`,
      correction: {
        incorrect: clean,
        correct: clean.replace(wrongVerb, presentVerb),
        explanation: `${wrongVerb} (past tense) ➔ ${presentVerb} (present/future tense).`
      },
      suggestions: ['Explain Japanese verb tenses', 'Explain は vs が']
    };
  }

  // 3. i-adjective + でした mistake (e.g. おいしいでした, たかいでした)
  if (/(おいしいでした|たかいでした|あついでした|さむいでした|おもしろいでした)/.test(clean)) {
    const wrong = clean.match(/(おいしいでした|たかいでした|あついでした|さむいでした|おもしろいでした)/)?.[0] || 'おいしいでした';
    const base = wrong.replace(/でした$/, '');
    const correct = base.slice(0, -1) + 'かったです';
    return {
      text: `Notice an important rule for **い-adjectives**: They conjugate by dropping the final **い** and adding **〜かったです**. You should **never** put でした directly after an い-adjective!`,
      correction: {
        incorrect: wrong,
        correct: correct,
        explanation: `${base} ➔ drop い + かったです ➔ ${correct}.`
      },
      suggestions: ['Explain い vs な adjectives', 'Give me another adjective test']
    };
  }

  // 4. na-adjective with かった (e.g. きれいかった, 静かかった)
  if (/(きれいかった|静かかった|元気かった|好きかった)/.test(clean)) {
    const wrong = clean.match(/(きれいかった|静かかった|元気かった|好きかった)/)?.[0] || 'きれいかった';
    const base = wrong.replace(/かった$/, '');
    const correct = base + 'でした';
    return {
      text: `Careful! Words like きれい, 静か, 元気, and 好き are **な-adjectives (adjectival nouns)**. Their past tense is made with **でした**, not かった!`,
      correction: {
        incorrect: wrong,
        correct: correct,
        explanation: `${wrong} ➔ ${correct}. な-adjectives use でした for past tense.`
      },
      suggestions: ['Explain い vs な adjectives']
    };
  }

  // 5. Particle error: 友達を見る (instead of 友達に会う - meet a friend)
  if (/友達.*(を会|を見)/.test(clean)) {
    return {
      text: `In Japanese, the verb **会う (au - to meet)** pairs with the particle **に (ni)**, not を (wo).`,
      correction: {
        incorrect: '友達を会います',
        correct: '友達に会います',
        explanation: '〜に会う (ni au) is a fixed pattern: "to meet with [person]".'
      },
      suggestions: ['Explain に vs で', 'Explain は vs が']
    };
  }

  // 6. Missing copula (e.g. 私は学生 or 私はアメリカ人 without です)
  if (/^(私|僕|おれ)は[^\s、。]+$/.test(clean) && !/(です|だ|じゃない|でした)$/.test(clean)) {
    return {
      text: `Almost complete! In polite Japanese, when equating A and B (A is B), remember to end with the copula **です (desu)**.`,
      correction: {
        incorrect: clean,
        correct: `${clean}です。`,
        explanation: 'Add です (desu) at the end to make it a proper, polite sentence.'
      },
      suggestions: ['How to introduce myself in Japanese?', 'Explain は vs が']
    };
  }

  return null;
}

/**
 * Main query processor of the built-in Sensei Engine
 */
export function querySenseiEngine(userInput: string): SenseiResponse {
  const q = userInput.trim().toLowerCase();

  // 1. First check if user submitted a sentence with a detectable grammar mistake
  const mistakeCorrection = checkGrammarMistakes(userInput);
  if (mistakeCorrection) {
    return mistakeCorrection;
  }

  // 2. Greetings & Casual Small Talk
  if (/^(hi|hello|hey|yo|greetings|howdy|sup)\b/i.test(q)) {
    return {
      text: `こんにちは！(Konnichiwa!) Great to see you! 😊\n\nI am your AI Japanese Sensei. How can I help you today? You can:\n• Ask any grammar question (e.g., *"Explain は vs が"*)\n• Send a Japanese sentence for me to check & correct\n• Ask how to say any phrase in Japanese\n• Request an N5/N4 practice exercise!`,
      suggestions: ['Explain は vs が', 'How to say "Where is the station?"', 'Check: 私は昨日映画を見ました', 'Give me an N5 challenge']
    };
  }

  if (/^(how are you|how're you|how are you doing|how is it going)/i.test(q)) {
    return {
      text: `元気ですよ、ありがとうございます！(Genki desu yo, arigatou gozaimasu! — "I'm doing great, thank you!")\n\nHow is your Japanese learning journey going today? Ready to practice some vocabulary, grammar, or sentence making?`,
      suggestions: ['Explain て-form', 'How to say "Thank you very much"?', 'Give me an N5 practice sentence'],
      japaneseAudio: '元気ですよ、ありがとうございます！'
    };
  }

  if (/^(who are you|what are you|what can you do)/i.test(q)) {
    return {
      text: `I am **Sensei (先生)**, your AI Japanese Language Tutor! 🌸\n\nHere is what I can do for you:\n1. **Sentence Corrections:** Send me your Japanese sentences, and I will highlight errors, explain grammar rules, and suggest natural expressions.\n2. **Grammar Explanations:** Ask me about particles (は, が, に, で), verb conjugations, and JLPT grammar points.\n3. **Translations & Phrasing:** Ask "How do I say [X] in Japanese?" with romaji, kanji, and polite forms.\n4. **Audio Pronunciation:** Tap the speaker icon on my responses to hear native-like Japanese audio!`,
      suggestions: ['Explain は vs が', 'Check my Japanese sentence', 'How to say "Delicious" in Japanese?']
    };
  }

  // 3. Japanese Greetings
  if (/(こんにちは|おはよう|こんばんは|はじめまして|元気|よろしく)/.test(userInput)) {
    if (/おはよう/.test(userInput)) {
      return {
        text: `おはようございます！(Ohayou gozaimasu!) ☀️\n\nGood morning! "おはようございます" is the polite morning greeting. With close friends or family, you can simply say "おはよう" (Ohayou). What would you like to study this morning?`,
        suggestions: ['Explain は vs が', 'How to use て-form?', 'Give me an N5 challenge'],
        japaneseAudio: 'おはようございます！'
      };
    }
    if (/こんばんは/.test(userInput)) {
      return {
        text: `こんばんは！(Konbanwa!) 🌙\n\nGood evening! Fun fact: Notice that こんばんは ends with the character は, pronounced "wa", because it originally came from the topic marker phrase "今晩は..." (As for this evening...)!`,
        suggestions: ['Explain は vs が', 'How to say "See you tomorrow"?'],
        japaneseAudio: 'こんばんは！'
      };
    }
    if (/はじめまして/.test(userInput)) {
      return {
        text: `はじめまして！よろしくお願いします！(Hajimemashite! Yoroshiku onegai shimasu!) 🎌\n\nNice to meet you! When meeting someone for the first time, you can introduce yourself like this:\n**「はじめまして、[Your Name]です。よろしくお願いします。」**\nTry introducing yourself to me!`,
        suggestions: ['はじめまして、スジャルです。', 'Explain は vs が'],
        japaneseAudio: 'はじめまして！よろしくお願いします！'
      };
    }
    return {
      text: `こんにちは！(Konnichiwa!) 🌸\n\nIt's wonderful to practice Japanese with you! Did you know that こんにちは literally means "As for today..."? That's why it is written with は instead of わ!\n\nWhat would you like to explore today?`,
      suggestions: ['Explain は vs が', 'Explain に vs で', 'Give me an N5 practice sentence'],
      japaneseAudio: 'こんにちは！'
    };
  }

  if (/(ありがとう|どうも)/.test(userInput)) {
    return {
      text: `どういたしまして！(Dou itashimashite! — "You're very welcome!") 😊\n\nWhenever you want to practice more or ask about any sentence, I'm right here!`,
      suggestions: ['Explain は vs が', 'How to use て-form?'],
      japaneseAudio: 'どういたしまして！'
    };
  }

  // 4. Specific Grammar Explanations
  if (/(wa\s*(vs|and|\/)\s*ga|ha\s*(vs|and|\/)\s*ga|は.*が|particle.*(wa|ga))/i.test(q)) {
    return GRAMMAR_KNOWLEDGE['wa_vs_ga'];
  }

  if (/(ni\s*(vs|and|\/)\s*de|に.*で|particle.*(ni|de))/i.test(q)) {
    return GRAMMAR_KNOWLEDGE['ni_vs_de'];
  }

  if (/(te[- ]form|て[- ]形|てform|how to use te|te\s*form)/i.test(q)) {
    return GRAMMAR_KNOWLEDGE['te_form'];
  }

  if (/(i[- ]adjective|na[- ]adjective|adjective.*conjugat)/i.test(q)) {
    return GRAMMAR_KNOWLEDGE['i_vs_na_adjectives'];
  }

  // 5. Common Phrases & Translations ("how to say...", "how do i say...")
  for (const phrase of COMMON_PHRASES) {
    if (phrase.pattern.test(q)) {
      return {
        text: `### Japanese Translation 🗣️

**Japanese:** ${phrase.japanese}
**Romaji:** *${phrase.romaji}*
**English:** "${phrase.english}"

💡 **Explanation:** ${phrase.explanation}`,
        suggestions: ['How to say "Thank you"?', 'How to say "Where is the bathroom"?', 'Explain は vs が'],
        japaneseAudio: phrase.japanese
      };
    }
  }

  // 6. Generic "How to say" / "Translate"
  if (/how (do you|to|can i) say\s+['"]?([^'"]+)['"]?\s+in japanese/i.test(q) || /translate\s+['"]?([^'"]+)['"]?\s+to japanese/i.test(q)) {
    const match = q.match(/how (?:do you|to|can i) say\s+['"]?([^'"]+?)['"]?\s+in japanese/i) || q.match(/translate\s+['"]?([^'"]+?)['"]?\s+to japanese/i);
    const targetWord = match?.[1]?.trim() || '';

    return {
      text: `To say **"${targetWord}"** in Japanese:\n\nIf you want the most accurate contextual translation or sentence examples for "${targetWord}", try typing the context! For example: *"How to say ${targetWord} in a restaurant?"* or connect a free Gemini / Groq API key in **AI Settings** for unlimited real-time AI translations!`,
      suggestions: ['Explain は vs が', 'How to say "Thank you very much"?', 'Give me an N5 practice sentence']
    };
  }

  // 7. Practice challenge request
  if (/challenge|quiz|practice sentence|give me.*sentence/i.test(q)) {
    return {
      text: `### 🎯 Sensei's Japanese Challenge!

Try translating this English sentence into Japanese:
**"I eat breakfast at 7 o'clock every morning."**

*Vocabulary clues:*
• Every morning: 毎朝 (maiasa)
• 7 o'clock: 7時 (shichi-ji)
• Breakfast: 朝ご飯 (asagohan)
• To eat: 食べます (tabemasu)

Type your translation here and I'll check it for you! 😊`,
      suggestions: ['毎朝7時に朝ご飯を食べます。', 'Explain は vs が', 'Give me another challenge']
    };
  }

  // 8. If the user wrote Japanese text that didn't trigger any errors
  if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(userInput)) {
    return {
      text: `素晴らしい！(Subarashii! — "Wonderful!") 🌟\n\nYour Japanese sentence: **「${userInput}」** looks well-structured and natural!\n\nKeep practicing! Would you like me to give you a similar sentence to try, or do you have any questions about the vocabulary used?`,
      suggestions: ['Give me an N5 challenge', 'Explain は vs が', 'How to use て-form?'],
      japaneseAudio: userInput
    };
  }

  // 9. Default helpful conversational response
  return {
    text: `こんにちは！I heard: *"${userInput}"*\n\nAs your Japanese Tutor, I'm here to help you master Japanese from zero to N1! You can ask me:\n• *"Explain は vs が"* or other particle rules\n• *"How do I say [phrase] in Japanese?"*\n• Type any Japanese sentence and I will analyze and correct it\n\n💡 *Tip: You can also connect your free Google Gemini or Groq API key in the AI Settings header for full, unrestricted AI conversation!*`,
    suggestions: ['Explain は vs が', 'How to use に vs で?', 'How to say "Where is the station?"', 'Give me an N5 challenge']
  };
}
