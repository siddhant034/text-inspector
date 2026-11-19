import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { analyzeText } from "../lib/analyzeText";
import { InsightsPanel } from "./InsightsPanel";

describe("InsightsPanel", () => {
  it("renders the text analysis and repeated-word details", () => {
    render(<InsightsPanel analysis={analyzeText("Hello hello  world\t")} />);

    const panel = screen.getByLabelText("Text insights");
    expect(within(panel).getByText("3")).toBeInTheDocument();
    expect(within(panel).getByText("2")).toBeInTheDocument();
    expect(within(panel).getByText("hello")).toBeInTheDocument();
    expect(within(panel).getByText("× 2")).toBeInTheDocument();
    expect(within(panel).getByText("! Repeated spaces")).toBeInTheDocument();
    expect(within(panel).getByText("! Tabs")).toBeInTheDocument();
  });

  it("shows an empty state when there are no repeated words", () => {
    render(<InsightsPanel analysis={analyzeText("")} />);

    expect(screen.getByText("No repeated words found yet.")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("announces a concise summary of updated analysis", () => {
    render(<InsightsPanel analysis={analyzeText("One two three.")} />);

    expect(screen.getByText(
      "3 words, 14 characters, 1 estimated sentences, and 1 paragraphs.",
    )).toHaveAttribute("aria-live", "polite");
  });
});
