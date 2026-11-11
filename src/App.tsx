import { useMemo, useState } from "react";
import { analyzeText } from "./lib/analyzeText";

const sampleText = `Good writing is clear thinking made visible.

A sentence can be simple and still say something meaningful. The goal isn't to use more words; it's to make every word count.

Read it once. Then read it again.`;

function App() {
  const [text, setText] = useState(sampleText);
  const analysis = useMemo(() => analyzeText(text), [text]);

  async function copyText() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard access can be unavailable outside secure browser contexts.
    }
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="wordmark" href="/" aria-label="Text Inspector home">
          <span className="wordmark-icon">ti</span>
          <span>text inspector</span>
        </a>
        <span className="privacy-note"><span className="status-dot" /> Your text stays in this browser</span>
      </header>

      <section className="intro">
        <p className="eyebrow">A little clarity for your words</p>
        <h1>Make sense<br />of your <em>text.</em></h1>
        <p className="intro-copy">A quiet space to inspect what you’ve written.<br className="desktop-break" /> No uploads. No accounts. Just your words.</p>
      </section>

      <section className="workspace" aria-label="Text analysis workspace">
        <div className="editor-panel">
          <div className="panel-heading">
            <div>
              <span className="section-index">01 / INPUT</span>
              <h2>Your text</h2>
            </div>
            <div className="editor-actions">
              <button className="text-button" onClick={() => setText("")} disabled={!text}>Clear</button>
              <button className="copy-button" onClick={copyText} disabled={!text}>Copy text ↗</button>
            </div>
          </div>
          <label className="sr-only" htmlFor="text-input">Enter text to inspect</label>
          <textarea
            id="text-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste or start typing…"
            spellCheck="true"
          />
          <div className="editor-footer">
            <span>{analysis.characters.toLocaleString()} characters</span>
            <span>Updates as you type</span>
          </div>
        </div>

        <aside className="insights-panel" aria-label="Text insights">
          <div className="panel-heading insights-heading">
            <div>
              <span className="section-index">02 / INSIGHTS</span>
              <h2>The numbers</h2>
            </div>
            <span className="live-label">LIVE</span>
          </div>

          <div className="stat-grid">
            <div className="stat-card stat-featured">
              <span className="stat-label">Words</span>
              <strong>{analysis.words.toLocaleString()}</strong>
              <span className="stat-foot">Total word count</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Characters</span>
              <strong>{analysis.characters.toLocaleString()}</strong>
              <span className="stat-foot">Including spaces</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Sentences</span>
              <strong>{analysis.sentences.toLocaleString()}</strong>
              <span className="stat-foot">Estimated</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Paragraphs</span>
              <strong>{analysis.paragraphs.toLocaleString()}</strong>
              <span className="stat-foot">Text blocks</span>
            </div>
          </div>

          <div className="reading-row">
            <span>Estimated reading time</span>
            <strong>{analysis.readingMinutes === 0 ? "—" : `${analysis.readingMinutes} min`}</strong>
          </div>

          <div className="detail-section">
            <span className="section-index">03 / TEXT DETAILS</span>
            <div className="detail-row"><span>Characters without spaces</span><strong>{analysis.charactersWithoutSpaces.toLocaleString()}</strong></div>
            <div className="detail-row"><span>Repeated words</span><strong>{analysis.repeatedWords.length}</strong></div>
          </div>

          <div className="detail-section repeated-section">
            <span className="section-index">04 / REPEATED WORDS</span>
            {analysis.repeatedWords.length ? (
              <ul className="word-list">
                {analysis.repeatedWords.map(({ word, count }) => (
                  <li key={word}><span>{word}</span><strong>× {count}</strong></li>
                ))}
              </ul>
            ) : <p className="empty-state">No repeated words found yet.</p>}
          </div>

          <div className="detail-section whitespace-section">
            <span className="section-index">05 / WHITESPACE CHECK</span>
            <div className="checks">
              <span className={analysis.leadingWhitespace ? "check warning" : "check"}>{analysis.leadingWhitespace ? "!" : "✓"} Leading space</span>
              <span className={analysis.trailingWhitespace ? "check warning" : "check"}>{analysis.trailingWhitespace ? "!" : "✓"} Trailing space</span>
              <span className={analysis.repeatedSpaces ? "check warning" : "check"}>{analysis.repeatedSpaces ? "!" : "✓"} Repeated spaces</span>
              <span className={analysis.tabs ? "check warning" : "check"}>{analysis.tabs ? "!" : "✓"} Tabs</span>
            </div>
          </div>
        </aside>
      </section>

      <footer className="footer">
        <span>TEXT INSPECTOR <span className="footer-divider">/</span> MADE FOR THE DETAILS</span>
        <span>Nothing is sent anywhere. Ever.</span>
      </footer>
    </main>
  );
}

export default App;