import type { analyzeText } from "../lib/analyzeText";

type Analysis = ReturnType<typeof analyzeText>;

type InsightsPanelProps = {
  analysis: Analysis;
};

export function InsightsPanel({ analysis }: InsightsPanelProps) {
  return (
    <aside className="insights-panel" aria-label="Text insights">
      <div className="panel-heading insights-heading">
        <div>
          <span className="section-index">02 / INSIGHTS</span>
          <h2>The numbers</h2>
        </div>
        <span className="live-label">LIVE</span>
      </div>
      <div className="stat-grid">
        <div className="stat-card stat-featured"><span className="stat-label">Words</span><strong>{analysis.words.toLocaleString()}</strong><span className="stat-foot">Total word count</span></div>
        <div className="stat-card"><span className="stat-label">Characters</span><strong>{analysis.characters.toLocaleString()}</strong><span className="stat-foot">Including spaces</span></div>
        <div className="stat-card"><span className="stat-label">Sentences</span><strong>{analysis.sentences.toLocaleString()}</strong><span className="stat-foot">Estimated</span></div>
        <div className="stat-card"><span className="stat-label">Paragraphs</span><strong>{analysis.paragraphs.toLocaleString()}</strong><span className="stat-foot">Text blocks</span></div>
      </div>
      <div className="reading-row"><span>Estimated reading time</span><strong>{analysis.readingMinutes === 0 ? "—" : `${analysis.readingMinutes} min`}</strong></div>
      <div className="detail-section">
        <span className="section-index">03 / TEXT DETAILS</span>
        <div className="detail-row"><span>Characters excluding whitespace</span><strong>{analysis.charactersWithoutWhitespace.toLocaleString()}</strong></div>
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
          <span className={analysis.leadingWhitespace ? "check warning" : "check"}>{analysis.leadingWhitespace ? "!" : "✓"} Leading whitespace</span>
          <span className={analysis.trailingWhitespace ? "check warning" : "check"}>{analysis.trailingWhitespace ? "!" : "✓"} Trailing whitespace</span>
          <span className={analysis.repeatedSpaces ? "check warning" : "check"}>{analysis.repeatedSpaces ? "!" : "✓"} Repeated spaces</span>
          <span className={analysis.tabs ? "check warning" : "check"}>{analysis.tabs ? "!" : "✓"} Tabs</span>
        </div>
      </div>
    </aside>
  );
}
