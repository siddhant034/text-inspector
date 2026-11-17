import { useEffect, useMemo, useState } from "react";
import { analyzeText } from "./lib/analyzeText";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { InsightsPanel } from "./components/InsightsPanel";
import { Intro } from "./components/Intro";
import { TextEditor } from "./components/TextEditor";

const sampleText = `Good writing is clear thinking made visible.

A sentence can be simple and still say something meaningful. The goal isn't to use more words; it's to make every word count.

Read it once. Then read it again.`;

function getInitialTheme(): "light" | "dark" {
  const saved = localStorage.getItem("text-inspector-theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function App() {
  const [text, setText] = useState(sampleText);
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  const analysis = useMemo(() => analyzeText(text), [text]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("text-inspector-theme", theme);
  }, [theme]);

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
      <Header
        theme={theme}
        onToggleTheme={() =>
          setTheme((current) => current === "light" ? "dark" : "light")
        }
      />
      <Intro />
      <section className="workspace" aria-label="Text analysis workspace">
        <TextEditor
          text={text}
          characterCount={analysis.characters}
          onTextChange={setText}
          onClear={() => setText("")}
          onCopy={copyText}
        />
        <InsightsPanel analysis={analysis} />
      </section>
      <Footer />
    </main>
  );
}

export default App;
