import type { ChangeEvent } from "react";

type TextEditorProps = {
  text: string;
  characterCount: number;
  onTextChange: (text: string) => void;
  onClear: () => void;
  onCopy: () => void;
};

export function TextEditor({
  text,
  characterCount,
  onTextChange,
  onClear,
  onCopy,
}: TextEditorProps) {
  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onTextChange(event.target.value);
  }

  return (
    <div className="editor-panel">
      <div className="panel-heading">
        <div>
          <span className="section-index">01 / INPUT</span>
          <h2>Your text</h2>
        </div>
        <div className="editor-actions">
          <button className="text-button" onClick={onClear} disabled={!text}>Clear</button>
          <button className="copy-button" onClick={onCopy} disabled={!text}>Copy text ↗</button>
        </div>
      </div>
      <label className="sr-only" htmlFor="text-input">Enter text to inspect</label>
      <textarea
        id="text-input"
        value={text}
        onChange={handleChange}
        placeholder="Paste or start typing…"
        spellCheck="true"
      />
      <div className="editor-footer">
        <span>{characterCount.toLocaleString()} characters</span>
        <span>Updates as you type</span>
      </div>
    </div>
  );
}
