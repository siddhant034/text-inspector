import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("updates the analysis when the user edits the text", async () => {
    const user = userEvent.setup();
    render(<App />);

    const editor = screen.getByRole("textbox", { name: "Enter text to inspect" });
    await user.clear(editor);
    await user.type(editor, "One two two.");

    const insights = within(screen.getByLabelText("Text insights"));
    expect(insights.getByText("3", { selector: "strong" })).toBeInTheDocument();
    expect(insights.getByText("two")).toBeInTheDocument();
  });

  it("toggles the theme and persists the selected preference", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Switch to dark mode" }));

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(localStorage.getItem("text-inspector-theme")).toBe("dark");
    expect(screen.getByRole("button", { name: "Switch to light mode" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("restores a previously saved theme", () => {
    localStorage.setItem("text-inspector-theme", "dark");

    render(<App />);

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(screen.getByRole("button", { name: "Switch to light mode" })).toBeInTheDocument();
  });
});
