import { useEffect, useRef, useState } from "react";
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
  const [analysis, setAnalysis] = useState(() => analyzeText(text));
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);
  const latestTextRef = useRef(text);

  latestTextRef.current = text;

  useEffect(() => {
    if (typeof Worker === "undefined") return;

    let worker: Worker;
    try {
      worker = new Worker(new URL("./lib/analyzeText.worker.ts", import.meta.url), {
        type: "module",
      });
    } catch {
      return;
    }

    workerRef.current = worker;
    worker.onmessage = (event: MessageEvent<{
      requestId: number;
      analysis: ReturnType<typeof analyzeText>;
    }>) => {
      if (event.data.requestId === requestIdRef.current) {
        setAnalysis(event.data.analysis);
      }
    };
    worker.onerror = () => {
      worker.terminate();
      workerRef.current = null;
      setAnalysis(analyzeText(latestTextRef.current));
    };

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const worker = workerRef.current;
    if (!worker) {
      setAnalysis(analyzeText(text));
      return;
    }

    const requestId = ++requestIdRef.current;
    const timeoutId = window.setTimeout(() => {
      worker.postMessage({ requestId, text });
    }, 100);

    return () => window.clearTimeout(timeoutId);
  }, [text]);

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
