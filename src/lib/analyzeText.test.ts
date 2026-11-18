import { describe, expect, it } from "vitest";
import { analyzeText } from "./analyzeText";

describe("analyzeText", () => {
  it("counts words, characters, sentences and paragraphs", () => {
    const result = analyzeText("Hello world. Hello again!\n\nA new paragraph.");
    expect(result.words).toBe(7);
    expect(result.characters).toBe(43);
    expect(result.sentences).toBe(3);
    expect(result.paragraphs).toBe(2);
  });

  it("handles empty text", () => {
    const result = analyzeText("");
    expect(result.words).toBe(0);
    expect(result.readingMinutes).toBe(0);
    expect(result.paragraphs).toBe(0);
    expect(result.repeatedWords).toEqual([]);
    expect(result.characters).toBe(0);
    expect(result.charactersWithoutSpaces).toBe(0);
  });

  it("counts user-perceived characters rather than UTF-16 code units", () => {
    const result = analyzeText("A👋e\u0301👨‍👩‍👧‍👦");
    expect(result.characters).toBe(4);
    expect(result.charactersWithoutSpaces).toBe(4);
  });

  it("counts words containing Unicode combining marks and non-Latin letters", () => {
    const result = analyzeText("cafe\u0301 नमस्ते दुनिया");
    expect(result.words).toBe(3);
  });

  it("normalizes Unicode composition, case and apostrophes in repeated words", () => {
    const result = analyzeText("Café don't stop. cafe\u0301 DON'T stop.");
    expect(result.repeatedWords).toEqual([
      { word: "café", count: 2 },
      { word: "don't", count: 2 },
      { word: "stop", count: 2 },
    ]);
  });

  it("normalizes repeated words without losing apostrophes", () => {
    const result = analyzeText("Don't stop. don't stop.");
    expect(result.repeatedWords).toEqual([
      { word: "don't", count: 2 },
      { word: "stop", count: 2 },
    ]);
  });

  it("reports leading and trailing whitespace, repeated spaces, tabs and line breaks", () => {
    const result = analyzeText("  one\ttwo  \n");
    expect(result.leadingWhitespace).toBe(true);
    expect(result.trailingWhitespace).toBe(true);
    expect(result.repeatedSpaces).toBe(true);
    expect(result.tabs).toBe(true);
    expect(result.lineBreaks).toBe(1);
  });

  it("excludes all whitespace from the whitespace-free character count", () => {
    const result = analyzeText("a b\tc\n\u00a0d");
    expect(result.characters).toBe(8);
    expect(result.charactersWithoutSpaces).toBe(4);
  });

  it("estimates one sentence when text has no terminal punctuation", () => {
    expect(analyzeText("A sentence without punctuation").sentences).toBe(1);
  });

  it("estimates reading time at 200 words per minute", () => {
    const result = analyzeText(Array(201).fill("word").join(" "));
    expect(result.readingMinutes).toBe(2);
  });
});
