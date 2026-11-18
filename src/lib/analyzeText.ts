const WORD_PATTERN = /[\p{L}\p{N}][\p{L}\p{M}\p{N}]*(?:['’][\p{L}\p{M}\p{N}]+)*/gu;
const SENTENCE_PATTERN = /[^.!?]+[.!?]+(?:["'’”)]*)|[^.!?]+$/gu;

const graphemeSegmenter = new Intl.Segmenter(undefined, {
  granularity: "grapheme",
});

function countCharacters(value: string): number {
  return Array.from(graphemeSegmenter.segment(value)).length;
}

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
  const trimmedText = text.trim();
  const sentences = trimmedText.match(SENTENCE_PATTERN)?.filter((part) => part.trim()) ?? [];
  const paragraphs = trimmedText
    ? trimmedText.split(/\n\s*\n+/).filter((part) => part.trim()).length
    : 0;

  const frequencies = new Map<string, number>();
  for (const word of words) {
    const normalized = word.normalize("NFC").toLowerCase();
    frequencies.set(normalized, (frequencies.get(normalized) ?? 0) + 1);
  }

  const repeatedWords = [...frequencies.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    .slice(0, 8)
    .map(([word, count]) => ({ word, count }));

  return {
    characters: countCharacters(text),
    charactersWithoutSpaces: countCharacters(text.replace(/\s/gu, "")),
    words: words.length,
    sentences: sentences.length,
    paragraphs,
    readingMinutes: words.length === 0 ? 0 : Math.max(1, Math.ceil(words.length / 200)),
    repeatedWords,
    leadingWhitespace: text.length > 0 && /^\s/u.test(text),
    trailingWhitespace: text.length > 0 && /\s$/u.test(text),
    repeatedSpaces: / {2,}/u.test(text),
    tabs: text.includes("\t"),
    lineBreaks: (text.match(/\n/gu) ?? []).length,
  };
}
