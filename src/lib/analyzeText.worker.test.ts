import { describe, expect, it } from "vitest";
import { analyzeTextRequest } from "./analyzeText.worker";

describe("analyzeTextRequest", () => {
  it("returns the request id with the full text analysis", () => {
    const result = analyzeTextRequest({
      requestId: 42,
      text: "One two two.",
    });

    expect(result.requestId).toBe(42);
    expect(result.analysis.words).toBe(3);
    expect(result.analysis.repeatedWords).toEqual([{ word: "two", count: 2 }]);
  });
});
