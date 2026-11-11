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
  });

  it("normalizes repeated words without losing apostrophes", () => {
    const result = analyzeText("Don't stop. don't stop.");
    expect(result.repeatedWords).toEqual([
      { word: "don't", count: 2 },
      { word: "stop", count: 2 },
    ]);
  });

  it("reports whitespace patterns", () => {
    const result = analyzeText("  one\ttwo  \n");
    expect(result.leadingWhitespace).toBe(true);
    expect(result.trailingWhitespace).toBe(true);
    expect(result.repeatedSpaces).toBe(true);
    expect(result.tabs).toBe(true);
    expect(result.lineBreaks).toBe(1);
  });

  it("estimates reading time at 200 words per minute", () => {
    const result = analyzeText(Array(201).fill("word").join(" "));
    expect(result.readingMinutes).toBe(2);
  });
});