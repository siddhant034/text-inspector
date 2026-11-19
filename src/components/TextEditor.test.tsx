import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TextEditor } from "./TextEditor";

describe("TextEditor", () => {
  it("renders the current text and character count", () => {
    render(
      <TextEditor
        text="Hello"
        characterCount={5}
        onTextChange={vi.fn()}
        onClear={vi.fn()}
        onCopy={vi.fn()}
      />,
    );

    expect(screen.getByRole("textbox", { name: "Enter text to inspect" })).toHaveValue("Hello");
    expect(screen.getByText("5 characters")).toBeInTheDocument();
  });

  it("forwards edits to the parent", async () => {
    const user = userEvent.setup();
    const onTextChange = vi.fn();

    render(
      <TextEditor
        text=""
        characterCount={0}
        onTextChange={onTextChange}
        onClear={vi.fn()}
        onCopy={vi.fn()}
      />,
    );

    await user.type(screen.getByRole("textbox"), "A short note");

    expect(onTextChange).toHaveBeenLastCalledWith("e");
    expect(onTextChange).toHaveBeenCalledTimes(12);
  });

  it("invokes clear and copy callbacks and disables both actions for empty text", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    const onCopy = vi.fn();

    const { rerender } = render(
      <TextEditor
        text="Some text"
        characterCount={9}
        onTextChange={vi.fn()}
        onClear={onClear}
        onCopy={onCopy}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Clear" }));
    await user.click(screen.getByRole("button", { name: "Copy text ↗" }));

    expect(onClear).toHaveBeenCalledOnce();
    expect(onCopy).toHaveBeenCalledOnce();

    rerender(
      <TextEditor
        text=""
        characterCount={0}
        onTextChange={vi.fn()}
        onClear={onClear}
        onCopy={onCopy}
      />,
    );

    expect(screen.getByRole("button", { name: "Clear" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Copy text ↗" })).toBeDisabled();
  });
});
