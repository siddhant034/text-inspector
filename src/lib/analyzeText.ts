const WORD_PATTERN = /[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu;
const SENTENCE_PATTERN = /[^.!?]+[.!?]+(?:["'’”)]*)|[^.!?]+$/gu;

export interface TextAnalysis {
  characters: number;
  charactersWithoutSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingMinutes: number;
  repeatedWords: Array<{ word: string; count: number }>;
  leadingWhitespace: boolean;
  trailingWhitespace: boolean;
  repeatedSpaces: boolean;
  tabs: boolean;
  lineBreaks: number;
}

export function analyzeText(text: string): TextAnalysis {
  const words = text.match(WORD_PATTERN) ?? [];
  const sentences = text.trim().match(SENTENCE_PATTERN)?.filter((part) => part.trim()) ?? [];
  const paragraphs = text.trim()
    ? text.trim().split(/\n\s*\n+/).filter((part) => part.trim()).length
    : 0;

  const frequencies = new Map<string, number>();
  for (const word of words) {
    const normalized = word.toLocaleLowerCase();
    frequencies.set(normalized, (frequencies.get(normalized) ?? 0) + 1);
  }

  const repeatedWords = [...frequencies.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([word, count]) => ({ word, count }));

  return {
    characters: text.length,
    charactersWithoutSpaces: text.replace(/\s/g, "").length,
    words: words.length,
    sentences: sentences.length,
    paragraphs,
    readingMinutes: words.length === 0 ? 0 : Math.max(1, Math.ceil(words.length / 200)),
    repeatedWords,
    leadingWhitespace: text.length > 0 && /^\s/.test(text),
    trailingWhitespace: text.length > 0 && /\s$/.test(text),
    repeatedSpaces: / {2,}/.test(text),
    tabs: text.includes("\t"),
    lineBreaks: (text.match(/\n/g) ?? []).length,
  };
}